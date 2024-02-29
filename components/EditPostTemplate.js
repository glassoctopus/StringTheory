import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import rightNow from '../utils/aTimeStamp';
import { useAuth } from '../utils/context/authContext';
import {
  // eslint-disable-next-line no-unused-vars
  createPost, deletePost, getSinglePost, updatePost,
// eslint-disable-next-line import/extensions
} from '../api/postData';

const EditPostTemplate = ({ onUpdate }) => {
  const [posting, setPosting] = useState({
    postId: '',
    thePostersId: '',
    postersName: '',
    postBody: '',
    color: '',
    timeStamp: '',
    isGhost: false,
  });
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();
  const { postId } = router.query;
  const { user } = useAuth();

  const handleChange = (e, fieldName) => {
    const { name, value } = e.target;
    if (fieldName === 'postBody') {
      if (value.length > 666) return;
      setPosting((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setCharCount(value.length);
    }
    if (fieldName === 'color') {
      setPosting((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getSinglePost(postId);
        setPosting((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const deleteThisPost = async () => {
    if (window.confirm(`Delete ${posting.postBody}?`)) {
      try {
        await deletePost(posting.postId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const editThisPost = () => {
    if (!posting || !posting.postBody) {
      alert('Please enter a post body.');
      return;
    }
    if (window.confirm(`Post ${posting.postBody}?`)) {
      if (window.confirm('Are you sure you want this on the internet forever...ish?')) {
        alert('posting');
        const timeStamp = rightNow();
        // eslint-disable-next-line no-unused-vars
        const payload = {
          postBody: posting.postBody,
          postersName: user?.name || '',
          timeStamp,
          thePostersId: user?.uid || '',
          color: user?.color || '',
          isGhost: false,
        };
        // Call your API functions here
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
        <div className="card-title">{`${user?.name} posted on ${posting.timeStamp}`}</div>
      </div>
      <div>
        <textarea
          style={{ background: 'transparent', color: `#${user.color}`, width: '100%' }}
          type="text"
          name="postBody"
          value={posting.postBody}
          onChange={(e) => handleChange(e, 'postBody')}
        />
      </div>
      Your post is at {charCount} chars of 666
      <p>What color do you want this post to be? Enter a Hex color in the box below.</p>
      <div>
        <textarea
          style={{ background: 'transparent', color: `#${user.color}`, width: '100%' }}
          type="text"
          name="color"
          value={posting.color}
          onChange={(e) => handleChange(e, 'color')}
        />
      </div>
      <div className="card-footer">
        <Button variant="primary" onClick={editThisPost} className="m-2">Edit</Button>
        <Button variant="danger" onClick={deleteThisPost} className="m-2">Forget about it</Button>
      </div>
    </div>
  );
};

EditPostTemplate.propTypes = {
  // eslint-disable-next-line react/require-default-props
  onUpdate: PropTypes.func,
};

export default EditPostTemplate;
