const menuBuilder = require('ussd-menu-builder');
const express = require('express');
const bodyParser = require('body-parser');
let menu = new menuBuilder();

const app = express();
const PORT = 8000

app.listen(PORT, () => {
    console.log('app is running on port' + PORT);
})

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('success');
})
//opening message
menu.startState({
    run: () => {
             
        menu.con('Welcome. Please provide your first name, last name and age: ' +
            '\n1. Next');
    },
    
    next: {
        '1': 'Next'
    }
});

//Get user's first name
menu.state('Next', {
    run: () => {
        menu.con('Enter first name');
        
    },
    next: {
        '*[a-zA-Z]+': 'secondname'
    }
});

//Get user's second name
menu.state('secondname', {
    run: () => {
        
        menu.con('Enter your second name');
        fname = String(menu.val);
        
    },
    next: {
        '*[a-zA-Z]+': 'age'
    }
})

//Get user's age
menu.state('age', {
    run: () => {
        
        menu.con('Enter your age');
        sname = String(menu.val);
        
    },
    next: {
        '*\\d+': 'terminate'
    }
})

//Terminate the program
menu.state('terminate', {
    run: () => {
        age = Number(menu.val);
        if(age<=60){
            menu.end('Your name is: '+ fname + ' ' + sname + ' ' + '\nYour age is: '+ age + '\nContinue working!');
        }else{
            menu.end('Your name is: '+ fname + ' ' + sname + ' ' + '\nYour age is: '+ age + '\nRetire!');
        }
        
        
    }
})


app.post('/', function(req, res){
    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
});