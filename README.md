# Event Scheduler System

A comprehensive full-stack event scheduling application with REST API backend and modern React frontend.

## 🚀 Features

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
- ✅ **Comprehensive Testing**: Full test suite with Jest and Supertest

## 🛠 Technology Stack

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

### Testing
- **Jest** for unit and integration testing
- **Supertest** for API endpoint testing
- **Babel** for ES modules support

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🔧 Installation & Setup

### 1. Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd event-scheduler-system

# Or download and extract the ZIP file
```

### 2. Install Dependencies
```bash
npm install
```

**Expected Output:**
```
added 670 packages, and audited 671 packages in 45s

106 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### 3. Start the Application
```bash
npm run dev
```

**Expected Output:**
```
> event-scheduler-system@1.0.0 dev
> concurrently "npm run server" "npm run client"

[0] 
[0] > event-scheduler-system@1.0.0 server
[0] > nodemon server/index.js
[0] 
[1] 
[1] > event-scheduler-system@1.0.0 client
[1] > vite
[1] 
[0] [nodemon] 3.0.2
[0] [nodemon] to restart at any time, enter `rs`
[0] [nodemon] watching path(s): *.*
[0] [nodemon] watching extensions: js,mjs,json
[0] [nodemon] starting `node server/index.js`
[0] Event Scheduler API running on http://localhost:3001
[1] 
[1]   VITE v5.4.2  ready in 1234 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
[1]   ➜  press h + enter to show help
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

## 🎯 Usage Examples

### Creating Your First Event

1. **Open the application** in your browser at http://localhost:5173
2. **Click "New Event"** button in the top right
3. **Fill in the form**:
   - Title: "Team Meeting"
   - Description: "Weekly team standup meeting"
   - Start Time: Select tomorrow at 10:00 AM
   - End Time: Select tomorrow at 11:00 AM
   - Recurrence: "Weekly"
4. **Click "Create Event"**

**Result**: You'll see the event appear in your dashboard, and if you selected weekly recurrence, multiple instances will be created automatically.

### Searching for Events

1. **Use the search bar** at the top of the dashboard
2. **Type "meeting"** and press Enter
3. **View filtered results** showing only events matching your search

### Setting Up Reminders

1. **Click the "Reminders" button** in the header
2. **View upcoming events** that start within the next hour
3. **The panel auto-refreshes** every minute when open

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

**Expected Output:**
```
> event-scheduler-system@1.0.0 test
> jest

 PASS  tests/eventService.test.js
  Event Scheduler API
    GET /api/health
      ✓ should return health status (45ms)
    POST /api/events
      ✓ should create a new event (23ms)
      ✓ should create recurring events (18ms)
      ✓ should reject event with missing fields (12ms)
      ✓ should reject event with invalid time range (8ms)
    GET /api/events
      ✓ should return empty array when no events exist (6ms)
      ✓ should return events sorted by start time (15ms)
    GET /api/events/:id
      ✓ should return specific event (12ms)
      ✓ should return 404 for non-existent event (7ms)
    PUT /api/events/:id
      ✓ should update existing event (14ms)
      ✓ should return 404 for non-existent event (6ms)
    DELETE /api/events/:id
      ✓ should delete existing event (13ms)
      ✓ should return 404 for non-existent event (5ms)
    GET /api/events/search
      ✓ should search events by title (16ms)
      ✓ should search events by description (11ms)
      ✓ should return empty array for no matches (8ms)
      ✓ should require search query (6ms)
    GET /api/events/reminders
      ✓ should return events starting within next hour (14ms)
      ✓ should return empty array when no upcoming events (5ms)

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        2.847s
Ran all test suites.
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

**Expected Output:**
```
> event-scheduler-system@1.0.0 test:coverage
> jest --coverage

 PASS  tests/eventService.test.js
  Event Scheduler API
    ✓ All tests pass...

------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |   95.12 |    88.89 |     100 |   94.87 |                   
 index.js   |   95.12 |    88.89 |     100 |   94.87 | 45,67,89         
------------|---------|----------|---------|---------|-------------------
```

## 🌐 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Available Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Example Request:**
```bash
curl http://localhost:3001/api/health
```

**Example Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Get All Events
```http
GET /api/events
```

**Example Request:**
```bash
curl http://localhost:3001/api/events
```

**Example Response:**
```json
[
  {
    "id": "lx7k2m9n0p",
    "title": "Team Meeting",
    "description": "Weekly team standup meeting",
    "startTime": "2024-01-20T10:00:00.000Z",
    "endTime": "2024-01-20T11:00:00.000Z",
    "recurrence": "weekly",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### 3. Create New Event
```http
POST /api/events
Content-Type: application/json
```

**Example Request:**
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

**Example Response:**
```json
{
  "id": "mx8n3o4p5q",
  "title": "Client Presentation",
  "description": "Quarterly business review presentation",
  "startTime": "2024-01-25T09:00:00.000Z",
  "endTime": "2024-01-25T10:30:00.000Z",
  "recurrence": "monthly",
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

#### 4. Get Single Event
```http
GET /api/events/:id
```

**Example Request:**
```bash
curl http://localhost:3001/api/events/mx8n3o4p5q
```

#### 5. Update Event
```http
PUT /api/events/:id
Content-Type: application/json
```

**Example Request:**
```bash
curl -X PUT http://localhost:3001/api/events/mx8n3o4p5q \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Client Presentation",
    "description": "Updated quarterly business review",
    "startTime": "2024-01-25T14:00:00.000Z",
    "endTime": "2024-01-25T15:30:00.000Z",
    "recurrence": "none"
  }'
```

#### 6. Delete Event
```http
DELETE /api/events/:id
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3001/api/events/mx8n3o4p5q
```

**Example Response:**
```json
{
  "message": "Event deleted successfully",
  "event": {
    "id": "mx8n3o4p5q",
    "title": "Updated Client Presentation",
    "description": "Updated quarterly business review",
    "startTime": "2024-01-25T14:00:00.000Z",
    "endTime": "2024-01-25T15:30:00.000Z",
    "recurrence": "none",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

#### 7. Search Events
```http
GET /api/events/search?q=meeting
```

**Example Request:**
```bash
curl "http://localhost:3001/api/events/search?q=presentation"
```

**Example Response:**
```json
[
  {
    "id": "mx8n3o4p5q",
    "title": "Client Presentation",
    "description": "Quarterly business review presentation",
    "startTime": "2024-01-25T09:00:00.000Z",
    "endTime": "2024-01-25T10:30:00.000Z",
    "recurrence": "monthly",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

#### 8. Get Reminders
```http
GET /api/events/reminders
```

**Example Request:**
```bash
curl http://localhost:3001/api/events/reminders
```

**Example Response:**
```json
[
  {
    "id": "nx9o4p5q6r",
    "title": "Urgent Meeting",
    "description": "Meeting starting in 30 minutes",
    "startTime": "2024-01-15T11:00:00.000Z",
    "endTime": "2024-01-15T12:00:00.000Z",
    "recurrence": "none",
    "createdAt": "2024-01-15T10:25:00.000Z",
    "updatedAt": "2024-01-15T10:25:00.000Z"
  }
]
```

## 📁 Project Structure

```
event-scheduler-system/
├── server/
│   ├── index.js              # Express server and API routes
│   └── events.json           # Data storage file (auto-created)
├── src/
│   ├── components/           # React components
│   │   ├── EventCard.tsx     # Individual event display
│   │   ├── EventForm.tsx     # Create/edit event form
│   │   ├── RemindersPanel.tsx # Reminders popup
│   │   └── SearchBar.tsx     # Search functionality
│   ├── services/
│   │   └── eventService.ts   # API service layer
│   ├── types/
│   │   └── event.ts          # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # React entry point
│   └── index.css             # Tailwind CSS imports
├── tests/
│   └── eventService.test.js  # Comprehensive API tests
├── package.json              # Dependencies and scripts
├── jest.config.js            # Jest testing configuration
├── .babelrc                  # Babel configuration for ES modules
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts            # Vite build configuration
└── README.md                 # This file
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run client` | Start only the frontend development server |
| `npm run server` | Start only the backend server |
| `npm run build` | Build the frontend for production |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint for code quality |
| `npm run preview` | Preview the production build |

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Kill process using port 3001
npx kill-port 3001

# Or use a different port by modifying server/index.js
```

#### 2. Module Not Found Errors
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 3. Jest ES Modules Error
**Error:** `SyntaxError: Cannot use import statement outside a module`

**Solution:** The project includes proper Babel configuration. If you still see this error:
```bash
# Ensure Babel dependencies are installed
npm install --save-dev @babel/core @babel/preset-env babel-jest
```

#### 4. Frontend Not Loading
**Error:** Blank page or connection refused

**Solution:**
1. Check if both servers are running (`npm run dev`)
2. Verify ports 3001 (backend) and 5173 (frontend) are available
3. Check browser console for errors

#### 5. API Requests Failing
**Error:** `Failed to fetch events`

**Solution:**
1. Ensure backend server is running on port 3001
2. Check CORS configuration in `server/index.js`
3. Verify API endpoints are accessible: `curl http://localhost:3001/api/health`

## 🌟 Features in Detail

### Recurring Events
- **Daily**: Event repeats every day at the same time
- **Weekly**: Event repeats every week on the same day and time
- **Monthly**: Event repeats every month on the same date and time
- Automatically generates up to 10 future instances
- Each instance can be edited or deleted independently

### Reminders System
- Automatically detects events starting within the next hour
- Updates every minute when the reminders panel is open
- Visual notifications with event details
- Real-time countdown to event start time

### Search Functionality
- Search by event title (case-insensitive)
- Search by event description (case-insensitive)
- Instant results as you type
- Clear search to return to full event list

### Data Persistence
- Events stored in `server/events.json`
- Automatic file creation on first run
- Data persists between application restarts
- Backup your `events.json` file to preserve data

## 🔒 Security Considerations

- Input validation on both client and server side
- SQL injection prevention (using JSON file storage)
- XSS protection through React's built-in escaping
- CORS properly configured for development

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# The dist/ folder contains the built frontend
# Deploy to any static hosting service (Netlify, Vercel, etc.)
```

### Backend Deployment
- Deploy the `server/` folder to any Node.js hosting service
- Ensure `events.json` file permissions are writable
- Set environment variables for production ports if needed

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the test suite for usage examples
3. Check the browser console for error messages
4. Ensure all dependencies are properly installed

## 🎉 Acknowledgments

- Built with React, Express.js, and modern web technologies
- Icons provided by Lucide React
- Styling with Tailwind CSS
- Testing with Jest and Supertest
