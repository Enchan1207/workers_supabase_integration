import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'

import { client } from './client'
import UserButton from './user-button'

const App: React.FC = () => {
  const [message, setMessage] = useState('')

  const { getAccessTokenSilently } = useAuth0()

  const onClick = async () => {
    const token = await getAccessTokenSilently()

    const response = await client.api.hello
      .$get({}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : undefined))

    if (response === undefined) {
      setMessage('Failed to fetch')
      return
    }

    setMessage(response.message)
  }

  return (
    <>
      <h2>Cloudflare Workers with static assets</h2>
      <UserButton />
      <hr />
      <button onClick={onClick}>query</button>
      <p>Meesage from backend: {message}</p>
    </>
  )
}

export default App
