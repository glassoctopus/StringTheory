import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import rightNow from '../utils/aTimeStamp';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import {
  createPost, updatePost,
// eslint-disable-next-line import/extensions
} from '../api/postData';

const initialState = {
  postId: '',
  thePostersId: '',
  originalPostId: '',
  postersName: '',
  postBody: '',
  color: '',
  timeStamp: '',
  isGhost: false,
  isConnectionPost: true,
};

function ConnectionPost({ postDetails, postId }) {
  const [posting, setPosting] = useState(initialState);
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > 666) {
      return;
    }
    setPosting((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setCharCount(value.length);
  };

  const deleteThisPost = () => {
    if (window.confirm(`Change your mind, just go look at posts instead? Are do you want to continue with: ${posting?.postBody}?`)) {
      router.push('/postSpace');
    }
  };

  function parentPostHasConnection() {
    const payload = {
      hasConnectedPosts: true,
      postId: postDetails?.postId,
    };
    updatePost(payload).then(() => {
    });
  }

  const postThisPost = () => {
    if (!posting || !posting.postBody) {
      alert('Please enter a post body.');
      return;
    }
    if (window.confirm(`You intend to post: ${posting.postBody}? A string off of ${postId}`)) {
      if (window.confirm('Are you sure you want this on the internet forever...ish?')) {
        const timeStamp = rightNow();
        const payload = {
          originalPostId: postDetails?.postId,
          postBody: posting.postBody,
          postersName: user?.name || '',
          timeStamp,
          thePostersId: user?.uid || '',
          color: user?.color || '',
          isGhost: false,
          ghostParentPost: posting?.ghostParentPost || '',
          isConnectionPost: true,
        };
        createPost(payload).then(({ name }) => {
          const patchPayload = { ...payload, postId: name };
          updatePost(patchPayload).then(() => {
            parentPostHasConnection();
            router.push('/postSpace');
          });
        });
      }
    }
  };

  return (
    <div
      className="card"
      style={{
        width: '31rem', margin: '10px', border: `7px double #${user.color}`, background: 'transparent', color: `#${user.color}`,
      }}
    >
      <div className="card-header">
        <div className="card-title">{`${user?.name} is thinking about stringing a thought off of the above: ${postDetails?.postBody}`}</div>
      </div>
      <div>
        <textarea style={{ background: 'transparent', color: `#${user.color}`, width: '100%' }} type="text" name="postBody" value={posting.postBody} onChange={handleChange} />
      </div>
      your string is at {charCount} chars of 666
      <div className="card-header">
        <div className="card-title">{` on ${rightNow()}`}</div>
      </div>
      <div className="card-footer">
        <Button variant="primary" onClick={postThisPost} className="m-2">String off of the post</Button>
        <Button variant="danger" onClick={deleteThisPost} className="m-2">Forget about it</Button>
      </div>
    </div>
  );
}

ConnectionPost.propTypes = {
  postDetails: PropTypes.shape({
    postId: PropTypes.string,
    postBody: PropTypes.string,
    connectedPosts: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  postId: PropTypes.string.isRequired,
};

export default ConnectionPost;
