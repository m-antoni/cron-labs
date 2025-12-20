import {
  FaCopy,
  FaDownload,
  FaEye,
  FaFileLines,
  FaGear,
  FaMinus,
  FaPen,
  FaPenToSquare,
  FaWandMagicSparkles,
} from 'react-icons/fa6';
import { FaPlusCircle } from 'react-icons/fa';
import { Button, Dropdown } from 'react-bootstrap';
import Link from 'next/link';

type EnvItem = {
  envKey: string;
  envValue: string;
};

type EnvFormProps = {
  env: EnvItem[];
  addNewRow: (v: string) => void;
  removeRow: (v: number) => void;
  onChangeEnv: (index: number, field: 'envKey' | 'envValue', value: string) => void;
  importEnv: () => void;
  disabledInput: () => boolean;
};

export default function EnvForm({
  env,
  addNewRow,
  onChangeEnv,
  removeRow,
  importEnv,
  disabledInput,
}: EnvFormProps) {
  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <h4 className="card-title">Environment Variables</h4>
          <p className="category">Set environment-specific config and secrets (such as API key)</p>
        </div>
        <div>
          <div className="d-flex justify-content-end">
            <Link href="#" className="btn btn-secondary mr-2 px-3">
              <FaPenToSquare size={16} className="text-warning" />
            </Link>
            <Link href="#" className="btn btn-secondary mr-2 px-3">
              <FaCopy size={16} className="text-warning" />
            </Link>
            <Link href="#" className="btn btn-secondary mr-2 px-3">
              <FaDownload size={16} className="text-warning" />
            </Link>
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
                        type="text"
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
                      {/* <div className="d-flex justify-content-end">
                          <Dropdown className="right-dropdown">
                            <Dropdown.Toggle
                              variant="secondary"
                              id="env"
                              className="d-flex justify-content-between align-items-center px-3"
                              bsPrefix="custom-dropdown-toggle"
                            >
                              <span>
                                <FaGear />
                              </span>
                              <span className="custom-caret">▼</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#">
                                <FaEye size={16} className="mr-2" /> View
                              </Dropdown.Item>
                              <Dropdown.Item href="#">
                                <FaCopy size={16} className="mr-2" /> Copy
                              </Dropdown.Item>
                              <Dropdown.Item href="#">
                                <FaPen size={16} className="mr-2" /> Edit
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div> */}
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
              <Dropdown.Item href="#" onClick={() => importEnv()}>
                <FaFileLines size={16} className="mr-2" /> Import from .ENV
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
