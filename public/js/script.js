let playlist = [];

// function that removes songs from the current playlist
function removePlaylist(index){
  // splice removes the playlist song
    playlist.splice(index,1);
    // always load the playlist
    loadPlaylist();
}

// function to push the song into my playlist and if its a duplicate song it doesnt add it
function addPlaylist(song){
  // checking to see if it isnt a duplicate then just push the song into  the playlist
  if(!playlist.some(p => p.trackId === song.trackId)) {
      playlist.push(song);
        // always load the playlist
      loadPlaylist();
  }
}

// function that moves the playlist song down
function moveDown(index) {
    if (index < playlist.length-1) {
        [playlist[index], playlist[index +1]] = [playlist[index+ 1],playlist[index]];
            // always load the playlist
        loadPlaylist();
    }
}

// function that moves the playlist song up
function moveUp(index) {
  if(index>0){
      [playlist[index],playlist[index -1]] = [playlist[index- 1], playlist[index]];
          // always load the playlist
      loadPlaylist();
  }
}

// function that  loads the playlist
// buttons are from: https://www.w3schools.com/charsets/ref_emoji_av.asp
    // using html tables from https://www.w3schools.com/html/html_tables.asp
function loadPlaylist() {
    const playlistArea = document.getElementById('playlistDiv');
    playlistArea.innerHTML = playlist.map((song,index) => `
        <tr>
            <td>
                <button onclick="removePlaylist(${index})">-</button>
                <button onclick="moveUp(${index})">&#128316;</button>
                <button onclick="moveDown(${index})">&#128317;</button>
            </td>
            <td>${song.trackName}</td>
            <td>${song.artistName}</td>
            <td><img src="${song.artworkUrl60}" alt="Artwork"></td>
        </tr>`).join('');
}

// get song function remains the same
function getSong() {
    let songTitle = document.getElementById('songSearch').value.trim();
    if (songTitle === '') {
        return alert('Please enter a Song Title');
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            document.getElementById('searchResults').textContent = `Songs matching: ${songTitle}`;
            songsMatching(response.results);
        }
    };
    xhr.open('GET', `/songs?title=${songTitle}`, true);
    xhr.send();
}

const ENTER = 13;
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit_button').addEventListener('click', getSong);
    document.addEventListener('keyup', function(event) {
        if (event.keyCode === ENTER) {
            getSong();
        }
    })
})

// function for search results of the matching songs with the user input
function songsMatching(songs){
  const searchResultsDiv = document.getElementById('searchResultsDiv');
  let rows = songs.map((song, index) => `
      <tr>
          <td>
              <button class="add-song" data-song='${JSON.stringify(song).replace(/'/g, "&apos;")}'>+</button>
          </td>
          <td>${song.trackName}</td>
          <td>${song.artistName}</td>
          <td><img src="${song.artworkUrl60}" alt="Artwork"></td>
      </tr>`)
  searchResultsDiv.innerHTML = rows.join('');
  document.querySelectorAll('.add-song').forEach(button => {
      button.addEventListener('click', function() {
          const songData = JSON.parse(this.getAttribute('data-song').replace(/&apos;/g, "'"));
          addPlaylist(songData);
      })
  })
}
