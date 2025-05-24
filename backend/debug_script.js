'use strict';

/**
 * Debugging script to output PDF entry and file relationships
 * 
 * Instructions:
 * 1. Save this file to your Strapi backend directory
 * 2. Run with: node debug_script.js <pdf_id>
 * 3. Review the output to understand the actual schema structure
 */

// Import required modules
const fs = require('fs');
const path = require('path');

// Initialize Strapi
async function initStrapi() {
  const appDir = process.cwd();
  try {
    console.log('Initializing Strapi...');
    const strapi = await require('@strapi/strapi').compile().load({
      dir: appDir,
    });
    console.log('Strapi initialized successfully');
    return strapi;
  } catch (error) {
    console.error('Failed to initialize Strapi:', error);
    process.exit(1);
  }
}

// Main function
async function main() {
  // Get PDF ID from command line arguments
  const pdfId = process.argv[2];
  if (!pdfId) {
    console.error('Please provide a PDF ID as an argument');
    console.log('Usage: node debug_script.js <pdf_id>');
    process.exit(1);
  }

  // Initialize Strapi
  const strapi = await initStrapi();

  try {
    console.log(`\n=== DEBUGGING PDF ENTRY WITH ID: ${pdfId} ===\n`);

    // Fetch the PDF entry with all possible relations
    const pdfEntry = await strapi.entityService.findOne('api::pdf.pdf', pdfId, {
      populate: '*'
    });

    if (!pdfEntry) {
      console.error(`No PDF entry found with ID: ${pdfId}`);
      process.exit(1);
    }

    // Output the PDF entry structure
    console.log('=== PDF ENTRY STRUCTURE ===');
    console.log(JSON.stringify(pdfEntry, null, 2));
    console.log('\n');

    // Check for file field
    console.log('=== FILE FIELD ANALYSIS ===');
    if (pdfEntry.file) {
      console.log('✅ "file" field exists in the entry');
      console.log('File details:', JSON.stringify(pdfEntry.file, null, 2));
      
      // Get file path
      const filePath = path.join(strapi.dirs.public, pdfEntry.file.url);
      console.log(`File path: ${filePath}`);
      console.log(`File exists on disk: ${fs.existsSync(filePath)}`);
    } else {
      console.log('❌ "file" field does not exist in the entry');
    }

    // Check for pdf_file field
    if (pdfEntry.pdf_file) {
      console.log('✅ "pdf_file" field exists in the entry');
      console.log('PDF file details:', JSON.stringify(pdfEntry.pdf_file, null, 2));
    } else {
      console.log('❌ "pdf_file" field does not exist in the entry');
    }

    // List all fields in the entry
    console.log('\n=== ALL FIELDS IN THE ENTRY ===');
    Object.keys(pdfEntry).forEach(key => {
      console.log(`- ${key}: ${typeof pdfEntry[key]}`);
    });

    // Get schema information
    console.log('\n=== SCHEMA INFORMATION ===');
    const contentType = strapi.contentTypes['api::pdf.pdf'];
    console.log('Attributes:', JSON.stringify(contentType.attributes, null, 2));

    // Cleanup and exit
    await strapi.destroy();
    console.log('\n=== DEBUGGING COMPLETED ===');
  } catch (error) {
    console.error('Error during debugging:', error);
    await strapi.destroy();
    process.exit(1);
  }
}

// Run the main function
main();
