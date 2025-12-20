import { useState } from 'react';
import { generate32CharToken } from '@/app/lib/helpers';

type EnvItem = {
  envKey: string;
  envValue: string;
};

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
      setEnv((prev) => [...prev, { envKey: 'NEW_SECRET_KEY', envValue: generateKey }]);
      return;
    }
  };

  // remove input row
  const removeRow = (rowIndex: number): void => {
    if (rowIndex === undefined) return;
    setEnv((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  // import from .env file
  const importEnv = (): void => {
    console.log('IMPORT ENV FILE');
  };

  // disabled the remove button if its only 1 row
  const disabledInput = (): boolean => (env.length === 1 ? true : false);

  // onChange input row
  const onChangeEnv = (index: number, field: 'envKey' | 'envValue', value: string): void => {
    setEnv((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return {
    env,
    addNewRow,
    removeRow,
    importEnv,
    onChangeEnv,
    disabledInput,
  };
}
