//'use strict';

var aa=(function()
 {
 var   handle_obj={};
 var    debug_obj={};
 var  promise_obj={};
 var    timer_obj={};
 var      num_obj={};
 var     data_obj={};
 var   string_obj={};
 var      env_obj={};
 var    queue_obj={};
 var    touch_obj={};
 var    mouse_obj={};
 var keyboard_obj={};
 var  storage_obj={};
 var      gui_obj={};
 var    media_obj={};
 var   socket_obj={};
 var     room_obj={};
 var      dsp_obj={};
 var    bitio_obj={};
 var      rtc_obj={};
 var     main_obj={};


 navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||
 navigator.mozGetUserMedia||navigator.msGetUserMedia||window.RTCPeerConnection;

/*-----------------------------------------------------------------------*/



 handleObjInit();
 debugObjInit();
 promiseObjInit();
 timerObjInit();
 numObjInit();
 dataObjInit();
 stringObjInit();
 envObjInit();
 queueObjInit();
 touchObjInit();
 mouseObjInit();
 keyboardObjInit();
 storageObjInit();
 guiObjInit();
 mediaObjInit();
 socketObjInit();
 roomObjInit();
 dspObjInit();
 bitioObjInit();
 rtcObjInit();
 mainObjInit();



/*-----------------------------------------------------------------------*/



 function handleObjInit ()
 {
 var state;
 if(Object.keys(handle_obj).length!=0) { return; }
 state={};
 state.handle_base=1000000;
 state.handle_array=[];
 handle_obj.state=state;
 handle_obj.is_init=true;
 }





 function handleDefine (type,slots)
 {
 var i,obj,ths;

 ths={};
 ths.base=handle_obj.state.handle_base;
 ths.type=type;
 ths.slots=slots;
 ths.count=0;
 ths.pf=0;
 ths.array=[];
 for(i=0;i<ths.slots;i++)
  {
  obj={};
  obj.in_use=false;
  obj.self_index=i;
  obj.self_handle=obj.self_index+ths.base;
  ths.array[i]=obj;
  }
 handle_obj.state.handle_array.push(ths);
 handle_obj.state.handle_base+=1000000;
 return ths;
 }




 function handleCheck (handef,handle)
 {
 var obj;

 if(isNaN(handle)) { return null; }
 if(handle<handef.base) { return null; }
 handle=handle-handef.base;
 if(handle>=handef.slots) { return null; }
 obj=handef.array[handle];
 if(obj.in_use!=true) { return null; }
 return obj;
 }





 function handleReset (handef,handle)
 {
 var obj,idx,iu;

 if((obj=handleCheck(handef,handle))==null) { return false; }
 idx=handle-handef.base;
 iu=obj.in_use;
 obj={};
 obj.in_use=false;
 obj.self_index=idx;
 obj.self_handle=obj.self_index+handef.base;
 handef.array[idx]=obj;
 if(iu==true) {  handef.count--; }
 return true;
 }




 function handleGet (handef,index)
 {
 var obj,han;

 if(index<0||index>=handef.slots) { return 0; }
 obj=handef.array[index];
 if(obj.in_use!=true) { return 0; }
 han=index+handef.base;
 return han;
 }




 function handleUse (handef,index)
 {
 var obj,han;

 if(index<0||index>=handef.slots) { return 0; }
 obj=handef.array[index];
 if(obj.in_use!=false) { return 0; }
 obj.in_use=true;
 handef.array[index]=obj;
 handef.count++;
 han=index+handef.base;
 return han;
 }




 function handleRemove (handef,handle)
 {
 var obj,idx;

 if((obj=handleCheck(handef,handle))==null) { return false; }
 idx=obj.self_index;
 return(handleReset(handef,handle));
 }





 function handleNext (handef)
 {
 var idx;

 handef.pf++;
 if(handef.pf>=handef.slots) { handef.pf=0; }
 idx=handef.pf;
 return(handleGet(handef,idx));
 }




 function handleText (handle)
 {
 var i,hd,str,ix,obj;

 for(i=0;i<handle_obj.state.handle_array.length;i++)
  {
  hd=handle_obj.state.handle_array[i];
  if(handle>=hd.base&&handle<(hd.base+hd.slots))
   {
   ix=handle-hd.base;
   obj=hd.array[ix];
   str=hd.type+" index="+ix+" in_use="+obj.in_use;
   return str;
   }
  }
 return null;
 }



 function handleGlobalDump ()
 {
 var i,ths;

 for(i=0;i<handle_obj.state.handle_array.length;i++)
  {
  ths=handle_obj.state.handle_array[i];
  if(ths.count==0) { continue; }
  //aa.debugLog(" base="+ths.base+" usage="+ths.count+" of "+ths.slots+"  "+ths.type);
  console.log(" base="+ths.base+" usage="+ths.count+" of "+ths.slots+"  "+ths.type);
  }
 }




 function handleGlobalKill ()
 {
 var i,ths,h,obj,han;

 for(h=0;h<handle_obj.state.handle_array.length;h++)
  {
  ths=handle_obj.state.handle_array[h];
  //console.log(">> base="+ths.base+" usage="+ths.count+" of "+ths.slots+"  "+ths.type);
  for(i=0;i<ths.slots;i++)
   {
   if(ths.count==0) { continue; }
   obj=ths.array[i];
   if(obj.in_use!=true) { continue; }
   han=obj.self_handle;
   ///console.log(">> base="+ths.base+" usage="+ths.count+" of "+ths.slots+"  "+ths.type+" "+i+" "+ths.slots+" "+obj.self_index+" "+han);
   switch(ths.type)
    {
    case "gui":
    aa.guiDestroy(han);
    break;
    }
   }
  //aa.debugLog(" base="+ths.base+" usage="+ths.count+" of "+ths.slots+"  "+ths.type);
  }
 }


/*-----------------------------------------------------------------------*/




 function debugObjInit ()
 {
 if(Object.keys(debug_obj).length!=0) { return; }
 debug_obj.is_init=true;
 }




 function debugLineNumber ()
 {
 var ln,e,stack,frame,frameRE;
 e=new Error();
 if(!e.stack)
 try       { throw e;  }
 catch(e)  { if(!e.stack) {  return 0;  } }
 stack=e.stack.toString().split(/\r\n|\n/);
 frameRE=/:(\d+):(?:\d+)[^\d]*$/;
 do { frame=stack.shift();  } while (!frameRE.exec(frame)&&stack.length);
 ln=parseInt(frameRE.exec(stack.shift())[1]);
 return ln;
 }



 function debugFunctionName ()
 {
 var caller,stack,fn,fnRE;
 fnRE=/function\s*([\w\-$]+)?\s*\(/i;
 caller=arguments.callee.caller;
 stack="";
 while(caller)
  {
  fn=fnRE.test(caller.toString())?RegExp.$1||"{?}":"{?}";
  stack=fn;
  break;
  };
 return stack;
 }



 function debugStackUsage ()
 {
 var caller,stack,fn,fnRE;
 fnRE=/function\s*([\w\-$]+)?\s*\(/i;
 caller=arguments.callee.caller;
 stack=0;
 while(caller)
  {
  fn=fnRE.test(caller.toString())?RegExp.$1||"{?}":"{?}";
  stack++;
  caller=caller.arguments.callee.caller;
  };
 return stack;
 }


 function debugStackGet (index)
 {
 var caller,stack,fn,fnRE,i;
 fnRE=/function\s*([\w\-$]+)?\s*\(/i;
 caller=arguments.callee.caller;
 stack="";
 i=0;
 while(caller)
  {
  fn=fnRE.test(caller.toString())?RegExp.$1||"{?}":"{?}";
  stack=fn;
  caller=caller.arguments.callee.caller;
  if(i>=index) { break; }
  i++;
  };
 return stack;
 }




 function debugAlert (txt)
 {
 var ln,e,stack,frame,frameRE;
 e=new Error();
 if(!e.stack)
 try       { throw e;  }
 catch(e)  { if(!e.stack) {  return false;  } }
 stack=e.stack.toString().split(/\r\n|\n/);
 frameRE=/:(\d+):(?:\d+)[^\d]*$/;
 do { frame=stack.shift();  } while (!frameRE.exec(frame)&&stack.length);
 ln=parseInt(frameRE.exec(stack.shift())[1]);
 txt+="\n";
 txt+="line: ";
 txt+=ln;
 txt+="\n";
 txt+="msrunning: ";
 txt+=timerMsRunning();
 txt+="\n";
 txt+="stage: ";
 txt+=aa.main_state.stage;
 alert(txt);
 return true;
 }



 function debugLog (...params)
 {
 setTimeout(console.log.bind(console,...params),0);
 }



 function debugMemoryUsage ()
 {
 var supported,obj;

 supported=false;
 obj={};
 try   { if(performance.memory) { supported=true; }  }
 catch { }
 if(supported==true)
  {
  obj.heap_limit=performance.memory.jsHeapSizeLimit;
  obj.heap_size=performance.memory.totalJSHeapSize;
  obj.heap_used=performance.memory.usedJSHeapSize;
  obj.heap_limit_kb=parseInt(obj.heap_limit/1024.0);
  obj.heap_size_kb=parseInt(obj.heap_size/1024.0);
  obj.heap_used_kb=parseInt(obj.heap_used/1024.0);
  }
 else
  {
  obj.heap_limit=0;
  obj.heap_size=0;
  obj.heap_used=0;
  obj.heap_limit_kb=0
  obj.heap_size_kb=0
  obj.heap_used_kb=0
  }
 return obj;
 }



/*-----------------------------------------------------------------------*/



 function promiseObjInit ()
 {
 if(Object.keys(promise_obj).length!=0) { return; }
 promise_obj.handef=handleDefine("promise",128);
 promise_obj.is_init=true;
 }





 function promiseCreate (nativepromise)
 {
 var i,h,obj,ispending,isrejected,isfullfilled,result;

 for(i=0;i<promise_obj.handef.slots;i++)
  {
  obj=promise_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  h=handleUse(promise_obj.handef,i)
  obj.vars={};
  obj.vars.native_promise=nativepromise;
  obj.vars.ispending=true;
  obj.vars.isrejected=false;
  obj.vars.isfullfilled=false;
  obj.vars.val=null;
  obj.vars.err=null;
  obj.vars.result=obj.vars.native_promise.then(
   function(v) { obj.vars.isfullfilled=true;   obj.vars.ispending=false; obj.vars.val=v;  return v;  },
   function(e) { obj.vars.isrejected=true;     obj.vars.ispending=false; obj.vars.err=e;  throw e;    });
  obj.vars.result.val=function()          {  return obj.vars.val;         }
  obj.vars.result.err=function()          {  return obj.vars.err;         }
  obj.vars.result.isFullfilled=function() {  return obj.vars.isfullfilled; };
  obj.vars.result.isPending=function()    {  return obj.vars.ispending;   };
  obj.vars.result.isRejected=function()   {  return obj.vars.isrejected;  };
  return h;
  }
 return 0;
 }




 function promiseDestroy (handle)
 {
 var obj;

 if((obj=handleCheck(promise_obj.handef,handle))==null) { return false; }
 obj.vars={};
 handleRemove(promise_obj.handef,handle);
 return true;
 }




 function promiseGet (handle)
 {
 return(handleCheck(promise_obj.handef,handle));
 }




 function promiseStatus (handle)
 {
 var obj,status;

 if((obj=promiseGet(handle))==null) { return null; }
 status={};
 status.state=0;
 status.native_promise=obj.vars.native_promise;
 status.result=obj.vars.result;
 status.val=obj.vars.result.val();
 status.err=obj.vars.result.err();
 if(obj.vars.result.isFullfilled()) { status.state=1;  }
 if(obj.vars.result.isPending())    { status.state=2;  }
 if(obj.vars.result.isRejected())   { status.state=-1; }
 return status;
 }




/*-----------------------------------------------------------------------*/




 function timerObjInit ()
 {
 if(Object.keys(timer_obj).length!=0) { return; }
 timer_obj.msec_base=new Date().valueOf();
 if("performance" in window)  {  timer_obj.perf_base=performance.now();  }
 else                         {  timer_obj.perf_base=new Date().valueOf();  }
 timer_obj.is_init=true;
 }




 function timerTikNow (useperf)
 {
 var t;
 if(useperf)
  {
  if("performance" in window)   {   t=performance.now()-timer_obj.perf_base;   }
  else                          {   t=new Date().valueOf()-timer_obj.msec_base;   }
  }
 else
  {
  t=new Date().valueOf()-timer_obj.msec_base;
  }
 return t;
 }



 function timerTikElapsed (useperf,tik)
 {
 return(timerTikNow(useperf)-tik);
 }



 function timerMsRunning ()
 {
 return(timerTikNow(false));
 }



 function timerMicroRunning ()
 {
 return(timerTikNow(true));
 }






 function timerTimeoutSet (to)
 {
 var tmo={};
 tmo.type='timeout';
 tmo.ms=aa.timerMsRunning();
 tmo.el=0;
 tmo.to=to;
 return tmo;
 }


 function timerTimeoutReset (tmo,newto)
 {
 tmo.ms=aa.timerMsRunning();
 tmo.el=0;
 if(arguments.length==2) { tmo.to=newto;  }
 return tmo;
 }



 function timerTimeoutTest (tmo)
 {
 tmo.el=aa.timerMsRunning()-tmo.ms;
 if(tmo.el>=tmo.to) { return true; }
 return false;
 }



 function timerRaterInit ()
 {
 var obj;
 obj={};
 obj.type="rater";
 obj.started=false;
 obj.tik=timerTikNow(true);
 obj.elapsed=0;
 obj.hits=0;
 obj.hz=0;
 return obj;
 }


 function timerRaterUpdate (obj,hits)
 {
 if(obj.type!="rater") { return null; }
 if(obj.started==false)
  {
  obj.started=true;
  obj.tik=timerTikNow(true);
  }
 obj.hits+=hits;
 obj.elapsed=timerTikElapsed(true,obj.tik);
 obj.hz=obj.hits/(obj.elapsed/1000);
 return obj;
 }






/*-----------------------------------------------------------------------*/



 function numObjInit ()
 {
 if(Object.keys(num_obj).length!=0) { return; }
 num_obj.is_init=true;
 }




 function numRand (max)
 {
 var val=Math.floor(Math.random()*Math.floor(max));
 return parseInt(val%max);
 }



 function numFixed (numb,places)
 {
 return numb.toFixed(places);
 }



 function numPercentOf (numb,tot)
 {
 return(tot/100)*numb;
 }



 function numPercentIs (numb,tot)
 {
 return(100.0/tot)*numb;
 }




 function numPad(numb,width,z)
 {
 z=z||'0';
 numb=numb+'';
 return numb.length>=width?numb:new Array(width-numb.length +1).join(z)+numb;
 }




 function numIntToHex(intg)
 {
 var code;
 code=Math.round(intg).toString(16);
 (code.length>1)||(code='0'+code);
 return code;
 }



 function numRound(numb,precision)
 {
 return Number.parseFloat(numb).toPrecision(precision+1);
 }




 function numFloatFormat (numb,wholewid,pad,isps,fracwid)
 {
 var n,arr,txt;

 n=numFixed(parseFloat(numb),fracwid);
 arr=n.toString().split(".");
 if(isps)  {  arr[0]=arr[0].padStart(wholewid,pad);  }
 else      {  arr[0]=arr[0].padEnd(wholewid,pad);  }
 if(fracwid>0) { txt=arr[0]+"."+arr[1] }
 else          { txt=arr[0]; }
 return txt;
 }



/*-----------------------------------------------------------------------*/




 function dataObjInit ()
 {
 if(Object.keys(data_obj).length!=0) { return; }
 data_obj.is_init=true;
 }



 function dataArray2DCreate (rows)
 {
 var i,arr;

 if(data_obj.is_init!=true) { return null; }
 arr=[];
 for(i=0;i<rows;i++) { arr[i]=[];}
 return arr;
 }




 function dataObjectApxSize (object)
 {
 var objectList,stack,bytes,value,i;

 if(data_obj.is_init!=true) { return 0; }
 objectList=[];
 stack=[object];
 bytes=0;
 while(stack.length)
  {
  value=stack.pop();
  if(typeof value==='boolean') { bytes+=4;              }        else
  if(typeof value==='string')  { bytes+=value.length*2; }        else
  if(typeof value==='number')  { bytes+=8;              }        else
  if(typeof value==='object'&&objectList.indexOf(value)===-1)
   {
   objectList.push(value);
   for(i in value) {  stack.push(value[i]);    }
   }
  }
 return bytes;
 }



 function dataGlobalExists (varname)
 {
 const globalEval=eval;
 try  {  globalEval(varname);  return true;  }
 catch (e)  {  return false;  }
 return null;
 }



 function dataGlobalPropertiesGet (prefix)
 {
 var keyValues,global;

 keyValues=[];
 global=window;
 for(var prop in global)
  {
  if(prop.indexOf(prefix)==0)
   {
   keyValues.push(prop+"="+global[prop]);
   }
  }
 return keyValues.join('&');
 }




 function dataObjectIsEmpty (obj)
 {
 for(var prop in obj) { if(obj.hasOwnProperty(prop)) return false;  }
 return true;
 }



 function dataObjectIsUndefined (obj)
 {
 return(typeof obj!=='undefined');
 }



 function dataValueIsEmpty (val)
 {
 return (val==null||val.length===0||val==="");
 }


 function dataValueIsNotEmpty (val)
 {
 return !(val==null||val.length===0||val==="");
 }



 function dataArrayRotate (arr,reverse)
 {
 if(reverse) { arr.unshift(arr.pop()); }
 else        { arr.push(arr.shift());  }
 return arr;
 }




 function dataArrayUniqueCount (arr)
 {
 return new Set(arr).size;
 }




 function dataFloat32ArrayToUint8Array (array)
 {
 var output=array.buffer;
 return new Uint8Array(output);
 }


 function dataUint8ArrayToFloat32Array (array)
 {
 var output=array.buffer;
 return new Float32Array(output);
 }




 function dataFloat32ArrayToInt16Array (array)
 {
 var i,s,output=new Int16Array(array.length);
 for(i=0;i<array.length;i++)
  {
  s=Math.max(-1,Math.min(1,array[i]));
  output[i]=s<0?s*0x8000:s*0x7FFF;
  }
 return output;
 }




 function dataInt16ArrayToFloat32Array (array)
 {
 var i,s,n,f,output=new Float32Array(array.length);
 for(i=0;i<array.length;i++)
  {
  n=array[i];
  f=(n>=0x8000)?-(0x10000-n)/0x8000:n/0x7FFF;
  output[i]=f;
  }
 return output;
 }





 function dataInt16ArrayToUint8Array (array)
 {
 var i,s,output=new Uint8Array(array.length*2);
 for(i=0;i<array.length;i++)
  {
  s=array[i];
  output[(i*2)+0]=(s/256)%256;
  output[(i*2)+1]=(s&256)%256;
  }
 return output;
 }



 function dataUint8ArrayToInt16Array (array)
 {
 var o,i,s1,s2,output=new Int16Array(array.length/2);
 o=0;
 for(i=0;i<array.length;i+=2)
  {
  s1=array[(i+0)]|0;
  s2=array[(i+1)]|0;
  output[o]=(s1*256)+s2;
  o++;
  }
 return output;
 }




/*-----------------------------------------------------------------------*/




 function stringObjInit ()
 {
 if(Object.keys(string_obj).length!=0) { return; }
 string_obj.is_init=true;
 }




 function stringIndexOf (cs,str,mat,from)
 {
 var stxt,mtxt;

 if(str==undefined)      { return -1; }
 if(arguments.length<3)  { return -1; }
 if(arguments.length>4)  { return -1; }
 if(cs)
  {
  stxt=str;
  mtxt=mat;
  }
 else
  {
  stxt=str.toLowerCase();
  mtxt=mat.toLowerCase();
  }
 if(arguments.length==3)  { return stxt.indexOf(mtxt);  }
 return stxt.indexOf(mtxt,from);
 }




 function stringLastCharGet (str)
 {
 var ch;

 ch=str[str.length-1];
 return ch;
 }




 function stringLastCharTrim (str)
 {
 str=str.substring(0,str.length-1);
 return str;
 }


 function stringFirstCharGet (str)
 {
 var ch;
 ch=str[0];
 return ch;
 }




 function stringFirstCharTrim (str)
 {
 str=str.substring(1,str.length);
 return str;
 }



 function stringSha256 (str)
 {
 var mathPow,maxWord,lengthProperty,i,j,result,words,strBitLength;
 var hash,k,primeCounter,isComposite,candidate,w,oldHash;
 var i2,w15,a,b,e,temp1,temp2,w2;

 function _rightRotate(value,amount) { return (value>>>amount)|(value<<(32-amount)); };
 lengthProperty='length'
 result='';
 words=[];
 strBitLength=str[lengthProperty]*8;
 mathPow=Math.pow;
 maxWord=mathPow(2,32);
 hash=stringSha256.h=stringSha256.h||[];
 k=stringSha256.k=stringSha256.k||[];
 primeCounter=k[lengthProperty];
 isComposite={};
 for(candidate=2;primeCounter<64;candidate++)
  {
  if(isComposite[candidate]) { continue; }
  for(i=0;i<313;i+=candidate) { isComposite[i]=candidate; }
  hash[primeCounter]=(mathPow(candidate,.5)*maxWord)|0;
  k[primeCounter++]=(mathPow(candidate,1/3)*maxWord)|0;
  }
 str+='\x80';
 while(str[lengthProperty]%64-56) { str+='\x00'; }
 for(i=0;i<str[lengthProperty];i++)
  {
  j=str.charCodeAt(i);
  if(j>>8) { return; }
  words[i>>2]|=j<<((3-i)%4)*8;
  }
 words[words[lengthProperty]]=((strBitLength/maxWord)|0);
 words[words[lengthProperty]]=(strBitLength)
 for(j=0;j<words[lengthProperty];)
  {
  w=words.slice(j,j+=16);
  oldHash=hash;
  hash=hash.slice(0,8);
  for(i=0;i<64;i++)
   {
   i2=i+j;
   w15=w[i-15],w2=w[i-2];
   a=hash[0],e=hash[4];
   temp1=hash[7]+(_rightRotate(e,6)^_rightRotate(e,11)^_rightRotate(e,25))+((e&hash[5])^((~e)&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:
    (
    w[i-16]+(_rightRotate(w15,7)^_rightRotate(w15,18)^(w15>>>3))+w[i-7]+(_rightRotate(w2,17)^_rightRotate(w2,19)^(w2>>>10)))|0);
    temp2=(_rightRotate(a,2)^_rightRotate(a,13)^_rightRotate(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
    hash=[(temp1+temp2)|0].concat(hash);
    hash[4]=(hash[4]+temp1)|0;
    }
  for(i=0;i<8;i++) { hash[i]=(hash[i]+oldHash[i])|0; }
  }
 for(i=0;i<8;i++)
  {
  for(j=3;j+1;j--) { b=(hash[i]>>(j*8))&255;  result+=((b<16)?0:'')+b.toString(16);   }
  }
 return result;
 }




 function stringBase64FromUint8 (buffer)
 {
 var bin,len,i;

 bin="";
 len=buffer.byteLength;
 for(i=0;i<len;i++) {  bin+=String.fromCharCode(buffer[i]); }
 return window.btoa(bin);
 }



 function stringBase64ToUint8 (str)
 {
 var bs,len,bytes,i;

 bs=window.atob(str);
 len=bs.length;
 bytes=new Uint8Array(len);
 for(i=0;i<len;i++) { bytes[i]=bs.charCodeAt(i); }
 return bytes;//bytes.buffer;
 }


 function stringSplitter (str,by)
 {
 return str.split(by).reduce((accum,curr)=>
  {
  if(accum.isConcatting)           { accum.soFar[accum.soFar.length-1]+=','+curr;  }
  else                             { accum.soFar.push(curr);                       }
  if(curr.split('"').length%2==0)  { accum.isConcatting=!accum.isConcatting;       }
  return accum;
  },
 {soFar:[],isConcatting:false}).soFar;
 }




 function stringTime (unixtimestamp)
 {
 var ux,a,months,year,month,date,hour,min,sec,time,ap;
 ux=parseInt(unixtimestamp/1000);
 a=new Date(ux);
 months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 year=a.getFullYear();
 month=months[a.getMonth()];
 date=a.getDate();
 hour=a.getHours();
 min=a.getMinutes();
 sec=a.getSeconds();
 if(min<10)   { min="0"+min; }
 if(sec<10)   { sec="0"+sec; }
 if(hour<12)  { ap="am";           } else
 if(hour>12)  { ap="pm"; hour-=12; } else
 if(hour==12) { ap="pm"; }
 year=year%1000;
 time=date+' '+month+' '+year+'  '+hour+':'+min+':'+sec+" "+ap;
 return time;
 }




 function stringParms (name)
 {
 var txt,a;

 txt=name+"(";
 for(a=1;a<arguments.length;a++)
  {
  if(a>1) { txt+=","; }
  txt+=arguments[a];
  }
 txt+=")";
 return txt;
 }



/*-----------------------------------------------------------------------*/



 function envObjInit ()
 {
 if(Object.keys(env_obj).length!=0) { return; }
 env_obj.info=envInfoGet();
 env_obj.event_proc=null;
 env_obj.is_init=true;
 }




 function envInfoGet ()
 {
 var obj,brp,check,ti,so,parts,kv,who,mat,off,ver;
 var name,pre;
 var isOpera,isFirefox,isSafari,isIE,isEdge,isChrome,isEdgeChromium,isSamsung;
 var fp0,hasLocalStorage,hasSessionStorage,hasIndexDb,isCanvasSupported;
 var elem,keys,canvas,ctx,txt;

 if(env_obj.info) { return env_obj.info; }
 obj={};
 isOpera=(!!window.opr&&!!opr.addons)||!!window.opera||navigator.userAgent.indexOf(' OPR/')>=0;
 isFirefox=typeof InstallTrigger!=='undefined';
 isSafari=/constructor/i.test(window.HTMLElement)||(function (p) { return p.toString()==="[object SafariRemoteNotification]"; })(!window['safari']||(typeof safari!=='undefined'&&safari.pushNotification));
 isIE=false||!!document.documentMode;
 isEdge=!isIE&&!!window.StyleMedia;
 isChrome=(!!window.chrome&&navigator.userAgent.indexOf("Chrome")!=-1);
 isEdgeChromium=isChrome&&(navigator.userAgent.indexOf("Edg")!=-1);
 isSamsung=navigator.userAgent.match(/SamsungBrowser/i);
 who=-1;
 name="";
 ver="";
 pre="";
 if(isSamsung)      { who=7; name="Samsung"; }  else
 if(isEdgeChromium) { who=6; name="EdgeChromium"; }  else
 if(isChrome)       { who=5; name="Chrome"; }  else
 if(isEdge)         { who=4; name="Edge"; }  else
 if(isIE)           { who=3; name="IE"; }  else
 if(isSafari)       { who=2; name="Safari"; }  else
 if(isFirefox)      { who=1; name="Firefox"; }  else
 if(isOpera)        { who=0; name="Opera"; }
 if(who==1) { pre=" Firefox/";  } else
 if(who==5) { pre=" Chrome/";   } else
 if(who==6) { pre=" Edg/";      }
 if(pre!="")
  {
  mat=pre;
  off=stringIndexOf(false,navigator.userAgent,mat);
  if(off>=0) { off+=mat.length; }
  ver=navigator.userAgent.substring(off);
  off=stringIndexOf(false,ver," ");
  if(off>=0) { ver=ver.substring(0,off); }
  pre=ver;
  }
 obj.platform=navigator.platform;
 obj.ver=ver;
 obj.who=who;
 obj.name=name;
 obj.ua=navigator.userAgent;
 obj.url=window.location;
 obj.browser_args=[];
 so=obj.url.search.substring(1).split("&").reduce(function(result,value)
  {
  parts=value.split('=');
  kv={};
  if(parts[0]) { kv.key=decodeURIComponent(parts[0]); kv.val=decodeURIComponent(parts[1]);   }
  obj.browser_args.push(kv);
  },{})
 obj.browser_pathpart=obj.url.pathname.split('/');
 brp=navigator.platform;
 ti=stringIndexOf(0,brp,"win");
 if(ti>=0) { obj.is_win=true;  }
 else      { obj.is_win=false; }
 obj.is_standalone=(window.matchMedia('(display-mode: standalone)').matches);
 check=false;
 (function(a)
  {
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
   {
   check=true;
   }
  })(navigator.userAgent||navigator.vendor||window.opera);
 obj.is_mobile=check;
 if(obj.is_mobile==true&&obj.is_win==false) { obj.is_real_mobile=true;  }
 else                                       { obj.is_real_mobile=false; }
 try{ hasLocalStorage=!!window.localStorage;      }   catch(e) { hasLocalStorage=true;  };
 try{ hasSessionStorage=!!window.sessionStorage;  }   catch(e) { hasSessionStorage=true;  };
 try{ hasIndexDb=!!window.indexedDB;              }   catch(e) { hasIndexDb=true;  };
 elem=document.createElement('canvas');
 isCanvasSupported=!!(elem.getContext && elem.getContext('2d'));
 keys=[];
 keys.push(navigator.userAgent);
 keys.push(navigator.language);
 keys.push(screen.colorDepth);
 keys.push(new Date().getTimezoneOffset());
 keys.push(hasSessionStorage);
 keys.push(hasLocalStorage);
 keys.push(hasIndexDb);
 if(document.body){  keys.push(typeof(document.body.addBehavior));      }
 else             {  keys.push(typeof undefined);      }
 keys.push(typeof(window.openDatabase));
 keys.push(navigator.cpuClass);
 keys.push(navigator.platform);
 keys.push(navigator.doNotTrack);
 if(isCanvasSupported)
  {
  canvas=document.createElement('canvas');
  ctx=canvas.getContext('2d');
  txt='aaLib.DNA.RNA.fingerprint';
  ctx.textBaseline="top";
  ctx.font="14.43px Arial";
  ctx.textAlign="alphabetic";
  ctx.fillStyle="#f60";
  ctx.fillRect(125,1,62.123,20.234);
  ctx.fillStyle="#069";
  ctx.fillText(txt,2,15);
  ctx.fillStyle="rgba(102,204,0,0.72)";
  ctx.fillText(txt,4,17);
  keys.push(canvas.toDataURL("image/jpeg",0.57));
  }
 fp0=""+keys.join('###');
 obj.finger_print=stringSha256(fp0);
 return obj;
 }





 function envBrowserArg (key)
 {
 var b;

 for(b=0;b<aa.env_obj.info.browser_args.length;b++)
  {
  if(aa.env_obj.info.browser_args[b].key!=key) { continue; }
  return(aa.env_obj.info.browser_args[b]);
  }
 return null;
 }




 function envEventProc (event)
 {
 switch(event.type)
  {
  case "click":
//  console.log(event.type);
  if(aa.main_state.dethrottle_stage==1)  {   aa.mainDethrottle();    }
  break;

  /*
  case "touchend":
  case "tap":
  console.log(event.type);
  break;
*/


  case "visibilitychange":
  case "webkitvisibilitychange":
  case "blur":
  case "focus":
  //aa.debugLog("vs="+document.visibilityState+"  hd="+document.hidden);
  break;

  case "mousemove":
  break;

  case "resize":
  break;

  case "orientationchange":
  break;

  case "beforeunload":
  break;

  case "unload":
  break;

  default:
  console.log("ev=",event);
  //aa.debugLog("ev=",event);
  break;
  }
 }






 function envListenEvents (proc)
 {
 if(proc==null)
  {
  if(env_obj.event_proc==null) { return true; }
  window.removeEventListener("beforeunload",env_obj.event_proc,false);
  window.removeEventListener("unload",env_obj.event_proc,false);
  window.removeEventListener("resize",env_obj.event_proc,false);
  window.removeEventListener("orientationchange",env_obj.event_proc,false);
  window.removeEventListener("focus",env_obj.event_proc,false);
  window.removeEventListener("blur",env_obj.event_proc,false);
  window.removeEventListener("wheel",env_obj.event_proc,false);
//  document.body.removeEventListener("touchend",env_obj.event_proc,false);
  document.body.removeEventListener("click",env_obj.event_proc,false);
//  document.body.removeEventListener("tap",env_obj.event_proc,false);
  document.body.removeEventListener("mousemove",env_obj.event_proc,false);
  document.removeEventListener("visibilitychange",env_obj.event_proc,false);
  document.removeEventListener("mozvisibilitychange",env_obj.event_proc,false);
  document.removeEventListener("webkitvisibilitychange",env_obj.event_proc,false);
  document.removeEventListener("msvisibilitychange",env_obj.event_proc,false);
  env_obj.event_proc=null;
  }
 else
  {
  if(env_obj.event_proc!=null) { return false; }
  env_obj.event_proc=proc;
  window.addEventListener("beforeunload",function(event)      { env_obj.event_proc(event);  });
  window.addEventListener("unload",function(event)            { env_obj.event_proc(event);  });
  window.addEventListener("resize",function(event)            { env_obj.event_proc(event);  },false);
  window.addEventListener("orientationchange",function(event) { env_obj.event_proc(event);  },false);
  window.addEventListener("focus",function(event)             { env_obj.event_proc(event);  },false);
  window.addEventListener("blur",function(event)              { env_obj.event_proc(event);  },false);
  window.addEventListener("wheel",function(event)             { env_obj.event_proc(event);  });
  //document.body.addEventListener("touchcancel",function(event)             { env_obj.event_proc(event);  });
//  document.body.addEventListener("touchend",function(event)             { env_obj.event_proc(event);  });
  document.body.addEventListener("click",function(event)             { env_obj.event_proc(event);  });
//  document.body.addEventListener("tap",function(event)               { env_obj.event_proc(event);  });
  document.body.addEventListener("mousemove",function(event)         { env_obj.event_proc(event);  });//   audio.play()})
  document.addEventListener("visibilitychange",function(event)       { env_obj.event_proc(event);  });
  document.addEventListener("mozvisibilitychange",function(event)    { env_obj.event_proc(event);  });
  document.addEventListener("webkitvisibilitychange",function(event) { env_obj.event_proc(event);  });
  document.addEventListener("msvisibilitychange",function(event)     { env_obj.event_proc(event);  });
  console.log("listening");
  }
 return true;
 }








 function envDisplayGet ()
 {
 var win,doc,ori,docelem,body,disp={};

 win=window;
 doc=document;
 docelem=doc.documentElement;
 ori=(screen.orientation||{}).type||screen.mozOrientation||screen.msOrientation;
 body=doc.getElementsByTagName('body')[0];
 disp.win_wid=docelem.clientWidth||win.innerWidth||document.body.clientWidth;
 disp.win_hit=docelem.clientHeight||win.innerHeight||document.body.clientHeight;
 //disp.win_wid=win.innerWidth||docelem.clientWidth;
 //disp.win_hit=win.innerHeight||docelem.clientHeight;

 disp.scr_wid=screen.width;
 disp.scr_hit=screen.height;
 disp.density=1.0;
 if(win.devicePixelRatio) { disp.density=win.devicePixelRatio; }
 disp.orient=ori;
 disp.is_fse=false;
 if(document.fullscreenElement) { disp.is_fse=true;  }
 disp.is_landscape=false;
 if(disp.scr_wid>disp.scr_hit) { disp.is_landscape=true;  }
 return disp;
 }




 function envDisplayCompare (disp,lastdisp)
 {
 var change=0;

 while(1)
  {
  if(lastdisp.win_wid==undefined||disp.win_wid!=lastdisp.win_wid) { change+=1; }
  if(lastdisp.win_hit==undefined||disp.win_hit!=lastdisp.win_hit) { change+=2; }
  if(lastdisp.scr_wid==undefined||disp.scr_wid!=lastdisp.scr_wid) { change+=4; }
  if(lastdisp.scr_hit==undefined||disp.scr_hit!=lastdisp.scr_hit) { change+=8; }
  if(lastdisp.density==undefined||disp.density!=lastdisp.density) { change+=16; }
  if(lastdisp.orient==undefined||disp.orient!=lastdisp.orient)   { change+=32; }
  if(lastdisp.is_fse==undefined||disp.is_fse!=lastdisp.is_fse)   { change+=64; }
  if(lastdisp.is_landscape==undefined||disp.is_landscape!=lastdisp.is_landscape) { change+=128; }
  break;
  }
 return change;
 }





 function envZoomFix()
 {
 var viewport,win,doc,docelem,body,wid,hit,isff;

 viewport=document.querySelector('meta[name="viewport"]');
 if(viewport===null)
  {
  viewport=document.createElement("meta");
  viewport.setAttribute("name","viewport");
  document.head.appendChild(viewport);
  viewport=document.querySelector('meta[name="viewport"]');
  }
 if(viewport)
  {
  wid=200;
  hit=200;
  isff=typeof InstallTrigger!=='undefined';
  if(isff)
   {
   win=window;
   doc=document;
   docelem=doc.documentElement;
   body=doc.getElementsByTagName('body')[0];
   wid=(docelem.clientWidth||win.innerWidth||document.body.clientWidth);
   hit=(docelem.clientHeight||win.innerHeight||document.body.clientHeight);
   }
  viewport.content="initial-scale=1";
  viewport.content="width="+(wid);
  viewport.content="height="+(hit);
  viewport.content="maximum-scale=1"; // newly added
  viewport.content="user-scalable=0"; // was no

//  viewport.content="initial-scale=1,width="+(wid)+",maximum-scale=1,user-scalable=0";
  return true;
  }
 return false;
 }




 function envTitleSet (title)
 {
 document.title=title;
 }



 function envTitleGet ()
 {
 return document.title;
 }



 function envReload (forced,ms)
 {
 ms=parseInt(ms+aa.numRand(500));
 setTimeout(function() { window.location.reload(forced);  return false;  }, ms);
 return true;
 }




 function envFavIconGet ()
 {
 return document.getElementById("favicon");
 }




 function envFavIconSet (url)
 {
 var fi;
 fi=envFavIconGet();
 fi.href=url;
 }



 function envManifestInit ()
 {
 var obj;
 obj={};
 obj.type="manifest";
 obj.manifest={};
 return obj;
 }



 function envManifestSet (obj,key,val)
 {
 if(obj.type!="manifest") { return null; }
 obj.manifest[key]=val;
 return obj;
 }



 function envManifestApply (obj,eid)
 {
 var sid,sm,blob,mu;

 if(obj.type!="manifest") { return false; }
 sm=JSON.stringify(obj);
 blob=new Blob([sm],{type:'application/json'});
 mu=URL.createObjectURL(blob);
 sid="#"+eid;
 document.querySelector(sid).setAttribute('href',mu);
 return true;
 }



/*
 man=aa.envManifestInit();
 man=aa.envManifestSet(man,"background_color","#2f3399");
 man=aa.envManifestSet(man,"categories",["books","education","medical"]);
 man=aa.envManifestSet(man,"description","You see what I'm saying!");
 man=aa.envManifestSet(man,"dir","auto");
 man=aa.envManifestSet(man,"display","standalone");
 man=aa.envManifestSet(man,"icons",[{"src":"https://mebeam.com/favicon.png","sizes":"32x32","type":"image/png"},{"src":"https://mebeam.com/favicon192x192.png","sizes":"192x192","type":"image/png"},{"src":"https://mebeam.com/splash512x512.png","sizes":"512x512","type":"image/png"}]);
 man=aa.envManifestSet(man,"lang","en-US");
 man=aa.envManifestSet(man,"name","MeBeam. You see what I'm saying!");
 man=aa.envManifestSet(man,"orientation","portrait");
 man=aa.envManifestSet(man,"scope","https://mebeam.com/");
 man=aa.envManifestSet(man,"screenshots",[{"src":"https://mebeam.com/favicon192x192.png","sizes":"192x192","type":"image/png"}]);
 man=aa.envManifestSet(man,"short_name","MeBeam");
 man=aa.envManifestSet(man,"start_url","https://mebeam.com/");
 man=aa.envManifestSet(man,"theme_color","#2FfF7F");
 aa.envManifestApply(man,"manifestId");
*/

/*-----------------------------------------------------------------------*/





 function queueObjInit ()
 {
 if(Object.keys(queue_obj).length!=0) { return; }
 queue_obj.handef=handleDefine("queue",256);
 queue_obj.is_init=true;
 }




 function queueCreate ()
 {
 var i,h,obj;

 for(i=0;i<queue_obj.handef.slots;i++)
  {
  obj=queue_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  obj.ms_start=timerMsRunning();
  obj.msgs_total=0;
  obj.msgs_queued=0;
  obj.msgs_queue=[];
  h=handleUse(queue_obj.handef,i)
  return h;
  }
 return 0;
 }



 function queueDestroy (handle)
 {
 var obj;

 if((obj=handleCheck(queue_obj.handef,handle))==null) { return false; }
 obj.msgs_queue=[];
 handleRemove(queue_obj.handef,handle);
 return true;
 }




 function queueGet (handle)
 {
 return(handleCheck(queue_obj.handef,handle));
 }



 function queueWrite (handle,data)
 {
 var obj;

 if((obj=handleCheck(queue_obj.handef,handle))==null) { aa.debugLog("queuewrite handle check fail "+handle); return false; }
 obj.msgs_queued++;
 obj.msgs_queue.push(data);
 return true;
 }


 function queueRead (handle)
 {
 var msg,obj,bu8;

 if((obj=handleCheck(queue_obj.handef,handle))==null) {  return null; }
 if(obj.msgs_queued==0) {   return null; }
 msg=obj.msgs_queue.shift();
 obj.msgs_queued--;
 obj.msgs_total++;
 return msg;
 }



 function queuePeek (handle,ofs)
 {
 var msg,obj;

 if((obj=handleCheck(queue_obj.handef,handle))==null) { return null; }
 if(ofs<0) { return null; }
 if(ofs>=obj.msgs_queued) { return null; }
 msg=obj.msgs_queue[ofs];
 return msg;
 }



 function queueDiscard (handle)
 {
 var obj;

 if((obj=handleCheck(queue_obj.handef,handle))==null) { return false; }
 if(obj.msgs_queued==0) {  return false; }
 obj.msgs_queue.shift();
 obj.msgs_queued--;
 obj.msgs_total++;
 return true;
 }




 function queueStatus (handle)
 {
 var obj,info;

 if((obj=handleCheck(queue_obj.handef,handle))==null) { return null; }
 info={};
 info.msgs_queued=obj.msgs_queued;
 info.msgs_total=obj.msgs_total;
 return info;
 }



/*-----------------------------------------------------------------------*/

/*
       touches: A list of information for every finger currently touching the screen
 targetTouches: Like touches, but is filtered to only the information for finger touches that started out within the same node
changedTouches: A list of information for every finger involved in the event

=When I put a finger down, all three lists will have the same information.
 It will be in changedTouches because putting the finger down is what caused the event

=When I put a second finger down, touches will have two items, one for each finger.
 targetTouches will have two items only if the finger was placed in the same node as the first finger.
 changedTouches will have the information related to the second finger, because it’s what caused the event
*If I put two fingers down at exactly the same time, it’s possible to have two items in changedTouches, one for each finger

=If I move my fingers, the only list that will change is changedTouches and will
 contain information related to as many fingers as have moved (at least one).

=When I lift a finger, it will be removed from touches, targetTouches and will appear in changedTouches since it’s what caused the event

=Removing my last finger will leave touches and targetTouches empty, and changedTouches will contain information for the last finger
*/


 function touchObjInit ()
 {
 var state,Tap,utils;

 if(Object.keys(touch_obj).length!=0) { return; }
 state={};
 Tap={};
 utils={};
 state.is_started=false;
 touch_obj.state=state;
 touch_obj.Tap=Tap;
 touch_obj.utils=utils;
 touch_obj.eventMatrix=null;
 touch_obj.attachDeviceEvent=null;
 touch_obj.init=null;
 touch_obj.handlers=null;
 touch_obj.deviceEvents=null;
 touch_obj.coords={};
 touch_obj.is_init=true;
// touch_obj.state.is_started=false;
 }





 function touchStart ()
 {
 var i,evnt,preventDefault;
 var obj,j,k,typ,eve,t;

 if(touch_obj.state.is_started==true) { return false; }

 touch_obj.utils.attachEvent=function(element,eventName,callback)
  {
  //eventName either touchStart,touchMove,touchEnd
  //              or pointerDown,pointerMove,pointerUp
  if('addEventListener' in window) {  return element.addEventListener(eventName,callback,false);        }
  };

 touch_obj.utils.fireFakeEvent=function(e,eventName)
  {
  // eventname is Tap
  // e is either pointerevent, or touchevent
  if(document.createEvent)
   {
   ///###  console.log("about to dispatch, after utils.createevent "+eventName);
   return e.target.dispatchEvent(touch_obj.utils.createEvent(e,eventName));
   }
  };

 touch_obj.utils.createEvent=function(olde,name)
  {
  // name is tap
  // olde is either pointerevent or touchevent
  if(document.createEvent)
   {
   ///###   console.log("utils.createEvent "+name+" now creating HTMLevent");
   evnt=window.document.createEvent('HTMLEvents');
   evnt.initEvent(name,true,true);//true);
   evnt.olde=olde;
   evnt.eventName=name;
   return evnt;
   }
  aa.debugAlert();
  };

 touch_obj.utils.getRealEvent=function(e)
  {
  // e is either touchevent or pointerevet
  return e;
  };

 touch_obj.eventMatrix=
  [
  {test:('propertyIsEnumerable' in window||'hasOwnProperty' in document)&&(window.propertyIsEnumerable('ontouchstart')||document.hasOwnProperty('ontouchstart')||window.hasOwnProperty('ontouchstart')),
   events: { start: 'touchstart', move: 'touchmove', end: 'touchend'  }   },

  {test:window.navigator.msPointerEnabled,
   events: { start: 'MSPointerDown',move: 'MSPointerMove',end: 'MSPointerUp' }   },

  {test:(window.navigator.pointerEnabled||window.PointerEvent),
   events: { start: 'pointerdown', move: 'pointermove', end: 'pointerup'  }   }
  ];

 touch_obj.Tap.options=
  {
  eventName: 'tap',fingerMaxOffset: 12
  };

 touch_obj.attachDeviceEvent=function(eventName)
  {
  // this seems only be called once
  return touch_obj.utils.attachEvent(document.documentElement,touch_obj.deviceEvents[eventName],touch_obj.handlers[eventName]);
  };

 touch_obj.handlers=
  {
  start: function(e)
   {
   ///### aa.debugLog("touch_obj.handler start ",e);
   e=touch_obj.utils.getRealEvent(e);
   touch_obj.coords.start=[e.pageX,e.pageY];
   touch_obj.coords.offset=[0,0];
   if(!touch_obj.utils.fireFakeEvent(e,touch_obj.Tap.options.eventName))
    {
    if(window.navigator.msPointerEnabled||window.navigator.pointerEnabled||window.PointerEvent)
     {
     preventDefault=function(clickEvent)  {  clickEvent.preventDefault();    e.target.removeEventListener('click',preventDefault);       };
     e.target.addEventListener('click',preventDefault,false);
     }
    e.preventDefault();
    }
   },
  move: function(e)
   {
   if(!touch_obj.coords.start&&!touch_obj.coords.move) {                return false;            }
   ///### aa.debugLog("touch_obj.handler move ",e);
   e=touch_obj.utils.getRealEvent(e);
   touch_obj.coords.move=[e.pageX,e.pageY];
   touch_obj.coords.offset=[Math.abs(touch_obj.coords.move[0]-touch_obj.coords.start[0]),Math.abs(touch_obj.coords.move[1]-touch_obj.coords.start[1])];
   if(!touch_obj.utils.fireFakeEvent(e,touch_obj.Tap.options.eventName))
    {
    if(window.navigator.msPointerEnabled||window.navigator.pointerEnabled||window.PointerEvent)
     {
     preventDefault=function(clickEvent)     {    clickEvent.preventDefault();    e.target.removeEventListener('click',preventDefault);    };
     e.target.addEventListener('click',preventDefault,false);
     }
    e.preventDefault();
    }
   },
  end: function(e)
   {
   ///### aa.debugLog("touch_obj.handler end ",e);
   e=touch_obj.utils.getRealEvent(e);
   if(!touch_obj.utils.fireFakeEvent(e,touch_obj.Tap.options.eventName))
    {
    if(window.navigator.msPointerEnabled||window.navigator.pointerEnabled||window.PointerEvent)
     {
     preventDefault=function(clickEvent)    {    clickEvent.preventDefault();      e.target.removeEventListener('click',preventDefault);    };
     e.target.addEventListener('click',preventDefault,false);
     }
    e.preventDefault();
    }
   touch_obj.coords={};
   },
  click: function(e)
   {
   ///### aa.debugLog("touch_obj.handler click ",e);
   if(!touch_obj.utils.fireFakeEvent(e,touch_obj.Tap.options.eventName)) {    return e.preventDefault();  }
   }
  };

 touch_obj.init=function()
  {
  ///### aa.debugLog(">>touch_obj.init, only calleed once. eventmatrix.len="+touch_obj.eventMatrix.length);
  for(i=0;i<touch_obj.eventMatrix.length;i++)
   {
   if(touch_obj.eventMatrix[i].test)
    {
    ///### aa.debugLog("eventmatrix["+i+"].test true");
    touch_obj.deviceEvents=touch_obj.eventMatrix[i].events;
    touch_obj.attachDeviceEvent('start');
    touch_obj.attachDeviceEvent('move');
    touch_obj.attachDeviceEvent('end');
    break;
    }
   }
  if(i==touch_obj.eventMatrix.length)
   {
   ///### aa.debugLog("all eventmatrix failed, so attaching click");
   return touch_obj.utils.attachEvent(document.documentElement,'click',touch_obj.handlers.click);
   }
  return;
  };



 touch_obj.state.is_started=true;
 ///touch_obj.state.event_count=0;
 touch_obj.state.event_queue_handle=queueCreate();
 touch_obj.state.event_queue_status=queueStatus(touch_obj.state.event_queue_handle);
 touch_obj.state.event_counter=0;


 /**
 t=10;
 touch_obj.state.finger={};
 touch_obj.state.finger.max_tracks=t;
 touch_obj.state.finger.track_count=0;
 touch_obj.state.finger.event_track=dataArray2DCreate(t);
 */

 touch_obj.init();
 document.body.style.touchAction="none";
 document.getElementById('bodid').addEventListener('tap',function(event)
  {
  typ=event.type;
  eve=event;
  obj={};
  obj.ec=touch_obj.state.event_counter;
  ///obj.type=typ;
  ///obj.eventName=eve.eventName;
  ///obj.eventPhase=eve.eventPhase;
  obj.what=eve.olde.type;
  obj.altKey=eve.olde.altKey;
  obj.ctrlKey=eve.olde.ctrlKey;
  obj.shiftKey=eve.olde.shiftKey;
  obj.timeStamp=eve.olde.timeStamp;
  ///obj.which=eve.olde.which;
  ///obj.srcElementId=eve.olde.srcElement.id;
  ///obj.targetId=eve.olde.target.id;
  //obj.x=null;
  //obj.y=null;
  //if(eve.olde.x) { obj.x=eve.olde.x; }
  //if(eve.olde.y) { obj.y=eve.olde.y; }
  obj.changedTouchesLen=0;
  obj.changedTouches=[];
  if(eve.olde.changedTouches)
   {
   obj.changedTouchesLen=eve.olde.changedTouches.length;
   k=obj.changedTouchesLen;
   for(j=0;j<5;j++)
    {
    if(j<k)
     {
     obj.changedTouches[j]={};
     obj.changedTouches[j].ec=eve.olde.changedTouches[j].ec;//touch_obj.state.event_counter;//eve.olde.changedTouches[j].ec;
     obj.changedTouches[j].clientX=eve.olde.changedTouches[j].clientX;
     obj.changedTouches[j].clientY=eve.olde.changedTouches[j].clientY;
    obj.changedTouches[j].force=eve.olde.changedTouches[j].force;
     obj.changedTouches[j].identifier=eve.olde.changedTouches[j].identifier;
    obj.changedTouches[j].pageX=eve.olde.changedTouches[j].pageX;
    obj.changedTouches[j].pageY=eve.olde.changedTouches[j].pageY;
    obj.changedTouches[j].radiusX=eve.olde.changedTouches[j].radiusX;
    obj.changedTouches[j].radiusY=eve.olde.changedTouches[j].radiusY;
    obj.changedTouches[j].rotationAngle=eve.olde.changedTouches[j].rotationAngle;
    obj.changedTouches[j].screenX=eve.olde.changedTouches[j].screenX;
    obj.changedTouches[j].screenY=eve.olde.changedTouches[j].screenY;
     ///obj.changedTouches[j].targetId=eve.olde.changedTouches[j].targetId;
     }
    }
   }

  obj.targetTouchesLen=0;
  obj.targetTouches=[];
  if(eve.olde.targetTouches)
   {
   obj.targetTouchesLen=eve.olde.targetTouches.length;
   k=obj.targetTouchesLen;
   for(j=0;j<5;j++)
    {
    if(j<k)
     {
     obj.targetTouches[j]={};
     obj.targetTouches[j].ec=eve.olde.targetTouches[j].ec;//touch_obj.state.event_counter;//eve.olde.ec;//targetTouches[j].ec;
     obj.targetTouches[j].clientX=eve.olde.targetTouches[j].clientX;
     obj.targetTouches[j].clientY=eve.olde.targetTouches[j].clientY;
    obj.targetTouches[j].force=eve.olde.targetTouches[j].force;
     obj.targetTouches[j].identifier=eve.olde.targetTouches[j].identifier;
    obj.targetTouches[j].pageX=eve.olde.targetTouches[j].pageX;
    obj.targetTouches[j].pageY=eve.olde.targetTouches[j].pageY;
    obj.targetTouches[j].radiusX=eve.olde.targetTouches[j].radiusX;
    obj.targetTouches[j].radiusY=eve.olde.targetTouches[j].radiusY;
     obj.targetTouches[j].rotationAngle=eve.olde.targetTouches[j].rotationAngle;
     obj.targetTouches[j].screenX=eve.olde.targetTouches[j].screenX;
      obj.targetTouches[j].screenY=eve.olde.targetTouches[j].screenY;
     ///obj.targetTouches[j].targetId=eve.olde.targetTouches[j].targetId;
     }
    }
   }


  obj.touchesLen=0;
  obj.touches=[];
  if(eve.olde.touches)
   {
   obj.touchesLen=eve.olde.touches.length;
   k=obj.touchesLen;
   for(j=0;j<5;j++)
    {
    if(j<k)
     {
     obj.touches[j]={};
     obj.touches[j].ec=eve.olde.touches[j].ec;
     obj.touches[j].clientX=eve.olde.touches[j].clientX;
     obj.touches[j].clientY=eve.olde.touches[j].clientY;
    obj.touches[j].force=eve.olde.touches[j].force;
     obj.touches[j].identifier=eve.olde.touches[j].identifier;
    obj.touches[j].pageX=eve.olde.touches[j].pageX;
    obj.touches[j].pageY=eve.olde.touches[j].pageY;
    obj.touches[j].radiusX=eve.olde.touches[j].radiusX;
    obj.touches[j].radiusY=eve.olde.touches[j].radiusY;
    obj.touches[j].rotationAngle=eve.olde.touches[j].rotationAngle;
    obj.touches[j].screenX=eve.olde.touches[j].screenX;
    obj.touches[j].screenY=eve.olde.touches[j].screenY;
     ///obj.touches[j].targetId=eve.olde.touches[j].targetId;
     }
    }
   }
  ///touch_obj.state.event_count++;
  delete obj.changedTouchesLen;
  delete obj.touchesLen;
  delete obj.targetTouchesLen;
  queueWrite(touch_obj.state.event_queue_handle,obj);
  touch_obj.state.event_queue_status=queueStatus(touch_obj.state.event_queue_handle);
  touch_obj.state.event_counter++;
  obj={};
  event.preventDefault();
  event.stopPropagation();
  },false);//false);
 return true;
 }





 function touchPeek (ofs)
 {
 var msg;

 if(touch_obj.state.is_started!=true) { return null; }
 msg=queuePeek(touch_obj.state.event_queue_handle,ofs);
 return msg;
 }




 function touchRead ()
 {
 var msg;

 if(touch_obj.state.is_started!=true) { return null; }
 msg=queueRead(touch_obj.state.event_queue_handle);
 touch_obj.state.event_queue_status=queueStatus(touch_obj.state.event_queue_handle);
 return msg;
 }



 /**
 function touchProcess (msg)
 {
 var obj,s,i,t,trk,mt,tc,empty,used,trx;

 if(touch_obj.state.is_started!=true) { return null; }
 if(msg.what=="pointerup"||msg.what=="pointermove"||msg.what=="pointerup")
  {
  }
 mt=touch_obj.state.finger.max_tracks;
 tc=touch_obj.state.finger.track_count;
 empty=0;
 used=0;
 for(t=0;t<mt;t++)
  {
  trk=touch_obj.state.finger.event_track[t];
  if(trk.length==0)     { continue; }
  used++;
  trx=trk[trk.length-1];
  if(trx.what=="touchend") { empty++; }
  }
 if(used>0&&empty==used)
  {
  for(t=0;t<mt;t++) {  touch_obj.state.finger.event_track[t]=[];   }
  }
 i=0;
 for(s=0;;s++)
  {
  if(msg.changedTouches[s]==undefined) { break;  }
  obj={};
  obj.ec=msg.ec;
  obj.id=msg.changedTouches[s].identifier;
  obj.what=msg.what;
  obj.stamp=msg.timeStamp;
  obj.cx=msg.changedTouches[s].clientX;
  obj.cy=msg.changedTouches[s].clientY;
  obj.sx=msg.changedTouches[s].screenX;
  obj.sy=msg.changedTouches[s].screenY;
  obj.rx=msg.changedTouches[s].radiusX;
  obj.ry=msg.changedTouches[s].radiusY;
  obj.ra=msg.changedTouches[s].rotationAngle;
  for(t=0;t<mt;t++)
   {
   trk=touch_obj.state.finger.event_track[t];
   if(trk.length==0)     { continue; }
   if(trk[0].id==obj.id) { break; }
   }
  if(t==mt)
   {
   for(t=0;t<mt;t++)
    {
    trk=touch_obj.state.finger.event_track[t];
    if(trk.length==0)     { break; }
    }
   if(t==mt) { aa.debugAlert(); }
   }
  trk[trk.length]=obj;
  }
 tc=0;
 for(t=0;t<mt;t++)
  {
  trk=touch_obj.state.finger.event_track[t];
  if(trk.length==0)     { continue; }
  tc++;
  }
 touch_obj.state.finger.track_count=tc;
 return touch_obj.state.finger;
 }

*/


 function touchStatus ()
 {
 var info;

 if(touch_obj.state.is_started!=true) { return null; }
 touch_obj.state.event_queue_status=queueStatus(touch_obj.state.event_queue_handle);
 info={};
 info.msgs_queued=touch_obj.state.event_queue_status.msgs_queued;
 info.msgs_total=touch_obj.state.event_queue_status.msgs_total;
 return info;
 }





/*-----------------------------------------------------------------------*/




 function mouseObjInit ()
 {
 var state;

 if(Object.keys(mouse_obj).length!=0) { return; }
 state={};
 state.is_started=false;
 mouse_obj.state=state;
 mouse_obj.is_init=true;
 }





 function mouseStart ()
 {
 if(mouse_obj.state.is_started!=false) { return false; }
 mouse_obj.state.is_started=true;
 mouse_obj.state.event_count=0;
 mouse_obj.state.event_queue_handle=queueCreate();
 mouse_obj.state.event_queue_status=queueStatus(mouse_obj.state.event_queue_handle);
 document.addEventListener('mousedown',function(event)  { mouseOnEvent("mousedown",event); });
 document.addEventListener('mousemove',function(event)  { mouseOnEvent("mousemove",event); });
 document.addEventListener('mouseup',function(event)    { mouseOnEvent("mouseup",event);   });
 return true;
 }






 function mouseOnEvent (name,ev)
 {
 var msg;

 if(name=="mousedown"||ev.type=="mousedown")
  {
  aa.debugLog(name);
  aa.debugLog(ev);
  }

 //aa.debugLog(name+" "+ev.type,JSON.stringify(ev,0,2));
 if(name=="mousedown")  {  mouse_obj.state.event_count++;  }
 else
 if(name=="mousemove")  {  mouse_obj.state.event_count++;  }
 else
 if(name=="mouseup")    {  mouse_obj.state.event_count++;  }
 msg={};
 msg.name=name;
 msg.time_stamp=ev.timeStamp;
 msg.x=ev.x;
 msg.y=ev.y;
 msg.page_x=ev.pageX;
 msg.page_y=ev.pageY;
 msg.offset_x=ev.offsetX;
 msg.offset_y=ev.offsetY;
 msg.alt_key=ev.altKey;
 msg.ctrl_key=ev.ctrlKey;
 msg.shift_key=ev.shiftKey;
 queueWrite(mouse_obj.state.event_queue_handle,msg);
 mouse_obj.state.event_queue_status=queueStatus(mouse_obj.state.event_queue_handle);
 }





 function mousePeek (ofs)
 {
 var msg;

 if(mouse_obj.state.is_started!=true) { return null; }
 msg=queuePeek(mouse_obj.state.event_queue_handle,ofs);
 return msg;
 }




 function mouseRead ()
 {
 var msg;

 if(mouse_obj.state.is_started!=true) { return null; }
 msg=queueRead(mouse_obj.state.event_queue_handle);
 mouse_obj.state.event_queue_status=queueStatus(mouse_obj.state.event_queue_handle);
 return msg;
 }



 function mouseStatus ()
 {
 var info;

 if(mouse_obj.state.is_started!=true) { return null; }
 mouse_obj.state.event_queue_status=queueStatus(mouse_obj.state.event_queue_handle);
 info={};
 info.msgs_queued=mouse_obj.state.event_queue_status.msgs_queued;
 info.msgs_total=mouse_obj.state.event_queue_status.msgs_total;
 return info;
 }



 function mouseCursorGet ()
 {
 return(document.body.style.cursor);
 }




 function mouseCursorSet (style)
 {
 var prev=mouseCursorGet();
 if(style==null) {  document.body.style.cursor="default";  }
 else            {  document.body.style.cursor=style;      }
 return prev;
 }




/*-----------------------------------------------------------------------*/



 function keyboardObjInit ()
 {
 var state,i;

 if(Object.keys(keyboard_obj).length!=0) { return; }
 state={};
 state.is_started=false;
 state.down_count=0;
 state.event_count=0;
 state.hit_map=[];
 for(i=0;i<256;i++) { state.hit_map[i]=0; }
 state.event_queue_handle=0;
 state.event_queue_status=null;
 keyboard_obj.state=state;
 keyboard_obj.is_init=true;
 }







 function keyboardStart ()
 {
 var i;

 if(keyboard_obj.state.is_started!=false) { return false; }
 keyboard_obj.state.is_started=true;
 keyboard_obj.state.down_count=0;
 keyboard_obj.state.event_count=0;
 keyboard_obj.state.hit_map=[];
 for(i=0;i<256;i++) { keyboard_obj.state.hit_map[i]=0; }
 keyboard_obj.state.event_queue_handle=queueCreate();
 keyboard_obj.state.event_queue_status=queueStatus(keyboard_obj.state.event_queue_handle);
 document.addEventListener('keyup',function(event)    { keyboardOnEvent("keyup",event);    });
 document.addEventListener('keydown',function(event)  { keyboardOnEvent("keydown",event);  });
 document.addEventListener('keypress',function(event) { keyboardOnEvent("keypress",event); });
 return true;
 }



 function keyboardOnEvent (name,ev)
 {
 var msg,kc;

 if(ev.defaultPrevented) { return;  }
 kc=ev.keyCode||ev.key;
 if(isNaN(kc))  {  aa.debugAlert();  }
 msg={};
 msg.name=name;
 msg.keyCode=kc;
 msg.key=ev.key;
 msg.ascii=ev.key.charCodeAt(0);
 msg.alt_key=ev.altKey;
 msg.ctrl_key=ev.ctrlKey;
 msg.shift_key=ev.shiftKey;
 queueWrite(keyboard_obj.state.event_queue_handle,msg);
 keyboard_obj.state.event_queue_status=queueStatus(keyboard_obj.state.event_queue_handle);
 if(name=="keydown")
  {
  if(keyboard_obj.state.hit_map[kc]==0)
   {
   keyboard_obj.state.event_count++;
   keyboard_obj.state.down_count++;
   keyboard_obj.state.hit_map[kc]=1;
   }
  }
 else
 if(name=="keyup")
  {
  if(keyboard_obj.state.hit_map[kc]>0)
   {
   keyboard_obj.state.event_count++;
   keyboard_obj.state.down_count--;
   keyboard_obj.state.hit_map[kc]=0;
   }
  }
 }



 function keyboardPeek (ofs)
 {
 var msg;

 if(keyboard_obj.state.is_started!=true) { return null; }
 msg=queuePeek(keyboard_obj.state.event_queue_handle,ofs);
 return msg;
 }




 function keyboardRead ()
 {
 var msg;

 if(keyboard_obj.state.is_started!=true) { return null; }
 msg=queueRead(keyboard_obj.state.event_queue_handle);
 keyboard_obj.state.event_queue_status=queueStatus(keyboard_obj.state.event_queue_handle);
 return msg;
 }






 function keyboardStatus ()
 {
 var i,j,info,len;

 if(keyboard_obj.state.is_started!=true) { return null; }
 keyboard_obj.state.event_queue_status=queueStatus(keyboard_obj.state.event_queue_handle);
 info={};
 info.down_count=keyboard_obj.state.down_count;
 info.event_count=keyboard_obj.state.event_count;
 info.hit_rep=[];
 info.hit_key=[];
 len=keyboard_obj.state.hit_map.length;
 j=0;
 for(i=0;i<len;i++)
  {
  if(keyboard_obj.state.hit_map[i]==0) { continue; }
  info.hit_key[j]=i;
  info.hit_rep[j]=keyboard_obj.state.hit_map[i];
  j++;
  }
 if(j!=info.down_count) { aa.debugAlert(); }
 info.msgs_queued=keyboard_obj.state.event_queue_status.msgs_queued;
 info.msgs_total=keyboard_obj.state.event_queue_status.msgs_total;
 return info;
 }






/*-----------------------------------------------------------------------*/





 function storageObjInit ()
 {
 let test='test';

 if(Object.keys(storage_obj).length!=0) { return; }
 try
  {
  localStorage.setItem(test,test);
  localStorage.removeItem(test);
  }
 catch(e)
  {
  alert(e);
  return false;
  }
 storage_obj.handef=handleDefine("storage",128);
 storage_obj.is_init=true;
 }





 function storageCreate (issesh)
 {
 var i,h,obj;

 if(storage_obj.is_init!=true) { return 0; }
 for(i=0;i<storage_obj.handef.slots;i++)
  {
  obj=storage_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  h=handleUse(storage_obj.handef,i)
  if(issesh) { obj.is_session=true; }
  else       { obj.is_session=false; }
  obj.count=0;
  if(obj.is_session)   {   obj.count=sessionStorage.length;   }
  else                 {   obj.count=localStorage.length;     }
  return h;
  }
 return 0;
 }





 function storageDestroy (handle)
 {
 var obj;

 if((obj=handleCheck(storage_obj.handef,handle))==null) { return false; }
 handleRemove(storage_obj.handef,handle);
 return true;
 }





 function storageGet (handle)
 {
 return(handleCheck(storage_obj.handef,handle));
 }




 function storagePurge (handle)
 {
 var obj;

 if((obj=handleCheck(storage_obj.handef,handle))==null) { return false; }
 if(obj.is_session)  {  sessionStorage.clear();  }
 else                {  localStorage.clear();  }
 if(obj.is_session)  {  obj.count=sessionStorage.length;   }
 else                {  obj.count=localStorage.length;     }
 return true;
 }




 function storageRead (handle,key)
 {
 var obj,val;

 if((obj=handleCheck(storage_obj.handef,handle))==null) { return false; }
 if(obj.is_session)  {  val=sessionStorage.getItem(key);  }
 else                {  val=localStorage.getItem(key);  }
 if(obj.is_session)  {  obj.count=sessionStorage.length;   }
 else                {  obj.count=localStorage.length;     }
 return val;
 }




 function storageWrite (handle,key,val)
 {
 var obj;

 if((obj=handleCheck(storage_obj.handef,handle))==null) { return false; }
 if(obj.is_session)  {  sessionStorage.setItem(key,val);  }
 else                {  localStorage.setItem(key,val);  }
 if(obj.is_session)  {  obj.count=sessionStorage.length;   }
 else                {  obj.count=localStorage.length;     }
 return true;
 }



 function storageRemove (handle,key)
 {
 var obj;

 if((obj=handleCheck(storage_obj.handef,handle))==null) { return false; }
 if(obj.is_session)  {  sessionStorage.removeItem(key);  }
 else                {  localStorage.removeItem(key);  }
 if(obj.is_session)  {  obj.count=sessionStorage.length;   }
 else                {  obj.count=localStorage.length;     }
 return true;
 }






 function storageTuple (handle,index)
 {
 var obj,key,val,nfo;

 if((obj=handleCheck(storage_obj.handef,handle))==null) { return false; }
 if(obj.is_session)  {  key=sessionStorage.key(index);  val=sessionStorage.getItem(key);  }
 else                {  key=localStorage.key(index);    val=localStorage.getItem(key);    }
 if(obj.is_session)  {  obj.count=sessionStorage.length;   }
 else                {  obj.count=localStorage.length;     }
 nfo={};
 nfo.key=key;
 nfo.val=val;
 return nfo;
 }





 function storageStatus (handle)
 {
 var obj,info;

 if((obj=handleCheck(storage_obj.handef,handle))==null) { return null; }
 info={};
 if(obj.is_session)  { info.is_session=true;   info.count=sessionStorage.length;   }
 else                { info.is_session=false;  info.count=localStorage.length;     }
 return info;
 }









/*-----------------------------------------------------------------------*/


 function guiObjInit ()
 {
 if(Object.keys(gui_obj).length!=0) { return; }
 gui_obj.handef=handleDefine("gui",128);
 gui_obj.is_init=true;
 }






 function guiCreate (type,id)
 {
 var s,h,obj;

 switch(type)
  {
  default:  return 0;
  case "video":
  case "canvas":
  case "img":
  case "table": case "tr": case "td":
  case "div": case "span": case "p":
  break;
  }
 for(s=0;s<gui_obj.handef.slots;s++)
  {
  obj=gui_obj.handef.array[s];
  if(obj.in_use!=false)                   { continue;   }
  if((h=handleUse(gui_obj.handef,s))==0)  { return 0;   }
  obj.type=type;
  obj.vars={};
  if(id) {  obj.id=id;           }
  else   {  obj.id=type+"id"+s;  }
  obj.ctx=null;
  obj.dom=document.createElement(type);
  obj.dom.id=obj.id;
  //obj.dom.setAttribute("id",obj.id);
  if(type=="video")
   {
   obj.dom.muted=true;
   obj.dom.autoplay=false;
   obj.dom.controls=false;
   obj.dom.loop=false;
   obj.dom.srcObject=null;
   obj.dom.src=null;
   }
  //fill,contain,cover,none,scale-down,
  //if(type=="video")   {   obj.dom.style.objectFit="cover";   }
  //else                {   obj.dom.style.objectFit="fill";   }
  obj.dom.style.objectFit="fill";
  obj.dom.style.position="absolute";
  obj.dom.style.zIndex=1000;
  obj.dom.style.opacity=1.0;
  obj.dom.style.display="none";
  document.body.appendChild(obj.dom);
  obj.parent_handle=0;
  //aa.guiParentSet(h,0);
  if(type=="canvas")
   {
   obj.ctx=document.getElementById(obj.id).getContext("2d");
   obj.ctx.self_handle=h;
   obj.ctx.scale_factor=1.0;
   guiCanvasReset(h);
   }
  return h;
  }
 return 0;
 }





 function guiDestroy (handle)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 handleRemove(gui_obj.handef,handle);
 return true;
 }






 function guiGet (handle,what)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null)   { return null; }
 if((arguments.length==1)||(what==null||what=="obj")) { return obj;           }
 if(arguments.length==2&&what=="dom")                 { return obj.dom;       }
 if(arguments.length==2&&what=="css")                 { return obj.dom.style; }
 if(arguments.length==2&&what=="ctx")                 { return obj.ctx;       }
 return null;
 }





 function guiGroupGet (handle)
 {
 var obj,grp;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return null; }
 grp={};
 grp.han=handle;
 grp.obj=obj;
 grp.dom=guiGet(grp.han,"dom");
 grp.css=guiGet(grp.han,"css");
 grp.ctx=guiGet(grp.han,"ctx");
 return grp;
 }




 function guiIdFind (id)
 {
 var obj,s,c;

 c=0;
 for(s=0;s<gui_obj.handef.slots;s++)
  {
  if(c>=gui_obj.handef.count) { break; }
  obj=gui_obj.handef.array[s];
  if(obj.in_use!=true) { continue;   }
  if(obj.id==id)
   {
   return obj.self_handle;
   }
  c++;
  }
 return 0;
 }






 function guiParentSet (handle,phandle)
 {
 var obj,pobj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(arguments.length==1||phandle==0||phandle==null)
  {
  pobj.dom.removeChild(obj.dom);
  obj.parent_handle=0;
  }
 else
  {
  if((pobj=handleCheck(gui_obj.handef,phandle))==null) { return false; }
  pobj.dom.appendChild(obj.dom);
  obj.parent_handle=phandle;
  }
 return true;
 }






 function guiSizeSet (handle,wid,hit)
 {
 var group;

 if((group=guiGroupGet(handle))==null) { return false; }
 group.dom.width=wid;
 group.dom.height=hit;
 return true;
 }




 function guiCssAreaSet (handle,x,y,w,h)
 {
 var group;

 if((group=guiGroupGet(handle))==null) { return false; }
 group.css.left=x+"px";
 group.css.top=y+"px";
 group.css.width=w+"px";
 group.css.height=h+"px";
 return true;
 }



 function guiCssCordSet (handle,x,y)
 {
 var group;

 if((group=guiGroupGet(handle))==null) { return false; }
 group.css.left=x+"px";
 group.css.top=y+"px";
 return true;
 }


 function guiCssSizeSet (handle,w,h)
 {
 var group;

 if((group=guiGroupGet(handle))==null) { return false; }
 group.css.width=w+"px";
 group.css.height=h+"px";
 return true;
 }



 function guiSizeFix (handle,x,y,wid,hit,hq,dv)
 {
 var group,dpr,odpr,w,h,ww,wh;

 if((group=guiGroupGet(handle))==null) { return false; }
 dpr=window.devicePixelRatio||1;
 odpr=dpr;
 if(!hq) { dpr=1; }
 if(dv>1&&dv<=dpr)  {  dpr=dv;  }
 if(dpr>odpr) { dpr=odpr; }
 if(group.obj.type=="canvas")
  {
  ww=document.documentElement.clientWidth||window.innerWidth||document.body.clientWidth;
  wh=document.documentElement.clientHeight||window.innerHeight||document.body.clientHeight;
  w=Math.floor(wid*dpr);
  h=Math.floor(hit*dpr);
  guiSizeSet(handle,w,h);
  }
 else
  {
  guiSizeSet(handle,wid,hit);
  }
 if(x==null&&y==null)  {  guiCssSizeSet(handle,wid,hit);     }
 else                  {  guiCssAreaSet(handle,x,y,wid,hit); }
 if(group.obj.type=="canvas")
  {
  group.ctx.scale(dpr,dpr);
  group.ctx.scale_factor=dpr;
  }
 return true;
 }







 function guiCanvasClear (handle,full)
 {
 var obj,ctx;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 ctx=obj.ctx;
 if(full) { ctx.save();  ctx.setTransform(1,0,0,1,0,0);  }
 ctx.clearRect(0,0,obj.dom.width,obj.dom.height);
 if(full) { ctx.restore();  }
 return true;
 }




 function guiCanvasReset (handle)
 {
 var obj,ctx;
 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 ctx=aa.guiGet(handle,"ctx");
 ctx.globalAlpha=1;
 ctx.mozImageSmoothingEnabled=false;
 ctx.oImageSmoothingEnabled=false;
 ctx.webkitImageSmoothingEnabled=false;
 ctx.imageSmoothingEnabled=false;
 ctx.lineWidth=1.0;
 ctx.lineCap="butt";
 ctx.lineDashOffset=0.0;
 ctx.lineJoin="miter";
 ctx.miterLimit=10.0;
 ctx.shadowColor="none";
 ctx.shadowBlur=0;
 ctx.shadowOffsetX=0;
 ctx.shadowOffsetY=0;
 ctx.textAlign="left";
 ctx.textBaseline="top";
 aa.guiCanvasSmoothingSet(handle,false,null,null,null,null);
 return true;
 }




 function guiCanvasSmoothingSet (handle,state,offx,offy,blur,color)
 {
 var obj;
 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(state==false)
  {
  obj.ctx.mozImageSmoothingEnabled=false;
  obj.ctx.oImageSmoothingEnabled=false;
  obj.ctx.webkitImageSmoothingEnabled=false;
  obj.ctx.imageSmoothingEnabled=false;
  obj.ctx.shadowBlur=0;
  obj.ctx.shadowOffsetX=0;
  obj.ctx.shadowOffsetY=0;
  obj.ctx.shadowColor="none";
  }
 else
  {
  obj.ctx.mozImageSmoothingEnabled=true;
  obj.ctx.oImageSmoothingEnabled=true;
  obj.ctx.webkitImageSmoothingEnabled=true;
  obj.ctx.imageSmoothingEnabled=true;
  obj.ctx.shadowBlur=blur;
  obj.ctx.shadowOffsetX=offx;
  obj.ctx.shadowOffsetY=offy;
  obj.ctx.shadowColor=color;
  }
 return true;
 }





 function guiCanvasTextMeasure (handle,txt)
 {
 var obj,ctx,rec,methit,metwid,metrix,ha,hb;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 ctx=obj.ctx;
 metrix=ctx.measureText(txt);
 methit=0;
 ha=hb=0;
 if(metrix.actualBoundingBoxAscent!==undefined)   {  ha+=metrix.actualBoundingBoxAscent;  }
 if(metrix.actualBoundingBoxDescent!==undefined)  {  ha+=metrix.actualBoundingBoxDescent;  }
 if(metrix.fontBoundingBoxAscent!==undefined)     {  hb+=metrix.fontBoundingBoxAscent;  }
 if(metrix.fontBoundingBoxDescent!==undefined)    {  hb+=metrix.fontBoundingBoxDescent;  }
 methit=((hb-ha)+(ha/2))+2;
 methit=parseInt(methit);
 metwid=0;
 if(metrix.actualBoundingBoxRight!==undefined)   {  metwid+=metrix.actualBoundingBoxRight;  }
 if(metrix.actualBoundingBoxLeft!==undefined)    {  metwid+=metrix.actualBoundingBoxLeft;  }
 metwid=parseInt(metwid)+0;
 rec={};
 rec.type="rect";
 rec.x=0;
 rec.y=0;
 rec.w=metwid;
 rec.h=methit;
 return rec;
 }





 function guiCanvasTextSizeList (handle,weight,family)
 {
 var obj,ofnt,fnt,txt,px,recta,r,nfo,ray=[];

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return null; }
 ofnt=obj.ctx.font;
 txt="^;";
 r=0;
 for(px=4;px<256;px+=4)
  {
  fnt=weight+" "+px+"px "+family;;
  aa.guiCanvasFontSet(handle,fnt);
  recta=aa.guiCanvasTextMeasure(handle,txt);
  nfo={};
  nfo.pixels=px;
  nfo.width=0;
  nfo.height=recta.h;
  ray[r++]=nfo;
  }
 txt="_";
 r=0;
 for(px=4;px<256;px+=4)
  {
  fnt=weight+" "+px+"px "+family;;
  aa.guiCanvasFontSet(handle,fnt);
  recta=aa.guiCanvasTextMeasure(handle,txt);
  nfo=ray[r];
  nfo.width=recta.w;
  ray[r++]=nfo;
  }
 obj.ctx.font=ofnt;
 return ray;
 }






 function guiCanvasImageGet (handle,x,y,w,h)
 {
 var obj,img;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return null; }
 img=obj.ctx.getImageData(x,y,w,h);
 return img;
 }





 function guiCanvasImagePut (handle,x,y,sx,sy,sw,sh,img)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 obj.ctx.putImageData(img,x,y,sx,sy,sw,sh);
 return true;
 }




 function guiCanvasImageDraw (handle,x,y,w,h,dx,dy,dw,dh,dest)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 obj.ctx.drawImage(dest,x,y,w,h,dx,dy,dw,dh);
 return true;
 }


 function guiCanvasScroll (handle,x,y,w,h,sx,sy)
 {
 var obj,img;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 img=obj.ctx.getImageData(x,y,w,h);
 obj.ctx.putImageData(img,x+sx,y+sy,0,0,w,h);
 return true;
 }






 function guiCanvasBorder (handle,x,y,w,h,blw,bcl)
 {
 var obj;
 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 if(bcl) { obj.ctx.strokeStyle=bcl; }
 if(blw) { obj.ctx.lineWidth=blw;   }
 //obj.ctx.strokeRect(x,y,w-blw,h-blw);
 obj.ctx.strokeRect(x,y,w,h);
 return true;
 }



 function guiCanvasFill (handle,x,y,w,h,fcl)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 obj.ctx.beginPath();
 if(fcl) { obj.ctx.fillStyle=fcl; }
 obj.ctx.fillRect(x,y,w,h);//0,0,1,1);//x,y,10,10);//w,h);
 obj.ctx.closePath();
 return true;
 }




 function guiCanvasLine (handle,x1,y1,x2,y2,lw,cl)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 if(cl) { obj.ctx.strokeStyle=cl; }
 if(lw) { obj.ctx.lineWidth=lw;   }
 obj.ctx.beginPath();
 obj.ctx.moveTo(x1,y1);
 obj.ctx.lineTo(x2,y2);
 obj.ctx.stroke();
 return true;
 }



 function guiCanvasFontSet (handle,font)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 obj.ctx.textAlign="left";
 obj.ctx.textBaseline="top";
 obj.ctx.font=font;
 return true;
 }




 function guiCanvasText (handle,x,y,slw,sc,fc,font,text)
 {
 var obj,mes,rec;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 if(font) { obj.ctx.font=font; }
 obj.ctx.textAlign="left";
 obj.ctx.textBaseline="top";
 mes=aa.guiCanvasTextMeasure(obj.han,text);
 rec=aa.guiRectSet(x,y,mes.w,mes.h);
 if(slw) { obj.ctx.lineWidth=slw; }
 if(sc&&slw)  { obj.ctx.strokeStyle=sc; obj.ctx.strokeText(text,rec.x,rec.y);  }

 if(fc)
  {
  obj.ctx.fillStyle=fc;
  obj.ctx.fillText(text,rec.x,rec.y);
  }
 return true;
 }





 function guiCanvasRounded (handle,x,y,w,h,radius,lw,bc,fc)
 {
 var obj,rec,rad;
 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(obj.type!="canvas")                             { return false; }
 rec=aa.guiRectSet(x,y,w,h);
 if(lw) { obj.ctx.lineWidth=lw; obj.ctx.lineJoin="round"; }
 if(fc) { obj.ctx.fillStyle=fc; }
 if(bc) { obj.ctx.strokeStyle=bc; }
 rad={tl:radius,tr:radius,br:radius,bl:radius};
 obj.ctx.beginPath();
 obj.ctx.moveTo(x+radius.tl,y);
 obj.ctx.lineTo(x+w-radius.tr,y);
 obj.ctx.quadraticCurveTo(x+w,y,x+w,y+radius.tr);
 obj.ctx.lineTo(x+w,y+h-radius.br);
 obj.ctx.quadraticCurveTo(x+w,y+h,x+w-radius.br,y+h);
 obj.ctx.lineTo(x+radius.bl,y+h);
 obj.ctx.quadraticCurveTo(x,y+h,x,y+h-radius.bl);
 obj.ctx.lineTo(x,y+radius.tl);
 obj.ctx.quadraticCurveTo(x,y,x+radius.tl,y);
 obj.ctx.closePath();
 if(fc) { obj.ctx.fill(); }
 if(bc) { obj.ctx.stroke(); }
 return true;
 }




 function guiCssOpacitySet (handle,opacity)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 obj.dom.style.opacity=opacity;
 return true;
 }


 function guiCssDisplaySet (handle,pos,zindex,opacity,display)
 {
 var obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(pos)     { obj.dom.style.position=pos;  }
 if(zindex)  { obj.dom.style.zIndex=zindex; }
 if(opacity) { obj.dom.style.opacity=opacity; }
 if(display) { obj.dom.style.display=display; }
 return true;
 }




 function guiCssOutlineSet (handle,pixels,rgba)
 {
 var group;

 if((group=guiGroupGet(handle))==null) { return false; }
 group.css.outline=pixels+"px solid "+rgba;
 group.css.outlineOffset="-"+pixels+"px";
 return true;
 }



 function guiRectsGet (handle)
 {
 var rec,dec,rco,obj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 rco={};
 rec=aa.guiRectSet(0,0,obj.dom.width,obj.dom.height);
 dec=aa.guiRectSet(obj.dom.style.left,obj.dom.style.top,obj.dom.style.width,obj.dom.style.height);

 dec.x=parseInt(dec.x.substring(0,dec.x.length-2));
 dec.y=parseInt(dec.y.substring(0,dec.y.length-2));
 dec.w=parseInt(dec.w.substring(0,dec.w.length-2));
 dec.h=parseInt(dec.h.substring(0,dec.h.length-2));
/*
 dec.x=(dec.x.substring(0,dec.x.length-2));
 dec.y=(dec.y.substring(0,dec.y.length-2));
 dec.w=(dec.w.substring(0,dec.w.length-2));
 dec.h=(dec.h.substring(0,dec.h.length-2));
 */
 rco.can_rect=rec;
 rco.dom_rect=dec;
 if(window.devicePixelRatio) { rco.density=window.devicePixelRatio; }
 else                        { rco.density=1.0; }
 rco.iensity=1.0/rco.density;
 return rco;
 }




 function guiEaseInit (type,start,dest,minstart,maxdest,duration)
 {
 var ez;

 ez={};
 ez.state=true;
 switch(type)
  {
  default:
  case "linear":       case 0:  ez.mode=0;  ez.type="linear"; ez.mul=1; break;
  case "inquad":       case 1:  ez.mode=1;  ez.type="inquad"; ez.mul=1; break;
  case "outquad":      case 2:  ez.mode=2;  ez.type="outquad"; ez.mul=1; break;
  case "inoutquad":    case 3:  ez.mode=3;  ez.type="inoutquad"; ez.mul=2; break;
  case "incube":       case 4:  ez.mode=4;  ez.type="incube"; ez.mul=1; break;
  case "outcube":      case 5:  ez.mode=5;  ez.type="outcube"; ez.mul=1; break;
  case "inoutcube":    case 6:  ez.mode=6;  ez.type="inoutcube"; ez.mul=2; break;
  case "inquart":      case 7:  ez.mode=7;  ez.type="inquart"; ez.mul=1; break;
  case "outquart":     case 8:  ez.mode=8;  ez.type="outquart"; ez.mul=1; break;
  case "inoutquart":   case 9:  ez.mode=9;  ez.type="inoutquart"; ez.mul=2; break;
  case "inquint":      case 10: ez.mode=10; ez.type="inquint"; ez.mul=1; break;
  case "outquint":     case 11: ez.mode=11; ez.type="outquint"; ez.mul=1; break;
  case "inoutquint":   case 12: ez.mode=12; ez.type="inoutquint"; ez.mul=2; break;
  case "insine":       case 13: ez.mode=13; ez.type="insine"; ez.mul=1; break;
  case "outsine":      case 14: ez.mode=14; ez.type="outsine"; ez.mul=1; break;
  case "inoutsine":    case 15: ez.mode=15; ez.type="inoutsine"; ez.mul=2; break;
  case "inexpo":       case 16: ez.mode=16; ez.type="inexpo"; ez.mul=1; break;
  case "outexpo":      case 17: ez.mode=17; ez.type="outexpo"; ez.mul=1; break;
  case "inoutexpo":    case 18: ez.mode=18; ez.type="inoutexpo"; ez.mul=2; break;
  case "incirc":       case 19: ez.mode=19; ez.type="incirc"; ez.mul=1; break;
  case "outcirc":      case 20: ez.mode=20; ez.type="outcirc"; ez.mul=1; break;
  case "inoutcirc":    case 21: ez.mode=21; ez.type="inoutcirc"; ez.mul=2; break;
  case "inback":       case 22: ez.mode=22; ez.type="inback"; ez.mul=1; break;
  case "outback":      case 23: ez.mode=23; ez.type="outback"; ez.mul=1; break;
  case "inoutback":    case 24: ez.mode=24; ez.type="inoutback"; ez.mul=2; break;
  case "inbounce":     case 25: ez.mode=25; ez.type="inbounce"; ez.mul=1; break;
  case "outbounce":    case 26: ez.mode=26; ez.type="outbounce"; ez.mul=1; break;
  case "inoutbounce":  case 27: ez.mode=27; ez.type="inoutbounce"; ez.mul=2; break;
  case "inelastic":    case 28: ez.mode=28; ez.type="inelastic"; ez.mul=1; break;
  case "outelastic":   case 29: ez.mode=29; ez.type="outelastic"; ez.mul=1; break;
  case "inoutelastic": case 30: ez.mode=30; ez.type="inoutelastic"; ez.mul=2; break;
  }
 ez.start=start;
 ez.dest=dest;
 ez.duration=duration;
 ez.times=aa.timerMsRunning();
 ez.timee=ez.times+ez.duration;
 ez.mins=minstart;
 ez.maxd=maxdest;
 return ez;
 }




 function guiEaseProcess (ez)
 {
 var res,s,a,now,z,val,os;

 now=aa.timerMsRunning();
 os=ez.state;
 if(now>=ez.timee) { ez.state=false; }
 if(ez.state!=os)  {  }
 val=(now-ez.times)/ez.duration;
 val=val*ez.mul;
 function _linear(n)       { return n; }
 function _inQuad(n)       { return n*n; }
 function _outQuad(n)      { return n*(2-n); }
 function _inOutQuad(n)    { n*=2;  if(n<1) return 0.5*n*n;  return-0.5*(--n*(n-2)-1); }
 function _inCube(n)       { return n*n*n; }
 function _outCube(n)      { return --n*n*n+1; }
 function _inOutCube(n)    { n*=2;  if(n<1) return 0.5*n*n*n;  return 0.5*((n-=2)*n*n+2); }
 function _inQuart(n)      { return n*n*n*n; }
 function _outQuart(n)     { return 1-(--n*n*n*n); }
 function _inOutQuart(n)   { n*=2;  if(n<1) return 0.5*n*n*n*n;  return -0.5*((n-=2)*n*n*n-2); }
 function _inQuint(n)      { return n*n*n*n*n; }
 function _outQuint(n)     { return --n*n*n*n*n+1; }
 function _inOutQuint(n)   { n*=2;  if(n<1) return 0.5*n*n*n*n*n;  return 0.5*((n-=2)*n*n*n*n+2); }
 function _inSine(n)       { return 1-Math.cos(n*Math.PI/2); }
 function _outSine(n)      { return Math.sin(n*Math.PI/2); }
 function _inOutSine(n)    { return .5*(1-Math.cos(Math.PI*n)); }
 function _inExpo(n)       { return 0==n?0:Math.pow(1024,n-1); }
 function _outExpo(n)      { return 1==n?n:1-Math.pow(2,-10*n); }
 function _inOutExpo(n)    { if(0==n) return 0;
                            if(1==n) return 1;
                            if((n*=2)<1) return .5*Math.pow(1024,n-1);
                            return .5*(-Math.pow(2,-10*(n-1))+2);
                          }
 function _inCirc(n)       { return 1-Math.sqrt(1-n*n); }
 function _outCirc(n)      { return Math.sqrt(1-(--n*n)); }
 function _inOutCirc(n)    { n*=2;  if(n<1) return -0.5*(Math.sqrt(1-n*n)-1);  return 0.5*(Math.sqrt(1-(n-=2)*n)+1); }
 function _inBack(n)       { s=1.70158;  return n*n*((s+1)*n-s); }
 function _outBack(n)      { s=1.70158;  return --n*n*((s+1)*n+s)+1; }
 function _inOutBack(n)    { s=1.70158*1.525;  if((n*=2)<1) return 0.5*(n*n*((s+1)*n-s));  return 0.5*((n-=2)*n*((s+1)*n+s)+2); }
 function _inBounce(n)     { return 1-_outBounce(1-n); }
 function _outBounce(n)    { if(n<(1/2.75))   { return 7.5625*n*n; }
                            if(n<(2/2.75))   { return 7.5625*(n-=(1.5/2.75))*n+0.75;  }
                            if(n<(2.5/2.75)) { return 7.5625*(n-=(2.25/2.75))*n+0.9375;  }
                            return 7.5625*(n-=(2.625/2.75))*n+0.984375;  }
 function _inOutBounce(n)  { if(n<.5) return _inBounce(n*2)*.5;  return  _outBounce(n*2-1)*.5+.5; }
 function _inElastic(n)    { a=0.1; p=0.4;
                            if(n===0) return 0;
                            if(n===1) return 1;
                            if(!a||a<1) { a=1; s=p/4; } else s=p*Math.asin(1/a)/(2*Math.PI);
                            return-(a*Math.pow(2,10*(n-=1))*Math.sin((n-s)*(2*Math.PI)/p));
                          }
 function _outElastic(n)   { a=0.1; p=0.4;
                            if(n===0) return 0;
                            if(n===1) return 1;
                            if(!a||a<1) { a=1; s=p/4; }  else s=p*Math.asin(1/a)/(2*Math.PI);
                            return (a*Math.pow(2,-10*n)*Math.sin((n-s)*(2*Math.PI)/p)+1);
                            }
 function _inOutElastic(n) { a=0.1; p=0.4;
                            if(n===0) return 0;
                            if(n===1) return 1;
                            if(!a||a<1) { a=1; s=p/4; }  else s=p*Math.asin(1/a)/(2*Math.PI);
                            if((n*=2)<1) return-0.5*(a*Math.pow(2,10*(n-=1))*Math.sin((n-s)*(2*Math.PI)/p));
                            return a*Math.pow(2,-10*(n-=1))*Math.sin((n-s)*(2*Math.PI)/p)*0.5+1;
                            }
 switch(ez.mode)
  {
  case 0:  res=_linear(val);       break;
  case 1:  res=_inQuad(val);       break;
  case 2:  res=_outQuad(val);      break;
  case 3:  res=_inOutQuad(val);    break;
  case 4:  res=_inCube(val);       break;
  case 5:  res=_outCube(val);      break;
  case 6:  res=_inOutCube(val);    break;
  case 7:  res=_inQuart(val);      break;
  case 8:  res=_outQuart(val);     break;
  case 9:  res=_inOutQuart(val);   break;
  case 10: res=_inQuint(val);      break;
  case 11: res=_outQuint(val);     break;
  case 12: res=_inOutQuint(val);   break;
  case 13: res=_inSine(val);       break;
  case 14: res=_outSine(val);      break;
  case 15: res=_inOutSine(val);    break;
  case 16: res=_inExpo(val);       break;
  case 17: res=_outExpo(val);      break;
  case 18: res=_inOutExpo(val);    break;
  case 19: res=_inCirc(val);       break;
  case 20: res=_outCirc(val);      break;
  case 21: res=_inOutCirc(val);    break;
  case 22: res=_inBack(val);       break;
  case 23: res=_outBack(val);      break;
  case 24: res=_inOutBack(val);    break;
  case 25: res=_inBounce(val);     break;
  case 26: res=_outBounce(val);    break;
  case 27: res=_inOutBounce(val);  break;
  case 28: res=_inElastic(val);    break;
  case 29: res=_outElastic(val);   break;
  case 30: res=_inOutElastic(val); break;
  }
 z=ez.start+(ez.dest-ez.start)*res;
 if(z<=ez.mins)  { z=ez.mins; }
 if(z>=ez.maxd)  { z=ez.maxd  }
 return z;
 }




 function guiRgbaString (r,g,b,a)
 {
 return(aa.stringParms("rgb",r,g,b,a));
 //return("rgba("+r+","+g+","+b+","+a+")");
 }


 function guiRgbaStringCommon (index)
 {
 switch(index%14)
  {
  case 0:  return(guiRgbaString(0,0,0,1));
  case 1:  return(guiRgbaString(255,255,255,1));
  case 2:  return(guiRgbaString(255,0,0,1));
  case 3:  return(guiRgbaString(0,255,0,1));
  case 4:  return(guiRgbaString(0,0,255,1));
  case 5:  return(guiRgbaString(0,255,255,1));
  case 6:  return(guiRgbaString(255,0,255,1));
  case 7:  return(guiRgbaString(255,255,0,1));
  case 8:  return(guiRgbaString(255,128,128,1));
  case 9:  return(guiRgbaString(128,255,128,1));
  case 10: return(guiRgbaString(128,128,255,1));
  case 11: return(guiRgbaString(128,255,255,1));
  case 12: return(guiRgbaString(255,128,255,1));
  case 13: return(guiRgbaString(255,255,128,1));

  }
 }




 function guiRectSet (x,y,w,h)
 {
 var rec={};
 rec.type='rect';
 rec.x=x;
 rec.y=y;
 rec.w=w;
 rec.h=h;
 return rec;
 }




 function guiRectAdjust (rec,xa,ya,wa,ha)
 {
 rec.x+=xa;
 rec.y+=ya;
 rec.w+=wa;
 rec.h+=ha;
 return rec;
 }



   /*
 function guiRectAdd (rec,arec)
 {
 var ax1,ay1,ax2,ay2;
 var bx1,by1,bx2,by2;
 var dx1,dy1,dx2,dy2;
 var res;

 ax1=rec.x;
 ay1=rec.y;
 ax2=(rec.x+rec.w)-1;
 ay2=(rec.y+rec.h)-1;

 bx1=arec.x;
 by1=arec.y;
 bx2=(arec.x+raec.w)-1;
 by2=(arec.y+raec.h)-1;

 dx1=((ax1<bx1)?ax1:bx1);
 dx2=((ax2>bx2)?ax2:bx2);
 dy1=((ay1<by1)?ay1:by1);
 dy2=((ay2>by2)?ay2:by2);

 res.x={};
 res.x=dx1;
 res.y=dy1;
 res.w=(dx2-dx1)+1;
 res.h=(dy2-dy1)+1;

 //aaRectSet(resrect,cd1.x,cd1.y,(cd2.x-cd1.x)+1,(cd2.y-cd1.y)+1);
 UnionRect(&rr3,&rr1,&rr2);
 ro.x=rr3.left;
 ro.y=rr3.top;
 ro.w=rr3.right-rr3.left;
 ro.h=rr3.bottom-rr3.top;
 if(ro.x!=resrect->x||ro.y!=resrect->y||ro.w!=resrect->w||ro.h!=resrect->h)
  {
  aaRectCopy(resrect,rect2);
  }

 */


 function guiAreaSet (l,t,w,h)
 {
 var area={};
 area.type="area";
 area.left=l;
 area.top=t;
 area.width=w;
 area.height=h;
 area.lstr=area.left+"px";
 area.tstr=area.top+"px";
 area.wstr=area.width+"px";
 area.hstr=area.height+"px";
 return area;
 }


 function guiAreaAdjust (area,la,ta,wa,ha)
 {
 if(area.type!="area") { aa.debugAlert(); }
 area.type="area";
 area.left+=la;
 area.top+=ta;
 area.width+=wa;
 area.height+=ha;
 area.lstr=area.left+"px";
 area.tstr=area.top+"px";
 area.wstr=area.width+"px";
 area.hstr=area.height+"px";
 return area;
 }





 function guiRgbaSet (r,g,b,a)
 {
 var rgba={};
 rgba.type="rgba";
 rgba.r=r;
 rgba.g=g;
 rgba.b=b;
 rgba.a=a;
 return rgba;
 }



 function guiRgbaAdjust (rgba,ra,ga,ba,aa)
 {
 if(rgba.type!="rgba") { return rgba; }
 rgba.r+=ra;
 rgba.g+=ga;
 rgba.b+=ba;
 rgba.a+=aa;
 return rgba;
 }





 function guiRgbaToHsva (rgba)
 {
 var hsva;
 var r,g,b;
 var h,s,v;
 var max,min,d;

 if(rgba.type!="rgba") { return rgba; }
 r=rgba.r;
 g=rgba.g;
 b=rgba.b;
 max=Math.max(r,g,b);
 min=Math.min(r,g,b);
 v=max;
 d=max-min;
 s=max===0?0:d/max;
 if(max==min)
  {
  h=0;
  }
 else
  {
  switch(max)
   {
   case r: h=(g-b)/d+(g<b?6:0); break;
   case g: h=(b-r)/d+2; break;
   case b: h=(r-g)/d+4; break;
   }
  h/=6;
  }
 v=v/255;
 hsva=guiHsvaSet(h,s,v,rgba.a);
 return hsva;
 }





 function guiRgbaToString (rgba)
 {
 if(rgba.type!="rgba") { return rgba; }
 return("rgba("+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+")");
 }








 function guiHsvaSet (h,s,v,a)
 {
 var hsva={};
 hsva.type="hsva";
 hsva.h=h;
 hsva.s=s;
 hsva.v=v;
 hsva.a=a;
 return hsva;
 }



 function guiHsvaAdjust (hsva,ha,sa,va,aa)
 {
 if(hsva.type!="hsva") { return hsva; }
 hsva.h+=ha;
 hsva.s+=sa;
 hsva.v+=va;
 hsva.a+=aa;
 return hsva;
 }




 function guiHsvaToRgba (hsva)
 {
 var r,g,b;
 var i,f,p,q,t;
 var rgba;

 if(hsva.type!="hsva") { return hsva; }
 i=Math.floor(hsva.h*6);
 f=hsva.h*6-i;
 p=hsva.v*(1-hsva.s);
 q=hsva.v*(1-f*hsva.s);
 t=hsva.v*(1-(1-f)*hsva.s);
 switch(i%6)
  {
  case 0: r=hsva.v, g=t, b=p; break;
  case 1: r=q, g=hsva.v, b=p; break;
  case 2: r=p, g=hsva.v, b=t; break;
  case 3: r=p, g=q, b=hsva.v; break;
  case 4: r=t, g=p, b=hsva.v; break;
  case 5: r=hsva.v, g=p, b=q; break;
  }
 r=Math.round(r*255);
 g=Math.round(g*255);
 b=Math.round(b*255);
 rgba=guiRgbaSet(r,g,b,hsva.a);
 return rgba;
 }





 function guiUpdateAreaInit ()
 {
 var obj;
 obj={};
 obj.type="updatearea";
 obj.state=0;
 obj.is_fin=false;
 obj.rect=guiRectSet(0,0,0,0);
 return obj;
 }



 function guiUpdateAreaFin (obj)
 {
 if(obj.type!="updatearea") { return null; }
 obj.is_fin=true;
 return obj;
 }



 function guiUpdateAreaAdd (obj,x,y,w,h)
 {
 var x1,y1,x2,y2;
 var x3,y3,x4,y4;

 if(obj.type!="updatearea") { return null; }
 if(obj.state==0)
  {
  obj.rect.x=x;
  obj.rect.y=y;
  obj.rect.w=w;
  obj.rect.h=h;
  obj.state=1;
  }
 else
  {
  x1=obj.rect.x;
  y1=obj.rect.y;
  x2=(obj.rect.x+obj.rect.w)-1;
  y2=(obj.rect.y+obj.rect.h)-1;
  x3=x;
  y3=y;
  x4=(x+w)-1;
  y4=(y+h)-1;
  if(x3<x1) { x1=x3; }
  if(x4>x2) { x2=x4; }
  if(y3<y1) { y1=y3; }
  if(y4>y2) { y2=y4; }
  obj.rect.x=x1;
  obj.rect.y=x2;
  obj.rect.w=(x2-x1)+1;
  obj.rect.h=(y2-y1)+1;
  }
 return obj;
 }





/*-----------------------------------------------------------------------*/



 function mediaObjInit ()
 {
 var state;

 if(Object.keys(media_obj).length!=0) { return; }
 state={};
 state.detect_stage=0;
 state.detect_state="idle";
 state.detect_obj={};
 media_obj.handef=handleDefine("media",128);
 media_obj.state=state;
 media_obj.is_init=true;
 }





 function mediaDeviceDetect ()
 {
 var obj,constraints;

 obj=media_obj;
 switch(obj.state.detect_stage)
  {
  case 0:
  obj.state.detect_stage=100;
  aa.mainWorkerAdd("media.Detect",mediaDeviceDetect,1);
  break;

  case 100:
  obj.state.detect_state="detecting";
  obj.state.detect_obj={};
  obj.state.detect_obj.res=null;
  obj.state.detect_obj.e_name=null;
  obj.state.detect_obj.e_msg=null;
  obj.state.detect_obj.stream=null;
  obj.state.detect_stage=120;
  break;

  case 120:
  constraints={audio:true,video:true};
  navigator.mediaDevices.getUserMedia(constraints)
  .then((stream)=>
   {
   obj.state.detect_obj.res="ok";
   obj.state.detect_obj.stream=stream;
   obj.state.detect_obj.stream.getTracks().forEach(function(track) {  track.stop();  });
   })
  .catch(function(error)
   {
   obj.state.detect_obj.res="err";
   obj.state.detect_obj.e_name=error.name;
   obj.state.detect_obj.e_msg=error.message;
   //aa.debugLog(error.name+"  "+error.message);
   });
  obj.state.detect_stage=140;
  break;


  case 140:
  if(obj.state.detect_obj.res==null) { break; }
  if(obj.state.detect_obj.res!="ok")
   {
   obj.state.detect_state="failed";
   aa.mainWorkerRemove("media.Detect");
   obj.state.detect_stage=166;
   break;
   }
  obj.state.detect_stage=200;
  break;

  case 166:
  break;

  case 200:
  obj.state.detect_obj={};
  obj.state.detect_obj.res=null;
  obj.state.detect_obj.devix=0;
  obj.state.detect_obj.ready=false;
  obj.state.detect_obj.e_name=null
  obj.state.detect_obj.e_msg=null
  obj.state.detect_obj.ray=[];
  obj.state.detect_obj.cap=[];
  obj.state.detect_stage=220;
  break;

  case 220:
  navigator.mediaDevices.enumerateDevices()
  .then(function(devs)
   {
   devs.forEach(function(device)
    {
    obj.state.detect_obj.ray[obj.state.detect_obj.devix]=device;
    if(device.getCapabilities) { obj.state.detect_obj.cap[obj.state.detect_obj.devix]=device.getCapabilities(); }
    else                       { obj.state.detect_obj.cap[obj.state.detect_obj.devix]=null;  }
    //console.log( navigator.mediaDevices.getSupportedConstraints());
    obj.state.detect_obj.devix++;
    });
   obj.state.detect_obj.res="ok";
   //obj.state.detect_obj.ready=true;
   })
  .catch(function(error)
   {
   obj.state.detect_obj.res="err";
   obj.state.detect_obj.e_name=error.name;
   obj.state.detect_obj.e_msg=error.message;
   //obj.state.detect_obj.ready=true;
   });
  obj.state.detect_stage=240;
  break;



  case 240:
  if(obj.state.detect_obj.res==null) { break; }
  if(obj.state.detect_obj.res!="ok")
   {
   obj.state.detect_state="failed";
   obj.state.detect_obj.ready=true;
   aa.mainWorkerRemove("media.Detect");
   obj.state.detect_stage=266;

   break;
   }
  obj.state.detect_state="ready";
  obj.state.detect_obj.ready=true;
  aa.mainWorkerRemove("media.Detect");
  obj.state.detect_stage=300;
  break;


  case 300:
  break;
  }
 }




 function mediaDeviceCountGet (kind)
 {
 var obj,i,c,dev;

 obj=media_obj;
 if(obj.state.detect_state!="ready") { return -1; }
 c=0;
 for(i=0;i<obj.state.detect_obj.ray.length;i++)
  {
  dev=obj.state.detect_obj.ray[i];
  if(kind!=null&&dev.kind!=kind) { continue; }
  c++;
  }
 return c;
 }




 function mediaDeviceGet (kind,index)
 {
 var obj,i,c,dev;

 obj=media_obj;
 if(obj.state.detect_state!="ready") { return null; }
 c=0;
 for(i=0;i<obj.state.detect_obj.ray.length;i++)
  {
  dev=obj.state.detect_obj.ray[i]
  if(dev.kind!=kind) { continue; }
  if(c!=index) { c++; continue; }
  return dev;
  }
 return null;
 }



 function mediaDeviceCapsGet (kind,index)
 {
 var obj,i,c,dev;

 obj=media_obj;
 if(obj.state.detect_state!="ready") { return null; }
 c=0;
 for(i=0;i<obj.state.detect_obj.ray.length;i++)
  {
  dev=obj.state.detect_obj.ray[i]
  if(dev.kind!=kind) { continue; }
  if(c!=index) { c++; continue; }
  dev=obj.state.detect_obj.cap[i];
  return dev;
  }
 return null;
 }





 function mediaCreate (vconstraints,aconstraints)
 {
 var i,h,obj;

 if(media_obj.is_init!=true) { return 0; }
 if(media_obj.state.detect_state!="ready") { return 0; }
 for(i=0;i<media_obj.handef.slots;i++)
  {
  obj=media_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  h=handleUse(media_obj.handef,i)
  obj.v_contraints=vconstraints;
  obj.a_contraints=aconstraints;
  obj.avc={};
  if(vconstraints) { obj.avc.video=obj.v_contraints; }
  if(aconstraints) { obj.avc.audio=obj.a_contraints; }
  obj.res=null;
  obj.e_name=null;
  obj.e_msg=null;
  obj.stream=null;
  obj.a_stream=null;
  obj.v_stream=null;
  obj.output_media_stream=null;
  obj.output_tracks=[];
  obj.stage=100;
  return h;
  }
 return 0;
 }





 function mediaDestroy (handle)
 {
 var obj;

 if(media_obj.state.detect_state!="ready") { return false; }
 if((obj=handleCheck(media_obj.handef,handle))==null) { return false; }
 handleRemove(media_obj.handef,handle);
 return true;
 }


 function mediaGet (handle)
 {
 return(handleCheck(media_obj.handef,handle));
 }




 function mediaAttach (handle,dhandle)
 {
 var obj,dobj,isplaying;

 if((obj=handleCheck(media_obj.handef,handle))==null) { return false; }
 if(dhandle!=null)
  {
  //console.log("dwd");
  if((dobj=aa.guiGet(dhandle))==null)          { return false; }
  dobj.dom.srcObject=null;
  dobj.dom.srcObject=obj.output_media_stream;
  dobj.frame_number=0;
  dobj.prev_time=-1;
  //console.log(obj.output_media_stream);
  isplaying=dobj.dom.currentTime>0&&!dobj.dom.paused&&!dobj.dom.ended&&dobj.dom.readyState>2;
  //console.log("isp="+isplaying);
  if(!isplaying) { dobj.dom.play();  }
  }
 else
  {
  dobj.dom.srcObject=null;
  dobj.frame_number=0;
  dobj.prev_time=-1;
  }
 return true;
 }




 function mediaStatus (handle)
 {
 var obj;

 if((obj=handleCheck(media_obj.handef,handle))==null) { return false; }
 switch(obj.stage)
  {
  case 100:
  navigator.mediaDevices.getUserMedia(obj.avc)
  .then(function(stream)
   {
   obj.res="ok";
   obj.stream=stream;
   obj.a_stream=stream.getAudioTracks()[0];
   obj.v_stream=stream.getVideoTracks()[0];
   //console.log(obj.a_stream);
   //console.log(obj.a_stream.getSettings());
   //console.log(obj.a_stream.getConstraints());
   })
  .catch(function(error)
   {
   obj.res="err";
   obj.e_name=error.name;
   obj.e_msg=error.message;
   });
  obj.stage=200;
  break;

  case 200:
  if(obj.res==null) { break; }
  if(obj.v_contraints)   {   obj.output_tracks=obj.output_tracks.concat(obj.v_stream);   }
  if(obj.a_contraints)   {   obj.output_tracks=obj.output_tracks.concat(obj.a_stream);   }
  if(typeof MediaStream!=='undefined')   {   obj.output_media_stream=new MediaStream(obj.output_tracks);   }
  else                                   {   obj.output_media_stream=obj.stream;  alert("3611"); }
  //console.log(obj.a_stream.getCapabilities());
  //console.log(obj.output_media_stream.getAudioTracks());//.sampleRate);
  //console.log(obj.a_stream);
  obj.stage=300;
  break;

  case 300:
  return true;
  }
 return false;
 }




/*-----------------------------------------------------------------------*/





 function socketObjInit ()
 {
 if(Object.keys(socket_obj).length!=0) { return; }
 socket_obj.handef=handleDefine("socket",128);
 socket_obj.is_init=true;
 }




 function socketCreate (url)
 {
 var i,h,obj;

 for(i=0;i<socket_obj.handef.slots;i++)
  {
  obj=socket_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  h=handleUse(socket_obj.handef,i)
  obj.stage=0;
  obj.ms_start=aa.timerMsRunning();
  obj.rcve_queue_handle=aa.queueCreate();
  obj.xmit_queue_handle=aa.queueCreate();
  obj.url=url;
  obj.is_open=false;
  obj.is_closed=false;
  obj.is_error=false;
  obj.is_direct=true;
  obj.vars={};
  obj.socket=new WebSocket(obj.url);
  obj.socket.binaryType='arraybuffer';
  obj.socket.onopen=function()  { obj.is_open=true;   }
  obj.socket.onclose=function() { aa.debugLog("close");  obj.is_closed=true; }
  obj.socket.onerror=function() { aa.debugLog("errse");  obj.is_error=true;  }
  obj.socket.onmessage=function(data)
   {
   //aa.debugLog(data.target.binaryType+"  "+data.srcElement.binaryType);
   queueWrite(obj.rcve_queue_handle,data.data);
   }
  return h;
  }
 return 0;
 }







 function socketDestroy (handle)
 {
 var obj;

 if((obj=handleCheck(socket_obj.handef,handle))==null) { return false; }
 queueDestroy(obj.xmit_queue_handle);
 obj.xmit_queue_handle=0;
 queueDestroy(obj.rcve_queue_handle);
 obj.rcve_queue_handle=0;
 obj.socket.onclose=function() {};
 obj.socket.close();
 obj.socket=null;
 obj.vars=null;
 handleRemove(socket_obj.handef,handle);
 return true;
 }




 function socketGet (handle)
 {
 return(handleCheck(socket_obj.handef,handle));
 }




 function socketWrite (handle,msg)
 {
 var obj;

 if((obj=socketGet(handle))==null) { return false; }
 if(aa.queueWrite(obj.xmit_queue_handle,msg)!=true) { return false; }
 if(obj.is_direct==true)  { socketProcess(handle); }
 return true;
 }




 function socketPeek (handle,ofs)
 {
 var obj,msg;

 if((obj=socketGet(handle))==null) { return null; }
 msg=queuePeek(obj.rcve_queue_handle,ofs);
 return msg;
 }





 function socketRead (handle)
 {
 var obj,msg;

 if((obj=socketGet(handle))==null) { return null; }
 msg=queueRead(obj.rcve_queue_handle);
 return msg;
 }



 function socketDiscard (handle)
 {
 var obj;

 if((obj=socketGet(handle))==null) { return null; }
 return(queueDiscard(obj.rcve_queue_handle));
 }



 function socketProcess (handle)
 {
 var obj,info,msg;

 if((obj=socketGet(handle))==null) { return false; }
 info=socketStatus(handle);
 if(info.xmit_queue_status.msgs_queued>0&&info.is_open==true&&info.is_closed==false)
  {
  msg=queueRead(obj.xmit_queue_handle);
  obj.socket.send(msg,{ binary: true });
  socketStatus(handle);
  }
 return true;
 }





 function socketStatus (handle)
 {
 var obj,info;

 if((obj=socketGet(handle))==null) { return null; }
 info={};
 info.url=obj.url;
 info.is_open=obj.is_open;
 info.is_closed=obj.is_closed;
 info.is_error=obj.is_error;
 info.ms=aa.timerMsRunning()-obj.ms_start;
 info.rcve_queue_status=aa.queueStatus(obj.rcve_queue_handle);
 info.xmit_queue_status=aa.queueStatus(obj.xmit_queue_handle);
 return info;
 }




 function socketYield ()
 {
 var go,h;

 if(socket_obj.handef.count==0) { return false; }
 for(go=0;go<socket_obj.handef.slots;go++)
  {
  if((h=handleNext(socket_obj.handef))==0) { continue; }
  socketProcess(h);
  return true;
  }
 return false;
 }




/*-----------------------------------------------------------------------*/




 function roomObjInit ()
 {
 if(Object.keys(room_obj).length!=0) { return; }
 room_obj.handef=handleDefine("room",128);
 room_obj.is_init=true;
 }




 function roomCreate (maxpeers)
 {
 var i,h,obj,p,peer;

 for(i=0;i<room_obj.handef.slots;i++)
  {
  obj=room_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  h=handleUse(room_obj.handef,i)
  obj.stage=0;
  obj.vars={};
  obj.room_name=null;
  obj.my_id=0;
  obj.my_alias=null;
  obj.peer_pf=0;
  obj.peer_count=0;
  obj.peer_slots=maxpeers;
  obj.peer_pf=0;
  obj.peer_array=[];
  for(p=0;p<obj.peer_slots;p++)
   {
   peer={};
   peer.in_use=false;
   peer.is_me=false;
   peer.is_leaving=false;
   peer.id_dif=0;
   peer.self_index=p;
   peer.id=null;
   peer.alias=null;
   peer.vars={};
   obj.peer_array[p]=peer;
   }
  //console.log("room create "+h+" "+maxpeers);
  return h;
  }
 return 0;
 }



 function roomDestroy (handle)
 {
 var obj,p,peer;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return false; }
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  peer.vars={};
  peer={};
  obj.peer_array[p]=peer;
  }
 obj.vars={};
 handleRemove(room_obj.handef,handle);
 return true;
 }




 function roomGet (handle)
 {
 return(handleCheck(room_obj.handef,handle));
 }





 function roomSet (handle,name,myid,myalias)
 {
 var obj;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return false; }
 obj.room_name=name;
 obj.my_id=myid;
 obj.my_alias=myalias;
 return true;
 }




 function roomPeerJoin (handle,id,alias)
 {
 var obj,p,peer;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return false; }
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  if(peer.in_use!=true) { continue; }
  if(peer.id==id) { return false; }
  }
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  if(peer.in_use==false) { break; }
  }
 if(p==obj.peer_slots) { return false; }
 //console.log("room join "+p+"  "+id+"  "+alias);
 peer.in_use=true;
 peer.self_index=p;
 peer.id=id;
 peer.alias=alias;
 if(peer.id==obj.my_id&&peer.alias==obj.my_alias) { peer.is_me=true; }
 else                                             { peer.is_me=false; }
 peer.id_dif=peer.id.localeCompare(obj.my_id);
 peer.vars={};
 peer.vars.stage=0;
 obj.peer_array[p]=peer;
 obj.peer_count++;
 return true;
 }



 function roomPeerLeaving (handle,id)
 {
 var obj,p,peer;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return false; }
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  if(peer.in_use!=true) { continue; }
  if(peer.id==id)
   {
   if(peer.is_leaving==true) { return true; }
   peer.is_leaving=true;
   return true;
   }
  }
 return false;
 }





 function roomPeerLeave (handle,id)
 {
 var obj,p,peer;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return false; }
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  if(peer.in_use!=true) { continue; }
  if(peer.id==id)
   {
   peer.in_use=false;
   peer.is_me=false;
   peer.is_leaving=false;
   peer.self_index=p;
   peer.vars={};
   obj.peer_array[p]=peer;
   obj.peer_count--;
   return true;
   }
  }
 return false;
 }




 function roomPeerNext (handle)
 {
 var obj,pf,peer,s,c;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return false; }
 c=0;
 for(s=0;s<obj.peer_slots;s++)
  {
  if(c>=obj.peer_count) { break; }
  pf=obj.peer_pf;
  if(pf>=obj.peer_slots) { pf=0; }
  peer=obj.peer_array[pf];
  if(peer.in_use!=true) { obj.peer_pf=pf+1; continue; }
  obj.peer_pf=pf+1;
  return peer;
  }
 return null;
 }




 function roomPeerByAlias (handle,alias)
 {
 var obj,p,peer;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return null; }
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  if(peer.in_use!=true) { continue; }
  if(peer.alias!=alias) { continue; }
  return peer;
  }
 return null;
 }



 function roomPeerById (handle,id)
 {
 var obj,p,peer;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return null; }
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  if(peer.in_use!=true) { continue; }
  if(peer.id!=id) { continue; }
  return peer;
  }
 return null;
 }



 function roomPeerByIndex (handle,index)
 {
 var obj,p,peer,c;

 if((obj=handleCheck(room_obj.handef,handle))==null) { return null; }
 c=0;
 for(p=0;p<obj.peer_slots;p++)
  {
  peer=obj.peer_array[p];
  if(peer.in_use!=true) { continue; }
  if(c!=index) { c++; continue; }
  return peer;
  }
 return null;
 }





/*-----------------------------------------------------------------------*/




 function dspObjInit ()
 {
 if(Object.keys(dsp_obj).length!=0) { return; }
 dsp_obj.is_init=true;
 }




 function dspAudioResample (sourceDataf32,sampleRate,srcSizeSampleCount,newSampleRate)
 {
 var dstSize,destinationData,iaccum,oaccum,iratio,oratio,i_pos,o_pos,ii,oo;

 iaccum=0;
 oaccum=0;
 i_pos=0;
 o_pos=0;
 iratio=sampleRate/newSampleRate;
 oratio=1.0;
 dstSize=Math.ceil(srcSizeSampleCount/iratio);
 destinationData=new Float32Array(dstSize);
 while(1)
  {
  ii=i_pos|0;
  oo=o_pos|0;
  if(ii>=srcSizeSampleCount) { break; }
  if(oo>=dstSize)            { break; }
  destinationData[oo]=sourceDataf32[ii];
  oaccum+=oratio;    o_pos=oaccum;
  iaccum+=iratio;    i_pos=iaccum;
  }
 return destinationData;
 }



 function dspSineWaveAt (rate,sampleNumber,tone)
 {
 var sampleFreq=rate/tone;
 return Math.sin(sampleNumber/(sampleFreq/(Math.PI*2)));
 }



 function dspZigZag (size)
 {
 var i,j,e,obj={};

 obj.type="zigzag";
 obj.width=size;
 obj.height=size;
 obj.matrix=[];
 for(i=0;i<size;i++) { obj.matrix[i]=[]; }
 i=1;
 j=1;
 for(e=0;e<size*size;e++)
  {
  obj.matrix[i-1][j-1]=e|0;
  if((i+j)%2==0)
   {
   if(j<size) { j++;  }
   else       { i+=2; }
   if(i>1)    { i--; }
   }
  else
   {
   if(i<size) { i++; }
   else       { j+=2; }
   if(j>1)    { j--; }
   }
  }
 return obj;
 }



 function dspGetBlock (rgbaframe,framewid,framehit,channel,blksize,blkx,blky,block)
 {
 var bx,by,px,py,off,z,skp;

 off=((blky*framewid*4)+(blkx*4)+channel)|0;
 z=0|0;
 skp=((framewid*4)-(blksize*4))|0;
 for(py=0|0;py<blksize|0;py++)
  {
  for(px=0|0;px<blksize|0;px++)
   {
   block[z]=rgbaframe[off|0];
   off+=4|0;
   z+=1|0;
   }
  off+=skp|0;
  }
 return block;
 }




 function dspSetBlock (rgbaframe,framewid,framehit,channel,blksize,blkx,blky,block)
 {
 var bx,by,px,py,off,z,skp;

 off=((blky*framewid*4)+(blkx*4)+channel)|0;
 z=0|0;
 skp=((framewid*4)-(blksize*4))|0;
 for(py=0|0;py<blksize|0;py++)
  {
  for(px=0|0;px<blksize|0;px++)
   {
   rgbaframe[off|0]=block[z];
   off+=4|0;
   z+=1|0;
   }
  off+=skp|0;
  }
 }



/*-----------------------------------------------------------------------*/




 function bitioObjInit ()
 {
 if(Object.keys(bitio_obj).length!=0) { return; }
 bitio_obj.handef=handleDefine("bitio",128);
 bitio_obj.is_init=true;
 }




 function bitioCreate ()
 {
 var i,h,obj;

 for(i=0;i<bitio_obj.handef.slots;i++)
  {
  obj=bitio_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  h=handleUse(bitio_obj.handef,i)
  obj.vars={};
  obj.main_array=[];
  obj.head_bit_buf=0|0;
  obj.head_bit_count=0;
  obj.tail_bit_buf=0|0;
  obj.tail_bit_count=0;
  return h;
  }
 return 0;
 }



 function bitioDestroy (handle)
 {
 var obj;

 if((obj=handleCheck(bitio_obj.handef,handle))==null) { return false; }
 obj.vars={};
 handleRemove(bitio_obj.handef,handle);
 return true;
 }




 function bitioGet (handle)
 {
 return(handleCheck(bitio_obj.handef,handle));
 }




 function bitioStatus (handle)
 {
 var obj,status;

 if((obj=bitioGet(handle))==null) { return null; }
 status={};
 status.total_bits=(obj.main_array.length*8)+obj.head_bit_count+obj.tail_bit_count;
 status.total_bytes=0;
 if(status.total_bits>0)
  {
  status.total_bytes=(status.total_bits/8)|0;
  if((status.total_bits%8)!=0) { status.total_bytes++; }
  }
 return status;
 }






 function bitioRead (handle)
 {
 var obj,buffer,i,len,val;

 if((obj=bitioGet(handle))==null) { return null; }
 buffer=0;
 i=0;
 len=obj.main_array.length;
 for(;i<len;i++)
  {
  buffer=obj.main_array[i]&((1<<obj.head_bit_count)-1);
  obj.main_array[i]=(obj.head_bit_buf<<(8-obj.head_bit_count))|(obj.main_array[i]>>>obj.head_bit_count);
  obj.head_bit_buf=buffer;
  }
 obj.tail_bit_buf|=obj.head_bit_buf<<obj.tail_bit_count;
 obj.tail_bit_count+=obj.head_bit_count;
 obj.head_bit_buf=0;
 obj.head_bit_count=0;
 if(obj.tail_bit_count>=8)
  {
  obj.main_array.push(obj.tail_bit_buf>>>(obj.tail_bit_count-8));
  obj.tail_bit_buf&=(1<<(obj.tail_bit_count-8))-1;
  obj.tail_bit_count-=8;
  }
 val=obj.main_array.shift();
 return val;
 }





 function bitioWrite (handle,bits,val,prepend)
 {
 var obj;

 if((obj=bitioGet(handle))==null) { return false; }
 if(prepend==true)
  {
  obj.head_bit_buf|=(val<<obj.head_bit_count);
  obj.head_bit_count+=bits;
  while(obj.head_bit_count>=8)
   {
   obj.main_array.unshift(obj.head_bit_buf&255);
   obj.head_bit_buf>>>=8;
   obj.head_bit_count-=8;
   }
  }
 else
  {
  obj.tail_bit_buf=(obj.tail_bit_buf<<bits)|val;
  obj.tail_bit_count+=bits;
  while(obj.tail_bit_count>=8)
   {
   obj.main_array.push(obj.tail_bit_buf>>>(obj.tail_bit_count-8));
   obj.tail_bit_buf&=(1<<(obj.tail_bit_count-8))-1;
   obj.tail_bit_count-=8;
   }
  }
 return true;
 }




/*-----------------------------------------------------------------------*/



 function rtcObjInit ()
 {
 if(Object.keys(rtc_obj).length!=0) { return; }
 rtc_obj.handef=handleDefine("rtc",128);
 rtc_obj.is_init=true;
 }




 function rtcCreate (config)
 {
 var i,h,obj;

 for(i=0;i<rtc_obj.handef.slots;i++)
  {
  obj=rtc_obj.handef.array[i];
  if(obj.in_use!=false) { continue; }
  h=handleUse(rtc_obj.handef,i)
  obj.vars={};
  obj.vars.stage=10;
  obj.vars.is_busy=false;
  obj.vars.promise_info=null;
  obj.vars.promise_object=null;
  obj.vars.prosync_handle=0;
  obj.vars.loc_desc=null;
  obj.vars.rem_desc=null;
  obj.vars.offer=null;
  obj.vars.answer=null;
  obj.vars.ice_queue_handle=aa.queueCreate();
  obj.vars.ice_queue_status=aa.queueStatus(obj.vars.ice_queue_handle);
  obj.vars.data_channel=[];
  obj.vars.pc_config=Object.assign({},config);
  obj.vars.pc=new RTCPeerConnection(obj.vars.pc_config);
  obj.vars.pc.self_handle=h;
  obj.vars.pc.onconnectionstatechange=function(e)    { rtcOnProc(this,"onconnectionstatechange",e);   };
  obj.vars.pc.onicecandidate=function(e)             { rtcOnProc(this,"onicecandidate",e);   };
  obj.vars.pc.oniceconnectionstatechange=function(e) { rtcOnProc(this,"oniceconnectionstatechange",e);   };
  obj.vars.pc.onicegatheringstatechange=function(e)  { rtcOnProc(this,"onicegatheringstatechange",e);   };
  obj.vars.pc.onsignalingstatechange=function(e)     { rtcOnProc(this,"onsignalingstatechange",e);   };
  obj.vars.pc.onnegotiationneeded=function(e)        { rtcOnProc(this,"onnegotiationneeded",e);   };
  obj.vars.pc.ontrack=function(e)                    { rtcOnProc(this,"ontrack",e);   };
  obj.vars.pc.onaddtrack=function(e)                 { rtcOnProc(this,"onaddtrack",e);   };
  obj.vars.pc.onremovetrack=function(e)              { rtcOnProc(this,"onremovetrack",e);   };
  obj.vars.pc.onaddstream=function(e)                { rtcOnProc(this,"onaddstream",e);   };
  obj.vars.pc.onremovestream=function(e)             { rtcOnProc(this,"onremovestream",e);   };
  obj.vars.pc.ondatachannel=function(e)              { rtcOnProc(this,"ondatachannel",e);   };
  return h;
  }
 return 0;
 }



 function rtcDestroy (handle)
 {
 var obj;

 if((obj=handleCheck(rtc_obj.handef,handle))==null) { return false; }
 if(obj.vars.ice_queue_handle!=0)
  {
  aa.queueDestroy(obj.vars.ice_queue_handle);
  obj.vars.ice_queue_handle=0;
  }
 rtcClearPromise(handle);
 obj.vars={};
 handleRemove(rtc_obj.handef,handle);
 return true;
 }




 function rtcGet (handle)
 {
 return(handleCheck(rtc_obj.handef,handle));
 }




 function rtcClearPromise (handle)
 {
 var obj;

 if((obj=rtcGet(handle))==null) { return false; }
 if(obj.vars.is_busy==true)     { return false; }
 aa.promiseDestroy(obj.vars.prosync_handle);
 obj.vars.prosync_handle=0;
 obj.vars.promise_info="";
 return true;
 }




 function rtcIsBusy (handle)
 {
 var status;

 status=rtcStatus(handle);
 if(status==null) { return null; }
 return(status.objvars.is_busy);
 }






 function rtcStatus (handle)
 {
 var obj,status,ps;

 if((obj=rtcGet(handle))==null) { return null; }
 status={};
 switch(obj.vars.stage)
  {
  case 100:
  ps=aa.promiseStatus(obj.vars.prosync_handle);
  if(ps.state!=1) { break; }
  obj.vars.offer=ps.val;
  obj.vars.is_busy=false;
  rtcClearPromise(handle);
  if(obj.vars.prosync_handle!=0) alert();
  obj.vars.is_busy=false;
  aa.debugLog("createoffer fullfilled");
  obj.vars.stage=120;
  break;

  case 200:
  ps=aa.promiseStatus(obj.vars.prosync_handle);
  if(ps.state!=1) { break; }
  obj.vars.answer=ps.val;
  aa.promiseDestroy(obj.vars.prosync_handle);
  obj.vars.prosync_handle=0;
  obj.vars.is_busy=false;
  aa.debugLog("createanswer fullfilled");
  obj.vars.stage=220;
  break;

  case 300:
  ps=aa.promiseStatus(obj.vars.prosync_handle);
  if(ps.state!=1) { break; }
  aa.promiseDestroy(obj.vars.prosync_handle);
  obj.vars.prosync_handle=0;
  obj.vars.is_busy=false;
  aa.debugLog("set remote desc fullfilled");
  obj.vars.stage=320;
  break;

  case 400:
  ps=aa.promiseStatus(obj.vars.prosync_handle);
  if(ps.state!=1) { break; }
  aa.promiseDestroy(obj.vars.prosync_handle);
  obj.vars.prosync_handle=0;
  obj.vars.is_busy=false;
  aa.debugLog("set local desc fullfilled");
  obj.vars.stage=420;
  break;

  case 500:
  ps=aa.promiseStatus(obj.vars.prosync_handle);
  if(ps.state!=1) { break; }
  aa.promiseDestroy(obj.vars.prosync_handle);
  obj.vars.prosync_handle=0;
  obj.vars.is_busy=false;
  aa.debugLog("add ice candidate");
  obj.vars.stage=520;
  break;
  }
 status.objvars=obj.vars;
 status.stage=obj.vars.stage;
 return status;
 }







 function rtcOnProc (pc,name,event)
 {
 var obj;

 if(name=="onnegotiationneeded") { return; }
 if(name=="onsignalingstatechange") { return; }
 if(name=="onconnectionstatechange") { return; }
 if(name=="onicegatheringstatechange") { return; }
 if(name=="oniceconnectionstatechange") { return; }
 if(name=="onicecandidate")
  {
  if((obj=rtcGet(pc.self_handle))==null) { alert(); }
  aa.queueWrite(obj.vars.ice_queue_handle,event.candidate);
  obj.vars.ice_queue_status=aa.queueStatus(obj.vars.ice_queue_handle);
  return;
  }
 if(name=="ondatachannel")
  {
  rtcAddDataChannel(pc.self_handle,event.channel.label,event.channel);
  return;
  }
 aa.debugLog("han="+pc.self_handle);
 aa.debugLog(name,event);
 }








 function rtcCreateOffer (handle)
 {
 var obj;

 if((obj=rtcGet(handle))==null) { return false; }
 if(obj.vars.is_busy==true) { alert("createoffer"); }
 rtcClearPromise(handle);
 ///aa.debugLog("creating offer");
 obj.vars.stage=100;
 obj.vars.is_busy=true;
 obj.vars.offer=null;
 obj.vars.promise_info="creating offer";
 obj.vars.promise_object=obj.vars.pc.createOffer();
 obj.vars.prosync_handle=aa.promiseCreate(obj.vars.promise_object);
 return true;
 }




 function rtcCreateAnswer (handle)
 {
 var obj;

 if((obj=rtcGet(handle))==null) { return false; }
 if(obj.vars.is_busy==true) { alert("createansw"); }
 rtcClearPromise(handle);
 //aa.debugLog("creating answer");
 obj.vars.stage=200;
 obj.vars.is_busy=true;
 obj.vars.answer=null;
 obj.vars.promise_info="createanswer";
 obj.vars.promise_object=obj.vars.pc.createAnswer();
 obj.vars.prosync_handle=aa.promiseCreate(obj.vars.promise_object);
 return true;
 }



 function rtcSetRemoteDesc (handle,desc)
 {
 var obj;

 if((obj=rtcGet(handle))==null) { return false; }
 if(obj.vars.is_busy==true) { alert("setremoteder"); }
 rtcClearPromise(handle);
 aa.debugLog("setting remote desc");
 obj.vars.rem_desc=desc;
 obj.vars.stage=300;
 obj.vars.is_busy=true;
 obj.vars.promise_info="setremotedesc";
 obj.vars.promise_object=obj.vars.pc.setRemoteDescription(obj.vars.rem_desc);
 obj.vars.prosync_handle=aa.promiseCreate(obj.vars.promise_object);
 return true;
 }




 function rtcSetLocalDesc (handle,desc)
 {
 var obj;

 if((obj=rtcGet(handle))==null) { return false; }
 if(obj.vars.is_busy==true) { alert("setremoteder"); }
 rtcClearPromise(handle);
 //aa.debugLog("setting local desc");
 obj.vars.loc_desc=desc;
 obj.vars.stage=400;
 obj.vars.is_busy=true;
 obj.vars.promise_info="setlocaldesc";
 obj.vars.promise_object=obj.vars.pc.setLocalDescription(obj.vars.loc_desc);
 obj.vars.prosync_handle=aa.promiseCreate(obj.vars.promise_object);
 return true;
 }



 function rtcAddIceCandidate (handle,candidate)
 {
 var obj;

 if((obj=rtcGet(handle))==null) { return false; }
 if(obj.vars.is_busy==true) { alert("addicecandidate"); }
 rtcClearPromise(handle);
 //aa.debugLog("setting ice candidate");
 obj.vars.stage=500;
 obj.vars.is_busy=true;
 obj.vars.promise_info="addicecandidate";
 obj.vars.promise_object=obj.vars.pc.addIceCandidate(candidate);
 obj.vars.prosync_handle=aa.promiseCreate(obj.vars.promise_object);
 return true;
 }



 function rtcGetIceCandidate (handle)
 {
 var obj,ice;

 if((obj=rtcGet(handle))==null) { return null; }
 if(obj.vars.is_busy==true) { alert("geticecandidate"); }
 rtcClearPromise(handle);
 ice=aa.queueRead(obj.vars.ice_queue_handle);
 obj.vars.ice_queue_status=aa.queueStatus(obj.vars.ice_queue_handle);
 return ice;
 }



 function rtcFindDataChannel (handle,name)
 {
 var obj,idx,dc;

 if((obj=rtcGet(handle))==null) { return -1; }
 if(obj.vars.is_busy==true) { alert("finddatachannel"); }
 rtcClearPromise(handle);
 for(idx=0;idx<obj.vars.data_channel.length;idx++)
  {
  dc=obj.vars.data_channel[idx];
  if(dc.name!=name) { continue; }
  return idx;
  }
 return -1;
 }



 function rtcOnData (handle,event)
 {
 switch(event.type)
  {
  case "open":
  //aa.debugLog(event.type);
  //aa.debugLog(event);
  break;

  case "message":
  aa.debugLog(event.type);
  //aa.debugLog(event);
  aa.debugLog(event.data);
  break;

  case "close":
  //aa.debugLog(event.type);
  //aa.debugLog(event);
  break;

  default:
  aa.debugLog("rtcOnData "+event.type);
  break;
  }
 }






 function rtcCreateDataChannel (handle,name,mode)
 {
 var obj,idx,dc;

 if((obj=rtcGet(handle))==null) { return -1; }
 if(obj.vars.is_busy==true) { alert("createdatachannel"); }
 rtcClearPromise(handle);
 idx=obj.vars.data_channel.length;
 dc={};
 dc.how="created";
 dc.name=name;
 dc.mode=mode;
 dc.cdc={};
 if(mode==0)  {  dc.cdc=obj.vars.pc.createDataChannel(name,{maxRetransmits:0,ordered:false});  } else
 if(mode==1)  {  dc.cdc=obj.vars.pc.createDataChannel(name,{maxRetransmits:0,ordered:true});  } else
 if(mode==2)  {  dc.cdc=obj.vars.pc.createDataChannel(name);  }
 obj.vars.data_channel[idx]=dc;
 dc.cdc.onopen=function(event)    {  rtcOnData(handle,event);  };
 dc.cdc.onclose=function(event)   {  rtcOnData(handle,event);  };
 dc.cdc.onmessage=function(event) {  rtcOnData(handle,event);  };
 aa.debugLog("create data channel name="+name+" mode="+mode+" idx="+idx);
 return idx;
 }



 function rtcAddDataChannel (handle,name,cdc)
 {
 var obj,idx,dc;

 if((obj=rtcGet(handle))==null) { return -1; }
 if(obj.vars.is_busy==true) { alert("createdatachannel"); }
 rtcClearPromise(handle);
 idx=obj.vars.data_channel.length;
 dc={};
 dc.how="added";
 dc.name=name;
 dc.mode=123;
 dc.cdc={};
 dc.cdc=cdc;
 obj.vars.data_channel[idx]=dc;
 dc.cdc.onopen=function(event)    {  rtcOnData(handle,event);  };
 dc.cdc.onclose=function(event)   {  rtcOnData(handle,event);  };
 dc.cdc.onmessage=function(event) {  rtcOnData(handle,event);  };
 aa.debugLog("add data channel name="+name+" idx="+idx);
 return idx;
 }





 //, {maxRetransmits: 0, ordered: false});

/*-----------------------------------------------------------------------*/





 function mainObjInit ()
 {
 var state,vars;

 if(Object.keys(main_obj).length!=0) { return; }
 state={};
 vars={};
 state.is_running=false;
 state.is_exiting=false;
 state.version=0;
 state.speed=0;
 state.proc=null;
 state.thread_id=0;
 state.worker_array=[];
 state.dethrottle_stage=0;
 state.dethrottle_ready=false;
 main_obj.state=state;
 main_obj.vars=vars;
 main_obj.vars.app={};
 main_obj.is_init=true;
 }





 function mainStart (ver,spd,mainproc,dtmode)
 {
 if(main_obj.state.is_running!=false) { return false; }
 //if(conclr) { console.clear(); }
 main_obj.state.version=ver;
 main_obj.state.cycle=-1;
 main_obj.state.thread_id=0;
 main_obj.state.speed_req=spd;
 main_obj.state.speed_got=0;
 main_obj.state.speed_to=0;
 main_obj.state.proc=mainproc;
 main_obj.state.is_running=true;
 main_obj.state.stage=0;
 mainWorkerAdd("socketYield",socketYield,1);
 if(dtmode>0)
  {
  if(dtmode>2) { dtmode=2; }
  main_obj.state.dethrottle_stage=dtmode;
  main_obj.state.dethrottle_ready=false;
  aa.debugLog("pre-dethrotle");
  }
 else
  {
  main_obj.state.dethrottle_ready=true;
  }
 envListenEvents(envEventProc);
 return true;
 }




 function mainThrottleFix (workerscript)
 {
 if(!/MSIE 10/i.test (navigator.userAgent))
  {
  try
   {
   var blob=new Blob
   (["var fakeIdToId={};\
   onmessage=function (event) \
    {\
    var data=event.data,name=data.name,fakeId=data.fakeId,time;\
    if(data.hasOwnProperty('time')) {	time=data.time; }\
    switch(name) \
     {\
     case 'setInterval':	 fakeIdToId[fakeId]=setInterval(function () {postMessage({fakeId:fakeId});},time); break;\
     case 'clearInterval': if(fakeIdToId.hasOwnProperty (fakeId))     {clearInterval(fakeIdToId[fakeId]); delete fakeIdToId[fakeId]; } break;\
     case 'setTimeout': 	 fakeIdToId[fakeId]=setTimeout(function ()  {postMessage({fakeId:fakeId}); if(fakeIdToId.hasOwnProperty (fakeId)) { delete fakeIdToId[fakeId];}},time); break;\
     case 'clearTimeout':	 if(fakeIdToId.hasOwnProperty (fakeId))     {clearTimeout(fakeIdToId[fakeId]); delete fakeIdToId[fakeId]; } break;\
     }\
    }"]);
   workerscript=window.URL.createObjectURL(blob);
   console.log("blob good");
   }
  catch(error)
   {
   console.log("use non blob (file) copy of blob");
   return false;
   }
  }
  var worker,fakeIdToCallback={},lastFakeId=0,maxFakeId=0x7FFFFFFF;
  if(typeof (Worker)!=='undefined')
   {
   function getFakeId()
    {
    do { if(lastFakeId==maxFakeId) { lastFakeId=0; } else { lastFakeId++; }  }  while(fakeIdToCallback.hasOwnProperty(lastFakeId));
    return lastFakeId;
    }
   try
    {
    worker=new Worker(workerscript);
    window.setInterval=function(callback,time/* , parameters */)
     {
     var fakeId=getFakeId();
     fakeIdToCallback[fakeId]={callback:callback,parameters:Array.prototype.slice.call(arguments,2)};
     worker.postMessage ({name:'setInterval',fakeId:fakeId,time:time});
     return fakeId;
     };
    window.clearInterval=function(fakeId)
     {
     if(fakeIdToCallback.hasOwnProperty(fakeId))
      {
      delete fakeIdToCallback[fakeId];
      worker.postMessage({name:'clearInterval',fakeId:fakeId});
      }
     };
    window.setTimeout=function(callback,time/* , parameters */)
     {
     var fakeId=getFakeId();
     fakeIdToCallback[fakeId]={callback:callback,parameters:Array.prototype.slice.call(arguments,2),isTimeout:true};
     worker.postMessage({name:'setTimeout',fakeId:fakeId,time:time});
     return fakeId;
     };
    window.clearTimeout=function(fakeId)
     {
     if(fakeIdToCallback.hasOwnProperty(fakeId))
      {
      delete fakeIdToCallback[fakeId];
      worker.postMessage({name:'clearTimeout',fakeId:fakeId});
      }
     };
    worker.onmessage=function(event)
     {
     var data=event.data,fakeId=data.fakeId,request,parameters,callback;
     if(fakeIdToCallback.hasOwnProperty(fakeId))
      {
      request=fakeIdToCallback[fakeId];
      callback=request.callback;
      parameters=request.parameters;
      if(request.hasOwnProperty('isTimeout')&&request.isTimeout) { delete fakeIdToCallback[fakeId]; }
      }
     if(typeof (callback)==='string')
      {
      try {callback=new Function (callback);}
      catch(error) { console.log('Error parsing callback code string: ',error); }
      }
     if(typeof (callback)==='function') { callback.apply(window,parameters); }
     };
    worker.onerror=function(event)
     {
     console.log(event);
     };
    }
   catch(error) { console.log ('Initialisation failed'); console.error(error); }
   }
 else
  {
  return false;
  }
 return true;
 }




 function mainDethrottle ()
 {
 if(main_obj.state.dethrottle_stage<1)      { return true; }
 //console.log("dethrottling stage = "+main_obj.state.dethrottle_stage);
 if(main_obj.state.dethrottle_stage==4)
  {
  main_obj.state.dethrottle_ready=true
  aa.mainThrottleFix(null);
  aa.debugLog("dethrottling");
  }
 main_obj.state.dethrottle_stage++;
 return true;
 }







 function mainWorkerAdd (name,proc,step)
 {
 var work={};

 work.name=name;
 work.proc=proc;
 work.step=step;
 main_obj.state.worker_array.push(work);
 return true;
 }





 function mainWorkerRemove (name)
 {
 var i,work;

 for(i=0;i<main_obj.state.worker_array.length;i++)
  {
  work=main_obj.state.worker_array[i];
  if(work.proc==undefined||work.proc==null) { continue; }
  if(work.name!=name)                       { continue; }
  work.name=null;
  work.proc=null;
  work.step=0;
  return true;
  }
 return false;
 }




 function mainWorkerStep ()
 {
 var i,work;
 if(main_obj.state.worker_array.length<=0) { return true; }
 for(i=0;i<main_obj.state.worker_array.length;i++)
  {
  work=main_obj.state.worker_array[i];
  if(work.proc==undefined||work.proc==null) { continue; }
  if(work.step<1)                           { continue; }
  if(((main_obj.state.cycle%work.step)==(work.step-1))||(main_obj.state.cycle==1)) {   work.proc();   }
  }
 return true;
 }





 function mainProc ()
 {
 var msr;

 main_obj.state.cycle++;
 mainWorkerStep();
 if(main_obj.state.dethrottle_stage>1&&main_obj.state.dethrottle_stage<5) {  mainDethrottle();  }
 main_obj.state.proc();
 msr=aa.timerMsRunning()/1000;
 main_obj.state.speed_got=parseInt(main_obj.state.cycle/msr);
 main_obj.state.speed_to=parseInt((1000/main_obj.state.speed_req));
 return true;
 }








 function mainRun ()
 {
 main_obj.state.thread_id=window.setTimeout(function()
  {
  clearTimeout(main_obj.state.thread_id);
  main_obj.state.thread_id=0;
  mainProc();
  if(main_obj.state.is_running==false)
   {
   //console.log("is_running="+main_obj.state.is_running+" is_exiting="+main_obj.state.is_exiting);
   if(main_obj.state.is_exiting==true) alert(aa.debugLineNumber());
   }
  if(main_obj.state.is_exiting==true)
   {
   //console.log("is_running="+main_obj.state.is_running+" is_exiting="+main_obj.state.is_exiting);
   if(main_obj.state.is_running==false) alert(aa.debugLineNumber());
   main_obj.state.is_running=false;
   }
  if(main_obj.state.is_running==true)
   {
   mainRun();
   }
  else
   {
   window.dispatchEvent(new Event('beforeunload'));
   window.dispatchEvent(new Event('unload'));
   aa.envListenEvents(null);
   aa.handleGlobalKill();
   aa.handleGlobalDump();
   console.log(JSON.stringify(aa.debugMemoryUsage(),0,2));
   }
  },main_obj.state.speed_to);
 return true;
 }



 function mainExit (code)
 {
 if(main_obj.state.is_running!=true) { return false; }
 if(main_obj.state.is_exiting!=false) { return true; }
 main_obj.state.is_exiting=true;
 return true;
 }



 function mainProcSet (proc)
 {
 main_obj.state.proc=proc;
 return true;
 }




 function mainSpeedSet (speed)
 {
 var msr;

 main_obj.state.speed_req=speed;
 main_obj.state.speed_to=parseInt((1000/main_obj.state.speed_req));
 msr=aa.timerMsRunning()/1000;
 main_obj.state.speed_got=parseInt(main_obj.state.cycle/msr);
 main_obj.state.speed_to=parseInt((1000/main_obj.state.speed_req));
 }




 function mainStageAdjust (by)
 {
 main_obj.state.stage+=parseInt(by);
 }



 function mainStageSet (stage)
 {
 main_obj.state.stage=stage;
 }




 function mainStageGet ()
 {
 return main_obj.state.stage;
 }




 function mainCycleGet ()
 {
 return main_obj.state.cycle;
 }



 function mainCyclePulse (stride)
 {
 var s1;
 s1=stride+1;
 if(s1==0) { aa.debugAlert(); }
 if((main_obj.state.cycle%s1)==stride)
  {
  return true;
  }
 return false;
 }





 function mainPluginLoad (url,id)
 {
 var obj,p,s,scr,e,mat,so;

 obj={};
 obj.type="plugin";
 obj.head=document.head;
 obj.state=0;
 obj.ready=false;
 obj.res=null;
 obj.api=null;
 obj.api_procs=null;
 obj.script=document.createElement('script');
 obj.script.type='text/javascript';
 obj.script.defer=true;
 obj.script.id=id;
 obj.script.src=url+"?"+aa.numRand(10000000);

 function _pluginErrorHandler(event)
  {
  event.preventDefault();
  obj.ready=true;
  obj.res="err";
  obj.state=3;
  };
 window.addEventListener('error',_pluginErrorHandler);

 obj.script.onload=function(event)
  {
  for(p=0;p<event.path.length;p++)
   {
   if(obj.state==1) { break; }
   if(typeof event.path[p]==='object')
    {
    if(event.path[p].scripts)
     {
     for(e=0;e<event.path[p].scripts.length;e++)
      {
      if((so=aa.stringIndexOf(true,event.path[p].scripts[e].src,obj.script.src,0))<0) { continue; }
      obj.state=1;
      break;
      }
     }
    }
   }
  if(obj.state==1)
   {
   function _getAllProcs(object)
    {
    return Object.getOwnPropertyNames(object).filter(function(property)
     {
     return typeof object[property]=='function';
     });
    }
   obj.api=pluginEntry();
   obj.api_procs=_getAllProcs(obj.api);
   obj.ready=true;
   obj.res="ok";
   obj.state=2;
   }
  else
   {
   obj.ready=true;
   obj.res="err";
   obj.state=3;
   }
  };
 obj.head.appendChild(obj.script);
 return obj;
 }





 function mainPluginFree (obj)
 {
 var elem,res,eid;

 if(obj.type!="plugin") { return false; }
 elem=document.getElementById(obj.script.id);
 elem.parentNode.removeChild(elem);
 obj.type="";
 obj.state=0;
 obj.ready=false;
 obj.res=null;
 obj.api=null;
 obj.api_procs=null;
 obj.head={};
 obj.script={};
 delete obj.api;
 delete obj.api_procs;
 delete obj.head;
 delete obj.script;
 delete obj.state;
 delete obj.ready;
 delete obj.res;
 delete obj.type;
 obj={};
 return true;
 }





/*-----------------------------------------------------------------------*/




 return {
 handle_obj:handle_obj,
 debug_obj:debug_obj,
 promise_obj:promise_obj,
 timer_obj:timer_obj,
 num_obj:num_obj,
 data_obj:data_obj,
 string_obj:string_obj,
 env_obj:env_obj,
 queue_obj:queue_obj,
 touch_obj:touch_obj,
 mouse_obj:mouse_obj,
 keyboard_obj:keyboard_obj,
 storage_obj:storage_obj,
 gui_obj:gui_obj,
 media_obj:media_obj,
 socket_obj:socket_obj,
 room_obj:room_obj,
 dsp_obj:dsp_obj,
 bitio_obj:bitio_obj,
 rtc_obj:rtc_obj,
 main_obj:main_obj,

 debugLineNumber:debugLineNumber,
 debugFunctionName:debugFunctionName,
 debugStackUsage:debugStackUsage,
 debugStackGet:debugStackGet,
 debugAlert:debugAlert,
 debugLog:debugLog,
 debugMemoryUsage:debugMemoryUsage,

 promiseCreate:promiseCreate,
 promiseDestroy:promiseDestroy,
 promiseGet:promiseGet,
 promiseStatus:promiseStatus,


 timerTikNow:timerTikNow,
 timerTikElapsed:timerTikElapsed,
 timerMsRunning:timerMsRunning,
 timerMicroRunning:timerMicroRunning,
 timerTimeoutSet:timerTimeoutSet,
 timerTimeoutReset:timerTimeoutReset,
 timerTimeoutTest:timerTimeoutTest,
 timerRaterInit:timerRaterInit,
 timerRaterUpdate:timerRaterUpdate,

 numRand:numRand,
 numFixed:numFixed,
 numPercentOf:numPercentOf,
 numPercentIs:numPercentIs,
 numPad:numPad,
 numIntToHex:numIntToHex,
 numRound:numRound,
 numFloatFormat:numFloatFormat,

 dataArray2DCreate:dataArray2DCreate,
 dataObjectApxSize:dataObjectApxSize,
 dataGlobalExists:dataGlobalExists,
 dataGlobalPropertiesGet:dataGlobalPropertiesGet,
 dataObjectIsEmpty:dataObjectIsEmpty,
 dataObjectIsUndefined:dataObjectIsUndefined,
 dataValueIsEmpty:dataValueIsEmpty,
 dataValueIsNotEmpty:dataValueIsNotEmpty,
 dataArrayRotate:dataArrayRotate,
 dataArrayUniqueCount:dataArrayUniqueCount,
 dataFloat32ArrayToUint8Array:dataFloat32ArrayToUint8Array,
 dataUint8ArrayToFloat32Array:dataUint8ArrayToFloat32Array,
 dataFloat32ArrayToInt16Array:dataFloat32ArrayToInt16Array,
 dataInt16ArrayToFloat32Array:dataInt16ArrayToFloat32Array,
 dataInt16ArrayToUint8Array:dataInt16ArrayToUint8Array,
 dataUint8ArrayToInt16Array:dataUint8ArrayToInt16Array,

 stringIndexOf:stringIndexOf,
 stringLastCharGet:stringLastCharGet,
 stringLastCharTrim:stringLastCharTrim,
 stringFirstCharGet:stringFirstCharGet,
 stringFirstCharTrim:stringFirstCharTrim,
 stringSha256:stringSha256,
 stringBase64FromUint8:stringBase64FromUint8,
 stringBase64ToUint8:stringBase64ToUint8,
 stringSplitter:stringSplitter,
 stringTime:stringTime,
 stringParms:stringParms,


 envInfoGet:envInfoGet,
 envBrowserArg:envBrowserArg,
 envListenEvents:envListenEvents,
 envDisplayGet:envDisplayGet,
 envDisplayCompare:envDisplayCompare,
 envZoomFix:envZoomFix,
 envTitleSet:envTitleSet,
 envTitleGet:envTitleGet,
 envReload:envReload,
 envFavIconGet:envFavIconGet,
 envFavIconSet:envFavIconSet,
 envManifestInit:envManifestInit,
 envManifestSet:envManifestSet,
 envManifestApply:envManifestApply,

 handleDefine:handleDefine,
 handleCheck:handleCheck,
 handleReset:handleReset,
 handleGet:handleGet,
 handleUse:handleUse,
 handleRemove:handleRemove,
 handleNext:handleNext,
 handleText:handleText,
 handleGlobalDump:handleGlobalDump,
 handleGlobalKill:handleGlobalKill,


 queueCreate:queueCreate,
 queueDestroy:queueDestroy,
 queueGet:queueGet,
 queueWrite:queueWrite,
 queueRead:queueRead,
 queuePeek:queuePeek,
 queueDiscard:queueDiscard,
 queueStatus:queueStatus,

 touchStart:touchStart,
 touchPeek:touchPeek,
 touchRead:touchRead,
 //touchProcess:touchProcess,
 touchStatus:touchStatus,

 mouseStart:mouseStart,
 mousePeek:mousePeek,
 mouseRead:mouseRead,
 mouseStatus:mouseStatus,
 mouseCursorGet:mouseCursorGet,
 mouseCursorSet:mouseCursorSet,

 keyboardStart:keyboardStart,
 keyboardPeek:keyboardPeek,
 keyboardRead:keyboardRead,
 keyboardStatus:keyboardStatus,

 storageCreate:storageCreate,
 storageDestroy:storageDestroy,
 storageGet:storageGet,
 storagePurge:storagePurge,
 storageRead:storageRead,
 storageWrite:storageWrite,
 storageRemove:storageRemove,
 storageTuple:storageTuple,
 storageStatus:storageStatus,

 guiCreate:guiCreate,
 guiDestroy:guiDestroy,
 guiGet:guiGet,
 guiGroupGet:guiGroupGet,
 guiIdFind:guiIdFind,
 guiParentSet:guiParentSet,
 guiSizeSet:guiSizeSet,
 guiCssAreaSet:guiCssAreaSet,
 guiCssCordSet:guiCssCordSet,
 guiCssSizeSet:guiCssSizeSet,
 guiSizeFix:guiSizeFix,
 guiCanvasClear:guiCanvasClear,
 guiCanvasReset:guiCanvasReset,
 guiCanvasSmoothingSet:guiCanvasSmoothingSet,
 guiCanvasFontSet:guiCanvasFontSet,
 guiCanvasTextMeasure:guiCanvasTextMeasure,
 guiCanvasTextSizeList:guiCanvasTextSizeList,
 guiCanvasImageGet:guiCanvasImageGet,
 guiCanvasImagePut:guiCanvasImagePut,
 guiCanvasImageDraw:guiCanvasImageDraw,
 guiCanvasScroll:guiCanvasScroll,
 guiCanvasBorder:guiCanvasBorder,
 guiCanvasFill:guiCanvasFill,
 guiCanvasLine:guiCanvasLine,
 guiCanvasText:guiCanvasText,
 guiCanvasRounded:guiCanvasRounded,
 guiCssOpacitySet:guiCssOpacitySet,
 guiCssDisplaySet:guiCssDisplaySet,
 guiCssOutlineSet:guiCssOutlineSet,
 guiRectsGet:guiRectsGet,
 guiEaseInit:guiEaseInit,
 guiEaseProcess:guiEaseProcess,
 guiRgbaString:guiRgbaString,
 guiRgbaStringCommon:guiRgbaStringCommon,
 guiRectSet:guiRectSet,
 guiRectAdjust:guiRectAdjust,
 guiAreaSet:guiAreaSet,
 guiAreaAdjust:guiAreaAdjust,
 guiRgbaSet:guiRgbaSet,
 guiRgbaAdjust:guiRgbaAdjust,
 guiRgbaToHsva:guiRgbaToHsva,
 guiRgbaToString:guiRgbaToString,
 guiHsvaSet:guiHsvaSet,
 guiHsvaAdjust:guiHsvaAdjust,
 guiHsvaToRgba:guiHsvaToRgba,
 guiUpdateAreaInit:guiUpdateAreaInit,
 guiUpdateAreaFin:guiUpdateAreaFin,
 guiUpdateAreaAdd:guiUpdateAreaAdd,


 mediaDeviceDetect:mediaDeviceDetect,
 mediaDeviceCountGet:mediaDeviceCountGet,
 mediaDeviceGet:mediaDeviceGet,
 mediaDeviceCapsGet:mediaDeviceCapsGet,
 mediaCreate:mediaCreate,
 mediaDestroy:mediaDestroy,
 mediaGet:mediaGet,
 mediaAttach:mediaAttach,
 mediaStatus:mediaStatus,

 socketCreate:socketCreate,
 socketDestroy:socketDestroy,
 socketGet:socketGet,
 socketWrite:socketWrite,
 socketPeek:socketPeek,
 socketRead:socketRead,
 socketDiscard:socketDiscard,
 socketProcess:socketProcess,
 socketStatus:socketStatus,

 roomCreate:roomCreate,
 roomDestroy:roomDestroy,
 roomGet:roomGet,
 roomSet:roomSet,
 roomPeerJoin:roomPeerJoin,
 roomPeerLeaving:roomPeerLeaving,
 roomPeerLeave:roomPeerLeave,
 roomPeerNext:roomPeerNext,
 roomPeerByAlias:roomPeerByAlias,
 roomPeerById:roomPeerById,
 roomPeerByIndex:roomPeerByIndex,

 dspAudioResample:dspAudioResample,
 dspSineWaveAt:dspSineWaveAt,
 dspZigZag:dspZigZag,
 dspGetBlock:dspGetBlock,
 dspSetBlock:dspSetBlock,

 bitioCreate:bitioCreate,
 bitioDestroy:bitioDestroy,
 bitioGet:bitioGet,
 bitioStatus:bitioStatus,
 bitioRead:bitioRead,
 bitioWrite:bitioWrite,

 rtcCreate:rtcCreate,
 rtcDestroy:rtcDestroy,
 rtcGet:rtcGet,
 rtcIsBusy:rtcIsBusy,
 rtcStatus:rtcStatus,
 rtcCreateOffer:rtcCreateOffer,
 rtcCreateAnswer:rtcCreateAnswer,
 rtcSetRemoteDesc:rtcSetRemoteDesc,
 rtcSetLocalDesc:rtcSetLocalDesc,
 rtcAddIceCandidate:rtcAddIceCandidate,
 rtcGetIceCandidate:rtcGetIceCandidate,
 rtcFindDataChannel:rtcFindDataChannel,
 rtcCreateDataChannel:rtcCreateDataChannel,
 rtcAddDataChannel:rtcAddDataChannel,

 main_vars:main_obj.vars,
 main_state:main_obj.state,
 mainStart:mainStart,
 mainThrottleFix:mainThrottleFix,
 mainDethrottle:mainDethrottle,
 mainWorkerAdd:mainWorkerAdd,
 mainWorkerRemove:mainWorkerRemove,
 mainRun:mainRun,
 mainExit:mainExit,
 mainProcSet:mainProcSet,
 mainSpeedSet:mainSpeedSet,
 mainStageAdjust:mainStageAdjust,
 mainStageSet:mainStageSet,
 mainStageGet:mainStageGet,
 mainCycleGet:mainCycleGet,
 mainCyclePulse:mainCyclePulse,
 mainPluginLoad:mainPluginLoad,
 mainPluginFree:mainPluginFree,
 };


/*-----------------------------------------------------------------------*/

})();

