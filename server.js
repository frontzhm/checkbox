// npm i express body-parser
let express = require("express");
let bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 设置跨域
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // 让options请求快速返回
  req.method === "OPTIONS" ? res.sendStatus(200) : next();
});
// 如果需要静态文件服务可以放开下面这行
app.use(express.static("./checkbox"));
app.listen(3334, () => {
  console.log("端口3334已启动");
});
// 开始mock http://localhost:3333 访问下
app.get("/", (req, res) => {
  res.json({ ok: 1 });
});
