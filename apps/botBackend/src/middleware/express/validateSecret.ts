export const validateSecret = (req,res,next) =>{
    const secret = req.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== process.env.SECRET_KEY!)
      return next("User not authorized");
    next()
}
