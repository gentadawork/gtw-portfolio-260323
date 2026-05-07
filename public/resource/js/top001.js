// note.comのRSSフィードを取得して表示するコード
const RSS_URL = "https://note.com/llgenll8165/rss";
const PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
const FETCH_NUMBER = 5; // 表示する件数
const SS_INTERESTS = document.querySelector("#ss-interests");
const NAV_INTERESTS = document.querySelector("#nav-interests");
const HR_INTERESTS = document.querySelector("#hr-interests");

// 興味関心の項目を非表示にする関数
function hideInterests() {
  if (SS_INTERESTS) SS_INTERESTS.style.display = 'none';
  if (NAV_INTERESTS) NAV_INTERESTS.style.display = 'none';
  if (HR_INTERESTS) HR_INTERESTS.style.display = 'none';
}

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
    const note_list = document.querySelector(".note-list");
    if (!note_list) {
      // 表示先が見つからない場合は興味関心の項目を非表示にして安全に中断する
      hideInterests();
      return;
    }
    data.items.slice(0, FETCH_NUMBER).forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.title;
      li.appendChild(a);
      const pubDate = new Date(item.pubDate);
      li.appendChild(document.createTextNode(` - ${pubDate.toLocaleDateString()}`));
      note_list.appendChild(li);
    });
  })
  .catch(error => {
    // 失敗時は興味関心の項目を非表示にする
    hideInterests();
    // ネットワーク失敗、JSONパース失敗などのエラーが発生した場合にコンソールにエラーメッセージを表示する
    console.error('Error fetching RSS feed:', error);
  });

