import React from 'react'
import useDatabaseHook from '../hooks/useDatabaseHook'

function Home() {

  const {
    allCompaniesData,
    allClientsData,
    allLeadsData
  } = useDatabaseHook()

  function countAllLeads(leadsArr) {
    return leadsArr.length
  }

  function countSoldLeads(leadsArr) {
    const newArr = leadsArr.filter(item => {
      return item[1].isSold
    })
    return newArr.length
  }

  //move to utils
  function countPercentage(number1, number2) {
    return (number1 / number2 * 100).toFixed(0)
  }

  const countedLeads = allLeadsData && countAllLeads(allLeadsData)
  const countedSoldLeads = allLeadsData && countSoldLeads(allLeadsData)
  const countedSoldPercentage = countPercentage(countedSoldLeads, countedLeads)

  return (
    <div className=''>
      <p>All leads {countedLeads}</p>
      <p>Sold leads {countedSoldLeads}</p>
      <p>Sold percentage {countedSoldPercentage}%</p>
    </div>
  )
}

export default Home