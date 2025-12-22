'use client';

import Link from 'next/link';
import { FaCopy, FaEye, FaDownload, FaBolt, FaGear, FaTrash } from 'react-icons/fa6';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDeleteWithAlert } from '@/app/hooks/useDeleteWithAlert';
import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard';
import { EnvItem } from '@/app/types/appTypes';

type ButtonGroupProps = {
  id: string;
  dispatch: { setReload: (v: boolean) => void; reload: boolean };
  env: EnvItem[];
};

export default function ButtonGroup({ id, dispatch, env }: ButtonGroupProps) {
  const { showAlert } = useDeleteWithAlert();
  const { copyENV, copyStatus } = useCopyToClipboard(env);

  return (
    <div className="d-flex justify-content-end">
      <Dropdown className="right-dropdown">
        <Dropdown.Toggle
          variant="-secondary"
          id="env-options"
          className="d-flex justify-content-between align-items-center px-3"
          bsPrefix="custom-dropdown-toggle"
        >
          <span>
            <FaGear />
          </span>
          <span className="custom-caret">▼</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-navbar ml-3">
          <Dropdown.Item
            as={Link}
            href={`/dashboard/${id}/view`}
            className="mt-n1 mb-n1 mr-n3 d-flex align-items-center"
          >
            <FaEye size={16} className="mr-2 ml-n1" /> View
          </Dropdown.Item>

          {/* <Dropdown.Item href="#" className="mt-n1 mb-n1 mr-n3 d-flex align-items-center">
            <FaBolt size={16} className="mr-2 ml-n1" /> Cron
          </Dropdown.Item> */}

          <Dropdown.Item
            href="#"
            className="mt-n1 mb-n1 mr-n3 d-flex align-items-center"
            onClick={() => copyENV()}
          >
            <FaCopy size={16} className="mr-2 ml-n1" /> Copy .env
          </Dropdown.Item>

          <Dropdown.Item
            href="#"
            className="mt-n1 mb-n1 mr-n3 d-flex align-items-center"
            onClick={() => showAlert(id, dispatch)}
          >
            <FaTrash size={16} className="mr-2 ml-n1" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
