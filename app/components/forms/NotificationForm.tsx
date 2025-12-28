type NotificationFormProps = {
  notification: {
    notifyOnFailure: boolean;
    notifyOnRecovery: boolean;
    notificationEmail: string;
  };
  onChangeNotification: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean; // came from userAuth
};

export default function NotificationForm({
  notification,
  onChangeNotification,
  isLoading,
}: NotificationFormProps) {
  return (
    <>
      <h4 className="card-title">Notification Settings</h4>
      <p className="category"></p>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="form-group">
            <div className="d-flex">
              <label className="text-white mr-3">When cron job has failed.</label>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  name="notifyOnFailure"
                  checked={notification.notifyOnFailure}
                  onChange={onChangeNotification}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row ">
        <div className="col-md-6">
          <div className="form-group">
            <div className="d-flex">
              <label className="text-white mr-3">
                When cron job succeeds after it failed before.
              </label>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  name="notifyOnRecovery"
                  checked={notification.notifyOnRecovery}
                  onChange={onChangeNotification}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="text-white">Your Email</label>
            <input
              type="text"
              className="form-control"
              placeholder={isLoading ? 'Loading your user email.' : 'Your email here'}
              name="notificationEmail"
              onChange={onChangeNotification}
              value={notification.notificationEmail}
            />
          </div>
        </div>
      </div>
    </>
  );
}
