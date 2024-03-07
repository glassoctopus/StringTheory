import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import rightNow from '../utils/aTimeStamp';
import { useAuth } from '../utils/context/authContext';
import {
  // eslint-disable-next-line no-unused-vars
  createPost, deletePost, getSinglePost, updatePost, createPostEdit, updateGhostPost,
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
        const timeStamp = rightNow();
        // eslint-disable-next-line no-unused-vars
        const editedPayload = {
          postBody: posting.postBody,
          postersName: user?.name || '',
          timeStamp,
          thePostersId: user?.uid || '',
          color: posting.color || '',
          isGhost: false,
          ghostParentPost: posting?.post || '',
        };
        // console.log('payload', editedPayload);
        createPost(editedPayload).then(({ name }) => {
          const patchPayload = { ...editedPayload, postId: name };
          const editedPostId = name;
          postIdNew = editedPostId;
          // console.log('edited payload id', editedPostId);
          updatePost(patchPayload).then(() => {
            alert('posted');
            const originalPostPayload = {
              ...originalPost, ghostParentPost: postIdNew, isGhost: true,
            };
            // console.log('originalPostPayload', originalPostPayload);
            createPostEdit(originalPostPayload).then(({ editedName }) => {
              const ghostPatchPayload = { ...originalPostPayload, color: originalPost.color, postId: editedName };
              updateGhostPost(ghostPatchPayload).then(() => {
                alert('original post ghosted and edited');
                router.push('/postSpace');
              });
            });
            deletePost(originalPost.postId).then(() => {
              alert(`original post deleted, ID: ${originalPost.postId}`);
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
