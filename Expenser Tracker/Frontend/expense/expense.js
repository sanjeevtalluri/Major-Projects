const expenseTableBody = document.getElementById('expense-table-body');
const addButton = document.getElementById('add-button');
const actionButtons = document.querySelector('.action-buttons');
const expenseAmount = document.getElementById('amount');
const expenseDescription = document.getElementById('description');
const expenseCategory = document.getElementById('category');
const buyPremiumButton = document.getElementById('buy-premium-btn');

addButton.addEventListener('click', addExpenseEventHandler);
expenseTableBody.addEventListener('click', onAction);
buyPremiumButton.addEventListener('click',buyPremiumEventHandler);


const baseUrl = "http://localhost:3000/expenses";
const purchaseUrl = "http://localhost:3000/purchase";
let edit = false;
let editId = "";
let editTrElement = null;
const config = {
    headers: {
        Authorization: localStorage.getItem('token')
    }
};

init();

function init() {
    getUsersFromCurd();
}

async function addUserToCrud(amount, description, category) {
    let res = null;
    try {
        res = await axios.post(baseUrl + "/addExpense", {
            amount: amount,
            description: description,
            category: category
        },config);
        createItemAndAppendToTable(amount, description, category, res.data.id);
        resetFormValues();
    }
    catch (err) {
        console.log(err);
    }

}

async function getUsersFromCurd() {
    let res = null;
    try {
        res = await axios.get(baseUrl + "/getExpenses", config);
        res.data.forEach(item => {
            createItemAndAppendToTable(item.amount, item.description, item.category, item.id);
        })
    }

    catch (err) {
        console.log(err);
    }
}


async function deleteUserFromCrud(trElement) {
    const id = trElement.getAttribute('apiId');
    try {
        await axios.delete(`${baseUrl}/deleteExpense/${id}`,config)
        remove(trElement);
    }
    catch (err) {
        console.log(err);
    }
}

async function UpdateUserFromCrud(id, amount, description, category, trElement) {
    try {
        await axios.put(``, {
            amount: amount,
            description: description,
            category: category
        })
        remove(trElement);
        createItemAndAppendToTable(amount, description, category, id);
        edit = false;
        editId = "";
        editTrElement = null;
    }
    catch (err) {
        console.log(err);
    }
}

async function buyPremiumFromApi() {
    try {
        const response = await axios.get(`${purchaseUrl}/buyPremium`,config);
        console.log(response);
        var options = {
            'key': response.data.key_id,
            'order_id': response.data.order.id,
            'handler': async (response)=>{
                await axios.post(`${purchaseUrl}/updateTransactionStatus`,{
                    order_id:options.order_id,
                    payment_id: response.razorpay_payment_id
                }, config);
                alert('You are premium user now');
            }
        }
        var rzp1 = new Razorpay(options);
        rzp1.open();
        //e.preventDefault();

        rzp1.on('payment.failed',async (response)=>{
            console.log(response);
            await axios.post(`${purchaseUrl}/updateTransactionStatusFail`,{
                order_id:options.order_id,
            },config)
            alert('Something went wrong');
        })
    }
    catch (err) {
        console.log(err);
    }


}
function resetFormValues() {
    expenseAmount.value = '';
    expenseDescription.value = '';
    expenseCategory.value = 'Movie';
    addButton.value = 'Add Expense';
}



function addExpenseEventHandler() {
    if (edit) {
        UpdateUserFromCrud(editId, expenseAmount.value, expenseDescription.value, expenseCategory.value, editTrElement);
    }
    else {
        addUserToCrud(expenseAmount.value, expenseDescription.value, expenseCategory.value);
    }
    resetFormValues();
}

function buyPremiumEventHandler(){
    buyPremiumFromApi();
}
function createCell(element, value) {
    const newElement = document.createElement(element);
    newElement.innerText = value;
    return newElement;
}


function createItemAndAppendToTable(amount, description, category, id) {
    const trElement = document.createElement('tr');
    trElement.setAttribute('apiId', id);
    trElement.appendChild(createCell('td', amount));
    trElement.appendChild(createCell('td', description));
    trElement.appendChild(createCell('td', category));
    const duplicateActionButtons = actionButtons.cloneNode(true);
    trElement.appendChild(duplicateActionButtons);
    expenseTableBody.appendChild(trElement);
}


function onAction(e) {
    e.preventDefault();

    if (e.target.classList.contains('delete-button')) {
        let isConfirmedToDelete = confirm('Do you want to delete the item');
        if (isConfirmedToDelete) {
            let trElement = e.target.parentElement.parentElement.parentElement.parentElement;
            deleteUserFromCrud(trElement);
        }
    }
    else if (e.target.classList.contains('edit-button')) {
        let trElement = e.target.parentElement.parentElement.parentElement.parentElement;
        let id = trElement.getAttribute('apiId');
        populateValuesInForm(id, trElement.childNodes[0].innerText, trElement.childNodes[1].innerText,
            trElement.childNodes[2].innerText, trElement);
    }

}
function remove(trElement) {
    expenseTableBody.removeChild(trElement);
}


function populateValuesInForm(id, amount, description, category, trElement) {
    expenseAmount.value = amount;
    expenseDescription.value = description;
    expenseCategory.value = category;
    editId = id;
    edit = true;
    editTrElement = trElement;
    addButton.value = 'Update Expense';
}