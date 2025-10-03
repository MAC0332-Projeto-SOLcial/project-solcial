# Engineer Registration Backend

This project is a Node.js backend application for registering engineers, utilizing MongoDB for data storage. It provides a RESTful API for managing engineer records, including creating, retrieving, updating, and deleting engineers.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/engineer-registration-backend.git
   ```

2. Navigate to the project directory:
   ```
   cd engineer-registration-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up your MongoDB database and update the connection string in `src/config/db.js`.

## Usage

To start the application, run:
```
npm start
```
The server will start on the specified port (default is 3000).

## API Endpoints

### Engineers

- **POST /engineers**: Create a new engineer
- **GET /engineers**: Retrieve all engineers
- **GET /engineers/:id**: Retrieve a specific engineer by ID
- **PUT /engineers/:id**: Update an engineer by ID
- **DELETE /engineers/:id**: Delete an engineer by ID

## Testing

To run the automated tests, use:
```
npm test
```
This will execute the integration tests defined in the `tests/integration/engineer.integration.test.js` file.

## License

This project is licensed under the MIT License.