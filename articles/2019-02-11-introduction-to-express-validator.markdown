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

To enable users to enter data in your app, you need to build a page with a form for users to enter their data. This page will serve as our homepage where users will enter their data. Currently, our layout file `views/layout.pug` is empty. To create a layout we will add the following code to it.

```pugjs
doctype html
html
  head
    title Express-Validator
    link(rel='stylesheet', href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css',integrity='sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS', crossorigin='anonymous')
    style.
      nav {
        margin-bottom: 20px;
      }
  body
    nav(class='navbar navbar-dark bg-primary')
      a(class='navbar-brand', href='#') Express Validator
    block content
    script(src="https://code.jquery.com/jquery-3.3.1.min.js", integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=", crossorigin="anonymous")
    script(src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js", integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut", crossorigin="anonymous")
    script(src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js", integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k", crossorigin="anonymous")
    script(src="/javascripts/script.js")
```

This file includes Bootstrap's Javascript and CSS libraries and also jQuery for handling form submission and AJAX request. With that covered, add the following template code for your homepage in `views/index.pug`

```pugjs
extends layout

block content
  .container
    .alert(class="alert-danger", role="alert", id="error-group", style="display: none")
      ul(id="errors")
    .row
      .col-sm.col-md-4.offset-md-4
        h3 Welcome To Express Validator!
        form
          .form-group
            input.form-control(type="text", id="name", placeholder="Name")
          .form-group
            input.form-control(type="text", id="classYear", placeholder="Class Year")
          .form-group
            input.form-control(type="text", id="weekday", placeholder="Available Weekday")
          .form-group
            input.form-control(type="email", id="email", placeholder="Email")
          .form-group
            input.form-control(type="password", id="password", placeholder="Password")
          .form-group
            input.form-control(type="password", id="confirmPassword", placeholder="Confirm Password")
          .form-group
            button.form-control(type="button", class="btn btn-primary", id="signup-btn") Submit
```

Now, if you visit your `http://localhost:3000/` you should see the following page:

![Homepage](homepage.png)

Once the user enters his information, you need to handle the on submit event and make an AJAX request to your Express.js back-end. You will do that in the following code which has to be added in your `/public/javascripts/script.js` file:

```js
$('#signup-btn').click(function () {
  $.ajax({
    url: '/users',
    type: 'POST',
    cache: false,
    data: {
      name: $('#name').val(),
      classYear: $('#classYear').val(),
      weekday: $('#weekday').val(),
      email: $('#email').val(),
      phoneNumber: $('#phoneNumber').val(),
      password: $('#password').val(),
      confirmPassword: $('#confirmPassword').val()
    },
    success: function () {
      $('#error-group').css('display', 'none');
      alert('Your submission was successful');
    },
    error: function (data) {
      $('#error-group').css('display', 'block');
      var errors = JSON.parse(data.responseText);
      var errorsContainer = $('#errors');
      errorsContainer.innerHTML = '';
      var errorsList = '';

      for (var i = 0; i < errors.length; i++) {
        errorsList += '<li>' + errors[i].msg + '</li>';
      }
      errorsContainer.html(errorsList);
    }
  });
});
```

On form submission, a POST request is made to the 'http://localhost:3000/users' with the data object in the `$.ajax` options object. If there is an error during validation, it will be added to a div with an *alert* class, otherwise successful validation will trigger an alert with message, **Your submission was successful**.

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
