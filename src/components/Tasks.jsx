import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import useModalHook from '../hooks/useModalHook'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import './tasks.css'

//import utils
import { 
  getToday, 
  makeShortStringWithDots,
  isInDatesRange,
  getTasksStats,
 } from './utils/utils'

//import icons
import { 
  TbSquareRoundedLetterL, TbSquareRoundedLetterC, TbSquareRoundedLetterO,
  TbSquareRoundedChevronLeftFilled, TbSquareRoundedChevronRightFilled 
 } from 'react-icons/tb'
 import { ImCheckmark } from 'react-icons/im'
 import { BiShow, BiHide } from 'react-icons/bi'
 import { AiTwotoneEdit } from 'react-icons/ai'
 
function Tasks() {

  // this state is only to force DOM to re-render after DB is changed
  const [updateState, setUpdateState] = useState(false)

  const [showClientTasks, setShowClientTasks] = useState(true)
  const [showLeadTasks, setShowLeadTasks] = useState(true)
  const [showOtherTasks, setShowOtherTasks] = useState(true)
  const [showClosedTasks, setShowClosedTasks] = useState(false)

  function handleShowClientsTasks() {
    setShowClientTasks(prevData => !prevData)
  }

  const { 
    allTasksData,
    allClientsData,
    allLeadsData,
    showAllTasksData,
    addTask,
    closeTask,
    editTaskTitle,
   } = useDatabaseHook()

   const {
    modalData,
    setModalData,
    closeModal,
  } = useModalHook()

  useEffect(() => {
    // to update/refresh the page, I need to 
    // fetch data and then change state. It will cause 
    // the refresh of page with updated, fetched data
    async function refresh() {
      let data = await showAllTasksData()
    }
    refresh()
  }, [updateState])

  function refreshPage() {
    setUpdateState(prevData => !prevData)
  }

  const filterFormEmptyData = {
    filterByTitle: "",
    filterByClient: "",
    filterByLead: "",
    filterByStartDate: "",
    filterByEndDate: "",
  }

  const [filterForm, setFilterForm] = useState(filterFormEmptyData)

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
    } else if (true) {
      filteredArr.push(item)
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
    }

    // set new array with leads matching form input 
    const filteredLeadsArr = allLeadsData && allLeadsData.filter(lead => {
      return lead[1].projectTitle.toLowerCase().includes(filterForm.filterByLead.toLowerCase())
    })

    // set new array which will keep only id's matching 
    // filterForm.filterByLead input
    let filteredLeadsId = []

    if (filterForm.filterByLead) {
      filteredLeadsId = filteredLeadsArr.map(item => {
        return item[0]
      })
    } 

    let filteredByFormArr = filteredArr.filter(task => {
      if (filterForm.filterByClient.length) {
        return (
          task[1].title.toLowerCase().includes(filterForm.filterByTitle.toLocaleLowerCase()) &&
          filteredClientsId.includes(task[1].clientId) &&
          isInDatesRange(
            filterForm.filterByStartDate,
            filterForm.filterByEndDate,
            task[1].deadlineDate
            )
        )
      } else if (filterForm.filterByLead.length) {
        return (
          task[1].title.toLowerCase().includes(filterForm.filterByTitle.toLocaleLowerCase()) &&
          filteredLeadsId.includes(task[1].leadId) &&
          isInDatesRange(
            filterForm.filterByStartDate,
            filterForm.filterByEndDate,
            task[1].deadlineDate
            )
        )
      } else if (filterForm.filterByTitle.length >= 0) {
        return task[1].title.toLowerCase().includes(filterForm.filterByTitle.toLocaleLowerCase()) &&        isInDatesRange(
          filterForm.filterByStartDate,
          filterForm.filterByEndDate,
          task[1].deadlineDate
          )
      }
    })

    return filteredByFormArr
  }

  const tasksArr = allTasksData && filterTasks(allTasksData).map(item => {
    return (
      <div key={item[0]} className='task-list__container clients__data-row'>
        <p>{makeShortStringWithDots(item[1].title, 100)}</p>
        <p>{item[1].dateCreated}</p>
        <p>{item[1].deadlineDate}</p>
        {item[1].leadId && <Link className='cta__container' to={`/lead/${item[1].leadId}`}><button className='edit-btn'>SHOW LEAD</button></Link>}
        {item[1].clientId && <Link className='cta__container' to ={`/client/${item[1].clientId}`}><button className='edit-btn'>SHOW CLIENT</button></Link>}
        {!item[1].leadId && !item[1].clientId && <p className='center-text'>N/A</p>}
        <div className='cta__container'>
          <button className='btn-small'
          disabled={item[1].isClosed}
          onClick={() => setModalData(prevData => {
            //open new modal with new properties
            return {
              ...prevData,
              isActive: true,
              modalType: "add",
              messageTitle: "",
              elementId: item[0], //item[0] is a task id
              value: item[1].title,
              refreshPage: refreshPage,
              handleFunction: editTaskTitle,
            }
          })}>
            <AiTwotoneEdit className='anim-shake' />
          </button>
          <button className='btn-small'
          disabled={item[1].isClosed}
          onClick={() => setModalData(prevData => {
            //open new modal with new properties
            return {
              ...prevData,
              isActive: true,
              modalType: "question",
              messageTitle: "Do you want to close this task?",
              elementId: item[0], //item[0] is a task id
              value: item[1].title,
              refreshPage: refreshPage,
              handleFunction: closeTask,
            }
          })}>
            <ImCheckmark className='anim-shake' />
          </button>
          {item[1].isClosed && <small className='red-text'>CLOSED</small>}
        </div>
        
      </div>
    )
  })

  // prepare the data for statistics displayed on the page
  const taskStats = allTasksData && getTasksStats(allTasksData)

  return (
    <div className='container'>
    {/* ********* FILTER FORM ******** */}
        <div className='tasks__filter-container'>
            <div className='filter__form-container-left'>
                <small>FILTER BY:</small>
                <button 
                    onClick={() => setFilterForm(filterFormEmptyData)}
                    type='button' 
                    className=' edit-btn'>CLEAR FORM</button>
            </div>
          <div className='tasks__filter-container-right'>
            <form>
              <div className='form__inputs-container form-grid-3-cols'>
                <div className='input-wrapper'>
                  <input type='text'
                      className='input-width-100 height-1-8'
                      id='task-title'
                      name='filterByTitle'
                      placeholder='Title'
                      value={filterForm.filterByTitle}
                      onChange={handleFilterChange}
                      />
                </div>
                <div className='input-wrapper'>
                  <input type='text'
                      className='input-width-100 height-1-8'
                      id='task-client'
                      name='filterByClient'
                      placeholder='Client name'
                      value={filterForm.filterByClient}
                      onChange={handleFilterChange}
                      />
                </div>
                <div className='input-wrapper'>
                  <input type='text'
                      className='input-width-100 height-1-8'
                      id='task-lead'
                      name='filterByLead'
                      placeholder='Lead title'
                      value={filterForm.filterByLead}
                      onChange={handleFilterChange}
                      />
                </div>
                <div className='input-wrapper input-wrapper-label'>
                        <label className='label-sm' htmlFor='start-date'>Date &gt;</label>
                        <input type='date'
                        className='input-width-100 height-1-8'
                        id='start-date'
                        name='filterByStartDate'
                        placeholder='0'
                        min={0}
                        value={filterForm.filterByStartDate}
                        onChange={handleFilterChange}
                        />
                </div>
                <div className='input-wrapper input-wrapper-label'>
                        <label className='label-sm' htmlFor='end-date'>Date &lt;</label>
                        <input type='date'
                        className='input-width-100 height-1-8'
                        id='end-date'
                        name='filterByEndDate'
                        placeholder='0'
                        min={0}
                        value={filterForm.filterByEndDate}
                        onChange={handleFilterChange}
                        />
                </div>
                {/* ----==== TASKS VISIBILITY FORM ====---- */}
                  <div className='filter-btns__container'>
                    <div className='filter-btn__container'>
                      <button  type='button' className='show-hide-btn no-border-btn filter-btn'
                            onClick={() => setShowClientTasks(prevData => !prevData)}
                        >
                          <p>CLIENTS TASKS</p>
                          {showClientTasks && <BiShow className='visibility-icon' />}
                          {!showClientTasks && <BiHide className='visibility-icon' />}
                        </button>
                    </div>
                    <div className='filter-btn__container'>
                      <button type='button' className='show-hide-btn no-border-btn filter-btn'
                          onClick={() => setShowLeadTasks(prevData => !prevData)}
                      >
                        <p>LEADS TASKS</p>
                        {showLeadTasks && <BiShow className='visibility-icon' />}
                        {!showLeadTasks && <BiHide className='visibility-icon' />}
                      </button>
                    </div>

                    <div className='filter-btn__container'>
                      <button type='button' className='show-hide-btn no-border-btn filter-btn'
                          onClick={() => setShowOtherTasks(prevData => !prevData)}
                      >
                        <p>OTHER TASKS</p>
                        {showOtherTasks && <BiShow className='visibility-icon' />}
                        {!showOtherTasks && <BiHide className='visibility-icon' />}
                      </button>
                    </div>

                    <div className='filter-btn__container'>
                      <button type='button' className='show-hide-btn no-border-btn filter-btn'
                          onClick={() => setShowClosedTasks(prevData => !prevData)}
                      >
                        <p>CLOSED TASKS</p>
                        {showClosedTasks && <BiShow className='visibility-icon' />}
                        {!showClosedTasks && <BiHide className='visibility-icon' />}
                      </button>
                    </div>
                  </div>
              </div>
            </form>
          </div>         
      </div>
      <div className='grid-3-of-4'>
        
        <div className='details__content-grid-element'>
          <div className='content-header__container'>
            <p className='center-text content-header'>TASKS</p>
          </div>
          <div className='data__container'>
            <div className='task-list__container clients__container-headers'>
              <p>TITLE</p>
              <p>DATE CREATED</p>
              <p>DEADLINE DATE</p>
              <p className='center-text'>OWNER</p>
              <p></p>
            </div>
            {tasksArr}
          </div>

        </div>

        <div className='details__content-grid-element'>
          <div className='content-header__container'>
            <p className='center-text content-header'>STATS</p>
          </div>
          <div className='stats__container data__container'>
            <div className='stats__container-item'>
              <p className='stats__container-item-title'>ALL TASKS:</p>
              <p>{taskStats ? taskStats.numberOfAllTasks : ""}</p>
            </div>
            <div className='stats__container-item'>
              <p className='stats__container-item-title'>OPEN TASKS:</p>
              <p>{taskStats ? taskStats.numberOfAllOpenTasks : ""}</p>
            </div>
            <div className='stats__container-item'>
              <p className='stats__container-item-title'>FINISHED TASKS:</p>
              <p>{taskStats ? taskStats.numberOfAllClosedTasks : ""}</p>
            </div>
            <div className='stats__container-item'>
              <p className='stats__container-item-title'>EXCEEDED TASKS:</p>
              <p>{taskStats ? taskStats.numberOfExceeded : ""}</p>
            </div>
          </div>
        </div>

      </div>
      {modalData.isActive && 
      <Modal
        isActive={modalData.isActive}
        modalType={modalData.modalType}
        messageTitle={modalData.messageTitle}
        messageText={modalData.messageText}
        handleFunction={modalData.handleFunction}
        elementId={modalData.elementId}
        value={modalData.value}
        refreshPage={() => refreshPage()}
        onClose={closeModal}
        //props with data to add in DB
        leadId=""
        clientId=""
        />}
    </div>
  )
}

export default Tasks