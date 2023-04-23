import React, { useState } from "react";
import useDatabaseHook from "../hooks/useDatabaseHook";

import "./companyForm.css"

function CompanyForm(props) {

    // form state
    const [formData, setFormData]= useState({
        companyName: "",
        companyAddressStreet: "",
        companyAddressBuildingNumber: "",
        companyAddressZipCode: "",
        companyAddressCity: "",
    })

    // custom hook database state
    const {addCompany} = useDatabaseHook()

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

        addCompany(
            companyName,
            companyAddressStreet,
            companyAddressBuildingNumber,
            companyAddressZipCode,
            companyAddressCity
            )
        
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
