export type UserRole = 'pai' | 'baba';

export type CategoryType = 'alimentacao' | 'saude' | 'desenvolvimento' | 'organizacao';

export type RecurrenceType = 'diaria' | 'pontual' | 'dias_especificos';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  monthsAge: number;
  gender: 'menino' | 'menina';
  photoUrl: string;
  allergiesNotes?: string;
  weightKg?: number;
  heightCm?: number;
  focusMode: boolean;
}

export interface NannyProfile {
  id: string;
  name: string;
  phone: string;
  pin: string; // e.g. "1234"
  linkedBabyIds: string[];
  active: boolean;
}

export interface ParentSettings {
  parentNames: string;
  notifyMedicationGiven: boolean;
  notifyTaskDelayMinutes: number;
  notifyNapStartedEnded: boolean;
  notifyDiaperAlerts: boolean;
  dailySummaryTime: string;
}

export interface ActivityItem {
  id: string;
  babyId: string;
  title: string;
  description: string;
  category: CategoryType;
  time: string; // HH:mm
  period: 'manha' | 'almoco' | 'tarde' | 'fim_de_tarde' | 'noite';
  recurrence: RecurrenceType;
  daysOfWeek: number[]; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
  isMedication: boolean;
  medicationDetails?: {
    medicationName: string;
    dosage: string;
    instructions: string;
    repeatEveryHours?: number;
  };
  isNap?: boolean;
  napEstimatedMinutes?: number;
}

export type ExecutionStatus = 'pendente' | 'concluido' | 'nao_realizado';

export interface ExecutionRecord {
  id: string;
  activityId: string;
  babyId: string;
  date: string; // YYYY-MM-DD
  status: ExecutionStatus;
  completedAt?: string; // HH:mm:ss
  completedBy?: string;
  nannyNotes?: string;
  medicationDoseConfirmed?: boolean;
  unperformedReason?: string;
  foodAcceptance?: 'tudo' | 'mais_da_metade' | 'pouco' | 'recusou';
  napDurationMinutes?: number;
}

export interface DiaperLog {
  id: string;
  babyId: string;
  timestamp: string; // ISO
  time: string; // HH:mm
  type: 'xixi' | 'coco' | 'ambos';
  consistency?: 'normal' | 'pastoso' | 'liquido' | 'ressecado';
  ointmentApplied: boolean;
  notes?: string;
}

export interface TemperatureLog {
  id: string;
  babyId: string;
  timestamp: string; // ISO
  time: string; // HH:mm
  celsius: number;
  status: 'normal' | 'atencao' | 'febre';
  notes?: string;
}

export interface ParentNotification {
  id: string;
  title: string;
  message: string;
  category: CategoryType | 'alerta' | 'geral';
  timestamp: string;
  read: boolean;
  babyId: string;
}

export interface CategoryVisualConfig {
  name: string;
  iconName: string;
  accentColor: string;
  surfaceColor: string;
  darkColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}
