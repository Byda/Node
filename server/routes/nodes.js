const express = require('express')
const router = express.Router()
const Node = require('../models/node')

//Getting all
router.get('/', async (req, res) => {
    try {
        const nodes = await Node.find()
        res.json(nodes)
    } catch (error) {
        res.status(400).json({message: err.message})
    }
})
//Getting one
router.get('/:id', (req, res) => {
})
//Creating one
router.post('/', async (req, res) => {
    const node = new Node({
        id: req.body.id,
        value: req.body.value
    })
    try {
        const newNode = await Node.save()
        res.status(201).json(newNode)
    } catch (error) {
        res.status(400).json({message: err.message})
    }
})
//Updating one
router.patch('/', (req, res) => {

})
//Deleting one
router.delete('/:id', (req, res) => {

})


module.exports = router;