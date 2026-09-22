import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewActivityModal } from './NewActivityModal';
import {
  QuickDiaperModal,
  QuickMessageModal,
  QuickTemperatureModal,
} from './ActionModals';
import {
  Clock,
  LineChart,
  PlusCircle,
  Sliders,
  Sparkles,
  Thermometer,
  X,
} from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, role, showToast } = useApp();
  const [showParentNewModal, setShowParentNewModal] = useState(false);
  const [showNannyQuickSheet, setShowNannyQuickSheet] = useState(false);

  // Quick modals for Nanny
  const [showDiaper, setShowDiaper] = useState(false);
  const [showTemp, setShowTemp] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleRegisterClick = () => {
    if (role === 'pai') {
      setShowParentNewModal(true);
    } else {
      setShowNannyQuickSheet(true);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-lg border-t border-purple-100 rounded-t-3xl">
        <div className="flex justify-around items-center px-4 py-2 max-w-md mx-auto">
          {/* Tab 1: Rotina */}
          <button
            onClick={() => setActiveTab('rotina')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'rotina'
                ? 'bg-[#7E57C2] text-white shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
            title="Rotina do Bebê"
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Rotina</span>
          </button>

          {/* Tab 2: Histórico */}
          <button
            onClick={() => setActiveTab('historico')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'historico'
                ? 'bg-[#7E57C2] text-white shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
            title="Histórico de Registros"
          >
            <LineChart className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Histórico</span>
          </button>

          {/* Tab 3: Registrar */}
          <button
            onClick={handleRegisterClick}
            className="flex flex-col items-center justify-center px-4 py-1.5 rounded-full text-neutral-500 hover:text-neutral-900 font-medium active:scale-95 transition-all"
            title={role === 'pai' ? 'Nova Atividade' : 'Apontamento Rápido'}
          >
            <PlusCircle className="w-5 h-5 mb-0.5 text-[#7E57C2]" />
            <span className="text-[11px] leading-tight">Registrar</span>
          </button>

          {/* Tab 4: Ajustes */}
          <button
            onClick={() => setActiveTab('ajustes')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'ajustes'
                ? 'bg-[#7E57C2] text-white shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
            title="Ajustes e Permissões"
          >
            <Sliders className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Ajustes</span>
          </button>
        </div>
      </nav>

      {/* Parent New Activity Modal */}
      <NewActivityModal
        isOpen={showParentNewModal}
        onClose={() => setShowParentNewModal(false)}
      />

      {/* Nanny Quick Registration Sheet */}
      {showNannyQuickSheet && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center p-3">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-purple-100 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-base text-neutral-900">
                Apontamento Rápido (Modo Babá)
              </h3>
              <button
                onClick={() => setShowNannyQuickSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Selecione o apontamento imediato para registrar com 1 toque:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowNannyQuickSheet(false);
                  setShowDiaper(true);
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-[#E0F2F1] border border-neutral-200 text-left transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#004D40] flex items-center justify-center shrink-0">
                  <span className="text-lg">👶</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">
                    Troca de Fralda
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Xixi, Cocô, consistência e pomada protetora
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowNannyQuickSheet(false);
                  setShowTemp(true);
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-amber-50 border border-neutral-200 text-left transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">
                    Medição de Temperatura
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Termômetro com status normal ou febril
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowNannyQuickSheet(false);
                  setShowMessage(true);
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFEBEE]/60 hover:bg-[#FFEBEE] border border-rose-200 text-left transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#B71C1C]">
                    Recado Urgente para os Pais
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Dispara notificação push instantânea
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Modals */}
      <QuickDiaperModal isOpen={showDiaper} onClose={() => setShowDiaper(false)} />
      <QuickTemperatureModal isOpen={showTemp} onClose={() => setShowTemp(false)} />
      <QuickMessageModal isOpen={showMessage} onClose={() => setShowMessage(false)} />
    </>
  );
};
