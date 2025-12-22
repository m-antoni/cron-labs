'use client';

import { deleteAppAction } from '@/app/actions/app';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useState } from 'react';

export function useDeleteWithAlert() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  type dispatchTypes = {
    setReload: (v: boolean) => void;
    reload: boolean;
  };

  const showAlert = async (id: string, dispatch?: dispatchTypes) => {
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

        router.push('/dashboard');
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      } finally {
        setIsDeleting(false);
      }

      // ** Reload the page, get API new list
      dispatch?.reload && dispatch.setReload(!dispatch.reload);
    }
  };

  return { showAlert, isDeleting };
}
