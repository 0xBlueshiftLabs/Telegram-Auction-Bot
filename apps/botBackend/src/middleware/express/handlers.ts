import { NextFunction, Request, Response } from "express"
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";

export const asyncHandler = (fn) => (req:Request, res:Response, next:NextFunction) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch((error)=>{
            next(error)
        });
};

export const errorHandler = (error:any,req:Request, res:Response, next:NextFunction) => {
    if(!error) next();
    console.log(error)
    if(typeof error === "string"){
        return res.status(400).json({error:error});
    }
    if(error.message && error.message!==""){
        return res.status(400).json({error:error.message});
    }
    else{
        const parsedEthersError = getParsedEthersError(error);
        return res.status(400).json({error:parsedEthersError.errorCode});
    }
};
