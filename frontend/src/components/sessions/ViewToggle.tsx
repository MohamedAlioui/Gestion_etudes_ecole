import React from 'react';
import { Calendar, LayoutGrid } from 'lucide-react';

interface ViewToggleProps {
  view: 'calendar' | 'grid';
  onViewChange: (view: 'calendar' | 'grid') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          view === 'grid'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        <span>شبكة</span>
      </button>
      <button
        onClick={() => onViewChange('calendar')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          view === 'calendar'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Calendar className="h-4 w-4" />
        <span>تقويم</span>
      </button>
    </div>
  );
}