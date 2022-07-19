import React from "react";
import '../../style/Global.css'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";


import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Button from '@mui/material/Button';
import useScrollTrigger from "@mui/material/useScrollTrigger";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import logo from '../../assets/Logo.svg';

const Header = () => {
  //const account = useSelector((state) => state.allNft.account);

  return (
    <React.Fragment>
      <CssBaseline />
      
      <AppBar className="header" position="relative">
        <Toolbar variant="dense">
          <Link to="/">
            <img src={logo} alt="Galerie" className="logo"/>
          </Link>
          {/* <div className={classes.account}>
            <AccountBalanceWalletIcon titleAccess="Wallet Address" className={classes.walletIcon}/>
            <Typography variant="subtitle1">{account.slice(0,7)}...{account.slice(-4)}</Typography>
          </div> */}
        </Toolbar>

        {/* <button className="square" >
        </button> */}
      </AppBar>
    </React.Fragment>
    
  );
};

export default Header;
