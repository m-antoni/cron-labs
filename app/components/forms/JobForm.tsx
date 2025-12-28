'use client';

import { JobFormTypes, ScheduleType } from '@/app/types/appTypes';
import Select, { StylesConfig } from 'react-select';

// --- Types and Data Generators ---
interface Option {
  value: string | number;
  label: string;
}

const minuteOptions: Option[] = [
  { value: 2, label: '2 minutes' },
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
];

const dailyOptions: Option[] = [
  { value: '07:00', label: '07:00' },
  { value: '09:00', label: '09:00' },
  { value: '12:00', label: '12:00' },
  { value: '19:00', label: '19:00' },
  { value: '00:00', label: '00:00' },
];

// Generate 1 to 31 (Numbers for Prisma)
const daysOfMonth: Option[] = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));

// Generate 00 to 23 (Formatted with leading zeros to match split strings)
const hours: Option[] = Array.from({ length: 24 }, (_, i) => {
  const val = i < 10 ? `0${i}` : `${i}`;
  return { value: val, label: val };
});

// Generate 00 to 59
const mins: Option[] = Array.from({ length: 60 }, (_, i) => {
  const val = i < 10 ? `0${i}` : `${i}`;
  return { value: val, label: val };
});

// --- React Select Styles ---
const inlineSelectStyles: StylesConfig<Option, false> = {
  control: (base) => ({
    ...base,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #666',
    borderRadius: '0',
    minHeight: 'auto',
    boxShadow: 'none',
    '&:hover': { borderBottomColor: '#e14eca' },
  }),
  valueContainer: (base) => ({ ...base, padding: '0 4px' }),
  singleValue: (base) => ({ ...base, color: 'white', margin: 0 }),
  input: (base) => ({ ...base, color: 'white' }),
  dropdownIndicator: (base) => ({ ...base, padding: '0 2px', color: '#666' }),
  indicatorSeparator: () => ({ display: 'none' }),
  menu: (base) => ({
    ...base,
    background: '#1e1e2f',
    border: '1px solid #444',
    zIndex: 999,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? '#e14eca' : isFocused ? '#344675' : 'transparent',
    color: 'white',
    cursor: 'pointer',
  }),
};

// Define an interface for the props
type JobFormProps = {
  job: JobFormTypes; // Ideally, use your Job type here
  onChangeValue: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  onChangeType: (type: ScheduleType) => void;
  ScheduleType: typeof ScheduleType;
};
export default function JobForm({ job, onChangeValue, onChangeType, ScheduleType }: JobFormProps) {
  return (
    <>
      <h4 className="card-title">Cron Job</h4>
      <div className="row d-flex">
        <div className="col-md-6">
          <div className="form-group">
            <label className="text-white">
              App Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="My App Name"
              name="appTitle"
              value={job.appTitle}
              onChange={onChangeValue}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end mr-n4">
            <div className="d-flex align-items-center">
              <div className="text-white mr-3">Enable Job</div>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  name="isEnabled"
                  checked={job.isEnabled}
                  onChange={onChangeValue}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="text-white">
              URL <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="https://api.myapp.com"
              name="url"
              value={job.url}
              onChange={onChangeValue}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="text-white">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Your app description"
              name="description"
              value={job.description}
              onChange={onChangeValue}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 ml-1 mt-4">
          <label className="text-white font-weight-bold">Execution Schedule</label>

          {/* Row A: Minutes */}
          <div
            className={`cron-row mt-3 ${
              job.scheduleType !== ScheduleType.MINUTES ? 'opacity-50' : ''
            }`}
          >
            <input
              type="radio"
              className="cron-radio"
              name="scheduleType"
              checked={job.scheduleType === ScheduleType.MINUTES}
              onChange={() => onChangeType(ScheduleType.MINUTES)}
            />
            <span className="mx-2">Every</span>
            <div className="select-wrapper w-minute">
              <Select
                options={minuteOptions}
                value={
                  minuteOptions.find((opt) => opt.value === job.intervalMinutes) || minuteOptions[1]
                }
                onChange={(opt) =>
                  onChangeValue({ target: { name: 'intervalMinutes', value: opt?.value } } as any)
                }
                isDisabled={job.scheduleType !== ScheduleType.MINUTES}
                styles={inlineSelectStyles}
                isSearchable={false}
              />
            </div>
          </div>

          {/* Row B: Daily */}
          <div
            className={`cron-row ${job.scheduleType !== ScheduleType.DAILY ? 'opacity-50' : ''}`}
          >
            <input
              type="radio"
              className="cron-radio"
              name="scheduleType"
              checked={job.scheduleType === ScheduleType.DAILY}
              onChange={() => onChangeType(ScheduleType.DAILY)}
            />
            <span className="mx-2">Every day at</span>
            <div className="select-wrapper w-time">
              <Select
                options={dailyOptions}
                value={dailyOptions.find((opt) => opt.value === job.dailyTime) || dailyOptions[0]}
                onChange={(opt) =>
                  onChangeValue({ target: { name: 'dailyTime', value: opt?.value } } as any)
                }
                isDisabled={job.scheduleType !== ScheduleType.DAILY}
                styles={inlineSelectStyles}
                isSearchable={false}
              />
            </div>
          </div>

          {/* Row C: Monthly */}
          <div
            className={`cron-row ${job.scheduleType !== ScheduleType.MONTHLY ? 'opacity-50' : ''}`}
          >
            <input
              type="radio"
              className="cron-radio"
              name="scheduleType"
              checked={job.scheduleType === ScheduleType.MONTHLY}
              onChange={() => onChangeType(ScheduleType.MONTHLY)}
            />
            <span className="mx-2">Every</span>
            <div className="select-wrapper w-day-num">
              <Select
                options={daysOfMonth}
                value={daysOfMonth.find((opt) => opt.value === job.monthlyDay) || daysOfMonth[14]}
                onChange={(opt) =>
                  onChangeValue({ target: { name: 'monthlyDay', value: opt?.value } } as any)
                }
                isDisabled={job.scheduleType !== ScheduleType.MONTHLY}
                styles={inlineSelectStyles}
              />
            </div>
            <span className="mx-2">of the month at</span>

            <div className="select-wrapper w-day-num">
              <Select
                options={hours}
                value={hours.find((opt) => opt.value === job.monthlyTime.split(':')[0]) || hours[9]}
                onChange={(opt) => {
                  const currentMins = job.monthlyTime.split(':')[1];
                  onChangeValue({
                    target: { name: 'monthlyTime', value: `${opt?.value}:${currentMins}` },
                  } as any);
                }}
                isDisabled={job.scheduleType !== ScheduleType.MONTHLY}
                styles={inlineSelectStyles}
              />
            </div>
            <span className="mx-1">:</span>
            <div className="select-wrapper w-day-num">
              <Select
                options={mins}
                value={mins.find((opt) => opt.value === job.monthlyTime.split(':')[1]) || mins[0]}
                onChange={(opt) => {
                  const currentHour = job.monthlyTime.split(':')[0];
                  onChangeValue({
                    target: { name: 'monthlyTime', value: `${currentHour}:${opt?.value}` },
                  } as any);
                }}
                isDisabled={job.scheduleType !== ScheduleType.MONTHLY}
                styles={inlineSelectStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
