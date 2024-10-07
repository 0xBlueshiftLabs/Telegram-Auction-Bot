import { Context } from "telegraf";
export interface CustomContext extends Context {
  privateKey?: string;
  address?: string;
}

export type MiddlewareFn = (
  ctx: CustomContext
) => CustomContext | Promise<CustomContext>;
export interface CommandContextExtn {
  /**
   * Matched command. This will always be the actual command, excluding preceeding slash and `@botname`
   *
   * Examples:
   * ```
   * /command abc -> command
   * /command@xyzbot abc -> command
   * ```
   */
  command: string;
  /**
   * The unparsed payload part of the command
   *
   * Examples:
   * ```
   * /command abc def -> "abc def"
   * /command "token1 token2" -> "\"token1 token2\""
   * ```
   */
  payload: string;
  /**
   * Command args parsed into an array.
   *
   * Examples:
   * ```
   * /command token1 token2 -> [ "token1", "token2" ]
   * /command "token1 token2" -> [ "token1 token2" ]
   * /command token1 "token2 token3" -> [ "token1" "token2 token3" ]
   * ```
   * @unstable Parser implementation might vary until considered stable
   * */
  args: string[];
}
