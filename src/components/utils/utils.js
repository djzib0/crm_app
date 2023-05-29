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

// check if date is older than today
// if yes return class name to highlight 
// exceeded contact date
export function isDateExceeded(date) {
    let dateArr = date.split("-")
    let month = removeZero(dateArr[1])

    let today = new Date()
    let expDate = new Date(dateArr[0], month - 1, dateArr[2])

    // if date is exceeded return true
    // else return false
    if (today.setHours(0, 0, 0, 0) > expDate.setHours(0, 0, 0, 0)) {
        return false
    } else {
        return true
    }
    
    // function to remove 0 from the beginning of month number
    // example: string 04 (represents April) - return 4
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

