fetch('/blog/posts.json')
    .then(res => res.json())
    .then(posts => {
        const archive = {};

        posts.forEach(post => {
            // Takes URL and converts into slices
            const parts = post.url.split('/');
            const year = parts[2];

            const rawMonth = parts[3];
            const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);

            if (!archive[year]) archive[year] = {};
            if (!archive[year][month]) archive[year][month] = [];

            archive[year][month].push(post);
        });

        // Create tree
        let html = `<div class="aside-box__heading">
        <p>archive</p>
    </div>`
        for (const year in archive) {
            let totalYearPosts = 0;
            let monthHtml = '';
            for (const month in archive[year]) {
                const monthPosts = archive[year][month];
                totalYearPosts += monthPosts.length;

                monthHtml += `
                    <details open class="month-group">
                        <summary>${month} (${monthPosts.length})</summary>
                         <ul>
                            ${monthPosts.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('')}
                        </ul>
                    </details>
                `;
            }
            html += `
                <details open>
                    <summary>${year} (${totalYearPosts})</summary>
                    ${monthHtml}
                </details>
            `;
        }
        document.getElementById('archive-container').innerHTML = html;
    })