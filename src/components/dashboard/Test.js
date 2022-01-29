import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../../abis/dBank.json'
import React, { Component } from 'react'
import Token from '../../abis/Token.json'
import Web3 from 'web3'

import { genKeyPairFromSeed, SkynetClient } from 'skynet-js'

const portal = 'https://siasky.net/'
const client = new SkynetClient(portal)
const { privateKey, publicKey } = genKeyPairFromSeed('SEEDPHASE')

class Test extends Component {
  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  //check if MetaMask exists
  async loadBlockchainData(dispatch) {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum)
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()

      //check if account is detected, then load balance&setStates, elsepush alert
      if (typeof accounts[0] !== 'undefined') {
        let balance = await web3.eth.getBalance(accounts[0])
        balance = web3.utils.fromWei(balance)

        this.setState({ account: accounts[0], balance, web3 })
      }

      try {
        // creates a new contract for Token & Bank  comes from the JSON object ABI
        const token = new web3.eth.Contract(
          Token.abi,
          Token.networks[netId].address,
        )
        const dbank = new web3.eth.Contract(
          dBank.abi,
          dBank.networks[netId].address,
        )
        const dBankAddress = dBank.networks[netId].address
        this.setState({
          token: token,
          dbank: dbank,
          dBankAddress: dBankAddress,
        })

        let tokenBalance = await token.methods
          .balanceOf(this.state.account)
          .call()
        tokenBalance = web3.utils.fromWei(tokenBalance)

        let depositedBalance = await dbank.methods
          .etherBalanceOf(this.state.account)
          .call()

        depositedBalance = web3.utils.fromWei(depositedBalance)

        this.setState({ tokenBalance, depositedBalance })
      } catch (error) {
        console.log('error', error)
        window.alert('Contract not deployed to the current network')
      }
    } else {
      window.alert('Please install Metamask')
    }
  }

  async deposit(amount) {
    //check if this.state.dbank is ok then deposit
    if (this.state.dbank !== 'undefined') {
      try {
        await this.state.dbank.methods
          .deposit()
          .send({ value: amount.toString(), from: this.state.account })

        window.location = '#/dashboard'
      } catch (error) {
        console.log('Error, deposit: ', error)
      }
    }
  }

  async withdraw(e) {
    e.preventDefault()
    if (this.state.dbank !== 'undefined') {
      try {
        await this.state.dbank.methods
          .withdraw()
          .send({ from: this.state.account })
        window.location = '#/dashboard'
      } catch (e) {
        console.log('Error, withdraw: ', e)
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      tokenBalance: 0,
      dbank: null,
      balance: 0,
      dBankAddress: null,
      businessName: '',
      businessGoal: '',
      EthAmount: 0,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()

    console.log('-->', this.state)
    let json = {
      businessName: this.state.businessName,
      businessGoal: this.state.businessGoal,
      EthAmount: this.state.EthAmount,
    }

    await client.db.setJSON(privateKey, 'home', json)

    let amount = this.depositAmount.value
    amount = amount * 10 ** 18 //convert to wei
    this.deposit(amount)

    const { data } = await client.db.getJSON(publicKey, 'home')
    console.log(data)
  }

  render() {
    return (
      <div className="text-monospace">
        <div
          className="container-fluid mt-5 text-center"
          style={{ height: '45rem' }}
        >
          <br></br>
          <h1>Welcome to Unbank</h1>
          <h6>{this.state?.account ? `Account: ${this.state.account}` : 'Please connect your wallet'}</h6>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="deposit" id="uncontrolled-tab-example">
                  <Tab eventKey="deposit" title="Deposit">
                    <div>
                      <br />
                      How much you want to deposit?
                      <br />
                      (1 deposit is possible at the time)
                      <br />
                      <form onSubmit={this.handleSubmit}>
                        <div
                          className="form-group"
                          style={{ textAlign: 'left' }}
                        >
                          <label htmlFor="formGroupExampleInput">
                            Business Name
                          </label>
                          <input
                            onChange={this.handleChange}
                            type="text"
                            className="form-control"
                            name="businessName"
                            placeholder="Web Tacos"
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ textAlign: 'left' }}
                        >
                          <label htmlFor="formGroupExampleInput2">
                            ETH Amount
                          </label>
                          <input
                            onChange={this.handleChange}
                            name="EthAmount"
                            step="0.01"
                            type="number"
                            className="form-control"
                            placeholder="min. amount is 0.01 ETH"
                          />
                        </div>

                        <div
                          className="form-group"
                          style={{ textAlign: 'left' }}
                        >
                          <label htmlFor="formGroupExampleInput2">
                            Business Goal
                          </label>
                          <input
                            onChange={this.handleChange}
                            type="text"
                            className="form-control"
                            name="businessGoal"
                            placeholder="Saving for a new Margarita Mix for faster service"
                          />
                        </div>
                        <button className="btn btn-primary">Deposit </button>
                      </form>
                    </div>
                  </Tab>

                  <Tab eventKey="withdraw" title="Withdraw">
                    <div>
                      <br />
                      Do you want to withdraw + take interest?
                      <br />
                      <br />
                      <div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={(e) => this.withdraw(e)}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </Tab>

                  <Tab eventKey="token-Earned" title="Tokens-Earned">
                    <div>
                      <br />
                      Interest Earned on SVToken
                      <br />
                      <br />
                      <div>
                        <button type="submit" className="btn btn-primary">
                          {this.state.tokenBalance}
                        </button>
                      </div>
                    </div>
                  </Tab>

                  <Tab eventKey="borrow" title="Borrow">
                    <div>
                      <br />
                      Do you want to borrow tokens?
                      <br />
                      <br />
                      (You'll get 50% of collateral in Tokens)
                      <br />
                      <br />
                      Type collateral amount in ETH
                      <br />
                      <br />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          let amount = this.borrowAmount.value
                          amount = amount * 10 ** 18 //convert to wei
                          this.borrow(amount)
                        }}
                      >
                        <div className="form-group mr-sm2">
                          <input
                            id="borrowAmount"
                            step="0.01"
                            type="number"
                            ref={(input) => {
                              this.borrowAmount = input
                            }}
                            className="form-control"
                            placeholder="amount..."
                            required
                          />
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={(e) => this.withdraw(e)}
                          >
                            Borrow
                          </button>
                        </div>
                      </form>
                    </div>
                  </Tab>

                  <Tab eventKey="payOff" title="Payoff">
                    <div>
                      <br />
                      Do you want to pay off the loan?
                      <br />
                      <br />
                      (You'll receive your collateral -fee)
                      <div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={(e) => this.payOff(e)}
                        >
                          Payoff
                        </button>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="overview" title="overview">
                    <div>
                      <br />
                      Your Account Overview Updating
                      <br />
                      <br />
                      <div>
                        <br />
                        Metamask Wallet
                        <br />
                        <button type="submit" className="btn btn-primary">
                          {this.state.balance}
                        </button>
                        <br />
                        Earned Tokens
                        <br />
                        <button type="submit" className="btn btn-primary">
                          {this.state.tokenBalance}
                        </button>
                        <br />
                        Eth Deposited
                        <br />
                        <button type="submit" className="btn btn-primary">
                          {this.state.depositedBalance}
                        </button>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default Test
