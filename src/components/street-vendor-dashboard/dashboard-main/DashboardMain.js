import React, { Component } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Link from '@material-ui/core/Link'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { mainListItems, secondaryListItems } from './ListItems'
import Chart from '../chart/Chart'
import Deposits from './Deposits'
import MetamaskWallet from './MetamaskWallet'
import TokensEarned from './TokensEarned'
import Orders from './Orders'
import Web3 from 'web3'
import Token from '../../../abis/Token.json'
import dBank from '../../../abis/dBank.json'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Street Vendor Token Inc,
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

class StreetVendorDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      tokenBalance: 0,
      dbank: null,
      walletBalance: 0,
      dBankAddress: null,
      open: true,
    }
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this)
    this.handleDrawerClose = this.handleDrawerClose.bind(this)
  }

  handleDrawerOpen() {
    this.setState({ open: true })
  }
  handleDrawerClose() {
    this.setState({ open: false })
  }

  async UNSAFE_componentWillMount() {
    const web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
    const netId = await web3.eth.net.getId()
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]

    if (typeof account !== 'undefined') {
      //check if account is detected, then load balance
      let walletBalance = await web3.eth.getBalance(account)
      walletBalance = web3.utils.fromWei(walletBalance)
      this.setState({ walletBalance, account })

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

        let tokenBalance = await token.methods.balanceOf(account).call()
        tokenBalance = web3.utils.fromWei(tokenBalance)

        let depositedBalance = await dbank.methods
          .etherBalanceOf(account)
          .call()

        depositedBalance = web3.utils.fromWei(depositedBalance)

        this.setState({ tokenBalance, depositedBalance })
      } catch (error) {
        console.log('error', error)
        window.alert('Contract not deployed to the current network')
      }
    } else {
      window.alert('Please Connect Your Wallet')
    }
  }

  render() {
    const classes = this.props.classes
    const fixedHeightPaper = this.props.fixedHeightPaper
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose,
            ),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            {this.state.open ? (
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            ) : (
              <IconButton onClick={this.handleDrawerOpen}>
                <MenuIcon />
              </IconButton>
            )}
          </div>

          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Deposits depositedBalance={this.state.depositedBalance} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <MetamaskWallet walletBalance={this.state.walletBalance} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <TokensEarned tokenBalance={this.state.tokenBalance} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Paper className={fixedHeightPaper}>{<Chart />}</Paper>
              </Grid>
              Recent Orders
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Orders tokenBalance={this.state.tokenBalance} />
                </Paper>
              </Grid>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    )
  }
}
// export default StreetVendorDashboard
export default ({ account }) => {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  return (
    <StreetVendorDashboard
      classes={classes}
      fixedHeightPaper={fixedHeightPaper}
      account={account}
    />
  )
}
