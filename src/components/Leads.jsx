import React from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'

function Leads() {

    const { addLead } = useDatabaseHook()

    return (
        <div>
            <button onClick={addLead} style={{color: "white", background: "blue"}} >Add new Lead TEST</button>
        
        </div>
    )
}

export default Leads