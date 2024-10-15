const User = require('../models/user.js');
const Transaction = require('../models/transaction.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


exports.backendLogin = async function (req, res) {
// DB abfragen 
 const access = await User.findOne({ username: req.body.username, password:req.body.password  });
    if (!access || access.role !== 'admin') {
      return res.redirect('/');
    }
  const insertInTrans = new Transaction({
      action: 'Backend',
    });
await insertInTrans.save();

if (access.role === 'admin') {
      req.session.permission = 'admin';
      req.session.user = access;
      res.redirect('/backend')
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/'); // Bei einem Fehler ebenfalls umleiten
  }
  };

