const expenseTableBody = document.getElementById('expense-table-body');
const addButton = document.getElementById('add-button');
const actionButtons = document.querySelector('.action-buttons');
const expenseAmount = document.getElementById('amount');
const expenseDescription = document.getElementById('description');
const expenseCategory = document.getElementById('category');

addButton.addEventListener('click',addExpenseEventHandler);
expenseTableBody.addEventListener('click', onAction);


const baseUrl = "http://localhost:3000/expenses";
let edit = false;
let editId = "";
let editTrElement = null;

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
        });
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
        res = await axios.get(baseUrl + "/getExpenses");
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
        await axios.delete(`${baseUrl}/deleteExpense/${id}`)
        remove(trElement);
    }
    catch (err) {
        console.log(err);
    }
}

async function UpdateUserFromCrud(id, amount, description, category, trElement) {
    try {
        await axios.put(`${baseUrl}/updateExpense/${id}`, {
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
function resetFormValues(){
    expenseAmount.value = '';
    expenseDescription.value = '';
    expenseCategory.value = 'Movie';
    addButton.value = 'Add Expense';
}



function addExpenseEventHandler(){
    if (edit) {
        UpdateUserFromCrud(editId, expenseAmount.value,expenseDescription.value,expenseCategory.value, editTrElement);
    }
    else {
        addUserToCrud(expenseAmount.value,expenseDescription.value,expenseCategory.value); 
    }
    resetFormValues();
}

function createCell(element,value){
    const newElement = document.createElement(element);
    newElement.innerText = value;
    return newElement;
}


function createItemAndAppendToTable(amount, description, category, id){
    const trElement = document.createElement('tr');
    trElement.setAttribute('apiId',id);
    trElement.appendChild(createCell('td',amount));
    trElement.appendChild(createCell('td',description));
    trElement.appendChild(createCell('td',category));
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
        populateValuesInForm(id, trElement.childNodes[0].innerText,trElement.childNodes[1].innerText,
            trElement.childNodes[2].innerText,trElement);
    }

}
function remove(trElement) {
    expenseTableBody.removeChild(trElement);
}


function populateValuesInForm(id,amount, description, category,trElement){
    expenseAmount.value = amount;
    expenseDescription.value = description;
    expenseCategory.value = category;
    editId = id;
    edit = true;
    editTrElement = trElement;
    addButton.value = 'Update Expense';
}