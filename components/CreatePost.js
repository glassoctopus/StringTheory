import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import rightNow from '../utils/aTimeStamp';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import { createPost, deletePost } from '../api/postData';
// eslint-disable-next-line import/extensions
import { getSingleUser } from '../api/userData';
import UserContext from '../utils/context/userContext';

const initialState = {
  postId: '',
  thePostersId: '',
  postersName: '',
  postBody: '',
  color: '',
  timeStamp: '',
  isGhost: false,
};

function CreatePost({ onUpdate }) {
  const [posting, setPosting] = useState(initialState);
  const [thisPoster, setThisPoster] = useState(null);
  const { user } = useAuth();
  const { userObject } = useContext(UserContext);
  console.warn('userObject', userObject);
  console.warn('user', user.uid);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authUserObject = await getSingleUser(user.uid);
        setThisPoster(authUserObject);
      } catch (error) {
        console.warn('Error fetching user:', error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPosting((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteThisPost = () => {
    if (window.confirm(`Delete ${posting?.postBody}?`)) {
      deletePost(posting?.postId).then(() => onUpdate());
    }
  };

  const postThisPost = () => {
    if (!posting || !posting.postBody) {
      alert('Please enter a post body.');
      return;
    }
    if (window.confirm(`Post ${posting.postBody}?`)) {
      if (window.confirm('Are you sure you want this on the internet forever...ish?')) {
        alert('posting');
        const timeStamp = rightNow();
        const payload = {
          postBody: posting.postBody,
          postersName: thisPoster?.name || '',
          timeStamp,
          thePostersId: thisPoster?.userId || '',
          color: thisPoster?.color || '',
        };
        console.warn('payload', payload);
        createPost(payload).then(() => {
          alert('posted');
        });
      }
    }
  };

  return (
    <div
      className="card"
      style={{
        width: '31rem', margin: '10px', border: '1px double white', background: 'transparent',
      }}
    >
      <div className="card-header">
        <div className="card-title">{`${posting?.postersName} to post at about: ${rightNow()}`}</div>
      </div>
      <div className="card-content">
        <textarea type="text" name="postBody" value={posting.postBody} onChange={handleChange} />
      </div>
      <div className="card-footer">
        <Button variant="primary" onClick={postThisPost} className="m-2">Post</Button>
        <Button variant="danger" onClick={deleteThisPost} className="m-2">Forget about it</Button>
      </div>
    </div>
  );
}

CreatePost.propTypes = {
  // eslint-disable-next-line react/require-default-props
  onUpdate: PropTypes.func,
};

export default CreatePost;
