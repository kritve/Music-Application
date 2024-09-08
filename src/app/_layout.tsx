import { playbackService } from '@/constants/playbackService'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import * as NavigationBar from 'expo-navigation-bar'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import React, { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MD3DarkTheme as DefaultTheme, PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import TrackPlayer from 'react-native-track-player'
//import { useLibraryStore, useTracks } from '@/store/library';

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useEffect(() => {
		// Set the navigation bar color to black
		SystemUI.setBackgroundColorAsync('black')
		NavigationBar.setBackgroundColorAsync('black')
		NavigationBar.setButtonStyleAsync('light')
		// You can also set the navigation bar appearance
		//SystemUI.setNavigationBarStyleAsync("dark");
	}, [])

	useSetupTrackPlayer()

	handleTrackPlayerLoaded()

	useLogTrackPlayerState()

	return (
		<PaperProvider theme={theme}>
			<SafeAreaProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<RootNavigation />

					<StatusBar style="light" backgroundColor="black" />
				</GestureHandlerRootView>
			</SafeAreaProvider>
		</PaperProvider>
	)
}
const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />

			<Stack.Screen
				name="player"
				options={{
					headerShown: false,
					presentation: 'card',
					gestureEnabled: true,
					gestureDirection: 'vertical',
					animationDuration: 400,
					animation: 'fade_from_bottom',

					//cardStyle: { backgroundColor: 'black' },
				}}
			/>
		</Stack>
	)
}

export default App

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'black',
		secondary: 'white',
	},
}
