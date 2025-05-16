/**
 * Setup dummy user data in localStorage for testing login functionality
 * This simulates a logged-in user without implementing the actual login logic
 */

export const setupDummyUser = () => {
  // Current timestamp
  const now = new Date();
  
  // Token expiration date (7 days from now)
  const expirationDate = new Date(now);
  expirationDate.setDate(now.getDate() + 7);
  
  // Dummy user data
  const dummyUser = {
    id: 'usr-12345',
    name: 'Afyar Siti Ababil',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMTIzNDUiLCJuYW1lIjoiQWZ5YXIgU2l0aSBBYmFiaWwiLCJpYXQiOjE2NDYyNTU1MjJ9.FEI09oPl2JnSP_WZiswYA',
    tokenExpiredDate: expirationDate.toISOString()
  };
  
  // Set localStorage items
  localStorage.setItem('user-id', dummyUser.id);
  localStorage.setItem('user-name', dummyUser.name);
  localStorage.setItem('user-token', dummyUser.token);
  localStorage.setItem('token-expired-date', dummyUser.tokenExpiredDate);
  
  console.log('Dummy user set up in localStorage:', dummyUser);
  return dummyUser;
};

export const clearDummyUser = () => {
  localStorage.removeItem('user-id');
  localStorage.removeItem('user-name');
  localStorage.removeItem('user-token');
  localStorage.removeItem('token-expired-date');
  
  console.log('Dummy user removed from localStorage');
};

// To use this in development/testing environments, 
// uncomment and run the function below:
// setupDummyUser();
