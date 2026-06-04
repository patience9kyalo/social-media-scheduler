const db = require("../database");

// GET all posts
const getAllPosts = (req, res) => {       // ← removed async, better-sqlite3 is synchronous
    try {
        const { status, platform_id } = req.query;

        let query = `
      SELECT p.*,
        pl.name  as platform_name,
        pl.icon  as platform_icon,
        pl.color as platform_color,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      JOIN platforms pl ON p.platform_id = pl.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
    `;

        const conditions = [];
        const params = [];

        if (status) { conditions.push("p.status = ?"); params.push(status); }
        if (platform_id) { conditions.push("p.platform_id = ?"); params.push(platform_id); }
        if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

        query += " GROUP BY p.id ORDER BY p.created_at DESC";

        const posts = db.prepare(query).all(...params);
        const formatted = posts.map((p) => ({
            ...p,
            tags: p.tags ? p.tags.split(",") : [],
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// GET single post
const getPostById = (req, res) => {
    try {
        const post = db.prepare(`
      SELECT p.*,
        pl.name  as platform_name,
        pl.icon  as platform_icon,
        pl.color as platform_color,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      JOIN platforms pl ON p.platform_id = pl.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        post.tags = post.tags ? post.tags.split(",") : [];
        res.json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// POST create post
const createPost = (req, res) => {
    try {
        const { title, content, platform_id, status, scheduled_time, tags } = req.body;

        if (!title || !content || !platform_id) {
            return res.status(400).json({
                success: false,
                error: "title, content and platform_id are required",
            });
        }

        const postId = db.transaction(() => {
            const result = db.prepare(`
        INSERT INTO posts (title, content, platform_id, status, scheduled_time)
        VALUES (?, ?, ?, ?, ?)
      `).run(title, content, platform_id, status || "draft", scheduled_time || null);

            const id = result.lastInsertRowid;

            if (tags && Array.isArray(tags)) {
                for (const tagName of tags) {
                    const name = tagName.trim().toLowerCase();
                    if (!name) continue;
                    db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").run(name);
                    const tag = db.prepare("SELECT id FROM tags WHERE name = ?").get(name);
                    db.prepare("INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)").run(id, tag.id);
                }
            }

            return id;
        })();

        const newPost = db.prepare(`
      SELECT p.*, pl.name as platform_name, pl.icon as platform_icon,
             pl.color as platform_color, GROUP_CONCAT(t.name) as tags
      FROM posts p
      JOIN platforms pl ON p.platform_id = pl.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(postId);

        newPost.tags = newPost.tags ? newPost.tags.split(",") : [];
        res.status(201).json({ success: true, data: newPost });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// PUT update post
const updatePost = (req, res) => {
    try {
        const { title, content, platform_id, status, scheduled_time, tags } = req.body;

        const existing = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        db.transaction(() => {
            db.prepare(`
        UPDATE posts SET
          title          = COALESCE(?, title),
          content        = COALESCE(?, content),
          platform_id    = COALESCE(?, platform_id),
          status         = COALESCE(?, status),
          scheduled_time = COALESCE(?, scheduled_time),
          published_time = CASE
            WHEN ? = 'published' THEN CURRENT_TIMESTAMP
            ELSE published_time
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
                title || null,
                content || null,
                platform_id || null,
                status || null,
                scheduled_time || null,
                status || existing.status,   // ← for the CASE check
                req.params.id
            );

            if (tags && Array.isArray(tags)) {
                db.prepare("DELETE FROM post_tags WHERE post_id = ?").run(req.params.id);
                for (const tagName of tags) {
                    const name = tagName.trim().toLowerCase();
                    if (!name) continue;
                    db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").run(name);
                    const tag = db.prepare("SELECT id FROM tags WHERE name = ?").get(name);
                    db.prepare("INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)").run(req.params.id, tag.id);
                }
            }
        })();

        const updated = db.prepare(`
      SELECT p.*, pl.name as platform_name, pl.icon as platform_icon,
             pl.color as platform_color, GROUP_CONCAT(t.name) as tags
      FROM posts p
      JOIN platforms pl ON p.platform_id = pl.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(req.params.id);

        updated.tags = updated.tags ? updated.tags.split(",") : [];
        res.json({ success: true, data: updated });
    } catch (err) {
        console.error('UPDATE POST ERROR:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};

// DELETE post
const deletePost = (req, res) => {
    try {
        const existing = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
        res.json({ success: true, message: `Post ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };