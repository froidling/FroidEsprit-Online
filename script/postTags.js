document.addEventListener('DOMContentLoaded', async () => {
    const tagsContainer = document.getElementById('tag-list');
    if (!tagsContainer) return;

    // 1. Get current page URL path
    const currentPath = window.location.pathname;

    try {
        // 2. Fetch posts metadata
        const response = await fetch('/blog/posts.json');
        const posts = await response.json();

        // 3. Find the post entry that matches the current page URL
        const currentPost = posts.find(post => {
            const cleanPostUrl = post.url.replace(/\.html$/, '');
            const cleanCurrentPath = currentPath.replace(/\.html$/, '');
            return cleanPostUrl === cleanCurrentPath;
        });
        // 4. If matching post and tags exist, render them
        if (currentPost && currentPost.tags && currentPost.tags.length > 0) {

            // Map each tag into a clickable link pointing to categories.html
            const tagLinks = currentPost.tags.map(tag => {
                return `<a href="/blog/categories.html?type=${encodeURIComponent(tag)}">${tag}</a>`;
            });

            // Join tags with a comma and space: "Tags: photography, radio"
            tagsContainer.innerHTML = `Tags: ${tagLinks.join(', ')}`;
        } else {
            // Hide container if post has no tags
            tagsContainer.style.display = 'none';
        }

    } catch (err) {
        console.error('Error loading post tags:', err);
        tagsContainer.style.display = 'none';
    }
});