import React, { Component } from 'react'

const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}

export default class FormInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userName: 'User',
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({ userName: nextProps.user.displayName })
    }
  }

  inputChange = (ev) => {
    this.setState({ value: ev.target.value })
  }

  submitChange = (ev) => {
    let currTime = new Date().toLocaleDateString('en-US', DATE_OPTIONS)
    console.log(currTime)
    let newMessage = {
      timestamp: currTime,
      userName: this.state.userName,
      value: this.state.value
    }
    if (this.state.value) this.props.onInputSubmit(newMessage)
    this.setState({ value: '' })
  }

  handleKeyPress = (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    this.submitChange()
  }

  render() {
    return (
      <div>
        <form>
          <input
            placeholder="enter text"
            onChange={this.inputChange}
            onKeyPress={this.handleKeyPress}
            // onSubmit={(ev) => {
            //   ev.preventDefault()
            // }}
            value={this.state.value}
          />
        </form>
      </div>
    )
  }
}
