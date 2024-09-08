import { StackScreeenWithSearchBar } from '@/constants/layout'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

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
							fontSize: fontSize.lg,
						},
						//headerSearchBarOptions: {textColor:colors.text},
						headerStyle: defaultStyles.containerType2,
					}}
				/>
				<Stack.Screen name="Artists/[name]" options={{ headerShown: false }} />
				<Stack.Screen name="Playlists/[name]" options={{ headerShown: false }} />
			</Stack>
		</View>
	)
}

export default SearchScreenLayout
