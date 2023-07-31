import React, { useEffect, useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook';
import Modal from './Modal';
import useModalHook from '../hooks/useModalHook';

// react-router components import
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'

// styles import
import './client.css'

// icons import
import { TiEdit } from 'react-icons/ti'
import { AiFillLeftCircle } from 'react-icons/ai'

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

  // this state is only to force DOM to re-render after DB is changed
  const [updateState, setUpdateState] = useState(false)

  //client's Id taken from useParams
  const {clientId} = useParams()

  const [selectedClient, setSelectedClient] = useState()
  const [selectedCompany, setSelectedCompany] = useState()

  const { allCompaniesData, addTask } = useDatabaseHook()

  const {
    modalData,
    setModalData,
    closeModal,
  } = useModalHook()

  //fetching client's data
  useEffect(() => {
    async function fetchData() {
      const snapshot = await get(ref(database, `peopleItems/${clientId}`))
      const data = await snapshot.val()
      const companySnapshot = await get(ref(database, `companiesItems/${data.companyId}`))
      const companyData = await companySnapshot.val()
      setSelectedClient(data)
      setSelectedCompany(companyData)
    }
    fetchData()
  }, [])

  function refreshPage() {
    setUpdateState(prevData => !prevData)
  }


  if (selectedClient, selectedCompany) {
    return (
      <div className='client__container'>

        <div className='details__content-container' id='client-details__content-container'>
          <div className='info-container details__content-grid-element'>
            <div className='info-container-top'>

              {/* "absolute" container to fix position of icon */}
              <Link to='../clients'>
                <div className='go-back__container'>
                  {<AiFillLeftCircle />} 
                  <p>BACK</p>
                </div>
              </Link>
              <div className='icon-white' id='edit__btn-client-data'>
                <Link to={`/edit-client/${clientId}`} >{<TiEdit />}</Link>
              </div>
  
              {/* replace below code with an <img> */}
              <div className='details__avatar-img'></div> 
              <div className='details__info-container-top-data'>
                <p id='client__name'>{`${capitalizeFirstLetter(selectedClient.title)}
                    ${capitalizeFirstLetter(selectedClient.firstName)}
                    ${capitalizeFirstLetter(selectedClient.lastName)}`}
                </p>
                <p id='client__company-name'>{selectedCompany.companyName.toUpperCase()}</p>
                <a href={`mailto: ${selectedClient.email}`} id='client__email'>{selectedClient.email}</a> 
                <p id='client__phone-number'>{formatPhoneNumber(selectedClient.phoneNumber)}</p>
              </div>
            </div>
          </div>
  
          <div className='details__content-grid-element'>
          <button onClick={() => setModalData(prevData => {
            //open new modal with new properties
            return {
              ...prevData,
              isActive: true,
              modalType: "add-task",
              messageTitle: "Enter new task title",
              elementId: clientId,
              value: "",
              refreshPage: refreshPage,
              handleFunction: addTask
            }
          }
          )}>Add task</button>
          </div>
  
          <div className='details__content-grid-element'>
            Tutaj będą wykresy?
          </div>
        </div>
        {modalData.isActive && 
        <Modal
          isActive={modalData.isActive}
          modalType={modalData.modalType}
          messageTitle={modalData.messageTitle}
          messageText={modalData.messageText}
          handleFunction={modalData.handleFunction}
          elementId={modalData.elementId}
          value={modalData.value}
          refreshPage={refreshPage}
          onClose={closeModal}
          //props with data to add in DB
          leadId=""
          clientId={clientId}
          />}
      </div>
    )
  }
 
}

export default Client