import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
// eslint-disable-next-line import/extensions
import { getSinglePost, getAllPosts } from '../../../api/postData';
// eslint-disable-next-line import/extensions
import GhostPostCard from '../../../components/GhostPostCard';
// eslint-disable-next-line import/extensions
import ConnectionPost from '../../../components/ConnectionPost';
import { onlyGhostPosts } from '../../../utils/doWhat';

export default function ViewpPost() {
  const [postDetails, setPostDetails] = useState({});
  const [ghostPosts, setGhostPosts] = useState([]);
  const router = useRouter();

  // grab postId from url
  const { postId } = router.query;

  const getRelevantGhostPosts = useCallback(() => {
    getAllPosts().then((GhostPostsData) => {
      const sortedGhosts = onlyGhostPosts(GhostPostsData ?? []);
      const thisPostGhosts = sortedGhosts.filter((ghostPost) => ghostPost.ghostParentPost === postDetails.thePostersId);
      setGhostPosts((prevGhostPosts) => [...prevGhostPosts, ...thisPostGhosts]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postDetails?.thePostersId]);

  // call to API layer to get the data
  useEffect(() => {
    getSinglePost(postId).then(setPostDetails);
  }, [postId]);

  useEffect(() => {
    if (postDetails.thePostersId) {
      getRelevantGhostPosts();
    }
  }, [postDetails?.thePostersId, getRelevantGhostPosts]);

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
        <Link href={`edit/${postDetails?.postId}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <hr />
      </div>
      <div>
        {/* connectionPosts (String post) creation */}
        <p> not loading my componenet</p>
        <ConnectionPost postDetails={postDetails} postId={postId} />
      </div>
      <div
        className="text-center d-flex flex-column justify-content-center align-content-center"
        style={{
          height: '90vh',
          padding: '30px',
          maxWidth: '666px',
          margin: '0 auto',
        }}
      >
        <div
          className="d-flex flex-wrap"
          style={{
            overflowY: 'scroll',
          }}
        >
          <h2>{ghostPosts ? 'ghostPosts loaded' : 'No ghostPosts'}</h2>
          <h3>{}</h3>
          {/* TODO: map over post  */}
          {ghostPosts.map((post) => (
            <GhostPostCard key={post.postId} postObj={{ ...post }} onUpdate={getRelevantGhostPosts} />
          ))}
        </div>
      </div>
    </div>
  );
}
