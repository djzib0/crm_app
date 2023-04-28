import React from 'react'
import { Link, useParams } from 'react-router-dom'

import useDatabaseHook from '../hooks/useDatabaseHook'

function Company(props) {

  const {fillFormToUpdate} = useDatabaseHook()

  const { id } = useParams()

  const { companyName,
    companyAddressStreet, 
    companyAddressBuildingNumber,
    companyAddressZipCode,
    companyAddressCity,
    companyId,
   } = props

   console.log(companyName)

  return (
    <div>
      {companyName} {companyAddressStreet}
      <p>Company ID: {companyId}</p>
      <p>This is useParams id: {id}</p>
      <Link to="/add-company" onClick={
        () => fillFormToUpdate(companyId, 
          companyName,
          companyAddressStreet,
          companyAddressBuildingNumber,
          companyAddressZipCode,
          companyAddressCity
          )}>
        Edit client data</Link>
    </div>
  )
}

export default Company