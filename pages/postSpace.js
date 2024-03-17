import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import { getPostsByUser, getAllPosts } from '../api/postData';
import PostCard from '../components/PostCard';
import GhostPostCard from '../components/GhostPostCard';
import { getGhostsOfParent, onlyPosts, onlyGhostPosts } from '../utils/doWhat';

function PostSpace() {
  const [posts, setPosts] = useState([]);
  const [ghostPosts, setGhostPosts] = useState([]);
  const [allPostsAndChains, setAllPostsAndChains] = useState([]);

  // user ID using useAuth Hook
  const { user } = useAuth();

  const getUsersPosts = useCallback(() => {
    getPostsByUser(user.uid).then((PostsData) => {
      const sorted = onlyPosts(PostsData ?? []);
      setPosts((prevPosts) => [...prevPosts, ...sorted]);
    });
  }, [user.uid]);

  const getUsersGhostPosts = useCallback(() => {
    getAllPosts(user.uid).then((GhostPostsData) => {
      const sortedGhosts = onlyGhostPosts(GhostPostsData ?? []);
      setGhostPosts((prevGhostPosts) => [...prevGhostPosts, ...sortedGhosts]);
    });
  }, [user.uid]);

  const allchainsOfAllPosts = useCallback(() => {
    const allPosts = [...posts, ...ghostPosts];

    // Remove duplicates based on postId
    const uniquePosts = Array.from(new Set(allPosts.map((post) => post.postId)))
      .map((postId) => allPosts.find((post) => post.postId === postId));

    const updatedallPostsAndChains = uniquePosts.map((post) => {
      if (post.isGhost) {
        const chain = [post, ...getGhostsOfParent(post, ghostPosts)];
        // Remove duplicate ghost posts
        const uniqueChain = chain.filter((uPost, index, self) => index === self.findIndex((p) => (
          p.postId === uPost.postId
        )));
        return uniqueChain;
      }
      return [post];
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
      <h3>Welcome to your Post Space</h3>
      <div>
        <Link href="/createPost" passHref>
          <Button>Add A Post</Button>
        </Link>
      </div>
      <h2>{posts ? posts.length : ' '} {posts ? 'Posts loaded' : 'No Posts'}</h2>
      <h3>{}</h3>
      <div
        className="d-flex flex-wrap"
        style={{
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {allPostsAndChains.map((chainOfPosts, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="d-flex flex-nowrap">
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
  );
}
export default PostSpace;
