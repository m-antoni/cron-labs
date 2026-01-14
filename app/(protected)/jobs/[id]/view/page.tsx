'use client';

import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import EnvForm from '@/app/components/forms/EnvForm';
import { useEnv } from '@/app/hooks/useEnv';
import { useSaveForm } from '@/app/hooks/useSaveForm';
import Spinner from '@/app/components/ui/Spinner';
import AlertMessage from '@/app/components/ui/AlertMessage';
import { useParams } from 'next/navigation';
import { getSingleJobAction } from '@/app/actions/jobs';
import useSweetAlert from '@/app/hooks/useSweetAlert';
import useJob from '@/app/hooks/useJob';
import { useNotification } from '@/app/hooks/useNotification';
import { useUser } from '@/app/hooks/useAuth';
import JobForm from '@/app/components/forms/JobForm';
import NotificationForm from '@/app/components/forms/NotificationForm';
import { ScheduleType } from '@/app/types/appTypes';
import { FaBoltLightning, FaTrash } from 'react-icons/fa6';
import { useHeader } from '@/app/hooks/useHeader';
import HeaderForm from '@/app/components/forms/HeaderForm';

export default function ViewDetails() {
  const [_loading, _setLoading] = useState(false);

  // custom hooks
  const { isLoading } = useUser();
  const envs = useEnv();
  const headers = useHeader();
  const { saveForm, loading, errors } = useSaveForm();
  const { showDeleteAlert } = useSweetAlert();
  const { job, onChangeType, onChangeValue, setJob, onChangeMethod } = useJob();
  const { notification, onChangeNotification, setNotification } = useNotification('');

  const { id } = useParams();

  useEffect(() => {
    // self invoke function
    (async () => {
      _setLoading(true);
      const app = await getSingleJobAction(id as string);
      console.log(app);
      if (app) {
        // set job
        setJob({
          id: app.id,
          appTitle: app.appTitle,
          url: app.url,
          description: app.description,
          isEnabled: app.isEnabled,
          scheduleType: app.scheduleType as unknown as ScheduleType,
          intervalMinutes: app.intervalMinutes ?? 2,
          dailyTime: app.dailyTime ?? '07:00',
          monthlyDay: app.monthlyDay ?? 15,
          monthlyTime: app.monthlyTime ?? '09:00',
          method: app.method,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        });
        // set headers
        headers.setHeader(app.headers?.length ? app.headers : headers.header);
        // set email notification
        setNotification({
          notifyOnFailure: app.notifyOnFailure,
          notifyOnRecovery: app.notifyOnRecovery,
          notificationEmail: app.notificationEmail,
        });
        // set env
        envs.setEnv(app.envVariables?.length ? app.envVariables : envs.env);
        _setLoading(false);
      }
    })();
  }, []);

  // submit data / update
  const handleSave = () => {
    const payload = {
      ...job,
      ...notification,
      headers: headers.header,
      env: envs.env,
    };

    saveForm(payload);
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-n2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <Link href={`/jobs`} className="btn btn-secondary px-3">
                  <FaArrowLeft /> Back
                </Link>
              </div>
              <div>
                <Button
                  variant="warning"
                  className="px-3 mr-2"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <Spinner text="Saving..." size={19} /> : `Save`}
                </Button>
                <Link href="#" className="btn btn-secondary px-3 mr-2 text-warning">
                  <FaBoltLightning className="text-warning" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        {errors.filter((err) => err).length > 0 && (
          <AlertMessage errors={errors.filter((err) => err)} />
        )}
      </div>
      {_loading ? (
        <div className="col-md-12 mt-3">
          <Spinner size={100} />
        </div>
      ) : (
        <>
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <JobForm
                  job={job}
                  onChangeValue={onChangeValue}
                  onChangeType={onChangeType}
                  onChangeMethod={onChangeMethod}
                  ScheduleType={ScheduleType}
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <HeaderForm {...headers} />
              </div>
            </div>
          </div>

          {/* <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <NotificationForm
                  notification={notification}
                  onChangeNotification={onChangeNotification}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div> */}

          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <EnvForm {...envs} />
              </div>
            </div>
          </div>

          <div className="col-md-12 pb-5">
            <div className=" d-flex justify-content-end mt-n2">
              <Link
                href="#"
                className="btn btn-secondary px-3 text-warning"
                onClick={() => showDeleteAlert(id as string)}
              >
                <FaTrash size={16} className="mr-1 " />
                Delete
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
