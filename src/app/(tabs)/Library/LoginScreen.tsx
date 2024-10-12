import { useStore } from '@/store/spotify'
import { SpotifyApiResponse } from '@/types/types'
import axios from 'axios'
import { ResponseType, useAuthRequest } from 'expo-auth-session'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

const discovery = {
	authorizationEndpoint: 'https://accounts.spotify.com/authorize',
	tokenEndpoint: 'https://accounts.spotify.com/api/token',
}

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	const { token, setToken, addTopSongs } = useStore()

	const [request, response, promptAsync] = useAuthRequest(
		{
			responseType: ResponseType.Token,
			clientId: '',
			scopes: [
				'user-read-currently-playing',
				'user-read-recently-played',
				'user-read-playback-state',
				'user-top-read',
				'user-modify-playback-state',
				'streaming',
				'user-read-email',
				'user-read-private',
			],
			usePKCE: false,
			redirectUri: 'exp://127.0.0.1:19000/',
		},
		discovery,
	)

	useEffect(() => {
		if (response?.type === 'success') {
			const { access_token } = response.params
			setToken(access_token)
		}
	}, [response])

	useEffect(() => {
		if (token) {
			axios
				.get<SpotifyApiResponse>('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + token,
					},
				})
				.then((response) => {
					addTopSongs(response.data)
				})
				.catch((error) => {
					console.log('error', error.message)
				})

			setTimeout(
				() =>
					navigation.replace('Home', {
						token: token,
						other: 'blaaaa',
					}),
				500,
			)
		}
	}, [token])

	return (
		<KeyboardAvoidingView behavior="padding" style={styles.container}>
			<StatusBar style="light" />
			<Text
				style={{
					fontSize: 30,
					fontWeight: 'bold',
					color: 'white',
					marginBottom: '20%',
				}}
			>
				v{' '}
			</Text>
			<Button
				title="Login with Spotify"
				containerStyle={styles.button}
				onPress={() => {
					promptAsync()
				}}
			/>
			<View style={{ height: 100 }} />
		</KeyboardAvoidingView>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
	},
	button: {
		width: 200,
		marginTop: 50,
	},
})
