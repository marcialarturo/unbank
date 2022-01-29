import React from 'react'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Title from './Title'

function preventDefault(event) {
  event.preventDefault()
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
})

export default function Deposits({ depositedBalance }) {
  const classes = useStyles()
  const objToday = new Date()
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const curMonth = months[objToday.getMonth()]
  const dayOfMonth = String(objToday.getDate()).padStart(2, '0')
  const curYear = objToday.getFullYear()

  var todaysDay = `${curMonth},  ${dayOfMonth} ${curYear}`

  return (
    <React.Fragment>
      <Title> Token Deposited</Title>
      <Typography component="p" variant="h4">
        {depositedBalance}
      </Typography>
      <p style={{ fontSize: '1rem' }}>Eth</p>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {todaysDay}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Details
        </Link>
      </div>
    </React.Fragment>
  )
}
