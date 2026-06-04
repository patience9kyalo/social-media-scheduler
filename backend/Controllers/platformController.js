const db = require('../database')

const getAllPlatforms = async (req, res) => {
    try {
        const platforms = await db.prepare(`
            SELECT p.*, COUNT(posts.id) as post_count
            FROM platforms p
            LEFT JOIN posts ON posts.platform_id = p.id
            GROUP BY p.id
            ORDER BY p.name ASC
        `).all()

        res.json({ success: true, data: platforms })
    } catch (error) {
        console.error('Error fetching platforms:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch platforms' })
    }

}

const getPlatformById = async (req, res) => {
    try {
        const platform = db.prepare(`
            SELECT p.*, COUNT(posts.id) as post_count
            FROM platforms p
            LEFT JOIN posts ON posts.platform_id = p.id
            WHERE p.id = ?
            GROUP BY p.id
        `).get(req.params.id);

        if (!platform) {
            return res.status(404).json({ success: false, error: "Platform not found" });
        }

        res.json({ success: true, data: platform });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const createPlatform = async (req, res) => {
    try {
        const { name, icon, color } = req.body
        if (!name || !icon || !color) {
            return res.status(400).json({ success: false, message: 'Name, icon, and color are required' })
        }

        const result = await db.prepare(
            'INSERT INTO platforms (name, icon, color) VALUES (?, ?, ?)').run(name, icon, color)

        const newPlatform = db.prepare('SELECT * FROM platforms WHERE id = ?').get(result.lastInsertRowid)

        res.status(201).json({ success: true, data: newPlatform })
    } catch (error) {
        console.error('Error creating platform:', error)
        res.status(500).json({ success: false, message: 'Failed to create platform' })
    }
}

const updatePlatform = (req, res) => {
    try {
        const { name, icon, color } = req.body;

        const existing = db.prepare("SELECT * FROM platforms WHERE id = ?").get(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: "Platform not found" });
        }

        db.prepare(`
            UPDATE platforms SET
            name  = COALESCE(?, name),
            icon  = COALESCE(?, icon),
            color = COALESCE(?, color)
            WHERE id = ?
        `).run(name || null, icon || null, color || null, req.params.id);

        const updated = db.prepare(
            "SELECT * FROM platforms WHERE id = ?"
        ).get(req.params.id);

        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }

}


const deletePlatform = (req, res) => {
    try {
        const existing = db.prepare(
            "SELECT * FROM platforms WHERE id = ?"
        ).get(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: "Platform not found" });
        }

        db.prepare("DELETE FROM platforms WHERE id = ?").run(req.params.id);
        res.json({ success: true, message: `Platform ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    getAllPlatforms,
    getPlatformById,
    createPlatform,
    updatePlatform,
    deletePlatform,
};