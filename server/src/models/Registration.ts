import mongoose, { Document, Schema, Types } from 'mongoose';

export type AcademicYear = '1st' | '2nd' | '3rd' | '4th';

export interface IRegistration extends Document {
  _id: Types.ObjectId;
  event: Types.ObjectId;
  name: string;
  email: string;
  collegeName: string;
  year: AcademicYear;
  phone: string;
  ticketId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    collegeName: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      default: 'ABES Engineering College',
      maxlength: [150, 'College name cannot exceed 150 characters'],
    },
    year: {
      type: String,
      required: [true, 'Academic year is required'],
      enum: {
        values: ['1st', '2nd', '3rd', '4th'],
        message: 'Year must be 1st, 2nd, 3rd, or 4th',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
    },
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: prevents duplicate registration for the same email on the same event
RegistrationSchema.index({ event: 1, email: 1 }, { unique: true });

// Auto-generate ticketId pre-save if not present
RegistrationSchema.pre('validate', function (next) {
  if (!this.ticketId) {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.ticketId = `ABES-${new Date().getFullYear()}-${randomHex}`;
  }
  next();
});

export const Registration = mongoose.model<IRegistration>('Registration', RegistrationSchema);
