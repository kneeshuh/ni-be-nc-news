\c nc_news_test


-- SELECT * FROM articles WHERE topic = topic; <-- gets all articles that have a topic

-- SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
-- LEFT JOIN comments on comments.article_id = articles.article_id
-- WHERE articles.article_id = 2
-- GROUP BY articles.article_id;

SELECT * FROM comments;