import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar } from 'lucide-react';

interface DayPill {
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: string; // Seg, Ter, Qua, etc.
  dayNumber: string; // 22, 23, 24, etc.
  isToday: boolean;
}

export const DateSelector: React.FC = () => {
  const { selectedDate, setSelectedDate, babyActivities, executions, activeBabyId } = useApp();

  // Create a 7-day strip around Oct 24, 2024 (matching the mockup)
  const days: DayPill[] = [
    { dateStr: '2024-10-22', dayOfWeek: 'Seg', dayNumber: '22', isToday: false },
    { dateStr: '2024-10-23', dayOfWeek: 'Ter', dayNumber: '23', isToday: false },
    { dateStr: '2024-10-24', dayOfWeek: 'Qua', dayNumber: '24', isToday: true },
    { dateStr: '2024-10-25', dayOfWeek: 'Qui', dayNumber: '25', isToday: false },
    { dateStr: '2024-10-26', dayOfWeek: 'Sex', dayNumber: '26', isToday: false },
    { dateStr: '2024-10-27', dayOfWeek: 'Sáb', dayNumber: '27', isToday: false },
    { dateStr: '2024-10-28', dayOfWeek: 'Dom', dayNumber: '28', isToday: false },
  ];

  return (
    <section className="space-y-1 mt-1">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#7E57C2]" />
          Rotina Sugerida pelos Pais
        </span>
        <span className="text-[11px] font-bold text-[#7E57C2] uppercase tracking-wider">
          Outubro 2024
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {days.map((day) => {
          const isSelected = selectedDate === day.dateStr;
          // Check completions for this date
          const dateExecutions = executions.filter(
            (e) => e.babyId === activeBabyId && e.date === day.dateStr
          );
          const hasCompleted = dateExecutions.some((e) => e.status === 'concluido');
          const hasActivities = babyActivities.length > 0;

          return (
            <button
              key={day.dateStr}
              onClick={() => setSelectedDate(day.dateStr)}
              className={`flex flex-col items-center justify-center min-w-[58px] py-2 px-1.5 rounded-2xl border transition-all active:scale-95 ${
                isSelected
                  ? 'bg-[#7E57C2] text-white border-[#7E57C2] shadow-md ring-2 ring-[#7E57C2]/40'
                  : 'bg-white border-neutral-200/80 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <span
                className={`text-[11px] font-bold ${
                  isSelected ? 'text-white' : 'text-neutral-500'
                }`}
              >
                {day.isToday ? 'HOJE' : day.dayOfWeek}
              </span>
              <span
                className={`font-headline text-base font-bold leading-tight ${
                  isSelected ? 'text-white' : 'text-neutral-800'
                }`}
              >
                {day.dayNumber}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  isSelected
                    ? 'bg-white'
                    : hasCompleted
                    ? 'bg-[#006A62]'
                    : hasActivities
                    ? 'bg-neutral-300'
                    : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};
