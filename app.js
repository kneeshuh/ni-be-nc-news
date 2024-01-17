const express = require('express')
const app = express()


const { getAllTopics } = require('./controllers/topics.controllers')
const { getApi } = require('./controllers/api.controllers')
const { getArticleById, getAllArticles, patchVotesByArticleId } = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postCommentById, deleteCommentById } = require('./controllers/comments.controllers')

app.use(express.json())

app.get('/api/topics', getAllTopics);

app.get('/api', getApi);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentById)

app.patch('/api/articles/:article_id', patchVotesByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentById)

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
    if (err) {
        console.log(err)
    } else {
        next(err)
    }
})

module.exports = app;