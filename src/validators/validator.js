function isValidObject(value) {
    return (Object.keys(value).length > 0)
}

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string") { return true }
    else {
        return false
    }
}

const isValidName = function (value) {
    const regEx = /^\s*([a-zA-Z\s\,\.]){2,100}\s*$/
    const result = regEx.test(value)
    return result
}

const isValidNumber = function (value) {
    const regEx = /^\s*\91([0-9]){10}\s*$/
    const result = regEx.test(value)
    return result
}

const isValidEmail = function (value) {
    let emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
    return emailRegex.test(value)
};

const isValidPassword = function (password) {
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
};


function validTitle(value) {
    if (typeof value === "undefined" || typeof value === "null" || typeof value === "number") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (value) value = value.trim()
    if (value !== "Mr" && value !== "Miss" && value !== "Mrs") return false
    return true
}

const isValidArray = (value) => {
    if (Array.isArray(value) && value.length>0) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].trim().length === 0 || typeof (value[i]) !== "string") { return false }
        }
        return true
    } 
    else { 
        return false 
    }
}

const isValidISBN = (value) => {
    const regEx1 = /^\s*\978([0-9]){10}\s*$/
    const regEx2 = /^\s*([0-9]){10}\s*$/
    if(regEx1.test(value) || regEx2.test(value)){
        return true
    }
    else{
        return false
    }
}

const isValidDate = (value) => {
    const regEx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    const result = regEx.test(value)
    return result
}

const isValidRating = (value) => {
    const regEx = /^\s*([1-5]){1}\s*$/
    const result = regEx.test(value)
    return result
}

const isValidPinCode = (value) => {
    const regEx = /^\s*([0-9]){6}\s*$/
    const result = regEx.test(value)
    return result
}

const isValidImage = (value) => {
    const regEx = /\.(gif|jpeg|jpg|png|webp|bmp)$/
    const result = regEx.test(value)
    return result
}

module.exports = { isValid, isValidArray, isValidISBN, isValidObject, 
                   validTitle, isValidDate, isValidRating , isValidPinCode, 
                   isValidImage, isValidName, isValidNumber, isValidEmail, 
                   isValidPassword}