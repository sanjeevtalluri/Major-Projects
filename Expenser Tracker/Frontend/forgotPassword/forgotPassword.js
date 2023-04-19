const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const userEmail = document.querySelector('#email');

const baseUrl = "http://localhost:3000/password";

resetPasswordBtn.addEventListener('click',resetPasswordEventHandler);

function resetPasswordEventHandler(){
    const email = userEmail.value;
    resetPasswordFromApi(email);
}


async function resetPasswordFromApi(email) {
    let res = null;
    try {
        res = await axios.post(baseUrl + "/forgotPassword", {
            email:email
        });
        window.location.href = "../forgotPassword/forgotPasswordRequest.html";
    }
    catch (err) {
        console.log(err);
    }

}