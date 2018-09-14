---
layout: post
title: "Developing a RESTful Client with Retrofit and Spring Boot"
description: "It is a tutorial on developing a RESTful HTTP client with the Retrofit library and Spring Boot. The HTTP queries are demonstrated using GitHub's API."
date: "2018-09-10 08:30"
author:
  name: "Vladimir Fomene"
  url: "VladimirFomene"
  mail: "vladimirfomene@gmail.com"
  avatar: "https://twitter.com/VladimirFomene/profile_image?size=original"
related:
- 2017-11-15-an-example-of-all-possible-elements
---

**TL;DR:** In this article you will learn how to use [Square's Retrofit](https://square.github.io/retrofit/) HTTP client library and the Spring Boot web framework to create a client
for a RESTful API. You will connect to a RESTful API using Retrofit as your HTTP client and expose this client using Spring Boot's RestController. You will also learn how to convert JSON to POJOs (Plain Old Java Objects) using [Google's Gson](https://github.com/google/gson) library and last but not the least you will learn how to use the documentation
of a RESTful API to your advantage.

## What is a RESTful Client?

REST stands for Representational State Transfer and it is an architecture style used to design web APIs
(application programming interfaces). REST is not a standard but rather a set of constraints used to design web APIs in
well designed web applications. In REST, GET requests should be used for resource lookup and PUT, POST, DELETE for updating,
creating and deleting a resource. Our Spring Boot client will be a RESTful client because it follows this constraint and it communicates
with a RESTful API ([GitHub's API](https://api.github.com)).

## Pre-Requisites

To follow this article you will need to have the following tools installed on your system.

* JDK 10 or below.
* Preferably IntelliJ IDEA or any other IDE (Integrated Development Environment) of your choice.
* Install an HTTP client like Curl if you are on macOS or Linux or Postman for any system.
* Create a GitHub account if you do not already have one.

Once you have all these installed, all you need is a basic understanding of the web client server architecture and
the HTTP protocol. In case you want to get a quick understanding you can read this [HTTP basics](https://learn.onemonth.com/understanding-http-basics/) article and watch this [video](https://www.youtube.com/watch?v=cpkd4EYYQ8o)

## What Is Retrofit and How It Works?

According to the official [website](https://square.github.io/retrofit/), Retrofit is a type-safe HTTP client for Java and Android which was developed by [Square](https://squareup.com/). With Retrofit all you need to do is declare a Java interface to represent your API. Then, pass the API configuration to the Retrofit class which will generate a Java Class implementation of your interface. Retrofit allows you to make both synchronous and asynchronous request to APIs. For the purpose of simplicity, this article will focus on synchronous request. Retrofit allows you to modify your API request through annotation on methods in your interface and parameters passed to these methods.

## Why use GitHub API?

Your client will interact with [Github's REST API](https://developer.github.com/v3/). I chose this API because of the following reasons:

* Nearly all developers have GitHub accounts and if you do not have one, [creating](https://github.com/join?source=header-home) one will only take a couple of seconds.
* GitHub API version 3 follows a REST architectural design and has a very good documentation.
* Last, but not the least they allow you to query their API once you have an *ACCESS TOKEN*, *Username and Password* or a *SECRET KEY* without requesting that you submit an application to use their API.

## How to use GitHub API

* First, you need to create a [GitHub account](https://github.com/join?source=header-home) if you do not already have one.
* Next, click on your GitHub's profile photo (on the top right corner of the page) once you are signed in; a dropdown will appear. On the dropdown select *Settings* and you will be taken to your profile's settings page.
* On that page, click on *Developer settings* on the left pane of the page.
* Once you are on the *Developer settings* page click on *Personal access tokens* on the left pane of the page and you will be taken to the new tokens page.
* On the new tokens page, enter the description of your token in the *Token description* field. Then select the **repo** and **delete_repo** scopes. These scopes determines the type of queries you will be able to do on GitHub's API. Then, click on **Generate token** to create a new token. Store this new token somewhere safe on your laptop.

Why do you even need this access token? According to GitHub's API
documentation you will need to authenticate with the API before interacting with it. So, the access token will be used as our authentication to the API.

## Creating a RESTful Client with Retrofit and Spring Boot

In this section, you will create a Spring Boot application that can `GET`, `POST` and `DELETE` GitHub repositories via the GitHub API. To start, clone the skeleton application from GitHub by issuing the following command in a command line:

```bash

  git clone https://github.com/vladimirfomene/springboot-github-client.git

  # Move into the application directory
  cd springboot-github-client

```

This repository contains no class files, but has dependencies in the `build.gradle` file. It has a dependency for `spring-boot-starter-web` and `spring-boot-starter-test`.
To ensure compatibility with Java 10, you have to add the following line to the `build.gradle` file:

```gradle

  ...

  dependencies {
  	...
  	compile('javax.xml.bind:jaxb-api:2.3.0')
  }

```

### Creating Domain Classes
According to the GitHub documentation all requests to GitHub's API endpoint `https://api.github.com` will receive JSON reponses from version 3 of the API. If you are going to receive JSON from the GitHub API you need a Java representation of this data. Over the years developers have used two methods to give JSON data a Java representation.

* Manual Approach: For this approach you will have to learn how to use a JSON to Java object converter like the [Google Gson](https://github.com/google/gson) which converts JSON keys into Java object attributes. During conversion Gson maps all JSON keys to Java object attributes to create POJOs which will serve as representation of your JSON objects. This library can also convert POJOs into their JSON representation. You can learn how to do this manual conversion by following this [guide](https://guides.codepath.com/android/Leveraging-the-Gson-Library).

* Automatic Approach: For this approach, you will use [jsonschema2pojo](http://www.jsonschema2pojo.org/), which is an online tool which converts JSON data into POJOs. This tool gives you the option to choose the JSON parser that you want and has an options for generating getters and setters for your Java classes. In your case, select `Gson` as the JSON parser and you will use [Lombok library](https://projectlombok.org/) to generate your getters and setters, so do not select the option to include getters and setters. Now, you need a JSON representation of a GitHub repository so as to derive its Java representation. To do this, issue the following request to GitHub's API:

* Endpoint: `https://api.github.com/users/<your-username>/repos`
* Method: `GET`
* Headers: `Accept: application/vnd.github.v3+json`, `Authorization: token <your-access-token>`

This request will produce a JSON object list of your GitHub repositories. A JSON object in the list will look like the following:

```json

{
  "id": 90119013,
  "node_id": "MDEwOlJlcG9zaXRvcnk5MDExOTAxMw==",
  "name": "algs4",
  "full_name": "vladimirfomene/algs4",
  "owner": {
      "login": "vladimirfomene",
      "id": 11140070,
      "node_id": "MDQ6VXNlcjExMTQwMDcw",
      "avatar_url": "https://avatars1.githubusercontent.com/u/11140070?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/vladimirfomene",
      "html_url": "https://github.com/vladimirfomene",
      "followers_url": "https://api.github.com/users/vladimirfomene/followers",
      "following_url": "https://api.github.com/users/vladimirfomene/following{/other_user}",
      "gists_url": "https://api.github.com/users/vladimirfomene/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/vladimirfomene/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/vladimirfomene/subscriptions",
      "organizations_url": "https://api.github.com/users/vladimirfomene/orgs",
      "repos_url": "https://api.github.com/users/vladimirfomene/repos",
      "events_url": "https://api.github.com/users/vladimirfomene/events{/privacy}",
      "received_events_url": "https://api.github.com/users/vladimirfomene/received_events",
      "type": "User",
      "site_admin": false
  },
  "private": false,
  "html_url": "https://github.com/vladimirfomene/algs4",
  "description": "Algorithms, 4th edition textbook code and libraries",
  "fork": true,
  "url": "https://api.github.com/repos/vladimirfomene/algs4",
  "forks_url": "https://api.github.com/repos/vladimirfomene/algs4/forks",
  "keys_url": "https://api.github.com/repos/vladimirfomene/algs4/keys{/key_id}",
  "collaborators_url": "https://api.github.com/repos/vladimirfomene/algs4/collaborators{/collaborator}",
  "teams_url": "https://api.github.com/repos/vladimirfomene/algs4/teams",
  "hooks_url": "https://api.github.com/repos/vladimirfomene/algs4/hooks",
  "issue_events_url": "https://api.github.com/repos/vladimirfomene/algs4/issues/events{/number}",
  "events_url": "https://api.github.com/repos/vladimirfomene/algs4/events",
  "assignees_url": "https://api.github.com/repos/vladimirfomene/algs4/assignees{/user}",
  "branches_url": "https://api.github.com/repos/vladimirfomene/algs4/branches{/branch}",
  "tags_url": "https://api.github.com/repos/vladimirfomene/algs4/tags",
  "blobs_url": "https://api.github.com/repos/vladimirfomene/algs4/git/blobs{/sha}",
  "git_tags_url": "https://api.github.com/repos/vladimirfomene/algs4/git/tags{/sha}",
  "git_refs_url": "https://api.github.com/repos/vladimirfomene/algs4/git/refs{/sha}",
  "trees_url": "https://api.github.com/repos/vladimirfomene/algs4/git/trees{/sha}",
  "statuses_url": "https://api.github.com/repos/vladimirfomene/algs4/statuses/{sha}",
  "languages_url": "https://api.github.com/repos/vladimirfomene/algs4/languages",
  "stargazers_url": "https://api.github.com/repos/vladimirfomene/algs4/stargazers",
  "contributors_url": "https://api.github.com/repos/vladimirfomene/algs4/contributors",
  "subscribers_url": "https://api.github.com/repos/vladimirfomene/algs4/subscribers",
  "subscription_url": "https://api.github.com/repos/vladimirfomene/algs4/subscription",
  "commits_url": "https://api.github.com/repos/vladimirfomene/algs4/commits{/sha}",
  "git_commits_url": "https://api.github.com/repos/vladimirfomene/algs4/git/commits{/sha}",
  "comments_url": "https://api.github.com/repos/vladimirfomene/algs4/comments{/number}",
  "issue_comment_url": "https://api.github.com/repos/vladimirfomene/algs4/issues/comments{/number}",
  "contents_url": "https://api.github.com/repos/vladimirfomene/algs4/contents/{+path}",
  "compare_url": "https://api.github.com/repos/vladimirfomene/algs4/compare/{base}...{head}",
  "merges_url": "https://api.github.com/repos/vladimirfomene/algs4/merges",
  "archive_url": "https://api.github.com/repos/vladimirfomene/algs4/{archive_format}{/ref}",
  "downloads_url": "https://api.github.com/repos/vladimirfomene/algs4/downloads",
  "issues_url": "https://api.github.com/repos/vladimirfomene/algs4/issues{/number}",
  "pulls_url": "https://api.github.com/repos/vladimirfomene/algs4/pulls{/number}",
  "milestones_url": "https://api.github.com/repos/vladimirfomene/algs4/milestones{/number}",
  "notifications_url": "https://api.github.com/repos/vladimirfomene/algs4/notifications{?since,all,participating}",
  "labels_url": "https://api.github.com/repos/vladimirfomene/algs4/labels{/name}",
  "releases_url": "https://api.github.com/repos/vladimirfomene/algs4/releases{/id}",
  "deployments_url": "https://api.github.com/repos/vladimirfomene/algs4/deployments",
  "created_at": "2017-05-03T07:07:45Z",
  "updated_at": "2017-05-03T07:07:47Z",
  "pushed_at": "2017-04-17T00:50:38Z",
  "git_url": "git://github.com/vladimirfomene/algs4.git",
  "ssh_url": "git@github.com:vladimirfomene/algs4.git",
  "clone_url": "https://github.com/vladimirfomene/algs4.git",
  "svn_url": "https://github.com/vladimirfomene/algs4",
  "homepage": "http://algs4.cs.princeton.edu/code/",
  "size": 879,
  "stargazers_count": 0,
  "watchers_count": 0,
  "language": "Java",
  "has_issues": false,
  "has_projects": true,
  "has_downloads": true,
  "has_wiki": true,
  "has_pages": false,
  "forks_count": 0,
  "mirror_url": null,
  "archived": false,
  "open_issues_count": 0,
  "license": {
      "key": "gpl-3.0",
      "name": "GNU General Public License v3.0",
      "spdx_id": "GPL-3.0",
      "url": "https://api.github.com/licenses/gpl-3.0",
      "node_id": "MDc6TGljZW5zZTk="
  },
  "forks": 0,
  "open_issues": 0,
  "watchers": 0,
  "default_branch": "master",
  "permissions": {
      "admin": true,
      "push": true,
      "pull": true
  }
}

```

Next, copy this JSON data and paste it in the [jsonschema2pojo](http://www.jsonschema2pojo.org/) tool, unselect the *Include getters and setters* option, select Gson as your annotation style, Java as your target language and name the class `GitHubRepository`. Then, click on the preview button at the bottom of the page. This will create the following classes in a modal.

```java

public class GitHubRepository {

  @SerializedName("id")
  @Expose
  public Integer id;
  @SerializedName("node_id")
  @Expose
  public String nodeId;
  @SerializedName("name")
  @Expose
  public String name;
  @SerializedName("full_name")
  @Expose
  public String fullName;
  @SerializedName("owner")
  @Expose
  public Owner owner;
  @SerializedName("private")
  @Expose
  public Boolean _private;
  @SerializedName("html_url")
  @Expose
  public String htmlUrl;
  @SerializedName("description")
  @Expose
  public String description;
  @SerializedName("fork")
  @Expose
  public Boolean fork;
  @SerializedName("url")
  @Expose
  public String url;
  @SerializedName("forks_url")
  @Expose
  public String forksUrl;
  @SerializedName("keys_url")
  @Expose
  public String keysUrl;
  @SerializedName("collaborators_url")
  @Expose
  public String collaboratorsUrl;
  @SerializedName("teams_url")
  @Expose
  public String teamsUrl;
  @SerializedName("hooks_url")
  @Expose
  public String hooksUrl;
  @SerializedName("issue_events_url")
  @Expose
  public String issueEventsUrl;
  @SerializedName("events_url")
  @Expose
  public String eventsUrl;
  @SerializedName("assignees_url")
  @Expose
  public String assigneesUrl;
  @SerializedName("branches_url")
  @Expose
  public String branchesUrl;
  @SerializedName("tags_url")
  @Expose
  public String tagsUrl;
  @SerializedName("blobs_url")
  @Expose
  public String blobsUrl;
  @SerializedName("git_tags_url")
  @Expose
  public String gitTagsUrl;
  @SerializedName("git_refs_url")
  @Expose
  public String gitRefsUrl;
  @SerializedName("trees_url")
  @Expose
  public String treesUrl;
  @SerializedName("statuses_url")
  @Expose
  public String statusesUrl;
  @SerializedName("languages_url")
  @Expose
  public String languagesUrl;
  @SerializedName("stargazers_url")
  @Expose
  public String stargazersUrl;
  @SerializedName("contributors_url")
  @Expose
  public String contributorsUrl;
  @SerializedName("subscribers_url")
  @Expose
  public String subscribersUrl;
  @SerializedName("subscription_url")
  @Expose
  public String subscriptionUrl;
  @SerializedName("commits_url")
  @Expose
  public String commitsUrl;
  @SerializedName("git_commits_url")
  @Expose
  public String gitCommitsUrl;
  @SerializedName("comments_url")
  @Expose
  public String commentsUrl;
  @SerializedName("issue_comment_url")
  @Expose
  public String issueCommentUrl;
  @SerializedName("contents_url")
  @Expose
  public String contentsUrl;
  @SerializedName("compare_url")
  @Expose
  public String compareUrl;
  @SerializedName("merges_url")
  @Expose
  public String mergesUrl;
  @SerializedName("archive_url")
  @Expose
  public String archiveUrl;
  @SerializedName("downloads_url")
  @Expose
  public String downloadsUrl;
  @SerializedName("issues_url")
  @Expose
  public String issuesUrl;
  @SerializedName("pulls_url")
  @Expose
  public String pullsUrl;
  @SerializedName("milestones_url")
  @Expose
  public String milestonesUrl;
  @SerializedName("notifications_url")
  @Expose
  public String notificationsUrl;
  @SerializedName("labels_url")
  @Expose
  public String labelsUrl;
  @SerializedName("releases_url")
  @Expose
  public String releasesUrl;
  @SerializedName("deployments_url")
  @Expose
  public String deploymentsUrl;
  @SerializedName("created_at")
  @Expose
  public String createdAt;
  @SerializedName("updated_at")
  @Expose
  public String updatedAt;
  @SerializedName("pushed_at")
  @Expose
  public String pushedAt;
  @SerializedName("git_url")
  @Expose
  public String gitUrl;
  @SerializedName("ssh_url")
  @Expose
  public String sshUrl;
  @SerializedName("clone_url")
  @Expose
  public String cloneUrl;
  @SerializedName("svn_url")
  @Expose
  public String svnUrl;
  @SerializedName("homepage")
  @Expose
  public String homepage;
  @SerializedName("size")
  @Expose
  public Integer size;
  @SerializedName("stargazers_count")
  @Expose
  public Integer stargazersCount;
  @SerializedName("watchers_count")
  @Expose
  public Integer watchersCount;
  @SerializedName("language")
  @Expose
  public String language;
  @SerializedName("has_issues")
  @Expose
  public Boolean hasIssues;
  @SerializedName("has_projects")
  @Expose
  public Boolean hasProjects;
  @SerializedName("has_downloads")
  @Expose
  public Boolean hasDownloads;
  @SerializedName("has_wiki")
  @Expose
  public Boolean hasWiki;
  @SerializedName("has_pages")
  @Expose
  public Boolean hasPages;
  @SerializedName("forks_count")
  @Expose
  public Integer forksCount;
  @SerializedName("mirror_url")
  @Expose
  public Object mirrorUrl;
  @SerializedName("archived")
  @Expose
  public Boolean archived;
  @SerializedName("open_issues_count")
  @Expose
  public Integer openIssuesCount;
  @SerializedName("license")
  @Expose
  public License license;
  @SerializedName("forks")
  @Expose
  public Integer forks;
  @SerializedName("open_issues")
  @Expose
  public Integer openIssues;
  @SerializedName("watchers")
  @Expose
  public Integer watchers;
  @SerializedName("default_branch")
  @Expose
  public String defaultBranch;
  @SerializedName("permissions")
  @Expose
  public Permissions permissions;

}

public class License {

  @SerializedName("key")
  @Expose
  public String key;
  @SerializedName("name")
  @Expose
  public String name;
  @SerializedName("spdx_id")
  @Expose
  public String spdxId;
  @SerializedName("url")
  @Expose
  public String url;
  @SerializedName("node_id")
  @Expose
  public String nodeId;

}

public class Owner {

  @SerializedName("login")
  @Expose
  public String login;
  @SerializedName("id")
  @Expose
  public Integer id;
  @SerializedName("node_id")
  @Expose
  public String nodeId;
  @SerializedName("avatar_url")
  @Expose
  public String avatarUrl;
  @SerializedName("gravatar_id")
  @Expose
  public String gravatarId;
  @SerializedName("url")
  @Expose
  public String url;
  @SerializedName("html_url")
  @Expose
  public String htmlUrl;
  @SerializedName("followers_url")
  @Expose
  public String followersUrl;
  @SerializedName("following_url")
  @Expose
  public String followingUrl;
  @SerializedName("gists_url")
  @Expose
  public String gistsUrl;
  @SerializedName("starred_url")
  @Expose
  public String starredUrl;
  @SerializedName("subscriptions_url")
  @Expose
  public String subscriptionsUrl;
  @SerializedName("organizations_url")
  @Expose
  public String organizationsUrl;
  @SerializedName("repos_url")
  @Expose
  public String reposUrl;
  @SerializedName("events_url")
  @Expose
  public String eventsUrl;
  @SerializedName("received_events_url")
  @Expose
  public String receivedEventsUrl;
  @SerializedName("type")
  @Expose
  public String type;
  @SerializedName("site_admin")
  @Expose
  public Boolean siteAdmin;

}

public class Permissions {

  @SerializedName("admin")
  @Expose
  public Boolean admin;
  @SerializedName("push")
  @Expose
  public Boolean push;
  @SerializedName("pull")
  @Expose
  public Boolean pull;

}

```

Create a `model` package in the `com.auth0.samples.springbootgithubclient` package. Then, create `GitHubRepository.java`, `Owner.java`, `License.java` and `Permissions.java` files in the model package. Copy and paste the above classes into their respective files. After adding these classes, your IDE will put `@SerializedName` and `@Expose` in red because the Gson library which implements these annotations have not been included. To solve this, add the following dependency to your `build.gradle` file.

```gradle

  ...

  dependencies {
  	...
  	implementation('com.google.code.gson:gson:2.8.5')
  }

```

According to [GitHub's repository documentation](https://developer.github.com/v3/repos/), sending a request to delete a repository returns an empty response and a HTTP status code 204. To capture the status of this request you will create a custom `Status.java` class file in the `com.auth0.samples.springbootgithubclient.model` package. This class just has one attribute called status, which you will use to save the status of our delete repository requests. Here is the content of this file:

```java

public class Status {

  @SerializedName("status")
  @Expose
  private String status;

  public Status(String stat){
    this.status = stat;
  }

}

```

Next, add the following imports to all the above class files.

```java

  import com.google.gson.annotations.Expose;
  import com.google.gson.annotations.SerializedName;

```

Now, to add getters and setters auto-generation to your classes. You need to add the `Lombok Project` to your dependencies. Do so with the following:

```gradle

  ...

  dependencies {
  	...
  	compileOnly('org.projectlombok:lombok:1.18.2')
  }

```

Next, add `@Data` at the top of all your model classes and import lombok like so:

```java

  import lombok.Data;

  @Data
  public class GithubRepository {
    ...
  }

```

The `@Data` annotation will automatically generate getters and setters for your model classes. If you are using IntelliJ IDEA you will need to install the Lombok plugin under `File > Settings > Plugins`. Search for Lombok in the Plugins window and click on install. Once Lombok installed, click on apply to configure the plugin with your IDE and IntelliJ IDEA will prompt you to restart the IDE. After restarting IntelliJ IDEA, go to `File > Settings > Build > Compiler > Annotation Processors` and select *Enable annotation processing* and apply changes.


### Using Retrofit to Consume RESTful APIs

Right now, your application has all the ingredients to convert JSON data to POJOs. Next, you will create a service that communicates with GitHub's API. Start by creating a `GitHubService` package in the `com.auth0.samples.springbootgithubclient` package. In your newly created package, create a Java interface called `APIConfiguration` which will contain the configurations you need to make API requests to GitHub. Here is the content of the file:

```java

public interface APIConfiguration {

  public static final String API_BASE_URL = "https://api.github.com/";

  public static final String API_VERSION_SPEC = "application/vnd.github.v3+json";

  public static final String JSON_CONTENT_TYPE = "application/json";

}

```

In there, you have GitHub's API endpoint (API_BASE_URL), the API version (API_VERSION_SPEC) you want to talk to and the kind of data you want to send in your request body and receive in your response body (JSON_CONTENT_TYPE).

Next, you will turn [GitHub's repository API](https://developer.github.com/v3/repos/) into a Java interface. Start by creating an interface file called `RepositoryInterface.java` in the `com.auth0.samples.githubclient.GithubService` package. In this file, add the following content:

```java

public interface RepositoryInterface {

  @GET("user/repos")
  Call<List<GithubRepository>> listRepos(@Header("Authorization") String accessToken,
                                         @Header("Accept") String apiVersionSpec);

  @DELETE("repos/{owner}/{repo}")
  Call<Status> deleteRepo(@Header("Authorization") String accessToken, @Header("Accept") String apiVersionSpec,
                          @Path("repo") String repo, @Path("owner") String owner);

  @POST("user/repos")
  Call<GithubRepository> createRepo(@Body GithubRepository repo, @Header("Authorization") String accessToken,
                                    @Header("Accept") String apiVersionSpec,
                                    @Header("Content-Type") String contentType);
}

```

Your IDE will immediately start complaining because it does not know these annotations. These annotations are actually coming from the Retrofit library and you have not yet added a dependency for it. So, go ahead and do that with the following:

```gradle

  ...

  dependencies {
  	...
  	implementation('com.squareup.retrofit2:retrofit:2.4.0')
  }

```

Then add the following libraries to your `RepositoryInterface.java` file:

```java

  import com.auth0.samples.springbootgithubclient.model.GitHubRepository;
  import com.auth0.samples.springbootgithubclient.model.Status;
  import retrofit2.Call;
  import retrofit2.http.*;

  import java.util.List;

```

The methods in this interface will be auto-implemented (if that is even a word) by Retrofit. The annotation at the top of every method designates the HTTP method that will be used when that method is called and the argument of the annotation designates the path which will be added to the API endpoint when performing that particular request. `@Header` is used to specify HTTP request headers and `@Body` is used to specify HTTP request body. On top of every method prototype, path variables are written in curly braces like `{owner}` on the `deleteRepo` method, Retrofit uses it `@Path` annotation to retrieve these variables and pass them as arguments to your interface's methods.

Finally, create a service class that uses Retrofit's implemented method to query GitHub's API. Start by creating a `GitHubService.java` file in the `com.auth0.samples.springbootgithubclient.GitHubService` package. Then fill this file with the following content:

```java

@Service
public class GitHubService implements APIConfiguration {

  @Value("${accessToken}")
  private String accessToken;

  private Logger logger = LoggerFactory.getLogger(GitHubService.class);

  private RepositoryInterface service = null;

  public GitHubService() {
    Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(API_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build();

    service = retrofit.create(RepositoryInterface.class);
  }

  public List<GitHubRepository> getRepositories() throws IOException {
    Call<List<GitHubRepository>> reposCall = service.listRepos("token " + accessToken, API_VERSION_SPEC);

    Response<List<GitHubRepository>> reposResponse = null;
    List<GitHubRepository> repos = null;
    reposResponse = reposCall.execute();

    if (reposResponse.isSuccessful()) {
      repos = reposResponse.body();
      if (repos != null) {
        logger.info("web request to Github was successful");
      } else
        logger.info("Zero repositories found");
      } else {
        ResponseBody errorResponse = reposResponse.errorBody();
        if (errorResponse != null) {
          logger.warn(errorResponse.string());
          logger.warn("AcessToken from @Value: {}", accessToken);
        }
    }

    return repos;
  }


  public GitHubRepository createRepository(GitHubRepository repo) {
    Call<GitHubRepository> newRepoCall = service.createRepo(repo, "token " + accessToken, API_VERSION_SPEC, JSON_CONTENT_TYPE);

    Response<GitHubRepository> newRepoResponse = null;
    GitHubRepository newRepo = null;

    try {
      newRepoResponse = newRepoCall.execute();
    } catch (IOException e) {
      e.printStackTrace();
    }

    if (newRepoResponse.isSuccessful()) {
      newRepo = newRepoResponse.body();
      if (newRepo != null) {
        logger.info("web request to Github was successfull");
      } else
        logger.info("Zero repositories found");
    } else {
      ResponseBody errorReponse = newRepoResponse.errorBody();
      if (errorReponse != null) {
        try {
          logger.warn(errorReponse.string());
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }

    return newRepo;
  }

  public Status deleteRepository(String owner, String repoName) {
    Call<Status> deleteRepoCall = service.deleteRepo("token " + accessToken, API_VERSION_SPEC, repoName, owner);

    Response<Status> deleteStatusResponse = null;
    Status deleteStatus = null;
    try {
      deleteStatusResponse = deleteRepoCall.execute();
    } catch (IOException e) {
      e.printStackTrace();
    }

    if (deleteStatusResponse.isSuccessful()) {
      int statusCode = deleteStatusResponse.code();
      if (statusCode == 204) {
        deleteStatus = new Status("204 No Content");
        logger.info("Delete web request to Github was successfull");
      } else
        logger.info("Delete Request Failed");
    } else {
      ResponseBody errorReponse = deleteStatusResponse.errorBody();
      if (errorReponse != null) {
        try {
          logger.warn(errorReponse.string());
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }

    return deleteStatus;
  }

}

```
This class includes your `APIConfiguration` interface and so has access to all the constants defined in there. The constructor to this class builds the `Retrofit` object that will implement all the methods in `RepositoryInterface.java`. The builder for this `Retrofit` object uses the API endpoint which is passed via the `API_BASE_URL` constant and Retrofit's version of Google's Gson library for parsing JSON to POJOs and vice-versa. But you have not added this library to your dependencies so your IDE has marked it red. Add it to your `build.gradle` with the following line:

```gradle
...

dependencies {
	...
	implementation('com.squareup.retrofit2:converter-gson:2.4.0')
}
```

Then, add the following imports to include all the libraries and classes used in the `GitHubService.java` file:

```java

  import com.auth0.samples.springbootgithubclient.model.GitHubRepository;
  import com.auth0.samples.springbootgithubclient.model.Status;
  import okhttp3.ResponseBody;
  import org.slf4j.Logger;
  import org.slf4j.LoggerFactory;
  import org.springframework.beans.factory.annotation.Value;
  import org.springframework.stereotype.Service;
  import retrofit2.Call;
  import retrofit2.Response;
  import retrofit2.Retrofit;
  import retrofit2.converter.gson.GsonConverterFactory;

  import java.io.IOException;
  import java.util.List;

```

The methods in this class have access to an implementation of the RepositoryInterface that was created in the `GitHubService` class constructor when `retrofit.create(RepositoryInterface.class)` was executed. All the methods in the `GitHubService` class follow the following pattern:

* They create a `Retrofit Call` object by using one of the methods defined in the RepositoryInterface. This Call object can make HTTP request and store responses.
* Then, they use the returned Call object to make HTTP requests like the line, `reposResponse = reposCall.execute()` in the `getRepositories()` method.
* Finally, if the request was successful they will log a message to the console acknowledging the success of the request, otherwise they will log an error from the HTTP request to the console.

### Expose an HTTP Service with Spring Boot

Finally, you have to expose your `GitHubService` through a Spring Boot RestController by creating a class in your application that will respond to all web requests. Start by creating a `controllers` package in `com.auth0.samples.springbootgithubclient` package. Then, create `GitHubClientController.java` file in this package. Fill this file with the following content:

```java

@RestController
public class GithubClientController{

  @Autowired
  private GitHubService githubService;

  @GetMapping("/repos")
  public List<GithubRepository> getRepos() throws IOException {
      return githubService.getRepositories();
  }

  @PostMapping("/repos")
  public GithubRepository createRepo(@RequestBody GithubRepository newRepo) {
      return githubService.createRepository(newRepo);
  }

  @DeleteMapping("/repos/{owner}/{repo}")
  public Status deleteRepo(@PathVariable("owner") String owner, @PathVariable("repo") String repoName) {
      return githubService.deleteRepository(owner, repoName);
  }
}

```

Your IDE will immediately complain about the annotations and unknown symbols, then will mark them red. To solve this issue, you need to add this list of imports.

```java

  import com.auth0.samples.springbootgithubclient.GitHubService.GitHubService;
  import com.auth0.samples.springbootgithubclient.model.GitHubRepository;
  import com.auth0.samples.springbootgithubclient.model.Status;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.web.bind.annotation.*;

  import java.io.IOException;
  import java.util.List;

```

Because of the `@Autowired` annotation on the GitHubService, the GitHubService object will be automatically created once you start your Spring Boot application. The `getRepos` method uses the GitHubService's `getRepositories` method to retrieve all your GitHub repositories. The `createRepo` method uses the GitHubService's createRepository to create a new GitHub repository. Last but not the least, `deleteRepo` uses the GitHubService's `deleteRepository` method to delete a particular repository in your account.

## Using Your Retrofit Application

In your `GitHubService` class, there is an `accessToken` instance variable with a `@Value("${accessToken}")` annotation. With this annotation Spring Boot expects you declare an `accessToken` environment variable for your application. Go to the **Run** menu of your IntelliJ IDEA and select the **Edit Configurations** option. In the window that appears set `accessToken` as an environment variable with your GitHub access token as value.
With that covered, your GitHub client is ready to be tested. You need to run the following request using any HTTP client of your choice (Curl, Postman or even a browser).

* For getting a list of your repositories run, `GET http://localhost:8080/repos`
* For creating a new repository in your account run, `POST http://localhost:8080/repos` with the following
request body:

```json

{
  "name": "<your-repository-name>",
  "description": "This is a test repository created using my github client",
  "homepage": "https://github.com",
  "private": false,
  "has_issues": true,
  "has_projects": true,
  "has_wiki": true
}

```

You can replace `<your-repository-name>` with your preferred repository. You can also change the description of the repository to fit your personal preference. Furthermore, you can also add more attributes by looking at the attributes supported in the [GitHub API documentation](https://developer.github.com/v3/repos/).

* Delete the created repository by executing the following request, `DELETE http://localhost:8080/repos/{owner}/{repo}`.
Replace {owner} with your GitHub account name and {repo} with your GitHub repository name.

## Conclusion

In this article, you saw how Square's Retrofit library makes it easy for you to communicate with an API by creating a Java interface. Along the way, you also learned to use [Lombok](https://projectlombok.org/) to eliminate boilerplate
code like getters and setters, convert JSON to POJOs and use GitHub API's documentation. Retrofit can do much more
than demonstrated in this article. For example, you can use Retrofit to build an Android client application for a
backend API. Instead of performing synchronous request, Retrofit can be used to perform asynchronous request. There
are so many other features in Retrofit, you can visit the [documentation](https://square.github.io/retrofit/) to learn more about it.
