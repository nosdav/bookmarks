<div align="center">  
  <h1>nosdav-bookmarks</h1>
</div>

<div align="center">  
<i>nosdav-bookmarks</i>
</div>

---

<div align="center">
<h4>Documentation</h4>
</div>

---

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nosdav/bookmarks/blob/gh-pages/LICENSE)
[![npm](https://img.shields.io/npm/v/nosdav-bookmarks)](https://npmjs.com/package/nosdav-bookmarks)
[![npm](https://img.shields.io/npm/dw/nosdav-bookmarks.svg)](https://npmjs.com/package/nosdav-bookmarks)
[![Github Stars](https://img.shields.io/github/stars/nosdav/bookmarks.svg)](https://github.com/nosdav/bookmarks/)

# Bookmark Manager

Welcome to the Bookmark Manager! This is a simple, user-friendly web application for managing your bookmarks. Easily add, edit, and delete bookmarks, all stored securely on your chosen server.

## Features

- **Add Bookmarks**: Save your favorite URLs with optional labels.
- **Edit Bookmarks**: Update existing bookmarks with new URLs or labels.
- **Delete Bookmarks**: Remove bookmarks you no longer need.
- **Login Integration**: Secure login using Nostr extension.
- **Server Storage**: Store your bookmarks on a specified server.

## Usage

### Adding a Bookmark

1. Click on the input field labeled "Click to add a new bookmark".
2. Enter the URL and an optional label in the SweetAlert popup.
3. Click "Add" to save the bookmark.

### Editing a Bookmark

1. Click the edit icon (✏️) next to the bookmark you want to edit.
2. Update the URL and/or label in the SweetAlert popup.
3. Click "Save" to update the bookmark.

### Deleting a Bookmark

1. Click the delete icon (🗑️) next to the bookmark you want to delete.
2. Confirm the deletion in the SweetAlert popup.

### Logging In

To use the bookmark manager, you need to log in with a Nostr extension:

1. Click the "Login To Bookmarks" button.
2. Follow the instructions to log in with your public key.

## Developer Docs

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/nosdav/bookmarks.git
   ```
2. Navigate to the project directory:
   ```sh
   cd bookmarks
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

## Components

### App

The main component of the application, handling state management and rendering.

### GithubRibbon

A component displaying a link to the GitHub repository.

## JSON Schema

The bookmark data is stored in a JSON format structured as follows:

```json
[
  {
    "url": "https://example.com",
    "label": "Example Website",
    "tag": ["tag1", "tag2"]
  }
]
```

- **url**: The URL of the website.
- **label**: (Optional) A user-friendly label or name for the website.
- **tag**: (Optional) An array of tags for categorizing the bookmark.

### Example Usage:

```json
[{
  "url": "https://developer.mozilla.org",
  "label": "MDN Web Docs",
  "tag": ["documentation", "web development"]
}]
```

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please reach out to us via [GitHub Issues](https://github.com/nosdav/bookmarks/issues).

Happy bookmarking! 🚀
