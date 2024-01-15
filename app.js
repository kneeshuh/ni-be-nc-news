const express = require('express')
const app = express()

const { getAllTopics } = require('./controllers/topics.controllers')
const { getApi } = require('./controllers/api.controllers')
const { getArticleById } = require('./controllers/articles.controllers')

app.get('/api/topics', getAllTopics);

app.get('/api', getApi);

app.get('/api/articles/:article_id', getArticleById)

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

module.exports = app;