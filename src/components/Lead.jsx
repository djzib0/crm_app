import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useDatabaseHook from '../hooks/useDatabaseHook';


// css import
import './lead.css'

// icons import
import { FaArrowLeft } from 'react-icons/fa'
import { ImLock, ImUnlocked, ImCheckmark, ImCross} from 'react-icons/im'

// utils import
import { 
	capitalizeFirstLetter,
	formatPhoneNumber,
  isNumber,
  convertComaToDot,
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

  // this state is only to force DOM to re-render after DB is changed
  const [updateState, setUpdateState] = useState()

  const { 
    allCompaniesData, 
    changeIsClosed, 
    changeIsSold, 
    changePotential,
    changeNextContactDate,
    changeProjectValue,
  } = useDatabaseHook()

  const { leadId } = useParams()


  const [selectedLead, setSelectedLead] = useState()
  const [selectedClient, setSelectedClient] = useState()
  const [selectedCompany, setSelectedCompany] = useState()

  const [newProjectValue, setNewProjectValue] = useState()
  const [confirmBtnDisplay, setConfirmBtnDisplay] = useState(false)



  function changeNewProjectValue(e) {
    const newValue = e.target.value
    if (newValue.slice(-1) === '€') {
      newValue.slice(0, -1) === selectedLead.projectValue.replace(",", ".") ? setConfirmBtnDisplay(false) : setConfirmBtnDisplay(true)
    }
    if (newValue.slice(-1) != '€') {
      // this is to always display € currency after the value
      setNewProjectValue(newValue.replace("€", "") + '€')
    } else {
      setNewProjectValue(newValue)
    }
  }

  //fetching lead's data
  useEffect(() => {
    async function fetchLeadData() {
      const snapshot = await get(ref(database, `leadsItems/${leadId}`))
      const data = await snapshot.val()
      const clientSnapshot = await get(ref(database, `peopleItems/${data.clientId}`))
      const clientData = await clientSnapshot.val()
      const companySnapshot = await get(ref(database, `companiesItems/${data.companyId}`))
      const companyData = await companySnapshot.val()
      setSelectedLead(data)
      setSelectedClient(clientData)
      setSelectedCompany(companyData)
      setNewProjectValue(data.projectValue + "€")
      // setFormData({
      //   projectPotential: data.projectPotential
      // })
  }
  fetchLeadData()
  }, [updateState]) 

  async function updateData(leadId, func, event) {
    await func(leadId, event.target.value)
    // changing updateState to re-render DOM
    setUpdateState(prevData => !prevData)
  }

  async function updateValueData(leadId, func, value) {
    
    // changing updateState to re-render DOM
    if (isNumber(value.slice(0, -1).replace(",", "."))) {
      await func(leadId, value.slice(0, -1))
      setUpdateState(prevData => !prevData)
      setConfirmBtnDisplay(false)
    } else {
      console.log("showing modal that value is not a number")
    }
  }


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
                <a href={`mailto: ${selectedClient.email}`} id='client__email'>{selectedClient.email}</a> 
                <p id='client__phone-number'>{selectedClient && formatPhoneNumber(selectedClient.phoneNumber)}</p>
              </div>
            </div>
    
            <div className='data__container'>

              <div className='data__container-column-50-left'>
                <div className='data__container-row'>
                  <h4>Lead status:</h4>
                  <h5>{!selectedLead.isClosed ? `OPEN` : `CLOSED`}</h5>
                  <h5 className='icon-btn' onClick={(e) => updateData(leadId, changeIsClosed, e)}>
                    {!selectedLead.isClosed ? <ImUnlocked className='anim-shake'/> : <ImLock className='anim-shake' />}
                  </h5>
                </div>
                <div className='data__container-row'>
                  <h4>Sold status:</h4>
                  <h5>{!selectedLead.isSold ? `NOT SOLD` : `SOLD`}</h5>
                  <h5 className='icon-btn' onClick={(e) => updateData(leadId, changeIsSold, e)}>
                    {!selectedLead.isSold ? <ImCheckmark className='anim-shake'/> : <ImCross className='anim-shake' />}
                  </h5>
                </div>
                <div className='data__container-row'>
                  <h4>Lead potential:</h4>
                  <h5 className='icon-btn'>
                    <select name='projectPotential'
                      id='project-potential'
                      value={selectedLead.projectPotential}
                      onChange={(e) => updateData(leadId, changePotential, e)}
                      >
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>
                  </select>
                  </h5>
                </div>
              </div>

              <div className='data__container-column-50-right'>
                <div className='data__container-row'>
                  <h4>Lead value:</h4>
                  <input
                  className=''
                    type='text'
                    name='projectValue'
                    id='project-value'
                    value={newProjectValue.replace(".", ",")}
                    onChange={changeNewProjectValue}
                  />
                  {confirmBtnDisplay ? <p onClick={() => updateValueData(leadId, changeProjectValue, newProjectValue)}>Confirm</p> : ""}
                </div>
                <div className='data__container-row'>
                  <h4>Next contact:</h4>
                  <input name='nextContactDate'
                    type='date'
                    id='next-contact-date'
                    value={selectedLead.nextContactDate}
                    onChange={(e) => updateData(leadId, changeNextContactDate, e)}
                    />
                </div>
              </div>

            </div>
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