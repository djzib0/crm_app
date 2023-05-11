import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import CompanyForm from './CompanyForm'

// import styles
import './companies.css'

function Companies() {
    const {allCompaniesData} = useDatabaseHook()

    let companiesArr = allCompaniesData && allCompaniesData.map(item => {
        return (
            <div key={item[0]} className='container company-container'>
                 <Link to={`/company/${item[0]}`}><p>{item[1].companyName}</p></Link>
                 <Link to={`/add-client/${item[0]}`} className='link-btn btn-small'>Add client</Link>
            </div>
        )
    })

    
    return (
        <div>
            <Link to="/add-company" className='link-btn'>Add Company</Link>
            {companiesArr}
        </div>
    )
}

export default Companies