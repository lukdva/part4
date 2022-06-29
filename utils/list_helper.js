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
const mostBlogs = (blogs) => {
  const reducer = (blog1, blog2) => {
    blog1[blog2.author] = blog1[blog2.author]? blog1[blog2.author] + 1 : 1; 
    return blog1;
  }
  const blogCountByAuthor = blogs.reduce(reducer, {});
  const author = findMaxPropObject(blogCountByAuthor);
  return author === '' ? {author, blogs:0} : {author, blogs: blogCountByAuthor[author]}
}
const mostLikes = (blogs) => {
  const reducer = (blog1, blog2) => {
    blog1[blog2.author] = blog1[blog2.author]? blog1[blog2.author] + blog2.likes : blog2.likes; 
    return blog1;
  }
  const likesCountByAuthor = blogs.reduce(reducer, {});
  const author = findMaxPropObject(likesCountByAuthor);
  return author === '' ? {author, likes:0} : {author, likes: likesCountByAuthor[author]}
}

const findMaxPropObject = (obj) =>{
  let propName = '';
  let max = 0;
  for (prop in obj)
  {
    if (obj[prop] > max)
      propName = prop;
      max = obj[prop];
  }
  return propName;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}