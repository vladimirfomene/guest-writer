## Creating an Outline

Now that you have finished writing your prototype and that the reviewers have finished checking it, it's time to define an outline for your article.

Creating an outline is an important step of the process because it will help you think about the article as a whole. Also, it will give the reviewers an overview of how you are willing to write your article, which creates an opportunity to align expectations.

For example, lets say that your goal is to teach readers how MobX works and how they can manage the state of their React applications with this tool. In that case, you would need to define an outline that contained sections that:

1. Introduce in a couple of sentences what the article is all about. This is called the TL;DR (Too Long; Didn't Read) section.
2. What are the prerequisites to follow the article along. That is, what knowledge is expected from the readers and what software they need installed.
3. Introduce the topic from a theoretical point of view. In this example, you would talk about the philosophy of MobX, how it works, what are its main pieces, etc.
4. Show how to use the technology in action. In this example, you would add sections that show how to create a React app and how to use MobX to manage the state of the app.

To illustrate better, take a look at the following outline. Here, you will see a complete outline that would be considered outstanding by the reviewers:

```markdown
# Managing the State of React Apps with MobX

**TL:DR:** A few words of what you are going to write about, how the sections are divided, etc.

## Prerequisites

> Mention that the readers will have to have some previous experience with JavaScript and React. Point https://auth0.com/blog/react-tutorial-building-and-securing-your-first-app/ if they need. Also, mention that readers will need Node.js and NPM (point to the download page.)

## State Management in React

> Write a paragraph telling that there are basically three alternatives: Redux (the most popular), React Context API, and MobX.

> Write a paragraph about Redux and point to https://auth0.com/blog/redux-practical-tutorial/

> Write a paragraph about React Context API and point to https://auth0.com/blog/react-context-api-managing-state-with-ease/

> Write a sentence telling that the next section will dive deeper on MobX

## MobX Introduction

> Give some brief introduction about MobX, its history, supporters, GitHub link and status, official documentation, etc.

### Observable State on MobX

> A couple of paragraphs, perhaps with code example, about https://mobx.js.org/#observable-state

### Computed Values on MobX

> A couple of paragraphs, perhaps with code example, about https://mobx.js.org/#computed-values

### Reactions on MobX

> A couple of paragraphs, perhaps with code example, about https://mobx.js.org/#reactions

### Actions on MobX

> A couple of paragraphs, perhaps with code example, about https://mobx.js.org/#actions

## MobX and React in Practice

> A couple of paragraphs about what you will build.

### Creating a new React app

```bash
npx create-react-app react-mobx-tutorial
```

### Installing Dependencies

### Creating a Store with MobX

> talk about Store.js, `decorate`, and `reviewStore`

### Updating the Store on MobX

> Talk about the `Form` component.

### Reacting to Changes on MobX

> Talk about the other two components: `Dashboard` and `Reviews`

### Wrapping Up your MobX App

> Putting everything together on `App.js`

## Conclusion
```