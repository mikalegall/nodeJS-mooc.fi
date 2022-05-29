const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

const initialUsers = [
  {
    _id: "6293a54dcfe03ee330193dcf",
    username: "lare",
    name: "Mika Le Gall",
    passwordHash: "$2b$10$OUaw5SVDngVl1//yOETtkuKy0frtNwdhRA20DPh5jisffBb0hIDhu",
    blogs: [],
    __v: 0
  },
  {
    _id: "6293a8df6e075431a4d8179a",
    username: "joo",
    name: "Mika Le Gall",
    passwordHash: "$2b$10$P5vcKa5tFZjKufrvopfRj..IZbIiiX.GVFUZKTVlyEsMd6qv1cb9G",
    blogs: [],
    __v: 0
  },
  {
    _id: "6293a96758dbe41aece155ac",
    username: "Lare",
    name: "Mika Le Gall",
    passwordHash: "$2b$10$PP4Ml3BgwBIRbi.fy0aqhuJ71tLiGnUiu2zIP24Q39sao9KXXvGeK",
    blogs: [],
    __v: 0
  },
  {
    _id: "6293ac3914fa690cf4c57bea",
    username: "jookoskookos",
    name: "Mika Le Gall",
    passwordHash: "$2b$10$GbXkW584CvvMn86UByDB8.PC24eENHRXM9K0y6kg9KS7FIpVS3nuK",
    blogs: [],
    __v: 0
  }
]  

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb,
}