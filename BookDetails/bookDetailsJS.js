document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const seeLessBtn = document.getElementById('see-less-btn');
    const hiddenReviews = document.querySelectorAll('.review.hidden');

    // Tab switching functionality
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            toggleActiveClass(tabs, tabContents, index);
        });
    });

    // Load more and see less functionality
    if (loadMoreBtn && seeLessBtn) {
        loadMoreBtn.addEventListener('click', () => toggleReviews(true));
        seeLessBtn.addEventListener('click', () => toggleReviews(false));
    }

    // Helper function to toggle active class for tabs
    function toggleActiveClass(tabs, contents, activeIndex) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        tabs[activeIndex].classList.add('active');
        contents[activeIndex].classList.add('active');
    }

    // Helper function to toggle reviews visibility
    function toggleReviews(showMore) {
        hiddenReviews.forEach(review => review.classList.toggle('hidden', !showMore));
        loadMoreBtn.classList.toggle('hidden', showMore);
        seeLessBtn.classList.toggle('hidden', !showMore);
    }
});