import { type Song } from "../types/songs";

let songs: Song[] = [];

let currentId = 3;

export const getAllSongs = () => {
  return songs;
};

export const getSongById = (id: number): Song | undefined => {
  const song = songs.find((s) => s.id === id);
  return song;
};

export const addSong = (
  title: string,
  artist: string,
  duration: number
): Song => {
  const newSong: Song = { id: ++currentId, title, artist, duration };
  songs.push(newSong);
  return newSong;
};
