'use client';

import {
  FaCheck,
  FaCopy,
  FaDownload,
  FaEye,
  FaEyeSlash,
  FaFileLines,
  FaMinus,
  FaWandMagicSparkles,
} from 'react-icons/fa6';
import { FaPlusCircle } from 'react-icons/fa';
import { Button, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { EnvItem } from '@/app/types/appTypes';
import { usePathname } from 'next/navigation';
import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard';
import { useExportToEnv } from '@/app/hooks/useExportToEnv';
import { cleanArray } from '@/app/lib/helpers';

type EnvFormProps = {
  env: EnvItem[];
  addNewRow: (v: string) => void;
  removeRow: (v: number) => void;
  onChangeEnv: (index: number, field: 'envKey' | 'envValue', value: string) => void;
  importEnv: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabledInput: () => boolean;
};

export default function EnvForm({
  env,
  addNewRow,
  removeRow,
  onChangeEnv,
  disabledInput,
  importEnv,
}: EnvFormProps) {
  const [visible, setVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { copyENV, copyStatus } = useCopyToClipboard(env);
  const { exportToEnv, exportStatus } = useExportToEnv(env);

  const page = pathname.split('/')[2];

  const cleanArr = cleanArray(env);

  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <h4 className="card-title">Environment Variables</h4>
          <p className="category">Set environment-specific config and secrets (such as API key)</p>
        </div>
        <div>
          <div className="d-flex justify-content-end">
            <Link
              href="#"
              className="btn btn-secondary mr-2 px-3"
              onClick={() => setVisible(!visible)}
            >
              {visible ? (
                <FaEyeSlash size={16} className="text-warning" />
              ) : (
                <FaEye size={16} className="text-warning" />
              )}
            </Link>
            {page != 'add-new' && (
              <>
                <Link
                  href="#"
                  className="btn btn-secondary mr-2 px-3"
                  onClick={() => env.length > 0 && copyENV()}
                >
                  {copyStatus ? (
                    <FaCheck size={16} className="text-success" />
                  ) : (
                    <FaCopy size={16} className="text-warning" />
                  )}
                </Link>

                {cleanArr.length > 0 && (
                  <Link
                    href="#"
                    className="btn btn-secondary mr-2 px-3"
                    onClick={() => exportToEnv()}
                  >
                    {exportStatus ? (
                      <FaCheck size={16} className="text-success" />
                    ) : (
                      <FaDownload size={16} className="text-warning" />
                    )}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* hidden forms to prevenet autofill by browsers */}
      <input type="text" name="fakeuser" autoComplete="username" hidden />
      <input type="password" name="fakepass" autoComplete="new-password" hidden />

      <div className="table-responsive-md">
        <table className="table tablesorter table table-borderless mx-0 px-0" id="">
          <thead className="text-primary">
            <tr>
              <th className="w-50">KEY</th>
              <th className="w-50">VALUE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {env &&
              env.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        name="envKey"
                        className="form-control"
                        autoComplete="off"
                        value={item.envKey}
                        onChange={(e) => onChangeEnv(index, 'envKey', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type={visible ? 'text' : 'password'}
                        name="envValue"
                        className="form-control"
                        autoComplete="off"
                        value={item.envValue}
                        onChange={(e) => onChangeEnv(index, 'envValue', e.target.value)}
                      />
                    </td>
                    <td className="w-auto">
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="secondary"
                          className="px-3"
                          disabled={disabledInput()}
                          onClick={() => removeRow(index)}
                        >
                          <FaMinus size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="d-flex justify-content-end pb-4">
          <Dropdown className="right-dropdown mr-2">
            <Dropdown.Toggle
              variant="secondary"
              id="env"
              className="d-flex justify-content-between align-items-center px-3"
              bsPrefix="custom-dropdown-toggle"
            >
              <span>Add</span>
              <span className="custom-caret">▼</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#" onClick={() => addNewRow('add')}>
                <FaPlusCircle size={16} className="mr-2" /> New
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => addNewRow('generateSecret')}>
                <FaWandMagicSparkles size={16} className="mr-2" /> Generate Secret
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => fileInputRef.current?.click()}>
                <FaFileLines size={16} className="mr-2" /> Import from .ENV
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Hidden file input */}
          <input type="file" ref={fileInputRef} accept=".env*" onChange={importEnv} hidden />
        </div>
      </div>
    </>
  );
}
