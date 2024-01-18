const { fetchArticleById, fetchAllArticles, updateVotesByArticleId } = require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    const { topic } = req.query;
    const validTopicQueries = ['cats', 'mitch']
    if (!topic) {
        fetchAllArticles().then((articles) => {
            res.status(200).send({ articles })
        })
        .catch((err) => {
            next(err)
        })
    } else if (!validTopicQueries.includes(topic)) {
        return Promise.reject({ status: 400, msg: 'invalid topic query'})
        .catch((err) => {
            next (err)
        })
    } else {
        fetchAllArticles(topic).then((articles) => {
            res.status(200).send({ articles })
        })
        .catch((err) => {
            next(err)
        })
    }
}

exports.patchVotesByArticleId = (req, res, next) => {
    const votesIncrement = req.body;
    const { article_id } = req.params;
    updateVotesByArticleId(votesIncrement, article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}