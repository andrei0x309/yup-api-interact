import { ethers } from 'ethers'

export type TPlatform = 'farcaster' | 'twitter' | 'lens' | 'bsky' | 'threads'

export type TMedia = {
	farcaster: string
	twitter: string
	lens: string
}

export interface IReplyTo {
	twitter?: string
	lens?: string
	bsky?: string
	farcaster?: {
		fid: string
		hash: string
	} | string
	threads?: string
}

export interface ISendPostData {
	content: string
	platforms: TPlatform[]
	media?: TMedia[]
	replyTo?: IReplyTo
	time?: number
}


export class YupAPI {

	private PK: string = ''
	private token: string = ''
	private BP_ENDPOINT = 'https://api.yup.io'

	constructor({
		PK,
		token
	}: {
		PK?: string,
		token?: string
	
	}) {
		if (!PK && !token) {
			throw new Error('Missing PK or token');
		}
		if (PK) {
			this.PK = PK
		}
		if (token) {
			this.token = token
		}
	}

	getLoginTokenFromPK = async () => {
		const wallet = new ethers.Wallet(this.PK.replace('0x', ''))
		const address = wallet.address
		const req = await fetch(`${this.BP_ENDPOINT}/v1/eth/challenge?address=${address}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
		const res = await req.json()
		const challenge = res.data
		const signature = await wallet.signMessage(challenge.startsWith('0x') ? ethers.getBytes(challenge) : challenge)
		const reqLogin = await fetch(`${this.BP_ENDPOINT}/accounts/log-in`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				address,
				signature
			})
		})
		if (reqLogin.status !== 200) {
			return null
		}
		const result = (await reqLogin.json())
		let token

		if (Array.isArray(result)) {
			token = result[0].jwt
		} else {
			token = result.jwt
		}

		this.token = token
	}

	fetchWithProxyAuth = async (url: string, options = {} as any) => {
		if (!('headers' in options)) options.headers = {}
		if (!this.token) {
			await this.getLoginTokenFromPK()
			if (!this.token) {
				console.log('Failed to get auth token')
				return
			}
		}

		options.headers['Content-Type'] = 'application/json'
		options.headers['Authorization'] = 'Bearer ' + this.token
		return fetch(url, options)
	}

	sendPost = async (sendData: ISendPostData) => {
		try {
			const req = await (await this.fetchWithProxyAuth(`${this.BP_ENDPOINT}/web3-post`, {
				method: 'POST',
				body: JSON.stringify(sendData)
			}))
			if (!req) {
				console.error('sendPost fetchWithProxyAuth failed')
				return null
			}

			if (!req.ok) {
				console.error('Error submitting post: ', req.statusText)
			}

			const data = await req.json()
			return data
		} catch (e) {
			console.error('Submit Post: ', e)
			return null
		}
	}
}
