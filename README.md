# Auth0 Blog for Guest Authors

This repository exists to support Guest Authors. To become a guest author, please, apply through [the Guest Author Program webpage](https://auth0.com/guest-authors). The process is simple and fully described in the referenced page.

## Writing to Auth0

After implementing the sample application and defining an outline to your article, please, follow the instructions in this section to start writing your article:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository.
2. [Clone](https://help.github.com/articles/cloning-a-repository/) your fork to your machine.
3. Create a branch with a name that references your article (e.g., `react-firebase`).
4. Run `node src` and answer the questions asked.
5. Find your article in the `./articles` directory (e.g. `articles/2018-04-10-title.markdown`).
6. Start writing.
7. Commit and push your branch to your fork.
8. Create a pull request to [the original repository](https://github.com/auth0-blog/guest-writer).
9. Share with your editor.

> **Note:** You can commit, create the pull request, and share it with your editor even before you finish writing. Like that, the editor might be able to take a quick look and give you feedback before you proceed with the rest of the article.

## Tips About Writing

One of the most important resources that [you **must** read before start writing is this one](https://github.com/auth0-blog/guest-writer/blob/master/faq/tips-about-writing.md). Please, make sure you understand everything written there and do ask questions if you have doubts.

### Viewing the Article in Real-Time

Before executing the commands shown below, please, be sure that [Docker](https://www.docker.com/community-edition) and [Node.js](https://nodejs.org/) are properly installed and that both `docker` and `node` commands are available.

1. Check that Docker is available: `docker --version`;
2. Check that Node.js is available: `node --version`;
3. To create a new article, issue the following command: `node src`;
4. To see how your article will look in our blog, issue the following command: `node src/docker`;

The blog engine might take a few seconds to start and generate the articles (usually less than 10 seconds). After started, we can check the blog at [`http://localhost:4000/blog/`](http://localhost:4000/blog/) (note that the trailing slash is mandatory).

> __Important!!!__ The trailing slash is mandatory. This means that `http://localhost:4000/blog` won't work. You do have to go to [`http://localhost:4000/blog/`](http://localhost:4000/blog/).
