import { useState } from 'react';
import { AppFormProps, ScheduleType } from '@/app/types/appTypes';

export default function useJob() {
  const [job, setJob] = useState({
    id: '', // from DB
    createdAt: new Date(), // from DB
    updatedAt: new Date(), // from DB
    appTitle: '',
    url: '',
    description: '',
    isEnabled: true,
    scheduleType: ScheduleType.MINUTES,
    intervalMinutes: 2, // Matches minuteOptions { value: 2 }
    dailyTime: '07:00', // Matches dailyOptions { value: '07:00' }
    monthlyDay: 15, // Matches daysOfMonth { value: 15 }
    monthlyTime: '09:00', // Matches your new hours/mins generators
  });

  const onChangeType = (type: ScheduleType) => {
    setJob((prev) => ({ ...prev, scheduleType: type }));
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setJob((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'intervalMinutes' || name === 'monthlyDay'
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  return { job, onChangeType, onChangeValue, setJob };
}
