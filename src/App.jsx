import { useState } from 'react'
import { Link, Routes, Route, useParams} from 'react-router-dom'
import './App.css'

import useDatabaseHook from './hooks/useDatabaseHook'


// import of components
import Menu from './components/Menu'
import Home from './components/Home'
import Companies from './components/Companies'
import Company from './components/Company'
import CompanyForm from './components/CompanyForm'
import Clients from './components/Clients'
import Client from './components/Client'
import ClientForm from './components/ClientForm'
import Leads from './components/Leads'
import LeadForm from './components/LeadForm'
import Lead from './components/Lead'
import Tasks from './components/Tasks'

function App() {

  const {allCompaniesData} = useDatabaseHook()

  return (
      <div className='container'>
        <nav className='navbar menu-top'>
          <Menu />
        </nav>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/companies' element={<Companies />} />
          <Route path="/add-company" element={<CompanyForm />} />
          <Route path="/edit-company/:companyId" element={<CompanyForm />} />
          <Route path="/company/:id" element={<Company />} />
          <Route path="/add-client/:companyId" element={<ClientForm />} />
          <Route path='/edit-client/:clientId' element={<ClientForm />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/client/:clientId' element={<Client />}/>
          <Route path='/leads' element={<Leads />} />
          <Route path='/add-lead/:clientId' element={<LeadForm />} />
          <Route path='/lead/:leadId' element={<Lead />} />
          <Route path='/tasks' element={<Tasks />} />
        </Routes>
        <footer>&nbsp;</footer>
      </div>
  )
}

export default App
