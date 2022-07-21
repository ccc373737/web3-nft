import { createAction } from '@reduxjs/toolkit'

export const setAccount = createAction<{ account: string | undefined | null}>('setAccount')
