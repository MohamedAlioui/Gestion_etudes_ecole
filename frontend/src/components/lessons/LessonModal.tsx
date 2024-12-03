import React, { useState, useEffect } from 'react';
import { Lesson } from '../../types/lesson';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lesson: Lesson) => void;
  lesson?: Lesson;
}

const LessonModal: React.FC<LessonModalProps> = ({ isOpen, onClose, onSubmit, lesson }) => {
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (lesson) {
      setName(lesson.name);
      setTeacher(lesson.teacher);
      setStartTime(lesson.startTime);
      setEndTime(lesson.endTime);
      setRoom(lesson.room);
      setDescription(lesson.description);
    }
  }, [lesson]);

  const handleSubmit = () => {
    const newLesson = {
      id: lesson?.id || new Date().toISOString(),
      name,
      teacher,
      startTime,
      endTime,
      room,
      description,
    };
    onSubmit(newLesson);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{lesson ? 'تعديل الحصة' : 'إضافة حصة'}</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2">اسم الحصة</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">المعلم</label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">وقت البداية</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">وقت النهاية</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">القاعة</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">الوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">إغلاق</button>
            <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonModal;
