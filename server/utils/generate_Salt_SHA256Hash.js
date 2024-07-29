import { createHash } from "crypto";

export default function generate_Salt_SHA256Hash(password, salt)
{
  const passhash = createHash("sha256")
  .update(password)
  .update(createHash("sha256").update(salt, "utf8").digest("hex"))
  .digest("hex");

  return passhash
}