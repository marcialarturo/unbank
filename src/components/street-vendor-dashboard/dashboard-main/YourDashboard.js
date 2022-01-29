import React, { useState } from 'react'
// import Token from '../abis/Token.json'
// import dBank from '../abis/dBank.json'

export default function YourDashboard() {
  const [account, setAccount]  = useState('')
  const [token, setToken ]  = useState(null)
  const [tokenBalance, setTokenBalance]  = useState(0)
  const [dbank, setDbank]  = useState(null)
  const [dBankAddress, setDBankAddress]  = useState(null)


  return <div>
    <p>here is our new dashboard</p>
  </div>
}
