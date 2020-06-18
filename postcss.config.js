module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 32.5,
      //   rootValue: 32,
      propList: ["*"],
      // selectorBlackList: ["van-", "cube-", "arrow", "px-"]
      minPixelValue: 1,
      // 失效！！！回头再查这个是@media里面的px会不会转成rem,true就是会，false就是不会
      mediaQuery: false,
      // 失效！！！
      exclude: /src\/components\/FileItem\.vue/
    }
  }
};
/* pxtorem-disable-next-line */
/**
 * 
 * https://github.com/cuth/postcss-pxtorem/
    rootValue: 16,
    unitPrecision: 5,
    propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
    exclude: /node_modules/i
}
 */
