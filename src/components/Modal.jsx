import React, { useState } from 'react'
import useModalHook from '../hooks/useModalHook'

import { BsExclamationOctagonFill, BsFillInfoCircleFill } from 'react-icons/bs'

function Modal(props) {
  const {
    isActive,
    modalType,
    messageTitle, 
    messageText,
    elementId,
    value,
    onClose,
    handleFunction
  } = props


  console.log(props,"props")
  const [formData, setFormData] = useState({
    newValue: value
  })

  console.log(handleFunction, "handleFunction in Modal")
    

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
        modalType === "error" ? 'modal-error' : 'modal-info'
      }`} >
        {modalType === "error" && <BsExclamationOctagonFill className='modal-icon' />}
        {modalType === "info" || modalType === "update" && <BsFillInfoCircleFill className='modal-icon' />}
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

      {modalType === "update" && <div id='btn__container'>
      <button className='confirm__btn' onClick={() => testFunction()}>OK</button>
      <button className='cancel__btn' onClick={onClose}>Cancel</button>
      </div>}
      

      {modalType != "update" && <button className='confirm__btn' onClick={onClose}>OK</button>}
    </div>
  )
}

export default Modal