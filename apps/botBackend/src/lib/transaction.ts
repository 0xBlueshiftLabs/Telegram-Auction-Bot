import { Markup, Telegraf } from "telegraf";

export async function answerWebAppQueryWithTx(
  bot: Telegraf,
  queryId: string,
  txHash: string | undefined,
  chainId: number,
  header: string,
  subText: string,
  actionDisplay: string,
  action: string
) {
  if (!txHash) throw new Error("Transaction hash is not defined");
  const button = Markup.button.webApp(
    "View Status",
    `${process.env.WEB_URL}/webApp/TransactionStatus?txHash=${txHash}&chainId=${chainId}&header=${header}&subText=${subText}&actionDisplay=${actionDisplay}&action=${action}`
  );

  await bot.telegram.answerWebAppQuery(queryId, {
    type: "article",
    id: "VIEW_TRANSACTION_REPLY",
    title: `Transaction ${txHash}`,
    /** Content of the message to be sent */
    input_message_content: {
      message_text: `Transaction submitted with hash : ${txHash}`,
    },
    reply_markup: { inline_keyboard: [[button]] },
  });
}
