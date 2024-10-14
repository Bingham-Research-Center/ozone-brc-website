document.addEventListener('DOMContentLoaded', function() {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            const fileContentsDiv = document.getElementById('fileContents');
            files.forEach(file => {
                fetch(file)
                    .then(response => response.text())
                    .then(content => {
                        const fileDiv = document.createElement('div');
                        fileDiv.innerHTML = `<h2>${file}</h2><pre>${content}</pre>`;
                        fileContentsDiv.appendChild(fileDiv);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching files:', error);
        });
});
