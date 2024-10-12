declare module '@dylankenneally/react-native-ssh-sftp' {
	export default class SSHClient {
		static initLibrary() {
			throw new Error('Method not implemented.')
		}
		static connectWithPassword(
			host: string,
			port: number,
			username: string,
			password: string,
			callback?: (error: Error | null) => void,
		): Promise<SSHClient>

		execute(command: string): Promise<string>
	}
}
