---
layout: post
title: "An Example of All Possible Elements on Our Blog"
description: "The following article exists only to show every single type of section so we can easily see how they interact together."
date: 2017-11-15 8:30
category: Technical guide, Angular, Angular 4
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  image: https://cdn.auth0.com/blog/angular/logo3.png
  bg_color: "#012C6C"
tags:
- javascript
- angular
- node
- mongodb
- express
- mean
related:
- 2017-11-09-sqlalchemy-orm-tutorial-for-python-developers
- 2017-09-28-developing-restful-apis-with-python-and-flask

---

**TL;DR:** This the _Too Long; Didn't Read_ section of our posts. It usually contains a description of what are we going to achieve throughout the article. It **doesn't not** contain any different element. However, since it's on top of all blog posts, it's a good place to see **bolds**, _italics_, and [some not-that-short link](https://auth0.com/).

---

## This is the First H2 Section

Below we can see a list of links to different blog posts. This has to be done manually:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1) (you are here!)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 1: Let's Break This Section

I have read somewhere that _lorem ipsum_ is not a great way to validate layouts. However, I won't invest that much time writing. So there it goes.Nunc elementum scelerisque mi, ut scelerisque nunc tempus ut. Duis venenatis mattis nibh dignissim imperdiet. Donec iaculis sollicitudin risus, iaculis pharetra sem lacinia nec. Curabitur commodo arcu sit amet diam iaculis luctus. Vivamus bibendum tempor massa, id vulputate velit luctus nec. Proin feugiat mauris urna, sed cursus urna lobortis at. Nam vitae varius magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

### First Header 3 Section

Duis tristique vulputate nisi vel posuere. Vivamus vel odio dapibus, tincidunt odio a, ullamcorper orci. Proin aliquam erat non mollis lobortis. Vivamus a est molestie, accumsan metus vitae, pellentesque arcu. Curabitur dui erat, sollicitudin at quam et, malesuada imperdiet dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et vehicula justo, sed rutrum massa

Nullam elit est, cursus non sem sed, placerat varius lorem. Quisque dignissim felis porta, pellentesque risus vitae, scelerisque mauris. Mauris tortor massa, fermentum nec odio et, tempor convallis lacus

{% include tweet_quote.html quote_text="Curabitur sit amet massa efficitur, vulputate lacus vitae, pharetra urna." %}

#### First Header 4 Section

We have a problem with H4 headers in the current layout. This kind of header is not easily distinguishable from the normal text. I hope we can solve this situation in our new layout. Aliquam est nulla, sollicitudin eget laoreet non, rutrum at libero. Pellentesque nisl eros, posuere sed mauris vel, aliquam vehicula nulla.

In orci justo, semper et aliquet et, aliquet eget erat. Aenean non mollis enim. Vestibulum feugiat tortor urna, in porta augue facilisis sed.

### Second Header 3 Section

Etiam aliquam, tellus eget maximus tincidunt, mi eros gravida urna, ut mollis est erat vitae nulla. Praesent placerat scelerisque gravida. Praesent ac nisl tortor. Proin viverra fringilla rhoncus. Vivamus ac ultrices erat. Nulla magna orci, pharetra sit amet congue eget, aliquam eget lacus. Aliquam sit amet cursus nibh. In porttitor rutrum turpis.

Sed rutrum dictum nibh, eget sodales erat pharetra non. Morbi aliquet, nibh sit amet ornare blandit, leo metus rutrum urna, sit amet aliquam nulla est vel ipsum. Sed lacinia aliquet nisl, ut imperdiet erat. Maecenas viverra justo gravida, consectetur lorem ac, hendrerit eros. Integer id turpis ultricies, sagittis mauris sed, mollis ligula.

> Note that I have nothing special to talk about here. I'm just adding this note so we can see how it looks.

## Why Not the Second h2 Header Now?

Sure thing. In felis neque, cursus sit amet auctor a, consequat nec dui. Integer imperdiet id est vitae pulvinar. Duis tristique vulputate nisi vel posuere. Vivamus vel odio dapibus, tincidunt odio a, ullamcorper orci. Proin aliquam erat non mollis lobortis. Vivamus a est molestie, accumsan metus vitae, pellentesque arcu. Curabitur dui erat, sollicitudin at quam et, malesuada imperdiet dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

```js
function Random(engine) {
  if (!(this instanceof Random)) {
    return new Random(engine);
  }

  if (engine == null) {
    engine = Random.engines.nativeMath;
  } else if (typeof engine !== "function") {
    throw new TypeError("Expected engine to be a function, got " + typeof engine);
  }
  this.engine = engine;
}

// [-0x80000000, 0x7fffffff]
Random.int32 = function (engine) {
  return engine() | 0;
};

proto.int32 = function () {
  return Random.int32(this.engine);
};
```

Nullam et vehicula justo, sed **rutrum massa**. Praesent egestas est nec arcu scelerisque molestie. In quis velit eget quam sagittis pharetra vitae nec sapien. Maecenas laoreet mollis nulla at consectetur.

1. First thing I wanna talk about.
2. Second thing I want to address in this example.
3. Third thing is hard to be creative about.
4. Fourth thing. Would it be enough?

Etiam aliquam, tellus eget maximus tincidunt, mi eros gravida urna, ut mollis est erat vitae nulla. Praesent placerat scelerisque gravida. Praesent ac nisl tortor. Proin viverra fringilla rhoncus. Vivamus ac ultrices erat.

### Let's Show Some CSS Code

Nah, actually let's show some `html elements` that must be added in `/some-file/somewhere`:

{% highlight html %}
<!-- src/index.html -->
...
<head>
  ...
  <title>RSVP</title>
  ...
  <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
    integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
    crossorigin="anonymous">
</head>
...
{% endhighlight %}

After that, let's copy and paste some lorem ipsum.In orci justo, semper et aliquet et, aliquet eget erat. Aenean non mollis enim. Vestibulum feugiat tortor urna, in porta augue facilisis sed. Morbi orci ligula, aliquam in bland. Then let's show the CSS code:

```scss
/* src/assets/scss/_base.scss */
/*--------------------
       BASICS
--------------------*/

body {
  min-width: 320px;
}

/*-- Link Buttons --*/

.btn-link {
  color: #0275d8;

  &:hover {
    text-decoration: underline !important;
  }
  &:focus {
    box-shadow: none !important;
    color: #0275d8;
    text-decoration: none;
  }
}

/*-- Helpers --*/

.opacity-half {
  opacity: .5;
}
.list-group-item > strong {
  padding-right: 5px;
}
```

Bootstrap provides a CSS reset and plenty of styling. Our local `_base.scss` provides some basic helpers and improvements. Bla bla, what ever, bla.

* Authentication and role authorization (client _and_ server)
* CRUD operations with an API
* Searching and filtering
* Template-driven forms
* Reactive forms with custom validation
* Simple UI animation
* Lazy loading
* Production deployment on VPS with nginx and SSL

## Why Not Some Other Section With Blabla and Code

In felis neque, cursus sit amet auctor a, consequat nec dui. Integer imperdiet id est vitae pulvinar. Duis tristique vulputate nisi vel posuere. Vivamus vel odio dapibus, tincidunt odio a, ullamcorper orci. Proin **aliquam erat** non mollis lobortis. Vivamus a est molestie, _accumsan metus vitae_, pellentesque arcu. Curabitur dui erat, sollicitudin at quam et, malesuada imperdiet dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et vehicula justo, sed rutrum massa. Praesent egestas `est nec arcu` scelerisque molestie. In quis velit eget quam sagittis pharetra vitae nec sapien. Maecenas laoreet mollis nulla at consectetur.

```typescript
// src/app/header/header.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() navToggled = new EventEmitter();
  navOpen = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // If nav is open after routing, close it
    this.router.events
      .filter(event => event instanceof NavigationStart && this.navOpen)
      .subscribe(event => this.toggleNav());
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
    this.navToggled.emit(this.navOpen);
  }
}
```

Oh I almost forgot, an image... When the navigation is open, the layout canvas should slide over. We also have a few styles for the container for routed components (layout view).

That's it for the layout and global navigation! The app should look like this in the browser:

![animated Angular app with global off-canvas navigation](https://cdn.auth0.com/blog/spring-reactive/real-time-chap.png)

Now that we have our structure and global components in place, we're ready to start developing features next time.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

We've covered setup and dependencies for the software and tools needed for our MEAN stack application. We've also established the basic layout and architecture of our Angular front end. In the [next part of the Real-World Angular Series](https://auth0.com/blog/real-world-angular-series-part-2), we'll tackle authentication and authorization, feature planning, and data modeling.