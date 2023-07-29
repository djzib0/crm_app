import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import useModalHook from '../hooks/useModalHook'
import Modal from './Modal'
import { Link } from 'react-router-dom'

//import utils
import { getToday, formatDate, makeShortStringWithDots } from './utils/utils'

//import css
import './home.css'

//import icons 
import { 
  TbSquareRoundedLetterL, TbSquareRoundedLetterC, TbSquareRoundedLetterO,
  TbSquareRoundedChevronLeftFilled, TbSquareRoundedChevronRightFilled 
 } from 'react-icons/tb'
 import { RiDeleteBin6Fill } from 'react-icons/ri'
 import { AiTwotoneEdit, AiOutlineCheck } from 'react-icons/ai'

function Home() {

  // this state is only to force DOM to re-render after DB is changed
  const [updateState, setUpdateState] = useState(false)

  const [currentMonday, setCurrentMonday] = useState(getCurrentWeekMondayDate())

  const {
    allCompaniesData,
    allClientsData,
    allLeadsData,
    allTasksData,
    showAllTasksData,
    editTaskTitle,
    closeTask,
  } = useDatabaseHook()

  const {
    modalData,
    setModalData,
    closeModal,
  } = useModalHook()

  function countAllLeads(leadsArr) {
    return leadsArr.length
  }

  function countSoldLeads(leadsArr) {
    const newArr = leadsArr.filter(item => {
      return item[1].isSold
    })
    return newArr.length
  }

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

  async function updateData(elementId, func, event) {
    await func(elementId, event.target.value)
    // changing updateState to re-render DOM
    setUpdateState(prevData => !prevData)
  }

  // **************
  //move below functions to utils and import to this component
  function countPercentage(number1, number2) {
    return (number1 / number2 * 100).toFixed(0)
  }

  function getCurrentWeekMondayDate() {
    let today = new Date(getToday())
    let dayOfWeek = today.getDay()
    let monday = new Date(today.setDate(today.getDate() - dayOfWeek + 1))
    return monday
  }


  function showDateWithMonthName(dateToChange, delta) {

    const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    //set a new date
    const date = new Date(dateToChange)
    //convert year to String (to make a slice at the end)
    const year = String(date.getFullYear())
    // set new Date
    const newDate = new Date(date.setDate(date.getDate() + delta))
    // convert month number to descriptive name
    const month = monthNames[date.getMonth()]
  
    return `${newDate.getDate()} ${month} ${year.slice(2)}`
  }

  function showShortDate(dateToChange) {
    const date = new Date(dateToChange)
    const year = date.getFullYear()
    const day = date.getDate()
    const month = date.getMonth()
    
    return (formatDate(`${year}-${month + 1}-${day}`))
  }

  //**************

  function showNextWeek(monday) {
    let nextMonday = new Date(monday)
    nextMonday = new Date(nextMonday.setDate(nextMonday.getDate() + 7))
    setCurrentMonday(prevData => nextMonday)
  }

  function showPreviousWeek(monday) {
    let previousMonday = new Date(monday)
    previousMonday = new Date(previousMonday.setDate(previousMonday.getDate() - 7))
    setCurrentMonday(prevData => previousMonday)
  }

  function showDayLeadTasks(date, delta) {
    let thisDay = new Date(date)
    // set date by given date + delta, if delta = 0 means it's monday of 
    // current week.
    thisDay = new Date(thisDay.setDate(thisDay.getDate() + delta))
    // return only tasks from the given day
    const filteredLeadsArr = allLeadsData && allLeadsData.filter(item => {
      if (!item[1].isClosed) {
        return item[1].nextContactDate === showShortDate(thisDay)
      }
    })
    return filteredLeadsArr
  }

  function showLeadTasks(arr) {
    // create array with items to display them in weekly view
    // contains only leads "next contact date"
    const tasksArr = arr.map(item => {
      const leadTitle = `${item[1].projectTitle}`
      return (
        <div key={item[0]} className='calendar__day-element lead-task'>
          {<TbSquareRoundedLetterL />}
            <Link to={`/lead/${item[0]}` }>{makeShortStringWithDots(leadTitle, 25)}</Link>
        </div>
      )
    })
    return tasksArr
  }

  function showDayClientTasks(date, delta) {
    let thisDay = new Date(date)
    // set date by given date + delta, if delta = 0 means it's monday of 
    // current week.
    thisDay = new Date(thisDay.setDate(thisDay.getDate() + delta))
    // return only tasks from the given day
    const filteredArr = allClientsData && allClientsData.filter(item => {
      return item[1].nextContactDate === showShortDate(thisDay)
    })
    return filteredArr
  }

  function showClientTasks(arr) {
    // create array with items to display them in weekly view
    // contains only client "next contact date"
    const tasksArr = arr.map(item => {
      const formattedName = ` ${item[1].title} ${item[1].firstName} ${item[1].lastName}`
      return (
        <div key={item[0]} className='calendar__day-element client-task'>
          {<TbSquareRoundedLetterC />}
            <Link to={`/client/${item[0]}` }>
              {makeShortStringWithDots(formattedName, 27)}</Link>
        </div>
      )
    })
    return tasksArr
  }

  function showDayOtherTasks(date, delta) {
    let thisDay = new Date(date)
    // set date by given date + delta, if delta = 0 means it's monday of 
    // current week.
    thisDay = new Date(thisDay.setDate(thisDay.getDate() + delta))
    // return only tasks from the given day
    const filteredArr = allTasksData && allTasksData.filter(item => {
      return item[1].deadlineDate === showShortDate(thisDay) && !item[1].isClosed
    })
    return filteredArr
  }

  function showOtherTasks(arr) {
    // create array with items to display them in weekly view
    // contains tasks added in clients or leads view, and tasks
    // in general, not related with any component
    const tasksArr = arr.map(item => {
      // if leadId has value display as a Lead task
      if (item[1].leadId) {
        return (
          <div key={item[0]} className='calendar__day-element lead-other-task'>
            {<TbSquareRoundedLetterL />}
            {<TbSquareRoundedLetterO />}
            <Link to={`lead/${item[1].leadId}` }>
                 {makeShortStringWithDots(item[1].title, 24)}</Link>
            <div className='cta__hoverable-icons-tooltip'>
              <div className='up-arrow'></div>
              <div className='cta__hoverable-icons-container'>
                {<AiTwotoneEdit className='cta__hoverable-icon'
                onClick={() => setModalData(prevData => {
                  //open new modal with new properties
                  return {
                    ...prevData,
                    isActive: true,
                    modalType: "update",
                    messageTitle: "Enter new task title",
                    elementId: item[0], //item[0] is a task id
                    value: item[1].title,
                    refreshPage: refreshPage,
                    handleFunction: editTaskTitle
                  }
                })} />}
                {<AiOutlineCheck className='cta__hoverable-icon'
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
                    handleFunction: closeTask
                  }
                })}  />}
                {<RiDeleteBin6Fill className='cta__hoverable-icon' />}
              </div>
            </div>
          </div>
        )
      // else if has clientId display as a Client task
      } else if (item[1].clientId ){
        return (
          <div key={item[0]} className='calendar__day-element client-other-task'>
            {<TbSquareRoundedLetterC />}
            {<TbSquareRoundedLetterO />}
            <Link to={`client/${item[1].clientId}` }>
                {makeShortStringWithDots(item[1].title, 24)}</Link>
              <div className='cta__hoverable-icons-tooltip'>
                <div className='up-arrow'></div>
                <div className='cta__hoverable-icons-container'>
                  {<AiTwotoneEdit className='cta__hoverable-icon'
                  onClick={() => setModalData(prevData => {
                    //open new modal with new properties
                    return {
                      ...prevData,
                      isActive: true,
                      modalType: "update",
                      messageTitle: "Enter new task title",
                      elementId: item[0], //item[0] is a client id
                      value: item[1].title,
                      refreshPage: refreshPage,
                      handleFunction: editTaskTitle
                    }
                  })} />}
                  {<AiOutlineCheck className='cta__hoverable-icon'
                  onClick={() => setModalData(prevData => {
                    //open new modal with new properties
                    return {
                      ...prevData,
                      isActive: true,
                      modalType: "question",
                      messageTitle: "Do you want to close this task?",
                      elementId: item[0], //item[0] is a client id
                      value: item[1].title,
                      refreshPage: refreshPage,
                      handleFunction: closeTask
                    }
                  })}  />}
                  {<RiDeleteBin6Fill className='cta__hoverable-icon' />}
                </div>
            </div>
          </div>
        )
      // if there is no leadId or clientId, it means
      // it's the "other" task
      } else {
        return (
          <div key={item[0]} className='calendar__day-element other-task'>
            {<TbSquareRoundedLetterO />}
            <Link to={`` }>
                {item[1].title}</Link>
          </div>
        )
      }

    })
    return tasksArr
  }

  const countedLeads = allLeadsData && countAllLeads(allLeadsData)
  const countedSoldLeads = allLeadsData && countSoldLeads(allLeadsData)
  const countedSoldPercentage = countPercentage(countedSoldLeads, countedLeads)

  // ******************************************************
  // ********************* DOM render *********************
  // ******************************************************

  return (
    <div>
      <div>
        <div className='calendar__nav'>
          <div className='calendar__nav-item' onClick={() => showPreviousWeek(currentMonday)}>
            <TbSquareRoundedChevronLeftFilled />
            <p>PREV WEEK</p>
          </div>

          <p className='calendar__nav-item'> - </p>

          <div className='calendar__nav-item' onClick={() => showNextWeek(currentMonday)}>
          <p>NEXT WEEK</p>
            <TbSquareRoundedChevronRightFilled />
          </div>
        </div>

        {/* ----==== CALENDAR LEGEND ====---- */}
        <div className='calendar__legend'>
          <h1 className='calendar__legend-container'>LEGEND:</h1>
          <div className='calendar__legend-container client-task'>
            {<TbSquareRoundedLetterC />} 
            <p>CLIENT CONTACT</p>
          </div>
          <div className='calendar__legend-container lead-task'>
            {<TbSquareRoundedLetterL />} 
            <p>LEAD CONTACT</p>
          </div>
          <div className='calendar__legend-container client-other-task'>
            {<TbSquareRoundedLetterC />}
            {<TbSquareRoundedLetterO />}
            <p>CLIENT TASK</p>
          </div>
          <div className='calendar__legend-container lead-other-task'>
            {<TbSquareRoundedLetterL />}
            {<TbSquareRoundedLetterO />}
            <p>LEAD TASK</p>
          </div>
          <div className='calendar__legend-container other-task'>
            {<TbSquareRoundedLetterO />}
            <p>OTHER TASK</p>
          </div>
        </div>
        {/* ----==== WEEKLY CALENDAR ====---- */}
        <div className='calendar__week-container'>
          <div className='calendar__day-container'>
            <div className='calendar__day-container-date'>
              <p>Monday</p>
              <p>{showDateWithMonthName(currentMonday, 0)}</p>
            </div>
            <div className='calendar__day-container-content'>
              {allLeadsData && showLeadTasks(showDayLeadTasks(currentMonday, 0))}
              {allLeadsData && showClientTasks(showDayClientTasks(currentMonday, 0))}
              {allTasksData && showOtherTasks(showDayOtherTasks(currentMonday, 0))}
            </div>
          </div>
          <div className='calendar__day-container'>
            <div className='calendar__day-container-date'>
              <p>Tuesday</p>
              <p>{showDateWithMonthName(currentMonday, 1)}</p>
            </div>
            <div className='calendar__day-container-content'>
              {allLeadsData && showLeadTasks(showDayLeadTasks(currentMonday, 1))}
              {allLeadsData && showClientTasks(showDayClientTasks(currentMonday, 1))}
              {allTasksData && showOtherTasks(showDayOtherTasks(currentMonday, 1))}
              
            </div>
          </div>
          <div className='calendar__day-container'>
            <div className='calendar__day-container-date'>
              <p>Wednesday</p>
              <p>{showDateWithMonthName(currentMonday, 2)}</p>
            </div>
            <div className='calendar__day-container-content'>
              {allLeadsData && showLeadTasks(showDayLeadTasks(currentMonday, 2))}
              {allLeadsData && showClientTasks(showDayClientTasks(currentMonday, 2))}
              {allTasksData && showOtherTasks(showDayOtherTasks(currentMonday, 2))}
            </div>
          </div>
          <div className='calendar__day-container'>
            <div className='calendar__day-container-date'>
              <p>Thursday</p>
              <p>{showDateWithMonthName(currentMonday, 3)}</p>
            </div>
            <div className='calendar__day-container-content'>
              {allLeadsData && showLeadTasks(showDayLeadTasks(currentMonday, 3))}
              {allLeadsData && showClientTasks(showDayClientTasks(currentMonday, 3))}
              {allTasksData && showOtherTasks(showDayOtherTasks(currentMonday, 3))}
            </div>
          </div>
          <div className='calendar__day-container'>
            <div className='calendar__day-container-date'>
              <p>Friday</p>
              <p>{showDateWithMonthName(currentMonday, 4)}</p>
            </div>
            <div className='calendar__day-container-content'>
              {allLeadsData && showLeadTasks(showDayLeadTasks(currentMonday, 4))}
              {allLeadsData && showClientTasks(showDayClientTasks(currentMonday, 4))}
              {allTasksData && showOtherTasks(showDayOtherTasks(currentMonday, 4))}
            </div>
          </div>
          <div className='calendar__day-container weekend'>
            <div className='calendar__day-container-date'>
              <p>Saturday</p>
              <p>{showDateWithMonthName(currentMonday, 5)}</p>
            </div>
            <div className='calendar__day-container-content'>
              {allLeadsData && showLeadTasks(showDayLeadTasks(currentMonday, 5))}
              {allLeadsData && showClientTasks(showDayClientTasks(currentMonday, 5))}
              {allTasksData && showOtherTasks(showDayOtherTasks(currentMonday, 5))}
            </div>
          </div>          
          <div className='calendar__day-container weekend'>
            <div className='calendar__day-container-date'>
              <p>Sunday</p>
              <p>{showDateWithMonthName(currentMonday, 6)}</p>
            </div>
            <div className='calendar__day-container-content'>
              {allLeadsData && showLeadTasks(showDayLeadTasks(currentMonday, 6))}
              {allLeadsData && showClientTasks(showDayClientTasks(currentMonday, 6))}
              {allTasksData && showOtherTasks(showDayOtherTasks(currentMonday, 6))}
            </div>
          </div>        
        </div>
        
      </div>
      <p>All leads {countedLeads}</p>
      <p>Sold leads {countedSoldLeads}</p>
      <p>Sold percentage {countedSoldPercentage}%</p>
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

export default Home