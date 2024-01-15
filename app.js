const express = require('express')
const app = express()

const { getAllTopics } = require('./controllers/topics.controllers')
const { getApi } = require('./controllers/api.controllers')

app.get('/api/topics', getAllTopics);

app.get('/api', getApi);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'not found'})
})

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
});

module.exports = app;