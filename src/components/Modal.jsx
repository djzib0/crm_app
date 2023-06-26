import React from 'react'
import { BsExclamationOctagonFill, BsFillInfoCircleFill } from 'react-icons/bs'

function Modal(props) {
  const {messageTitle, messageText, isError} = props

  return (
    <div className='modal__container'>
      <div className={`modal__container-top ${
        isError ? 'modal-error' : 'modal-info'
      }`} >
        {isError ? 
        <BsExclamationOctagonFill className='modal-icon' /> 
        : <BsFillInfoCircleFill className='modal-icon' />}
      </div>
      <h3 id='modal__message-text'>{messageTitle}</h3>
      <p id='modal__message-text'>
        {messageText}
      </p>

      <button className='confirm__btn' onClick={props.onClose}>OK</button>
    </div>
  )
}

export default Modal