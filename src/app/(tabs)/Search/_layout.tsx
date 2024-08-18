import { defaultStyles } from "@/styles"
import { View } from "react-native"
import { Stack } from "expo-router"
import { StackScreeenWithSearchBar } from "@/constants/layout"
import { colors } from "@/constants/tokens"

const SearchScreenLayout = () => {
    return (
        <View style={defaultStyles.container}> 
        <Stack>
            <Stack.Screen 
                name="index"
                options={{
                    ...StackScreeenWithSearchBar,
                    headerTitle: 'Search',
                    headerTitleStyle: {
                        color: colors.text,
                    },
                    //headerSearchBarOptions: {textColor:colors.text},
                    headerStyle: defaultStyles.containerType2,
                    
                }}
            />
        </Stack>
    </View>
    )
}

export default SearchScreenLayout