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
        const {
            companyName,
            companyAddressStreet,
            companyAddressBuildingNumber,
            companyAddressCity,
            companyAddressZipCode,
        } = item[1]
        return (
            <div key={item[0]} className='container company__container'>
                <Link className='container company__container' to={`/company/${item[0]}`}>
                    <p>{companyName}</p>
                    <p>{companyAddressStreet} {companyAddressBuildingNumber} {companyAddressZipCode} {companyAddressCity}</p>
                    <p>0</p>
                </Link>
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
            <div className='container company__container headers'>
                <p>Company name</p>
                <p>Company address</p>
                <p>No of clients</p>
                <p>Action</p>
            </div>
            {companiesArr}
        </div>
    )
}

export default Companies