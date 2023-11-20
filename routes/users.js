const { findOne } = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();

router.put("/update/:id", async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).then(() => {
            res.status(200).json({
                status: true, message: "user Updated successfully",
            })
        }).catch(err => {
            res.status(500).json(err);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// delete user

router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (user) {
            User.findByIdAndDelete({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({ status: true, message: "User deleted" });
                })
                .catch(err => res.status(500).json(err));
        } else {
            res.status(200).json({ status: false, message: "user not found with this id" });
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

// get all users

router.get("/get", async (req, res) => {
    User.find().then(users => {
        res.status(200).json({
            status: true, message: "users fetched successfully",
            data: users
        })
    }).catch(err => res.status(500).json(err))
});

// get single users

router.get("/getUser/:id", async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        user &&
            res.status(200).json({
                status: true, message: "user fetched successfully",
                data: user
            });
        !user &&
            res.status(200).json({
                status: false, message: "user not found",
            });

    } catch (err) {
        res.status(500).json(err)
    }
});

/// follow
router.put("/follow/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        const currentUser = await User.findOne({ _id: req.body.userId });

        let isFollowed = false;

        user.followers.map(item => {
            if (item == req.body.userId) {
                isFollowed = true;
            }
        });

        if (isFollowed) {
            const res1 = await User.updateOne({ _id: req.params.id },
                { $pull: { followers: req.body.userId } });
            const res2 = await User.updateOne({ _id: req.body.userId },
                { $pull: { following: req.params.id } });

            res.status(200).json({
                status: true,
                message: "user unfollowed successfully"
            });
        } else {
            const res1 = await User.updateOne({ _id: req.params.id },
                { $push: { followers: req.body.userId } });
            const res2 = await User.updateOne({ _id: req.body.userId },
                { $push: { following: req.params.id } });

            res.status(200).json({
                status: true,
                message: "followed user successfully"
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// unfollow

// router.put("/unfollow/:id", async (req, res) => {
//     try {
//         const user = await User.findOne({ _id: req.params.id });
//         const currentUser = await User.findOne({ _id: req.body.userId });

//         let isFollowed = false;

//         user.followers.map(item => {
//             if (item == req.body.userId) {
//                 isFollowed = true;
//             }
//         });

//         if (!isFollowed) {
//             res.status(200).json({
//                 status: false,
//                 message: "you are not followed this user"
//             });
//         } else {
//             const res1 = await User.updateOne({ _id: req.params.id },
//                 { $pull: { followers: req.body.userId } });
//             const res2 = await User.updateOne({ _id: req.body.userId },
//                 { $pull: { following: req.params.id } });

//             res.status(200).json({
//                 status: true,
//                 message: "unFollowed user successfully"
//             });
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;