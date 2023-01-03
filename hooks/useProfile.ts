import { useEffect, useState } from 'react'
import { Profile } from '../types'

export default function useProfile(acc: string) {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {}, [acc])

  return profile
}
