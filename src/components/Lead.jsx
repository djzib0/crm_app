import React from 'react'
import { useParams } from 'react-router-dom'

function Lead() {

  const { leadId } = useParams()
  return (
    <div>Lead with id {leadId}</div>
  )
}

export default Lead