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
