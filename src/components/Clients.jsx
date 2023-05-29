import React, { useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import './clients.css'

// import of utils
import { capitalizeFirstLetter,
         formatPhoneNumber,
         isDateExceeded
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
        <div key={item[0]} className='clients-container'>
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
              <div className='cta__container'>
                  <Link>EDIT</Link>
                  <Link>LEADS</Link>
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
    let filteredArr = allClientsData.filter(client => {
      return (
        client[1].firstName.toLowerCase().includes(filterForm.filterByFirstName.toLowerCase()) &&
        client[1].lastName.toLowerCase().includes(filterForm.filterByLastName.toLowerCase()) &&
        client[1].email.toLowerCase().includes(filterForm.filterByEmail.toLowerCase()) &&
        client[1].phoneNumber.toLowerCase().includes(filterForm.filterByPhoneNumber.toLowerCase()) &&
        client[1].companyId.toLowerCase().includes(filterForm.filterByCompanyName.toLowerCase())
      )
    })
    return filteredArr
  }

  console.log(filterForm)

  function getClientCompanyName(companiesArr, companyId) {
    // filter through companies Arr and find the one which
    // id matches clients company id
    // must be only one correct result
    const clientCompany = companiesArr.filter( company => {
      return company[0] === companyId
    })
    // returns company name to display next to client details
    return clientCompany[0][1].companyName
  }

  return (
    <section>
        <div className='filter__form'>
            <p>Filter by:</p>
            <form>
                <input type='text'
                    className='input__first-name'
                    id='first-name'
                    name='filterByFirstName'
                    placeholder='First name'
                    value={filterForm.filterByFirstName}
                    onChange={handleFilterChange}
                    />
                <input type='text'
                    className='input__last-name'
                    id='last-name'
                    name='filterByLastName'
                    placeholder='Last name'
                    value={filterForm.filterByLastName}
                    onChange={handleFilterChange}
                    />
                <input type='text'
                    className='input__email'
                    id='email'
                    name='filterByEmail'
                    placeholder='Email'
                    value={filterForm.filterByEmail}
                    onChange={handleFilterChange}
                    />
                <input type='text'
                    className='input__phone-number'
                    id='phone-number'
                    name='filterByPhoneNumber'
                    placeholder='Phone number'
                    value={filterForm.filterByPhoneNumber}
                    onChange={handleFilterChange}
                    />
                <input type='text'
                    className='input__company-name'
                    id='company-name'
                    name='filterByCompanyName'
                    placeholder='Company name'
                    value={filterForm.filterByCompanyName}
                    onChange={handleFilterChange}
                    />
                <label htmlFor='city-select'>City</label>
                <select className='input__company-city'
                        name='filterByCity'
                        id='city-select'
                >
                <option value=''>-</option>
                </select>
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
