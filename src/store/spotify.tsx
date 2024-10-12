import { SpotifyApiResponse, SpotifyTrack } from '@/types/types'
import { create } from 'zustand'

interface Store {
	token: string
	topSongs: SpotifyTrack[]
	setToken: (token: string) => void
	addTopSongs: (response: SpotifyApiResponse) => void
}

export const useStore = create<Store>((set) => ({
	token: '',
	topSongs: [],
	setToken: (token) => set({ token }),
	addTopSongs: (response) => set({ topSongs: response.items }),
}))
