import { defaultStyles } from "@/styles"
import { View } from "react-native"
import { Stack } from "expo-router"
import { StackScreeenWithSearchBar } from "@/constants/layout"

const LibraryScreenLayout = () => {
    return (
        <View style={defaultStyles.container}> 
        <Stack>
            <Stack.Screen 
                name="index"
                options={{
                    ...StackScreeenWithSearchBar,
                    headerTitle: 'Library'}}
            />
        </Stack>
    </View>
    )
}

export default LibraryScreenLayout