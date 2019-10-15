
# 22/08/2019 - Alias
https://arunmichaeldsouza.com/blog/aliasing-module-paths-in-node-js

# 22/08/2019 - e2e tests vs unit tests ?
e2e tests:
* Should be for testing status, data returned is correct
unit tests:
* Should be for testing if data registered is correct 
(thus we can test data never returned by API)
* Note: In the current test we check status in e2e and unit tests which is redundant.
We need to clean it

# 22/08/2019 - How to run single .test ?
* Copy the .test path
* Paste it in test-x
* npm run test-x

# 30/07/2019 - How does it work ?

* Push to master
* merge master to deploy/prod
* Push to deploy/prod
* gitlab-ci.yml will run de CI/CD to build + test in Gitlab docker runner
* it will then execute a script called deploy.sh on the server api.switlish.com
* This script will 'npm i' + 'build' on server + pm2 a ecosystem.js
* ecosystem will run 'npm start' with 1 instance on the server with pm2

# How to connect if I don't have any user ?

You need to create an admin user.
With this admin user, you will be able to create new user.
To create an admin user

1/ Open Postman and start this request
POST https://api.backoffice.switlish.com/v2.0/bo/auth/register
{
	"email": "xxxxx@switlish.com",
	"password": "xxxxxxx",
	"firstname": "Switee",
	"lastname": "Switlish"
}
2/ Change manually in mongodb the client to 'admin'
3/ Connect on the platforme with this account
4/ go in admin panel to create new client (not admin)

# How to run it ?
 
1/ Start mongodb

2/ add the .env file

3/ Configure project:

Open *package.json*

- Windows:
3.1/ Edit line *"dev": "npm run windows-dev"*
3.2/ Edit line *"build": "npm run windows-build"*

- MacOS:
3.1/ Edit line *"dev": "npm run macos-dev"*
3.2/ Edit line *"build": "npm run macos-build"*

4/ Run command:
$ npm run dev
*Note:* For Windows users, open cmd as admin to run the command

=> This command do:
+ Create a shortcut to the rigorous code to make files accessible for babel. It also make easier any change code of rigorous easier locally (npm run create-local-rigorous)

Note:
This command does not work because babel ignore node-modules by default:

   "build-rigorous-not-working": "rm -rf node_modules/node-rigorous/lib && mkdir node_modules/node-rigorous/lib && babel node_modules/node-rigorous/src -s -D -d node_modules/node-rigorous/lib",
    
+ init the static data in DB 
+ rebuild the rigorous from the local _rigorous created
+ run dev

Note 1: 
All change in src will be monitored so if you change code in _rigorous, you will need to quit and execute npm run dev again (it is useless to put _rigorous in src to nodemon it because it will not recompile it again (on code changing) to make the change effective)

Note 2: 
if you update you rigorous, you will need to update your local _rigorous by executing:
$ npm i create-local-rigorous@X.X.X
$ npm run dev

# New member ?

1/ Generate keys
Now that you are a member of this project
Generate ssh key user on switlish-backend server.

Name the file: /xxxxx/xxxxx/.ssh/gitlab.xxxxxxxxxx

$  ssh-keygen -o -t rsa -b 4096 -C "email@example.com"

2/ Use it

$ eval $(ssh-agent -s)

$ ssh-add /xxxxx/xxxxx/.ssh/gitlab.xxxxxxxxxx

To avoid rerunning it save this config in: ~/.ssh/config

'''

Host gitlab.com

  Preferredauthentications publickey

  IdentityFile ~/.ssh/gitlab.xxxxxxxxxx

  User replaceyourusernamehere

'''

3/ Sync it with git lab

Then wit copy paste the PUBLIC key (.pub) and add it to your gitlab account to pull, push ....

$ cat /xxxxx/xxxxx/.ssh/gitlab.xxxxxxxxxx.pub

Example:

https://docs.gitlab.com/ee/ssh/#adding-an-ssh-key-to-your-gitlab-account

4/ Test it

ssh -T git@gitlab.com

5/ Setup git push ...

=> Set origin with USERNAME and not git

$ git remote add origin git@gitlab.com:switlish-dev/switlish-backend.git

6/ If trouble with git pull

Run:

$ git config core.sshCommand "ssh -o IdentitiesOnly=yes -i /home/admin_mgmt/.ssh/gitlab.xxxxxxx -F /dev/null"

7/ Check your config 

$ cat .git/config

[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	sshCommand = ssh -o IdentitiesOnly=yes -i /home/admin_mgmt/.ssh/gitlab.xxxxxxxxx -F /dev/null
[branch "master"]
[user]
	name = xxxxxxxxxx
	email = xxxxxxxxxx@gmail.com
[remote "origin"]
	url = git@gitlab.com:switlish-dev/switlish-backend.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master


$ git config --list

user.name=xxxxxx
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true
core.sshcommand=ssh -o IdentitiesOnly=yes -i /home/admin_mgmt/.ssh/gitlab.xxxxxx -F /dev/null
user.name=xxxxxx
user.email=xxxxxxxxxxx@gmail.com
remote.origin.url=git@gitlab.com:switlish-dev/switlish-backend.git
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.master.remote=origin
branch.master.merge=refs/heads/master

# License

ISC
