import { useState } from 'react';

type EnvItem = {
  envKey: string;
  envValue: string;
};

type SaveFormProps = {
  appInfo: {
    app_name: string;
    url: string;
    technology: string;
    github: string;
    description: string;
  };
  env: EnvItem[];
};

export function useSaveForm() {
  const [loading, setLoading] = useState(false);

  const saveForm = (appInfo: SaveFormProps['appInfo'], env: SaveFormProps['env']) => {
    const payload = {
      appInfo,
      env,
    };

    setLoading(true);
    setTimeout(() => {
      console.log(payload);
      setLoading(false);
    }, 2000);
  };

  return {
    saveForm,
    loading,
  };
}
