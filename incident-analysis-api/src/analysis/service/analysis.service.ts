import { Injectable } from '@nestjs/common';
import { AnalysisResult } from '../dto/analysis-result.dto';
import { Sentiment } from '../types/sentiment.type';
import { Severity } from '../types/severity.type';
import {
  NEGATIVE_WORDS,
  POSITIVE_WORDS,
  CRITICAL_PHRASES,
  HIGH_WORDS,
  MEDIUM_PHRASES,
  LOW_WORDS,
  POSITIVE_PHRASES,
} from '../constants/analysis-keywords';
import {
  EQUIPMENT_ID_PATTERN,
  TIME_PATTERN,
} from '../constants/analysis-patterns';

@Injectable()
export class AnalysisService {
  performAnalysis(text: string): AnalysisResult {
    const lowerText = text.toLowerCase();

    // 1. Sentiment and Severity Analysis
    const sentiment = this.determineSentiment(lowerText);
    const severity = this.determineSeverity(lowerText);

    // 3. Entity extraction
    const entities = this.extractEntities(text, lowerText);

    return {
      summary: `Summary: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
      sentiment,
      severity,
      entities,
      timestamp: new Date().toISOString(),
    };
  }

  private isNegated(word: string, fullText: string): boolean {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match "no [word]" or "no [some other word] [word]"
    const regex = new RegExp(`\\bno\\s+(\\w+\\s+)?${escapedWord}`, 'i');
    return regex.test(fullText);
  }

  private determineSentiment(lowerText: string): Sentiment {
    const hasNegative = NEGATIVE_WORDS.some((word) => {
      const found = lowerText.includes(word);
      const negated = found && this.isNegated(word, lowerText);
      return found && !negated;
    });

    const hasPositive =
      POSITIVE_WORDS.some((word) => lowerText.includes(word)) ||
      POSITIVE_PHRASES.some((phrase) => lowerText.includes(phrase));

    if (hasNegative) return 'NEGATIVE';
    if (hasPositive) return 'POSITIVE';
    return 'NEUTRAL';
  }

  private determineSeverity(lowerText: string): Severity {
    const isCritical = CRITICAL_PHRASES.some(
      (phrase) => lowerText.includes(phrase) && !this.isNegated(phrase, lowerText),
    );
    if (isCritical) return 'CRITICAL';

    const isHigh = HIGH_WORDS.some(
      (word) => lowerText.includes(word) && !this.isNegated(word, lowerText),
    );
    if (isHigh) return 'HIGH';

    const isMedium = MEDIUM_PHRASES.some(
      (phrase) => lowerText.includes(phrase) && !this.isNegated(phrase, lowerText),
    );
    if (isMedium) return 'MEDIUM';

    const isLow = LOW_WORDS.some((word) => lowerText.includes(word));
    if (isLow) return 'LOW';

    return 'LOW';
  }

  private extractEntities(text: string, lowerText: string): string[] {
    const entitiesSet = new Set<string>();

    // Equipment IDs
    let match;
    const equipmentRegex = new RegExp(EQUIPMENT_ID_PATTERN);
    while ((match = equipmentRegex.exec(text)) !== null) {
      entitiesSet.add(match[0]);
    }

    // Times
    const timeRegex = new RegExp(TIME_PATTERN);
    while ((match = timeRegex.exec(text)) !== null) {
      entitiesSet.add(match[0]);
    }

    // Keywords - using switch-like pattern with boolean checks
    const entityMappings = [
      { key: 'emergency services', value: 'Emergency Services' },
      { key: 'production', value: 'Production Line' },
      { key: 'production line', value: 'Production Line' },
      { key: 'maintenance', value: 'Maintenance' },
      { key: 'operator', value: 'Operator' },
      { key: 'employee', value: 'Employee' },
      { key: 'employees', value: 'Employee' },
    ];

    for (const mapping of entityMappings) {
      if (lowerText.includes(mapping.key)) {
        entitiesSet.add(mapping.value);
      }
    }

    return Array.from(entitiesSet);
  }
}
