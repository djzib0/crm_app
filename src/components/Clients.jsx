import React, { useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import './clients.css'


// import of utils
import { capitalizeFirstLetter,
         formatPhoneNumber,
         isDateExceeded,
         getClientCompanyName
         } from './utils/utils'


// import of icons
import { HiExclamationCircle, HiCheckCircle } from 'react-icons/hi'

export default function Clients() {

  const { allClientsData, allCompaniesData } = useDatabaseHook()

  const [filterForm, setFilterForm] = useState({
    filterByFirstName: "",
    filterByLastName: "",
    filterByEmail: "",
    filterByPhoneNumber: "",
    filterByCompanyName: ""
  })

  let clientsArr = allClientsData && allCompaniesData && filterClients(allClientsData).map(item => {
    return (
      <div key={item[0]} className='clients__data-row'>
        <div className='clients-container'>
              <Link to={`/client/${item[0]}`} className='clients__container-data'>
                <p>{capitalizeFirstLetter(item[1].title)}</p>
                <p>{capitalizeFirstLetter(item[1].firstName)}</p>
                <p>{capitalizeFirstLetter(item[1].lastName)}</p>
                <p>{item[1].email}</p>
                <p>{formatPhoneNumber(item[1].phoneNumber)}</p>
                <p>{allCompaniesData && getClientCompanyName(allCompaniesData, item[1].companyId)}</p>
                <div className={`contact__date 
                ${allClientsData && isDateExceeded(item[1].nextContactDate, 14) != true ? 'green-mark' : 'red-mark' }`}>
                  {item[1].nextContactDate} {isDateExceeded(item[1].nextContactDate, 14) != true ? <HiCheckCircle /> : <HiExclamationCircle /> }
                </div>
              </Link>
              <div className='clients__cta-container'>
                  <Link className='edit-btn btn-small'>EDIT</Link>
                  <Link className='edit-btn btn-small' to={`../add-lead/${item[0]}`}>ADD LEAD</Link>
              </div>
        </div>
      </div>
      )
  })


  function handleFilterChange(e) {
    const {name, value} = e.target
    setFilterForm(prevFormData => {
      return {
        ...prevFormData,
        [name] : value
      }
    })
  }

  function filterClients() {
    // set array with filtered companies that matches form company name
    const companiesArr = allCompaniesData.filter(company => {
      return company[1].companyName.toLowerCase().includes(filterForm.filterByCompanyName.toLowerCase())
    })

    // set array of companies Id - if clients companyId matches any from the array
    // it will be displayed
    const companiesIdArr = companiesArr.map(company => {
      return company[0]
    })


    let filteredArr = allClientsData.filter(client => {
      return (
        client[1].firstName.toLowerCase().includes(filterForm.filterByFirstName.toLowerCase()) &&
        client[1].lastName.toLowerCase().includes(filterForm.filterByLastName.toLowerCase()) &&
        client[1].email.toLowerCase().includes(filterForm.filterByEmail.toLowerCase()) &&
        client[1].phoneNumber.toLowerCase().includes(filterForm.filterByPhoneNumber.toLowerCase()) &&
        companiesIdArr.includes(client[1].companyId)
      )
    })
    return filteredArr
  }

  

  return (
    <section>
        <div className='filter__form'>
            <p>Filter by:</p>
            <form>
              <div className='form__clients wrapper'>
                  <div className='wrapper'>
                    <input type='text'
                        className='input__client first-name'
                        id='first-name'
                        name='filterByFirstName'
                        placeholder='First name'
                        value={filterForm.filterByFirstName}
                        onChange={handleFilterChange}
                        />
                  </div>
                  <div className='wrapper'>
                    <input type='text'
                        className='input__client last-name'
                        id='last-name'
                        name='filterByLastName'
                        placeholder='Last name'
                        value={filterForm.filterByLastName}
                        onChange={handleFilterChange}
                        />
                  </div>
                  <div className='wrapper'>
                    <input type='text'
                        className='input__client email'
                        id='email'
                        name='filterByEmail'
                        placeholder='Email'
                        value={filterForm.filterByEmail}
                        onChange={handleFilterChange}
                        />
                  </div>
                  <div className='wrapper'>
                    <input type='text'
                      className='input__client phone-number'
                      id='phone-number'
                      name='filterByPhoneNumber'
                      placeholder='Phone number'
                      value={filterForm.filterByPhoneNumber}
                      onChange={handleFilterChange}
                      />
                  </div>
                  <div className='wrapper'>
                    <input type='text'
                        className='input__client company-name'
                        id='company-name'
                        name='filterByCompanyName'
                        placeholder='Company name'
                        value={filterForm.filterByCompanyName}
                        onChange={handleFilterChange}
                        />
                  </div>
              </div>
            </form>
        </div>
        <div className='clients-container' id="header">
          <div className='clients__container-headers'>
            <p>TITLE</p>
            <p>FIRST NAME</p>
            <p>LAST NAME</p>
            <p>EMAIL</p>
            <p>TEL</p>
            <p>COMPANY</p>
            <p>NEXT CONTACT</p>
          </div>
          <div className='cta__container'>
            <p></p>
            <p></p>
          </div>
        </div>        
        {clientsArr}
    </section>
  )
}
