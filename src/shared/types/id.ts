export type ID = string | number;

export interface Entity extends Record<string, unknown> {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

