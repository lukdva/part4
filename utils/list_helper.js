const dummy = (blogs) => {
    return 1;
  }
  
  module.exports = {
    dummy
  }

const totalLikes = (blogs) => {
  const total = (sum, likes) => {
    return sum + likes;
  }
  return blogs.map(blog => blog.likes).reduce(total, 0)
}