import { CustomContext, MiddlewareFn } from "../../types/context";
import { Markup, Telegraf } from "telegraf";
import { allActions } from ".";
import { InlineKeyboardButton } from "@telegraf/types";

type Hideable<B> = B & { hide?: boolean };
type HideableIKBtn = Hideable<InlineKeyboardButton>;
interface MenuModule {
  actionDisplay: string;
  action: string;
  handler: (ctx: CustomContext) => void;
  index: number;
  type: "webapp" | "callback";
  url?: "string";
  middleWare?: {
    before: any[];
    after: any[];
  };
  regexp?: string;
  excludeData?: boolean;
}

export async function openMenu(
  menuName: string,
  template: string,
  ctx: CustomContext,
  dataParams?: Record<string, any>,
  columns: number = 2
) {
  const buttons: HideableIKBtn[] = allActions[menuName].map(
    (module: MenuModule) => {
      let tempDataParams = dataParams ? { ...dataParams } : undefined;

      console.log(tempDataParams);

      if (module.excludeData === true) {
        tempDataParams = undefined;
      }
      if (Array.isArray(module.excludeData) && tempDataParams) {
        for (var index = 0; index < module.excludeData.length; index++) {
          if (tempDataParams[module.excludeData[index]]) {
            delete tempDataParams[module.excludeData[index]];
          }
        }
      }

      if (module.type === "callback") {
        return Markup.button.callback(
          module.actionDisplay,
          tempDataParams
            ? `${module.action}-${new URLSearchParams(
                tempDataParams
              ).toString()}`
            : module.action
        );
      }
      return Markup.button.webApp(
        module.actionDisplay,
        tempDataParams
          ? `${module.url}?${new URLSearchParams(
              tempDataParams
            ).toString()}&isBot=true`
          : `${module.url}?isBot=true`
      );
    }
  );

  return await ctx.replyWithHTML(
    template,
    Markup.inlineKeyboard(buttons, {
      columns,
    })
  );
}

async function executeBatchMiddleWare(
  ctx: CustomContext,
  middlewares?: MiddlewareFn[]
) {
  if (middlewares && middlewares.length > 0) {
    for (var index = 0; index < middlewares.length; index++) {
      if (middlewares[index]) ctx = await middlewares[index](ctx);
    }
  }
  return ctx;
}

export async function registerMenuActions(
  ctx: CustomContext,
  menuName: string,
  data: string
) {
  const allMenuActions = allActions[menuName].map((module: MenuModule) => {
    return {
      action: module.action,
      handler: module.handler,
      type: module.type,
      middleWare: module?.middleWare,
    };
  });

  for (const value of allMenuActions) {
    try {
      if (value.type === "callback") {
        if (!value.action)
          throw new Error("Regex has to be set for the callback handler");
        if (data.startsWith(value.action)) {
          let params: Record<string, any>;
          try {
            const check = data.replace(`${value.action}-`, "");
            if (check === data) {
              params = {};
            } else {
              params = Object.fromEntries(new URLSearchParams(`${check}`));
            }
          } catch (error) {
            console.log(error);
            params = {};
          }
          console.log("Action called", data, params);
          if (value?.middleWare?.before && value?.middleWare?.before.length) {
            ctx = await executeBatchMiddleWare(ctx, value?.middleWare?.before);
          }
          await value.handler(ctx, params);
          if (value?.middleWare?.after && value?.middleWare?.after.length) {
            ctx = await executeBatchMiddleWare(ctx, value?.middleWare?.after);
          }
        }
      }
    } catch (error) {
      console.log(error, "rere");
    }
  }
}
