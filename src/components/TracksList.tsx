import { FlatList, FlatListProps, Text, View } from "react-native"
import library from '@/assets/data/library.json'
import { TrackListItem } from "./TrackListItem"
import { utilsStyles } from "@/styles"
import TrackPlayer, { Track } from "react-native-track-player"

export type TracksListProps = Partial<FlatListProps<Track>> & {
    tracks: Track[]
}

const ItemDivider = () => (
    <View style={{...utilsStyles.itemSeparator, marginVertical:9, marginLeft:60 }}/>
)

export const TracksList = ({ tracks, ...flatListProps}: TracksListProps) => {
    
    const handleTrackSelect = async (track: Track) => {
        await TrackPlayer.load(track)
        await TrackPlayer.play()

    }

    return (
        <FlatList 
            contentContainerStyle={{paddingTop:120, paddingBottom:128}}
            data={tracks}
            ItemSeparatorComponent={ItemDivider}
            ListFooterComponent={ItemDivider}
            ListEmptyComponent={
                <View>
                    <Text style={utilsStyles.emptyContentText}>
                        No songs found
                    </Text>
                </View>
            }
            renderItem={({item: track}) => (
                <TrackListItem
                    track={track}
                    onTrackSelect={handleTrackSelect}
                />
            )
        }
        {...flatListProps}
        />
    )
}