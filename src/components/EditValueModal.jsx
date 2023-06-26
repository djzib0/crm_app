import React, { useState } from 'react'
import { BsFillInfoCircleFill } from 'react-icons/bs'

import './editValueModal.css'

function EditValueModal(props) {

  const {
    closeEditValueModal,
    handleEditValueModal,
    leadId,
    currentTitle} = props

  const [formData, setFormData] = useState({
    newValue: currentTitle
  })

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
      <div className='modal__container-top modal-info'>
        <BsFillInfoCircleFill className='modal-icon' />
      </div>
      <h3 id='modal__message-text'></h3>
      <p id='modal__message-text'>
        Enter new lead title
      </p>
      <input type='text'
             id='new-value'
             name='newValue'
             placeholder='Enter new value'
             onChange={handleFormChange}
             value={formData.newValue}
       />

      <div id='btn__container'>
      <button className='confirm__btn' onClick={() => handleEditValueModal(
        leadId, formData.newValue
      )}>OK</button>
      <button className='cancel__btn' onClick={() => closeEditValueModal()}>Cancel</button>
      </div>
      
    </div>
  )
}

export default EditValueModal