const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const verifyToken = require('../middleware/auth')

// post all
router.get('/',verifyToken ,async(req,res) => {
    try {
        const posts = await Post.find({user: req.userId}).populate('user',['username'])
        res.json({success: true,posts})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})


/// post user 

router.post('/',verifyToken, async(req,res) => {
    const{title,description,url,status} = req.body


    if(!title)
    return res.status(400).json({success: false,message: 'title is required'})

    try {
        const newPost = new Post({
            title,
            description, 
            url: (url.startsWith('https://')) ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId 
        })

        await newPost.save()

        res.json({success: true, message: 'Happy learning', post: newPost})
    } catch(error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})


// cập nhật
router.put('/:id',verifyToken, async(req,res) => {
    const {title,description,url,status} = req.body
    if(!title)
    return res.status(400).json({success: false,message: 'title is required'})

    try {
        let updatePost = {
            title,
            description: description || '' , 
            url: (url.startsWith('https://')) ? url : `https://${url}` || '',
            status: status || 'TO LEARN',
        }

        const postUpdateCondition = { _id: req.params.id, user: req.userId}

        updatePost = await Post.findByIdAndUpdate(postUpdateCondition, updatePost, {new: true})

        //user not authorised to update post 
        if(!updatePost)
        return res.status(401).json({success: false,message: 'Post not found or user not authorinsed'})

        res.json({success: true, message: 'excellent progress', post: updatePost})

    } catch(error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})


// delete
router.delete('/:id',verifyToken,async(req,res) =>{
    try {
        const postDeleteCondition = {_id: req.params.id, user: req.userId}
        const deletedPost = await Post.findByIdAndDelete(postDeleteCondition)

        // User not authorised or post not found
        if(!deletedPost)
        return res.status(401).json({success: false, message: 'Post not found or user not authorised'})

        res.json({success: true,post: deletedPost})

    } catch(error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})


module.exports = router