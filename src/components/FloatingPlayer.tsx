import { unknownTrackImageUri } from "@/constants/images"
import { defaultStyles } from "@/styles"
import { StyleSheet, TouchableOpacity, View, Text, ViewProps, ViewStyle } from "react-native"
import FastImage from "react-native-fast-image"
import { Track, useActiveTrack } from "react-native-track-player"
import { PlayPauseButton, SkipToNextButton } from "./PlayerControls"
import { useRouter } from "expo-router"
import { useLastActiveTrack } from "@/hooks/useLastActiveTrack"
import { MovingText } from "./MovingText"

export const FloatingPlayer =  ({ style }: ViewProps) => {
	const router = useRouter()
	const activeTrack = useActiveTrack()
	const lastActiveTrack = useLastActiveTrack()

	const displayedTrack = activeTrack ?? lastActiveTrack

	const handlePress = () => {
		router.navigate('/player')
	}

    if(!displayedTrack) return null
 
    return (<TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={[styles.container, style]}>
        <>
            <FastImage source={{
                uri: displayedTrack.artwork ?? unknownTrackImageUri
            }}
            style={styles.trackArtworkImage}
            />

            <View style={styles.trackTitleContainer}>
                <MovingText style={styles.trackTitle} 
				 animationThreshold={25}
				 text={displayedTrack.title ?? ''}
				/>								
            </View>
            
            <View style={styles.trackControlsContainer}>
                <PlayPauseButton iconSize={24} />
                <SkipToNextButton iconSize={24} />
            </View>

        </>
    </TouchableOpacity>)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1e1f1e',
		padding: 8,
		borderRadius: 12,
		paddingVertical: 10,
        //justifyContent: 'center'
        position:'absolute',
        left:8,
        right:8,
        bottom: 50,
        
	},
	trackArtworkImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
		marginLeft: 10,
	},
	trackTitle: {
		...defaultStyles.text,
		fontSize: 18,
		fontWeight: '600',
		paddingLeft: 10,
	},
	trackControlsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 20,
		marginRight: 16,
		paddingLeft: 16,
	},
})
