'use client';

import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import EnvForm from '@/app/components/forms/EnvForm';
import AppForm from '@/app/components/forms/AppForm';
import { useEnvForm } from '@/app/hooks/useEnvForm';
import { useAppInfoForm } from '@/app/hooks/useAppInfoForm';
import { useSaveForm } from '@/app/hooks/useSaveForm';
import { Spinner } from '@/app/components/ui/Spinner';

export default function AddNew() {
  // custom hooks
  const appInfoForm = useAppInfoForm();
  const envForm = useEnvForm();
  const { saveForm, loading } = useSaveForm();

  const handleSave = () => {
    saveForm(appInfoForm.appInfo, envForm.env);
    console.log('RUN handleSave');
  };

  return (
    <div className="row">
      <div className="col-md-12">
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
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">App Information</h4>
          </div>
          <div className="card-body">
            {/* APP INFORMATION */}
            <AppForm {...appInfoForm} />
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            {/* ENVIRONMENT VARIABLES */}
            <EnvForm {...envForm} />
          </div>
        </div>
      </div>
    </div>
  );
}
