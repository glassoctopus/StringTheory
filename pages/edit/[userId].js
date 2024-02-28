import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// eslint-disable-next-line import/extensions
import { getSingleUser } from '../../api/userData';
import UesrInfoForm from '../../components/UserInfoForm';

export default function EditUser() {
  const [user, setUser] = useState({});
  const router = useRouter();
  const { userId } = router.query;

  // TODO: make a call to the API to get the User data
  useEffect(() => {
    getSingleUser(userId).then((data) => {
      setUser(data);
    });
  }, [userId]);

  // TODO: pass object to form
  return (<UesrInfoForm obj={user} />);
}
