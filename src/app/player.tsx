import { MovingText } from "@/components/MovingText"
import { unknownArtistImageUri } from "@/constants/images"
import { colors, fontSize, screenPadding } from "@/constants/tokens"
import { defaultStyles, utilsStyles } from "@/styles"
import { ActivityIndicator, StyleSheet, View, Text } from "react-native"
import FastImage from "react-native-fast-image"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useActiveTrack } from "react-native-track-player"
import { FontAwesome } from '@expo/vector-icons'
import { PlayerControls } from "@/components/PlayerControls"
import { PlayerProgressBar } from "@/components/PlayerProgressBar"
import { PlayerVolumeBar } from "@/components/PlayerVolumeBar"
import { PlayerRepeatToggle } from "@/components/PlayerRepeatToggle"
import { usePlayerBackground } from "@/hooks/usePlayerBackground"
import { LinearGradient } from "expo-linear-gradient"


const PlayerScreen = () => {
    const activeTrack=useActiveTrack()
    const {imageColors} = usePlayerBackground(activeTrack?.artwork ?? unknownArtistImageUri)

    const {top,bottom} = useSafeAreaInsets()

    if(!activeTrack) {
        return (
            <View style={[defaultStyles.container, { justifyContent: 'center' }]}>
            <ActivityIndicator color={colors.icon} />
            </View>
        )
    }

    const getColor = (color: { value: string; name: string } | undefined, fallback: string) => 
        color && typeof color.value === 'string' ? color.value : fallback
    const isFavorite = false
    const toggleFavorite = () => {}
    console.log(imageColors.colorOne)
    console.log(imageColors.colorTwo)
    console.log(imageColors.colorThree)
    console.log(imageColors.colorFour)
    return (
        <LinearGradient
			style={{ flex: 1 }}
			colors={[getColor(imageColors.colorOne, colors.background),
                getColor(imageColors.colorThree, colors.background2)]}
		>
        <View style={styles.overlayContainer}>

            <DismissPlayerSymbol />

            <View style={{flex:1, marginTop: top, marginBottom: bottom}}>
                <View style={styles.artworkImageContainer}>
                <FastImage source={{
                    uri: activeTrack.artwork ?? unknownArtistImageUri,
                    priority: FastImage.priority.high
                }}
                resizeMode='cover'
                style={styles.artworkImage}
                />
                </View>

                <View style={{flex:1}}>
                    <View style={{marginTop:'auto'}}>
                        <View style={{height: 60}}>
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'space-between',
                                alignContent:'center'}}>
                                    <View style={styles.trackTitleContainer}>
                                        <MovingText text={activeTrack.title ?? ''}
                                                    animationThreshold={30}
                                                    style={styles.trackTitleText}
                                                    />
                                    </View>
                                    <FontAwesome name={isFavorite ? 'heart' : 'heart-o'}
                                    size={20}
                                    color={isFavorite ? colors.primary : colors.icon} 
                                    style={{marginHorizontal:14}}
                                    onPress={toggleFavorite}
                                    />
                            </View>

                                {activeTrack.artist && (
                                    <Text numberOfLines={1} style={[styles.trackArtistText, {marginTop:1}]}>
                                        {activeTrack.artist}
                                    </Text>
                                )}
                        </View>

                        <PlayerProgressBar style={{marginTop:32}} />

                        <PlayerControls style={{marginTop:40}} />

                    </View>
                    <View style={utilsStyles.centeredRow}>
                        <PlayerRepeatToggle size={30} style={{marginBottom:0, marginTop:25, marginRight:8}} />
                    </View>
                  
                    {/* PlayerVolumeBar can be implented as a haptic amplitude effect controller  */}
                    <PlayerVolumeBar style={{marginTop:'auto', marginBottom:30}} />
                    {/* <View style={utilsStyles.centeredRow}>
                        <PlayerRepeatToggle size={30} style={{marginBottom:6}} />
                    </View> */}

                </View>

            </View>




        </View>
        </LinearGradient>
    )
}

const DismissPlayerSymbol = () => {
    const {top} = useSafeAreaInsets()

    return <View style={{
        position:'absolute',
        top: top+8,
        left:0,
        right:0,
        flexDirection:'row',
        justifyContent:'center'
    }}> 

        <View 
            accessible={false}
            style={{
                width: 50,
                height: 8,
                borderRadius: 8,
                backgroundColor: '#fff',
                opacity: 0.7,
            }}
			/>

    </View>

}


const styles = StyleSheet.create({
	overlayContainer: {
		...defaultStyles.container,
		paddingHorizontal: screenPadding.horizontal,
		backgroundColor: '#000',
	},
	artworkImageContainer: {
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 11.0,
		flexDirection: 'row',
		justifyContent: 'center',
		height: '45%',
	},
	artworkImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 12,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: 22,
		fontWeight: '700',
	},
	trackArtistText: {
		...defaultStyles.text,
		fontSize: 15,
		opacity: 0.8,
		maxWidth: '90%',
	}
})


export default PlayerScreen