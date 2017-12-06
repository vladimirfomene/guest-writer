const {spawn} = require('child_process');
const ls = spawn('docker', [
    'run', '-p', '4000:4000', '--name', 'blog', '-d', '-v',
    `${__dirname}/../articles/:/data/_posts/:rw`, 'brunokrebs/auth0-blog:latest'
]);

ls.stdout.on('data', data => {
    console.log(`${data}`);
});

ls.stderr.on('data', data => {
    console.log(`${data}`);
});