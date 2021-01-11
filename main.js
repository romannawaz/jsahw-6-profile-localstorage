const getSel = sel => document.querySelector(sel);

const SING_IN_BLOCK = getSel('.sing-in-block');
const SING_UP_BLOCK = getSel('.sing-up-block');

const FORM_SING_UP = getSel('.sing-up-form');
const FORM_SING_IN = getSel('.sing-in-form');

const TO_SING_IN = getSel('.to-sing-in');
const TO_SING_UP = getSel('.to-sing-up');

const PROFILE_BLOCK = getSel('.profile');
const SING_OUT_BUTTON = getSel('.btn-sing-out');

const SWITCH_FORM_BUTTONS = document.querySelectorAll('.switch-form-btn');

const toCapitalize = word => word[0].toUpperCase() + word.slice(1);

const setValid = element => {
    if (element.classList.contains('is-invalid'))
        element.classList.remove('is-invalid');

    element.classList.add('is-valid');
}

const cleanForms = () => {
    const forms = document.forms;

    for (const form of forms) {
        const inputs = form.querySelectorAll('input');

        for (const input of inputs) {
            input.classList.remove('is-valid', 'is-invalid');
        }

        form.reset();
    }
}

const errorHandler = (element, errorField, message) => {
    element.classList.add('is-invalid');

    errorField.innerText = message;
}

let users = localStorage.getItem('users') === null ? [] : JSON.parse(localStorage.getItem('users'));

class User {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}

FORM_SING_UP.addEventListener(
    'submit',
    function (e) {
        e.preventDefault();

        const inputs = document.querySelectorAll('.sing-up-form input');

        let isValid = true;

        for (const elem of inputs) {
            const errorField = elem.closest('div').querySelector('.invalid-feedback');

            if (elem.validity.valueMissing) {
                errorHandler(elem, errorField, 'Field is empty!');
                isValid = false;
            }
            else if (elem.validity.patternMismatch) {
                errorHandler(elem, errorField, 'Enter the data in the correct format');
                isValid = false;
            }
            else {
                if (elem.classList.contains('sing-up__email')) {
                    if (users.some(val => val.email == elem.value)) {
                        errorHandler(elem, errorField, 'User with this email already exist');
                        isValid = false;
                    }
                    else {
                        setValid(elem);
                    }
                }
                else {
                    setValid(elem);
                }
            }
        }

        if (isValid) {
            const FIRST_NAME = getSel('.sing-up__first-name').value;
            const LAST_NAME = getSel('.sing-up__last-name').value;
            const EMAIL = getSel('.sing-up__email').value;
            const PASSWORD = getSel('.sing-up__password').value;

            const newUser = new User(FIRST_NAME, LAST_NAME, EMAIL, PASSWORD);

            users.push(newUser);

            localStorage.setItem('users', JSON.stringify(users));

            for (const elem of inputs) {
                elem.classList.remove('is-valid');
            }

            this.reset();
        }
    }
);

FORM_SING_IN.addEventListener(
    'submit',
    function (e) {
        e.preventDefault();

        let isValid = true;

        const EMAIL = getSel('.sing-in__email');
        const PASSWORD = getSel('.sing-in__password');
        const emailErrorField = EMAIL.closest('div').querySelector('.invalid-feedback');
        const passwordErrorField = PASSWORD.closest('div').querySelector('.invalid-feedback');

        if (EMAIL.validity.valueMissing) {
            errorHandler(EMAIL, emailErrorField, 'Field is empty!');
            isValid = false;
        }
        else if (EMAIL.validity.patternMismatch) {
            errorHandler(EMAIL, emailErrorField, 'Wrong email!');
            isValid = false;
        }

        if (PASSWORD.validity.valueMissing) {
            errorHandler(PASSWORD, passwordErrorField, 'Field is empty!');
        }
        else if (PASSWORD.validity.patternMismatch) {
            errorHandler(PASSWORD, passwordErrorField, 'Wrong password!');
        }

        if (isValid) {
            const user = users.find(user => user.email == EMAIL.value);

            if (user == undefined) {
                errorHandler(EMAIL, emailErrorField, 'User does not exist!');

                EMAIL.classList.add('is-invalid');
                PASSWORD.classList.add('is-invalid');
            }
            else {
                if (user.password == PASSWORD.value) {
                    SING_IN_BLOCK.classList.add('none');

                    getSel('.profile__name').innerText = `${toCapitalize(user.firstName)} ${toCapitalize(user.lastName)}`;
                    getSel('.profile__email').innerText = user.email;

                    PROFILE_BLOCK.classList.remove('none');

                    this.reset();
                    EMAIL.classList.remove('is-valid', 'is-invalid');
                    PASSWORD.classList.remove('is-valid', 'is-invalid');
                }
                else {
                    errorHandler(PASSWORD, passwordErrorField, 'Wrong password!');

                    setValid(EMAIL);
                    PASSWORD.classList.add('is-invalid');
                }
            }
        }
    }
);

SING_OUT_BUTTON.addEventListener(
    'click',
    function () {
        getSel('.profile__name').innerText = '';
        getSel('.sing-in__email').innerText = '';

        PROFILE_BLOCK.classList.add('none');
        SING_IN_BLOCK.classList.remove('none');
    }
);

for (const BTN of SWITCH_FORM_BUTTONS) {
    BTN.addEventListener(
        'click',
        function () {
            cleanForms();

            SING_IN_BLOCK.classList.toggle('none');
            SING_UP_BLOCK.classList.toggle('none');
        }
    );
}