import { ethers } from "ethers";
import store from '../state';
import { setAccount } from "../state/action";
import { TOKEN_ADDRESS, MARKET_ADDRESS } from "../constants/addressed";
import Token from "../../contract/artifacts/contracts/Token.sol/Token.json";
import Market from "../../contract/artifacts/contracts/Market.sol/Market.json";
import { Contract } from "@ethersproject/contracts";


declare let window: any;

export const getProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const accounts = await provider.listAccounts();
    // console.log(accounts)
    // store.dispatch(setAccount({ account: accounts[0] }))
    let account;
    if (accounts.length == 0) {
        await provider.send("eth_requestAccounts", []).then((result) => {
            account = result[0];
        })
    } else {
        account = accounts[0];
    }

    store.dispatch(setAccount({ account: accounts[0] }))

    return provider;
}

export const getAccount = async () => {
    if (store.getState().state.account == null) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            store.dispatch(setAccount({ account: accounts[0] }))
        }
    }

    return store.getState().state.account;
}

export const TokenContract = () => {
    const contractProvider = ethers.providers.getDefaultProvider('ropsten');
    const abi = Token.abi;

    return new ethers.Contract(TOKEN_ADDRESS, abi, contractProvider);
}


export const MarketContract = (): Contract  => {
    const contractProvider = ethers.providers.getDefaultProvider('ropsten');
    const abi = Market.abi;

    return new ethers.Contract(MARKET_ADDRESS, abi, contractProvider);
}



