import { html, Component, render } from './js/spux.js';
import { getQueryStringValue, loadFile, saveFile } from './util.js';
import GithubRibbon from './components/GithubRibbon.js';
import './js/dior.js';
// import Swal from 'sweetalert2';

/**
 * Class representing the application.
 */
export class App extends Component {
  /**
   * Create a new application instance.
   */
  constructor() {
    super();
    const serverUrl = getQueryStringValue('storage') || di.data.storage || 'https://nosdav.net';
    const mode = getQueryStringValue('mode') || di.data.m || 'm';
    const uri = getQueryStringValue('uri') || di.data.uri || 'bookmarks.json';
    this.state = {
      userPublicKey: null,
      filename: uri,
      fileContent: '[]',
      bookmarks: [],
      newBookmarkUrl: '',
      serverUrl: serverUrl,
      mode: mode,
    };
  }

  /**
   * Lifecycle method that is called after a component is mounted.
   */
  async componentDidMount() {
    // await this.userLogin();
  }

  /**
   * Show the SweetAlert popup for adding a new bookmark.
   */
  showAddBookmarkPopup = () => {
    Swal.fire({
      title: 'Add a new bookmark',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Enter URL">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Enter label">',
      focusConfirm: false,
      didOpen: () => {
        const urlInput = document.getElementById('swal-input1');
        const labelInput = document.getElementById('swal-input2');
        urlInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm();
          }
        });
        labelInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm();
          }
        });
      },
      preConfirm: () => {
        const url = document.getElementById('swal-input1').value;
        const label = document.getElementById('swal-input2').value;
        if (url) {
          this.addBookmark(url, label);
        }
      }
    });
  }

  /**
   * Show the SweetAlert popup for editing a bookmark.
   *
   * @param {Object} bookmark - The bookmark to edit.
   */
  showEditBookmarkPopup = (bookmark) => {
    Swal.fire({
      title: 'Edit bookmark',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Enter URL" value="${bookmark.url}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Enter label" value="${bookmark.label || ''}">`,
      focusConfirm: false,
      didOpen: () => {
        const urlInput = document.getElementById('swal-input1');
        const labelInput = document.getElementById('swal-input2');
        urlInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm();
          }
        });
        labelInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm();
          }
        });
      },
      preConfirm: () => {
        const url = document.getElementById('swal-input1').value;
        const label = document.getElementById('swal-input2').value;
        if (url) {
          this.editBookmark(bookmark, url, label);
        }
      }
    });
  }

  /**
   * Log in the user and load the bookmarks.
   */
  userLogin = async () => {
    var userPublicKey;
    try {
      userPublicKey = await window.nostr.getPublicKey();
      if (userPublicKey) {
        Swal.fire({
          title: "Logged in!",
          text: "Logged in with public key!",
          icon: "success",
          timer: 1500
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<p><a target="_blank" href="https://nostrapps.github.io/extensions/">Please install a nostr extension</a></p>'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<p><a target="_blank" href="https://nostrapps.github.io/extensions/">Please install a nostr extension</a></p>'
      });
    }

    console.log(`Logged in with public key: ${userPublicKey}`);
    await this.setState({ userPublicKey: userPublicKey });
    this.loadBookmarks();
  }

  /**
   * Load the bookmarks from the server.
   */
  loadBookmarks = async () => {
    const { userPublicKey, serverUrl, mode, filename } = this.state;
    const fileContent = await loadFile(serverUrl, userPublicKey, filename, mode);

    if (fileContent) {
      this.setState({ fileContent: fileContent, bookmarks: JSON.parse(fileContent) });
    }
  };

  /**
   * Save the bookmarks to the server.
   */
  saveBookmarks = async () => {
    const { bookmarks, userPublicKey, serverUrl, mode, filename } = this.state;
    const fileContent = JSON.stringify(bookmarks);
    const success = await saveFile(serverUrl, userPublicKey, filename, mode, fileContent);

    if (!success) {
      alert('Error saving bookmarks');
    }
  };

  /**
   * Add a new bookmark to the list.
   */
  addBookmark = (url, label) => {
    const { bookmarks } = this.state;
    if (url) {
      const updatedBookmarks = [...bookmarks, { url: url, label: label }];
      this.setState({ bookmarks: updatedBookmarks, newBookmarkUrl: '' }, this.saveBookmarks);
    }
  };

  /**
   * Edit an existing bookmark in the list.
   *
   * @param {Object} bookmarkToEdit - The bookmark to edit.
   * @param {string} newUrl - The new URL for the bookmark.
   * @param {string} newLabel - The new label for the bookmark.
   */
  editBookmark = (bookmarkToEdit, newUrl, newLabel) => {
    const updatedBookmarks = this.state.bookmarks.map((bookmark) =>
      bookmark.url === bookmarkToEdit.url ? { url: newUrl, label: newLabel } : bookmark
    );
    this.setState({ bookmarks: updatedBookmarks }, this.saveBookmarks);
  };

  /**
   * Delete a bookmark from the list.
   *
   * @param {Object} bookmarkToDelete - The bookmark to delete.
   */
  deleteBookmark = (bookmarkToDelete) => {
    const updatedBookmarks = this.state.bookmarks.filter(
      (bookmark) => bookmark.url !== bookmarkToDelete.url
    );
    this.setState({ bookmarks: updatedBookmarks }, this.saveBookmarks);
  };

  render() {
    const { userPublicKey, bookmarks } = this.state;

    // Sort bookmarks in reverse chronological order (newest to oldest)
    const sortedBookmarks = bookmarks.slice().reverse();

    return html`
      <${GithubRibbon} repo="https://github.com/nosdav/pastebin/" />
      <div class="container">
        ${userPublicKey ? html`
        <input
          type="text"
          id="bookmark-input"
          placeholder="Click to add a new bookmark"
          onClick="${this.showAddBookmarkPopup}"  // Show SweetAlert popup on click
          readOnly
        />
        <br /><br />
              ` : html`
                <button id="login" class="width: 100%;" onClick="${this.userLogin}">
                  Login To Bookmarks
                </button>`}
                <ul id="bookmark-list">
                ${sortedBookmarks.map(
      (bookmark) => html`
                    <li>
                      <a target="_blank" href=${bookmark.url}>${bookmark.label || bookmark.url}</a>
                      ${'\u00A0\u00A0\u00A0'}
                      <div class="icon-container">
                        <a
                          onClick="${() => this.showEditBookmarkPopup(bookmark)}"
                          type="button"
                          class="edit-button"
                        >
                        <i class="fas fa-edit"></i>
                        </a>
                        <a
                          onClick="${() => this.deleteBookmark(bookmark)}"
                          type="button"
                          class="delete-button"
                        >
                        <i class="fas fa-trash-alt"></i>
                        </a>
                      </div>
                    </li>
                  `
    )}
              </ul>
                      </div>
     
        `;
  }
}

render(html` <${App} /> `, document.body);
