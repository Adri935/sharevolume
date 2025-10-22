# SEC Shares Outstanding Viewer

A web application that fetches and displays shares outstanding data from the SEC EDGAR database for publicly traded companies.

## Setup

1. Clone the repository
2. Serve the files using any static web server
3. Open `index.html` in a browser

## Usage

- By default, the app displays data for Assurant (CIK: 0001267238)
- To view data for another company, use the `?CIK=` query parameter with a 10-digit CIK
  Example: `index.html?CIK=0001018724`

## Code Explanation

- `index.html`: Main page with semantic structure and dynamic content areas
- `style.css`: Responsive styling with a clean, professional appearance
- `script.js`: Handles data fetching, processing, and dynamic DOM updates
- Data is fetched from SEC's XBRL API with proper User-Agent header
- JSON data is processed to find max/min share values after 2020

## License

MIT