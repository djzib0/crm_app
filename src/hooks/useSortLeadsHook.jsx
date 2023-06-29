import React, { useEffect, useState } from 'react'

function useSortLeadsHook() {
    
    const [sortData, setSortData] = useState({
        // if false sort from Z to A, and from lowest to highest
        // if true sort from A to Z, and from highest to lowest
        sortByTitle: false,
        sortByClient: false,
        sortByCompany: false,
        sortByClientProjectNumber: false,
        sortByValue: false,
        sortByDateCreated: false,
        sortByNextContactDate: false,
        sortBySold: false,
        sortByStatus: false,
        sortByPotential: false,
    })


    // function toggleSort(propertyName) {
    //     // check object has property named propertyName
    //     console.log(sortData)
    //     for (const key of Object.keys(sortData)) {
    //         console.log(key)
    //     }
    //     if (propertyName in sortData) {
    //         // if yes, set property value to reverse false or true
    //         setSortData(prevData => {
    //             return {
    //                 ...prevData,
    //                 [propertyName]: !prevData[propertyName]
    //             }
    //         })
    //     }
    //     console.log(sortData.sortByTitle)
    // }

    function toggleSort(sortPropertyName) {
        Object.keys(sortData).forEach(key => {
            setSortData(prevData => {
                if (key === sortPropertyName) {

                    return {
                        ...prevData,
                        [key]: !prevData[sortPropertyName]
                    }
                } else {
                    console.log(key, "vs", sortPropertyName )
                    return {
                        ...prevData,
                        [key]: false
                    }
                }
            })
        })
    }


    function sortList(arr, sortPropertyName, propertyName) {
        const sortedLeads = arr.sort((a, b) => {
            try {
                if (sortData[sortPropertyName]) {
                    if (a[1][propertyName].toLowerCase() > b[1][propertyName].toLowerCase()) {
                        return 1
                    } else {
                        return -1
                    }
                } else {
                    if (a[1][propertyName].toLowerCase() < b[1][propertyName].toLowerCase()) {
                        return 1
                    } else {
                        return -1
                    }
                } 
            } 
            catch {
                if (sortData[sortPropertyName]) {
                    if (a[1][propertyName] > b[1][propertyName]) {
                        return 1
                    } else {
                        return -1
                    }
                } else {
                    if (a[1][propertyName] < b[1][propertyName]) {
                        return 1
                    } else {
                        return -1
                    }
                } 
            }
            
        })
        return sortedLeads
    }



    
    return {
        sortData,
        toggleSort,
        sortList
    }
}

export default useSortLeadsHook