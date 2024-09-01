import { FlatList, FlatListProps, Text, View } from "react-native"
import { TrackListItem } from "./TrackListItem"
import { utilsStyles } from "@/styles"
import TrackPlayer, { Track } from "react-native-track-player"
import { useQueue } from "@/store/queue"
import { useRef } from "react"
import { QueueControls } from "./QueueControls"

export type TracksListProps = Partial<FlatListProps<Track>> & {
    id :string
    tracks: Track[]
}

const ItemDivider = () => (
    <View style={{...utilsStyles.itemSeparator, marginVertical:9, marginLeft:60 }}/>
)

export const TracksList = ({ id, tracks, ...flatListProps}: TracksListProps) => {
    const queueOffset = useRef(0)
    const {activeQueueId, setActiveQueueId} = useQueue()

    const handleTrackSelect = async (selectedTrack: Track) => {
        const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)
        if (trackIndex === -1) return

   

        const isChangingQueue = true //id !== activeQueueId
        if (isChangingQueue) {
            const afterTrack = tracks.slice(trackIndex+1)

            await TrackPlayer.reset()
            await TrackPlayer.add(selectedTrack)
            await TrackPlayer.add(afterTrack)
            await TrackPlayer.play()

            queueOffset.current = trackIndex
            setActiveQueueId(id)
        } else {
            const nextTrackIndex = trackIndex-queueOffset.current <0 
                ? tracks.length + trackIndex - queueOffset.current
                : trackIndex - queueOffset.current
                await TrackPlayer.skip(nextTrackIndex)
                TrackPlayer.play()
        }

    }

    return (
        <FlatList 
            contentContainerStyle={{paddingTop:120, paddingBottom:128}}
            data={tracks}
            ItemSeparatorComponent={ItemDivider}
            ListHeaderComponent={<QueueControls tracks={tracks} style={{ paddingBottom:10 }}/>}
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