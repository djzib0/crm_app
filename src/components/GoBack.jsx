import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AiFillLeftCircle } from 'react-icons/ai'


function GoBack() {

  const navigate = useNavigate()

  return (
    <div className='go-back__container' onClick={() => navigate(-1)}>
      {<AiFillLeftCircle />} 
      <p>BACK</p>
    </div>
  )
}

export default GoBack