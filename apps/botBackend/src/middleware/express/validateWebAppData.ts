import cryptoJS from "crypto-js";

export const validateWebAppData = (req, _, next) => {
  const body = JSON.parse(req.body.toString("utf8"));
  const initData = body.initData;

  // The data is a query string, which is composed of a series of field-value pairs.
  const encoded = decodeURIComponent(initData);

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = cryptoJS.HmacSHA256(process.env.BOT_TOKEN!, "WebAppData");

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = cryptoJS.HmacSHA256(dataCheckString, secret).toString();

  // if hash are equal the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  if (_hash === hash) return next();

  return next("Client not authorized");
};
