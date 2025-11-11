import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema({ timestamps: true })
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'TestSession', required: true, unique: true })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Test', required: true })
  testId: Types.ObjectId;

  @Prop({ type: String })
  testType: string;

  @Prop({
    type: {
      totalMarks: Number,
      obtainedMarks: Number,
      percentage: Number,
      grade: String,
      passed: Boolean,
    },
    _id: false,
  })
  score: {
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    grade: string;
    passed: boolean;
  };

  @Prop({ default: false })
  isVerified: boolean;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
ResultSchema.index({ candidateId: 1 });
ResultSchema.index({ testId: 1 });
