import { playbackService } from '@/constants/playbackService';
import { SetupService } from '@/constants/SetupService';
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState';
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import { colors } from '@/constants/tokens';
//import { useLibraryStore, useTracks } from '@/store/library';

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)


const App = () => {
	
	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useEffect(() => {
		// Set the navigation bar color to black
		SystemUI.setBackgroundColorAsync("black");
		NavigationBar.setBackgroundColorAsync("black");
		NavigationBar.setButtonStyleAsync("light");
		// You can also set the navigation bar appearance
		//SystemUI.setNavigationBarStyleAsync("dark");
	  }, []);

	useSetupTrackPlayer()

	handleTrackPlayerLoaded()

	useLogTrackPlayerState()

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{flex:1}}>
				<RootNavigation />

				<StatusBar style='light' backgroundColor='black' />
				</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}
const RootNavigation = () => {
  return (
    <Stack>
    <Stack.Screen name='(tabs)' options={{ headerShown: false }}  />

	<Stack.Screen name='Player' options={{
		headerShown: false,
		presentation:'card',
		gestureEnabled:true,
		//gestureDirection:'vertical',
		animationDuration: 400,
		animation: 'fade_from_bottom',
		//cardStyle: { backgroundColor: 'black' },
        headerStyle: { backgroundColor: '#000' },
		headerBackground: (()=>colors.background),
		
		
	}} 
	/>
  </Stack>
  )
} 


export default App