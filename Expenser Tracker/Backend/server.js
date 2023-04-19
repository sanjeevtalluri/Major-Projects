const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const authRoutes = require('./routes/auth');

const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');

const sequelize = require('./util/database');

const app = express();

var cors = require('cors');
const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/order');
const ForgotPasswordRequest = require('./models/forgotPasswordRequest');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/users', authRoutes);

app.use('/expenses',expenseRoutes);

app.use('/purchase',purchaseRoutes);

app.use('/premium',premiumRoutes);

app.use('/password',passwordRoutes);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Expense);

Order.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });

User.hasMany(Order);

ForgotPasswordRequest.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });

User.hasMany(ForgotPasswordRequest);

sequelize.sync().then((result)=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})

