import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
// eslint-disable-next-line import/extensions
import { getSinglePost } from '../../api/postData';

export default function ViewpPost() {
  const [postDetails, setPostDetails] = useState({});
  const router = useRouter();

  // grab postId from url
  const { postId } = router.query;

  // call to API layer to get the data
  useEffect(() => {
    getSinglePost(postId).then(setPostDetails);
  }, [postId]);

  return (
    <div className="mt-5 d-flex flex-wrap">
      <div className="d-flex flex-column">***</div>
      <div
        className="text-white ms-5 details"
        style={{
          border: `7px double #${postDetails?.color}`,
        }}
      >
        <h5>
          {postDetails?.postersName} created this post on {postDetails?.timeStamp}
        </h5>
        <hr />
        <p>{postDetails?.postBody}</p>
        <hr />
        <div style={{
          backgroundColor: `#${postDetails?.color}`,
        }}
        >
          <p>{postDetails?.color} is the color selection in hex value for this post.</p>
        </div>
        <Link href={`post/edit/${postDetails.postId}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <hr />
      </div>
    </div>
  );
}
