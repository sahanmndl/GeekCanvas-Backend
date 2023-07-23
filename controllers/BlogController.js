import {convertDateToUnix} from "../utils/HelperFunctions.js";
import Blog from "../models/Blog.js";
import BlogSubscriber from "../models/BlogSubscriber.js";

export const getBlogs = async (req, res, next) => {
    try {
        const currentTime = convertDateToUnix(new Date())
        const blogs = await Blog.find({})
        const filteredBlogs = blogs.filter((blog) => {
            return blog.scheduledTime <= currentTime
        })
        return res.json({blogs: filteredBlogs})
    } catch (e) {
        return res.json({error: e})
    }
}

export const getScheduledBlogs = async (req, res, next) => {
    try {
        const currentTime = convertDateToUnix(new Date())
        const blogs = await Blog.find({})
        const filteredBlogs = blogs.filter((blog) => {
            return blog.scheduledTime > currentTime
        })
        return res.json({blogs: filteredBlogs})
    } catch (e) {
        return res.json({error: e})
    }
}

export const addBlog = async (req, res, next) => {
    try {
        const {
            title,
            content,
            metaTitle,
            metaDesc,
            pic,
            author,
            authorPic,
            tags,
            readMinutes,
            scheduled,
            scheduledTime
        } = req.body

        let blog = new Blog({
            title,
            content,
            metaTitle,
            metaDesc,
            pic,
            author,
            authorPic,
            tags,
            readMinutes,
            scheduled,
            scheduledTime
        })
        await blog.save()
        return res.json({blog})
    } catch (e) {
        return res.json({error: e})
    }
}

export const updateBlog = async (req, res, next) => {
    try {
        const {
            id,
            title,
            content,
            metaTitle,
            metaDesc,
            pic,
            author,
            authorPic,
            tags,
            readMinutes,
            scheduled,
            scheduledTime
        } = req.body
        const blog = await Blog.findById(id)

        if (!blog) {
            return res.json({error: "Blog not found!"})
        }

        if (title) blog.title = title
        if (content) blog.content = content
        if (metaTitle) blog.metaTitle = metaTitle
        if (metaDesc) blog.metaDesc = metaDesc
        if (pic) blog.pic = pic
        if (author) blog.author = author
        if (authorPic) blog.authorPic = authorPic
        if (tags) blog.tags = tags
        if (readMinutes) blog.readMinutes = readMinutes
        if (scheduled) blog.scheduled = scheduled
        if (scheduledTime) blog.scheduledTime = scheduledTime

        await blog.save()
        return res.json({blog})
    } catch (e) {
        return res.json({error: e})
    }
}

export const deleteBlog = async (req, res, next) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({error: "Blog not found!"});
        }

        await blog.remove();
        return res.json({message: "Blog deleted successfully"});
    } catch (e) {
        return res.json({error: e});
    }
}

export const deleteAllBlogs = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        if (username !== 'admin' || password !== 'admin12345') {
            return res.json({error: "Invalid username or password"});
        }

        const deleteResult = await Blog.deleteMany({});
        if (deleteResult.deletedCount === 0) {
            return res.json({message: "No blogs found"});
        }

        return res.json({message: "All blogs deleted successfully"});
    } catch (e) {
        return res.json({error: e});
    }
}

export const getBlogById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({error: "Blog not found!"});
        }

        return res.json({blog});
    } catch (e) {
        return res.json({error: e});
    }
}

export const addBlogSubscriber = async (req, res, next) => {
    try {
        const {email} = req.body
        let subscriber = new BlogSubscriber({email})
        await subscriber.save()
        return res.json({subscriber})
    } catch (e) {
        return res.json({error: e})
    }
}

// export const addEditorialContact = async (req, res, next) => {
//     try {
//         const {name, email, subject, message} = req.body
//         let contact = new EditorialContact({name, email, subject, message})
//         await contact.save()
//         return res.json({contact})
//     } catch (e) {
//         return res.json({error: e})
//     }
// })