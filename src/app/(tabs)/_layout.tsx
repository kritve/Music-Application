import { Tabs } from "expo-router"
import { colors, fontSize } from '@/constants/tokens'
import { BlurView } from "expo-blur"
import { StyleSheet, ViewProps } from "react-native"
import { FontAwesome } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { defaultStyles } from "@/styles"
import { FloatingPlayer } from "@/components/FloatingPlayer"
import { LinearGradient } from "expo-linear-gradient"

const TabsNavigation = () => {
    return (
        <>
        <Tabs 
        screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.text,
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: {
                fontSize: fontSize.xs,
                fontWeight: '500'
            },
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderTopWidth: 0,
                paddingTop: 5,
            },
            // tabBarBackground: () => (
            //     <BlurView intensity={0} 
                
            //     style={{
            //         ...StyleSheet.absoluteFillObject,
            //         overflow: 'hidden',
            //         borderEndColor: "#000", 
            //         borderBlockEndColor: "#000",
            //         backgroundColor: colors.background,
            //         borderTopLeftRadius: 10,
            //         borderTopRightRadius: 10,
            //         borderBottomLeftRadius: 10,
            //         borderBottomRightRadius: 10,
                    
            //     }}
                
            // />
            // ),
            tabBarBackground: () => (
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
                  locations={[0, 0.1, 0.3, 1]}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    overflow: 'hidden',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                />
              ),
            
        }}>
        <Tabs.Screen name="(Home)" options={{
            title: "Home",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-variant" size={30} color={color} />

        }}  /> 
        <Tabs.Screen name="Search" options={{
            title: "Search",
            tabBarIcon: ({ color }) => <MaterialIcons name="search" size={30} color={color} />

        }} />
        <Tabs.Screen name="Library" options={{
            title: "Library",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bookshelf" size={30} color={color} />

        }} />
        <Tabs.Screen name="Account" options={{
            title: "Account",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-cog-outline" size={30} color={color} />

        }} />
    </Tabs>

    <FloatingPlayer />
        </>
    )
}

export default TabsNavigation