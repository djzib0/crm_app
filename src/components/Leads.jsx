import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import useSortLeadsHook from '../hooks/useSortLeadsHook'
import { Link } from 'react-router-dom'

//import icons
import {
    BsSortNumericDown, 
    BsSortNumericUpAlt,
    BsSortAlphaDown,
    BsSortAlphaUpAlt,
    BsSortDownAlt,
    BsSortUpAlt
    } from 'react-icons/bs'

import './leads.css'

//import utils
import { 
    getClientCompanyName, 
    getClientName, 
    isDateExceeded,
    convertNumberToPotential,
} from './utils/utils'

//import icons
import { FcOpenedFolder } from 'react-icons/fc'
import { HiCheckCircle, HiExclamationCircle} from 'react-icons/hi'
import { BiShow, BiHide } from 'react-icons/bi'

function Leads() {

    // this below state is only to force DOM to re-render 
    // after DB or sorting is changed
    const [updateState, setUpdateState] = useState()

    const [currentSort, setCurrentSort] = useState({
        sortPropertyName: "sortByDateCreated",
        propertyName: "dateCreated"
    })


    const { 
        allLeadsData, 
        allClientsData, 
        allCompaniesData, 
        allCommentsData,
    } = useDatabaseHook()
    const { sortData, toggleSort, sortList } = useSortLeadsHook()

    // object with "empty" properties, 
    // to be use to clear form and to set initial form state
    const filterFormEmptyData = {
        filterByTitle: "",
        filterByClient: "",
        filterByCompanyName: "",
        filterByClientProjectNumber: "",
        filterByValue: 0,
        filterByDateCreated: "",
        filterByPotential: "",
        filterShowSold: true,
        filterShowNotSold: true,
        filterShowOpen: true,
        filterShowClosed: true,
    }

    const [filterForm, setFilterForm] = useState(filterFormEmptyData)
   

    function handleSortChange(sortPropertyName, propertyName, ) {
        setCurrentSort(prevData => {
            return {
                sortPropertyName: sortPropertyName,
                propertyName: propertyName,
            }
        })
        toggleSort(sortPropertyName, propertyName)
        setUpdateState(prevData => !prevData)
    }

    function handleFilterChange(e) {
        const { name, value} = e.target
        setFilterForm(prevFormData => {
            return {
                ...prevFormData,
                [name] : value
            }
        })
    }

    function countComments(leadId) {
        //if allCommentsData is fetched ,filter it
        const leadCommentsArr = allCommentsData && allCommentsData.filter(item => {
            //if passed leadId is the same as the comment's leadId
            //add it to the commentsCount array
            return item[1].leadId === leadId
        })
        //return count of messages with the same leadId
        return leadCommentsArr.length
    }

    // functions to change visibility of filtered items
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



    function filterLeads() {
        // set new array with client id and formatted fullName
        const clientsFullNameArr = allClientsData.map(client => {
            return {
                clientId: client[0],
                clientFullName: client[1].firstName + " " + client[1].lastName
            }
        })

        // set new array with filtered from array with clients maching 
        // form input
        const filteredClientsArr = clientsFullNameArr.filter(client => {
            return client.clientFullName.toLowerCase().includes(filterForm.filterByClient.toLowerCase())
        })

        // set new array only with the id's of matching clients
        // if leadItem.clientId is in below array, it will be displayed
        const filteredClientsId = filteredClientsArr.map(item => {
            return item.clientId
        })

        // set new array with companies matching form company name
        const companiesArr = allCompaniesData.filter(company => {
            return company[1].companyName.toLowerCase().includes(filterForm.filterByCompanyName)
        })

        // set array of companies Id - if clients companyId matches any from the array
        // it will be displayed
        const companiesIdArr = companiesArr.map(company => {
            return company[0]
        })


        //create the array of leads based on checked filterForm attributes:
        // filterShowSold, filterShowNotSold, filterShowOpen, filterShowClosed

        let selectedLeads = []
     
        allLeadsData.forEach(item => {
            if (filterForm.filterShowOpen && filterForm.filterShowSold) {
                if (!item[1].isClosed && item[1].isSold && !selectedLeads.includes(item)) {
                    selectedLeads.push(item)
                } 
            }
            if (filterForm.filterShowOpen && filterForm.filterShowNotSold) {
                if (!item[1].isClosed && !item[1].isSold && !selectedLeads.includes(item)) {
                    selectedLeads.push(item)
                }
            }
            if (filterForm.filterShowClosed && filterForm.filterShowSold) {
                if (item[1].isClosed && item[1].isSold && !selectedLeads.includes(item)) {
                    selectedLeads.push(item)
                }
            }
            if (filterForm.filterShowClosed && filterForm.filterShowNotSold) {
                if (item[1].isClosed && !item[1].isSold && !selectedLeads.includes(item)) {
                    selectedLeads.push(item)
                }
            }
        })

        //remove duplicates
        const selectedLeadsWithoutDupes = [...new Set(selectedLeads)]

        
        const filteredLeadsData = selectedLeadsWithoutDupes.filter(item => {
            return (
                item[1].projectTitle.toLowerCase().includes(filterForm.filterByTitle.toLowerCase()) &&
                filteredClientsId.includes(item[1].clientId) &&
                companiesIdArr.includes(item[1].companyId) &&
                item[1].clientProjectNumber.toLowerCase().includes(filterForm.filterByClientProjectNumber) &&
                Number(item[1].projectValue) >= Number(filterForm.filterByValue) &&
                item[1].dateCreated > filterForm.filterByDateCreated &&
                String(item[1].projectPotential).includes(filterForm.filterByPotential)
            )
        })

        // map new array with additional properties taken from database
        // companyName and clientFullName
        const filteredLeads = filteredLeadsData.map(item => {
            return {
                ...item, 
                1: {...item[1], 
                    clientFullName: getClientName(allClientsData, item[1].clientId),
                    companyName: getClientCompanyName(allCompaniesData, item[1].companyId)
                }
            }
        })

        //sort list by given property
        const sortedLeads = sortList(filteredLeads, currentSort.sortPropertyName, currentSort.propertyName)
        
        return sortedLeads
    }

    // creating array of leads to be displayed on screen
    const leadsArr = allLeadsData && allClientsData && allCompaniesData && filterLeads().map(item => {
        return (
            <div key={item[0]}>
                <div className='leads__data-row'>
                    <div className='leads-container'>
                        <div className='leads__container-content'>
                            <p>{item[1].projectTitle}</p>
                            <p>{allClientsData && item["1"].clientFullName}</p>
                            <p>{allCompaniesData && item["1"].companyName}</p>
                            <p>{item[1].clientProjectNumber}</p>
                            <p>{item[1].projectValue}€</p>
                            <p>{item[1].dateCreated}</p>
                            <div className={`contact__date 
                                ${allClientsData && isDateExceeded(item[1].nextContactDate, 14) != true ? 'green-mark' : 'red-mark' }`}>
                                {item[1].nextContactDate} {isDateExceeded(item[1].nextContactDate, 14) != true ? <HiCheckCircle /> : <HiExclamationCircle /> }
                            </div>
                            <p>{item[1].isSold ? "YES" : "NO"}</p>
                            <p>{item[1].isClosed ? "CLOSED" : "OPEN"}</p>
                            <p>{convertNumberToPotential(item[1].projectPotential)}</p>
                            <p>{allCommentsData && countComments(item[0])}</p>
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
            <div className='filter__form-container-left'>
                <small>FILTER BY:</small>
                <button 
                    onClick={() => setFilterForm(filterFormEmptyData)}
                    type='button' 
                    className=' edit-btn'>CLEAR FORM</button>
            </div>

            <form>
                <div className='form__leads wrapper'>
                    <div className='input-wrapper'>
                        <input type='text'
                            className='input__lead title'
                            id='title'
                            name='filterByTitle'
                            placeholder='Title'
                            value={filterForm.filterByTitle}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className='input-wrapper'>
                        <input type='text'
                            className='input__leads client-name '
                            id='client-name'
                            name='filterByClient'
                            placeholder="Client"
                            value={filterForm.filterByClient}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className='input-wrapper'>
                        <input type='text'
                            className='input__leads company-name'
                            id='company-name'
                            name='filterByCompanyName'
                            placeholder='Company name'
                            value={filterForm.filterByCompanyName}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className='input-wrapper'>
                        <input type='text'
                        className='input__leads client-project'
                        id='client-project'
                        name='filterByClientProjectNumber'
                        placeholder='Project number'
                        value={filterForm.filterByClientProjectNumber}
                        onChange={handleFilterChange}
                        />
                    </div>
                    <div className='input-wrapper'>
                        <label className='label-sm' htmlFor='project-value'>Value &gt;= €</label>
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
                    <div className='input-wrapper'>
                        <label className='label-sm' htmlFor='date-created'>Date &gt;</label>
                        <input type='date'
                        className='input__leads project-value'
                        id='date-created'
                        name='filterByDateCreated'
                        placeholder='0'
                        min={0}
                        value={filterForm.filterByDateCreated}
                        onChange={handleFilterChange}
                        />
                    </div>
                    <div className='filter-btns__container'>
                        <div className='filter-btn__container' onClick={(handleShowSoldChange)}>
                            <button type='button' className='show-hide-btn no-border-btn filter-btn'>
                                {filterForm.filterShowSold ? <p>HIDE SOLD</p> : <p>SHOW SOLD</p>}
                                {filterForm.filterShowSold ? <BiShow className='visibility-icon'/> : <BiHide className='visibility-icon'/>}
                            </button>
                        </div>
                        <div className='filter-btn__container' onClick={handleShowNotSoldChange}>
                            <button type='button' className='show-hide-btn no-border-btn filter-btn'>
                            {filterForm.filterShowNotSold ? <p>HIDE NOT SOLD</p> : <p>SHOW NOT SOLD"</p>}
                            {filterForm.filterShowNotSold ? <BiShow className='visibility-icon'/> : <BiHide className='visibility-icon'/>}
                            </button>
                        </div>
                        <div className='filter-btn__container' onClick={handleShowOpenChange}>
                            <button type='button' className='show-hide-btn no-border-btn filter-btn'>
                            {filterForm.filterShowOpen ? <p>HIDE OPEN</p> : <p>SHOW OPEN</p>}
                            {filterForm.filterShowOpen ? <BiShow className='visibility-icon'/> : <BiHide className='visibility-icon'/>}
                            </button>
                        </div>
                        <div className='filter-btn__container' onClick={handleShowClosedChange}>
                            <button type='button' className='show-hide-btn no-border-btn filter-btn'>
                            {filterForm.filterShowClosed ? <p>HIDE CLOSED</p> : <p>SHOW CLOSED</p>}
                            {filterForm.filterShowClosed ? <BiShow className='visibility-icon' /> : <BiHide className='visibility-icon'/>}
                            </button>
                        </div>
                    </div>
                    <div className='input-wrapper'>
                        <select 
                            id="project-potential" 
                            value={filterForm.filterByPotential}
                            className='input__leads project-value'
                            onChange={handleFilterChange}
                            name="filterByPotential"
                        >
                            <option value=''>All</option>
                            <option value={0}>Low</option>
                            <option value={1}>Medium</option>
                            <option value={2}>High</option>
                        </select>
                    </div>
                    
                </div>
            </form>
        </div>

            <div className='leads-container' id="leads-header">
                <div className='leads__container-headers'>
                        <div onClick={() => handleSortChange("sortByTitle", "projectTitle")} className='leads__container-headers-title'>
                            <p>TITLE</p>
                            {currentSort.propertyName === "projectTitle" && sortData.sortByTitle &&
                            <BsSortAlphaDown className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "projectTitle" && !sortData.sortByTitle &&
                            <BsSortAlphaUpAlt className='leads__container-headers-icon'/>}
                        </div>

                        <div onClick={() => handleSortChange("sortByClient", "clientFullName")} className='leads__container-headers-title'>
                            <p>CLIENT</p>
                            {currentSort.propertyName === "clientFullName" && sortData.sortByClient &&
                            <BsSortAlphaDown className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "clientFullName" && !sortData.sortByClient &&
                            <BsSortAlphaUpAlt className='leads__container-headers-icon'/>}
                        </div>
                        <div onClick={() => handleSortChange("sortByCompany", "companyName")} className='leads__container-headers-title'>
                            <p>COMPANY</p>
                            {currentSort.propertyName === "companyName" && sortData.sortByCompany &&
                            <BsSortAlphaDown className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "companyName" && !sortData.sortByCompany &&
                            <BsSortAlphaUpAlt className='leads__container-headers-icon'/>}
                        </div>
                        <div onClick={() => handleSortChange("sortByClientProjectNumber", "clientProjectNumber")}  className='leads__container-headers-title'>
                            <p>CLIENT PROJECT NO</p>
                            {currentSort.propertyName === "clientProjectNumber" && sortData.sortByClientProjectNumber &&
                            <BsSortAlphaDown className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "clientProjectNumber" && !sortData.sortByClientProjectNumber &&
                            <BsSortAlphaUpAlt className='leads__container-headers-icon'/>}
                        </div>
                        <div onClick={() => handleSortChange("sortByValue", "projectValue")} className='leads__container-headers-title'>
                            <p>VALUE</p>
                            {currentSort.propertyName === "projectValue" && sortData.sortByValue &&
                            <BsSortNumericDown className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "projectValue" && !sortData.sortByValue &&
                            <BsSortNumericUpAlt className='leads__container-headers-icon'/>}
                        </div>            
                        <div onClick={() => handleSortChange("sortByDateCreated", "dateCreated")} className='leads__container-headers-title'>
                            <p>DATE CREATED</p>
                            {currentSort.propertyName === "dateCreated" && sortData.sortByDateCreated &&
                            <BsSortNumericDown className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "dateCreated" && !sortData.sortByDateCreated &&
                            <BsSortNumericUpAlt className='leads__container-headers-icon'/>}
                        </div>
                        <div onClick={() => handleSortChange("sortByNextContactDate", "nextContactDate")} className='leads__container-headers-title'>
                            <p>NEXT CONTACT DATE</p>
                            {currentSort.propertyName === "nextContactDate" && sortData.sortByNextContactDate &&
                            <BsSortNumericDown className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "nextContactDate" && !sortData.sortByNextContactDate &&
                            <BsSortNumericUpAlt className='leads__container-headers-icon'/>}
                        </div> 
                        <div onClick={() => handleSortChange("sortBySold", "isSold")} className='leads__container-headers-title'>
                            <p>SOLD</p>
                            {currentSort.propertyName === "isSold" && sortData.sortBySold &&
                            <BsSortDownAlt className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "isSold" && !sortData.sortBySold &&
                            <BsSortUpAlt className='leads__container-headers-icon'/>}
                        </div> 
                        <div onClick={() => handleSortChange("sortByStatus", "isClosed")} className='leads__container-headers-title'>
                            <p>STATUS</p>
                            {currentSort.propertyName === "isClosed" && sortData.sortByStatus &&
                            <BsSortDownAlt className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "isClosed" && !sortData.sortByStatus &&
                            <BsSortUpAlt className='leads__container-headers-icon'/>}
                        </div>   
                        <div onClick={() => handleSortChange("sortByPotential", "projectPotential")} className='leads__container-headers-title'>
                            <p>POTENTIAL</p>
                            {currentSort.propertyName === "projectPotential" && sortData.sortByPotential &&
                            <BsSortDownAlt className='leads__container-headers-icon'/>}
                            {currentSort.propertyName === "projectPotential" && !sortData.sortByPotential &&
                            <BsSortUpAlt className='leads__container-headers-icon'/>}
                        </div>
                        <div className='leads__container-headers-title'>
                            <p>COMMENTS</p>
                        </div>
                </div>
                <div className='cta__container'>
                </div>
        </div>
            {leadsArr}
        </div>
    )
}

export default Leads