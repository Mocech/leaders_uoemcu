/**
 * CSV to JSON Converter for Ministry Directory
 *
 * This script helps convert the Excel CSV file to the required JSON format.
 *
 * Expected CSV Format:
 * Ministry Name, Member 1 Name, Member 1 Position, Member 1 Phone, Member 2 Name, ...
 *
 * Usage:
 * 1. Export your Excel file as CSV
 * 2. Paste the CSV content into the csvData variable below
 * 3. Run this script in the browser console or Node.js
 * 4. Copy the output JSON and paste it into data.js
 */

function convertCSVtoJSON(csvData) {
  const lines = csvData.trim().split("\n")
  const result = {}

  lines.forEach((line) => {
    const parts = line.split(",").map((part) => part.trim())

    if (parts.length < 4) return // Skip invalid lines

    const ministryName = parts[0]
    const members = []

    // Parse members (assuming format: name, position, phone repeating)
    for (let i = 1; i < parts.length; i += 3) {
      if (parts[i] && parts[i + 1] && parts[i + 2]) {
        members.push({
          name: parts[i],
          position: parts[i + 1],
          phone: parts[i + 2],
        })
      }
    }

    if (members.length > 0) {
      result[ministryName] = members
    }
  })

  return result
}

// Example usage:
// const csvData = `Ministry Name, John Doe, Chairperson, 0712345678, Mary Jane, Vice Chairperson, 0700000000`;
// const jsonData = convertCSVtoJSON(csvData);
// console.log(JSON.stringify(jsonData, null, 2));
