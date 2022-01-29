import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MailIcon from '@material-ui/icons/Mail'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'
import { StylesProvider } from '@material-ui/core/styles'
import logo from '../../images/logo.png'
import './Navbar.css'
import UAuth from '@uauth/js'

export const Navbar = withRouter(({ account, loadWeb3 }) => {
  const [userName, setUserName] = React.useState('')

  // Add unstoppable Domain
  const uauth = new UAuth({
    clientID: '9DRpt4k0BAOT/2PqUkza47sHGNvQ36geq9eNC4WcUts=',
    clientSecret: 'INoWQSIgTxE0Y5JbvDGZQ9dXQvojWvyu/oOGoz0qwy8=',
    redirectUri: 'https://unbank-businesses.netlify.app/callback',
  })
  const unstoppableLogin = async () => {
    try {
      const authorization = await uauth.loginWithPopup()
      console.log(authorization)
      const user = authorization.idToken.sub
      setUserName(user)
      console.log('authorization.idToken.sub', authorization.idToken.sub)
    } catch (error) {
      console.error(error)
    }
  }
  const unstoppableLogout = () => {
    console.log('logging out!')
    uauth.logout().catch((error) => {
      console.error('profile error:', error)
    })
    setUserName('')
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  return (
    <StylesProvider injectFirst>
      <div className="grow">
        <AppBar position="static">
          <Toolbar>
            <Link to="/" className="whiteLink">
              <img src={logo} alt="logo" className="logo" />
            </Link>
            <Link to="/" className="whiteLink">
              <Typography className="title" variant="h6" noWrap>
                Unbank
              </Typography>
            </Link>
            <Button className="whiteLink" component={Link} to="/">
              Home
            </Button>

            <Button className="whiteLink" component={Link} to="/dashboard">
              Dashboard
            </Button>

            <div className="grow" />
            <div className="sectionDesktop">
              {userName ? (
                <>
                  <Button
                    className="whiteLink"
                    to="/dashboard"
                    onClick={unstoppableLogout}
                  >
                    Logout
                  </Button>
                  <Button
                    variant="contained"
                    className="connected-btn"
                    style={{ backgroundColor: '#f9c74f', color: 'white' }}
                    endIcon={<RecordVoiceOverIcon />}
                  >
                    {userName}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  className="connect-wallet-btn"
                  onClick={unstoppableLogin}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </StylesProvider>
  )
})
