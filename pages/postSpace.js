import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import { getPosts } from '../api/postData';
import PostCard from '../components/PostCard';

function PostSpace() {
  const [posts, setPosts] = useState([]);

  // user ID using useAuth Hook
  const { user } = useAuth();

  const getAllThePosts = () => {
    getPosts(user.uid).then((PostsData) => {
      setPosts(PostsData);
      console.warn('PostsData', PostsData);
    });
  };

  // make the call to the API to get all the Posts on component render
  useEffect(() => {
    getAllThePosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="d-flex flex-wrap">
        {/* <Link href="/new" passHref>
        <Button>Add A Post</Button>
      </Link> */}
        <h2>{posts ? 'Posts loaded' : 'No Posts'}</h2>
        <h3>{}</h3>
        {/* TODO: map over books here using BookCard component */}
        {posts.map((post) => (
          <PostCard key={post.postId} postObj={{ ...post, isGhost: post.isGhost === 'true' }} onUpdate={getAllThePosts} />
        ))}
      </div>
    </div>
  );
}

export default PostSpace;
