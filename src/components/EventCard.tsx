import React from 'react';
import { Calendar, Clock, Repeat, Edit, Trash2 } from 'lucide-react';
import { Event } from '../types/event';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const isEventPast = isPast(endDate);
  const isEventToday = isToday(startDate);
  const isEventTomorrow = isTomorrow(startDate);

  const getDateLabel = () => {
    if (isEventToday) return 'Today';
    if (isEventTomorrow) return 'Tomorrow';
    return format(startDate, 'MMM dd, yyyy');
  };

  const getRecurrenceLabel = () => {
    switch (event.recurrence) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
      isEventPast ? 'border-gray-400 opacity-75' : 
      isEventToday ? 'border-blue-500' : 
      isEventTomorrow ? 'border-purple-500' : 'border-green-500'
    } transform hover:scale-105`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${isEventPast ? 'text-gray-600' : 'text-gray-800'}`}>
            {event.title}
          </h3>
          <p className={`text-sm mb-3 ${isEventPast ? 'text-gray-500' : 'text-gray-600'}`}>
            {event.description}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(event)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit event"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete event"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span className="font-medium">{getDateLabel()}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-2" />
          <span>
            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
          </span>
        </div>

        {event.recurrence && event.recurrence !== 'none' && (
          <div className="flex items-center text-sm text-purple-600">
            <Repeat size={16} className="mr-2" />
            <span className="font-medium">{getRecurrenceLabel()}</span>
          </div>
        )}
      </div>

      {isEventToday && (
        <div className="mt-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full inline-block">
          Today's Event
        </div>
      )}

      {isEventPast && (
        <div className="mt-4 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full inline-block">
          Past Event
        </div>
      )}
    </div>
  );
};

export default EventCard;