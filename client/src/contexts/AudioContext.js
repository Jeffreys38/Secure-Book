import React, { createContext, useContext, useRef } from 'react';

class AudioContextClass {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.duration = 0;
    this.albums = [];
    this.currentIndex = 0;
    this.isLooping = false;
    this.backupAlbums = [];
  }

  setAlbums(albums) {
    this.albums = albums;

    // Add more domain before url this albums
    this.albums = this.albums.map((album) => {
      album.file = process.env.REACT_APP_SERVER_SERVICE + "/musics/" + album.albumId + "/" + album.file;
      album.albumCover = process.env.REACT_APP_SERVER_SERVICE + "/musics/" + album.albumId + "/" + album.albumCover;

      return album;
    });

    if (this.backupAlbums.length === 0) {
      this.backupAlbums = this.albums;
    }
  }

  addAlbum(album) {
    album.file = process.env.REACT_APP_SERVER_SERVICE + "/musics/" + album.albumId + "/" + album.file;
    album.albumCover = process.env.REACT_APP_SERVER_SERVICE + "/musics/" + album.albumId + "/" + album.albumCover;

    this.albums.push(album);
  }

  shuffle() {
    let currentSong = this.albums[this.currentIndex];

    while (this.albums[this.currentIndex]._id === currentSong._id) {
      // Create a shallow copy of the albums array before shuffling
      this.albums = [...this.albums].sort(() => Math.random() - 0.5);
    }

    /**
     * In JavaScript, when you assign an array to another variable, 
     * it creates a reference to the original array, not a new copy.
     * 
     * Instead of:
     *  + Usage: the spread operator ([...]) to create a shallow copy of the array. 
     */

    /** Error: albums and backupAlbums are the same array
     * 
     *   let currentSong = this.albums[this.currentIndex];
     *   while (this.albums[this.currentIndex]._id === currentSong._id) {
     *        this.albums = this.albums.sort(() => Math.random() - 0.5);
     *     }
     */
  }

  unShuffle() {
    if (this.backupAlbums.length > 0) {
        this.albums = this.backupAlbums;

    }
  }

  prevSong() {
    this.currentIndex++;

    if (this.currentIndex >= this.albums.length)
      this.currentIndex = 0;

    if (this.isPlaying)
      this.play()
  }

  nextSong() {
    this.currentIndex--;

    if (this.currentIndex < 0)
      this.currentIndex = this.albums.length - 1

    if (this.isPlaying)
      this.play()
  }

  setDuration(duration) {
    this.duration = duration;
  }

  play(id) {
    if (id) {
      this.currentIndex = this.albums.findIndex((album) => album._id === id);
    }

    if (this.isPlaying) {
      this.audio.pause();
    }

    this.audio.src = this.albums[this.currentIndex].file;

    // Wait audio loaded, nếu không sẽ bị lỗi "The fetching process for the media resource was aborted by the user agent at the user's request. in audio"
    this.audio.oncanplay = () => {
      this.audio.play();
      this.isPlaying = true;
    }

    this.isPlaying = true;
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }
  
  setSongById(id) {
    this.currentIndex = this.albums.findIndex((album) => album._id === id);
  }

  getSong() {
    return this.albums[this.currentIndex];
  }

  isEndedAlbum() {
    return this.currentIndex === this.albums.length - 1;
  }
}

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioContextRef = useRef(new AudioContextClass());

  return (
    <AudioContext.Provider value={audioContextRef.current}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
