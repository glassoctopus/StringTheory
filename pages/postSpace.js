import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import { getPosts, getGhostPosts } from '../api/postData';
import PostCard from '../components/PostCard';
import GhostPostCard from '../components/GhostPostCard';

function PostSpace() {
  const [posts, setPosts] = useState([]);
  const [ghostPosts, setGhostPosts] = useState([]);

  const chainOfPosts = [];

  // user ID using useAuth Hook
  const { user } = useAuth();

  const getAllThePosts = () => {
    getPosts(user.uid).then((PostsData) => {
      setPosts(PostsData);
    });
  };

  const getAllTheGhostPosts = () => {
    getGhostPosts(user.uid, true).then((GhostPostsData) => {
      setGhostPosts(GhostPostsData);
    });
  };

  // make the call to the API to get all the Posts on component render
  useEffect(() => {
    getAllThePosts();
    getAllTheGhostPosts();
  }, [getAllThePosts, getAllTheGhostPosts]);

  const getGhostsOfParent = (parentPost, ghostPostsArray) => {
    const currentParentPostId = parentPost.postId;
    let postIdIndex = '';
    let postTempStorage = [];
    let newParentPost = {};
    if (ghostPostsArray.find((object) => Object.values(object).includes(currentParentPostId))) {
      postIdIndex = ghostPostsArray.findIndex((object) => Object.values(object).includes(currentParentPostId));
      newParentPost = ghostPostsArray[postIdIndex];
      postTempStorage = ghostPostsArray.splice(postIdIndex);
      chainOfPosts.push(...postTempStorage);
      console.warn('newParentPost', newParentPost, 'ghostPostsArray length', ghostPostsArray.length, 'chainOfPosts', chainOfPosts);
      return getGhostsOfParent(newParentPost, ghostPostsArray);
    }
    return chainOfPosts;
  };

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
        {/* <Link href="/new" passHref>
        <Button>Add A Post</Button>
      </Link> */}
        <h2>{posts ? 'Posts loaded' : 'No Posts'}</h2>
        <h3>{}</h3>
        {/* map over post, but only show one, STILL working on */}
        {posts.map((post) => {
          if (ghostPosts.find((object) => Object.values(object).includes(post.postId))) {
            chainOfPosts.push(post);
            getGhostsOfParent(post, ghostPosts);
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
            display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', maxHeight: '70vh', // Limit the height to allow vertical scrolling
          }}
        >
          {ghostPosts.map((ghostPost) => (
            <div key={ghostPost.postId} style={{ marginRight: '10px' }}>
              <GhostPostCard postObj={{ ...ghostPost }} onUpdate={getAllTheGhostPosts} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostSpace;
