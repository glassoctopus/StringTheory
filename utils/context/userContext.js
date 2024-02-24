import { createContext, useState, useEffect } from 'react';
// eslint-disable-next-line import/extensions
import { getSingleUser } from '../../api/userData';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user data when the component mounts
    getSingleUser().then((userData) => {
      setUser(userData);
      console.log(user);
    }).catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
