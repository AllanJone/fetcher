// External libraries
import axios from 'axios';
import { JSDOM, VirtualConsole } from 'jsdom';
import { program } from 'commander';
import { promises as fs } from 'fs';
import { URL } from 'url';

// Command line argument parsing
program
  .option('-m, --metadata', 'fetch metadata for the given urls')
  .parse(process.argv);

const urls: string[] = program.args;

// Fetch the content of a given URL
const fetchPageContent = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}: ${(error as Error).message}`);
    return '';
  }
};

// Save page content to a file
const savePageToFile = async (url: string, data: string): Promise<void> => {
  const parsedUrl = new URL(url);
  const filename = `/data/${parsedUrl.hostname}.html`;
  await fs.writeFile(filename, data);
};

// Extract metadata from HTML content
const extractMetadataFromHtml = (html: string): { num_links: number; images: number } => {
  const virtualConsole = new VirtualConsole();
  
  virtualConsole.on("error", (error) => {
    if (!error.message.includes('Could not parse CSS stylesheet')) {
        console.error(error);
    }
  });
  
  const dom = new JSDOM(html, { virtualConsole });
  const links = dom.window.document.querySelectorAll('a');
  const images = dom.window.document.querySelectorAll('img');
  
  return {
    num_links: links.length,
    images: images.length,
  };
};

// Main execution function
const execute = async () => {
  for (const url of urls) {
    const pageContent = await fetchPageContent(url);

    if (pageContent) {
      await savePageToFile(url, pageContent);

      if (program.opts().metadata) {
        const metadata = extractMetadataFromHtml(pageContent);
        const hostname = new URL(url).hostname;
        
        console.log(`site: ${hostname}`);
        console.log(`num_links: ${metadata.num_links}`);
        console.log(`images: ${metadata.images}`);
        console.log(`last_fetch: ${new Date().toUTCString()}`);
      }
    }
  }
};

// Run the main function and handle potential errors
execute().catch((error) => {
  console.error("An unexpected error occurred:", error);
});