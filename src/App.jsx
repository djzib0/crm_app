import { useState } from 'react'
import { Link, Routes, Route, useParams} from 'react-router-dom'
import './App.css'

import useDatabaseHook from './hooks/useDatabaseHook'


// import of components
import Menu from './components/Menu'
import Companies from './components/Companies'
import Company from './components/Company'
import CompanyTest from './components/Company'
import CompanyForm from './components/CompanyForm'
import Clients from './components/Clients'
import Client from './components/Client'
import ClientForm from './components/clientForm'

function App() {

  const {allCompaniesData} = useDatabaseHook()

  
  return (
      <div className='container'>
        <nav className='navbar menu-top'>
          <Menu />
        </nav>
        <Routes>
          <Route path='/companies' exact element={<Companies />} />
          <Route path="/add-company" element={<CompanyForm />} />
          <Route path="/edit-company/:companyId" element={<CompanyForm />} />
          <Route path="/company/:id" element={<Company />} />
          <Route path="/add-client/:companyId" element={<ClientForm />} />
          <Route path='edit-client/:clientId' element={<ClientForm />} />
          <Route path='clients' element={<Clients />} />
          <Route path='client/:clientId' element={<Client />}/>
        </Routes>

      </div>
  )
}

export default App
