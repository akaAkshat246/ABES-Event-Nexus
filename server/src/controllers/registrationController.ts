import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Registration } from '../models/Registration';
import { Event } from '../models/Event';
import { memoryStore, InMemoryRegistration } from '../store/memoryStore';

export const registerForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: eventId } = req.params;
    const { name, email, collegeName = 'ABES Engineering College', year, phone } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Mongoose Mode
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(eventId)) {
      const event = await Event.findById(eventId);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }

      const existing = await Registration.findOne({ event: eventId, email: normalizedEmail });
      if (existing) {
        res.status(409).json({
          success: false,
          message: 'This email is already registered for this event. Duplicate registrations are not allowed.',
          existingTicketId: existing.ticketId,
        });
        return;
      }

      if (event.capacity && event.capacity > 0) {
        const currentCount = await Registration.countDocuments({ event: eventId });
        if (currentCount >= event.capacity) {
          res.status(400).json({
            success: false,
            message: 'Sorry, this event has reached its maximum capacity limit.',
          });
          return;
        }
      }

      const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
      const ticketId = `ABES-${new Date().getFullYear()}-${randomHex}`;

      const reg = await Registration.create({
        event: event._id,
        name: name.trim(),
        email: normalizedEmail,
        collegeName: collegeName.trim() || 'ABES Engineering College',
        year,
        phone: phone.trim(),
        ticketId,
      });

      res.status(201).json({
        success: true,
        message: `Registration confirmed for ${event.name}!`,
        data: {
          registrationId: reg._id,
          ticketId: reg.ticketId,
          name: reg.name,
          email: reg.email,
          collegeName: reg.collegeName,
          year: reg.year,
          phone: reg.phone,
          eventName: event.name,
          eventDate: event.date,
          eventVenue: event.venue,
          eventClub: event.club,
          registeredAt: reg.createdAt,
        },
      });
      return;
    }

    // 2. Memory Store Mode
    const event = memoryStore.events.find((e) => e._id === eventId);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    const existingReg = memoryStore.registrations.find(
      (r) => r.event === eventId && r.email.toLowerCase() === normalizedEmail
    );
    if (existingReg) {
      res.status(409).json({
        success: false,
        message: 'This email is already registered for this event. Duplicate registrations are not allowed.',
        existingTicketId: existingReg.ticketId,
      });
      return;
    }

    if (event.capacity && event.capacity > 0) {
      const currentCount = memoryStore.registrations.filter((r) => r.event === eventId).length;
      if (currentCount >= event.capacity) {
        res.status(400).json({
          success: false,
          message: 'Sorry, this event has reached its maximum capacity limit.',
        });
        return;
      }
    }

    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticketId = `ABES-${new Date().getFullYear()}-${randomHex}`;
    const newRegId = `reg-${Date.now()}`;

    const newReg: InMemoryRegistration = {
      _id: newRegId,
      event: eventId,
      name: name.trim(),
      email: normalizedEmail,
      collegeName: collegeName.trim() || 'ABES Engineering College',
      year,
      phone: phone.trim(),
      ticketId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.registrations.unshift(newReg);

    res.status(201).json({
      success: true,
      message: `Registration confirmed for ${event.name}!`,
      data: {
        registrationId: newReg._id,
        ticketId: newReg.ticketId,
        name: newReg.name,
        email: newReg.email,
        collegeName: newReg.collegeName,
        year: newReg.year,
        phone: newReg.phone,
        eventName: event.name,
        eventDate: event.date,
        eventVenue: event.venue,
        eventClub: event.club,
        registeredAt: newReg.createdAt,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'This email is already registered for this event.',
      });
      return;
    }
    next(error);
  }
};

export const getRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, event: eventId, year, format, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // 1. Mongoose Mode
    if (mongoose.connection.readyState === 1) {
      const filter: any = {};
      if (eventId && eventId !== 'all' && mongoose.Types.ObjectId.isValid(eventId as string)) {
        filter.event = eventId;
      }
      if (year && year !== 'all') {
        filter.year = year;
      }
      if (q && typeof q === 'string' && q.trim().length > 0) {
        const searchRegex = new RegExp(q.trim(), 'i');
        filter.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { ticketId: searchRegex },
          { collegeName: searchRegex },
        ];
      }

      if (format === 'csv') {
        const allRegs = await Registration.find(filter)
          .populate('event', 'name category club date venue')
          .sort({ createdAt: -1 })
          .lean();

        const headers = ['Ticket ID', 'Full Name', 'Email', 'Phone', 'College', 'Year', 'Event Name', 'Club', 'Venue', 'Event Date', 'Registered At'];
        const csvRows = [headers.join(',')];

        for (const reg of allRegs) {
          const ev: any = reg.event || {};
          const row = [
            `"${reg.ticketId}"`,
            `"${(reg.name || '').replace(/"/g, '""')}"`,
            `"${(reg.email || '').replace(/"/g, '""')}"`,
            `"${reg.phone || ''}"`,
            `"${(reg.collegeName || '').replace(/"/g, '""')}"`,
            `"${reg.year || ''}"`,
            `"${(ev.name || 'N/A').replace(/"/g, '""')}"`,
            `"${(ev.club || 'N/A').replace(/"/g, '""')}"`,
            `"${(ev.venue || 'N/A').replace(/"/g, '""')}"`,
            `"${ev.date ? new Date(ev.date).toLocaleDateString() : 'N/A'}"`,
            `"${new Date(reg.createdAt).toLocaleString()}"`,
          ];
          csvRows.push(row.join(','));
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="abes_registrations_${Date.now()}.csv"`);
        res.status(200).send(csvRows.join('\n'));
        return;
      }

      const [registrations, total] = await Promise.all([
        Registration.find(filter)
          .populate('event', 'name category club date venue posterUrl')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Registration.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: registrations,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
      return;
    }

    // 2. Memory Store Mode
    let filtered = [...memoryStore.registrations];

    if (eventId && eventId !== 'all') {
      filtered = filtered.filter((r) => r.event === eventId);
    }
    if (year && year !== 'all') {
      filtered = filtered.filter((r) => r.year === year);
    }
    if (q && typeof q === 'string' && q.trim().length > 0) {
      const s = q.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s) ||
          r.phone.includes(s) ||
          r.ticketId.toLowerCase().includes(s) ||
          r.collegeName.toLowerCase().includes(s)
      );
    }

    // Populate event
    const populated = filtered.map((r) => {
      const ev = memoryStore.events.find((e) => e._id === r.event);
      return {
        ...r,
        event: ev || { name: 'Unknown Event', category: 'General', club: 'ABES Club' },
      };
    });

    if (format === 'csv') {
      const headers = ['Ticket ID', 'Full Name', 'Email', 'Phone', 'College', 'Year', 'Event Name', 'Club', 'Venue', 'Event Date', 'Registered At'];
      const csvRows = [headers.join(',')];

      for (const reg of populated) {
        const ev: any = reg.event || {};
        const row = [
          `"${reg.ticketId}"`,
          `"${(reg.name || '').replace(/"/g, '""')}"`,
          `"${(reg.email || '').replace(/"/g, '""')}"`,
          `"${reg.phone || ''}"`,
          `"${(reg.collegeName || '').replace(/"/g, '""')}"`,
          `"${reg.year || ''}"`,
          `"${(ev.name || 'N/A').replace(/"/g, '""')}"`,
          `"${(ev.club || 'N/A').replace(/"/g, '""')}"`,
          `"${(ev.venue || 'N/A').replace(/"/g, '""')}"`,
          `"${ev.date ? new Date(ev.date).toLocaleDateString() : 'N/A'}"`,
          `"${new Date(reg.createdAt).toLocaleString()}"`,
        ];
        csvRows.push(row.join(','));
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="abes_registrations_${Date.now()}.csv"`);
      res.status(200).send(csvRows.join('\n'));
      return;
    }

    const total = populated.length;
    const paginated = populated.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEventRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: eventId } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(eventId)) {
      const registrations = await Registration.find({ event: eventId }).sort({ createdAt: -1 }).lean();
      res.status(200).json({ success: true, data: registrations, count: registrations.length });
      return;
    }

    // Memory Store
    const registrations = memoryStore.registrations.filter((r) => r.event === eventId);
    res.status(200).json({ success: true, data: registrations, count: registrations.length });
  } catch (error) {
    next(error);
  }
};

export const deleteRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const reg = await Registration.findByIdAndDelete(id);
      if (!reg) {
        res.status(404).json({ success: false, message: 'Registration not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Registration deleted successfully' });
      return;
    }

    // Memory Store
    const idx = memoryStore.registrations.findIndex((r) => r._id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Registration not found' });
      return;
    }
    memoryStore.registrations.splice(idx, 1);
    res.status(200).json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // 1. Mongoose Mode
    if (mongoose.connection.readyState === 1) {
      const [
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        registrationsThisWeek,
        recentRegistrations,
        eventsWithCounts,
        categoryStats,
        yearStats,
      ] = await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ date: { $gte: now } }),
        Registration.countDocuments(),
        Registration.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
        Registration.find()
          .populate('event', 'name category club')
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        Event.find().select('name category club date capacity').sort({ date: 1 }).limit(8).lean(),
        Registration.aggregate([
          {
            $lookup: {
              from: 'events',
              localField: 'event',
              foreignField: '_id',
              as: 'eventData',
            },
          },
          { $unwind: '$eventData' },
          {
            $group: {
              _id: '$eventData.category',
              count: { $sum: 1 },
            },
          },
        ]),
        Registration.aggregate([
          {
            $group: {
              _id: '$year',
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

      const eventIds = eventsWithCounts.map((e) => e._id);
      const regAgg = await Registration.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
      ]);

      const countMap = new Map<string, number>();
      regAgg.forEach((r) => countMap.set(r._id.toString(), r.count));

      const topEvents = eventsWithCounts.map((e) => ({
        ...e,
        registeredCount: countMap.get(e._id.toString()) || 0,
      })).sort((a, b) => b.registeredCount - a.registeredCount);

      res.status(200).json({
        success: true,
        data: {
          totalEvents,
          upcomingEvents,
          totalRegistrations,
          registrationsThisWeek,
          recentRegistrations,
          topEvents,
          categoryStats,
          yearStats,
        },
      });
      return;
    }

    // 2. Memory Store Mode
    const totalEvents = memoryStore.events.length;
    const upcomingEvents = memoryStore.events.filter(
      (e) => new Date(e.date).getTime() >= now.getTime()
    ).length;
    const totalRegistrations = memoryStore.registrations.length;
    const registrationsThisWeek = memoryStore.registrations.filter(
      (r) => new Date(r.createdAt).getTime() >= oneWeekAgo.getTime()
    ).length;

    const recentRegistrations = memoryStore.registrations.slice(0, 6).map((r) => {
      const ev = memoryStore.events.find((e) => e._id === r.event);
      return {
        _id: r._id,
        name: r.name,
        email: r.email,
        year: r.year,
        ticketId: r.ticketId,
        createdAt: r.createdAt,
        event: ev ? { _id: ev._id, name: ev.name, category: ev.category, club: ev.club } : undefined,
      };
    });

    const topEvents = memoryStore.events
      .map((ev) => {
        const count = memoryStore.registrations.filter((r) => r.event === ev._id).length;
        return {
          _id: ev._id,
          name: ev.name,
          club: ev.club,
          category: ev.category,
          date: ev.date,
          capacity: ev.capacity || undefined,
          registeredCount: count,
        };
      })
      .sort((a, b) => b.registeredCount - a.registeredCount);

    // Category Stats
    const catMap = new Map<string, number>();
    memoryStore.registrations.forEach((r) => {
      const ev = memoryStore.events.find((e) => e._id === r.event);
      const cat = ev ? ev.category : 'Other';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    const categoryStats = Array.from(catMap.entries()).map(([_id, count]) => ({ _id, count }));

    // Year Stats
    const yearMap = new Map<string, number>();
    memoryStore.registrations.forEach((r) => {
      yearMap.set(r.year, (yearMap.get(r.year) || 0) + 1);
    });
    const yearStats = ['1st', '2nd', '3rd', '4th'].map((year) => ({
      _id: year,
      count: yearMap.get(year) || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        registrationsThisWeek,
        recentRegistrations,
        topEvents,
        categoryStats,
        yearStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
