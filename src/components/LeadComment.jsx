import React, { useState } from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'
import useModalHook from '../hooks/useModalHook'
import Modal from './Modal'
import './leadComment.css'

//import icons
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { AiTwotoneEdit } from 'react-icons/ai'

function LeadComment(props) {

  const {
    editLeadComment,
    deleteLeadComment,
  } = useDatabaseHook()

  const {
    modalData,
    setModalData,
    openModal,
    closeModal,
    resetModal,
  } = useModalHook()


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
          <div className='comment__container-top-btns'>
            <AiTwotoneEdit 
            className='anim-shake'
            onClick={() => setModalData(prevData => {
              return {
                ...prevData,
                isActive: true,
                modalType: "add",
                messageTitle: "Edit your comment",
                elementId: props.id,
                value: props.comment,
                refreshPage: props.refreshPage,
                handleFunction: editLeadComment
              }
            })}/>
            <RiDeleteBin6Fill 
            className='anim-shake'
            onClick={() => setModalData(prevData => {
              return {
                ...prevData,
                isActive: true,
                modalType: "delete",
                messageTitle: "Do you want to delete this comment?",
                elementId: props.id,
                value: "",
                refreshPage: props.refreshPage,
                handleFunction: deleteLeadComment
              }
            })}/>
          </div>
          
        </div>
        <div className='comment__container-bottom'>
          <p>{!showAll ? formatComment(props.comment, 50) : props.comment}
          {!showAll && props.comment.length > 50 && <span onClick={handleClickShowAll}>show more</span>}
          {showAll && <span onClick={handleClickShowAll}>show less</span>}
          </p>
        </div>
        {modalData.isActive && 
        <Modal
          isActive={modalData.isActive}
          modalType={modalData.modalType}
          messageTitle={modalData.messageTitle}
          messageText={modalData.messageText}
          handleFunction={modalData.handleFunction}
          elementId={modalData.elementId}
          value={modalData.value}
          refreshPage={props.refreshPage}
          onClose={closeModal}/>}
      </div>
      
    )
  }

}

export default LeadComment