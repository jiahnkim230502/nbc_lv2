const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Posts } = require("../models");

// 게시글 생성 API
router.post("/posts", authMiddleware, async (req, res) => {
    // 게시글을 생성하는 사용자의 정보를 가지고 온다.
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    const post = await Posts.create({
        UserId: userId,
        title, content,
    });

    // 201 = 생성
    return res.status(201).json({ data: post });
});

// 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
    const posts = await Posts.findAll({
        attributes: ['postId', 'title', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
});

// 게시글 상세 조회 API
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.findOne({
        attributes: ['postId', 'title', 'content', 'createdAt', 'updatedAt'],
        where: { postId }
    });

    return res.status(200).json({ data: post });
});

module.exports = router;