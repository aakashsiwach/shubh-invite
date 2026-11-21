(function(){
"use strict";
var catalog=window.SHUBH_TEMPLATES||[],canvas=document.getElementById("invitation"),ctx=canvas.getContext("2d"),form=document.getElementById("video-form"),status=document.getElementById("status"),button=document.getElementById("export"),select=document.getElementById("template");
var fields=["names","heading","date","venue","message"],current=catalog[0],start=performance.now(),duration=12000;
var paletteMap={
maroon:["#5A0F17","#3D0A10","#D9AE5F","#F6E7C8"],rose:["#6B1838","#470F25","#E9B872","#FCEBEF"],royal:["#13284F","#0B1A36","#D9AE5F","#EEF2FA"],emerald:["#163E2C","#0D2A1D","#E2B65E","#F1F6EE"],saffron:["#7A2E0B","#521D05","#F4C04E","#FFF3E2"],blush:["#8E3B5E","#6A2846","#FFD6A5","#FFF4F8"],sky:["#1F4E79","#143657","#FFD66B","#F2F8FD"],party:["#4B1D6B","#30104A","#FFC93C","#FBF5FF"],night:["#151515","#0A0A0A","#D8B26E","#F5F1EA"],sunset:["#C0392B","#7A1E12","#FFD166","#FFF3E8"],fiesta:["#A21367","#6E0B45","#FFC93C","#FFF0F7"],tropical:["#0E7C7B","#064E4D","#FF8C66","#EAFBFA"],grape:["#6D28D9","#4A1799","#FDE047","#F5EEFF"],ivory:["#F6ECD6","#EADCBD","#B07E2E","#5A3A12"],pearl:["#F7F3F0","#ECE4DE","#A9857B","#4A3B36"],redcream:["#FCEFE4","#F5DFCF","#B0303A","#8A2230"]};
function val(id){return document.getElementById(id).value.trim()}
function colors(){return paletteMap[(current&&current.config.palette)||"maroon"]||paletteMap.maroon}
function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.stroke()}
function wrap(text,x,y,maxWidth,lineHeight,maxLines){var words=String(text||"").split(/\s+/),line="",n=0;words.forEach(function(word){var test=line?line+" "+word:word;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y+n*lineHeight);n++;line=word}else line=test});if(line&&n<maxLines)ctx.fillText(line,x,y+n*lineHeight)}
function draw(now){
var c=colors(),t=(now-start)/1000,w=canvas.width,h=canvas.height;
var grad=ctx.createLinearGradient(0,0,w,h);grad.addColorStop(0,c[0]);grad.addColorStop(1,c[1]);ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
var glow=ctx.createRadialGradient(w/2,h*.38,20,w/2,h*.38,650);glow.addColorStop(0,c[2]+"44");glow.addColorStop(1,"transparent");ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
ctx.strokeStyle=c[2];ctx.globalAlpha=.8;ctx.lineWidth=3;rounded(35,35,w-70,h-70,250);ctx.globalAlpha=.22;rounded(52,52,w-104,h-104,235);ctx.globalAlpha=1;
ctx.save();ctx.translate(w/2,h*.34);ctx.strokeStyle=c[2];ctx.globalAlpha=.2;ctx.lineWidth=2;for(var k=0;k<24;k++){ctx.rotate(Math.PI/12);ctx.beginPath();ctx.ellipse(0,-170,34,145,0,0,Math.PI*2);ctx.stroke()}ctx.restore();ctx.globalAlpha=1;
for(var i=0;i<18;i++){var x=(i*137+Math.sin(t*.8+i)*28)%w,y=((i*211+t*(45+i%4*12))%(h+80))-40;ctx.save();ctx.translate(x,y);ctx.rotate(t*.8+i);ctx.fillStyle=i%2?c[2]:"#f3b5a1";ctx.globalAlpha=.65;ctx.beginPath();ctx.ellipse(0,0,6,13,0,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.globalAlpha=1;
var fade=Math.min(1,t/.9);ctx.globalAlpha=fade;ctx.textAlign="center";ctx.fillStyle=c[2];ctx.font="bold 23px Georgia";ctx.fillText("॥ शुभ ॥",w/2,220);
ctx.fillStyle=c[3];ctx.font="italic 32px Georgia";wrap(val("heading"),w/2,340,570,42,2);
ctx.fillStyle=c[2];ctx.font="64px Georgia";wrap(val("names"),w/2,520,590,76,2);
ctx.strokeStyle=c[2];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(150,650);ctx.lineTo(w-150,650);ctx.stroke();
ctx.fillStyle=c[3];ctx.font="27px Georgia";wrap(val("message"),w/2,730,500,40,3);
ctx.fillStyle=c[2];ctx.font="bold 28px Georgia";wrap(val("date"),w/2,930,540,40,2);
ctx.fillStyle=c[3];ctx.font="26px Georgia";wrap(val("venue"),w/2,1040,540,38,2);
ctx.fillStyle=c[2];ctx.font="20px Georgia";ctx.fillText("WITH LOVE & BLESSINGS",w/2,1160);
ctx.globalAlpha=1;
}
function loop(now){draw(now);requestAnimationFrame(loop)}
function populate(){catalog.forEach(function(t){var o=document.createElement("option");o.value=t.id;o.textContent=t.name+" · "+t.category;select.appendChild(o)});var id=new URLSearchParams(location.search).get("template");if(id&&catalog.some(function(t){return t.id===id}))select.value=id;choose()}
function choose(){current=catalog.find(function(t){return t.id===select.value})||catalog[0];if(!current)return;document.getElementById("heading").value=current.config.type==="wedding"?"Shubh Vivah":current.name;draw(performance.now())}
select.addEventListener("change",choose);fields.forEach(function(id){document.getElementById(id).addEventListener("input",function(){draw(performance.now())})});
document.getElementById("reset").addEventListener("click",function(){document.getElementById("names").value="Aarav & Ananya";document.getElementById("heading").value=current.name;document.getElementById("date").value="Sunday · 14 February 2027 · 7 PM";document.getElementById("venue").value="The Royal Palace · Jaipur";document.getElementById("message").value="Together with our families, we invite you to celebrate this special day.";draw(performance.now())});
form.addEventListener("submit",function(e){e.preventDefault();if(!window.MediaRecorder||!canvas.captureStream){status.textContent="Video recording is not supported in this browser. Try an up-to-date Chrome or Edge browser.";return}
var mime=["video/mp4;codecs=avc1.42E01E","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(function(m){return MediaRecorder.isTypeSupported(m)});if(!mime){status.textContent="This browser does not expose a supported MP4 or WebM recording format.";return}
button.disabled=true;status.textContent="Rendering your 12-second invitation… keep this tab open.";
var stream=canvas.captureStream(30),recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5000000}),chunks=[],recordStart=performance.now();
recorder.ondataavailable=function(ev){if(ev.data&&ev.data.size)chunks.push(ev.data)};
recorder.onerror=function(){button.disabled=false;status.textContent="Recording failed. Please try another browser."};
recorder.onstop=function(){stream.getTracks().forEach(function(track){track.stop()});var blob=new Blob(chunks,{type:mime}),url=URL.createObjectURL(blob),ext=mime.indexOf("mp4")>=0?"mp4":"webm",a=document.createElement("a");a.href=url;a.download="shubh-nimantran-"+current.id+"."+ext;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},60000);button.disabled=false;status.textContent="Your "+ext.toUpperCase()+" invitation video is ready. It was generated locally on your device."};
recorder.start(250);function frame(now){draw(now);if(now-recordStart>=duration){recorder.stop();return}requestAnimationFrame(frame)}requestAnimationFrame(frame)
});
populate();requestAnimationFrame(loop);
})();