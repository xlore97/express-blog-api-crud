// controllers/postsController.js
// Import "robusto": supporta sia export array diretto che oggetto { post } o { posts }
const rawData = require("../data/posts");

const posts =
    (Array.isArray(rawData) && rawData) ||
    (rawData && Array.isArray(rawData.post) && rawData.post) ||
    (rawData && Array.isArray(rawData.posts) && rawData.posts) ||
    null;

function ensurePosts(res) {
    if (!Array.isArray(posts)) {
        console.error("Data source non è un array. Valore:", rawData);
        res.status(500).json({ error: "Dati post non disponibili" });
        return false;
    }
    return true;
}

// GET /posts
function getAllPosts(req, res) {
    if (!ensurePosts(res)) return;

    const tag = req.query.tags?.toString().trim();
    let result = posts;

    if (tag) {
        result = posts.filter(
            (p) => Array.isArray(p.tags) && p.tags.includes(tag)
        );
    }

    res.json({ data: result, count: result.length });
}

// GET /posts/:id
function getPostById(req, res) {
    if (!ensurePosts(res)) return;

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    const found = posts.find((p) => Number(p.id) === id);
    if (!found) {
        return res.status(404).json({ error: "Post non trovato" });
    }

    res.json({ data: found });
}

// POST /posts
function createPost(req, res) {
    if (!ensurePosts(res)) return;

    const { title, content, image, tags = [] } = req.body || {};
    if (!title || !content) {
        return res.status(400).json({ error: "title e content sono obbligatori" });
    }

    const newId = posts.length ? Math.max(...posts.map((p) => Number(p.id))) + 1 : 1;
    const newPost = {
        id: newId,
        title,
        content,
        image: image || null,
        tags: Array.isArray(tags) ? tags : [],
    };

    posts.push(newPost);
    res.status(201).json({ data: newPost });
}

// PUT /posts/:id (update totale/parziale)
function updatePost(req, res) {
    if (!ensurePosts(res)) return;

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    const idx = posts.findIndex((p) => Number(p.id) === id);
    if (idx === -1) {
        return res.status(404).json({ error: "Post non trovato" });
    }

    const { title, content, image, tags } = req.body || {};
    if (title !== undefined) posts[idx].title = title;
    if (content !== undefined) posts[idx].content = content;
    if (image !== undefined) posts[idx].image = image;
    if (tags !== undefined) posts[idx].tags = Array.isArray(tags) ? tags : posts[idx].tags;

    res.json({ data: posts[idx] });
}

// DELETE /posts/:id
function deletePost(req, res) {
    if (!ensurePosts(res)) return;

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    const idx = posts.findIndex((p) => Number(p.id) === id);
    if (idx === -1) {
        return res.status(404).json({ error: "Post non trovato" });
    }

    posts.splice(idx, 1);
    res.sendStatus(204);
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
