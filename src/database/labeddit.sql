-- Active: 1692971309047@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT('NORMAL') NOT NULL,
        create_at TEXT DEFAULT(datetime('now')) NOT NULL
    );

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    comments INTEGER DEFAULT (0) NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    create_at TEXT DEFAULT(datetime('now')) NOT NULL,
    update_at TEXT DEFAULT(datetime('now')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id) 
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE comments_posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    create_at TEXT DEFAULT(datetime('now')) NOT NULL,
    update_at TEXT DEFAULT(datetime('now')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE likes_dislikes_posts (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (post_id) References posts (id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE likes_dislikes_comments(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    comment_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (post_id) References posts (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments_posts (id)
    ON UPDATE CASCADE ON DELETE CASCADE
);


PRAGMA table_info (users);
SELECT * FROM users;
DROP TABLE users;

PRAGMA table_info (posts);
SELECT * FROM posts;
DROP TABLE posts;

PRAGMA table_info (comments_posts);
SELECT * FROM comments_posts;
DROP TABLE comments_posts;

PRAGMA table_info (likes_dislikes_posts);
SELECT * FROM likes_dislikes_posts;
DROP TABLE likes_dislikes_posts;

PRAGMA table_info (likes_dislikes_comments);
SELECT * FROM likes_dislikes_comments;
DROP TABLE likes_dislikes_comments;

