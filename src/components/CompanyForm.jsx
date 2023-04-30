import React, { useEffect, useState } from "react";
import useDatabaseHook from "../hooks/useDatabaseHook";
import { useParams } from "react-router-dom";

import "./companyForm.css"

// Import the functions you need from the SDKs you need
import { initializeApp, setLogLevel } from "firebase/app";
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
const companiesInDB = ref(database, "companiesItems")
const clientsInDB = ref(database, "companiesItems/peopleItems")



function CompanyForm(props) {

    const {companyId} = useParams()

    // form state
    const [formData, setFormData] = useState({
        companyName: "",
        companyAddressStreet: "",
        companyAddressBuildingNumber: "",
        companyAddressZipCode: "",
        companyAddressCity: "",
    })

    // custom hook database state
    const {addCompany, updateCompany} = useDatabaseHook()

    // if there is an companyId from useParams() it means that the user
    // wants to update the company data
    // it has to be found in database and set form with data

    useEffect(() => {
        if (companyId) {
            //find item in database
            async function fetchData() {
                const snapshot = await get(ref(database, `companiesItems/${companyId}`))
                const data = await snapshot.val()
                console.log(data, 'w companyForm')
                // set form with fetched company data
                setFormData(prevData => {
                    return (
                        {
                            companyName: data.companyName,
                            companyAddressStreet: data.companyAddressStreet,
                            companyAddressBuildingNumber: data.companyAddressBuildingNumber,
                            companyAddressZipCode: data.companyAddressZipCode,
                            companyAddressCity: data.companyAddressCity, 
                        }
                    )
                })
            }
            fetchData()
        }
    }, [])

    // form functions
    function handleFormChange(e) {
        const {name, value} = e.target
        setFormData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }

    function handleFormSubmit(e) {
        e.preventDefault()
        console.log("submituję formularz")

        //destructuring formData
        const {
            companyName, 
            companyAddressStreet,
            companyAddressBuildingNumber,
            companyAddressZipCode,
            companyAddressCity
        } = formData

        // invokes function addCompany from useDatabaseHook.jsx
        // and adds new company data to database only if there is no id
        // if there is an id it means that the user wants to edit chosen company data
        if (companyId) {
            updateCompany(
                companyId,
                companyName,
                companyAddressStreet,
                companyAddressBuildingNumber,
                companyAddressZipCode,
                companyAddressCity
            )
        } else {
            addCompany(
                companyName,
                companyAddressStreet,
                companyAddressBuildingNumber,
                companyAddressZipCode,
                companyAddressCity
                )
        }
 
        // reset form
        setFormData({
            companyName: "",
            companyAddressStreet: "",
            companyAddressBuildingNumber: "",
            companyAddressZipCode: "",
            companyAddressCity: "",
        })
    }

    return (
        <section>
            {companyId && <p>This is ID {companyId}</p>}
            <form onSubmit={handleFormSubmit}>
                <input type="text" 
                       name="companyName"
                       value={formData.companyName}
                       placeholder="Company name"
                       onChange={handleFormChange}
                       className="input-field"
                       required />
                <input type="text" 
                       name="companyAddressStreet"
                       value={formData.companyAddressStreet}
                       placeholder="Street"
                       onChange={handleFormChange}
                       className="input-field" />
                <input type="text" 
                       name="companyAddressBuildingNumber"
                       value={formData.companyAddressBuildingNumber}
                       placeholder="Building number"
                       onChange={handleFormChange}
                       className="input-field" />
                <input type="text" 
                       name="companyAddressZipCode"
                       value={formData.companyAddressZipCode}
                       placeholder="Zip code"
                       onChange={handleFormChange}
                       className="input-field" />
                                <input type="text" 
                       name="companyAddressCity"
                       value={formData.companyAddressCity}
                       placeholder="City"
                       onChange={handleFormChange}
                       className="input-field" />
                <button className="btn submit-btn">Submit</button>
            </form>
        </section>
    )
}

export default CompanyForm
