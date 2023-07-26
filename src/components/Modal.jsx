import React, { useEffect, useState } from 'react'
import useModalHook from '../hooks/useModalHook'

import useDatabaseHook from '../hooks/useDatabaseHook'

import { BsExclamationOctagonFill, BsFillInfoCircleFill } from 'react-icons/bs'
import { getToday } from './utils/utils'

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
    // checks data input, if it's not chosen
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
          {modalType === "info" || modalType === "update" || modalType === "add" && <BsFillInfoCircleFill className='modal-icon' />}
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
      
      {modalType != "update" && modalType != "add" && modalType != "delete" && modalType != "add-task" && <button className='confirm__btn' onClick={onClose}>OK</button>}
    </div>
  )
}

export default Modal