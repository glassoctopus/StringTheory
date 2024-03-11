import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import rightNow from '../utils/aTimeStamp';
// eslint-disable-next-line import/extensions
import { deleteUser, createDeletedUser } from '../api/userData';

function UserCard({ userObj, onUpdate }) {
  // FOR DELETE, WE NEED TO REMOVE THE user AND HAVE THE VIEW RERENDER,
  const deleteThisUser = () => {
    console.warn('Deleting user...');
    if (window.confirm(`Delete ${userObj.userId}?`)) {
      createDeletedUser(userObj)
        .then(() => {
          console.warn('Deleted user created successfully.');
          return deleteUser(userObj.userId);
        })
        .then(() => {
          console.warn('User deleted successfully.');
          onUpdate(); // Check if onUpdate is properly defined and passed
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    }
  };

  return (
    <div
      className="card"
      style={{
        width: '31rem',
        // margin: '10px',
        border: `7px double #${userObj?.color}`,
        background: 'transparet',
        color: `#${userObj?.color}`,
      }}
    >
      <div className="card-header">
        <div className="card-title">
          {userObj?.name ? `${userObj?.name}, you're logged in to StringTheory, & it's ${rightNow()}` : 'Welcome to String Theory, you should make a user profile!!!'}
        </div>
      </div>
      <div className="card-footer">
        {/* DYNAMIC LINK TO VIEW THE user DETAILS  */}
        {userObj?.name
          ? (
            <Link href={`/user/${userObj?.userId}`} passHref>
              <Button variant="primary" className="m-2">VIEW</Button>
            </Link>
          )
          : (
            <Link href="/newUser" passHref>
              <Button variant="primary" className="m-2">Be a part of this, YOLO and stuff...</Button>
            </Link>
          ) }
        {/* DYNAMIC LINK TO EDIT THE user DETAILS  */}
        {userObj?.name
          ? (
            <Link href={`/edit/${userObj?.userId}`} passHref>
              <Button variant="info">EDIT</Button>
            </Link>
          ) : (null)}
        {userObj?.name
          ? (
            <Button variant="danger" onClick={deleteThisUser} className="m-2">
              DELETE
            </Button>
          ) : (null)}
      </div>
    </div>
  );
}

UserCard.propTypes = {
  userObj: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UserCard;
