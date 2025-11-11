import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestDocument } from './schemas/test.schema';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<TestDocument>,
  ) {}

  async create(createTestDto: any, userId: string): Promise<Test> {
    const test = new this.testModel({ ...createTestDto, createdBy: userId });
    return test.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [tests, total] = await Promise.all([
      this.testModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
      this.testModel.countDocuments({ isActive: true }),
    ]);
    return { tests, total };
  }

  async findOne(id: string): Promise<Test> {
    const test = await this.testModel.findById(id).exec();
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async findByType(testType: string): Promise<Test[]> {
    return this.testModel.find({ testType, isActive: true, isPublished: true }).exec();
  }

  async update(id: string, updateData: any): Promise<Test> {
    const test = await this.testModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async remove(id: string): Promise<void> {
    await this.testModel.findByIdAndUpdate(id, { isActive: false }).exec();
  }
}
