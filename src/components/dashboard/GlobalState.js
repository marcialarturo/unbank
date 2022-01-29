import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import { genKeyPairFromSeed } from "skynet-js";
import { SkynetClient } from "skynet-js";

import { seedphase } from '../config';

const portal = 'https://siasky.net/';
const client = new SkynetClient(portal);
const { privateKey, publicKey } = genKeyPairFromSeed(seedphase);

const inititalState = {
  userID: "",
  mySky: null,
  contentRecord: null,
  privateKey: privateKey,
  publicKey: publicKey,
  clientSkyDB: client
}

export const GlobalContext = createContext(inititalState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, inititalState);

  function setUserID(userId){
    dispatch({
      type: "SET_USERID",
      payload: userId
    })
  }

  function setMySky(mySky){
    dispatch({
      type: "SET_MYSKY",
      payload: mySky
    })
  }

  function setContentRecord(contentRecord){
    dispatch({
      type: "SET_CONTENTRECORD",
      payload: contentRecord
    })
  }

  return (<GlobalContext.Provider value={{
    userID: state.userID,
    mySky: state.mySky,
    contentRecord: state.contentRecord,
    privateKey: state.privateKey,
    publicKey: state.publicKey,
    clientSkyDB: state.clientSkyDB,
    setUserID,
    setMySky,
    setContentRecord
  }}>
    {children}
  </GlobalContext.Provider>);
}
