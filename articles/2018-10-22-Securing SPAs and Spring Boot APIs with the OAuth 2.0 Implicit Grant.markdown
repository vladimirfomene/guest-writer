---
layout: post
title: "Securing SPAs and Spring Boot APIs with the OAuth 2.0 Implicit Grant"
description: "How to secure your single page application and Spring Boot API using an implementation of OAuth 2.0. "
date: "2018-10-22 08:30"
author:
  name: "Vladimir Fomene"
  url: "vladimirfomene"
  mail: "vladimirfomene@gmail.com"
  avatar: "https://twitter.com/vladimirfomene/profile_image?size=original"
related:
- 2017-11-15-an-example-of-all-possible-elements
---

**TL;DR:** In this article, you will learn how to create and secure a [jQuery](https://jquery.com/) SPA and a [Spring Boot](https://spring.io/projects/spring-boot) API using [OAuth 2.0](https://oauth.net/2/) implicit grant. If you need, you can find the reference code developed throughout this article in this [GitHub repository](https://github.com/vladimirfomene/oauth-implicit).

## Prerequisites

To follow this article along, you need to have the following installed:

* JDK 8 or JDK 10 (JDK 10 was used in this article).
* Any text editor or IDE of your choice (Intellij recommended).

## What is OAuth 2.0?
If you have ever seen this page, then you have used the OAuth 2.0 protocol. On this page, **auth0.com** is requesting my user credentials from Google.

![Auth0 authorization on Google Servers](./oauth.png)

According to the official [OAuth 2.0 website](https://oauth.net/2/), OAuth 2.0 is an authorization protocol that was created as an improvement to the original OAuth protocol which was created in 2006. This protocol provides authorization mechanisms for web applications, desktop applications, mobile phones, and living room devices. [Click here](https://auth0.com/blog/oauth2-the-complete-guide/) to learn more about OAuth 2.0.

## What is the OAuth 2.0 Implicit Grant?

Since your demo application will implement 0Auth 2.0 implicit grant, it is important to understand how this authorization flow works. This flow is suitable for user agent based mobile or SPAs. For the sake of example let me use the "Sign in with Google case above". When I(resource owner) access a client application that implements "Sign in with Google" and then click on the signin button, I'm redirected to the authorization server(Google) which requests consent from me in order to grant the client application an access token and my profile credentials. Once I consent, I'm redirected to the client application and the client application is given an access token and my profile credentials.

## Securing Spring Boot API with OAuth 2.0

### Create Your Auth0 API

To secure your Spring Boot API, you need an identity provider who implements the OAuth 2.0 protocol. For this demo application, you will use [Auth0](https://auth0.com/). For starters, head to `https://auth0.com/` and click on the `SIGN UP` button in the top right corner of the page. You will see the following page appear. You can skip this if you have an Auth0 account.

![Auth0 Signup Page](./signup.png)

Fill in your credentials and Sign Up or Sign Up with one of the identity providers listed on the page. Next, you will be the taken to the following page where you have to choose a domain name that is not already taken.

![Auth0 Domain Page](./domain.png)

I advise you to use your **surname** for the domain name if it is as unique as mine. Once you have chosen a domain, and clicked **NEXT**, you will be directed to the following page:

![Auth0 Account Page](./account-type.png)

For the sake of this demo, you can choose a **Personal** account, select **Developer** as your role and select **Just Playing Around** as your project. Finally, click on the **CREATE ACCOUNT** button and you will be directed to a dashboard which looks like the following.

![Auth0 Dashboard](./dashboard.png)

With that covered, you now have an Auth0 account. To authenticate requests to your Spring Boot API you need to represents it on Auth0. So you need to create an API on Auth0. To do this, click on the `APIs` navigation in  the dashboard's left navigation pane. You will be taken to the APIs page. Once on the APIs page, click on the **CREATE API** and you will be taken to the following page:

![Auth0 Dashboard](./new-api.png)

* Name your api, **oauth-implicit**
* Enter **https://localhost:8080/api** as your identifier.
* Use **RS256** as your Signing Algorithm.

Then, create your Auth0 API by clicking on the **CREATE** button. Finally, add the following scopes in your API by clicking on the **Scopes** tab on the API page.

![API Scopes](./scopes.png)

* Name, **read:messages**
* Description, **Read messages**


Now that you have an Auth0 API with scopes, you need to create its Spring Boot equivalent.

### Create Your Spring Boot API

In this section, you will create a Spring Boot application that will serve as your API by exposing public endpoints and securing private endpoints with Spring Security's OAuth 2.0 implementation. For starters, go to [the Spring Initializr page](https://start.spring.io/) and fill out the form like this:

* *Generate a*: At the top of the page, choose "Gradle Project".
* *Group*: You can leave this field as `com.example`.
* *Artifact*: You can type `oauth-implicit` in this one.
* *Search for dependencies*: Here, you will have to type "web" and choose the first option that appears. Then type "security" and also choose the first option that appears. These will make the green labels named "Web" and "Security" appear on the *Selected Dependencies* section.

![Generating a new Spring Boot project](./generate-spring-boot-project.png)

For now, your project only has a single class called `OauthImplicitApplication`. It also contains three dependencies in the `build.gradle` file: `spring-boot-starter-web`, `spring-boot-starter-test` and `spring-boot-starter-security`. If you are using Java 10, you will have to update the `build.gradle` file as follows to add Java to XML marshalling.

```gradle
// ... leave everything else untouched ...

dependencies {
  // ... don't remove the other two dependencies ...
  compile('org.glassfish.jaxb:jaxb-runtime:2.3.1')
}
```

Next, you need to create your API endpoints. To do that, create a new class called `AppController` in the `com.example.oauthimplicit` package. This class has the following endpoints:

* **/api/public**, this endpoint will not be secured, and as such, will be publicly accessible by everyone.
* **/api/private**, this endpoint will be secured and only accessible to users who have been authenticated.
* **/config**, this endpoint will not be secured, and as such, will be publicly accessible to everyone. This endpoint will be used by your SPA to get your Spring Boot API's configurations.
* **/api/private-scoped**, this endpoint will be secured and only accessible to users who have been authenticated and given a particular scope.

```java
package com.example.oauthimplicit;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppController {

    @Value("${security.oauth2.resource.id}")
    private String resourceId;

    @Value("${auth0.domain}")
    private String domain;

    @Value("${auth0.clientId}")
    private String clientId;

    @RequestMapping(value = "/api/public", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String publicEndpoint() {
        return new JSONObject()
                .put("message", "Hello from a public endpoint! You don\'t need to be authenticated to see this.")
                .toString();
    }

    @RequestMapping(value = "/api/private", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String privateEndpoint() {
        return new JSONObject()
                .put("message", "Hello from a private endpoint! You need to be authenticated to see this.")
                .toString();
    }

    @RequestMapping(value = "/api/private-scoped", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String privateScopedEndpoint() {
        return new JSONObject()
                .put("message", "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.")
                .toString();
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String getAppConfigs() {
        return new JSONObject()
                .put("domain", domain)
                .put("clientID", clientId)
                .put("audience", resourceId)
                .toString();

    }
}
```

Your IDE will start yelling at you because it does not know the `org.json.JSONObject` library. To solve this, add the following dependency to your `build.gradle` file:

```gradle
// ... leave everything else untouched ...

dependencies {
  // ... don't remove the other two dependencies ...
  compile('org.json:json:20180813')
}
```
At this point, your app will not compile because you have not defined the value of the instance variables with `@Value` annotations. To do that, rename your `application.properties` file to `application.yml` and add the following content to it.

```yml
auth0:
  domain: <DOMAIN>
  clientId: <CLIENT-ID>

security:
  oauth2:
    resource:
      id: <Auth0-API-IDENTIFIER>

```

### Secure the Spring Boot API with OAuth 2.0

In order to secure your API using OAuth 2.0 you need to add support for it in your Spring Boot application by adding the following line to your `gradle.build` file.

```gradle
// ... leave everything else untouched ...

dependencies {
  // ... don't remove the other two dependencies ...
  compile('org.springframework.security.oauth.boot:spring-security-oauth2-autoconfigure:2.0.5.RELEASE')
}
```

To secure your API, create a new class called `SecurityConfig` in the `com.example.oauthimplicit` package. This class will be annotated with a `@EnableResourceServer` which is convenient for resource servers secured with OAuth 2.0. This annotation enables a Spring Security filter that authenticates requests via an incoming OAuth 2.0 token. This class implements the following methods:

* `configure(ResourceServerSecurityConfigurer resources)`, to set the URL path for your API.
* `configure(HttpSecurity http)`, to specify which API endpoints are secured(private), require a particular scope and public.

Now, add the following code to your file:

```java
package com.example.oauthimplicit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

@Configuration
@EnableResourceServer
public class SecurityConfig extends ResourceServerConfigurerAdapter {
    @Value("${security.oauth2.resource.id}")
    private String resourceId;

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .mvcMatchers("/api/public").permitAll()
                .antMatchers("/api/private-scoped").access("#oauth2.hasScope('read:messages')")
                .mvcMatchers("/api/**").authenticated()
                .anyRequest().permitAll();
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.resourceId(resourceId);
    }
}
```
Right now, the `SecurityConfig` class does not know where to verify your access token. In order for the configuration of this class to know where to verify your access token, you need to add the JSON Web Key Set(JWKS) URI to your application properties file. Leaving everything unchanged, add the line with `jwk` property. Fit in your Auth0 domain in your `keySetUri` value.

```yml
auth0:
  domain: <DOMAIN>
  clientId: <CLIENT-ID>

security:
  oauth2:
    resource:
      jwk:
        keySetUri: https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json
      id: <Auth0-API-IDENTIFIER>

```

### Creating and Securing a SPA with the Implicit Grant

In this section, you are going to create the jQuery SPA that will interact with your Spring Boot API. To start, create an Auth0 application to represent your SPA. Sign into your Auth0 dashboard, click on **Applications** on the left navigation of the page and you should see the following page:

![Auth0 Applications page](./applications.png)

Next, click on the **CREATE APPLICATION** button and you will see the following form:

![Auth0 Create Application page](./create-application.png)

Enter **oauth-implicit** as your name and select **Single Page Web Application** as the application type, then click on **CREATE**. Now, you have an Auth0 application.

With that covered, you are ready to create your local SPA. For starters, create an **assets** folder in `/src/main/resources/static` and add the following file to it.

 ![Spinner](./loading.svg)

Then, create a file called `style.css` in `/src/main/resources/static/assets/` and fill it with the following content.

```css
.content {
display: none;
}

.btn-margin {
margin-top: 7px
}

#profile-view,
#ping-view {
display: none;
}

.profile-area img {
max-width: 150px;
margin-bottom: 20px;
}

.panel-body h3 {
margin-top: 0;
}

#loading {
position: absolute;
display: flex;
justify-content: center;
height: 100vh;
width: 100vw;
top: 0;
bottom: 0;
left: 0;
right: 0;
background-color: #fff;
}
```
Now, you need a page for your SPA. Create an `index.html` page in your `/src/main/resources/static/` directory and fill it with the following content.

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Calling an API</title>
        <base href="/">

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <link rel="stylesheet" href="assets/style.css">
    </head>
    <body>

        <div id="loading">
            <img src="assets/loading.svg" alt="Loading spinner">
        </div>

        <div class="content">
            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <a class="navbar-brand" href="#">Auth0 - jQuery</a>

                        <button id="btn-home-view" class="btn btn-primary btn-margin">
                            Home
                        </button>

                        <button id="btn-profile-view" class="btn btn-primary btn-margin">
                            Profile
                        </button>

                        <button id="btn-ping-view" class="btn btn-primary btn-margin">
                            Ping
                        </button>

                        <button id="qsLoginBtn" class="btn btn-primary btn-margin">
                            Log In
                        </button>

                        <button id="qsLogoutBtn" class="btn btn-primary btn-margin">
                            Log Out
                        </button>

                    </div>
                </div>
            </nav>

            <main class="container">
                <!-- home view -->
                <div id="home-view">
                    <h4></h4>
                </div>

                <!-- profile view -->
                <div id="profile-view" class="panel panel-default profile-area">
                    <div class="panel-heading"><h3>Profile</h3></div>
                    <div class="panel-body">
                        <img class="avatar" alt="avatar">
                        <div>
                            <label><i class="glyphicon glyphicon-user"></i> Nickname</label>
                            <h3 class="nickname"></h3>
                        </div>
                        <pre class="full-profile"></pre>
                    </div>
                </div>

                <!-- ping view -->
                <div id="ping-view">
                    <h1>Make a Call to the Server</h1>

                    <p id="call-private-message">
                        Log in to call a private (secured) server endpoint.
                    </p>

                    <button id="btn-ping-public" class="btn btn-primary">
                        Call Public
                    </button>

                    <button id="btn-ping-private" class="btn btn-primary">
                        Call Private
                    </button>

                    <button id="btn-ping-private-scoped" class="btn btn-primary">
                        Call Private Scoped
                    </button>

                    <h2 id="ping-message"></h2>
                </div>
            </main>
        </div>

        <script src="https://cdn.auth0.com/js/auth0/9.5.1/auth0.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script src="assets/app.js"></script>
    </body>
</html>
```
With that covered, it is worth noting that this file includes the `Bootstrap` css library and your custom stylesheet `style.css` in the head tag. Before the closing body tag, this file includes the `Bootstrap` Javascript library, the Auth0 Javascript library, jQuery and your local Javascript file `app.js` in `/src/main/resources/static/assets/` which has not yet been created.

Before you create `app.js`, go to your Auth0 dashboard, click on the **Applications** dashboard and then select your app, this will take you to your app's page. On that page, click on the **Settings** tab and the following page will appear.

![Auth0 Application Settings page](./oauth-implicit-settings.png)

Copy your **Domain** and **Client ID** from the above page and **Auth0-API-IDENTIFIER** from your Auth0 API page, then go to your application settings in `/src/main/resources/application.yml` and paste them. Next, go back to your Auth0 application settings page and set the **Allowed Callback URLs** to `http://localhost:8080` so that Auth0 knows where to redirect your client after authentication.

With all your configurations in place, create an `app.js` file in the `/src/main/resources/static/assets/` directory. Next, copy and paste the following content in it.

```js
$('document').ready(function() {
  var content = $('.content');
  var loadingSpinner = $('#loading');
  content.css('display', 'block');
  loadingSpinner.css('display', 'none');

  var userProfile;
  var apiUrl = "http://localhost:8080/api";

  var envVar = $.parseJSON($.ajax({
    url:  "/config",
    dataType: "json",
    async: false
  }).responseText);


  var webAuth = new auth0.WebAuth({
    domain: envVar.domain,
    clientID: envVar.clientID,
    redirectUri: location.href,
    audience: envVar.audience,
    responseType: 'token id_token',
    scope: 'openid profile read:messages',
    leeway: 60
  });

  var homeView = $('#home-view');
  var profileView = $('#profile-view');
  var pingView = $('#ping-view');

  // buttons and event listeners
  var loginBtn = $('#qsLoginBtn');
  var logoutBtn = $('#qsLogoutBtn');

  var homeViewBtn = $('#btn-home-view');
  var profileViewBtn = $('#btn-profile-view');
  var pingViewBtn = $('#btn-ping-view');

  var pingPublic = $('#btn-ping-public');
  var pingPrivate = $('#btn-ping-private');
  var pingPrivateScoped = $('#btn-ping-private-scoped');

  var callPrivateMessage = $('#call-private-message');
  var pingMessage = $('#ping-message');

  pingPublic.click(function() {
    callAPI('/public', false);
  });

  pingPrivate.click(function() {
    callAPI('/private', true);
  });

  pingPrivateScoped.click(function() {
    callAPI('/private-scoped', true);
  });

  loginBtn.click(login);
  logoutBtn.click(logout);

  homeViewBtn.click(function() {
    homeView.css('display', 'inline-block');
    profileView.css('display', 'none');
    pingView.css('display', 'none');
  });

  profileViewBtn.click(function() {
    homeView.css('display', 'none');
    pingView.css('display', 'none');
    profileView.css('display', 'inline-block');
    getProfile();
  });

  pingViewBtn.click(function() {
    homeView.css('display', 'none');
    profileView.css('display', 'none');
    pingView.css('display', 'inline-block');
  });

  function login() {
    webAuth.authorize();
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    this.access_token = authResult.accessToken;
    this.expires_at = expiresAt;
  }

  function logout() {
    // Remove tokens and expiry time from browser
    access_token = null;
    expires_at = null;
    pingMessage.css('display', 'none');
    displayButtons();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = this.expires_at;
    return new Date().getTime() < expiresAt;
  }

  function displayButtons() {
    var loginStatus = $('.container h4');
    if (isAuthenticated()) {
      loginBtn.css('display', 'none');
      logoutBtn.css('display', 'inline-block');
      profileViewBtn.css('display', 'inline-block');
      pingPrivate.css('display', 'inline-block');
      pingPrivateScoped.css('display', 'inline-block');
      callPrivateMessage.css('display', 'none');
      loginStatus.text(
        'You are logged in! You can now send authenticated requests to your server.'
      );
    } else {
      homeView.css('display', 'inline-block');
      loginBtn.css('display', 'inline-block');
      logoutBtn.css('display', 'none');
      profileViewBtn.css('display', 'none');
      profileView.css('display', 'none');
      pingView.css('display', 'none');
      pingPrivate.css('display', 'none');
      pingPrivateScoped.css('display', 'none');
      callPrivateMessage.css('display', 'block');
      loginStatus.text('You are not logged in! Please log in to continue.');
    }
  }

  function getProfile() {
    if (!userProfile) {
      var accessToken = this.access_token;

      if (!accessToken) {
        console.log('Access token must exist to fetch profile');
      }

      webAuth.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          userProfile = profile;
          displayProfile();
        }
      });
    } else {
      displayProfile();
    }
  }

  function displayProfile() {
    // display the profile
    $('#profile-view .nickname').text(userProfile.nickname);
    $('#profile-view .full-profile').text(JSON.stringify(userProfile, null, 2));
    $('#profile-view img').attr('src', userProfile.picture);
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.css('display', 'none');
        homeView.css('display', 'inline-block');
      } else if (err) {
        homeView.css('display', 'inline-block');
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  }

  handleAuthentication();

  function callAPI(endpoint, secured) {
    var url = apiUrl + endpoint;
    var accessToken = this.access_token;

    var headers;
    if (secured && accessToken) {
      headers = { Authorization: 'Bearer ' + accessToken };
    }

    $.ajax({
      url: url,
      headers: headers
    })
      .done(function(result) {
        $('#ping-view h2').text(result.message);
      })
      .fail(function(err) {
        $('#ping-view h2').text('Request failed: ' + err.statusText);
      });
  }

  displayButtons();
});
```

This file has a couple of functions, look at them one by one.

* `$.parseJSON()` is used to make AJAX calls to your Spring Boot API to get your **API Audience**, **Client ID** and **Domain**.
* To create an authentication service, create an instance of the `auth0.WebAuth` and store it in `webAuth`
* On authentication with Auth0 you will have access to an [`id_token`](https://auth0.com/docs/tokens/id-token), [`access_token`](https://auth0.com/docs/tokens/access-token) and `openid`, `profile` and `read:messages` scopes
* `handleAuthentication()`, looks for the result of authentication in the URL hash. Then, the result is processed with the `parseHash` method from `auth0.js`.
* `callAPI(endpoint, secured)`, given an endpoint and a security variable the method makes AJAX call to your Spring Boot API.
* `logout()`, logs the client out by setting the tokens and expiry time in the browser to `null`.
* `setSession(authResult)`, sets the token and its expiry time in the browser.
* `login()`, calls Auth0 login dialog to authenticate the client.
* `displayButtons()`, in charge of controlling the view of the `index.html` file based on the client's authentication.
* `displayProfile()`, displays user profile returned by `getProfile()` from Auth0 authentication.
* `isAuthenticated()`, uses token expiry time to determine whether a client has authenticated.

With that covered, you are ready to test the SPA and Spring Boot API.

## Testing

* Go to your Spring Boot application directory and run the following command, `./gradlew bootRun`
* Open your favorite browser and navigate to `http://localhost:8080`. You should see a page that looks like the one below.

![Application Home Page](./application-home-page.png)

* Click on the **Ping** button, and then on the **Call Public** button. You will see the following screen appear with a message from a public endpoint of your Spring Boot API.

![Public UnSigned Endpoint](./public-unsigned-endpoint.png)

* Now, login to test your private endpoints. Click on the **Log In** button and the following page will appear.

![Auth0 Login Screen](auth0-login.png)

* You can go ahead by signing in with Google or add a user in your Auth0 dashboard and use their credentials to sign in. Here is the page for adding new users to your Auth0 account.

![Auth0 New User Page](./Auth0-new-user-page.png)

Once logged in, you will be on the following page:

![Auth0-authenticated-screen](./Auth0-authenticated-screen.png)

* Click on the **Profile** button and you should see a page that looks like the following with your avatar, not mine.

![Profile Page](./profile-page.png)

* Now, click on the **Ping** button and you should be taken to the ping page. On this page, click the **Call Private** button and you should see the following screen appear.

![Private API Call](./private-api-call.png)

Next, click on the **Call Private Scoped** button and you should see the following screen appear.

![Private Scoped API Call](./private-scoped-api-call.png)

Last but not the least, click on the **Call Public** button and you should see the following screen appear.

![Public API Call On Home Screen](./authenticated-public-api-call.png)

* Finally, click on the **Log Out** and you will be logged out of the application.

## Conclusion

In this article, you learned how to create and secure a Spring Boot API with OAuth 2.0 using Spring Security's OAuth 2.0 support. You also learned how to create and authenticate a SPA so that it communicates with your Spring Boot API using Auth0 implementation of the OAuth 2.0 protocol. If you are interested in learning more about OAuth 2.0 and its Spring Boot support, visit the following links:

* [OAuth 2.0 Protocol](https://auth0.com/docs/protocols/oauth2)
* [Spring Boot and OAuth 2.0](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* [Spring Security OAuth 2.0 Project](https://projects.spring.io/spring-security-oauth/docs/oauth2.html)
