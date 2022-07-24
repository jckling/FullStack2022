import { connect } from 'react-redux'

const Notification = (props) => {
  const notification = props.notification.content
  console.log(props)

  const style = {
    border: 'solid',
    padding: 10,  
    borderWidth: 1
  }

  return notification !== ''
    ? <div style={style}>{notification}</div>
    : <div></div>
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)