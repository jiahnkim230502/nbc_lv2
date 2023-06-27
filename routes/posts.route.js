const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Posts } = require("../models");
const { Op } = require('sequelize');



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

// 12. 토큰을 검사하여, 해당 사용자가 작성한 게시글만 수정 가능
// 게시글 수정 API
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;

    const post = await Posts.findOne({
        where: { userId, postId },
    });

    if (!post) {
        return (res.status(404).json({ message: "사용자가 일치하지 않습니다." }));
    };

    // 게시글 수정 시작
    await Posts.update(
        { title, content }, // 수정할 칼럼 및 데이터
        {
            where: {
                [Op.and]: [{ userId }, { postId }]
            }
        }, // 어떤 데이터를 수정할지 작성
    );

    return res.status(200).json({ message: "게시글이 수정되었습니다." });
});

// 13. 토큰을 검사하여, 해당 사용자가 작성한 게시글만 삭제 가능
// 게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const post = await Posts.findOne({
        where: { postId },
    });

    if (!post) {
        return res.status(404).json({
            message: "게시글이 존재하지 않습니다.",
        })
    } else if (post.UserId !== userId) {
        return res.status(403).json({
            message: "게시글 삭제 권한이 있는 사용자가 아닙니다.",
        });
    };

    // 게시글 삭제
    await Posts.destroy({
        where: {
            [Op.and]: [{ userId }, { postId }]
        }
    });

    return res.status(200).json({ message: "게시글이 삭제되었습니다." });
});

module.exports = router;