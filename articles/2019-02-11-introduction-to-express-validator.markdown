---
layout: post
title: "Introduction to Express-Validator"
description: "This article introduces the reader to server-side validation with express-validator which is a set of middlewares with function to perform validation on user data"
date: "2019-02-11 08:30"
author:
  name: "Vladimir Fomene"
  url: "vladimirfomene"
  mail: "vladimirfomene@gmail.com"
  avatar: "https://twitter.com/vladimirfomene/profile_image?size=original"
related:
- 2017-11-15-an-example-of-all-possible-elements
---

**TL;DR:** In this article you will learn how to validate and sanitize data in your Express.js
server-side application using a set of middlewares called [Express-Validator](https://express-validator.github.io/docs/). You will do so, by building a demo application that takes in user input and validates/sanitizes it using
Express-Validator. If you want to see the complete demo application take the look at the following GitHub repository:
[Expressjs-Validator](https://github.com/vladimirfomene/expressjs-validator)

## Prerequisites

Softwares you need to install to follow the tutorial:

* Node.js and npm (node package manager). Node.js v8.13.0 was used for this tutorial.
* Any text editor or IDE of your choice.

## What is Express-Validator?

According to the [official site](https://express-validator.github.io/docs/), express-validator is a set of [Express.js](http://expressjs.com/) middlewares that wraps [validator.js](https://github.com/chriso/validator.js) validator and sanitizer functions. Simply said, Express-Validator is a JavaScript library that can be incorporated in Express.js for server-side validation.

### Why do we need server-side validation anyway?

* Data coming from the client cannot always be trusted because it could have been compromised by an untrusted client (man-in-the-middle attack).
* A malicious user might disable JavaScript in their browser so as to submit bogus data to the server. Therefore, front-end validation is not enough.

>**Note:** Although you can declare your validation while declaring your application models, it is preferable to add validation in your application logic because it minimizes the round trips made to the database server and provides more responsive feedback to the user.




## Setup your playground for express-validator

To start playing with Express-Validator, open your terminal in a preferred directory and clone the skeleton code with the following command:

```bash
git clone https://github.com/vladimirfomene/expressjs-validator-starter.git
```
This is a simple Express.js application that does not do much apart from setting up an empty javascript file, routes and empty view templates. In this project, `views/index.js` represent our homepage and is rendered with the code in `routes/index.js`. There is also an empty route file `routes/users.js` which is where all our validation code will go. To setup for handling user interaction and AJAX, there is an empty JS file in `public/script.js`. The `app.js` file mounts the route files, setup the port on which the server will be listening on, sets up the templating engine [Pug](https://pugjs.org/api/getting-started.html) and tells Express.js where to find your JavaScript files.

## Build form for user input
* Build homepage with form to be validated.
* Add jQuery for handling interaction and AJAX.

## Server-side validation with express-validator
* Install express-validator
* Setup routes for `/` and `/users`.

### Validating Name field
* validate the field and test it.

### Validating Class Year field
* validate the field and test it.

### Validating Weekday field
* validate the field and test it.

### Validating email field
* validate the field and test it.

### Validating password fields
* validate the field and test it.


## Conclusion
* Remind the reader what he/she learned in the article.
* Expose them to other functionalities offered by express validator and point them to resources for further reading.
