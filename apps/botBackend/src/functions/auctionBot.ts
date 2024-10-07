import http from "serverless-http";
import { Telegraf } from "telegraf";
import express from "express";
import registerAllMenuActions from "../botInteractions/menus";
import { registerAllCommands } from "../botInteractions/commands";
import { validateSecret } from "../middleware/express/validateSecret";
import { validateWebAppData } from "../middleware/express/validateWebAppData";
import { privateKeyFromId } from "../middleware/bot/privateKey";
import createAuction from "../lib/createAuction";
import settleAuction from "../lib/settleAuction";
import cancelBids from "../lib/cancelBids";
import claimBids from "../lib/claimBids";
import placeBid from "../lib/placeBid";
import registerReferral from "../lib/registerReferral";
import claimReferralRewards from "../lib/claimReferralRewards";
import fetch from "node-fetch";
import {answerWebAppQueryWithTx} from "../lib/transaction"
import registerAuctionNotifications from "../lib/registerAuctionNotifications";
import cancelAuctionNotifications from "../lib/cancelAuctionNotifications"
import {validateWebhookSecret} from "../middleware/express/validateWebhookSecret"
import getAuctionNotificationDetails from "../lib/getAuctionNotificationDetails"
import notify from "../lib/notify"
import { errorHandler,asyncHandler } from "../middleware/express/handlers"
import cors from "cors"
import createToken from "../lib/createToken";


const CHAIN_ID = Number(process.env.CHAINID!);
declare var global: any;
global.fetch = fetch; //to prevent ethers webpack issue - https://github.com/ethers-io/ethers.js/issues/1312
const bot = new Telegraf(process.env.BOT_TOKEN!);
registerAllMenuActions(bot);
registerAllCommands(bot);
const app = express();

app.use(cors());

app.get("/", async (_, res) => {
  return res.status(200).json({
    message: "ok",
  });
});

app.post("/auctionBotHandler",validateSecret, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    await bot.handleUpdate(context);
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/getUserDetails",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {address} = await privateKeyFromId(context.userId);
    return res.status(200).json({
      account:address,
      chainId:process.env.CHAINID,
    });
}));

app.post("/auctionBotHandler/getPrivateKey",validateWebAppData, asyncHandler(async (req, res) => {
  const context = JSON.parse(req.body.toString("utf8"));
  const {privateKey} = await privateKeyFromId(context.userId);
  return res.status(200).json({
    privateKey
  });
}));

app.post("/auctionBotHandler/webAppReply",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    await bot.telegram.answerWebAppQuery(context.queryId,{
        type: "article",
        id: "VIEW_AUCTION_FROM_ID",
        title: `Auction ${context.auctionId}`,
        input_message_content: {
            message_text: `/auction ${context.auctionID}`,
        }
    })
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/createAuctionHandler",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {privateKey,address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    const txHash = await createAuction(context.auctionDetails,context.account,CHAIN_ID,privateKey);
    if(context.isMiniApp){
      return res.status(200).json({
        error: null,
        txHash,
        chainId:CHAIN_ID,
        header:`Create Auction`,
        subText:`Creating a new Auction`,
        actionDisplay:"Back to Menu",
        action:"start"
      });
    }
    else{
      await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Create Auction`,`Creating a new Auction`,"Back to Menu","start")
    }
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/settleAuctionHandler",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {privateKey,address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    const txHash = await settleAuction(context.auctionId,CHAIN_ID,privateKey);
    if(context.isMiniApp){
      return res.status(200).json({
        error: null,
        txHash,
        chainId:CHAIN_ID,
        header:`Settle Auction`,
        subText:`Settling Auction with ID : #${context.auctionId}`,
        actionDisplay:"Back to Menu",
        action:"start"
      });
    }
    else{
      await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Settle Auction`,`Settling Auction with ID : #${context.auctionId}`,"Back to Menu","start")
    }
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/cancelBidHandler",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {privateKey,address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    const txHash = await cancelBids(context.sellOrders,context.auctionId,privateKey,CHAIN_ID);
    if(context.isMiniApp){
      return res.status(200).json({
        error: null,
        txHash,
        chainId:CHAIN_ID,
        header:`Cancel Order(s)`,
        subText:`Cancelling your sell orders`,
        actionDisplay:"Back to Menu",
        action:"start"
      });
    }
    else{
      await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Cancel Order(s)`,`Cancelling your sell orders`,"Back to Menu","start")
    }
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/claimBidHandler",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {privateKey,address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    const txHash = await claimBids(context.sellOrders,context.auctionId,privateKey,CHAIN_ID);
    if(context.isMiniApp){
      return res.status(200).json({
        error: null,
        txHash,
        chainId:CHAIN_ID,
        header:`Claim Bid(s)`,
        subText:`Claiming your bids`,
        actionDisplay:"Back to Menu",
        action:"start"
      });
    }
    else{
      await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Claim Bid(s)`,`Claiming your bids`,"Back to Menu","start")
    }
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/placeBidHandler",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {privateKey,address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    const txHash = await placeBid(context.placeBidDetails,context.biddingToken,address,CHAIN_ID,privateKey);
    if(context.isMiniApp){
      return res.status(200).json({
        error: null,
        txHash,
        chainId:CHAIN_ID,
        header:`Place Bid`,
        subText:`Placing your bid`,
        actionDisplay:"Back to Menu",
        action:"start"
      });
    }
    else{
      await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Place Bid`,`Placing your bid`,"Back to Menu","start")
    }
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/registerReferralCode",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {privateKey,address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    const txHash = await registerReferral(context.referralCode,CHAIN_ID,privateKey);
    if(context.isMiniApp){
      return res.status(200).json({
        error: null,
        txHash,
        chainId:CHAIN_ID,
        header:`Register Referral`,
        subText:`Registering Referral ID`,
        actionDisplay:"Back to Menu",
        action:"start"
      });
    }
    else{
      await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Register Referral`,`Registering Referral ID`,"Back to Menu","start")
    }
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/claimReferralRewards",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {privateKey,address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    const txHash = await claimReferralRewards(context.amount,context.token,CHAIN_ID,privateKey);
    if(context.isMiniApp){
      return res.status(200).json({
        error: null,
        txHash,
        chainId:CHAIN_ID,
        header:`Claim Referral Rewards`,
        subText:`Claiming Rewards`,
        actionDisplay:"Back to Menu",
        action:"start"
      });
    }
    else{
      await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Register Referral`,`Registering Referral ID`,"Back to Menu","start")
    }
    return res.status(200).json({
      error: null,
    });
}));

app.get("/auctionBotHandler/auctionNotificationDetails", asyncHandler(async (req, res) => {
    const result = await getAuctionNotificationDetails(req.query['auctionId'] as string);
    return res.status(200).json(result);
}));

app.post("/auctionBotHandler/registerAuctionNotifications",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {address} = await privateKeyFromId(context.userId);
    if(context.account.toLowerCase() !== address.toLowerCase()) throw new Error("Client provided altered data");
    await registerAuctionNotifications(context.auctionId,context.chatId,address,CHAIN_ID,bot.telegram,context.userId);
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/cancelAuctionNotifications",validateWebAppData, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {address} = await privateKeyFromId(context.userId);
    if(context.account !== address) throw new Error("Client provided altered data");
    await cancelAuctionNotifications(context.auctionId,address,CHAIN_ID);
    return res.status(200).json({
      error: null,
    });
}));

app.post("/auctionBotHandler/notifyWebhook",validateWebhookSecret, asyncHandler(async (req, res) => {
    const context = JSON.parse(req.body.toString("utf8"));
    const {op, data: {new:newRecord}} = context;
    if (op !== "INSERT") return res.status(200).json({}); //only display notifications when a new sell order is created
    await notify(newRecord,bot.telegram,Number(process.env.CHAINID!))
    return res.status(200).json({
      error: null,
    });
}));


app.post(
  "/auctionBotHandler/createTokenHandler",
  validateWebAppData,
  asyncHandler(async (req, res) => {
      const context = JSON.parse(req.body.toString("utf8"));
      const { name, symbol, supply } = context?.stageParams;

      const { address,privateKey } = await privateKeyFromId(context.userId);

      if (context.account !== address)
        throw new Error("Client provided altered data");

      const {hash:txHash,address:tokenAddress} = await createToken(name, symbol, supply, privateKey,Number(context.chainId));

      if(context.isMiniApp){
        return res.status(200).json({
          error: null,
          txHash,
          chainId:CHAIN_ID,
          header:`Create Token`,
          subText:`Creating a Token`,
          actionDisplay:"Back to Menu",
          action:"start"
        });
      }
      else{
        await answerWebAppQueryWithTx(bot,context.queryId,txHash,CHAIN_ID,`Create Token`,`Creating a Token with address ${tokenAddress}`,"Back to Menu","start")
      }
      return res.status(200).json({
        error: null,
      });
  })
);

app.use(errorHandler)

app.use((_, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = http(app);
