# End Match Machine Tabulator

## Project Overview

The End Match Machine Tabulator is a system that collects serial data from a Raspberry Pi, pushes the data to a React app served to a point of collection tablet, authenticates users via OAuth, and pushes the collected data to a Google Spreadsheet. The system consists of the following components:

- React App: Served to the point of collection tablet for user interaction and data display.
- Raspberry Pi Server: Collects serial data and pushes it to the React app.
- Cloud Server: Handles OAuth authentication and provides the Google API application ID.

## Development Progress

### React App

- [x] Set up the project structure and dependencies
- [ ] Create the main components and routes
- [ ] Implement the user interface for displaying collected data
- [ ] Integrate with the Raspberry Pi server for receiving data updates
- [ ] Implement OAuth authentication flow
- [ ] Push collected data to the Google Spreadsheet

### Raspberry Pi Server

- [ ] Set up the Raspberry Pi environment and dependencies
- [ ] Implement serial data collection
- [ ] Establish communication with the React app
- [ ] Push collected data to the React app in real-time
- [ ] Handle OAuth authentication flow
- [ ] Use the OAuth token to push data to the Google Spreadsheet

### Cloud Server

- [ ] Set up the server environment and dependencies
- [ ] Configure the Google API application and obtain the application ID
- [ ] Implement OAuth authentication endpoints
- [ ] Securely store and provide the Google API application ID to the Raspberry Pi server

### Google Spreadsheet Integration

- [ ] Create a new Google Spreadsheet for storing the collected data
- [ ] Set up the necessary permissions and sharing settings
- [ ] Implement the logic to push data to the specified spreadsheet using the Google Sheets API

### OAuth and Google Drive Integration

Regarding querying the user's Google Drive for spreadsheets, it is recommended to handle this on the server side (either the Raspberry Pi server or the cloud server) rather than on the client side (React app). Here's the recommended approach:

- [ ] On the server side, use the obtained OAuth access token to make requests to the Google Drive API.
- [ ] Retrieve the list of spreadsheets accessible to the user.
- [ ] Present the list of spreadsheets to the user in the React app for selection.
- [ ] Upon user selection, send the selected spreadsheet ID back to the server.
- [ ] Use the spreadsheet ID to push the collected data to the specific spreadsheet.

Handling the Google Drive integration on the server side provides better security and allows for server-side validation and control over the data being accessed and modified.

## Installation and Setup

- [ ] Provide instructions for setting up the development environment
- [ ] Include steps for configuring the necessary dependencies and tools
- [ ] Specify any required environment variables or configuration files

## Deployment

- [ ] Document the process for deploying the React app
- [ ] Provide instructions for setting up and deploying the Raspberry Pi server
- [ ] Include guidelines for configuring the cloud server and hosting environment

## Troubleshooting and FAQs

- [ ] Add common issues and their solutions
- [ ] Include frequently asked questions and their answers
