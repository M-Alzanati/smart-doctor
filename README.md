# Smart Doctor OCR


![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)

Please use the following guid to deploy application, this app using.

# requirements:
  - npm 6.14.8
  - nodejs 12.20.0 
  - Ubuntu os 18.04 LTS
  - Python 3.6.9
  - Flask 1.0.2
  - Mongo 4.4.2
  - Angular 11


### Deploy Angular App:
  - Open directory <web-app> in terminal
```sh
$ npm install @angular/cli
$ npm install
$ ng serve
```

> Now you have a running angular application on port 4200, to open application 
[localhost:4200](http://localhost:4200/)

> open src/environment/environment.ts and change API_URL to flask running url, default is http://localhost:5000;
### Deploy Flask App

We need to install python environement:

* download pyenv : 

```sh
$curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```
* install pyenv : 
```sh 
$ pyenv install 3.6.4 && pyenv global 3.6.4 
$ export PATH="$(pyenv root)/shims:$HOME/local/bin:$PATH"
$ python -m pip install --user pipenv
```
* open application and create a python evn, notice that a file called Pipfile :
```sh
$ pipenv --three --python=$(pyenv root)/shims/python
```
* install required packages from Pipfile :
```sh
$ pipenv install
```
* To run flask app :
```sh
FLASK_APP=$PWD/app.py FLASK_ENV=development pipenv run python -m flask run
```

you can find some images that are ready for ocr analysis under images folder.

#### please find .env file that contains general configuration to run flask app, change them if you have other configuration :
```
MAIL_USERNAME="your gmail user name"
MAIL_PASSWORD="your gmail password"
MONGO_URL="mongodb://localhost:27017/"
FRONT_END_URL="localhost:4200/"
```
License
----

MIT
 [My Email]: mohamed.h.alzanaty@gmail.com
