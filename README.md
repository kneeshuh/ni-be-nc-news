# Northcoders News API

To create the correct environment variables and run the project locally:
#1 Look in the setup.sql file to find the relevant database names
#2 Create two .env files - one for testing, and one for development purposes
#3 In .env.development write in: PGDATABASE=name_of_database (found in setup.sql file)
#4 In .env.test write in: PGDATABASE=name_of_database_test
#5 In the .gitignore file add .env.* to ensure you don't push these variables to GitHub.