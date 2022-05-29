const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce(
    (sum, blog) =>
      sum + blog.likes, 0 // Here the initial value zero is the first iterations 'sum' as a starting point
  )
}


const favoriteBlog = (blogs) => {
  let mostLikes;

  blogs.forEach(blog => {

    if (mostLikes != undefined) {
      mostLikes.likes <= blog.likes
      ? mostLikes =
        {title: blog.title,
        author: blog.author,
        likes: blog.likes}
      : null
    } else {
      mostLikes =
      {title: blog.title,
        author: blog.author,
        likes: blog.likes}
      }

  });

  return mostLikes
}


// const mostBlogs = (blogs) => {
//   let amountOfBlogs;


//   return amountOfBlogs
// }


// const mostLikes = (blogs) => {
//   let amountOfLikes;


//   return amountOfLikes
// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  // mostBlogs,
  // mostLikes
}