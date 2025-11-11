import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CandidateDocument = Candidate & Document;

@Schema({ timestamps: true })
export class Candidate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  applicationNumber: string;

  @Prop({
    type: {
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      nationality: String,
    },
    _id: false,
  })
  personalInfo: {
    dateOfBirth: Date;
    gender: string;
    nationality?: string;
  };

  @Prop({
    type: {
      primaryPhone: { type: String, required: true },
      secondaryPhone: String,
    },
    _id: false,
  })
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
  };

  @Prop({
    type: String,
    enum: ['pending', 'under_review', 'test_assigned', 'tested', 'selected', 'rejected'],
    default: 'pending',
  })
  applicationStatus: string;

  @Prop([{ type: Types.ObjectId, ref: 'Test' }])
  assignedTests: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Result' }])
  testResults: Types.ObjectId[];
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
CandidateSchema.index({ userId: 1 });
CandidateSchema.index({ applicationNumber: 1 });

CandidateSchema.pre('save', async function (next) {
  if (!this.applicationNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.applicationNumber = `LOCO-${timestamp}-${random}`;
  }
  next();
});
