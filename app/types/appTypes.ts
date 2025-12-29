import { App, ExecutionLog } from '@/generated/prisma';

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
  // Notification
  notifyOnFailure: boolean;
  notifyOnRecovery: boolean;
  notificationEmail: string;
  // ENV
  env: EnvItem[];
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
  // Execution Logs
  executionLogs?: ExecutionLogSummary[];
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
