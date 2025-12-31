'use client';

import { deleteAppAction, isEnableJobAction } from '@/app/actions/jobs';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useState } from 'react';

export default function useDeleteWithAlert() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  type dispatchTypes = {
    setReload: (v: boolean) => void;
    reload: boolean;
  };

  const showDeleteAlert = async (id: string, dispatch?: dispatchTypes) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff8d72',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(true);
        Swal.showLoading();

        // ** Delete action API
        await deleteAppAction(id);

        await Swal.fire({
          title: 'Deleted!',
          text: 'The Item has been removed.',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false,
        });

        router.push('/jobs');
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      } finally {
        setIsDeleting(false);
      }
      //localhost:3000/jobs#

      // ** Reload the page, get API new list
      if (dispatch) {
        dispatch.setReload(!dispatch.reload);
      }
    }
  };

  // Enable/Disabled Status Alert success
  const showSuccessEnabledAlert = async (id: string, dispatch?: dispatchTypes) => {
    try {
      const isEnabled = await isEnableJobAction(id);

      if (isEnabled.success) {
        await Swal.fire({
          title: `Update status success!`,
          text: `Job has been. ${isEnabled.isEnabled ? `Enabled` : `Disabled`}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        // ** Reload the page, get API new list
        if (dispatch) {
          dispatch.setReload(!dispatch.reload);
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  };

  return { showDeleteAlert, isDeleting, showSuccessEnabledAlert };
}
