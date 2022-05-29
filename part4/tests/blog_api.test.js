const mongoose = require('mongoose')
const helper = require('../utils/test.helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app) // Tests can now make HTTP requests to the backend
const Blog = require('../models/blog')


describe('INTEGRATION TESTS when there is initially some notes saved', () => {

    beforeEach(async () => {

        await Blog.deleteMany({})
        /*
        How to handle promises
        https://fullstackopen.com/en/part4/testing_the_backend#optimizing-the-before-each-function
        await Promise.all(promiseArray)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
        #Promise.all
        let a = fetch(url1);
        let b = fetch(url2);
        let c = fetch(url3);
        
        Promise.all([a, b, c]).then(values => {
          ...
        });
        #"Promise.all" will succeed only if all the tasks it receives are successful
        */

        // insertMany abstracts promise handling behind the scenes
        await Blog.insertMany(helper.initialBlogs)
    })


    test('blogs are returned as json', async () => {
        // https://jestjs.io/docs/asynchronous
        await api
            .get('/api/blogs')
            .expect(200) // SuperTest
            .expect('Content-Type', /application\/json/) // SuperTest
    })


    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        // Async execution gets here only after the HTTP request is complete
        // The result of HTTP request is saved in variable response
        expect(response.body).toHaveLength(helper.initialBlogs.length) // Jest
    })


    test('a specific blogs is within the returned notes', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
        expect(titles).toContain('First class tests') // Jest
    })



    describe('viewing a specific blog', () => {

        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()

            // One property is Date-object (fetched straight from DB without backend server)
            const blogToView = blogsAtStart[0]

            // One property is date as a string (backend server handels serialization and parsing to string)
            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            // From Date-object to date as a string
            const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

            // Dates are in same format and can be compared to be equal
            expect(resultBlog.body).toEqual(processedBlogToView)
        })


        test('fails with statuscode 404 if note does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            console.log(validNonexistingId)

            await api
                .get(`/api/notes/${validNonexistingId}`)
                .expect(404)
        })


        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/notes/${invalidId}`)
                .expect(400)
        })
    })


    describe('addition of a new blog', () => {

        test('a valid blog can be added ', async () => {
            const newBlog = {
                title: 'async/await simplifies making async calls',
                author: 'John Doe',
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

            const authors = blogsAtEnd.map(b => b.author)
            expect(authors).toContain(
                'John Doe'
            )
        })


        test('blog without title or/and url is not added', async () => {
            const newBlog = {
                author: 'John Doe'
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })
    })


    describe('updating an individual blog', () => {

        test('update one property of an object', async () => {

            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            blogToUpdate["likes"] = 15

            await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

            const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
            expect(updatedBlog.likes).toEqual(15)
        })

    })


    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(
                helper.initialBlogs.length - 1
            )

            const titles = blogsAtEnd.map(b => b.title)

            expect(titles).not.toContain(blogToDelete.title)
        })


        test('id is unique identifier property (not _id like in DB)', async () => {
            const response = await api.get('/api/blogs')
            expect(response.body[0].id).toBeDefined(); // Jest
        })


        test('if likes is missing it will be set to 0', async () => {
            const newBlog = {
                title: 'if the likes property is missing from the request, it will default to the value 0',
                author: 'John Doe',
            }

            const addedBlog = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(addedBlog.body.likes).toEqual(0)

        })

    })
})


afterAll(() => {
    mongoose.connection.close()
})