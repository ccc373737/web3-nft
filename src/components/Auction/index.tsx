import store from '../../state';
import React, { useState, useEffect } from "react";

//import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { getProvider, getAccount } from "../../utils/Web3Util";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import {
    Box, Container, Grid, Typography, FormControl, FormLabel,
    Radio, RadioGroup, FormControlLabel, CardContent,
    Card, Chip, Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Badge, { BadgeProps } from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SellIcon from '@mui/icons-material/Sell';
import { TOKEN_ADDRESS, MARKET_ADDRESS } from "../../constants/addressed";
import { ethers } from "ethers";
import Token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import Market from "../../../contract/artifacts/contracts/Market.sol/Market.json";
import LoadingButton from "@mui/lab/LoadingButton";

const Auction = ({ tokenId, isApproved }: { tokenId: string, isApproved: boolean }) => {
    const [mode, setMode] = useState('');
    const [loading, setLoad] = useState(false);

    function handleModeChange(event: any) {
        setMode(event.target.value);
    }

    const sellClick = async (event: any) => {
        event.preventDefault();
        const provider = await getProvider();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        if (mode == "fixed") {
            contract.fixedStart(TOKEN_ADDRESS, tokenId, ethers.utils.parseEther(event.target.price.value), Date.parse(event.target.endTime.value)).then((resolve: any) => {
                setLoad(true)
            }).catch((err: any) => {
                console.log(err)
            })

            contract.on("fixedStart", (nftAddr, seller, tokenId, price, endTime, event) => {
                console.log(event);
                setLoad(false);
            });
        } else if (mode == "dutch") {
        } else if (mode == "dutch") {
        } else if (mode == "english") {
        }
    }

    const Mode = () => {
        if (mode == "fixed") {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="Price"
                            name="price"
                            type="number"
                            inputProps={{
                                step: 0.01,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="End Time"
                            name="endTime"
                            type="datetime-local"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </React.Fragment>
            )
        } else if (mode == "dutch") {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="StartPrice"
                            name="startPrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="FloorPrice"
                            name="floorPrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="End Time"
                            name="endTime"
                            type="datetime-local"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </React.Fragment>

            )
        } else if (mode == "english") {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="ReservePrice"
                            name="reservePrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="MinimumAddPrice"
                            name="minimumAddPrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="End Time"
                            name="endTime"
                            type="datetime-local"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </React.Fragment>)
        } else if (mode == "exchange") {
            return (<React.Fragment>
                <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                    <TextField
                        required
                        label="End Time"
                        name="endTime"
                        type="datetime-local"
                        sx={{ width: 250 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
            </React.Fragment>)
        }

        return (<React.Fragment></React.Fragment>)
    }

    return (
        <React.Fragment>
            {(
                <React.Fragment>
                    <CardContent>
                        <FormControl>
                            <RadioGroup value={mode} onChange={handleModeChange} name="sellMode" row >
                                <FormControlLabel value="fixed" disabled={!isApproved} control={<Radio color="primary" />} label="Fixed" />
                                <FormControlLabel value="dutch" disabled={!isApproved} control={<Radio color="secondary" />} label="DutchAuction" />
                                <FormControlLabel value="english" disabled={!isApproved} control={<Radio color="error" />} label="EnglishAuction" />
                                <FormControlLabel value="exchange" disabled={!isApproved} control={<Radio color="warning" />} label="ExchangeAuction" />
                            </RadioGroup>
                        </FormControl>
                    </CardContent>

                    <form onSubmit={sellClick}>

                        <Grid container spacing={2} sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}>
                            <Mode />

                            <Grid item lg={12} md={12} >
                                <LoadingButton variant="contained" type="submit" color="primary" disabled={!isApproved}
                                    startIcon={<SellIcon />} size="large" sx={{ borderRadius: 2 }}
                                    loading={loading}
                                    loadingPosition="start">
                                    Sell now
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </form>

                </React.Fragment>)}

        </React.Fragment>
    );
};

export default Auction;