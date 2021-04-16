const express = require('express');
const authorsRouter = express.Router();
const AuthorData = require('../model/Database').AuthorData;

router = (verifyToken)=>{
    authorsRouter.get('/', (req,res)=>{
        AuthorData.find()
        .then((authors)=>{
            res.send(authors);
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send("Database access error");
        });
    });

    authorsRouter.post('/add-author',verifyToken, (req,res)=>{
        let newAuthor = req.body;
        if(newAuthor.img.data){
            try{
                imgBase64 = newAuthor.img.data.split(',')[1];
                imgBin = Buffer.from(imgBase64, 'base64');
                newAuthor.img.data = imgBin;
            }
            catch(error){
                console.log(error);
                newAuthor.img.data = '';
                newAuthor.img.contentType = '';
            }
        }
        AuthorData(newAuthor).save()
        .then(()=>{
            res.send();
        });
    });

    authorsRouter.get('/edit/:id', verifyToken, (req,res)=>{
        let authorId = req.params.id;
        AuthorData.findById(authorId)
        .then((author)=>{
            if(author) res.send(author);
            else throw Error('Author not Found');
        })
        .catch((err)=>{
            console.log(err);
            // Handle errors
            res.status(404).send("Not Found");
        });
    });

    authorsRouter.put('/edit/:id', verifyToken, (req,res)=>{
        let authorId = req.params.id;
        let updatedAuthor = req.body;
        if(updatedAuthor.img.data && typeof(updatedAuthor.img.data) == 'string'){
            try{
                imgBase64 = updatedAuthor.img.data.split(',')[1];
                imgBin = Buffer.from(imgBase64, 'base64');
                updatedAuthor.img.data = imgBin;
            }
            catch(err){
                console.log(err);
                updatedAuthor.img.data = '';
                updatedAuthor.img.contentType = '';
            }
        }
        AuthorData.findByIdAndUpdate(authorId, updatedAuthor)
        .then(()=>{
            res.send();
        })
        .catch((err)=>{
            console.log(err);
            // Handle errors
            res.status(500).send("Database write failed");
        });
    });

    authorsRouter.delete('/delete/:id', verifyToken, (req,res)=>{
        let authorId = req.params.id;
        AuthorData.findByIdAndDelete(authorId)
        .then(()=>{
            res.send();
        })
        .catch((err)=>{
            console.log(err);
            // Handle errors
            res.status(500).send("Database operation failed");
        });
    });
    return authorsRouter;
}

module.exports = router;