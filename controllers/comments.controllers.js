const { fetchCommentsByArticleId, insertCommentById } = require('../models/comments.models')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    fetchCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

// exports.postCommentById = (req, res, next) => {
//     const newComment = req.body;
//     const { article_id } = req.params;
//     console.log(newComment, '<-- comment in controller')
//     insertCommentById(newComment, article_id).then((comment) => {
//         res.status(201).send({ comment })
//     })
//     .catch((err) => {
//         next(err)
//     })
// }