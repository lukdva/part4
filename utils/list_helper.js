const dummy = (blogs) => {
    return 1;
  }
  
const totalLikes = (blogs) => {
  const total = (sum, likes) => {
    return sum + likes;
  }
  return blogs.map(blog => blog.likes).reduce(total, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (blog1, blog2) => {
    return blog1.likes >= blog2.likes ? blog1:blog2;
  }
  return blogs.length === 0 ? {} : blogs.reduce(reducer)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}