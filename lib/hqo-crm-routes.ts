// Base path for HqO CRM when integrated into the main app
export const HQO_CRM_BASE_PATH = '/prototypes/hqo-crm'

/**
 * Helper function to create HqO CRM routes with the correct base path
 * @param path - The relative path within the HqO CRM (e.g., '/dashboard', '/leases')
 * @returns The full path with base path prepended
 */
export function createHqoCrmRoute(path: string): string {
  // Handle root path
  if (path === '/') {
    return HQO_CRM_BASE_PATH
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  return `${HQO_CRM_BASE_PATH}${cleanPath}`
}

/**
 * Check if a pathname is within the HqO CRM section
 * @param pathname - The current pathname
 * @returns True if the pathname is within HqO CRM
 */
export function isHqoCrmRoute(pathname: string): boolean {
  return pathname.startsWith(HQO_CRM_BASE_PATH)
}

/**
 * Get the relative path within HqO CRM from a full pathname
 * @param pathname - The full pathname
 * @returns The relative path within HqO CRM (e.g., '/dashboard' from '/prototypes/hqo-crm/dashboard')
 */
export function getHqoCrmRelativePath(pathname: string): string {
  if (!isHqoCrmRoute(pathname)) {
    return pathname
  }
  
  const relativePath = pathname.replace(HQO_CRM_BASE_PATH, '')
  return relativePath || '/'
}
