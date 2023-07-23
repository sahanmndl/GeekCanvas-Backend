import express from "express";
import {
    addBlog,
    addBlogSubscriber,
    deleteAllBlogs,
    deleteBlog,
    getBlogById,
    getBlogs,
    getScheduledBlogs,
    updateBlog
} from "../controllers/BlogController.js";

const blogRouter = express.Router()

blogRouter.get('/getBlogs', getBlogs)
blogRouter.get('/getScheduledBlogs', getScheduledBlogs)
blogRouter.post('/addBlog', addBlog)
blogRouter.put('/updateBlog', updateBlog)
blogRouter.delete('/deleteBlog/:id', deleteBlog)
blogRouter.get('/getBlog/:id', getBlogById)
blogRouter.post('/addBlogSubscriber', addBlogSubscriber)
blogRouter.post('/deleteAllBlogs', deleteAllBlogs)

export default blogRouter