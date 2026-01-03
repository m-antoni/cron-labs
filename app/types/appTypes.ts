import { App, ExecutionLog, HttpMethod } from '@/generated/prisma';

export type AppFormProps = {
  // From DB optional
  id?: string | undefined;
  createdAt?: Date | string | undefined;
  updatedAt?: Date | string | undefined;
  // Job
  appTitle: string;
  url: string;
  description: string;
  isEnabled: boolean;
  scheduleType: ScheduleType;
  intervalMinutes: number;
  dailyTime: string;
  monthlyDay: number;
  monthlyTime: string;
  method: HttpMethod;
  // Notification
  notifyOnFailure: boolean;
  notifyOnRecovery: boolean;
  notificationEmail: string;
  // Headers
  headers?: Header[];
  // ENV
  env?: EnvItem[];
  timezone?: string;
};

export type EnvItem = {
  id?: string;
  appId?: string;
  envKey: string;
  envValue: string;
};

export enum ScheduleType {
  MINUTES = 'MINUTES',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
}

// use in JobForm
export type JobFormTypes = {
  id?: string;
  userId?: string;
  appTitle: string;
  url: string;
  description: string;
  isEnabled: boolean;
  scheduleType: ScheduleType;
  intervalMinutes: number;
  dailyTime: string;
  monthlyDay: number;
  monthlyTime: string;
  method?: HttpMethod;
  header?: Header;
};

export type ExecutionLogSummary = {
  id: string;
  status: number;
  success: boolean;
  duration?: number | null;
  createdAt: Date | string;
};

export type LogWithApp = ExecutionLog & {
  app: App;
};

export type DashboardTypes = {
  executionLogs: LogWithApp[];
  getJobs: number;
  getSuccess: number;
  getFailed: number;
};

export interface AppReference {
  id: string;
  userId: string;
  appTitle: string;
  url: string;
  description: string;
  isEnabled: boolean;
  scheduleType: ScheduleType;
  intervalMinutes: number;
  dailyTime: string;
  monthlyDay: number;
  monthlyTime: string;
  notifyOnFailure: boolean;
  notifyOnRecovery: boolean;
  notificationEmail: string;
  createdAt: Date;
  lastRunAt?: Date;
  timezone: string;
}

export interface ExecutionLogItem {
  // Renamed slightly to avoid Prisma conflicts
  id: string;
  appId: string;
  status: number;
  success: boolean;
  duration: number | null;
  errorMessage: string | null;
  responseBody: string | null;
  createdAt: string | Date;
  app: AppReference; // This allows item.app.id and item.app.appTitle
}

export interface ExecutionLogResponse {
  executionLogs: ExecutionLogItem[];
  totalCount: number;
  totalPages: number;
  success?: boolean;
  error?: string;
}

export type Header = {
  id?: string;
  appId?: string;
  headerKey: string;
  headerValue: string;
};
