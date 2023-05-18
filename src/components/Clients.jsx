import React from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { Link } from 'react-router-dom'

export default function Clients() {

  const {allClientsData} = useDatabaseHook()

  let clientsArr = allClientsData && allClientsData.map(item => {
    return (
        <div key={item[0]} className='container company-container'>
             <Link to={`/company/${item[1].companyId}`}>
                <p>{item[1].firstName} {item[1].lastName}</p>
              </Link>

        </div>
    )
})

  return (
    <section>
        {clientsArr}
    </section>
  )
}
