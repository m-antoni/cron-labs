import { useState } from 'react';

export function useAppInfoForm() {
  const [appInfo, setAppInfo] = useState({
    id: '', // use to update action
    appName: '',
    url: '',
    technology: '',
    github: '',
    description: '',
  });

  // onChange of inputs
  const onChangeAppInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setAppInfo((prev) => ({ ...prev, [name]: value }));
  };

  return {
    appInfo,
    onChangeAppInfo,
    setAppInfo,
  };
}
