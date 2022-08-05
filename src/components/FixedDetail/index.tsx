import SellIcon from '@mui/icons-material/Sell';
import { Grid, Stack, Typography } from '@mui/material';
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import React, { useEffect, useState } from "react";
import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";
import { getAccount, getProvider, MarketContract } from "../../utils/Web3Util";
import CountdownTimer from '../CountTimer';
import { TOKEN_ADDRESS, MARKET_ADDRESS } from "../../constants/addressed";
import { ethers } from "ethers";
import Token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import Market from "../../../contract/artifacts/contracts/Market.sol/Market.json";

const FixedDetail = (
    { tokenId }:
    { tokenId: string}) => {

    console.log("detaill11111111")

    const [detail, setDetail] = useState({
        isLoad: false,
        isOwner: false,
        owner: '',
        fixedPrice: '',
        fixedEndTime: 0
    });

    useEffect(() => {
        const init = async () => {
            let result = await MarketContract().getFixed(TOKEN_ADDRESS, tokenId);
            setDetail({
                isLoad: true,
                isOwner: (await getAccount()) == result[0],
                owner: result[0],
                fixedPrice: ethers.utils.formatEther(result[1]),
                fixedEndTime: result[2].toNumber()
            })
        }
        init();
    }, [tokenId]);

    const fixedCancel = async () => {
        const provider = await getProvider();
        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);
        contract.fixedRevoke(TOKEN_ADDRESS, tokenId);
    }

    const fixedBuy = async () => {
        const provider = await getProvider();
        
        if (await getAccount() == null) {
            return;
        }

        setDetail({
            ...detail,
            isOwner: (await getAccount()) == detail.owner
        })

        if (detail.isOwner) {
            alert(222222);
            return;
        }

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);
        contract.fixedPurchase(TOKEN_ADDRESS, tokenId, {value: detail.fixedPrice});
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}>
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'flex-start', display: 'flex' }}>
                        <Stack>
                            <Typography variant="subtitle1" noWrap>
                                CURRENT PRICE
                            </Typography>
                            <Typography variant="h4" noWrap>
                                <SvgIcon
                                    component={EthereumLogo}
                                    viewBox="0 0 400 426.6"
                                    titleAccess="ETH"
                                /><span>{detail.fixedPrice}</span>
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <Stack alignItems="flex-start">
                            <Typography variant="subtitle1" noWrap>
                                AUCTION ENDS IN
                            </Typography>
                            <Typography variant="h4" color="secondary" noWrap>
                                <CountdownTimer targetDate={detail.fixedEndTime} />
                            </Typography>
                        </Stack>
                    </Grid>

                    {
                        detail.isLoad ?
                            (detail.isOwner ?
                                (<Grid item lg={4} md={4}>
                                    <Button variant="contained" type="submit" color="primary" onClick={fixedCancel}
                                        startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}>
                                        Cancel
                                    </Button>
                                </Grid>) :
                                (<Grid item lg={4} md={4}>
                                    <Button variant="contained" type="submit" color="primary" onClick={fixedBuy}
                                        startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}>
                                        Buy
                                    </Button>
                                </Grid>)) : <></>
                    }

                </React.Fragment>
            </Grid>

        </React.Fragment>

    );
};

export default FixedDetail;