import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import rightNow from '../utils/aTimeStamp';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import { createPost, updatePost } from '../api/postData';

const initialState = {
  postId: '',
  thePostersId: '',
  postersName: '',
  postBody: '',
  color: '',
  timeStamp: '',
  isGhost: false,
  ghostParentPost: '',
};

function CreatePost() {
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
    if (window.confirm(`Delete ${posting?.postBody}?`)) {
      setPosting((prevState) => ({
        ...prevState,
        postBody: '',
      }));
    }
  };

  const postThisPost = () => {
    if (!posting || !posting.postBody) {
      alert('Please enter a post body.');
      return;
    }
    if (window.confirm(`Post ${posting.postBody}?`)) {
      if (window.confirm('Are you sure you want this on the internet forever...ish?')) {
        const timeStamp = rightNow();
        const payload = {
          postBody: posting.postBody,
          postersName: user?.name || '',
          timeStamp,
          thePostersId: user?.uid || '',
          color: user?.color || '',
          isGhost: false,
          ghostParentPost: posting?.ghostParentPost || '',
        };
        createPost(payload).then(({ name }) => {
          const patchPayload = { ...payload, postId: name };
          updatePost(patchPayload).then(() => {
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
        width: '31rem',
        margin: '10px',
        border: `7px double #${user.color}`,
        padding: '10px',
        background: 'transparent',
        color: `#${user.color}`,
      }}
    >
      <div className="card-header">
        <div className="card-title">{`${user?.name} is thinking about posting `}</div>
      </div>
      <div>
        <textarea style={{ background: 'transparent', color: `#${user.color}`, width: '100%' }} type="text" name="postBody" value={posting.postBody} onChange={handleChange} />
      </div>
      your post is at {charCount} chars of 666
      <div className="card-header">
        <div className="card-title">{` on ${rightNow()}`}</div>
      </div>
      <div className="card-footer">
        <Button variant="primary" onClick={postThisPost} className="m-2">Post</Button>
        <Button variant="danger" onClick={deleteThisPost} className="m-2">Forget about it</Button>
      </div>
    </div>
  );
}

export default CreatePost;
