document.addEventListener("DOMContentLoaded", () => {
    const newsSection = document.querySelector(".news-list");

    // 從 JSON 文件加載新聞數據
    fetch("./news.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("無法加載新聞數據");
            }
            return response.json();
        })
        .then(newsData => {
            // 動態生成新聞列表
            newsData.forEach(news => {
                const article = document.createElement("article");
                article.innerHTML = `
                    <h3>${news.title}</h3>
                    <p>${news.content}</p>
                    <a href="${news.link}">閱讀更多</a>
                `;
                newsSection.appendChild(article);
            });
        })
        .catch(error => {
            console.error("新聞加載失敗:", error);
            newsSection.innerHTML = `<p>抱歉，無法加載新聞。</p>`;
        });
});
// Fetch JSON data and render news
fetch('news.json')
    .then(response => response.json())
    .then(data => {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = ''; // 清空內容，避免重複渲染

        data.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            // 渲染標題
            const title = document.createElement('h2');
            title.textContent = news.title;
            newsItem.appendChild(title);

            // 渲染內容，確保 HTML 正常插入
            const content = document.createElement('div');
            content.innerHTML = news.content; // 直接使用 HTML 格式的內容
            newsItem.appendChild(content);

            // 渲染連結
            const link = document.createElement('a');
            link.href = news.link;
            link.textContent = '閱讀更多';
            newsItem.appendChild(link);

            newsContainer.appendChild(newsItem);
        });
    })
    .catch(error => console.error('Error fetching news:', error));
