// Fetch JSON data and render news
fetch('news.json')
    .then(response => response.json())
    .then(data => {
        const newsContainer = document.getElementById('news-container');
        data.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            // Render title
            const title = document.createElement('h2');
            title.textContent = news.title;
            newsItem.appendChild(title);

            // Render content with paragraph breaks
            const content = document.createElement('div');
            content.innerHTML = news.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');
            newsItem.appendChild(content);

            // Render link
            const link = document.createElement('a');
            link.href = news.link;
            link.textContent = '閱讀更多';
            newsItem.appendChild(link);

            newsContainer.appendChild(newsItem);
        });
    })
    .catch(error => console.error('Error fetching news:', error));
