const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended:false,limit:"2mb"}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json({limit:"2mb"}));

const port = process.env.PORT || 5000;


const jwt = require('jsonwebtoken')
const secretKey = 'secretKey';
const UserData = require('./src/model/Database').UserData;

function createToken(user,pwd){
    let payload = {
        subject: {
            user:user,
            pwd:pwd
        }
    };
    return jwt.sign(payload, secretKey);
}

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request');
    }
    
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('Unauthorized request');   
    }
    
    try {
        let payload = jwt.verify(token, secretKey);
        if(!payload || !payload.subject || !payload.subject.user || !payload.subject.pwd){
            return res.status(401).send('Unauthorized request');
        }

        UserData.findOne({email:payload.subject.user})
        .then((user)=>{
            if(user && user.password === payload.subject.pwd){       // Found email id and passwords matching
                req.userId = payload.subject.user;
                next();
            }
            else{
                return res.status(401).send('Invalid Username or Password');
            }
        })
        .catch((err)=>{
            console.log(err);
            //Handle error here
            return res.status(500).send("Database read error");
        });
    } 
    catch(error){
        console.log(error);
        return res.status(401).send('Unauthorized request');
    }
}


const booksRouter = require('./src/routes/booksRoutes')(verifyToken);
const authorsRouter = require('./src/routes/authorsRoutes')(verifyToken);
const accountsRouter = require('./src/routes/accountsRoutes')(createToken);

app.use('/books',booksRouter);
app.use('/authors',authorsRouter);
app.use('/accounts',accountsRouter);

app.get('/', (req,res)=>{
    res.send("Library Manager API");
});
 
app.listen(port,()=>{
    console.log(`Server started on port ${port}.`);
});