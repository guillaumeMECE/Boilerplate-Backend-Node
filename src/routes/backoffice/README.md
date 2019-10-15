How to run on a server ?
1/ git pull
2/ create .env
3/ npm run dev
4/ Create Useradmin (the frontend wil display the admin panel for all Client with ' role)
Create a user with postman /bo/auth/register
5/ Edit DIRECTLY in MONGODB the role of the Client -> xxxx.role = 'admin'
