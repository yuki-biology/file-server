# File Server

Simple Node.js file upload server with drag-and-drop web UI.

## Setup

```bash
npm install
```

## Usage

Start the server (requires admin for port 80):

```bash
npm start
```

Open `http://localhost` in a browser.

## API

**POST /uploads** — Upload multiple files

| Field   | Type     | Description          |
|---------|----------|----------------------|
| `files` | File[]   | Files to upload      |

Response:

```json
{
  "message": "Files uploaded successfully",
  "files": [
    { "originalName": "photo.jpg", "savedAs": "1234567890-123456789.jpg", "size": 51200 }
  ]
}
```

## Structure

```
file-server/
├── public/          # Web UI (index.html)
├── uploads/         # Uploaded files destination
├── server.js        # Express + multer server
└── package.json
```
