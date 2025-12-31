'use client';

import { getExecutionLogs } from '@/app/actions/logs';
import ExecutionLogsTable from '@/app/components/ExecutionLogsTable';
import BootstrapPagination from '@/app/components/ui/BootstrapPagination';
import Spinner from '@/app/components/ui/Spinner';
import { ExecutionLogResponse } from '@/app/types/appTypes';
import { useEffect, useState, useCallback } from 'react';
import { FaSync } from 'react-icons/fa';

export default function Logs() {
  const [data, setData] = useState<ExecutionLogResponse>({
    executionLogs: [],
    totalCount: 0,
    totalPages: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const pageSize = 15;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExecutionLogs(currentPage);
      setData(res);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, refresh]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="card-title">Logs</h4>
                <button
                  className="btn btn-secondary px-3"
                  onClick={() => setRefresh((prev) => !prev)}
                  disabled={loading}
                >
                  <FaSync className={`text-warning ${loading ? 'fa-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner size={100} />
      ) : (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Cron Job Schedule</div>
              <div className="card-body">
                <div className="table-responsive-md">
                  <ExecutionLogsTable data={data} />
                  <BootstrapPagination
                    total={data.totalCount}
                    pageSize={pageSize}
                    current={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
