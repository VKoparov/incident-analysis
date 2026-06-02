import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Report, ReportStatus } from '../entity/report.entity';
import { NotFoundException } from '@nestjs/common';
import { AnalysisService } from '../../analysis/service/analysis.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let repo: any;
  let analysisService: AnalysisService;

  const mockReport = {
    id: 'uuid-1',
    text: 'Test incident',
    status: ReportStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockReport),
    save: jest.fn().mockResolvedValue(mockReport),
    find: jest.fn().mockResolvedValue([mockReport]),
    findOneBy: jest.fn().mockResolvedValue(mockReport),
  };

  const mockAnalysisService = {
    performAnalysis: jest.fn().mockReturnValue({
      summary: 'Summary',
      sentiment: 'NEUTRAL',
      severity: 'LOW',
      entities: [],
      timestamp: new Date().toISOString(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: mockRepository,
        },
        {
          provide: AnalysisService,
          useValue: mockAnalysisService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repo = module.get(getRepositoryToken(Report));
    analysisService = module.get<AnalysisService>(AnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a report', async () => {
      const dto = { text: 'Test incident' };
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith({
        text: dto.text,
        status: ReportStatus.PENDING,
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockReport);
    });
  });

  describe('findAll', () => {
    it('should return all reports', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockReport]);
    });
  });

  describe('findOne', () => {
    it('should return a report by ID', async () => {
      const result = await service.findOne('uuid-1');
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
      expect(result).toEqual(mockReport);
    });

    it('should throw NotFoundException if report not found', async () => {
      repo.findOneBy.mockResolvedValueOnce(null);
      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
