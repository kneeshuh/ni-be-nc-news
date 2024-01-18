const db = require('../db/connection')

exports.checkArticleIdExists = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'not found'})
        }
    })
}

exports.checkCommentIdExists = (id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'not found'})
        }
    })
}