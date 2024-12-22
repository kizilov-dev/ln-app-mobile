import { DifficultyLevel } from './DifficultyLevel';
import { LanguageCode } from '../constants/languages';

export interface TopicDto {
  id: string;
  title: string;
  description: string;
  difficulty_level: DifficultyLevel;
  is_active: string;
  language: LanguageCode;
  created_at: string;
  min_duration: number;
  min_words: number;
}