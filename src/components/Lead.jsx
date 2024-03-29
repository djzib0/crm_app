import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Modal from './Modal';
import GoBack from './GoBack';
import useModalHook from '../hooks/useModalHook';
import useDatabaseHook from '../hooks/useDatabaseHook';


// css import
import './lead.css'

// icons import
import { AiFillLeftCircle } from 'react-icons/ai'
import { ImLock, ImUnlocked, ImCheckmark, ImCross} from 'react-icons/im'
import { AiTwotoneEdit } from 'react-icons/ai'
import { GiConfirmed } from 'react-icons/gi'
import { GrPowerReset } from 'react-icons/gr'
import { RiAddBoxFill, RiDeleteBin6Fill } from 'react-icons/ri'
import {
  BsSortDownAlt,
  BsSortUpAlt
  } from 'react-icons/bs'


// utils import
import { 
	capitalizeFirstLetter,
	formatPhoneNumber,
  isNumber,
  getToday,
} from './utils/utils'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from 'firebase/database'
import LeadComment from './LeadComment';
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
  const [updateState, setUpdateState] = useState(false)

  const { 
    allCompaniesData,
    allLeadCommentsData,
    showAllLeadCommentsData,
    setAllLeadCommentsData,
    addLeadComment,
    addTask,
    changeIsClosed, 
    changeIsSold, 
    changePotential,
    changeNextContactDate,
    changeProjectValue,
    changeLeadTitle,
  } = useDatabaseHook()

  const {
    modalData,
    setModalData,
    closeModal,
  } = useModalHook()

  const { leadId } = useParams()

  const [selectedLead, setSelectedLead] = useState()
  const [selectedClient, setSelectedClient] = useState()
  const [selectedCompany, setSelectedCompany] = useState()

  const [areCommentsSorted, setAreCommentsSorted] = useState(false)

  const [newProjectValue, setNewProjectValue] = useState()
  const [confirmBtnDisplay, setConfirmBtnDisplay] = useState(false)

  function changeNewProjectValue(e) {
    const newValue = e.target.value
    if (newValue.slice(-1) === '€') {
      newValue.slice(0, -1).replace(",", ".") === selectedLead.projectValue.replace(",", ".") ? setConfirmBtnDisplay(false) : setConfirmBtnDisplay(true)
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
      showAllLeadCommentsData(leadId)
      sortComments()
  }
  fetchLeadData()
  }, [updateState]) 

  async function refreshPage() {
    async function fetchLeadData() {
      const snapshot = await get(ref(database, `leadsItems/${leadId}`))
      const data = await snapshot.val()
      setSelectedLead(data)
    }
    await fetchLeadData()
    selectedLead && setUpdateState(prevData => !prevData)
  }

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
      setModalData(prevData => {
        return {
          ...prevData,
          isActive: true,
          modalType: "error",
          messageTitle: "Incorrect value!",
          messageText: "Please enter correct value.",
        }
      })
    }
  }

  function sortComments() {
    const sortedLeadComments = allLeadCommentsData && allLeadCommentsData.sort((a, b) => {
      if (!areCommentsSorted) {
        if (b[1].dateCreated > b[1].dateCreated) {
            return 1
        } else {
            return -1
        }
      } else {
        if (b[1].dateCreated > a[1].dateCreated) {
            return 1
        } else {
            return -1
        }
      }
    })
    setAreCommentsSorted(prevData => !prevData)
    setAllLeadCommentsData(sortedLeadComments)
  }

  const leadCommentsArr = allLeadCommentsData && allLeadCommentsData.map(item => {
    return (
      <LeadComment 
        key = {item["0"]}
        id={item["0"]}
        dateCreated={item["1"].dateCreated}
        comment={item["1"].comment}
        refreshPage={refreshPage}
        />
    )
  })



  if (selectedClient, selectedLead, selectedClient) {
    return (
      <div className='client__container'>
    
        <div className='details__content-container' id='lead-details__content-container'>
          
          <div className='info-container details__content-grid-element'>
            <div className='info-container-top'>
              {/* "absolute" container to fix position of icon */}
              <GoBack />
              <div className='details__info-container-top-data'>
                <h4 id='lead__title'>
                  {selectedLead.projectTitle}
                  <AiTwotoneEdit className='icon-btn anim-shake' id='lead__title-edit-icon'
                  onClick={() => setModalData(prevData => {
                    //open new modal with new properties
                    return {
                      ...prevData,
                      isActive: true,
                      modalType: "update",
                      messageTitle: "Enter new lead title",
                      elementId: leadId,
                      value: selectedLead.projectTitle,
                      refreshPage: refreshPage,
                      handleFunction: changeLeadTitle
                    }
                  }
                  )}
                  />
                </h4>
                <p id='client__name'>{`${capitalizeFirstLetter(selectedClient.title)}
                  ${capitalizeFirstLetter(selectedClient.firstName)}
                  ${capitalizeFirstLetter(selectedClient.lastName)}`}
                </p>
                <p id='client__company-name'>{selectedCompany.companyName.toUpperCase()}</p>
                <a href={`mailto: ${selectedClient.email}`} id='client__email'>{selectedClient.email}</a> 
                <p id='client__phone-number'>{selectedClient && formatPhoneNumber(selectedClient.phoneNumber)}</p>
              </div>
            </div>
    
            <div className='data__container grid-2x-1fr'>

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
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
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
                  <div>
                    {confirmBtnDisplay ? <GiConfirmed onClick={() => updateValueData(leadId, changeProjectValue, newProjectValue)} /> : ""}
                    {confirmBtnDisplay ? <GrPowerReset onClick={() => setConfirmBtnDisplay(prevData => {
                      // disable confirm and reset button
                      // and re-render view to hide them
                      setUpdateState(prevData => !prevData)
                      return (
                      !prevData)
                      })} /> : ""}
                  </div>
                  
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
          <div id='comment__container-btns'>
            {<RiAddBoxFill 
            className='icon-btn anim-shake'
            id='comment__container-add-icon'
            onClick={() => setModalData(prevData => {
              //open new modal with new properties
              return {
                ...prevData,
                isActive: true,
                modalType: "add",
                messageTitle: "Enter new comment",
                elementId: leadId,
                value: "",
                refreshPage: refreshPage,
                handleFunction: addLeadComment
              };
            })}/>}
            {!areCommentsSorted && 
            <BsSortDownAlt 
              onClick={sortComments} 
              className='anim-shake'/>}
            {areCommentsSorted && 
            <BsSortUpAlt
              className='anim-shake'
              onClick={sortComments} />}
          </div>
          <div>
            {leadCommentsArr}
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
              elementId: leadId,
              value: "",
              refreshPage: refreshPage,
              handleFunction: addTask
            }
          }
          )}>Add task</button>
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
          leadId={leadId}
          clientId=""
          />}
      </div>
      )
  }
  
}

export default Lead