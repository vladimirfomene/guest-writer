## Sharing Prototypes with Reviewers

When you finish developing your prototype (i.e. before you start writing about it) you will have to share it with your reviewer so they can validate your solution. More often than not, your reviewer won't be as fluent in the stack you chose as we would like them to be. So, keep this in mind when writing the instructions on how to run your prototype.

The following list shows _some_ items that you can add to your `README.md` file that will help reviewers:

- Highlight what are the dependencies to run your app in their machine (e.g. MongoDB).
- Explicitly define what external solutions (if any) your solution depends on (e.g. Firebase).
- Tell them what IDE (if any) you have used and what plugins they will need to run the app.
- Tell them what they must do after cloning your project into their laptops (e.g. `npm install`).

As you can see, the idea is to include enough information in the `README.md` file so your reviewer can check your prototype to validate it.

> **Note:** It's quite common to have prototypes that depend on environment variables (e.g. a `CLIENT_ID` of an Auth0 Application). If that is the case, you can share these variables with your reviewer in a private channel (avoid commiting it to a public repository as you will probably forget to revoke them later).