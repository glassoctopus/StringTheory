import React from 'react';
// eslint-disable-next-line import/extensions
import PostCardEdit from '../components/CreatePost';

function PostSpaceEdit() {
  // user ID using useAuth Hook

  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '666px',
        margin: '0 auto',
      }}
    >
      <div className="d-flex flex-wrap">
        <PostCardEdit />
      </div>
    </div>
  );
}

export default PostSpaceEdit;
