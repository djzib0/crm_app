import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useDatabaseHook from '../hooks/useDatabaseHook'

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

function LeadForm() {

  const { addLead } = useDatabaseHook()

  const {clientId} = useParams()

  const [companyId, setCompanyId] = useState()

  const [formData, setFormData] = useState({
    projectTitle: "",
    clientProjectNumber: "",
    projectValue: "",
    nextContactDate: "",
    projectPotential: "medium"
  })

  useEffect(() => {
    // if clientID means that we add new client and we want
    // to get client's companyId and pass it to database item
    if (clientId) {
      //find item in database
      async function fetchData() {
        const exactItem = `peopleItems/${clientId}`
        const snapshot = await get(ref(database, exactItem))
        const data = await snapshot.val()
        setCompanyId(data.companyId)
      }
      fetchData()
    }
  }, [])

  function handleChange(e) {
    const {name, value} = e.target
    setFormData(prevData => {
      return {
        ...prevData,
        [name]: value
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // destructuring formData
    const {
      projectTitle,
      clientProjectNumber,
      projectValue,
      nextContactDate,
      projectPotential
    } = formData

    addLead(
      clientId,
      companyId,
      projectTitle,
      clientProjectNumber,
      projectValue,
      nextContactDate,
      projectPotential,
    )
  }




  return (
    <div>
        <form onSubmit={handleSubmit}>
        <div className='form-group'>
					<label htmlFor='project-title'>Title</label>
					<input type='text' 
								name='projectTitle'
								id='project-title'
								placeholder='Project title'
                // add below global "value" from Redux
                // to be possible to change in "settings"
                maxLength={40}
								value={formData.projectTitle}
								onChange={handleChange}
								required
								/>
				</div>

        <div className='form-group'>
					<label htmlFor='client-project-number'>Client's project number</label>
					<input type='text' 
								name='clientProjectNumber'
								id='client-project-number'
								placeholder="Client's Number"
                maxLength={40}
								value={formData.clientProjectNumber}
								onChange={handleChange}
								/>
				</div>

        <div className='form-group'>
					<label htmlFor='project-value'>Value</label>
					<input type='number' 
								name='projectValue'
								id='project-value'
								placeholder='Project value'
								value={formData.projectValue}
								onChange={handleChange}
								/>
				</div>

        <div className='form-group'>
					<label htmlFor='next-contact-date'>Next contact date</label>
					<input type='date' 
								name='nextContactDate'
								id='next-contact-date'
								value={formData.nextContactDate}
								onChange={handleChange}
								required
								/>
				</div>
        
        <div className='form-group'>
					<label htmlFor='project-potential'>Potential</label>
					<select name='projectPotential'
									id='project-potential'
									value={formData.projectPotential}
									onChange={handleChange}
									>
							<option value='low'>Low</option>
							<option value='medium'>Medium</option>
							<option value='high'>High</option>
					</select>
				</div>
        {companyId && <button type='submit'>Add</button>}
        </form>
    </div>
  )
}

export default LeadForm