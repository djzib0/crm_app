import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'
import { nanoid } from 'nanoid'

import CompanyForm from './CompanyForm'

// import styles
import './companies.css'


function Companies() {
    const {allCompaniesData, allClientsData} = useDatabaseHook()

    const [filterForm, setFilterForm] = useState({
        filterByCompanyName: "",
        filterByCity: "",
    })

    // counts clients for each company
    let countedClients = allClientsData && countCompanyClients(allClientsData)


    let companiesArr = allCompaniesData && allClientsData && filterData().map(item => {
        const {
            companyName,
            companyAddressStreet,
            companyAddressBuildingNumber,
            companyAddressCity,
            companyAddressZipCode,
        } = item[1]

        return (
            <div key={item[0]} className='company__container hover'>
                <Link className='company__container-data' to={`/company/${item[0]}`}>
                    <p>{companyName}</p>
                    <p>{companyAddressStreet} {companyAddressBuildingNumber} {companyAddressZipCode} {companyAddressCity}</p>
                    <p>{countedClients[item[0]] > 0 ? countedClients[item[0]] : 0 }</p>
                </Link>
                <div className='company__container-cta'>
                    <Link to={`/add-client/${item[0]}`} className='link-btn btn-small'>ADD CLIENT</Link>
                </div>
            </div>
        )
    })

    // creates list of all companies cities
    let cities = allCompaniesData && allCompaniesData.map(item => {
        let city = item[1].companyAddressCity
        return (
            city
        )
    })

    // sets a new list with unique cities 
    // new array is used in filter form
    let uniqueCitiesOptions = []
    allCompaniesData && [...new Set(cities.sort())].forEach(city => {
        if (!uniqueCitiesOptions.includes(city)) {
            uniqueCitiesOptions.push(<option key={nanoid()} value={city}>{city}</option>)
        }
    })

    // function which counts clients for each company
    // TIP from me: move function to separate utils file???
    function countCompanyClients(arr) {
        let clientsCount = {}

        // for each client in array
        arr.forEach(clientObj => {
            // destructuring client object
            const {companyId} = clientObj[1]
            // if in clientsCount object is no key with 
            // company id, it's created with 1 count
            if (!clientsCount[companyId]) {
                clientsCount[companyId] = 1
            // if there is a key it's incrementing by one
            } else (
                clientsCount[companyId] += 1
            )
        })
        // return object with each clients id and count
        // how many clients in each companies are in database
        return clientsCount
    }


    // *** Filtering Data ***
    function filterData() {
        // for each filter input create a new array with filter method
        let filteredArr = allCompaniesData.filter(item => {
            return (
                item[1].companyName.toLowerCase().includes(filterForm.filterByCompanyName.toLowerCase()) &&
                item[1].companyAddressCity.toLowerCase().includes(filterForm.filterByCity.toLowerCase())
            )
        })

        return filteredArr
    }


    function handleChange(e) {
        const {name, value} = e.target
        setFilterForm(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

 
    return (
        <div className='container'>
            <div className='filter__form'>
                <p>Filter by:</p>
                <form>
                    <input type='text'
                        className='input__company-name'
                        id='company-name'
                        name='filterByCompanyName'
                        value={filterForm.filterByCompanyName}
                        placeholder='Search by company name'
                        onChange={handleChange}
                        />
                    <label htmlFor='city-select'>City</label>
                    <select className='input__company-city'
                            name='filterByCity'
                            id='city-select'
                            value={filterForm.filterByCity}
                            onChange={handleChange}
                    >
                    <option value=''>-</option>
                    {uniqueCitiesOptions}
                    </select>
                </form>
            </div>

            <Link to="/add-company" className='link-btn'>ADD COMPANY</Link>

            <div className=''>
                <div className=' company__container headers' id='headers'>
                    <div className='company__container-data'>
                        <p>Company name</p>
                        <p>Company address</p>
                        <p>No of clients</p>
                    </div>
                    <div className='company__container-cta'>
                        <p className=''></p>
                    </div>

                </div>
                {companiesArr}
            </div>

        </div>
    )
}

export default Companies