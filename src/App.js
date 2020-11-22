import { React, useEffect, useReducer, useState, useRef } from 'react';
import * as rs from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <rs.Container>
        <MyCards/>
      </rs.Container>
    </>
  );
}

const RESTART = "RESTART"
const INCREMENT = "INCREMENT"
const TOGGLE = "TOGGLE"

const useTimer = () => {

  const [ state, dispatch ] = useReducer((state, action) => {
    switch (action.type) {
      case RESTART:
        return {...state, start: (+new Date()), counter: 0, accumulated: 0}
      case INCREMENT:
        return {...state, counter: (+ new Date()) - state.start + state.accumulated}
      case TOGGLE:
        const newState = {...state, isCounting: !state.isCounting}
        if (newState.isCounting) {
          newState.accumulated = newState.counter
          newState.start = (+ new Date())
        }
        return newState
      default:
        throw new Error()
    }
  }, {
    isCounting: false,
    shouldRestart: false,
    start: (+ new Date()),
    counter: 0,
    accumulated: 0,
  })

  useEffect(() => {
    if (!state.isCounting) {
      return
    }
    const timeout = setTimeout(() => dispatch({ type: INCREMENT }), 10)
    return () => {
      clearTimeout(timeout)
    }
  }, [state])

  return [
    state.counter,
    (state.counter/1000).toFixed(2),
    state.isCounting,
    () => dispatch({ type: TOGGLE }),
    () => dispatch({ type: RESTART })
  ]
}

const KEY_CODE_ARROW_RIGHT = 39
const KEY_CODE_ARROW_LEFT = 37
const KEY_CODE_SPACE = 32
const KEY_CODE_ENTER = 13

const MyCards = () => {
  const [ cardCount, setCardCount ] = useState(1)
  const [ focusIndex, setFocusIndex ] = useState(0)

  const addCard = () => {
    setCardCount(cardCount + 1)
  }

  useEffect(() => {
    const focusRight = () => setFocusIndex(focusIndex+1)
    const focusLeft = () => setFocusIndex(focusIndex-1)
    const stopwatchToggle = () => {
      
    }
    const addStopwatch = () => addCard()
    const handleKeyDown = (e) => {
      const k = e.keyCode
      if (k === KEY_CODE_ARROW_RIGHT) focusRight()
      if (k === KEY_CODE_ARROW_LEFT) focusLeft()
      if (k === KEY_CODE_SPACE) stopwatchToggle()
      if (k === KEY_CODE_ENTER) addStopwatch()
    }
    document.addEventListener("keydown", handleKeyDown, true)
    return () => document.removeEventListener("keydown", handleKeyDown, true)
  }, [cardCount, focusIndex])

  let cards = []

  for (let i = 0; i < cardCount; i++) {
    let hasFocus = false
    if (i === focusIndex) {
      hasFocus = true
    }
    cards.push(<MyCardCol key={i} hasFocus={hasFocus}/>)
  }

  return (
    <rs.Row>
      {cards}
      <AddCard addCard={addCard}/>
    </rs.Row>
  )
}

const MyCardCol = (props) => {
  const [ isHidden, setIsHidden ] = useState(false)
  if (isHidden) {
    return <></>
  }

  let style = {}
  if (props.hasFocus) {
    style["borderColor"] = "black"
  }

  return (
    <rs.Col md="4" style={{marginTop: 20}}>
      <rs.Card style={style}>
        <MyCardBody handleHide={() => setIsHidden(true)}/>
      </rs.Card>
    </rs.Col>
  )
}

const AddCard = (props) => {
  return (
    <rs.Col md="4" sml="12" style={{marginTop: 20}}>
      <rs.Button color="secondary" style={{fontSize: "200%"}} onClick={props.addCard}>+</rs.Button>
    </rs.Col>
  )
}

const useForm = (placeholder) => {
  const [ value, setValue ] = useState("")
  return {
    value: value,
    onChange: (e) => setValue(e.target.value),
    placeholder: placeholder
  }
}

const DeleteButton = (props) => {
  return (
    <rs.Button onClick={props.handleClick} color="danger" style={{float: "right", fontSize: "100%"}}>x</rs.Button>
  )
}

const MyCardBody = (props) => {
  const [ count, formattedCount, isCounting, toggleCounter, restartCounter ] = useTimer()

  let style = {}

  if (isCounting) {
    style["background"] = "#e6ffeb"
  } else if (count !== 0) {
    style["background"] = "#fffaeb"
  }

  return (
    <rs.CardBody style={style}>
      <div style={{zIndex: 1}}>
        <Title/>
      </div>
      <rs.CardText>Seconds ellapsed: {formattedCount}</rs.CardText>
      <rs.Button color="primary" style={{marginRight: 5}} onClick={toggleCounter}>{ isCounting ? "Pause" : (count === 0) ? "Start" : "Continue" }</rs.Button>
      <DeleteButton handleClick={props.handleHide}/>
      { (count !== 0) ? <rs.Button color="danger" style={{marginRight: 5, float: "right"}} onClick={restartCounter}>Reset</rs.Button> : "" }
    </rs.CardBody>
  )
}

const Title = () => {
  const formDescription = useForm("Enter a new title")
  const [ isEditing, setIsEditing ] = useState(false)

  const ref = useRef(null);

  useEffect(() => {
    if (isEditing) {
      ref.current.focus()
      ref.current.select()
    }
  }, [isEditing])

  const handleTitleClick = (e) => {
    setIsEditing(true)
  }

  const handleFormSubmit = (e) => {
    setIsEditing(false)
    e.preventDefault()
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        { isEditing ? (
          <rs.Input {...formDescription} onBlur={handleFormSubmit} innerRef={ref} style={{marginBottom: 5}}/>
        ) : (
          <rs.CardTitle tag="h5" onClick={handleTitleClick} style={{cursor: "pointer"}}>
           { formDescription.value || "Stopwatch" }
          </rs.CardTitle>
        )}
      </form>
    </>
  )
}

export default App;
