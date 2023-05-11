import React from 'react'

import { Link } from 'react-router-dom'

// importing styles
import './menu.css'

//importing icons from react-icons
import {MdFactory} from 'react-icons/md'
import {MdPerson} from 'react-icons/md'
import {MdListAlt} from 'react-icons/md'

export default function Menu() {
  return (
    <div className='menu-container'>
        <Link to='/companies' 
              className='menu-element-container companies'>
            <p className='menu-element-description'>Companies</p>
            <MdFactory className='menu-element-bg-icon'/>
        </Link>
        <Link to='/clients' 
              className='menu-element-container clients'>
            <p className='menu-element-description '>Clients</p>
            <MdPerson className='menu-element-bg-icon'/>
        </Link>
        <Link className='menu-element-container projects'>
            <p className='menu-element-description '>Projects</p>
            <MdListAlt className='menu-element-bg-icon'/>
        </Link>
    </div>
  )
}
