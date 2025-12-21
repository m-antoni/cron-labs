import { useState } from 'react';
import { generate32CharToken, isSingleEmpty } from '@/app/lib/helpers';
import { EnvItem } from '@/app/types/appTypes';

export function useEnvForm() {
  const [env, setEnv] = useState<EnvItem[]>([{ envKey: '', envValue: '' }]);

  // add input row
  const addNewRow = (type: string): void => {
    if (type === 'add') {
      setEnv((prev) => [...prev, { envKey: '', envValue: '' }]);
      return;
    }

    if (type === 'generateSecret') {
      const generateKey = generate32CharToken();

      if (isSingleEmpty(env, 'envKey', 'envValue')) {
        setEnv([{ envKey: 'NEW_SECRET_KEY', envValue: generateKey }]);
      } else {
        setEnv((prev) => [...prev, { envKey: 'NEW_SECRET_KEY', envValue: generateKey }]);
      }
      return;
    }
  };

  // remove input row
  const removeRow = (rowIndex: number): void => {
    if (rowIndex === undefined) return;
    setEnv((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  // disabled the remove button if its only 1 row
  const disabledInput = (): boolean => (env.length === 1 ? true : false);

  // onChange input row
  const onChangeEnv = (index: number, field: 'envKey' | 'envValue', value: string): void => {
    setEnv((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  // import from .env file
  const importEnv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow only .env or .env.*
    if (!file.name.startsWith('.env')) {
      e.target.value = '';
      return; // stop processing
    }

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        // read the text from .env file
        const lines = text.split(/\r?\n/);
        const newRows: EnvItem[] = lines
          .map((line) => line.trim())
          // skip empty lines and comments
          .filter((line) => line && !line.startsWith('#') && line.includes('='))
          .map((line) => {
            const [key, ...rest] = line.split('=');
            return { envKey: key.trim(), envValue: rest.join('=').trim() };
          });

        // if the env is empty populate
        if (isSingleEmpty(env, 'envKey', 'envValue')) {
          setEnv(newRows);
        } else {
          setEnv((prev) => [...prev, ...newRows]);
        }
      } else {
        console.error('Failed to read file as text');
      }
    };

    reader.readAsText(file);

    // Reset input to allow re-importing the same file
    e.target.value = '';
  };

  return {
    env,
    setEnv,
    addNewRow,
    removeRow,
    importEnv,
    onChangeEnv,
    disabledInput,
  };
}
