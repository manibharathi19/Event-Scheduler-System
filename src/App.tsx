import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Bell, Search, RefreshCw } from 'lucide-react';
import { Event, EventFormData } from './types/event';
import eventService from './services/eventService';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import SearchBar from './components/SearchBar';
import RemindersPanel from './components/RemindersPanel';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showReminders, setShowReminders] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      setIsLoading(true);
      await eventService.createEvent(eventData);
      await fetchEvents();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      setError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (eventData: EventFormData) => {
    if (!editingEvent) return;

    try {
      setIsLoading(true);
      await eventService.updateEvent(editingEvent.id, eventData);
      await fetchEvents();
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
      setError(error instanceof Error ? error.message : 'Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.deleteEvent(id);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      setError('Failed to delete event');
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const results = await eventService.searchEvents(query);
      setFilteredEvents(results);
    } catch (error) {
      console.error('Failed to search events:', error);
      setError('Failed to search events');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setFilteredEvents(events);
    setIsSearching(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl mr-4">
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Scheduler</h1>
                <p className="text-gray-600">Manage your events efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowReminders(true)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                title="View reminders"
              >
                <Bell size={20} className="mr-2" />
                Reminders
              </button>
              
              <button
                onClick={fetchEvents}
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh events"
              >
                <RefreshCw size={20} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
              >
                <Plus size={20} className="mr-2" />
                New Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-800 mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Events Grid */}
        {isLoading && !events.length ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSearching ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-gray-600 mb-8">
              {isSearching 
                ? 'Try adjusting your search terms' 
                : 'Create your first event to get started'
              }
            </p>
            {!isSearching && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
              >
                <Plus size={20} className="mr-2" />
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {(showForm || editingEvent) && (
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={handleCloseForm}
          isLoading={isLoading}
        />
      )}

      <RemindersPanel 
        isOpen={showReminders}
        onClose={() => setShowReminders(false)}
      />
    </div>
  );
}

export default App;