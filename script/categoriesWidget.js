fetch('/blog/posts.json')
    .then(res => res.json())
    .then(posts => {
        const categoryCounts = {};

        posts.forEach(post => {
            // Takes categories
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    categoryCounts[tag] = (categoryCounts[tag] || 0) + 1
                });
            }
        });
        let html = `<div class="aside-box__heading">
                <p>tags</p>
            </div>
            <ul class="category-list">`;

        const sortedCategories = Object.keys(categoryCounts).sort();

        sortedCategories.forEach(tag => {
            const count = categoryCounts[tag];
            html += `<li><a href="/blog/categories.html?type=${encodeURIComponent(tag)}">${tag}</a></li>`;


            const container = document.getElementById('categories-container');
            if (container) {
                container.innerHTML = html;
            }
        });
    })
    .catch(err => console.error('Error loading categories:'), err);
html += `</ul>`;