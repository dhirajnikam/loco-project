import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService } from './candidates.service';
import { getModelToken } from '@nestjs/mongoose';
import { Candidate } from './schemas/candidate.schema';
import { NotFoundException } from '@nestjs/common';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let mockCandidateModel: any;

  const mockCandidate = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    applicationNumber: 'LOCO-TEST-001',
    personalInfo: {
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      nationality: 'Indian',
    },
    contactInfo: {
      primaryPhone: '1234567890',
    },
    applicationStatus: 'pending',
    assignedTests: [],
    testResults: [],
  };

  beforeEach(async () => {
    mockCandidateModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockCandidateModel.prototype = {
      save: jest.fn().mockResolvedValue(mockCandidate),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: getModelToken(Candidate.name),
          useValue: mockCandidateModel,
        },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated candidates', async () => {
      const candidates = [mockCandidate];
      const total = 1;

      mockCandidateModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(candidates),
            }),
          }),
        }),
      });

      mockCandidateModel.countDocuments.mockResolvedValue(total);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ candidates, total });
      expect(mockCandidateModel.find).toHaveBeenCalled();
      expect(mockCandidateModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a candidate by id', async () => {
      mockCandidateModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockCandidate),
        }),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockCandidate);
      expect(mockCandidateModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException if candidate not found', async () => {
      mockCandidateModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        'Candidate not found',
      );
    });
  });

  describe('update', () => {
    it('should update a candidate', async () => {
      const updateData = { applicationStatus: 'under_review' };
      const updatedCandidate = { ...mockCandidate, ...updateData };

      mockCandidateModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedCandidate),
        }),
      });

      const result = await service.update('507f1f77bcf86cd799439011', updateData);

      expect(result).toEqual(updatedCandidate);
      expect(mockCandidateModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true },
      );
    });

    it('should throw NotFoundException if candidate not found', async () => {
      mockCandidateModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.update('invalid-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a candidate', async () => {
      mockCandidateModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCandidate),
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockCandidateModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException if candidate not found', async () => {
      mockCandidateModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('invalid-id')).rejects.toThrow(
        'Candidate not found',
      );
    });
  });
});
