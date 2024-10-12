import { useStore } from '@/store/spotify'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi()

interface PlayerProps {
	index: number
}

const Player: React.FC<PlayerProps> = (props) => {
	const { token, topSongs } = useStore()
	const [playing, setPlaying] = useState(true)

	spotifyApi.setAccessToken(token)

	useEffect(() => {
		if (topSongs[props.index]) {
			spotifyApi
				.play({
					uris: [topSongs[props.index].uri],
					position_ms: 50000,
				})
				.then(
					function () {
						console.log('playing: ', topSongs[props.index].name)
					},
					function (err: any) {
						console.log('Something went wrong!', err)
					},
				)
		}
	}, [props.index, topSongs])

	const handlePause = () => {
		spotifyApi.pause().then(
			function () {
				setPlaying(false)
				console.log('Playback paused')
			},
			function (err: any) {
				console.log('Something went wrong!', err)
			},
		)
	}

	const handlePlay = () => {
		spotifyApi.play().then(
			function () {
				setPlaying(true)
				console.log('Playback resumed')
			},
			function (err: any) {
				console.log('Something went wrong!', err)
			},
		)
	}

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: '1%',
				}}
			>
				<TouchableOpacity
					onPress={handlePause}
					style={{
						display: playing ? 'flex' : 'none',
						paddingHorizontal: '10%',
						paddingTop: '5%',
						marginTop: Dimensions.get('window').height < 700 ? '10%' : '6%',
					}}
				>
					<Ionicons name="pause" size={50} color="grey" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handlePlay}
					style={{
						display: playing ? 'none' : 'flex',
						paddingHorizontal: '10%',
						paddingTop: '5%',
						marginTop: Dimensions.get('window').height < 700 ? '10%' : '6%',
					}}
				>
					<Ionicons name="play" size={50} color="grey" />
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Player

const styles = StyleSheet.create({
	musicProgress: {
		backgroundColor: 'grey',
		marginLeft: '12%',
		marginRight: '12%',
		borderRadius: 30,
	},
})
