/**
 aaJS, (c) by, Ashod Apakian
 Third party credits:
 jesusgollonet easing functions
 Ruslan Tushov dethrottling
 raysan5 rayicons
**/

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
 var  pointer_obj={};
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
 pointerObjInit();
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



 function numBitGet(numb,bit)
 {
 return((numb>>bit)%2!=0)
 }


 function numBitSet(numb,bit)
 {
 return numb|1<<bit;
 }


 function numBitClear(numb,bit)
 {
 return numb&~(1<<bit);
 }


 function numBitToggle(numb,bit)
 {
 return numBitGet(numb,bit)?numBitClear(numb,bit):numBitSet(numb,bit);
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
  case "tap":
  console.log(event.type);
  aa.main_state.click_count++;
  if(aa.main_state.dethrottle_stage==1)  {   aa.mainDethrottle();    }
  break;



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
  //document.body.removeEventListener("touchend",env_obj.event_proc,false);
  document.body.removeEventListener("click",env_obj.event_proc,false);
  document.body.removeEventListener("tap",env_obj.event_proc,false);
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
  //  document.body.addEventListener("touchend",function(event)             { env_obj.event_proc(event);  });
  document.body.addEventListener("click",function(event)             { env_obj.event_proc(event);  });
  document.body.addEventListener("tap",function(event)               { env_obj.event_proc(event);  });
  document.body.addEventListener("mousemove",function(event)         { env_obj.event_proc(event);  });//   audio.play()})
  document.addEventListener("visibilitychange",function(event)       { env_obj.event_proc(event);  });
  document.addEventListener("mozvisibilitychange",function(event)    { env_obj.event_proc(event);  });
  document.addEventListener("webkitvisibilitychange",function(event) { env_obj.event_proc(event);  });
  document.addEventListener("msvisibilitychange",function(event)     { env_obj.event_proc(event);  });
  ///console.log("listening");
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


 function pointerObjInit ()
 {
 var state;

 if(Object.keys(pointer_obj).length!=0) { return; }
 state={};
 state.is_started=false;
 pointer_obj.state=state;
 pointer_obj.is_init=true;
 }




 function pointerStart ()
 {
 if(pointer_obj.state.is_started!=false) { return false; }
 pointer_obj.state.is_started=true;
 pointer_obj.state.event_count=0;
 pointer_obj.state.event_queue_handle=aa.queueCreate();
 pointer_obj.state.event_queue_status=aa.queueStatus(pointer_obj.state.event_queue_handle);
 document.onpointerover=function(event)      { pointerOnEvent("pointerover",event); }
 document.onpointerenter=function(event)     { pointerOnEvent("pointerenter",event); }
 document.onpointerdown=function(event)      { pointerOnEvent("pointerdown",event); }
 document.onpointermove=function(event)      { pointerOnEvent("pointermove",event); }
 document.onpointerup=function(event)        { pointerOnEvent("pointerup",event); }
 document.onpointercancel=function(event)    { pointerOnEvent("pointercancel",event); }
 document.onpointerout=function(event)       { pointerOnEvent("pointerout",event); }
 document.onpointerleave=function(event)     { pointerOnEvent("pointerleave",event); }
 document.gotpointercapture=function(event)  { pointerOnEvent("pointercapture",event); }
 document.lostpointercapture=function(event) { pointerOnEvent("pointerrelease",event); }
 return true;
 }



 function pointerOnEvent (name,ev)
 {
 var msg;

 msg={};
 msg.name=name;
 msg.event=ev;

 /*
  msg.altKey=false
 msg.altitudeAngle=1.5707963267948966
 msg.azimuthAngle=0
 msg.bubbles=true
 msg.button=-1
 msg.buttons=0
 msg.cancelBubble=false
 msg.cancelable=true
 msg.clientX=0
 msg.clientY=539.97509765625
 msg.composed=true
 msg.ctrlKey=false
 msg.currentTarget=null
 msg.defaultPrevented=false
 msg.detail=0
 msg.eventPhase=0
 msg.fromElement=null
 msg.height=1
 msg.isPrimary=true
 msg.isTrusted=true
 msg.layerX=0
 msg.layerY=539
 msg.metaKey=false
 msg.movementX=-36
 msg.movementY=-3
 msg.offsetX=0
 msg.offsetY=539.9751137487619
 msg.pageX=0
 msg.pageY=539.97509765625
 msg.pointerId=1
 msg.pointerType="mouse"
 msg.pressure=0
 msg.relatedTarget=null
 msg.returnValue=true
 msg.screenX=874
 msg.screenY=472
 msg.shiftKey=false
 msg.sourceCapabilities=null
 msg.tangentialPressure=0
 msg.tiltX=0
 msg.tiltY=0
 //msg.timeStamp=1872.1599999989849
 msg.toElement=null
 msg.twist=0
 msg.type="pointermove"
 msg.which=0
 msg.width=1
 */
 aa.queueWrite(pointer_obj.state.event_queue_handle,msg);
 pointer_obj.state.event_queue_status=aa.queueStatus(pointer_obj.state.event_queue_handle);
 return true;
 }





 function pointerPeek (ofs)
 {
 var msg;

 if(pointer_obj.state.is_started!=true) { return null; }
 msg=aa.queuePeek(pointer_obj.state.event_queue_handle,ofs);
 return msg;
 }




 function pointerRead ()
 {
 var msg;

 if(pointer_obj.state.is_started!=true) { return null; }
 msg=aa.queueRead(pointer_obj.state.event_queue_handle);
 pointer_obj.state.event_queue_status=aa.queueStatus(pointer_obj.state.event_queue_handle);
 return msg;
 }



 function pointerStatus ()
 {
 var info;

 if(pointer_obj.state.is_started!=true) { return null; }
 pointer_obj.state.event_queue_status=aa.queueStatus(pointer_obj.state.event_queue_handle);
 info={};
 info.msgs_queued=pointer_obj.state.event_queue_status.msgs_queued;
 info.msgs_total=pointer_obj.state.event_queue_status.msgs_total;
 return info;
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
 keyboard_obj.state.event_queue_handle=aa.queueCreate();
 keyboard_obj.state.event_queue_status=aa.queueStatus(keyboard_obj.state.event_queue_handle);
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
 aa.queueWrite(keyboard_obj.state.event_queue_handle,msg);
 keyboard_obj.state.event_queue_status=aa.queueStatus(keyboard_obj.state.event_queue_handle);
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
 msg=aa.queuePeek(keyboard_obj.state.event_queue_handle,ofs);
 return msg;
 }




 function keyboardRead ()
 {
 var msg;

 if(keyboard_obj.state.is_started!=true) { return null; }
 msg=aa.queueRead(keyboard_obj.state.event_queue_handle);
 keyboard_obj.state.event_queue_status=aa.queueStatus(keyboard_obj.state.event_queue_handle);
 return msg;
 }






 function keyboardStatus ()
 {
 var i,j,info,len;

 if(keyboard_obj.state.is_started!=true) { return null; }
 keyboard_obj.state.event_queue_status=aa.queueStatus(keyboard_obj.state.event_queue_handle);
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

 var guiRayIcon=
 [
 0x00000000,0x00000000,0x00000000,0x00000000,0x00000000,0x00000000,0x00000000,0x00000000, // 000 NONE
 0x3ff80000,0x2f082008,0x2042207e,0x40027fc2,0x40024002,0x40024002,0x40024002,0x00007ffe, // 001 FOLDER_FILE_OPEN
 0x3ffe0000,0x44226422,0x400247e2,0x5ffa4002,0x57ea500a,0x500a500a,0x40025ffa,0x00007ffe, // 002 FILE_SAVE_CLASSIC
 0x00000000,0x0042007e,0x40027fc2,0x40024002,0x41024002,0x44424282,0x793e4102,0x00000100, // 003 FOLDER_OPEN
 0x00000000,0x0042007e,0x40027fc2,0x40024002,0x41024102,0x44424102,0x793e4282,0x00000000, // 004 FOLDER_SAVE
 0x3ff00000,0x201c2010,0x20042004,0x21042004,0x24442284,0x21042104,0x20042104,0x00003ffc, // 005 FILE_OPEN
 0x3ff00000,0x201c2010,0x20042004,0x21042004,0x21042104,0x22842444,0x20042104,0x00003ffc, // 006 FILE_SAVE
 0x3ff00000,0x201c2010,0x00042004,0x20041004,0x20844784,0x00841384,0x20042784,0x00003ffc, // 007 FILE_EXPORT
 0x3ff00000,0x201c2010,0x20042004,0x20042004,0x22042204,0x22042f84,0x20042204,0x00003ffc, // 008 FILE_NEW
 0x3ff00000,0x201c2010,0x20042004,0x20042004,0x25042884,0x25042204,0x20042884,0x00003ffc, // 009 FILE_DELETE
 0x3ff00000,0x201c2010,0x20042004,0x20042ff4,0x20042ff4,0x20042ff4,0x20042004,0x00003ffc, // 010 FILETYPE_TEXT
 0x3ff00000,0x201c2010,0x27042004,0x244424c4,0x26442444,0x20642664,0x20042004,0x00003ffc, // 011 FILETYPE_AUDIO
 0x3ff00000,0x201c2010,0x26042604,0x20042004,0x35442884,0x2414222c,0x20042004,0x00003ffc, // 012 FILETYPE_IMAGE
 0x3ff00000,0x201c2010,0x20c42004,0x22442144,0x22442444,0x20c42144,0x20042004,0x00003ffc, // 013 FILETYPE_PLAY
 0x3ff00000,0x3ffc2ff0,0x3f3c2ff4,0x3dbc2eb4,0x3dbc2bb4,0x3f3c2eb4,0x3ffc2ff4,0x00002ff4, // 014 FILETYPE_VIDEO
 0x3ff00000,0x201c2010,0x21842184,0x21842004,0x21842184,0x21842184,0x20042184,0x00003ffc, // 015 FILETYPE_INFO
 0x0ff00000,0x381c0810,0x28042804,0x28042804,0x28042804,0x28042804,0x20102ffc,0x00003ff0, // 016 FILE_COPY
 0x00000000,0x701c0000,0x079c1e14,0x55a000f0,0x079c00f0,0x701c1e14,0x00000000,0x00000000, // 017 FILE_CUT
 0x01c00000,0x13e41bec,0x3f841004,0x204420c4,0x20442044,0x20442044,0x207c2044,0x00003fc0, // 018 FILE_PASTE
 0x00000000,0x3aa00fe0,0x2abc2aa0,0x2aa42aa4,0x20042aa4,0x20042004,0x3ffc2004,0x00000000, // 019 CURSOR_HAND
 0x00000000,0x003c000c,0x030800c8,0x30100c10,0x10202020,0x04400840,0x01800280,0x00000000, // 020 CURSOR_POINTER
 0x00000000,0x00180000,0x01f00078,0x03e007f0,0x07c003e0,0x04000e40,0x00000000,0x00000000, // 021 CURSOR_CLASSIC
 0x00000000,0x04000000,0x11000a00,0x04400a80,0x01100220,0x00580088,0x00000038,0x00000000, // 022 PENCIL
 0x04000000,0x15000a00,0x50402880,0x14102820,0x05040a08,0x015c028c,0x007c00bc,0x00000000, // 023 PENCIL_BIG
 0x01c00000,0x01400140,0x01400140,0x0ff80140,0x0ff80808,0x0aa80808,0x0aa80aa8,0x00000ff8, // 024 BRUSH_CLASSIC
 0x1ffc0000,0x5ffc7ffe,0x40004000,0x00807f80,0x01c001c0,0x01c001c0,0x01c001c0,0x00000080, // 025 BRUSH_PAINTER
 0x00000000,0x00800000,0x01c00080,0x03e001c0,0x07f003e0,0x036006f0,0x000001c0,0x00000000, // 026 WATER_DROP
 0x00000000,0x3e003800,0x1f803f80,0x0c201e40,0x02080c10,0x00840104,0x00380044,0x00000000, // 027 COLOR_PICKER
 0x00000000,0x07800300,0x1fe00fc0,0x3f883fd0,0x0e021f04,0x02040402,0x00f00108,0x00000000, // 028 RUBBER
 0x00c00000,0x02800140,0x08200440,0x20081010,0x2ffe3004,0x03f807fc,0x00e001f0,0x00000040, // 029 COLOR_BUCKET
 0x00000000,0x21843ffc,0x01800180,0x01800180,0x01800180,0x01800180,0x03c00180,0x00000000, // 030 TEXT_T
 0x00800000,0x01400180,0x06200340,0x0c100620,0x1ff80c10,0x380c1808,0x70067004,0x0000f80f, // 031 TEXT_A
 0x78000000,0x50004000,0x00004800,0x03c003c0,0x03c003c0,0x00100000,0x0002000a,0x0000000e, // 032 SCALE
 0x75560000,0x5e004002,0x54001002,0x41001202,0x408200fe,0x40820082,0x40820082,0x00006afe, // 033 RESIZE
 0x00000000,0x3f003f00,0x3f003f00,0x3f003f00,0x00400080,0x001c0020,0x001c001c,0x00000000, // 034 FILTER_POINT
 0x6d800000,0x00004080,0x40804080,0x40800000,0x00406d80,0x001c0020,0x001c001c,0x00000000, // 035 FILTER_BILINEAR
 0x40080000,0x1ffe2008,0x14081008,0x11081208,0x10481088,0x10081028,0x10047ff8,0x00001002, // 036 CROP
 0x00100000,0x3ffc0010,0x2ab03550,0x22b02550,0x20b02150,0x20302050,0x2000fff0,0x00002000, // 037 CROP_ALPHA
 0x40000000,0x1ff82000,0x04082808,0x01082208,0x00482088,0x00182028,0x35542008,0x00000002, // 038 SQUARE_TOGGLE
 0x00000000,0x02800280,0x06c006c0,0x0ea00ee0,0x1e901eb0,0x3e883e98,0x7efc7e8c,0x00000000, // 039 SIMMETRY
 0x01000000,0x05600100,0x1d480d50,0x7d423d44,0x3d447d42,0x0d501d48,0x01000560,0x00000100, // 040 SIMMETRY_HORIZONTAL
 0x01800000,0x04200240,0x10080810,0x00001ff8,0x00007ffe,0x0ff01ff8,0x03c007e0,0x00000180, // 041 SIMMETRY_VERTICAL
 0x00000000,0x010800f0,0x02040204,0x02040204,0x07f00308,0x1c000e00,0x30003800,0x00000000, // 042 LENS
 0x00000000,0x061803f0,0x08240c0c,0x08040814,0x0c0c0804,0x23f01618,0x18002400,0x00000000, // 043 LENS_BIG
 0x00000000,0x00000000,0x1c7007c0,0x638e3398,0x1c703398,0x000007c0,0x00000000,0x00000000, // 044 EYE_ON
 0x00000000,0x10002000,0x04700fc0,0x610e3218,0x1c703098,0x001007a0,0x00000008,0x00000000, // 045 EYE_OFF
 0x00000000,0x00007ffc,0x40047ffc,0x10102008,0x04400820,0x02800280,0x02800280,0x00000100, // 046 FILTER_TOP
 0x00000000,0x40027ffe,0x10082004,0x04200810,0x02400240,0x02400240,0x01400240,0x000000c0, // 047 FILTER
 0x00800000,0x00800080,0x00000080,0x3c9e0000,0x00000000,0x00800080,0x00800080,0x00000000, // 048 TARGET_POINT
 0x00800000,0x00800080,0x00800080,0x3f7e01c0,0x008001c0,0x00800080,0x00800080,0x00000000, // 049 TARGET_SMALL
 0x00800000,0x00800080,0x03e00080,0x3e3e0220,0x03e00220,0x00800080,0x00800080,0x00000000, // 050 TARGET_BIG
 0x01000000,0x04400280,0x01000100,0x43842008,0x43849ab2,0x01002008,0x04400100,0x01000280, // 051 TARGET_MOVE
 0x01000000,0x04400280,0x01000100,0x41042108,0x41049ff2,0x01002108,0x04400100,0x01000280, // 052 CURSOR_MOVE
 0x781e0000,0x500a4002,0x04204812,0x00000240,0x02400000,0x48120420,0x4002500a,0x0000781e, // 053 CURSOR_SCALE
 0x00000000,0x20003c00,0x24002800,0x01000200,0x00400080,0x00140024,0x003c0004,0x00000000, // 054 CURSOR_SCALE_RIGHT
 0x00000000,0x0004003c,0x00240014,0x00800040,0x02000100,0x28002400,0x3c002000,0x00000000, // 055 CURSOR_SCALE_LEFT
 0x00000000,0x00100020,0x10101fc8,0x10001020,0x10001000,0x10001000,0x00001fc0,0x00000000, // 056 UNDO
 0x00000000,0x08000400,0x080813f8,0x00080408,0x00080008,0x00080008,0x000003f8,0x00000000, // 057 REDO
 0x00000000,0x3ffc0000,0x20042004,0x20002000,0x20402000,0x3f902020,0x00400020,0x00000000, // 058 REREDO
 0x00000000,0x3ffc0000,0x20042004,0x27fc2004,0x20202000,0x3fc82010,0x00200010,0x00000000, // 059 MUTATE
 0x00000000,0x0ff00000,0x10081818,0x11801008,0x10001180,0x18101020,0x00100fc8,0x00000020, // 060 ROTATE
 0x00000000,0x04000200,0x240429fc,0x20042204,0x20442004,0x3f942024,0x00400020,0x00000000, // 061 REPEAT
 0x00000000,0x20001000,0x22104c0e,0x00801120,0x11200040,0x4c0e2210,0x10002000,0x00000000, // 062 SHUFFLE
 0x7ffe0000,0x50024002,0x44024802,0x41024202,0x40424082,0x40124022,0x4002400a,0x00007ffe, // 063 EMPTYBOX
 0x00800000,0x03e00080,0x08080490,0x3c9e0808,0x08080808,0x03e00490,0x00800080,0x00000000, // 064 TARGET
 0x00800000,0x00800080,0x00800080,0x3ffe01c0,0x008001c0,0x00800080,0x00800080,0x00000000, // 065 TARGET_SMALL_FILL
 0x00800000,0x00800080,0x03e00080,0x3ffe03e0,0x03e003e0,0x00800080,0x00800080,0x00000000, // 066 TARGET_BIG_FILL
 0x01000000,0x07c00380,0x01000100,0x638c2008,0x638cfbbe,0x01002008,0x07c00100,0x01000380, // 067 TARGET_MOVE_FILL
 0x01000000,0x07c00380,0x01000100,0x610c2108,0x610cfffe,0x01002108,0x07c00100,0x01000380, // 068 CURSOR_MOVE_FILL
 0x781e0000,0x6006700e,0x04204812,0x00000240,0x02400000,0x48120420,0x700e6006,0x0000781e, // 069 CURSOR_SCALE_FILL
 0x00000000,0x38003c00,0x24003000,0x01000200,0x00400080,0x000c0024,0x003c001c,0x00000000, // 070 CURSOR_SCALE_RIGHT
 0x00000000,0x001c003c,0x0024000c,0x00800040,0x02000100,0x30002400,0x3c003800,0x00000000, // 071 CURSOR_SCALE_LEFT
 0x00000000,0x00300020,0x10301ff8,0x10001020,0x10001000,0x10001000,0x00001fc0,0x00000000, // 072 UNDO_FILL
 0x00000000,0x0c000400,0x0c081ff8,0x00080408,0x00080008,0x00080008,0x000003f8,0x00000000, // 073 REDO_FILL
 0x00000000,0x3ffc0000,0x20042004,0x20002000,0x20402000,0x3ff02060,0x00400060,0x00000000, // 074 REREDO_FILL
 0x00000000,0x3ffc0000,0x20042004,0x27fc2004,0x20202000,0x3ff82030,0x00200030,0x00000000, // 075 MUTATE_FILL
 0x00000000,0x0ff00000,0x10081818,0x11801008,0x10001180,0x18301020,0x00300ff8,0x00000020, // 076 ROTATE_FILL
 0x00000000,0x06000200,0x26042ffc,0x20042204,0x20442004,0x3ff42064,0x00400060,0x00000000, // 077 REPEAT_FILL
 0x00000000,0x30001000,0x32107c0e,0x00801120,0x11200040,0x7c0e3210,0x10003000,0x00000000, // 078 SHUFFLE_FILL
 0x00000000,0x30043ffc,0x24042804,0x21042204,0x20442084,0x20142024,0x3ffc200c,0x00000000, // 079 EMPTYBOX_SMALL
 0x00000000,0x20043ffc,0x20042004,0x20042004,0x20042004,0x20042004,0x3ffc2004,0x00000000, // 080 BOX
 0x00000000,0x23c43ffc,0x23c423c4,0x200423c4,0x20042004,0x20042004,0x3ffc2004,0x00000000, // 081 BOX_TOP
 0x00000000,0x3e043ffc,0x3e043e04,0x20043e04,0x20042004,0x20042004,0x3ffc2004,0x00000000, // 082 BOX_TOP_RIGHT
 0x00000000,0x20043ffc,0x20042004,0x3e043e04,0x3e043e04,0x20042004,0x3ffc2004,0x00000000, // 083 BOX_RIGHT
 0x00000000,0x20043ffc,0x20042004,0x20042004,0x3e042004,0x3e043e04,0x3ffc3e04,0x00000000, // 084 BOX_BOTTOM_RIGHT
 0x00000000,0x20043ffc,0x20042004,0x20042004,0x23c42004,0x23c423c4,0x3ffc23c4,0x00000000, // 085 BOX_BOTTOM
 0x00000000,0x20043ffc,0x20042004,0x20042004,0x207c2004,0x207c207c,0x3ffc207c,0x00000000, // 086 BOX_BOTTOM_LEFT
 0x00000000,0x20043ffc,0x20042004,0x207c207c,0x207c207c,0x20042004,0x3ffc2004,0x00000000, // 087 BOX_LEFT
 0x00000000,0x207c3ffc,0x207c207c,0x2004207c,0x20042004,0x20042004,0x3ffc2004,0x00000000, // 088 BOX_TOP_LEFT
 0x00000000,0x20043ffc,0x20042004,0x23c423c4,0x23c423c4,0x20042004,0x3ffc2004,0x00000000, // 089 BOX_CIRCLE_MASK
 0x7ffe0000,0x40024002,0x47e24182,0x4ff247e2,0x47e24ff2,0x418247e2,0x40024002,0x00007ffe, // 090 BOX_CENTER
 0x7fff0000,0x40014001,0x40014001,0x49555ddd,0x4945495d,0x400149c5,0x40014001,0x00007fff, // 091 POT
 0x7ffe0000,0x53327332,0x44ce4cce,0x41324332,0x404e40ce,0x48125432,0x4006540e,0x00007ffe, // 092 ALPHA_MULTIPLY
 0x7ffe0000,0x53327332,0x44ce4cce,0x41324332,0x5c4e40ce,0x44124432,0x40065c0e,0x00007ffe, // 093 ALPHA_CLEAR
 0x7ffe0000,0x42fe417e,0x42fe417e,0x42fe417e,0x42fe417e,0x42fe417e,0x42fe417e,0x00007ffe, // 094 DITHERING
 0x07fe0000,0x1ffa0002,0x7fea000a,0x402a402a,0x5b2a512a,0x5128552a,0x40205128,0x00007fe0, // 095 MIPMAPS
 0x00000000,0x1ff80000,0x12481248,0x12481ff8,0x1ff81248,0x12481248,0x00001ff8,0x00000000, // 096 BOX_GRID
 0x12480000,0x7ffe1248,0x12481248,0x12487ffe,0x7ffe1248,0x12481248,0x12487ffe,0x00001248, // 097 GRID
 0x00000000,0x1c380000,0x1c3817e8,0x08100810,0x08100810,0x17e81c38,0x00001c38,0x00000000, // 098 BOX_CORNERS_SMALL
 0x700e0000,0x700e5ffa,0x20042004,0x20042004,0x20042004,0x20042004,0x5ffa700e,0x0000700e, // 099 BOX_CORNERS_BIG
 0x3f7e0000,0x21422142,0x21422142,0x00003f7e,0x21423f7e,0x21422142,0x3f7e2142,0x00000000, // 100 FOUR_BOXES
 0x00000000,0x3bb80000,0x3bb83bb8,0x3bb80000,0x3bb83bb8,0x3bb80000,0x3bb83bb8,0x00000000, // 101 GRID_FILL
 0x7ffe0000,0x7ffe7ffe,0x77fe7000,0x77fe77fe,0x777e7700,0x777e777e,0x777e777e,0x0000777e, // 102 BOX_MULTISIZE
 0x781e0000,0x40024002,0x00004002,0x01800000,0x00000180,0x40020000,0x40024002,0x0000781e, // 103 ZOOM_SMALL
 0x781e0000,0x40024002,0x00004002,0x03c003c0,0x03c003c0,0x40020000,0x40024002,0x0000781e, // 104 ZOOM_MEDIUM
 0x781e0000,0x40024002,0x07e04002,0x07e007e0,0x07e007e0,0x400207e0,0x40024002,0x0000781e, // 105 ZOOM_BIG
 0x781e0000,0x5ffa4002,0x1ff85ffa,0x1ff81ff8,0x1ff81ff8,0x5ffa1ff8,0x40025ffa,0x0000781e, // 106 ZOOM_ALL
 0x00000000,0x2004381c,0x00002004,0x00000000,0x00000000,0x20040000,0x381c2004,0x00000000, // 107 ZOOM_CENTER
 0x00000000,0x1db80000,0x10081008,0x10080000,0x00001008,0x10081008,0x00001db8,0x00000000, // 108 BOX_DOTS_SMALL
 0x35560000,0x00002002,0x00002002,0x00002002,0x00002002,0x00002002,0x35562002,0x00000000, // 109 BOX_DOTS_BIG
 0x7ffe0000,0x40024002,0x48124ff2,0x49924812,0x48124992,0x4ff24812,0x40024002,0x00007ffe, // 110 BOX_CONCENTRIC
 0x00000000,0x10841ffc,0x10841084,0x1ffc1084,0x10841084,0x10841084,0x00001ffc,0x00000000, // 111 BOX_GRID_BIG
 0x00000000,0x00000000,0x10000000,0x04000800,0x01040200,0x00500088,0x00000020,0x00000000, // 112 OK_TICK
 0x00000000,0x10080000,0x04200810,0x01800240,0x02400180,0x08100420,0x00001008,0x00000000, // 113 CROSS
 0x00000000,0x02000000,0x00800100,0x00200040,0x00200010,0x00800040,0x02000100,0x00000000, // 114 ARROW_LEFT
 0x00000000,0x00400000,0x01000080,0x04000200,0x04000800,0x01000200,0x00400080,0x00000000, // 115 ARROW_RIGHT
 0x00000000,0x00000000,0x00000000,0x08081004,0x02200410,0x00800140,0x00000000,0x00000000, // 116 ARROW_BOTTOM
 0x00000000,0x00000000,0x01400080,0x04100220,0x10040808,0x00000000,0x00000000,0x00000000, // 117 ARROW_TOP
 0x00000000,0x02000000,0x03800300,0x03e003c0,0x03e003f0,0x038003c0,0x02000300,0x00000000, // 118 ARROW_LEFT_FILL
 0x00000000,0x00400000,0x01c000c0,0x07c003c0,0x07c00fc0,0x01c003c0,0x004000c0,0x00000000, // 119 ARROW_RIGHT_FILL
 0x00000000,0x00000000,0x00000000,0x0ff81ffc,0x03e007f0,0x008001c0,0x00000000,0x00000000, // 120 ARROW_BOTTOM_FILL
 0x00000000,0x00000000,0x01c00080,0x07f003e0,0x1ffc0ff8,0x00000000,0x00000000,0x00000000, // 121 ARROW_TOP_FILL
 0x00000000,0x18a008c0,0x32881290,0x24822686,0x26862482,0x12903288,0x08c018a0,0x00000000, // 122 AUDIO
 0x00000000,0x04800780,0x004000c0,0x662000f0,0x08103c30,0x130a0e18,0x0000318e,0x00000000, // 123 FX
 0x00000000,0x00800000,0x08880888,0x2aaa0a8a,0x0a8a2aaa,0x08880888,0x00000080,0x00000000, // 124 WAVE
 0x00000000,0x00600000,0x01080090,0x02040108,0x42044204,0x24022402,0x00001800,0x00000000, // 125 WAVE_SINUS
 0x00000000,0x07f80000,0x04080408,0x04080408,0x04080408,0x7c0e0408,0x00000000,0x00000000, // 126 WAVE_SQUARE
 0x00000000,0x00000000,0x00a00040,0x22084110,0x08021404,0x00000000,0x00000000,0x00000000, // 127 WAVE_TRIANGULAR
 0x00000000,0x00000000,0x04200000,0x01800240,0x02400180,0x00000420,0x00000000,0x00000000, // 128 CROSS_SMALL
 0x00000000,0x18380000,0x12281428,0x10a81128,0x112810a8,0x14281228,0x00001838,0x00000000, // 129 PLAYER_PREVIOUS
 0x00000000,0x18000000,0x11801600,0x10181060,0x10601018,0x16001180,0x00001800,0x00000000, // 130 PLAYER_PLAY_BACK
 0x00000000,0x00180000,0x01880068,0x18080608,0x06081808,0x00680188,0x00000018,0x00000000, // 131 PLAYER_PLAY
 0x00000000,0x1e780000,0x12481248,0x12481248,0x12481248,0x12481248,0x00001e78,0x00000000, // 132 PLAYER_PAUSE
 0x00000000,0x1ff80000,0x10081008,0x10081008,0x10081008,0x10081008,0x00001ff8,0x00000000, // 133 PLAYER_STOP
 0x00000000,0x1c180000,0x14481428,0x15081488,0x14881508,0x14281448,0x00001c18,0x00000000, // 134 PLAYER_NEXT
 0x00000000,0x03c00000,0x08100420,0x10081008,0x10081008,0x04200810,0x000003c0,0x00000000, // 135 PLAYER_RECORD
 0x00000000,0x0c3007e0,0x13c81818,0x14281668,0x14281428,0x1c381c38,0x08102244,0x00000000, // 136 MAGNET
 0x07c00000,0x08200820,0x3ff80820,0x23882008,0x21082388,0x20082108,0x1ff02008,0x00000000, // 137 LOCK_CLOSE
 0x07c00000,0x08000800,0x3ff80800,0x23882008,0x21082388,0x20082108,0x1ff02008,0x00000000, // 138 LOCK_OPEN
 0x01c00000,0x0c180770,0x3086188c,0x60832082,0x60034781,0x30062002,0x0c18180c,0x01c00770, // 139 CLOCK
 0x0a200000,0x1b201b20,0x04200e20,0x04200420,0x04700420,0x0e700e70,0x0e700e70,0x04200e70, // 140 TOOLS
 0x01800000,0x3bdc318c,0x0ff01ff8,0x7c3e1e78,0x1e787c3e,0x1ff80ff0,0x318c3bdc,0x00000180, // 141 GEAR
 0x01800000,0x3ffc318c,0x1c381ff8,0x781e1818,0x1818781e,0x1ff81c38,0x318c3ffc,0x00000180, // 142 GEAR_BIG
 0x00000000,0x08080ff8,0x08081ffc,0x0aa80aa8,0x0aa80aa8,0x0aa80aa8,0x08080aa8,0x00000ff8, // 143 BIN
 0x00000000,0x00000000,0x20043ffc,0x08043f84,0x04040f84,0x04040784,0x000007fc,0x00000000, // 144 HAND_POINTER
 0x00000000,0x24400400,0x00001480,0x6efe0e00,0x00000e00,0x24401480,0x00000400,0x00000000, // 145 LASER
 0x00000000,0x03c00000,0x08300460,0x11181118,0x11181118,0x04600830,0x000003c0,0x00000000, // 146 COIN
 0x00000000,0x10880080,0x06c00810,0x366c07e0,0x07e00240,0x00001768,0x04200240,0x00000000, // 147 EXPLOSION
 0x00000000,0x3d280000,0x2528252c,0x3d282528,0x05280528,0x05e80528,0x00000000,0x00000000, // 148 1UP
 0x01800000,0x03c003c0,0x018003c0,0x0ff007e0,0x0bd00bd0,0x0a500bd0,0x02400240,0x02400240, // 149 PLAYER
 0x01800000,0x03c003c0,0x118013c0,0x03c81ff8,0x07c003c8,0x04400440,0x0c080478,0x00000000, // 150 PLAYER_JUMP
 0x3ff80000,0x30183ff8,0x30183018,0x3ff83ff8,0x03000300,0x03c003c0,0x03e00300,0x000003e0, // 151 KEY
 0x3ff80000,0x3ff83ff8,0x33983ff8,0x3ff83398,0x3ff83ff8,0x00000540,0x0fe00aa0,0x00000fe0, // 152 DEMON
 0x00000000,0x0ff00000,0x20041008,0x25442004,0x10082004,0x06000bf0,0x00000300,0x00000000, // 153 TEXT_POPUP
 0x00000000,0x11440000,0x07f00be8,0x1c1c0e38,0x1c1c0c18,0x07f00e38,0x11440be8,0x00000000, // 154 GEAR_EX
 0x00000000,0x20080000,0x0c601010,0x07c00fe0,0x07c007c0,0x0c600fe0,0x20081010,0x00000000, // 155 CRACK
 0x00000000,0x20080000,0x0c601010,0x04400fe0,0x04405554,0x0c600fe0,0x20081010,0x00000000, // 156 CRACK_POINTS
 0x00000000,0x00800080,0x01c001c0,0x1ffc3ffe,0x03e007f0,0x07f003e0,0x0c180770,0x00000808, // 157 STAR
 0x0ff00000,0x08180810,0x08100818,0x0a100810,0x08180810,0x08100818,0x08100810,0x00001ff8, // 158 DOOR
 0x0ff00000,0x08100810,0x08100810,0x10100010,0x4f902010,0x10102010,0x08100010,0x00000ff0, // 159 EXIT
 0x00040000,0x001f000e,0x0ef40004,0x12f41284,0x0ef41214,0x10040004,0x7ffc3004,0x10003000, // 160 MODE_2D
 0x78040000,0x501f600e,0x0ef44004,0x12f41284,0x0ef41284,0x10140004,0x7ffc300c,0x10003000, // 161 MODE_3D
 0x7fe00000,0x50286030,0x47fe4804,0x44224402,0x44224422,0x241275e2,0x0c06140a,0x000007fe, // 162 CUBE
 0x7fe00000,0x5ff87ff0,0x47fe4ffc,0x44224402,0x44224422,0x241275e2,0x0c06140a,0x000007fe, // 163 CUBE_FACE_TOP
 0x7fe00000,0x50386030,0x47fe483c,0x443e443e,0x443e443e,0x241e75fe,0x0c06140e,0x000007fe, // 164 CUBE_FACE_LEFT
 0x7fe00000,0x50286030,0x47fe4804,0x47fe47fe,0x47fe47fe,0x27fe77fe,0x0ffe17fe,0x000007fe, // 165 CUBE_FACE_FRONT
 0x7fe00000,0x50286030,0x47fe4804,0x44224402,0x44224422,0x3ff27fe2,0x0ffe1ffa,0x000007fe, // 166 CUBE_FACE_BOTTOM
 0x7fe00000,0x70286030,0x7ffe7804,0x7c227c02,0x7c227c22,0x3c127de2,0x0c061c0a,0x000007fe, // 167 CUBE_FACE_RIGHT
 0x7fe00000,0x7fe87ff0,0x7ffe7fe4,0x7fe27fe2,0x7fe27fe2,0x24127fe2,0x0c06140a,0x000007fe, // 168 CUBE_FACE_BACK
 0x00000000,0x2a0233fe,0x22022602,0x22022202,0x2a022602,0x00a033fe,0x02080110,0x00000000, // 169 CAMERA
 0x00000000,0x200c3ffc,0x000c000c,0x3ffc000c,0x30003000,0x30003000,0x3ffc3004,0x00000000, // 170 SPECIAL
 0x00000000,0x0022003e,0x012201e2,0x0100013e,0x01000100,0x79000100,0x4f004900,0x00007800, // 171 LINK_NET
 0x00000000,0x44007c00,0x45004600,0x00627cbe,0x00620022,0x45007cbe,0x44004600,0x00007c00, // 172 LINK_BOXES
 0x00000000,0x0044007c,0x0010007c,0x3f100010,0x3f1021f0,0x3f100010,0x3f0021f0,0x00000000, // 173 LINK_MULTI
 0x00000000,0x0044007c,0x00440044,0x0010007c,0x00100010,0x44107c10,0x440047f0,0x00007c00, // 174 LINK
 0x00000000,0x0044007c,0x00440044,0x0000007c,0x00000010,0x44007c10,0x44004550,0x00007c00, // 175 LINK_BROKE
 0x02a00000,0x22a43ffc,0x20042004,0x20042ff4,0x20042ff4,0x20042ff4,0x20042004,0x00003ffc, // 176 TEXT_NOTES
 0x3ffc0000,0x20042004,0x245e27c4,0x27c42444,0x2004201e,0x201e2004,0x20042004,0x00003ffc, // 177 NOTEBOOK
 0x00000000,0x07e00000,0x04200420,0x24243ffc,0x24242424,0x24242424,0x3ffc2424,0x00000000, // 178 SUITCASE
 0x00000000,0x0fe00000,0x08200820,0x40047ffc,0x7ffc5554,0x40045554,0x7ffc4004,0x00000000, // 179 SUITCASE_ZIP
 0x00000000,0x20043ffc,0x3ffc2004,0x13c81008,0x100813c8,0x10081008,0x1ff81008,0x00000000, // 180 MAILBOX
 0x00000000,0x40027ffe,0x5ffa5ffa,0x5ffa5ffa,0x40025ffa,0x03c07ffe,0x1ff81ff8,0x00000000, // 181 MONITOR
 0x0ff00000,0x6bfe7ffe,0x7ffe7ffe,0x68167ffe,0x08106816,0x08100810,0x0ff00810,0x00000000, // 182 PRINTER
 0x3ff80000,0xfffe2008,0x870a8002,0x904a888a,0x904a904a,0x870a888a,0xfffe8002,0x00000000, // 183 PHOTO_CAMERA
 0x0fc00000,0xfcfe0cd8,0x8002fffe,0x84428382,0x84428442,0x80028382,0xfffe8002,0x00000000, // 184 PHOTO_CAMERA_FLASH
 0x00000000,0x02400180,0x08100420,0x20041008,0x23c42004,0x22442244,0x3ffc2244,0x00000000, // 185 HOUSE
 0x00000000,0x1c700000,0x3ff83ef8,0x3ff83ff8,0x0fe01ff0,0x038007c0,0x00000100,0x00000000, // 186 HEART
 0x00000000,0x00000000,0x00000000,0x00000000,0x00000000,0x00000000,0x80000000,0xe000c000, // 187 CORNER
 0x00000000,0x14001c00,0x15c01400,0x15401540,0x155c1540,0x15541554,0x1ddc1554,0x00000000, // 188 VERTICAL_BARS
 0x00000000,0x03000300,0x1b001b00,0x1b601b60,0x1b6c1b60,0x1b6c1b6c,0x1b6c1b6c,0x00000000, // 189 VERTICAL_BARS_FILL
 0x00000000,0x00000000,0x403e7ffe,0x7ffe403e,0x7ffe0000,0x43fe43fe,0x00007ffe,0x00000000, // 190 LIFE_BARS
 0x7ffc0000,0x43844004,0x43844284,0x43844004,0x42844284,0x42844284,0x40044384,0x00007ffc, // 191 INFO
 0x40008000,0x10002000,0x04000800,0x01000200,0x00400080,0x00100020,0x00040008,0x00010002, // 192 CROSSLINE
 0x00000000,0x1ff01ff0,0x18301830,0x1f001830,0x03001f00,0x00000300,0x03000300,0x00000000, // 193 HELP
 0x3ff00000,0x2abc3550,0x2aac3554,0x2aac3554,0x2aac3554,0x2aac3554,0x2aac3554,0x00003ffc, // 194 FILETYPE_ALPHA
 0x3ff00000,0x201c2010,0x22442184,0x28142424,0x29942814,0x2ff42994,0x20042004,0x00003ffc, // 195 FILETYPE_HOME
 0x07fe0000,0x04020402,0x7fe20402,0x44224422,0x44224422,0x402047fe,0x40204020,0x00007fe0, // 196 LAYERS_VISIBLE
 0x07fe0000,0x04020402,0x7c020402,0x44024402,0x44024402,0x402047fe,0x40204020,0x00007fe0, // 197 LAYERS
 0x00000000,0x40027ffe,0x7ffe4002,0x40024002,0x40024002,0x40024002,0x7ffe4002,0x00000000, // 198 WINDOW
 ];


/*-----------------------------------------------------------------------*/


 function guiObjInit ()
 {
 if(Object.keys(gui_obj).length!=0) { return; }
 gui_obj.handef=handleDefine("gui",128);
 gui_obj.is_init=true;
 }






//       fill: this is the default value which stretches the image to fit the content box, regardless of its aspect-ratio.
//    contain: increases or decreases the size of the image to fill the box whilst preserving its aspect-ratio.
//      cover: the image will fill the height and width of its box, once again maintaining its aspect ratio but often cropping the image in the process.
//       none: image will ignore the height and width of the parent and retain its original size.
// scale-down: the image will compare the difference between none and contain in order to find the smallest concrete object size.



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
  case "source":
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
   ///obj.dom.srcObject=null;
 //  obj.dom.src=null;
   //obj.dom.setAttribute('src',null);
   }
  //if(type=="video")   {   obj.dom.style.objectFit="cover";   }
  //else                {   obj.dom.style.objectFit="fill";   }
  obj.dom.style.objectFit="fill";
  obj.dom.style.position="absolute";
  obj.dom.style.zIndex=1000; // higher zi is on top
  obj.dom.style.opacity=1.0;
  obj.dom.style.display="none";
  aa.guiParentAdd(h,0);
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
 grp.vars=grp.obj.vars;
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






 /*
 function guiParentAdd (handle,nhandle)
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
*/


 function guiParentAdd    (handle,nhandle)
 {
 var obj,nobj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(nhandle==0)
  {
  document.body.appendChild(obj.dom);
  obj.parent_handle=nhandle;
  }
 else
  {
  if((nobj=handleCheck(gui_obj.handef,nhandle))==null) { return false; }
  obj.dom.appendChild(nobj.dom);
  obj.parent_handle=nhandle;
  }
 return true;
 }


 function guiParentRemove (handle,nhandle)
 {
 var obj,pobj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if(nhandle==0)
  {
  document.body.removeChild(obj.dom);
  obj.parent_handle=nhandle;
  }
 else
  {
  if((nobj=handleCheck(gui_obj.handef,nhandle))==null) { return false; }
  obj.dom.removeChild(nobj.dom);
  obj.parent_handle=0;
  }
 return true;
 }

/*
 if((pobj=handleCheck(gui_obj.handef,phandle))==null) { return false; }
 pobj.dom.removeChild(obj.dom);
 obj.parent_handle=0;

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






 function guiParentRemove (handle,nhandle)
 {
 var obj,pobj;

 if((obj=handleCheck(gui_obj.handef,handle))==null) { return false; }
 if((pobj=handleCheck(gui_obj.handef,phandle))==null) { return false; }
 pobj.dom.removeChild(obj.dom);
 obj.parent_handle=0;
/*
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

*/


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
 if(lw) { obj.ctx.lineWidth=lw; } //obj.ctx.lineJoin="round"; }
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



 function guiCanvasTriangle (handle,x1,y1,x2,y2,x3,y3,lw,bc,fc)
 {
 var grp;

 if((grp=aa.guiGroupGet(handle))==null) { return false; }
 if(lw) { grp.ctx.lineWidth=lw;  } // grp.ctx.lineJoin="round";
 if(fc) { grp.ctx.fillStyle=fc; }
 if(bc) { grp.ctx.strokeStyle=bc; }
 grp.ctx.beginPath();
 grp.ctx.moveTo(x1,y1);
 grp.ctx.lineTo(x2,y2);
 grp.ctx.lineTo(x3,y3);
 grp.ctx.closePath();
 if(fc) { grp.ctx.fill(); }
 if(bc) { grp.ctx.stroke(); }
 return true;
 }




 function guiCanvasRayIcon (handle,x,y,w,h,idx,cl)
 {
 var grp,wd,hd,i,k,xx,yy,py,pls;

 if((grp=aa.guiGroupGet(handle))==null) { return false; }
 if(idx<0||idx>=199) { return false; }
 if((w%16)!=0) { return false; }
 if((h%16)!=0) { return false; }
 if(grp.ctx.scale_factor>1.0) { pls=1; }
 else                         { pls=0; }
 wd=parseInt(w/16);
 hd=parseInt(h/16);
 py=0;
 for(i=0;i<16*16/32;i++)
  {
  for(k=0;k<32;k++)
   {
   if(aa.numBitGet(guiRayIcon[8*idx+i],k))
    {
    xx=x+(k%16)*wd;
    yy=y+py*hd;
    aa.guiCanvasFill(handle,xx,yy,wd+pls,hd+pls,cl);
    }
   if((k==15)||(k==31)) { py++; }
   }
  }
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
 if(pos)        { obj.dom.style.position=pos;  }
 if(zindex)     { obj.dom.style.zIndex=zindex; }
 if(opacity>=0) { obj.dom.style.opacity=opacity; }
 if(display)    { obj.dom.style.display=display; }
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
  obj.is_recording=false;
  obj.is_attached=false;
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
  obj.attached_handle=0;
  obj.output_media_stream=null;
  obj.output_tracks=[];
  obj.stage=100;
  obj.recorder={};
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
  if(obj.is_attached==true) { alert("already attached");}
  if((dobj=aa.guiGet(dhandle))==null)          { return false; }
  obj.is_atteched=true;
  obj.attached_handle=dhandle;
  dobj.dom.srcObject=null;
  dobj.dom.srcObject=obj.output_media_stream;
  dobj.frame_number=0;
  dobj.prev_time=-1;
  isplaying=dobj.dom.currentTime>0&&!dobj.dom.paused&&!dobj.dom.ended&&dobj.dom.readyState>2;
  if(!isplaying) { dobj.dom.play();  }
  }
 else
  {
  if(obj.is_attached!=true) { alert("not attached");}
  obj.is_atteched=false;
  obj.attached_handle=0;
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
  obj.stage=300;
  break;

  case 300:
  return true;
  }
 return false;
 }





 function mediaRecorderStart (handle,abps,vbps)
 {
 var obj,options;//,options={mimeType:'video/webm;codecs=h264'};
 //var options={audioBitsPerSecond:128000,videoBitsPerSecond:3000000,mimeType:'video/webm;codecs=h264'}
 options={audioBitsPerSecond:abps,videoBitsPerSecond:vbps,mimeType:'video/webm;codecs=vp8'}

 if((obj=handleCheck(media_obj.handef,handle))==null) { return false; }
 if(obj.is_recording==true) { alert("already recording"); return false; }
 obj.is_recording=true;
 obj.recorder={};
 obj.recorder.mr=new MediaRecorder(obj.stream,options);
 obj.recorder.is_stopping=false;
 obj.recorder.is_stop=false;
 obj.recorder.is_start=false;
 obj.recorder.is_error=false;
 obj.recorder.tik=aa.timerMsRunning();
 obj.recorder.elapsed=0;
 obj.recorder.dat=[];
 obj.recorder.mr.ondataavailable=function(e)
  {
  obj.recorder.dat.push(e.data);
  }
 obj.recorder.mr.onstop=function(e)           {  obj.recorder.is_stop=true;     }
 obj.recorder.mr.onstart=function(e)          {  obj.recorder.is_start=true;    }
 obj.recorder.mr.onerror=function(e)          {  obj.recorder.is_error=true;    }
 obj.recorder.mr.start(1000);
 return true;
 }






 function mediaRecorderStop (handle)
 {
 var obj;

 if((obj=handleCheck(media_obj.handef,handle))==null) { return false; }
 if(obj.is_recording!=true) { alert("not recording"); return false; }
 if(obj.recorder.is_stopping==true) { alert("already stopping"); return false; }
 obj.recorder.is_stopping=true;
 obj.recorder.mr.stop();
 return true;
 }





 function mediaRecorderStatus (handle)
 {
 var obj;

 if((obj=handleCheck(media_obj.handef,handle))==null) { return false; }
 if(obj.is_recording!=true) { alert("not recording"); return false; }
 if(obj.recorder.is_stopping==true)
  {
  if(obj.recorder.is_stop!=true) { return false; }
  return true;
  }
 obj.recorder.elapsed=aa.timerMsRunning()-obj.recorder.tik;
 return true;
 }





 function mediaRecorderRead (handle)
 {
 var obj;

 if((obj=handleCheck(media_obj.handef,handle))==null) { return false; }
 if(obj.is_recording!=true) { alert("not recording");   return false; }
 if(obj.recorder.is_stop!=true) { alert("read no stop"); return false; }
 obj.recorder.recordedBlob=new Blob(obj.recorder.dat);
  //  grp.dom.src=URL.createObjectURL(recordedBlob);  //  grp.dom.play();

 obj.recorder.reader={};
 obj.recorder.reader.is_error=false;
 obj.recorder.reader.is_loadend=false;
 obj.recorder.reader.is_load=false;
 obj.recorder.reader.fr=new FileReader();
 obj.recorder.reader.fr.onerror=function()
  {
  obj.recorder.reader.is_error=true;
  }
 obj.recorder.reader.fr.onloadend=function()
  {
  obj.recorder.reader.is_loadend=true;
  }
 obj.recorder.reader.fr.onload=function()
  {
  obj.recorder.reader.ara=obj.recorder.reader.fr.result;
  obj.recorder.reader.is_load=true;
  }
 obj.recorder.reader.fr.readAsArrayBuffer(obj.recorder.recordedBlob);
 return true;
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
  obj.is_direct=false;///true;
  obj.vars={};
  obj.socket=new WebSocket(obj.url);
  obj.socket.binaryType='arraybuffer';
  //obj.socket.binaryType='blob';
  obj.socket.onopen=function()  { obj.is_open=true;   }
  obj.socket.onclose=function() { aa.debugLog("sock.close");  obj.is_closed=true; }
  obj.socket.onerror=function() { aa.debugLog("errse");  obj.is_error=true;  }
  obj.socket.onmessage=function(data)
   {
///   console.log(data.data);
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
  //obj.socket.send(msg,{binary: true, mask: false});
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
 main_obj.state.click_count=0;
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
     case 'setInterval':	 fakeIdToId[fakeId]=setInterval(function() {postMessage({fakeId:fakeId});},time); break;\
     case 'clearInterval': if(fakeIdToId.hasOwnProperty(fakeId))     {clearInterval(fakeIdToId[fakeId]); delete fakeIdToId[fakeId]; } break;\
     case 'setTimeout': 	 fakeIdToId[fakeId]=setTimeout(function()  {postMessage({fakeId:fakeId}); if(fakeIdToId.hasOwnProperty(fakeId)) { delete fakeIdToId[fakeId];} },time); break;\
     case 'clearTimeout':	 if(fakeIdToId.hasOwnProperty(fakeId))     {clearTimeout(fakeIdToId[fakeId]); delete fakeIdToId[fakeId]; } break;\
     }\
    }"]);
   workerscript=window.URL.createObjectURL(blob);
   ///console.log("blob good");
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
   function _getFakeId()
    {
    do { if(lastFakeId==maxFakeId) { lastFakeId=0; } else { lastFakeId++; }  }  while(fakeIdToCallback.hasOwnProperty(lastFakeId));
    return lastFakeId;
    }
   try
    {
    worker=new Worker(workerscript);
    window.setInterval=function(callback,time)
     {
     var fakeId=_getFakeId();
     fakeIdToCallback[fakeId]={callback:callback,parameters:Array.prototype.slice.call(arguments,2)};
     worker.postMessage({name:'setInterval',fakeId:fakeId,time:time});
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
    window.setTimeout=function(callback,time)
     {
     var fakeId=_getFakeId();
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
      try {callback=new Function(callback);}
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
  ///aa.mainThrottleFix(null);
  console.log("dethrottling");
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
   ///console.log("is_running="+main_obj.state.is_running+" is_exiting="+main_obj.state.is_exiting);
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
 var obj,p,s,scr,e,mat,so,ep;

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

 function _eventPath(evt)
  {
  var path=(evt.composedPath&&evt.composedPath())||evt.path,target=evt.target;
  if(path!=null) {  return(path.indexOf(window)<0)?path.concat(window):path; }
  if(target===window) { return [window]; }
  function _getParents(node,memo)
   {
   memo=memo||[]; var pn=node.parentNode;
   if(!pn) { return memo; }
   return _getParents(pn,memo.concat(pn));
   }
  return [target].concat(_getParents(target),window);
  }

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
  ep=_eventPath(event);
  for(p=0;p<ep.length;p++)
   {
   if(obj.state==1) { break; }
   if(typeof ep[p]==='object')
    {
    if(ep[p].scripts)
     {
     for(e=0;e<ep[p].scripts.length;e++)
      {
      if((so=aa.stringIndexOf(true,ep[p].scripts[e].src,obj.script.src,0))<0) { continue; }
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
    return Object.getOwnPropertyNames(object).filter(function(property) { return typeof object[property]=='function'; });
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
 pointer_obj:pointer_obj,
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
 numBitGet:numBitGet,
 numBitSet:numBitSet,
 numBitClear:numBitClear,
 numBitToggle:numBitToggle,


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


 pointerStart:pointerStart,
 pointerOnEvent:pointerOnEvent,
 pointerPeek:pointerPeek,
 pointerRead:pointerRead,
 pointerStatus:pointerStatus,

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
 guiParentAdd:guiParentAdd,
 guiParentRemove:guiParentRemove,
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
 guiCanvasTriangle:guiCanvasTriangle,
 guiCanvasRayIcon:guiCanvasRayIcon,
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
 mediaRecorderStart:mediaRecorderStart,
 mediaRecorderStop:mediaRecorderStop,
 mediaRecorderStatus:mediaRecorderStatus,
 mediaRecorderRead:mediaRecorderRead,

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

