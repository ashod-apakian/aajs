//---------------------------------------------------------

 var cfg_app_version="0.01";
 var cfg_app_speed=30;

 window.onload=function()  {  aa.mainStart(cfg_app_version,cfg_app_speed,appProc);  aa.mainRun();  };

 var app=aa.main_vars.app;

//---------------------------------------------------------

 function appYield ()
 {
 if(app.cpu_speed==0)  { app.cpu_speed=aa.envCpuMonitorGet();  }
 }



 function appProc ()
 {
 switch(aa.main_state.stage)
  {
  case 0:
  app.cpu_speed=0;
  app.ei=aa.envInfoGet();
  aa.envCpuMonitorBegin(8);
  aa.mainStageSet(20);
  break;

  case 20:
  if(app.cpu_speed==0) { break; }
  aa.debugLog("cpu speed="+app.cpu_speed+" took "+aa.timerMsRunning()+"ms to analyze");
  aa.mainStageSet(40);
  break;
  }
 appYield();
 }



