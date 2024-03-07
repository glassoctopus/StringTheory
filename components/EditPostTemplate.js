import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
// import firebase from 'firebase/app';
import rightNow from '../utils/aTimeStamp';
import 'firebase/database';
import { useAuth } from '../utils/context/authContext';
import {
  // eslint-disable-next-line no-unused-vars
  createPost, deletePost, getSinglePost, updatePost, createGhostPost, updateGhostPost,
// eslint-disable-next-line import/extensions
} from '../api/postData';

// eslint-disable-next-line no-unused-vars
const EditPostTemplate = ({ onUpdate }) => {
  const [posting, setPosting] = useState({
    postId: '',
    thePostersId: '',
    postersName: '',
    postBody: '',
    color: '',
    timeStamp: '',
    isGhost: false,
    ghostParentPost: '',
  });
  const [originalPost, setOriginalPost] = useState({});
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();
  const { postId } = router.query;
  const { user } = useAuth();
  // console.warn('originalPost', originalPost);
  let postIdNew = '';

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
        setOriginalPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const doneEditing = () => {
    router.push('/postSpace');
  };

  const editThisPost = () => {
    if (!posting || !posting.postBody) {
      alert('Please enter a post body.');
      return;
    }
    if (window.confirm(`Post ${posting.postBody}?`)) {
      if (window.confirm('Are you sure you want this on the internet forever...ish?')) {
        alert('posting');
        console.warn('originalPost ID', originalPost.postId);
        const timeStamp = rightNow();
        const editedPayload = {
          postBody: posting.postBody,
          postersName: user?.name || '',
          timeStamp,
          thePostersId: user?.uid || '',
          color: posting.color || '',
          isGhost: false,
          ghostParentPost: posting?.post || '',
        };
        console.warn('editedPayload', editedPayload);
        createPost(editedPayload).then(({ name }) => {
          const patchPayload = { ...editedPayload, postId: name };
          const editedPostId = name;
          postIdNew = editedPostId;
          console.warn('new parent post creadted from editedPayload, edited payload id', editedPostId);
          console.warn('patchPayload of edited payload, but with the name / key replaced correctly ', patchPayload);
          updatePost(patchPayload).then(() => {
            alert('posted');
            const originalPostPayload = {
              ...originalPost,
              ghostParentPost: postIdNew,
              isGhost: true,
              color: originalPost.color,
              postId: originalPost.postId,
            };
            console.warn('originalPostPayload', originalPostPayload);
            // Create ghost post with the same key as the original post
            updateGhostPost(originalPost.postId, originalPostPayload)
              .then(() => {
                alert('original post ghosted');

                // Delete the original post
                deletePost(originalPost.postId).then(() => {
                  alert(`original post deleted, ID: ${originalPost.postId}`);
                  router.push('/postSpace');
                });
              });
          });
        });
      }
    }
  };

  return (
    <div
      className="card"
      style={{
        width: '31rem', margin: '10px', border: `7px double #${posting.color}`, background: 'transparent', color: `#${posting.color}`,
      }}
    >
      <div className="card-header">
        <div className="card-title">{`${user?.name} posted on ${posting.timeStamp}`}</div>
      </div>
      <div>
        <textarea
          style={{ background: 'transparent', color: `#${posting.color}`, width: '100%' }}
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
          style={{ background: 'transparent', color: `#${posting.color}`, width: '100%' }}
          type="text"
          name="color"
          value={posting.color}
          onChange={(e) => handleChange(e, 'color')}
        />
      </div>
      <div className="card-footer">
        <Button variant="primary" onClick={editThisPost} className="m-2">Edit</Button>
        <Button variant="danger" onClick={doneEditing} className="m-2">Forget about it</Button>
      </div>
    </div>
  );
};

EditPostTemplate.propTypes = {
  // eslint-disable-next-line react/require-default-props
  onUpdate: PropTypes.func,
};

export default EditPostTemplate;
