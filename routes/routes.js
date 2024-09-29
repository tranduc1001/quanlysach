const express = require("express");
const router = express.Router();
const Book = require('../models/books');
const multer = require('multer');
const fs = require("fs");


var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./upload')
    },
    filename: function(req, file, cb){
        cb(null, file.fiedname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

router.post("/add", upload, (req, res) =>{
    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        price: req.body.price,
        image: req.file.filename,
    });
    book.save()
        .then(() =>{
            req.session.message = {
                type: "success",
                message: "Sách được thêm mới thành công!",
            };
            res.redirect("/");
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger'});
        });
});

router.get("/add", (req,res) =>{
    res.render("add_books", {title: "Add Books"});
})

router.get("/", (req, res) =>{
    Book.find()
           .exec()
           .then(books =>{
            res.render('index', {
                title:'Home Page',
                books: books,
            });
        })
        .catch(err => {
            res.json({message: err.message});
        });
});

router.get("/edit/:id", (req,res) =>{
    let id = req.params.id;
    Book.findById(id)
        .then(book =>{
            if(book == null){
                res.redirect("/");
            }else {
                res.render("edit_books",{
                    title: "Update Book",
                    book: book,
                });
            }
        })
        .catch(err =>{
            res.redirect("/");
        });
});

router.post("/edit/:id", upload, async(req, res) =>{
    try{
        let id = req.params.id;
        let new_image ="";
        if(req.file) {
            new_image = req.file.filename;
            try{
                fs.unlinkSync("./upload/", + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        }else{
            new_image = req.body.old_image;
        }
        const result = await Book.findByIdAndUpdate(id, {
            name:req.body.name,
            author:req.body.author,
            price:req.body.price,
            image: new_image,
        });

        req.session.message ={
            type: 'success',
            mesage: 'Sách đã được cập nhật!'
        };
        res.redirect('/')
    }   catch(err){
        res.json({ message:err.message, type:'danger'});
    }
});
router.get("/delete/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const result = await Book.findByIdAndDelete(id);

        if (result.image != "") {
            try {
                fs.unlinkSync("./upload/", + result.image);
            } catch (err) {
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "Đã xóa thành công"
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;

