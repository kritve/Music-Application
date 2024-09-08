import { useFavorites } from '@/store/library'
import { useQueue } from '@/store/queue'
import { useRouter } from 'expo-router'
import React, { PropsWithChildren, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Menu } from 'react-native-paper'
import TrackPlayer, { Track } from 'react-native-track-player'
import { match } from 'ts-pattern'

type TrackShortcutsMenuProps = PropsWithChildren<{ track: Track }>

export const TrackShortcutsMenu = ({ track, children }: TrackShortcutsMenuProps) => {
	const [visible, setVisible] = useState(false)
	const router = useRouter()
	const isFavorite = track.rating === 1
	const { toggleTrackFavorite } = useFavorites()
	const { activeQueueId } = useQueue()

	const openMenu = () => setVisible(true)
	const closeMenu = () => setVisible(false)

	const handlePressAction = (id: string) => {
		closeMenu()
		match(id)
			.with('add-to-queue', async () => {
				try {
					const current = await TrackPlayer.getActiveTrackIndex()
					if (current !== undefined) {
						await TrackPlayer.add(track, current + 1)
					} else {
						// Handle the case where there is no active track
						await TrackPlayer.add(track)
					}
				} catch (error) {
					console.error('Error adding track to queue:', error)
				}
			})
			.with('add-to-favorites', async () => {
				toggleTrackFavorite(track)
				if (activeQueueId?.startsWith('favorites')) {
					await TrackPlayer.add(track)
				}
			})
			.with('remove-from-favorites', async () => {
				toggleTrackFavorite(track)
				if (activeQueueId?.startsWith('favorites')) {
					const queue = await TrackPlayer.getQueue()
					const trackToRemove = queue.findIndex((queueTrack) => queueTrack.url === track.url)
					await TrackPlayer.remove(trackToRemove)
				}
			})
			.with('add-to-playlist', () => {
				router.push({ pathname: '(modals)/addToPlaylist', params: { trackUrl: track.url } })
			})
			.otherwise(() => console.warn(`Unknown menu action ${id}`))
	}

	return (
		<Menu
			visible={visible}
			onDismiss={closeMenu}
			anchor={<TouchableOpacity onPress={openMenu}>{children}</TouchableOpacity>}
		>
			<Menu.Item
				onPress={() => handlePressAction('add-to-queue')}
				title="Add to queue"
				leadingIcon="playlist-plus"
			/>
			<Menu.Item
				onPress={() => handlePressAction(isFavorite ? 'remove-from-favorites' : 'add-to-favorites')}
				title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
				leadingIcon={isFavorite ? 'star' : 'star-outline'}
			/>
			<Menu.Item
				onPress={() => handlePressAction('add-to-playlist')}
				title="Add to playlist"
				leadingIcon="playlist-plus"
			/>
		</Menu>
	)
}
