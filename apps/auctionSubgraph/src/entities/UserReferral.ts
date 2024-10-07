import { UserReferral } from "../../generated/schema";

export function getUserReferral(
  code: string,
): UserReferral {
  const id = code;
  let userReferral = UserReferral.load(id);
  if (!userReferral) {
    userReferral = new UserReferral(id);
    userReferral.save();
  }

  return userReferral as UserReferral;
}
