import React from 'react'
import { useParams } from 'react-router-dom'

function Lead() {

  const { leadId } = useParams()

  const [formData, setFormData] = useState({

  })
  
  return (
    <div>Lead with id {leadId}</div>
  )
}

export default Lead