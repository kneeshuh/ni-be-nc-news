const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const fs = require('fs/promises')
const allEndpoints = require('../endpoints.json')
const app = require('../app')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('GET /invalid-file-path', () => {
    test('404: responds with "not found" when given invalid path', () => {
        return request(app).get('/api/toopics')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
})

describe('GET /api/topics', () => {
    test('GET: 200 responds with array of topic objects with slug and description properties', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            const { topics } = body
            expect(topics.length).toBe(3)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
            })
        })
    })
})

describe('GET /api', () => {
    test('GET: 200 responds with object describing all available endpoints of API', () => {
        return request(app).get('/api')
        .expect(200)
        .then(({ body }) => {
            const { endpoints } = body
            expect(endpoints).toEqual(allEndpoints)
        })
    })
})

describe('/api/articles/:article_id', () => {
    test('GET: 200 send a single article object with correct properties', () => {
        return request(app).get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            const article = body.article
            expect(article.article_id).toBe(1)
            expect(article).toHaveProperty('article_id')
            expect(article).toHaveProperty('title')
            expect(article).toHaveProperty('topic')
            expect(article).toHaveProperty('author')
            expect(article).toHaveProperty('body')
            expect(article).toHaveProperty('created_at')
            expect(article).toHaveProperty('votes')
            expect(article).toHaveProperty('article_img_url')
        })
    })
    test('GET: 404 sends appropriate error status and message when given valid but non-existent article_id', () => {
        return request(app).get('/api/articles/25')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('GET: 400 send appropriate error status and message when given invalid article_id', () => {
        return request(app).get('/api/articles/not-an-article-id')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('PATCH: 200 sends appropriate status code and responds with the updated article', () => {
        return request(app).patch('/api/articles/3')
        .send({
            inc_votes: -99
        })
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            expect(article.article_id).toBe(3)
            expect(article.votes).toBe(-99)
        })
    })
    test('PATCH: 404 sends appropriate error code and message when given valid id but non-existent article', () => {
        return request(app).patch('/api/articles/25')
        .send({
            inc_votes: 1
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('PATCH: 400 send appropriate error code and message when given invalid id', () => {
        return request(app).patch('/api/articles/not-an-article-id')
        .send({
            inc_votes: 100
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request')
        })
    })
})

describe('/api/articles', () => {
    test('GET: 200 responds with array of article objects, each containing all relevant properties', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy('created_at', { descending: true })
            articles.forEach((article) => {
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
            })
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GET: 200 responds with an array of comment object with relevant article id', () => {
        return request(app).get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments.length).toBe(11)
            expect(comments).toBeSortedBy('created_at', { descending: true })
            comments.forEach((comment) => {
                expect(comment.article_id).toBe(1)
                expect(comment).toHaveProperty('comment_id')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('created_at')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('body')
                expect(comment).toHaveProperty('article_id')
            })
        })
    })
    test('GET: 200 send appropriate status and empty array when there are no comments for existing article', () => {
        return request(app).get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments).toEqual([])
        })
    })
    test('GET: 404 sends appropriate error status and message when given valid but non-existent article_id', () => {
        return request(app).get('/api/articles/25/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('GET: 400 send appropriate error status and message when given invalid article_id', () => {
        return request(app).get('/api/articles/not-an-article-id/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('POST: 201 inserts comment and return with newly added comment', () => {
        return request(app).post('/api/articles/2/comments')
        .send({
            username: 'user',
            body: 'comment text'
        })
        .expect(201)
        .then(({ body }) => {
            const { comment } =  body
            expect(comment.author).toBe('user')
            expect(comment.body).toBe('comment text')
        })
    })
    test('POST: 400 sends appropriate error status and message when given invalid article_id', () => {
        return request(app).post('/api/articles/not-an-article-id/comments')
        .send({
            username: 'user',
            body: 'comment text'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('POST: 404 send appropriate error status and message when given valid but non-existent article_id', () => {
        return request(app).post('/api/articles/25/comments')
        .send({
            username: 'user',
            body: 'comment text'
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
})

describe('/api/comments/:comment_id', () => {
    test('DELETE: 204 responds with appropriate status code and no content', () => {
        return request(app).delete('/api/comments/18')
        .expect(204)
    })
    test('DELETE: 404 responds with appropriate error message if given valid but non-existent comment_id', () => {
        return request(app).delete('/api/comments/25')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('DELETE: 400 responds with appropriate error message if given invalid id', () => {
        return request(app).delete('/api/comments/non-a-comment-id')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request')
        })
    })
})

describe.only('/api/users', () => {
    test('GET: 200 responds with an array of user objects, with relevant properties', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({ body }) => {
            const { users } = body
            expect(users.length).toBe(4)
            users.forEach((user) => {
                expect(user).toHaveProperty('username')
                expect(user).toHaveProperty('name')
                expect(user).toHaveProperty('avatar_url')
            })
        })
    })
})