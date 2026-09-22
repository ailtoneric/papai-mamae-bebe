import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_CONFIG } from '../data/mockData';
import { ActivityItem } from '../types';
import {
  ExceptionModal,
  FoodAcceptanceModal,
  MedicationModal,
  NapTimerModal,
  QuickDiaperModal,
  QuickMessageModal,
  QuickTemperatureModal,
} from './ActionModals';
import {
  Baby,
  Bath,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Moon,
  Pill,
  Play,
  RotateCcw,
  Sparkles,
  Thermometer,
  Utensils,
  Wifi,
  XCircle,
} from 'lucide-react';

export const NannyDashboard: React.FC = () => {
  const {
    activeBaby,
    babyActivities,
    babyExecutions,
    markActivityCompleted,
    markActivityUnperformed,
    resetActivityStatus,
  } = useApp();

  // Active modal controls
  const [medicationTarget, setMedicationTarget] = useState<ActivityItem | null>(null);
  const [exceptionTarget, setExceptionTarget] = useState<ActivityItem | null>(null);
  const [foodTarget, setFoodTarget] = useState<ActivityItem | null>(null);
  const [napTarget, setNapTarget] = useState<ActivityItem | null>(null);

  // Quick action sheet modals
  const [showDiaperModal, setShowDiaperModal] = useState(false);
  const [showTempModal, setShowTempModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Quick inline notes keyed by activityId
  const [inlineNotes, setInlineNotes] = useState<Record<string, string>>({});

  const handleCompleteClick = (activity: ActivityItem) => {
    // If it's medicine, trigger safety dose check (RN-11)
    if (activity.isMedication) {
      setMedicationTarget(activity);
      return;
    }

    // If it's a nap, offer the nap timer modal
    if (activity.isNap) {
      setNapTarget(activity);
      return;
    }

    const note = inlineNotes[activity.id] || '';
    markActivityCompleted(activity.id, note || undefined);
  };

  const getCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className={className} />;
      case 'Pill':
        return <Pill className={className} />;
      case 'Smile':
        return <Bath className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-4 pb-2">
      {/* Status Carinhoso do Bebê & Banner Sem Interrupção */}
      <section className="bg-white rounded-3xl p-4 shadow-xs border border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#F6E9FF] flex items-center justify-center text-[#7E57C2] shrink-0">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-bold text-neutral-900">
                {activeBaby.name}
              </span>
              <span className="text-xs font-semibold text-neutral-500 bg-[#F1E3FE] px-2.5 py-0.5 rounded-full">
                {activeBaby.monthsAge} meses
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Modo Foco Ativo • Não perturbe
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF0FF] px-2.5 py-1 rounded-full text-[#006A62] text-xs font-bold border border-[#006A62]/20">
          <Wifi className="w-3.5 h-3.5 text-[#006A62]" />
          <span>Sincronizado</span>
        </div>
      </section>

      {/* Linha do Dia do Bebê */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-headline text-lg font-bold text-neutral-900">
            Linha do Dia do {activeBaby.name}
          </h2>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            {babyActivities.length} Atividades
          </span>
        </div>

        {babyActivities.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200 text-neutral-400">
            <p className="font-headline font-bold text-base text-neutral-700">
              Nenhuma atividade cadastrada
            </p>
            <p className="text-xs mt-1">
              Alterne para o Modo Pais para configurar a rotina ou carregar o template padrão.
            </p>
          </div>
        ) : (
          babyActivities.map((activity, index) => {
            const exec = babyExecutions.find((e) => e.activityId === activity.id);
            const isCompleted = exec?.status === 'concluido';
            const isUnperformed = exec?.status === 'nao_realizado';
            const categoryConfig = CATEGORY_CONFIG[activity.category];

            // Highlight the primary in-progress item (index 1 / Lunch in default mock)
            const isHighlightedCurrent = !isCompleted && !isUnperformed && index === 1;

            if (isCompleted) {
              return (
                <article
                  key={activity.id}
                  className="bg-white rounded-3xl p-4 border border-[#26A69A]/30 shadow-xs relative overflow-hidden transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#004D40] flex items-center justify-center shrink-0">
                        {getCategoryIcon(categoryConfig.iconName, 'w-5 h-5')}
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-[#26A69A] tracking-wider uppercase">
                          {activity.time} • {activity.period.toUpperCase()}
                        </span>
                        <h3 className="font-headline font-bold text-base text-neutral-900">
                          {activity.title}
                        </h3>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 bg-[#E0F2F1] text-[#004D40] border border-[#26A69A]/40 text-xs font-bold px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Concluído
                    </span>
                  </div>

                  {/* Nanny observation note */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-3 mt-2.5 border border-neutral-200/60 flex items-start justify-between gap-2 text-neutral-600">
                    <div className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#26A69A] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 font-semibold">
                          Registro da Babá ({exec.completedAt || 'Concluído'}):
                        </strong>{' '}
                        {exec.nannyNotes || 'Atividade realizada conforme a rotina.'}
                      </div>
                    </div>

                    {/* Reset button (allows correcting if clicked accidentally) */}
                    <button
                      onClick={() => resetActivityStatus(activity.id)}
                      className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-200/50"
                      title="Desmarcar / Reabrir tarefa"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            }

            if (isUnperformed) {
              return (
                <article
                  key={activity.id}
                  className="bg-white rounded-3xl p-4 border border-rose-200 shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        {getCategoryIcon(categoryConfig.iconName, 'w-5 h-5')}
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-rose-600 tracking-wider uppercase">
                          {activity.time} • {activity.period.toUpperCase()}
                        </span>
                        <h3 className="font-headline font-bold text-base text-neutral-900 line-through opacity-75">
                          {activity.title}
                        </h3>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold px-2.5 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      Não Realizado
                    </span>
                  </div>

                  <div className="bg-rose-50/60 rounded-2xl p-2.5 text-xs text-rose-800 flex items-center justify-between">
                    <span>
                      <strong>Motivo:</strong> {exec.unperformedReason}
                    </span>
                    <button
                      onClick={() => resetActivityStatus(activity.id)}
                      className="text-rose-500 hover:text-rose-700 underline text-[11px] font-bold"
                    >
                      Reabrir
                    </button>
                  </div>
                </article>
              );
            }

            // In-Progress Current Task (matches the 12:30 Almoço Nutritivo in the design!)
            if (isHighlightedCurrent) {
              return (
                <article
                  key={activity.id}
                  className="bg-white rounded-3xl p-4.5 border-2 border-[#7E57C2] shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#7E57C2] text-white text-[11px] font-bold px-3 py-1 rounded-bl-2xl flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#81F3E5] animate-ping" />
                    HORA ATUAL
                  </div>

                  <div className="flex items-start gap-3 mb-3 mt-1">
                    <div className="w-12 h-12 rounded-full bg-[#7E57C2] text-white flex items-center justify-center shrink-0 shadow-xs">
                      {getCategoryIcon(categoryConfig.iconName, 'w-6 h-6')}
                    </div>
                    <div className="pr-16">
                      <span className="text-[11px] font-extrabold text-[#7E57C2] tracking-wider uppercase">
                        {activity.time} • {activity.period.toUpperCase()}
                      </span>
                      <h3 className="font-headline text-xl font-bold text-neutral-900 leading-tight">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {/* Quick Inline Observation Field */}
                  <div className="mb-3.5">
                    <label
                      htmlFor={`note-${activity.id}`}
                      className="block text-xs font-bold text-neutral-800 mb-1"
                    >
                      Observações da Refeição:
                    </label>
                    <div className="relative">
                      <input
                        id={`note-${activity.id}`}
                        type="text"
                        value={inlineNotes[activity.id] || ''}
                        onChange={(e) =>
                          setInlineNotes({ ...inlineNotes, [activity.id]: e.target.value })
                        }
                        placeholder="Comeu tudo? Registre observações de aceitação..."
                        className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-2xl px-3.5 pr-10 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#7E57C2] transition-all"
                      />
                      <Edit3 className="w-4 h-4 absolute right-3.5 top-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Giant One-Handed Action Buttons (min-h-[56px] for holding baby) */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCompleteClick(activity)}
                      className="w-full min-h-[56px] rounded-full bg-[#7E57C2] hover:bg-[#653DA7] text-white font-headline font-bold text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                    >
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>Marcar Feito / Concluir {activity.title.split(' ')[0]}</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setFoodTarget(activity)}
                        className="flex-1 min-h-[44px] rounded-full bg-[#F6E9FF] hover:bg-[#EBDDF8] text-[#7E57C2] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#7E57C2]/20 active:scale-95 transition-all"
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Registrar Sobras / Aceitação</span>
                      </button>

                      <button
                        onClick={() => setExceptionTarget(activity)}
                        className="min-h-[44px] px-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold active:scale-95 transition-all"
                        title="Informar motivo de não realização"
                      >
                        Não Realizado
                      </button>
                    </div>
                  </div>
                </article>
              );
            }

            // Nap / Soneca Card with Sleep timer and White Noise ready
            if (activity.isNap) {
              return (
                <article
                  key={activity.id}
                  className="bg-white rounded-3xl p-4 border border-neutral-200/80 shadow-xs relative"
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F6E9FF] text-[#7E57C2] flex items-center justify-center shrink-0">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-neutral-500 tracking-wider uppercase">
                          {activity.time} • {activity.period.toUpperCase()}
                        </span>
                        <h3 className="font-headline font-bold text-base text-neutral-900">
                          {activity.title}
                        </h3>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 bg-[#F0ECE4] text-[#5D5369] text-xs font-bold px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      Programada
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] rounded-2xl p-3 mb-3 border border-neutral-200/40 flex items-center justify-between text-xs">
                    <span className="text-neutral-600">
                      Estimativa de sono:{' '}
                      <strong className="text-neutral-900">
                        {activity.napEstimatedMinutes
                          ? `${Math.floor(activity.napEstimatedMinutes / 60)}h ${
                              activity.napEstimatedMinutes % 60 > 0
                                ? `${activity.napEstimatedMinutes % 60}m`
                                : ''
                            }`
                          : '1h a 1h45m'}
                      </strong>
                    </span>
                    <span className="text-xs font-bold text-[#7E57C2]">Ruído Branco Pronto</span>
                  </div>

                  {/* Giant Action Button */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNapTarget(activity)}
                      className="flex-1 min-h-[56px] rounded-full bg-[#006A62] hover:bg-[#004D40] text-white font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Iniciar Soneca (Disparar Timer)</span>
                    </button>
                    <button
                      onClick={() => setExceptionTarget(activity)}
                      className="px-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold"
                    >
                      Exceção
                    </button>
                  </div>
                </article>
              );
            }

            // Standard Scheduled Future Activity
            return (
              <article
                key={activity.id}
                className="bg-white rounded-3xl p-4 border border-neutral-200/70 shadow-xs relative"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: categoryConfig.surfaceColor,
                        color: categoryConfig.darkColor,
                      }}
                    >
                      {getCategoryIcon(categoryConfig.iconName, 'w-5 h-5')}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-neutral-500 tracking-wider uppercase">
                        {activity.time} • {activity.period.toUpperCase()}
                      </span>
                      <h3 className="font-headline font-bold text-base text-neutral-900">
                        {activity.title}
                      </h3>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    Programada
                  </span>
                </div>

                <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                  {activity.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCompleteClick(activity)}
                    className="flex-1 min-h-[48px] rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center gap-2 border border-neutral-300 active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4 text-[#7E57C2]" />
                    <span>Concluir {activity.title.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={() => setExceptionTarget(activity)}
                    className="px-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold"
                  >
                    Exceção
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Apontamentos Rápidos em 1 Toque (Bento Grid Inferior) */}
      <section className="pt-2 space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#7E57C2]" />
            <h2 className="font-headline text-base font-bold text-neutral-900">
              Apontamentos em 1 Toque
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#006A62]">Ações Imediatas</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Fralda */}
          <button
            onClick={() => setShowDiaperModal(true)}
            className="flex flex-col items-center justify-center min-h-[82px] p-2.5 rounded-2xl bg-white border-2 border-neutral-200 hover:border-[#006A62] shadow-xs active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#004D40] flex items-center justify-center mb-1 group-hover:bg-[#006A62] group-hover:text-white transition-colors">
              <span className="text-lg">👶</span>
            </div>
            <span className="font-headline font-bold text-xs text-neutral-900 text-center leading-tight">
              Fralda
            </span>
            <span className="text-[10px] text-neutral-500">Xixi / Cocô</span>
          </button>

          {/* Temperatura */}
          <button
            onClick={() => setShowTempModal(true)}
            className="flex flex-col items-center justify-center min-h-[82px] p-2.5 rounded-2xl bg-white border-2 border-neutral-200 hover:border-amber-400 shadow-xs active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-1 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-xs text-neutral-900 text-center leading-tight">
              Temperatura
            </span>
            <span className="text-[10px] text-neutral-500">36.5°C OK</span>
          </button>

          {/* Recado Pais */}
          <button
            onClick={() => setShowMessageModal(true)}
            className="flex flex-col items-center justify-center min-h-[82px] p-2.5 rounded-2xl bg-[#FFEBEE] border-2 border-[#FF5252]/40 hover:border-[#FF5252] shadow-xs active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center mb-1">
              <span className="text-base">💬</span>
            </div>
            <span className="font-headline font-bold text-xs text-[#B71C1C] text-center leading-tight">
              Recado Pais
            </span>
            <span className="text-[10px] text-[#B71C1C] font-semibold">Notificar</span>
          </button>
        </div>
      </section>

      {/* Medication Confirmation Modal (RN-11) */}
      {medicationTarget && (
        <MedicationModal
          activity={medicationTarget}
          isOpen={!!medicationTarget}
          onClose={() => setMedicationTarget(null)}
          onConfirm={(notes) => {
            markActivityCompleted(
              medicationTarget.id,
              notes ||
                `Dose de ${
                  medicationTarget.medicationDetails?.dosage || 'prescrita'
                } administrada com sucesso.`,
              true
            );
            setMedicationTarget(null);
          }}
        />
      )}

      {/* Exception Reason Modal (RN-10) */}
      {exceptionTarget && (
        <ExceptionModal
          activity={exceptionTarget}
          isOpen={!!exceptionTarget}
          onClose={() => setExceptionTarget(null)}
          onConfirm={(reason) => {
            markActivityUnperformed(exceptionTarget.id, reason);
            setExceptionTarget(null);
          }}
        />
      )}

      {/* Food Acceptance Modal */}
      {foodTarget && (
        <FoodAcceptanceModal
          isOpen={!!foodTarget}
          onClose={() => setFoodTarget(null)}
          onConfirm={(acceptance, notes) => {
            markActivityCompleted(
              foodTarget.id,
              notes ? `Aceitação: ${acceptance}. ${notes}` : `Aceitação: ${acceptance}.`,
              undefined,
              acceptance
            );
            setFoodTarget(null);
          }}
        />
      )}

      {/* Nap Timer Modal */}
      {napTarget && (
        <NapTimerModal
          isOpen={!!napTarget}
          activityId={napTarget.id}
          onClose={() => setNapTarget(null)}
        />
      )}

      {/* Quick Diaper Modal */}
      <QuickDiaperModal isOpen={showDiaperModal} onClose={() => setShowDiaperModal(false)} />

      {/* Quick Temperature Modal */}
      <QuickTemperatureModal isOpen={showTempModal} onClose={() => setShowTempModal(false)} />

      {/* Quick Recado Pais Modal */}
      <QuickMessageModal isOpen={showMessageModal} onClose={() => setShowMessageModal(false)} />
    </div>
  );
};
