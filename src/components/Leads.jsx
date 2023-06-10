import React from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'

function Leads() {

    const { addLead, allLeadsData, changeIsSold } = useDatabaseHook()

    const leadsArr = allLeadsData && allLeadsData.map(item => {
        return (
            <div key={item[0]}>
                <button onClick={() => changeIsSold(item[0])}>Change Sold</button>
            </div>
        )
    })

    return (
        <div>
            {leadsArr}

        </div>
    )
}

export default Leads