export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
}