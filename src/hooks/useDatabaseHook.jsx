import React, { useEffect, useState } from 'react'
import { Link, Routes, Route} from 'react-router-dom'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, set } from 'firebase/database'
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
const clientsInDB = ref(database, "companiesItems/peopleItems")


function useDatabaseHook() {

    const [companyCounter, setCompanyCounter] = useState(1)
    const [allCompanies, setAllCompanies] = useState()

    useEffect(() => {
      return showAllCompanies()
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

    function addClient() {
      push(clientsInDB, {
        name: "Artur",
        lastName: "Król",
        email: "test@testmail.com"
      } )
    }

    function updateClient() {
      let exactItem = `companiesItems/peopleItems/-NTe3Lnn6ArpjsAA4YYo`
      set(ref(database, exactItem), {
        name: "Arturino1",
        lastName: "Królik",
        email: "test1@testmail.com"
      })
    }

    function showAllCompanies() {
      onValue(companiesInDB, function(snapshot) {
        let companiesArr = Object.entries(snapshot.val()).map(item => {
          return (
            <Link to={`/company/${item[1].companyName}`} key={item}>
              <p>
                {item[1].companyName}
              </p>
            </Link> 
          )
        })
        setAllCompanies(companiesArr)
      })
    }

    return {
      companyCounter, 
      addCompany, 
      addClient, 
      updateClient, 
      allCompanies}

}

export default useDatabaseHook

  

