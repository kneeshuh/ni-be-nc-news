\c nc_news_test

UPDATE articles
SET votes = votes + inc_votes
WHERE article_id = article_id