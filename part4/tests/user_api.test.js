const mongoose = require('mongoose')
const helper = require('../utils/test.helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app) // Tests can now make HTTP requests to the backend
const User = require('../models/user')

describe('INTEGRATION TESTS when there is initially some notes saved', () => {

    beforeEach(async () => {

        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
    })

    
    test('all users are returned', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.initialUsers.length)
    })



    describe('addition of a new user', () => {

        test('a valid user can be added ', async () => {
            const newUser = {
                "username": "Leo",
                "name": "Leo Leijona",
                "password": "anasalas"
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

            const usernames = usersAtEnd.map(u => u.username)
            expect(usernames).toContain(
                'Leo'
            )
        })


        test('user without username or/and password is not added', async () => {
            const newUser = {
                "name": "Leo Leijona"
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()

            expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
        })


        test('user with too short username or password is not added', async () => {
            const newUser = {
                "username": "LA",
                "name": "Leo Leijona",
                "password": "an"
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(411)

            const usersAtEnd = await helper.usersInDb()

            expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
        })


    })


})


afterAll(() => {
    mongoose.connection.close()
})