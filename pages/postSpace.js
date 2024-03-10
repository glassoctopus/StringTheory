import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import { getPosts, getGhostPosts } from '../api/postData';
import PostCard from '../components/PostCard';
import GhostPostCard from '../components/GhostPostCard';
import getGhostsOfParent from '../utils/doWhat';

function PostSpace() {
  const [posts, setPosts] = useState([]);
  const [ghostPosts, setGhostPosts] = useState([]);
  let chainOfPosts = [];

  // user ID using useAuth Hook
  const { user } = useAuth();

  const getAllThePosts = useCallback(() => {
    getPosts(user.uid).then((PostsData) => {
      setPosts(PostsData);
    });
  }, [user.uid]);

  const getAllTheGhostPosts = useCallback(() => {
    getGhostPosts(user.uid, true).then((GhostPostsData) => {
      setGhostPosts(GhostPostsData);
    });
  }, [user.uid]);

  // make the call to the API to get all the Posts on component render
  useEffect(() => {
    getAllThePosts();
    getAllTheGhostPosts();
  }, [getAllThePosts, getAllTheGhostPosts]);

  return (
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
        <Link href="/createPost" passHref>
          <Button>Add A Post</Button>
        </Link>
        <h2>{posts ? 'Posts loaded' : 'No Posts'}</h2>
        <h3>{}</h3>
        {/* map over post, but only show one, STILL working on */}
        {posts.map((post) => {
          if (ghostPosts.find((object) => Object.values(object).includes(post.postId))) {
            chainOfPosts = getGhostsOfParent(post, ghostPosts);
            console.warn('Chain of Posts', chainOfPosts);
          }
          return (
            <PostCard key={post.postId} postObj={{ ...post }} onUpdate={getAllThePosts} />
          );
        })}
        <h2>{ghostPosts ? 'Ghost Posts loaded' : 'No Ghost Posts'}</h2>
        <h3>{}</h3>
        <div
          className="d-flex flex-nowrap"
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            maxHeight: '70vh',
          }}
        >
          {/* map over chainOfPosts */}
          {chainOfPosts.map((ghostPost) => {
            console.warn('Chain of Posts', chainOfPosts);
            return (
              <div key={ghostPost.postId} style={{ marginRight: '10px' }}>
                <GhostPostCard postObj={{ ...ghostPost }} onUpdate={getAllTheGhostPosts} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default PostSpace;
