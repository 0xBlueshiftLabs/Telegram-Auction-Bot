export function parseEthersError(code:string){

    switch(code){

        case "INSUFFICIENT_FUNDS_FOR_GAS":{
            return "User does not have enough funds for gas"
        }
    }

}