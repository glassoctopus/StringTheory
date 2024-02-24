const rightNow = () => {
  const userCreationTime = Date.now();
  const timeStamp = new Date(userCreationTime);
  return timeStamp;
};

export default rightNow;
