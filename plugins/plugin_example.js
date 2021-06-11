
function pluginEntry ()
 {
 var _pluginTable=
  {
  name:"example_plugin",
  author:"ashod",
  pluginStart:_pluginStart,
  pluginStop:_pluginStop,
  pluginTest:pluginTest,
  };


/*-----------------------------------------------------------------------*/


 function _pluginStart ()
 {
 if(Object.keys(_pluginTable.obj).length>0) { return true; }
 _pluginTable.obj.is_init=true;
 return true;
 }



 function _pluginStop ()
 {
 if(Object.keys(_pluginTable.obj).length==0) { return true; }
 return true;
 }


/*-----------------------------------------------------------------------*/


 function pluginTest ()
 {
 alert("hello from plugin");
 }


/*-----------------------------------------------------------------------*/



 return(_pluginTable);
 }














