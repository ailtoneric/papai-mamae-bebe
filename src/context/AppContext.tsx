import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  ActivityItem,
  BabyProfile,
  DiaperLog,
  ExecutionRecord,
  NannyProfile,
  ParentNotification,
  ParentSettings,
  TemperatureLog,
  UserRole,
} from '../types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_BABIES,
  INITIAL_EXECUTIONS,
  INITIAL_NANNIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PARENT_SETTINGS,
  getSuggestedRoutineForAge,
} from '../data/mockData';
import { babyAudio } from '../utils/audio';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  babies: BabyProfile[];
  activeBabyId: string;
  activeBaby: BabyProfile;
  setActiveBabyId: (id: string) => void;
  addBaby: (babyData: Omit<BabyProfile, 'id'>, loadSuggestedRoutine: boolean) => void;
  updateBaby: (baby: BabyProfile) => void;
  deleteBaby: (id: string) => void;
  nannies: NannyProfile[];
  activeNanny: NannyProfile;
  addNanny: (nannyData: Omit<NannyProfile, 'id'>) => void;
  updateNanny: (nanny: NannyProfile) => void;
  deleteNanny: (id: string) => void;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  activities: ActivityItem[];
  babyActivities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id'>) => void;
  updateActivity: (activity: ActivityItem) => void;
  deleteActivity: (id: string) => void;
  executions: ExecutionRecord[];
  babyExecutions: ExecutionRecord[];
  markActivityCompleted: (
    activityId: string,
    notes?: string,
    medicationConfirmed?: boolean,
    foodAcceptance?: 'tudo' | 'mais_da_metade' | 'pouco' | 'recusou'
  ) => void;
  markActivityUnperformed: (activityId: string, reason: string) => void;
  resetActivityStatus: (activityId: string) => void;
  diaperLogs: DiaperLog[];
  addDiaperLog: (log: Omit<DiaperLog, 'id' | 'timestamp' | 'time'>) => void;
  temperatureLogs: TemperatureLog[];
  addTemperatureLog: (log: Omit<TemperatureLog, 'id' | 'timestamp' | 'time'>) => void;
  parentNotifications: ParentNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  sendParentMessage: (message: string, urgency: 'informativo' | 'importante' | 'urgente') => void;
  parentSettings: ParentSettings;
  updateParentSettings: (settings: Partial<ParentSettings>) => void;
  activeNap: { startTime: number; babyId: string } | null;
  startNap: (babyId: string) => void;
  stopNap: () => number;
  isWhiteNoisePlaying: boolean;
  toggleWhiteNoise: () => void;
  dailyProgress: { completed: number; total: number; percentage: number };
  activeTab: 'rotina' | 'historico' | 'registrar' | 'ajustes';
  setActiveTab: (tab: 'rotina' | 'historico' | 'registrar' | 'ajustes') => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'papai_mamae_bebe_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('baba'); // Starts in Baba Mode as requested in the mockup!
  const [activeTab, setActiveTab] = useState<'rotina' | 'historico' | 'registrar' | 'ajustes'>('rotina');
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-24'); // Qua 24 as in the design

  // Persistence initialization
  const [babies, setBabies] = useState<BabyProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_babies`);
    return saved ? JSON.parse(saved) : INITIAL_BABIES;
  });

  const [activeBabyId, setActiveBabyId] = useState<string>(() => {
    return babies[0]?.id || 'baby-theo';
  });

  const [nannies, setNannies] = useState<NannyProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_nannies`);
    return saved ? JSON.parse(saved) : INITIAL_NANNIES;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [executions, setExecutions] = useState<ExecutionRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_executions`);
    return saved ? JSON.parse(saved) : INITIAL_EXECUTIONS;
  });

  const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_diapers`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'diaper-1',
        babyId: 'baby-theo',
        timestamp: new Date().toISOString(),
        time: '07:45',
        type: 'ambos',
        consistency: 'normal',
        ointmentApplied: true,
        notes: 'Fralda da manhã trocada.',
      }
    ];
  });

  const [temperatureLogs, setTemperatureLogs] = useState<TemperatureLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_temps`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'temp-1',
        babyId: 'baby-theo',
        timestamp: new Date().toISOString(),
        time: '08:15',
        celsius: 36.5,
        status: 'normal',
        notes: 'Temperatura perfeitamente normal.',
      }
    ];
  });

  const [parentNotifications, setParentNotifications] = useState<ParentNotification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_PARENT_SETTINGS;
  });

  const [activeNap, setActiveNap] = useState<{ startTime: number; babyId: string } | null>(null);
  const [isWhiteNoisePlaying, setIsWhiteNoisePlaying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_babies`, JSON.stringify(babies));
  }, [babies]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_nannies`, JSON.stringify(nannies));
  }, [nannies]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_activities`, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_executions`, JSON.stringify(executions));
  }, [executions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_diapers`, JSON.stringify(diaperLogs));
  }, [diaperLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_temps`, JSON.stringify(temperatureLogs));
  }, [temperatureLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(parentNotifications));
  }, [parentNotifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(parentSettings));
  }, [parentSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const activeBaby = useMemo(() => {
    return babies.find((b) => b.id === activeBabyId) || babies[0];
  }, [babies, activeBabyId]);

  const activeNanny = useMemo(() => {
    return nannies[0] || INITIAL_NANNIES[0];
  }, [nannies]);

  const babyActivities = useMemo(() => {
    return activities
      .filter((a) => a.babyId === activeBabyId)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [activities, activeBabyId]);

  const babyExecutions = useMemo(() => {
    return executions.filter((e) => e.babyId === activeBabyId && e.date === selectedDate);
  }, [executions, activeBabyId, selectedDate]);

  // RN-13: Daily summary calculation
  const dailyProgress = useMemo(() => {
    const total = babyActivities.length;
    if (total === 0) return { completed: 0, total: 0, percentage: 0 };
    const completedCount = babyExecutions.filter((e) => e.status === 'concluido').length;
    const percentage = Math.round((completedCount / total) * 100);
    return { completed: completedCount, total, percentage };
  }, [babyActivities, babyExecutions]);

  // RN-05 & RN-06: Add Baby and generate age-based template
  const addBaby = (babyData: Omit<BabyProfile, 'id'>, loadSuggestedRoutine: boolean) => {
    const newId = `baby-${Date.now()}`;
    const newBaby: BabyProfile = {
      ...babyData,
      id: newId,
    };
    setBabies((prev) => [...prev, newBaby]);
    setActiveBabyId(newId);

    if (loadSuggestedRoutine) {
      const routine = getSuggestedRoutineForAge(newBaby.monthsAge, newId);
      setActivities((prev) => [...prev, ...routine]);
      showToast(`Bebê ${newBaby.name} cadastrado com rotina sugerida de ${newBaby.monthsAge} meses!`);
    } else {
      showToast(`Bebê ${newBaby.name} cadastrado.`);
    }
  };

  const updateBaby = (updated: BabyProfile) => {
    setBabies((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    showToast(`Perfil de ${updated.name} atualizado!`);
  };

  const deleteBaby = (id: string) => {
    if (babies.length <= 1) {
      showToast('Você precisa manter ao menos um bebê cadastrado.');
      return;
    }
    setBabies((prev) => prev.filter((b) => b.id !== id));
    setActivities((prev) => prev.filter((a) => a.babyId !== id));
    const nextBaby = babies.find((b) => b.id !== id);
    if (nextBaby) setActiveBabyId(nextBaby.id);
    showToast('Perfil de bebê removido.');
  };

  // Nanny management
  const addNanny = (nannyData: Omit<NannyProfile, 'id'>) => {
    const newId = `nanny-${Date.now()}`;
    const newNanny: NannyProfile = { ...nannyData, id: newId };
    setNannies((prev) => [...prev, newNanny]);
    showToast(`Babá ${newNanny.name} vinculada com PIN ${newNanny.pin}!`);
  };

  const updateNanny = (updated: NannyProfile) => {
    setNannies((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    showToast('Dados da babá atualizados.');
  };

  const deleteNanny = (id: string) => {
    setNannies((prev) => prev.filter((n) => n.id !== id));
    showToast('Babá desvinculada.');
  };

  // Activities management (RN-02)
  const addActivity = (actData: Omit<ActivityItem, 'id'>) => {
    const newId = `act-${Date.now()}`;
    const newAct: ActivityItem = { ...actData, id: newId };
    setActivities((prev) => [...prev, newAct]);
    showToast(`Atividade "${newAct.title}" adicionada à rotina!`);
  };

  const updateActivity = (act: ActivityItem) => {
    setActivities((prev) => prev.map((a) => (a.id === act.id ? act : a)));
    showToast(`Atividade "${act.title}" atualizada.`);
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setExecutions((prev) => prev.filter((e) => e.activityId !== id));
    showToast('Atividade removida da rotina.');
  };

  // RN-09 & RN-11: Complete task
  const markActivityCompleted = (
    activityId: string,
    notes?: string,
    medicationConfirmed?: boolean,
    foodAcceptance?: 'tudo' | 'mais_da_metade' | 'pouco' | 'recusou'
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const targetActivity = activities.find((a) => a.id === activityId);

    setExecutions((prev) => {
      const existing = prev.find(
        (e) => e.activityId === activityId && e.babyId === activeBabyId && e.date === selectedDate
      );
      if (existing) {
        return prev.map((e) =>
          e.id === existing.id
            ? {
                ...e,
                status: 'concluido',
                completedAt: timeStr,
                completedBy: activeNanny.name,
                nannyNotes: notes !== undefined ? notes : e.nannyNotes,
                medicationDoseConfirmed: medicationConfirmed ?? e.medicationDoseConfirmed,
                foodAcceptance: foodAcceptance ?? e.foodAcceptance,
                unperformedReason: undefined,
              }
            : e
        );
      } else {
        const newRecord: ExecutionRecord = {
          id: `exec-${Date.now()}`,
          activityId,
          babyId: activeBabyId,
          date: selectedDate,
          status: 'concluido',
          completedAt: timeStr,
          completedBy: activeNanny.name,
          nannyNotes: notes,
          medicationDoseConfirmed: medicationConfirmed,
          foodAcceptance,
        };
        return [...prev, newRecord];
      }
    });

    // Tactile Audio feedback
    babyAudio.playTaskChime();

    // RN-12: Push Notification to parents
    if (targetActivity) {
      const notifTitle = targetActivity.isMedication
        ? `Remédio ministrado: ${targetActivity.title}`
        : `Concluído: ${targetActivity.title}`;
      const notifMsg = `${activeNanny.name} concluiu às ${timeStr} para o ${activeBaby.name}.${
        notes ? ` Registro: "${notes}"` : ''
      }`;

      const newNotif: ParentNotification = {
        id: `notif-${Date.now()}`,
        title: notifTitle,
        message: notifMsg,
        category: targetActivity.category,
        timestamp: timeStr,
        read: false,
        babyId: activeBabyId,
      };

      setParentNotifications((prev) => [newNotif, ...prev]);
      showToast(`✓ ${targetActivity.title} concluído!`);
    }
  };

  // RN-10: Exception flow (Não Realizado com motivo obrigatório)
  const markActivityUnperformed = (activityId: string, reason: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const targetActivity = activities.find((a) => a.id === activityId);

    setExecutions((prev) => {
      const existing = prev.find(
        (e) => e.activityId === activityId && e.babyId === activeBabyId && e.date === selectedDate
      );
      if (existing) {
        return prev.map((e) =>
          e.id === existing.id
            ? {
                ...e,
                status: 'nao_realizado',
                unperformedReason: reason,
                completedAt: timeStr,
                completedBy: activeNanny.name,
              }
            : e
        );
      } else {
        const newRecord: ExecutionRecord = {
          id: `exec-${Date.now()}`,
          activityId,
          babyId: activeBabyId,
          date: selectedDate,
          status: 'nao_realizado',
          unperformedReason: reason,
          completedAt: timeStr,
          completedBy: activeNanny.name,
        };
        return [...prev, newRecord];
      }
    });

    // Notification to parents
    if (targetActivity) {
      const newNotif: ParentNotification = {
        id: `notif-${Date.now()}`,
        title: `Não Realizado: ${targetActivity.title}`,
        message: `Motivo registrado por ${activeNanny.name}: "${reason}"`,
        category: 'alerta',
        timestamp: timeStr,
        read: false,
        babyId: activeBabyId,
      };
      setParentNotifications((prev) => [newNotif, ...prev]);
      showToast(`Marcado como Não Realizado: ${reason}`);
    }
  };

  const resetActivityStatus = (activityId: string) => {
    setExecutions((prev) =>
      prev.filter(
        (e) => !(e.activityId === activityId && e.babyId === activeBabyId && e.date === selectedDate)
      )
    );
    showToast('Status da atividade reiniciado.');
  };

  // Quick Logs (Apontamentos em 1 Toque)
  const addDiaperLog = (log: Omit<DiaperLog, 'id' | 'timestamp' | 'time'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newLog: DiaperLog = {
      ...log,
      id: `diaper-${Date.now()}`,
      timestamp: now.toISOString(),
      time: timeStr,
    };
    setDiaperLogs((prev) => [newLog, ...prev]);

    // Parent notification
    const typeLabel =
      log.type === 'ambos' ? 'xixi e cocô' : log.type === 'coco' ? 'cocô' : 'xixi';
    const newNotif: ParentNotification = {
      id: `notif-${Date.now()}`,
      title: `Troca de Fralda (${typeLabel.toUpperCase()})`,
      message: `${activeNanny.name} trocou a fralda do ${activeBaby.name} às ${timeStr}.${
        log.ointmentApplied ? ' Pomada aplicada.' : ''
      }${log.notes ? ` Nota: ${log.notes}` : ''}`,
      category: 'organizacao',
      timestamp: timeStr,
      read: false,
      babyId: activeBabyId,
    };
    setParentNotifications((prev) => [newNotif, ...prev]);
    showToast(`Fralda de ${activeBaby.name} registrada com sucesso!`);
  };

  const addTemperatureLog = (log: Omit<TemperatureLog, 'id' | 'timestamp' | 'time'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newLog: TemperatureLog = {
      ...log,
      id: `temp-${Date.now()}`,
      timestamp: now.toISOString(),
      time: timeStr,
    };
    setTemperatureLogs((prev) => [newLog, ...prev]);

    if (log.status !== 'normal') {
      const newNotif: ParentNotification = {
        id: `notif-${Date.now()}`,
        title: `Alerta de Temperatura (${log.celsius.toFixed(1)}°C)`,
        message: `Atenção: ${activeNanny.name} registrou ${log.celsius.toFixed(1)}°C para o ${activeBaby.name} às ${timeStr}!`,
        category: 'alerta',
        timestamp: timeStr,
        read: false,
        babyId: activeBabyId,
      };
      setParentNotifications((prev) => [newNotif, ...prev]);
    }

    showToast(`Temperatura de ${log.celsius.toFixed(1)}°C registrada!`);
  };

  // Recado para os pais
  const sendParentMessage = (message: string, urgency: 'informativo' | 'importante' | 'urgente') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newNotif: ParentNotification = {
      id: `notif-${Date.now()}`,
      title: urgency === 'urgente' ? 'URGENTE: Recado da Babá' : 'Recado da Babá',
      message: `Mariana: "${message}"`,
      category: urgency === 'urgente' ? 'alerta' : 'geral',
      timestamp: timeStr,
      read: false,
      babyId: activeBabyId,
    };
    setParentNotifications((prev) => [newNotif, ...prev]);
    showToast('Recado enviado diretamente aos Pais!');
  };

  const markNotificationRead = (id: string) => {
    setParentNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setParentNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateParentSettings = (settings: Partial<ParentSettings>) => {
    setParentSettings((prev) => ({ ...prev, ...settings }));
    showToast('Configurações atualizadas!');
  };

  // Nap timer with white noise
  const startNap = (babyId: string) => {
    setActiveNap({ startTime: Date.now(), babyId });
    showToast('Soneca iniciada! Timer ativo.');
  };

  const stopNap = (): number => {
    if (!activeNap) return 0;
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - activeNap.startTime) / 60000));
    setActiveNap(null);
    if (isWhiteNoisePlaying) {
      babyAudio.toggleWhiteNoise();
      setIsWhiteNoisePlaying(false);
    }
    showToast(`Soneca finalizada: ${elapsedMinutes} minutos registrados!`);
    return elapsedMinutes;
  };

  const toggleWhiteNoise = () => {
    const playing = babyAudio.toggleWhiteNoise();
    setIsWhiteNoisePlaying(playing);
    if (playing) {
      showToast('Ruído branco suave ativado.');
    } else {
      showToast('Ruído branco pausado.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        babies,
        activeBabyId,
        activeBaby,
        setActiveBabyId,
        addBaby,
        updateBaby,
        deleteBaby,
        nannies,
        activeNanny,
        addNanny,
        updateNanny,
        deleteNanny,
        selectedDate,
        setSelectedDate,
        activities,
        babyActivities,
        addActivity,
        updateActivity,
        deleteActivity,
        executions,
        babyExecutions,
        markActivityCompleted,
        markActivityUnperformed,
        resetActivityStatus,
        diaperLogs,
        addDiaperLog,
        temperatureLogs,
        addTemperatureLog,
        parentNotifications,
        markNotificationRead,
        clearNotifications,
        sendParentMessage,
        parentSettings,
        updateParentSettings,
        activeNap,
        startNap,
        stopNap,
        isWhiteNoisePlaying,
        toggleWhiteNoise,
        dailyProgress,
        activeTab,
        setActiveTab,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
