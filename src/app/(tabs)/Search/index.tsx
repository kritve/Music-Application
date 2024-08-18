import { TracksList } from "@/components/TracksList"
import { colors, screenPadding } from "@/constants/tokens"
import { useNavigationSearch } from "@/hooks/useNavigationSearch"
import { defaultStyles } from "@/styles"
import { View, ScrollView } from "react-native"
import library from "@/assets/data/library.json"
import { useMemo } from "react"
import { trackTitleFilter } from "@/helper/filter"

const SearchScreen = () => {
    const search = useNavigationSearch({
        searchBarOptions: {
            placeholder: 'Search',
            
        },

    })

    const filteredSongs = useMemo(() => {
        if(!search) return library

        return library.filter(trackTitleFilter(search))
    }, [search]) 

    return (
        <View style={defaultStyles.container}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={{ paddingHorizontal: screenPadding.horizontal}}> 
                <TracksList tracks={filteredSongs}
                            scrollEnabled={false} />
            </ScrollView>

    </View>
    )
}

export default SearchScreen