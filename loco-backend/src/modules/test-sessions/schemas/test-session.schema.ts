import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestSessionDocument = TestSession & Document;

@Schema({ timestamps: true })
export class TestSession {
  @Prop({ unique: true, required: true })
  sessionCode: string;

  @Prop({ type: Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Test', required: true })
  testId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['scheduled', 'in_progress', 'paused', 'completed', 'abandoned'],
    default: 'scheduled',
  })
  status: string;

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop([{
    questionId: { type: Types.ObjectId },
    selectedAnswer: { type: Object },
    isCorrect: Boolean,
    timeTaken: Number,
    score: Number,
  }])
  answers: Array<any>;

  @Prop({
    type: {
      totalQuestions: Number,
      attempted: Number,
      correct: Number,
      incorrect: Number,
      totalMarks: Number,
      obtainedMarks: Number,
      percentage: Number,
    },
    _id: false,
  })
  score: {
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
  };
}

export const TestSessionSchema = SchemaFactory.createForClass(TestSession);
TestSessionSchema.index({ candidateId: 1 });
TestSessionSchema.index({ testId: 1 });

TestSessionSchema.pre('save', async function (next) {
  if (!this.sessionCode) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sessionCode = `SES-${timestamp}-${random}`;
  }
  next();
});
