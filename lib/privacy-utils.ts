/**
 * Privacy utility functions for protecting affiliate information
 *
 * Regular affiliates see limited info (first name + initial)
 * Admins see full information
 */

/**
 * Format a full name to show only first name and last initial
 * Example: "John Doe" => "John D."
 * Example: "Jane" => "Jane"
 */
export function formatPrivateName(fullName: string | null | undefined): string {
  if (!fullName) return 'Unknown';

  const parts = fullName.trim().split(' ');

  if (parts.length === 0) return 'Unknown';
  if (parts.length === 1) return parts[0];

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0].toUpperCase();

  return `${firstName} ${lastInitial}.`;
}

/**
 * Determine if email should be shown based on user role
 * Returns email for admins, empty string for regular users
 */
export function getDisplayEmail(email: string, isAdmin: boolean): string {
  return isAdmin ? email : '';
}

/**
 * Get display name based on user role
 * Admins see full name, regular users see private format
 */
export function getDisplayName(fullName: string | null | undefined, email: string | null | undefined, isAdmin: boolean): string {
  if (isAdmin) {
    return fullName || email || 'Unknown';
  }

  if (fullName) {
    return formatPrivateName(fullName);
  }

  // If no full name, show first part of email with masking
  if (email) {
    const emailParts = email.split('@');
    const username = emailParts[0];
    if (username.length > 2) {
      return `${username[0]}${username[1].toUpperCase()}.`;
    }
    return `${username[0].toUpperCase()}.`;
  }

  return 'Unknown';
}
