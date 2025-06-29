# Event Scheduler System

A comprehensive full-stack event scheduling application with REST API backend and modern React frontend.

## Features

### Core Features
- ✅ **Full CRUD Operations**: Create, read, update, and delete events
- ✅ **Event Management**: Title, description, start/end times with validation
- ✅ **Persistent Storage**: File-based JSON storage that persists between sessions
- ✅ **RESTful API**: Complete API endpoints testable via Postman
- ✅ **Event Sorting**: Events displayed chronologically (earliest first)
- ✅ **Responsive Design**: Beautiful UI that works on all device sizes

### Advanced Features
- ✅ **Search Functionality**: Search events by title or description
- ✅ **Recurring Events**: Support for daily, weekly, and monthly recurrence
- ✅ **Reminders System**: Shows events starting within the next hour
- ✅ **Real-time Updates**: Auto-refresh capabilities
- ✅ **Form Validation**: Comprehensive client and server-side validation
- ✅ **Error Handling**: Graceful error handling with user feedback

## Technology Stack

### Backend
- **Node.js** with Express.js
- **RESTful API** design
- **File-based JSON storage**
- **CORS enabled** for frontend integration

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Date-fns** for date manipulation
- **Responsive design** with modern UI

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   ```bash
   npm run dev
   ```
   
   This command starts both the backend server (port 3001) and frontend development server (port 5173) concurrently.

3. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001/api

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Get All Events
```http
GET /events
```
Returns all events sorted by start time (earliest first).

#### Create Event
```http
POST /events
Content-Type: application/json

{
  "title": "Meeting with Client",
  "description": "Discuss project requirements",
  "startTime": "2024-01-15T14:00:00.000Z",
  "endTime": "2024-01-15T15:30:00.000Z",
  "recurrence": "weekly"
}
```

#### Get Single Event
```http
GET /events/:id
```

#### Update Event
```http
PUT /events/:id
Content-Type: application/json

{
  "title": "Updated Meeting",
  "description": "Updated description",
  "startTime": "2024-01-15T15:00:00.000Z",
  "endTime": "2024-01-15T16:30:00.000Z",
  "recurrence": "none"
}
```

#### Delete Event
```http
DELETE /events/:id
```

#### Search Events
```http
GET /events/search?q=meeting
```

#### Get Reminders
```http
GET /events/reminders
```
Returns events starting within the next hour.

#### Health Check
```http
GET /health
```

### Response Format

**Success Response:**
```json
{
  "id": "event_id",
  "title": "Event Title",
  "description": "Event Description",
  "startTime": "2024-01-15T14:00:00.000Z",
  "endTime": "2024-01-15T15:30:00.000Z",
  "recurrence": "weekly",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## Postman Collection

Import the following JSON into Postman to test all API endpoints:

```json
{
  "info": {
    "name": "Event Scheduler API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Events",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/events",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "events"]
        }
      }
    },
    {
      "name": "Create Event",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Team Meeting\",\n  \"description\": \"Weekly team standup meeting\",\n  \"startTime\": \"2024-01-20T10:00:00.000Z\",\n  \"endTime\": \"2024-01-20T11:00:00.000Z\",\n  \"recurrence\": \"weekly\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/events",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "events"]
        }
      }
    },
    {
      "name": "Update Event",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Updated Meeting\",\n  \"description\": \"Updated description\",\n  \"startTime\": \"2024-01-20T14:00:00.000Z\",\n  \"endTime\": \"2024-01-20T15:00:00.000Z\",\n  \"recurrence\": \"monthly\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/events/{{event_id}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "events", "{{event_id}}"]
        }
      }
    },
    {
      "name": "Delete Event",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/events/{{event_id}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "events", "{{event_id}}"]
        }
      }
    },
    {
      "name": "Search Events",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/events/search?q=meeting",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "events", "search"],
          "query": [
            {
              "key": "q",
              "value": "meeting"
            }
          ]
        }
      }
    },
    {
      "name": "Get Reminders",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/events/reminders",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "events", "reminders"]
        }
      }
    }
  ]
}
```

## Usage Examples

### Creating an Event
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Client Presentation",
    "description": "Quarterly business review presentation",
    "startTime": "2024-01-25T09:00:00.000Z",
    "endTime": "2024-01-25T10:30:00.000Z",
    "recurrence": "monthly"
  }'
```

### Searching Events
```bash
curl "http://localhost:3001/api/events/search?q=presentation"
```

### Getting Reminders
```bash
curl http://localhost:3001/api/events/reminders
```

## Features in Detail

### Recurring Events
- **Daily**: Event repeats every day
- **Weekly**: Event repeats every week on the same day
- **Monthly**: Event repeats every month on the same date
- Generates up to 10 future instances automatically

### Reminders System
- Checks for events starting within the next hour
- Updates every minute when reminder panel is open
- Visual notifications in the frontend

### Data Persistence
- Events stored in `server/events.json`
- Automatic file creation on first run
- Data persists between application restarts

### Error Handling
- Comprehensive validation on both client and server
- Graceful error messages for users
- Prevents invalid date ranges and missing required fields

## Project Structure

```
├── server/
│   ├── index.js          # Express server and API routes
│   └── events.json       # Data storage file
├── src/
│   ├── components/       # React components
│   ├── services/         # API service layer
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application component
├── package.json         # Dependencies and scripts
└── README.md           # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.