// Host enemies request source edits; this controller never changes occupancy.
export class BarricadeBreach {
 constructor(){this.enabled=false;this.next=0;this.hits=new Map();}
 tick({ids,slots,enemies,connected,playing,busy,now,reachable=()=>true}) {
  if(!this.enabled||!connected||!playing||busy)return null;
  for(const i of this.hits.keys())if(ids?.[i]!=='minecraft:oak_planks')this.hits.delete(i);
  if(now<this.next)return null;
  for(let i=0;i<slots.length;i++) {
   if(ids?.[i]!=='minecraft:oak_planks')continue;
   const p=slots[i];
   const enemy=enemies.find(e=>e.alive&&e.state==='COMBAT'&&!(e.stagger>0)&&Math.hypot(e.pos.x-(p.x+.5),e.pos.z-(p.z+.5))<1.7&&Math.abs(e.pos.y-p.y)<1.9&&reachable(e,p));
   if(!enemy)continue;
   this.next=now+1500;
   const hits=(this.hits.get(i)||0)+1;this.hits.set(i,hits>=3?0:hits);
   return {index:i,hits,breakRequested:hits>=3,enemy};
  }
  return null;
 }
}
