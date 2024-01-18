const { fetchCommentsByArticleId, insertCommentById, removeCommentById } = require('../models/comments.models')
const { checkArticleIdExists, checkCommentIdExists } = require('../utils/check-id-exists')
const { checkUserExists } = require('../utils/check-user-exists')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const fetchCommentsQuery = fetchCommentsByArticleId(article_id)
    const queries = [fetchCommentsQuery]
    if (article_id) {
        const articleIdExistsQuery = checkArticleIdExists(article_id)
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

exports.postCommentById = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params;
    const insertCommentQuery = insertCommentById(newComment, article_id)
    const queries = [insertCommentQuery]
    if (article_id) {
        const articleIdExistsQuery = checkArticleIdExists(article_id)
        queries.push(articleIdExistsQuery)
    }
    if (newComment) {
        const userExistsQuery = checkUserExists(newComment.username)
        queries.push(userExistsQuery)
    }
    Promise.all(queries)
    .then((response) => {
        const comment = response[0]
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const removeCommentQuery = removeCommentById(comment_id)
    const queries = [removeCommentQuery]
    if (comment_id) {
        const commentIdExistsQuery = checkCommentIdExists(comment_id)
        queries.push(commentIdExistsQuery)
    }
    Promise.all(queries)
    .then((response) => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}