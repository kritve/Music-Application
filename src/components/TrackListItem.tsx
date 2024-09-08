import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Entypo, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import LoaderKit from 'react-native-loader-kit'
import { Track, useActiveTrack, useIsPlaying } from 'react-native-track-player'
import { TrackShortcutsMenu } from './TrackShortcutsMenu'
import { StopPropagation } from './utils/StopPropagation'

export type TrackListItemProps = {
	track: Track
	onTrackSelect: (track: Track) => void
}

export const TrackListItem = ({ track, onTrackSelect: handleTrackSelect }: TrackListItemProps) => {
	const { playing } = useIsPlaying()

	const isActiveTrack = useActiveTrack()?.url === track.url

	return (
		<TouchableHighlight onPress={() => handleTrackSelect(track)}>
			<View style={styles.trackItemContainer}>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<View>
						<FastImage
							source={{
								uri: track.artwork ?? unknownTrackImageUri,
								priority: FastImage.priority.normal,
							}}
							style={{
								...styles.trackArtworkImage,
								opacity: isActiveTrack ? 0.7 : 1,
							}}
						/>

						{isActiveTrack &&
							(playing ? (
								<LoaderKit
									style={styles.trackPlayingIconIndicator}
									name="BallClipRotatePulse"
									color={colors.primary}
								/>
							) : (
								<Ionicons
									style={styles.trackPausedIndicator}
									name="play"
									size={24}
									color={colors.primary}
								/>
							))}
					</View>

					<View style={{ width: '100%' }}>
						<Text
							numberOfLines={1}
							style={{
								...styles.trackTitleText,
								color: isActiveTrack ? colors.primary : colors.text,
							}}
						>
							{track.title}
						</Text>
					</View>
				</View>

				<StopPropagation>
					<TrackShortcutsMenu track={track}>
						<Entypo name="dots-three-vertical" size={18} color={colors.icon} />
					</TrackShortcutsMenu>
				</StopPropagation>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	trackItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		paddingRight: 20,
	},
	trackArtworkImage: {
		borderRadius: 5,
		width: 45,
		height: 45,
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: fontSize.sm,
		fontWeight: '600',
		maxWidth: '90%',
		//paddingLeft: 15,
		paddingHorizontal: 12,
	},
	trackPlayingIconIndicator: {
		position: 'absolute',
		top: 6,
		left: 5,
		width: 35,
		height: 35,
	},
	trackPausedIndicator: {
		position: 'absolute',
		top: 10,
		left: 12,
	},
})
