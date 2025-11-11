import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestDocument = Test & Document;

@Schema({ timestamps: true })
export class Test {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ['concentration', 'reaction', 'visual', 'memory', 'field-independence'],
    required: true,
  })
  testType: string;

  @Prop({ type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' })
  difficulty: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  passingScore: number;

  @Prop({ required: true })
  totalMarks: number;

  @Prop([{
    questionId: { type: Types.ObjectId, auto: true },
    questionText: String,
    questionType: String,
    options: [{
      optionText: String,
      isCorrect: Boolean,
    }],
    marks: Number,
  }])
  questions: Array<any>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const TestSchema = SchemaFactory.createForClass(Test);
TestSchema.index({ testType: 1 });
