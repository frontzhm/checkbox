module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 32.5,
      //   rootValue: 32,
      propList: ["*"]
      // selectorBlackList: ["van-", "cube-", "arrow", "px-"]
    }
  }
};
