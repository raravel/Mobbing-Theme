const path = require('path');
const fs = require('fs');
const site = "mobbing.github.io/";

const postsJS = fs.readFileSync('./posts/posts.js').toString().split('\n');
const postsStr = postsJS.slice(1, postsJS.length).join('');
const posts = JSON.parse(postsStr);

var sitemap = "";

if ( typeof posts === "object" ) {
    let key = Object.keys(posts);
    for (let i=0;i < key.length;i++) {
        let obj = posts[key[i]];
        if ( obj.type == 'single' ) {
            sitemap += `<url><loc>https://${path.join(site, obj.href).replace(/\\/g, "/")}</loc></url>\n`;
            obj.posts.forEach(element => {
                sitemap += `<url><loc>https://${path.join(site, element.href).replace(/\\/g, "/")}</loc></url>\n`;
            });
        } else if ( obj.type == 'dropdown' ) {
            let child = { obj : obj.posts, key : Object.keys(obj.posts) };
            for (let ci = 0;ci < child.key.length;ci++) {
                let cobj = child.obj[child.key[ci]];
                sitemap += `<url><loc>https://${path.join(site, cobj.href).replace(/\\/g, "/")}</loc></url>\n`;
                cobj.posts.forEach(element => {
                    sitemap += `<url><loc>https://${path.join(site, element.href).replace(/\\/g, "/")}</loc></url>\n`;
                });
            }
        }
    }
}

fs.writeFileSync("./sitemap.xml", 
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemap}</urlset>`
, {encoding:'utf8'});