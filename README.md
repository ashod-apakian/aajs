# aajs
A JavaScript library for Canvas, WebRtc, Media, Data Structures and much more


# Catagories

[Main](#main)\
[Handles](#handles)\
[Debug](#debug)\
[Promises](#promises)\
[Time](#time)\
[Numeric](#numeric)\
[Data](#data)\
[String](#string)\
[Environment](#environment)\
[Queue](#queue)\
[Touch](#touch)\
[Mouse](#mouse)\
[Pointer](#pointer)\
[Keyboard](#keyboard)\
[Storage](#storage)\
[GuiCanvas](#guicanvas)\
[Media](#media)\
[WebSocket](#websocket)\
[Room](#room)\
[Dsp](#dsp)\
[BioIO](#bitio)\
[WebRtc](#webrtc)



# Main

 function mainObjInit ()\
 function mainStart (ver,spd,mainproc,dturl)\
 function mainDethrottle ()\
 function mainWorkerAdd (name,proc,step)\
 function mainWorkerRemove (name)\
 function mainWorkerStep ()\
 function mainProc ()\
 function mainRun ()\
 function mainProcSet (proc)\
 function mainSpeedSet (speed)\
 function mainStageAdjust (by)\
 function mainStageSet (stage)\
 function mainStageGet ()\
 function mainCycleGet ()\
 function mainCyclePulse (stride)\
[Back to Top](#catagories)

# Handles

 function handleObjInit ()\
 function handleDefine (type,slots)\
 function handleCheck (handef,handle)\
 function handleReset (handef,handle)\
 function handleGet (handef,index)\
 function handleUse (handef,index)\
 function handleRemove (handef,handle)\
 function handleNext (handef)\
 function handleText (handle)\
 function handleGlobalDump ()\
[Back to Top](#catagories)

# Debug

 function debugObjInit ()\
 function debugLineNumber ()\
 function debugFunctionName ()\
 function debugStackUsage ()\
 function debugStackGet (index)\
 function debugAlert (txt)\
 function debugLog (...params)\
[Back to Top](#catagories)

# Promises

 function promiseObjInit ()\
 function promiseCreate (nativepromise)\
 function promiseDestroy (handle)\
 function promiseGet (handle)\
 function promiseStatus (handle)\
[Back to Top](#catagories)


# Time

 function timerObjInit ()\
 function timerTikNow (useperf)\
 function timerTikElapsed (useperf,tik)\
 function timerMsRunning ()\
 function timerMicroRunning ()\
 function timerTimeoutSet (to)\
 function timerTimeoutReset (tmo,newto)\
 function timerTimeoutTest (tmo)\
[Back to Top](#catagories)

# Numeric

 function numObjInit ()\
 function numRand (max)\
 function numFixed (numb,places)\
 function numPercentOf (numb,tot)\
 function numPercentIs (numb,tot)\
 function numPad(numb,width,z)\
 function numIntToHex(intg)\
 function numRound(numb,precision)\
 function numFloatFormat (numb,wholewid,pad,isps,fracwid)\
[Back to Top](#catagories)

# Data

 function dataObjInit ()\
 function dataArray2DCreate (rows)\
 function dataObjectApxSize (object)\
 function dataGlobalExists (varname)\
 function dataGlobalPropertiesGet (prefix)\
 function dataObjectIsEmpty (obj)\
 function dataObjectIsUndefined (obj)\
 function dataValueIsEmpty (val)\
 function dataValueIsNotEmpty (val)\
 function dataArrayRotate (arr,reverse)\
 function dataArrayUniqueCount (arr)\
 function dataFloat32ArrayToUint8Array (array)\
 function dataUint8ArrayToFloat32Array (array)\
 function dataFloat32ArrayToInt16Array (array)\
 function dataInt16ArrayToFloat32Array (array)\
 function dataInt16ArrayToUint8Array (array)\
 function dataUint8ArrayToInt16Array (array)\
[Back to Top](#catagories)

# String

 function stringObjInit ()\
 function stringIndexOf (cs,str,mat,from)\
 function stringLastCharGet (str)\
 function stringLastCharTrim (str)\
 function stringFirstCharGet (str)\
 function stringFirstCharTrim (str)\
 function stringSha256 (str)\
 function stringBase64FromUint8 (buffer)\
 function stringBase64ToUint8 (str)\
 function stringSplitter (str,by)\
 function stringTime (unixtimestamp)\
[Back to Top](#catagories)

# Environment

 function envObjInit ()\
 function envInfoGet ()\
 function envBrowserArg (key)\
 function envEventProc (event)\
 function envListenEvents (proc)\
 function envDisplayGet ()\
 function envDisplayCompare (disp,lastdisp)\
 function envZoomFix()\
 function envTitleSet (title)\
 function envTitleGet ()\
 function envReload (forced,ms)\
 function envFavIconGet ()\
 function envFavIconSet (url)\
[Back to Top](#catagories)

# Queue

 function queueObjInit ()\
 function queueCreate ()\
 function queueDestroy (handle)\
 function queueGet (handle)\
 function queueWrite (handle,data)\
 function queueRead (handle)\
 function queuePeek (handle,ofs)\
 function queueDiscard (handle)\
 function queueStatus (handle)\
[Back to Top](#catagories)

# Touch

 function touchObjInit ()\
 function touchStart ()\
 function touchPeek (ofs)\
 function touchRead ()\
 function touchProcess (msg)\
 function touchStatus ()\
[Back to Top](#catagories)

# Mouse

 function mouseObjInit ()\
 function mouseStart ()\
 function mouseOnEvent (name,ev)\
 function mousePeek (ofs)\
 function mouseRead ()\
 function mouseStatus ()\
 function mouseCursorGet ()\
 function mouseCursorSet (style)\
[Back to Top](#catagories)
 
# Pointer

 function pointerObjInit ()\
 function pointerStart ()\
 function pointerOnEvent (name,ev)\
 function pointerPeek (ofs)\
 function pointerRead ()\
 function pointerStatus ()\
[Back to Top](#catagories)

# Keyboard

 function keyboardObjInit ()\
 function keyboardStart ()\
 function keyboardOnEvent (name,ev)\
 function keyboardPeek (ofs)\
 function keyboardRead ()\
 function keyboardStatus ()\
[Back to Top](#catagories)

# Storage

 function storageObjInit ()\
 function storageCreate (issesh)\
 function storageDestroy (handle)\
 function storageGet (handle)\
 function storagePurge (handle)\
 function storageRead (handle,key)\
 function storageWrite (handle,key,val)\
 function storageRemove (handle,key)\
 function storageTuple (handle,index)\
 function storageStatus (handle)\
[Back to Top](#catagories)

# GuiCanvas

 function guiObjInit ()\
 function guiCreate (type)\
 function guiDestroy (handle)\
 function guiGet (handle,what)\
 function guiGroupGet (handle)\
 function guiIdSet (handle,id)\
 function guiParentSet (handle,phandle)\
 function guiSizeSet (handle,wid,hit)\
 function guiCssAreaSet (handle,x,y,w,h)\
 function guiSizeFix (handle,x,y,wid,hit)\
 function guiCanvasClear (handle,full)\
 function guiCanvasReset (handle)\
 function guiCanvasSmoothingSet (handle,state,offx,offy,blur,color)\
 function guiCanvasTextMeasure (handle,txt)\
 function guiCanvasImageGet (handle,x,y,w,h)\
 function guiCanvasImagePut (handle,x,y,sx,sy,sw,sh,img)\
 function guiCanvasImageDraw (handle,x,y,w,h,dx,dy,dw,dh,dest)\
 function guiCanvasBorder (handle,x,y,w,h,blw,bcl)\
 function guiCanvasFill (handle,x,y,w,h,fcl)\
 function guiCanvasLine (handle,x1,y1,x2,y2,lw,cl)\
 function guiCanvasFontSet (handle,font)\
 function guiCanvasText (handle,x,y,slw,sc,fc,font,text)\
 function guiCanvasRounded (handle,x,y,w,h,radius,lw,bc,fc)\
 function guiCssDisplaySet (handle,pos,zindex,opacity,display)\
 function guiCssOutlineSet (handle,pixels,rgba)\
 function guiRectsGet (handle)\
 function guiEaseInit (type,start,dest,duration)\
 function guiEaseProcess (ez)\
 function guiRgbaString (r,g,b,a)\
 function guiRgbaStringCommon (index)\
 function guiRectSet (x,y,w,h)\
 function guiRectAdjust (rec,xa,ya,wa,ha)\
 function guiAreaSet (l,t,w,h)\
 function guiAreaAdjust (area,la,ta,wa,ha)\
 function guiRgbaSet (r,g,b,a)\
 function guiRgbaAdjust (rgba,ra,ga,ba,aa)\
 function guiRgbaToString (rgba)\
[Back to Top](#catagories)

# Media

 function mediaObjInit ()\
 function mediaDeviceDetect ()\
 function mediaDeviceCountGet (kind)\
 function mediaDeviceGet (kind,index)\
 function mediaDeviceCapsGet (kind,index)\
 function mediaCreate (vconstraints,aconstraints)\
 function mediaDestroy (handle)\
 function mediaGet (handle)\
 function mediaAttach (handle,dhandle)\
 function mediaStatus (handle)\
[Back to Top](#catagories)

# WebSocket

 function socketObjInit ()\
 function socketCreate (url)\
 function socketDestroy (handle)\
 function socketGet (handle)\
 function socketWrite (handle,msg)\
 function socketPeek (handle,ofs)\
 function socketRead (handle)\
 function socketDiscard (handle)\
 function socketProcess (handle)\
 function socketStatus (handle)\
 function socketYield ()\
[Back to Top](#catagories)

# Room

 function roomObjInit ()\
 function roomCreate (maxpeers)\
 function roomDestroy (handle)\
 function roomGet (handle)\
 function roomSet (handle,name,myid,myalias)\
 function roomPeerJoin (handle,id,alias)\
 function roomPeerLeaving (handle,id)\
 function roomPeerLeave (handle,id)\
 function roomPeerNext (handle)\
 function roomPeerByAlias (handle,alias)\
 function roomPeerById (handle,id)\
 function roomPeerByIndex (handle,index)\
[Back to Top](#catagories)

# Dsp

 function dspObjInit ()\
 function dspAudioResample (sourceDataf32,sampleRate,srcSizeSampleCount,newSampleRate)\
 function dspSineWaveAt (rate,sampleNumber,tone)\
 function dspZigZag (size)\
 function dspGetBlock (rgbaframe,framewid,framehit,channel,blksize,blkx,blky,block)\
 function dspSetBlock (rgbaframe,framewid,framehit,channel,blksize,blkx,blky,block)\
[Back to Top](#catagories)

# BitIO

 function bitioObjInit ()\
 function bitioCreate ()\
 function bitioDestroy (handle)\
 function bitioGet (handle)\
 function bitioStatus (handle)\
 function bitioRead (handle)\
 function bitioWrite (handle,bits,val,prepend)\
[Back to Top](#catagories)

# WebRtc

 function rtcObjInit ()\
 function rtcCreate (config)\
 function rtcDestroy (handle)\
 function rtcGet (handle)\
 function rtcClearPromise (handle)\
 function rtcIsBusy (handle)\
 function rtcStatus (handle)\
 function rtcOnProc (pc,name,event)\
 function rtcCreateOffer (handle)\
 function rtcCreateAnswer (handle)\
 function rtcSetRemoteDesc (handle,desc)\
 function rtcSetLocalDesc (handle,desc)\
 function rtcAddIceCandidate (handle,candidate)\
 function rtcGetIceCandidate (handle)\
 function rtcFindDataChannel (handle,name)\
 function rtcOnData (handle,event)\
 function rtcCreateDataChannel (handle,name,mode)\
 function rtcAddDataChannel (handle,name,cdc)\
[Back to Top](#catagories)
