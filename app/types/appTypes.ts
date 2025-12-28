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
  appTitle: string;
  url: string;
  description: string;
  isEnabled: boolean;
  scheduleType: ScheduleType;
  intervalMinutes: number;
  dailyTime: string;
  monthlyDay: number;
  monthlyTime: string;
};
