The `docker.js` script depends on the following Docker image. This image is created from [the `Dockerfile` available
in the Auth0's blog repository](https://github.com/auth0/blog/blob/master/Dockerfile).

To create a new image, we can issue the following commands:

```bash
git clone https://github.com/auth0/blog.git

cd blog/

docker build -t auth0-blog .

docker tag auth0-blog brunokrebs/auth0-blog:latest

docker push brunokrebs/auth0-blog:latest
```