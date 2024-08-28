import { QueueInitialTracksService } from '@/constants/QueueInitialTracksService'
import { SetupService } from '@/constants/SetupService'
import { useEffect, useRef, useState } from 'react'
import TrackPlayer, { Capability, RatingType, RepeatMode } from 'react-native-track-player'

// const setupPlayer = async () => {
// 	await TrackPlayer.setupPlayer({
// 		maxCacheSize: 1024 * 10,
// 	})

// 	await TrackPlayer.updateOptions({
// 		ratingType: RatingType.Heart,
// 		capabilities: [
// 			Capability.Play,
// 			Capability.Pause,
// 			Capability.SkipToNext,
// 			Capability.SkipToPrevious,
// 			Capability.Stop,
// 		],
// 	})

// 	await TrackPlayer.setVolume(0.3) // not too loud
// 	await TrackPlayer.setRepeatMode(RepeatMode.Queue)
// }

// export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
// 	const isInitialized = useRef(false)

// 	useEffect(() => {
// 		if (isInitialized.current) return

// 		setupPlayer()
// 			.then(() => {
// 				isInitialized.current = true
// 				onLoad?.()
// 			})
// 			.catch((error) => {
// 				isInitialized.current = false
// 				console.error(error)
// 			})
// 	}, [onLoad])
// }
export function useSetupTrackPlayer() {
	const [playerReady, setPlayerReady] = useState<boolean>(false);
  
	useEffect(() => {
	  let unmounted = false;
	  (async () => {
		await SetupService();
		if (unmounted) return;
		setPlayerReady(true);
		const queue = await TrackPlayer.getQueue();
		if (unmounted) return;
		if (queue.length <= 0) {
		  await QueueInitialTracksService();
		}
	  })();
	  return () => {
		unmounted = true;
	  };
	}, []);
	return playerReady;
  }
