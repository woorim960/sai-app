import { randomBytes } from "crypto";

const secret = randomBytes(32).toString("base64");
console.log("GROUP_SESSION_SECRET (Vercel Production에 등록):");
console.log(secret);
