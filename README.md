## Auth0 Blog for Guest Writers

Before executing the commands shown below, please, be sure that Docker is properly installed and that the `docker`
command is available.

- checking docker: `docker --version`
- create new article: `node src`
- launch blog: `node docker`

The blog engine might take a few seconds to start and generate the articles (usually less than 10). After started, we
can check the blog at [`http://localhost:4000/blog/`](http://localhost:4000/blog/).

__Important!!!__ The trailing slash is mandatory. This means that `http://localhost:4000/blog` won't work. You do have to go to [`http://localhost:4000/blog/`](http://localhost:4000/blog/).
