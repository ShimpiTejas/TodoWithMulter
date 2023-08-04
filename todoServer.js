const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json())


app.set('view engine', 'ejs');

app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});


var session = require("express-session"); // Add this line to import express-session

app.use(express.urlencoded({ extended: true }));
// Configure the express-session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    
  })
);

app.use(express.json());



app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/todoViews/style.css');
});

app.get("/styles.css", function (req, res) {
    res.sendFile(__dirname + "/todoViews/styles.css");
});

app.get("/", function (req, res) {
    debugger
    if(!req.session.isLoggedIn)
    {
        debugger;
        res.redirect('/login');
        return;
    }
    console.log(req.session.username);
    res.render('index', {username: req.session.username});
  
});



app.get('/todoScripts.js', function(req, res) {
    res.sendFile(__dirname + '/todoViews/scripts/todoScripts.js');
});

app.post('/add', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        if (data == '') data = '[]';

        let dataObj = JSON.parse(data); 
        dataObj.push(req.body);
        fs.writeFile('data.json', JSON.stringify(dataObj), (err) => {
            if (err) throw err;
            res.send(dataObj);
        });
    });
});

app.get('/todoData', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});


app.post('/delete', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        let dataObj = JSON.parse(data);
        dataObj.forEach((item, index) => {
            if (item.id == req.body.id) {
                dataObj.splice(index, 1);
            }
        });
        fs.writeFile('data.json', JSON.stringify(dataObj), (err) => {
            if (err) throw err;
            res.send(dataObj);
        });
    });
});

app.post('/update', (req, res) => { 
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        let dataObj = JSON.parse(data);
        dataObj.forEach((item) => {
            if (item.id == req.body.id) {
                item.checked = req.body.checked;
            }
        });
        fs.writeFile('data.json', JSON.stringify(dataObj), (err) => {
            if (err) throw err;
            res.send(dataObj);
        });
    });
});



// logic to login in the site 

app.get("/login", function (req, res) {
    res.render('login');
  });
  
  app.post("/login", function (req, res) {
    const username = req.body.username ;
    req.session.username = username;
    const password = req.body.password ;
  
    console.log(username, password);
  
    fs.readFile('userData.json', 'utf-8', function(err, data){
      if(err)
      {
        console.log(err)
        return;
      }
  
      const users = JSON.parse(data);
      const user = users.find(u=> u.username ===username && u.password === password);
  
      if (user) {
        
        res.cookie('username', user.username);
        req.session.isLoggedIn = true;
        return res.redirect('/');
      } else {
        return res.redirect('/login');
      }
  
  
    })
  
    // if (username == "t" && password == "t") {
  
    //   req.session.isLoggedIn = true;
    //   req.session.username = username;
    //   debugger;
    //   res.redirect("/");
    //   return;
    // }
  
    // res.status(401).send("error");
  });


  app.get('/logout', (req, res) => {
    res.isLoggedIn = false;
    res.clearCookie('username');
    return res.redirect('/');
  });

//   Creating the User Account

app.get("/accountCreation", function (req, res) {
    res.render("accountCreation");
  });
  
  app.post('/accountCreation', function(req, res){
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
  
    console.log(" im called")
    console.log(name, username, password);
  
    profile = {
      name,
      username,
      password
    }
  
    fs.readFile('userData.json', 'utf-8', (err, data)=>{
      if(err)
      {
        console.log("Error while reading user file")
      }
      
      const users = JSON.parse(data);
  
      const available = users.find(u => u.username === username);
      if (available) {
        return res.status(409).send('User with the same username already exists.');
      }
  
      users.push({name, username, password })
  
      fs.writeFile('userData.json', JSON.stringify(users), (err)=>{
        if(err){
            res.send(profile);
        }
  
        res.redirect('/');
      })
  
    })
  
    
  
   
  })
  
  app.get("/styles.css", function (req, res) {
    res.sendFile(__dirname + "/todoViews/styles.css");
  });
  
  app.get("/", function (req, res) {
      debugger
      if(!req.session.isLoggedIn)
      {
          debugger;
          res.redirect('/login');
          return;
      }
      console.log(req.session.username);

      res.render('index', {username: req.session.username})
    
  });