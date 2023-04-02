const form = document.getElementById('bookmark-form')
const input = document.getElementById('bookmark-input')
const list = document.getElementById('bookmark-list')

let bookmarks = []

// Load bookmarks from local storage, if available
const loadBookmarks = () => {
  const storedBookmarks = localStorage.getItem('bookmarks')
  if (storedBookmarks) {
    bookmarks = JSON.parse(storedBookmarks)
    renderBookmarks()
  }
}

// Save bookmarks to local storage
const saveBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
}

// Add a new bookmark to the list
const addBookmark = (url) => {
  const bookmark = {
    id: Date.now(),
    url: url
  }
  bookmarks.push(bookmark)
  renderBookmarks()
  saveBookmarks()
}

// Delete a bookmark from the list
const deleteBookmark = (id) => {
  bookmarks = bookmarks.filter(bookmark => bookmark.id !== id)
  renderBookmarks()
  saveBookmarks()
}

// Render the list of bookmarks
const renderBookmarks = () => {
  list.innerHTML = ''
  bookmarks.forEach(bookmark => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = bookmark.url
    a.textContent = bookmark.url
    li.appendChild(a)
    const button = document.createElement('button')
    button.textContent = 'Delete'
    button.addEventListener('click', () => deleteBookmark(bookmark.id))
    li.appendChild(button)
    list.appendChild(li)
  })
}

// Handle form submit event
form.addEventListener('submit', event => {
  event.preventDefault()
  const url = input.value.trim()
  if (url) {
    addBookmark(url)
    input.value = ''
    input.focus()
  }
})

// Load bookmarks when the page loads
loadBookmarks()

