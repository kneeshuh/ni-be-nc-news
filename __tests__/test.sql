\c nc_news_test

-- INSERT INTO comments (author, body, article_id) VALUES ('username', 'comment text', 2)
-- RETURNING *

-- DELETE FROM users WHERE username = 'username'
-- SELECT * FROM users
-- INSERT INTO users (username, name) VALUES ('username', 'username') RETURNING *
INSERT INTO comments (author, body, article_id) VALUES ('username', 'comment text', 2) RETURNING *

-- What I'm trying to insert doesn't exist on the users table (i.e. 'username' is not a user)
-- Need to add to users table before being able to add a comment?
-- Use joins for that?