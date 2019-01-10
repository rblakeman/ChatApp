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
      email: 'Email',
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({ email: nextProps.user.email })
    }
  }

  inputChange = (ev) => {
    this.setState({ value: ev.target.value })
  }

  submitChange = (ev) => {
    let currTime = new Date().toLocaleDateString('en-US', DATE_OPTIONS)
    let newMessage = {
      timestamp: currTime,
      email: this.state.email,
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
