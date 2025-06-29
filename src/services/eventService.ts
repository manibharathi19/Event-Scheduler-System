import { Event, EventFormData } from '../types/event';

const API_BASE = 'http://localhost:3001/api';

class EventService {
  async getAllEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE}/events/${id}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  }

  async createEvent(eventData: EventFormData): Promise<Event> {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create event');
    }
    return response.json();
  }

  async updateEvent(id: string, eventData: EventFormData): Promise<Event> {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update event');
    }
    return response.json();
  }

  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  }

  async searchEvents(query: string): Promise<Event[]> {
    const response = await fetch(`${API_BASE}/events/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search events');
    return response.json();
  }

  async getReminders(): Promise<Event[]> {
    const response = await fetch(`${API_BASE}/events/reminders`);
    if (!response.ok) throw new Error('Failed to fetch reminders');
    return response.json();
  }
}

export default new EventService();