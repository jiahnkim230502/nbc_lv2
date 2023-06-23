const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Posts } = require("../models");

// 게시글 생성 API
// 9. 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
router.post("/posts", authMiddleware, async (req, res) => {
    // 게시글을 생성하는 사용자의 정보를 가지고 온다.
    // 10. 제목, 작성 내용을 입력하기
    const { userId } = res.locals.user;
    const { title, content, nickname } = req.body;
    const post = await Posts.create({
        UserId: userId,
        title, content, nickname
    });

    // 201 = 생성
    return res.status(201).json({ data: post });
});

// 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
    // 7-2. 제목, 작성자명(nickname), 작성 날짜를 조회하기
    const posts = await Posts.findAll({
        attributes: ['postId', 'title', 'nickname', 'createdAt', 'updatedAt'],
        // 8. 작성 날짜 기준으로 내림차순 정렬하기
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
});

// 게시글 상세 조회 API
// 11. 제목, 작성자명(nickname), 작성 날짜, 작성 내용을 조회하기 
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.findOne({
        attributes: ['title', 'content', 'nickname', 'createdAt'],
        where: { postId }
    });

    return res.status(200).json({ data: post });
});

module.exports = router;