interface ImportMetaEnv {
  readonly PUBLIC_API: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    auth: {
      user: User | null;
    };
  }
}
