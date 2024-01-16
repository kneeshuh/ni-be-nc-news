const { fetchCommentsByArticleId, insertCommentById } = require('../models/comments.models')
const { checkIdExists } = require('../utils/check-id-exists')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const fetchCommentsQuery = fetchCommentsByArticleId(article_id)
    const queries = [fetchCommentsQuery]
    if (article_id) {
        const articleIdExistsQuery = checkIdExists(article_id)
        queries.push(articleIdExistsQuery)
    }
    Promise.all(queries)
    .then((response) => {
        const comments = response[0]
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