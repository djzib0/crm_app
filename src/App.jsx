import { useState } from 'react'
import { Link, Routes, Route, useParams} from 'react-router-dom'
import './App.css'

import useDatabaseHook from './hooks/useDatabaseHook'


// import of components
import Menu from './components/Menu'
import Companies from './components/Companies'
import Company from './components/Company'
import CompanyTest from './components/CompanyTest'
import CompanyForm from './components/CompanyForm'
import ClientForm from './components/clientForm'

function App() {

  const {allCompaniesData} = useDatabaseHook()

  
  return (
      <div>
        <nav className='navbar menu-top'>
          <Menu />
        </nav>
        <div className='router-links'>
          <Link to="/add-company">Add Company</Link>
          <Link to="/add-client">Add Client</Link>
        </div>
        <Routes>
          <Route path='/' exact element={<Menu />} />
          <Route path='/companies' exact element={<Companies />} />
          <Route path="/add-company" element={<CompanyForm />} />
          <Route path="/edit-company/:companyId" element={<CompanyForm />} />
          <Route path="/company/:id" element={<CompanyTest />} />
          <Route path="/add-client" element={<ClientForm />} />
        </Routes>

      </div>
  )
}

export default App
