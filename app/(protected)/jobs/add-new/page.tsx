'use client';

import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import EnvForm from '@/app/components/forms/EnvForm';
import { useEnvForm } from '@/app/hooks/useEnvForm';
import { useSaveForm } from '@/app/hooks/useSaveForm';
import Spinner from '@/app/components/ui/Spinner';
import AlertMessage from '@/app/components/ui/AlertMessage';
import JobForm from '@/app/components/forms/JobForm';
import NotificationForm from '@/app/components/forms/NotificationForm';
import { useNotification } from '@/app/hooks/useNotification';
import { useUser } from '@/app/hooks/useAuth';
import useJob from '@/app/hooks/useJob';
import { ScheduleType } from '@/app/types/appTypes';
import { FaBoltLightning, FaFloppyDisk } from 'react-icons/fa6';

export default function AddNew() {
  // custom hooks
  const { user, isLoading } = useUser();
  const envForm = useEnvForm();
  const { notification, onChangeNotification } = useNotification(user?.email || '');
  const { job, onChangeType, onChangeValue } = useJob();
  const { saveForm, loading, errors } = useSaveForm();

  // submit data
  const handleSave = () => {
    const payload = {
      ...job,
      ...notification,
      env: envForm.env,
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
                    <FaFloppyDisk size={16} className="mr-1" />
                    {loading ? <Spinner text="Saving..." size={19} /> : `Save`}
                  </Button>
                  <Button className="btn btn-primary px-3">
                    <FaBoltLightning size={16} className="mr-1" />
                    Test
                  </Button>
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
                ScheduleType={ScheduleType}
              />
            </div>
          </div>
        </div>
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
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <EnvForm {...envForm} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
