const usersUrl = "http://localhost:3000/users";
const downloadReportBtn = document.getElementById('download-report-btn');
const config = {
    headers: {
        Authorization: localStorage.getItem('token')
    }
};

init();

function init(){
    isPremiumUserFn();
}

async function isPremiumUserFn() {
    try {
        const res = await axios.get(usersUrl + "/isPremiumUser", config);
        isPremiumUser = res.data.isPremiumUser;
        if (isPremiumUser) {
            enablePremiumFeatures();
        }
    }
    catch (err) {
        console.log(err);
    }
}

function enablePremiumFeatures(){
    downloadReportBtn.removeAttribute('hidden');
}