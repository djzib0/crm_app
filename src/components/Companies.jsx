import React, { useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'

import CompanyForm from './CompanyForm'

function Companies() {
    const {allCompanies} = useDatabaseHook()


    return (
        <div>
            {allCompanies}
        </div>
    )
}

export default Companies