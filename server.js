// Load environment variables from .env file
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const User=require('./models/User')

// Access environment variables
const port = process.env.PORT || 3000;
const DBUri=process.env.DB_URI || 'mongodb://127.0.0.1:27017/mydatabase'
console.log(DBUri)
mongoose.set('debug', true);
app.use(bodyParser.json());

mongoose.connect(DBUri,{useNewUrlParser:true,useUnifiedTopology:true})
.then(
    ()=>{
        console.log('Connected to database')
    }
).catch((err)=>{
    console.error(err)
})
app.get('/users',async (req, res) => {
    try{
        const users=await User.find()
        res.json(users)

    }catch(err){
        res.status(500).send(err)}
    });


app.post('/users', async (req, res) => {
    try{
        const users = req.body.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, 10)
        }));
        const newUsers = await User.insertMany(users);
        res.status(201).json(newUsers);
    }catch(err){
        console.error(err)}
});

app.put('/users/:id', async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);

    }catch(err){
        res.status(500).send(err)}
    res.send('User updated successfully');
});

app.delete('/users/:id', async (req, res) => {
    try{
        const user=await User.findById(req.params.id)
        await user.remove()

    }catch(err){
        res.status(500).send(err)}})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});