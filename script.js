// Parse URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Fetch data from SEC API
async function fetchSecData(cik) {
  const url = `https://data.sec.gov/api/xbrl/companyconcept/CIK${cik}/dei/EntityCommonStockSharesOutstanding.json`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Process SEC data to find max/min values
function processSecData(data) {
  const entityName = data.entityName;
  
  // Filter shares data for fiscal years > 2020 with numeric values
  const shares = (data.units?.shares || []).filter(item => 
    item.fy > "2020" && 
    typeof item.val === 'number' && 
    !isNaN(item.val)
  );
  
  if (shares.length === 0) {
    throw new Error('No valid shares data found for years after 2020');
  }
  
  // Find max and min values
  let max = shares[0];
  let min = shares[0];
  
  shares.forEach(item => {
    if (item.val > max.val) max = item;
    if (item.val < min.val) min = item;
  });
  
  return {
    entityName,
    max: { val: max.val, fy: max.fy },
    min: { val: min.val, fy: min.fy }
  };
}

// Update the DOM with processed data
function updateDom(data) {
  // Update page title
  document.getElementById('page-title').textContent = `${data.entityName} - Shares Outstanding`;
  
  // Update entity name
  document.getElementById('share-entity-name').textContent = data.entityName;
  
  // Update max values
  document.getElementById('share-max-value').textContent = data.max.val.toLocaleString();
  document.getElementById('share-max-fy').textContent = data.max.fy;
  
  // Update min values
  document.getElementById('share-min-value').textContent = data.min.val.toLocaleString();
  document.getElementById('share-min-fy').textContent = data.min.fy;
}

// Main function
async function main() {
  try {
    // Get CIK from URL parameter or default to Assurant
    const cik = getUrlParameter('CIK') || '0001267238';
    
    // Validate CIK format
    if (!/^[0-9]{10}$/.test(cik)) {
      throw new Error('Invalid CIK format. Must be a 10-digit number.');
    }
    
    // Fetch and process data
    const rawData = await fetchSecData(cik);
    const processedData = processSecData(rawData);
    
    // Update the DOM
    updateDom(processedData);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('share-entity-name').textContent = 'Error Loading Data';
    
    // Show error in data fields
    const errorMsg = 'Data not available';
    document.getElementById('share-max-value').textContent = errorMsg;
    document.getElementById('share-max-fy').textContent = errorMsg;
    document.getElementById('share-min-value').textContent = errorMsg;
    document.getElementById('share-min-fy').textContent = errorMsg;
  }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', main);