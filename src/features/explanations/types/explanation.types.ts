import { Entity } from '@/shared/types/id';

export interface Explanation extends Entity {
  positionCode: string;
  positionName: string;
  level: string;
  baseVacationDays: string;
  workCode: string;
  isMain: boolean;
  byActivity: boolean;
  functions: string;
  activityDays: string;
}

export interface CreateExplanationDto {
  positionCode: string;
  positionName: string;
  level: string;
  baseVacationDays: string;
  workCode: string;
  isMain: boolean;
  byActivity: boolean;
  functions: string;
  activityDays: string;
}

export interface UpdateExplanationDto extends Partial<CreateExplanationDto> {}


