import { useState } from 'react'
import { Link, Routes, Route} from 'react-router-dom'
import './App.css'

import useDatabaseHook from './hooks/useDatabaseHook'


// import of components
import Companies from './components/Companies'
import Company from './components/Company'
import CompanyTest from './components/CompanyTest'
import CompanyForm from './components/CompanyForm'

function App() {

  const {allCompaniesData} = useDatabaseHook()

  // let companyArr = allCompaniesData && allCompaniesData.map(item => {
  //   // destructurization for props
  //   const { companyName,
  //           companyAddressStreet, 
  //           companyAddressBuildingNumber,
  //           companyAddressZipCode,
  //           companyAddressCity,
  //         } = item[1]
  //   return(
  //     <Route key={item[0]} path="/company/:id" element={<Company 
  //       companyName={companyName}
  //       companyAddressStreet={companyAddressStreet}
  //       companyAddressBuildingNumber={companyAddressBuildingNumber}
  //       companyAddressZipCode={companyAddressZipCode}
  //       companyAddressCity={companyAddressCity}
  //       companyId={item[0]}
  //       showItem={console.log(item[1].companyName)}
  //       />} />
  //   )
  // })


  
  return (
      <div>
        <div className='router-links'>
          <Link to="/add-company">Add Company</Link>
          <Link to="/add-client">Add Client</Link>
        </div>
        <Routes>
          <Route path='/' exact element={<Companies />} />
          <Route path="/add-company" element={<CompanyForm />} />
          {/* <Route path="/company/:id" element={<Company />} /> */}
          {/* {allCompaniesData && allCompaniesData.map(item => {
            // destructurization for props
            const { companyName,
                    companyAddressStreet, 
                    companyAddressBuildingNumber,
                    companyAddressZipCode,
                    companyAddressCity,
                   } = item[1]
            console.log(item[1])

            return(
              <Route key={item[0]} path={`/company/${item[0]}`} element={<Company 
                companyName={companyName}
                companyAddressStreet={companyAddressStreet}
                companyAddressBuildingNumber={companyAddressBuildingNumber}
                companyAddressZipCode={companyAddressZipCode}
                companyAddressCity={companyAddressCity}
                companyId={item[0]}
                />} />
            )
          })} */}
          <Route path="/company/:id" element={<CompanyTest />} />
        </Routes>

      </div>
  )
}

export default App
