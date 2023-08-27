// capitalize first letter
export function capitalizeFirstLetter(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}

// format phone number
export function formatPhoneNumber(str) {
    let arr = str.split("")
    let counter = 1
    let newString = ""
    for (let item of arr) {
        if (counter === 3 || counter === 6 || counter === 9) {
            newString += item + " "
            counter++
        } else {
            newString = newString + item
            counter++
        }
    }
    return newString
}


// check if date is exceeded
// if yes return class name to highlight 
// exceeded contact date
export function isDateExceeded(date, delta=0) {

    let dateArr = date.split("-")

    // removing zero if exists in day or month 
    let month = removeZero(dateArr[1])
    let day = removeZero(dateArr[2])

    //today
    let today = new Date()
    // date to be checked
    let expDate = new Date(dateArr[0], month - 1, day)

    // result in miliseconds
    let difference = expDate - today.setHours(0,0,0,0)

    // converting miliseconds to days
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24))

    // total days difference should be less than delta and 
    // more than 0, otherwise it means date is exceeded
    // if there are exceeded days return true
    // else return false
    if (Number(totalDays) <= delta && Number(totalDays) >= 0 ) {
        return false
    } else if (Number(totalDays) > delta && Number(totalDays) >= 0) {
        return false
    } else {
        return true
    }
    
    // function to remove 0 from the beginning of month/day number
    // example: string 04 (represents April) - returns 4
    function removeZero(str) {
        // check first letter in string
        // if it's a "0", remove it
        if (str && str.slice(0, 1) === "0") {
            return Number(str.slice(1))
        } else {
            return Number(str)
        }
    }
}


export function getClientCompanyName(companiesArr, companyId) {
    // filter through companies Arr and find the one which
    // id matches clients company id
    // must be only one correct result
    const clientCompany = companiesArr.filter( company => {
      return company[0] === companyId
    })
    // returns company name to display next to client details
    return clientCompany[0][1].companyName
  }


export function getClientName(clientsArr, clientId) {
    // filter through clients array, returns formatted first and
    // last name
    const client = clientsArr.filter(client => {
        return client[0] === clientId
    })
    
    return capitalizeFirstLetter(client[0][1].firstName) + " " + capitalizeFirstLetter(client[0][1].lastName)
}


  // convert coma to dot
export function convertComaToDot(string) {
    let testString = "235.1"
    return testString.replace(",", ".")
}


// checks wheter data is a number
export function isNumber(data) {
    console.log(data)
    if (Number(data)) {
        return true
    } else {
        return false
    }
}

// returns today's date
export function getToday() {
    const date = new Date()
    const year = date.getFullYear()
    const day = date.getDate()
    const month = date.getMonth()
    
    return (formatDate(`${year}-${month + 1}-${day}`))
  }

  // formats date
  export function formatDate(date) {
    const dateArr = date.split("-")
    // if month is September or earlier, function adds
    // zero before the month number
    const month = dateArr[1].length < 2 ? `0${dateArr[1]}` : dateArr[1]
    // if day is more than ninth, function adds
    // zero before the day number
    const day = dateArr[2].length < 2 ? `0${dateArr[2]}` : dateArr[2]
    return (`${dateArr[0]}-${month}-${day}`)
  }

  // there are three potential states (Low, Medium, High)
  // for sorting sake I had to change it to numbers,
  // otherwise sorting was by potentail name which was not
  // correct
  export function convertNumberToPotential(number) {
    if (number === 0) {
        return "LOW"
    } else if (number === 1) {
        return "MEDIUM"
    } else {
        return "HIGH"
    }
  }

  // make string shorter and add three dots
  export function makeShortStringWithDots(str, len) {
    if (str.length > len) {
        return str.slice(0, len) + "..."
    } else {
        return str
    }
  }

  export function isInDatesRange(startDate, endDate, date) {
    // check if date is in range

    // case 1 - startDate and endDate are chosen
    // return true if date is in range
    if ( startDate != "" && endDate != "" ) {
      if (date > startDate && date < endDate) {
        return true
      } else {
        return false
      }
    // case 2 - there are no chosen dates
    // in this case function returns true
    } else if (startDate === "" && endDate === "") {
      return true
    // case 3 - startDate is empty, endDate is chosen
    } else if (startDate === "" && endDate != "") {
      // if task date is earlier than endDate
      // return true, otherwise it's older and return false
      if (date < endDate) {
        return true
      } else {
        return false
      }
    // case 4 - endDate is empty, startDate is chosen
    } else if ( endDate === ""  && startDate != "") {
      // if task date is older than startDate
      // return true, otherwise it's earlier and return false
      if (date > startDate) {
        return true
      } else {
        return false
      }
    } 
    else {
      return true
    }
  }

  export function getTasksStats(arr) {
    let numberOfAllTasks = 0
    let numberOfAllClosedTasks = 0
    let numberOfAllOpenTasks = 0;
    let numberOfExceeded = 0

    for (let item of arr) {
      numberOfAllTasks++;
      // if task is closed add 1 to counter of closed tasks
      if (item[1].isClosed) {
        numberOfAllClosedTasks++;
      } else {
        numberOfAllOpenTasks++;
      }
      // if task is not closed and date is exceeded
      // add one to number of tasks with exceeded date
      if (!item[1].isClosed && item[1].deadlineDate < getToday()) {
        numberOfExceeded++;
      }
    }

    let stats = {
      numberOfAllTasks: numberOfAllTasks,
      numberOfAllClosedTasks: numberOfAllClosedTasks,
      numberOfAllOpenTasks: numberOfAllOpenTasks,
      numberOfExceeded: numberOfExceeded,
    }

    return stats
  }


