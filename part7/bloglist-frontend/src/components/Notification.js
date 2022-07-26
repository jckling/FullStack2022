import { connect } from 'react-redux'

const Notification = (props) => {
  console.log(props)

  const notification = props.notification.content
  const className = props.notification.className

  return notification !== ''
    ? <div className={className}>{notification}</div>
    : <div></div>
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
}

export default connect(mapStateToProps)(Notification)
