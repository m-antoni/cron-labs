import { Header } from '@/app/types/appTypes';
import { Button, Dropdown } from 'react-bootstrap';
import { FaPlusCircle } from 'react-icons/fa';
import {
  FaCookie,
  FaCookieBite,
  FaFingerprint,
  FaMinus,
  FaWandMagicSparkles,
} from 'react-icons/fa6';

type HeaderFormProps = {
  header: Header[];
  addHeader: (v: string) => void;
  removeHeader: (v: number) => void;
  onChangeHeader: (index: number, field: 'headerKey' | 'headerValue', value: string) => void;
  disabledHeader: () => boolean;
};

export default function HeaderForm({
  header,
  addHeader,
  removeHeader,
  onChangeHeader,
  disabledHeader,
}: HeaderFormProps) {
  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <h4 className="card-title">HTTP Headers</h4>
          <p className="category">
            Add cookies, API keys, or custom headers to authorize your pings.
          </p>
        </div>
        <div>
          <div className="d-flex justify-content-end"></div>
        </div>
      </div>

      {/* hidden forms to prevenet autofill by browsers */}
      <input type="text" name="fakekey" autoComplete="fake_key" hidden />
      <input type="text" name="fakevalue" autoComplete="fake_value" hidden />

      <div className="table-responsive-md">
        <table className="table tablesorter table table-borderless mx-0 px-0">
          <thead className="text-primary">
            <tr>
              <th className="w-50">KEY</th>
              <th className="w-50">VALUE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {header &&
              header.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        name="headerKey"
                        className="form-control"
                        autoComplete="off"
                        placeholder="Content-Type"
                        value={item.headerKey}
                        onChange={(e) => onChangeHeader(index, 'headerKey', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="headerValue"
                        className="form-control"
                        autoComplete="off"
                        placeholder="applicatin/json"
                        value={item.headerValue}
                        onChange={(e) => onChangeHeader(index, 'headerValue', e.target.value)}
                      />
                    </td>
                    <td className="w-auto">
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="secondary"
                          className="px-3"
                          disabled={disabledHeader()}
                          onClick={() => removeHeader(index)}
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
              <Dropdown.Item href="#" onClick={() => addHeader('add')}>
                <FaPlusCircle size={16} className="mr-2" /> New
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => addHeader('authorization')}>
                <FaFingerprint size={16} className="mr-2" /> Authorization
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => addHeader('cookie_session_id')}>
                <FaCookie size={16} className="mr-2" /> Cookie Session
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => addHeader('cookie_auth_token')}>
                <FaCookieBite size={16} className="mr-2" /> Cookie Auth Token
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => addHeader('generateSecret')}>
                <FaWandMagicSparkles size={16} className="mr-2" /> Generate Secret
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
