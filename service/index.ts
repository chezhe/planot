import { relayInit, Relay, Event } from 'nostr-tools'
import _ from 'lodash'
import { Profile } from '../types'

export default class Relayer {
  static relays: Relay[] = []
  constructor() {
    if (Relayer.relays.length) {
      return
    }
    this.init()
  }

  async init() {
    const nodes = [
      'wss://nostr-pub.wellorder.net',
      'wss://relay.damus.io',
      'wss://relay.nostr.ch',
    ] // , 'wss://nostr.oxtr.dev', 'wss://nostr-relay.wlvs.space', 'wss://nostr.fmt.wiz.biz'
    for (const node of nodes) {
      const relay = relayInit(node)
      await relay.connect()

      relay.on('connect', () => {
        console.log(`connected to ${relay.url}`)
      })
      relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`)
      })
      Relayer.relays.push(relay)
    }
  }

  public async getProfile(address: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
      const sub = Relayer.relays[0]?.sub([
        {
          authors: [address],
          kinds: [0],
        },
      ])

      let profile: Event
      sub?.on('event', (event: Event) => {
        profile = event
      })
      sub?.on('eose', () => {
        if (profile) {
          resolve(JSON.parse(profile.content))
        } else {
          reject('no profile')
        }
        sub?.unsub()
      })
    })
  }

  public async getPostsByAuthor(address: string): Promise<Event[]> {
    try {
      const results = await Promise.all(
        Relayer.relays.map((relay) => {
          return new Promise((resolve, reject) => {
            const sub = relay?.sub([
              {
                authors: [address],
                kinds: [1],
              },
            ])

            const posts: Event[] = []
            sub?.on('event', (event: Event) => {
              posts.push(event)
            })
            sub?.on('eose', () => {
              resolve(posts)
              sub?.unsub()
            })
            setTimeout(() => {
              resolve([])
            }, 5000)
          })
        })
      )
      return _.uniqBy(_.flatten(results) as Event[], (t: Event) => t.id)
    } catch (error) {
      console.log('error', error)

      return []
    }
  }

  public async getFollowedByAuthor(address: string): Promise<Event[]> {
    try {
      const results = await Promise.all(
        Relayer.relays.map((relay) => {
          return new Promise((resolve, reject) => {
            const sub = relay?.sub([
              {
                authors: [address],
                // kinds: [3],
              },
            ])

            const posts: Event[] = []
            sub?.on('event', (event: Event) => {
              console.log('followed', event)

              posts.push(event)
            })
            sub?.on('eose', () => {
              resolve(posts)
              sub?.unsub()
            })
            setTimeout(() => {
              resolve([])
            }, 5000)
          })
        })
      )
      return _.uniqBy(_.flatten(results) as Event[], (t: Event) => t.id)
    } catch (error) {
      return []
    }
  }

  public async getGlobalFeed(): Promise<Event[]> {
    try {
      const results = await Promise.all(
        Relayer.relays.map((relay) => {
          return new Promise((resolve, reject) => {
            const sub = relay?.sub([
              {
                kinds: [1],
                since: 0,
                limit: 20,
              },
            ])

            const posts: Event[] = []
            sub?.on('event', (event: Event) => {
              posts.push(event)
            })
            sub?.on('eose', () => {
              resolve(posts)
              sub?.unsub()
            })
            setTimeout(() => {
              resolve([])
            }, 5000)
          })
        })
      )
      return _.uniqBy(_.flatten(results) as Event[], (t: Event) => t.id)
    } catch (error) {
      return []
    }
  }
}
