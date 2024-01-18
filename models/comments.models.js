const db = require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

exports.insertCommentById = (newComment, article_id) => {
    return db.query(`INSERT INTO users (username, name) VALUES ($1, $2) RETURNING *`, 
    [newComment.username, newComment.username])
    .then(() => {
        return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
        [newComment.username, newComment.body, article_id])
    })
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
}
