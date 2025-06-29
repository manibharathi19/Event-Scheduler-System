import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'events.json');

// Middleware
app.use(cors());
app.use(express.json());

// Utility functions
const readEvents = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeEvents = async (events) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
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
  
  for (let i = 1; i <= 10; i++) { // Generate next 10 instances
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

// Routes

// GET /api/events - Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await readEvents();
    const sortedEvents = events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    res.json(sortedEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

// GET /api/events/search - Search events
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

// GET /api/events/reminders - Get upcoming events (within next hour)
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

// GET /api/events/:id - Get single event
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

// POST /api/events - Create new event
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
    
    // Handle recurring events
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

// PUT /api/events/:id - Update event
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

// DELETE /api/events/:id - Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const events = await readEvents();
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const deletedEvent = events[eventIndex];
    events.splice(eventIndex, 1);
    
    // Also delete recurring instances if this is a parent event
    const filteredEvents = events.filter(e => e.parentId !== deletedEvent.id);
    
    await writeEvents(filteredEvents);
    res.json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Event Scheduler API running on http://localhost:${PORT}`);
});