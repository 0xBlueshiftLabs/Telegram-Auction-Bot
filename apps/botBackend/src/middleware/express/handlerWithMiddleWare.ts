import { Context } from 'aws-lambda';

export const asyncHandler = (middleWareFns:((event)=>void)[],fn:(event,context:Context)=>void) => async (event:any,context:Context)  =>   {
    try{
        for (const middleWare of middleWareFns){
            await middleWare(event)
         }
         await fn(event,context)
    }
    catch(error){
        console.log(error)
        // if(error.message && error.message!==""){
        //     return res.status(400).json({error:error.message});
        // }
        // else{
        //     const parsedEthersError = getParsedEthersError(error);
        //     return res.status(400).json({error:parsedEthersError.errorCode});
        // }
    }
};