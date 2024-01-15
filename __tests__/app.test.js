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

describe('/api/topics', () => {
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
    test('404: responds with "not found" when given invalid path', () => {
        return request(app).get('/api/toopics')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
})

describe('/api', () => {
    test('GET: 200 responds with object describing all available endpoints of API', () => {
        return request(app).get('/api')
        .expect(200)
        .then(({ body }) => {
            const { endpoints } = body
            expect(endpoints).toEqual(allEndpoints)
        })
    })
})