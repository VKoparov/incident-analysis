import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('performAnalysis', () => {
    it('should detect negative sentiment and high severity for injury', () => {
      const text = 'An employee sustained an injury at 09:00 AM near HP-12';
      const result = service.performAnalysis(text);

      expect(result.sentiment).toBe('NEGATIVE');
      expect(result.severity).toBe('HIGH');
      expect(result.entities).toContain('Employee');
      expect(result.entities).toContain('09:00 AM');
      expect(result.entities).toContain('HP-12');
    });

    it('should detect critical severity for chemical leak and evacuation', () => {
      const text =
        'Chemical leak detected! Evacuation in progress. Emergency services called.';
      const result = service.performAnalysis(text);

      expect(result.sentiment).toBe('NEGATIVE');
      expect(result.severity).toBe('CRITICAL');
      expect(result.entities).toContain('Emergency Services');
    });

    it('should detect positive sentiment when resolved', () => {
      const text =
        'The issue with the production line is now resolved and status is normal.';
      const result = service.performAnalysis(text);

      expect(result.sentiment).toBe('POSITIVE');
      expect(result.severity).toBe('LOW');
      expect(result.entities).toContain('Production Line');
    });

    it('should extract multiple equipment IDs and times', () => {
      const text =
        'Maintenance on AX-42 and CU-12 scheduled for 10:30 PM and 11:45 PM';
      const result = service.performAnalysis(text);

      expect(result.entities).toContain('AX-42');
      expect(result.entities).toContain('CU-12');
      expect(result.entities).toContain('10:30 PM');
      expect(result.entities).toContain('11:45 PM');
      expect(result.entities).toContain('Maintenance');
    });

    it('should return neutral and low for plain text', () => {
      const text = 'Just a regular day at the office.';
      const result = service.performAnalysis(text);

      expect(result.sentiment).toBe('NEUTRAL');
      expect(result.severity).toBe('LOW');
      expect(result.entities).toHaveLength(0);
    });

    describe('negated danger terms', () => {
      it('should handle "No hazards were found"', () => {
        const text = 'No hazards were found during the walk-through.';
        const result = service.performAnalysis(text);
        expect(result.sentiment).toBe('POSITIVE');
        expect(result.severity).toBe('LOW');
      });

      it('should handle "No injuries were reported"', () => {
        const text =
          'A minor equipment glitch occurred, but no injuries were reported.';
        const result = service.performAnalysis(text);
        expect(result.sentiment).toBe('POSITIVE');
        expect(result.severity).toBe('LOW');
      });

      it('should handle "No damage occurred"', () => {
        const text = 'The forklift bumped the rack, but no damage occurred.';
        const result = service.performAnalysis(text);
        expect(result.sentiment).toBe('POSITIVE');
        expect(result.severity).toBe('LOW');
      });

      it('should handle "No smoke was observed"', () => {
        const text = 'The alarm went off, but no smoke was observed.';
        const result = service.performAnalysis(text);
        expect(result.sentiment).toBe('POSITIVE');
        expect(result.severity).toBe('LOW');
      });

      it('should correctly analyze the specific user example', () => {
        const text =
          'Routine maintenance inspection completed successfully on AX-42. No hazards were found and production remained normal.';
        const result = service.performAnalysis(text);

        expect(result.sentiment).toBe('POSITIVE');
        expect(result.severity).toBe('LOW');
        expect(result.entities).toContain('AX-42');
        expect(result.entities).toContain('Production Line');
        expect(result.entities).toContain('Maintenance');
      });
    });
  });
});
