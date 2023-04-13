const userName = document.querySelector('#name');
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const signupBtn = document.querySelector('#signupBtn');
const errorMsgDom = document.querySelector('.error-msg');
const successMsgDom = document.querySelector('.success-msg');

const baseUrl = "http://localhost:3000/users";
signupBtn.addEventListener('click', onSignupEventHandler);
function onSignupEventHandler(e) {
    console.log('in');
    addUserToCrud(userName.value, userEmail.value, userPassword.value);
    resetFormValues();
}

async function addUserToCrud(name, email, password) {
    let res = null;
    try {
        res = await axios.post(baseUrl + "/signup", {
            name: name,
            email: email,
            password: password
        });
        resetFormValues();
        successMsg = res.data.message;
        errorMsgDom.textContent = '';
        successMsgDom.textContent = successMsg;
    }
    catch (err) {
        errorMsg = err.response.data.message;
        successMsgDom.textContent = '';
        errorMsgDom.textContent = errorMsg;
        //toggleDisplay(errorMsg);
    }

}
function resetFormValues() {
    userName.value = '';
    userEmail.value = '';
    userPassword.value = '';
}

function toggleDisplay(element) {
    if(element.classList.contains('show')){
        element.classList.remove('show');
    }
    else{
        element.classList.add('show');
    }
}