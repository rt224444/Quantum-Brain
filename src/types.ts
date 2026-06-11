export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  estimatedMinutes: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'backlog';
  xpReward: number;
  coinReward: number;
  subTasks: SubTask[];
  deadline: string;
  isAIGenerated: boolean;
  category: string;
}

export interface BlockerShield {
  id: string;
  name: string;
  description: string;
  cost: number;
  active: boolean;
  icon: string;
  durationMinutes: number;
}

export type TicketType = 'feedback' | 'support' | 'remediation';

export interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'Open' | 'InProgress' | 'Resolved';
  type: TicketType;
  response?: string;
  automatedReplySent: boolean;
}

export interface SyncedCalendarEvent {
  id: string;
  title: string;
  source: 'google' | 'outlook';
  start: string;
  end: string;
  syncedAt: string;
  importedAsQuest: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  xpNext: number;
  coins: number;
  streak: number;
  petLevel: number;
  petExp: number;
  petName: string;
  petHappiness: number; // 0 to 100
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

export interface PaymentProfile {
  status: 'active' | 'remediation_required' | 'unlicensed';
  reason: string;
  balanceDue: number;
  paymentMethod: string;
  lastRenewalDate: string;
  nextRenewalDate: string;
  invoiceHistory: Invoice[];
  unlimitedAIAccess: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  syncedToSheets: boolean;
}
