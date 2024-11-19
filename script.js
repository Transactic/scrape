document.getElementById("scrapeButton").addEventListener("click", function () {
    const url = document.getElementById("urlInput").value.trim();
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    // Clear previous results
    status.textContent = "";
    results.innerHTML = "";

    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    if (!urlPattern.test(url)) {
        alert("Please enter a valid URL (starting with http:// or https://).");
        return;
    }

    status.textContent = "Scraping started...";
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const links = doc.querySelectorAll('a[href]');
            const base = new URL(url);
            const fileLinks = [];

            links.forEach(link => {
                let href = link.getAttribute('href');
                if (!href) return;

                // Convert relative URLs to absolute URLs
                if (!href.startsWith("http")) {
                    href = new URL(href, base).href;
                }

                if (href.match(/\.(jpg|jpeg|png|gif|pdf|mp3|zip|html|js|css|cs|py|csharp)$/i)) {
                    fileLinks.push(href);
                }
            });

            if (fileLinks.length === 0) {
                status.textContent = "No downloadable files found.";
            } else {
                status.textContent = `Found ${fileLinks.length} file(s).`;
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
            status.textContent = `Error: ${error.message}`;
        });
});
