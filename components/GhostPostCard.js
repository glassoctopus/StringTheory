import React from 'react';
import PropTypes from 'prop-types';

function PostCard({ postObj }) {
  return (
    <div
      className="card"
      style={{
        width: '31rem',
        margin: '13px',
        border: `7px double #${postObj.color}`,
        padding: '13px',
        background: 'transparet',
        color: `#${postObj.color}`,
        maxHeight: '13rem',
        opacity: 0.5,
      }}
    >
      <div className="card-header">
        <div className="card-title">
          {`${postObj.postersName} posted this on ${postObj.timeStamp}`}
        </div>
      </div>
      <div className="card-content">
        <p className="card-text bold">{postObj.postBody}</p>
        <p className="card-text">Hex color of post should be {postObj.color}</p>
        <div
          style={{ background: `#${postObj.color}` }}
        >***
        </div>
      </div>
      <div className="card-footer">
        {/* DYNAMIC LINK TO VIEW THE post DETAILS  */}
        It&apos;s a ghost post of postId ${postObj.ghostParentPost}, no edits past this point...
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
    ghostParentPost: PropTypes.string,
  }).isRequired,
};

export default PostCard;
