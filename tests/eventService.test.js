import request from 'supertest';
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create test app
const app = express();
const TEST_DATA_FILE = path.join(__dirname, 'test-events.json');

// Middleware
app.use(cors());
app.use(express.json());

// Utility functions (copied from main server)
const readEvents = async () => {
  try {
    const data = await fs.readFile(TEST_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeEvents = async (events) => {
  await fs.writeFile(TEST_DATA_FILE, JSON.stringify(events, null, 2));
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const isValidEvent = (event) => {
  return event.title && event.description && event.startTime && event.endTime;
};

const parseRecurrence = (recurrence, startTime) => {
  const instances = [];
  const start = new Date(startTime);
  
  if (!recurrence || recurrence === 'none') return instances;
  
  for (let i = 1; i <= 10; i++) {
    const nextDate = new Date(start);
    
    switch (recurrence) {
      case 'daily':
        nextDate.setDate(start.getDate() + i);
        break;
      case 'weekly':
        nextDate.setDate(start.getDate() + (i * 7));
        break;
      case 'monthly':
        nextDate.setMonth(start.getMonth() + i);
        break;
      default:
        continue;
    }
    
    instances.push(nextDate.toISOString());
  }
  
  return instances;
};

// Routes (copied from main server)
app.get('/api/events', async (req, res) => {
  try {
    const events = await readEvents();
    const sortedEvents = events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    res.json(sortedEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

app.get('/api/events/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const events = await readEvents();
    const filteredEvents = events.filter(event => 
      event.title.toLowerCase().includes(q.toLowerCase()) ||
      event.description.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json(filteredEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search events' });
  }
});

app.get('/api/events/reminders', async (req, res) => {
  try {
    const events = await readEvents();
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    const upcomingEvents = events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= now && eventStart <= oneHourLater;
    });
    
    res.json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reminders' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const events = await readEvents();
    const event = events.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve event' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, startTime, endTime, recurrence = 'none' } = req.body;
    
    if (!isValidEvent({ title, description, startTime, endTime })) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    
    const events = await readEvents();
    const newEvent = {
      id: generateId(),
      title,
      description,
      startTime,
      endTime,
      recurrence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    
    if (recurrence !== 'none') {
      const recurrenceInstances = parseRecurrence(recurrence, startTime);
      const duration = new Date(endTime) - new Date(startTime);
      
      recurrenceInstances.forEach(instanceStart => {
        const instanceEnd = new Date(new Date(instanceStart).getTime() + duration);
        events.push({
          ...newEvent,
          id: generateId(),
          startTime: instanceStart,
          endTime: instanceEnd.toISOString(),
          parentId: newEvent.id
        });
      });
    }
    
    await writeEvents(events);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const events = await readEvents();
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const { title, description, startTime, endTime, recurrence } = req.body;
    
    if (!isValidEvent({ title, description, startTime, endTime })) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    
    events[eventIndex] = {
      ...events[eventIndex],
      title,
      description,
      startTime,
      endTime,
      recurrence: recurrence || 'none',
      updatedAt: new Date().toISOString()
    };
    
    await writeEvents(events);
    res.json(events[eventIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const events = await readEvents();
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const deletedEvent = events[eventIndex];
    events.splice(eventIndex, 1);
    
    const filteredEvents = events.filter(e => e.parentId !== deletedEvent.id);
    
    await writeEvents(filteredEvents);
    res.json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test Suite
describe('Event Scheduler API', () => {
  beforeEach(async () => {
    // Clear test data before each test
    await writeEvents([]);
  });

  afterAll(async () => {
    // Clean up test file
    try {
      await fs.unlink(TEST_DATA_FILE);
    } catch (error) {
      // File might not exist, ignore error
    }
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/events', () => {
    test('should create a new event', async () => {
      const eventData = {
        title: 'Test Meeting',
        description: 'A test meeting',
        startTime: '2024-12-31T10:00:00.000Z',
        endTime: '2024-12-31T11:00:00.000Z',
        recurrence: 'none'
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(eventData.title);
      expect(response.body.description).toBe(eventData.description);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    test('should create recurring events', async () => {
      const eventData = {
        title: 'Weekly Meeting',
        description: 'Weekly team meeting',
        startTime: '2024-12-31T10:00:00.000Z',
        endTime: '2024-12-31T11:00:00.000Z',
        recurrence: 'weekly'
      };

      await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      // Check if recurring instances were created
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(1);
    });

    test('should reject event with missing fields', async () => {
      const eventData = {
        title: 'Incomplete Event',
        // Missing description, startTime, endTime
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Missing required fields');
    });

    test('should reject event with invalid time range', async () => {
      const eventData = {
        title: 'Invalid Event',
        description: 'Event with invalid time range',
        startTime: '2024-12-31T11:00:00.000Z',
        endTime: '2024-12-31T10:00:00.000Z', // End before start
        recurrence: 'none'
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'End time must be after start time');
    });
  });

  describe('GET /api/events', () => {
    test('should return empty array when no events exist', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('should return events sorted by start time', async () => {
      // Create events in reverse chronological order
      const event1 = {
        title: 'Later Event',
        description: 'This happens later',
        startTime: '2024-12-31T15:00:00.000Z',
        endTime: '2024-12-31T16:00:00.000Z',
        recurrence: 'none'
      };

      const event2 = {
        title: 'Earlier Event',
        description: 'This happens earlier',
        startTime: '2024-12-31T10:00:00.000Z',
        endTime: '2024-12-31T11:00:00.000Z',
        recurrence: 'none'
      };

      await request(app).post('/api/events').send(event1);
      await request(app).post('/api/events').send(event2);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Earlier Event');
      expect(response.body[1].title).toBe('Later Event');
    });
  });

  describe('GET /api/events/:id', () => {
    test('should return specific event', async () => {
      const eventData = {
        title: 'Specific Event',
        description: 'A specific event',
        startTime: '2024-12-31T10:00:00.000Z',
        endTime: '2024-12-31T11:00:00.000Z',
        recurrence: 'none'
      };

      const createResponse = await request(app)
        .post('/api/events')
        .send(eventData);

      const eventId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/events/${eventId}`)
        .expect(200);

      expect(response.body.id).toBe(eventId);
      expect(response.body.title).toBe(eventData.title);
    });

    test('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/api/events/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Event not found');
    });
  });

  describe('PUT /api/events/:id', () => {
    test('should update existing event', async () => {
      const eventData = {
        title: 'Original Event',
        description: 'Original description',
        startTime: '2024-12-31T10:00:00.000Z',
        endTime: '2024-12-31T11:00:00.000Z',
        recurrence: 'none'
      };

      const createResponse = await request(app)
        .post('/api/events')
        .send(eventData);

      const eventId = createResponse.body.id;

      const updateData = {
        title: 'Updated Event',
        description: 'Updated description',
        startTime: '2024-12-31T14:00:00.000Z',
        endTime: '2024-12-31T15:00:00.000Z',
        recurrence: 'weekly'
      };

      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.recurrence).toBe(updateData.recurrence);
    });

    test('should return 404 for non-existent event', async () => {
      const updateData = {
        title: 'Updated Event',
        description: 'Updated description',
        startTime: '2024-12-31T14:00:00.000Z',
        endTime: '2024-12-31T15:00:00.000Z',
        recurrence: 'none'
      };

      const response = await request(app)
        .put('/api/events/nonexistent')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Event not found');
    });
  });

  describe('DELETE /api/events/:id', () => {
    test('should delete existing event', async () => {
      const eventData = {
        title: 'Event to Delete',
        description: 'This event will be deleted',
        startTime: '2024-12-31T10:00:00.000Z',
        endTime: '2024-12-31T11:00:00.000Z',
        recurrence: 'none'
      };

      const createResponse = await request(app)
        .post('/api/events')
        .send(eventData);

      const eventId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/events/${eventId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Event deleted successfully');

      // Verify event is deleted
      await request(app)
        .get(`/api/events/${eventId}`)
        .expect(404);
    });

    test('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .delete('/api/events/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Event not found');
    });
  });

  describe('GET /api/events/search', () => {
    beforeEach(async () => {
      // Create test events for search
      const events = [
        {
          title: 'Team Meeting',
          description: 'Weekly team standup',
          startTime: '2024-12-31T10:00:00.000Z',
          endTime: '2024-12-31T11:00:00.000Z',
          recurrence: 'none'
        },
        {
          title: 'Client Presentation',
          description: 'Quarterly business review',
          startTime: '2024-12-31T14:00:00.000Z',
          endTime: '2024-12-31T15:00:00.000Z',
          recurrence: 'none'
        },
        {
          title: 'Project Planning',
          description: 'Plan next sprint',
          startTime: '2024-12-31T16:00:00.000Z',
          endTime: '2024-12-31T17:00:00.000Z',
          recurrence: 'none'
        }
      ];

      for (const event of events) {
        await request(app).post('/api/events').send(event);
      }
    });

    test('should search events by title', async () => {
      const response = await request(app)
        .get('/api/events/search?q=meeting')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Team Meeting');
    });

    test('should search events by description', async () => {
      const response = await request(app)
        .get('/api/events/search?q=quarterly')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Client Presentation');
    });

    test('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/events/search?q=nonexistent')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    test('should require search query', async () => {
      const response = await request(app)
        .get('/api/events/search')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Search query is required');
    });
  });

  describe('GET /api/events/reminders', () => {
    test('should return events starting within next hour', async () => {
      const now = new Date();
      const inThirtyMinutes = new Date(now.getTime() + 30 * 60 * 1000);
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // Event starting in 30 minutes (should be included)
      const upcomingEvent = {
        title: 'Upcoming Meeting',
        description: 'Meeting starting soon',
        startTime: inThirtyMinutes.toISOString(),
        endTime: new Date(inThirtyMinutes.getTime() + 60 * 60 * 1000).toISOString(),
        recurrence: 'none'
      };

      // Event starting in 2 hours (should not be included)
      const laterEvent = {
        title: 'Later Meeting',
        description: 'Meeting starting later',
        startTime: inTwoHours.toISOString(),
        endTime: new Date(inTwoHours.getTime() + 60 * 60 * 1000).toISOString(),
        recurrence: 'none'
      };

      await request(app).post('/api/events').send(upcomingEvent);
      await request(app).post('/api/events').send(laterEvent);

      const response = await request(app)
        .get('/api/events/reminders')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Upcoming Meeting');
    });

    test('should return empty array when no upcoming events', async () => {
      const response = await request(app)
        .get('/api/events/reminders')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });
});