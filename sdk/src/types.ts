export interface InitOptions {
  baseUrl: string;
  appId: string;
}

export interface RegisterDeviceOptions {
  externalUserId: string;
  serviceWorkerPath?: string;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
