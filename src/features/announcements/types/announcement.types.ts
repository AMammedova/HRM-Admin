import { Entity } from '@/shared/types/id';

export interface Announcement extends Entity {
  title: string;
  date: string;
  endDate: string;
  content: string;
}

export interface CreateAnnouncementDto {
  title: string;
  date: string;
  endDate: string;
  content: string;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {}


