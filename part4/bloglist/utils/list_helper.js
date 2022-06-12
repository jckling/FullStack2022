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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
