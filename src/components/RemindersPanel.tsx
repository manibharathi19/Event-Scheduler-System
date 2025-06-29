import React, { useState, useEffect } from 'react';
import { Bell, Clock, X } from 'lucide-react';
import { Event } from '../types/event';
import eventService from '../services/eventService';
import { format } from 'date-fns';

interface RemindersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const RemindersPanel: React.FC<RemindersPanelProps> = ({ isOpen, onClose }) => {
  const [reminders, setReminders] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.getReminders();
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReminders();
      const interval = setInterval(fetchReminders, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Bell size={24} className="text-yellow-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Upcoming Reminders</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No upcoming events in the next hour</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((event) => (
              <div key={event.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex items-center text-sm text-yellow-700">
                  <Clock size={14} className="mr-1" />
                  <span>Starts at {format(new Date(event.startTime), 'h:mm a')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPanel;