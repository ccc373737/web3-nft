import React, { useState } from "react";
import SellIcon from '@mui/icons-material/Sell';
import LoadingButton from "@mui/lab/LoadingButton";
import { CardContent, FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import InputAdornment from "@mui/material/InputAdornment";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import { ethers } from "ethers";
import { change } from '../../api/tokenApi';
import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";
import { MARKET_ADDRESS, TOKEN_ADDRESS } from "../../constants/addressed";
import Market from "../../contracts/Market.sol/Market.json";
import { TokenStatus } from "../../pages/Item";
import { getProvider } from "../../utils/Web3Util";

const Auction = (
    { tokenId, isApproved, changeStatus }:
        { tokenId: string, isApproved: boolean, changeStatus: (status: TokenStatus) => void }) => {
    const [mode, setMode] = useState('fixed');
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
            contract.fixedStart(TOKEN_ADDRESS, tokenId,
                ethers.utils.parseEther(event.target.price.value),
                Date.parse(event.target.endTime.value) / 1000).then((resolve: any) => {
                    setLoad(true)
                }).catch((err: any) => {
                    console.log(err)
                })

            contract.on("FixedStart", (nftAddr, seller, tokenId, price, endTime, event) => {
                console.log(event);
                change(tokenId.toNumber())
                changeStatus(TokenStatus.FIXED_PRICE);
            });

        } else if (mode == "dutch") {
            contract.duAuctionStart(TOKEN_ADDRESS, tokenId,
                ethers.utils.parseEther(event.target.startPrice.value),
                ethers.utils.parseEther(event.target.floorPrice.value),
                Date.parse(event.target.endTime.value) / 1000).then((resolve: any) => {
                    setLoad(true)
                }).catch((err: any) => {
                    console.log(err)
                })

            contract.on("DutchAuctionStart", (nftAddr, seller, tokenId, price, floorPrice, endTime, event) => {
                console.log(event);
                change(tokenId.toNumber())
                changeStatus(TokenStatus.DUCTCH_AUCTION);
            });

        } else if (mode == "english") {
            contract.enAuctionStart(TOKEN_ADDRESS, tokenId,
                ethers.utils.parseEther(event.target.reservePrice.value),
                ethers.utils.parseEther(event.target.minimumAddPrice.value),
                Date.parse(event.target.endTime.value) / 1000).then((resolve: any) => {
                    setLoad(true)
                }).catch((err: any) => {
                    console.log(err)
                })

            contract.on("EnglishAuctionStart", (nftAddr, seller, tokenId, reservePrice, minimumAddPrice, endTime, event) => {
                console.log(event);
                change(tokenId.toNumber())
                changeStatus(TokenStatus.ENGLISH_AUCTION);
            });

        } else if (mode == "exchange") {
            contract.exchangeStart(TOKEN_ADDRESS, tokenId,
                Date.parse(event.target.endTime.value) / 1000).then((resolve: any) => {
                    setLoad(true)
                }).catch((err: any) => {
                    console.log(err)
                })

            contract.on("ExchangeAuctionStart", (nftAddr, seller, tokenId, event) => {
                console.log(event);
                change(tokenId.toNumber())
                changeStatus(TokenStatus.EXCHANGE_AUCTION);
            });
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
                            label="FloorPrice"
                            name="floorPrice"
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
        } else if (mode == "english") {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="ReservePrice"
                            name="reservePrice"
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
                            label="MinimumAddPrice"
                            name="minimumAddPrice"
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