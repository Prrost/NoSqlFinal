document.getElementById('fetchData').addEventListener('click', fetchData);
document.getElementById('fetchMetrics').addEventListener('click', fetchMetrics);
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

        const outputDiv = document.getElementById('dataOutput');
        outputDiv.style.display = 'block';

        const timestamps = result.data.map(entry => new Date(entry.timestamp).toLocaleString());
        const values = result.data.map(entry => entry[field]);



        if (result.data.error) {
            outputDiv.innerHTML = `<p>Error: ${result.data.error}</p>`;
        } else {
            outputDiv.innerHTML = `<pre>${JSON.stringify(result.data, null, 2)}</pre>`;
            console.log(result.nums)
            renderChart(timestamps, values,field);
        }
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

async function fetchMetrics() {
    const field = document.getElementById('metricField').value;

    if (!field) {
        alert('Please provide field for metrics');
        return;
    }

    const url = `/api/measurements/metrics?field=${field}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const outputDiv = document.getElementById('metricsOutput');
        outputDiv.style.display = 'block';

        if (data.error) {
            outputDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
            outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
    } catch (err) {
        console.error('Error fetching metrics:', err);
    }
}

