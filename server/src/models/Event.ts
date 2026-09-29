import mongoose, { Document, Schema, Types } from 'mongoose';

export type EventCategory = 
  | 'Technical' 
  | 'Cultural' 
  | 'Sports' 
  | 'Workshop' 
  | 'Seminar' 
  | 'Hackathon' 
  | 'Other';

export interface IEvent extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  date: Date;
  venue: string;
  category: EventCategory;
  club: string;
  posterUrl?: string;
  capacity?: number;
  featured: boolean;
  registrationCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [150, 'Event name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date and time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      maxlength: [120, 'Venue cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Other'],
        message: '{VALUE} is not a valid event category',
      },
      default: 'Technical',
    },
    club: {
      type: String,
      required: [true, 'Organizing club name is required'],
      trim: true,
      maxlength: [100, 'Club name cannot exceed 100 characters'],
    },
    posterUrl: {
      type: String,
      trim: true,
      default: '',
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for registration count
EventSchema.virtual('registrations', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event',
  count: true,
});

// Indexes for fast searching and filtering
EventSchema.index({ name: 'text', description: 'text', club: 'text', venue: 'text' });
EventSchema.index({ category: 1, date: 1 });
EventSchema.index({ featured: 1, date: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
