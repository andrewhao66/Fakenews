document.addEventListener("DOMContentLoaded", () => {
    const newsSection = document.querySelector(".news-list");

    // 從 JSON 文件加載新聞數據
    fetch("news.json")
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
