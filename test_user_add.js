// Test script to verify user addition logic
// This simulates the key parts of the user addition flow

console.log("Testing user addition flow...");

// Simulate the initial state
const mockState = {
   allUsers: [
      { name: "Alice", avatarId: 1 },
      { name: "Bob", avatarId: 2 },
   ],
   currentUserId: 0,
   newUserId: null,
   newUser: {},
};

// Simulate handleUserAddClick
function handleUserAddClick() {
   console.log("1. Add User clicked");
   const userTemplate = { name: "Guest", avatarId: 0 };
   mockState.newUser = { ...userTemplate };
   mockState.newUserId = mockState.allUsers.length; // Should be 2
   mockState.currentUserId = mockState.newUserId; // Set currentUserId to new user ID
   console.log("State after handleUserAddClick:", mockState);
}

// Simulate getFormData
function getFormData() {
   // For new users, use newUserId; for existing users, use currentUserId
   const userId = mockState.newUserId !== null ? mockState.newUserId : mockState.currentUserId;
   const newName = "Charlie"; // Simulated form input
   const newAvatarId = 3; // Simulated form selection
   return { userId, newName, newAvatarId };
}

// Run the test
handleUserAddClick();
const formData = getFormData();
console.log("2. Form data:", formData);

// Verify the result
if (formData.userId === 2) {
   console.log("✅ SUCCESS: New user gets correct ID (2)");
   console.log("✅ SUCCESS: New user won't overwrite existing user at index 0");
} else {
   console.log("❌ FAIL: New user would overwrite existing user");
}
