import React from 'react'

import { Link } from 'react-router-dom'

// importing styles
import './menu.css'

//importing icons from react-icons
import {MdFactory} from 'react-icons/md'
import {MdPerson} from 'react-icons/md'
import {MdListAlt} from 'react-icons/md'
import {MdHome} from 'react-icons/md'

export default function Menu() {
  return (
    <div className='menu-container'>
      <Link to='/' 
              className='menu-element-container home'>
            <p className='menu-element-description'>Home</p>
            <MdHome className='menu-element-bg-icon'/>
        </Link>
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
        <Link to='/leads'
              className='menu-element-container projects'>
            <p className='menu-element-description '>Leads</p>
            <MdListAlt className='menu-element-bg-icon'/>
        </Link>
    </div>
  )
}
