import {convertDateToUnix, convertToLowerCase, initializeTrie} from "../utils/HelperFunctions.js";
import Blog from "../models/Blog.js";
import BlogSubscriber from "../models/BlogSubscriber.js";

let trie = null

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

        if (trie !== null) {
            trie.insert(blog.title, blog._id)
        }

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

        if (trie !== null) {
            trie.insert(blog.title, id)
        }

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

        if (trie !== null) {
            trie.remove(blog.title, blog._id)
        }

        const result = await Blog.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.json({ error: "Blog not found!" });
        }

        return res.json({message: "Blog deleted successfully"});
    } catch (e) {
        console.error(e)
        return res.json({error: "Cannot delete blog"});
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

export const updateBlogClickCount = async (req, res, next) => {
    try {
        const {id} = req.body
        const blog = await Blog.findById(id)

        if (!blog) {
            return res.json({error: "Blog not found!"})
        }

        blog.allTimeClickCount += 1
        blog.last24hClickCount += 1

        await blog.save()
        return res.json({blog})
    } catch (e) {
        return res.json({error: e})
    }
}

export const resetLast24hClickCounts = async (req, res, next) => {
    try {
        await Blog.updateMany({}, { $set: { last24hClickCount: 0 } });
    } catch (e) {
        return res.json({error: e})
    }
}

export const getAllTimeTrendingBlogs = async (req, res, next) => {
    try {
        const topBlogs = await Blog.find({}).sort({allTimeClickCount: -1}).limit(4)
        return res.json({blogs: topBlogs})
    } catch (e) {
        return res.json({error: e})
    }
}

export const getDailyTrendingBlogs = async (req, res, next) => {
    try {
        const topBlogs = await Blog.find({}).sort({last24hClickCount: -1}).limit(5)
        return res.json({blogs: topBlogs})
    } catch (e) {
        return res.json({error: e})
    }
}

export const getSearchSuggestions = async (req, res, next) => {
    try {
        if (!trie) {
            trie = await initializeTrie()
        }

        const suggestions = trie.recommend(convertToLowerCase(req.params.prefix))

        return res.json({suggestions: suggestions})
    } catch (e) {
        return res.json({error: e})
    }
}