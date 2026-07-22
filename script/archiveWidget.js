fetch('/blog/posts.json')
    .then(res => res.json())
    .then(posts => {
        const archive = {};

        // Month mapping to ensure accurate reverse sorting
        const monthOrder = {
            "January": 1, "February": 2, "March": 3, "April": 4,
            "May": 5, "June": 6, "July": 7, "August": 8,
            "September": 9, "October": 10, "November": 11, "December": 12
        };

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

        // 1. Sort years in descending order (2027, 2026...)
        const sortedYears = Object.keys(archive).sort((a, b) => b - a);

        let html = `<div class="aside-box__heading">
        <p>archive</p>
    </div>`;

        let isMostRecentMonth = true; // Tracks the newest month overall

        sortedYears.forEach(year => {
            let totalYearPosts = 0;
            let monthHtml = '';

            // 2. Sort months within the year in descending order (December -> January)
            const sortedMonths = Object.keys(archive[year]).sort((a, b) => {
                return (monthOrder[b] || 0) - (monthOrder[a] || 0);
            });

            sortedMonths.forEach(month => {
                const monthPosts = archive[year][month];
                totalYearPosts += monthPosts.length;

                // Only set 'open' for the very first month encountered (the most recent)
                const isOpen = isMostRecentMonth ? 'open' : '';
                if (isMostRecentMonth) {
                    isMostRecentMonth = false; // All subsequent months stay closed
                }

                monthHtml += `
                    <details ${isOpen} class="month-group">
                        <summary>${month} (${monthPosts.length})</summary>
                        <ul>
                            ${monthPosts.map(p => {
                                const displayTitle = p.shortTitle || p["short-title"] || p.title;
                                return `<li><a href="${p.url}">${displayTitle}</a></li>`;
                            }).join('')}
                        </ul>
                    </details>
                `;
            });

            // Years stay open by default
            html += `
                <details open>
                    <summary>${year} (${totalYearPosts})</summary>
                    ${monthHtml}
                </details>
            `;
        });

        document.getElementById('archive-container').innerHTML = html;
    });
