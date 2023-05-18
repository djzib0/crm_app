import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'
import { nanoid } from 'nanoid'

import CompanyForm from './CompanyForm'

// import styles
import './companies.css'
import { update } from 'firebase/database'

function Companies() {
    const {allCompaniesData} = useDatabaseHook()

    const [filterForm, setFilterForm] = useState({
        filterByCompanyName: "",
        filterByCity: "",
    })

    let companiesArr = allCompaniesData && filterData().map(item => {
        return (
            <div key={item[0]} className='container company-container'>
                 <Link to={`/company/${item[0]}`}><p>{item[1].companyName}</p></Link>
                 <Link to={`/add-client/${item[0]}`} className='link-btn btn-small'>Add client</Link>
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
        <div>
            <form>
                <input type='text'
                       className=''
                       name='filterByCompanyName'
                       value={filterForm.filterByCompanyName}
                       placeholder='Search by company name'
                       onChange={handleChange}
                       />
                <select className=''
                        name='filterByCity'
                        value={filterForm.filterByCity}
                        onChange={handleChange}
                >
                <option value=''>-</option>
                {uniqueCitiesOptions}
                </select>
                
            </form>
            <Link to="/add-company" className='link-btn'>Add Company</Link>
            {companiesArr}
        </div>
    )
}

export default Companies