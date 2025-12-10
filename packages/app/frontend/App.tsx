import { useAuth0 } from '@auth0/auth0-react'

import { client } from './client'
import UserButton from './user-button'

const App: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0()

  const onClick = async () => {
    const token = await getAccessTokenSilently()

    await client.posts
      .$get(undefined, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((data) => {
        console.log(data?.items)
      })
  }

  return (
    <>
      <h2>Cloudflare Workers with static assets</h2>
      <UserButton />
      <button onClick={onClick}>query</button>
    </>
  )
}

export default App
