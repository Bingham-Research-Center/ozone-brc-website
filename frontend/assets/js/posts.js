// Ensure `posts` is attached to the window object for global access
window.posts = [
    {
        title: 'Forecasts:',
        content: 'This is the content of the first post.',
        date: 'September 24, 2024'
    },
    {
        title: 'Forecasts:',
        content: 'This is the content of the second post.',
        date: 'September 25, 2024'
    },
    {
        title: 'Forecasts:',
        content: 'The forecast for the next week is sunny with a chance of rain.',
        date: 'September 3, 2024'
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