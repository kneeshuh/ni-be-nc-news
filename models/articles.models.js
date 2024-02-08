const db = require('../db/connection')

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments on comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'not found'})
        }
        return rows[0]
    })
}

exports.fetchAllArticles = (topic = '', sort_by = 'created_at', order = 'DESC') => {
    if (!topic) {
        return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
        LEFT JOIN comments on comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`)
        .then(({ rows }) => {
            return rows
        })
    } else {
        return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
        LEFT JOIN comments on comments.article_id = articles.article_id
        WHERE articles.topic = $1
        GROUP BY articles.article_id
        ORDER BY articles.${sort_by} ${order};`,
        [topic])
        .then(({ rows }) => {
            return rows
        })
    }
}

exports.updateVotesByArticleId = (votesIncrement, article_id) => {
    return db.query(`UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
    [votesIncrement.inc_votes, article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'not found'})
        }
        return rows[0]
    })
}
