import React, { useEffect, useState } from 'react'
import useModalHook from '../hooks/useModalHook'

import useDatabaseHook from '../hooks/useDatabaseHook'

import { BsExclamationOctagonFill, BsFillInfoCircleFill } from 'react-icons/bs'
import { getToday } from './utils/utils'


// INSTRUCTION - HOW TO USE MODAL COMPONENT!
// 1. Import Modal and useModalHook in the component
// -------------------------------------------
// 2. Add below code in component

// const {
//   modalData,
//   setModalData,
//   closeModal,
// } = useModalHook()

// {modalData.isActive && 
//   <Modal
//     isActive={modalData.isActive}
//     modalType={modalData.modalType}
//     messageTitle={modalData.messageTitle}
//     messageText={modalData.messageText}
//     handleFunction={modalData.handleFunction}
//     elementId={modalData.elementId}
//     value={modalData.value}
//     refreshPage={() => refreshPage()}
//     onClose={closeModal}
//     //props with data to add in DB
//     leadId=""
//     clientId=""
//     />}
// ------------------------------------------------
// 3. Add useEffect, state, and function to refresh the page

// useEffect(() => {
//   // to update/refresh the page, I need to 
//   // fetch data and then change state. It will cause 
//   // the refresh of page with updated, fetched data
//   async function refresh() {
//     let data = await showAllTasksData()
//   }
//   refresh()
// }, [updateState])

// function refreshPage() {
//   setUpdateState(prevData => !prevData)
// }
// ------------------------------------
// 4. set onClick function as below example:
// onClick={() => setModalData(prevData => {
//   //open new modal with new properties
//   return {
//     ...prevData,
//     isActive: true,
//     modalType: "delete",
//     messageTitle: "Do you want to delete this task?",
//     elementId: item[0], //item[0] is a task id
//     value: item[1].title,
//     refreshPage: refreshPage,
//     handleFunction: deleteTask,
//   }
// })} />}


function Modal(props) {
  const {
    isActive,
    modalType,
    messageTitle, 
    messageText,
    elementId,
    value,
    onClose,
    handleFunction,
    refreshPage,
  } = props


  const [formData, setFormData] = useState({
    // property for an update or add
    newValue: value,
    date: "",
    today: getToday()
  })

  const [isDisabled, setIsDisabled] = useState(true)
  const [showInputError, setShowInputError] = useState(false)
  const [showDateError, setShowDateError] = useState(false)

  useEffect(() => {
    // if input for newValue is empty or contains only white
    // spaces, the button remains disabled
    // checks date input, if it's not chosen
    // the button remains disabled

    // checks input after "trimming" white spaces
    if (formData.newValue.trim() && formData.date) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [formData])


  function handleFormChange(e) {
    const {name, value} = e.target
    setFormData(prevData => {
      return {
        ...prevData,
        [name]: value
      }
    })
  }


  return (
    <div className='modal__container'>
      <div className={`modal__container-top ${
          modalType === "error" || modalType === "delete" ? 'modal-error' : 'modal-info'
        }`} >
          {modalType === "error" && <BsExclamationOctagonFill className='modal-icon' />}
          {modalType === "delete" && <BsExclamationOctagonFill className='modal-icon' />}
          {modalType === "info" || modalType === "update" || modalType === "add" || modalType === "question" && <BsFillInfoCircleFill className='modal-icon' />}
        </div>
        <h3 id='modal__message-text'>{messageTitle}</h3>
        <p id='modal__message-text'>
          {messageText}
        </p>
        {modalType === "update" && <input type='text'
              id='new-value'
              name='newValue'
              placeholder='Enter new value'
              onChange={handleFormChange}
              value={formData.newValue}
        />}
        {modalType === "add" && <textarea type='textarea'
              name='newValue'
              placeholder='Enter new comment'
              onChange={handleFormChange}
              value={formData.newValue}
              className='modal__textarea'
        />}
        {modalType === "add-task" && 
        <div>
          <input type='input'
            id='new-value'
            name='newValue'
            placeholder='New task title'
            onChange={handleFormChange}
            value={formData.newValue}
            required
          />
          <input type="date"
            id='new-value'
            name='date'
            placeholder='Enter new task title'
            onChange={handleFormChange}
            value={formData.date}
            required
          /> 
        </div>
        }
        
        {modalType === "update" && <div id='btn__container'>
        <button className='confirm__btn' onClick={() => {handleFunction(elementId, formData.newValue); onClose(); refreshPage()}}>OK</button>
        <button className='cancel__btn' onClick={onClose}>Cancel</button>
        </div>}
        {modalType === "add" && <div id='btn__container'>
        <button className='confirm__btn' onClick={() => {handleFunction(elementId, formData.newValue); onClose(); refreshPage()}}>OK</button>
        <button className='cancel__btn' onClick={onClose}>Cancel</button>
        </div>}
        {modalType === "delete" && <div id='btn__container'>
        <button className='confirm__btn' onClick={() => {handleFunction(elementId); onClose(); refreshPage()}}>OK</button>
        <button className='cancel__btn' onClick={onClose}>Cancel</button>
        </div>}
        {modalType === "question" && <div id='btn__container'>
        <button className='confirm__btn' onClick={() => {handleFunction(elementId); onClose(); refreshPage()}}>OK</button>
        <button className='cancel__btn' onClick={onClose}>Cancel</button>
        </div>}
        {modalType === "add-comment" && 
        <div id='btn__container'>
          <button className='confirm__btn'
          onClick={() => {handleFunction(
            props.leadId,
            formData.newValue);
            onClose(); refreshPage()}}
            disabled={isDisabled}
            >OK</button>
          <button className='cancel__btn' onClick={onClose}>Cancel</button>
        </div>}
        {modalType === "add-task" && 
        <div id='btn__container'>
          <button className='confirm__btn'
          onClick={() => {handleFunction(
            props.clientId,
            props.leadId,
            formData.newValue,
            getToday(),
            formData.date);
            onClose(); refreshPage()}}
            disabled={isDisabled}
            >OK</button>
          <button className='cancel__btn' onClick={onClose}>Cancel</button>
        </div>}
      
      {modalType != "update" && modalType != "add" && modalType != "delete" && modalType != "add-task" && modalType != "question" && <button className='confirm__btn' onClick={onClose}>OK</button>}
    </div>
  )
}

export default Modal