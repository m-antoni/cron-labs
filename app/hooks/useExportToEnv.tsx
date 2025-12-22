import { useState } from 'react';
import { EnvItem } from '../types/appTypes';
import { cleanArray } from '../lib/helpers';

export function useExportToEnv(env: EnvItem[]) {
  const [exportStatus, setExportStatus] = useState(false);

  // export .env data to file
  const exportToEnv = async () => {
    if (!env) return;

    try {
      setExportStatus(true);

      const cleanArr = cleanArray(env);

      // array to text value
      let formattedText: string = '';
      await cleanArr.map((item: EnvItem) => {
        formattedText += `${item.envKey}=${item.envValue}\n`;
      });

      // Create a Blob with the env and the correct MIME type
      const blob = new Blob([formattedText], { type: 'text/plain' });

      //  Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a hidden 'a' element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = '.env';

      // Append, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the memory by revoking the URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      console.log('Error to download .env file');
    } finally {
      setTimeout(() => setExportStatus(false), 1200);
    }
  };

  return { exportToEnv, exportStatus };
}
