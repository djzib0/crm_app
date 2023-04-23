import React, { useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import {Routes, Route, Link} from "react-router-dom"

function Companies() {
    const {allCompanies} = useDatabaseHook()
    console.log(allCompanies)

    return (
        <div>
            {allCompanies}
        </div>
    )
}

export default Companies