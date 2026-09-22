import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ManageFamilyModal } from './ManageFamilyModal';
import {
  Bell,
  Clock,
  Key,
  RotateCcw,
  Shield,
  Smartphone,
  UserCheck,
  Users,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    role,
    setRole,
    parentSettings,
    updateParentSettings,
    activeNanny,
    activeBaby,
    showToast,
  } = useApp();

  const [showFamilyModal, setShowFamilyModal] = useState(false);

  return (
    <div className="space-y-4 pb-2">
      {/* Header */}
      <section className="bg-white rounded-3xl p-4.5 border border-purple-100 shadow-xs">
        <h2 className="font-headline font-bold text-lg text-neutral-900">
          Ajustes & Permissões (RBAC)
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configurações de notificações em tempo real, segurança e vínculo familiar.
        </p>
      </section>

      {/* Perfil Ativo Switcher */}
      <section className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs space-y-3">
        <h3 className="font-headline font-bold text-sm text-neutral-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#7E57C2]" />
          Perfil e Permissão em Uso (RN-01)
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setRole('baba');
              showToast('Perfil alternado para Babá (Executor)');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'baba'
                ? 'border-[#006A62] bg-[#E0F2F1] ring-2 ring-[#006A62]/30'
                : 'border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#006A62]">
              <span className="w-2 h-2 rounded-full bg-[#006A62]" />
              Babá (Executor)
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
              Apenas marca tarefas e insere anotações de execução. Bloqueado para edição.
            </p>
          </button>

          <button
            onClick={() => {
              setRole('pai');
              showToast('Perfil alternado para Pais (Admin)');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'pai'
                ? 'border-[#7E57C2] bg-[#F6E9FF] ring-2 ring-[#7E57C2]/30'
                : 'border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7E57C2]">
              <span className="w-2 h-2 rounded-full bg-[#7E57C2]" />
              Pai / Mãe (Admin)
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
              Acesso total: gerenciar bebês, rotinas, horários e notificações.
            </p>
          </button>
        </div>

        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-500">PIN da Babá {activeNanny.name}:</span>
            <span className="font-bold text-[#7E57C2] ml-2 tracking-widest">
              {activeNanny.pin}
            </span>
          </div>
          <button
            onClick={() => setShowFamilyModal(true)}
            className="text-xs font-bold text-[#7E57C2] hover:underline"
          >
            Alterar PIN
          </button>
        </div>
      </section>

      {/* Notificações em Tempo Real (RN-12) */}
      <section className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs space-y-3">
        <h3 className="font-headline font-bold text-sm text-neutral-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#7E57C2]" />
          Notificações Push dos Pais (RN-12)
        </h3>

        <div className="space-y-2.5">
          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-neutral-800">
                Avisar quando a babá ministrar remédio/vitamina
              </div>
              <div className="text-[11px] text-neutral-500">
                Notificação instantânea com nome do remédio e dose
              </div>
            </div>
            <input
              type="checkbox"
              checked={parentSettings.notifyMedicationGiven}
              onChange={(e) =>
                updateParentSettings({ notifyMedicationGiven: e.target.checked })
              }
              className="w-4 h-4 text-[#7E57C2] rounded-sm focus:ring-purple-400"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-neutral-800">
                Alerta de atraso em refeições (30 min)
              </div>
              <div className="text-[11px] text-neutral-500">
                Avisa se o almoço ou jantar atrasar mais de 30 minutos
              </div>
            </div>
            <input
              type="checkbox"
              checked={parentSettings.notifyTaskDelayMinutes > 0}
              onChange={(e) =>
                updateParentSettings({
                  notifyTaskDelayMinutes: e.target.checked ? 30 : 0,
                })
              }
              className="w-4 h-4 text-[#7E57C2] rounded-sm focus:ring-purple-400"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-neutral-800">
                Notificar início e fim de sonecas
              </div>
              <div className="text-[11px] text-neutral-500">
                Avisa quando o bebê dormiu e tempo total descansado
              </div>
            </div>
            <input
              type="checkbox"
              checked={parentSettings.notifyNapStartedEnded}
              onChange={(e) =>
                updateParentSettings({ notifyNapStartedEnded: e.target.checked })
              }
              className="w-4 h-4 text-[#7E57C2] rounded-sm focus:ring-purple-400"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-neutral-800">
                Notificar trocas de fralda
              </div>
              <div className="text-[11px] text-neutral-500">
                Avisa consistência e registros de xixi/cocô
              </div>
            </div>
            <input
              type="checkbox"
              checked={parentSettings.notifyDiaperAlerts}
              onChange={(e) =>
                updateParentSettings({ notifyDiaperAlerts: e.target.checked })
              }
              className="w-4 h-4 text-[#7E57C2] rounded-sm focus:ring-purple-400"
            />
          </label>
        </div>

        {/* Resumo Diário (RN-13) */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="text-neutral-700 font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7E57C2]" />
            Horário do Resumo Diário (RN-13):
          </span>
          <span className="font-bold text-[#7E57C2] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
            {parentSettings.dailySummaryTime}
          </span>
        </div>
      </section>

      {/* Família e Bebês Modal shortcut */}
      <section className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-headline font-bold text-sm text-neutral-900">
            Vínculo Familiar & Bebês
          </h4>
          <p className="text-xs text-neutral-500">
            Gerencie perfis, templates automáticos por idade e babás.
          </p>
        </div>
        <button
          onClick={() => setShowFamilyModal(true)}
          className="py-2 px-3 rounded-full bg-[#7E57C2] text-white text-xs font-bold hover:bg-[#653DA7] shadow-xs active:scale-95 transition-all"
        >
          Gerenciar
        </button>
      </section>

      <ManageFamilyModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
      />
    </div>
  );
};
