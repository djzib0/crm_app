import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import CompanyForm from './CompanyForm'

function Companies() {
    const {allCompaniesData} = useDatabaseHook()

    let companiesArr = allCompaniesData && allCompaniesData.map(item => {
        return (
            <Link key={item[0]} to={`/company/${item[0]}`}><p>{item[1].companyName}</p></Link>
        )
    })

    
    return (
        <div>
            {companiesArr}
        </div>
    )
}

export default Companies