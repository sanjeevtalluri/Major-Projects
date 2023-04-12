const userName = document.querySelector('#name');
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const signupBtn = document.querySelector('#signupBtn');

const baseUrl = "http://localhost:3000/users";
signupBtn.addEventListener('click',onSignupEventHandler);
 function onSignupEventHandler(e){
    console.log('in');
    addUserToCrud(userName.value,userEmail.value,userPassword.value); 
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
        createItemAndAppendToTable(amount, description, category, res.data.id);
        resetFormValues();
    }
    catch (err) {
        console.log(err);
    }

}
function resetFormValues(){
    userName.value = '';
    userEmail.value = '';
    userPassword.value = '';
}