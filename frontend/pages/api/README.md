# API Routes - Next.js Ready

This directory is prepared for Next.js API routes when the frontend is migrated to Next.js.

## Structure

API routes follow Next.js conventions:
- Each file exports a handler function
- Routes are automatically mapped based on file paths
- Support for REST API patterns

## Example Usage

```javascript
// pages/api/countries.js
export default async function handler(req, res) {
  const countries = await fetch('http://backend:8000/api/countries');
  const data = await countries.json();
  res.status(200).json(data);
}
```

## Current State

The frontend currently uses direct API calls to the FastAPI backend.
These route files will serve as proxies when Next.js is implemented.

## Benefits

- Server-side data fetching
- API route protection
- Environment variable management
- Better caching control
