import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
// eslint-disable-next-line import/extensions
import { getSinglePost, getAllPosts } from '../../api/postData';
import PostCard from '../../components/PostCard';
import GhostPostCard from '../../components/GhostPostCard';
import { onlyGhostPosts, onlyConnectionPosts } from '../../utils/doWhat';
import { useAuth } from '../../utils/context/authContext';

export default function ViewPost() {
  const [connectedPosts, setConnectedPosts] = useState([]);
  const [postDetails, setPostDetails] = useState({});
  const [ghostPosts, setGhostPosts] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const isViewerAuthUser = user && user.uid === postDetails?.thePostersId;

  // grab postId from url
  const { postId } = router.query;

  const getAllTheConnectedPosts = useCallback(() => {
    getAllPosts(postDetails.thePostersId).then((connectedPostsData) => {
      const sortedConnected = onlyConnectionPosts(connectedPostsData ?? []);
      const connectedToThisPost = sortedConnected.filter((connectedPostsSpecificTo) => connectedPostsSpecificTo.originalPostId === postDetails.postId);
      setConnectedPosts((prevConnectedPosts) => [...prevConnectedPosts, ...connectedToThisPost]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postDetails?.thePostersId]);

  const getAllTheGhostPosts = useCallback(() => {
    getAllPosts(postDetails.thePostersId).then((GhostPostsData) => {
      const sortedGhosts = onlyGhostPosts(GhostPostsData ?? []);
      const ghostsOfThisPost = sortedGhosts.filter((ghostPostsSpecificTo) => ghostPostsSpecificTo.ghostParentPost === postDetails.postId);
      setGhostPosts((prevGhostPosts) => [...prevGhostPosts, ...ghostsOfThisPost]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postDetails?.thePostersId]);

  // call to API layer to get the data
  useEffect(() => {
    getSinglePost(postId).then(setPostDetails);
  }, [postId]);

  useEffect(() => {
    if (postDetails.thePostersId) {
      getAllTheGhostPosts();
    }
  }, [postDetails?.thePostersId, getAllTheGhostPosts]);

  useEffect(() => {
    if (postDetails.thePostersId) {
      getAllTheConnectedPosts();
    }
  }, [postDetails?.thePostersId, getAllTheConnectedPosts]);

  return (
    <div className="mt-5 d-flex flex-wrap">
      <div className="d-flex flex-column">***</div>
      <div
        className="text-white ms-5 details"
        style={{
          margin: '10px',
          padding: '10px',
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
        {isViewerAuthUser ? (
          <Link href={`/post/edit/${postDetails.postId}`} passHref>
            <Button variant="info">EDIT</Button>
          </Link>
        ) : (
          <div />
        )}
        <hr />
        <Link href="/postSpaceWeb" passHref>
          <Button variant="info">back to browsing</Button>
        </Link>
        <hr />
      </div>
      <div
        className="text-center d-flex flex-column justify-content-center align-content-center"
        style={{
          height: '90vh',
          padding: '30px',
          maxWidth: '666px',
          maxHeight: '616px',
          margin: '0 auto',
        }}
      >
        <div
          className="d-flex flex-wrap"
          style={{
            overflowX: 'scroll',
          }}
        >

          <div><h3>*******</h3></div>
          <h2>{connectedPosts.length} {connectedPosts ? 'connectedPosts loaded' : 'No connectedPosts'}</h2>
          <h3>{}</h3>
          {/* TODO: map over post  */}
          {connectedPosts.map((post) => (
            <PostCard key={post.postId} postObj={{ ...post }} onUpdate={getAllTheConnectedPosts} />
          ))}
        </div>
      </div>
      <div
        className="text-center d-flex flex-column justify-content-center align-content-center"
        style={{
          height: '90vh',
          padding: '30px',
          maxWidth: '666px',
          maxHeight: '223px',
          margin: '0 auto',
        }}
      >
        <div
          className="d-flex flex-wrap"
          style={{
            overflowY: 'scroll',
          }}
        >

          <div><h3>*******</h3></div>
          <h2>{ghostPosts.length} {ghostPosts ? 'ghostPosts loaded' : 'No ghostPosts'}</h2>
          <h3>{}</h3>
          {/* TODO: map over post  */}
          {ghostPosts.map((post) => (
            <GhostPostCard key={post.postId} postObj={{ ...post }} onUpdate={getAllTheGhostPosts} />
          ))}
        </div>
      </div>
    </div>
  );
}
