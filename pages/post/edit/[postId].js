import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// eslint-disable-next-line import/extensions
import { getSinglePost } from '../../../api/postData';
import EditPostTemplate from '../../../components/EditPostTemplate';

export default function EditPost() {
  const [post, setPost] = useState({});
  const router = useRouter();
  const { postId } = router.query;
  console.warn('postId', postId);

  // TODO: make a call to the API to get the Post data
  useEffect(() => {
    getSinglePost(postId).then((data) => {
      setPost(data);
    });
  }, [postId]);

  // TODO: pass object to form
  return (<EditPostTemplate obj={post} />);
}
