import React, { useEffect, useState } from 'react'
import { Link, Routes, Route} from 'react-router-dom'

// utilities import
import { getToday } from '../components/utils/utils';


// Import the functions you need from the SDKs you need
import { initializeApp, setLogLevel } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, set, get, update } from 'firebase/database'
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
const companiesInDB = ref(database, "companiesItems")
const clientsInDB = ref(database, "peopleItems")
const leadsInDB = ref(database, "leadsItems")


function useDatabaseHook() {

    const [allCompaniesData, setAllCompaniesData] = useState()
    const [allClientsData, setAllClientsData] = useState()
    const [allLeadsData, setAllLeadsData] = useState()
   
    useEffect(() => {
      function fetchData() {
        const data = showAllCompaniesData()
      }

      function fetchClientsData() {
        const data = showAllClientsData()
      }

      function fetchLeadsData() {
        const data = showAllLeadsData()
      }

    fetchData()
    fetchClientsData()
    fetchLeadsData()
    }, [])

    function addCompany(name, street, buildingNumber, zipCode, city) {
        push(companiesInDB, {
          companyName: name,
          companyAddressStreet: street,
          companyAddressBuildingNumber: buildingNumber,
          companyAddressZipCode: zipCode,
          companyAddressCity: city,
        })
    }

    function updateCompany(id, name, street, buildingNumber, zipCode, city) {
      console.log("The company", id,  "has been updated")
      let exactItem = `companiesItems/${id}`
      update(ref(database, exactItem), {
        companyName: name,
        companyAddressStreet: street,
        companyAddressBuildingNumber: buildingNumber,
        companyAddressZipCode: zipCode,
        companyAddressCity: city,
      })
    }

    function addClient(
      companyId,
      title,
      firstName,
      lastName,
      email,
      phoneNumber,
      lastContactDate,
      nextContactDate,
    ) {
      push(clientsInDB, {
        companyId: companyId,
        title: title,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        lastContactDate: lastContactDate,
        nextContactDate: nextContactDate,
      } )
    }

    function updateClient(clientId,
                          title, 
                          firstName,
                          lastName,
                          email,
                          phoneNumber,
                          ) {
      console.log("the client", clientId, "has been updated")
      const exactItem = `peopleItems/${clientId}`
      update(ref(database, exactItem), {
        
        title: title,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber
      })
    }

    function addLead(
        clientId,
        companyId,
        projectTitle,
        clientProjectNumber,
        projectValue,
        nextContactDate,
        projectPotential
      ) {
      
      push (leadsInDB, {
        clientId: clientId,
        companyId: companyId,
        projectTitle: projectTitle,
        clientProjectNumber: clientProjectNumber,
        projectValue: projectValue,
        dateCreated: getToday(),
        nextContactDate: nextContactDate,
        // nextContactDate: 'default now + 14 days (from settings? REDUX)',
        projectPotential: Number(projectPotential),
        isSold: false,
        isClosed: false,
      })
    }

    async function changeLeadTitle(leadId, newTitle) {
      const exactItem = `leadsItems/${leadId}`
      const snapshot = await get(ref(database, exactItem))
      const data = await snapshot.val()
      update(ref(database, exactItem), {
        projectTitle: newTitle
      })
    }

    async function changeIsClosed(leadId) {
      const exactItem = `leadsItems/${leadId}`
      const snapshot =  await get(ref(database, exactItem))
      const data = await snapshot.val()
      const prevData = data.isClosed
      update(ref(database, exactItem), {
        isClosed: !prevData
      })
    }

    async function changeIsSold(leadId) {
      const exactItem = `leadsItems/${leadId}`
      const snapshot =  await get(ref(database, exactItem))
      const data = await snapshot.val()
      const prevData = data.isSold
      update(ref(database, exactItem), {
        isSold: !prevData
      })
    }

    async function changePotential(leadId, potential) {
      const exactItem = `leadsItems/${leadId}`
      const snapshot =  await get(ref(database, exactItem))
      const data = await snapshot.val()
      update(ref(database, exactItem), {
        projectPotential: Number(potential)
      })
    }

    async function changeNextContactDate(leadId, newDate) {
      // checks the newDate is defined and not null
      // otherwise it won't update
      if (newDate) {
        const exactItem = `leadsItems/${leadId}`
        const snapshot =  await get(ref(database, exactItem))
        const data = await snapshot.val()
         update(ref(database, exactItem), {
          nextContactDate: newDate
        })
      }
    }

    async function changeProjectValue(leadId, newValue) {
      console.log("dają do zmiany newValue", newValue)
      if (newValue) {
        const exactItem = `leadsItems/${leadId}`
        const snapshot =  await get(ref(database, exactItem))
        const data = await snapshot.val()
         update(ref(database, exactItem), {
          projectValue: parseFloat(newValue.replace(",", ".")).toFixed(2)
        })
      }
    }


    async function showAllCompaniesData() {
      onValue(companiesInDB, function(snapshot) {
        let companiesArr = Object.entries(snapshot.val()).map(item => {
          return (
            {
              ...item
            }
          )
        
        })
        setAllCompaniesData(companiesArr)
      }, {onlyOnce: true})
    }

    async function showAllClientsData() {
      onValue(clientsInDB, function(snapshot) {
        let clientsArr = Object.entries(snapshot.val()).map(item => {
          return (
            {
              ...item
            }
          )
        
        })
        setAllClientsData(clientsArr)
      }, {onlyOnce: true})
    }

    async function showAllLeadsData() {
      onValue(leadsInDB, function(snapshot) {
        let leadsArr = Object.entries(snapshot.val()).map(item => {
          return (
            {
              ...item
            }
          )
        
        })
        setAllLeadsData(leadsArr)
      }, {onlyOnce: true})
    }

    return {
      addCompany, 
      updateCompany,
      addClient,
      updateClient,
      addLead,
      allClientsData, 
      allCompaniesData,
      allLeadsData,
      database,
      clientsInDB,
      // CRUD - Leads
      changeLeadTitle,
      changeIsClosed,
      changeIsSold,
      changePotential,
      changeNextContactDate,
      changeProjectValue,
    }
}

export default useDatabaseHook

  

