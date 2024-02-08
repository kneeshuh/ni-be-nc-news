const cors = require('cors');

const express = require('express')
const app = express()


const { getAllTopics } = require('./controllers/topics.controllers')
const { getApi } = require('./controllers/api.controllers')
const { getArticleById, getAllArticles, patchVotesByArticleId } = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postCommentById, deleteCommentById } = require('./controllers/comments.controllers')
const { getAllUsers } = require('./controllers/users.controllers')

app.use(cors());
app.use(express.json())

app.get('/api/topics', getAllTopics);

app.get('/api', getApi);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentById)

app.patch('/api/articles/:article_id', patchVotesByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.get('/api/users', getAllUsers)

app.all('*', (req, res) => {
    res.status(404).send({msg: 'not found'})
});

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'bad request'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({msg: 'not found'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send({msg: 'bad request - violates not null constraint'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '42703') {
        res.status(400).send({msg: 'bad request - invalid sort_by query'})
    } else {
        next(err)
    }
})

module.exports = app;