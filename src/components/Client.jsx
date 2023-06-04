import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useDatabaseHook from '../hooks/useDatabaseHook';

// styles import
import './client.css'

// icons import
import { TiEdit } from 'react-icons/ti'

// utils import
import { getClientCompanyName,
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


function Client() {

  //client's Id taken from Params
  const {clientId} = useParams()

  const [selectedClient, setSelectedClient] = useState()

  const { allCompaniesData } = useDatabaseHook()

  //fetching client's data
  useEffect(() => {
    async function fetchData() {
      const snapshot = await get(ref(database, `peopleItems/${clientId}`))
      const data = await snapshot.val()
      setSelectedClient(data)
    }
    fetchData()
  }, [])

  // declaring variable without value
  let companyId
  let title
  let firstName
  let lastName
  let email
  let phoneNumber
  let lastContactDate
  let nextContactDate
  let isContactDateExceeded

  // if selectedCompany is set (fetched with useEffect)
  // set fetched data to variables
  if (selectedClient) {
    companyId = selectedClient.companyId
    title = selectedClient.title
    firstName = selectedClient.firstName
    lastName = selectedClient.lastName
    email = selectedClient.email
    phoneNumber = selectedClient.phoneNumber
    lastContactDate = selectedClient.lastContactDate
    nextContactDate = selectedClient.nextContactDate
    isContactDateExceeded = selectedClient.isContactDateExceeded
  }

  //search for the company where the client is working in
  const clientCompany = allCompaniesData && allCompaniesData.filter(item => {
    return item[0] === companyId
  })

  
  return (
    <div className='client__container'>

      <div className='client__details-container'>
        <div className='client__info-container client__grid-element'>
          <div className='client__info-container-top'>

            {/* "absolute" container to fix position of icon */}
            <div className='icon-white' id='edit__btn-client-data'>
              {<TiEdit />}
            </div>

            {/* replace below code with an <img> */}
            <div className='client__avatar-img'></div> 
            <div className='client__info-container-top-data'>
              <p id='client__name'>{`${selectedClient && capitalizeFirstLetter(title)}
                  ${selectedClient && capitalizeFirstLetter(firstName)}
                  ${selectedClient && capitalizeFirstLetter(lastName)}`}
              </p>
              <p id='client__company-name'>{allCompaniesData && selectedClient && getClientCompanyName(allCompaniesData, companyId).toUpperCase()}</p>
              <a href={`mailto: ${email}`} id='client__email'>{selectedClient && email}</a> 
              <p id='client__phone-number'>{selectedClient && formatPhoneNumber(phoneNumber)}</p>
            </div>
          </div>
        </div>

        <div className='client__events-container client__grid-element'>
          Tutaj będą nadchodzące eventy
        </div>

        <div className='client__charts-container client__grid-element'>
          Tutaj będą wykresy?
        </div>
      </div>
    </div>
  )
}

export default Client