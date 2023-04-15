const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const loginBtn = document.querySelector('#loginBtn');
const errorMsgDom = document.querySelector('.error-msg');
const successMsgDom = document.querySelector('.success-msg');

const baseUrl = "http://localhost:3000/users";
let errorMsg = '';
let successMsg = '';

loginBtn.addEventListener('click', onLoginEventHandler);

function onLoginEventHandler(e) {
    checkUserFromCrud(userEmail.value, userPassword.value);
}

async function checkUserFromCrud(email, password) {
    let res = null;
    try {
        res = await axios.post(baseUrl + "/login", {
            email: email,
            password: password
        });
        successMsg = res.data.message;
        errorMsgDom.textContent = '';
        successMsgDom.textContent = successMsg;
        localStorage.setItem('token',res.data.token);
        setTimeout(()=>{
            window.location.href = "http://127.0.0.1:5500/Expenser%20Tracker/Frontend/expense/expense.html";
        },2000)

    }
    catch (err) {
        errorMsg = err.response.data.message;
        successMsgDom.textContent = '';
        errorMsgDom.textContent = errorMsg;
    }

}