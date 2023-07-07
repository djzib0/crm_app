import React, { useState } from 'react'
import './leadComment.css'

//import utils

function LeadComment(props) {

  const [showAll, setShowAll] = useState(false)
  
  function handleClickShowAll() {
    setShowAll(prevData => !showAll)
  }

  // format comment longer than given length
  function formatComment(comment, length) {
    if (comment.length > length) {
      return comment.slice(0, length) + "..."
    } else {
      return comment
    }
  }

  console.log(props.comment.length, props.comment)

  if (props.comment) {
    return (
      <div className='comment__container'>
        <div className='comment__container-top'>
          <p className='comment__container-date'>{props.dateCreated}</p>
        </div>
        <div className='comment__container-bottom'>
          <p>{!showAll ? formatComment(props.comment, 50) : props.comment}</p>
          {!showAll && props.comment.length > 50 && <p onClick={handleClickShowAll}>show more</p>}
          {showAll && props.comment.length > 50 && <p onClick={handleClickShowAll}>show less</p>}
        </div>
      </div>
    )
  }

}

export default LeadComment