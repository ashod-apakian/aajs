<?php
error_reporting(E_ALL & ~E_NOTICE);
error_reporting(E_NONE);
$selflnk=(isset($_SERVER['HTTPS'])&&$_SERVER['HTTPS']==='on'?"https":"http")."://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
if(substr($selflnk,-1)=='/') { $selflnk=substr($selflnk,0,-1); }
if(1) { $vvv=round(microtime(true)*1000); } else  { $vvv=1000; }
if(1) { $yyy=round(microtime(true)*1000); } else  { $yyy=1000; }
$request=$_SERVER['REQUEST_URI'];
if(empty($_SERVER['HTTPS'])||$_SERVER['HTTPS']==="off") { header('HTTP/1.1 301 Moved Permanently'); header('Location: '.'https://'.$_SERVER['HTTP_HOST'].$request); exit; }
?>
<!doctype html>
<html lang='en'>
<head>
<title>XDosh Blog</title>
<meta     name='google'                 content='notranslate' />
<meta     name="viewport"               content="width=device-width, initial-scale=1,viewport-fit=cover" />
<meta     name='theme-color'            content='#ffff00'/>
<meta property='og:title'               content="XDosh">
<meta property='og:description'         content='XDosh blog'>
<meta property='og:image'               content='https://xdosh.com/gfx/xlogo200.png'>
<meta property='og:site_name'           content='XDosh'>
<meta property='og:type'                content='website'>
<meta     name='description'            content='XDosh blog'>
<meta     name='mobile-web-app-capable' content='yes'>
<meta     name='apple-mobile-web-app-capable'          content='yes'>
<meta     name='apple-mobile-web-app-status-bar-style' content='black-translucent'>
<link rel="shortcut icon"                    href="https://xdosh.com/gfx/favicon.ico">
<link rel='icon' type='image/ico'            href='https://xdosh.com/gfx/favicon.ico'>
<link rel='apple-touch-icon'                 href='https://xdosh.com/gfx/xlogo152.png'>
<link rel='apple-touch-icon' sizes='76x76'   href='https://xdosh.com/gfx/xlogo76.png'>
<link rel='apple-touch-icon' sizes='120x120' href='https://xdosh.com/gfx/xlogo120.png'>
<link rel='apple-touch-icon' sizes='152x152' href='https://xdosh.com/gfx/xlogo152.png'>
<meta http-equiv='cache-control' content='no-cache, must-revalidate, post-check=0, pre-check=0' >
<meta http-equiv='cache-control' content='max-age=0'>
<meta http-equiv='expires'       content='0'>
<meta http-equiv='expires'       content='Tue, 01 Jan 1980 1:00:00 GMT'>
<meta http-equiv='pragma'        content='no-cache'>
<!--  (orientation: landscape) -->
<style type="text/css">
.nocopy          { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;  }
.allcopy         { -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text;  }
@media (min-width: 310px) and (orientation: landscape)
                 {
html             { margin:0; padding:0; border:none;  background:#ffffff;  top:0px; left:0px; width:100%; height:100%; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; }
body             { padding-top: 50px;        padding-bottom: 40px;      }
.fixed-header    { top: 0;     width: 100%; position: fixed;  background: #ffffff;  padding: 1px 0 0 0; margin: 0 0px 0px 0;  color: #111;      }
.fixed-footer    { bottom: 0;  width: 100%; position: fixed;  background: #eaeaea;  margin: 0px 10px 0px 0px; padding: 2px 0 2px 0;  color: #222;  }
nav a            { color: #223;   text-decoration: none;   padding: 0px 6px 0px 0px;  margin: 0px;  display: inline-block;    }
a,a:visited      { font-size:30pt; color: blue;    text-decoration: none}
a:hover          { text-decoration: underline}
td               { border:none; font-family: consolas; }
img              { border:none; }
.crumba          { font-size:15pt; margin-left:10px; padding: 2px; font-family:arial;  border:1px solid red;  }
.crumbb          { font-size:15pt; margin-left:10px; padding: 2px; font-family:arial;  border:1px solid blue;  }
.fixed-footer a  { font-size:15pt; margin-left:25px; font-family:arial; }
h1               { font-size:23pt; }
p                { font-size:20pt; }
.tda a           { font-size:24pt; color: blue;    text-decoration: none}
.tdb a           { font-size:20pt; color: blue;    text-decoration: none}
.tdc a           { font-size:10pt; color: blue;    text-decoration: none}
textarea         { font-size:18pt; font-family: courier; font-weight: 600; border: 1px solid #000;  }
button           { font-size:18pt; }
.zlogo           { margin: 8px 0px 0px 0px; }
.ztable          { margin: 0px 0px 0px 20px; }
.container       { margin: 0px 40px 0px 40px; }//-webkit-user-select: auto; -moz-user-select: auto; -ms-user-select: auto;  }
                 }

@media (min-width: 310px) and (orientation: portrait)
                 {
html             { margin:0; padding:0; border:none;  background:#ffffff;   top:0px; left:0px; width:100%; height:100%; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; }
body             { padding-top: 60px;        padding-bottom: 40px;      }
.fixed-header    { top: 0;     width: 100%; position: fixed;  background: #ffffff;  padding: 1px 0;   color: #111;   font-size: 18pt;   font-family:Arial;    }
.fixed-footer    { bottom: 0;  width: 100%; position: fixed;  background: #eaeaea;  padding: 5px 0;  color: #222;   font-size: 18pt;   font-family:Arial;     }
nav a            { color: #223;   text-decoration: none;   padding: 0px 6px 0 0;  margin: 0px;  display: inline-block;    }
a,a:visited      { font-size:30pt; color: blue;    text-decoration: none}
a:hover          { text-decoration: underline}
td               { border:none; font-family: consolas; }
img              { border:none; }
.crumba          { font-size:15pt; margin-left:10px; padding: 2px;  font-family:arial; border:1px solid red; }
.crumbb          { font-size:15pt; margin-left:10px; padding: 2px;  font-family:arial; border:1px solid blue; }
.fixed-footer a  { font-size:15pt; margin-left:20px; font-family:arial;  }
h1               { font-size:23pt; }
p                { font-size:20pt; }
.tda a           { font-size:25pt; color: blue;    text-decoration: none}
.tdb a           { font-size:15pt; color: blue;    text-decoration: none}
.tdc a           { font-size:10pt; color: blue;    text-decoration: none}
textarea         { font-size:12pt; font-family: courier; font-weight: 600; border: 1px solid #000; }
.zlogo           { margin: 8px 0px 0px 10px; }
.ztable          { margin: 0px 0px 0px 0px; }
.container       { margin: 0px 40px 0px 40px; } // was 0 0 0 0
                 }

p code,li code             { background-color: #447aa5;   color:#fff;    white-space: pre-wrap;    padding: 5px;    border-radius: 5px;    font-size: 0.85rem;    box-shadow: 0 1px 3px rgba(0,0,0,0.1),0 1px 1px rgba(0,0,0,0.1),0 2px 1px -1px rgba(0,0,0,0.12)}
pre                        { background: white;       padding: 1rem}
pre code .special-num      {    color:#ffc292;}
pre code .string1          {    color:#A1E46D;}
pre code .string2          {    color:#a1c4cD;}
pre code .special1         {    color:#D6665D;}
pre code .special2         {    color:#36c6cD;}
pre code .special3         {    color:#f6c61D;}
pre code .special4         {    color:#c962cD;}
pre code .special-js       {    color:#6DE4D1;}
pre code .special-js-glob  {    color:#A1E46D;    font-weight:bold;}
pre code .special-comment  {    color:#aaa;}
pre code .special-js-meth  {    color:#E46D8A;}
pre code .special-html     {    color:#E4D95F;}
pre code .special-sql      {    color:#1D968C;}
pre code .special-php      {    color:#597EA7;}

</style>

<script type='text/javascript'>

 function readTextFile(file)
 {
 var rawFile=new XMLHttpRequest();
 rawFile.open("GET",file,false);
 rawFile.onreadystatechange=function()
  {
  if((rawFile.readyState===4)&&(rawFile.status===200||rawFile.status==0)) { alt=rawFile.responseText;     }
  }
 rawFile.send(null);
 }

 var strNum1= /\b([\d])(?=[^\w])/g,
     strReg1= /"(.*?)"/g,
     strReg2= /'(.*?)'/g,
     specialReg1= /\b(new|if|do|while|switch|for|foreach|in|continue|break)(?=[^\w])/g,
     specialReg2= /\b(function)(?=[^\w])/g,
     specialReg3= /\b(var|let)(?=[^\w])/g,
     specialReg4= /\b(true|false|undefined|null)(?=[^\w])/g,
     specialJsGlobReg= /\b(document|window|Array|String|Object|Number|\$)(?=[^\w])/g,
     specialJsReg= /\b(getElementsBy(TagName|ClassName|Name)|getElementById|typeof|instanceof)(?=[^\w])/g,
     specialMethReg= /\b(indexOf|match|replace|toString|length)(?=[^\w])/g,
     specialPhpReg= /\b(define|echo|print_r|var_dump)(?=[^\w])/g,
     specialCommentReg= /(\/\*.*\*\/)/g,
     inlineCommentReg= /(\/\/.*)/g;
 var htmlTagReg= /(&lt;[^\&]*&gt;)/g;

 function escapeHtml(unsafe)
 {
 return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;");
         //.replace(/"/g, "&quot;");
         //.replace(/'/g, "&#039;");
 }

 function repit (dolines,string)
 {
 var txt;
 //linu++;
 txt=""+linu;
 txt=txt.padStart(4)+"   ";
 //string=string+"\n";
 string=escapeHtml(string+"\n");
    parsed=string.replace(strReg1,'<span class="string1">"$1"</span>');
    parsed=parsed.replace(strReg2,"<span class=\"string2\">'$1'</span>");
    parsed=parsed.replace(strNum1,'<span class="special-num">$1</span>');
    parsed=parsed.replace(specialReg1,'<span class="special1">$1</span>');
    parsed=parsed.replace(specialReg2,'<span class="special2">$1</span>');
    parsed=parsed.replace(specialReg3,'<span class="special3">$1</span>');
    parsed=parsed.replace(specialReg4,'<span class="special4">$1</span>');
    parsed=parsed.replace(specialJsGlobReg,'<span class="special-js-glob">$1</span>');
    parsed=parsed.replace(specialJsReg,'<span class="special-js">$1</span>');
    parsed=parsed.replace(specialMethReg,'<span class="special-js-meth">$1</span>');
    parsed=parsed.replace(htmlTagReg,'<span class="special-html">$1</span>');
    parsed=parsed.replace(specialPhpReg,'<span class="special-php">$1</span>');
    parsed=parsed.replace(specialCommentReg,'<span class="special-comment">$1</span>');
    parsed=parsed.replace(inlineCommentReg,'<span class="special-comment">$1</span>');
  if(dolines)
   {
   parsed='<span class="nocopy" style="font-size: 80%; color:#3af;">'+txt+'</span>'+parsed;
   }
//}
 document.write(parsed);
 linu++;
 }

</script>

</head>
<body id="bodid">
<div class="fixed-header" style="border-bottom: 2px solid red; left:0px; top:0px; margin:0px; padding:0px;">

<div class="container">
<nav>
<table style="border-collapse: collapse; border-spacing: 0; border: none;"    >
<tr>
<td>
<a href="https://xdosh.com/blog"><img class="zlogo" src="https://xdosh.com/gfx/xlogo192.png" width="48" height="48" alt="XDosh Logo" style="padding: 0px 2px 2px 0;"></a>
</td>
</tr>
</table>
</nav>
</div>
</div>

<div class="container">
<main id="main" role="main">
<article>

<?php


 function showcode ($filename,$fromline)
 {
 if($fromline>=1) { $dol=1; }
 else             { $dol=0; }
 echo "<pre class='allcopy' style=\"background-color:#2b303b;color:#c0c5ce;\" >";
 echo "<code>";
 echo "<script type='text/javascript'>\n";
 echo "alt=null;\n";
 if($dol==0) echo "linu=0;\n";
 else        echo "linu=".$fromline.";\n";
 echo "var now = new Date;\n";
 echo "readTextFile(\"source/".$filename."?\"+now.getTime());\n";
 echo "var ry=alt.toString().split(\"\\n\");\n";
 echo "for(i=0;i<ry.length;i++) { repit(".$dol.",ry[i]); } ";
 echo "</script>";
 echo "</code>";
 echo "</pre>";
 }

 $the_subj="";
 $the_date="";
 $the_catt="";

 function showArticleInfo ($tit)
 {
 global $the_subj;
 global $the_date;
 global $the_catt;
 if($tit=="") { $tit=$the_subj; }
 echo "<script> document.title =\"".$tit." - XDosh Blog\";</script>";
 echo "<h3 style='font-family: consolas; color:#000080; border-bottom:2px solid #cccccc;'>".$the_subj.", ".$the_date."</h3>";
 }


 function getArticleInfo ($filename,$pre)
 {
 $line=0;
 $len=strlen($pre);
 $file=new SplFileObject($filename);
 while(!$file->eof())
  {
  $line=$file->fgets();
  $pos=strpos($line,$pre);
  if($pos>=0&&$pos!==false)
   {
   $subj=substr($line,$len+1);
   $pos=strpos($subj," -->");
   if($pos>=0&&$pos!==false) { $subj=substr($subj,0,$pos); return $subj; }
   }
  }
 $file=null;
 return "no-subject";
 }

 $req=substr($request,0,6);
 $pge=substr($request,6);
 if($pge=="") { $pge="1"; }
 if($pge==0)  { $pge=1;   }
 $opa=substr($request,6,7);
 if($req=="/blog/"&&$opa!="article")
 {
 $dd=scandir('../blog');
 $ar=array();
 $cnt=(int)count($dd);
 $frm=(int)($pge-1)*5;
 $too=$cnt;
 $num=0;
 $tot=0;
 for($ee=0;$ee<$cnt;$ee++)
  {
  $ext=substr(strrchr($dd[$ee],'.'),1);
  if($ext==false||$ext=="")  { continue; }
  if($ext!="php")            { continue; }
  $ext=substr($dd[$ee],0,7);
  if($ext!="article")        { continue; }
  $catt=getArticleInfo($dd[$ee],"<!-- cat:");
  if($catt=="none") {         continue; }
  $tot++;
  }
 $totpages=(int)($tot/5);
 if(((int)$tot%5)!=0) { $totpages++; }
 for($ee=0;$ee<$cnt;$ee++)
  {
  $ext=substr(strrchr($dd[$ee],'.'),1);
  if($ext==false||$ext=="")  { continue; }
  if($ext!="php")            { continue; }
  $ext=substr($dd[$ee],0,7);
  if($ext!="article")        { continue; }
  $catt=getArticleInfo($dd[$ee],"<!-- cat:");
  if($catt=="none") {         continue; }
  if($num<$frm)     { $num++; continue; }
  array_push($ar,$dd[$ee]);
  if(count($ar)>=5) { break; }
  }
 $ar=array_reverse($ar);
 echo "<br><table width=80% class='ztable' style=''>";
 for($ee=0;$ee<count($ar);$ee++)
  {
  $fn=$ar[$ee];
  $subj=getArticleInfo($fn,"<!-- subject:");
  $datt=getArticleInfo($fn,"<!-- date:");
  $catt=getArticleInfo($fn,"<!-- cat:");
  if($catt!="none")
   {
   $arty=substr($fn,0,strpos($fn,'.'));
   echo "<tr  style=''>";
   echo "<td class='tda' width=15% style='border-bottom:1px solid #aaaaaa;'><a href='".$arty."'>".$subj."</a></td>";
   echo "<td class='tdb' width=10% style='border-bottom:1px solid #aaaaaa;'><a href='".$arty."'>".$datt."</a></td>";
//   echo "<td class='tdc' width=5%  style='border-bottom:1px solid #aaaaaa;'><a href='".$arty."'>".$catt."</a></td>";
   echo "</tr>";
   }
  }
 echo "</table><br>\n";
 if($totpages>1)
  {
  echo "<table><tr>";
  for($i=0;$i<$totpages;$i++)
   {
   if(($i+1)==$pge) { echo "<td><a class='crumba' href='https://xdosh.com/blog/".($i+1)."'>".($i+1)."</a></td>";   }
   else             { echo "<td><a class='crumbb' href='https://xdosh.com/blog/".($i+1)."'>".($i+1)."</a></td>";   }
   }
  echo "</tr></table>";
  }
 }
else
 {
 $arty=substr(strrchr($request,'/'),1);
 $arto=$arty.".php";
 $subj=getArticleInfo($arto,"<!-- subject:");
 echo "<script type='text/javascript'>\n";
 echo "document.title=\"".$subj." - XDosh Blog\";\n";
 echo "</script>\n";
 $the_subj=getArticleInfo($arto,"<!-- subject:");
 $the_date=getArticleInfo($arto,"<!-- date:");
 $the_catt=getArticleInfo($arto,"<!-- cat:");
 include $arto;
 }
?>

</article>
</div>
<div class="fixed-footer" style="border-top: 2px solid red; left:0px; text-align: left;  ">
<a href='/'>&copy; <?php echo date("Y"); ?></a>
</div>
</main>
</body>
<script type='text/javascript'>
window.onbeforeunload = function () {  window.scrollTo(0, 0); }
</script>
</html>
