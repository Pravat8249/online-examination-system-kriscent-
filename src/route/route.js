const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth')
const {authrize} = require('../middleware/adminAuthrize')
const {createAdmin , loginAdmin , createQues , updateQues} = require('../controller/adminController');
const {createUser , loginUser,viewExam , ansQues} = require('../controller/userController');

//admin
router.post('/createAdmin',createAdmin)
router.post('/loginAdmin',loginAdmin)
router.post('/createQues/:adminId',auth,authrize,createQues)
router.put('/updateQues/:adminId/:quesId',auth,authrize,updateQues)

//user
router.post('/createUser',createUser)
router.post('/loginUser',loginUser)
router.get('/viewExam',auth,viewExam)
router.get('/ansQues/:quesId',auth,ansQues)



module.exports = router;