const express = require("express");
const app = express();
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const postRouter = require("./routes/posts")
const commentRouter = require("./routes/comments")
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("mongodb connected")
}).catch(err => {
    console.log(err);
});

app.get("/user", (req, res) => {
    res.send("hello user");
});

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/uploads", express.static("uploads"));
// http:/localhost:8200/uploads/
app.use("/socialapp/api/users", userRouter);
app.use("/socialapp/api/auth", authRouter);
app.use("/socialapp/api/post", postRouter);
app.use("/socialapp/api/post/comment", commentRouter);

app.use("/", (req, res) => {
res.send("server working fine")
})

app.listen(8200, () => {
    console.log("app is running on " + 8200)
});