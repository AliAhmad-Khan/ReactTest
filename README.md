# React Resource Management Application

A React-based application for managing various resources. The application supports both static data mode and API integration.

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

To check your versions:
```bash
node --version
npm --version
```

## Getting Started

### 1. Clone and Navigate to Project
```bash
cd ReactTest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

The application uses environment variables for configuration. You have two options:

#### Option A: Use Static Data (Default - No API Required)
The application is configured to use static data by default, so you can run it immediately without any additional setup.

#### Option B: Configure API Integration
If you want to use real API calls instead of static data:

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and configure your settings:
   ```env
   # Set to 'false' to use API calls instead of static data
   REACT_APP_USE_STATIC_DATA=false
   
   # Your API base URL
   REACT_APP_API_BASE_URL=https://your-api-server.com/api
   
   # API timeout in milliseconds
   REACT_APP_API_TIMEOUT=10000
   ```

### 4. Start the Development Server
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Application Features

- **Resource Management**: View and manage various resource types
- **Search & Filter**: Advanced filtering and search capabilities
- **Pagination**: Efficient data pagination
- **Responsive Design**: Works on desktop and mobile devices
- **Data Source Toggle**: Switch between static data and API integration

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── constants/          # Application constants
├── data/              # Static data files
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # Data services and providers
└── App.js             # Main application component
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   - The development server will automatically suggest an alternative port
   - Or kill the process using port 3000: `npx kill-port 3000`

2. **Dependencies not found**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Environment variables not working**
   - Make sure your `.env` file is in the project root
   - Restart the development server after creating/modifying `.env`

### Getting Help

If you encounter any issues not covered here, please check:
- The console for error messages
- Browser developer tools for network issues
- Node.js and npm versions compatibility
