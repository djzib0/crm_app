import React, { useEffect, useState } from 'react'
import { Link, Routes, Route} from 'react-router-dom'


// Import the functions you need from the SDKs you need
import { initializeApp, setLogLevel } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, set, get } from 'firebase/database'
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


function useDatabaseHook() {

    const [allCompaniesData, setAllCompaniesData] = useState()
    const [allClientsData, setAllClientsData] = useState()
    const [clientsData, setClientsData] = useState()
   
    useEffect(() => {
      function fetchData() {
        const data = showAllCompaniesData()
      }

      function fetchClientsData() {
        const data = showAllClientsData()
      }

    fetchData()
    fetchClientsData()
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

 

    function updateCompany(id, name, street, buildingNumber, zipCode, city) {
      console.log("The client", id,  "has been updated")
      let exactItem = `companiesItems/${id}`
      set(ref(database, exactItem), {
        companyName: name,
        companyAddressStreet: street,
        companyAddressBuildingNumber: buildingNumber,
        companyAddressZipCode: zipCode,
        companyAddressCity: city,
      })
    }

    function fillCompanyFormToUpdate(id, name, street, buildingNumber, zipCode, city) {
      console.log(id, name, street, buildingNumber, zipCode, city)
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

    console.log(allClientsData)
    console.log(allCompaniesData)
 
    return {
      addCompany, 
      addClient,
      allClientsData, 
      updateCompany, 
      allCompaniesData,
      setAllCompaniesData,
      fillCompanyFormToUpdate,
      showAllCompaniesData,
    }

}

export default useDatabaseHook

  

