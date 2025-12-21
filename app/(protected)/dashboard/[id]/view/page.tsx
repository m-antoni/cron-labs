'use client';

import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import EnvForm from '@/app/components/forms/EnvForm';
import AppForm from '@/app/components/forms/AppForm';
import { useEnvForm } from '@/app/hooks/useEnvForm';
import { useAppInfoForm } from '@/app/hooks/useAppInfoForm';
import { useSaveForm } from '@/app/hooks/useSaveForm';
import Spinner from '@/app/components/ui/Spinner';
import AlertMessage from '@/app/components/ui/AlertMessage';
import { AppFormProps, AppTypes } from '@/app/types/appTypes';
import { notFound, useParams, usePathname } from 'next/navigation';
import { getSingleAppAction } from '@/app/actions/app';

export default function ViewDetails() {
  // custom hooks
  const appInfoForm = useAppInfoForm();
  const envForm = useEnvForm();
  const { saveForm, loading, errors } = useSaveForm();
  const { id } = useParams();

  useEffect(() => {
    // invoke function
    (async () => {
      const getApp = await getSingleAppAction(id as string);
      if (getApp) {
        appInfoForm.setAppInfo(getApp);
        envForm.setEnv(getApp.env);
      }
    })();
  }, []);

  const handleSave = () => {
    const payload = {
      ...appInfoForm.appInfo,
      env: envForm.env,
    };

    saveForm(payload, id as string);
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-n2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <Link href={`/dashboard`} className="btn btn-secondary px-3">
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
                  {loading ? <Spinner text="Saving..." /> : `Save`}
                </Button>
                <Link href={'/dashboard'} className="btn btn-secondary px-3">
                  Cancel
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
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <AppForm {...appInfoForm} />
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
  );
}
