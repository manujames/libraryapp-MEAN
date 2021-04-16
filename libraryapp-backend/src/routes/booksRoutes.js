const express = require('express');
const booksRouter = express.Router();
const BookData = require('../model/Database').BookData;

router = (verifyToken)=>{
    booksRouter.get('/', (req,res)=>{
        BookData.find()
        .then((books)=>{
            res.send(books);
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send("Database access error");
        });
    });

    booksRouter.post('/add-book', verifyToken, (req,res)=>{
        let newBook = req.body;
        if(newBook.img.data){
            try{
                imgBase64 = newBook.img.data.split(',')[1];
                imgBin = Buffer.from(imgBase64, 'base64');
                newBook.img.data = imgBin;
            }
            catch(err){
                console.log(err);
                newBook.img.data = '';
                newBook.img.contentType = '';
            }
        }
        BookData(newBook).save()
        .then(()=>{
            res.send();
        });
    });

    booksRouter.get('/edit/:id', verifyToken, (req,res)=>{
        let bookId = req.params.id;
        BookData.findById(bookId)
        .then((book)=>{
            if(book) res.send(book);
            else throw Error('Book not Found');
        })
        .catch((err)=>{
            console.log(err);
            // Handle errors
            res.status(404).send("Not Found");
        });
    });

    booksRouter.put('/edit/:id', verifyToken, (req,res)=>{
        let bookId = req.params.id;
        let updatedBook = req.body;
        if(updatedBook.img.data && typeof(updatedBook.img.data) == 'string'){
            try{
                imgBase64 = updatedBook.img.data.split(',')[1];
                imgBin = Buffer.from(imgBase64, 'base64');
                updatedBook.img.data = imgBin;
            }
            catch(err){
                console.log(err);
                updatedBook.img.data = '';
                updatedBook.img.contentType = '';
            }
        }
        BookData.findByIdAndUpdate(bookId, updatedBook)
        .then(()=>{
            res.send();
        })
        .catch((err)=>{
            console.log(err);
            // Handle errors
            res.status(500).send("Database write failed");
        });
    });

    booksRouter.delete('/delete/:id', verifyToken, (req,res)=>{
        let bookId = req.params.id;
        BookData.findByIdAndDelete(bookId)
        .then(()=>{
            res.send();
        })
        .catch((err)=>{
            console.log(err);
            // Handle errors
            res.status(500).send("Database operation failed");
        });
    });
    return booksRouter;
}

module.exports = router;