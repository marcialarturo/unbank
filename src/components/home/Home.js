import React from 'react'
import { StylesProvider, Container } from '@material-ui/core'
import './Home.css'
import Test from '../dashboard/Test'
import HomeImage from '../images/home.png'
import Crypto from '../images/Crypto-Bank-Work.png'

function home() {
  return (
    <StylesProvider injectFirst>
      <img src={HomeImage} alt="get started" className="get-started" />
      <Container>
        <Test />
      </Container>
      <img src={Crypto} alt="get started" className="crypto" />
    </StylesProvider>
  )
}

export default home
