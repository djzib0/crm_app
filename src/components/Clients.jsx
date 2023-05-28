import React from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

export default function Clients() {

  const { allClientsData, allCompaniesData } = useDatabaseHook()

  let clientsArr = allClientsData && allCompaniesData && allClientsData.map(item => {
    console.log(allCompaniesData)
    return (
        <div key={item[0]} className='container company-container'>
             <Link to={`/client/${item[0]}`}>
                <p>{item[1].firstName} {item[1].lastName} </p>
                <p>{item[1].companyId}</p>
                {allCompaniesData && getClientCompanyName(allCompaniesData, item[1].companyId)}
              </Link>

        </div>
    )
})


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
        {clientsArr}
    </section>
  )
}
