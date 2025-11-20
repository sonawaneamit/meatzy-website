/**
 * Test script to verify privacy utility functions
 */

// Simulate the privacy functions
function formatPrivateName(fullName) {
  if (!fullName) return 'Unknown';

  const parts = fullName.trim().split(' ');

  if (parts.length === 0) return 'Unknown';
  if (parts.length === 1) return parts[0];

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0].toUpperCase();

  return `${firstName} ${lastInitial}.`;
}

function getDisplayName(fullName, email, isAdmin) {
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

// Test cases
console.log('=== Privacy Utility Tests ===\n');

console.log('Test 1: Regular affiliate viewing another user');
console.log('Full Name: "Jason Sonja" -> ', getDisplayName('Jason Sonja', 'jason@testing.com', false));
console.log('Expected: "Jason S."\n');

console.log('Test 2: Admin viewing the same user');
console.log('Full Name: "Jason Sonja" -> ', getDisplayName('Jason Sonja', 'jason@testing.com', true));
console.log('Expected: "Jason Sonja"\n');

console.log('Test 3: User with only first name');
console.log('Full Name: "Madonna" -> ', getDisplayName('Madonna', 'madonna@example.com', false));
console.log('Expected: "Madonna"\n');

console.log('Test 4: User with no full name, only email');
console.log('No Name, Email: "johndoe@example.com" -> ', getDisplayName(null, 'johndoe@example.com', false));
console.log('Expected: "JO." (first two letters)\n');

console.log('Test 5: Three-part name');
console.log('Full Name: "John Michael Doe" -> ', getDisplayName('John Michael Doe', 'john@example.com', false));
console.log('Expected: "John D."\n');

console.log('Test 6: Admin viewing user with no name');
console.log('No Name, Email: "test@example.com" -> ', getDisplayName(null, 'test@example.com', true));
console.log('Expected: "test@example.com"\n');

console.log('=== All tests completed! ===');
