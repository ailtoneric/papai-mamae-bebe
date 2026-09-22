import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_CONFIG } from '../data/mockData';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Flame,
  LineChart,
  Moon,
  Sparkles,
  Thermometer,
  TrendingUp,
} from 'lucide-react';

export const HistoryReportsView: React.FC = () => {
  const {
    activeBaby,
    babyActivities,
    babyExecutions,
    diaperLogs,
    temperatureLogs,
    selectedDate,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'rotina' | 'fraldas' | 'saude'>('rotina');

  const filteredDiapers = diaperLogs.filter((d) => d.babyId === activeBaby.id);
  const filteredTemps = temperatureLogs.filter((t) => t.babyId === activeBaby.id);

  // Stats calculation
  const totalTasks = babyActivities.length;
  const completedTasks = babyExecutions.filter((e) => e.status === 'concluido').length;
  const unperformedTasks = babyExecutions.filter((e) => e.status === 'nao_realizado').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4 pb-2">
      {/* Header card with real-time stats */}
      <section className="bg-white rounded-3xl p-4.5 border border-purple-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Relatório em Tempo Real
            </span>
            <h2 className="font-headline font-bold text-lg text-neutral-900">
              Desempenho da Rotina de {activeBaby.name}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#EDE7F6] text-[#7E57C2] flex items-center justify-center font-headline font-bold text-base">
            {completionRate}%
          </div>
        </div>

        {/* 3 mini stat blocks */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-center">
          <div className="bg-[#E0F2F1] rounded-2xl p-2.5">
            <div className="font-headline font-bold text-[#004D40] text-lg">
              {completedTasks}
            </div>
            <div className="text-[11px] text-[#006A62] font-semibold">Concluídas</div>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-2.5">
            <div className="font-headline font-bold text-neutral-700 text-lg">
              {totalTasks - completedTasks - unperformedTasks}
            </div>
            <div className="text-[11px] text-neutral-500 font-semibold">Pendentes</div>
          </div>

          <div className="bg-rose-50 rounded-2xl p-2.5">
            <div className="font-headline font-bold text-rose-700 text-lg">
              {unperformedTasks}
            </div>
            <div className="text-[11px] text-rose-600 font-semibold">Não Feitas</div>
          </div>
        </div>
      </section>

      {/* Sub tabs: Rotina, Fraldas, Saúde & Temperatura */}
      <div className="flex bg-[#F6E9FF] p-1 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('rotina')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'rotina'
              ? 'bg-white text-[#7E57C2] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Checklist Diário
        </button>
        <button
          onClick={() => setActiveSubTab('fraldas')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'fraldas'
              ? 'bg-white text-[#7E57C2] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Fraldas ({filteredDiapers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('saude')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'saude'
              ? 'bg-white text-[#7E57C2] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Temperatura & Saúde
        </button>
      </div>

      {/* TAB 1: Rotina Histórico */}
      {activeSubTab === 'rotina' && (
        <section className="space-y-2.5">
          {babyActivities.map((act) => {
            const exec = babyExecutions.find((e) => e.activityId === act.id);
            const isDone = exec?.status === 'concluido';
            const isUnperformed = exec?.status === 'nao_realizado';
            const cat = CATEGORY_CONFIG[act.category];

            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.surfaceColor, color: cat.darkColor }}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-800">{act.title}</div>
                    <div className="text-[11px] text-neutral-500">
                      Horário: {act.time} • Categoria: {cat.name}
                    </div>
                    {exec?.nannyNotes && (
                      <div className="text-[11px] text-neutral-600 italic mt-0.5">
                        "{exec.nannyNotes}"
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {isDone ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E0F2F1] text-[#004D40]">
                      Feito às {exec?.completedAt}
                    </span>
                  ) : isUnperformed ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">
                      Não realizado
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-neutral-100 text-neutral-500">
                      Pendente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* TAB 2: Fraldas Histórico */}
      {activeSubTab === 'fraldas' && (
        <section className="space-y-2.5">
          {filteredDiapers.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-neutral-400 border border-neutral-200">
              <p className="text-xs font-semibold">Nenhuma troca registrada hoje.</p>
            </div>
          ) : (
            filteredDiapers.map((diaper) => (
              <div
                key={diaper.id}
                className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#004D40] flex items-center justify-center shrink-0">
                    <span className="text-xl">👶</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-800">
                      Troca de Fralda ({diaper.type.toUpperCase()})
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {diaper.ointmentApplied && '• Pomada aplicada '}
                      {diaper.consistency && `• Consistência: ${diaper.consistency}`}
                    </div>
                    {diaper.notes && (
                      <div className="text-[11px] text-neutral-600 italic">
                        "{diaper.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-[#006A62] bg-[#E0F2F1] px-2.5 py-1 rounded-full">
                  {diaper.time}
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* TAB 3: Temperatura Histórico */}
      {activeSubTab === 'saude' && (
        <section className="space-y-2.5">
          {filteredTemps.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-neutral-400 border border-neutral-200">
              <p className="text-xs font-semibold">Nenhuma medição de temperatura registrada.</p>
            </div>
          ) : (
            filteredTemps.map((temp) => (
              <div
                key={temp.id}
                className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-headline font-bold text-neutral-900">
                      {temp.celsius.toFixed(1)}°C
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Status: {temp.status === 'normal' ? 'Normal' : 'Atenção / Febril'}
                    </div>
                    {temp.notes && (
                      <div className="text-[11px] text-neutral-600 italic">
                        "{temp.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {temp.time}
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
};
