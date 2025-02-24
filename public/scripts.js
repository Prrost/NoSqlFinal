document.getElementById('fetchData').addEventListener('click', fetchData);
let chartInstance = null;

async function fetchData() {
    const field = document.getElementById('field').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!field || !startDate || !endDate) {
        alert('Please provide field, start date, and end date');
        return;
    }

    const url = `/api/measurements?field=${field}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);

        const outputDiv = document.getElementById('dataOutput');
        const metricsDiv = document.getElementById('metricsOutput');

        outputDiv.style.display = 'block';
        metricsDiv.style.display = 'block';

        if (result.error) {
            outputDiv.innerHTML = `<p>Error: ${result.error}</p>`;
            metricsDiv.innerHTML = "";
            return;
        }

        const timestamps = result.data.map(entry => entry.datetime);
        const values = result.data.map(entry => entry[field]);

        outputDiv.innerHTML = `<pre>${JSON.stringify(result.data, null, 2)}</pre>`;

        metricsDiv.innerHTML = `
            <h3>Metrics:</h3>
            <p><strong>Avg:</strong> ${result.avg.toFixed(2)}</p>
            <p><strong>Min:</strong> ${result.min}</p>
            <p><strong>Max:</strong> ${result.max}</p>
        `;

        renderChart(timestamps, values, field);
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

function renderChart(labels, data, field) {
    const ctx = document.getElementById('chart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: field,
                data,
                borderColor: 'blue',
                fill: false
            }]
        }
    });
}


document.getElementById("uploadButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("uploadStatus");

    if (!fileInput.files.length) {
        status.textContent = "Please select a file.";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    status.textContent = "Uploading...";

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            status.textContent = "File uploaded successfully!";
        } else {
            status.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        console.error("Upload error:", error);
        status.textContent = "Upload failed.";
    }
});
