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

**TL;DR:** In this article you will learn to validate and sanitize data in your Express.js
application using a set of middlewares called [Express-Validator](https://express-validator.github.io/docs/). You will do so, by completing a demo application that takes in user input and validates/sanitizes it using
Express-Validator. If you want to see the complete application take a look at the following GitHub repository:

[Expressjs-Validator](https://github.com/vladimirfomene/expressjs-validator)

## Prerequisites

Softwares you need to install to follow this tutorial:

* Node.js and npm (node package manager). Node.js v8.13.0 was used in the demo application.
* Any text editor or IDE of your choice.

## What Is Express-Validator?

According to the [official site](https://express-validator.github.io/docs/), Express-Validator is a set of [Express.js](http://expressjs.com/) middlewares that wraps [validator.js](https://github.com/chriso/validator.js) validator and sanitizer functions. Simply said, Express-Validator is a JavaScript middleware library that can be incorporated in Express.js for server-side data validation.

### Why Server-Side Validation?

Here are a couple of reasons why you should care about server-side validation:

* Data coming from the client cannot always be trusted because the communication could have been intercepted by an untrusted client who is posing as a trusted client (man-in-the-middle attack).
* A malicious user might disable JavaScript in their browser so as to submit bogus data to your server. This means client-side validation is not enough.

>**Note:** Although you can declare your validations in your application models, it is preferable to add validations in your application logic because it minimizes the round trips made to the database server, and therefore providing very responsive feedback to the user.

## Setup Your Playground For Express-Validator

To start playing with Express-Validator, open your terminal in a preferred directory and clone the starter project with the following command:

```bash
# clone repository
git clone https://github.com/vladimirfomene/expressjs-validator-starter.git

# move into your clone repository
cd expressjs-validator-starter
```
Then, install all the project dependencies by running the following command in the starter project directory.

```bash
npm install
```
This simple Express.js application sets up an empty JavaScript file, routes and empty view templates. The directory `views/index.js` represents your homepage and it is rendered with the code in `routes/index.js`. There is also a user resources route file, `routes/users.js`. This is where all our validation will go. To setup for handling user interaction and AJAX, there is an empty JavaScript file in `public/script.js`. The `app.js` file mounts the route files, setup the port on which the server will be listening, sets up the template engine [Pug](https://pugjs.org/api/getting-started.html) and tells Express.js where to find your JavaScript files. Don't run the project yet! You still have to do a little bit of housekeeping.

## Build Homepage For User Input

To enable users to enter data in your app, you need to build a page with a form for data input. To do that you will create a template for your homepage. But, first create a layout in `views/layout.pug` with the following code:

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

The code above includes [Bootstrap's](https://getbootstrap.com/) JavaScript and CSS libraries and [jQuery](https://jquery.com/) for handling form submission and AJAX request. With your layout in place, add the following template for your homepage in `views/index.pug`

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

With that covered, you have everything setup to have a sneak peek at the app. Go to the project starter directory
and run the following command to get the app started.

```bash
node app.js
```
Now, if you visit `http://localhost:3000/` in your favorite browser, you should see the following page:

![Homepage](homepage.png)

>**Note:** You can stop the server now, but whenever you add a new feature/functionality, you will need to restart the server if it is already running or just start it.

Once the user enters data on your homepage and clicks the **Submit** button, you need to handle the on submit event and make an AJAX request to your Express.js back-end. To do that, add the following code to your `/public/javascripts/script.js` file:

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

From the code above, on form submission, a POST request is made to the 'http://localhost:3000/users' with the data object in the `$.ajax()` function options object argument. If there is an error during validation, it will be added to a div with an *alert* class, otherwise successful validation will trigger an alert with message, **Your submission was successful**.

## Server-Side Validation With Express-Validator

Now that you have your front-end set up, you need to validate user input. To do that, install the express-validator module in your Express.js application by running the following command in your application directory.

```bash
npm install express-validator --save
```
With the express-validator module installed, import the [check API](https://express-validator.github.io/docs/check-api.html) to use its validation functions. To do that, add the following require statement to the top of your `routes/users.js` file:

```js
//............leave everything else unchanged.
const {check, validationResult} = require('express-validator/check');
//.....leave everything else unchanged.
```

With that in place,go ahead and validate the different fields on your homepage form.

### Validate Field For Value  And Provide Custom Error Messages

To validate your form input, you need to pass an array in which you specify the fields that you want to validate as a second argument to your route handler for `/users` POST requests. To do that, add the following code after the GET route handling code in `routes/user.js`.

```js
//............leave everything else unchanged.
router.post('/', [
    check('name').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('classYear', 'Class Year should be a number').not().isEmpty(),
    check('weekday', 'Choose a weekday').optional(),
    check('email', 'Your email is not valid').not().isEmpty(),
    check('password', 'Your password must be at least 5 characters').not().isEmpty(),
  ],
  function (req, res) {
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      res.send({});
    }
});
//............leave everything else unchanged.
```

The string passed as argument to the check function specifies which data field you want to validate. The `not().isEmpty()` function chain requires that this field should not be empty. The string argument to `withMessage()` specifies a custom error message which will be send back to our client if this particular field violates a validation requirement. You can also provide a custom error message by passing it as a second argument to the `check()` function. You have made the `weekday` field optional by calling the `optional()` function on it. So far, you have only specified how you want your fields to be validated. You might be wondering where Express.js actually does the validation. Validation happens in the request handler when it calls the `validationResult()` function. To test this, run your application and submit an empty form to the serve and you should see the following error displayed in red.

![Error-Page-For-Not-Empty-Validation](not-empty-error.png)

Remark how there is no error for the **weekday** field, this is because you made the field optional during validation. Pretty cool, hein?

### Validating Field's length

You can also check if a data field meets a certain character length requirement by using the `isLength()` function which takes in an object in which you specify the minimum number of characters in that field or the maximum number of characters. Update the validation requirements for the name and password field as follows:

```js
[
  //....leave everything else untouched
  check('name').not().isEmpty().isLength({min: 5}).withMessage('Name must have more than 5 characters'),
  check('password', 'Your password must be at least 5 characters').not().isEmpty().isLength({min: 5}),
  //....leave everything else untouched
]
```

Now, restart the app and try to enter a name and password less than five characters long. You should see the following errors on your homepage.

![Validate Field's character length](validate-character-length.png)


### Validating Field's Type

Apart from validating the character length of a field, you can also validate its type or validate it against against a list. For example, you can specify that your `classYear` field needs to be an integer. You can also specify that weekday should not be saturday or sunday. To do that, update your validation requirements as follows:

```js
[
  //...leave everything else unchanged
  check('classYear', 'Class Year should be a number').not().isEmpty().isInt(),
  check('weekday', 'Choose a weekday').optional().not().isIn(['sunday', 'saturday']),
  //... leave everything else unchanged
]
```

When you run your app, and try to enter a value which is not an integer in the class year field or enter a saturday or sunday in the week day field, you will get the following errors on screen:

![Validating Field's Type](validating-field-for-type.png)


### Validating And Sanitizing Emails

Express-Validator also validates emails with the `isEmail()` function. It can also normalize emails with the `normalizeEmail()` function. In case you are wondering what it means to normalize an email, you can read about it in this [Stack Overflow post](https://stackoverflow.com/questions/27936705/what-does-it-mean-to-normalize-an-email-address). In order to validate your email field, add the following code  to your  validation requirement code.

```js
[
  //... leave everything else unchanged
  check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
  //... leave everything else unchanged
]
```

Now, if you enter an invalid email on your homepage you will get the following error:

![Validating And Sanitizing Emails](Validating-and-normalizing-emails.png)


### Sanitizing Fields With Trim And Escape

You can trim away spaces from your data and escape special characters using the `trim()` and `escape()` functions. The `escape()` function could really come in handy when protecting yourself from cross-site scripting attacks. To add this feature to your app, add the following code snippet to your validation requirements.

```js
[
  //... leave everything else unchanged
  check('name').exists().isLength({min: 5}).trim().escape().withMessage('Name must have more than 5 characters')
  //... leave everything else unchanged
]
```

To test this, your starter came with code that prints every request body to the console after validation. Let's say I'm a malicious user and I type the following JavaScript code in your name field: " <script> alert("hello, there");</script> ". I will get the following sanitized output in the console.

![Sanitizing Fields With Trim And Escape](trim-and-escape.png)

Notice, how your code has been transformed into HTML special characters. Amazing, right?

### Validating With Custom Validators

Last but not the least, you need to make sure that the `password` field matches the `confirmPassword` field. To do that, use the custom validation function `custom()` as follows:

```js
[
  //... leave everything else unchanged
  check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password))
  //... leave everything else unchanged
]
```
The custom function takes in an arrow function as argument which checks if the value of the `confirmPassword` is the same as the value of the `password` field. To test this, restart your app and enter different password and you should get the following errors:

![Password Mismatch](password-mismatch.png)


If your input passes all the validation checks, you should see the following screen:

![Passed all validation checks](passed-all-validation-test.png)

## Conclusion

In this article, you learned how use the Express-Validator middleware to validate and sanitize user data in an Express.js application. Guess what? You only scratched the surface of what is possible with Express-Validator. Aside from learning more validation and sanitization functions, you can learn how to add wildcards to your validations, do schema validation and whole body validation from [Express-Validator's documentation](https://express-validator.github.io/docs/). I will love to see what you build with Express-Validator.
