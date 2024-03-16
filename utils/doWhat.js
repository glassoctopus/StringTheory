// const getGhostsOfParent = (parentPost, ghostPostsArray) => {
//   const chainOfPosts = [parentPost];

//   const findGhostsRecursively = (currentPostId) => {
//     const ghosts = ghostPostsArray.filter((post) => post.ghostParentPost === currentPostId);
//     if (ghosts.length === 0) return;

//     ghosts.forEach((ghost) => {
//       chainOfPosts.push(ghost);
//       findGhostsRecursively(ghost.postId);
//     });
//   };

//   findGhostsRecursively(parentPost.postId);

//   return chainOfPosts;
// };

const getGhostsOfParent = (parentPost, ghostPostsArray) => {
  const chainOfPosts = [parentPost];
  const ghostPosts = ghostPostsArray.filter((ghostPost) => ghostPost.ghostParentPost === parentPost.postId);
  chainOfPosts.push(...ghostPosts);
  return chainOfPosts;
};

const onlyPosts = (postsArray) => {
  const onlyThePosts = postsArray.filter((post) => !post.isGhost && !post.isConnection);
  return onlyThePosts;
};

const onlyGhostPosts = (postsArray) => {
  const onlyGhosts = postsArray.filter((post) => post.isGhost);
  return onlyGhosts;
};

const onlyConnectionPosts = (postsArray) => {
  const onlyConnections = postsArray.filter((post) => post.isConnectionPost);
  return onlyConnections;
};

export {
  getGhostsOfParent, onlyPosts, onlyGhostPosts, onlyConnectionPosts,
};
