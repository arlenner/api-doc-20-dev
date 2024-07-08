const { readdir, readFile, writeFile } = require('node:fs/promises');
const path = require('node:path');


const original = `
---
layout: default
title: Authorization Procedure
permalink: /all-ops/websockets/auth
grand_parent: API Operations
parent: WebSockets
---

## Header

Hi I'm some text content in this .md file.

`

const main = async () => {
    const files = await readdir('./md', { recursive: true });
    const filteredFiles = files
        .filter((x) => x.endsWith('.md'))
        // .filter((_, i) => i === 0)
    ;
    console.log(filteredFiles);
    let catContent = '';
    for (const file of filteredFiles) {
        let content = await readFile(path.join(__dirname, `../md/${file}`), { encoding: 'utf-8' })
        catContent = catContent.concat(`\n${content}\n`);
    }

    // console.log(catContent);
    catContent = cleanFrontMatter(catContent);
    await writeFile(path.join(__dirname, './cat-result.md'), catContent, 'utf-8');
    
}

main();

// run();

/**
 * 
 * @param {string} content 
 */
function cleanFrontMatter(content) {
    // console.log(content);

    const regex = /---\s(.*:.*\s)*---/g;
    const regex2 = /---\s([A-Za-z_]*:[A-Za-z0-9_/\-\s]*\s)*---/g

    console.log(content.match(regex2))

    // The substituted value will be contained in the result variable
    const result = content.replace(regex2, '');
    // console.log(result);

    return result;
    
}

