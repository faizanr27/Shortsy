const express = require('express')
const router = express.Router();
const User = require('../models/User.models');
require('dotenv').config

router.get('/',  async(req, res)=>{
    try {
       // const user = await User.find({})
       // console.log(user);
    
        res.json({message:"this is shortsy backend"});
      } catch (err) {
        res.status(500).json({ message: "Server error." });
      }
        
    })

    module.exports = router;
