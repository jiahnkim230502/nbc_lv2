const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.route.js");
const postRouter = require("./routes/posts.route.js");
const commentRouter = require("./routes/comments.route.js");
const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [userRouter, postRouter, commentRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})