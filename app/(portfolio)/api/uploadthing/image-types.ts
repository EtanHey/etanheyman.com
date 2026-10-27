const imageLimit = { maxFileSize: "4MB", maxFileCount: 1, minFileCount: 0 } as const;
const rasterUploadConfig = {
  "image/png": imageLimit,
  "image/jpeg": imageLimit,
  "image/webp": imageLimit,
  "image/gif": imageLimit,
  "image/avif": imageLimit,
};

export const imageUploadConfig = {
  projectLogo: { ...rasterUploadConfig, "image/svg+xml": imageLimit },
  journeyImage: rasterUploadConfig,
};
