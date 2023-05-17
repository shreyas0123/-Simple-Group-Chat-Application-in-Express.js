const express = require('express');
const parseBody = require('body-parser');
const fs = require('fs');

const app = express();

app.use(parseBody.urlencoded({extended:true}));

app.get('/login',(req,res)=>{
    res.send(`<form action='/login' method="POST" onsubmit="localStorage.setItem('username',document.getElementById('username').value)">
    <input type="text" name="username" id="username" placeholder="login">
    <br/>
    <button type="submit">Add</button>
    </form>`)
})

//localhost:3000/login we are entering username
//in local storage we are storing username as a key value pair

app.post('/login',(req,res)=>{
    res.redirect('/text');
})

//after submitting login form page should be redirected to '/text' form

app.get('/text',(req,res)=>{
    fs.readFile('message.txt','utf-8',(err,data)=>{
        if(err){
            console.log(err);
            data = 'No chat exist';
        }
        res.send(`${data}<form action='/text' method="POST" onsubmit="document.getElementById('username').value=localStorage.getItem('username')">
        <input type="text" name="message" id="message" placeholder="Enter Text">
        <input type="hidden" name="username" id="username">
        <br/>
        <button type="submit">Send</button>
        </form>`)
    })

})

//we are accessing username from localStorage and username we are doing hidden 
//because when we login for first time message.txt file will not be creating, it will create on creating text form
//on login mesage.txt file will not be creating so username will be hidden and 
//on creating text form  the message.txt file will be created and username will be stored in the file
//till file creation username will be hiddden
//${data} ---- only for showing username,text on screen
//for first time login after submitting login form you will be redirecting to text form
//that time 'No chat exist' message will be shown
//<br/> creatingform on new line

app.post('/text',(req,res)=>{
    const username = req.body.username;
    const message = req.body.message;
    const chatEntry = `${username}:${message}\n` //\n showing chat in new line in a file

    
    fs.appendFile('message.txt',chatEntry,(err)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/text');
    })
})

//after submitting text form, text will then send to backend via POST request
//req.body in that body stores username,message
//fs.appendFile using this we are storing username,message inside message.txt file

app.listen(5000);
