// Ensure `posts` is attached to the window object for global access
window.posts = [
    {
        title: 'Post 1',
        content: 'This is the content of the first post.',
        date: '2022-01-01'
    },
    {
        title: 'Post 2',
        content: 'This is the content of the second post.',
        date: '2022-01-02'
    },
    {
        title: 'Forecasts:',
        content: 'The forecast...',
        date: '2022-01-03'
    }
    // Add more posts as needed
];

function fetchLatestPost() {
    console.log('fetchLatestPost function called');
    console.log('posts:', window.posts); // Log the posts array
    try {
        // Log the date properties of your posts
        window.posts.forEach(post => console.log('post date:', post.date));
        // Sort posts by date in descending order and return the latest one directly
        return window.posts.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    } catch (error) {
        console.error('Error fetching the latest post:', error);
        return null;
    }
}

// Call the function
const latestPost = fetchLatestPost();
console.log('Latest Post:', latestPost);