\c nc_news_test

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
LEFT JOIN comments on comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;