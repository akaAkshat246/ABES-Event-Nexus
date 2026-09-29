import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Event, IEvent } from '../models/Event';
import { Registration } from '../models/Registration';
import { memoryStore, InMemoryEvent } from '../store/memoryStore';

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      q,
      category,
      featured,
      timeframe,
      club,
      page = 1,
      limit = 12,
      sortBy = 'date',
      sortOrder = 'asc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // 1. Mongoose / MongoDB Query Mode
    if (mongoose.connection.readyState === 1) {
      const filter: any = {};

      if (q && typeof q === 'string' && q.trim().length > 0) {
        const searchRegex = new RegExp(q.trim(), 'i');
        filter.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { club: searchRegex },
          { venue: searchRegex },
        ];
      }

      if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
        filter.category = new RegExp(`^${category.trim()}$`, 'i');
      }

      if (club && typeof club === 'string' && club.toLowerCase() !== 'all') {
        filter.club = new RegExp(`^${club.trim()}$`, 'i');
      }

      if (featured === 'true') {
        filter.featured = true;
      }

      const now = new Date();
      if (timeframe === 'upcoming') {
        filter.date = { $gte: now };
      } else if (timeframe === 'past') {
        filter.date = { $lt: now };
      }

      const sortDirection = sortOrder === 'desc' ? -1 : 1;
      const sortOptions: any = {};
      if (sortBy === 'createdAt') {
        sortOptions.createdAt = sortDirection;
      } else {
        sortOptions.date = sortDirection;
      }

      const [events, totalEvents] = await Promise.all([
        Event.find(filter).sort(sortOptions).skip(skip).limit(limitNum).lean(),
        Event.countDocuments(filter),
      ]);

      const eventIds = events.map((e) => e._id);
      const registrationCounts = await Registration.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
      ]);

      const countMap = new Map<string, number>();
      registrationCounts.forEach((item) => {
        countMap.set(item._id.toString(), item.count);
      });

      const enrichedEvents = events.map((event) => ({
        ...event,
        registeredCount: countMap.get(event._id.toString()) || 0,
        isSoldOut: event.capacity ? (countMap.get(event._id.toString()) || 0) >= event.capacity : false,
      }));

      res.status(200).json({
        success: true,
        data: enrichedEvents,
        pagination: {
          total: totalEvents,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalEvents / limitNum),
          hasMore: skip + events.length < totalEvents,
        },
      });
      return;
    }

    // 2. Memory Store Mode
    let filtered = [...memoryStore.events];

    if (q && typeof q === 'string' && q.trim().length > 0) {
      const s = q.trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(s) ||
          e.description.toLowerCase().includes(s) ||
          e.club.toLowerCase().includes(s) ||
          e.venue.toLowerCase().includes(s)
      );
    }

    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      filtered = filtered.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (club && typeof club === 'string' && club.toLowerCase() !== 'all') {
      filtered = filtered.filter((e) => e.club.toLowerCase() === club.toLowerCase());
    }

    if (featured === 'true') {
      filtered = filtered.filter((e) => e.featured);
    }

    const nowTime = new Date().getTime();
    if (timeframe === 'upcoming') {
      filtered = filtered.filter((e) => new Date(e.date).getTime() >= nowTime);
    } else if (timeframe === 'past') {
      filtered = filtered.filter((e) => new Date(e.date).getTime() < nowTime);
    }

    // Sort
    filtered.sort((a, b) => {
      const timeA = new Date(sortBy === 'createdAt' ? a.createdAt : a.date).getTime();
      const timeB = new Date(sortBy === 'createdAt' ? b.createdAt : b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    const totalEvents = filtered.length;
    const paginated = filtered.slice(skip, skip + limitNum);

    const enriched = paginated.map((event) => {
      const regCount = memoryStore.registrations.filter((r) => r.event === event._id).length;
      return {
        ...event,
        registeredCount: regCount,
        isSoldOut: event.capacity ? regCount >= event.capacity : false,
      };
    });

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: {
        total: totalEvents,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalEvents / limitNum),
        hasMore: skip + paginated.length < totalEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const event = await Event.findById(id).lean();
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }
      const registeredCount = await Registration.countDocuments({ event: event._id });
      res.status(200).json({
        success: true,
        data: {
          ...event,
          registeredCount,
          isSoldOut: event.capacity ? registeredCount >= event.capacity : false,
        },
      });
      return;
    }

    // Memory Store
    const event = memoryStore.events.find((e) => e._id === id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    const registeredCount = memoryStore.registrations.filter((r) => r.event === id).length;
    res.status(200).json({
      success: true,
      data: {
        ...event,
        registeredCount,
        isSoldOut: event.capacity ? registeredCount >= event.capacity : false,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newEvent = await Event.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: newEvent,
      });
      return;
    }

    // Memory Store
    const newId = `ev-${Date.now()}`;
    const newEvent: InMemoryEvent = {
      _id: newId,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.events.push(newEvent);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!updatedEvent) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent,
      });
      return;
    }

    // Memory Store
    const idx = memoryStore.events.findIndex((e) => e._id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    memoryStore.events[idx] = {
      ...memoryStore.events[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: memoryStore.events[idx],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const event = await Event.findByIdAndDelete(id);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }
      const deleteResult = await Registration.deleteMany({ event: id });
      res.status(200).json({
        success: true,
        message: `Event "${event.name}" and ${deleteResult.deletedCount} registration(s) deleted successfully`,
        deletedEventId: id,
      });
      return;
    }

    // Memory Store
    const idx = memoryStore.events.findIndex((e) => e._id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    const eventName = memoryStore.events[idx].name;
    memoryStore.events.splice(idx, 1);
    const beforeCount = memoryStore.registrations.length;
    memoryStore.registrations = memoryStore.registrations.filter((r) => r.event !== id);
    const deletedCount = beforeCount - memoryStore.registrations.length;

    res.status(200).json({
      success: true,
      message: `Event "${eventName}" and ${deletedCount} registration(s) deleted successfully`,
      deletedEventId: id,
    });
  } catch (error) {
    next(error);
  }
};
