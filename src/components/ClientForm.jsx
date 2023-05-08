import React, { useState } from 'react'

import useDatabaseHook from '../hooks/useDatabaseHook'

export default function ClientForm() {

  const {addClient} = useDatabaseHook()

  const [formData, setFormData] = useState({
    companyId: "", // foreign key - client can work in one company
    title: "mr",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    lastContactDate: "",
    nextContactDate: "",
  })

  function handleChange(e) {
    const {name, value} = e.target
    setFormData(prevData => {
      return {
        ...prevData,
        [name]: value
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()

    // destructuring formData
    const {companyId,
           title,
           firstName,
           lastName,
           email,
           phoneNumber,
           lastContactDate,
           nextContactDate,
    } = formData

    addClient(
      companyId,
      title,
      firstName,
      lastName,
      email,
      phoneNumber,
      lastContactDate,
      nextContactDate,
    )

    // reset form
    setFormData({
      companyId: "", // foreign key - client can work in one company
      title: "mr",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      lastContactDate: "",
      nextContactDate: "",
    })
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <select name='title'
                  id='title'
                  // placeholder='title'
                  value={formData.title}
                  onChange={handleChange}
                  >
              <option value='mr'>Mr.</option>
              <option value='mrs'>Mrs.</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='first-name'>First Name</label>
          <input type='text' 
                name='firstName'
                id='first-name'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
                required
                />
        </div>
        <div className='form-group'>
          <label htmlFor='last-name'>Last Name</label>
          <input type='text' 
                name='lastName'
                id='last-name'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                required
                />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>E-mail</label>
          <input type='email' 
                name='email'
                id='email'
                value={formData.email}
                onChange={handleChange}
                />
        </div>
        <div className='form-group'>
          <label htmlFor='phone-number'>Phone Number</label>
          <input type='tel' 
                name='phoneNumber'
                id='phone-number'
                value={formData.phoneNumber}
                onChange={handleChange}
                />
        </div>
        <button className="btn submit-btn">Submit</button>
      </form>
    </div>
  )
}
