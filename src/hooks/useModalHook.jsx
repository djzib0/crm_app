import React, { useState } from 'react'
import useDatabaseHook from './useDatabaseHook'


function useModalHook() {
    const {
        changeLeadTitle,
    } = useDatabaseHook()
    
    const [modalEditValue, setModalEditValue] = useState({
        isActive: false,
        messageTitle: "",
        messageText: "",
        newValue: "",
    })
    
    
    function handleEditValueModal(leadId, newValue) {
        changeLeadTitle(leadId, newValue)
        closeEditValueModal()
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

    function closeEditValueModal() {
        setModalEditValue(prevData => {
            return {
                isActive: false,
                messageTitle: "",
                messageText: "",
                newValue: "",
            }
        })
    }


    return {
        modalEditValue,
        setModalEditValue,
        handleEditValueModal,
        closeEditValueModal,
        showEditValueModal
    }
}



export default useModalHook