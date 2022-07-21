import { configureStore } from '@reduxjs/toolkit'
import state from './reducer'

const store = configureStore({
    reducer: {
        state
    }
})


export default store
export type AppDispatch = typeof store.dispatch