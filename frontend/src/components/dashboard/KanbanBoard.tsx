import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Clock, Calendar, User, GraduationCap, Loader2 } from 'lucide-react';

interface Session {
  _id: string;
  date_seance: string;
  etude: {
    _id: string;
    matiere: string;
    enseignant: {
      nom_enseignant: string;
      prenom_enseignant: string;
    };
  };
  status: 'pending' | 'in_progress' | 'completed';
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  sessions: Session[];
}

const initialColumns: KanbanColumn[] = [
  { 
    id: 'pending', 
    title: 'قادمة', 
    color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    sessions: [] 
  },
  { 
    id: 'in_progress', 
    title: 'جارية', 
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    sessions: [] 
  },
  { 
    id: 'completed', 
    title: 'مكتملة', 
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    sessions: [] 
  }
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, [retryCount]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/seances/kanban`);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const sessions = response.data;
      console.log('Fetched sessions:', sessions); // Debug log

      // Ensure each session has a status
      const validSessions = sessions.map((session: Session) => ({
        ...session,
        status: session.status || 'pending'
      }));

      // Organize sessions by status
      const updatedColumns = initialColumns.map(column => ({
        ...column,
        sessions: validSessions.filter((session: Session) => session.status === column.id)
      }));

      setColumns(updatedColumns);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      setError(error.response?.data?.message || 'فشل في تحميل الحصص');
      
      // Retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    try {
      // Optimistically update UI
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);
      
      if (!sourceColumn || !destColumn) return;

      const sourceSessions = [...sourceColumn.sessions];
      const destSessions = [...destColumn.sessions];
      
      const [movedSession] = sourceSessions.splice(source.index, 1);
      const updatedSession = { ...movedSession, status: destination.droppableId };
      destSessions.splice(destination.index, 0, updatedSession);

      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, sessions: sourceSessions };
        }
        if (col.id === destination.droppableId) {
          return { ...col, sessions: destSessions };
        }
        return col;
      });

      setColumns(newColumns);

      // Update backend
      const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/seances/${draggableId}/status`, {
        status: destination.droppableId
      });

      if (!response.data) {
        throw new Error('Failed to update session status');
      }

    } catch (error: any) {
      console.error('Error updating session status:', error);
      // Revert changes if update fails
      fetchSessions();
      setError('فشل في تحديث حالة الحصة');
      setTimeout(() => setError(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  if (loading && columns.every(col => col.sessions.length === 0)) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`p-4 rounded-t-lg ${column.color}`}>
                <h3 className="text-lg font-semibold">
                  {column.title}
                  <span className="mr-2 text-sm">
                    ({column.sessions.length})
                  </span>
                </h3>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-2 min-h-[400px]"
                  >
                    {column.sessions.map((session, index) => (
                      <Draggable
                        key={session._id}
                        draggableId={session._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-3 ${
                              snapshot.isDragging ? 'ring-2 ring-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <GraduationCap className="h-5 w-5 text-blue-500 dark:text-blue-400 ml-2" />
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {session.etude.matiere}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center">
                                <User className="h-4 w-4 ml-2" />
                                <span>
                                  {session.etude.enseignant.prenom_enseignant} {session.etude.enseignant.nom_enseignant}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 ml-2" />
                                <span>{formatDate(session.date_seance)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 ml-2" />
                                <span>{formatTime(session.date_seance)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
