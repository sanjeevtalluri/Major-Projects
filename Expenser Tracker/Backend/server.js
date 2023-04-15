const express = require('express');
const bodyParser = require('body-parser');


const authRoutes = require('./routes/auth');

const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');

const sequelize = require('./util/database');

const app = express();

var cors = require('cors');
const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/order');

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/users', authRoutes);

app.use('/expenses',expenseRoutes);

app.use('/purchase',purchaseRoutes);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Expense);

Order.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });

User.hasMany(Order);

sequelize.sync().then((result)=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})

