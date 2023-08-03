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
    allClientsData,
    allLeadsData,
    addTask,
   } = useDatabaseHook()

  
  const [filterForm, setFilterForm] = useState({
    filterByTitle: "",
    filterByClient: "",
    filterByLead: "",
  })

  function handleFilterChange(e) {
    const {name, value, type, checked} = e.target
    setFilterForm(prevFormData => {
      return {
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value
      }
    })
  }

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

    // set new array with client id and formatted fullName
    const clientsFullNameArr = allClientsData && allClientsData.map(client => {
      return {
          clientId: client[0],
          clientFullName: client[1].firstName + " " + client[1].lastName
      }
    })
  
    // set new array with clients matching form input 
    // and their clientId
    const filteredClientsArr = clientsFullNameArr.filter(client => {
      return client.clientFullName.toLowerCase().includes(filterForm.filterByClient.toLowerCase())
    })

    // set new array only with the id's of matching clients
    // if leadItem.clientId is in below array, it will be displayed
    let filteredClientsId = []

    if (filterForm.filterByClient) {
      filteredClientsId = filteredClientsArr.map(item => {
        return item.clientId
    })
    } else {
      filteredClientsId.push("")
    }


    const filteredLeadsArr = allLeadsData && allLeadsData.filter(lead => {
      console.log("lead", lead)
      return lead[1].projectTitle.toLowerCase().includes(filterForm.filterByLead.toLowerCase())
    })

    console.log(filteredLeadsArr, "filtered leads")

    let filteredLeadsId = []

    if (filterForm.filterByLead) {
      console.log("jestem tutaj")
      filteredLeadsId = filteredLeadsArr.map(item => {
        console.log(item[0], "item")
        return item[0]
      })
    } else {
      filteredLeadsId.push("")
    }

    console.log(filteredLeadsId)


    
    

    let filteredByFormArr = filteredArr.filter(task => {
      return (
        task[1].title.toLowerCase().includes(filterForm.filterByTitle.toLocaleLowerCase()) &&
        filteredClientsId.includes(task[1].clientId) &&
        filteredLeadsId.includes(task[1].leadId)
      )
    })

    return filteredByFormArr
  }

  // remove below function, it was only to make a single task 
  // in database
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
    {/* ********* FILTER FORM ******** */}
    <div className='filter__form'>
            <p>Filter by:</p>
            <form>
              <div className='form__clients wrapper'>
                  <div className='wrapper'>
                    <input type='text'
                        className='input__client task-title'
                        id='task-title'
                        name='filterByTitle'
                        placeholder='Title'
                        value={filterForm.filterByTitle}
                        onChange={handleFilterChange}
                        />
                  </div>
                  <div className='wrapper'>
                    <input type='text'
                        className='input__client task-client'
                        id='task-client'
                        name='filterByClient'
                        placeholder='Client name'
                        value={filterForm.filterByClient}
                        onChange={handleFilterChange}
                        />
                  </div>
                  <div className='wrapper'>
                    <input type='text'
                        className='input__client task-lead'
                        id='task-lead'
                        name='filterByLead'
                        placeholder='Lead title'
                        value={filterForm.filterByLead}
                        onChange={handleFilterChange}
                        />
                  </div>
              
              </div>
            </form>
        </div>

      <div className=''>
        {/* <button onClick={addTaskTemporary}>Add "Other task"</button> */}
        {tasksArr}
      </div>
    </div>
  )
}

export default Tasks