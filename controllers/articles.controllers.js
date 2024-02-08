const { fetchArticleById, fetchAllArticles, updateVotesByArticleId } = require('../models/articles.models')
const { checkTopicExists } = require('../utils/check-topic-exists')

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
    const { topic, sort_by, order } = req.query;
    const queries = []
    if (!topic) {
        const fetchArticlesQuery = fetchAllArticles(topic, sort_by, order)
        queries.push(fetchArticlesQuery)
    }
    if (topic) {
        const fetchArticlesWithTopicQuery = fetchAllArticles(topic, sort_by, order)
        queries.push(fetchArticlesWithTopicQuery)
        const topicExistsQuery = checkTopicExists(topic)
        queries.push(topicExistsQuery)
    }
    Promise.all(queries)
    .then((response) => {
        const articles = response[0]
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
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