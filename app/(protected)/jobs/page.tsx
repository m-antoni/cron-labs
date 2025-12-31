'use client';

import { getAppsAction } from '@/app/actions/jobs';
import ButtonGroup from '@/app/components/ui/ButtonGroup';
import Spinner from '@/app/components/ui/Spinner';
import { formatDate } from '@/app/lib/formatDate';
import { removeDebugInfo, scheduleFormat, truncateUrl } from '@/app/lib/helpers';
import { AppFormProps } from '@/app/types/appTypes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CronJobs() {
  const [apps, setApps] = useState<AppFormProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    // self invoke function
    (async () => {
      setLoading(true);
      const getApps = await getAppsAction();
      const clean = removeDebugInfo(getApps);
      setApps(clean);
      setLoading(false);
    })();
  }, [reload]);

  // Pass as Props to ButtonGroup
  const dispatch = {
    reload,
    setReload,
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="card-title"> List of Cron Jobs</h4>
                </div>
                <div>
                  <Link href={'/jobs/add-new'} className="btn btn-warning px-3">
                    Add New
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="col-12 mt-3">
            <Spinner size={100} />
          </div>
        ) : (
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header"></div>
              <div className="card-body">
                <div className="table-responsive-md">
                  <table className="table tablesorter">
                    <thead className=" text-primary">
                      <tr>
                        <th>App Title</th>
                        <th>URL</th>
                        <th className="text-center">Status </th>
                        <th className="text-center">Schedule</th>
                        <th className="text-center">Schedule</th>
                        <th className="text-center">Created At</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.length > 0 &&
                        apps.map((item, index) => (
                          <tr key={index}>
                            <td>{item.appTitle}</td>
                            <td>{truncateUrl(item.url, 30)}</td>
                            <td className="text-center">
                              {item.isEnabled ? (
                                <span className="badge bg-success text-dark">
                                  <span className="fs-11">ACTIVE</span>
                                </span>
                              ) : (
                                <span className="badge bg-dark">
                                  <span className="fs-11">DISABLED</span>
                                </span>
                              )}
                            </td>

                            <td className="text-center">{scheduleFormat(item)}</td>

                            <td className="text-center">
                              {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
                            </td>
                            <td>
                              <ButtonGroup id={item.id!} dispatch={dispatch} env={item.env || []} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
