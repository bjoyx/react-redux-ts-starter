import * as React from "react"
import { connect } from "react-redux"
import { Dispatcher, DispatchComponent } from "helpers"
import * as Apples from "apples"

// STATE

export type State = typeof init
export const init = {
  count: 0,
  countAgain: 0,
  apples: Apples.init
}

// UPDATE

enum Type {
  Increment = "Increment",
  IncrementAgain = "IncrementAgain"
}

export type Action =
  Increment |
  IncrementAgain

interface Increment {
  type: Type.Increment
  by: number
}
const increment = (by: number): Increment => ({
  type: Type.Increment,
  by
})

interface IncrementAgain {
  type: Type.IncrementAgain
  by: number
}
const incrementAgain = (by: number): IncrementAgain => ({
  type: Type.IncrementAgain,
  by
})


export const update = (state: State = init, action: Action & Dispatcher): State => {
  switch (action.type) {
    case Type.Increment:
      action.dispatch(incrementAgain(3))
      return { ...state, count: state.count + action.by }
    case Type.IncrementAgain:
      return { ...state, countAgain: state.countAgain + action.by }
    default:
      const apples = Apples.update(state.apples, action)
      if (apples !== state.apples) return { ...state, apples }
      return state
  }
}

// VIEW

require("./root.scss")

class Root extends DispatchComponent<State> {
  interval: number

  componentWillMount() {
    this.interval = window.setInterval(() => {
      this.props.dispatch(increment(1))
    }, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  render() {
    return (
      <div className="root">
        <h1>Hello world!</h1>
        <p>
          Welcome to hot-reloading React written in TypeScript! {this.props.count} {this.props.countAgain}
        </p>
        <Apples.view {...this.props.apples} dispatch={this.props.dispatch} />
      </div>
    )
  }
}

export const view = connect((s: State) => s)(Root)
