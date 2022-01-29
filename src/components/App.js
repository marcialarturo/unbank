import React, { useState } from 'react'
import './App.css'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar } from './layout/navbar/Navbar'
import Footer from './layout/footer/Footer'
import Home from './home/Home'
import StreetVendorDashboard from './street-vendor-dashboard/dashboard-main/DashboardMain'

import Web3 from 'web3'

function App() {
  const [account, setAccount] = useState('')

  const loadWeb3 = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum)
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()

      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])
    } else {
      window.alert('Please install Metamask')
    }
  }

  return (
    <Router className="App">
      <div className="App">
        <Navbar account={account} loadWeb3={loadWeb3} />
        <Route exact path="/" component={Home} />

        <Switch>
          <Route exact path="/dashboard">
            <StreetVendorDashboard account={account} />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App
