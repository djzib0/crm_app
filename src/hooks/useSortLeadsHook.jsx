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


    function toggleSort(propertyName) {
        // check object has property named propertyName
        if (propertyName in sortData) {
            // if yes, set property value to reverse false or true
            setSortData(prevData => {
                return {
                    ...prevData,
                    [propertyName]: !prevData[propertyName]
                }
            })
        }
        console.log(sortData.sortByTitle)
    }



    
    return {
        sortData,
        toggleSort,
    }
}

export default useSortLeadsHook