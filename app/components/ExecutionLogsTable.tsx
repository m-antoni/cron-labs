import Link from 'next/link';
import { FaCircle, FaClock } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { formatDuration, scheduleFormat } from '@/app/lib/helpers';
import { calculateNextRun, formatLastRun } from '@/app/lib/formatDate';
import { DashboardTypes } from '@/app/types/appTypes';

type ExecutionLogsTableProps = {
  data: DashboardTypes;
};

export default function ExecutionLogsTable({ data }: ExecutionLogsTableProps) {
  return (
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
                    {item.app.appTitle}
                  </Link>
                </td>
                <td>{scheduleFormat(item.app)}</td>
                <td>
                  <FaCheckCircle className="mr-1" /> {formatLastRun(item.createdAt)}
                </td>
                <td>
                  <FaClock className="mr-1" /> {calculateNextRun(item.createdAt, item.app)}
                </td>
                <td>
                  <div className="badge bg-dark">{formatDuration(item.duration)}</div>
                </td>
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
    </div>
  );
}
