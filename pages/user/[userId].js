import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// eslint-disable-next-line import/extensions
import { getSingleUser } from '../../api/userData';

export default function ViewUser() {
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();

  // grab userId from url
  const { userId } = router.query;

  // call to API layer to get the data
  useEffect(() => {
    getSingleUser(userId).then(setUserDetails);
  }, [userId]);

  return (
    <div className="mt-5 d-flex flex-wrap">
      <div className="d-flex flex-column">***</div>
      <div className="text-white ms-5 details">
        <h5>
          {userDetails?.name} created a user profile on this site {userDetails?.born}
        </h5>
        <p>{userDetails?.bio}</p>
        <p>{userDetails?.email}</p>
        <p>{userDetails?.color} is your favorite color selection in hex value.</p>
        <div style={{
          backgroundColor: `#${userDetails?.color}`,
        }}
        >... so, This is your color choice, Ayeeeeee..?
        </div>
        <hr />
      </div>
    </div>
  );
}
