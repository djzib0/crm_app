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

  if (props.comment) {
    return (
      <div className='comment__container'>
        <div className='comment__container-top'>
          <p className='comment__container-date'>{props.dateCreated}</p>
        </div>
        <div className='comment__container-bottom'>
          <p>{!showAll ? formatComment(props.comment, 50) : props.comment}
          {!showAll && props.comment.length > 50 && <span onClick={handleClickShowAll}>show more</span>}
          {showAll && <span onClick={handleClickShowAll}>show less</span>}
          </p>
        </div>
      </div>
    )
  }

}

export default LeadComment