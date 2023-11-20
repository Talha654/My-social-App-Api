const Post = require("../models/Post");

const router = require("express").Router();
const upload = require("../middleware/upload");

// add post
router.post("/add", upload.single("imageUrl"), async (req, res) => {
    try {
        const newPost = new Post(req.body);
        if (req.file) {
            newPost.imageUrl = req.file.filename; 
        }
        await newPost.save().then(() => {
            res.status(200).json({ status: true, message: "post add successfully" })
        }).catch(err => {
            res.status(500).json(err);
        });
    } catch (error) {
        res.status(500).json(error);
    }
})

// update post 
router.put("/update/:id", async (req, res) => {
    try {
        Post.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
            .then(() => {
                res.status(200).json({
                    status: true, message: "post Updated successfully",
                })
            }).catch(err => {
                res.status(500).json(err);
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete post 
router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await Post.findOne({ _id: req.params.id });
        if (user) {
            Post.findByIdAndDelete({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({ status: true, message: "Post deleted" });
                })
                .catch(err => res.status(500).json(err));
        } else {
            res.status(200).json({ status: false, message: "Post not found with this id" });
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

//get post details by id
router.get("/getPost/:id", async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id });
        post &&
            res.status(200).json({
                status: true, message: "Post fetched successfully",
                data: post
            });
        !post &&
            res.status(200).json({
                status: false, message: "Post not found",
            });

    } catch (err) {
        res.status(500).json(err)
    }
});

// get all post 
router.get("/get", async (req, res) => {
    Post.find().then(posts => {
        res.status(200).json({
            status: true, message: "posts fetched successfully",
            data: posts
        })
    }).catch(err => res.status(500).json(err))
});

//get all post of any user
router.get("/get/:id", async (req, res) => {
    try {
        Post.find({ userId: req.params.id }).then(posts => {
            res.status(200).json({
                status: true, message: "posts fetched successfully",
                data: posts
            })
        }).catch(err => res.status(500).json(err));
    } catch (err) {
        res.status(500).json(err);
    }
});

// like
router.put("/like/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        let isLiked = false;
        post.likes.map(item => {
            if (item == req.body.userId) {
                isLiked = true;
            }
        });

        if (isLiked) {
            const res1 = await Post.updateOne({ _id: req.params.id },
                { $pull: { likes: req.body.userId } });

            res.status(200).json({
                status: true,
                message: "liked remove successfully"
            });
        } else {
            const res1 = await Post.updateOne({ _id: req.params.id },
                { $push: { likes: req.body.userId } });

            res.status(200).json({
                status: true,
                message: "Post liked successfully"
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});




module.exports = router;