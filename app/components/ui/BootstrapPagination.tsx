'use client';

import Pagination from 'rc-pagination';

interface BootstrapPaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
}

export default function BootstrapPagination({
  total,
  pageSize,
  current,
  onChange,
}: BootstrapPaginationProps) {
  return (
    <div className="d-flex justify-content-center pt-2">
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        className="pagination"
        itemRender={(page, type, element) => {
          const isActive = type === 'page' && page === current;

          const labels: Record<string, string | number> = {
            page: page,
            prev: 'Previous',
            next: 'Next',
            'jump-prev': '...',
            'jump-next': '...',
          };

          return (
            <span
              className={`page-link ${isActive ? 'active' : ''}`}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {labels[type]}
            </span>
          );
        }}
      />

      <style jsx global>{`
        /* Remove default rc-pagination styling */
        .pagination {
          display: flex;
          padding-left: 0;
          list-style: none;
        }

        .pagination li {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
        }

        /* Standard Bootstrap Link Style */
        .pagination .page-link {
          position: relative;
          display: block;
          color: #fff; /* White text for your dark theme */
          background-color: #2b3035; /* Darker grey background */
          border: 1px solid #495057;
          padding: 0.375rem 0.75rem;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
          text-decoration: none;
        }

        .pagination .page-link:hover {
          background-color: #3d4246;
          color: #fff;
          border-color: #495057;
        }

        /* Active State (The blue box in your image) */
        .pagination .rc-pagination-item-active .page-link {
          z-index: 3;
          color: #fff !important;
          background-color: #0d6efd !important;
          border-color: #0d6efd !important;
        }

        /* Disabled State (Previous on page 1) */
        .pagination .rc-pagination-disabled .page-link {
          color: #6c757d !important;
          pointer-events: none;
          background-color: #2b3035;
          border-color: #495057;
          opacity: 0.6;
        }

        /* Fix border rounding for corners */
        .pagination .rc-pagination-prev .page-link {
          border-top-left-radius: 0.375rem;
          border-bottom-left-radius: 0.375rem;
        }

        .pagination .rc-pagination-next .page-link {
          border-top-right-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }

        /* Remove double borders between items */
        .pagination li:not(:first-child) .page-link {
          margin-left: -1px;
        }
      `}</style>
    </div>
  );
}
