document.getElementById("scrapeButton").addEventListener("click", function () {
    const url = document.getElementById("urlInput").value;
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    // Clear previous results
    status.textContent = "";
    results.innerHTML = "";

    if (!url.startsWith("http")) {
        alert("Please enter a valid URL with 'http://' or 'https://'.");
        return;
    }

    status.textContent = "Scraping started...";
    results.innerHTML = ""; // Reset previous results

    // Use fetch to get the content of the page
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            // Find all <a> tags with href attributes
            const links = doc.querySelectorAll('a[href]');
            const fileLinks = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                
                // Match files based on common extensions (images, PDFs, scripts, etc.)
                if (href.match(/\.(jpg|jpeg|png|gif|pdf|mp3|zip|html|js|css|cs|py|csharp)$/i)) {
                    fileLinks.push(href);
                }
            });

            // Display the results
            if (fileLinks.length === 0) {
                status.textContent = "No downloadable files found.";
            } else {
                status.textContent = `Found ${fileLinks.length} files.`;
                fileLinks.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.classList.add('file-item');

                    const fileLink = document.createElement('a');
                    fileLink.href = file;
                    fileLink.target = "_blank";
                    fileLink.classList.add('file-link');
                    fileLink.textContent = file;

                    const downloadButton = document.createElement('button');
                    downloadButton.classList.add('download-button');
                    downloadButton.textContent = "Download";
                    downloadButton.onclick = function () {
                        window.open(file, '_blank');
                    };

                    fileItem.appendChild(fileLink);
                    fileItem.appendChild(downloadButton);
                    results.appendChild(fileItem);
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            status.textContent = "Error occurred while scraping.";
        });
});
