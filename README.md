# Web Page Fetcher

A simple command-line tool built with TypeScript to fetch web pages and save them to disk for later retrieval and browsing. Additionally, it can extract and display metadata about the fetched pages.

## Features

- Fetches web pages based on provided URLs.
- Saves fetched pages to disk.
- Extracts and displays metadata:
  - Number of links on the page.
  - Number of images on the page.
  - Date and time of the fetch.

## Installation & Setup

Clone this repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

## Usage

1. Build the Docker image:

```bash
docker build -t fetcher .
```

2. Run the tool inside a Docker container:

```bash
# with metadata
docker run -v $(pwd):/data fetcher https://www.google.com https://www.amazon.co.jp

# without metadata
docker run -v $(pwd):/data fetcher --metadata https://www.google.com https://www.amazon.co.jp
```

This will save the fetched pages to the current directory on the host machine.
