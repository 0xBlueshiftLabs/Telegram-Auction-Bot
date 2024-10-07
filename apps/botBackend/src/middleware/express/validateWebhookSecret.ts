export const validateWebhookSecret = (req,_,next) =>{

    const header = req.header("goldsky-webhook-secret");
    if (process.env.WEBHOOK_SECRET! !== header) {
      return next("Unauthorized");
    }
    
    next()
}