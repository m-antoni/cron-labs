export type AppTypes = {
  id: string;
  appName: string;
  url: string;
  technology: string;
  github: string;
  description: string;
  createdAt: string | Date;
  env: EnvItem[];
}[];

export type EnvItem = {
  id?: string;
  envKey: string;
  envValue: string;
  appId?: string;
};

// use for appsform
export type AppFormProps = {
  appInfo: {
    id: string;
    appName: string;
    url: string;
    technology: string;
    github: string;
    description: string;
    env: EnvItem[];
  };
};
