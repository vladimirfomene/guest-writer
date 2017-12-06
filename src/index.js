const fs = require('fs');
const {promisify} = require('util');
const readline = require('readline');
const writeFile = promisify(fs.writeFile);

// for now it just creates new a article based on a few questions
newArticle();

async function newArticle() {
    console.log('=====================================================');
    console.log('Howdy! To create a new article for you, I just have to ask you a few questions.');
    console.log('Let\'s start!');
    console.log('');
    const authorName = await question('What is your name?');
    const authorTwitter = await question('What is your twitter (e.g. brunoskrebs)?');
    const authorEmail = await question('What is your public email?');
    const date = new Date().toISOString().split('T')[0];

    const blackBgColor = '#000';

    console.log('');
    console.log('Great! Now, please, answer the following about the article:');
    console.log('');

    const articleTitle = await question('What is the title of the article?');
    const articleDescription = await question('What is its description?');

    console.log('');
    console.log('Amazing! Let me create the article for you.');
    console.log('');


    let template = fs.readFileSync(`${__dirname}/template.markdown`, 'utf8');
    template  = template.replace(/AUTHOR.NAME/g, authorName)
        .replace(/AUTHOR.TWITTER/g, authorTwitter)
        .replace(/AUTHOR.EMAIL/g, authorEmail)
        .replace(/ARTICLE.TITLE/g, articleTitle)
        .replace(/ARTICLE.DESCRIPTION/g, articleDescription)
        .replace(/ARTICLE.DATE/g, date);

    await writeFile(`${__dirname}/../articles/${date}.markdown`, template);

    console.log('That\'s it. Happy writing! :)');
}

function question(text) {
    const {stdin: input, stdout: output} = process;
    const rl = readline.createInterface({input, output});
    return new Promise((resolve) => {
        rl.question(text + ' ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}