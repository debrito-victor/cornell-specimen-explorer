# Cornell Specimen Explorer

Interactive web app for exploring Cornell University Museum of Vertebrates fish specimen records.

## Live Site

https://debrito-victor.github.io/cornell-specimen-explorer/

## What This App Does

- Loads specimen records from a CSV dataset
- Filters records across multiple fields
- Displays matching records in a paginated table
- Maps georeferenced specimens on an interactive map
- Exports filtered results to CSV

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Data File

The app reads data from:

- `public/fish_collection.csv`

Replace that file to publish a newer dataset.
