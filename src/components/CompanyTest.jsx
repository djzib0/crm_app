import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import useDatabaseHook from '../hooks/useDatabaseHook'

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
const clientsInDB = ref(database, "companiesItems/peopleItems")


function CompanyTest() {

    const {id} = useParams()

    const [selectedCompany, setSelectedCompany] = useState()
    
    
    useEffect(() => {
        async function fetchData() {
            const snapshot = await get(ref(database, `companiesItems/${id}`))
            const data = await snapshot.val()
            console.log(data)
            // const {companyAddressStreet} = data
            setSelectedCompany(data)
        }
        fetchData()
    }, [])

    let companyAddressStreet
    let companyAddressBuildingNumber
    let companyName
    let companyAddressCity

    if (selectedCompany) {
        companyName = selectedCompany.companyName
        companyAddressStreet = selectedCompany.companyAddressStreet
        companyAddressBuildingNumber = selectedCompany.companyAddressBuildingNumber
        companyAddressCity = selectedCompany.companyAddressCity
    }

    return (
        <div>
            {selectedCompany && companyName} {selectedCompany && companyAddressStreet} {selectedCompany && companyAddressBuildingNumber} {selectedCompany && companyAddressCity}
        </div>
    )
}

export default CompanyTest