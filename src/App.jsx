import { useState } from 'react'
import { Link, Routes, Route} from 'react-router-dom'
import './App.css'

import useDatabaseHook from './hooks/useDatabaseHook'


// import of components
import Companies from './components/Companies'
import Company from './components/Company'
import CompanyForm from './components/CompanyForm'

function App() {

  const {allCompanies} = useDatabaseHook()
  let testProp = "dupka"

  return (
      <div>
        <div className='router-links'>
          <Link to="/add-company">Add Company</Link>
          <Link to="/add-client">Add Client</Link>
        </div>
        <Routes>
          <Route path='/' exact element={<Companies />} />
          <Route path="/add-company" element={<CompanyForm />} />
          {allCompanies && allCompanies.map(item => {
            return(
              <Route key={item} path="/company/:id" element={<Company myProps={testProp}/>} />
            )
          })}
        </Routes>

      </div>
  )
}

export default App
