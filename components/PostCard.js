/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';

function PostCard({ postObj }) {
  const { user } = useAuth();
  const isViewerAuthUser = user && user.uid === postObj.thePostersId;
  const doesHaveConnections = postObj.hasConnectedPosts ? postObj.hasConnectedPosts : false;
  const isGhost = postObj.isGhost ? postObj.isGhost : false;
  // refactoring all the cards into one seems correct, but the componetizing of the buttons based on conditions is looking to be a big spaghetti mess so i ay keep them seperate.
  // const isConnectionPost = postObj.isConnectionPost ? postObj.isConnectionPost : false;

  return (
    <div
      className="card"
      style={{
        width: '31rem',
        margin: '13px',
        border: `7px double #${postObj.color}`,
        padding: '13px',
        opacity: isGhost ? 0.5 : 1,
        background: 'transparet',
        color: `#${postObj.color}`,
        maxHeight: '23rem',
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
        <p>{postObj.postId}</p>
      </div>
      <div className="card-footer">
        {/* DYNAMIC LINK TO VIEW THE post DETAILS  */}
        <Link href={`/post/${postObj.postId}`} passHref>
          <Button variant="primary" className="m-2">VIEW</Button>
        </Link> {/* TODO LINTER DOES NOT LIKE NESTED TERNARY STATMENTS so COMPONENET THIS OUT or something? */}
        {postObj.isGhost ? (
          <div />
        ) : (
          isViewerAuthUser ? (
            <Link href={`/post/edit/${postObj.postId}`} passHref>
              <Button variant="info">EDIT</Button>
            </Link>
          ) : (
            <Link href={`/post/connection/${postObj.postId}`} passHref>
              <Button variant="info">String off this post</Button>
            </Link>
          )
        )}
        {/* DYNAMIC LINK TO EDIT THE post DETAILS  */}
        {doesHaveConnections ? (
          <Link href={`/post/${postObj.postId}`} passHref>
            <Button variant="info">Follow String?</Button>
          </Link>
        ) : (
          <div />
        )}
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
    hasConnectedPosts: PropTypes.bool,
    isGhost: PropTypes.bool,
  }).isRequired,
};

export default PostCard;
