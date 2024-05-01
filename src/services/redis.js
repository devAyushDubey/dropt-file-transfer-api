import { createClient } from "redis";

const client = await createClient()
.on("error", (error) => { console.error(error); })
.connect();


export async function addAlias(alias, fileId) {
  await client.hSet('aliases', alias, fileId);
}

export async function aliasExists(alias) {
  return await client.hExists('aliases', alias);
}

export async function disconnectRedis() {
  await client.disconnect();
}
