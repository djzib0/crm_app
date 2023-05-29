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

