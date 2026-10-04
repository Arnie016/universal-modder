// One-metre cells, independent of the host's two-metre navigation grid.
export const slots = Array.from({length:8}, (_,i)=>({x:10+(i%2),y:Math.floor(i/4),z:14+(Math.floor(i/2)%2)}));
export class BlockGeometry {
  constructor(){this.cells=[];this.revision=0;this.signature='';}
  replace(ids){
    if(!Array.isArray(ids)||ids.length!==8||ids.some(v=>typeof v!=='string'||v==='unavailable'))throw Error('Incomplete source snapshot');
    const signature=ids.join('|'); if(signature===this.signature)return false;
    this.signature=signature;this.cells=slots.filter((_,i)=>!['minecraft:air','minecraft:cave_air','minecraft:void_air'].includes(ids[i]));this.revision++;return true;
  }
  ray(o,d,max){let best=max;for(const b of this.cells){let lo=0,hi=best;for(const k of ['x','y','z']){if(Math.abs(d[k])<1e-9){if(o[k]<b[k]||o[k]>b[k]+1){hi=-1;break;}}else{let a=(b[k]-o[k])/d[k],c=(b[k]+1-o[k])/d[k];if(a>c)[a,c]=[c,a];lo=Math.max(lo,a);hi=Math.min(hi,c);}}if(hi>=lo&&hi>=0)best=Math.min(best,lo);}return best;}
  blocksCell(cx,cz){return this.cells.some(b=>b.y<1.8&&b.y+1>0&&Math.floor(b.x/2)===cx&&Math.floor(b.z/2)===cz);}
  collide(p,r,height=1.8){for(const b of this.cells){if(p.y+height<=b.y||p.y>=b.y+1)continue;const nx=Math.max(b.x,Math.min(p.x,b.x+1)),nz=Math.max(b.z,Math.min(p.z,b.z+1));let dx=p.x-nx,dz=p.z-nz,dist=Math.hypot(dx,dz);if(dist>=r)continue;if(dist<1e-8){const sides=[p.x-b.x,b.x+1-p.x,p.z-b.z,b.z+1-p.z],n=sides.indexOf(Math.min(...sides));if(n===0)p.x=b.x-r;if(n===1)p.x=b.x+1+r;if(n===2)p.z=b.z-r;if(n===3)p.z=b.z+1+r;}else{p.x=nx+dx/dist*r;p.z=nz+dz/dist*r;}}}
}
export const bridgeGeometry=new BlockGeometry();
