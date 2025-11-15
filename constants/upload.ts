// Centralized upload-related constants and helpers.
// Adjust MAX_FILE_SIZE_BYTES here to change limits across the app.
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB unified limit
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
];

export function formatBytes(bytes: number, decimals = 2) {
  if (!Number.isFinite(bytes)) return '0 B';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function validateFileBasic(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Unsupported type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File exceeds ${formatBytes(MAX_FILE_SIZE_BYTES)} limit.`;
  }
  return null;
}
