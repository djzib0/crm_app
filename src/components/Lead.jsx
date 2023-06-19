import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useDatabaseHook from '../hooks/useDatabaseHook';


// css import
import './lead.css'

// icons import
import { FaArrowLeft } from 'react-icons/fa'

// utils import
import { 
	getClientCompanyName,
	capitalizeFirstLetter,
	formatPhoneNumber,
} from './utils/utils'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCyId9D2ZgN8QXzA68k3MEV02m50Jivqsk",
	authDomain: "realtime-database-903af.firebaseapp.com",
	databaseURL: "https://realtime-database-903af-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "realtime-database-903af",
	storageBucket: "realtime-database-903af.appspot.com",
	messagingSenderId: "658938276512",
appId: "1:658938276512:web:ee6fe1b71c842d428e37c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

function Lead() {

  const { allCompaniesData } = useDatabaseHook()

  const { leadId } = useParams()

  const [formData, setFormData] = useState({
  })

  const [selectedLead, setSelectedLead] = useState()
  const [selectedClient, setSelectedClient] = useState()
  const [selectedCompany, setSelectedCompany] = useState()

  //fetching lead's data
  useEffect(() => {
    async function fetchLeadData() {
      const snapshot = await get(ref(database, `leadsItems/${leadId}`))
      const data = await snapshot.val()
      console.log(data, "data")
      console.log(data.clientId)
      const clientSnapshot = await get(ref(database, `peopleItems/${data.clientId}`))
      const clientData = await clientSnapshot.val()
      const companySnapshot = await get(ref(database, `companiesItems/${data.companyId}`))
      const companyData = await companySnapshot.val()
      setSelectedLead(data)
      setSelectedClient(clientData)
      setSelectedCompany(companyData)
    }
    fetchLeadData()
    }, [])
  

  if (selectedClient, selectedLead, selectedClient) {
    return (
      <div className='client__container'>
    
        <div className='details__content-container' id='lead-details__content-container'>
          
          <div className='info-container details__content-grid-element'>
            <div className='info-container-top'>
              {/* "absolute" container to fix position of icon */}
              <div className='icon-white' id='edit__btn-client-data'>
                <Link>BACK {<FaArrowLeft />}</Link>
              </div>
              <div className='details__info-container-top-data'>
                <p id='lead__title'>{selectedLead.projectTitle}</p>
                <p id='client__name'>{`${capitalizeFirstLetter(selectedClient.title)}
                  ${capitalizeFirstLetter(selectedClient.firstName)}
                  ${capitalizeFirstLetter(selectedClient.lastName)}`}
                </p>
                <p id='client__company-name'>{selectedCompany.companyName.toUpperCase()}</p>
                <a href={`mailto: ${selectedClient.email}`} id='client__email'>{selectedClient && selectedClient.email}</a> 
                <p id='client__phone-number'>{selectedClient && formatPhoneNumber(selectedClient.phoneNumber)}</p>
              </div>
            </div>
    
            <div>Jestem tutaj</div>
        </div>
    
        <div className='details__content-grid-element' id='lead-comments__container'>
          Tutaj będą wiadomości
        </div>
    
        <div className='details__content-grid-element'>
          Tutaj będą wykresy?
        </div>
        </div>
      </div>
      )
  }
  
}

export default Lead