import { colors } from '@/constants/tokens'
import { defaultStyles, utilsStyles } from '@/styles'
import React, { useCallback, useEffect, useState } from 'react'
import {
	Alert,
	Button,
	FlatList,
	Modal,
	PermissionsAndroid,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic'
import { useActiveTrack } from 'react-native-track-player'

const BluetoothTerminal = () => {
	const [devices, setDevices] = useState<BluetoothDevice[]>([])
	const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null)
	const [message, setMessage] = useState('')
	const [log, setLog] = useState<string[]>([])
	const [isConnecting, setIsConnecting] = useState(false)
	const [isBluetoothOn, setIsBluetoothOn] = useState(true)
	const [showBluetoothOffModal, setShowBluetoothOffModal] = useState(false)
	const [showDisconnectedModal, setShowDisconnectedModal] = useState(false)

	const activeTrack = useActiveTrack()

	const songs = [
		"Guess I'll Never Know",
		'Memories',
		'Anxiety',
		'As You Fade Away',
		'Cattle',
		'Desert Brawl',
		'Changing',
		'El Secreto',
		'Go Down Swinging (Instrumental)',
	]

	const title: string | undefined = activeTrack?.title
	const num: number = title ? songs.indexOf(title) : -1

	const checkConnectionStatus = useCallback(async () => {
		if (connectedDevice) {
			try {
				const isConnected = await connectedDevice.isConnected()
				if (!isConnected) {
					setConnectedDevice(null)
					setShowDisconnectedModal(true)
				}
			} catch (error) {
				console.error('Error checking connection status', error)
				setConnectedDevice(null)
				setShowDisconnectedModal(true)
			}
		}
	}, [connectedDevice])

	useEffect(() => {
		const setupBluetooth = async () => {
			await requestPermissions()
			checkBluetoothStatus()
		}

		setupBluetooth()

		const intervalId = setInterval(checkConnectionStatus, 5000) // Check every 5 seconds

		return () => {
			clearInterval(intervalId)
			if (connectedDevice) {
				connectedDevice.disconnect()
			}
		}
	}, [connectedDevice, checkConnectionStatus])

	const checkBluetoothStatus = async () => {
		try {
			const enabled = await RNBluetoothClassic.isBluetoothEnabled()
			setIsBluetoothOn(enabled)
			if (!enabled) {
				setShowBluetoothOffModal(true)
			} else {
				await fetchPairedDevices()
			}
		} catch (error) {
			console.error('Error checking Bluetooth status', error)
		}
	}

	const requestPermissions = async () => {
		try {
			if (Platform.OS === 'android' && Platform.Version >= 31) {
				const permissions = [
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				]
				const granted = await PermissionsAndroid.requestMultiple(permissions)

				const allGranted = Object.values(granted).every(
					(result) => result === PermissionsAndroid.RESULTS.GRANTED,
				)

				if (!allGranted) {
					Alert.alert(
						'Permission denied',
						'Bluetooth permissions are required to use this feature.',
					)
					console.warn('Bluetooth permissions not granted')
				} else {
					console.log('Bluetooth permissions granted')
				}
			} else if (Platform.OS === 'android') {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				)

				if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
					Alert.alert('Permission denied', 'Location permission is required for Bluetooth.')
					console.warn('Location permission denied')
				} else {
					console.log('Location permission granted')
				}
			}
		} catch (err) {
			console.warn('Failed to request permissions', err)
		}
	}

	const fetchPairedDevices = async () => {
		try {
			const pairedDevices = await RNBluetoothClassic.getBondedDevices()
			setDevices(pairedDevices)
		} catch (error) {
			console.error('Error fetching paired devices', error)
			setLog((prev) => [
				...prev,
				`Error fetching paired devices: ${error instanceof Error ? error.message : String(error)}`,
			])
		}
	}

	const connectToDevice = useCallback(async (device: BluetoothDevice) => {
		setIsConnecting(true)
		try {
			const connected = await RNBluetoothClassic.connectToDevice(device.address, {
				connectorType: 'rfcomm',
				delimiter: '\n',
				charset: 'utf-8',
			})
			setConnectedDevice(connected)
			setLog((prev) => [...prev, `Connected to ${connected.name}`])

			connected.onDataReceived((data) => {
				setLog((prev) => [...prev, `Received: ${data.data}`])
			})
		} catch (error) {
			console.error('Error connecting to device', error)
			setLog((prev) => [
				...prev,
				`Failed to connect to ${device.name}: ${error instanceof Error ? error.message : String(error)}`,
			])
		} finally {
			setIsConnecting(false)
		}
	}, [])

	const disconnectDevice = useCallback(async () => {
		if (connectedDevice) {
			try {
				await connectedDevice.disconnect()
				setConnectedDevice(null)
				setLog((prev) => [...prev, `Disconnected from ${connectedDevice.name}`])
			} catch (error) {
				console.error('Error disconnecting device', error)
				setLog((prev) => [
					...prev,
					`Failed to disconnect from ${connectedDevice.name}: ${error instanceof Error ? error.message : String(error)}`,
				])
			}
		}
	}, [connectedDevice])

	const sendData = useCallback(async () => {
		if (connectedDevice && message) {
			try {
				await connectedDevice.write(`${message}\n`)
				setLog((prev) => [...prev, `Sent: ${message}`])
				setMessage('')
			} catch (error) {
				console.error('Error sending data', error)
				setLog((prev) => [
					...prev,
					`Failed to send: ${message} - ${error instanceof Error ? error.message : String(error)}`,
				])
				await checkConnectionStatus() // Check connection status after a failed operation
			}
		}
	}, [connectedDevice, message, checkConnectionStatus])

	const sendTrackIndex = useCallback(async () => {
		if (connectedDevice && num >= 0) {
			try {
				await connectedDevice.write(`${num}\n`)
				setLog((prev) => [...prev, `Sent track index: ${num}`])
			} catch (error) {
				console.error('Error sending track index', error)
				setLog((prev) => [
					...prev,
					`Failed to send track index: ${num} - ${error instanceof Error ? error.message : String(error)}`,
				])
				await checkConnectionStatus() // Check connection status after a failed operation
			}
		}
	}, [connectedDevice, num, checkConnectionStatus])

	useEffect(() => {
		if (activeTrack && connectedDevice) {
			sendTrackIndex()
		}
	}, [activeTrack, connectedDevice, sendTrackIndex])

	const handleTurnOnBluetooth = async () => {
		try {
			await RNBluetoothClassic.requestBluetoothEnabled()
			setIsBluetoothOn(true)
			setShowBluetoothOffModal(false)
			await fetchPairedDevices()
		} catch (error) {
			console.error('Error turning on Bluetooth', error)
		}
	}

	return (
		<View style={defaultStyles.container}>
			<Modal visible={showBluetoothOffModal} transparent={true} animationType="slide">
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={defaultStyles.text}>
							Bluetooth is turned off. Please turn it on to continue.
						</Text>
						<Button title="Turn On Bluetooth" onPress={handleTurnOnBluetooth} />
					</View>
				</View>
			</Modal>

			<Modal visible={showDisconnectedModal} transparent={true} animationType="slide">
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={defaultStyles.text}>Device disconnected. Please reconnect.</Text>
						<Button title="OK" onPress={() => setShowDisconnectedModal(false)} />
					</View>
				</View>
			</Modal>

			{connectedDevice ? (
				<>
					<Text style={defaultStyles.text}>Connected to {connectedDevice.name}</Text>
					<TextInput
						style={styles.input}
						value={message}
						onChangeText={setMessage}
						placeholder="Enter message"
						placeholderTextColor={colors.textMuted}
					/>
					<Button title="Send Message" onPress={sendData} />
					<Button title="Disconnect" onPress={disconnectDevice} />
					{activeTrack ? (
						<>
							<Text style={defaultStyles.text}>
								Playing {title} (index: {num})
							</Text>
							<Text style={defaultStyles.text}>
								Track index sent automatically when song changes
							</Text>
						</>
					) : (
						<Text style={defaultStyles.text}>Not playing</Text>
					)}
				</>
			) : (
				<FlatList
					data={devices}
					keyExtractor={(item) => item.address}
					renderItem={({ item }) => (
						<View style={utilsStyles.centeredRow}>
							<Text style={defaultStyles.text}>{item.name}</Text>
							<Button
								title={isConnecting ? 'Connecting...' : 'Connect'}
								onPress={() => connectToDevice(item)}
								disabled={isConnecting}
							/>
						</View>
					)}
					ItemSeparatorComponent={() => <View style={utilsStyles.itemSeparator} />}
					ListEmptyComponent={() => (
						<Text style={utilsStyles.emptyContentText}>No paired devices found</Text>
					)}
				/>
			)}
			<FlatList
				data={log}
				renderItem={({ item }) => <Text style={defaultStyles.text}>{item}</Text>}
				keyExtractor={(item, index) => index.toString()}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: colors.background,
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	input: {
		...defaultStyles.text,
		borderColor: colors.textMuted,
		borderWidth: 1,
		padding: 10,
		marginVertical: 10,
	},
})

export default BluetoothTerminal
