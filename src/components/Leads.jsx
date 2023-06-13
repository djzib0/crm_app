import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

import './leads.css'

//import utils
import { getClientCompanyName, getClientName, isDateExceeded} from './utils/utils'

//import icons
import { FcOpenedFolder } from 'react-icons/fc'
import { HiCheckCircle, HiExclamationCircle} from 'react-icons/hi'
import { BiShow, BiHide } from 'react-icons/bi'

function Leads() {

    const { allLeadsData, allClientsData, allCompaniesData} = useDatabaseHook()

    const [filterForm, setFilterForm] = useState({
        filterByTitle: "",
        filterByClient: "",
        filterByCompanyName: "",
        filterByClientProjectNumber: "",
        filterByValue: 0,
        filterByDateCreated: "",
        filterShowSold: true,
        filterShowNotSold: true,
        filterShowOpen: true,
        filterShowClosed: true,
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

    // functions to change visibility state for filtering displayed
    // items
    function handleShowSoldChange() {
        setFilterForm(prevData => {
            return {
                ...prevData,
                filterShowSold: !prevData.filterShowSold
            }
        })
    }

    function handleShowNotSoldChange() {
        setFilterForm(prevData => {
            return {
                ...prevData,
                filterShowNotSold: !prevData.filterShowNotSold
            }
        })
    }

    function handleShowOpenChange() {
        setFilterForm(prevData => {
            return {
                ...prevData,
                filterShowOpen: !prevData.filterShowOpen
            }
        })
    }

    function handleShowClosedChange() {
        setFilterForm(prevData => {
            return {
                ...prevData,
                filterShowClosed: !prevData.filterShowClosed
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
                <div className='form__leads wrapper'>
                    <div className='wrapper'>
                        <input type='text'
                            className='input__lead title'
                            id='title'
                            name='filterByTitle'
                            placeholder='Title'
                            value={filterForm.filterByTitle}
                            onChange={handleFilterChange}
                        />
                    </div>
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
                        className='input__leads client-project'
                        id='client-project'
                        name='filterByClientProjectNumber'
                        placeholder='Project number'
                        value={filterForm.filterByClientProjectNumber}
                        onChange={handleFilterChange}
                        />
                    </div>
                    <div className='wrapper'>
                        <input type='number'
                        className='input__leads project-value'
                        id='project-value'
                        name='filterByValue'
                        placeholder='0'
                        min={0}
                        value={filterForm.filterByValue}
                        onChange={handleFilterChange}
                        />
                    </div>
                    <div className='filter-btns__container'>
                        <div className='filter-btn__container'>
                            <div className='filter-btn'>
                                <button type='button' className='show-hide-btn no-border-btn' onClick={handleShowSoldChange}>{filterForm.filterShowSold ? "HIDE SOLD" : "SHOW SOLD"}</button>
                                {filterForm.filterShowSold ? <BiShow onClick={handleShowSoldChange} /> : <BiHide onClick={handleShowSoldChange} />}
                            </div>
                            <div className='filter-btn'>
                                <button type='button' className='show-hide-btn no-border-btn' onClick={handleShowNotSoldChange}>{filterForm.filterShowNotSold ? "HIDE NOT SOLD" : "SHOW NOT SOLD"}</button>
                                {filterForm.filterShowNotSold ? <BiShow onClick={handleShowNotSoldChange}/> : <BiHide onClick={handleShowNotSoldChange}/>}
                            </div>
                        </div>
                        <div className='filter-btn__container'>
                            <div className='filter-btn'>
                                <button type='button' className='show-hide-btn no-border-btn' onClick={handleShowOpenChange}>{filterForm.filterShowOpen ? "HIDE OPEN" : "SHOW OPEN"}</button>
                                {filterForm.filterShowOpen ? <BiShow onClick={handleShowOpenChange} /> : <BiHide onClick={handleShowOpenChange} />}
                            </div>
                            <div className='filter-btn'>
                                <button type='button' className='show-hide-btn no-border-btn' onClick={handleShowClosedChange}>{filterForm.filterShowClosed ? "HIDE NOT SOLD" : "SHOW NOT SOLD"}</button>
                                {filterForm.filterShowClosed ? <BiShow onClick={handleShowClosedChange}/> : <BiHide onClick={handleShowClosedChange}/>}
                            </div>
                        </div>
                        
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