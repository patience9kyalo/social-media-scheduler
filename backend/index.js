const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/platforms', require('./Routes/platform'));
app.use('/api/posts', require('./Routes/posts'));
app.use('/api/tags', require('./Routes/tags'));

app.get('/', (req, res) => {
    res.send('Hello, Welcome to the Social Scheduler API!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const runScheduler = () => {
    try {

        const duePosts = db.prepare(`
            SELECT * FROM posts
            WHERE status = 'scheduled'
            AND scheduled_time <= CURRENT_TIMESTAMP
            AND scheduled_time >= datetime(CURRENT_TIMESTAMP, '-10 minutes')
        `).all();

        if (duePosts.length > 0) {
            const publish = db.prepare(`
                UPDATE posts SET
                    status         = 'published',
                    published_time = CURRENT_TIMESTAMP,
                    updated_at     = CURRENT_TIMESTAMP
                WHERE id = ?
            `);

            db.transaction(() => {
                for (const post of duePosts) {
                    publish.run(post.id);
                    console.log(`Published post ${post.id}: "${post.title}"`);
                }
            })();
        }

        const overduePosts = db.prepare(`
            SELECT * FROM posts
            WHERE status = 'scheduled'
            AND scheduled_time < datetime(CURRENT_TIMESTAMP, '-10 minutes')
        `).all();

        if (overduePosts.length > 0) {
            const markFailed = db.prepare(`
                UPDATE posts SET
                status     = 'failed',
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);

            db.transaction(() => {
                for (const post of overduePosts) {
                    markFailed.run(post.id);
                    console.log(`Failed post ${post.id}: "${post.title}" was overdue`);
                }
            })();
        }

    } catch (err) {
        console.error('Scheduler error:', err.message);
    }
};

// Run immediately on server start, then every minute
runScheduler();
setInterval(runScheduler, 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});