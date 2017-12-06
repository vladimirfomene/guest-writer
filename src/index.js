const fs = require('fs');
const {promisify} = require('util');
const readline = require('readline');
const writeFile = promisify(fs.writeFile);

let writer;
const writerDetailsPath = `${__dirname}/../.writer.json`;
if (fs.existsSync(writerDetailsPath)) {
    writer = JSON.parse(fs.readFileSync(writerDetailsPath, 'utf8'));
}

newArticle();

async function newArticle() {
    console.log('=====================================================');
    console.log('Howdy! To create a new article for you, I just have to ask you a few questions.');

    if (!writer) {
        console.log('Let\'s start!');
        console.log('');
        const name = await question('What is your name?');
        const twitter = await question('What is your twitter (e.g. brunoskrebs)?');
        const email = await question('What is your public email?');

        writer = {name, twitter, email};
        await writeFile(writerDetailsPath, JSON.stringify(writer));

        console.log('');
        console.log('Great! Now, please, answer the following about the article:');
        console.log('');
    }

    const articleTitle = await question('What is the title of the article?');
    const articleDescription = await question('What is its description?');

    console.log('');
    console.log('Amazing! Let me create the article for you.');
    console.log('');

    const date = new Date().toISOString().split('T')[0];
    let template = fs.readFileSync(`${__dirname}/template.markdown`, 'utf8');
    template  = template.replace(/AUTHOR.NAME/g, writer.name)
        .replace(/AUTHOR.TWITTER/g, writer.twitter)
        .replace(/AUTHOR.EMAIL/g, writer.email)
        .replace(/ARTICLE.TITLE/g, articleTitle)
        .replace(/ARTICLE.DESCRIPTION/g, articleDescription)
        .replace(/ARTICLE.DATE/g, date);

    await writeFile(`${__dirname}/../articles/${date}-title.markdown`, template);

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