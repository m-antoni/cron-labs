'use client';

import Link from 'next/link';
import { FaEye, FaGear, FaTrash, FaBoltLightning, FaBan } from 'react-icons/fa6';
import Dropdown from 'react-bootstrap/Dropdown';
import useSweetAlert from '@/app/hooks/useSweetAlert';
import { JobFormTypes } from '@/app/types/appTypes';

type ButtonGroupProps = {
  item: JobFormTypes;
  dispatch: { setReload: (v: boolean) => void; reload: boolean };
};

export default function ButtonGroup({ item, dispatch }: ButtonGroupProps) {
  const { showDeleteAlert, showSuccessEnabledAlert } = useSweetAlert();

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
            href={`/jobs/${item.id}/view`}
            className="mt-n1 mb-n1 mr-n3 d-flex align-items-center"
          >
            <FaEye size={16} className="mr-2 ml-n1" /> View
          </Dropdown.Item>

          <Dropdown.Item
            href="#"
            className="mt-n1 mb-n1 mr-n3 d-flex align-items-center"
            onClick={() => showSuccessEnabledAlert(item.id!, dispatch)}
          >
            {item.isEnabled ? (
              <>
                {' '}
                <FaBan size={16} className="mr-2 ml-n1" /> Disable{' '}
              </>
            ) : (
              <>
                <FaBoltLightning size={16} className="mr-2 ml-n1" /> Enable
              </>
            )}
          </Dropdown.Item>

          <Dropdown.Item
            href="#"
            className="mt-n1 mb-n1 mr-n3 d-flex align-items-center"
            onClick={() => showDeleteAlert(item.id!, dispatch)}
          >
            <FaTrash size={16} className="mr-2 ml-n1" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
