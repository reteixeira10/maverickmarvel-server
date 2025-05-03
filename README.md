# Express Server API

This project is a simple Express.js server that provides a REST API to deliver product data in JSON format. It is designed to be used with a React application.

## Project Structure

```
express-server
├── src
│   ├── app.js
│   └── routes
│       └── products.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd express-server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the Server

To start the server, run the following command:
```
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoint

- **GET /api/products**: Retrieves product data.

### Response

The API will respond with the following JSON object:
```json
{
  "name": "Mario",
  "material": "PLA",
  "weight": 0.100
}
```

## License

This project is licensed under the MIT License.