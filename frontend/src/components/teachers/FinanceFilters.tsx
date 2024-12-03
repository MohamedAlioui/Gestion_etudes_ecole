import React from 'react';

interface FinanceFiltersProps {
  startDate: string;
  endDate: string;
  selectedEtude: string;
  etudes: { 
    _id: string; 
    className: string; 
    matiere: string; 
    niveau: string; 
    enseignant: { 
      nom_enseignant: string; 
      prenom_enseignant: string; 
    }; 
  }[];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onEtudeChange: (etudeId: string) => void;
  onSubmit: () => void;
}

export const FinanceFilters: React.FC<FinanceFiltersProps> = ({
  startDate,
  endDate,
  selectedEtude,
  etudes,
  onStartDateChange,
  onEndDateChange,
  onEtudeChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="etude" className="block text-sm font-medium text-gray-700 mb-1">
            الدراسة
          </label>
          <select
            id="etude"
            value={selectedEtude}
            onChange={(e) => onEtudeChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">اختر الدراسة</option>
            {etudes.map((etude) => (
              <option key={etude._id} value={etude._id}>
                {etude.className} {etude.matiere}{etude.niveau} {etude.enseignant.nom_enseignant} {etude.enseignant.prenom_enseignant}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            من تاريخ
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            إلى تاريخ
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            عرض النتائج
          </button>
        </div>
      </form>
    </div>
  );
};