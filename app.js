import { html, Component, render } from './js/spux.js';
import { getPath, getQueryStringValue, loadFile, saveFile } from './util.js';
import './js/dior.js'


export class App extends Component {
  constructor() {
    super();
    const serverUrl = getQueryStringValue('storage') || di.data.storage || 'https://nosdav.nostr.rocks'
    const mode = getQueryStringValue('mode') || di.data.m || 'm'
    const uri = getQueryStringValue('uri') || di.data.uri || 'bookmarks.json'
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

  async componentDidMount() {
    // await this.userLogin();
  }

  updateNewBookmarkUrl = (event) => {
    this.setState({ newBookmarkUrl: event.target.value });
  }

  userLogin = async () => {
    const userPublicKey = await window.nostr.getPublicKey();
    console.log(`Logged in with public key: ${userPublicKey}`);
    await this.setState({ userPublicKey: userPublicKey });
    this.loadBookmarks();
  }

  loadBookmarks = async () => {
    const { userPublicKey, serverUrl, mode, filename } = this.state;
    const fileContent = await loadFile(serverUrl, userPublicKey, filename, mode);

    if (fileContent) {
      this.setState({ fileContent: fileContent, bookmarks: JSON.parse(fileContent) });
    }
  };

  saveBookmarks = async () => {
    const { bookmarks, userPublicKey, serverUrl, mode, filename } = this.state;
    const fileContent = JSON.stringify(bookmarks);
    const success = await saveFile(serverUrl, userPublicKey, filename, mode, fileContent);

    if (!success) {
      alert('Error saving bookmarks');
    }
  };

  addBookmark = () => {
    const { newBookmarkUrl, bookmarks } = this.state;
    if (newBookmarkUrl) {
      const updatedBookmarks = [...bookmarks, { url: newBookmarkUrl }];
      this.setState({ bookmarks: updatedBookmarks, newBookmarkUrl: '' }, this.saveBookmarks);
    }
  };

  deleteBookmark = (bookmarkToDelete) => {
    const updatedBookmarks = this.state.bookmarks.filter(
      (bookmark) => bookmark.url !== bookmarkToDelete.url
    );
    this.setState({ bookmarks: updatedBookmarks }, this.saveBookmarks);
  };

  render() {
    const { userPublicKey, newBookmarkUrl, bookmarks } = this.state;

    return html`
      <div class="container">
        <h1>Bookmark Manager</h1>
        <input
          type="text"
          id="bookmark-input"
          placeholder="Enter a new bookmark URL"
          value="${newBookmarkUrl}"
          onInput="${this.updateNewBookmarkUrl}"
        />

        ${userPublicKey
        ? html`
              <button onClick="${this.addBookmark}" type="button">
                Add Bookmark
              </button>
              <br />
              <br />
            `
        : html` <button id="login" onClick="${this.userLogin}">
              Login
            </button>`}

        <ul id="bookmark-list">
          ${bookmarks?.reverse().map(
          (bookmark) => html`
              <li>
                <a target="_blank" href=${bookmark.url}>${bookmark.url}</a>
                <button
                  onClick="${() => this.deleteBookmark(bookmark)}"
                  type="button"
                >
                  Delete
                </button>
              </li>
            `
        )}
        </ul>
      </div>
   
      `;

  }
}

render(html` <${App} /> `, document.body)
