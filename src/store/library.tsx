import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { unknownTrackImageUri } from '@/constants/images';
import { Artist, Playlist, TrackWithPlaylist } from '@/helper/types';
import { Track } from 'react-native-track-player';
import library from '@/assets/data/library.json'
import { Asset } from 'expo-asset';
import { encode as encodeURI } from 'js-base64';

interface LibraryState {
	tracks: TrackWithPlaylist[]
	toggleTrackFavorite: (track: Track) => void
	addToPlaylist: (track: Track, playlistName: string) => void
	loadAllTracks: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>()((set) => ({
	tracks: [],
	toggleTrackFavorite: (track) =>
		set((state) => ({
			tracks: state.tracks.map((currentTrack) => {
				if (currentTrack.url === track.url) {
					return {
						...currentTrack,
						rating: currentTrack.rating === 1 ? 0 : 1,
					}
				}

				return currentTrack
			}),
		})),
	addToPlaylist: (track, playlistName) =>
		set((state) => ({
			tracks: state.tracks.map((currentTrack) => {
				if (currentTrack.url === track.url) {
					return {
						...currentTrack,
						playlist: [...(currentTrack.playlist ?? []), playlistName],
					}
				}

				return currentTrack
			}),
		})),
		loadAllTracks: async () => {
			try {
			  // Load tracks from library.json
			  const libraryTracks: TrackWithPlaylist[] = library.map((track) => ({
				...track,
				id: track.url, // Use URL as ID for library tracks
			  }));
		
			  // Load local tracks
			  const { status } = await MediaLibrary.requestPermissionsAsync();
			  if (status !== 'granted') {
				console.warn('Permission to access media library was denied');
				set({ tracks: libraryTracks });
				return;
			  }
		
			  const localMedias = await MediaLibrary.getAssetsAsync({
				mediaType: 'audio',
			  });
			  
			  const localTracks: TrackWithPlaylist[] = localMedias.assets.map((asset) => ({
				id: asset.id,
				url: asset.uri,
				title: asset.filename,
				artist: 'Unknown', // MediaLibrary doesn't provide artist info directly
				artwork: unknownTrackImageUri, // Use the audio file URI as artwork (this won't work, you'll need to find a way to get album art)
				duration: asset.duration * 1000, // Convert to milliseconds
				rating: 0,
				playlist: [],
			  }));
		
			  // Combine library tracks and local tracks
			  set({ tracks: [...libraryTracks, ...localTracks] });
			} catch (error) {
			  console.error('Error loading tracks:', error);
			}
		  },
}))



export const useTracks = () => {
	const tracks = useLibraryStore((state) => state.tracks);
	const loadAllTracks = useLibraryStore((state) => state.loadAllTracks);
	return { tracks, loadAllTracks };
  };

export const useFavorites = () => {
	const favorites = useLibraryStore((state) => state.tracks.filter((track) => track.rating === 1))
	const toggleTrackFavorite = useLibraryStore((state) => state.toggleTrackFavorite)

	return {
		favorites,
		toggleTrackFavorite,
	}
}

export const useArtists = () =>
	useLibraryStore((state) => {
		return state.tracks.reduce((acc, track) => {
			const existingArtist = acc.find((artist) => artist.name === track.artist)

			if (existingArtist) {
				existingArtist.tracks.push(track)
			} else {
				acc.push({
					name: track.artist ?? 'Unknown',
					tracks: [track],
				})
			}

			return acc
		}, [] as Artist[])
	})

export const usePlaylists = () => {
	const playlists = useLibraryStore((state) => {
		return state.tracks.reduce((acc, track) => {
			track.playlist?.forEach((playlistName) => {
				const existingPlaylist = acc.find((playlist) => playlist.name === playlistName)

				if (existingPlaylist) {
					existingPlaylist.tracks.push(track)
				} else {
					acc.push({
						name: playlistName,
						tracks: [track],
						artworkPreview: track.artwork ?? unknownTrackImageUri,
					})
				}
			})

			return acc
		}, [] as Playlist[])
	})

	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)

	return { playlists, addToPlaylist }
}