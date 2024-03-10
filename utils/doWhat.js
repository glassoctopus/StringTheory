// const myGetGhostsOfParent = (parentPost, ghostPostsArray) => {
//   const currentParentPostId = parentPost.postId;
//   let postIdIndex = '';
//   let postTempStorage = [];
//   let newParentPost = {};
//   const chainOfPosts = [];
//   if (ghostPostsArray.find((object) => Object.values(object).includes(currentParentPostId))) {
//     postIdIndex = ghostPostsArray.findIndex((object) => Object.values(object).includes(currentParentPostId));
//     newParentPost = ghostPostsArray[postIdIndex];
//     postTempStorage = ghostPostsArray.splice(postIdIndex);
//     chainOfPosts.push(...postTempStorage);
//     return myGetGhostsOfParent(newParentPost, ghostPostsArray);
//   }
//   return chainOfPosts;
// };

// ChatGPT had some rewrites.
const getGhostsOfParent = (parentPost, ghostPostsArray) => {
  const chainOfPosts = [parentPost];

  const findGhostsRecursively = (currentPostId) => {
    const ghosts = ghostPostsArray.filter((post) => post.ghostParentPost === currentPostId);
    if (ghosts.length === 0) return;

    ghosts.forEach((ghost) => {
      chainOfPosts.push(ghost);
      findGhostsRecursively(ghost.postId);
    });
  };

  findGhostsRecursively(parentPost.postId);

  return chainOfPosts;
};

export default getGhostsOfParent;
