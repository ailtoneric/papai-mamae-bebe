import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeftRight,
  Bell,
  CheckCircle2,
  Lock,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    babies,
    activeBaby,
    setActiveBabyId,
    activeNanny,
    parentNotifications,
    markNotificationRead,
    clearNotifications,
    showToast,
  } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showBabySelector, setShowBabySelector] = useState(false);

  const unreadNotifsCount = parentNotifications.filter((n) => !n.read).length;

  const handleToggleRoleClick = () => {
    if (role === 'baba') {
      // Switching to Parent Mode requires PIN or confirmation
      setShowPinModal(true);
      setPinInput('');
      setPinError(false);
    } else {
      // Switching back to Babá mode is immediate
      setRole('baba');
      showToast('Modo Babá Ativado: interface operacional focada.');
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or Nanny PIN
    if (pinInput === '1234' || pinInput === activeNanny.pin || pinInput === '0000') {
      setRole('pai');
      setShowPinModal(false);
      showToast('Modo Pais (Gestão & Admin) Ativado.');
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 w-full border-b border-[#EADDFF]/50 shadow-xs">
        <div className="flex justify-between items-center w-full px-4 py-2.5 max-w-md mx-auto">
          {/* Leading: Baby Avatar with Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowBabySelector(true)}
              className="relative group text-left flex items-center gap-2.5 active:scale-95 transition-transform"
              title="Alternar perfil do bebê"
            >
              <div className="relative w-11 h-11 rounded-full p-0.5 bg-[#7E57C2]/20 flex items-center justify-center">
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-xs"
                  src={activeBaby.photoUrl}
                  alt={`Bebê ${activeBaby.name}`}
                />
                <span
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#006A62] rounded-full border-2 border-white flex items-center justify-center"
                  title="Online / Monitor Ativo"
                />
              </div>

              <div>
                <h1 className="font-headline text-[18px] leading-tight font-bold text-[#653DA7] tracking-tight flex items-center gap-1">
                  Papai Mamãe Bebê
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] leading-none ${
                      role === 'baba'
                        ? 'bg-[#81F3E5] text-[#004D40]'
                        : 'bg-[#EDE7F6] text-[#311B92]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        role === 'baba' ? 'bg-[#006A62] animate-pulse' : 'bg-[#7E57C2]'
                      }`}
                    />
                    {role === 'baba' ? 'Modo Babá Ativo' : 'Modo Pais (Gestão)'}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Trailing Actions: Switch Role & Notifications */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleRoleClick}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#653DA7] hover:bg-[#F6E9FF] active:scale-90 transition-all"
              title={role === 'baba' ? 'Alternar para Modo Pais' : 'Alternar para Modo Babá'}
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowNotifDrawer(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#4A4452] hover:bg-[#F6E9FF] active:scale-90 transition-all relative"
              title="Notificações e Alertas em Tempo Real"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FF5252] ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Baby Profile Switcher Modal */}
      {showBabySelector && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7E57C2]" />
                <h3 className="font-headline font-bold text-lg text-neutral-800">
                  Perfis de Bebês
                </h3>
              </div>
              <button
                onClick={() => setShowBabySelector(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-neutral-500 mb-3">
              Selecione o bebê para visualizar e gerenciar a rotina atual:
            </p>

            <div className="space-y-2.5">
              {babies.map((b) => {
                const isSelected = b.id === activeBaby.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBabyId(b.id);
                      setShowBabySelector(false);
                      showToast(`Visualizando rotina de ${b.name}`);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'border-[#7E57C2] bg-[#F6E9FF]'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={b.photoUrl}
                        alt={b.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <div>
                        <div className="font-headline font-bold text-neutral-900 text-base">
                          {b.name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {b.monthsAge} meses • {b.gender === 'menino' ? 'Menino' : 'Menina'}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[#7E57C2]">
                        <CheckCircle2 className="w-6 h-6 fill-[#7E57C2] text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PIN Verification Modal for Switching to Parent Admin */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-purple-100 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EDE7F6] text-[#7E57C2] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-lg text-neutral-900">
              Acesso dos Pais
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Digite o PIN de segurança para acessar o modo de gestão e edição:
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="PIN (padrão: 1234)"
                className="w-full text-center text-2xl font-bold tracking-widest py-3 px-4 bg-neutral-50 border border-neutral-300 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#7E57C2] focus:border-transparent"
              />

              {pinError && (
                <p className="text-xs font-semibold text-rose-600">
                  PIN incorreto. Tente "1234".
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-3 rounded-full border border-neutral-300 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#7E57C2] text-white text-sm font-bold hover:bg-[#653DA7] shadow-sm"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Drawer (RN-12 Realtime updates) */}
      {showNotifDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#7E57C2]" />
                <h3 className="font-headline font-bold text-lg text-neutral-800">
                  Notificações dos Pais
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {parentNotifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs font-bold text-[#7E57C2] hover:underline"
                  >
                    Marcar lidas
                  </button>
                )}
                <button
                  onClick={() => setShowNotifDrawer(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {parentNotifications.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#7E57C2]" />
                  <p className="text-sm font-semibold">Tudo tranquilo!</p>
                  <p className="text-xs">Nenhum alerta pendente no momento.</p>
                </div>
              ) : (
                parentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      notif.read
                        ? 'bg-neutral-50/70 border-neutral-200 opacity-70'
                        : 'bg-white border-[#7E57C2]/40 shadow-xs ring-1 ring-[#7E57C2]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#7E57C2]">{notif.title}</span>
                      <span className="text-neutral-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
