import { defaultStyles } from "@/styles"
import { View } from "react-native"
import { Stack } from "expo-router"
import { StackScreeenWithSearchBar } from "@/constants/layout"

const HomeScreenLayout = () => {
    return (
        <View style={defaultStyles.container}> 
        <Stack>
            <Stack.Screen 
                name="index"
                options={{
                    ...StackScreeenWithSearchBar,
                    headerTitle: 'Home'}}
            />
        </Stack>
    </View>
    )
}

export default HomeScreenLayout