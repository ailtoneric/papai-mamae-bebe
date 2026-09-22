import React, { useState, useEffect } from 'react';
import { ActivityItem, CategoryType, RecurrenceType } from '../types';
import { useApp } from '../context/AppContext';
import { CATEGORY_CONFIG } from '../data/mockData';
import { Clock, Pill, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit?: ActivityItem | null;
}

export const NewActivityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activityToEdit,
}) => {
  const { addActivity, updateActivity, activeBaby } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('alimentacao');
  const [time, setTime] = useState('09:00');
  const [period, setPeriod] = useState<ActivityItem['period']>('manha');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('diaria');
  const [isMedication, setIsMedication] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medInstructions, setMedInstructions] = useState('');
  const [isNap, setIsNap] = useState(false);
  const [napMinutes, setNapMinutes] = useState(90);

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setDescription(activityToEdit.description);
      setCategory(activityToEdit.category);
      setTime(activityToEdit.time);
      setPeriod(activityToEdit.period);
      setRecurrence(activityToEdit.recurrence);
      setIsMedication(activityToEdit.isMedication);
      setMedName(activityToEdit.medicationDetails?.medicationName || '');
      setMedDosage(activityToEdit.medicationDetails?.dosage || '');
      setMedInstructions(activityToEdit.medicationDetails?.instructions || '');
      setIsNap(!!activityToEdit.isNap);
      setNapMinutes(activityToEdit.napEstimatedMinutes || 90);
    } else {
      setTitle('');
      setDescription('');
      setCategory('alimentacao');
      setTime('09:00');
      setPeriod('manha');
      setRecurrence('diaria');
      setIsMedication(false);
      setMedName('');
      setMedDosage('');
      setMedInstructions('');
      setIsNap(false);
      setNapMinutes(90);
    }
  }, [activityToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Omit<ActivityItem, 'id'> = {
      babyId: activeBaby.id,
      title: title.trim(),
      description: description.trim(),
      category,
      time,
      period,
      recurrence,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      isMedication,
      medicationDetails: isMedication
        ? {
            medicationName: medName.trim() || title.trim(),
            dosage: medDosage.trim() || 'Conforme receita',
            instructions: medInstructions.trim(),
          }
        : undefined,
      isNap,
      napEstimatedMinutes: isNap ? napMinutes : undefined,
    };

    if (activityToEdit) {
      updateActivity({ ...payload, id: activityToEdit.id });
    } else {
      addActivity(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2 text-[#7E57C2]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-headline font-bold text-lg text-neutral-900">
              {activityToEdit ? 'Editar Atividade' : 'Nova Atividade da Rotina'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Bebê Ativo */}
          <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-neutral-200 text-xs flex items-center justify-between">
            <span className="text-neutral-500 font-semibold">Atribuir ao bebê:</span>
            <span className="font-headline font-bold text-[#7E57C2]">
              {activeBaby.name} ({activeBaby.monthsAge} meses)
            </span>
          </div>

          {/* Categoria Visual (RN-07) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Categoria Visual (RN-07):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const isSelected = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      if (cat === 'saude') setIsMedication(true);
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'ring-2 shadow-xs'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                    style={{
                      borderColor: isSelected ? config.accentColor : undefined,
                      backgroundColor: isSelected ? config.surfaceColor : undefined,
                      color: isSelected ? config.darkColor : undefined,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: config.accentColor }}
                    />
                    <span>{config.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Nome da Atividade:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Almoço Nutritivo, Vitamina D, Banho Morno"
              className="w-full text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#7E57C2] focus:outline-hidden"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Instruções para a Babá:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Papinha de legumes com franguinho desfiado. Não forçar se recusar."
              className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#7E57C2] focus:outline-hidden"
            />
          </div>

          {/* Horário & Período */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Horário Previsto:
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#7E57C2] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Período do Dia:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#7E57C2] focus:outline-hidden"
              >
                <option value="manha">Manhã</option>
                <option value="almoco">Almoço</option>
                <option value="tarde">Tarde</option>
                <option value="fim_de_tarde">Fim de Tarde</option>
                <option value="noite">Noite</option>
              </select>
            </div>
          </div>

          {/* Recorrência (RN-08) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Recorrência da Tarefa (RN-08):
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'diaria', label: 'Diária (Todos os dias)' },
                { id: 'pontual', label: 'Pontual (Hoje apenas)' },
                { id: 'dias_especificos', label: 'Dias Selecionados' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRecurrence(r.id as any)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                    recurrence === r.id
                      ? 'border-[#7E57C2] bg-[#EDE7F6] text-[#311B92]'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Medicamento Toggle (RN-11) */}
          <div className="border border-teal-200 bg-teal-50/50 p-3 rounded-2xl space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-[#004D40] flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#26A69A]" />
                É um Medicamento ou Vitamina?
              </span>
              <input
                type="checkbox"
                checked={isMedication}
                onChange={(e) => setIsMedication(e.target.checked)}
                className="w-4 h-4 text-[#26A69A] rounded-sm focus:ring-teal-400"
              />
            </label>

            {isMedication && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="Nome do remédio (ex: Vitamina D)"
                    className="text-xs py-1.5 px-2.5 bg-white border border-teal-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="Dose (ex: 4 gotas, 2.5ml)"
                    className="text-xs py-1.5 px-2.5 bg-white border border-teal-200 rounded-xl"
                  />
                </div>
                <input
                  type="text"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  placeholder="Instruções de administração..."
                  className="w-full text-xs py-1.5 px-2.5 bg-white border border-teal-200 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Soneca Toggle */}
          <div className="border border-purple-200 bg-purple-50/40 p-3 rounded-2xl">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-[#311B92]">
                É período de Soneca / Sono?
              </span>
              <input
                type="checkbox"
                checked={isNap}
                onChange={(e) => setIsNap(e.target.checked)}
                className="w-4 h-4 text-[#7E57C2] rounded-sm focus:ring-purple-400"
              />
            </label>
            {isNap && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-600">Tempo estimado:</span>
                <div className="flex gap-1.5">
                  {[45, 60, 90, 120].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setNapMinutes(m)}
                      className={`px-2 py-1 rounded-lg border text-xs font-bold ${
                        napMinutes === m
                          ? 'bg-[#7E57C2] text-white border-[#7E57C2]'
                          : 'bg-white border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-[#7E57C2] hover:bg-[#653DA7] text-white text-xs font-bold shadow-md"
            >
              {activityToEdit ? 'Atualizar Atividade' : 'Salvar Atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
