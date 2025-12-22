'use client';

import { getAppsAction } from '@/app/actions/app';
import ButtonGroup from '@/app/components/ui/ButtonGroup';
import Spinner from '@/app/components/ui/Spinner';
import { formatDate } from '@/app/lib/formatDate';
import { removeDebugInfo } from '@/app/lib/helpers';
import { AppTypes } from '@/app/types/appTypes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [apps, setApps] = useState<AppTypes>([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    // selft invoke function
    (async () => {
      setLoading(true);
      const getApps = await getAppsAction();
      const clean = removeDebugInfo(getApps);
      setApps(clean);
      setLoading(false);
      // console.log(removeDebugInfo(getApps));
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
                  <h4 className="card-title"> List of Applications</h4>
                </div>
                <div>
                  <Link href={'/dashboard/add-new'} className="btn btn-warning px-3">
                    Add New
                  </Link>
                </div>
              </div>
            </div>
            {/* <div className="card-footer d-flex justify-content-end"></div> */}
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
                        <th>App Name</th>
                        <th>Description</th>
                        <th>URL</th>
                        <th className="text-center">Created At</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.length > 0 &&
                        apps.map((item, index) => (
                          <tr key={index}>
                            <td>{item.appName}</td>
                            <td>{item.description}</td>
                            <td>
                              {/* <span className="badge bg-success text-dark">
                               <span className="fs-11">RUNNING</span>
                             </span> */}
                              {item.url}
                            </td>
                            <td className="text-center">
                              {formatDate(item.createdAt, 'YYYY-MM-DD')}
                            </td>
                            <td>
                              <ButtonGroup id={item.id} dispatch={dispatch} env={item.env} />
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
