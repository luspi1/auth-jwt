import {State} from "../../types/state.ts";
import {NameSpace} from "../../consts.ts";


export const isAuthUser = (state: State) => state[NameSpace.Auth].isAuth
export const authUser = (state: State) => state[NameSpace.Auth].currentUser
