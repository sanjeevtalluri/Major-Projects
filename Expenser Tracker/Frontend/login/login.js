const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const loginBtn = document.querySelector('#loginBtn');

const baseUrl = "http://localhost:3000/users";

loginBtn.addEventListener('click', onLoginEventHandler);
function onLoginEventHandler(e) {
    addUserToCrud(userEmail.value, userPassword.value);
}

async function addUserToCrud(email, password) {
    let res = null;
    try {
        res = await axios.post(baseUrl + "/login", {
            email: email,
            password: password
        });
    }
    catch (err) {
        console.log(err);
    }

}