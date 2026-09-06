declare global {
  interface CloudflareEnv {
    DB: D1Database;
    MENU_IMAGES: R2Bucket;
  }
}

export {};
