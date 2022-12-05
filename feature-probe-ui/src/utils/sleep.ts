const sleep = (delay: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res('ok');
    }, delay);
  });
};

export default sleep;
