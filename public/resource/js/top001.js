// note.comのRSSフィードを取得して表示するコード
const RSS_URL = "https://note.com/llgenll8165/rss";
const PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

fetch(PROXY_URL)
  .then(res => res.json())
  .then(data => {
    const ul = document.querySelector(".note-list");
    data.items.slice(0, 5).forEach(item => { // 最新5件を表示
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a> - ${item.pubDate.split(' ')[0]}`;
      ul.appendChild(li);
    });
  });
