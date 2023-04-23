import { useState } from 'react'
import { Link, Routes, Route} from 'react-router-dom'
import './App.css'


// import of components
import Companies from './components/Companies'
import CompanyForm from './components/CompanyForm'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <div className='router-links'>
          <Link to="/add-company">Add Company</Link>
          <Link to="/add-client">Add Client</Link>
        </div>
        <Routes>
          <Route path='/' exact element={<Companies />} />
          <Route path="/add-company" element={<CompanyForm />} />
        </Routes>

      </div>
  )
}

export default App
