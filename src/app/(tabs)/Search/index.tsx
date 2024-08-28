import { TracksList } from "@/components/TracksList"
import { colors, screenPadding } from "@/constants/tokens"
import { useNavigationSearch } from "@/hooks/useNavigationSearch"
import { defaultStyles, utilsStyles } from "@/styles"
import { View, ScrollView, StyleSheet, TouchableHighlight, Text } from "react-native"
import { useMemo } from "react"
import { artistNameFilter, playlistNameFilter, trackTitleFilter } from "@/helper/filter"
import { useArtists, usePlaylists, useTracks } from "@/store/library"
import { generateTracksListId } from "@/helper/miscellaneous"
import { FlatList } from "react-native-gesture-handler"
import FastImage from "react-native-fast-image"
import { unknownArtistImageUri } from "@/constants/images"
import { Link, useRouter } from "expo-router"
import { PlaylistsList } from "@/components/PlaylistList"
import { Playlist } from "@/helper/types"


const SearchScreen = () => {

	const router = useRouter()

    const search = useNavigationSearch({
        searchBarOptions: {
            placeholder: 'Search',
            
        },

    })

    const tracks = useTracks()
    const artists = useArtists()

    const filteredSongs = useMemo(() => {
        if(!search) return tracks
        return tracks.filter(trackTitleFilter(search))     
    }, [search, tracks]) 

    const filteredArtists = useMemo(() => {
		if (!search) return artists
		return artists.filter(artistNameFilter(search))
	}, [artists, search])

	const { playlists } = usePlaylists()

	const filteredPlaylists = useMemo(() => {
		return playlists.filter(playlistNameFilter(search))
	}, [playlists, search])

	const sanitizeName = (name: string) => encodeURIComponent(name);


	const handlePlaylistPress = (playlist: Playlist) => {
		router.push(`/Search/Playlists/${sanitizeName(playlist.name)}`)
	}



    return (
        
        
            <View style={defaultStyles.container}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={{ paddingHorizontal: screenPadding.horizontal }}>

					{/* Songs list */}

                	<TracksList tracks={filteredSongs}
                    scrollEnabled={false}
                    id={generateTracksListId('songs', search)} />

					{/* Playlists list */}

					<PlaylistsList
					scrollEnabled={false}
					playlists={filteredPlaylists}
					onPlaylistPress={handlePlaylistPress}
					/>



					{/* Artists List */}

                	<FlatList
					contentContainerStyle={{ paddingTop: 0, paddingBottom: 75 }}
					scrollEnabled={false}
					ItemSeparatorComponent={ItemSeparatorComponent}
					ListFooterComponent={ItemSeparatorComponent}
					ListEmptyComponent={
						<View>
							<Text style={utilsStyles.emptyContentText}>
                                No artists found
                            </Text>
						</View>
					}
					data={filteredArtists}
					renderItem={({ item: artist }) => {
						return (
							<Link href={`/Search/Artists/${sanitizeName(artist.name)}`} asChild>
								<TouchableHighlight activeOpacity={0.8}>
									<View style={styles.artistItemContainer}>
										<View>
                                            
											<FastImage
												source={{
													uri: unknownArtistImageUri,
													priority: FastImage.priority.normal,
												}}
												style={styles.artistImage}
											/>
										</View>

										<View style={{ width: '100%' }}>
											<Text numberOfLines={1} style={styles.artistNameText}>
												{artist.name}
											</Text>
										</View>
									</View>
								</TouchableHighlight>
							</Link>
						)
					}}	
				/>
            </ScrollView>
            </View>
    )
}


const ItemSeparatorComponent = () => {
	return <View style={[utilsStyles.itemSeparator, { marginLeft: 50, marginVertical: 12 }]} />
}

const styles = StyleSheet.create({
	artistItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
	},
	artistImage: {
		borderRadius: 32,
		width: 40,
		height: 40,
	},
	artistNameText: {
		...defaultStyles.text,
		fontSize: 17,
		maxWidth: '80%',
	},
})



export default SearchScreen

