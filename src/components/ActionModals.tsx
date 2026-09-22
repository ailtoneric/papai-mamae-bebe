import React, { useState } from 'react';
import {
  ActivityItem,
  DiaperLog,
  TemperatureLog,
} from '../types';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  MessageCircle,
  Pill,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Thermometer,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

// RN-11: Medication Dose Confirmation Dialog
export const MedicationModal: React.FC<{
  activity: ActivityItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
}> = ({ activity, isOpen, onClose, onConfirm }) => {
  const [doseGiven, setDoseGiven] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const med = activity.medicationDetails;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-teal-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#006A62]">
            <div className="w-9 h-9 rounded-full bg-[#E0F2F1] flex items-center justify-center">
              <Pill className="w-5 h-5 text-[#26A69A]" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-neutral-900 leading-tight">
                Confirmação de Medicamento
              </h3>
              <span className="text-[11px] text-teal-700 font-semibold">
                Registro de Segurança (RN-11)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#E0F2F1]/80 rounded-2xl p-3.5 mb-4 border border-[#26A69A]/30">
          <div className="text-sm font-bold text-[#004D40]">{activity.title}</div>
          <div className="text-xs text-neutral-700 mt-1">
            <strong>Dose Prescrita:</strong> {med?.dosage || 'Conforme receita'}
          </div>
          {med?.instructions && (
            <div className="text-xs text-neutral-600 mt-0.5">
              <strong>Instrução:</strong> {med.instructions}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-teal-200 bg-teal-50/50 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={doseGiven}
            onChange={(e) => setDoseGiven(e.target.checked)}
            className="w-5 h-5 text-[#26A69A] rounded-md focus:ring-teal-400"
          />
          <span className="text-xs font-bold text-neutral-800">
            Confirmo que a dose exata de {med?.dosage || 'prescrita'} foi administrada ao bebê.
          </span>
        </label>

        <div className="mb-4">
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Observações da Babá (opcional):
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Tomou com facilidade, sem engasgo."
            className="w-full text-xs py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#26A69A] focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
          >
            Voltar
          </button>
          <button
            disabled={!doseGiven}
            onClick={() => onConfirm(notes)}
            className={`flex-1 py-3 rounded-full text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all ${
              doseGiven
                ? 'bg-[#26A69A] hover:bg-[#006A62]'
                : 'bg-neutral-300 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            Concluir Medicamento
          </button>
        </div>
      </div>
    </div>
  );
};

// RN-10: Exception Dialog (Não Realizado com motivo obrigatório)
export const ExceptionModal: React.FC<{
  activity: ActivityItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}> = ({ activity, isOpen, onClose, onConfirm }) => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const presets = [
    'Chuva ou clima desfavorável',
    'Bebê adormeceu antes do horário',
    'Bebê recusou a refeição/alimento',
    'Pais solicitaram adiar a atividade',
    'Bebê indisposto ou choroso',
  ];

  const finalReason = customReason.trim() || selectedPreset;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-rose-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-rose-700">
            <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-neutral-900 leading-tight">
                Marcar Não Realizado
              </h3>
              <span className="text-[11px] text-rose-600 font-semibold">
                Motivo Obrigatório (RN-10)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-600 mb-3">
          Informe por que a atividade <strong>"{activity.title}"</strong> não pôde ser
          concluída:
        </p>

        <div className="space-y-1.5 mb-3">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setSelectedPreset(preset);
                setCustomReason('');
              }}
              className={`w-full text-left text-xs p-2.5 rounded-xl border transition-all ${
                selectedPreset === preset
                  ? 'border-rose-400 bg-rose-50/80 font-bold text-rose-800'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Ou digite outro motivo:
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              setSelectedPreset('');
            }}
            placeholder="Descreva o motivo detalhadamente..."
            className="w-full text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
          >
            Voltar
          </button>
          <button
            disabled={!finalReason}
            onClick={() => onConfirm(finalReason)}
            className={`flex-1 py-3 rounded-full text-xs font-bold text-white shadow-md transition-all ${
              finalReason ? 'bg-rose-600 hover:bg-rose-700' : 'bg-neutral-300 cursor-not-allowed'
            }`}
          >
            Confirmar Exceção
          </button>
        </div>
      </div>
    </div>
  );
};

// Food Acceptance / Leftovers Dialog
export const FoodAcceptanceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (acceptance: 'tudo' | 'mais_da_metade' | 'pouco' | 'recusou', notes: string) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [level, setLevel] = useState<'tudo' | 'mais_da_metade' | 'pouco' | 'recusou'>('mais_da_metade');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-orange-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-headline font-bold text-base text-neutral-900">
            Aceitação da Refeição
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 mb-3">
          Quanto o bebê aceitou da porção oferecida?
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { id: 'tudo', label: 'Comeu Tudo (100%)', color: 'border-emerald-400 bg-emerald-50' },
            { id: 'mais_da_metade', label: 'Boa Parte (70%)', color: 'border-amber-400 bg-amber-50' },
            { id: 'pouco', label: 'Pouca Aceitação (30%)', color: 'border-orange-400 bg-orange-50' },
            { id: 'recusou', label: 'Recusou / Sobrou', color: 'border-rose-400 bg-rose-50' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setLevel(item.id as any)}
              className={`p-2.5 rounded-xl border text-xs font-bold text-neutral-800 transition-all ${
                level === item.id ? `${item.color} ring-2 ring-orange-300` : 'border-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Detalhes / Sobras:
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Deixou 3 colherinhas de frango."
            className="w-full text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(level, notes)}
            className="flex-1 py-3 rounded-full bg-[#FF8A65] hover:bg-[#BF360C] text-white text-xs font-bold shadow-md"
          >
            Salvar Registro
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Diaper Sheet Modal
export const QuickDiaperModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { addDiaperLog, activeBaby } = useApp();
  const [type, setType] = useState<'xixi' | 'coco' | 'ambos'>('xixi');
  const [consistency, setConsistency] = useState<'normal' | 'pastoso' | 'liquido' | 'ressecado'>('normal');
  const [ointment, setOintment] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDiaperLog({
      babyId: activeBaby.id,
      type,
      consistency: type !== 'xixi' ? consistency : undefined,
      ointmentApplied: ointment,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-teal-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👶</span>
            <h3 className="font-headline font-bold text-base text-neutral-900">
              Registrar Troca de Fralda
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
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Conteúdo da Fralda:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'xixi', label: '💧 Xixi' },
                { id: 'coco', label: '💩 Cocô' },
                { id: 'ambos', label: '✨ Ambos' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setType(opt.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    type === opt.id
                      ? 'border-[#26A69A] bg-[#E0F2F1] text-[#004D40]'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {type !== 'xixi' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Consistência do Cocô:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'normal', label: 'Normal / Amarelado' },
                  { id: 'pastoso', label: 'Pastoso' },
                  { id: 'liquido', label: 'Líquido (Atenção)' },
                  { id: 'ressecado', label: 'Ressecado' },
                ].map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setConsistency(c.id as any)}
                    className={`py-2 px-2 text-left rounded-xl text-xs border transition-all ${
                      consistency === c.id
                        ? 'border-amber-400 bg-amber-50 font-bold text-amber-900'
                        : 'border-neutral-200 text-neutral-600'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={ointment}
              onChange={(e) => setOintment(e.target.checked)}
              className="w-4 h-4 text-[#26A69A] rounded-sm focus:ring-teal-400"
            />
            <span>Pomada protetora contra assaduras aplicada</span>
          </label>

          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações (ex: pele sem assaduras)..."
              className="w-full text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#26A69A] focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-[#006A62] text-white text-xs font-bold shadow-md hover:bg-[#004D40]"
            >
              Salvar Troca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Quick Temperature Modal
export const QuickTemperatureModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { addTemperatureLog, activeBaby } = useApp();
  const [celsius, setCelsius] = useState(36.5);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const status: 'normal' | 'atencao' | 'febre' =
    celsius >= 37.8 ? 'febre' : celsius >= 37.2 ? 'atencao' : 'normal';

  const statusColor =
    status === 'febre'
      ? 'text-rose-600 bg-rose-50 border-rose-300'
      : status === 'atencao'
      ? 'text-amber-600 bg-amber-50 border-amber-300'
      : 'text-emerald-700 bg-emerald-50 border-emerald-300';

  const statusLabel =
    status === 'febre'
      ? '🔥 Febre (Avisar Pais)'
      : status === 'atencao'
      ? '⚠️ Estado Febril'
      : '✓ Temperatura Normal';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTemperatureLog({
      babyId: activeBaby.id,
      celsius,
      status,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-amber-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-amber-600" />
            <h3 className="font-headline font-bold text-base text-neutral-900">
              Registrar Temperatura
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-center">
          <div className="py-2">
            <div className="text-4xl font-headline font-bold text-neutral-900">
              {celsius.toFixed(1)}°C
            </div>
            <div
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mt-2 ${statusColor}`}
            >
              {statusLabel}
            </div>
          </div>

          <div className="px-2">
            <input
              type="range"
              min="35.0"
              max="40.0"
              step="0.1"
              value={celsius}
              onChange={(e) => setCelsius(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 font-semibold px-1 mt-1">
              <span>35.0°C</span>
              <span>37.0°C</span>
              <span>38.5°C</span>
              <span>40.0°C</span>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {[36.2, 36.5, 36.8, 37.5, 38.0].map((quick) => (
              <button
                type="button"
                key={quick}
                onClick={() => setCelsius(quick)}
                className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 hover:bg-neutral-50 font-semibold"
              >
                {quick}°
              </button>
            ))}
          </div>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anotação (ex: medição na axila pós banho)..."
            className="w-full text-xs py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md"
            >
              Salvar Medição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Quick Message to Parents Modal (Recado Pais)
export const QuickMessageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { sendParentMessage, activeBaby } = useApp();
  const [urgency, setUrgency] = useState<'informativo' | 'importante' | 'urgente'>('informativo');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendParentMessage(message.trim(), urgency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-rose-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-bold text-base text-neutral-900">
              Recado para os Pais
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 mb-3">
          Envie uma mensagem instantânea sobre o <strong>{activeBaby.name}</strong> para o painel dos pais:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            {[
              { id: 'informativo', label: '💬 Informativo' },
              { id: 'importante', label: '⭐ Importante' },
              { id: 'urgente', label: '🚨 Urgente' },
            ].map((u) => (
              <button
                type="button"
                key={u.id}
                onClick={() => setUrgency(u.id as any)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  urgency === u.id
                    ? u.id === 'urgente'
                      ? 'border-rose-500 bg-rose-100 text-rose-800'
                      : 'border-purple-400 bg-purple-50 text-purple-800'
                    : 'border-neutral-200 text-neutral-600'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Theo acordou de bom humor e mamou tudo. As fraldas tamanho M estão acabando!"
            className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex-1 py-3 rounded-full bg-[#B71C1C] hover:bg-[#8B0000] text-white text-xs font-bold shadow-md disabled:bg-neutral-300"
            >
              Enviar Recado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Nap Timer & White Noise Modal
export const NapTimerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activityId?: string;
}> = ({ isOpen, onClose, activityId }) => {
  const {
    activeNap,
    startNap,
    stopNap,
    isWhiteNoisePlaying,
    toggleWhiteNoise,
    markActivityCompleted,
    activeBaby,
  } = useApp();

  const [timerSeconds, setTimerSeconds] = React.useState(0);

  React.useEffect(() => {
    let interval: any;
    if (activeNap) {
      const update = () => {
        setTimerSeconds(Math.floor((Date.now() - activeNap.startTime) / 1000));
      };
      update();
      interval = setInterval(update, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeNap]);

  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleStart = () => {
    startNap(activeBaby.id);
  };

  const handleStop = () => {
    const elapsed = stopNap();
    if (activityId) {
      markActivityCompleted(
        activityId,
        `Soneca concluída com duração de ${elapsed} min no berço com ruído branco.`
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-purple-100 text-center">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#7E57C2]">
            <Clock className="w-5 h-5" />
            <h3 className="font-headline font-bold text-base text-neutral-900">
              Controle de Soneca
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-5 rounded-3xl bg-[#EDE7F6]/60 border border-[#7E57C2]/20">
          <div className="text-4xl font-headline font-bold text-[#311B92] tracking-wider mb-1">
            {timeFormatted}
          </div>
          <p className="text-xs text-neutral-600">
            {activeNap
              ? `Theo está dormindo no berço...`
              : 'Estimativa recomendada: 1h a 1h45m'}
          </p>
        </div>

        {/* White Noise Toggle Button */}
        <button
          onClick={toggleWhiteNoise}
          className={`w-full py-3 px-4 rounded-2xl mb-4 text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
            isWhiteNoisePlaying
              ? 'bg-[#81F3E5] text-[#004D40] border-[#006A62]'
              : 'bg-neutral-50 text-neutral-700 border-neutral-200'
          }`}
        >
          {isWhiteNoisePlaying ? (
            <>
              <VolumeX className="w-4 h-4 text-[#006A62]" />
              <span>Pausar Ruído Branco Suave</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#7E57C2]" />
              <span>Ligar Ruído Branco Suave (Chuva/Útero)</span>
            </>
          )}
        </button>

        {activeNap ? (
          <button
            onClick={handleStop}
            className="w-full min-h-[56px] rounded-full bg-rose-600 hover:bg-rose-700 text-white font-headline font-bold text-sm shadow-md flex items-center justify-center gap-2"
          >
            <Square className="w-5 h-5 fill-current" />
            <span>Finalizar Soneca e Registrar</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="w-full min-h-[56px] rounded-full bg-[#006A62] hover:bg-[#004D40] text-white font-headline font-bold text-sm shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Iniciar Soneca Agora</span>
          </button>
        )}
      </div>
    </div>
  );
};
