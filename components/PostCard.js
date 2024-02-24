import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import Link from 'next/link';
// eslint-disable-next-line import/extensions
import { deleteUser } from '../api/userData';

function PostCard({ postObj, onUpdate }) {
  // FOR DELETE, WE NEED TO REMOVE THE user AND HAVE THE VIEW RERENDER,
  const deleteThisUser = () => {
    if (window.confirm(`Delete ${postObj.postBody}?`)) {
      deleteUser(postObj.postId).then(() => onUpdate());
    }
  };

  console.warn(postObj.color);

  return (
    <div
      className="card"
      style={{
        width: '31rem',
        margin: '10px',
        border: `1px double #${postObj.color}`,
        background: 'transparet',
        color: `#${postObj.color}`,
      }}
    >
      <div className="card-header">
        <div className="card-title">
          {`${postObj.postersName} posted this on ${postObj.timeStamp}`}
        </div>
      </div>
      <div className="card-content">
        <p className="card-text bold">{postObj.postBody}</p>
      </div>
      <div className="card-footer">
        {/* DYNAMIC LINK TO VIEW THE post DETAILS  */}
        <Link href={`/post/${postObj.postId}`} passHref>
          <Button variant="primary" className="m-2">VIEW</Button>
        </Link>
        {/* DYNAMIC LINK TO EDIT THE post DETAILS  */}
        <Link href={`/edit/${postObj.postId}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <Button variant="danger" onClick={deleteThisUser} className="m-2">
          DELETE
        </Button>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  postObj: PropTypes.shape({
    postId: PropTypes.string,
    thePostersId: PropTypes.string,
    postersName: PropTypes.string,
    postBody: PropTypes.string,
    color: PropTypes.string,
    timeStamp: PropTypes.string,
    isGhost: PropTypes.bool,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PostCard;
