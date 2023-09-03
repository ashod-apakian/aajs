

 function guiElementFromPoint (x,y,minzi,maxzi)
 {
 var e,el,grp,c,area,x1,y1,x2,y2,zi,zil,zmx,go;
 zmx=+9999999;
 el=gui_obj.handef.count;
 for(go=0;go<el;go++)
  {
  zil=-9999999;
  c=0;
  for(e=0;e<1000;e++)
   {
   if(c>=el) { break; }
   grp=gui_obj.handef.array[e];
   if(grp==null)        { continue; }
   if(grp.in_use!=true) { continue; }
   c++;
   zi=grp.dom.style.zIndex;
   if(zi>=10000) { continue; }
   if(zi>=zmx)   { continue; }
   if(zi<minzi)  { continue; }
   if(zi>maxzi)  { continue; }
   if(zi>zil)    { zil=zi; }
   }
  if(zil==-9999999) { break; }
  zmx=zil;
  //console.log(zmx);
  c=0;
  for(e=0;e<1000;e++)
   {
   if(c>=el) { break; }
   grp=gui_obj.handef.array[e];
   if(grp==null)        { continue; }
   if(grp.in_use!=true) { continue; }
   c++;
   zi=grp.dom.style.zIndex;
   if(zi!=zil) { continue; }
   if(grp.dom.style.display=="none") { continue; }
   area=aa.guiCssAreaGet(grp.han);
   x1=(area.left>>0);
   y1=(area.top>>0);
   x2=x1+(area.width>>0);
   y2=y1+(area.height>>0);
   if((x<x1)||(y<y1)) { continue; }
   if((x>x2)||(y>y2)) { continue; }
   //console.log(grp.id);
   return grp.han;
   }
  }
 return 0;
 }


