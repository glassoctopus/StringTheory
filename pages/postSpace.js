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
  const [allPostsAndChains, setAllPostsAndChains] = useState([]);

  // user ID using useAuth Hook
  const { user } = useAuth();

  const getUsersPosts = useCallback(() => {
    getPosts(user.uid).then((PostsData) => {
      setPosts((prevPosts) => [...prevPosts, ...PostsData]);
    });
  }, [user.uid]);

  const getUsersGhostPosts = useCallback(() => {
    getGhostPosts(user.uid, true).then((GhostPostsData) => {
      setGhostPosts((prevGhostPosts) => [...prevGhostPosts, ...GhostPostsData]);
    });
  }, [user.uid]);

  const allchainsOfAllPosts = useCallback(() => {
    const updatedallPostsAndChains = [];

    posts.forEach((post) => {
      let chainOfPostsForPost = [];
      const postHasGhosts = ghostPosts.some((ghostPost) => ghostPost.ghostParentPost === post.postId);

      if (postHasGhosts) {
        chainOfPostsForPost = getGhostsOfParent(post, ghostPosts);
      } else {
        chainOfPostsForPost.push(post);
      }
      updatedallPostsAndChains.push(chainOfPostsForPost);
    });

    setAllPostsAndChains(updatedallPostsAndChains);
  }, [posts, ghostPosts]);

  // make the call to the API to get all the Posts on component render
  useEffect(() => {
    getUsersPosts();
    getUsersGhostPosts();
  }, [getUsersPosts, getUsersGhostPosts]);

  useEffect(() => {
    if (posts.length > 0 || ghostPosts.length > 0) {
      allchainsOfAllPosts();
    }
  }, [posts, ghostPosts, allchainsOfAllPosts]);

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
          {allPostsAndChains.map((chainOfPosts, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              {chainOfPosts.map((post) => (
                <div key={post.postId} style={{ marginRight: '10px' }}>
                  {post.isGhost ? (
                    <GhostPostCard postObj={{ ...post }} onUpdate={getUsersGhostPosts} />
                  ) : (
                    <PostCard postObj={{ ...post }} onUpdate={getUsersPosts} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default PostSpace;
