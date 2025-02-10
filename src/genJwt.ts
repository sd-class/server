import { SignJWT, generateKeyPair } from "jose";

// 生成 RSA 密钥对
const { privateKey, publicKey } = await generateKeyPair("RS256");

const jwt = await new SignJWT({ user_id: "123" })
  .setProtectedHeader({ alg: "RS256" })
  .setSubject("login")
  .setIssuer("trpure-class")
  .setIssuedAt()
  .setExpirationTime("2h")
  .sign(privateKey);

console.log(jwt);
