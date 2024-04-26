# Silverlight Dashboard

Silverlight is a custom dashboard developed for epcrock, one of the Forbes 500 companies, to analyze and visualize the technologies used by competing websites along with the page count of the given websites.

## Features

- **URL Input**: Users can input the URL of any website to retrieve information about the technologies used.
- **Validation**: The URL is validated with a regular expression, and the analyze button is disabled if the URL is not valid.
- **Concurrent Analysis**: Multiple websites can be analyzed simultaneously without blocking the input.
- **Pagination**: Analysis targets are paginated and can display 3 websites at a time.
- **Analysis Results**: Once the analysis of a website is completed, the 'Analyzing' text is changed to a 'View More' link which leads to the detail page showing the technologies and page count.

## Technical Stack

- **Frontend**: React v18+
- **Backend**: NodeJS v16+
- **API**: BuiltWith for technical analysis of websites
- **Version Control**: Git

## Installation

Before installation, ensure you have Node.js version 16 or higher installed.

```sh
# Clone the repository
git clone https://github.com/your-username/silverlight-dashboard.git

# Navigate to the project directory
cd silverlight-dashboard

# Install dependencies for the server
cd server
npm install

# Install dependencies for the client
cd ../client
npm install

# Run the server
node server.js

# Run the client from the client directory in a new terminal window
npm start
```
