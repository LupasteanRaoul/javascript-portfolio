class MusicPlayer {
    constructor() {
      // DOM Elements
      this.playlistSongs = document.getElementById("playlist-songs");
      this.playButton = document.getElementById("play");
      this.pauseButton = document.getElementById("pause");
      this.nextButton = document.getElementById("next");
      this.previousButton = document.getElementById("previous");
      this.playingSong = document.getElementById("player-song-title");
      this.songArtist = document.getElementById("player-song-artist");
      this.progressSlider = document.getElementById("progress-slider");
      this.progressBar = document.getElementById("progress");
      this.currentTimeEl = document.getElementById("current-time");
      this.durationEl = document.getElementById("duration");
      this.volumeSlider = document.getElementById("volume-slider");
      this.muteButton = document.getElementById("mute");
      this.shuffleButton = document.getElementById("shuffle");
      this.repeatButton = document.getElementById("repeat");
      this.speedSelect = document.getElementById("speed-select");
      this.playlistSearch = document.getElementById("playlist-search");
      this.toggleHelp = document.getElementById("toggle-help");
      this.closeHelp = document.getElementById("close-help");
      this.shortcutsModal = document.getElementById("shortcuts-modal");
      
      // Album art
      this.albumArt = document.getElementById("album-art");
      
      // Audio element
      this.audio = new Audio();
      
      // Player state
      this.state = {
        songs: this.getDefaultSongs(),
        currentSong: null,
        songCurrentTime: 0,
        isPlaying: false,
        volume: 0.8,
        isMuted: false,
        isShuffle: false,
        repeatMode: 'none', // 'none', 'one', 'all'
        playbackRate: 1,
        originalSongsOrder: []
      };
      
      // Initialize
      this.init();
    }
    
    getDefaultSongs() {
      return [
        {
          id: 0,
          title: "Scratching The Surface",
          artist: "Quincy Larson",
          duration: "4:25",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/hello-world.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 1,
          title: "Can't Stay Down",
          artist: "Quincy Larson",
          duration: "4:15",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/in-the-zone.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 2,
          title: "Still Learning",
          artist: "Quincy Larson",
          duration: "3:51",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/camper-cat.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 3,
          title: "Cruising for a Musing",
          artist: "Quincy Larson",
          duration: "3:34",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/electronic.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 4,
          title: "Never Not Favored",
          artist: "Quincy Larson",
          duration: "3:35",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 5,
          title: "From the Ground Up",
          artist: "Quincy Larson",
          duration: "3:12",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/hello-world.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 6,
          title: "Walking on Air",
          artist: "Quincy Larson",
          duration: "3:25",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/in-the-zone.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 7,
          title: "Can't Stop Me. Can't Even Slow Me Down.",
          artist: "Quincy Larson",
          duration: "3:52",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/camper-cat.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 8,
          title: "The Surest Way Out is Through",
          artist: "Quincy Larson",
          duration: "3:10",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/electronic.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        },
        {
          id: 9,
          title: "Chasing That Feeling",
          artist: "Quincy Larson",
          duration: "2:43",
          src: "https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3",
          cover: "https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
        }
      ];
    }
    
    init() {
      // Render playlist
      this.renderPlaylist();
      
      // Load saved state
      this.loadState();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Setup audio events
      this.setupAudioEvents();
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Update playlist info
      this.updatePlaylistInfo();
    }
    
    renderPlaylist() {
      this.playlistSongs.innerHTML = '';
      
      this.state.songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.id = `song-${song.id}`;
        li.className = 'playlist-song';
        li.setAttribute('data-id', song.id);
        
        li.innerHTML = `
          <button class="playlist-song-info" aria-label="Play ${song.title} by ${song.artist}">
            <span class="playlist-song-number">${index + 1}</span>
            <span class="playlist-song-title">${song.title}</span>
            <span class="playlist-song-artist">${song.artist}</span>
            <span class="playlist-song-duration">${song.duration}</span>
          </button>
        `;
        
        li.querySelector('button').addEventListener('click', () => {
          this.playSong(song.id);
        });
        
        this.playlistSongs.appendChild(li);
      });
    }
    
    setupEventListeners() {
      // Play/Pause
      this.playButton.addEventListener('click', () => this.togglePlayPause());
      this.pauseButton.addEventListener('click', () => this.pauseSong());
      
      // Navigation
      this.nextButton.addEventListener('click', () => this.playNextSong());
      this.previousButton.addEventListener('click', () => this.playPreviousSong());
      
      // Progress bar
      this.progressSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        this.progressBar.style.width = `${value}%`;
        
        if (this.audio.duration) {
          this.audio.currentTime = (value / 100) * this.audio.duration;
        }
      });
      
      // Volume
      this.volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        this.setVolume(volume);
      });
      
      this.muteButton.addEventListener('click', () => this.toggleMute());
      
      // Shuffle
      this.shuffleButton.addEventListener('click', () => this.toggleShuffle());
      
      // Repeat
      this.repeatButton.addEventListener('click', () => this.toggleRepeat());
      
      // Playback speed
      this.speedSelect.addEventListener('change', (e) => {
        this.setPlaybackRate(parseFloat(e.target.value));
      });
      
      // Search
      this.playlistSearch.addEventListener('input', (e) => {
        this.filterPlaylist(e.target.value);
      });
      
      // Help modal
      this.toggleHelp.addEventListener('click', () => {
        this.shortcutsModal.classList.toggle('hidden');
      });
      
      this.closeHelp.addEventListener('click', () => {
        this.shortcutsModal.classList.add('hidden');
      });
      
      // Click outside to close modal
      document.addEventListener('click', (e) => {
        if (!this.shortcutsModal.contains(e.target) && 
            !this.toggleHelp.contains(e.target) && 
            !this.shortcutsModal.classList.contains('hidden')) {
          this.shortcutsModal.classList.add('hidden');
        }
      });
    }
    
    setupAudioEvents() {
      // Time update
      this.audio.addEventListener('timeupdate', () => {
        this.updateProgress();
        this.updateTimeDisplay();
        this.saveState();
      });
      
      // Loaded metadata
      this.audio.addEventListener('loadedmetadata', () => {
        this.updateTimeDisplay();
      });
      
      // Ended
      this.audio.addEventListener('ended', () => {
        this.handleSongEnd();
      });
      
      // Error handling
      this.audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        this.playNextSong();
      });
    }
    
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
          case 'Space':
            e.preventDefault();
            this.togglePlayPause();
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.playNextSong();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            this.playPreviousSong();
            break;
          case 'KeyM':
            e.preventDefault();
            this.toggleMute();
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.increaseVolume();
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.decreaseVolume();
            break;
          case 'KeyF':
            e.preventDefault();
            this.toggleFullscreen();
            break;
          case 'KeyS':
            e.preventDefault();
            this.toggleShuffle();
            break;
          case 'KeyR':
            e.preventDefault();
            this.toggleRepeat();
            break;
        }
      });
    }
    
    playSong(id, start = true) {
      const song = this.state.songs.find(s => s.id === id);
      if (!song) return;
      
      this.audio.src = song.src;
      this.audio.title = song.title;
      
      if (this.state.currentSong === null || start) {
        this.audio.currentTime = 0;
      } else {
        this.audio.currentTime = this.state.songCurrentTime;
      }
      
      this.state.currentSong = song;
      this.state.isPlaying = true;
      
      // Update UI
      this.playingSong.textContent = song.title;
      this.songArtist.textContent = song.artist;
      this.albumArt.src = song.cover;
      
      // Update buttons
      this.playButton.querySelector('i').className = 'fas fa-pause';
      this.playButton.setAttribute('title', 'Pause');
      
      // Highlight current song
      this.highlightCurrentSong();
      
      // Play
      this.audio.play().catch(error => {
        console.error('Playback failed:', error);
        this.state.isPlaying = false;
      });
      
      // Save state
      this.saveState();
    }
    
    togglePlayPause() {
      if (!this.state.currentSong) {
        this.playSong(this.state.songs[0].id);
        return;
      }
      
      if (this.state.isPlaying) {
        this.pauseSong();
      } else {
        this.resumeSong();
      }
    }
    
    pauseSong() {
      this.state.songCurrentTime = this.audio.currentTime;
      this.state.isPlaying = false;
      this.audio.pause();
      
      this.playButton.querySelector('i').className = 'fas fa-play';
      this.playButton.setAttribute('title', 'Play');
    }
    
    resumeSong() {
      if (!this.state.currentSong) {
        this.playSong(this.state.songs[0].id);
        return;
      }
      
      this.state.isPlaying = true;
      this.audio.play().catch(error => {
        console.error('Playback failed:', error);
        this.state.isPlaying = false;
      });
      
      this.playButton.querySelector('i').className = 'fas fa-pause';
      this.playButton.setAttribute('title', 'Pause');
    }
    
    playNextSong() {
      if (!this.state.currentSong) {
        this.playSong(this.state.songs[0].id);
        return;
      }
      
      if (this.state.isShuffle) {
        this.playRandomSong();
        return;
      }
      
      const currentIndex = this.state.songs.findIndex(s => s.id === this.state.currentSong.id);
      const nextIndex = (currentIndex + 1) % this.state.songs.length;
      
      this.playSong(this.state.songs[nextIndex].id);
    }
    
    playPreviousSong() {
      if (!this.state.currentSong) {
        this.playSong(this.state.songs[0].id);
        return;
      }
      
      const currentIndex = this.state.songs.findIndex(s => s.id === this.state.currentSong.id);
      const prevIndex = currentIndex === 0 ? this.state.songs.length - 1 : currentIndex - 1;
      
      this.playSong(this.state.songs[prevIndex].id);
    }
    
    playRandomSong() {
      const currentId = this.state.currentSong?.id;
      let availableSongs = this.state.songs.filter(s => s.id !== currentId);
      
      if (availableSongs.length === 0) {
        availableSongs = this.state.songs;
      }
      
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      this.playSong(availableSongs[randomIndex].id);
    }
    
    handleSongEnd() {
      switch(this.state.repeatMode) {
        case 'one':
          this.playSong(this.state.currentSong.id);
          break;
        case 'all':
          this.playNextSong();
          break;
        case 'none':
        default:
          if (this.state.isShuffle) {
            this.playRandomSong();
          } else {
            const currentIndex = this.state.songs.findIndex(s => s.id === this.state.currentSong.id);
            if (currentIndex < this.state.songs.length - 1) {
              this.playNextSong();
            } else {
              this.pauseSong();
            }
          }
          break;
      }
    }
    
    updateProgress() {
      if (!this.audio.duration) return;
      
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressBar.style.width = `${progress}%`;
      this.progressSlider.value = progress;
    }
    
    updateTimeDisplay() {
      if (!this.audio.duration) return;
      
      const currentTime = this.formatTime(this.audio.currentTime);
      const duration = this.formatTime(this.audio.duration);
      
      this.currentTimeEl.textContent = currentTime;
      this.durationEl.textContent = duration;
    }
    
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    setVolume(volume) {
      this.state.volume = Math.max(0, Math.min(1, volume));
      this.audio.volume = this.state.volume;
      this.volumeSlider.value = this.state.volume * 100;
      
      // Update mute button icon
      if (this.state.volume === 0) {
        this.muteButton.querySelector('i').className = 'fas fa-volume-mute';
        this.state.isMuted = true;
      } else {
        this.muteButton.querySelector('i').className = 'fas fa-volume-up';
        this.state.isMuted = false;
      }
      
      this.saveState();
    }
    
    toggleMute() {
      if (this.state.isMuted) {
        this.setVolume(this.state.volume > 0 ? this.state.volume : 0.5);
        this.state.isMuted = false;
      } else {
        this.setVolume(0);
        this.state.isMuted = true;
      }
    }
    
    increaseVolume() {
      this.setVolume(this.state.volume + 0.1);
    }
    
    decreaseVolume() {
      this.setVolume(this.state.volume - 0.1);
    }
    
    toggleShuffle() {
      this.state.isShuffle = !this.state.isShuffle;
      
      if (this.state.isShuffle) {
        this.shuffleButton.classList.add('shuffle-active');
        this.shuffleButton.setAttribute('title', 'Shuffle On');
        
        // Save original order
        if (this.state.originalSongsOrder.length === 0) {
          this.state.originalSongsOrder = [...this.state.songs];
        }
        
        // Shuffle songs
        this.shufflePlaylist();
      } else {
        this.shuffleButton.classList.remove('shuffle-active');
        this.shuffleButton.setAttribute('title', 'Shuffle Off');
        
        // Restore original order
        this.state.songs = [...this.state.originalSongsOrder];
        this.state.originalSongsOrder = [];
        this.renderPlaylist();
        this.highlightCurrentSong();
      }
      
      this.saveState();
    }
    
    shufflePlaylist() {
      const shuffled = [...this.state.songs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.state.songs = shuffled;
      this.renderPlaylist();
      this.highlightCurrentSong();
    }
    
    toggleRepeat() {
      const modes = ['none', 'one', 'all'];
      const currentIndex = modes.indexOf(this.state.repeatMode);
      this.state.repeatMode = modes[(currentIndex + 1) % modes.length];
      
      // Update UI
      this.repeatButton.classList.remove('repeat-active');
      if (this.state.repeatMode !== 'none') {
        this.repeatButton.classList.add('repeat-active');
      }
      
      // Update title
      const titles = {
        'none': 'Repeat Off',
        'one': 'Repeat One',
        'all': 'Repeat All'
      };
      this.repeatButton.setAttribute('title', titles[this.state.repeatMode]);
      
      // Update icon
      const icons = {
        'none': 'fas fa-redo',
        'one': 'fas fa-redo',
        'all': 'fas fa-sync'
      };
      this.repeatButton.querySelector('i').className = icons[this.state.repeatMode];
      
      this.saveState();
    }
    
    setPlaybackRate(rate) {
      this.state.playbackRate = rate;
      this.audio.playbackRate = rate;
      this.saveState();
    }
    
    filterPlaylist(searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      const songs = this.playlistSongs.querySelectorAll('.playlist-song');
      
      songs.forEach(song => {
        const title = song.querySelector('.playlist-song-title').textContent.toLowerCase();
        const artist = song.querySelector('.playlist-song-artist').textContent.toLowerCase();
        const isVisible = title.includes(term) || artist.includes(term);
        song.style.display = isVisible ? 'flex' : 'none';
      });
    }
    
    highlightCurrentSong() {
      // Remove highlight from all songs
      document.querySelectorAll('.playlist-song').forEach(song => {
        song.removeAttribute('aria-current');
      });
      
      // Highlight current song
      if (this.state.currentSong) {
        const songToHighlight = document.getElementById(`song-${this.state.currentSong.id}`);
        if (songToHighlight) {
          songToHighlight.setAttribute('aria-current', 'true');
          
          // Scroll into view
          songToHighlight.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
    
    updatePlaylistInfo() {
      const songCount = this.state.songs.length;
      const totalDuration = this.state.songs.reduce((total, song) => {
        const [mins, secs] = song.duration.split(':').map(Number);
        return total + mins * 60 + secs;
      }, 0);
      
      const totalMins = Math.floor(totalDuration / 60);
      const totalSecs = totalDuration % 60;
      
      document.getElementById('song-count').textContent = `${songCount} songs`;
      document.getElementById('total-duration').textContent = 
        `Total: ${totalMins}:${totalSecs < 10 ? '0' : ''}${totalSecs}`;
    }
    
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
    
    saveState() {
      const state = {
        currentSongId: this.state.currentSong?.id,
        currentTime: this.audio.currentTime,
        volume: this.state.volume,
        isMuted: this.state.isMuted,
        isShuffle: this.state.isShuffle,
        repeatMode: this.state.repeatMode,
        playbackRate: this.state.playbackRate
      };
      
      localStorage.setItem('musicPlayerState', JSON.stringify(state));
    }
    
    loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem('musicPlayerState'));
        if (saved) {
          // Restore volume
          if (saved.volume !== undefined) {
            this.setVolume(saved.volume);
          }
          
          // Restore mute state
          if (saved.isMuted !== undefined && saved.isMuted) {
            this.toggleMute();
          }
          
          // Restore shuffle
          if (saved.isShuffle !== undefined && saved.isShuffle) {
            this.toggleShuffle();
          }
          
          // Restore repeat mode
          if (saved.repeatMode) {
            this.state.repeatMode = saved.repeatMode;
            this.toggleRepeat(); // This will cycle to the correct mode
          }
          
          // Restore playback rate
          if (saved.playbackRate) {
            this.setPlaybackRate(saved.playbackRate);
            this.speedSelect.value = saved.playbackRate;
          }
          
          // Restore current song
          if (saved.currentSongId !== undefined && saved.currentSongId !== null) {
            // Small delay to ensure playlist is rendered
            setTimeout(() => {
              const song = this.state.songs.find(s => s.id === saved.currentSongId);
              if (song) {
                this.playSong(song.id, false);
                if (saved.currentTime) {
                  this.audio.currentTime = saved.currentTime;
                  this.state.songCurrentTime = saved.currentTime;
                }
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }
  
  // Initialize the player when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
    window.musicPlayer = player; // Make it accessible from console for debugging
  });