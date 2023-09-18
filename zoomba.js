/**
 aaJS, ope(c)n Ashod Apakian
 Third party credits:
 jesusgollonet easing functions
 https://www.w3.org/TR/css-color-3/ web color names
 webrtchacks for sdp specs
 iNoBounce /lazd/iNoBounce/
 developer.mozilla.org
**/

//---------------------------------------------------------
 var cfg_app_version="3.01";
 var cfg_app_speed=30;
 var cfg_profiler_use=0;
 var cfg_max_peers=4;
 var cfg_audio_default_gain=4.5;
 var cfg_audio_local_initially_muted=false;
 var cfg_audio_peer_initially_muted=false;
 var cfg_audio_loopback_muted=true;
 var cfg_vid_wid=320;
 var cfg_vid_hit=240;
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
 var cfg_sdp_use_vrate=(256);

 window.onload=function()  {  aa.mainStart(cfg_app_version,cfg_app_speed,appProc);  aa.mainRun();  };

 var app=aa.main_vars.app;
//---------------------------------------------------------

 const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const SpeechGrammarList=window.SpeechGrammarList||window.webkitSpeechGrammarList;
 const SpeechRecognitionEvent=window.SpeechRecognitionEvent||window.webkitSpeechRecognitionEvent;
 var has_speech=('SpeechRecognition' in window||'webkitSpeechRecognition' in window);

//---------------------------------------------------------


 function speechrecogNew (lang)
 {
 var obj,i,len,txt,todo,msg;
 if(has_speech!=true) { return null; }
 obj={};
 obj.type="speechrecog";
 obj.is_recognizing=false;
 obj.is_ended=false;
 obj.is_lang=lang;
 obj.inter_off=0;
 obj.finel_off=0;
 obj.str="";
 obj.err=0;
 obj.inter="";
 obj.finel="";
 obj.start_ms=aa.timerMsRunning();
 obj.inact_ms=0;
 obj.guid=0;
 obj.recog=new webkitSpeechRecognition();
 obj.recog.continuous=true;
 obj.recog.interimResults=true;
 obj.recog.lang=obj.is_lang;

 obj.recog.onstart=function(event)
  {
  //console.log("onstart");
  obj.is_recognizing=true;
  };

 obj.recog.onspeechstart=function(event)
  {
  //console.log("onspeechstart");
  };

 obj.recog.onspeechend=function(event)
  {
  //console.log("onspeechend");
  };

 obj.recog.onsoundstart=function(event)
  {
  //console.log("onsoundstart");
  };

 obj.recog.onsoundend=function(event)
  {
  //console.log("onsoundend");
  };

 obj.recog.onaudiostart=function(event)
  {
  //console.log("onaudiostart");
  };

 obj.recog.onaudioend=function(event)
  {
  //console.log("onaudioend");
  };

 obj.recog.onend=function(event)
  {
  //console.log("onend");
  obj.is_recognizing=false;
  obj.is_ended=true;
  };

 obj.recog.onerror=function(event)
  {
  //console.log("onerror");
  console.log(event.error);
  };


 obj.recog.onnomatch=function(event)
  {
  //console.log("onnomatch");
  };

 obj.recog.onresult=function(event)
  {
  obj.inter="";
  for(i=0;i<event.results.length;i++)
   {
   obj.inter+=event.results[i][0].transcript;
   }
  len=obj.inter.length-obj.inter_off;
  if(len>16)
   {
   txt=obj.inter.substring(obj.inter_off);
   obj.inter_off+=(txt.length+1);
   if(app.beam&&app.beam.my_id>0)
    {
    msg={};
    msg.txt=txt;
    clientRtcsigWrite(app.beam.rtcsig_cli,0,"chat",JSON.stringify(msg));
    }
   obj.inact_ms=aa.timerMsRunning();
   }
  };
 return obj;
 }





 function speechrecogStart (obj)
 {
 if(obj.type!="speechrecog") { return false; }
 //console.log("calling obj.recog.start() from speechrecogStart");
 obj.is_recognizing=false;
 obj.is_ended=false;
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
 return true;
 }



 function speechrecogStop (obj)
 {
 if(obj.type!="speechrecog") { return false; }
 //console.log("calling obj.recog.stop() from speechrecogStop");
 obj.recog.abort();
 return true;
 }




 function speechrecogWhip (obj)
 {
 var el,len,txt,msg;
 if(obj.type!="speechrecog") { return false; }
 el=aa.timerMsElapsed(obj.inact_ms);
 if(el<3000) { return false; }
 len=obj.inter.length-obj.inter_off;
 if(len<=0) { return false; }
 txt=obj.inter.substring(obj.inter_off);
 obj.inter_off+=(txt.length+1);
 if(app.beam&&app.beam.my_id>0)
  {
  msg={};
  msg.txt=txt;
  clientRtcsigWrite(app.beam.rtcsig_cli,0,"chat",JSON.stringify(msg));
  }
 obj.inact_ms=aa.timerMsRunning();
 return true;
 }




 function appYield ()
 {
 var str,lines,i;
 if(app.cpu_speed==0)
  {
  if(aa.main_obj.state.speed_req==cfg_app_speed) { aa.mainSpeedSet(cfg_app_speed<<2); }
  app.cpu_speed=aa.envCpuMonitorGet();
  if(app.cpu_speed!=0)
   {
   if(1) { console.log("cpu speed = "+app.cpu_speed+" took "+aa.timerMsRunning()); }
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
 }





 function appProc ()
 {
 var i,v,delme,el;

 switch(aa.main_state.stage)
  {
  case 0:
  app.options={};
  app.cpu_speed=0;
  app.ei=aa.envInfoGet();
  aa.envCpuMonitorBegin(10);
  aa.mainStageSet(10);
  break;

  case 66:
  break;

  case 10:
  if(app.cpu_speed==0) { break; }
  if(aa.main_state.initial_click==false) { break; }
  aa.mainStageSet(20);
  break;


  case 20:
  guixStart();
  //app.bugcli=clientRtcsigNew("wss://xdosh.com:443/wss/rtcsig/","bugroom");
  aa.mainStageSet(30);
  break;


  case 30:
  ///if(app.bugcli.is_ready!=true) { break; }
  if(app.guix.is_ready!=true)   { break; }
  if(app.guix.group_ray.length==0) { break; }
  aa.mainStageSet(40);
  break;


  case 40:
  mediaStart();
  aa.mainStageSet(50);
  break;

  case 50:
  mediaDetectStart();
  aa.mainStageSet(60);
  break;


  case 60:
  if(app.media.is_detect_success==false&&app.media.is_detect_failure==false) { break; }
  if(app.media.is_detect_success==true) {  aa.mainStageSet(70); break; }
  aa.mainStageSet(66);
  break;


  case 70:
  if(app.media.devenu.vid_input==true&&app.media.devenu.aud_input==true)
   {
   mediaDeviceDump(false);
   mediaDeviceListInit(app.media.devenu);
   aa.mainStageSet(150);
   break;
   }
  aa.mainStageSet(100);
  break;

  case 100:
  app.media.handle=aa.mediaCreate({},{});
  aa.mainStageSet(110);
  break;

  case 110:
  aa.mediaStatus(app.media.handle);
  med=aa.mediaGet(app.media.handle);
  if(med.res=="err")
   {
   err=aa.mediaErrorEtc(med.e_name,med.e_msg);
   alert("stage 140, err="+err);
   switch(err)
    {
    case 44: console.log("permission denied"); break;
    case 46: console.log("permission dismissed"); break;
    default: console.log("aerr = "+err+"  "+med.e_name+"  "+med.e_msg); break;
    }
   aa.mainStageSet(666);
   break;
   }
  if(med.res=="ok")
   {
   if(med.stage!=300) { aa.debugAlert(med.stage); }
   if(aa.mediaDestroy(app.media.handle)!=true) {  aa.debugAlert("dd"); }
   app.media.handle=0;
   aa.mainStageSet(120);
   break;
   }
  break;

  case 120:
  aa.mainStageSet(50);
  break;


  case 150:
  tflowStart();
  aa.mainStageSet(160);
  break;

  case 160:
  app.tfl=tflowCreate();
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
  if(med.res!="ok")
   {
   console.log(med.e_name);
   console.log(med.e_msg);
   console.log(med.e_code);
   console.log(med.e_etc0);
   console.log(med.e_etc1);
   }
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


/*
  case 400:
  case 401:
  //if(aa.mainCyclePulse(20))   {   guixWidgetChatLogLog(app.guix.widget_chatlog,null,aa.main_state.cycle);   }
  if(app.beam.sh1.sock_status.is_closed==true||app.beam.sh1.sock_status.is_error==true)
   {
   if(app.beam.sh1.sock_status.is_open==true) { console.log("disconnected "); }
   else                                       { console.log("could not connect"); }
   aa.mainStageSet(450);
   }
  if(aa.main_state.stage==400&&app.beam.sh1.sock_status.is_open==true)
   {
   if(app.beam.sh1.sock_status.is_closed==false&&app.beam.sh1.sock_status.is_error==false)
    {
    if(app.beam.sh1.is_ready==true)
     {
     aa.debugClear(5);
     aa.mainStageSet(401);
     break;
     }
    }
   }
  break;


  case 450:
  console.log("RE-CONNECTING");
  beamDelete(app.beam.sh1);
  app.beam.sh1=beamNew("wss://xdosh.com:443/wss/rtcsig/","demo");
  //app.beam.sh1=beamNew("vidcalls",cfg_max_peers,"","funky","wss://xdosh.com:443/wss/roomer");
  aa.mainStageSet(400);
  break;
*/

  case 480:
  app.sprec=speechrecogNew("English");
  if(app.sprec==null) { alert("ss"); }
  aa.mainStageSet(490);
  break;



  case 490:
  //if(has_speech!=true) { aa.mainStageSet(500); break; }
  speechrecogStart(app.sprec);
  aa.mainStageSet(500);
  break;

  case 495:
  if(aa.timerMsElapsed(app.delo)<1) { break; }
  aa.mainStageSet(490);
  break;

  case 500:
  if(has_speech)
   {
   speechrecogWhip(app.sprec);
   if(app.sprec.is_ended==true)
    {
    speechrecogStop(app.sprec);
    app.delo=aa.timerMsRunning();
    aa.mainStageSet(495);
    break;
    }
   }
  break;




  case 5001:
  if(app.reco==undefined)
   {
   //alert("new");
   app.reco=recogStart();
   }
  else
   {
    el=aa.timerMsElapsed(app.reco.ms);
    if(app.reco.recognizing==false&&el>3000)
     {
     console.log("stopping "+app.reco.ms+" "+app.reco.ioff);
     app.reco.recog.abort();
     app.reco.recognizing=false;
     app.reco.inter_off=0;
     app.reco.err=0;
     app.reco.inter="";
     app.reco.finel="";
     app.reco.ms=0;
     app.reco.recog.start();
     console.log("restarted");
     }
   //obj.recog.start();
   //console.log(app.reco);
   }

  if(app.beam&&app.beam.peer_count_connected>=1&&0)
   {
   if(aa.numRand(200)==0)
    {
    if(app.media.is_swapping==false)
     {
     v=app.media.cur_vxi;
     v++;
     v%=mediaDeviceCountGet("videoinput");;
     console.log("cam swap "+v);
     mediaCamSwap(v);
     }
    //console.log(app.media.cur_vxi,mediaDeviceCountGet("videoinput"));
    }
   }
  break;


  }

 appYield();
 mediaYield();
 if(app.tfl)
  {
  for(i=0;i<2;i++)  {   tflowYield(app.tfl);   }
  }
 if(app.beam)
  {
  for(i=0;i<4;i++) { beamYield(app.beam); }
  }

 if(0&&app.bugcli)
  {
  while(1)
   {
   clientRtcsigYield(app.bugcli);
   pkt=clientRtcsigRead(app.bugcli);
   if(pkt==null||pkt==false) { break; }
   if(pkt.cmd=="hi") { console.log("my uid="+app.bugcli.my_uid+" peers="+app.bugcli.peer_ray.length+" room="+app.bugcli.room);   break;    }
   if(pkt.cmd=="left"||pkt.cmd=="joined") { console.log("room event "+pkt.cmd+" peers="+app.bugcli.peer_ray.length);   break;    }
   if(pkt.cmd=="said")  {  msg=JSON.parse(pkt.msg_data); console.log(JSON.stringify(msg));  break;    }
   console.log("150sigread",pkt);
   break;
   }
  }
 }



//---------------------------------------------------------

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
  for(go=0;go<4;go++)
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





 function clientRtcsigYield (obj)
 {
 var pkt,jsn,pi,pl,etc;
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


//---------------------------------------------------------




 function guixStart ()
 {
 var s;
 app.guix={};
 app.guix.pixels_per_xpc=0;
 app.guix.pixels_per_ypc=0;
 app.guix.group_ray=[];
 app.guix.font_ray=[];
 app.guix.fonts_ready=false;
 app.guix.is_ready=false;
 if(1)  {  app.guix.pointer={};   aa.pointerStart();   }
 if(1)  {  app.guix.keyboard={};  aa.keyboardStart();  }
 s=Math.floor(Date.now()/10000);
 app.guix.font_ray.push(aa.guiFontLoad("saira","woff","https://xdosh.com/fonts/saira.woff?"+s));
 app.guix.font_ray.push(aa.guiFontLoad("srccodepro","woff","https://xdosh.com/fonts/srccodepro.woff?"+s));
 app.guix.sprite=aa.spriteLoad("https://xdosh.com/gfx/spritestwo.png?"+s);
 aa.ifaceStart(guixIfaceProc);
 }





 function guixIsReady ()
 {
 var c,f;
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
 if(app.guix.sprite.is_ready!=true||app.guix.fonts_ready!=true) { return false; }
 if(1) { console.log("guixIsReady took "+aa.timerMsRunning()); }
 app.guix.is_ready=true;

 guixCreate("canvas",null,"maincanvas",9000);
 guixCreate("canvas",null,"b_canvas_0",9050);
 guixCreate("canstream",null,"b_canstream_0",9050);
 guixCreate("canvas",null,"overlay",9060);
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
 //aa.guiCssOutlineSet(grp.han,2,-2,"solid",aa.guiRgbaStringCommon(2+idx,1));
 return grp;
 }







 function guixHandleElements (obj)
 {
 var grp,dwid,dhit,i,xx,yy,txt,fnt,fix;
 var probe=[];

 dwid=obj.this_dsz[5];
 dhit=obj.this_dsz[8];

 probe[0]=aa.guiProbe(aa.guiGroupGetById("maincanvas").han);
 probe[1]=aa.guiProbe(aa.guiGroupGetById("b_canvas_0").han);
 probe[2]=aa.guiProbe(aa.guiGroupGetById("b_canstream_0").han);
 probe[3]=aa.guiProbe(aa.guiGroupGetById("overlay").han);
 for(i=0;i<cfg_max_peers;i++) {  probe[4+i]=aa.guiProbe(aa.guiGroupGetById("b_video_"+i).han);  }

 if((grp=aa.guiGroupGetById(probe[0].id))==null) { aa.debugAlert("wed"); }
 grp.css.display="inline-block";
 aa.guiRetinaSet(grp.han,1.0,1.0,0,0,dwid,dhit);
 grp.vars.needs_paint=false;

 if((grp=aa.guiGroupGetById(probe[1].id))==null) { aa.debugAlert("we"); }
 grp.css.display="none";
 aa.guiRetinaSet(grp.han,1.0,1.0,0,200,cfg_vid_wid,cfg_vid_hit);
 grp.vars.needs_paint=false;

 if((grp=aa.guiGroupGetById(probe[2].id))==null) { aa.debugAlert("wewd"); }
 grp.css.display="inline-block";
 aa.guiRetinaSet(grp.han,1.0,1.0,0,0,cfg_vid_wid,cfg_vid_hit);
 grp.vars.needs_paint=false;

 if((grp=aa.guiGroupGetById(probe[3].id))==null) { aa.debugAlert("wed"); }
 grp.css.display="inline-block";
 aa.guiRetinaSet(grp.han,1.0,1.0,0,0,dwid,dhit);
 grp.vars.needs_paint=false;
 aa.guiCssOpacitySet(grp.han,0.5);
 aa.guiCanvasClear(grp.han);
 ///aa.guiCheckeredFill(grp.han,0,0,dwid,dhit,12,aa.guiRgbaString(37,100,33,1),aa.guiRgbaString(aa.numRand(200),52,199,1));



 fnt="300 20px arial";
 fix=aa.guiFontFix(fnt);
 if(app.vlog==undefined)
  {
  app.vlog=aa.virtualLogNew(20);
  }

 xx=0;
 yy=0;
 for(i=0;i<app.vlog.num_lines;i++)
  {
  txt=aa.virtualLogGet(app.vlog,i);
  if(txt==false) { yy+=20; continue; }
  //yy+=fix;
  if(txt.length>0)
   {
   aa.guiCanvasText(grp.han,xx,yy,0,null,aa.guiRgbaString(255,245,245,1),fnt,"> "+txt);
   ///alert(txt);
   }
  yy+=20;
  }





 if(obj.this_dsz[10]==true)
  {
  xx=0;
  yy=0;
  for(i=0;i<cfg_max_peers;i++)
   {
   if((grp=aa.guiGroupGetById(probe[4+i].id))==null) { aa.debugAlert("rfff"); }
   grp.css.display="inline-block";
   if(i==0) { grp.css.display="none"; }
   else     { grp.css.display="inline-block"; }
   aa.guiRetinaSet(grp.han,1.0,1.0,xx,yy,cfg_vid_wid,cfg_vid_hit);
   xx+=cfg_vid_wid;
   if(xx>=(cfg_vid_wid*2)) { xx=0; yy+=cfg_vid_hit; }
   grp.vars.needs_paint=false;
   }
  }
 else
  {
  xx=0;
  yy=0;
  for(i=0;i<cfg_max_peers;i++)
   {
   if((grp=aa.guiGroupGetById(probe[4+i].id))==null) { aa.debugAlert("rfff"); }
   grp.css.display="inline-block";
   if(i==0) { grp.css.display="none"; }
   else     { grp.css.display="inline-block"; }
   aa.guiRetinaSet(grp.han,1.0,1.0,xx,yy,cfg_vid_wid,cfg_vid_hit);
   yy+=cfg_vid_hit;
   //xx+=cfg_vid_wid;
   //if(xx>=(cfg_vid_wid*2)) { xx=0; yy+=cfg_vid_hit; }
   grp.vars.needs_paint=false;
   }
  }


 //aa.guiFitSet(grp.han,"fill","0% 0%");
 grp.vars.needs_paint=false;
 }






 function guixIfaceProc (obj)
 {
 var dwid,dhit,cord;

 if(guixIsReady()!=true) { return; }
 dwid=obj.this_dsz[5];
 dhit=obj.this_dsz[8];
 cord=aa.guiGridToCord(1,1,dwid,dhit,100,100);
 app.guix.pixels_per_xpc=cord.x;
 app.guix.pixels_per_ypc=cord.y;

 guixHandleElements(obj);

 if(app.guix.pointer)  { guixPtrYield(obj);      }
 if(app.guix.keyboard) { guixKeyboardYield(obj); }

 //guixPaint(obj,"maincanvas");
 //guixPaint(obj,"vid_0");
 //guixPaint(obj,"can_0");

 if(app.media!==undefined&&app.media.handle>0)
  {
  if(aa.mediaGet(app.media.handle).res=="ok")
   {
   mediaCanvasPaint(obj.this_dsz);
   }
  }
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


//---------------------------------------------------------



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
 for(i=0;i<l;i++)
  {
  app.media.active_devenu.aud_input_list[i].res=null;
  }
 l=app.media.active_devenu.vid_input_list.length;
 for(i=0;i<l;i++)
  {
  app.media.active_devenu.vid_input_list[i].res=null;
  }
 l=app.media.active_devenu.aud_output_list.length;
 for(i=0;i<l;i++)
  {
  app.media.active_devenu.aud_output_list[i].res=null;
  }
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
 var str,len,i,eo,d,den;
 console.log(" ");
 console.log("mediaDeviceDump==========");

 if(doactive) { den=app.media.active_devenu; }
 else         { den=app.media.devenu;        }

 for(i=0;i<den.aud_input_list.length;i++)
  {
  o=den.aud_input_list[i];
  str="";
  str+="i="+i+"  ";
  str+=o.kind+"  ";
  str+=o.clean+"  ";
  if(o.res!=null)
   {
   str+="res.res="+o.res.res+" ";
   str+="res.name="+o.res.name+" ";
   str+="res.msg="+o.res.msg+" ";
   }
  console.log(str);
  }
 console.log(" ");

 for(i=0;i<den.vid_input_list.length;i++)
  {
  o=den.vid_input_list[i];
  str="";
  str+="i="+i+"  ";
  str+=o.kind+"  ";
  str+=o.clean+"  ";
  if(o.res!=null)
   {
   str+="res.res="+o.res.res+" ";
   str+="res.name="+o.res.name+" ";
   str+="res.msg="+o.res.msg+" ";
   }
  console.log(str);
  }
 console.log(" ");

 for(i=0;i<den.aud_output_list.length;i++)
  {
  o=den.aud_output_list[i];
  str="";
  str+="i="+i+"  ";
  str+=o.kind+"  ";
  str+=o.clean+"  ";
  if(o.res!=null)
   {
   str+="res.res="+o.res.res+" ";
   str+="res.name="+o.res.name+" ";
   str+="res.msg="+o.res.msg+" ";
   }
  console.log(str);
  }
 console.log(" ");
 console.log(".......");
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

 //console.log(wid,hit);

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
 ///guixNeedsPaintSet("sidemenu");
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
// console.log("SWAPPER INIT");
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
 //console.log("SWAPPER SWAP");
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
 //console.log(object);
 grp=aa.guiGroupGetById(object.id);
 //console.log(grp.obj.id);
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






 function mediaCanvasPaint (dsz)
 {
 var vgrp,pgrp,cgrp,ready,isplaying;
 var vw,vh,ew,eh,area,cw,ch,dw,dh,swp,fps,fnum;
 var cap,frm,delme,peer;
 var vgsz,pgsz,cgsz,zoo;
 var dis,vis,ora,vratio;

 if(app.media==undefined) { return; }

 vgrp=aa.guiGroupGetById("b_video_0");
 if(vgrp==null||vgrp.dom.videoWidth==0) { return; }

 pgrp=aa.guiGroupGetById("b_canvas_0");
 if(pgrp==null||pgrp.dom.width==0)      { return; }

 cgrp=aa.guiGroupGetById("b_canstream_0");
 if(cgrp==null||cgrp.dom.width==0)      { return; }


 if(vgrp.obj.vars.fps==undefined)       { vgrp.obj.vars.fps=0; }

 while(1)
  {
  ready=true;
  if(app.media.is_swapping==true) {  ready=false; break; }
  if(vgrp.obj.dom.readyState!=4)  {  ready=false; break; }
  if(vgrp.obj.vars.prev_time!==undefined)
   {
   if(vgrp.obj.dom.currentTime<=vgrp.obj.vars.prev_time) { ready=false;  }
   if(ready==false) { break; }
   }
  ready=true;
  break;
  }

 isplaying=vgrp.dom.currentTime>0&&!vgrp.dom.paused&&!vgrp.dom.ended&&vgrp.dom.readyState>2;

 if(ready==true)
  {
  vgsz=aa.guiSizesGet(vgrp.han);
  pgsz=aa.guiSizesGet(pgrp.han);
  //cgsz=aa.guiSizesGet(cgrp.han);

  //console.log(vgsz);

  if(vgrp.obj.vars.frame_number==undefined)   {   vgrp.obj.vars.frame_number=0; }
  if(vgrp.obj.vars.frame_number==0)           {   vgrp.obj.vars.start_time=vgrp.obj.dom.currentTime;   }
  fnum=vgrp.obj.vars.frame_number;
  vgrp.obj.vars.frame_number++;
  vgrp.obj.vars.prev_time=vgrp.obj.dom.currentTime;

  fps=0;
  if(vgrp.obj.vars.frame_number>0) { fps=vgrp.obj.vars.frame_number/(vgrp.obj.dom.currentTime-vgrp.obj.vars.start_time); }
  vgrp.obj.vars.fps=fps;
  //vratio=(pgsz.domwh[1]/vgsz.vidwh[1])*vgsz.vidwh[1];

  if(0)
   {
   aa.guiCanvasImageDraw(pgrp.obj.han,null,null,null,null,0,0,pgsz.domwh[0],pgsz.domwh[1],vgrp.obj.dom);
   if((cap=aa.guiCanvasImageGet(pgrp.obj.han,0,0,pgsz.domwh[0],pgsz.domwh[1]))==null) { aa.debugAlert("s343"); }
   tflowPush(app.tfl,pgsz.domwh[0],pgsz.domwh[1],cap);
   }
  else
   {
   aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,pgsz.domwh[0],pgsz.domwh[1],vgrp.obj.dom);

   //aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,null,null,vgrp.obj.dom);
   //aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,null,null,vgrp.obj.dom);
   mediaVideoAddVadColor(cgrp,cfg_vid_wid,cfg_vid_hit);
   }
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



//---------------------------------------------------------

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

 obj.i_queue=[];
 obj.o_queue=[];

 obj.frame_number_in=0;
 obj.frame_number_out=0;
 obj.frames_dropped=0;

 obj.promise_object=null;
 obj.promise_handle=0;

 obj.bromise_object=null;
 obj.bromise_handle=0;

 obj.fm=null;

 app.tflow.obj_ray.push(obj);
 return obj;
 }





 function tflowPush (obj,wid,hit,vframe)
 {
 var io;
 if(obj.type!="tflow") { return false; }
 io={};
 io.frame_number_in=obj.frame_number_in;
 io.frame_number_out=obj.frame_number_out;
 io.width=wid;
 io.height=hit;
 io.vframe=vframe;
 obj.i_queue.push(io);
 obj.frame_number_in++;
 return true;
 }







 function tflowPop (obj)
 {
 var io;
 if(obj.type!="tflow")     { return null; }
 if(obj.o_queue.length==0) { return null; }
 io=obj.o_queue.shift();
 obj.frame_number_out++;
 return io;
 }






 function tflowYield (obj)
 {
 var boy,aaa,ooo,vas,cgrp,mark,mm,lan,ii,xx,yy;

 if(obj==undefined)       { return false; }
 if(obj.type!="tflow")    { return false; }
 if(obj.is_started!=true) { return false; }

 while(1)
  {
  switch(obj.stage)
   {
   case 100:
   obj.fm=new FaceMesh({locateFile:(file)=>{ return "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/"+file; }});
   obj.fm.setOptions({
                      maxNumFaces:1,
                      refineLandmarks:false,//true,
                      cameraNear:false,
                      cameraFar:false,
                      cameraVerticalFovDegrees:0.0,
                      minDetectionConfidence:0.5,
                      minTrackingConfidence:0.5,
                      selfieMode:false,
                      useCpuInference:false,
                      enableFaceGeometry:false
                      });
   obj.fm.onResults(function (xxx) { tflowOnResults(obj,xxx); } );
   obj.stage=110;
   break;




   case 110:
   boy=app.tflow.obj_ray[0];

   if(boy.o_queue.length>0)
    {
    ooo=boy.o_queue.shift();
    vas=ooo.image;
    if((cgrp=aa.guiGroupGetById("b_canstream_0"))==null) alert("ddd");
    //aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,160,120,vas);
    aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,null,null,vas);

    /*
    if(ooo.multiFaceLandmarks.length>0)
     {
     mark=tflowLandMarksGet("oval");
     for(mm=0;mm<mark.length;mm++)
      {
      lan=ooo.multiFaceLandmarks[0][mark[mm]];
      //if(mm==0)       {       cgrp.ctx.moveTo(lan.x*320,lan.y*320);       }
      //else            {       cgrp.ctx.lineTo(lan.x*320,lan.y*320);       }
      xx=lan.x*cfg_vid_wid;
      yy=lan.y*cfg_vid_hit;
      aa.guiCanvasFill(cgrp.obj.han,xx-1,yy-1,2,2,aa.guiRgbaString(200,52,199,1));
      }
     }
    mediaVideoAddVadColor(cgrp,cfg_vid_wid,cfg_vid_hit);
    */

    if(ooo.multiFaceLandmarks.length>0)
     {
     mark=tflowLandMarksGet("oval");
     aa.guiCanvasSave(cgrp.obj.han);
     aa.guiCanvasPathBegin(cgrp.obj.han);

     for(mm=0;mm<mark.length;mm++)
      {
      lan=ooo.multiFaceLandmarks[0][mark[mm]];
      //if(mm==0)       {       cgrp.ctx.moveTo(lan.x*320,lan.y*320);       }
      //else            {       cgrp.ctx.lineTo(lan.x*320,lan.y*320);       }
      xx=lan.x*cfg_vid_wid;
      yy=lan.y*cfg_vid_hit;
      //.guiCanvasFill(cgrp.obj.han,xx-1,yy-1,2,2,aa.guiRgbaString(200,52,199,1));
      if(mm==0)       {       cgrp.ctx.moveTo(xx,yy); } //lan.x*320,lan.y*320);       }
      else            {       cgrp.ctx.lineTo(xx,yy); } //lan.x*320,lan.y*320);       }
      }
     aa.guiCanvasClip(cgrp.obj.han);
     aa.guiCanvasFillFull(cgrp.obj.han,aa.guiRgbaString(200,52,199,1));
     aa.guiCanvasPathEnd(cgrp.obj.han);
     aa.guiCanvasRestore(cgrp.obj.han);
     }
    mediaVideoAddVadColor(cgrp,cfg_vid_wid,cfg_vid_hit);



    /**
    if(ooo.multiFaceLandmarks.length>0)
     {
     mark=tflowLandMarksGet("oval");
     aa.guiCanvasSave(cgrp.obj.han);
     aa.guiCanvasPathBegin(cgrp.obj.han);
     for(mm=0;mm<mark.length;mm++)
      {
      lan=ooo.multiFaceLandmarks[0][mark[mm]];
      if(mm==0)       {       cgrp.ctx.moveTo(lan.x*320,lan.y*320);       }
      else            {       cgrp.ctx.lineTo(lan.x*320,lan.y*320);       }
      //aa.guiCanvasFill(cgrp.obj.han,(lan.x*320),(lan.y*320),2,2,aa.guiRgbaString(200,52,199,1));
      }
//   aa.guiCanvasCompositeOperationSet(cgrp.obj.han,"destination-out");
     aa.guiCanvasClip(cgrp.obj.han);
     aa.guiCanvasFillFull(cgrp.obj.han,aa.guiRgbaString(200,52,199,1));
     //aa.guiCanvasImageDraw(cgrp.obj.han,null,null,null,null,0,0,null,null,vas);
     aa.guiCanvasPathEnd(cgrp.obj.han);
     aa.guiCanvasRestore(cgrp.obj.han);
     //aa.guiCanvasCompositeOperationSet(cgrp.obj.han,0);
     for(ii=0;ii<478;ii++)
      {
      lan=ooo.multiFaceLandmarks[0][ii];
      //aa.guiCanvasFill(cgrp.obj.han,(lan.x*320),(lan.y*320),2,2,aa.guiRgbaString(200,52,199,1));
      }
     }
    */
    }


   if(obj.is_waitin==false)
    {
    if(boy.i_queue.length>0)
     {
     aaa=boy.i_queue.shift();
     obj.is_waitin=true;
     app.tfl.fm.send({image:aaa.vframe});
     }
    }
   break;


   case 666:
   break;
   }
  break;
  }
 }






 function tflowOnResults (obj,results)
 {
 var tfo,io;
 if(obj.type!="tflow") { aa.debugAlert("eea2"); }

 tfo=app.tflow.obj_ray[obj.self_index];
 //if(obj.is_waitin!=true) { aa.debugAlert(); }
 obj.is_waitin=false;
 tfo.o_queue.push(results);
 }





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


//---------------------------------------------------------



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
  //grpc=aa.guiGroupGet(aa.guiIdFind("b_canstream_"+g));
  //grpc=aa.guiGroupGet(aa.guiIdFind("b_canstream_"+g));
  //b_canstream_0
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
  //alert("aa prom not null "+beamobj.prom);
  //console.log("!!!!!!!!!!");
  //console.log("aa prom not null "+beamobj.prom);
  //console.log("!!!!!!!!!!");
  }
 //console.log("beam videoAttach about to PLAY!!!!!!!!!!");
 //console.log("pre prom="+beamobj.prom);
 beamobj.prom=grp.dom.play();
 ///console.log("post prom="+beamobj.prom);
 if(beamobj.prom!==undefined);
  {
  beamobj.prom.then(()=>
   {
   //console.log("beam PLAY ok!!!!!!!!!!!!!!!");
   //alert("beam PLAY ok!!!!!!!!!!!!!!!");
   beamobj.prom=null;
   })
  .catch(error=>
   {
   //console.log("beam PLAY err!!!!!!!!!!!!!!",error);
   //alert("beam PLAY err!!!!!!!!!!!!!!",error);
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
    //grpo=aa.guiGroupGet(aa.guiIdFind("b_overlay_"+idx));
    g=peerobj.self_index;
    grp=aa.guiGroupGet(aa.guiIdFind("b_video_"+g));
    grpc=aa.guiGroupGet(aa.guiIdFind("cst_"+g));
    //grp=app.beam["vid_"+g];
    //grpc=app.beam["cst_"+g];
    if(grpc!=null)
     {
     ///console.log("B_CANSTREAM_"+g+"  force grpc.vars.rtc_handle=0").
     grpc.vars.rtc_handle=0;
     }
    }
   rtc.gui_id=null;
   }
  ///console.log("video unattach "+pid+"  RTC DESTROY "+peerobj.rtc_handle);
  aa.rtcDestroy(peerobj.rtc_handle);
  peerobj.rtc_handle=0;
///  grp.vars.rtc_handle=0;
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
 var pkt,msg,p,uid,peerobj,po,peer,etc,k;

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
  if((po=beamPeerNext(beamobj))!=null)
   {
   //console.log("poooooooooooooooooooooo");
   //console.log(po);
   beamPeerYield(beamobj,po.self_index);
   }
  pkt=clientRtcsigRead(beamobj.rtcsig_cli);
  if(pkt==null||pkt==false) { break; }

     //console.log(pkt);
  switch(pkt.cmd)
   {
   default:
   aa.debugAlert("unknown cmd="+pkt.cmd);
   break;


   case "said":
   ///console.log(pkt);
   //console.log("said "+pkt.uuid);
   peer=beamPeerById(beamobj,pkt.uuid);
   if(peer==null) { break; }
   //console.log(pkt);
      //console.log(jsn);
   //console.log("peerok ");
   if(pkt.msg_func=="chat")
    {
    //console.log("CHAT");
    etc=JSON.parse(pkt.msg_data);
    ///alert(etc);
    //console.log(etc);
    //console.log(etc.txt);
    //console.log(JSON.stringify(etc,0,2));
    if(app.vlog)   {    aa.virtualLogSet(app.vlog,0,app.vlog.num_lines-1,etc.txt);     }
    //console.log(etc.interim);
    break;
    }

   //console.log("got peer",pkt);
   //console.log("me ="+beamobj.my_id+" targ="+pkt.from);
   aa.queueWrite(peer.r_queue_handle,pkt);
   peer.r_queue_status=aa.queueStatus(peer.r_queue_handle);
   //etc=JSON.parse(pkt.msg_data);
   //console.log(etc);
   //console.log("said");
   //console.log(pkt);
   break;

   case "joined":
   ///console.log(pkt);
   //guixWidgetChatLogLog(app.guix.widget_chatlog,"jsn2.cmd="+jsn.cmd);
   beamReadJoined(beamobj,pkt);
   break;

   case "left":
   ///console.log(pkt);
   //guixWidgetChatLogLog(app.guix.widget_chatlog,"jsn2.cmd="+jsn.cmd);
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

/// if(beamobj.is_ready!=true) { aa.debugAlert(); }
 //console.log("peer yield "+peerindex);
// console.log(peerobj);

 switch(peerobj.phaze)
  {
  case 0:
  peerobj.phaze=100;
  break;

  case 66:
  case 666:
  break;





                case 100: // creation of individual WebRtc connections
                //console.log("dif=",peerobj.id_dif);
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
        //console.log("sssssssss@@@@@@@@@@@@@@@");
        pkt=beamPeek(beamobj,peerobj.id);
        if(pkt==null||pkt==false) { break; }
        console.log("got 200",pkt);
        beamDiscard(beamobj,peerobj.id);
        break;









                case 400:
                console.log("400");
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
                //console.log("460",pkt);
                //console.log("460",pkt.func_name);
                msg=JSON.parse(pkt.msg_data);
                           //console.log(msg);
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
                //console.log("got desc rem");
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
           //console.log(msg);
           aa.rtcDescRemoteSet(peerobj.rtc_handle,msg.offer);
           peerobj.phaze=610;
           break;




           case 610:
           if(beamWaitDescRemoteSet(beamobj,peerobj)==false) { break;  }
           peerobj.phaze=620;
           break;





           case 620:
           aa.rtcAnswerCreate(peerobj.rtc_handle);
           peerobj.phaze=630;
           break;


           case 630:
           if(beamWaitAnswerCreate(beamobj,peerobj)===false) { break; }
           peerobj.phaze=645;
           break;



           case 645:
           if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }


       ///if(cfg_sdp_manip==true)  {     rtc.answer.sdp=aa.mediaSdpManipulate(rtc.answer.sdp,cfg_sdp_sbool,cfg_sdp_max_arate,cfg_sdp_max_vrate);            }
           aa.rtcDescLocalSet(peerobj.rtc_handle,rtc.answer);
           peerobj.phaze=647;
           break;




           case 647:
           if(beamWaitDescLocalSet(beamobj,peerobj)==false) { break;  }
           peerobj.phaze=720;
           break;



           case 720:
           if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }

                etc={};
                etc.is_true=true;
                etc.answer=rtc.answer;
                clientRtcsigWrite(beamobj.rtcsig_cli,peerobj.id,"answer",JSON.stringify(etc));

           ///beamWrite(beamobj,"say","aakak",peerobj.id,"answer",true,rtc.answer);
           peerobj.phaze=900;
           break;






           case 900:
           status=aa.rtcStatus(peerobj.rtc_handle);
           if(status.in_promise==true) {   aa.debugAlert("fef"); }
           peerobj.phaze=1000;
           break;






                case 1000:  // icey
                while(1)
                 {
                 pkt=beamPeek(beamobj,peerobj.id)
                 if(pkt==null||pkt==false) { break; }
                 //console.log("1000",pkt);
                 msg=JSON.parse(pkt.msg_data);
                 if(pkt.msg_func=="ice")
                  {
                  if(msg.ice==".")
                   {
                   //console.log("dot");
                   peerobj.rvcd_final_ice=true;
                   }
                  else
                   {
                   //console.log("ice");
                   xxx=msg.ice;
                   aa.rtcIceCandidateAdd(peerobj.rtc_handle,xxx);
                   }
                  }
                 else
                  {
                  console.log("3191");
                  console.log(pkt);
                  //alert("Ferfewww "+pkt.msg_func);
                  //console.log("other");
                  //aa.debugLogger(0,"xxxxxxxxxx "+msg.funcname);
                  }
                 beamDiscard(beamobj,peerobj.id);
                 break;
                 }
                status=aa.rtcStatus(peerobj.rtc_handle);
                if(status.in_promise==true) {      peerobj.phaze=1010;   break; }


                if(peerobj.sent_final_ice==false)
                 {
                 if((ice=aa.rtcIceCandidateGet(peerobj.rtc_handle))!=null)
                  {
                  if(ice==".")                   {                   peerobj.sent_final_ice=true;              }
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
                peerobj.phaze=1000;
                break;









                case 1200: // wait for remote stream
                if((rtc=aa.rtcGet(peerobj.rtc_handle))==null) { aa.debugAlert("rtcget"); }
                status=aa.rtcStatus(peerobj.rtc_handle);
                //console.log(rtc);
                //console.log(status);
                 //console.log(rtc.gui_id,rtc.rem_stream);
                 //console.log(peerobj);
                if(rtc.gui_id==null&&rtc.rem_stream!=null)  {    peerobj.phaze=1300;        break;                 }
                if(rtc.gui_id!=null) { aa.debugLogger(0,"guiid !=null = "+rtc.gui_id);  break;     }
                break;






                            case 1300: // attach to unused video element
                            //console.log("1300");
                            //console.log(peerobj);
                            beamPeerVideoAttach(beamobj,peerobj);
                            //grp=app.beam["vid_"+peerobj.self_index];
                            grp=aa.guiGroupGet(aa.guiIdFind("b_video_"+peerobj.self_index));
                            //aa.debugLogger(0,"attach to "+grp.obj.id);
                            //aa.debugLogger(0,"v wh="+grp.dom.videoWidth+"  "+grp.dom.videoHeight);
                            //aa.debugLogger(0,"wh="+grp.dom.width+"  "+grp.dom.height);



                            if(app.media.active_devenu.aud_output_list.length>app.media.cur_axo)
                             {
                             grp.dom.setSinkId(mediaDeviceGet("audiooutput",0).deviceId);
                             ///grp.dom.setSinkId(app.media.active_devenu.aud_output_list[0].deviceId);
                             //console.log(grp);
                             //console.log("...... "+app.media.active_devenu.aud_output_list.length);
                             //console.log("cur axo ="+app.media.cur_axo);
                             //console.log("max="+app.media.active_devenu.aud_output_list.length);
                             //console.log("id="+app.media.active_devenu.aud_output_list[app.media.cur_axo].deviceId);
                             //grp.dom.setSinkId(app.media.active_devenu.aud_output_list[app.media.cur_axo].deviceId);
                             }


                            beamCountSet(beamobj,beamobj.peer_count,beamobj.peer_count_connected+1);

                ///aa.rtcBitrateChange(peerobj.rtc_handle,cfg_sdp_use_arate,cfg_sdp_use_vrate);

                ///aa.rtcBitrateChange(peerobj.rtc_handle,0,32);

                    //aa.rtcBitrateChange(peerobj.rtc_handle,"audio",cfg_sdp_use_arate);
                                         peerobj.phaze=2000;
                                         peerobj.phaze=1350;
//                            console.log("established");
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
                      console.log(pkt);
                      beamDiscard(beamobj,peerobj.id);
                      status=aa.rtcStatus(peerobj.rtc_handle);
                      }
                     peerobj.cycle++;
                     break;

  }
 }





