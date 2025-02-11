# Weather Data API

This project provides a simple API for storing and retrieving weather data using MongoDB and Express.js. The application allows uploading JSON files with weather measurements and querying stored data via REST API.

## Features
- Upload weather data via a JSON file
- Retrieve time-series data for a specific field within a date range
- Visualize data using Chart.js in the frontend

## Technologies Used
- Node.js
- Express.js
- MongoDB (via Docker)
- Multer (for file uploads)
- Chart.js (for frontend visualization)
- HTML, CSS, JavaScript

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Prrost/NoSqlFinal.git
   cd NoSqlFinal
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start MongoDB using Docker:
   ```sh
   docker run --name mongodb-container -d -p 27018:27017 -v mongodb_data:/data/db mongo:latest
   ```

4. Start the application:
   ```sh
   node app.js
   ```

## API Endpoints

### Upload Data
**POST** `/api/upload`
- Uploads a JSON file containing weather measurements.
- Expects a file upload under the key `file`.
- Example request:
  ```sh
  curl -X POST -F "file=@data.json" http://localhost:8080/api/upload
  ```

### Fetch Time-Series Data
**GET** `/api/measurements`
- Retrieves weather data for a given field within a date range.
- Query Parameters:
    - `field`: Name of the weather parameter (e.g., `temp`, `humidity`).
    - `startDate`: Start date in `YYYY-MM-DD` format.
    - `endDate`: End date in `YYYY-MM-DD` format.
- Example request:
  ```sh
  curl "http://localhost:8080/api/measurements?field=temp&startDate=2024-01-01&endDate=2024-01-10"
  ```

## Frontend
The project includes a simple frontend:
- Displays a form to select a weather field and date range.
- Fetches and visualizes data using Chart.js.
- Provides a file upload button for data submission.

To access the frontend, open `http://localhost:8080` in a browser.

## File Structure
```
NoSqlFinal/
│── public/        # Frontend files (HTML, CSS, JS)
│── uploads/       # Uploaded JSON files
│── app.js         # Main server file
│── package.json   # Project dependencies
│── README.md      # Documentation
```

## Contributors
- **Prettser Rostislav**
- **Islam Akhmetov**