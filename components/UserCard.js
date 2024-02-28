import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import rightNow from '../utils/aTimeStamp';
// eslint-disable-next-line import/extensions
import { deleteUser } from '../api/userData';

function UserCard({ userObj, onUpdate }) {
  // FOR DELETE, WE NEED TO REMOVE THE user AND HAVE THE VIEW RERENDER,
  const deleteThisUser = () => {
    if (window.confirm(`Delete ${userObj.userId}?`)) {
      deleteUser(userObj.userId).then(() => onUpdate());
    }
  };

  console.warn(userObj);

  return (
    <div
      className="card"
      style={{
        width: '31rem',
        margin: '10px',
        border: `7px double #${userObj.color}`,
        background: 'transparet',
        color: `#${userObj.color}`,
      }}
    >
      <div className="card-header">
        <div className="card-title">
          {`${userObj.name}, you're logged in to StringTheory, & it's ${rightNow()}`}
        </div>
      </div>
      <div className="card-footer">
        {/* DYNAMIC LINK TO VIEW THE user DETAILS  */}
        <Link href={`/user/${userObj.userId}`} passHref>
          <Button variant="primary" className="m-2">VIEW</Button>
        </Link>
        {/* DYNAMIC LINK TO EDIT THE user DETAILS  */}
        <Link href={`/edit/${userObj.userId}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <Button variant="danger" onClick={deleteThisUser} className="m-2">
          DELETE
        </Button>
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
