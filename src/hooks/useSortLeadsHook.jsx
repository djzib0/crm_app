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
        console.log(arr, "arr in sortlist")
        console.log(sortPropertyName, "sortproperty name")
        console.log(propertyName, "PropertyName")
        // map new array with projectValue converted to a Number
        const arrWithNumbers = arr.map(item => {
            return {
                ...item,
                1: {...item[1], projectValue: Number(item[1].projectValue)}
            }
        })

        if (propertyName != "projectValue") {
            const sortedLeads = arrWithNumbers.sort((a, b) => {
                try {
                    if (sortData[sortPropertyName]) {
                        console.log
                        if (a["1"][propertyName].toLowerCase() > b["1"][propertyName].toLowerCase()) {
                            return 1
                        } else {
                            return -1
                        }
                    } else {
                        if (a["1"][propertyName].toLowerCase() < b["1"][propertyName].toLowerCase()) {
                            return 1
                        } else {
                            return -1
                        }
                    } 
                } 
                // handling properties which returns true or false
                // on which you can't use toUpperCase()
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
        // if propertyName === projectValue then sort as numbers
        } else {
            let sortedLeads = {}
            if (sortData[sortPropertyName]) {
                sortedLeads = arrWithNumbers.sort((a, b) => (a["1"]["projectValue"] - b["1"]["projectValue"]))
            } else {
                sortedLeads = arrWithNumbers.sort((a, b) => (b["1"]["projectValue"] - a["1"]["projectValue"]))
            }
            return sortedLeads
        }
    }

    return {
        sortData,
        toggleSort,
        sortList
    }
}

export default useSortLeadsHook