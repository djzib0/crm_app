import React, { useState } from 'react'
import useDatabaseHook from './useDatabaseHook'


function useModalHook() {
    const {
        changeLeadTitle,
    } = useDatabaseHook()

    const [modalData, setModalData] = useState({
        isActive: false,
        modalType: "",
        messageTitle: "",
        messageText: "",
        elementId: "",
        newValue: "",
        handleFunction: ""
    })


    const [modalEditValue, setModalEditValue] = useState({
        isActive: false,
        messageTitle: "",
        messageText: "",
        value: "",
    })

    const [modalAddComment, setModalAddComment] = useState({
        isActive: false,
        messageTitle: "",
        messageText: "",
        comment: "",
    })

    function closeModal() {
        resetModal()
    }

    function openModal() {
        setModalData(prevData => {
            return {
                ...prevData,
                isActive: true,
            }
        })
    }

    function resetModal() {
        setModalData(prevData => {
            return {
                isActive: false,
                modalType: "",
                messageTitle: "",
                messageText: "",
                handleFunction: "",
                elementId: "",
                value: "",
            }
        })
    }
    
    // below function to be deleted?
    function handleEditValueModal(leadId, newValue) {
        changeLeadTitle(leadId, newValue)
        closeModal()
    }

    function showEditValueModal(title, message) {
        setModalEditValue(prevData => {
            return {
                ...prevData,
                isActive: true,
                messageTitle: title,
                messageText: message,
            }
        })
    }

    function showAddCommentModal(title, message) {
        setModalAddComment(prevData => {
            return {
                ...prevData,
                isActive: true,
                messageTitle: "",
                messageText: "",
                comment: "",
            }
        })
    }


    function closeEditValueModal() {
        setModalEditValue(prevData => {
            return {
                isActive: false,
                messageTitle: "",
                messageText: "",
                newValue: "",
            }
        })
        setModalAddComment(prevData => {
            return {
                isActive: false,
                messageTitle: "",
                messageText: "",
                comment: "",
            }
        })
    }


    return {
        // modalEditValue,
        // modalAddComment,
        // setModalEditValue,
        // handleEditValueModal,
        // handleAddCommentModal,
        // closeEditValueModal,
        // showEditValueModal,
        // showAddCommentModal
        modalData,
        setModalData,
        closeModal,
        openModal,
        resetModal
    }
}



export default useModalHook