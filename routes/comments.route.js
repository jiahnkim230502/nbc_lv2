const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Posts } = require("../models");
const { Comments } = require("../models");
const { Op } = require('sequelize');

// 14. 로그인 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 작성 가능
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;
    const newComment = await Comments.create({
        PostId: postId, 
        UserId: userId,
        comment,
    });
    const post = await Posts.findOne({
        where: { postId },
    });

    if (!post) {
        return res.status(403).json({
            message: "게시글이 존재하지 않습니다.",
        });
    };

    if (comment.length === 0) {
        return res.status(403).json({
            message: "댓글 내용을 입력해주세요.",
        });
    };

    // 201 = 생성
    return res.status(201).json({ data: newComment });
});

// 댓글 수정 API
// 15. 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 수정 가능
router.put("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    const findCommentId = await Comments.findOne({
        where: { commentId },
    });

    if (findCommentId.UserId !== userId) {
        return (res.status(404).json({ message: "사용자가 일치하지 않습니다." }));
    };

    // 댓글 수정 시작
    await Comments.update(
        { comment }, // 수정할 칼럼 및 데이터
        {
            where: {
                [Op.and]: [{ postId }, { commentId }]
            }
        },
    );

    return res.status(200).json({ message: "게시글이 수정되었습니다." });
});

module.exports = router;