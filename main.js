let showErrorMessage = (input, formGroup, formError) => {
    
    formGroup.classList.add('is-invalid');

    formError.classList.add('is-active');
    
    input.setAttribute('aria-describedby', formError.getAttribute('id'));
    input.setAttribute('aria-invalid', 'true');
    input.focus();
};

let showDateErrorMessage = () => {
    let inputDay = document.querySelector('#day');
    let parent = parentOf(inputDay);
    let invalidDate = invalidDateOf(inputDay);
    showErrorMessage(inputDay, parent, invalidDate);

    let groups = document.querySelectorAll('.form__group + .form__group');
    groups.forEach((group) => {
        group.classList.add('is-invalid');
    });
}

let hideErrorMessage = (input, formGroup, formError) => {
    formGroup.classList.remove('is-invalid');
    formError.classList.remove('is-active');

    input.removeAttribute('aria-describedby');
    input.removeAttribute('aria-invalid');
};

let parentOf = (input) => {
    let parent = document.querySelector(input.getAttribute('data-parent'));
    return parent;
}

let emptyOf = (input) => {
    let empty = document.querySelector(input.getAttribute('data-empty'));
    return empty;
}

let invalidOf = (input) => {
    let invalid = document.querySelector(input.getAttribute('data-invalid'));
    return invalid;
}

let invalidDateOf = (input) => {
    let invalid = document.querySelector(input.getAttribute('data-invalid-date'));
    return invalid;
}

let fadeIn = (output) => {
    output.classList.add('fade-in');
};

let fadeOut = (output) => {
    output.classList.remove('fade-in');
};

let setOutputDay = (day) => {
    let outputDay = document.querySelector('#output-day');
    outputDay.innerHTML = day;
    fadeIn(outputDay);
}

let setOutputMonth = (month) => {
    let outputMonth = document.querySelector('#output-month'); 
    outputMonth.innerHTML = month;
    fadeIn(outputMonth);
}

let setOutputYear = (year) => {
    let outputYear = document.querySelector('#output-year');
    outputYear.innerHTML = year;
    fadeIn(outputYear);
}


function calculateAge (year, month, day) {
    let currentDate = new Date();

    let yearDifference = currentDate.getFullYear() - year;
    let monthDifference = (currentDate.getMonth() + 1) - month;
    let dayDifference = currentDate.getDate() - day;
    
    let age = {year: yearDifference, month: monthDifference, day: dayDifference};

    if (monthDifference >= 0 && dayDifference >= 0) {

        return age;

    } else if (monthDifference >= 0 && dayDifference < 0) {
        
        age.year -= 1;
        age.month = 12 - 1;
        age.day = 30 - Math.abs(dayDifference);
        return age;

    } else if (monthDifference < 0 && dayDifference >= 0) {

        age.year -= 1;
        age.month = 12 - Math.abs(monthDifference);
        return age;

    } else {

        age.year -= 1;
        age.month = 12 - (Math.abs(monthDifference) + 1);
        age.day = 30 - Math.abs(dayDifference); 
        return age;
    }
}

class DateValidator {

    constructor(input) {
        this.input = input;
    }

    isEmpty ()  {
        let parent = parentOf(this.input);
        let empty = emptyOf(this.input);

        if (this.input.value.trim().length === 0) {
            showErrorMessage(this.input, parent, empty);
            this.emptyState = true;
        } else {
            hideErrorMessage(this.input, parent, empty);
            this.emptyState = false;
        }
        return this;
    };

    isValid () {

    }

    verify () {
        this.isEmpty();

        if (!this.emptyState) {
            this.isValid();
        }
    };

    static isValidDay(dayValidator) {
        let isValid = () => {
            let input = dayValidator.input;
            let parent = parentOf(input);
            let invalid = invalidOf(input);
    
            let day = Number.parseInt(dayValidator.input.value);
    
            if (!Number.isInteger(day) || day < 1 || day > 31 ) {
                showErrorMessage(input, parent, invalid);
                dayValidator.validState = false;
            } else {
                hideErrorMessage(input, parent, invalid);
                dayValidator.validState = true;
            }
    
            return dayValidator;
        };
    
        return isValid;
    }

    static isValidMonth(monthValidator) {
        let isValid = () => {
            let input = monthValidator.input;
            let parent = parentOf(input);
            let invalid = invalidOf(input);
    
            let month = Number.parseInt(input.value);
    
            if (!Number.isInteger(month) || month < 1 || month > 12) {
                monthValidator.validState = false;
                showErrorMessage(input, parent, invalid);
            } else {
                monthValidator.validState = true;
                hideErrorMessage(input, parent, invalid);
            }
            return monthValidator;
        };
    
        return isValid;
    }

    static isValidYear (yearValidator) {
        let isValid = () => {
            let input = yearValidator.input;
            let parent = parentOf(input);
            let invalid = invalidOf(input);
    
            let year = Number.parseInt(input.value);
            let currentYear = new Date().getFullYear();
            
            if (!Number.isInteger(year) || year < 0 || year > currentYear) {
                yearValidator.validState = false;
                showErrorMessage(input, parent, invalid);
            } else {
                yearValidator.validState = true;
                hideErrorMessage(input, parent, invalid);
            }
    
            return yearValidator;
        };
        
        return isValid;
    }

    static isLeapYear (year) {
        let isOk = (year % 4 == 0) || (year % 400 == 0);
        return isOk;
    }

    static isFebruary (day, month, year) {
        if (DateValidator.isLeapYear(year)) {
            return ((month === 2) && (day >= 1 && day <= 29));
        } else {
            return ((month === 2) && (day >= 1 && day <= 28));
        }
    }

    static hasThirtyDays (day, month) {
        if (month === 4 || month === 6 || month === 9 || month === 11) {
            return (day >= 1 && day <= 30);
        } else {
            return true;
        }
    }

    static isAccepted (dayValidator, monthValidator, yearValidator) {
        if (!dayValidator.validState ||
            !monthValidator.validState ||
            !yearValidator.validState
            ) {
            return;
        }
        
        let dayInput = dayValidator.input;
        let monthInput = monthValidator.input;
        let yearInput = yearValidator.input;

        let day = Number.parseInt(dayInput.value.trim());
        let month = Number.parseInt(monthInput.value.trim());
        let year = Number.parseInt(yearInput.value.trim());

        let age = calculateAge(year, month, day);

        let years = age.year;
        let months = age.month;
        let days = age.day;

        if (years < 0) {
            
            showErrorMessage(yearInput, parentOf(yearInput), invalidOf(yearInput));
            return false;

        } else if (DateValidator.isFebruary(day, month, year) || 
            DateValidator.hasThirtyDays(day, month)) {
            
            hideErrorMessage(dayInput, parentOf(dayInput), invalidDateOf(dayInput));
            hideErrorMessage(monthInput, parentOf(monthInput), invalidOf(monthInput));
            hideErrorMessage(yearInput, parentOf(yearInput), invalidOf(yearInput));

            setOutputDay(days);
            setOutputMonth(months);
            setOutputYear(years);

            return true;

        }else {
            
            showDateErrorMessage();
            return false;
        }        
    }
}

let calculateAgeButton = document.querySelector('.form__btn');
calculateAgeButton.addEventListener('click', () => {
    
    let dayInput = document.querySelector('#day');
    let monthInput = document.querySelector('#month');
    let yearInput = document.querySelector('#year');

    
    // show error message when day field is empty or invalid
    let dayValidator = new DateValidator(dayInput);
    dayValidator.isValid = DateValidator.isValidDay(dayValidator);
    dayValidator.verify();

    // shows error message when month field is empty or invalid
    let monthValidator = new DateValidator(monthInput);
    monthValidator.isValid = DateValidator.isValidMonth(monthValidator);
    monthValidator.verify();

    // shows error message when year field is empty or invalid
    let yearValidator = new DateValidator(yearInput);
    yearValidator.isValid = DateValidator.isValidYear(yearValidator);
    yearValidator.verify();

    let isAcceped = DateValidator.isAccepted(dayValidator, monthValidator, yearValidator);
});


let animationendHandler = (event) => {
    fadeOut(event.target);
    document.querySelector('#day').focus();
};

let outputDay = document.querySelector('#output-day');
outputDay.addEventListener('animationend', animationendHandler);

let outputMonth = document.querySelector('#output-month');
outputMonth.addEventListener('animationend', animationendHandler);

let outputYear = document.querySelector('#output-year');
outputYear.addEventListener('animationend', animationendHandler);