const { all } = require('../app')
const db = require('../db/connection')

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'not found'})
        }
        return rows[0]
    })
}

exports.fetchAllArticles = () => {
    const commentCount = db.query(`SELECT article_id, COUNT(article_id) FROM comments GROUP BY article_id;`).then(({rows}) => {
        return rows
    })
    const articles = db.query(`SELECT * FROM articles ORDER BY created_at DESC`).then(({rows}) => {
        return rows
    })
    return Promise.all([commentCount, articles]).then((result) => {
        return result
    }).then((result) => {
        const allCommentsCount = result[0]
        const allArticles = result[1]
        allArticles.forEach((article) => {
            article.comment_count = 0
            allCommentsCount.forEach((commentcount) => {
                if (article.article_id === commentcount.article_id) {
                    article.comment_count = Number(commentcount.count)
                }
                return article
            })
            return article
        })
        return allArticles
    })
}
