// Context API Docs: https://beta.reactjs.org/learn/passing-data-deeply-with-context

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { firebase } from '../client';
// eslint-disable-next-line import/extensions
import { getSingleUserByFBuid } from '../../api/userData';

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext';

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);

  // there are 3 states for the user:
  // null = application initial state, not yet loaded
  // false = user is not logged in, but the app has loaded
  // an object/value = user is logged in

  useEffect(() => {
    firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) {
        getSingleUserByFBuid(fbUser.uid)
          .then((userDataArray) => {
            const userData = userDataArray[0];
            // Extract specific properties from userData
            const mergedUser = {
              name: userData?.name,
              color: userData?.color,
              born: userData?.born,
              userId: userData?.userId,
              bio: userData?.bio,
              uid: fbUser.uid,
            };
            // Update user state with mergedUser
            setUser(mergedUser);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      } else {
        setUser(false);
      }
    }); // creates a single global listener for auth state changed
  }, [setUser]);

  const value = useMemo( // https://reactjs.org/docs/hooks-reference.html#usememo
    () => ({
      user,
      userLoading: user === null,
      // as long as user === null, will be true
      // As soon as the user value !== null, value will be false
    }),
    [user],
  );

  return <AuthContext.Provider value={value} {...props} />;
};
const AuthConsumer = AuthContext.Consumer;

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthConsumer };
