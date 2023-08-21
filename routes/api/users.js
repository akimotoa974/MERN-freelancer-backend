const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mongoose = require("mongoose");
const uuidv4 = require("uuid/v4");

const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateTaskpostinput = require("../../validation/ticketpost");
const validateBidpostinput = require("../../validation/bidpost");

// used by me
const Tickets = require('../../models/Tickets');
const Bids = require('../../models/Bids');
const Leaders = require('../../models/Leader');
const Avatars = require('../../models/Avatar');
const AuthUser = require("../../models/AuthUser");
const AvatarRequests = require("../../models/AvatarRequests");



// freelancer register
router.post("/auth/register", (req,res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    AuthUser.findOne({ user_skypeid: req.body.user_skypeid }).then(user => {
        if (user) {
            return res.status(400).json({ user_id: "User Id already exists"});
        } else {
            const newUser = new AuthUser({
                user_id: "",
                user_skypeid: req.body.user_skypeid,
                access: "false",
                password: "",
            });
            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
    
        }
    });
});

// freelancer login
router.post("/auth/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const UserId = req.body.user_id;
    var UserName = "";
    AuthUser.findOne({password: UserId}).then(user => {
        if(!user) {
            return res.status(404).json({ Usernotfound: "User not found"});
        }
        if(user.access != "true") {
            errors.role = "your account is inactive";
            return res.status(401).json(errors);
        }
        UserName = user.user_id;

        res.json({
            id:user.user_id,
            sucess:true,
        });
        Leaders.findOne({ Leader_id: UserId }).then(user => {
            if(user) {
                return ;
            }
            else {
                const newLeader = new Leaders({
                    Leader_id: UserId,
                    Leader_Name: UserName,
                    Leader_budget : 0,
                    Leader_success: 0,
                    Leader_avatar: "http://localhost:3000/images/contact.png",
                });
                newLeader
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
            }
        })
    })
  
});

const reqFiles = [];
// client ticket post
router.post("/ticket/post", (req,res) => {
   
    const { errors, isValid } = validateTaskpostinput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    var uploadurl = ['none'];
    if(reqFiles[0])
        uploadurl = reqFiles;
    console.log(uploadurl + " uploadurl        " + typeof(uploadurl));
    Tickets.findOne({ ticket_name: req.body.ticket_name , ticket_description: req.body.ticket_description }).then(ticket => {
        if (ticket) {
            return res.status(400).json({ email: "That Ticket already exists"});
        } 
        else {
            const newticket = new Tickets({
                ticket_name: req.body.ticket_name,
                ticket_description: req.body.ticket_description,
                ticket_price: req.body.ticket_price,
                ticket_deadline: req.body.ticket_deadline,
                ticket_skills: req.body.ticket_skills,
                ticket_upload: uploadurl,
                ticket_status: "Not Assigned",
                ticket_winner: "none",
                ticket_budget: 0,
                feedback: "",
                review:"",
            });

            newticket
                .save()
                .then(ticket => res.json(ticket))
                .catch(err => console.log(err));
        }
    });
});

// client view all tickets
router.get("/admin/tickets", (req, res) => {
    Tickets.find()
        .then(tickets => {
            res.json(tickets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving tickets "
            })
        })
})

//  freelancer view all tickets.
router.get("/freelancer/tickets", (req, res) => {
    Tickets.find()
        .then(tickets => {
            res.send(tickets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving tickets "
            })
        })
})

//pagination tickets view
router.post("/get/tickets" , (req, res) => {
    var pagenum = Number(req.body.pagenum);
    var pagesize = Number(req.body.pagesize);
    var start = (pagenum - 1) * pagesize;
    var result1 = {};
    var j = 0 ;
    Tickets.find().then(tickets => {
        for(var i = start ; i <= start+pagesize-1 ; i ++)
        {

            result1[j] = tickets[i];
            j ++;
        }
        res.send(result1);
    })
})

// freelancer get selected ticket information
router.get("/freelancer/tickets/:id", (req, res) => {
    Tickets.findOne({ _id: req.params.id })
        .then(tickets => {
            res.send(tickets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving tickets "
            })
        })

})

// freelancer get selected task biders
router.get("/freelancer/biders/:id" , (req, res) => {

    Bids.find({ ticket_id: req.params.id }).then( biders => {
        res.send(biders);
    }) 
    .catch(err => {
        res.status(500).send( {
            message: err.message || "some error occured while retrieving bids"
        })
    })
})

// freelancer can bid 
router.post("/freelancer/bid" , (req, res) => {

    const { errors, isValid } = validateBidpostinput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Bids.findOne({ ticket_id: req.body.ticket_id , bider_id: req.body.bider_id }).then(bid => {
        if (bid) {
            return res.status(400).json({ user_id: "You already bidded"});
        } else {
            const newBid = new Bids({
                ticket_id: req.body.ticket_id,
                bid_price: req.body.bid_price,
                bid_description: req.body.bid_description,
                bid_deadline: req.body.bid_deadline,
                bider_id: req.body.bider_id,
                bider_url: req.body.bider_url,
            });
            newBid
                .save()
                .then(Bids => res.json(Bids))
                .catch(err => console.log(err));
    
        }
    });

})

// freelancers can view 5 leaders 
router.get("/get/leaders" , (req, res) => {
    Leaders.find().sort({Leader_budget: -1}).limit(5)
    .then(biders => {
        res.send(biders);
    })
    .catch(err => {
        res.status(500).send( {
            message: err.message || "some error occured while retrieving bids"
        })
    })
       
})

// Insert avatars
router.post("/insert/avatars" , (req, res) => {
    Avatars.findOne({ ava_url : req.body.ava_url }).then(avatar => {
        if(avatar) {
            return res.status(400).json("That avatar is already exist");
        }
        else {
            const newAvatar = new Avatars({
                ava_url: req.body.ava_url ,
                ava_status: 0 ,
                ava_budget: req.body.ava_budget ,
                user_id: "",
                ava_level: req.body.ava_level,
            });
            newAvatar
                .save()
                .then(avatars => res.json(avatars))
                .catch(err => console.log(err));
        }
    })
})

// GET all avatars
router.get("/get/avatars" , (req, res) => {
    Avatars.find().then(avatar => {
        res.send(avatar);   
    });
})

//  get current users avatar 
router.get("/get/avatars/:id" , (req, res) => {
    Leaders.findOne({Leader_Name: req.params.id}).then(result => {
        res.send(result);
    })
    .catch(err=>res.send(err));
})

// Avatar Request from freelancers 

router.post("/sell/avatar" ,(req, res) => {
    console.log(req.body.avatar_url + req.body.request_id);
    var condition = {$and:[{Avatar_url: req.body.avatar_url} , {request_id: req.body.request_id}]};
    AvatarRequests.findOne(condition)
    .then(user => {
        if (!user) {
            // res.status(400).send("you are already requested");
            const newAvatarRequest = new AvatarRequests({
                Avatar_url: req.body.avatar_url ,
                request_id: req.body.request_id ,
                status: "false",
            });
            newAvatarRequest
                .save()
                .then(avatars => res.json(avatars))
                .catch(err => console.log(err));
        }
        else {
            res.status(400).send("you are already requested");
        }
    })
})


// when admin clicked true btn about avatar request

router.post("/permission/avatar", (req, res)=> {
    const filter = {$and:[ { Avatar_url: req.body.avatar_url  }, {request_id: req.body.request_id}]};
    var update = { $set: {status: "true"} };
    let doc =AvatarRequests.updateOne(filter, update , function(err, result) {
        if(err) 
            throw err;
        else {
            var condition = { Leader_Name: req.body.request_id };
            var newvalues = { $set: {Leader_avatar: req.body.avatar_url} };
            Leaders.updateOne(condition, newvalues , function(err1, res1) {
                if(err1) throw err1;
                else {
                    var condition1 = {ava_url: req.body.avatar_url};
                    var newvalues1 = {$set:{ava_status: 1}};
                    Avatars.updateOne(condition1 , newvalues1 , function(err2 , res2) {
                        if(err2) throw err2;
                        res.send(res2);
                    })
                }
            })
        }
    });
})


// get all document in tickets table 

router.get("/get/cnttickets", (req,res) => {
    Tickets.find().then(result => {
      var count = result.length;
      res.status(200).json(count);
    });
})


// Award the bider to task 

router.post("/award/ticket" , (req, res) => {
    const filter = { _id : req.body.ticket_id };
    var update = { $set: {ticket_status:"Assigned" , ticket_winner: req.body.bider_id , ticket_budget: req.body.bider_price , winner_avatar: req.body.bider_url , winner_deadline: req.body.bider_deadline }};
    let doc = Tickets.updateOne(filter , update , function(err , result) {
        if(err) 
            throw err;
        else
            res.send(result);
    });
})


// Select changed (Complete , InComplete) then updated status and insert leaders.leader_success and leaders.leader_budget

router.post("/status/changed", (req, res) => {
    const filter = { _id: req.body._id };
    var update = { $set: {ticket_status: req.body.value }};
    let doc = Tickets.updateOne(filter, update , function(err , result) {
        if(err)
            throw err;
        else {
            var donecnt = 0;
            var nocnt = 0;
            var budget = 0;
            var success = 0;
            Tickets.find({ticket_winner: req.body.user}).then(result1 => {
                for(var i = 0 ; i < result1.length ; i++){
                    if(result1[i].ticket_status == "Complete") {
                        budget = budget + result1[i].ticket_budget;
                        donecnt = donecnt + 1;
                    }
                    else if(result1[i].ticket_status == "InComplete") {
                        nocnt = nocnt + 1;
                    }
                }
                success = (donecnt / (donecnt + nocnt)) * 100;
                const filter1 = { Leader_Name : req.body.user };
                var update1 = { $set: {Leader_budget: budget , Leader_success: success }};
                let doc1 = Leaders.updateOne(filter1 , update1 , function(err1 , result1) {
                    res.send(result1);
                })
            })
        }
    });
})


//  selected avatar requests list view for admin user

router.post("/view/asklist" , (req, res) => {
    console.log(req.body.id);
    AvatarRequests.find({Avatar_url : req.body.id}).then(result=>{
        console.log("view ask list result" + result[0]);
        res.send(result);
    })
})



const DIR = './public'; 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (_req, file, cb) => {
        cb(null, true);
    }
});

// file upload part

router.post('/upload-images', upload.array('imgCollection', 36), (req, res, next) => {
    console.log("this is receivedd file" + req.files);

    if (req.files.length == 0) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
      }
    const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + '/public/' + req.files[i].filename)
    }
    res.send(reqFiles);

})

// admin can left freelancer's review and rating
router.post("/submit/result" , (req, res)=> {
    console.log(req.body.id + req.body.feedback + req.body.review);
    const filter = { _id: req.body.id };
    var update = { $set: {feedback: req.body.feedback , review: req.body.review }};
    let doc = Tickets.updateOne(filter, update , function(err , result) {
        res.send(result);
    })
});


//  admin can get all freelancers 
router.get("/get/freelancers" , (req, res) => {
    AuthUser.find().then(result=> {
        res.send(result);
    })
})

// admin update Authuser's data
router.post("/update/Authuser", (req, res) => {
    console.log(req.body._id + req.body.access + req.body.user_id);
    const filter = { _id: req.body._id };
    var update = {$set: {access: req.body.access , user_id: req.body.user_id , password: req.body._id }};
    let doc = AuthUser.updateOne(filter, update , function(err , result) {
        res.send(result);
    })
})

module.exports = router;