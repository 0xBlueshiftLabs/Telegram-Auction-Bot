import { KMSClient, GenerateMacCommand } from "@aws-sdk/client-kms";
import { ethers } from "ethers";
import { CustomContext, MiddlewareFn } from "../../types/context";

const encoder = new TextEncoder();

const client = new KMSClient();

const isLambda = process.env.STAGE !=="dev";

export const privateKeyMiddleware: MiddlewareFn = async (
  ctx: CustomContext
) => {
  let privateKey;
  let address;
  if (!ctx) throw new Error("Ctx is missing.");
  if (!ctx.from?.id)
    throw new Error("Client message has to come from telegram");
  if (!isLambda) {
    privateKey = process.env.PRIVATE_KEY!;

    address = ethers.utils.computeAddress(privateKey);
  } else {
    const input = {
      KeyId: process.env.KMS_KEY_ID,
      MacAlgorithm: "HMAC_SHA_256",
      Message: encoder.encode(ctx.from.id.toString()),
    };

    const command = new GenerateMacCommand(input);

    const result = await client.send(command);
    if (!result.Mac) throw new Error("Error retrieving user private key");

    privateKey = `0x${Buffer.from(result.Mac).toString("hex")}`;

    address = ethers.utils.computeAddress(privateKey);
  }

  ctx.privateKey = privateKey;
  ctx.address = address;

  return ctx;
};

export const privateKeyFromId = async (userId: number) => {
  if (!userId) throw new Error("Invalid user id");
  let privateKey;
  let address;
  if (!isLambda) {
    privateKey = process.env.PRIVATE_KEY!;

    address = ethers.utils.computeAddress(privateKey);
  } else {
    const input = {
      KeyId: process.env.KMS_KEY_ID,
      MacAlgorithm: "HMAC_SHA_256",
      Message: encoder.encode(userId.toString()),
    };

    const command = new GenerateMacCommand(input);

    const result = await client.send(command);
    if (!result.Mac) throw new Error("Error retrieving user private key");

    privateKey = `0x${Buffer.from(result.Mac).toString("hex")}`;

    address = ethers.utils.computeAddress(privateKey);
  }

  return {
    privateKey,
    address,
  };
};
