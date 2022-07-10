const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const imax = blogs.length === 0 ? 0 : Math.max(...blogs.map(blog => blog.likes));
  const blog = blogs.find(blog => blog.likes === imax);
  if (blog === undefined) return undefined;
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
  };
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined;
  const groups = _.countBy(blogs.map(blog => blog.author))
  const author = _.maxBy(_.keys(groups), o => groups[o])
  return {
    author: author,
    blogs: groups[author],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
