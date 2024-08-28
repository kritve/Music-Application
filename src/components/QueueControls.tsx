import { colors } from "@/constants/tokens"
import { defaultStyles } from "@/styles"
import { StyleSheet, Text, View, ViewProps } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import TrackPlayer, { Track } from "react-native-track-player"
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

type QueueControlsProps = {
    tracks: Track[]
} & ViewProps

export const QueueControls = ({tracks, style, ...viewProps}: QueueControlsProps) => {

    const handlePlay = async () => {
		await TrackPlayer.setQueue(tracks)
		await TrackPlayer.play()
	}

    const handleShuffle = async() => {
        const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5)
        await TrackPlayer.setQueue(shuffledTracks)
		await TrackPlayer.play()
    }

    return (
        <View style={[{ flexDirection: 'row', columnGap: 40}, style] } {...viewProps}>
            {/* play button */}
            <View style={{flex:1}}>
                <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={handlePlay}>
                <Ionicons name="play-circle" size={24} color={colors.primary} />
                <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
            </View>

            {/* shuffle button */}
            <View style={{flex:1}}>
                <TouchableOpacity activeOpacity={0.7} style={styles.button}  onPress={handleShuffle}>
                <Entypo name="shuffle" size={24} color={colors.primary} />
                <Text style={styles.buttonText}>Shuffle</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
	button: {
		padding: 12,
		backgroundColor: 'rgba(47, 47, 47, 0.5)',
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		columnGap: 8,
	},
	buttonText: {
		...defaultStyles.text,
		color: colors.primary,
		fontWeight: '600',
		fontSize: 15,
		textAlign: 'center',
	},
})