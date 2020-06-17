module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 32.5,
      //   rootValue: 32,
      propList: ["*"],
      // selectorBlackList: ["van-", "cube-", "arrow", "px-"]
      minPixelValue: 1
    }
  }
};
/**
 * rootValue: 75,
  unitPrecision: 5,
  propList: ['*'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 12

作者：Cryptolalia
链接：https://juejin.im/post/5cd5214851882544327a2d79
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */
