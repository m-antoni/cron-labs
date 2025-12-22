'use client';

import { useState } from 'react';
import { EnvItem } from '../types/appTypes';
import { cleanArray } from '../lib/helpers';

export function useCopyToClipboard(env: EnvItem[]) {
  const [copyStatus, setCopyStatus] = useState(false);
  const [text, setText] = useState('');

  // array to text value
  const arrayToText = () => {
    // clean the array
    const cleanArr = cleanArray(env);

    // format the array to text
    let formattedText: string = '';
    cleanArr.map((item: EnvItem) => {
      formattedText += `${item.envKey}=${item.envValue}\n`;
    });
    setText(formattedText);
  };

  const copyENV = async () => {
    try {
      setCopyStatus(true);
      arrayToText();
      await navigator.clipboard.writeText(text);
      setTimeout(() => setCopyStatus(false), 1200);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    copyENV,
    copyStatus,
    setCopyStatus,
  };
}
