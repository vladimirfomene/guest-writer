const GitHubApi = require('github');
const github = new GitHubApi({});
const {spawnSync} = require('child_process');
const {promisify} = require('util');
const {to} = require('./util');

github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
});

const getBranch = promisify(github.repos.getBranch);
const createReference = promisify(github.gitdata.createReference);
const getCommits = promisify(github.repos.getCommits);
const getPullRequests = promisify(github.pullRequests.getAll);

const basicParams = {
    owner: 'auth0',
    repo: 'blog',
};

// createFile();

// assurePullRequest().then().catch(console.error);

updateBranch();

async function assureBranch() {
    const branch = getCurrentBranchName();

    if (branch === 'master') {
        throw new Error('please, create a branch for yourself (i.e. don\'t use master).');
    }

    const response = await to(getBranch({...basicParams, branch}));
    if (response[0]) {
        const lastCommit = await getCommits(basicParams);
        const sha = lastCommit.data[0].sha;
        const response = await to(createReference({
            ...basicParams,
            'ref': 'refs/heads/' + branch,
            'sha': sha
        }));
        if (response[0]) {
            return console.error(response[0]);
        }
    }
    return branch;
}

async function assurePullRequest() {
    const branchName = await assureBranch();
    const response = await to(getPullRequests({
        ...basicParams,
        head: 'brunokrebs:' + branchName
    }));
    if (response[0] || response[1].data.length === 0) {

    }
}

function updateBranch() {
    const branch = getCurrentBranchName();
    spawnSync('git', ['fetch', 'origin']);
    const res = spawnSync('git', ['merge', 'origin/' + branch]);
}

function createFile() {
    const params = {
        ...basicParams,
        path: 'testing.md',
        message: 'some message',
        content: Buffer.from('I really like ice cream!').toString('base64'),
        branch: 'testing123'
    };

    github.repos.createFile(params, (err, res) => {
        console.log(err, res);
    });
}

function getCurrentBranchName() {
    // getting current branch name
    const currentBranch = `${spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']).output[1]}`;
    return currentBranch.trim();
}