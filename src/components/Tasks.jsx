import React, { useState } from 'react'
import { useActionData } from 'react-router-dom'
import useDatabaseHook from '../hooks/useDatabaseHook'

//import utils
import { getToday } from './utils/utils'

function Tasks() {

  const [showClientTasks, setShowClientTasks] = useState(true)
  const [showLeadTasks, setShowLeadTasks] = useState(true)
  const [showOtherTasks, setShowOtherTasks] = useState(true)
  const [showClosedTasks, setShowClosedTasks] = useState(false)

  const { 
    allTasksData,
    addTask,
   } = useDatabaseHook()

  function filterTasks(arr) {
    let filteredArr = []
    
    //filter Client Tasks only
    let clientTasksArr = arr.filter(item => {
      return showClientTasks && item[1].clientId != ""
    })

    //filter Lead Tasks only
    let leadTasksArr = arr.filter(item => {
      return showLeadTasks && item[1].leadId != ""
    })

    //filter Other Tasks only
    let otherTasksArr = arr.filter(item => {
      return showOtherTasks && item[1].leadId === ""
      && item[1].clientId === ""
    })

    //if showClosed is true, shows all filtered tasks including
    //closed ones
    if (showClosedTasks) {
      clientTasksArr.forEach(item => {
        if (!filteredArr.includes(item)) {
          filteredArr.push(item)
        }
      })
      leadTasksArr.forEach(item => {
        if (!filteredArr.includes(item)) {
          filteredArr.push(item)
        }
      })
      otherTasksArr.forEach(item => {
        if (!filteredArr.includes(item)) {
          filteredArr.push(item)
        }
      })
    // else show only the ones which are not closed
    } else if (!showClosedTasks) {
      clientTasksArr.forEach(item => {
        if (!item[1].isClosed && !filteredArr.includes(item)) {
          filteredArr.push(item)
        }
      })
      leadTasksArr.forEach(item => {
        if (!item[1].isClosed && !filteredArr.includes(item)) {
          filteredArr.push(item)
        }
      })
      otherTasksArr.forEach(item => {
        if (!item[1].isClosed && !filteredArr.includes(item)) {
          filteredArr.push(item)
        }
      })
    }

    // Must be a more efficient way to filter those items without 
    // iterating through the whole array for each task type
    // BUT HOW???
    return filteredArr
  }

  function addTaskTemporary() {
    addTask(
      "",
      "",
      "Automatically added Other Task",
      getToday(),
      "2023-08-02"
    )
  }

  const tasksArr = allTasksData && filterTasks(allTasksData).map(item => {
    return (
      <div key={item[0]}>
        <p>{[item[1].title]}</p>
      </div>
    )
  })

  return (
    <div className='container'>
      <div className='filter__form'>
        {/* <button onClick={addTaskTemporary}>Add "Other task"</button> */}
        {tasksArr}
      </div>
    </div>
  )
}

export default Tasks