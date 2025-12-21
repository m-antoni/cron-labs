type AppFormProps = {
  appInfo: {
    appName: string;
    url: string;
    technology: string;
    github: string;
    description: string;
  };
  onChangeAppInfo: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function AppForm({ appInfo, onChangeAppInfo }: AppFormProps) {
  return (
    <>
      <h4 className="card-title">App Information</h4>
      <div className="row">
        <div className="col-md-6 pr-md-1">
          <div className="form-group">
            <label>
              App Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required={true}
              className="form-control"
              placeholder="ACME Website"
              name="appName"
              value={appInfo.appName}
              onChange={(e) => onChangeAppInfo(e)}
            />
          </div>
        </div>
        <div className="col-md-6 pl-md-1">
          <div className="form-group">
            <label>App URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://www.example.com"
              name="url"
              value={appInfo.url}
              onChange={(e) => onChangeAppInfo(e)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 pr-md-1">
          <div className="form-group">
            <label>Technologies</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nextjs, Nodejs, MongoDB, Supabase, Redis etc."
              name="technology"
              value={appInfo.technology}
              onChange={(e) => onChangeAppInfo(e)}
            />
          </div>
        </div>
        <div className="col-md-6 pl-md-1">
          <div className="form-group">
            <label>Github</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://www.github.com/acme"
              name="github"
              value={appInfo.github}
              onChange={(e) => onChangeAppInfo(e)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Your App description"
              name="description"
              value={appInfo.description}
              onChange={(e) => onChangeAppInfo(e)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
