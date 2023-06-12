import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import './leads.css'

//import utils
import { getClientCompanyName, getClientName, isDateExceeded} from './utils/utils'

//import icons
import { FcOpenedFolder } from 'react-icons/fc'
import { HiCheckCircle, HiExclamationCircle} from 'react-icons/hi'

function Leads() {

    const { allLeadsData, allClientsData, allCompaniesData} = useDatabaseHook()

    const [filterForm, setFilterForm] = useState({
        filterByTitle: "",
        filterByClient: "",
        filterByCompanyName: "",
        filterByClientProjectNumber: "",
        filterByDateCreated: "",
        filterShowSold: true,
        filterIsOpen: true,
    })

    function handleFilterChange(e) {
        const { name, value} = e.target
        setFilterForm(prevFormData => {
            return {
                ...prevFormData,
                [name] : value
            }
        })
    }

    const leadsArr = allLeadsData && allLeadsData.map(item => {
        return (
            <div key={item[0]}>
                <div className='leads__data-row'>
                    <div className='leads-container'>
                        <div className='leads__container-content'>
                            <p>{item[1].projectTitle}</p>
                            <p>{allClientsData && getClientName(allClientsData, item[1].clientId)}</p>
                            <p>{allCompaniesData && getClientCompanyName(allCompaniesData, item[1].companyId)}</p>
                            <p>{item[1].clientProjectNumber}</p>
                            <p>{item[1].projectValue}€</p>
                            <p>{item[1].dateCreated}</p>
                            <div className={`contact__date 
                                ${allClientsData && isDateExceeded(item[1].nextContactDate, 14) != true ? 'green-mark' : 'red-mark' }`}>
                                {item[1].nextContactDate} {isDateExceeded(item[1].nextContactDate, 14) != true ? <HiCheckCircle /> : <HiExclamationCircle /> }
                            </div>
                            <p>{item[1].isSold ? "YES" : "NO"}</p>
                            <p>{item[1].isOpen ? "CLOSED" : "OPEN"}</p>
                        </div>
                        <div className='leads__cta-container'>
                            <p>
                                <Link className='btn-small' to={`/lead/${item[0]}`}>
                                    <FcOpenedFolder className='icon-lg' />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div>
            <div className='filter__form'>
            <p>Filter by:</p>
            <form>
                <div className='form__clients wrapper'>
                    <div className='wrapper'>
                        <input type='text'
                            className='input__lead client-name '
                            id='client-name'
                            name='filterByClient'
                            placeholder="Client"
                            value={filterForm.filterByClient}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className='wrapper'>
                        <input type='text'
                            className='input__lead company-name'
                            id='company-name'
                            name='filterByCompanyName'
                            placeholder='Company name'
                            value={filterForm.filterByCompanyName}
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
                </div>
            </form>
        </div>

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