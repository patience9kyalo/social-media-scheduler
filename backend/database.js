const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.db'));
db.pragma('journal_mode = WAL');

db.exec(`

    CREATE TABLE IF NOT EXISTS platforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS post_tags;
    
    CREATE TABLE IF NOT EXISTS posts (

        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'published', 'failed')),
        scheduled_time DATETIME,
        published_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );


`);


const count = db.prepare('SELECT COUNT(*) AS c FROM platforms').get();
if (count.c === 0) {
    const insert = db.prepare('INSERT INTO platforms (name, icon, color) VALUES (?, ?, ?)');
    
    db.transaction(() => {
        insert.run('Twitter', 'twitter.png', '#1DA1F2');
        insert.run('Facebook', 'facebook.png', '#1877F2');
        insert.run('Instagram', 'social.png', '#E4405F');
        insert.run('LinkedIn', 'linkedin.png', '#0077B5');
    })();
}

module.exports = db;