import React, { useState, useEffect } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import { useParams, useNavigate } from 'react-router-dom'

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
const companiesInDB = ref(database, "companiesItems")
const clientsInDB = ref(database, "companiesItems/peopleItems")

export default function ClientForm(props) {

	const {addClient, updateClient} = useDatabaseHook()

	const {companyId} = useParams()
	const {clientId} = useParams()

	const navigation = useNavigate()


	const [formData, setFormData] = useState({
		companyId: companyId, // foreign key - client can work in one company
		title: "mr",
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		lastContactDate: "",
		nextContactDate: "",
		isContactDateExceeded: false,
	})

		// if there is an clientId from useParams() it means that the user
		// wants to update the client's data
		// it has to be found in database and set form with data
		useEffect(() => {
			if (clientId) {
					//find item in database
					async function fetchData() {
							const snapshot = await get(ref(database, `peopleItems/${clientId}`))
							const data = await snapshot.val()
							console.log(data, 'w companyForm')
							// set form with fetched company data
							setFormData(prevData => {
									return (
											{
													...prevData,
													title: data.title,
													firstName: data.firstName,
													lastName: data.lastName,
													email: data.email,
													phoneNumber: data.phoneNumber
											}
									)
							})
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
		const {companyId,
					 title,
					 firstName,
					 lastName,
					 email,
					 phoneNumber,
					 lastContactDate,
					 nextContactDate,
					 isContactDateExceeded
		} = formData

		// invokes function addClient from useDatabaseHook.jsx
		// and adds new client data to database only if there is no clientId
		// if there is an id it means that the user wants to edit chosen client data
		if (clientId) {
				updateClient(
					clientId,
					title,
					firstName,
					lastName,
					email,
					phoneNumber
				)
				navigation(`/client/${clientId}`)
		} else {
				addClient(
					companyId,
					title,
					firstName,
					lastName,
					email,
					phoneNumber,
					lastContactDate,
					nextContactDate,
					isContactDateExceeded
				)
				navigation('/companies')
		}
		

		// reset form
		setFormData({
				companyId: "", // foreign key - client can work in one company
				title: "mr",
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				lastContactDate: "",
				nextContactDate: "",
				isContactDateExceeded: false,
			})
	}


	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label htmlFor='title'>Title</label>
					<select name='title'
									id='title'
									// placeholder='title'
									value={formData.title}
									onChange={handleChange}
									>
							<option value='mr'>Mr.</option>
							<option value='mrs'>Mrs.</option>
					</select>
				</div>
				<div className='form-group'>
					<label htmlFor='first-name'>First Name</label>
					<input type='text' 
								name='firstName'
								id='first-name'
								placeholder='First Name'
								value={formData.firstName}
								onChange={handleChange}
								required
								/>
				</div>
				<div className='form-group'>
					<label htmlFor='last-name'>Last Name</label>
					<input type='text' 
								name='lastName'
								id='last-name'
								placeholder='Last Name'
								value={formData.lastName}
								onChange={handleChange}
								required
								/>
				</div>
				<div className='form-group'>
					<label htmlFor='email'>E-mail</label>
					<input type='email' 
								name='email'
								id='email'
								value={formData.email}
								onChange={handleChange}
								/>
				</div>
				<div className='form-group'>
					<label htmlFor='phone-number'>Phone Number</label>
					<input type='tel' 
								name='phoneNumber'
								id='phone-number'
								value={formData.phoneNumber}
								onChange={handleChange}
								/>
				</div>
				<button className="btn submit-btn">Submit</button>
			</form>
		</div>
	)
}
