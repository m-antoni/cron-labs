import { useState } from 'react';
import { Header } from '@/app/types/appTypes';
import { generate32CharToken } from '@/app/lib/helpers';

export function useHeader() {
  const [header, setHeader] = useState<Header[]>([{ headerKey: '', headerValue: '' }]);

  // add row
  const addHeader = (type: string): void => {
    const generateKey = generate32CharToken();

    const presets: Record<string, { headerKey: string; headerValue: string }> = {
      add: { headerKey: '', headerValue: '' },
      authorization: { headerKey: 'Authorization', headerValue: `Bearer ${generateKey}` },
      cookie_session_id: { headerKey: 'Cookie', headerValue: `session_id=${generateKey}` },
      cookie_auth_token: { headerKey: 'Cookie', headerValue: `auth_token=${generateKey}` },
      generateSecret: { headerKey: 'x-api-key', headerValue: generateKey },
    };

    const selected = presets[type];
    if (!selected) return;

    setHeader((prev) => {
      const isCookiePreset = type === 'cookie_session_id' || type === 'cookie_auth_token';
      const isUniqueType = ['authorization', 'generateSecret'].includes(type);

      // Determine what key we are looking for to "replace"
      // For cookie presets, we always look for 'cookie'
      const targetKey = isCookiePreset ? 'cookie' : selected.headerKey.toLowerCase();

      // Check if that key already exists anywhere in the list
      const exists = prev.some((h) => h.headerKey.toLowerCase() === targetKey);

      if (exists && (isCookiePreset || isUniqueType)) {
        // PRESERVE ORDER: Map through and replace the value where the key matches
        return prev.map((h) => (h.headerKey.toLowerCase() === targetKey ? selected : h));
      }

      // We check 'prev' (the current state) instead of the external 'header' variable
      const isEmptyPlaceholder =
        prev.length === 1 && !prev[0].headerKey.trim() && !prev[0].headerValue.trim();

      if (isEmptyPlaceholder) {
        return [selected]; // Replace the empty row with our new preset
      }

      // otherwise add
      return [...prev, selected];
    });
  };

  // remove row
  const removeHeader = (rowIndex: number) => {
    if (rowIndex === undefined) return;
    setHeader((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  // disabled the remove button if its only 1 row
  const disabledHeader = (): boolean => (header.length === 1 ? true : false);

  // onChange input row
  const onChangeHeader = (
    index: number,
    field: 'headerKey' | 'headerValue',
    value: string,
  ): void => {
    setHeader((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return {
    header,
    setHeader,
    addHeader,
    removeHeader,
    onChangeHeader,
    disabledHeader,
  };
}
