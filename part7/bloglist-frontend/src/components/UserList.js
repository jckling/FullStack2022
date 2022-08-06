import React from 'react'
import { useSelector } from 'react-redux'

const _ = require('lodash')

const UserList = () => {
  const blogs = useSelector((state) => state.blogs)
  const groups = _.countBy(blogs.map(blog => blog.author))
  const authors = _.keys(groups)

  return (
    <div>
      <h2>users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {authors.map(author => 
            <tr key={author}>
              <td>{author}</td>
              <td>{groups[author]}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
