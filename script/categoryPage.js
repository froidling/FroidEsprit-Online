document.addEventListener('DOMContentLoaded', async () => {
  const titleEl = document.getElementById('page-title');
  const resetEl = document.getElementById('filter-reset');
  const container = document.getElementById('category-posts-container');

  const urlParams = new URLSearchParams(window.location.search);
  const selectedTag = urlParams.get('type');

  try {

    const response = await fetch('/blog/posts.json');
    const posts = await response.json();

    const tagMap = {};


    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (!tagMap[tag]) {
            tagMap[tag] = [];
          }
          tagMap[tag].push(post);
        });
      }
    });

    let tagsToRender = Object.keys(tagMap).sort();


    if (selectedTag) {
      const normalizedSelected = decodeURIComponent(selectedTag);

      if (tagMap[normalizedSelected]) {
        tagsToRender = [normalizedSelected];
        if (titleEl) titleEl.textContent = `Category: ${normalizedSelected}`;
        if (resetEl) resetEl.style.display = 'block';
      } else {
        if (container) container.innerHTML = `<p>No posts found for tag: "${normalizedSelected}"</p>`;
        return;
      }
    } else {
      if (titleEl) titleEl.textContent = 'All Categories';
      if (resetEl) resetEl.style.display = 'none';
    }

    let html = '';

    tagsToRender.forEach(tag => {
      const tagPosts = tagMap[tag];

      html += `<section class="category-group" style="margin-bottom: 2rem;">`;
      html += `<h2><a href="/blog/categories.html?type=${encodeURIComponent(tag)}"># ${tag}</a></h2>`;
      html += `<ul class="category-post-list">`;

      tagPosts.forEach(post => {
        const summaryText = post.summary ? `<p class="post-summary">${post.summary}</p>` : '';
        const displayTitle = post.title || post.title;

        html += `
          <li>
            <a href="${post.url}">${displayTitle}</a>
            ${summaryText}
          </li>
        `;
      });

      html += `</ul>`;
      html += `</section>`;
    });

    if (container) container.innerHTML = html;

  } catch (err) {
    console.error('Error rendering categories page:', err);
    if (container) container.innerHTML = '<p>Failed to load categories.</p>';
  }
});