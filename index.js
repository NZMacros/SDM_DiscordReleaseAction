import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

const token = core.getInput('token');
const channel = core.getInput('channel');
const color = core.getInput('color');
const author = core.getInput('author');
const baseURL = 'https://discord.com/api/v10';

const release = github.context.payload.release;

const message = {
    content: '@everyone',
    embeds: [{
        color: color,
        author: {
            name: 'New Skibi Defense Macro Release!',
            icon_url: author
        },
        title: release.name,
        url: release.html_url,
        fields: [
            {
                name: '<:githubPurple:1322707586835025981>  Repository',
                value: '[View (give us a star!)](https://github.com/NZMacros/SkibiDefenseMacro)'
            },
            {
                name: '<:patchNotes_purple:1322707760478949437>  Patch Notes & Update Changes',
                value: `[See what's new](${release.html_url})`
            },
            {
                name: '<:downloadPurple:1322707648742686741>  Direct Download',
                value: ('assets' in release && release.assets.length > 0) ? `[Click here to download](${release.assets[0].browser_download_url})` : `[Click here to download](${release.zipball_url})`
            }
        ],
        timestamp: release.published_at
    }]
};

const headers = {'Authorization': `Bot ${token}`, 'Content-Type': 'application/json'};

fetch(`${baseURL}/channels/${channel}/messages`, {method: 'POST', body: JSON.stringify(message), headers: headers})
    .then(response => response.json())
    .then(message => {core.info(JSON.stringify(message)); return fetch(`${baseURL}/channels/${channel}/messages/${message.id}/crosspost`, {method: 'POST', headers: headers})})
    .then(response => response.text())
    .then(text => {core.info(text)})
    .catch(err => {core.setFailed(err.message)});
