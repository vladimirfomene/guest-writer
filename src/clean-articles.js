const fs = require('fs');

// ((\\*|.+)\s+)*
const regex = /```\w{1,5}[\n.+]([^`]((\\*|.+)\s+))*```/g
const regex2 = /{% highlight html %}[\n\D\d]+?{% endhighlight %}/g

fs.readFile("kim", "utf8", function(err, data) {
  let cleanArticle = data;

  const blocksOfCode = data.match(regex) || [];
  console.log(`${blocksOfCode.length} blocks of code found.`);
  blocksOfCode.forEach((block) => {
    cleanArticle = cleanArticle.replace(block, '');
  });

  const blocksOfHtml = data.match(regex2) || [];
  console.log(`${blocksOfHtml.length} blocks of HTML found.`);
  blocksOfHtml.forEach((block) => {
    cleanArticle = cleanArticle.replace(block, '');
  });

  fs.writeFile('kim_clear.txt', cleanArticle, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});
