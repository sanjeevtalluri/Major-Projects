const express = require('express');
const bodyParser = require('body-parser');


const authRoutes = require('./routes/auth');

const sequelize = require('./util/database');

const app = express();

var cors = require('cors')

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/users', authRoutes);


sequelize.sync().then((result)=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})

