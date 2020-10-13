const fetch = require('node-fetch');
const { exec } = require('child_process');
const yaml = require('yaml');
const semver = require('semver');

const url =
    'https://dropmaster-cdn.s3-sa-east-1.amazonaws.com/releases/win-x64/latest.yml';

fetch(url).then((response) => {
    if (response.status !== 200) {
        process.exit(1);
    } else {
        response.text().then((text) => {
            const { version } = yaml.parse(text);
            const newVersion = semver.parse(version).inc('patch').toString();
            exec(`npx yarn version --new-version ${newVersion}`);
        });
    }
});
