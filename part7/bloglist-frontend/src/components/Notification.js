const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  console.log(message, type)

  return <div className={type}>{message}</div>
}

export default Notification
