const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const postsJS = fs.readFileSync('./posts/posts.js').toString().split('\n');
const postsStr = postsJS.slice(1, postsJS.length).join('');
const posts = JSON.parse(postsStr);

Date.prototype.getPubData = function() {
	return this.toString().split(/\s/).slice(0, -2).join(' ');
};

var site = "https://mobbing.github.io";
const config = {
	site: "https://mobbing.github.io",
	title: "Commit Complete",
	image: path.join(site, "/resource/img/logo.png"),
	description: "",
	language: "ko",
	generator: "mobbing-theme",
	pubData: new Date().getPubData(),
};

String.prototype.escapeHtml = function() {
	let map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
		"=": '&#x3D;'
	};
	
	return this.replace(/[&<>"']/g, function(m) { return map[m]; });
};

var rssItems = "";
Object.keys(posts).forEach(e => {
	let p = posts[e].posts;
	if ( Array.isArray(p) ) {
		//posting
		p.forEach(post => {
			let file = path.join(__dirname, post.href, "index.html");
			let fileStat = fs.statSync(file).birthtime;
			let fpub = new Date(fileStat).getPubData();
			let des = new JSDOM(fs.readFileSync(file, {encoding:'utf8'}))
						.window.document.querySelector('#container').textContent
						.substring(0, 400)
						.escapeHtml();
			rssItems += `
				<item>
					<author/>
					<category>
						<![CDATA[ ${e} ]]>
					</category>
					<title>
						<![CDATA[ ${post.title} ]]>
					</title>
					<link>${path.join(config.site, post.href).replace(/\\/g, "/").replace("https:/", "https://")}</link>
					<guid>${path.join(config.site, post.href).replace(/\\/g, "/").replace("https:/", "https://")}</guid>
					<description>
						<![CDATA[
							${des}.......
						]]>
					</description>
					<pubData>${fpub}</pubData>
					<tag>
						<![CDATA[  ]]>
					</tag>
					<activity:verb>http://activitystrea.ms/schema/1.0/post</activity:verb>
					<activity:object-type>http://activitystrea.ms/schema/1.0/blog-entry</activity:object-type>
				</item>
			`;
		});
	} else {
		//submenus
		Object.keys(p).forEach(k => {
			let cp = p[k].posts;
			cp.forEach(post => {
				let file = path.join(__dirname, post.href, "index.html");
				let fileStat = fs.statSync(file).birthtime;
				let fpub = new Date(fileStat).getPubData();
				let des = new JSDOM(fs.readFileSync(file, {encoding:'utf8'}))
						.window.document.querySelector('#container').textContent
						.substring(0, 400)
						.escapeHtml();
				rssItems += `
					<item>
						<author/>
						<category>
							<![CDATA[ ${k} ]]>
						</category>
						<title>
							<![CDATA[ ${post.title} ]]>
						</title>
						<link>${path.join(config.site, post.href).replace(/\\/g, "/").replace("https:/", "https://")}</link>
						<guid>${path.join(config.site, post.href).replace(/\\/g, "/").replace("https:/", "https://")}</guid>
						<description>
							<![CDATA[
								${des}.......
							]]>
						</description>
						<pubData>${fpub}</pubData>
						<tag>
							<![CDATA[  ]]>
						</tag>
						<activity:verb>http://activitystrea.ms/schema/1.0/post</activity:verb>
						<activity:object-type>http://activitystrea.ms/schema/1.0/blog-entry</activity:object-type>
					</item>
				`;
			});
		});
	}
});

var rss = `<rss xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" xmlns:activity="http://activitystrea.ms/spec/1.0/" version="2.0">
	<channel>
		<title>
			<![CDATA[ ${config.title} ]]>
		</title>
		<link>${config.site}</link>
		<image>
			<url>
				<![CDATA[ ${config.image} ]]>
			</url>
			<title>
				<![CDATA[ ${config.title} ]]>
			</title>
			<link>${config.site}</link>
		</image>
		<description>
			<![CDATA[ ${config.description} ]]>
		</description>
		<language>${config.language}</language>
		<generator>${config.generator}</generator>
		<pubData>${config.pubData}</pubData>
		${rssItems}
	</channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, 'rss'), rss, {encoding: 'utf8'});
console.log("Done!");