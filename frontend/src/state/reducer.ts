import { createReducer } from '@reduxjs/toolkit';
import { setAccount } from "./action";


export interface NftState {
    readonly account: string | undefined | null
}
  
const init: NftState = {
    account: null
}

export default createReducer<NftState>(init, (builder) => {
    builder
    .addCase(setAccount, (state, {payload: { account }}) => {
        return {
          ...state,
          account
        }
      })
    }
)