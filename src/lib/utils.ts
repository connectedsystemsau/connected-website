/**
 * Get the base path for assets
 * This handles GitHub Pages subdirectory deployments
 */
export const getAssetPath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};
