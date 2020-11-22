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

const MyCards = () => {
  return (
    <rs.Row>
      <MyCardCol/>
      <MyCardCol/>
      <MyCardCol/>
      <MyCardCol/>
      <MyCardCol/>
      <MyCardCol/>
      <MyCardCol/>
      <MyCardCol/>
    </rs.Row>
  )
}

const MyCardCol = () => {
  return (
    <rs.Col md="4" style={{marginTop: 20}}>
      <rs.Card>
        <MyCardBody/>
      </rs.Card>
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

const MyCardBody = () => {
  const [ count, formattedCount, isCounting, toggleCounter, restartCounter ] = useTimer()
  return (
    <rs.CardBody style={ isCounting ? {background: "#e6ffeb"} : (count !== 0) ? {background: "#fffaeb"} : {} } >
      <Title/>
      <rs.CardText>Seconds ellapsed: {formattedCount}</rs.CardText>
      <rs.Button color="primary" style={{marginRight: 5}} onClick={toggleCounter}>{ isCounting ? "Pause" : (count === 0) ? "Start" : "Continue" }</rs.Button>
      { (count !== 0) ? <rs.Button onClick={restartCounter}>Reset</rs.Button> : "" }
    </rs.CardBody>
  )
}

const Title = () => {
  const formDescription = useForm("Enter a new title")
  const [ isEditing, editButton, handleFinishEditting ] = useEditButton()

  const ref = useRef(null);

  useEffect(() => {
    if (isEditing) {
      ref.current.focus()
      ref.current.select()
    }
  }, [isEditing])

  return (
    <>
    <rs.CardTitle tag="h5">
      <form onSubmit={handleFinishEditting}>
        { isEditing ? (
          <rs.Input {...formDescription} style={{display: "inline", width: "auto"}} innerRef={ref}/> 
        ) : (
          <>{ formDescription.value || "Stopwatch" }</>
        )}
        {editButton}
      </form>
    </rs.CardTitle>
    </>
  )
}

const useEditButton = () => {
  const [ isEditing, setIsEditing ] = useState(false)
  return [
    isEditing,
    <EditTitleButton setIsEditing={setIsEditing} isEditing={isEditing}/>,
    (e) => {
      setIsEditing(false)
      e.preventDefault()
    }
  ]
}

const EditTitleButton = (props) => {
  if (!props.isEditing) {
    return (
      <rs.Button size="sm" style={{marginLeft: 5}} onClick={() => props.setIsEditing(true)} >Set title</rs.Button>
    )
  }
  return (
    <rs.Button size="sm" style={{marginLeft: 5}} onClick={() => props.setIsEditing(false)} >OK</rs.Button>
  )
}

export default App;
