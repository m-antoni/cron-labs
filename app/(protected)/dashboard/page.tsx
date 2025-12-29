'use client';

import { getScheduleAction } from '@/app/actions/dashboard';
import Spinner from '@/app/components/ui/Spinner';
import { calculateNextRun, formatLastRun } from '@/app/lib/formatDate';
import { formatDuration, scheduleFormat } from '@/app/lib/helpers';
import { DashboardTypes } from '@/app/types/appTypes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';
import { FaCircle, FaClock } from 'react-icons/fa6';

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
      const res = await getScheduleAction(10);
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
                  {/* <Link href={'/jobs/add-new'} className="btn btn-warning px-3 mr-2">
                    Add New
                  </Link> */}
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
                    <table className="table tablesorter">
                      <thead className=" text-primary">
                        <tr>
                          <th>App Title</th>
                          <th>Schedule</th>
                          <th>Last Run </th>
                          <th>Next Run</th>
                          <th>Duration</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.executionLogs.length > 0 &&
                          data.executionLogs.map((item: any) => (
                            <tr key={item.id}>
                              <td>
                                <Link href={`/jobs/${item.app.id}/view`} className="text-info">
                                  <FaClock className="mr-1" />
                                  {item.app.appTitle}
                                </Link>
                              </td>
                              <td>{scheduleFormat(item.app)}</td>
                              <td>{formatLastRun(item.createdAt)}</td>
                              <td>{calculateNextRun(item.createdAt, item.app)}</td>
                              <td>{formatDuration(item.duration)}</td>
                              <td className="text-center">
                                {item.success ? (
                                  <FaCircle size={18} className="text-success" />
                                ) : (
                                  <FaCircle size={18} className="text-danger" />
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {data.executionLogs.length > 0 && (
                      <Link href={`/logs`} className=" btn btn-warning mt-3">
                        View All Logs
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
