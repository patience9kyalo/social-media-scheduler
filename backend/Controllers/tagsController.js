const db = require("../database");

const getAllTags = (req, res) => {
  try {
    const tags = db.prepare(`
      SELECT t.*, COUNT(pt.post_id) as post_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      GROUP BY t.id
      ORDER BY t.name ASC
    `).all();

    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET single tag + all posts that use it
const getTagById = (req, res) => {
  try {
    const tag = db.prepare("SELECT * FROM tags WHERE id = ?").get(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, error: "Tag not found" });
    }

    const posts = db.prepare(`
      SELECT p.*, pl.name as platform_name, pl.icon as platform_icon
      FROM posts p
      JOIN post_tags pt ON p.id = pt.post_id
      JOIN platforms pl ON p.platform_id = pl.id
      WHERE pt.tag_id = ?
    `).all(req.params.id);

    res.json({ success: true, data: { ...tag, posts } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const deleteTag = (req, res) => {
  try {
    const existing = db.prepare("SELECT * FROM tags WHERE id = ?").get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Tag not found" });
    }

    db.prepare("DELETE FROM tags WHERE id = ?").run(req.params.id);
    res.json({ success: true, message: `Tag ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllTags, getTagById, deleteTag };