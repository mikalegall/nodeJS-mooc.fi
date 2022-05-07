# NodeJS
https://www.mooc.fi/en/
<br />
--> <b>Full Stack open 2022</b>
<br />
https://fullstackopen.com/en/part3/node_js_and_express

<hr />

        git@github.com:mikalegall/nodeJS-mooc.fi.git
https://github.com/mikalegall/hello-world


    	eval $(ssh-agent -s)
        ssh-add C:/Users/mikalegall/.ssh/id_rsa
        cd react-mooc.fi
        git add README.md
        git commit -m"add git ssh connection"
        git push

<hr />

Heroku-CLI installation for Linux

        dpkg -s apt-transport-https 1>/dev/null 2>/dev/null || \
        (echo "" > /etc/apt/sources.list.d/heroku.list \
        && apt-get update \
        && apt-get install -y apt-transport-https)

        sudo chown -R MY_LINUX_PROFILE_USERNAME "deb https://cli-assets.heroku.com/apt ./" > /etc/apt/sources.list.d/heroku.list

        (dpkg -s heroku-toolbelt 1>/dev/null 2>/dev/null && (apt-get remove -y heroku-toolbelt heroku || true)) || true
        
        curl https://cli-assets.heroku.com/apt/release.key -O- | sudo apt-key add -

        sudo apt-get update

        sudo apt-get install -y heroku

        heroku --version

<br />
<br />

        heroku create // Generates some random name e.g. 'mikalegallbackend'
        git init
        nano .gitignore
                # Dependency directories
                node_modules/
        git add .
        git config user.email "lorem.ipsus@foo.bar"
        git commit -m"init"
        heroku git:remote -a mikalegallbackend // Generated random name 'mikalegallbackend'
        git push heroku master // git push heroku main

        heroku logs -t // tail


https://mikalegallbackend.herokuapp.com/api/persons

Set environment variable

        heroku config:set MONGODB_URI='mongodb+srv://USERNAME:PASSWORD@nodejs.uvgnh.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority'