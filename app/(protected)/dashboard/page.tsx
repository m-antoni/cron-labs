'use client';

import { getDashboardAction } from '@/app/actions/logs';
import ExecutionLogsTable from '@/app/components/ExecutionLogsTable';
import Spinner from '@/app/components/ui/Spinner';
import { DashboardTypes } from '@/app/types/appTypes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';

export default function Dashboard() {
  const [data, setData] = useState<DashboardTypes>({
    executionLogs: [],
    getJobs: 0,
    getSuccess: 0,
    getFailed: 0,
  });
  const [loading, setloading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // self invoke function
    (async () => {
      setloading(true);
      const res = await getDashboardAction();
      setData(res as DashboardTypes);
      console.log(res);
      setloading(false);
    })();
  }, [refresh]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="card-title">Dashboard</h4>
                </div>
                <div>
                  <Link
                    href="#"
                    className="btn btn-secondary px-3"
                    onClick={() => setRefresh(!refresh)}
                  >
                    <FaSync className="text-warning" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Spinner size={100} />
      ) : (
        <>
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="card-title">Cron Jobs</div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <h1 className="text-primary ">{data.getJobs}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="card-title">Success</div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <h1 className="text-primary ">{data.getSuccess}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="card-title">Failed</div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <h1 className="text-primary">{data.getFailed}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">Cron Job Shedule</div>
                <div className="card-body">
                  <div className="table-responsive-md">
                    <ExecutionLogsTable data={data} />
                  </div>
                  {data.executionLogs.length > 0 && (
                    <Link href={`/logs`} className=" btn btn-secondary btn-sm mt-3">
                      View All Logs
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
