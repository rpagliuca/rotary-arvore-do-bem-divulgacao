import { React, useEffect, useReducer, useState, useRef } from 'react';
import * as rs from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

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

const useTimer = (initialRunningState) => {

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
    isCounting: (initialRunningState === INITIAL_STATE_RUNNING) ? true : false,
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
const KEY_CODE_A = 65
const KEY_CODE_DELETE = 46

const TYPE_FOCUS_RIGHT = "TYPE_FOCUS_RIGHT"
const TYPE_FOCUS_LEFT = "TYPE_FOCUS_LEFT"
const TYPE_ADD_RUNNING_STOPWATCH = "TYPE_ADD_RUNNING_STOPWATCH"
const TYPE_ADD_STOPPED_STOPWATCH = "TYPE_ADD_STOPPED_STOPWATCH"
const TYPE_DELETE = "TYPE_DELETE"

const INITIAL_STATE_RUNNING = "INITIAL_STATE_RUNNING"
const INITIAL_STATE_STOPPED = "INITIAL_STATE_STOPPED"

const newCard = (id, initialState) => {
  return {
    id: id,
    initialState: initialState || INITIAL_STATE_RUNNING
  }
}

const MyCards = () => {

  const [ state, dispatch ] = useReducer((state, action) => {
    let cards = []
    let card = {}
    let currentFocusPos = 0
    let nextState = {}
    let nextCard = {}
    let nextCardId = 0
    let latestCard = {}
    let latestId = 0
    switch (action.type) {
      case TYPE_ADD_RUNNING_STOPWATCH:
        cards = [...state.cards]
        latestCard = cards[cards.length - 1]
        latestId = (latestCard && latestCard.id) || 0
        card = newCard(latestId + 1, INITIAL_STATE_RUNNING)
        cards.push(card)
        return {...state, cards: cards, currentFocusId: card.id}
      case TYPE_ADD_STOPPED_STOPWATCH:
        cards = [...state.cards]
        latestCard = cards[cards.length - 1]
        latestId = (latestCard && latestCard.id) || 0
        card = newCard(latestId + 1, INITIAL_STATE_STOPPED)
        cards.push(card)
        return {...state, cards: cards, currentFocusId: card.id}
      case TYPE_DELETE:
        cards = [...state.cards]
        cards = cards.filter(i => i.id !== action.id)
        nextState = {...state, cards: cards}
        if (action.id === state.currentFocusId) {
          currentFocusPos = state.cards.findIndex(i => i.id === state.currentFocusId)
          nextCard = state.cards[(currentFocusPos + 1) % state.cards.length]
          nextCardId = (nextCard && nextCard.id) || 0
          nextState.currentFocusId = nextCardId
        }
        return nextState
      case TYPE_FOCUS_RIGHT:
        currentFocusPos = state.cards.findIndex(i => i.id === state.currentFocusId)
        nextCard = state.cards[(currentFocusPos + 1) % state.cards.length]
        nextCardId = (nextCard && nextCard.id) || 0
        return {...state, currentFocusId: nextCardId}
      case TYPE_FOCUS_LEFT:
        currentFocusPos = state.cards.findIndex(i => i.id === state.currentFocusId)
        const previousCard = state.cards[(currentFocusPos - 1 + state.cards.length) % state.cards.length]
        const previousCardId = (previousCard && previousCard.id) || 0
        return {...state, currentFocusId: previousCardId}
      default:
        return state
    }
  }, {
    cards: [
      newCard(1)
    ],
    currentFocusId: 1
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.keyCode
      if (k === KEY_CODE_ARROW_RIGHT) dispatch({ type: TYPE_FOCUS_RIGHT })
      if (k === KEY_CODE_ARROW_LEFT) dispatch({ type: TYPE_FOCUS_LEFT })
      if (k === KEY_CODE_ENTER) dispatch({ type: TYPE_ADD_RUNNING_STOPWATCH })
      if (k === KEY_CODE_A) dispatch({ type: TYPE_ADD_STOPPED_STOPWATCH })
    }
    document.addEventListener("keydown", handleKeyDown, false)
    return () => document.removeEventListener("keydown", handleKeyDown, false)
  }, [dispatch])

  return (
    <rs.Row>
      {state.cards.map(i => <MyCardCol key={i.id} handleDelete={() => dispatch({type: TYPE_DELETE, id: i.id})} cardNumber={i.id} hasFocus={i.id === state.currentFocusId} initialState={i.initialState}/>)}
      <AddCard addCard={() => dispatch(TYPE_ADD_RUNNING_STOPWATCH)}/>
      <ShortcutCard/>
    </rs.Row>
  )
}

const MyCardCol = (props) => {
  let style = {}
  if (props.hasFocus) {
    style["borderColor"] = "black"
  }

  return (
    <rs.Col md="4" style={{marginTop: 10, marginBottom: 10}}>
      <rs.Card style={style}>
        <MyCardBody cardNumber={props.cardNumber} hasFocus={props.hasFocus} handleDelete={props.handleDelete} initialState={props.initialState}/>
      </rs.Card>
    </rs.Col>
  )
}

const AddCard = (props) => {
  return (
    <rs.Col md="4" sm="12" style={{marginTop: 10, marginBottom: 10}}>
      <rs.Button color="secondary" style={{fontSize: "200%"}} onClick={props.addCard}>+</rs.Button>
    </rs.Col>
  )
}

const ShortcutCard = () => {
  return (
    <rs.Col md="4" sm="12" style={{marginTop: 10, marginBottom: 10}}>
      <rs.Row><rs.Col><Key>ENTER</Key> Add a new running stopwatch with focus</rs.Col></rs.Row>
      <rs.Row><rs.Col><Key>A</Key> Add a new stopped stopwatch with focus</rs.Col></rs.Row>
      <rs.Row><rs.Col><Key>L</Key> Lap</rs.Col></rs.Row>
      <rs.Row><rs.Col><Key>←</Key> Focus left</rs.Col></rs.Row>
      <rs.Row><rs.Col><Key>→</Key> Focus right</rs.Col></rs.Row>
      <rs.Row><rs.Col><Key>SPACE</Key> Toggle focused stopwatch</rs.Col></rs.Row>
    </rs.Col>
  )
}

const Key = (props) => {
  return (
    <pre style={{display: "inline", background: "#DDD", marginTop: 5, padding: 3}}>{props.children}</pre>
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
  const [ count, formattedCount, isCounting, toggleCounter, restartCounter ] = useTimer(props.initialState)

  const ref = useRef(null)

  useEffect(() => {
    if (!props.hasFocus) return
    const handleKeyDown = (e) => {
      if (e.keyCode === KEY_CODE_SPACE) toggleCounter()
      if (e.keyCode === KEY_CODE_DELETE) props.handleDelete()
    }
    ref.current.focus()
    document.addEventListener("keydown", handleKeyDown, false)
    return () => document.removeEventListener("keydown", handleKeyDown, false)
  }, [toggleCounter, props])

  let style = {}

  if (isCounting) {
    style["background"] = "#e6ffeb"
  } else if (count !== 0) {
    style["background"] = "#fffaeb"
  }

  return (
    <div ref={ref} tabIndex="0">
      <rs.CardBody style={style}>
        <div style={{zIndex: 1}}>
          <Title cardNumber={props.cardNumber}/>
        </div>
        <rs.CardText>Seconds ellapsed: {formattedCount}</rs.CardText>
        <rs.Button color="primary" style={{marginRight: 5}} onClick={toggleCounter}>{ isCounting ? "Pause" : (count === 0) ? "Start" : "Continue" }</rs.Button>
        <DeleteButton handleClick={props.handleDelete}/>
        { (count !== 0) ? <rs.Button color="danger" style={{marginRight: 5, float: "right"}} onClick={restartCounter}>Reset</rs.Button> : "" }
      </rs.CardBody>
    </div>
  )
}

const Title = (props) => {
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
           { formDescription.value || "Stopwatch " + props.cardNumber }
          </rs.CardTitle>
        )}
      </form>
    </>
  )
}

export default App;
