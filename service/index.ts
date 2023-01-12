import { relayInit, Relay, Event, Filter } from 'nostr-tools'
import _ from 'lodash'
import { Follow, Profile } from '../types'

async function query(pool: Relay[], filter: Filter[]) {
  try {
    const results = await Promise.all(
      pool.map((relay) => {
        return new Promise((resolve, reject) => {
          const sub = relay?.sub(filter)

          let tick: NodeJS.Timeout
          function resolveIt() {
            if (tick) {
              clearTimeout(tick)
            }
            tick = setTimeout(() => {
              resolve([])
            }, 5000)
          }
          resolveIt()
          const posts: Event[] = []
          sub?.on('event', (event: Event) => {
            posts.push(event)
            resolveIt()
          })
          sub?.on('eose', () => {
            resolve(posts)
            sub?.unsub()
          })
        })
      })
    )
    return _.uniqBy(_.flatten(results) as Event[], (t: Event) => t.id)
  } catch (error) {
    return []
  }
}

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
      'wss://nostr.zebedee.cloud',
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
    try {
      const result = await query(Relayer.relays, [
        {
          authors: [address],
          kinds: [0],
        },
      ])
      if (result.length) {
        return JSON.parse(result[0].content)
      }
      throw new Error('Profile not set yet')
    } catch (error) {
      throw error
    }
  }

  public async getPostsByAuthor(address: string): Promise<Event[]> {
    return query(Relayer.relays, [
      {
        authors: [address],
        kinds: [1],
        limit: 20,
      },
    ])
  }

  public async getPostById(id: string): Promise<Event | undefined> {
    try {
      const results = await Promise.all(
        Relayer.relays.map((relay) => {
          return new Promise((resolve, reject) => {
            const sub = relay?.sub([
              {
                ids: [id],
              },
            ])

            sub?.on('event', (event: Event) => {
              resolve(event)
            })
            sub?.on('eose', () => {
              sub?.unsub()
            })
            setTimeout(() => {
              resolve(undefined)
            }, 15000)
          })
        })
      )

      return _.uniqBy(
        results.filter((t) => t) as Event[],
        (t: Event) => t.id
      )[0]
    } catch (error) {
      return undefined
    }
  }

  public async getFollowingByPubkey(pubkey: string): Promise<Follow[]> {
    const result = await query(Relayer.relays, [
      {
        authors: [pubkey],
        kinds: [3],
      },
    ])

    return _.flatten(result.map((t) => t.tags)).map((t) => ({
      tag: t[0],
      pubkey: t[1],
      relay: t[2],
    }))
  }

  public async getFollowingFeed(
    pubkey: string,
    following?: Follow[]
  ): Promise<Event[]> {
    let authors = []
    if (following && following.length) {
      authors = following.map((t) => t.pubkey)
    } else {
      const _following = await this.getFollowingByPubkey(pubkey)

      authors = _following.map((t) => t.pubkey)
    }
    return query(Relayer.relays, [
      {
        authors,
        kinds: [1, 2],
        limit: 10,
      },
    ])
  }

  public async getGlobalFeed(): Promise<Event[]> {
    return query(Relayer.relays, [
      {
        kinds: [1],
        since: 0,
        limit: 10,
      },
    ])
  }

  public async getNotesByHashTag(hashTag: string): Promise<Event[]> {
    return query(Relayer.relays, [
      {
        kinds: [1],
        '#t': [hashTag],
        limit: 10,
      },
    ])
  }

  public async getMessagesByPubkey(pubkey: string): Promise<Event[]> {
    return query(Relayer.relays, [
      {
        authors: [pubkey],
        kinds: [4],
        limit: 10,
      },
    ])
  }

  public async getNoteThread(id: string): Promise<Event[]> {
    const result = await query(Relayer.relays, [
      {
        kinds: [1],
        '#e': [id],
        limit: 10,
      },
    ])

    return result
  }
}
