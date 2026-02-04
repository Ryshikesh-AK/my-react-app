import { useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'

export default function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav style={{display: 'flex', gap: 12, alignItems: 'center', padding: 12}}>
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <div style={{marginLeft: 'auto'}}>
          <Link to="/login" className="btn-link">Login</Link>
        </div>
      </nav>

      <main style={{padding: 24}}>
        <h1>Vite + React</h1>

        <div className="card">
          <button onClick={() => setCount((c) => c + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </main>
    </>
  )
}
