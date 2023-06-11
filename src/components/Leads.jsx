import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import './leads.css'

//import utils
import { getClientCompanyName, getClientName, } from './utils/utils'

//import icons
import { AiFillFolderOpen } from 'react-icons/ai'

function Leads() {

    const { allLeadsData, changeIsSold, allClientsData, allCompaniesData} = useDatabaseHook()

    const leadsArr = allLeadsData && allLeadsData.map(item => {
        return (
            <div key={item[0]}>
                <div className='leads-container'>
                    <div className='leads__container-content'>
                        <p>{item[1].projectTitle}</p>
                        <p>{allClientsData && getClientName(allClientsData, item[1].clientId)}</p>
                        <p>{allCompaniesData && getClientCompanyName(allCompaniesData, item[1].companyId)}</p>
                        <p>{item[1].clientProjectNumber}</p>
                        <p>{item[1].projectValue}</p>
                        <p>{item[1].dateCreated}</p>
                        <p>{item[1].nextContactDate}</p>
                        <p>{item[1].isSold ? "YES" : "NO"}</p>
                        <p>{item[1].isOpen ? "CLOSED" : "OPEN"}</p>
                    </div>
                    <div className='cta__container'>
                        <p>
                            <Link to={`/lead/${item[0]}`}>
                                <AiFillFolderOpen />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div>
            <div className='leads-container' id="leads-header">
                <div className='leads__container-headers'>
                    <p>TITLE</p>
                    <p>CLIENT</p>
                    <p>COMPANY</p>
                    <p>CLIENT PROJECT NO</p>
                    <p>VALUE</p>
                    <p>DATE CREATED</p>
                    <p>NEXT CONTACT DATE</p>
                    <p>SOLD</p>
                    <p>STATUS</p>
                </div>
                <div className='cta__container'>
                    
                </div>
        </div>
            {leadsArr}
        </div>
    )
}

export default Leads