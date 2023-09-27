//---------------------------------------------------------
"use strict";



 var cfg_app_version="3.04";
 var cfg_app_speed=30;
 var cfg_profiler_use=0;
 var cfg_max_peers=2;
 var cfg_audio_default_gain=4.5;
 var cfg_audio_local_initially_muted=false;
 var cfg_audio_peer_initially_muted=false;
 var cfg_audio_loopback_muted=true;
 var cfg_cam_res_wid=320;
 var cfg_cam_res_short=false;
 var cfg_cam_res_rot=false;
 var cfg_v_fps=30;
 var cfg_a_aec=true;
 var cfg_a_nsu=false;
 var cfg_a_agc=true;
 var cfg_audio_script_processor_size=1024;
 var cfg_audio_fft_size=128;
 var cfg_audio_max_db=-30;
 var cfg_audio_min_db=-120;
 var cfg_audio_threshold=123;
 var cfg_audio_default_gain=4.5;
 var cfg_sdp_use_arate=(64);
 var cfg_sdp_use_vrate=(512);

 window.onload=function()  {  aa.mainStart(cfg_app_version,cfg_app_speed,appProc);  aa.mainRun();  };

 var app=aa.main_vars.app;




//---------------------------------------------------------




 function speechrecogNew (lang)
 {
 var obj,i,len,txt,todo,msg,out,was;
 if(app.ei.has_speech_recog!=true) { return null; }
 obj={};
 obj.type="speechrecog";
 obj.is_recognizing=false;
 obj.is_ended=false;
 obj.is_lang=lang;
 obj.is_aborted=false;
 obj.thresh_length=22;
 obj.thresh_wait=2000;
 obj.inter_off=0;
 obj.finel_off=0;
 obj.str="";
 obj.err=0;
 obj.inter="";
 obj.finel="";
 obj.all="";
 obj.start_ms=aa.timerMsRunning();
 obj.inact_ms=0;
 obj.guid=0;
 obj.recog=new webkitSpeechRecognition();
 obj.recog.continuous=true;
 obj.recog.interimResults=true;
 obj.recog.lang=obj.is_lang;

 obj.recog.onstart=function(event)        { obj.is_recognizing=true;  };
 obj.recog.onspeechstart=function(event)  {   };//console.log("speech start");  };
 obj.recog.onspeechend=function(event)    {   };
 obj.recog.onsoundstart=function(event)   {   };//console.log("sound start");  };
 obj.recog.onsoundend=function(event)     {   };
 obj.recog.onaudiostart=function(event)   {   };//console.log("audio start");  };
 obj.recog.onaudioend=function(event)     {   };
 obj.recog.onend=function(event)          { obj.is_recognizing=false;  obj.is_ended=true;  };
 obj.recog.onerror=function(event)
  {
  if(app.ei.platform=="iPhone"&&app.beam&&app.beam.my_id>0) { clientRtcsigWrite(app.beam.rtcsig_cli,1,"bug",event.error);   }
  if(event.error=="aborted")   { console.log("aborted"); obj.is_recognizing=false; obj.is_aborted=true; obj.is_ended=true;  }
  else
  if(event.error!="no-speech") { console.log(event.error); }
  };
 obj.recog.onnomatch=function(event)      {   };



 obj.recog.onresult=function(event)
  {
  was=obj.inter;
  obj.inter="";
  for(i=0;i<event.results.length;i++)
   {
   obj.inter+=event.results[i][0].transcript;
   }
  obj.all=obj.inter;

  //if(app.ei.platform=="iPhone"&&app.beam&&app.beam.my_id>0)  {  clientRtcsigWrite(app.beam.rtcsig_cli,1,"bug",obj.all);   }

  //console.log(obj.inter);
  if(obj.inter!=""&&was=="")  // starting new sentence
   {
   obj.inact_ms=aa.timerMsRunning();
   }

  len=obj.inter.length-obj.inter_off;
  if(len>=obj.thresh_length) // if characters avail >=thresh
   {
   txt=obj.inter.substring(obj.inter_off);
   obj.inter_off+=(txt.length+1);
   if(app.beam&&app.beam.my_id>0)
    {
    msg={};
    msg.txt=txt;
    console.log("writing to rtcsig ["+txt+"]");
    clientRtcsigWrite(app.beam.rtcsig_cli,0,"chat",JSON.stringify(msg));
    obj.inact_ms=aa.timerMsRunning();
    }
   //obj.inact_ms=aa.timerMsRunning();
   }
  };
 return obj;
 }





 function speechrecogStart (obj)
 {
 if(obj.type!="speechrecog") { return false; }
 obj.is_recognizing=false;
 obj.is_ended=false;
 obj.is_aborted=false;
 obj.inter_off=0;
 obj.finel_off=0;
 obj.err=0;
 obj.inter="";
 obj.finel="";
 obj.str="";
 obj.start_ms=aa.timerMsRunning();
 obj.inact_ms=0;
 obj.guid=0;
 obj.recog.start();
 console.log("speechrecogstart");
 return true;
 }




 function speechrecogStop (obj)
 {
 if(obj.type!="speechrecog") { return false; }
 obj.recog.abort();
 return true;
 }




 function speechrecogWhip (obj)
 {
 var el,len,txt,msg,pa,lch,etc,was,fc;

 if(obj.type!="speechrecog") { return false; }
 len=obj.inter.length-obj.inter_off;
 if(len<=0)             { return false; }
 el=aa.timerMsElapsed(obj.inact_ms);
 if(el<obj.thresh_wait) { return false; }
 was=obj.inter;
 txt=obj.inter.substring(obj.inter_off);
 obj.inter_off+=(txt.length+1);
 while(1)
  {
  if(txt.length==0) { break; }
  fc=aa.stringFirstCharGet(txt);
  if(fc!=" ") { break; }
  txt=aa.stringFirstCharTrim(txt);
  }

 if(txt.length>0)
  {
  if(app.beam&&app.beam.my_id>0)
   {
   msg={};
   msg.txt=txt;
   ///console.log("Sending chat ["+msg.txt+"]");
   clientRtcsigWrite(app.beam.rtcsig_cli,0,"chat",JSON.stringify(msg));
   obj.inact_ms=aa.timerMsRunning();
   obj.inter="";
   return true;
   }
  }

 console.log("bad whip");
 //aa.debugAlert();
 }






 function appYield ()
 {
 var str,lines,i;
 if(app.cpu_speed==0)
  {
  if(aa.main_obj.state.speed_req==cfg_app_speed) { aa.mainSpeedSet(cfg_app_speed<<1); }
  app.cpu_speed=aa.envCpuMonitorGet();
  if(app.cpu_speed!=0)
   {
   if(0) { alert("cpu speed = "+app.cpu_speed+" took "+aa.timerMsRunning()); }
   else  { console.log("cpu speed = "+app.cpu_speed+" took "+aa.timerMsRunning()); }
   aa.mainSpeedSet(cfg_app_speed);
   if(cfg_profiler_use)  {  aaProfilerStart();  }
   }
  }
 if(app.cpu_speed!=0)
  {
  if(cfg_profiler_use&&aa_profiler.is_started&&aa.mainCyclePulse(66))
   {
   str=aaProfilerDump(0,100,0,20000000,1,0,1);
   if(str!=false)
    {
    lines=str.split(/\r\n|\r|\n/);
    console.log(" ");
    for(i=0;i<lines.length;i++) {   console.log(lines[i]);    }
    }
   }
  }
 mediaYield();
 if(app.tfl)  { for(i=0;i<4;i++) { tflowYield(app.tfl); }  }
 if(app.beam) { for(i=0;i<4;i++) { beamYield(app.beam); }  }
 }



 var gotkin=0;
 var tomdone=0;


 function appProc ()
 {
 var med,i,grp,eob,pgrp,pgsz;
 var rgba;

 switch(aa.main_state.stage)
  {
  case 0:
  console.log("begin");
  app.options={};
  app.cpu_speed=0;
  app.ei=aa.envInfoGet();
  aa.envCpuMonitorBegin(12);
  aa.mainStageSet(10);
  break;



  case 66:
  break;



  case 10:
  if(app.cpu_speed==0) { break; }
  //pal=aa.guiPaletteByName("salmon");
  //pam=aa.guiPaletteByIndex(10);
  //console.log(pal,pam);
  ///for(go=0;go<500000;go++)  {   de=aa.guiCieDeltae(21,11,72,177,99,29);   }
  tflowStart();
  app.tfl=tflowCreate();
  aa.mainStageSet(15);
  break;


  case 15:
  if(app.vlog==undefined)
   {
   app.vlog=aa.virtualLogNew(20);
   console.log("virtuallog new");
   }
  aa.mainStageSet(20);
  break;




  case 20:
  guixStart();
  aa.mainStageSet(30);
  break;


  case 30:
  if(app.guix.is_ready!=true)      { break; }
  if(app.guix.group_ray.length==0) { break; }
  aa.mainStageSet(40);
  break;


  case 40:
  guixSplash();
  aa.mainStageSet(50);
  break;


  case 50:
  pgrp=aa.guiGroupGetById("b_canvas_0");
  if(pgrp==null||pgrp.dom.width==0)  { alert(); }
  pgsz=aa.guiSizesGet(pgrp.han);
  aa.guiCanvasImageDraw(pgrp.obj.han,null,null,null,null,0,0,pgsz.domwh[0],pgsz.domwh[1],app.guix.image.img);
  console.log("p");
  tflowPush(app.tfl,pgsz.domwh[0],pgsz.domwh[1],pgrp.obj.dom);
  console.log("p2");

  aa.mainStageSet(55);
  break;


  case 55:
  if(aa.main_state.initial_click==false) { break; }
  console.log("initial click");
  aa.guiCanvasFillFull(aa.guiGroupGetById("maincanvas").han,aa.guiRgbaString(255,255,255,1));
  aa.mainStageSet(60);
  break;


  case 60:
  mediaStart();
  aa.mainStageSet(70);
  break;


  case 70:
  mediaDetectStart();
  aa.mainStageSet(80);
  break;


  case 80:
  //if(app.pic.is_loading==true) { break; }
  if(app.media.is_detect_success==false&&app.media.is_detect_failure==false) { break; }
  if(app.media.is_detect_success==true) {  aa.mainStageSet(90); break; }
  aa.mainStageSet(66);
  break;


  case 90:
  if(app.media.devenu.vid_input==true&&app.media.devenu.aud_input==true)
   {
   if(0) { mediaDeviceDump(false); }
   mediaDeviceListInit(app.media.devenu);
   aa.mainStageSet(100);
   break;
   }
  aa.debugAlert();
  aa.mainStageSet(66);
  break;



  case 100:
  aa.mainStageSet(200);
  break;

  case 200:
  app.media.handle=mediaPairCreate(app.media.cur_axi,app.media.cur_vxi);
  aa.mainStageSet(220);
  break;



  case 220:
  aa.mediaStatus(app.media.handle);
  med=aa.mediaGet(app.media.handle);
  if(med==null) { break; }
  if(med.res==="err")
   {
   err=aa.mediaErrorEtc(med.e_name,med.e_msg);
   switch(err)    {    default: alert("berr = "+err+"  "+med.e_name+"  "+med.e_msg); break;    }
   aa.mainStageSet(666);
   break;
   }
  if(med.res!=="ok")  { break; }
  if(med.stage!=300)  { break; }
  if((grp=aa.guiGroupGetById("b_video_0"))==null) { aa.debugAlert("eee"); }
  aa.mediaAttach(app.media.handle,grp.han);
  if(cfg_audio_loopback_muted==true)   {   grp.dom.muted=true;    grp.dom.volume=0;   }
  else                                 {   grp.dom.muted=false;   grp.dom.volume=1;   }
  if(med.res!="ok")  { console.log(med.e_name,med.e_msg,med.e_code,med.e_etc0,med.e_etc1);   }
  eob=aa.mediaErrObjCreate(med.res,med.e_name,med.e_msg,med.e_code);
  mediaDeviceListErr(app.media.active_devenu,"videoinput",app.media.cur_vxi,eob);//app.media.cur_axi,err);
  mediaDeviceListErr(app.media.active_devenu,"audioinput",app.media.cur_axi,eob);//app.media.cur_axi,err);
  aa.mainStageSet(240);
  break;


  case 240:
  mediaDeviceSwapperInit();
  aa.mainStageSet(250);
  break;




  case 250:
  aa.mainStageSet(260);
  break;


  case 260:
  aa.mainStageSet(300);
  break;



  case 300:
  console.log("CONNECTING");
  app.beam=beamNew("wss://xdosh.com:443/wss/rtcsig/","demo");
  aa.mainStageSet(480);
  break;



  case 480:
  //app.sprec=speechrecogNew("en-us"); // use users local language
  app.sprec=speechrecogNew("en-US"); // use users local language
  if(app.sprec==null) { alert("ss"); }
  aa.mainStageSet(490);
  break;



  case 490:
  if(app.ei.has_speech_recog!=true) { aa.mainStageSet(500); break; }
  speechrecogStart(app.sprec);
  aa.mainStageSet(500);
  break;


  case 495:
  if(aa.timerMsElapsed(app.delo)<1) { break; }
  aa.mainStageSet(490);
  break;

  case 496:
  if(aa.timerMsElapsed(app.delo)<50) { break; }
  aa.mainStageSet(490);
  break;

  case 500:
  if(app.ei.has_speech_recog)
   {
   speechrecogWhip(app.sprec);
   if(app.sprec.is_ended==true)
    {
    speechrecogStop(app.sprec);
    app.delo=aa.timerMsRunning();
    if(app.sprec.is_aborted==true) { console.log("abort"); aa.mainStageSet(496); break; }
    aa.mainStageSet(495);
    break;
    }
   }
  break;
  }


 appYield();
 }











 function clientNew (address)
 {
 var obj={};
 obj.type="client";
 obj.show_bug=true;
 obj.ustage=0;
 obj.uextra=[0,0];
 obj.stage=1000;
 obj.sock_handle=0;
 obj.sock_status=null;
 obj.sock_obj=null;
 obj.sock_xfwd="";
 obj.close_msg_shown=false;
 obj.error_msg_shown=false;
 obj.pkt_in_ray=[];
 obj.tot_pkts_sent=0;
 obj.tot_pkts_read=0;
 obj.address=address;
 obj.vars={};
 obj.sock_handle=aa.socketCreate(address);
 if(obj.sock_handle==0) {   aa.debugAlert("ff");  }
 aa.socketYield(obj.sock_handle);
 obj.sock_obj=aa.socketGet(obj.sock_handle);
 obj.sock_status=aa.socketStatus(obj.sock_handle);
 return obj;
 }



 function clientDelete (clientobj)
 {
 if(clientobj==null)          { return false;  }
 if(clientobj.type!="client") { return false; }
 if(clientobj.sock_handle!=0) { aa.socketDestroy(clientobj.sock_handle); }
 clientobj.sock_handle=0;
 clientobj.sock_status=null;
 clientobj.sock_obj=null;
 clientobj.pkt_in_ray=[];
 clientobj.vars={};
 clientobj={};
 clientobj=null;
 return true;
 }





 function clientReconnect (clientobj)
 {
 var adr,sbu;
 if(clientobj==null)          { return false;  }
 if(clientobj.type!="client") { return false;  }
 adr=clientobj.address;
 sbu=clientobj.show_bug;
 if(clientobj.sock_handle!=0) { aa.socketDestroy(clientobj.sock_handle); }
 clientobj.sock_handle=0;
 clientobj.sock_status=null;
 clientobj.sock_obj=null;
 clientobj.pkt_in_ray=[];
 clientobj.vars={};
 clientobj.ustage=0;
 clientobj.uextra=[0,0];
 clientobj.stage=1000;
 clientobj.sock_xfwd="";
 clientobj.close_msg_shown=false;
 clientobj.error_msg_shown=false;
 clientobj.tot_pkts_sent=0;
 clientobj.tot_pkts_read=0;
 clientobj.show_bug=sbu;
 clientobj.address=adr;
 clientobj.sock_handle=aa.socketCreate(adr);
 if(clientobj.sock_handle==0) {   aa.debugAlert("gg");  }
 aa.socketYield(clientobj.sock_handle);
 clientobj.sock_obj=aa.socketGet(clientobj.sock_handle);
 clientobj.sock_status=aa.socketStatus(clientobj.sock_handle);
 return true;
 }




 function clientRead (clientobj)
 {
 var ret,pkt;
 if((ret=clientStatus(clientobj))!=true) { return null; }
 if(clientobj.pkt_in_ray.length==0)      { return null; }
 pkt=clientobj.pkt_in_ray.shift();
 return pkt;
 }





 function clientWrite (clientobj,sfy,pkt)
 {
 var ret;
 if((ret=clientStatus(clientobj))!=true) { return false; }
 if(1||clientobj.sock_xfwd=="220.240.77.127")
  {
  if(sfy) { aa.socketWrite(clientobj.sock_handle,JSON.stringify(pkt));   }
  else    { aa.socketWrite(clientobj.sock_handle,pkt); }
  }
 clientobj.tot_pkts_sent++;
 return true;
 }




 function clientStatus (clientobj)
 {
 var pkt,go;
 if(clientobj==null)          { return false;  }
 if(clientobj.type!="client") { return false;  }
 if(clientobj.sock_handle==0) { return false;  }
 aa.socketYield(clientobj.sock_handle);
 clientobj.sock_obj=aa.socketGet(clientobj.sock_handle);
 clientobj.sock_status=aa.socketStatus(clientobj.sock_handle);
 if(clientobj.sock_status.is_closed==true&&clientobj.close_msg_shown==false)
  {
  if(clientobj.show_bug) { console.log("client closed"); }
  clientobj.close_msg_shown=true;
  }
 if(clientobj.sock_status.is_error==true&&clientobj.error_msg_shown==false)
  {
  if(clientobj.show_bug) { console.log("client error"); }
  clientobj.error_msg_shown=true;
  }
 if(clientobj.sock_status.is_error==true||clientobj.sock_status.is_closed==true)
  {
  return aa.ret.FAILED;
  }
 switch(clientobj.stage)
  {
  case 1000:
  if(clientobj.sock_status.is_open!=true) { break; }
  clientobj.stage=1200;
  break;

  case 1200:
  for(go=0;go<8;go++)
   {
   aa.socketYield(clientobj.sock_handle);
   if((pkt=aa.socketRead(clientobj.sock_handle))==null) { continue; } //break; }
   if(0) { console.log("socket read"); }
   if(clientobj.sock_xfwd=="")
    {
    if(pkt.substring(0,9)=="{\"xfwd\":\"")
     {
     clientobj.sock_xfwd=pkt.substring(9);
     clientobj.sock_xfwd=aa.stringLastCharTrim(clientobj.sock_xfwd);
     clientobj.sock_xfwd=aa.stringLastCharTrim(clientobj.sock_xfwd);
     continue;
     }
    }
   clientobj.tot_pkts_read++;
   clientobj.pkt_in_ray.push(pkt);
   //break;
   }
  return true;
  }
 return false;
 }



//---------------------------------------------------------



 function clientRtcsigNew (address,room)
 {
 var obj;
 obj={};
 obj.type="clientrtcsig";
 obj.stage=100;
 obj.is_ready=false;
 obj.cli=null;
 obj.adr=address;
 obj.room=room;
 obj.my_uid=0;
 obj.test_count=8;
 obj.i_queue=[];
 obj.peer_ray=[];
 return obj;
 }




 function clientRtcsigPeerGet (obj,pidx)
 {
 var peer;
 if(obj.type!="clientrtcsig")          { return false; }
 if(pidx<0||pidx>=obj.peer_ray.length) { return null;  }
 peer=obj.peer_ray[pidx];
 return peer;
 }




 function clientRtcsigRead (obj)
 {
 var msg;
 if(obj.type!="clientrtcsig") { return false; }
 if(obj.i_queue.length==0)    { return null;  }
 msg=obj.i_queue.shift();
 return msg;
 }





 function clientRtcsigWrite (obj,to,func,data)
 {
 var msg,pkt;
 if(obj.type!="clientrtcsig") { return false; }
 if(obj.is_ready!=true)       { return false; }
 msg={"func":func,"data":data};
 pkt={"cmd":"say","room":obj.room,"to":to,"msg":msg};
 clientWrite(obj.cli,true,pkt);
 return true;
 }




 function clientRtcsigBash (obj,to,slng,tlng,txt)//func,data)
 {
 var msg,pkt;
 if(obj.type!="clientrtcsig") { return false; }
 if(obj.is_ready!=true)       { return false; }
 pkt={"cmd":"bash","room":obj.room,"to":to,"slang":slng,"tlang":tlng,"text":txt};
 clientWrite(obj.cli,true,pkt);
 return true;
 }




 function clientRtcsigYield (obj)
 {
 var pkt,jsn,pi,pl,etc,t,tl,msg;
 if(obj.type!="clientrtcsig") { return false; }
 switch(obj.stage)
  {
  case 100:
  obj.cli=clientNew(obj.adr);
  obj.stage=110;
  break;


  case 110:
  obj.my_uid=0;
  obj.is_ready=false;
  obj.stage=120;
  break;


  case 120:
  clientStatus(obj.cli);
  if(obj.cli.sock_xfwd=="") { break; }
  pkt={"cmd":"join","room":obj.room,"fingerprint":app.ei.finger_print,"testcount":obj.test_count};
  clientWrite(obj.cli,true,pkt);
  obj.stage=140;
  break;



  case 133:
  break;



  case 140:
  clientStatus(obj.cli);
  if((pkt=clientRead(obj.cli))!=null)
   {
   jsn=aa.dataJsonParse(pkt);
   switch(jsn.cmd)
    {
    case "hi":
    if(jsn.room!=obj.room)                 { alert("room wrong , "+jsn.room); break; }
    if(jsn.peerCount!=jsn.peerList.length) { alert("wrong peercount "+jsn.peerCount+"  "+jsn.peerList.length); break; }
    obj.my_uid=jsn.uuid;
    obj.is_ready=true;
    for(pi=0;pi<jsn.peerList.length;pi++)  { obj.peer_ray.push(jsn.peerList[pi]);   }
    etc={};
    etc.cmd="hi";
    etc.room=jsn.room;
    etc.uuid=jsn.uuid;
    obj.i_queue.push(etc);
    obj.stage=160;
    break;


    case "full":
    etc={};
    etc.cmd="full";
    etc.room=jsn.room;
    obj.i_queue.push(etc);
    obj.stage=133;
    break;


    default:
    alert("jsn.cmd="+jsn.cmd);
    break;
    }
   }
  break;



  case 160:
  clientStatus(obj.cli);
  if((pkt=clientRead(obj.cli))!=null)
   {
   jsn=aa.dataJsonParse(pkt);
   switch(jsn.cmd)
    {
    case "joined":
    if(jsn.room!=obj.room)   { alert("jroom wrong , "+jsn.room); break; }
    if(jsn.uuid==obj.my_uid) { alert("i joined while joined"); break; }
    pl=obj.peer_ray.length;
    for(pi=0;pi<pl;pi++)     { if(obj.peer_ray[pi]==jsn.uuid) { break; }  }
    if(pi!=pl)               { alert(jsn.uuid+" jouined but already in peer list"); break; }
    obj.peer_ray.push(jsn.uuid);
    etc={};
    etc.cmd="joined";
    etc.room=jsn.room;
    etc.uuid=jsn.uuid;
    obj.i_queue.push(etc);
    break;


    case "left":
    if(jsn.room!=obj.room)   { alert("lroom wrong , "+jsn.room); break; }
    if(jsn.uuid==obj.my_uid) { alert("i left while joined"); break; }
    pl=obj.peer_ray.length;
    for(pi=0;pi<pl;pi++)     { if(obj.peer_ray[pi]==jsn.uuid) { break; } }
    if(pi==pl)               { alert(jsn.uuid+" left but not in peer list"); break; }
    aa.dataArrayRemove(obj.peer_ray,pi);
    etc={};
    etc.cmd="left";
    etc.room=jsn.room;
    etc.uuid=jsn.uuid;
    obj.i_queue.push(etc);
    break;


    case "said":
    if(jsn.room!=obj.room)      { alert("lroom wrong , "+jsn.room); break; }
    if(jsn.target!=obj.my_uid)  { console.log("not targeted to me, but for "+jsn.target); break; }
    if(jsn.to==0||(jsn.to==obj.my_uid))  {  obj.i_queue.push(jsn); break;     }
    aa.debugAlert("sent direct not to me",JSON.stringify(jsn,0,2));
    break;


    case "smash":
    if(jsn.room!=obj.room)   { alert("lroom wrong , "+jsn.room); break; }
    if(jsn.uuid!=obj.my_uid) { alert("not me"); break; }
    tl=jsn.data.payload.translations.length;
    for(t=0;t<tl;t++)
     {
     console.log(t,tl);
     console.log(jsn.data.payload.translations[t].translation);
     if(app.vlog)
      {
      msg={};
      msg.txt=jsn.data.payload.translations[t].translation;
      clientRtcsigWrite(app.beam.rtcsig_cli,0,"chat",JSON.stringify(msg));
      console.log("smash vlog");
      ///aa.virtualLogSet(app.vlog,0,app.vlog.num_lines-1,jsn.data.payload.translations[t].translation);
      }
     }
    break;


    default:
    console.log(JSON.stringify(jsn,0,2));
    aa.debugAlert("hh");
    break;
    }
   }
  break;
  }
 return true;
 }









 function guixStart ()
 {
 var s,i;

 app.guix={};
 app.guix.pixels_per_xpc=0;
 app.guix.pixels_per_ypc=0;
 app.guix.group_ray=[];
 app.guix.font_ray=[];
 app.guix.probe=[];
 app.guix.fonts_ready=false;
 app.guix.is_ready=false;
 if(1)  {  app.guix.pointer={};   aa.pointerStart();   }
 if(1)  {  app.guix.keyboard={};  aa.keyboardStart();  }
 s=Math.floor(Date.now()/10000);
 app.guix.font_ray.push(aa.guiFontLoad("saira","woff","https://xdosh.com/fonts/saira.woff"));
 app.guix.font_ray.push(aa.guiFontLoad("srccodepro","woff","https://xdosh.com/fonts/srccodepro.woff"));
 app.guix.sprite=aa.spriteLoad("https://xdosh.com/gfx/spritestwo.png?"+s);

 i=aa.numRandValue(0,6);
 //i=0;
 switch(i)
  {
  case 0: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/anthony2.jpg?"+s); break;
  case 1: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/cillan.jpg?"+s); break;
  case 2: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/trump.jpg?"+s); break;
  case 3: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/tom.jpg?"+s); break;
  case 4: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/billgates.jpg?"+s); break;
  case 5: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/jackson.jpg?"+s); break;
  case 6: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/chan.jpg?"+s); break;
  case 7: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/putin.jpg?"+s); break;
  case 8: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/biden.jpg?"+s); break;
  //case 8: app.guix.image=aa.imageLoaderNew("https://xdosh.com/gfx/am.jpg?"+s); break;
  }
 aa.ifaceStart(guixIfaceProc);
 }








 function guixIsReady ()
 {
 var c,f,tom;
 if(app.guix.is_ready==true) { return true; }
 if(app.guix.fonts_ready!=true)
  {
  for(c=0,f=0;f<app.guix.font_ray.length;f++) { if(aa.guiFontStatus(app.guix.font_ray[f])==true) { c++; }  }
  if(c==app.guix.font_ray.length)             { app.guix.fonts_ready=true;   }
  }
 if(app.guix.sprite.is_ready!=true)
  {
  for(f=0;f<12;f++) { aa.spriteStatus(app.guix.sprite); if(app.guix.sprite.is_ready) {  break; } }
  }
 if(app.guix.image.is_success!=true||app.guix.sprite.is_ready!=true||app.guix.fonts_ready!=true)
  {
  return false;
  }

 if(1) { console.log("guixIsReady took "+aa.timerMsRunning()); }
 app.guix.is_ready=true;

 guixCreate("canvas",null,"maincanvas",9000);
 guixCreate("canvas",null,"b_canvas_0",9050);
 guixCreate("canstream",null,"b_canstream_0",9050);
 guixCreate("canvas",null,"overlay",9060);
 guixCreate("canvas",null,"tomcruise",9160);
 for(c=0;c<cfg_max_peers;c++) { guixCreate("video",null,"b_video_"+c,9050);  }
 return true;
 }







 function guixCreate (type,cat,id,zi)
 {
 var han,grp,idx;
 if((han=aa.guiCreate(type,id,zi))==0)  { aa.debugAlert("jjr"); }
 if((grp=aa.guiGroupGetById(id))==null) { aa.debugAlert("wedw"); }
 idx=app.guix.group_ray.length;
 grp.vars.needs_paint=true;
 grp.vars.cat=cat;
 app.guix.group_ray.push(grp);
 return grp;
 }








 function guixHandleElements (obj)
 {
 var grp,chg,dwid,dhit,i,xx,yy,txt,fnt,fix,iw,ih,pix,x,y,r,g,b,a,off,px;
 var factor,value,avg,sum,suma,sumb,sumc;
 var rgba,hsva,peercnt;
 var totchg,zt,rat,ww,hh;
 var change=[];

 totchg=0;

 dwid=obj.this_dsz[5];
 dhit=obj.this_dsz[8];

 iw=app.guix.image.img.width;
 ih=app.guix.image.img.height;

 app.guix.probe[0]=aa.guiProbe(aa.guiGroupGetById("maincanvas").han);
 app.guix.probe[1]=aa.guiProbe(aa.guiGroupGetById("b_canvas_0").han);
 app.guix.probe[2]=aa.guiProbe(aa.guiGroupGetById("b_canstream_0").han);
 app.guix.probe[3]=aa.guiProbe(aa.guiGroupGetById("overlay").han);
 app.guix.probe[4]=aa.guiProbe(aa.guiGroupGetById("tomcruise").han);
 for(i=0;i<cfg_max_peers;i++) {  app.guix.probe[5+i]=aa.guiProbe(aa.guiGroupGetById("b_video_"+i).han);  }


 //console.log(peercnt);

 if(obj.this_dsz[10]==true)
  {
  rat=(dwid/cfg_max_peers)>>0;
  ww=rat;
  hh=rat;
  if(hh>dhit) { hh=dhit; ww=hh; }
  }
 else
  {
  rat=(dhit/cfg_max_peers)>>0;
  ww=rat;
  hh=rat;
  if(ww>dwid) { ww=dwid; hh=ww; }
  }
 //console.log(ww,hh,dwid,dhit,ww*cfg_max_peers);

 change[0]=guixRequire(app.guix.probe[0],"inline-block",1.0,0,0,dwid,dhit,1.0,1.0);
 change[1]=guixRequire(app.guix.probe[1],"none",1.0,0,0,240,240,1.0,1.0);
 change[2]=guixRequire(app.guix.probe[2],"inline-block",1.0,0,0,ww,hh,1.0,1.0);
 change[3]=guixRequire(app.guix.probe[3],"inline-block",0.6,10,10,dwid-20,dhit-20,1.0,1.0);
 change[4]=guixRequire(app.guix.probe[4],"none",1.0,0,0,iw,ih,1.0,1.0);

 if(change[0]>0)
 {
 if(obj.this_dsz[10]==true)
  {
  xx=0;
  yy=0;
  for(i=0;i<cfg_max_peers;i++)
  //for(i=0;i<peercnt;i++)
   {
   px=5+i;
   if(i==0)   {    change[px]=guixRequire(app.guix.probe[px],"none",1.0,xx,yy,ww,hh,1.0,1.0);    }
   else       {    change[px]=guixRequire(app.guix.probe[px],"inline-block",1.0,xx,yy,ww,hh,1.0,1.0);    }
   xx+=ww;
   }
  }
 else
  {
  xx=0;
  yy=0;
  for(i=0;i<cfg_max_peers;i++)
  //for(i=0;i<peercnt;i++)
   {
   px=5+i;
   if(i==0)   {    change[px]=guixRequire(app.guix.probe[px],"none",1.0,xx,yy,ww,hh,1.0,1.0);    }
   else       {    change[px]=guixRequire(app.guix.probe[px],"inline-block",1.0,xx,yy,ww,hh,1.0,1.0);    }
   yy+=hh;
   }
  }
 }


 if(change[4]>0)
  {
  console.log("tom",change[4]);
  aa.guiCanvasImageDraw(aa.guiGroupGetById("tomcruise").han,0,0,iw,ih,0,0,iw,ih,app.guix.image.img);
  }

 totchg=0;
 for(zt=0;zt<change.length;zt++)  {  totchg+=change[zt];  }
 if(totchg>0)
  {
  console.log("TOT_CHG",totchg,"change[]",change);
  }
 //if(totchg>0) {  if(1) { console.log("TOT_CHG",totchg); }  }

 if((grp=aa.guiGroupGetById(app.guix.probe[3].id))==null) { aa.debugAlert("wedw"); }

 if(change[3]>0)
  {
  //console.log("change 3");
  app.vlog.needs_paint=true;
  }
 }








 function guixRequire (probe,disp,opa,x,y,w,h,scw,sch)
 {
 var chg,grp;
 chg=0;
 while(1)
  {
  chg=0;
  if(probe.css_display!=disp)  { chg+=1;  }
  if(probe.opacity!=opa)       { chg+=2;  }
  if(probe.css_area.left!=x)   { chg+=4;  }
  if(probe.css_area.top!=y)    { chg+=8;  }
  if(probe.css_area.width!=w)  { chg+=16; }
  if(probe.css_area.height!=h) { chg+=32; }
  if(probe.scale_wh[0]!=scw)   { chg+=64; }
  if(probe.scale_wh[1]!=sch)   { chg+=128;}
  break;
  }
 if(chg!=0)
  {
  if((grp=aa.guiGroupGetById(probe.id))==null) { aa.debugAlert("wed"); }
  grp.css.display=disp;
  aa.guiRetinaSet(grp.han,scw,sch,x,y,w,h);
  grp.vars.needs_paint=true;
  grp.css.opacity=opa;
  }
 return chg;
 }










 function guixIfaceProc (obj)
 {
 var dwid,dhit,cord;

 if(guixIsReady()!=true) { return; }
 //console.log(obj.blit_counter);
 dwid=obj.this_dsz[5];
 dhit=obj.this_dsz[8];
 cord=aa.guiGridToCord(1,1,dwid,dhit,100,100);
 app.guix.pixels_per_xpc=cord.x;
 app.guix.pixels_per_ypc=cord.y;

 guixHandleElements(obj);

 if(app.guix.pointer)  { guixPtrYield(obj);      }
 if(app.guix.keyboard) { guixKeyboardYield(obj); }

 if(app.media!==undefined&&app.media.handle>0)
  {
  if(aa.mediaGet(app.media.handle).res=="ok")
   {
   //if((obj.blit_counter%2)==0)
    {
    mediaCanvasPaint(obj);//.this_dsz);
    }
   }
  }
 }









 function guixSplash ()
 {
 var probe,spx,spc,rc,grp,fnt,fix,mes,txt,xx,yy;
 probe=aa.guiProbe(aa.guiGroupGetById("maincanvas").han);
 //console.log(probe.css_area);
 if((grp=aa.guiGroupGetById(probe.id))==null) { aa.debugAlert("rfff"); }
 aa.guiCanvasFill(grp.han,0,0,probe.css_area.width,probe.css_area.height,aa.guiRgbaString(255,255,255,1));
 spx=2;
 spc=aa.spriteRectGet(app.guix.sprite,spx);
 //console.log(spc);
 rc=aa.guiRectSet(0,0,probe.css_area.width,probe.css_area.height);
 aa.spritePaintByIndex(app.guix.sprite,"maincanvas",spx,rc.x+(rc.w/2)-50,rc.y+(rc.h/2)-50,100,100,0,0,0);
 fnt="400 18px arial";
 txt="touch to continue, version "+cfg_app_version;
 fix=aa.guiFontFix(fnt);
 mes=aa.guiCanvasFontMeasure(grp.han,fnt,txt);
 xx=(probe.css_area.width/2)-(mes.w/2);
 yy=((rc.y+(rc.h/2))+60)+fix;
 //console.log(mes);
 aa.guiCanvasText(grp.han,xx,yy,0,null,aa.guiRgbaString(225,225,226,1),fnt,""+txt);
 aa.guiCanvasText(grp.han,xx-2,yy-2,0,null,aa.guiRgbaString(65,65,90,1),fnt,""+txt);

 //aa.guiSpotAdd(grp.han,1000,rc.x,rc.y,rc.w,rc.h,"logo",1,0);
 }






 function guixPtrYield (obj)
 {
 var rat;
 while(1) { if((rat=aa.pointerRead())==null) { break; }  }
 }



 function guixKeyboardYield (obj)
 {
 var kbd;
 while(1) { if((kbd=aa.keyboardRead())==null) { break; }  }
 }











 function beamNew (url,room)
 {
 var beamobj,p;
 beamobj={};
 beamobj.type="beamobj";
 beamobj.room=room;//function clientRtcsigNew (address,room)
 beamobj.url=url;
 beamobj.stage=100;
 beamobj.max_peers=cfg_max_peers;
 beamobj.rtcsig_cli=null;
 beamobj.peer_count=0;
 beamobj.peer_count_connected=0;
 beamobj.peer_pf=0;
 beamobj.peer_array=[];
 beamobj.my_id=0;
 for(p=0;p<beamobj.max_peers;p++)
  {
  beamPeerInit(beamobj,p);
  }
 return beamobj;
 }





 function beamCountSet (beamobj,peercount,peerconnectedcount)
 {
 beamobj.peer_count=peercount;
 beamobj.peer_count_connected=peerconnectedcount;
 }



 function beamPeerInit (beamobj,peerindex)
 {
 var peerobj;
 peerobj={};
 peerobj.in_use=false;
 peerobj.type="peerobj";
 peerobj.self_index=peerindex;
 peerobj.phaze=0;
 peerobj.sent_final_ice=false
 peerobj.rvcd_final_ice=false;
 peerobj.rtc_handle=0;
 peerobj.r_queue_handle=0;
 peerobj.r_queue_status=null;
 peerobj.ms=0;
 peerobj.cycle=0;
 peerobj.id=0;
 peerobj.id_dif=null;
 beamobj.peer_array[peerindex]=peerobj;
 return peerobj;
 }



 function beamPeerNext (beamobj)
 {
 var p,peerobj;
 if(beamobj.peer_count==0) { return null; }
 for(p=0;p<beamobj.max_peers;p++)
  {
  beamobj.peer_pf++;
  beamobj.peer_pf%=beamobj.max_peers;
  peerobj=beamobj.peer_array[beamobj.peer_pf];
  if(1)
   {
   if(peerobj==null)        { continue; }
   if(peerobj.in_use!=true) { continue; }
   }
  return peerobj;
  }
 return null;
 }



 function beamPeerByIndex (beamobj,peerindex)
 {
 var peerobj;
 if(peerindex>=beamobj.max_peers) { return null; }
 peerobj=beamobj.peer_array[peerindex];
 return peerobj;
 }




 function beamPeerById (beamobj,peerid)
 {
 var p,peerobj;
 if(peerid<=0) { aa.debugAlert("ddwds"); }
 for(p=0;p<beamobj.max_peers;p++)
  {
  peerobj=beamobj.peer_array[p];
  if(peerobj.in_use!=true) { continue; }
  if(peerobj.id!=peerid)   { continue; }
  return peerobj;
  }
 return null;
 }



 function beamPeerUnusedGet (beamobj)
 {
 var p,peerobj;
 for(p=1;p<beamobj.max_peers;p++)
  {
  peerobj=beamPeerByIndex(beamobj,p);
  if(peerobj.in_use!=false) { continue; }
  return peerobj;
  }
 return null;
 }



 function beamPeerUse (beamobj,peerindex,id)
 {
 var peerobj;
 if(peerindex<0||peerindex>=beamobj.peer_array.length)  {  throw("cunt");  }
 peerobj=beamobj.peer_array[peerindex];
 if(peerobj.in_use!=false)  {  throw("peerinuse");  }
 peerobj.in_use=true;
 peerobj.type="peerobj";
 peerobj.self_index=peerindex;
 peerobj.phaze=0;
 peerobj.sent_final_ice=false
 peerobj.rvcd_final_ice=false;
 peerobj.rtc_handle=0;
 peerobj.r_queue_handle=aa.queueCreate();
 peerobj.r_queue_status=aa.queueStatus(peerobj.r_queue_handle);
 peerobj.ms=aa.timerMsRunning();
 peerobj.cycle=0;
 peerobj.id=id;
 peerobj.id_dif=(peerobj.id+"").localeCompare(beamobj.my_id+""); //!!!!!!!!!
 beamCountSet(beamobj,beamobj.peer_count+1,beamobj.peer_count_connected);
 if(id!=beamobj.my_id)
  {
  ///console.log("peeruse "+id+" "+alias);
  }
 return peerobj;
 }



 function beamPeerUnuse (beamobj,peerindex)
 {
 var peerobj,rtc,grp,isplaying,grpo,idx;
 if(peerindex<0||peerindex>=beamobj.peer_array.length)  {  throw("cunt");  }
 peerobj=beamobj.peer_array[peerindex];
 if(peerobj.in_use!=true)  {  throw("peernotinuse");  }
 console.log("PEER UNUSE "+peerobj.id+" idx="+peerobj.self_index);
 if(peerobj.phaze==200||peerobj.phaze==2000)
  {
  beamCountSet(beamobj,beamobj.peer_count,beamobj.peer_count_connected-1);
  }
 if(peerobj.r_queue_handle!=0)
  {
  aa.queueDestroy(peerobj.r_queue_handle);
  peerobj.r_queue_handle=0;
  }
 beamPeerVideoUnattach(beamobj,peerobj);
 beamPeerInit(beamobj,peerindex);
 beamCountSet(beamobj,beamobj.peer_count-1,beamobj.peer_count_connected);
 return peerobj;
 }






 function beamPeerVideoAttach (beamobj,peerobj)
 {
 var rtc,g,grp,grpo,grpc;
 if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
 g=peerobj.self_index;
 if(g==0) { aa.debugAlert("dc"); }
 console.log("ATTCH g="+g);
 if((grp=aa.guiGroupGetById("b_video_"+g))==null) { aa.debugAlert("55"); }
 //grp=app.beam["b_video_"+g];
 if(grp==null)               { aa.debugAlert("666"); }
 if(grp.obj.type!="video")   { alert(grp.obj.type); aa.debugAlert("7877"); }
 if(grp.dom.srcObject!=null) { aa.debugAlert("355"); }
// if(grp.vars.rtc_handle!=0)  { aa.debugAlert(); }
 if(g==0)
  {
  aa.debugLogger(0,"VIDEO ATTACH  to canstream "+g);
  if((grpc=aa.guiGroupGetById("b_canstream_0"))==null) { aa.debugAlert("as"); }
  //grpc=app.beam["b_canstream_"+g];
  grpc.vars.rtc_handle=0;
  }
 if(g!=0)
  {
  grp.vars.rtc_handle=peerobj.rtc_handle;
  }
 grp.vars.peer_index=peerobj.self_index;
 rtc.gui_id=grp.obj.id;
 grp.dom.srcObject=rtc.rem_stream;
 grp.dom.muted=true;  grp.dom.volume=0;
 if(cfg_audio_peer_initially_muted==true) {  grp.dom.muted=true;  grp.dom.volume=0;  }
 else                                     {  grp.dom.muted=false;  grp.dom.volume=1;  }
 ////grp.vars.is_showing=true;
 grp.vars.rtc_handle=peerobj.rtc_handle;
 //aa.debugLogger(0,"video attach peer index = "+peerobj.self_index+"  "+peerobj.rtc_handle+"  "+grp.obj.id);
 if(beamobj.prom!=null)
  {
  }
 beamobj.prom=grp.dom.play();
 ///console.log("post prom="+beamobj.prom);
 if(beamobj.prom!==undefined);
  {
  beamobj.prom.then(()=>
   {
   beamobj.prom=null;
   })
  .catch(error=>
   {
   beamobj.prom=null;
   });
  }
 }







 function beamPeerVideoUnattach (beamobj,peerobj)
 {
 var rtc,isplaying,grp,grpo,idx,g,pid,grpc;
 pid=peerobj.id;
 //aa.debugLogger(0,"peerVideoUnattach "+peerobj.id);
 if(peerobj.rtc_handle>0)
  {
  if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) aa.debugAlert("ax34");

  if(rtc.gui_id!=null)
   {
   if((grp=aa.guiGroupGetById(rtc.gui_id))==null) { aa.debugAlert("535"); }
   //grp=app.beam[rtc.gui_id];
   if(grp!=null)
    {
    //aa.debugLogger(0,"CCC "+grp.obj.id+"  "+grp.vars.rtc_handle);
    isplaying=grp.dom.currentTime>0&&!grp.dom.paused&&!grp.dom.ended&&grp.dom.readyState>2;
    grp.vars.rtc_handle=0;
    if(isplaying) {       grp.dom.pause();    }
    grp.dom.currentTime=0;
    grp.dom.srcObject=null;
    idx=rtc.peer_index;
    g=peerobj.self_index;
    console.log("video unat si="+g);
    grp=aa.guiGroupGet(aa.guiIdFind("b_video_"+g));
    grp.vars.rtc_handle=0;
    //grpc=aa.guiGroupGet(aa.guiIdFind("cst_"+g));
    //if(grpc!=null)     {     grpc.vars.rtc_handle=0;     }
    }
   rtc.gui_id=null;
   }
  aa.rtcDestroy(peerobj.rtc_handle);
  peerobj.rtc_handle=0;
  }
 }





 function beamWaitOfferCreate (beamobj,peerobj)
 {
 var status,val,rtc;
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true)
  {
  while(1)
   {
   val=false;
   if(status.promise_status.state==PROMISE_completed)  { val=status.promise_status.val;      }    else
   if(status.promise_status.state==PROMISE_rejected)   { val=null; }
   if(status.promise_status.state==PROMISE_completed||status.promise_status.state==PROMISE_rejected)
    {
    if(aa.rtcPromiseClear(peerobj.rtc_handle)!=true) { aa.debugAlert("z"); }
    }
   if(val===null)   { aa.debugLogger(0,"rejected phaze="+peerobj.phaze); break; }
   if(val===false)  { break; }
   break;
   }
  }
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true) { return false; }
 if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
 if(rtc.offer==null) { return false; }
 return true;
 }





 function beamWaitDescLocalSet (beamobj,peerobj)
 {
 var status,val,rtc;
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true)
  {
  while(1)
   {
   val=false;
   if(status.promise_status.state==PROMISE_completed)  { val=status.promise_status.val;      }    else
   if(status.promise_status.state==PROMISE_rejected)   { val=null; }
   if(status.promise_status.state==PROMISE_completed||status.promise_status.state==PROMISE_rejected)
    {
    if(aa.rtcPromiseClear(peerobj.rtc_handle)!=true) { aa.debugAlert(":wedwe"); }
    }
   if(val===null)   { aa.debugLogger(0,"rejected phaze="+peerobj.phaze); break; }
   if(val===false)  { break; }
   break;
   }
  }
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true) { return false; }
 if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
 if(rtc.loc_desc==null) { return false; }
 return true;
 }





 function beamWaitDescRemoteSet (beamobj,peerobj)
 {
 var status,val,rtc;
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true)
  {
  while(1)
   {
   val=false;
   if(status.promise_status.state==PROMISE_completed)  { val=status.promise_status.val;      }    else
   if(status.promise_status.state==PROMISE_rejected)   { val=null; }
   if(status.promise_status.state==PROMISE_completed||status.promise_status.state==PROMISE_rejected)
    {
    if(aa.rtcPromiseClear(peerobj.rtc_handle)!=true) { aa.debugAlert("4456"); }
    }
   if(val===null)   { aa.debugLogger(0,"rejected phaze="+peerobj.phaze); break; }
   if(val===false)  { break; }
   break;
   }
  }
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true) { return false; }
 if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
 if(rtc.rem_desc==null) { return false; }
 return true;
 }




 function beamWaitAnswerCreate (beamobj,peerobj)
 {
 var status,val,rtc;
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true)
  {
  while(1)
   {
   val=false;
   if(status.promise_status.state==PROMISE_completed)  { val=status.promise_status.val;      }    else
   if(status.promise_status.state==PROMISE_rejected)   { val=null; }
   if(status.promise_status.state==PROMISE_completed||status.promise_status.state==PROMISE_rejected)
    {
    if(aa.rtcPromiseClear(peerobj.rtc_handle)!=true) { aa.debugAlert("32"); }
    }
   if(val===null)   { aa.debugLogger(0,"rejected phaze="+peerobj.phaze); break; }
   if(val===false)  { break; }
   break;
   }
  }
 status=aa.rtcStatus(peerobj.rtc_handle);
 if(status.in_promise==true) { return false; }
 if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
 if(rtc.answer==null) { return false; }
 return true;
 }





 function beamReadJoined(beamobj,pkt)
 {
 var peerobj,p;
 console.log(pkt);
 //jsn=JSON.parse(pkt);
 if((peerobj=beamPeerById(beamobj,pkt.uuid))!=null) { console.log(peerobj.self_index); aa.debugAlert("ss"); }
 if(pkt.uuid==beamobj.my_id) { aa.debugAlert("x"); }
 if((peerobj=beamPeerUnusedGet(beamobj))==null)     { aa.debugAlert("6454"); }
 p=peerobj.self_index;
 peerobj=beamPeerUse(beamobj,p,pkt.uuid);//,jsn.hancock);
 aa.debugLogger(0,peerobj.id+" has joined");
 return true;
 }





 function beamReadLeft (beamobj,pkt)
 {
 var peerobj,p;
 console.log(pkt);
 //jsn=JSON.parse(pkt);
 ///console.log(jsn);
 if((peerobj=beamPeerById(beamobj,pkt.uuid))==null) { aa.debugAlert("rewrewr"); }
 aa.debugLogger(0,peerobj.id+" has left");
 beamPeerUnuse(beamobj,peerobj.self_index);
 return true;
 }





 function beamRead (beamobj,id)
 {
 var status,peerobj,msg;
 peerobj=beamPeerById(beamobj,id);
 if(peerobj==null) { aa.debugAlert("erferf"); }
 peerobj.r_queue_status=aa.queueStatus(peerobj.r_queue_handle);
 if(peerobj.r_queue_status==null) aa.debugAlert("beamread2 "+id);
 if(peerobj.r_queue_status.msgs_queued==0) {  return null;  }
 if((msg=aa.queueRead(peerobj.r_queue_handle))==null) aa.debugAlert("beamread3");
 peerobj.r_queue_status=aa.queueStatus(peerobj.r_queue_handle);
 return msg;
 }







 function beamPeek (beamobj,id)
 {
 var status,peerobj,msg;
 peerobj=beamPeerById(beamobj,id);
 if(peerobj==null) { aa.debugAlert("Ferfe"); }
 peerobj.r_queue_status=aa.queueStatus(peerobj.r_queue_handle);
 if(peerobj.r_queue_status==null) aa.debugAlert("beampeek2 "+id);
 if(peerobj.r_queue_status.msgs_queued==0) {  return null;  }
 if((msg=aa.queuePeek(peerobj.r_queue_handle,0))==null) aa.debugAlert("wsds3dwe00");
 peerobj.r_queue_status=aa.queueStatus(peerobj.r_queue_handle);
 return msg;
 }








 function beamDiscard (beamobj,id)
 {
 var status,peerobj,msg;
 peerobj=beamPeerById(beamobj,id);
 if(peerobj==null) { aa.debugAlert("fdfv"); }
 peerobj.r_queue_status=aa.queueStatus(peerobj.r_queue_handle);
 if(peerobj.r_queue_status==null) aa.debugAlert("wxwew00");
 if(peerobj.r_queue_status.msgs_queued==0) { return true;  }
 if((msg=aa.queueRead(peerobj.r_queue_handle))==null) aa.debugAlert("xwxwxwx00");
 peerobj.r_queue_status=aa.queueStatus(peerobj.r_queue_handle);
 return true;
 }





 function beamYield (beamobj)
 {
 var pkt,msg,p,uid,peerobj,po,peer,etc,k,ii,j;

 switch(beamobj.stage)
  {
  case 100:
  beamobj.rtcsig_cli=clientRtcsigNew(beamobj.url,beamobj.room);
  beamobj.stage=120;
  break;

  //for(pi=0;pi<jsn.peerList.length;pi++)  { obj.peer_ray.push(jsn.peerList[pi]);   }
  case 120:
  if(beamobj.rtcsig_cli.is_ready!=true) { break; }
  console.log("beam ready, "+beamobj.rtcsig_cli.my_uid);
  beamobj.stage=140;
  break;

  case 140:
  pkt=clientRtcsigRead(beamobj.rtcsig_cli);
  if(pkt==null||pkt==false) { break; }
  if(pkt.cmd!="hi") { alert(pkt.cmd); break; }
  //console.log(pkt);
  console.log("myuid="+beamobj.rtcsig_cli.my_uid+" peers="+beamobj.rtcsig_cli.peer_ray.length);
  beamobj.my_id=beamobj.rtcsig_cli.my_uid;
  k=0;
  for(p=0;p<beamobj.rtcsig_cli.peer_ray.length;p++)
   {
   uid=beamobj.rtcsig_cli.peer_ray[p];
   if(uid==beamobj.rtcsig_cli.my_uid)
    {
    peerobj=beamPeerUse(beamobj,k,uid);
    //console.log("im peer idx "+k);
    }
   }
  k++;
  for(p=0;p<beamobj.rtcsig_cli.peer_ray.length;p++)
   {
   uid=beamobj.rtcsig_cli.peer_ray[p];
   if(uid==beamobj.rtcsig_cli.my_uid) { continue; }
   if((peerobj=beamPeerById(beamobj,uid))!=null)  { alert("ss"); continue; }
   if((peerobj=beamPeerUnusedGet(beamobj))==null) { aa.debugAlert("cdfvdf"); }
   peerobj=beamPeerUse(beamobj,k,uid);
   //console.log("peer "+uid+" at "+k);
   k++;
   }
  beamobj.stage=160;
  break;


  case 160:
  if((po=beamPeerNext(beamobj))!=null) {  beamPeerYield(beamobj,po.self_index);   }
  pkt=clientRtcsigRead(beamobj.rtcsig_cli);
  if(pkt==null||pkt==false) { break; }

  switch(pkt.cmd)
   {
   default:
   aa.debugAlert("unknown cmd="+pkt.cmd);
   break;


   case "said":
   peer=beamPeerById(beamobj,pkt.uuid);
   if(peer==null) { break; }
   if(pkt.msg_func=="chat")
    {
    etc=JSON.parse(pkt.msg_data);
    if(etc.txt.length>0)
     {
     switch(etc.txt)
      {
      default:
      console.log("!Said ["+etc.txt+"]");
      if(app.vlog)
       {
       //console.log("vlog set ",etc.txt);
       if(aa.virtualLogSet(app.vlog,0,app.vlog.num_lines-1,etc.txt)==false) { aa.debugAlert(); }
       //for(j=0;j<app.vlog.num_lines;j++) { console.log(j,app.vlog.line[j]); }
       }
      break;

      case "do reload":
      console.log("reloading");
      aa.envReload(true,1000);
      break;


      case "cycle camera":
      console.log("cycle camera cur_vxi="+app.media.cur_vxi+" of max ",mediaDeviceCountGet("videoinput"));
      ii=app.media.cur_vxi;
      ii++;
      ii%=mediaDeviceCountGet("videoinput");
      mediaCamSwap(ii);
      break;


      case "cycle microphone":
      console.log("cycle microphone cur_axi="+app.media.cur_axi+" of max ",mediaDeviceCountGet("audioinput"));
      ii=app.media.cur_axi;
      ii++;
      ii%=mediaDeviceCountGet("audioinput");
      mediaMicSwap(ii);
      break;
      }
     }
    break;
    }
   aa.queueWrite(peer.r_queue_handle,pkt);
   peer.r_queue_status=aa.queueStatus(peer.r_queue_handle);
   break;

   case "joined":
   beamReadJoined(beamobj,pkt);
   break;

   case "left":
   beamReadLeft(beamobj,pkt);
   break;
   }
  break;
  }
 if(beamobj.rtcsig_cli!=null)
  {
  clientRtcsigYield(beamobj.rtcsig_cli);
  }
 }





 function beamPeerYield (beamobj,peerindex)
 {
 var peerobj,pkt,rtc,grp,msg,ice,xxx,val,status,med,etc,at,vt;
 if(peerindex>=beamobj.max_peers) { return; }

 peerobj=beamobj.peer_array[peerindex];
 if(peerobj==null)        { return; }
 if(peerobj.in_use!=true) { return; }
 if(peerobj.is_leaving)     { aa.debugAlert("Fefef");  return;  }

 switch(peerobj.phaze)
  {
  case 0:
  peerobj.phaze=100;
  break;

  case 66:
  case 666:
  break;





                case 100: // creation of individual WebRtc connections
                ///console.log("dif=",peerobj.id_dif);
                if(peerobj.id_dif==0)
                 {
                 beamCountSet(beamobj,beamobj.peer_count,beamobj.peer_count_connected+1);
                 peerobj.phaze=200;
                 break;
                 }
                peerobj.rtc_handle=aa.rtcCreate({'iceServers':[{'urls':'stun:stun.l.google.com:19302'}]});
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                rtc.vars.peer_index=peerobj.self_index;
                if((grp=aa.guiGroupGetById("b_canstream_0"))==null) { aa.debugAlert("FEfefr"); }
                med=aa.mediaGet(app.media.handle);
                if(grp.vars.audio_processor.destination!=undefined)
                 {
                 rtc.pc.addTrack(grp.vars.audio_processor.destination.stream.getAudioTracks()[0] , grp.vars.audio_processor.stream);
                 }
                rtc.pc.addTrack(grp.vars.audio_processor.stream.getVideoTracks()[0] , grp.vars.audio_processor.stream);

                if(peerobj.id_dif>0)  {    peerobj.phaze=400; break;    }
                if(peerobj.id_dif<0)  {    peerobj.phaze=600; break;    }
                break;








        case 200: // Peer connection to self
        pkt=beamPeek(beamobj,peerobj.id);
        if(pkt==null||pkt==false) { break; }
        console.log("got 200",pkt);
        beamDiscard(beamobj,peerobj.id);
        break;









                case 400:
                console.log("400 creating offer");
                aa.rtcOfferCreate(peerobj.rtc_handle);
                peerobj.phaze=430;
                break;



                case 430:
                if(beamWaitOfferCreate(beamobj,peerobj)==false) { break;  }
                peerobj.phaze=435;
                break;


                case 435:
                status=aa.rtcStatus(peerobj.rtc_handle);
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
             ///if(cfg_sdp_manip==true) {    rtc.offer.sdp=aa.mediaSdpManipulate(rtc.offer.sdp,cfg_sdp_sbool,cfg_sdp_max_arate,cfg_sdp_max_vrate);                 }
                //if(1&&manip_sdp==true)  {  rtc.vars.offer.sdp=mediaSdpManipulate(rtc.vars.offer.sdp,sbool,arata,vrata);  }
                ////console.log(rtc.offer);
                aa.rtcDescLocalSet(peerobj.rtc_handle,rtc.offer);
                console.log("435 setting local desc");
                peerobj.phaze=440;
                break;


                case 440:
                if(beamWaitDescLocalSet(beamobj,peerobj)==false) { break;  }
                peerobj.phaze=450;
                break;




                case 450:
                status=aa.rtcStatus(peerobj.rtc_handle);
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }

                //console.log("sebd to "+peerobj.id);
                etc={};
                etc.is_true=true;
                etc.offer=rtc.offer;
                clientRtcsigWrite(beamobj.rtcsig_cli,peerobj.id,"offer",JSON.stringify(etc));
                console.log("sent!!!!!!!!!! from "+beamobj.my_id+" to "+peerobj.id);
                 //(obj,to,func,data)
                //beamWrite(beamobj,"say","aakak",peerobj.id,"offer",true,rtc.offer);
                peerobj.phaze=460;
                break;



                case 460:
                pkt=beamPeek(beamobj,peerobj.id);
                if(pkt==null||pkt==false) { break; }
                msg=JSON.parse(pkt.msg_data);
                if(pkt.msg_func!="answer")
                 {
                 console.log("3036");
                 console.log(pkt);//alert("fef "+pkt.msg_func);
                 beamDiscard(beamobj,peerobj.id);
                 break;
                 }
                //console.log("got answer");
                beamDiscard(beamobj,peerobj.id);
     //           console.log(msg);
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                rtc.answer=msg.answer;//JSON.parse(msg.txt).txt;
                peerobj.phaze=470;
                break;



                case 470:
                status=aa.rtcStatus(peerobj.rtc_handle);
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                //aa.debugLogger(0,"about to set desc remote");
                aa.rtcDescRemoteSet(peerobj.rtc_handle,rtc.answer);
                peerobj.phaze=480;
                break;




                case 480:
                if(beamWaitDescRemoteSet(beamobj,peerobj)==false) { break;  }
                peerobj.phaze=900;
                break;






           case 600: // We are accepting from this peer
           //console.log("600");
           if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
           //console.log(peerobj.id);
           pkt=beamPeek(beamobj,peerobj.id)
           if(pkt==null||pkt==false) { break; }
           //console.log("600",pkt);
           msg=JSON.parse(pkt.msg_data);
           if(pkt.msg_func!="offer")
            {
            alert("fefz "+pkt.msg_func);
            beamDiscard(beamobj,peerobj.id);
            break;
            }
           beamDiscard(beamobj,peerobj.id);
           console.log("600 got offer, setting rem desc");
           //console.log(msg);
           aa.rtcDescRemoteSet(peerobj.rtc_handle,msg.offer);
           peerobj.phaze=610;
           break;




           case 610:
           if(beamWaitDescRemoteSet(beamobj,peerobj)==false) { break;  }
           console.log("610 rem desc set, creatiung answer");
           peerobj.phaze=620;
           break;





           case 620:
           aa.rtcAnswerCreate(peerobj.rtc_handle);
           peerobj.phaze=630;
           break;


           case 630:
           if(beamWaitAnswerCreate(beamobj,peerobj)===false) { break; }
           console.log("630 answer created");
           peerobj.phaze=645;
           break;



           case 645:
           if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
           aa.rtcDescLocalSet(peerobj.rtc_handle,rtc.answer);
           peerobj.phaze=647;
           break;




           case 647:
           if(beamWaitDescLocalSet(beamobj,peerobj)==false) { break;  }
           console.log("647 local desc set");
           peerobj.phaze=720;
           break;



           case 720:
           if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                etc={};
                etc.is_true=true;
                etc.answer=rtc.answer;
                clientRtcsigWrite(beamobj.rtcsig_cli,peerobj.id,"answer",JSON.stringify(etc));
           console.log("720 sent answer to peer");
           peerobj.phaze=900;
           break;






           case 900:
           if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
           status=aa.rtcStatus(peerobj.rtc_handle);
           if(status.in_promise==true) {   aa.debugAlert("fef"); }
           console.log("enterying icey "+rtc.pc.canTrickleIceCandidates);
           peerobj.phaze=1000;
           break;







                case 1000:  // icey
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }

                if(rtc.pc.connectionState=="connected")
                 {
                 status=aa.rtcStatus(peerobj.rtc_handle);
                 if(status.in_promise==true) {      peerobj.phaze=1010;   break; }
                 peerobj.phaze=1200;
                 break;
                 }

                while(1)
                 {
                 pkt=beamPeek(beamobj,peerobj.id)
                 if(pkt==null||pkt==false) { break; }
                 msg=JSON.parse(pkt.msg_data);
                 if(pkt.msg_func=="ice")
                  {
                  if(msg.ice==".")  { console.log("rcve final ice");  peerobj.rvcd_final_ice=true;            }
                  else              {   xxx=msg.ice;  aa.rtcIceCandidateAdd(peerobj.rtc_handle,xxx);     console.log("candi add");  }
                  }
                 else {  console.log("3191");  console.log(pkt);                 }
                 beamDiscard(beamobj,peerobj.id);
                 break;
                 }
                status=aa.rtcStatus(peerobj.rtc_handle);
                if(status.in_promise==true) {      peerobj.phaze=1010;   break; }


                if(peerobj.sent_final_ice==false)
                 {
                 if((ice=aa.rtcIceCandidateGet(peerobj.rtc_handle))!=null)
                  {
                  if(ice==".")  {  console.log("sent final ice"); peerobj.sent_final_ice=true;  }
                  etc={};
                  etc.is_true=true;
                  etc.ice=ice;
                  clientRtcsigWrite(beamobj.rtcsig_cli,peerobj.id,"ice",JSON.stringify(etc));
                  status=aa.rtcStatus(peerobj.rtc_handle);
                  if(status.in_promise==true) {      peerobj.phaze=1010;   break; }
                  break;
                  }
                 }

                if(peerobj.phaze!=1000) { break; }

                if(peerobj.sent_final_ice!=true) { break; }
                if(peerobj.rvcd_final_ice!=true) { break; }
                //console.log("established a");
                peerobj.phaze=1200;
                break;






                 case 1010:
                 status=aa.rtcStatus(peerobj.rtc_handle);
                 if(status.in_promise==true)
                  {
                  while(1)
                   {
                   val=false;
                   if(status.promise_status.state==PROMISE_completed)  { val=status.promise_status.val;      }    else
                   if(status.promise_status.state==PROMISE_rejected)   { val=null; }
                   if(status.promise_status.state==PROMISE_completed)
                    {
                    ///console.log("prom fin "+status.promise_info);
                    }
                   if(status.promise_status.state==PROMISE_completed||status.promise_status.state==PROMISE_rejected)
                    {
                    if(aa.rtcPromiseClear(peerobj.rtc_handle)!=true) { aa.debugAlert("erfefef"); }
                    }
                   if(val===null)   { aa.debugLogger(0,"rejected phaze="+peerobj.phaze); break; }
                   if(val===false)  { break; }
                   break;
                   }
                  break;
                  }
                status=aa.rtcStatus(peerobj.rtc_handle);
                if(status.in_promise==true) { break; }
                console.log("1010 prom done");
                peerobj.phaze=1000;
                break;







                case 1200: // wait for remote stream
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                status=aa.rtcStatus(peerobj.rtc_handle);
                if(rtc.gui_id==null&&rtc.rem_stream!=null)  {    peerobj.phaze=1300;        break;                 }
                if(rtc.gui_id!=null) { aa.debugLogger(0,"guiid !=null = "+rtc.gui_id);  break;     }
                break;






                            case 1300: // attach to unused video element
                            beamPeerVideoAttach(beamobj,peerobj);
                            grp=aa.guiGroupGet(aa.guiIdFind("b_video_"+peerobj.self_index));
                            if(app.media.active_devenu.aud_output_list.length>app.media.cur_axo)
                             {
                             grp.dom.setSinkId(mediaDeviceGet("audiooutput",0).deviceId);
                             }
                            beamCountSet(beamobj,beamobj.peer_count,beamobj.peer_count_connected+1);
                            peerobj.phaze=1350;
                            break;


                     case 1350:
                     if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                     if(rtc.prom!==undefined&&rtc.prom!=null) {  break; }
                     if(aa.rtcBitrateChange(peerobj.rtc_handle,0,cfg_sdp_use_vrate)!=true) { alert("sks"); break }
                     peerobj.phaze=1360;
                     break;

                     case 1360:
                     if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                     if(rtc.prom!==undefined&&rtc.prom!=null) {  break; }
                     if(aa.rtcBitrateChange(peerobj.rtc_handle,cfg_sdp_use_arate,0)!=true) { alert("sks"); break }
                     peerobj.phaze=1370;
                     break;

                     case 1370:
                     if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                     if(rtc.prom!==undefined&&rtc.prom!=null) {  break; }
                     console.log("established !!!!");
                     peerobj.phaze=2000;
                     break;





                     case 2000:  // established
                     status=aa.rtcStatus(peerobj.rtc_handle);
                     if(status.in_promise==true) { aa.debugAlert("Dwewww"); }
                     if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                     while(1)
                      {
                      pkt=beamPeek(beamobj,peerobj.id)
                      if(pkt==null||pkt==false) { break; }
                      //msg=JSON.parse(pkt);
                      if(pkt.cmd=="said"&&pkt.msg_func=="ice") // added
                       {
                       console.log("ice");
                       beamDiscard(beamobj,peerobj.id);
                       }
                      else
                       {
                       console.log(pkt);
                       }
                      //beamDiscard(beamobj,peerobj.id);
                      status=aa.rtcStatus(peerobj.rtc_handle);
                      }
                     peerobj.cycle++;
                     break;

  }
 }













 function mediaStart ()
 {
 app.media={};
 app.media.is_started=true;
 app.media.is_swapping=false;

 app.media.is_detecting=false;
 app.media.is_detect_failure=false;
 app.media.is_detect_success=false;
 app.media.detect_handle=0;
 app.media.detect_stage=0;
 app.media.detect_err=0;
 app.media.devenu=null;
 app.media.active_devenu=null;

 app.media.handle=0;
 app.media.handle2=0;

 app.media.cur_axi=0;  // current mic
 app.media.cur_vxi=0;  // current cam
 if(app.ei.finger_print=="a203cbfb242a184d4e25f1bebfee78ec4165c1d569193332a92ff4d147726401")
  {
  app.media.cur_vxi=2;
//  app.media.cur_axi=0;
  }
 app.media.cur_axo=0;  // current speakers

 app.media.cur_vfxi=0; // current vid fx
 app.media.cur_afxi=0; // current aud fx
 app.media.cur_grxi=0; // current green screen fx
 app.media.cur_arxi=0; // current AR fx

 app.media.cam_swap_stage=0;
 app.media.cam_swap_vxi=0;

 app.media.mic_swap_stage=0;
 app.media.mic_swap_axi=0;

 app.media.grp_of_b_video_0=null;
 app.media.grp_of_b_canstream_0=null;
 mediaLocalGainMuteSet(cfg_audio_default_gain,cfg_audio_local_initially_muted);
 }






 function mediaDetectStart ()
 {
 if(app.media.is_detecting==true) { return false; }
 if(app.media.devenu!=null) { aa.debugAlert("devenu not null"); return false; }
 app.media.detect_stage=100;
 app.media.is_detecting=true;
 app.media.is_detect_failure=false;
 app.media.is_detect_success=false;
 app.media.detect_err="";
 console.log("mediadetect start");
 return true;
 }




 function mediaDetectYield ()
 {
 var res,err;
 switch(app.media.detect_stage)
  {
  case 66:
  break;

  case 100:
  app.media.detect_handle=aa.mediaCreate({},{});
  app.media.detect_stage=120;
  break;

  case 120:
  aa.mediaStatus(app.media.detect_handle);
  res=aa.mediaGet(app.media.detect_handle);
  if(res.res=="ok")
   {
   if(aa.mediaDestroy(app.media.detect_handle)!=true) {  aa.debugAlert("rdf");    }
   app.media.detect_handle=0;
   app.media.detect_res=res.res;
   app.media.detect_stage=200;
   break;
   }
  if(res.res=="err")
   {
   err=aa.mediaErrorEtc(res.e_name,res.e_msg);
   if(aa.mediaDestroy(app.media.detect_handle)!=true) { aa.debugAlert("wefwef");   }
   app.media.detect_handle=0;
   app.media.is_detect_success=false;
   app.media.is_detect_failure=true;
   app.media.detect_err=err;
   app.media.detect_stage=66;
   app.media.is_detecting=false;
   break;
   }
  break;


  case 200:
  app.media.devenu=aa.mediaDeviceEnumerator();
  app.media.detect_stage=220;
  break;


  case 220:
  if(app.media.devenu.is_failed==true)
   {
   aa.debugAlert("fwefw");
   app.media.detect_stage=66;
   app.media.is_detecting=false;
   break;
   }
  if(app.media.devenu.is_ready!=true)  { break; }
  app.media.is_detect_success=true;
  app.media.is_detect_failure=false;
  app.media.detect_err=0;
  app.media.detect_stage=300;
  app.media.is_detecting=false;
  console.log("media detection, completed !!");
  break;

  case 300:
  break;
  }
 }







 function mediaYield ()
 {
 if(app.media===undefined) { return; }
 mediaDetectYield();
 mediaSwapYield();
 }







 function mediaLocalGainMuteSet (gainval,muteval)
 {
 app.media.cur_local_gain=gainval;
 app.media.cur_local_mute=muteval;
 }







 function mediaSize (useshort,rezwid,isrot)
 {
 var ww,hh,obj;
 switch(rezwid)
  {
  default:  aa.debugAlert("rezwid="+rezwid);  break;
  case 80:   ww=rezwid;  if(useshort) { hh=50;   }  else  { hh=60; }  break;
  case 160:  ww=rezwid;  if(useshort) { hh=90;   }  else  { hh=120; }  break;
  case 320:  ww=rezwid;  if(useshort) { hh=180;  }  else  { hh=240; }  break;
  case 640:  ww=rezwid;  if(useshort) { hh=360;  }  else  { hh=480; }  break;
  case 1280: ww=rezwid;  if(useshort) { hh=630; }  else  { hh=720;}  break;
  case 1080: ww=rezwid;  if(useshort) { hh=1200; }  else  { hh=1920;}  break;
  case 1920: ww=rezwid;  if(useshort) { hh=960;  }  else  { hh=1080;}  break;
  }
 if(isrot)  {  swp=ww;  ww=hh;  hh=swp;  }
 obj={};
 obj.w=hh;
 obj.h=hh;
 //obj.w=240;
 //obj.h=240;
// console.log(obj);
 return obj;
 }





 function mediaDeviceListInit (obj)
 {
 var o,i,l;
 app.media.active_devenu=null;
 app.media.active_devenu=JSON.parse(JSON.stringify(obj));
 l=app.media.active_devenu.aud_input_list.length;
 for(i=0;i<l;i++)  {  app.media.active_devenu.aud_input_list[i].res=null;  }
 l=app.media.active_devenu.vid_input_list.length;
 for(i=0;i<l;i++)  {  app.media.active_devenu.vid_input_list[i].res=null;  }
 l=app.media.active_devenu.aud_output_list.length;
 for(i=0;i<l;i++)  {  app.media.active_devenu.aud_output_list[i].res=null;  }
 console.log("####### mediaDeviceList Init");
 return true;
 }





 function mediaDeviceListErr (obj,kind,index,errobj)
 {
 var oe;
 //console.log("####### mediaDeviceList Err kind="+kind+"  index="+index+"");
 if(errobj!==undefined)
  {
  }
 switch(kind)
  {
  case "audioinput":   app.media.active_devenu.aud_input_list[index].res=errobj; break;
  case "videoinput":   app.media.active_devenu.vid_input_list[index].res=errobj; break;
  case "audiooutput":  app.media.active_devenu.aud_output_list[index].res=errobj; break;
  }
 ///
 if(errobj.res!="ok")
  {
  //console.log("errobj.res "+errobj.res);
  //console.log(errobj);
  console.log("res="+errobj.res+" name="+errobj.name);
  console.log("msg="+errobj.msg+" code="+errobj.code);
  console.log("etc="+errobj.etc+" "+errobj.etc0+","+errobj.etc1);
  }
 }





 function mediaDeviceDump (doactive)
 {
 var str,len,i,eo,d,den,o;
 console.log(" \nmediaDeviceDump==========");
 if(doactive) { den=app.media.active_devenu; }
 else         { den=app.media.devenu;        }
 for(i=0;i<den.aud_input_list.length;i++)
  {
  o=den.aud_input_list[i];
  str="i="+i+"  "+o.kind+"  "+o.clean+"  ";
  if(o.res!=null)  {  str+="res.res="+o.res.res+" res.name="+o.res.name+" res.msg="+o.res.msg+" ";   }
  console.log(str);
  }
 for(i=0;i<den.vid_input_list.length;i++)
  {
  o=den.vid_input_list[i];
  str="i="+i+"  "+o.kind+"  "+o.clean+"  ";
  if(o.res!=null)  {  str+="res.res="+o.res.res+" res.name="+o.res.name+" res.msg="+o.res.msg+" ";   }
  console.log(str);
  }
 for(i=0;i<den.aud_output_list.length;i++)
  {
  o=den.aud_output_list[i];
  str="i="+i+"  "+o.kind+"  "+o.clean+"  ";
  if(o.res!=null) {  str+="res.res="+o.res.res+" res.name="+o.res.name+" res.msg="+o.res.msg+" ";   }
  console.log(str);
  }
 console.log(" ");
 }







 function mediaDeviceCountGet (kind)
 {
 switch(kind)
  {
  case "audioinput":  return app.media.active_devenu.aud_input_list.length;
  case "audiooutput": return app.media.active_devenu.aud_output_list.length;
  case "videoinput":  return app.media.active_devenu.vid_input_list.length;
  }
 return 0;
 }





 function mediaDeviceGet (kind,index)
 {
 switch(kind)
  {
  case "audioinput":
  if(index>=app.media.active_devenu.aud_input_list.length) { break; }
  return app.media.active_devenu.aud_input_list[index];
  case "audiooutput":
  if(index>=app.media.active_devenu.aud_output_list.length) { break; }
  return app.media.active_devenu.aud_output_list[index];
  case "videoinput":
  if(index>=app.media.active_devenu.vid_input_list.length) { break; }
  return app.media.active_devenu.vid_input_list[index];
  }
 return null;
 }





 function mediaPairCreate (axi,vxi)
 {
 var ax,vx,ox,han,wid,hit,dsz,adid,vdid,csz;
 if(axi) { ax=axi; } else { ax=0; }
 if(vxi) { vx=vxi; } else { vx=0; }
 ax%=mediaDeviceCountGet("audioinput");
 vx%=mediaDeviceCountGet("videoinput");
 app.media.cur_axi=ax;
 app.media.cur_vxi=vx;
 dsz=aa.ifaceDisplaySizesGet();
 csz=mediaSize(cfg_cam_res_short,cfg_cam_res_wid,cfg_cam_res_rot);
 wid=csz.w;
 hit=csz.h;

 adid=mediaDeviceGet("audioinput",ax);
 if(adid!=null)  {  adid=adid.deviceId;  }
 vdid=mediaDeviceGet("videoinput",vx);
 if(vdid!=null)  {  vdid=vdid.deviceId;  }
 ///alert(">> media pair create "+axi+"  "+vxi);
 if(adid==null&&vdid==null)
  {

  }
 else
 if(adid==null&&vdid!=null)
  {
  han=aa.mediaCreate(
   {deviceId:{exact:vdid},width:{ideal:wid,max:wid},height:{ideal:hit,max:hit},frameRate:{ideal:cfg_v_fps,max:cfg_v_fps}  },
   null);
  }
 else
 if(adid!=null&&vdid==null)
  {
  }
 else
 if(adid!=null&&vdid!=null)
  {
  han=aa.mediaCreate(
   {deviceId:{exact:vdid},width:{ideal:wid,max:wid},height:{ideal:hit,max:hit},frameRate:{ideal:cfg_v_fps,max:cfg_v_fps}  },
   {deviceId:{exact:adid},channelCount:1,sampleRate:{min:16000,ideal:48000,max:48000}, latency:0,
    echoCancellation:cfg_a_aec,noiseSuppression:cfg_a_nsu,autoGainControl:cfg_a_agc,
    googEchoCancellation:cfg_a_aec,googNoiseSuppression:cfg_a_nsu,googAutoGainControl:cfg_a_agc//,
    ,aspectRatio: 16/9
   });
  }
 return han;
 }




 function mediaCombineStreams (astream,vstream)
 {
 var stream,tr=[];
 if(astream!=undefined) { tr=tr.concat(astream); }
 if(vstream!=undefined) { tr=tr.concat(vstream); }
 stream=new MediaStream(tr);
 return stream;
 }




 function mediaAudioFreqToIndex (object,freq)
 {
 var index,res;
 index=Math.round((freq/object.freq_range)*object.band_count);
 res=aa.numClamp(index,0,object.band_count);
 return res;
 }



 function mediaAudioIndexToFreq (object,index)
 {
 var res=(index*object.rate)/(object.band_count*2);
 return res;
 }



 function mediaMicSwap (axi)
 {
 var pxi;
 //console.log("mediaMicSwap "+axi);
 if(app.media.is_swapping!=false) { console.log("swapping in use"); return false; }
 if(axi==null)                    { return false; }
 pxi=app.media.cur_axi;
 console.log("mediaMicSwap to "+axi+" cur_axi="+pxi);
 app.media.is_swapping=true;
 app.media.mic_swap_stage=1;
 app.media.mic_swap_axi=axi;
 //console.log("mic swapping  ok");
 return true;
 }




 function mediaCamSwap (vxi)
 {
 var pxi;
 if(app.media.is_swapping!=false) { return false; }
 if(vxi==null) { return false; }
 //console.log("mediaCamSwap "+vxi);
 pxi=app.media.cur_vxi;
 console.log("mediaCamSwap to "+vxi+" cur_vxi="+pxi);
 app.media.is_swapping=true;
 app.media.cam_swap_stage=1;
 app.media.cam_swap_vxi=vxi;
 return true;
 }






 function mediaSwapYield ()
 {
 if(app.media.is_swapping!=true) { return; }
/// console.log(arguments.callee.name);
 mediaSwapMicYield();
 mediaSwapCamYield();
 }




 function mediaSwapMicYield ()
 {
 var obj,ret,mob,grp,stream,rtc,status,grpc,vstream,astream,cstream,grpv;
 var err,oe;
 switch(app.media.mic_swap_stage)
  {
  case 0:
  return;


  case 1:
  console.log("mediaSwapMicYield stage 1, device count= "+mediaDeviceCountGet("audioinput"));
  console.log("cur axi="+app.media.cur_axi+"  swap axi="+app.media.mic_swap_axi);
  app.media.cur_axi=app.media.mic_swap_axi;
  app.media.cur_axi%=mediaDeviceCountGet("audioinput");
  app.media_handle2=mediaPairCreate(app.media.cur_axi,app.media.cur_vxi); ///!!!!!!!!!!!!!!!!!!
  app.media.mic_swap_stage=2;
  ///guixNeedsPaintSet("sidemenu");
  return;




  case 6:
  console.log("mic 666");
  break;




  case 2:
  status=aa.mediaStatus(app.media_handle2);
  obj=aa.mediaGet(app.media_handle2);
  if(obj==null) { return; }
  if(obj.res==null) { return; }
  if(obj.res=="ok")
   {
   if(app.media.grp_of_b_canstream_0==null)
    {
    app.media.grp_of_b_canstream_0=aa.guiGroupGetById("b_canstream_0");
    console.log(app.media.grp_of_b_canstream_0);
    }
   grpc=app.media.grp_of_b_canstream_0;
   if(grpc==null) { aa.debugAlert("Ferffer"); }
   aa.mediaAttach(app.media.handle,null);
   //== destroy media handle
   console.log("DESTROYING MEDIA HANDLE");
   aa.mediaDestroy(app.media.handle);
   if(app.media.grp_of_b_video_0==null)
    {
    app.media.grp_of_b_video_0=aa.guiGroupGetById("b_video_0");
    }
   ret=aa.mediaAttach(app.media_handle2,app.media.grp_of_b_video_0.han);
   app.media.handle=app.media_handle2;
   app.media_handle2=0;
   if((obj=aa.mediaGet(app.media.handle))===null) { aa.debugAlert("erferfer"); }
   if(app.media.grp_of_b_video_0==null)
    {
    app.media.grp_of_b_video_0=aa.guiGroupGetById("b_video_0");
    }
   grpv=app.media.grp_of_b_video_0;
   if(grpv==null) { aa.debugAlert("ferff"); }
   ///if((grpv=aa.guiGroupGet(aa.guiIdFind("b_video_0")))==null) { aa.debugAlert(); }
   grpv.vars.prev_time=0;
   grpv.vars.frame_number=0;
   grpv.vars.fps=0;
   mediaDeviceSwapperSwap();
   app.media.mic_swap_stage=0;
   ///mediaStoreLastDevice();
   app.media.is_swapping=false;
   console.log("** mic swap success axi="+app.media.cur_axi);
   console.log("--------mic");
   err=aa.mediaErrObjCreate(obj.res,obj.e_name,obj.e_msg,obj.e_code);
   mediaDeviceListErr(app.media.active_devenu,"audioinput",app.media.mic_swap_axi,err);//app.media.cur_axi,err);
   //guixNeedsPaintSet(null);
   }
  else
  if(obj.res=="err")
   {
   console.log("--------mic ");
   err=aa.mediaErrObjCreate(obj.res,obj.e_name,obj.e_msg,obj.e_code);
   mediaDeviceListErr(app.media.active_devenu,"audioinput",app.media.mic_swap_axi,err);//app.media.cur_axi,err);
   app.media.mic_swap_stage=1;
   app.media.mic_swap_axi++;
   app.media.mic_swap_axi%=mediaDeviceCountGet("audioinput");;
   //guixNeedsPaintSet(null);
   break;
   }
  return;
  }
 }




 function mediaSwapCamYield ()
 {
 var obj,ret,mob,grp,stream,rtc,status,grpc,vstream,astream,cstream,grpv;
 var err;
 switch(app.media.cam_swap_stage)
  {
  case 0:
  return;

  case 1:
  console.log("mediaSwapCamYield stage 1 "+mediaDeviceCountGet("videoinput"));
  console.log("cur vxi="+app.media.cur_vxi+"  swap vxi="+app.media.cam_swap_vxi);
  app.media.cur_vxi=app.media.cam_swap_vxi;
  app.media.cur_vxi%=mediaDeviceCountGet("videoinput");
  //console.log("new vxi="+app.media.cur_vxi);
  app.media_handle2=mediaPairCreate(app.media.cur_axi,app.media.cur_vxi);  ///!!!!!!!!!!!!!!!!!!
  app.media.cam_swap_stage=2;
  ///guixNeedsPaintSet("sidemenu");
  return;

  case 6:
  console.log("cam 666");
  break;


  case 2:
  status=aa.mediaStatus(app.media_handle2);
  obj=aa.mediaGet(app.media_handle2);
  if(obj==null) { return; }
  if(obj.res==null) { return; }
  if(obj.res=="ok")
   {
   if(app.media.grp_of_b_canstream_0==null)
    {
    app.media.grp_of_b_canstream_0=aa.guiGroupGetById("b_canstream_0");
    }
   grpc=app.media.grp_of_b_canstream_0;
   if(!grpc) { aa.debugAlert("fefefer"); }
   aa.mediaAttach(app.media.handle,null);
   //== destroy media handle
   console.log("DESTROYING MEDIA HANDLE");
   aa.mediaDestroy(app.media.handle);
   if(app.media.grp_of_b_video_0==null)
    {
    app.media.grp_of_b_video_0=aa.guiGroupGetById("b_video_0");
    }
   if((ret=aa.mediaAttach(app.media_handle2,app.media.grp_of_b_video_0.han))!=true) { aa.debugAlert("media attach  ="+ret); }
   //if((ret=aa.mediaAttach(app.media_handle2,aa.guiGroupGet(aa.guiIdFind("b_video_0")).han))!=true) { aa.debugAlert("media attach  ="+ret); }
   app.media.handle=app.media_handle2;
   app.media_handle2=0;
   if((obj=aa.mediaGet(app.media.handle))===null) { aa.debugAlert("weeeee"); }
   grpv=app.media.grp_of_b_video_0;
   if(!grpv) { aa.debugAlert("xxxxxxx"); }
   //if((grpv=aa.guiGroupGet(aa.guiIdFind("b_video_0")))==null) { aa.debugAlert(); }
   grpv.vars.prev_time=0;
   grpv.vars.frame_number=0;
   grpv.vars.fps=0;
   mediaDeviceSwapperSwap();
   app.media.cam_swap_stage=0;
   ///mediaStoreLastDevice();
   app.media.is_swapping=false;
   console.log("** cam swap success vxi="+app.media.cur_vxi);
   err=aa.mediaErrObjCreate(obj.res,obj.e_name,obj.e_msg,obj.e_code);
   mediaDeviceListErr(app.media.active_devenu,"videoinput",app.media.cam_swap_vxi,err);//app.media.cur_axi,err);
   //guixNeedsPaintSet(null);
   }
  else
  if(obj.res=="err")
   {
   console.log("--------cam err");
   err=aa.mediaErrObjCreate(obj.res,obj.e_name,obj.e_msg,obj.e_code);
   mediaDeviceListErr(app.media.active_devenu,"videoinput",app.media.cam_swap_vxi,err);//app.media.cur_axi,err);
   app.media.cam_swap_stage=1;
   app.media.cam_swap_vxi++;
   app.media.cam_swap_vxi%=mediaDeviceCountGet("videoinput");;
   //guixNeedsPaintSet(null);
   break;
   }
  return;
  }
 }







 function mediaChangeSinks (axo)
 {
 var g,grp;
 console.log("CHANGE SINKS");
  //app.media.cur_axo=axo; return;
 axo%=mediaDeviceCountGet("audiooutput");
 for(g=0;g<cfg_max_peers;g++)
  {
  if(g==0) { continue; }
  //grp=aa.guiGroupGet(aa.guiIdFind("b_video_"+g));
  grp=aa.guiGroupGetById("b_video_"+g);

  if(grp==null)             { continue; }
  if(grp.obj.type!="video") { continue; }
//    console.log(grp.obj.id+"  "+grp.dom.videoWidth);
  if(grp.dom.videoWidth==0) { continue; }
  grp.dom.setSinkId(mediaDeviceGet("audiooutput",axo).deviceId);
  }
 app.media.cur_axo=axo;
 }









 function mediaDeviceSwapperInit ()
 {
 var cap_stream,vid_tracks,med_object,aud_stream,new_stream,grp,tr;
 if(0) { console.log("line number "+aa.debugLineNumber()); }
 //if((grp=aa.guiGroupGet(aa.guiIdFind("b_canstream_0")))==null) { aa.debugAlert(); }
 grp=aa.guiGroupGetById("b_canstream_0");
 if(grp==null) { aa.debugAlert("weewdw"); }
 //console.log("capturing stream "+cfg_v_fps);
 //if(cfg_auto_capture_stream==true)  { cap_stream=grp.dom.captureStream();          }
 //else                               { cap_stream=grp.dom.captureStream(cfg_v_fps); }
 cap_stream=grp.dom.captureStream();
 ///console.log(cap_stream);
 vid_tracks=cap_stream.getVideoTracks()[0];
 med_object=aa.mediaGet(app.media.handle);
 aud_stream=med_object.a_stream;
 new_stream=mediaCombineStreams(aud_stream,vid_tracks);
 app.new_stream=new_stream;
 grp.vars.audio_processor=mediaAudioProcessorStart(grp.obj.id,new_stream);
 grp.vars.audio_processor.stream=new_stream;
 app.media.aud_pro=grp.vars.audio_processor;
 grp.vars.cst=cap_stream;
 grp.vars.nws=new_stream;
 }



 function mediaDeviceSwapperSwap ()
 {
 var cap_stream,vid_tracks,med_object,aud_stream,new_stream,grp,tr;
 grp=aa.guiGroupGetById("b_canstream_0");
 if(grp==null) { aa.debugAlert("qqqqqqq"); }
 ///if((grp=aa.guiGroupGet(aa.guiIdFind("b_canstream_0")))==null) { aa.debugAlert(); }
 ///console.log("SWAPPER SWAP");
 //if(cfg_auto_capture_stream==true) { cap_stream=grp.dom.captureStream();      }
 //else                              { cap_stream=grp.dom.captureStream(v_fps); }
 cap_stream=grp.dom.captureStream();
 vid_tracks=cap_stream.getVideoTracks()[0];
 med_object=aa.mediaGet(app.media.handle);
 aud_stream=med_object.a_stream;
 new_stream=mediaCombineStreams(aud_stream,vid_tracks);
 app.new_stream=new_stream;
 grp.vars.audio_processor.stream=new_stream;
 grp.vars.audio_processor.microphone.disconnect();
 grp.vars.audio_processor.microphone=grp.vars.audio_processor.context.createMediaStreamSource(new_stream);
 grp.vars.audio_processor.microphone.connect(grp.vars.audio_processor.analyser);
 }





 function mediaAudioProcessorStart (id,newlycreatedstream)
 {
 var obj,settings,sss;
 obj={};
 obj.id=id;
 obj.context=new AudioContext();
 sss=newlycreatedstream.getAudioTracks()[0];
 if(sss!=undefined)
  {
  obj.rate=sss.getSettings().sampleRate;
  obj.microphone=obj.context.createMediaStreamSource(newlycreatedstream);
  obj.destination=obj.context.createMediaStreamDestination();
  obj.scripter=obj.context.createScriptProcessor(cfg_audio_script_processor_size,1,1);

  obj.scripter.onaudioprocess=function(event) { mediaAudioProcessorProc(obj,event);  }
  obj.analyser_cycle=0;
  obj.analyser_level=0;
  obj.analyser=obj.context.createAnalyser();
  obj.analyser.fftSize=cfg_audio_fft_size;
  obj.analyser.smoothingTimeConstant=0.3;
  obj.analyser.maxDecibels=cfg_audio_max_db;
  obj.analyser.minDecibels=cfg_audio_min_db;
  obj.db_range=obj.analyser.maxDecibels-obj.analyser.minDecibels;
  obj.freq_buffer_len=obj.analyser.frequencyBinCount;
  obj.freq_float_buffer=new Float32Array(obj.freq_buffer_len);
  obj.freq_range=obj.rate/2.0;
  obj.band_count=obj.freq_buffer_len;
  obj.band_hertz=obj.freq_range/obj.band_count;
  obj.microphone.connect(obj.analyser);
  obj.analyser.connect(obj.scripter);
  obj.scripter.connect(obj.destination);
  }
 obj.stream=newlycreatedstream;
 return obj;
 }




 function mediaAudioProcessorProc (object,event)
 {
 var grp,ix;
 grp=aa.guiGroupGetById(object.id);
 ix=aa.stringLastCharGet(object.id);
 if(ix!=0) { alert("ix="+ix); }
 mediaAudioAnalyzeInput(object,event);
 mediaAudioScriptWithGain(object,event,app.media.cur_local_gain);
 }





 function mediaAudioAnalyzeInput (object,event)
 {
 var r,s,fqs,fqe,val,lev;
 var dbf,suv,i,ii,mv,va,vb,dsz;
 if((object.analyser_cycle%3)==0)
  {
  object.analyser.getFloatFrequencyData(object.freq_float_buffer);
  mv=-Infinity;
  for(i=0,ii=object.freq_buffer_len;i<ii;i++)
   {
   if(object.freq_float_buffer[i]>mv&&object.freq_float_buffer[i]<0) {  mv=object.freq_float_buffer[i];   }
   };
  suv=0;
  s=0;
  for(r=0;r<object.freq_buffer_len;r++)
   {
   //fqs=Math.round(audioIndexToFreq(object,r+0))-0;
   //fqe=Math.round(audioIndexToFreq(object,r+1))-1;
   fqs=r+0;
   fqe=r+1;
   val=object.freq_float_buffer[r];
   val-=object.analyser.minDecibels;
   suv+=val**2;
   s++;
   }
  fqs=Math.round(mediaAudioIndexToFreq(object,fqs))-0;
  fqe=Math.round(mediaAudioIndexToFreq(object,fqe))-1;
  va=20*Math.log10(suv/s);
  mv=aa.numFixed(mv,1);
  va=aa.numFixed(va,1);
  lev=aa.numFixed((mv-(-160)),0);
  object.analyser_level=lev;
  }
 object.analyser_cycle++;
 }






 function mediaAudioScriptWithGain (object,event,gain)
 {
 var ibuf,obuf,ilen,i,ival,oval,minv,maxv,q;

 ibuf=event.inputBuffer.getChannelData(0);
 obuf=event.outputBuffer.getChannelData(0);
 ilen=ibuf.length;
 minv=-0.999;
 maxv=+0.999;
 for(i=0;i<ilen;i++)
  {
  ival=ibuf[i];
  oval=ival*gain;
  if(oval<minv) { oval=minv;  }
  else
  if(oval>maxv) { oval=maxv;  }
  obuf[i]=oval;
  }
 }






 function mediaVideoAddVadColor (cgrp,cw,ch)
 {
 if(app.media.aud_pro==undefined) { return; }
 if(app.media.aud_pro.analyser_level>=cfg_audio_threshold&&app.media.cur_local_mute==false)
  {
  aa.guiCanvasBorder(cgrp.obj.han,1,1,cw-2,ch-2,2,aa.guiRgbaString(200,200,aa.numRand(255),1));
  aa.guiCanvasBorder(cgrp.obj.han,3,3,cw-6,ch-6,2,aa.guiRgbaString(200,20,aa.numRand(255),1));
  }
 }







 function mediaCanvasPaint (objdsz)
 {
 var vgrp,pgrp,cgrp,ready,isplaying,tgrp,ogrp,xgrp;
 var vw,vh,ew,eh,area,cw,ch,dw,dh,swp,fps,fnum,dsz;
 var cap,frm,delme,peer,ok;
 var vgsz,pgsz,cgsz,zoo;
 var dis,vis,ora,vratio;
 var pix,suma,sumb,sumc,xx,yy,iw,ih;
 var rr,gg,bb,ap,off,rgba,hsva,fnt,i,txt,fix,hit,col;

 if(app.media==undefined) { return; }
 dsz=objdsz.this_dsz;
 //console.log(objdsz);

 vgrp=aa.guiGroupGetById("b_video_0");
 if(vgrp==null||vgrp.dom.videoWidth==0) { return; }

 pgrp=aa.guiGroupGetById("b_canvas_0");
 if(pgrp==null||pgrp.dom.width==0)      { return; }

 xgrp=aa.guiGroupGetById("b_canstream_0");
 if(xgrp==null||xgrp.dom.width==0)      { return; }


 tgrp=aa.guiGroupGetById("tomcruise");
 if(tgrp==null||tgrp.dom.width==0)      { return; }

 ogrp=aa.guiGroupGetById("overlay");
 if(ogrp==null||ogrp.dom.width==0)      { return; }

 if(vgrp.obj.vars.fps==undefined)       { vgrp.obj.vars.fps=0; }

 if(app.vlog.needs_paint)
  {
  app.guix.probe[3]=aa.guiProbe(aa.guiGroupGetById("overlay").han);
  hit=app.guix.probe[3].css_area.height;
  col=(hit/20)>>0;
  fnt="600 "+col+"px arial";
  fix=aa.guiFontFix(fnt);
  fix=0;
  aa.guiCanvasClear(ogrp.han);
  xx=2+objdsz.this_disp.safety_sal;
  yy=2+objdsz.this_disp.safety_sat;
  for(i=0;i<app.vlog.num_lines;i++)
   {
   txt=aa.virtualLogGet(app.vlog,i);
   if(txt==false) { yy+=col+fix; continue; }
   yy+=fix;
   if(txt.length>0)
    {
    aa.guiCanvasText(ogrp.han,xx,yy,0,null,aa.guiRgbaString(5,5,5,1),fnt,""+txt);
    aa.guiCanvasText(ogrp.han,xx-2,yy-2,1,aa.guiRgbaString(5,5,5,1),aa.guiRgbaString(245,245,190,1),fnt,""+txt);
    }
   yy+=col;
   }
  app.vlog.needs_paint=false;
  }



 while(1)
  {
  ready=false;
  if(app.media.is_swapping==true) {   break; }
  if(vgrp.obj.dom.readyState!=4)  {   break; }
  if(vgrp.obj.vars.prev_time!==undefined)  {  if(vgrp.obj.dom.currentTime==vgrp.obj.vars.prev_time) { break; }   }
  ready=true;
  break;
  }

 isplaying=vgrp.dom.currentTime>0&&!vgrp.dom.paused&&!vgrp.dom.ended&&vgrp.dom.readyState>2;

 if(ready==true)
  {
  vgsz=aa.guiSizesGet(vgrp.han);
  pgsz=aa.guiSizesGet(pgrp.han);

  if(vgrp.obj.vars.frame_number==undefined)   {   vgrp.obj.vars.frame_number=0; }
  if(vgrp.obj.vars.frame_number==0)           {   vgrp.obj.vars.start_time=vgrp.obj.dom.currentTime;   }
  fnum=vgrp.obj.vars.frame_number;
  vgrp.obj.vars.frame_number++;
  vgrp.obj.vars.prev_time=vgrp.obj.dom.currentTime;

  fps=0;
  if(vgrp.obj.vars.frame_number>0) { fps=vgrp.obj.vars.frame_number/(vgrp.obj.dom.currentTime-vgrp.obj.vars.start_time); }
  vgrp.obj.vars.fps=fps;

  if(app.tfl&&app.tfl.is_ready==true)
   {
   if(gotkin==0)
    {
//    aa.guiCanvasImageDraw(pgrp.obj.han,null,null,null,null,0,0,pgsz.domwh[0],pgsz.domwh[1],app.guix.image.img);
//    tflowPush(app.tfl,pgsz.domwh[0],pgsz.domwh[1],pgrp.obj.dom);
    }
   else
   if(gotkin==1)
    {
    aa.guiCanvasImageDraw(pgrp.obj.han,null,null,null,null,0,0,pgsz.domwh[0],pgsz.domwh[1],vgrp.obj.dom);
    tflowPush(app.tfl,pgsz.domwh[0],pgsz.domwh[1],pgrp.obj.dom);
    //tflowPush(app.tfl,pgsz.domwh[0],pgsz.domwh[1],vgrp.obj.dom);
    }
   }

  //if(ok==false) {  aa.guiCanvasImageDraw(xgrp.obj.han,null,null,null,null,0,0,pgsz.domwh[0],pgsz.domwh[1],vgrp.obj.dom);   }
  }
 }




 var tFlowTria68=[
 162,234,93,58,172,136,149,148,152,377,378,365,397,288,323,454,389,71,63,105,66,107,336,296,334,293,301,168,197,5,4,75,97,
 2,326,305,33,160,158,133,153,144,362,385,387,263,373,380,61,39,37,0,267,269,291,405,314,17,84,181,78,82,13,312,308,317,14,87];

 var tFlowTria=[
 127,34,139,11,0,37,232,231,120,72,37,39,128,121,47,232,121,128,104,69,67,175,171,148,157,154,155,118,50,101,73,39,40,9,
 151,108,48,115,131,194,204,211,74,40,185,80,42,183,40,92,186,230,229,118,202,212,214,83,18,17,76,61,146,160,29,30,56,
 157,173,106,204,194,135,214,192,203,165,98,21,71,68,51,45,4,144,24,23,77,146,91,205,50,187,201,200,18,91,106,182,90,91,
 181,85,84,17,206,203,36,148,171,140,92,40,39,193,189,244,159,158,28,247,246,161,236,3,196,54,68,104,193,168,8,117,
 228,31,189,193,55,98,97,99,126,47,100,166,79,218,155,154,26,209,49,131,135,136,150,47,126,217,223,52,53,45,51,134,211,
 170,140,67,69,108,43,106,91,230,119,120,226,130,247,63,53,52,238,20,242,46,70,156,78,62,96,46,53,63,143,34,227,173,
 155,133,123,117,111,44,125,19,236,134,51,216,206,205,154,153,22,39,37,167,200,201,208,36,142,100,57,212,202,20,60,99,28,
 158,157,35,226,113,160,159,27,204,202,210,113,225,46,43,202,204,62,76,77,137,123,116,41,38,72,203,129,142,64,98,240,49,
 102,64,41,73,74,212,216,207,42,74,184,169,170,211,170,149,176,105,66,69,122,6,168,123,147,187,96,77,90,65,55,107,89,
 90,180,101,100,120,63,105,104,93,137,227,15,86,85,129,102,49,14,87,86,55,8,9,100,47,121,145,23,22,88,89,179,6,122,
 196,88,95,96,138,172,136,215,58,172,115,48,219,42,80,81,195,3,51,43,146,61,171,175,199,81,82,38,53,46,225,144,163,110,
 246,33,7,52,65,66,229,228,117,34,127,234,107,108,69,109,108,151,48,64,235,62,78,191,129,209,126,111,35,143,163,161,246,
 117,123,50,222,65,52,19,125,141,221,55,65,3,195,197,25,7,33,220,237,44,70,71,139,122,193,245,247,130,33,71,21,162,
 153,158,159,170,169,150,188,174,196,216,186,92,144,160,161,2,97,167,141,125,241,164,167,37,72,38,12,145,159,160,38,82,13,
 63,68,71,226,35,111,158,153,154,101,50,205,206,92,165,209,198,217,165,167,97,220,115,218,133,112,243,239,238,241,214,
 135,169,190,173,133,171,208,32,125,44,237,86,87,178,85,86,179,84,85,180,83,84,181,201,83,182,137,93,132,76,62,183,61,
 76,184,57,61,185,212,57,186,214,207,187,34,143,156,79,239,237,123,137,177,44,1,4,201,194,32,64,102,129,213,215,138,59,
 166,219,242,99,97,2,94,141,75,59,235,24,110,228,25,130,226,23,24,229,22,23,230,26,22,231,112,26,232,189,190,243,221,56,
 190,28,56,221,27,28,222,29,27,223,30,29,224,247,30,225,238,79,20,166,59,75,60,75,240,147,177,215,20,79,166,187,147,213,
 112,233,244,233,128,245,128,114,188,114,217,174,131,115,220,217,198,236,198,131,134,177,132,58,143,35,124,110,163,7,228,
 110,25,356,389,368,11,302,267,452,350,349,302,303,269,357,343,277,452,453,357,333,332,297,175,152,377,384,398,382,347,
 348,330,303,304,270,9,336,337,278,279,360,418,262,431,304,408,409,310,415,407,270,409,410,450,348,347,422,430,434,313,
 314,17,306,307,375,387,388,260,286,414,398,335,406,418,364,367,416,423,358,327,251,284,298,281,5,4,373,374,253,307,320,
 321,425,427,411,421,313,18,321,405,406,320,404,405,315,16,17,426,425,266,377,400,369,322,391,269,417,465,464,386,257,258,
 466,260,388,456,399,419,284,332,333,417,285,8,346,340,261,413,441,285,327,460,328,355,371,329,392,439,438,382,341,256,
 429,420,360,364,394,379,277,343,437,443,444,283,275,440,363,431,262,369,297,338,337,273,375,321,450,451,349,446,342,467,
 293,334,282,458,461,462,276,353,383,308,324,325,276,300,293,372,345,447,382,398,362,352,345,340,274,1,19,456,248,281,436,
 427,425,381,256,252,269,391,393,200,199,428,266,330,329,287,273,422,250,462,328,258,286,384,265,353,342,387,259,257,424,
 431,430,342,353,276,273,335,424,292,325,307,366,447,345,271,303,302,423,266,371,294,455,460,279,278,294,271,272,304,432,
 434,427,272,407,408,394,430,431,395,369,400,334,333,299,351,417,168,352,280,411,325,319,320,295,296,336,319,403,404,330,
 348,349,293,298,333,323,454,447,15,16,315,358,429,279,14,15,316,285,336,9,329,349,350,374,380,252,318,402,403,6,197,419,
 318,319,325,367,364,365,435,367,397,344,438,439,272,271,311,195,5,281,273,287,291,396,428,199,311,271,268,283,444,445,
 373,254,339,263,466,249,282,334,296,449,347,346,264,447,454,336,296,299,338,10,151,278,439,455,292,407,415,358,371,355,
 340,345,372,390,249,466,346,347,280,442,443,282,19,94,370,441,442,295,248,419,197,263,255,359,440,275,274,300,383,368,
 351,412,465,263,467,466,301,368,389,380,374,386,395,378,379,412,351,419,436,426,322,373,390,388,2,164,393,370,462,461,
 164,0,267,302,11,12,374,373,387,268,12,13,293,300,301,446,261,340,385,384,381,330,266,425,426,423,391,429,355,437,391,
 327,326,440,457,438,341,382,362,459,457,461,434,430,394,414,463,362,396,369,262,354,461,457,316,403,402,315,404,403,314,
 405,404,313,406,405,421,418,406,366,401,361,306,408,407,291,409,408,287,410,409,432,436,410,434,416,411,264,368,383,309,
 438,457,352,376,401,274,275,4,421,428,262,294,327,358,433,416,367,289,455,439,462,370,326,2,326,370,305,460,455,254,
 449,448,255,261,446,253,450,449,252,451,450,256,452,451,341,453,452,413,464,463,441,413,414,258,442,441,257,443,442,259,
 444,443,260,445,444,467,342,445,459,458,250,289,392,290,290,328,460,376,433,435,250,290,392,411,416,433,341,463,464,453,
 464,465,357,465,412,343,412,399,360,363,440,437,399,456,420,456,363,401,435,288,372,383,353,339,255,249,448,261,255,133,
 243,190,133,155,112,33,246,247,33,130,25,398,384,286,362,398,414,362,463,341,263,359,467,263,249,255,466,467,260,75,60,
 166,238,239,79,162,127,139,72,11,37,121,232,120,73,72,39,114,128,47,233,232,128,103,104,67,152,175,148,173,157,155,
 119,118,101,74,73,40,107,9,108,49,48,131,32,194,211,184,74,185,191,80,183,185,40,186,119,230,118,210,202,214,84,83,17,
 77,76,146,161,160,30,190,56,173,182,106,194,138,135,192,129,203,98,54,21,68,5,51,4,145,144,23,90,77,91,207,205,187,83,
 201,18,181,91,182,180,90,181,16,85,17,205,206,36,176,148,140,165,92,39,245,193,244,27,159,28,30,247,161,174,236,196,
 103,54,104,55,193,8,111,117,31,221,189,55,240,98,99,142,126,100,219,166,218,112,155,26,198,209,131,169,135,150,114,47,
 217,224,223,53,220,45,134,32,211,140,109,67,108,146,43,91,231,230,120,113,226,247,105,63,52,241,238,242,124,46,156,95,
 78,96,70,46,63,116,143,227,116,123,111,1,44,19,3,236,51,207,216,205,26,154,22,165,39,167,199,200,208,101,36,100,43,
 57,202,242,20,99,56,28,157,124,35,113,29,160,27,211,204,210,124,113,46,106,43,204,96,62,77,227,137,116,73,41,72,36,203,
 142,235,64,240,48,49,64,42,41,74,214,212,207,183,42,184,210,169,211,140,170,176,104,105,69,193,122,168,50,123,187,89,96,
 90,66,65,107,179,89,180,119,101,120,68,63,104,234,93,227,16,15,85,209,129,49,15,14,86,107,55,9,120,100,121,153,145,22,
 178,88,179,197,6,196,89,88,96,135,138,136,138,215,172,218,115,219,41,42,81,5,195,51,57,43,61,208,171,199,41,81,38,
 224,53,225,24,144,110,105,52,66,118,229,117,227,34,234,66,107,69,10,109,151,219,48,235,183,62,191,142,129,126,116,111,
 143,7,163,246,118,117,50,223,222,52,94,19,141,222,221,65,196,3,197,45,220,44,156,70,139,188,122,245,139,71,162,145,
 153,159,149,170,150,122,188,196,206,216,92,163,144,161,164,2,167,242,141,241,0,164,37,11,72,12,144,145,160,12,38,13,70,
 63,71,31,226,111,157,158,154,36,101,205,203,206,165,126,209,217,98,165,97,237,220,218,237,239,241,210,214,169,140,171,32,
 241,125,237,179,86,178,180,85,179,181,84,180,182,83,181,194,201,182,177,137,132,184,76,183,185,61,184,186,57,185,216,212,
 186,192,214,187,139,34,156,218,79,237,147,123,177,45,44,4,208,201,32,98,64,129,192,213,138,235,59,219,141,242,97,97,2,
 141,240,75,235,229,24,228,31,25,226,230,23,229,231,22,230,232,26,231,233,112,232,244,189,243,189,221,190,222,28,221,
 223,27,222,224,29,223,225,30,224,113,247,225,99,60,240,213,147,215,60,20,166,192,187,213,243,112,244,244,233,245,245,
 128,188,188,114,174,134,131,220,174,217,236,236,198,134,215,177,58,156,143,124,25,110,7,31,228,25,264,356,368,0,11,267,
 451,452,349,267,302,269,350,357,277,350,452,357,299,333,297,396,175,377,381,384,382,280,347,330,269,303,270,151,9,337,
 344,278,360,424,418,431,270,304,409,272,310,407,322,270,410,449,450,347,432,422,434,18,313,17,291,306,375,259,387,260,
 424,335,418,434,364,416,391,423,327,301,251,298,275,281,4,254,373,253,375,307,321,280,425,411,200,421,18,335,321,406,
 321,320,405,314,315,17,423,426,266,396,377,369,270,322,269,413,417,464,385,386,258,248,456,419,298,284,333,168,417,8,
 448,346,261,417,413,285,326,327,328,277,355,329,309,392,438,381,382,256,279,429,360,365,364,379,355,277,437,282,443,283,
 281,275,363,395,431,369,299,297,337,335,273,321,348,450,349,359,446,467,283,293,282,250,458,462,300,276,383,292,308,325,
 283,276,293,264,372,447,346,352,340,354,274,19,363,456,281,426,436,425,380,381,252,267,269,393,421,200,428,371,266,329,
 432,287,422,290,250,328,385,258,384,446,265,342,386,387,257,422,424,430,445,342,276,422,273,424,306,292,307,352,366,345,
 268,271,302,358,423,371,327,294,460,331,279,294,303,271,304,436,432,427,304,272,408,395,394,431,378,395,400,296,334,299,
 6,351,168,376,352,411,307,325,320,285,295,336,320,319,404,329,330,349,334,293,333,366,323,447,316,15,315,331,358,279,
 317,14,316,8,285,9,277,329,350,253,374,252,319,318,403,351,6,419,324,318,325,397,367,365,288,435,397,278,344,439,310,
 272,311,248,195,281,375,273,291,175,396,199,312,311,268,276,283,445,390,373,339,295,282,296,448,449,346,356,264,454,337,
 336,299,337,338,151,294,278,455,308,292,415,429,358,355,265,340,372,388,390,466,352,346,280,295,442,282,354,19,370,285,
 441,295,195,248,197,457,440,274,301,300,368,417,351,465,251,301,389,385,380,386,394,395,379,399,412,419,410,436,322,387,
 373,388,326,2,393,354,370,461,393,164,267,268,302,12,386,374,387,312,268,13,298,293,301,265,446,340,380,385,381,280,330,
 425,322,426,391,420,429,437,393,391,326,344,440,438,458,459,461,364,434,394,428,396,262,274,354,457,317,316,402,316,315,
 403,315,314,404,314,313,405,313,421,406,323,366,361,292,306,407,306,291,408,291,287,409,287,432,410,427,434,411,372,264,
 383,459,309,457,366,352,401,1,274,4,418,421,262,331,294,358,435,433,367,392,289,439,328,462,326,94,2,370,289,305,455,339,
 254,448,359,255,446,254,253,449,253,252,450,252,256,451,256,341,452,414,413,463,286,441,414,286,258,441,258,257,442,257,
 259,443,259,260,444,260,467,445,309,459,250,305,289,290,305,290,460,401,376,435,309,250,392,376,411,433,453,341,464,357,
 453,465,343,357,412,437,343,399,344,360,440,420,437,456,360,420,363,361,401,288,265,372,353,390,339,249,339,448,255];


 function tflowLandMarksGet (what)
 {
 switch(what)
  {
  case "oval":              case 0:  return([10 ,338,297,332,284,251,389,356,454,
                                             323,361,288,397,365,379,378,400,377,
                                             152,148,176,149,150,136,172,58 ,132,
                                             93 ,234,127,162,21 ,54 ,103,67 ,109 ]);

  case "lipsUpperOuter":    case 1:  return([61,185,40,39,37,0,267,269,270,409,291]);
  case "lipsLowerOuter":    case 2:  return([61,146,91,181,84,17,314,405,321,375,291]);
  case "lipsUpperInner":    case 3:  return([78,191,80,81,82,13,312,311,310,415,308]);
  case "lipsLowerInner":    case 4:  return([78,95,88,178,87,14,317,402,318,324,308]);

  case "rightEyeUpper0":    case 5:  return([246,161,160,159,158,157,173]);
  case "rightEyeLower0":    case 6:  return([33,7,163,144,145,153,154,155,133]);
  case "rightEyeUpper1":    case 7:  return([247,30,29,27,28,56,190]);
  case "rightEyeLower1":    case 8:  return([130,25,110,24,23,22,26,112,243]);
  case "rightEyeUpper2":    case 9:  return([113,225,224,223,222,221,189]);
  case "rightEyeLower2":    case 10: return([226,31,228,229,230,231,232,233,244]);
  case "rightEyeLower3":    case 11: return([143,111,117,118,119,120,121,128,245]);

  case "rightEyebrowUpper": case 12: return([156,70,63,105,66,107,55,193]);
  case "rightEyebrowLower": case 13: return([35,124,46,53,52,65]);

  case "rightEyeIris":      case 14: return([469, 470,470, 471,471, 472,472, 469]);

  case "leftEyeUpper0":     case 15: return([466,388,387,386,385,384,398]);
  case "leftEyeLower0":     case 16: return([263,249,390,373,374,380,381,382,362]);
  case "leftEyeUpper1":     case 17: return([467,260,259,257,258,286,414]);
  case "leftEyeLower1":     case 18: return([359,255,339,254,253,252,256,341,463]);
  case "leftEyeUpper2":     case 19: return([342,445,444,443,442,441,413]);
  case "leftEyeLower2":     case 20: return([446,261,448,449,450,451,452,453,464]);
  case "leftEyeLower3":     case 21: return([372,340,346,347,348,349,350,357,465]);

  case "leftEyebrowUpper":  case 22: return([383,300,293,334,296,336,285,417]);
  case "leftEyebrowLower":  case 23: return([265,353,276,283,282,295]);

  case "leftEyeIris":       case 24: return([474, 475,475, 476,476, 477,477, 474]);

  case "midwayBetweenEyes": case 25: return([168]);

  case "noseTip":           case 26: return([1]);
  case "noseBottom":        case 27: return([2]);
  case "noseRightCorner":   case 28: return([98]);
  case "noseLeftCorner":    case 29: return([327]);

  case "rightCheek":        case 30: return([205]);
  case "leftCheek":         case 31: return([425]);

  case "rightEye":          case 32: return([130,247,30,29,27,28,56,190,244,233,232,231,230,229,228,31,226]);
  case "mouth":             case 33: return([61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146]);
  case "leftEye":           case 34: return([252,253,254,255,256,263,339,341,362,382,384,385,386,387,388,398]);
  }
 return null;
 }





 function tflowStart ()
 {
 app.tflow={};
 app.tflow.obj_ray=[];
 }



 function tflowCreate ()
 {
 var obj;
 obj={};
 obj.type="tflow";
 obj.is_started=true;
 obj.is_error=false;
 obj.is_ready=false;
 obj.is_waitin=false;
 obj.self_index=app.tflow.obj_ray.length;
 obj.stage=100;

 obj.raw_i_queue=[];
 obj.fin_o_queue=[];

/// obj.i_queue=[];
 ///obj.o_queue=[];
 ///obj.o_queue=[];
 obj.frame_number_in=0;
 obj.frame_number_out=0;
 obj.frames_dropped=0;
 obj.promise_object=null;
 obj.promise_handle=0;
 obj.fm=null;
 //obj.vframe=null;
 obj.kin_marks=null;
 app.tflow.obj_ray.push(obj);
 return obj;
 }






 function tflowPush (obj,wid,hit,vframe)
 {
 var io;
 if(obj.type!="tflow") { return false; }
 if(obj.is_ready!=true) { aa.debugAlert(); }

 //obj.vframe=vframe;
 //if(obj.is_waiting) { return false; }
// if(obj.is_waiting==true||obj.raw_i_queue.length>0) { return false; }

 /*
 //if(obj.is_waitin==false&&obj.raw_i_queue.length==0)
 if(obj.raw_i_queue.length==0)
  {
  obj.is_waitin=true;
  //obj.fm.send({image:vframe});
  obj.fm.send({image:vframe});
  obj.frame_number_in++;
  return true;
  }
 */


 //obj.vframe=vframe;
 io={};
 io.frame_number_in=obj.frame_number_in;
 io.frame_number_out=obj.frame_number_out;
 io.width=wid;
 io.height=hit;
 io.vframe=vframe;
 obj.raw_i_queue.push(io);
 obj.frame_number_in++;
 //console.log("pushed");
 return true;
 }







 function tflowPop (obj)
 {
 var io;
 if(obj.type!="tflow")     { return null; }
 if(obj.is_ready!=true) { aa.debugAlert(); }
 if(obj.fin_o_queue.length==0) { return null; }
 io=obj.fin_o_queue.shift();
 obj.frame_number_out++;
 //console.log("pop");
 return io;
 }





 function tflowFaceCord (lmark,cindex,xmul,ymul,zmul)
 {
 var cd;
 if(lmark==undefined) { return null; }
 if(cindex<0||cindex>=lmark.length) { aa.debugAlert("eea2"); }
 cd={};
 cd.type="facecord";
 cd.x=lmark[cindex].x*xmul;
 cd.y=lmark[cindex].y*ymul;
 cd.z=lmark[cindex].z*zmul;
 return cd;
 }




 function tflowMap (obj,ooo,vas,css,what)
 {
 var cgrp,tgrp,pgrp;
 var oval,mm,ii,nn,o;
 var x1,y1,x2,y2,x3,y3,x4,y4;
 var x5,y5,x6,y6,x7,y7,x8,y8;
 var xyuv0,xyuv1,xyuv2,xyuv3,ang;
 var pix,iw,ih,xx,yy,rr,gg,bb,al,four;
 var hsv,rgb,xf;
 var vek=[];
 var mid=[];

 if((cgrp=aa.guiGroupGetById("b_canstream_0"))==null) { alert("ded1"); }
 if((pgrp=aa.guiGroupGetById("b_canvas_0"))==null) { alert("ded1"); }
 if((tgrp=aa.guiGroupGetById("tomcruise"))==null)     { alert("ded2"); }
 //ooo=tflowPop(obj);
 //vas=ooo.image;
 //css=aa.guiCssAreaGet(cgrp.han);
 //aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,css.width,css.height,vas);

 if(tomdone==0)
  {
  iw=app.guix.image.img.width;
  ih=app.guix.image.img.height;
  tomdone=1;
  pix=aa.guiCanvasImageGet(tgrp.han,0,0,iw,ih);
  four=0;
  for(yy=0;yy<ih;yy++)
   {
   for(xx=0;xx<iw;xx++)
    {
    /*
    rr=pix.data[(four+0)];
    gg=pix.data[(four+1)];
    bb=pix.data[(four+2)];
    al=pix.data[(four+3)];
    rgb=aa.guiRgbaSet(rr,gg,bb,al);
    hsv=aa.guiRgbaToHsva(rgb);
    hsv.s*=0.6;
    hsv.v*=1.1;
    rgb=aa.guiHsvaToRgba(hsv);
    //rr*=1.0;
    //gg*=1.0;
    //bb*=1.0;
    rr=rgb.r;
    gg=rgb.g;
    gg=rgb.b;
    pix.data[(four+0)]=rr>>0;
    pix.data[(four+1)]=gg>>0;
    pix.data[(four+2)]=bb>>0;
    */
    pix.data[(four+3)]=128;
    four+=4;
    }
   }
  aa.guiCanvasImagePut(tgrp.han,0,0,0,0,iw,ih,pix);
  }


 //if(aa.guiCanvasSave(cgrp.han)!=true) alert();
 //oval=tflowLandMarksGet(32);
 nn=0;
 for(mm=0;mm<tFlowTria.length;mm+=3)
  {
  /*
  for(o=0;o<oval.length;o++)
   {
   if(tFlowTria[mm+0]==oval[o]) { break; }
   if(tFlowTria[mm+1]==oval[o]) { break; }
   if(tFlowTria[mm+2]==oval[o]) { break; }
   }
  if(o!=oval.length) { continue; }
  */

  vek[0]=tflowFaceCord(ooo.multiFaceLandmarks[0],tFlowTria[mm+0],1,1,1);
  vek[1]=tflowFaceCord(ooo.multiFaceLandmarks[0],tFlowTria[mm+1],1,1,1);
  vek[2]=tflowFaceCord(ooo.multiFaceLandmarks[0],tFlowTria[mm+2],1,1,1);
  vek[3]=tflowFaceCord(obj.kin_marks,tFlowTria[mm+0],1,1,1);
  vek[4]=tflowFaceCord(obj.kin_marks,tFlowTria[mm+1],1,1,1);
  vek[5]=tflowFaceCord(obj.kin_marks,tFlowTria[mm+2],1,1,1);
  x1=vek[0].x; y1=vek[0].y;
  x2=vek[1].x; y2=vek[1].y;
  x3=vek[2].x; y3=vek[2].y;
  x5=vek[3].x; y5=vek[3].y;
  x6=vek[4].x; y6=vek[4].y;
  x7=vek[5].x; y7=vek[5].y;
  xyuv0=aa.guiXyuvSetEx(x1,y1, x5,y5,   css.width,css.height,app.guix.image.img.width,app.guix.image.img.height);
  xyuv1=aa.guiXyuvSetEx(x2,y2, x6,y6,   css.width,css.height,app.guix.image.img.width,app.guix.image.img.height);
  xyuv2=aa.guiXyuvSetEx(x3,y3, x7,y7,   css.width,css.height,app.guix.image.img.width,app.guix.image.img.height);
  //xyuv0.x>>=0;  xyuv0.y>>=0;  xyuv0.u>>=0;  xyuv0.v>>=0;
  //xyuv1.x>>=0;  xyuv1.y>>=0;  xyuv1.u>>=0;  xyuv1.v>>=0;
  //xyuv2.x>>=0;  xyuv2.y>>=0;  xyuv2.u>>=0;  xyuv2.v>>=0;
  //if(nn<300||nn>500)
  //xf=cgrp.ctx.getTransform();
///  aa.guiCanvasTextureMap(cgrp.han,xyuv0,xyuv1,xyuv2,null,tgrp.obj.dom);
  //cgrp.ctx.setTransform(xf);
  nn++;
  }
 //aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,null,null,pgrp.obj.dom);
 //console.log(nn);
 //cgrp.ctx.setTransform(xf);
 //if(aa.guiCanvasRestore(cgrp.han)!=true) alert();
 }






 function tflowYield (obj)
 {
 var cgrp,tgrp,ooo,vas,aaa,oval,mm,css;
 var x1,y1,x2,y2,x3,y3,x4,y4;
 var x5,y5,x6,y6,x7,y7,x8,y8;
 var xyuv0,xyuv1,xyuv2,xyuv3,ang;
 var pts=[];
 var vek=[];


 if(obj==undefined)       { return false; }
 if(obj.type!="tflow")    { return false; }
 if(obj.is_started!=true) { return false; }

 while(1)
  {
  switch(obj.stage)
   {
   case 100:
   obj.fm=new FaceMesh({locateFile:(file)=>{ var fn="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/"+file; console.log(fn); return fn;    }});
   obj.fm.setOptions({
                      maxNumFaces:1,
                      refineLandmarks:false,
                      cameraNear:false,
                      cameraFar:false,
                      cameraVerticalFovDegrees:63.0,
                      minDetectionConfidence:0.5,
                      selfieMode:false,
                      minTrackingConfidence:0.5,
                      useCpuInference:false,
                      enableFaceGeometry:false
                      });
   obj.fm.onResults(function (results)
    {
    ///if(obj.is_waitin!=true) { aa.debugAlert(); }
    obj.is_waitin=false;
    obj.fin_o_queue.push(results);
    });
   obj.stage=110;
   break;



   case 110:
   //if(app.stage<480) { break; }
   obj.is_ready=true;
   console.log("###@# "+obj.self_index+" ready");
   obj.stage=120;
   break;



   case 120:
   if((cgrp=aa.guiGroupGetById("b_canstream_0"))==null) { break; }//alert("ded3"); }
   if((tgrp=aa.guiGroupGetById("tomcruise"))==null)     { break; }//alert("ded2"); }

   if(obj.is_waitin==false&&obj.raw_i_queue.length>0)
   //if(obj.raw_i_queue.length>0)
    {
    aaa=obj.raw_i_queue.shift();
    obj.is_waitin=true;
    obj.fm.send({image:aaa.vframe});
    }

   if(obj.fin_o_queue.length>0&&obj.self_index==0&&gotkin==0)
    {
    ooo=tflowPop(obj);
    vas=ooo.image;
    if(ooo.multiFaceLandmarks===undefined||ooo.multiFaceLandmarks[0]===undefined) { break; }
    console.log("GOT KIN MARKS, ",aa.main_state.stage);
    //app.tflow.obj_ray[1].kin_marks=Object.assign(ooo.multiFaceLandmarks[0]);
    app.tflow.obj_ray[0].kin_marks=Object.assign(ooo.multiFaceLandmarks[0]);
    gotkin=1;
    break;
    }

   if(app.stage<480) { break; }
   //if(obj.fin_o_queue.length>0&&obj.self_index==1)
   if(obj.fin_o_queue.length>0&&obj.self_index==0&&gotkin==1)
    {
    ooo=tflowPop(obj);
    vas=ooo.image;
    css=aa.guiCssAreaGet(cgrp.han);
    aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,css.width,css.height,vas);
    if(ooo.multiFaceLandmarks[0])     {     tflowMap(obj,ooo,vas,css,1);     }
    mediaVideoAddVadColor(cgrp,css.width,css.height,vas);
    }
   break;



   case 666:
   break;
   }
  break;
  }
 }




