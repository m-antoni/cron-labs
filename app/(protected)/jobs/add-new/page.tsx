'use client';

import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import EnvForm from '@/app/components/forms/EnvForm';
import { useEnv } from '@/app/hooks/useEnv';
import { useSaveForm } from '@/app/hooks/useSaveForm';
import Spinner from '@/app/components/ui/Spinner';
import AlertMessage from '@/app/components/ui/AlertMessage';
import JobForm from '@/app/components/forms/JobForm';
import NotificationForm from '@/app/components/forms/NotificationForm';
import { useNotification } from '@/app/hooks/useNotification';
import { useUser } from '@/app/hooks/useAuth';
import useJob from '@/app/hooks/useJob';
import { ScheduleType } from '@/app/types/appTypes';
import { FaBoltLightning } from 'react-icons/fa6';
import HeaderForm from '@/app/components/forms/HeaderForm';
import { useHeader } from '@/app/hooks/useHeader';

export default function AddNew() {
  // custom hooks
  const { user, isLoading } = useUser();
  const headers = useHeader();
  const envs = useEnv();
  const { notification, onChangeNotification } = useNotification(user?.email || '');
  const { job, onChangeType, onChangeValue, onChangeMethod } = useJob();
  const { saveForm, loading, errors } = useSaveForm();

  // submit data
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
    <>
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
                    onClick={() => handleSave()}
                    disabled={loading}
                  >
                    {loading ? <Spinner text="Saving..." size={19} /> : `Save`}
                  </Button>
                  <Link href="#" className="btn btn-secondary px-3 text-warning">
                    <FaBoltLightning className="text-warning" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          {errors.filter((err) => err).length > 0 && (
            <AlertMessage errors={errors.filter((err) => err)} />
          )}
        </div>

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

        {/* 
        <div className="col-md-12">
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
      </div>
    </>
  );
}
