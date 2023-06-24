import React from 'react'

function Modal(props) {
  return (
    <div className='modal__container'>
      {props.messageTitle}
      {props.messageText}
      Dać tutaj ikonę błędu
      <button onClick={props.onClose}>OK</button>
    </div>
  )
}

export default Modal