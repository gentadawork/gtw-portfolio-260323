// note.comのRSSフィードを取得して表示するコード
const RSS_URL = "https://note.com/llgenll8165/rss";
const PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
const FETCH_NUMBER = 5; // 表示する件数
const SS_INTERESTS = document.querySelector("#ss-interests");

try {
  fetch(PROXY_URL)
    .then(res => {
      if (!res.ok) {
        // HTTPエラーが発生した場合は例外をスローする
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      if (!data.items || !Array.isArray(data.items)) {
        // itemsプロパティが存在しない、または配列でない場合は例外をスローする
        throw new Error('Invalid data format: items array is missing');
      }
      data.items.slice(0, FETCH_NUMBER).forEach(item => {
        const note_list = document.querySelector(".note-list");
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = item.title;
        li.appendChild(a);
        const pubDate = new Date(item.pubDate);
        li.appendChild(document.createTextNode(` - ${pubDate.toISOString().split('T')[0]}`));
        note_list.appendChild(li);
      });
    });
} catch (error) {
  // 失敗時は興味関心の項目を非表示にする
  SS_INTERESTS.style.display = 'none';
  // ネットワーク失敗、JSONパース失敗などのエラーが発生した場合にコンソールにエラーメッセージを表示する
  console.error('Error fetching RSS feed:', error);
}

