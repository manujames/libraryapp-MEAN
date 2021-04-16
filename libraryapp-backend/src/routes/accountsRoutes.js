const express = require('express');
const accountsRouter = express.Router();
const UserData = require('../model/Database').UserData;

router = (createToken)=>{
    accountsRouter.post('/login', (req,res)=>{
        // Fetch user inputs from form
        let inputUser = req.body;
        // Check login credentials
        UserData.findOne({email:inputUser.email})
        .then((user)=>{
            if(user && user.password === inputUser.password){       // Found email id and passwords matching
                let token = createToken(user.email,user.password);
                res.status(200).send({token});
            }
            else{
                res.status(401).send('Invalid Username or Password');
            }
        })
        .catch((err)=>{
            console.log(err);
            //Handle error here
            res.status(500).send()
        });
    })
    
    accountsRouter.post('/signup', (req,res)=>{
        // Fetch user inputs from form
        let newUser = {
            fname: req.body.fname,
            sname: req.body.sname,
            email: req.body.email,
            password: req.body.password
        };
        UserData.findOne({email:newUser.email})
        .then((user)=>{
            if(user){       // Email id already in use
                res.status(409).send('Email id alredy registered.');
            }
            else{
                UserData(newUser).save()
                .then(()=>{
                    let token = createToken(newUser.email, newUser.password);
                    res.status(200).send({token});
                })
            }
        })
        .catch((err)=>{
            console.log(err);
            //Handle error here
            res.status(500).send();
        });
    });
    return accountsRouter;
}

module.exports = router;