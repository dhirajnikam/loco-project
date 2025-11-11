import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate, CandidateDocument } from './schemas/candidate.schema';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<CandidateDocument>,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = new this.candidateModel(createCandidateDto);
    return candidate.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [candidates, total] = await Promise.all([
      this.candidateModel.find().populate('userId', '-password').skip(skip).limit(limit).exec(),
      this.candidateModel.countDocuments(),
    ]);
    return { candidates, total };
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(id).populate('userId', '-password').exec();
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async update(id: string, updateData: any): Promise<Candidate> {
    const candidate = await this.candidateModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', '-password')
      .exec();
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async remove(id: string): Promise<void> {
    const result = await this.candidateModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Candidate not found');
  }
}
