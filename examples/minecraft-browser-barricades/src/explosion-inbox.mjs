// Reloads/restarted relays establish a fresh cursor; historical blasts are never replayed.
export class ExplosionInbox {
 constructor(){this.stream=null;this.cursor=0;}
 accept(batch,now=Date.now()){
  if(!batch||typeof batch.stream!=='string'||!Number.isSafeInteger(batch.latest)||!Array.isArray(batch.events))return [];
  if(this.stream!==batch.stream){this.stream=batch.stream;this.cursor=batch.latest;return [];}
  const fresh=[];
  for(const e of [...batch.events].sort((a,b)=>a.id-b.id)){
   if(!Number.isSafeInteger(e.id)||e.id<=this.cursor||e.id>batch.latest)continue;
   this.cursor=e.id;
   if(now-e.receivedAt>10000||now-e.receivedAt<0||e.source?.t!=='explosion'||e.source?.src!=='tnt'||!Array.isArray(e.hostPosition)||e.hostPosition.length!==3||!e.hostPosition.every(Number.isFinite))continue;
   fresh.push(e);
  }
  this.cursor=Math.max(this.cursor,batch.latest);return fresh;
 }
}
