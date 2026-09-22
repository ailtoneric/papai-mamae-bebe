import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_CONFIG, getSuggestedRoutineForAge } from '../data/mockData';
import { ActivityItem } from '../types';
import { NewActivityModal } from './NewActivityModal';
import { ManageFamilyModal } from './ManageFamilyModal';
import {
  Bath,
  CheckCircle2,
  Clock,
  Edit2,
  FileSpreadsheet,
  Pill,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Users,
  Utensils,
  XCircle,
} from 'lucide-react';

export const ParentsDashboard: React.FC = () => {
  const {
    activeBaby,
    babyActivities,
    babyExecutions,
    deleteActivity,
    addActivity,
    showToast,
  } = useApp();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);

  const handleEdit = (activity: ActivityItem) => {
    setEditingActivity(activity);
    setShowNewModal(true);
  };

  const handleReloadTemplate = () => {
    if (
      window.confirm(
        `Deseja carregar o Quadro Padrão Sugerido de ${activeBaby.monthsAge} meses para o ${activeBaby.name}? Atividades existentes não serão perdidas.`
      )
    ) {
      const suggested = getSuggestedRoutineForAge(activeBaby.monthsAge, activeBaby.id);
      suggested.forEach((act) => {
        // Only add if not identical title
        if (!babyActivities.some((a) => a.title === act.title)) {
          addActivity(act);
        }
      });
      showToast(`Quadro Sugerido de ${activeBaby.monthsAge} meses mesclado com sucesso!`);
    }
  };

  const getCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
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
      {/* Admin Mode Informative Header */}
      <section className="bg-gradient-to-br from-[#7E57C2] to-[#653DA7] text-white rounded-3xl p-4.5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
            Painel dos Pais (Admin)
          </span>
          <button
            onClick={() => setShowFamilyModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-white text-[#7E57C2] px-3 py-1.5 rounded-full shadow-xs hover:bg-[#FAF0FF] active:scale-95 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gerenciar Família</span>
          </button>
        </div>

        <h2 className="font-headline font-bold text-xl leading-tight">
          Quadro de Rotina de {activeBaby.name}
        </h2>
        <p className="text-xs text-purple-100 mt-1 leading-relaxed">
          Crie, edite e personalize qualquer obrigação ou medicamento. A babá receberá as
          atualizações sincronizadas instantaneamente.
        </p>

        {/* Quick Management Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-white/20">
          <button
            onClick={() => {
              setEditingActivity(null);
              setShowNewModal(true);
            }}
            className="py-2.5 px-3 rounded-2xl bg-white text-[#653DA7] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-neutral-100 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Atividade</span>
          </button>

          <button
            onClick={handleReloadTemplate}
            className="py-2.5 px-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/30 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Template Sugerido</span>
          </button>
        </div>
      </section>

      {/* Routine Activities Management List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline font-bold text-base text-neutral-900">
            Estrutura da Rotina Diária
          </h3>
          <span className="text-xs text-neutral-500 font-semibold">
            {babyActivities.length} itens configurados
          </span>
        </div>

        {babyActivities.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200">
            <Sparkles className="w-8 h-8 text-[#7E57C2] mx-auto mb-2 opacity-50" />
            <h4 className="font-headline font-bold text-neutral-800 text-base">
              Nenhuma atividade cadastrada
            </h4>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Comece adicionando uma atividade do zero ou carregue o template de{' '}
              {activeBaby.monthsAge} meses.
            </p>
            <button
              onClick={handleReloadTemplate}
              className="py-2 px-4 rounded-full bg-[#7E57C2] text-white text-xs font-bold shadow-xs hover:bg-[#653DA7]"
            >
              Carregar Template Sugerido
            </button>
          </div>
        ) : (
          babyActivities.map((act) => {
            const config = CATEGORY_CONFIG[act.category];
            const exec = babyExecutions.find((e) => e.activityId === act.id);
            const isCompleted = exec?.status === 'concluido';
            const isUnperformed = exec?.status === 'nao_realizado';

            return (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs flex flex-col justify-between gap-3 hover:border-purple-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: config.surfaceColor,
                        color: config.darkColor,
                      }}
                    >
                      {getCategoryIcon(config.iconName, 'w-5 h-5')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: config.badgeBg,
                            color: config.badgeText,
                          }}
                        >
                          {config.name}
                        </span>

                        <span className="text-xs font-bold text-neutral-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#7E57C2]" />
                          {act.time}
                        </span>

                        {act.isMedication && (
                          <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                            Medicamento
                          </span>
                        )}
                      </div>

                      <h4 className="font-headline font-bold text-base text-neutral-900 mt-1">
                        {act.title}
                      </h4>

                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                        {act.description}
                      </p>

                      {act.medicationDetails && (
                        <div className="text-[11px] text-teal-700 bg-teal-50 px-2 py-1 rounded-lg mt-1.5 inline-block">
                          Dose: <strong>{act.medicationDetails.dosage}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(act)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-[#7E57C2] hover:bg-[#F6E9FF]"
                      title="Editar atividade"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remover "${act.title}" da rotina?`)) {
                          deleteActivity(act.id);
                        }
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Excluir atividade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Execution feedback for Parents */}
                <div className="border-t border-neutral-100 pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500 font-medium">Status da Babá hoje:</span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[#006A62] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Concluído às {exec?.completedAt}
                      </span>
                    ) : isUnperformed ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        Não realizado ({exec?.unperformedReason})
                      </span>
                    ) : (
                      <span className="text-neutral-400">Pendente de execução</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Modals */}
      <NewActivityModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        activityToEdit={editingActivity}
      />

      <ManageFamilyModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
      />
    </div>
  );
};
