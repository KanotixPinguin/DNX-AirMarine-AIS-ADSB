(async function () {
// AUS: // AUS:   async function lp(n){ try{ if(window.Plugins && Plugins.load) await Plugins.load(n); }catch(e){} }
// AUS: await lp("utils");   /* v55: Funktion ist abgeschaltet, der Aufruf warf "lp is not defined" */
// AUS: await lp("notify");
// AUS: // AUS:   try { await Plugins.load("dnx_mode_colors"); } catch(e) {}
// AUS: // AUS:   try { await Plugins.load("dnx_matrix"); } catch(e) {}
// AUS: // AUS:   try { await Plugins.load("https://0xaf.github.io/openwebrxplus-plugins/receiver/freq_scanner/freq_scanner.js"); } catch(e) {}
})();




/* DNX_MOBILE_LAYOUT_HELPER_START */
(function(){
  if(window.__dnxIsMobileLayout) return;
  window.__dnxIsMobileLayout = function(){
    try{
      var narrow = !!(window.matchMedia && window.matchMedia("(max-width: 640px)").matches);
      var shortTouch = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches) &&
        (window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 0) <= 520;
      return narrow || shortTouch;
    }catch(e){ return (window.innerWidth || 0) <= 640; }
  };
})();
/* DNX_MOBILE_LAYOUT_HELPER_END */

/* DNX_AUTO_OPEN_PHOTO_DESC_START */
(function(){
  if(window.__dnxAutoOpenPhotoDesc) return;
  window.__dnxAutoOpenPhotoDesc = true;

  function isOpen(){
    var c = document.querySelector(".openwebrx-description-container");
    if(!c) return false;
    return c.classList.contains("expanded") || getComputedStyle(c).display !== "none";
  }

  function tryOpen(){
    try {
      if(window.localStorage.getItem("dnx.rxdetails.open") === "0") return false;
    } catch(e){}
    if(isOpen()) return true;

    var targets = [
      ".openwebrx-rx-details-arrow",
      ".openwebrx-photo-trigger",
      ".openwebrx-rx-details-arrow.openwebrx-photo-trigger",
      ".webrx-rx-texts.openwebrx-photo-trigger",
      ".openwebrx-top-container .openwebrx-photo-trigger"
    ];

    for(var i=0;i<targets.length;i++){
      var el = document.querySelector(targets[i]);
      if(el){
        try{ el.click(); }catch(e){}
        try{
          el.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}));
        }catch(e){}
        if(isOpen()) return true;
      }
    }

    var c = document.querySelector(".openwebrx-description-container");
    if(c){
      c.classList.add("expanded");
      c.style.setProperty("display","block","important");
      var mobile = !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
      if(!mobile){
        c.style.setProperty("max-height","none","important");
        c.style.setProperty("height","auto","important");
      }
      c.style.setProperty("visibility","visible","important");
      c.style.setProperty("opacity","1","important");
    }

    var a = document.querySelector(".openwebrx-rx-details-arrow");
    if(a){
      a.classList.add("openwebrx-rx-details-arrow-up");
    }

    return isOpen();
  }

  function boot(){
    var tries = 0;
    var t = setInterval(function(){
      tries++;
      tryOpen();
      if(isOpen() || tries > 30) clearInterval(t);
    }, 500);

    setTimeout(tryOpen, 200);
    setTimeout(tryOpen, 1000);
    setTimeout(tryOpen, 2500);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", boot);
})();
/* DNX_AUTO_OPEN_PHOTO_DESC_END */

/* DNX_FORCE_INNER_PHOTO_OPEN_START */
(function(){
  if(window.__dnxForceInnerPhotoOpen) return;
  window.__dnxForceInnerPhotoOpen = true;

  function forceOpen(){
    try {
      if(window.localStorage.getItem("dnx.rxdetails.open") === "0") return false;
    } catch(e){}
    var btn = document.querySelector("a.openwebrx-rx-details-arrow.openwebrx-photo-trigger");
    var box = document.querySelector(".openwebrx-description-container");
    if(!btn && !box) return false;

    if(btn){
      btn.classList.add("openwebrx-rx-details-arrow--up");
      btn.classList.add("openwebrx-rx-details-arrow-up");
      try{
        btn.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}));
      }catch(e){}
      try{ btn.click(); }catch(e){}
    }

    if(box){
      box.classList.add("expanded");
      box.style.setProperty("display","block","important");
      box.style.setProperty("visibility","visible","important");
      box.style.setProperty("opacity","1","important");
      var mobile = !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
      if(!mobile){
        box.style.setProperty("max-height","none","important");
        box.style.setProperty("height","auto","important");
        box.style.setProperty("overflow","visible","important");
      }
    }

    return true;
  }

  function boot(){
    var n = 0;
    var t = setInterval(function(){
      n++;
      forceOpen();
      if(n > 40) clearInterval(t);
    }, 300);

    setTimeout(forceOpen, 100);
    setTimeout(forceOpen, 800);
    setTimeout(forceOpen, 1600);
    setTimeout(forceOpen, 3000);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", boot);
})();
/* DNX_FORCE_INNER_PHOTO_OPEN_END */

/* DNX_PHOTO_DESC_TOGGLE_BUTTON_START */
(function(){
  if(window.__dnxPhotoDescToggleBtn) return;
  window.__dnxPhotoDescToggleBtn = true;

  var BTN_ID = "dnx-photo-desc-toggle-btn";
  var STYLE_ID = "dnx-photo-desc-toggle-style";

  function desc(){
    return document.querySelector(".openwebrx-description-container");
  }

  function arrow(){
    return document.querySelector(".openwebrx-rx-details-arrow");
  }

  function isOpen(){
    var c = desc();
    if(!c) return false;
    return c.classList.contains("expanded") && getComputedStyle(c).display !== "none";
  }

  function openDesc(){
    var c = desc();
    if(!c) return;

    c.classList.add("expanded");
    c.style.setProperty("display","block","important");
    c.style.setProperty("visibility","visible","important");
    c.style.setProperty("opacity","1","important");
    c.style.setProperty("max-height","none","important");
    c.style.setProperty("height","auto","important");
    c.style.setProperty("overflow","visible","important");

    var a = arrow();
    if(a){
      a.classList.add("openwebrx-rx-details-arrow--up");
      a.classList.add("openwebrx-rx-details-arrow-up");
      a.classList.remove("openwebrx-rx-details-arrow--down");
      a.classList.remove("openwebrx-rx-details-arrow-down");
    }
  }

  function closeDesc(){
    var c = desc();
    if(!c) return;

    c.classList.remove("expanded");
    c.style.setProperty("display","none","important");
    c.style.setProperty("visibility","hidden","important");
    c.style.setProperty("opacity","0","important");
    c.style.setProperty("max-height","0px","important");
    c.style.setProperty("height","0px","important");
    c.style.setProperty("overflow","hidden","important");

    var a = arrow();
    if(a){
      a.classList.remove("openwebrx-rx-details-arrow--up");
      a.classList.remove("openwebrx-rx-details-arrow-up");
      a.classList.add("openwebrx-rx-details-arrow--down");
      a.classList.add("openwebrx-rx-details-arrow-down");
    }
  }

  function ensureStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = [
      "#" + BTN_ID + " {",
      "  position:fixed !important;",
      "  top:80px !important;",
      "  right:20px !important;",
      "  z-index:1000600 !important;",
      "  height:30px !important;",
      "  padding:0 12px !important;",
      "  border-radius:999px !important;",
      "  border:1px solid #ffffff !important;",
      "  background:#1414b8 !important;",
      "  color:#ffffff !important;",
      "  font:700 12px/30px 'Segoe UI',sans-serif !important;",
      "  cursor:pointer !important;",
      "  box-shadow:0 0 10px rgba(20,20,184,.25) !important;",
      "}",
      "#" + BTN_ID + ".is-closed {",
      "  background:#444 !important;",
      "}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function syncBtn(){
    var b = document.getElementById(BTN_ID);
    if(!b) return;
    var open = isOpen();
    b.textContent = open ? "noVNC / Foto aus" : "noVNC / Foto ein";
    b.classList.toggle("is-closed", !open);
  }

  function ensureBtn(){
    ensureStyle();

    var b = document.getElementById(BTN_ID);
    if(b) return b;

    b = document.createElement("button");
    b.id = BTN_ID;
    b.type = "button";
    b.addEventListener("click", function(){
      if(isOpen()) closeDesc();
      else openDesc();
      syncBtn();
    });

    document.body.appendChild(b);
    syncBtn();
    return b;
  }

  function boot(){
    ensureBtn();
    syncBtn();
    setTimeout(syncBtn, 300);
    setTimeout(syncBtn, 1200);
    setTimeout(syncBtn, 2500);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }
  window.addEventListener("load", boot);
})();
/* DNX_PHOTO_DESC_TOGGLE_BUTTON_END */

// AUS: // AUS: Plugins.load('https://0xaf.github.io/openwebrxplus-plugins/receiver/colorful_spectrum/colorful_spectrum.js');


/* === DNX_BYPASS_LINES_FINAL === */
(function(){

function ready(){
  return typeof demodulators!=="undefined" &&
         typeof center_freq!=="undefined" &&
         typeof hz_per_pixel!=="undefined";
}

function px(f, rect){
  return rect.left + (f-center_freq)/hz_per_pixel;
}

function mk(id,color){
  let e=document.getElementById(id);
  if(!e){
    e=document.createElement("div");
    e.id=id;
    e.style.cssText="position:fixed;width:1px;background:"+color+";z-index:1000040;pointer-events:none";
    document.body.appendChild(e);
  }
  return e;
}

setInterval(function(){
  try{
    if(!ready()) return;
    if(!demodulators.length) return;

    let d=demodulators[0];
    if(!d) return;

    let wf=document.querySelector("#openwebrx-waterfall-container");
    if(!wf) return;

    let r=wf.getBoundingClientRect();

    let left = d.offset_frequency + d.low_cut;
    let right = d.offset_frequency + d.high_cut;

    let l = mk("dnx-bypass-left","#00ff00");
    let rr = mk("dnx-bypass-right","#00ff00");

    l.style.left = px(left,r)+"px";
    rr.style.left = px(right,r)+"px";

    l.style.top = r.top+"px";
    rr.style.top = r.top+"px";

    l.style.height = r.height+"px";
    rr.style.height = r.height+"px";

  }catch(e){}
},100);

})();


/* === DNX_BYPASS_REAL === */
(function(){
  if(window.__dnxBypassReal) return;
  window.__dnxBypassReal = true;

  function ensure(id){
    let e=document.getElementById(id);
    if(!e){
      e=document.createElement("div");
      e.id=id;
      e.style.cssText="position:fixed;width:1px;background:#00ff00;z-index:1000041;pointer-events:none";
      document.body.appendChild(e);
    }
    return e;
  }

  function loop(){
    try{
      if(typeof demodulators==="undefined" || !demodulators.length) return;

      let d = demodulators[0];
      if(!d || !d.low_cut) return;

      let wf=document.querySelector("#openwebrx-waterfall-container");
      if(!wf) return;

      let r=wf.getBoundingClientRect();

      let l=ensure("dnx-bypass-left");
      let rr=ensure("dnx-bypass-right");

      let left = (d.offset_frequency + d.low_cut - center_freq) / hz_per_pixel;
      let right = (d.offset_frequency + d.high_cut - center_freq) / hz_per_pixel;

      l.style.left = (r.left + left) + "px";
      rr.style.left = (r.left + right) + "px";

      l.style.top = r.top + "px";
      rr.style.top = r.top + "px";

      l.style.height = r.height + "px";
      rr.style.height = r.height + "px";

    }catch(e){}
    requestAnimationFrame(loop);
  }

  loop();
})();


/* === DNX_BYPASS_HOOKED === */
(function(){
  if(window.__dnxBypassHooked) return;
  window.__dnxBypassHooked = true;

  function ensure(id){
    let e=document.getElementById(id);
    if(!e){
      e=document.createElement("div");
      e.id=id;
      e.style.cssText="position:fixed;width:1px;background:#00ff00;z-index:1000011;pointer-events:none";
      document.body.appendChild(e);
    }
    return e;
  }

  function update(){
    try{
      if(typeof demodulators==="undefined") return;
      if(!demodulators.length) return;

      let d = demodulators[0];
      if(!d) return;

      let wf=document.querySelector("#openwebrx-waterfall-container");
      if(!wf) return;

      let r=wf.getBoundingClientRect();

      let leftLine = ensure("dnx-bypass-left");
      let rightLine = ensure("dnx-bypass-right");

      let left = (d.offset_frequency + d.low_cut - center_freq) / hz_per_pixel;
      let right = (d.offset_frequency + d.high_cut - center_freq) / hz_per_pixel;

      leftLine.style.left = (r.left + left) + "px";
      rightLine.style.left = (r.left + right) + "px";

      leftLine.style.top = r.top + "px";
      rightLine.style.top = r.top + "px";

      leftLine.style.height = r.height + "px";
      rightLine.style.height = r.height + "px";

    }catch(e){}
  }

  setInterval(update, 50);

})();


/* DNX_YELLOW_GREEN_FULLSCREEN_START */
(function(){
  if(window.__dnxLinesFixed) return;
  window.__dnxLinesFixed = true;

  try{
    if(!document.getElementById('dnx-line-hide-style')){
      const style = document.createElement('style');
      style.id = 'dnx-line-hide-style';
      style.textContent = ''
        + 'body.dnx-hide-yellow-line #dnx-follow,'
        + 'body.dnx-hide-yellow-line #dnx-follow-line,'
        + 'body.dnx-hide-yellow-line #dnx-follow-line-glow,'
        + 'body.dnx-hide-yellow-line #dnx-follow-topcap,'
        + 'body.dnx-hide-yellow-line #dnx-seg-yellow,'
        + 'body.dnx-hide-yellow-line .dnx-seg-yellow{display:none !important;opacity:0 !important;}'
        + 'body.dnx-hide-green-line #dnx-center,'
        + 'body.dnx-hide-green-line #dnx-left,'
        + 'body.dnx-hide-green-line #dnx-right,'
        + 'body.dnx-hide-green-line #dnx-green-extension-adaptive-line,'
        + 'body.dnx-hide-green-line #dnx-green-extension-adaptive-glow,'
        + 'body.dnx-hide-green-line #dnx-seg-green,'
        + 'body.dnx-hide-green-line .dnx-seg-green{display:none !important;opacity:0 !important;}';
      document.head.appendChild(style);
    }
  }catch(e){}

  const STORE_Y = 'dnx.line.yellow.enabled';
  const STORE_G = 'dnx.line.green.enabled';

  function loadFlag(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      if(raw === null) return fallback;
      return raw === '1';
    }catch(e){}
    return fallback;
  }

  function saveFlag(key, value){
    try{ localStorage.setItem(key, value ? '1' : '0'); }catch(e){}
  }

  window.__dnxYellowEnabled = loadFlag(STORE_Y, true);
  window.__dnxGreenEnabled = loadFlag(STORE_G, true);

  function ensurePanel(){
    const receiver =
      document.getElementById('dnx-fx-box-inline') ||
      document.getElementById('openwebrx-panel-receiver') ||
      document.querySelector('#openwebrx-panel-receiver');
    if(!receiver) return null;

    let host = document.getElementById('dnx-line-toggle-box');
    if(host) return host;

    host = document.createElement('div');
    host.id = 'dnx-line-toggle-box';
    host.style.cssText = 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0 8px 0;';

    function mkBtn(id, label, getter, setter){
      const b = document.createElement('button');
      b.type = 'button';
      b.id = id;
      b.style.cssText = 'height:26px;padding:0 10px;border-radius:999px;border:1px solid #ffffff;background:#666666;color:#ffffff;font:700 12px/1 Segoe UI,sans-serif;cursor:pointer;';
      function paint(){
        const on = getter();
        b.textContent = label + ': ' + (on ? 'On' : 'Off');
        b.style.setProperty('border', '1px solid #ffffff', 'important');
        if (label === 'Gelb Hover') {
          b.style.setProperty('background', on ? '#ffd400' : '#666666', 'important');
          b.style.setProperty('color', on ? '#000000' : '#ffffff', 'important');
        } else {
          b.style.setProperty('background', on ? '#22ff2f' : '#666666', 'important');
          b.style.setProperty('color', on ? '#000000' : '#ffffff', 'important');
        }
      }
      b.addEventListener('click', function(){
        setter(!getter());
        paint();
      });
      paint();
      return b;
    }

    host.appendChild(mkBtn(
      'dnx-btn-yellow-line',
      'Gelb Hover',
      function(){ return !!window.__dnxYellowEnabled; },
      function(v){
        window.__dnxYellowEnabled = !!v;
        saveFlag(STORE_Y, !!v);
        syncLineVisibility();
      }
    ));

    host.appendChild(mkBtn(
      'dnx-btn-green-line',
      'Gruen Tuning',
      function(){ return !!window.__dnxGreenEnabled; },
      function(v){
        window.__dnxGreenEnabled = !!v;
        saveFlag(STORE_G, !!v);
        syncLineVisibility();
      }
    ));

    if (receiver.id === 'dnx-fx-box-inline') {
      receiver.appendChild(host);
    } else {
      receiver.insertBefore(host, receiver.firstChild);
    }
    return host;
  }

  function wfRect(){
    const wf =
      document.querySelector('#openwebrx-waterfall-container') ||
      document.querySelector('.openwebrx-waterfall-container');
    return wf ? wf.getBoundingClientRect() : null;
  }

  function mk(id,color,w,op){
    let e=document.getElementById(id);
    if(!e){
      e=document.createElement('div');
      e.id=id;
      e.style.cssText='position:fixed;pointer-events:none;z-index:1000011;width:'+w+'px;background:'+color+';opacity:'+op+';display:none';
      document.body.appendChild(e);
    }
    return e;
  }

  const yellow = mk('dnx-follow','#ffd400',1,1);
  const greenC = mk('dnx-center','#22ff2f',2,1);
  const greenL = mk('dnx-left','#22ff2f',1,0.6);
  const greenR = mk('dnx-right','#22ff2f',1,0.6);

  function hardHide(el){
    try{
      if(el) el.style.display='none';
    }catch(e){}
  }

  function hideAll(selector){
    try{
      document.querySelectorAll(selector).forEach(function(el){
        el.style.display='none';
      });
    }catch(e){}
  }

  function syncLineVisibility(){
    try{
      document.body.classList.toggle('dnx-hide-yellow-line', !window.__dnxYellowEnabled);
      document.body.classList.toggle('dnx-hide-green-line', !window.__dnxGreenEnabled);
    }catch(e){}

    if(!window.__dnxYellowEnabled){
      hardHide(yellow);
      hardHide(window.yellowLine);
      hardHide(window.yellowCap);
      hideAll('#dnx-follow, #dnx-follow-line, #dnx-follow-line-glow, #dnx-follow-topcap, #dnx-seg-yellow, .dnx-seg-yellow');
    }
    if(!window.__dnxGreenEnabled){
      hardHide(greenC);
      hardHide(greenL);
      hardHide(greenR);
      hardHide(window.greenCenter);
      hardHide(window.greenLeft);
      hardHide(window.greenRight);
      hardHide(window.greenCCap);
      hardHide(window.greenLCap);
      hardHide(window.greenRCap);
      hardHide(document.getElementById('dnx-green-extension-adaptive-line'));
      hardHide(document.getElementById('dnx-green-extension-adaptive-glow'));
      hideAll('#dnx-center, #dnx-left, #dnx-right, #dnx-seg-green, .dnx-seg-green, #dnx-green-extension-adaptive-line, #dnx-green-extension-adaptive-glow');
    }
  }

  function setLine(e,x,t,h){
    e.style.left=Math.round(x)+'px';
    e.style.top=Math.round(t)+'px';
    e.style.height=Math.round(h)+'px';
    e.style.display='';
  }

  function hide(e){e.style.display='none';}

  function currentRange(){
    try{
      if(typeof get_visible_freq_range==='function') return get_visible_freq_range();
    }catch(e){}
    try{
      if(typeof visible_range!=='undefined') return visible_range;
    }catch(e){}
    return null;
  }

  function freqToX(freq){
    const r=wfRect();
    if(!r) return null;

    const range=currentRange();
    if(range && typeof scale_px_from_freq==='function'){
      return r.left+scale_px_from_freq(freq,range);
    }

    if(range && range.start && range.bw){
      return r.left+((freq-range.start)/range.bw)*r.width;
    }

    return null;
  }

  function updateGreen(){
    try{
      if(!window.__dnxGreenEnabled){
        hide(greenC); hide(greenL); hide(greenR);
        hardHide(window.greenCenter);
        hardHide(window.greenLeft);
        hardHide(window.greenRight);
        hardHide(window.greenCCap);
        hardHide(window.greenLCap);
        hardHide(window.greenRCap);
        hideAll('#dnx-center, #dnx-left, #dnx-right, #dnx-seg-green, .dnx-seg-green');
        return;
      }
      const r=wfRect();
      if(!r) return;

      const d=UI.getDemodulator();
      if(!d) return;

      let off=0;
      if(d.get_offset_frequency) off=d.get_offset_frequency()||0;

      const bp=d.getBandpass();
      if(!bp) return;

      const xC=freqToX(center_freq+off);
      const xL=freqToX(center_freq+off+bp.low_cut);
      const xR=freqToX(center_freq+off+bp.high_cut);

      if(xC==null) return;

      setLine(greenC,xC,r.top,r.height);

      if(xL && xR && Math.abs(xR-xL)>6){
        setLine(greenL,xL,r.top,r.height);
        setLine(greenR,xR,r.top,r.height);
      } else {
        hide(greenL); hide(greenR);
      }

    }catch(e){}
  }

  document.addEventListener('mousemove',function(e){
    if(!window.__dnxYellowEnabled){
      hide(yellow);
      hardHide(window.yellowLine);
      hardHide(window.yellowCap);
      hideAll('#dnx-follow, #dnx-follow-line, #dnx-follow-line-glow, #dnx-follow-topcap, #dnx-seg-yellow, .dnx-seg-yellow');
      return;
    }
    const r=wfRect();
    if(!r) return;

    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){
      hide(yellow);
      return;
    }

    setLine(yellow,e.clientX,r.top,r.height);
  },{passive:true});

  setInterval(function(){ ensurePanel(); updateGreen(); },120);
  ensurePanel();
  syncLineVisibility();
  updateGreen();

})();
/* DNX_YELLOW_GREEN_FULLSCREEN_END */

(function(){
  if(window.__dnxGlobalLineKiller) return;
  window.__dnxGlobalLineKiller = true;

  function hide(el){
    try{
      if(!el) return;
      el.style.display = 'none';
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      el.style.background = 'transparent';
      el.style.boxShadow = 'none';
      el.style.filter = 'none';
    }catch(e){}
  }

  function wipeBox(id){
    try{
      var box = document.getElementById(id);
      if(!box) return;
      box.style.display = 'none';
      box.style.opacity = '0';
      box.style.visibility = 'hidden';
      box.innerHTML = '';
    }catch(e){}
  }

  function loop(){
    try{
      if(window.__dnxYellowEnabled === false){
        hide(window.yellowLine);
        hide(document.getElementById('dnx-follow-line'));
        hide(document.getElementById('dnx-follow-line-glow'));
        hide(document.getElementById('dnx-follow-topcap'));
        hide(window.yellowCap);
        wipeBox('dnx-seg-yellow');
      }
      if(window.__dnxGreenEnabled === false){
        hide(window.greenCenter);
        hide(window.greenLeft);
        hide(window.greenRight);
        hide(window.greenCCap);
        hide(window.greenLCap);
        hide(window.greenRCap);
        hide(document.getElementById('dnx-green-extension-adaptive-line'));
        hide(document.getElementById('dnx-green-extension-adaptive-glow'));
        wipeBox('dnx-seg-green');
      }
    }catch(e){}
    requestAnimationFrame(loop);
  }

  loop();
})();




/* DNX_SEGMENT_SMOOTH_START */
(function(){
  if(window.__dnxSmoothSeg) return;
  window.__dnxSmoothSeg = true;

  function getSeg(box,i,w){
    let el=box.children[i];
    if(!el){
      el=document.createElement('div');
      el.dataset.l='0';
      el.style.cssText='position:fixed;pointer-events:none;width:'+w+'px;transition:all 80ms linear;';
      box.appendChild(el);
    }
    return el;
  }

  function mix(a,b,t){return a+(b-a)*t;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

  function rgb(r,g,b){
    return 'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')';
  }

  function style(el,base,lum){
    let prev=parseFloat(el.dataset.l||lum);
    lum=mix(prev,lum,0.25);
    el.dataset.l=lum;

    let t=clamp((lum-50)/140,0,1);

    let r,g,b;

    if(base==='#ffd400'){
      r=mix(255,140,t);
      g=mix(240,110,t);
      b=mix(120,0,t);
    }else{
      r=mix(140,10,t);
      g=mix(255,120,t);
      b=mix(150,20,t);
    }

    const col=rgb(r,g,b);

    el.style.background=col;
    el.style.boxShadow='0 0 '+(8*(1-t)).toFixed(1)+'px '+col;
    el.style.filter='brightness('+mix(1.2,0.75,t).toFixed(2)+')';
  }

  function apply(line,cap,base,id){
    if(id==='dnx-seg-yellow' && window.__dnxYellowEnabled === false) return;
    if(id==='dnx-seg-green' && window.__dnxGreenEnabled === false) return;
    if(!line) return;

    const x=parseFloat(line.style.left||'NaN');
    const top=parseFloat(line.style.top||'NaN');
    const h=parseFloat(line.style.height||'NaN');
    if(!isFinite(x)||!isFinite(top)||!isFinite(h)) return;

    let box=document.getElementById(id);
    if(!box){
      box=document.createElement('div');
      box.id=id;
      document.body.appendChild(box);
    }

    const segH=5;
    const count=Math.ceil(h/segH);

    for(let i=0;i<count;i++){
      const seg=getSeg(box,i,parseFloat(line.style.width||2));

      const y=top+i*segH;

      seg.style.left=x+'px';
      seg.style.top=y+'px';
      seg.style.height=segH+'px';
      seg.style.display='';

      let lum=120;
      try{
        const c=document.querySelector('canvas');
        if(c){
          const r=c.getBoundingClientRect();
          const ctx=c.getContext('2d',{willReadFrequently:true});
          const px=(x-r.left)*(c.width/r.width);
          const py=(y-r.top)*(c.height/r.height);
          const d=ctx.getImageData(px,py,1,1).data;
          lum=0.2126*d[0]+0.7152*d[1]+0.0722*d[2];
        }
      }catch(e){}

      style(seg,base,lum);
    }

    for(let i=box.children.length-1;i>=count;i--){
      box.children[i].style.display='none';
    }

    if(cap){
      cap.style.background=base;
    }
  }

  setInterval(function(){
    if(window.__dnxYellowEnabled !== false){
      apply(window.yellowLine, window.yellowCap, '#ffd400', 'dnx-seg-yellow');
    } else {
      try{
        var by = document.getElementById('dnx-seg-yellow');
        if(by){ by.innerHTML=''; by.style.display='none'; }
        document.querySelectorAll('.dnx-seg-yellow').forEach(function(el){ el.style.display='none'; });
      }catch(e){}
    }

    if(window.__dnxGreenEnabled !== false){
      apply(window.greenCenter, window.greenCCap, '#22ff2f', 'dnx-seg-green');
    } else {
      try{
        var bg = document.getElementById('dnx-seg-green');
        if(bg){ bg.innerHTML=''; bg.style.display='none'; }
        document.querySelectorAll('.dnx-seg-green').forEach(function(el){ el.style.display='none'; });
      }catch(e){}
    }
  },70);

})();
 /* DNX_SEGMENT_SMOOTH_END */



/* DNX_SEGMENTS_TRUE_PER_SEG_START */
(function(){
  if(window.__dnxTrueSeg) return;
  window.__dnxTrueSeg = true;

  function findCanvas(){
    return document.querySelector('#openwebrx-waterfall-container canvas')
        || document.querySelector('.openwebrx-waterfall-container canvas');
  }

  function getRect(){
    const c = findCanvas();
    return c ? c.getBoundingClientRect() : null;
  }

  function ensureBox(id){
    let b = document.getElementById(id);
    if(!b){
      b = document.createElement('div');
      b.id = id;
      document.body.appendChild(b);
    }
    return b;
  }

  function getSeg(box,i,w){
    let el = box.children[i];
    if(!el){
      el = document.createElement('div');
      el.style.cssText = 'position:fixed;pointer-events:none;width:'+w+'px;';
      box.appendChild(el);
    }
    return el;
  }

  function lumaAt(x, y){
    try{
      const c = findCanvas();
      if(!c) return null;
      const r = c.getBoundingClientRect();
      const ctx = c.getContext('2d',{willReadFrequently:true});

      const px = Math.floor((x - r.left) * (c.width / r.width));
      const py = Math.floor((y - r.top)  * (c.height/ r.height));

      if(px < 0 || py < 0 || px >= c.width || py >= c.height) return null;

      const d = ctx.getImageData(px, py, 1, 1).data;
      return 0.2126*d[0] + 0.7152*d[1] + 0.0722*d[2];
    }catch(e){
      return null;
    }
  }

  function style(el, base, lum){
    if(lum == null) return;

    // DIREKT + INVERTIERT (kein smoothing)
    let t = lum / 255;
    t = 1 - t;

    let r,g,b;
    if(base === '#ffd400'){
      r = 200 + t*55;
      g = 150 + t*90;
      b = 0   + t*40;
    } else {
      r = 0   + t*120;
      g = 130 + t*120;
      b = 0   + t*80;
    }

    const col = 'rgb('+ (r|0) +','+ (g|0) +','+ (b|0) +')';
    el.style.background = col;
    el.style.boxShadow = '0 0 '+ (4 + t*8).toFixed(1) +'px '+ col;
    el.style.filter = 'none';
  }

  function apply(line, base, boxId){
    if(boxId==='dnx-seg-yellow' && window.__dnxYellowEnabled === false) return;
    if(boxId==='dnx-seg-green' && window.__dnxGreenEnabled === false) return;
    if(!line) return;

    const x = parseFloat(line.style.left||'NaN');
    const top = parseFloat(line.style.top||'NaN');
    const h = parseFloat(line.style.height||'NaN');
    const w = parseFloat(line.style.width||'2');
    if(!isFinite(x)||!isFinite(top)||!isFinite(h)) return;

    const r = getRect();
    if(!r) return;

    // Original-Linie unsichtbar machen
    line.style.background='transparent';
    line.style.boxShadow='none';

    const box = ensureBox(boxId);

    const segH = 6;
    const count = Math.max(1, Math.ceil(h/segH));

    for(let i=0;i<count;i++){
      const seg = getSeg(box, i, w);
      const y = top + i*segH;
      const realH = Math.min(segH, top + h - y);

      seg.style.left = Math.round(x)+'px';
      seg.style.top  = Math.round(y)+'px';
      seg.style.height = Math.max(1, Math.round(realH))+'px';
      seg.style.display = '';

      const lum = lumaAt(x, y);
      style(seg, base, lum);
    }

    for(let i=box.children.length-1;i>=count;i--){
      box.children[i].style.display='none';
    }
  }

  setInterval(function(){
    if(window.__dnxYellowEnabled !== false){
      apply(window.yellowLine, '#ffd400', 'dnx-seg-yellow');
    } else {
      try{
        var by = document.getElementById('dnx-seg-yellow');
        if(by){ by.innerHTML=''; by.style.display='none'; }
        document.querySelectorAll('.dnx-seg-yellow').forEach(function(el){ el.style.display='none'; });
      }catch(e){}
    }

    if(window.__dnxGreenEnabled !== false){
      apply(window.greenCenter, '#22ff2f', 'dnx-seg-green');
    } else {
      try{
        var bg = document.getElementById('dnx-seg-green');
        if(bg){ bg.innerHTML=''; bg.style.display='none'; }
        document.querySelectorAll('.dnx-seg-green').forEach(function(el){ el.style.display='none'; });
      }catch(e){}
    }
  }, 60);

})();
 /* DNX_SEGMENTS_TRUE_PER_SEG_END */



;


;


;


;


;

;

;

;
/* === DNX_DISABLE_PRINT === */
(function(){
 if(window.__dnxNoPrint) return;
 window.__dnxNoPrint=true;
 window.print=function(){console.log("print blocked");};
 document.addEventListener("keydown",function(e){
   if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="p"){
     e.preventDefault(); e.stopPropagation(); return false;
   }
 },true);
 
})();

;

;

;

;

;



/* === DNX_DISABLE_PRINT === */
(function(){
 if(window.__dnxNoPrint) return;
 window.__dnxNoPrint=true;
 window.print=function(){console.log("print blocked");};
 document.addEventListener("keydown",function(e){
   if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="p"){
     e.preventDefault(); e.stopPropagation(); return false;
   }
 },true);
 
})();
/* dnx_overlay_test disabled: local file missing */

/* DNX_RECEIVER_OVERLAY_START */
(function(){
  if(window.__dnxReceiverOverlayV2) return;
  window.__dnxReceiverOverlayV2 = true;

  var PANEL_ID = "openwebrx-panel-receiver";
  var WRAP_ID = "dnx-receiver-overlay";
  var BAR_ID = "dnx-receiver-overlay-bar";
  var BODY_ID = "dnx-receiver-overlay-body";
  var STYLE_ID = "dnx-receiver-overlay-style";
  var STORE_KEY = "dnx.receiver.overlay.v2.pos";

  var wrap = null;
  var body = null;
  var drag = false;
  var sx = 0, sy = 0, sl = 0, st = 0;

  function savePos(x, y){
    try{
      localStorage.setItem(STORE_KEY, JSON.stringify({x: Math.round(x), y: Math.round(y)}));
    }catch(e){}
  }

  function loadPos(){
    try{
      var raw = localStorage.getItem(STORE_KEY);
      if(!raw) return null;
      var v = JSON.parse(raw);
      if(typeof v.x !== "number" || typeof v.y !== "number") return null;
      return v;
    }catch(e){
      return null;
    }
  }

  function ensureStyle(){
    if(document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#" + WRAP_ID + "{position:fixed;left:-9999px;top:-9999px;visibility:hidden;z-index:2147483647;background:rgba(4,20,8,.28);border:2px solid rgba(50,255,120,.88);border-radius:12px;box-shadow:0 0 14px rgba(30,255,110,.55), 0 0 30px rgba(20,200,80,.32), 0 0 48px rgba(20,160,70,.18), inset 0 0 12px rgba(40,180,70,.18);overflow:visible;min-width:320px;padding:2px 0 2px 2px;box-sizing:border-box;}",
      "#" + WRAP_ID + ".dragging{opacity:.98;}",
      "#" + BAR_ID + "{position:absolute;top:0;left:0;width:100%;height:5px;line-height:5px;padding:0;cursor:move;background:rgba(255,0,0,.85);border:none;color:transparent;font-size:0;user-select:none;border-radius:6px 6px 0 0;z-index:2147483647;}",
      "#" + BODY_ID + "{position:relative;background:transparent;padding-top:5px;}",
      "#" + WRAP_ID + " #" + PANEL_ID + "{position:relative !important;left:0 !important;top:0 !important;right:auto !important;bottom:auto !important;transform:none !important;margin:0 !important;display:block !important;z-index:auto !important;}",
      "body > #" + PANEL_ID + "{display:none !important;}"
    ].join("\\n");
    document.head.appendChild(style);
  }

  function clamp(){
    if(!wrap) return;
    var r = wrap.getBoundingClientRect();
    var left = Math.max(0, Math.min(r.left, window.innerWidth - r.width));
    var top = Math.max(0, Math.min(r.top, window.innerHeight - r.height));
    wrap.style.left = left + "px";
    wrap.style.top = top + "px";
  }

  function ensureWrap(){
    wrap = document.getElementById(WRAP_ID);
    if(wrap) {
      body = document.getElementById(BODY_ID);
      return wrap;
    }

    wrap = document.createElement("div");
    wrap.id = WRAP_ID;

    var bar = document.createElement("div");
    bar.id = BAR_ID;
    bar.textContent = "";

    body = document.createElement("div");
    body.id = BODY_ID;

    wrap.appendChild(bar);
    wrap.appendChild(body);
    document.body.appendChild(wrap);

    var saved = loadPos();
    if(saved){
      wrap.style.setProperty("left", saved.x + "px", "important");
      wrap.style.setProperty("top", saved.y + "px", "important");
      wrap.style.setProperty("right", "auto", "important");
      wrap.style.setProperty("bottom", "auto", "important");
    } else {
      wrap.style.setProperty("left", "20px", "important");
      wrap.style.setProperty("top", "120px", "important");
      wrap.style.setProperty("right", "auto", "important");
      wrap.style.setProperty("bottom", "auto", "important");
    }
    wrap.style.setProperty("visibility", "visible", "important");

    bar.addEventListener("mousedown", function(e){
      if(e.button !== 0) return;
      var r = wrap.getBoundingClientRect();
      drag = true;
      sx = e.clientX;
      sy = e.clientY;
      sl = r.left;
      st = r.top;
      wrap.classList.add("dragging");
      e.preventDefault();
      e.stopPropagation();
    }, true);

    document.addEventListener("mousemove", function(e){
      if(!drag) return;
      wrap.style.setProperty("left", (sl + (e.clientX - sx)) + "px", "important");
      wrap.style.setProperty("top",  (st + (e.clientY - sy)) + "px", "important");
      wrap.style.setProperty("right", "auto", "important");
      wrap.style.setProperty("bottom", "auto", "important");
    }, true);

    document.addEventListener("mouseup", function(){
      if(!drag) return;
      drag = false;
      wrap.classList.remove("dragging");
      clamp();
      var r = wrap.getBoundingClientRect();
      savePos(r.left, r.top);
    }, true);

    window.addEventListener("resize", function(){
      clamp();
      var r = wrap.getBoundingClientRect();
      savePos(r.left, r.top);
    });

    return wrap;
  }

  function attachPanel(){
    var panel = document.getElementById(PANEL_ID);
    if(!panel) return false;

    ensureStyle();
    ensureWrap();

    var saved = loadPos();
    if(saved){
      wrap.style.setProperty("left", saved.x + "px", "important");
      wrap.style.setProperty("top", saved.y + "px", "important");
      wrap.style.setProperty("right", "auto", "important");
      wrap.style.setProperty("bottom", "auto", "important");
    } else {
      wrap.style.setProperty("left", "20px", "important");
      wrap.style.setProperty("top", "120px", "important");
      wrap.style.setProperty("right", "auto", "important");
      wrap.style.setProperty("bottom", "auto", "important");
    }
    wrap.style.setProperty("visibility", "visible", "important");

    if(panel.parentNode !== body){
      body.appendChild(panel);
    }

    var wrapOpen = null;
    try{ wrapOpen = localStorage.getItem("dnx.receiver.overlay.visible"); }catch(e){}
    if(wrapOpen === null){
      var mobileDefault = !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
      wrapOpen = mobileDefault ? "0" : "1";
    }
    wrap.style.setProperty("display", wrapOpen === "1" ? "block" : "none", "important");

    panel.style.setProperty("display", "block", "important");
    panel.style.setProperty("position", "relative", "important");
    panel.style.setProperty("left", "0px", "important");
    panel.style.setProperty("top", "0px", "important");
    panel.style.setProperty("right", "auto", "important");
    panel.style.setProperty("bottom", "auto", "important");
    panel.style.setProperty("transform", "none", "important");
    panel.style.setProperty("margin", "0", "important");

    setTimeout(function(){
      try{
        var pr = panel.getBoundingClientRect();
        if(pr.width > 40){
          wrap.style.width = Math.ceil(pr.width) + "px";
        }
      }catch(e){}
      clamp();
    }, 50);

    return true;
  }

  function boot(){
    attachPanel();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){
    attachPanel();
  });

  new MutationObserver(function(){
    var panel = document.getElementById(PANEL_ID);
    if(panel && body && panel.parentNode !== body){
      attachPanel();
    }
  }).observe(document.documentElement, {childList:true, subtree:true});
})();
 /* DNX_RECEIVER_OVERLAY_END */

/* DNX_RED_BAR_OVERRIDE_START */
(function(){
  if(window.__dnxRedBarOverride) return;
  window.__dnxRedBarOverride = true;

  function apply(){
    var bar = document.getElementById("dnx-receiver-overlay-bar");
    var body = document.getElementById("dnx-receiver-overlay-body");
    if(!bar) return;

    bar.style.setProperty("position", "relative", "important");
    bar.style.setProperty("display", "block", "important");
    bar.style.setProperty("width", "100%", "important");
    bar.style.setProperty("height", "10px", "important");
    bar.style.setProperty("line-height", "10px", "important");
    bar.style.setProperty("padding", "0", "important");
    bar.style.setProperty("margin", "0", "important");
    bar.style.setProperty("background", "rgba(255,0,0,0.9)", "important");
    bar.style.setProperty("cursor", "move", "important");
    bar.style.setProperty("border", "none", "important");
    bar.style.setProperty("border-radius", "8px 8px 0 0", "important");
    bar.style.setProperty("z-index", "2147483647", "important");
    bar.textContent = "";

    if(body){
      body.style.setProperty("padding-top", "0", "important");
      body.style.setProperty("margin-top", "0", "important");
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      setTimeout(apply, 350);
    }, {once:true});
  } else {
    setTimeout(apply, 350);
  }

  window.addEventListener("load", function(){
    setTimeout(apply, 500);
  });

  window.addEventListener("resize", function(){ setTimeout(apply, 120); });
})();
/* DNX_RED_BAR_OVERRIDE_END */

/* DNX_RED_BAR_FIT_START */
(function(){
  if(window.__dnxRedBarFit) return;
  window.__dnxRedBarFit = true;

  function fit(){
    var bar = document.getElementById("dnx-receiver-overlay-bar");
    var panel = document.getElementById("openwebrx-panel-receiver");
    if(!bar || !panel) return;

    var pw = panel.getBoundingClientRect().width;
    if(!pw || pw < 50) return;

    bar.style.setProperty("width", Math.round(pw) + "px", "important");
    bar.style.setProperty("max-width", Math.round(pw) + "px", "important");
    bar.style.setProperty("min-width", Math.round(pw) + "px", "important");
    bar.style.setProperty("left", "0px", "important");
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      setTimeout(fit, 350);
    }, {once:true});
  } else {
    setTimeout(fit, 350);
  }

  window.addEventListener("load", function(){
    setTimeout(fit, 500);
  });

  window.addEventListener("resize", fit);
  window.addEventListener("resize", function(){ setTimeout(fit, 120); });
})();
/* DNX_RED_BAR_FIT_END */

/* DNX_FXBOX_FIX_START */
(function(){
  if(window.__dnxFxBoxFix) return;
  window.__dnxFxBoxFix = true;

  function placeFx(){
    var receiver = document.getElementById("openwebrx-panel-receiver");
    var box = document.getElementById("dnx-fx-box");
    if(!receiver || !box) return;

    box.style.setProperty("display", "block", "important");
    box.style.setProperty("visibility", "visible", "important");
    box.style.setProperty("opacity", "1", "important");

    var freqBlock =
      receiver.querySelector(".webrx-actual-freq-holder") ||
      receiver.querySelector(".webrx-actual-freq") ||
      receiver.firstElementChild;

    if(freqBlock && freqBlock.parentNode === receiver){
      if(box.nextElementSibling !== freqBlock){
        receiver.insertBefore(box, freqBlock);
      }
    } else if(receiver.firstElementChild !== box) {
      receiver.insertBefore(box, receiver.firstChild);
    }
  }

  function boot(){
    placeFx();
    setTimeout(placeFx, 300);
    setTimeout(placeFx, 1200);
    setTimeout(placeFx, 2500);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){
    setTimeout(placeFx, 500);
  });

  new MutationObserver(placeFx).observe(document.documentElement, {
    childList:true,
    subtree:true
  });

  setInterval(placeFx, 1000);
})();
/* DNX_FXBOX_FIX_END */

/* DNX_FXBOX_INLINE_START */
(function(){
  if(window.__dnxFxInline) return;
  window.__dnxFxInline = true;

  var BOX_ID = "dnx-fx-box-inline";
  var STORE = "dnx_fx_state_v2";

  function loadState(){
    try{
      return Object.assign({vol:18,pitch:100,len:80,sound:"Soft",mute:false,collapsed:false}, JSON.parse(localStorage.getItem(STORE) || "{}"));
    }catch(e){
      return {vol:18,pitch:100,len:80,sound:"Soft",mute:false,collapsed:false};
    }
  }

  function saveState(state){
    try{ localStorage.setItem(STORE, JSON.stringify(state)); }catch(e){}
  }

  function beep(state){
    if(state.mute) return;
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return;
      var ctx = new AC();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      var type = "sine";
      var base = 880;
      if(state.sound === "Click"){ type = "square"; base = 1200; }
      if(state.sound === "Digital"){ type = "sawtooth"; base = 1500; }
      if(state.sound === "Retro"){ type = "triangle"; base = 700; }

      osc.type = type;
      osc.frequency.value = Math.max(80, base * (state.pitch/100));
      gain.gain.value = Math.max(0, Math.min(1, state.vol/100)) * 0.12;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      var dur = Math.max(20, state.len);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur/1000);
      osc.stop(ctx.currentTime + dur/1000 + 0.02);

      setTimeout(function(){ try{ ctx.close(); }catch(e){} }, dur + 120);
    }catch(e){}
  }

  function row(labelText, inputEl, valueEl){
    var row = document.createElement("div");
    row.className = "dnx-fx-row";

    var label = document.createElement("label");
    label.className = "dnx-fx-label";
    label.textContent = labelText;

    var mid = document.createElement("div");
    mid.className = "dnx-fx-mid";
    mid.appendChild(inputEl);

    row.appendChild(label);
    row.appendChild(mid);
    if(valueEl) row.appendChild(valueEl);
    return row;
  }

  function makeRange(min,max,val){
    var el = document.createElement("input");
    el.type = "range";
    el.min = String(min);
    el.max = String(max);
    el.value = String(val);
    el.className = "dnx-fx-range";
    return el;
  }

  function build(){
    var receiver = document.getElementById("openwebrx-panel-receiver");
    if(!receiver) return;

    var old = document.getElementById(BOX_ID);
    if(old) old.remove();

    var state = loadState();

    var box = document.createElement("div");
    box.id = BOX_ID;
    box.setAttribute("data-dnx-collapsed", state.collapsed ? "1" : "0");

    var style = document.createElement("style");
    style.textContent = `
      #${BOX_ID}{
        margin:0 0 8px 0;
        padding:8px 10px 10px 10px;
        border-radius:8px;
        background:rgba(90,90,90,.58);
        box-sizing:border-box;
        color:#fff;
        font-size:12px;
      }
      #${BOX_ID} *{ box-sizing:border-box; }
      #${BOX_ID} .dnx-fx-title{ font-weight:700; font-size:13px; margin:0 0 8px 0; cursor:pointer; user-select:none; }
      #${BOX_ID} .dnx-fx-row{ display:grid; grid-template-columns:86px 1fr 72px; gap:8px; align-items:center; margin:0 0 8px 0; }
      #${BOX_ID} .dnx-fx-row.dnx-fx-sound{ grid-template-columns:86px 1fr 20px; }
      #${BOX_ID} .dnx-fx-label{ color:#fff; font-weight:600; }
      #${BOX_ID} .dnx-fx-range{ width:100%; }
      #${BOX_ID} .dnx-fx-value{ text-align:right; color:#fff; font-weight:700; }
      #${BOX_ID} select{
        width:100%; height:28px; border-radius:4px; border:0; padding:2px 8px;
        background:rgba(20,20,20,.35); color:#fff; font-size:12px;
      }
      #${BOX_ID} .dnx-fx-bottom{ display:flex; align-items:center; gap:10px; margin-top:4px; }
      #${BOX_ID} .dnx-fx-mute{ display:flex; align-items:center; gap:6px; font-weight:600; }
      #${BOX_ID} .dnx-fx-test{
        height:28px; padding:0 10px; border-radius:4px; border:0;
        background:#ececec; color:#111; cursor:pointer; font-weight:700;
      }
      #${BOX_ID} .dnx-fx-status{ margin-top:6px; color:#7fe3ff; font-weight:600; }
    `;
    box.appendChild(style);

    var title = document.createElement("div");
    title.className = "dnx-fx-title";
    title.textContent = (state.collapsed ? "▸ " : "▾ ") + "FX / Pip";
    box.appendChild(title);

    var title = document.createElement("div");
    title.className = "dnx-fx-title";
    title.textContent = "FX / Pip";
    box.appendChild(title);

    var vol = makeRange(0,100,state.vol);
    var volVal = document.createElement("div");
    volVal.className = "dnx-fx-value";
    box.appendChild(row("Lautst.", vol, volVal));

    var pitch = makeRange(10,100,state.pitch);
    var pitchVal = document.createElement("div");
    pitchVal.className = "dnx-fx-value";
    box.appendChild(row("Tonhöhe", pitch, pitchVal));

    var leng = makeRange(20,300,state.len);
    var lenVal = document.createElement("div");
    lenVal.className = "dnx-fx-value";
    box.appendChild(row("Länge", leng, lenVal));

    var sel = document.createElement("select");
    ["Soft","Click","Digital","Retro"].forEach(function(v){
      var o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      if(v === state.sound) o.selected = true;
      sel.appendChild(o);
    });
    var arrow = document.createElement("div");
    arrow.className = "dnx-fx-value";
    arrow.textContent = "▾";
    var soundRow = row("Sound", sel, arrow);
    soundRow.classList.add("dnx-fx-sound");
    box.appendChild(soundRow);

    var bottom = document.createElement("div");
    bottom.className = "dnx-fx-bottom";

    var muteWrap = document.createElement("label");
    muteWrap.className = "dnx-fx-mute";
    var mute = document.createElement("input");
    mute.type = "checkbox";
    mute.checked = !!state.mute;
    muteWrap.appendChild(mute);
    muteWrap.appendChild(document.createTextNode("Stumm"));

    var test = document.createElement("button");
    test.type = "button";
    test.className = "dnx-fx-test";
    test.textContent = "Test";

    bottom.appendChild(muteWrap);
    bottom.appendChild(test);
    box.appendChild(bottom);

    var status = document.createElement("div");
    status.className = "dnx-fx-status";
    status.textContent = "Modus-Ton: aktiv";
    box.appendChild(status);

    function applyCollapsed(){
      var isCollapsed = box.getAttribute("data-dnx-collapsed") === "1";
      [soundRow, bottom, status].forEach(function(el){
        el.style.display = isCollapsed ? "none" : "";
      });
      [vol.closest(".dnx-fx-row"), pitch.closest(".dnx-fx-row"), leng.closest(".dnx-fx-row")].forEach(function(el){
        if(el) el.style.display = isCollapsed ? "none" : "";
      });
      title.classList.remove("openwebrx-rx-details-arrow--up");
      title.classList.remove("openwebrx-rx-details-arrow-up");
      title.classList.remove("openwebrx-rx-details-arrow--down");
      title.classList.remove("openwebrx-rx-details-arrow-down");
      title.textContent = (isCollapsed ? "▸ " : "▾ ") + "FX / Pip";
    }

    title.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      var next = !(box.getAttribute("data-dnx-collapsed") === "1");
      box.setAttribute("data-dnx-collapsed", next ? "1" : "0");
      var st = currentState();
      st.collapsed = next;
      saveState(st);
      applyCollapsed();
    }, true);

    function currentState(){
      return {
        vol: parseInt(vol.value,10)||0,
        pitch: parseInt(pitch.value,10)||100,
        len: parseInt(leng.value,10)||80,
        sound: sel.value || "Soft",
        mute: !!mute.checked,
        collapsed: box.getAttribute("data-dnx-collapsed") === "1"
      };
    }

    function sync(){
      var st = currentState();
      volVal.textContent = st.vol + "%";
      pitchVal.textContent = st.pitch + "%";
      lenVal.textContent = st.len + "ms";
      saveState(st);
    }

    [vol,pitch,leng,sel,mute].forEach(function(el){
      el.addEventListener("input", sync);
      el.addEventListener("change", sync);
    });

    test.addEventListener("click", function(){
      var st = currentState();
      sync();
    applyCollapsed();
      beep(st);
    });

    sync();

    var freqBlock =
      receiver.querySelector(".webrx-actual-freq-holder") ||
      receiver.querySelector(".webrx-actual-freq") ||
      receiver.firstElementChild;

    if(freqBlock && freqBlock.parentNode === receiver){
      receiver.insertBefore(box, freqBlock);
    } else {
      receiver.insertBefore(box, receiver.firstChild);
    }
  }

  function boot(){
    build();
    setTimeout(build, 400);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", boot);

  window.addEventListener("resize", function(){ setTimeout(build, 120); });
})();
/* DNX_FXBOX_INLINE_END */

(function(){
  if(window.__dnxFxTitleDedup) return;
  window.__dnxFxTitleDedup = true;

  function dedup(){
    var box = document.getElementById("dnx-fx-box-inline");
    if(!box) return;

    var titles = box.querySelectorAll(".dnx-fx-title");
    if(titles.length <= 1) return;

    for(var i = 0; i < titles.length - 1; i++){
      titles[i].remove();
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", dedup, {once:true});
  } else {
    dedup();
  }

  window.addEventListener("load", dedup);
  window.setInterval(dedup, 300);
})();


(function(){
  if(window.__dnxFxTitleArrowStrip) return;
  window.__dnxFxTitleArrowStrip = true;

  function clean(){
    var title = document.querySelector("#dnx-fx-box-inline .dnx-fx-title");
    if(!title) return;
    title.classList.remove("openwebrx-rx-details-arrow");
    title.classList.remove("openwebrx-photo-trigger");
    title.classList.remove("openwebrx-rx-details-arrow--up");
    title.classList.remove("openwebrx-rx-details-arrow-up");
    title.classList.remove("openwebrx-rx-details-arrow--down");
    title.classList.remove("openwebrx-rx-details-arrow-down");
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", clean, {once:true});
  } else {
    clean();
  }
  window.addEventListener("load", clean);
  window.setInterval(clean, 300);
})();


/* DNX_FX_MODE_HOOK_START */
(function(){
  if(window.__dnxFxModeHook) return;
  window.__dnxFxModeHook = true;

  var STORE = "dnx_fx_state_v2";
  var lastBeep = 0;
  var MODES = {
    "FM":1,"WFM":1,"AM":1,"LSB":1,"USB":1,"CW":1,"SAM":1,"DATA":1,
    "DMR":1,"D-STAR":1,"DSTAR":1,"NXDN":1,"YSF":1,"M17":1,
    "FREEDV":1,"FREE":1,"RADEL":1,"RADEU":1,"RADE":1,"DRM":1,"DAB":1,"HDR":1,"DIG":1
  };

  function loadState(){
    try{
      return Object.assign({vol:18,pitch:100,len:80,sound:"Soft",mute:false}, JSON.parse(localStorage.getItem(STORE) || "{}"));
    }catch(e){
      return {vol:18,pitch:100,len:80,sound:"Soft",mute:false};
    }
  }

  function beep(state){
    if(state.mute) return;
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return;
      var ctx = new AC();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      var type = "sine";
      var base = 880;
      if(state.sound === "Click"){ type = "square"; base = 1200; }
      if(state.sound === "Digital"){ type = "sawtooth"; base = 1500; }
      if(state.sound === "Retro"){ type = "triangle"; base = 700; }

      osc.type = type;
      osc.frequency.value = Math.max(80, base * (state.pitch/100));
      gain.gain.value = Math.max(0, Math.min(1, state.vol/100)) * 0.12;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      var dur = Math.max(20, state.len);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur/1000);
      osc.stop(ctx.currentTime + dur/1000 + 0.02);

      setTimeout(function(){ try{ ctx.close(); }catch(e){} }, dur + 120);
    }catch(e){}
  }

  function norm(t){
    return String(t || "").replace(/\s+/g, " ").trim().toUpperCase();
  }

  function modeFromTarget(target){
    var n = target;
    while(n && n !== document){
      var txt = norm(n.textContent);
      if(MODES[txt]) return txt;

      var dm = n.getAttribute && (n.getAttribute("data-modulation") || n.getAttribute("data-mode"));
      if(dm){
        dm = norm(dm);
        if(MODES[dm]) return dm;
      }

      n = n.parentNode;
    }
    return null;
  }

  function updateStatus(mode){
    var el = document.querySelector("#dnx-fx-box-inline .dnx-fx-status, #dnx-fx-box .dnx-fx-status");
    if(el){
      el.textContent = "Modus-Ton: aktiv" + (mode ? " (" + mode + ")" : "");
    }
  }

  function hook(){
    var receiver = document.getElementById("openwebrx-panel-receiver");
    if(!receiver || receiver.dataset.dnxFxModeHook === "1") return;
    receiver.dataset.dnxFxModeHook = "1";

    receiver.addEventListener("click", function(e){
      var mode = modeFromTarget(e.target);
      if(!mode) return;

      var now = Date.now();
      if(now - lastBeep < 120) return;
      lastBeep = now;

      var st = loadState();
      updateStatus(mode);
      beep(st);
    }, true);
  }

  function boot(){
    hook();
    setTimeout(hook, 400);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){
    setTimeout(hook, 500);
  });

  window.addEventListener("resize", function(){ setTimeout(hook, 120); });
})();
/* DNX_FX_MODE_HOOK_END */







/* DNX_RECEIVER_OVERLAY_TOGGLE_SIMPLE_START */
(function(){
  if(window.__dnxReceiverOverlayToggleSimple) return;
  window.__dnxReceiverOverlayToggleSimple = true;

  var VIS_KEY = "dnx.receiver.overlay.visible";
  var WRAP_ID = "dnx-receiver-overlay";
  var BTN_SEL = '[data-toggle-panel="openwebrx-panel-receiver"]';

  function getWrap(){ return document.getElementById(WRAP_ID); }

  function loadVisible(){
    var mobileDefault = !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
    try{
      var raw = localStorage.getItem(VIS_KEY);
      if(raw === null) return !mobileDefault;
      return raw === "1";
    }catch(e){
      return !mobileDefault;
    }
  }

  function saveVisible(v){
    try{ localStorage.setItem(VIS_KEY, v ? "1" : "0"); }catch(e){}
  }

  function applyState(){
    var wrap = getWrap();
    if(!wrap) return;

    var open = loadVisible();
    wrap.style.setProperty("display", open ? "block" : "none", "important");
    if(open) wrap.style.setProperty("visibility", "visible", "important");

    document.querySelectorAll(BTN_SEL).forEach(function(btn){
      btn.classList.toggle("openwebrx-button-selected", open);
      btn.setAttribute("aria-pressed", open ? "true" : "false");
    });
  }

  function bindButtons(){
    document.querySelectorAll(BTN_SEL).forEach(function(btn){
      if(btn.dataset.dnxReceiverOverlayToggleSimpleBound === "1") return;
      btn.dataset.dnxReceiverOverlayToggleSimpleBound = "1";

      btn.addEventListener("click", function(ev){
        var wrap = getWrap();
        if(!wrap) return;

        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        saveVisible(!loadVisible());
        applyState();
        return false;
      }, true);
    });
  }

  function boot(){
    bindButtons();
    applyState();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){ setTimeout(boot, 250); });
})();
 /* DNX_RECEIVER_OVERLAY_TOGGLE_SIMPLE_END */

/* DNX_RECEIVER_OVERLAY_TOGGLE_SIMPLE_START */
(function(){
  if(window.__dnxReceiverOverlayToggleSimple) return;
  window.__dnxReceiverOverlayToggleSimple = true;

  var VIS_KEY = "dnx.receiver.overlay.visible";
  var WRAP_ID = "dnx-receiver-overlay";
  var BTN_SEL = '[data-toggle-panel="openwebrx-panel-receiver"]';

  function getWrap(){ return document.getElementById(WRAP_ID); }

  function loadVisible(){
    var mobileDefault = !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
    try{
      var raw = localStorage.getItem(VIS_KEY);
      if(raw === null) return !mobileDefault;
      return raw === "1";
    }catch(e){
      return !mobileDefault;
    }
  }

  function saveVisible(v){
    try{ localStorage.setItem(VIS_KEY, v ? "1" : "0"); }catch(e){}
  }

  function applyState(){
    var wrap = getWrap();
    if(!wrap) return;

    var open = loadVisible();
    wrap.style.setProperty("display", open ? "block" : "none", "important");
    if(open) wrap.style.setProperty("visibility", "visible", "important");

    document.querySelectorAll(BTN_SEL).forEach(function(btn){
      btn.classList.toggle("openwebrx-button-selected", open);
      btn.setAttribute("aria-pressed", open ? "true" : "false");
    });
  }

  function bindButtons(){
    document.querySelectorAll(BTN_SEL).forEach(function(btn){
      if(btn.dataset.dnxReceiverOverlayToggleSimpleBound === "1") return;
      btn.dataset.dnxReceiverOverlayToggleSimpleBound = "1";

      btn.addEventListener("click", function(ev){
        var wrap = getWrap();
        if(!wrap) return;

        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        saveVisible(!loadVisible());
        applyState();
        return false;
      }, true);
    });
  }

  function boot(){
    bindButtons();
    applyState();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){ setTimeout(boot, 250); });
})();
 /* DNX_RECEIVER_OVERLAY_TOGGLE_SIMPLE_END */

/* DNX_RECEIVER_OVERLAY_RESIZE_START */
(function(){
  if(window.__dnxReceiverOverlayResize) return;
  window.__dnxReceiverOverlayResize = true;

  var WRAP_ID = "dnx-receiver-overlay";
  var BODY_ID = "dnx-receiver-overlay-body";
  var PANEL_ID = "openwebrx-panel-receiver";
  var STYLE_ID = "dnx-receiver-overlay-resize-style";
  var SIZE_KEY = "dnx.receiver.overlay.size.v2";
  var BAR_H = 10;
  var MIN_W = 260;
  var MIN_H = 320;
  var MAX_W = Math.max(520, window.innerWidth - 40);
  var MAX_H = Math.max(520, window.innerHeight - 40);

  var resizing = false;
  var mode = null;
  var sx = 0, sy = 0;
  var startW = 0, startH = 0, startL = 0, startT = 0;

  function getWrap(){ return document.getElementById(WRAP_ID); }
  function getBody(){ return document.getElementById(BODY_ID); }
  function getPanel(){ return document.getElementById(PANEL_ID); }

  function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

  function loadSize(){
    try{
      var raw = localStorage.getItem(SIZE_KEY);
      if(!raw) return null;
      var v = JSON.parse(raw);
      if(typeof v.w !== "number" || typeof v.h !== "number") return null;
      return v;
    }catch(e){
      return null;
    }
  }

  function saveSize(w, h){
    try{ localStorage.setItem(SIZE_KEY, JSON.stringify({w: Math.round(w), h: Math.round(h)})); }catch(e){}
  }

  function ensureStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#dnx-receiver-overlay .dnx-resize-handle{position:absolute;z-index:2147483647;background:transparent;}",
      "#dnx-receiver-overlay .dnx-rh-n{left:12px;right:12px;top:-4px;height:8px;cursor:ns-resize;}",
      "#dnx-receiver-overlay .dnx-rh-s{left:12px;right:12px;bottom:-4px;height:8px;cursor:ns-resize;}",
      "#dnx-receiver-overlay .dnx-rh-w{top:12px;bottom:12px;left:-4px;width:8px;cursor:ew-resize;}",
      "#dnx-receiver-overlay .dnx-rh-e{top:12px;bottom:12px;right:-4px;width:8px;cursor:ew-resize;}",
      "#dnx-receiver-overlay .dnx-rh-nw{left:-6px;top:-6px;width:14px;height:14px;cursor:nwse-resize;}",
      "#dnx-receiver-overlay .dnx-rh-ne{right:-6px;top:-6px;width:14px;height:14px;cursor:nesw-resize;}",
      "#dnx-receiver-overlay .dnx-rh-sw{left:-6px;bottom:-6px;width:14px;height:14px;cursor:nesw-resize;}",
      "#dnx-receiver-overlay .dnx-rh-se{right:-6px;bottom:-6px;width:14px;height:14px;cursor:nwse-resize;}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function applySize(w, h, left, top){
    var wrap = getWrap();
    var body = getBody();
    var panel = getPanel();
    if(!wrap || !body || !panel) return;

    MAX_W = Math.max(MIN_W, window.innerWidth - 20);
    MAX_H = Math.max(MIN_H, window.innerHeight - 20);

    w = clamp(w, MIN_W, MAX_W);
    h = clamp(h, MIN_H, MAX_H);

    if(typeof left === "number"){
      left = clamp(left, 0, window.innerWidth - w);
      wrap.style.setProperty("left", Math.round(left) + "px", "important");
    }
    if(typeof top === "number"){
      top = clamp(top, 0, window.innerHeight - h);
      wrap.style.setProperty("top", Math.round(top) + "px", "important");
    }

    var innerW = Math.round(w - 6);
    var innerH = Math.round(h - BAR_H - 4);

    body.style.setProperty("width", innerW + "px", "important");
    body.style.setProperty("min-width", innerW + "px", "important");
    body.style.setProperty("max-width", innerW + "px", "important");
    body.style.setProperty("height", innerH + "px", "important");
    body.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("margin", "0", "important");
    body.style.setProperty("padding", "0", "important");
    body.style.setProperty("box-sizing", "border-box", "important");

    panel.style.setProperty("width", innerW + "px", "important");
    panel.style.setProperty("min-width", innerW + "px", "important");
    panel.style.setProperty("max-width", innerW + "px", "important");
    panel.style.setProperty("height", "100%", "important");
    panel.style.setProperty("margin", "0", "important");

    wrap.style.setProperty("width", (innerW + 4) + "px", "important");
    wrap.style.setProperty("min-width", (innerW + 4) + "px", "important");
    wrap.style.setProperty("max-width", (innerW + 4) + "px", "important");
    wrap.style.setProperty("height", Math.round(h) + "px", "important");
    wrap.style.setProperty("padding-right", "2px", "important");
    wrap.style.setProperty("padding-left", "2px", "important");
    wrap.style.setProperty("box-sizing", "border-box", "important");

    var bar = document.getElementById("dnx-receiver-overlay-bar");
    if(bar){
      bar.style.setProperty("width", (innerW + 2) + "px", "important");
      bar.style.setProperty("min-width", (innerW + 2) + "px", "important");
      bar.style.setProperty("max-width", (innerW + 2) + "px", "important");
      bar.style.setProperty("margin-left", "0", "important");
      bar.style.setProperty("margin-right", "0", "important");
    }

    saveSize(w, h);
  }

  function ensureHandles(){
    var wrap = getWrap();
    if(!wrap) return;
    ensureStyle();

    ["n","s","w","e","nw","ne","sw","se"].forEach(function(pos){
      var cls = "dnx-rh-" + pos;
      if(wrap.querySelector("." + cls)) return;

      var h = document.createElement("div");
      h.className = "dnx-resize-handle " + cls;
      h.setAttribute("data-mode", pos);
      h.addEventListener("mousedown", function(e){
        if(e.button !== 0) return;
        var r = wrap.getBoundingClientRect();
        resizing = true;
        mode = pos;
        sx = e.clientX;
        sy = e.clientY;
        startW = r.width;
        startH = r.height;
        startL = r.left;
        startT = r.top;
        e.preventDefault();
        e.stopPropagation();
      }, true);
      wrap.appendChild(h);
    });
  }

  function boot(){
    ensureHandles();
    var wrap = getWrap();
    if(!wrap) return;
    var saved = loadSize();
    if(saved){
      applySize(saved.w, saved.h);
    } else {
      var r = wrap.getBoundingClientRect();
      applySize(r.width || 320, r.height || 520);
    }
  }

  document.addEventListener("mousemove", function(e){
    if(!resizing) return;

    var dx = e.clientX - sx;
    var dy = e.clientY - sy;

    var w = startW;
    var h = startH;
    var l = startL;
    var t = startT;

    if(mode.indexOf("e") !== -1) w = startW + dx;
    if(mode.indexOf("s") !== -1) h = startH + dy;
    if(mode.indexOf("w") !== -1){ w = startW - dx; l = startL + dx; }
    if(mode.indexOf("n") !== -1){ h = startH - dy; t = startT + dy; }

    if(w < MIN_W){
      if(mode.indexOf("w") !== -1) l -= (MIN_W - w);
      w = MIN_W;
    }
    if(h < MIN_H){
      if(mode.indexOf("n") !== -1) t -= (MIN_H - h);
      h = MIN_H;
    }

    applySize(w, h, l, t);
  }, true);

  document.addEventListener("mouseup", function(){
    resizing = false;
    mode = null;
  }, true);

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 200); }, {once:true});
  } else {
    setTimeout(boot, 200);
  }

  window.addEventListener("load", function(){ setTimeout(boot, 300); });
  window.addEventListener("resize", function(){ setTimeout(boot, 120); });
})();
/* DNX_RECEIVER_OVERLAY_RESIZE_END */

/* DNX_FRAME_RUNTIME_BALANCE_START */
(function(){
  if(window.__dnxFrameRuntimeBalance) return;
  window.__dnxFrameRuntimeBalance = true;

  function fit(){
    var wrap  = document.getElementById("dnx-receiver-overlay");
    var body  = document.getElementById("dnx-receiver-overlay-body");
    var panel = document.getElementById("openwebrx-panel-receiver");
    var bar   = document.getElementById("dnx-receiver-overlay-bar");
    if(!wrap || !body || !panel || !bar) return;

    var pw = Math.round(panel.getBoundingClientRect().width);
    var ph = Math.round(panel.getBoundingClientRect().height);
    if(!pw || pw < 100) return;

    var leftPad = 1;
    var rightPad = 3;
    var topPad = 2;
    var bottomPad = 2;

    wrap.style.setProperty("padding-left", leftPad + "px", "important");
    wrap.style.setProperty("padding-right", rightPad + "px", "important");
    wrap.style.setProperty("padding-top", topPad + "px", "important");
    wrap.style.setProperty("padding-bottom", bottomPad + "px", "important");
    wrap.style.setProperty("box-sizing", "border-box", "important");

    body.style.setProperty("width", pw + "px", "important");
    body.style.setProperty("min-width", pw + "px", "important");
    body.style.setProperty("max-width", pw + "px", "important");
    if(ph > 100){
      body.style.setProperty("height", ph + "px", "important");
    }

    panel.style.setProperty("width", pw + "px", "important");
    panel.style.setProperty("min-width", pw + "px", "important");
    panel.style.setProperty("max-width", pw + "px", "important");
    panel.style.setProperty("margin", "0", "important");

    wrap.style.setProperty("width", (pw + leftPad + rightPad) + "px", "important");
    wrap.style.setProperty("min-width", (pw + leftPad + rightPad) + "px", "important");
    wrap.style.setProperty("max-width", (pw + leftPad + rightPad) + "px", "important");

    bar.style.setProperty("width", (pw + rightPad - 1) + "px", "important");
    bar.style.setProperty("min-width", (pw + rightPad - 1) + "px", "important");
    bar.style.setProperty("max-width", (pw + rightPad - 1) + "px", "important");
    bar.style.setProperty("margin-left", "0", "important");
    bar.style.setProperty("margin-right", "0", "important");
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      setTimeout(fit, 250);
      setTimeout(fit, 900);
    }, {once:true});
  } else {
    setTimeout(fit, 250);
    setTimeout(fit, 900);
  }

  window.addEventListener("load", function(){ setTimeout(fit, 300); });
  window.addEventListener("resize", function(){ setTimeout(fit, 120); });
})();
/* DNX_FRAME_RUNTIME_BALANCE_END */

/* DNX_FRAME_SYMMETRY_FIX_START */
(function(){
  if(window.__dnxFrameSymmetryFix) return;
  window.__dnxFrameSymmetryFix = true;

  function fit(){
    var wrap  = document.getElementById("dnx-receiver-overlay");
    var body  = document.getElementById("dnx-receiver-overlay-body");
    var panel = document.getElementById("openwebrx-panel-receiver");
    var bar   = document.getElementById("dnx-receiver-overlay-bar");
    if(!wrap || !body || !panel || !bar) return;

    var pw = Math.round(panel.getBoundingClientRect().width);
    var ph = Math.round(panel.getBoundingClientRect().height);
    if(!pw || pw < 100) return;

    var side = 2;
    var top = 2;
    var bottom = 2;

    wrap.style.setProperty("box-sizing", "border-box", "important");
    wrap.style.setProperty("padding-left", side + "px", "important");
    wrap.style.setProperty("padding-right", side + "px", "important");
    wrap.style.setProperty("padding-top", top + "px", "important");
    wrap.style.setProperty("padding-bottom", bottom + "px", "important");
    wrap.style.setProperty("width", (pw + side + side) + "px", "important");
    wrap.style.setProperty("min-width", (pw + side + side) + "px", "important");
    wrap.style.setProperty("max-width", (pw + side + side) + "px", "important");

    body.style.setProperty("box-sizing", "border-box", "important");
    body.style.setProperty("width", pw + "px", "important");
    body.style.setProperty("min-width", pw + "px", "important");
    body.style.setProperty("max-width", pw + "px", "important");
    body.style.setProperty("margin", "0", "important");
    body.style.setProperty("padding", "0", "important");
    if(ph > 100){
      body.style.setProperty("height", ph + "px", "important");
    }

    panel.style.setProperty("box-sizing", "border-box", "important");
    panel.style.setProperty("width", pw + "px", "important");
    panel.style.setProperty("min-width", pw + "px", "important");
    panel.style.setProperty("max-width", pw + "px", "important");
    panel.style.setProperty("margin", "0", "important");

    bar.style.setProperty("box-sizing", "border-box", "important");
    bar.style.setProperty("display", "block", "important");
    bar.style.setProperty("width", pw + "px", "important");
    bar.style.setProperty("min-width", pw + "px", "important");
    bar.style.setProperty("max-width", pw + "px", "important");
    bar.style.setProperty("margin", "0", "important");
    bar.style.setProperty("left", "0", "important");
    bar.style.setProperty("right", "auto", "important");
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      setTimeout(fit, 250);
      setTimeout(fit, 900);
    }, {once:true});
  } else {
    setTimeout(fit, 250);
    setTimeout(fit, 900);
  }

  window.addEventListener("load", function(){ setTimeout(fit, 300); });
  window.addEventListener("resize", function(){ setTimeout(fit, 120); });
})();
/* DNX_FRAME_SYMMETRY_FIX_END */

/* DNX_FX_COLLAPSE_START */
(function(){
  if(window.__dnxFxCollapse) return;
  window.__dnxFxCollapse = true;

  var KEY = "dnx.fx.collapsed.v2";

  function loadState(){
    try{ return localStorage.getItem(KEY) === "1"; }catch(e){ return false; }
  }

  function saveState(v){
    try{ localStorage.setItem(KEY, v ? "1" : "0"); }catch(e){}
  }

  function apply(box, collapsed){
    var rows = box.querySelectorAll(".dnx-fx-row, .dnx-fx-bottom, .dnx-fx-status");
    var arrow = box.querySelector(".dnx-fx-collapse-arrow");
    rows.forEach(function(el){
      el.style.setProperty("display", collapsed ? "none" : "", "important");
    });
    if(arrow) arrow.textContent = collapsed ? "▸" : "▾";
  }

  function enhance(){
    var box = document.getElementById("dnx-fx-box-inline") || document.getElementById("dnx-fx-box");
    if(!box) return;

    var title = box.querySelector(".dnx-fx-title");
    if(!title) return;

    var arrow = box.querySelector(".dnx-fx-collapse-arrow");
    if(!arrow){
      arrow = document.createElement("span");
      arrow.className = "dnx-fx-collapse-arrow";
      arrow.style.cssText = "display:inline-block;margin-right:6px;color:#fff;font-size:13px;cursor:pointer;min-width:10px;";
      title.insertBefore(arrow, title.firstChild);
    }

    if(title.dataset.dnxFxCollapseBound !== "1"){
      title.dataset.dnxFxCollapseBound = "1";
      title.style.setProperty("cursor", "pointer", "important");
      title.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        var collapsed = !(box.getAttribute("data-dnx-collapsed") === "1");
        box.setAttribute("data-dnx-collapsed", collapsed ? "1" : "0");
        saveState(collapsed);
        apply(box, collapsed);
      }, true);
    }

    var collapsed = loadState();
    box.setAttribute("data-dnx-collapsed", collapsed ? "1" : "0");
    apply(box, collapsed);
  }

  function boot(){
    enhance();
    setTimeout(enhance, 400);
    setTimeout(enhance, 1200);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){ setTimeout(enhance, 300); });
})();
/* DNX_FX_COLLAPSE_END */



/* DNX_FX_COLLAPSE_STYLE_START */
(function(){
  if(window.__dnxFxCollapseStyle) return;
  window.__dnxFxCollapseStyle = true;

  function styleIt(){
    var box = document.getElementById("dnx-fx-box-inline") || document.getElementById("dnx-fx-box");
    if(!box) return;

    var title = box.querySelector(".dnx-fx-title");
    var arrow = box.querySelector(".dnx-fx-collapse-arrow");
    if(!title || !arrow) return;

    title.style.setProperty("display", "flex", "important");
    title.style.setProperty("align-items", "center", "important");
    title.style.setProperty("gap", "4px", "important");
    title.style.setProperty("font-weight", "700", "important");
    title.style.setProperty("font-size", "13px", "important");
    title.style.setProperty("margin", "0 0 8px 0", "important");
    title.style.setProperty("line-height", "1", "important");

    arrow.style.setProperty("display", "inline-block", "important");
    arrow.style.setProperty("margin-right", "2px", "important");
    arrow.style.setProperty("min-width", "8px", "important");
    arrow.style.setProperty("font-size", "10px", "important");
    arrow.style.setProperty("line-height", "1", "important");
    arrow.style.setProperty("transform", "translateY(-1px)", "important");
    arrow.style.setProperty("opacity", ".95", "important");
    arrow.style.setProperty("color", "#d8d8d8", "important");
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      setTimeout(styleIt, 250);
      setTimeout(styleIt, 900);
    }, {once:true});
  } else {
    setTimeout(styleIt, 250);
    setTimeout(styleIt, 900);
  }

  window.addEventListener("load", function(){ setTimeout(styleIt, 300); });
})();
 /* DNX_FX_COLLAPSE_STYLE_END */

/* DNX_MODES_SWEEP_SAFE_START */
(function(){
  if(window.__dnxModesSweepSafe) return;
  window.__dnxModesSweepSafe = true;

  var MODES = {
    "FM":1,"WFM":1,"AM":1,"LSB":1,"USB":1,"CW":1,"SAM":1,"DATA":1,
    "DMR":1,"D-STAR":1,"DSTAR":1,"NXDN":1,"YSF":1,"M17":1,
    "FREEDV":1,"FREE":1,"RADEL":1,"RADEU":1,"RADE":1,"DRM":1,"DAB":1,"HDR":1,"DIG":1
  };

  function addStyle(){
    if(document.getElementById("dnx-modes-sweep-safe-style")) return;
    var style = document.createElement("style");
    style.id = "dnx-modes-sweep-safe-style";
    style.textContent = `
        position: relative !important;
        overflow: hidden !important;
      }
        content:"";
        position:absolute;
        top:-15%;
        bottom:-15%;
        left:-45%;
        width:28%;
        pointer-events:none;
        opacity:0;
        transform:translateX(0) skewX(-20deg);
        background:linear-gradient(90deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,.10) 35%,
          rgba(255,255,255,.36) 50%,
          rgba(255,255,255,.10) 65%,
          rgba(255,255,255,0) 100%);
      }
      @keyframes dnxModeSweepSafe {
        0%   { opacity:0; transform:translateX(0) skewX(-20deg); }
        12%  { opacity:1; }
        40%  { opacity:1; }
        58%  { opacity:0; transform:translateX(360%) skewX(-20deg); }
        100% { opacity:0; transform:translateX(360%) skewX(-20deg); }
      }
        animation: dnxModeSweepSafe 1.0s linear infinite;
      }
        filter: brightness(1.08);
      }
    `;
    document.head.appendChild(style);
  }

  function markButtons(){
    var root = document.getElementById("openwebrx-panel-receiver");
    if(!root) return;
    root.querySelectorAll("button").forEach(function(btn){
      var t = String(btn.innerText || btn.textContent || "").replace(/\s+/g, " ").trim().toUpperCase();
    });
  }

  function boot(){
    addStyle();
    markButtons();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){ setTimeout(boot, 200); });
  setInterval(markButtons, 1200);
})();
/* DNX_MODES_SWEEP_SAFE_END */




/* DNX_MODES_HOVER_GLOW_START */
(function(){
  if(document.getElementById("dnx-modes-hover-glow-style")) return;
  var style = document.createElement("style");
  style.id = "dnx-modes-hover-glow-style";
  style.textContent = `
    #openwebrx-panel-receiver button:hover{
      filter: brightness(1.12) !important;
      box-shadow: 0 0 10px rgba(255,255,255,.18), inset 0 0 8px rgba(255,255,255,.10) !important;
      transform: translateY(-1px);
      transition: filter .12s linear, box-shadow .12s linear, transform .12s linear;
    }
  `;
  document.head.appendChild(style);
})();
/* DNX_MODES_HOVER_GLOW_END */

/* DNX_MODE_CURRENT_JS_START */
(function(){
  if(window.__dnxModeCurrent) return;
  window.__dnxModeCurrent = true;

  var KEY = "dnx.mode.current.label";
  var MODES = {
    "FM":1,"WFM":1,"AM":1,"LSB":1,"USB":1,"CW":1,"SAM":1,"DATA":1,
    "DMR":1,"D-STAR":1,"DSTAR":1,"NXDN":1,"YSF":1,"M17":1,
    "FREEDV":1,"FREE":1,"RADEL":1,"RADEU":1,"DRM":1,"DAB":1,"HDR":1,
    "DIG":1,"GRABEN":1
  };

  function txt(el){
    return String(el && (el.innerText || el.textContent || "") || "").replace(/\s+/g," ").trim().toUpperCase();
  }

  function save(v){
    try{ localStorage.setItem(KEY, v); }catch(e){}
  }

  function load(){
    try{ return localStorage.getItem(KEY) || ""; }catch(e){ return ""; }
  }

  function modeButtons(){
    var root = document.getElementById("openwebrx-panel-receiver");
    if(!root) return [];
    return Array.from(root.querySelectorAll("button, .openwebrx-button")).filter(function(el){
      return MODES[txt(el)];
    });
  }

  function applyCurrent(label){
    modeButtons().forEach(function(el){
      el.classList.toggle("dnx-mode-current", txt(el) === label);
    });
  }

  function boot(){
    var current = load();
    if(current) applyCurrent(current);

    modeButtons().forEach(function(el){
      if(el.dataset.dnxModeCurrentBound === "1") return;
      el.dataset.dnxModeCurrentBound = "1";
      el.addEventListener("click", function(){
        var label = txt(el);
        save(label);
        setTimeout(function(){ applyCurrent(label); }, 0);
        setTimeout(function(){ applyCurrent(label); }, 120);
      }, true);
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.addEventListener("load", function(){ setTimeout(boot, 250); });
  setInterval(boot, 1200);
})();
/* DNX_MODE_CURRENT_JS_END */

/* DNX_OVERLAY_ROUNDING_START */
(function(){
  if(window.__dnxOverlayRounding) return;
  window.__dnxOverlayRounding = true;

  function addStyle(){
    if(document.getElementById("dnx-overlay-rounding-style")) return;
    var style = document.createElement("style");
    style.id = "dnx-overlay-rounding-style";
    style.textContent = `
      #dnx-receiver-overlay{
        border-radius: 16px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }

      #dnx-receiver-overlay::before,
      #dnx-receiver-overlay::after{
        border-radius: 16px !important;
      }

      #dnx-receiver-overlay-bar{
        border-top-left-radius: 16px !important;
        border-top-right-radius: 16px !important;
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
      }

      #dnx-receiver-overlay-body{
        border-bottom-left-radius: 16px !important;
        border-bottom-right-radius: 16px !important;
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
      }

      #dnx-receiver-overlay-body > *{
        border-bottom-left-radius: 16px !important;
        border-bottom-right-radius: 16px !important;
      }

      #openwebrx-panel-receiver{
        border-radius: 0 0 16px 16px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }

      #openwebrx-panel-receiver .openwebrx-panel,
      #openwebrx-panel-receiver .openwebrx-panel-body,
      #openwebrx-panel-receiver .openwebrx-panel-content{
        border-radius: 0 0 16px 16px !important;
        overflow: hidden !important;
      }

      #dnx-receiver-overlay .dnx-resize-handle{
        border-radius: 10px !important;
      }
    `;
    document.head.appendChild(style);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", addStyle, {once:true});
  } else {
    addStyle();
  }

  window.addEventListener("load", function(){ setTimeout(addStyle, 150); });
})();
 /* DNX_OVERLAY_ROUNDING_END */

/* DNX_DMR_TEXTMATCH_START */
(function(){
  if(window.__dnxDmrTextmatch) return;
  window.__dnxDmrTextmatch = true;

  function txt(el){
    return String(el && (el.innerText || el.textContent || "") || "").replace(/\s+/g," ").trim().toUpperCase();
  }

  function mark(){
    var root = document.getElementById("openwebrx-panel-receiver");
    if(!root) return;
    root.querySelectorAll("button, .openwebrx-button").forEach(function(el){
      var t = txt(el);
      if(t === "DMR") el.classList.add("dnx-pill-dmr");
      if(t === "D-STAR" || t === "DSTAR") el.classList.add("dnx-pill-dstar");
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", mark, {once:true});
  } else {
    mark();
  }
  window.addEventListener("load", function(){ setTimeout(mark, 250); });
  setInterval(mark, 1200);
})();
 /* DNX_DMR_TEXTMATCH_END */

/* DNX_DAB_TEXTMATCH_START */
(function(){
  if(window.__dnxDabTextmatch) return;
  window.__dnxDabTextmatch = true;

  function txt(el){
    return String(el && (el.innerText || el.textContent || "") || "").replace(/\s+/g," ").trim().toUpperCase();
  }

  function mark(){
    var root = document.getElementById("openwebrx-panel-receiver");
    if(!root) return;
    root.querySelectorAll("button, .openwebrx-button").forEach(function(el){
      if(txt(el) === "DAB") el.classList.add("dnx-pill-dab");
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", mark, {once:true});
  } else {
    mark();
  }
  window.addEventListener("load", function(){ setTimeout(mark, 250); });
  setInterval(mark, 1200);
})();
 /* DNX_DAB_TEXTMATCH_END */
/* OWRX_PHOTO_DESC_RESIZE_START */
(function () {
  "use strict";

  var HEADER_SELECTOR = ".webrx-top-container";
  var DESC_SELECTOR = ".openwebrx-description-container";
  var SCALE_SELECTOR = "#openwebrx-scale-container, .openwebrx-scale-container";
  var ARROW_SELECTOR = ".openwebrx-rx-details-arrow";
  var STORAGE_KEY = "owrx.photoDesc.height.v1";
  var STYLE_ID = "owrx-photo-desc-resize-style";
  var DESC_MARKER_ATTR = "data-owrx-photo-resize-ready";
  var HANDLE_MARKER_ATTR = "data-owrx-photo-resize-handle";
  var MOBILE_TOGGLE_ID = "dnx-mobile-photo-info-toggle";
  var MIN_HEIGHT = 120;
  var DRAG_RATIO = 0.55;

  var state = {
    header: null,
    desc: null,
    handle: null,
    pointerId: null,
    dragging: false,
    startClientY: 0,
    startHeight: 0,
    height: null,
    raf: 0,
    mobileMode: null,
    mobileExpanded: false
  };

  function loadHeight() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var value = Number(raw);
      return Number.isFinite(value) ? value : null;
    } catch (err) {
      return null;
    }
  }

  function saveHeight(height) {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Math.round(height)));
    } catch (err) {
      return;
    }
  }

  function isMobileLayout() {
    try {
      return !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
    } catch (err) {
      return (window.innerWidth || 0) <= 640;
    }
  }

  function mobileDefaultHeight() {
    var h = Math.max(320, window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 600);
    return Math.max(150, Math.min(260, Math.floor(h * 0.40)));
  }

  function setImportantIfNeeded(element, property, value) {
    if (!element || !element.style) return;
    if (element.style.getPropertyValue(property) !== value || element.style.getPropertyPriority(property) !== "important") {
      element.style.setProperty(property, value, "important");
    }
  }

  function syncMobileToggle() {
    var button = document.getElementById(MOBILE_TOGGLE_ID);
    if (!button || !isMobileLayout()) return;
    var expanded = !!state.mobileExpanded;
    var label = expanded
      ? "Weniger · Less · Скрыть · Minder ▲"
      : "Mehr Infos · More info · Подробнее · Meer info ▼";
    var ariaExpanded = expanded ? "true" : "false";
    var ariaLabel = expanded
      ? "Weniger Informationen / Show less information / Скрыть информацию / Minder informatie"
      : "Mehr Informationen / Show more information / Показать подробнее / Meer informatie";
    if (button.textContent !== label) button.textContent = label;
    if (button.getAttribute("aria-expanded") !== ariaExpanded) button.setAttribute("aria-expanded", ariaExpanded);
    if (button.getAttribute("aria-label") !== ariaLabel) button.setAttribute("aria-label", ariaLabel);
  }

  function ensureMobileToggle(desc) {
    if (!desc || !isMobileLayout()) return null;
    var title = desc.querySelector(".webrx-rx-photo-title");
    if (!title) return null;

    var button = document.getElementById(MOBILE_TOGGLE_ID);
    if (!button) {
      button = document.createElement("button");
      button.id = MOBILE_TOGGLE_ID;
      button.type = "button";
      button.setAttribute("aria-controls", desc.id || "openwebrx-description-container");
      button.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!state.desc || !isMobileLayout()) return;
        if (state.mobileExpanded) {
          state.mobileExpanded = false;
          state.height = clampHeight(mobileDefaultHeight());
        } else {
          state.mobileExpanded = true;
          var natural = naturalHeight(state.desc);
          var roomy = Math.floor((window.innerHeight || 600) * 0.68);
          state.height = clampHeight(Math.max(natural, roomy));
        }
        applyHeight(state.desc, state.height);
        syncMobileToggle();
      });
    }
    if (button.parentNode !== title.parentNode || button.previousElementSibling !== title) {
      title.insertAdjacentElement("afterend", button);
    }
    syncMobileToggle();
    return button;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      DESC_SELECTOR + "[" + DESC_MARKER_ATTR + "] {",
      "  overflow: hidden !important;",
      "}",
      DESC_SELECTOR + "[" + DESC_MARKER_ATTR + "].expanded {",
      "  transition: none !important;",
      "}",
      SCALE_SELECTOR + "[" + HANDLE_MARKER_ATTR + "] {",
      "  cursor: ns-resize !important;",
      "  touch-action: none !important;",
      "}",
      HEADER_SELECTOR + ".owrx-photo-desc-resizing,",
      HEADER_SELECTOR + ".owrx-photo-desc-resizing * {",
      "  user-select: none !important;",
      "}",
      "html.dnx-mobile-ui " + DESC_SELECTOR + "[" + DESC_MARKER_ATTR + "]{box-sizing:border-box!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;}",
      "html.dnx-mobile-ui " + DESC_SELECTOR + " .webrx-rx-photo-title{font-size:13px!important;line-height:1.28!important;margin-top:8px!important;margin-bottom:8px!important;}",
      "html.dnx-mobile-ui #dnx-photo-desc-toggle-btn{display:none!important;}",
      "html.dnx-mobile-ui #" + MOBILE_TOGGLE_ID + "{display:block!important;width:calc(100% - 30px)!important;box-sizing:border-box!important;margin:6px 15px 10px!important;min-height:36px!important;padding:7px 10px!important;border:1px solid rgba(255,255,255,.7)!important;border-radius:9px!important;background:linear-gradient(100deg,#087f52,#0869a8)!important;color:#fff!important;font:700 12px/1.25 'Segoe UI',Arial,sans-serif!important;white-space:normal!important;text-align:center!important;cursor:pointer!important;touch-action:manipulation!important;}",
      "@media(max-width:640px),(pointer:coarse) and (max-height:520px){",
      "html.dnx-mobile-ui " + DESC_SELECTOR + " .webrx-rx-photo-desc{display:none!important;}",
      "html.dnx-mobile-ui " + DESC_SELECTOR + " .webrx-rx-photo-desc.dnx-mobile-details-open{display:block!important;}",
      "html.dnx-mobile-ui #dnx-live-status{box-sizing:border-box!important;width:calc(100vw - 8px)!important;max-width:calc(100vw - 8px)!important;left:4px!important;right:auto!important;top:4px!important;padding:4px 7px!important;font-size:10px!important;line-height:14px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;pointer-events:none!important;z-index:1!important;}",
      "}",
      "@media(max-width:640px){",
      "html.dnx-mobile-ui,html.dnx-mobile-ui body{overflow-x:hidden!important;max-width:100%!important;}",
      "html.dnx-mobile-ui #openwebrx-bookmarks-container{overflow-x:clip!important;overflow-y:visible!important;}",
      "html.dnx-mobile-ui #openwebrx-panel-status{display:flex!important;flex-wrap:wrap!important;justify-content:center!important;align-content:flex-start!important;gap:4px!important;box-sizing:border-box!important;width:calc(100vw - 8px)!important;max-width:calc(100vw - 8px)!important;margin-left:auto!important;margin-right:auto!important;}",
      "html.dnx-mobile-ui #openwebrx-panel-status .openwebrx-progressbar{display:block!important;flex:0 0 calc(50% - 2px)!important;width:calc(50% - 2px)!important;max-width:calc(50% - 2px)!important;min-width:0!important;box-sizing:border-box!important;margin:0!important;}",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function getHeaderApi() {
    if (!window.jQuery) return null;
    var $header = window.jQuery(HEADER_SELECTOR);
    if (!$header.length) return null;
    return $header.data("header") || null;
  }

  function ensureExpanded(desc) {
    var api = getHeaderApi();
    if (api && !api.rx_photo_state && typeof api.open_rx_photo === "function") {
      api.open_rx_photo();
      return;
    }
    if (!desc.classList.contains("expanded")) {
      desc.classList.add("expanded");
    }
  }

  function clampHeight(height) {
    var maxHeight = Math.max(MIN_HEIGHT, Math.floor(window.innerHeight * 0.75));
    return Math.max(MIN_HEIGHT, Math.min(maxHeight, height));
  }

  function naturalHeight(desc) {
    var prevHeight = desc.style.height;
    var prevMaxHeight = desc.style.maxHeight;
    desc.style.height = "auto";
    desc.style.maxHeight = "none";
    var h = Math.ceil(desc.scrollHeight);
    desc.style.height = prevHeight;
    desc.style.maxHeight = prevMaxHeight;
    return h;
  }

  function applyHeight(desc, height) {
    var clamped = clampHeight(height);
    state.height = clamped;
    desc.style.height = Math.round(clamped) + "px";
    desc.style.maxHeight = Math.round(clamped) + "px";
    if (isMobileLayout()) {
      state.mobileExpanded = clamped > mobileDefaultHeight() + 18;
      var details = desc.querySelector(".webrx-rx-photo-desc");
      if (details && details.classList.contains("dnx-mobile-details-open") !== state.mobileExpanded) {
        details.classList.toggle("dnx-mobile-details-open", state.mobileExpanded);
      }
      syncMobileToggle();
    }
  }

  function enforceHeight() {
    state.raf = 0;
    var desc = state.desc || document.querySelector(DESC_SELECTOR);
    if (!desc) return;
    if (!desc.classList.contains("expanded")) return;
    if (state.height == null) return;
    applyHeight(desc, state.height);
  }

  function requestEnforce() {
    if (state.raf) return;
    state.raf = window.requestAnimationFrame(enforceHeight);
  }

  function resolveInitialHeight(desc) {
    if (isMobileLayout()) {
      state.mobileMode = true;
      state.mobileExpanded = false;
      state.height = clampHeight(mobileDefaultHeight());
      if (desc.classList.contains("expanded")) applyHeight(desc, state.height);
      return;
    }
    state.mobileMode = false;
    var saved = loadHeight();
    if (saved != null) {
      state.height = saved;
      if (desc.classList.contains("expanded")) applyHeight(desc, saved);
      return;
    }
    var initial = desc.classList.contains("expanded")
      ? Math.ceil(desc.getBoundingClientRect().height)
      : naturalHeight(desc);
    state.height = clampHeight(initial);
    if (desc.classList.contains("expanded")) applyHeight(desc, state.height);
  }

  function stopDrag() {
    if (!state.dragging || !state.header) return;
    state.dragging = false;
    state.header.classList.remove("owrx-photo-desc-resizing");
    if (state.height != null && !isMobileLayout()) saveHeight(state.height);
  }

  function onPointerMove(event) {
    if (!state.dragging || event.pointerId !== state.pointerId || !state.desc) return;
    var delta = (event.clientY - state.startClientY) * DRAG_RATIO;
    applyHeight(state.desc, state.startHeight + delta);
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (event.pointerId !== state.pointerId) return;
    stopDrag();
    state.pointerId = null;
  }

  function onPointerDown(event) {
    if (event.button !== 0 || !state.desc || !state.header || !state.handle) return;
    ensureExpanded(state.desc);
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.startClientY = event.clientY;
    state.startHeight = state.height != null
      ? state.height
      : Math.ceil(state.desc.getBoundingClientRect().height);
    state.header.classList.add("owrx-photo-desc-resizing");

    if (state.handle.setPointerCapture) {
      try {
        state.handle.setPointerCapture(event.pointerId);
      } catch (err) {
        state.dragging = false;
        state.pointerId = null;
        return;
      }
    }

    event.preventDefault();
  }

  function bindHandle(handle) {
    if (!handle || handle.getAttribute(HANDLE_MARKER_ATTR) === "1") return;
    state.handle = handle;
    handle.setAttribute(HANDLE_MARKER_ATTR, "1");
    handle.addEventListener("pointerdown", onPointerDown, true);
    handle.addEventListener("pointermove", onPointerMove, true);
    handle.addEventListener("pointerup", onPointerUp, true);
    handle.addEventListener("pointercancel", onPointerUp, true);
    handle.addEventListener("lostpointercapture", stopDrag, true);
  }

  function bindDescription(desc) {
    if (!desc || desc.getAttribute(DESC_MARKER_ATTR) === "1") return;
    ensureStyle();
    state.desc = desc;
    desc.setAttribute(DESC_MARKER_ATTR, "1");
    resolveInitialHeight(desc);
    if (isMobileLayout()) ensureMobileToggle(desc);
  }

  function changeLayoutMode(desc, mobile) {
    if (!desc || state.mobileMode === mobile) return;
    state.mobileMode = mobile;
    state.mobileExpanded = false;
    if (mobile) {
      state.height = clampHeight(mobileDefaultHeight());
      ensureMobileToggle(desc);
    } else {
      var button = document.getElementById(MOBILE_TOGGLE_ID);
      if (button && button.parentNode) button.parentNode.removeChild(button);
      var saved = loadHeight();
      var initial = saved != null ? saved : naturalHeight(desc);
      state.height = clampHeight(initial);
    }
    if (desc.classList.contains("expanded")) applyHeight(desc, state.height);
  }

  function refresh() {
    var mobile = isMobileLayout();
    try {
      if (document.documentElement && document.documentElement.classList.contains("dnx-mobile-ui") !== mobile) {
        document.documentElement.classList.toggle("dnx-mobile-ui", mobile);
      }
    } catch (err) {}
    state.header = document.querySelector(HEADER_SELECTOR);
    var desc = document.querySelector(DESC_SELECTOR);
    if (desc && mobile) {
      setImportantIfNeeded(desc, "display", "block");
      setImportantIfNeeded(desc, "visibility", "visible");
      setImportantIfNeeded(desc, "opacity", "1");
    }
    if (desc) bindDescription(desc);
    if (state.desc && state.mobileMode !== mobile) changeLayoutMode(state.desc, mobile);
    if (state.desc && mobile) ensureMobileToggle(state.desc);
    var handle = document.querySelector(SCALE_SELECTOR);
    if (handle) bindHandle(handle);
    if (state.desc && state.desc.classList.contains("expanded") && !state.dragging) {
      requestEnforce();
    }
  }

  function boot() {
    refresh();

    var observer = new MutationObserver(function () {
      refresh();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });

    window.addEventListener("resize", function () {
      refresh();
      if (!state.desc) return;
      var mobile = isMobileLayout();
      if (mobile) {
        if (!state.mobileExpanded) state.height = clampHeight(mobileDefaultHeight());
        else state.height = clampHeight(state.height || mobileDefaultHeight());
      } else {
        if (state.height == null) state.height = clampHeight(naturalHeight(state.desc));
        else state.height = clampHeight(state.height);
      }
      if (state.desc.classList.contains("expanded")) applyHeight(state.desc, state.height);
      if (!mobile && state.height != null) saveHeight(state.height);
    });

    window.setInterval(function () {
      if (!state.dragging && state.desc && state.desc.classList.contains("expanded")) refresh();
    }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
/* OWRX_PHOTO_DESC_RESIZE_END */








/* DNX_FX_ARROW_LATE_FIX_START */
(function(){
  if(window.__dnxFxArrowLateFix) return;
  window.__dnxFxArrowLateFix = true;

  function applyFix(){
    var box = document.getElementById("dnx-fx-box-inline") || document.getElementById("dnx-fx-box");
    if(!box) return false;

    var title = box.querySelector(".dnx-fx-title");
    if(!title) return false;

    var arrow = box.querySelector(".dnx-fx-collapse-arrow");
    if(!arrow){
      arrow = document.createElement("span");
      arrow.className = "dnx-fx-collapse-arrow";
      arrow.textContent = box.getAttribute("data-dnx-collapsed") === "1" ? "▸" : "▾";
      arrow.style.cssText = "display:inline-block;margin-right:2px;min-width:8px;font-size:10px;line-height:1;transform:translateY(-1px);opacity:.95;color:#d8d8d8;";
      title.insertBefore(arrow, title.firstChild);
    }

    title.style.setProperty("display", "flex", "important");
    title.style.setProperty("align-items", "center", "important");
    title.style.setProperty("gap", "4px", "important");
    title.style.setProperty("cursor", "pointer", "important");
    return true;
  }

  var tries = 0;
  var t = setInterval(function(){
    tries++;
    if(applyFix() || tries > 40) clearInterval(t);
  }, 500);

  window.addEventListener("load", function(){ setTimeout(applyFix, 600); });
})();
/* DNX_FX_ARROW_LATE_FIX_END */


/* DNX_ARROW_TOGGLE_FIX_START */
(function(){})();
 /* DNX_ARROW_TOGGLE_FIX_END */

(function(){var s=document.createElement("script");s.src="/static/plugins/receiver/dnx_3dtool/plugin.js?v=FINAL_ONLY_2026-05-01";document.head.appendChild(s);})();

// 3D waterfall (SDRangel port) — dnx_3dtool
Plugins.load("dnx_3dtool");

/* DNX_VISITOR_NOTIFY_START */
(function(){
  "use strict";

  if(window.__dnxVisitorNotifyInstalled) return;
  window.__dnxVisitorNotifyInstalled = true;

  var BOX_ID = "dnx-visitor-notify";
  var STORE_KEY = "dnx.visitor.notify.settings.v1";

  var lastClientCount = null;
  var lastEvent = {
    type: "",
    time: 0
  };

  var pendingNames = {
    join: null,
    leave: null
  };

  var audioContext = null;

  function loadSettings(){
    var defaults = {
      enabled: true,
      sound: true,
      overlay: true,
      overlayOpacity: 88,
      volume: 35,
      tone: "Soft"
    };

    try {
      var saved = JSON.parse(
        localStorage.getItem(STORE_KEY) || "{}"
      );

      return Object.assign(defaults, saved);
    } catch(e) {
      return defaults;
    }
  }

  function saveSettings(settings){
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify(settings)
      );
    } catch(e) {}
  }

  var settings = loadSettings();

  /*
   * Bei jedem vollständigen Seitenstart sind Anzeige und
   * Ton eingeschaltet. Lautstärke und Klang bleiben erhalten.
   */
  settings.enabled = true;
  settings.sound = true;
  settings.overlay = true;
  saveSettings(settings);

  function getAudioContext(){
    try {
      if(!audioContext){
        var AC =
          window.AudioContext ||
          window.webkitAudioContext;

        if(!AC) return null;
        audioContext = new AC();
      }

      if(audioContext.state === "suspended"){
        audioContext.resume();
      }

      return audioContext;
    } catch(e) {
      return null;
    }
  }

  function playTone(type, force){
    if(!force && (!settings.enabled || !settings.sound)){
      return;
    }

    try {
      var ctx = getAudioContext();
      if(!ctx) return;

      var now = ctx.currentTime;

      var preset = settings.tone || "Soft";
      var waveform = "sine";
      var pitchFactor = 1;

      if(preset === "Click"){
        waveform = "square";
        pitchFactor = 1.35;
      } else if(preset === "Digital"){
        waveform = "sawtooth";
        pitchFactor = 1.65;
      } else if(preset === "Retro"){
        waveform = "triangle";
        pitchFactor = 0.78;
      }

      var masterVolume =
        Math.max(0, Math.min(100,
          parseInt(settings.volume, 10) || 0
        )) / 100;

      function note(frequency, start, duration, volume){
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = waveform;
        osc.frequency.setValueAtTime(
          frequency * pitchFactor,
          now + start
        );

        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(
          Math.max(0.0001, volume * masterVolume),
          now + start + 0.015
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + start + duration
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + duration + 0.03);
      }

      if(type === "join"){
        /* Aufsteigender Zweiklang */
        note(660, 0.00, 0.16, 0.10);
        note(880, 0.16, 0.20, 0.12);
      } else {
        /* Absteigender Zweiklang */
        note(660, 0.00, 0.16, 0.10);
        note(440, 0.16, 0.22, 0.11);
      }
    } catch(e) {}
  }

  function buildBox(){
    var receiver =
      document.getElementById("openwebrx-panel-receiver");

    if(!receiver) return null;

    var existing = document.getElementById(BOX_ID);
    if(existing){
      positionBox(existing, receiver);
      return existing;
    }

    var box = document.createElement("div");
    box.id = BOX_ID;

    box.innerHTML = [
      '<style>',
      '#' + BOX_ID + '{',
      '  width:100%;',
      '  box-sizing:border-box;',
      '  margin:0 0 8px 0;',
      '  padding:8px 10px 10px;',
      '  border:1px solid rgba(88,235,255,.75);',
      '  border-radius:9px;',
      '  background:linear-gradient(180deg,',
      '    rgba(20,48,58,.94),',
      '    rgba(22,30,35,.94));',
      '  box-shadow:',
      '    inset 0 1px 0 rgba(255,255,255,.12),',
      '    0 0 10px rgba(0,220,255,.22);',
      '  color:#fff;',
      '  font-family:Arial,sans-serif;',
      '}',

      '#' + BOX_ID + ' *{box-sizing:border-box;}',

      '/* DNX_VISITOR_COLLAPSE_ARROW */',
      '#' + BOX_ID + ' .dnx-visitor-title{',
      '  display:flex;',
      '  align-items:center;',
      '  justify-content:flex-start;',
      '  width:100%;',
      '  min-height:25px;',
      '  margin:0 0 8px;',
      '  padding:2px 3px 6px;',
      '  border-bottom:1px dotted rgba(255,255,255,.30);',
      '  color:#fff;',
      '  font-size:13px;',
      '  font-weight:900;',
      '  line-height:17px;',
      '  cursor:pointer;',
      '  user-select:none;',
      '  -webkit-user-select:none;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-title:hover{',
      '  color:#7feaff;',
      '  text-shadow:0 0 7px rgba(70,225,255,.65);',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-arrow{',
      '  display:inline-flex;',
      '  justify-content:center;',
      '  align-items:center;',
      '  width:16px;',
      '  margin-right:4px;',
      '  color:#bfc4c6;',
      '  font-size:13px;',
      '  font-weight:900;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-title-text{',
      '  flex:1;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-summary{',
      '  color:#8fffb2;',
      '  font-size:10px;',
      '  font-weight:800;',
      '}',

      '#' + BOX_ID + '{',
      '  width:100%;',
      '  max-width:100%;',
      '  box-sizing:border-box;',
      '}',
      '#' + BOX_ID + ' .dnx-visitor-body{',
      '  display:block;',
      '}',

      '#' + BOX_ID + '[data-dnx-collapsed="1"]',
      ' .dnx-visitor-body{',
      '  display:none !important;',
      '}',

      '#' + BOX_ID + '[data-dnx-collapsed="1"]',
      ' .dnx-visitor-title{',
      '  margin-bottom:0;',
      '  padding-bottom:2px;',
      '  border-bottom:0;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-controls{',
      '  display:grid;',
      '  grid-template-columns:1fr 1fr;',
      '  gap:8px;',
      '  margin-bottom:8px;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-toggle{',
      '  display:flex;',
      '  justify-content:center;',
      '  align-items:center;',
      '  gap:6px;',
      '  min-height:30px;',
      '  padding:4px 6px;',
      '  border-radius:8px;',
      '  background:rgba(0,0,0,.25);',
      '  border:1px solid rgba(255,255,255,.18);',
      '  font-size:12px;',
      '  font-weight:700;',
      '  cursor:pointer;',
      '  user-select:none;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-toggle input{',
      '  accent-color:#24e36f;',
      '}',

      '/* DNX_VISITOR_SOUND_CONTROLS */',
      '/* DNX_VISITOR_OVERLAY_CONTROLS */',
      '#' + BOX_ID + ' .dnx-visitor-overlay-settings{',
      '  display:grid;',
      '  grid-template-columns:1fr;',
      '  gap:7px;',
      '  margin:0 0 8px;',
      '  padding:7px;',
      '  border:1px solid rgba(255,255,255,.16);',
      '  border-radius:7px;',
      '  background:rgba(0,0,0,.18);',
      '}',

      '#' + BOX_ID + ' .dnx-overlay-toggle{',
      '  display:flex;',
      '  align-items:center;',
      '  justify-content:center;',
      '  gap:7px;',
      '  min-height:25px;',
      '  color:#fff;',
      '  font-size:12px;',
      '  font-weight:800;',
      '  cursor:pointer;',
      '  user-select:none;',
      '}',

      '#' + BOX_ID + ' .dnx-overlay-toggle input{',
      '  accent-color:#24e36f;',
      '}',

      '#' + BOX_ID + ' .dnx-opacity-row{',
      '  display:grid;',
      '  grid-template-columns:72px 1fr 44px;',
      '  gap:7px;',
      '  align-items:center;',
      '  font-size:12px;',
      '}',

      '#' + BOX_ID + ' .dnx-opacity-row label{',
      '  color:#fff;',
      '  font-weight:700;',
      '}',

      '#' + BOX_ID + ' .dnx-overlay-opacity{',
      '  width:100%;',
      '  margin:0;',
      '  accent-color:#35e57a;',
      '}',

      '#' + BOX_ID + ' .dnx-overlay-opacity-value{',
      '  text-align:right;',
      '  color:#fff;',
      '  font-weight:700;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-audio-settings{',
      '  display:grid;',
      '  grid-template-columns:72px 1fr 44px;',
      '  gap:7px;',
      '  align-items:center;',
      '  margin:0 0 7px;',
      '  font-size:12px;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-audio-settings label{',
      '  color:#fff;',
      '  font-weight:700;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-volume{',
      '  width:100%;',
      '  margin:0;',
      '  accent-color:#35e57a;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-volume-value{',
      '  text-align:right;',
      '  color:#fff;',
      '  font-weight:700;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-tone-select{',
      '  width:100%;',
      '  height:28px;',
      '  padding:2px 7px;',
      '  border:1px solid rgba(255,255,255,.22);',
      '  border-radius:5px;',
      '  background:#353b3e;',
      '  color:#fff;',
      '  font-size:12px;',
      '  font-weight:700;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-test-tone{',
      '  height:28px;',
      '  padding:0 6px;',
      '  border:1px solid rgba(255,255,255,.25);',
      '  border-radius:5px;',
      '  background:linear-gradient(180deg,#e9e9e9,#bdbdbd);',
      '  color:#111;',
      '  font-size:11px;',
      '  font-weight:800;',
      '  cursor:pointer;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-display{',
      '  min-height:78px;',
      '  display:flex;',
      '  flex-direction:column;',
      '  justify-content:center;',
      '  align-items:center;',
      '  text-align:center;',
      '  padding:8px;',
      '  border-radius:9px;',
      '  background:rgba(0,0,0,.34);',
      '  border:1px solid rgba(255,255,255,.14);',
      '  transition:',
      '    background .18s ease,',
      '    border-color .18s ease,',
      '    box-shadow .18s ease;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-display.join{',
      '  background:linear-gradient(180deg,',
      '    rgba(0,120,55,.72),',
      '    rgba(0,65,35,.72));',
      '  border-color:#35ff83;',
      '  box-shadow:0 0 12px rgba(53,255,131,.38);',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-display.leave{',
      '  background:linear-gradient(180deg,',
      '    rgba(145,35,35,.72),',
      '    rgba(75,20,20,.72));',
      '  border-color:#ff6464;',
      '  box-shadow:0 0 12px rgba(255,70,70,.34);',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-headline{',
      '  width:100%;',
      '  overflow:hidden;',
      '  text-overflow:ellipsis;',
      '  white-space:nowrap;',
      '  color:#fff;',
      '  font-size:12px;',
      '  line-height:15px;',
      '  font-weight:900;',
      '  text-shadow:0 1px 3px rgba(0,0,0,.8);',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-name{',
      '  width:100%;',
      '  overflow:hidden;',
      '  text-overflow:ellipsis;',
      '  white-space:nowrap;',
      '  margin-top:2px;',
      '  color:#fff36a;',
      '  font-size:11px;',
      '  line-height:14px;',
      '  font-weight:900;',
      '  text-shadow:0 1px 3px #000;',
      '}',

      '#' + BOX_ID + ' .dnx-visitor-count{',
      '  margin-top:4px;',
      '  color:#b9efff;',
      '  font-size:12px;',
      '  font-weight:700;',
      '}',

      '#' + BOX_ID + '.dnx-notify-disabled',
      ' .dnx-visitor-display{',
      '  opacity:.55;',
      '  box-shadow:none;',
      '}',

      '</style>',

      '<div class="dnx-visitor-controls">',

      '  <label class="dnx-visitor-toggle">',
      '    <input type="checkbox"',
      '      id="dnx-visitor-enabled">',
      '    <span>Anzeige: AN</span>',
      '  </label>',

      '  <label class="dnx-visitor-toggle">',
      '    <input type="checkbox"',
      '      id="dnx-visitor-sound">',
      '    <span>Ton: AN</span>',
      '  </label>',

      '</div>',

      '<div class="dnx-visitor-overlay-settings">',

      '  <label class="dnx-overlay-toggle">',
      '    <input type="checkbox"',
      '      id="dnx-visitor-overlay-enabled">',
      '    <span>Bildschirm: AN</span>',
      '  </label>',

      '  <div class="dnx-opacity-row">',
      '    <label for="dnx-overlay-opacity">Deckkraft</label>',
      '    <input type="range"',
      '      id="dnx-overlay-opacity"',
      '      class="dnx-overlay-opacity"',
      '      min="30" max="100" step="1">',
      '    <div class="dnx-overlay-opacity-value">88%</div>',
      '  </div>',

      '</div>',

      '<div class="dnx-visitor-audio-settings">',
      '  <label for="dnx-visitor-volume">Lautst.</label>',
      '  <input type="range"',
      '    id="dnx-visitor-volume"',
      '    class="dnx-visitor-volume"',
      '    min="0" max="100" step="1">',
      '  <div class="dnx-visitor-volume-value">35%</div>',
      '</div>',

      '<div class="dnx-visitor-audio-settings">',
      '  <label for="dnx-visitor-tone">Sound</label>',
      '  <select id="dnx-visitor-tone"',
      '    class="dnx-visitor-tone-select">',
      '    <option value="Soft">Soft</option>',
      '    <option value="Click">Click</option>',
      '    <option value="Digital">Digital</option>',
      '    <option value="Retro">Retro</option>',
      '  </select>',
      '  <button type="button"',
      '    class="dnx-visitor-test-tone">Test</button>',
      '</div>',

      '<div class="dnx-visitor-display">',
      '  <div class="dnx-visitor-headline">',
      '    Besucheranzeige bereit',
      '  </div>',
      '  <div class="dnx-visitor-name"></div>',
      '  <div class="dnx-visitor-count">',
      '    Nutzer werden überwacht',
      '  </div>',
      '</div>'
    ].join("");

    /*
     * Titelzeile mit Auf-/Zu-Pfeil erzeugen. Der vorhandene
     * Inhalt wird in einen eigenen Body verschoben.
     */
    var title = document.createElement("div");
    title.className = "dnx-visitor-title";
    title.setAttribute("role", "button");
    title.setAttribute("tabindex", "0");
    title.setAttribute("aria-expanded", "true");

    var arrow = document.createElement("span");
    arrow.className = "dnx-visitor-arrow";
    arrow.textContent = "▾";

    var titleText = document.createElement("span");
    titleText.className = "dnx-visitor-title-text";
    titleText.textContent = "Besucher / User";

    var summary = document.createElement("span");
    summary.className = "dnx-visitor-summary";
    summary.textContent = "AN";

    title.appendChild(arrow);
    title.appendChild(titleText);
    title.appendChild(summary);

    var body = document.createElement("div");
    body.className = "dnx-visitor-body";

    /*
     * Das style-Element bleibt direkt im Hauptkasten.
     * Alle Bedienelemente kommen in den aufklappbaren Body.
     */
    var children = Array.prototype.slice.call(
      box.children
    );

    children.forEach(function(child){
      if(child.tagName !== "STYLE"){
        body.appendChild(child);
      }
    });

    var styleElement = box.querySelector("style");

    if(styleElement && styleElement.nextSibling){
      box.insertBefore(title, styleElement.nextSibling);
    } else {
      box.appendChild(title);
    }

    box.appendChild(body);
    box.setAttribute("data-dnx-collapsed", "0");

    function setCollapsed(collapsed){
      box.setAttribute(
        "data-dnx-collapsed",
        collapsed ? "1" : "0"
      );

      arrow.textContent = collapsed ? "▸" : "▾";

      title.setAttribute(
        "aria-expanded",
        collapsed ? "false" : "true"
      );
    }

    function toggleCollapsed(event){
      if(event){
        event.preventDefault();
        event.stopPropagation();
      }

      var collapsed =
        box.getAttribute("data-dnx-collapsed") === "1";

      setCollapsed(!collapsed);
    }

    title.addEventListener(
      "click",
      toggleCollapsed
    );

    title.addEventListener("keydown", function(event){
      if(event.key === "Enter" || event.key === " "){
        toggleCollapsed(event);
      }
    });

    positionBox(box, receiver);
    bindControls(box);
    updateControls(box);

    return box;
  }

  function positionBox(box, receiver){
    var fxBox =
      document.getElementById("dnx-fx-box-inline") ||
      document.getElementById("dnx-fx-box");

    if(fxBox && fxBox.parentNode === receiver){
      if(box.nextSibling !== fxBox){
        receiver.insertBefore(box, fxBox);
      }
    } else if(box.parentNode !== receiver) {
      receiver.insertBefore(box, receiver.firstChild);
    }
  }

  function bindControls(box){
    if(box.dataset.dnxBound === "1") return;
    box.dataset.dnxBound = "1";

    var enabled =
      box.querySelector("#dnx-visitor-enabled");

    var sound =
      box.querySelector("#dnx-visitor-sound");

    var volume =
      box.querySelector("#dnx-visitor-volume");

    var volumeValue =
      box.querySelector(".dnx-visitor-volume-value");

    var tone =
      box.querySelector("#dnx-visitor-tone");

    var testTone =
      box.querySelector(".dnx-visitor-test-tone");

    var overlayEnabled =
      box.querySelector("#dnx-visitor-overlay-enabled");

    var overlayOpacity =
      box.querySelector("#dnx-overlay-opacity");

    var overlayOpacityValue =
      box.querySelector(".dnx-overlay-opacity-value");

    enabled.addEventListener("change", function(){
      settings.enabled = !!enabled.checked;
      saveSettings(settings);
      updateControls(box);

      if(settings.enabled){
        showStatus(
          "Besucheranzeige aktiv",
          "",
          lastClientCount,
          ""
        );
      }
    });

    sound.addEventListener("change", function(){
      settings.sound = !!sound.checked;
      saveSettings(settings);
      updateControls(box);

      if(settings.sound){
        /* Aktiviert Audio nach einem echten Benutzerklick */
        playTone("join", true);
      }
    });

    overlayEnabled.addEventListener("change", function(){
      settings.overlay = !!overlayEnabled.checked;
      saveSettings(settings);
      updateControls(box);

      if(!settings.overlay){
        hideScreenOverlay();
      }
    });

    overlayOpacity.addEventListener("input", function(){
      settings.overlayOpacity =
        Math.max(30, Math.min(100,
          parseInt(overlayOpacity.value, 10) || 88
        ));

      overlayOpacityValue.textContent =
        settings.overlayOpacity + "%";

      saveSettings(settings);

      var currentOverlay =
        document.getElementById(
          "dnx-visitor-screen-overlay"
        );

      if(currentOverlay){
        currentOverlay.style.setProperty(
          "--dnx-overlay-opacity",
          String(settings.overlayOpacity / 100)
        );
      }
    });

    volume.addEventListener("input", function(){
      settings.volume =
        Math.max(0, Math.min(100,
          parseInt(volume.value, 10) || 0
        ));

      volumeValue.textContent =
        settings.volume + "%";

      saveSettings(settings);
    });

    volume.addEventListener("change", function(){
      settings.volume =
        Math.max(0, Math.min(100,
          parseInt(volume.value, 10) || 0
        ));

      saveSettings(settings);

      if(settings.sound){
        playTone("join", true);
      }
    });

    tone.addEventListener("change", function(){
      settings.tone = tone.value || "Soft";
      saveSettings(settings);

      if(settings.sound){
        playTone("join", true);
      }
    });

    testTone.addEventListener("click", function(event){
      event.preventDefault();
      event.stopPropagation();

      settings.volume =
        Math.max(0, Math.min(100,
          parseInt(volume.value, 10) || 0
        ));

      settings.tone = tone.value || "Soft";
      saveSettings(settings);

      playTone("join", true);
    });
  }

  function updateControls(box){
    if(!box) return;

    var enabled =
      box.querySelector("#dnx-visitor-enabled");

    var sound =
      box.querySelector("#dnx-visitor-sound");

    var volume =
      box.querySelector("#dnx-visitor-volume");

    var volumeValue =
      box.querySelector(".dnx-visitor-volume-value");

    var tone =
      box.querySelector("#dnx-visitor-tone");

    var overlayEnabled =
      box.querySelector("#dnx-visitor-overlay-enabled");

    var overlayOpacity =
      box.querySelector("#dnx-overlay-opacity");

    var overlayOpacityValue =
      box.querySelector(".dnx-overlay-opacity-value");

    if(enabled){
      enabled.checked = !!settings.enabled;
      enabled.nextElementSibling.textContent =
        "Anzeige: " + (settings.enabled ? "AN" : "AUS");
    }

    if(sound){
      sound.checked = !!settings.sound;
      sound.nextElementSibling.textContent =
        "Ton: " + (settings.sound ? "AN" : "AUS");
    }

    if(overlayEnabled){
      overlayEnabled.checked = !!settings.overlay;

      overlayEnabled.nextElementSibling.textContent =
        "Bildschirm: " +
        (settings.overlay ? "AN" : "AUS");
    }

    settings.overlayOpacity =
      Math.max(30, Math.min(100,
        parseInt(settings.overlayOpacity, 10) || 88
      ));

    if(overlayOpacity){
      overlayOpacity.value =
        String(settings.overlayOpacity);

      overlayOpacity.disabled =
        !settings.overlay;
    }

    if(overlayOpacityValue){
      overlayOpacityValue.textContent =
        settings.overlayOpacity + "%";
    }

    settings.volume =
      Math.max(0, Math.min(100,
        parseInt(settings.volume, 10) || 0
      ));

    if(volume){
      volume.value = String(settings.volume);
    }

    if(volumeValue){
      volumeValue.textContent =
        settings.volume + "%";
    }

    if(tone){
      var allowedTones = [
        "Soft",
        "Click",
        "Digital",
        "Retro"
      ];

      if(allowedTones.indexOf(settings.tone) < 0){
        settings.tone = "Soft";
      }

      tone.value = settings.tone;
    }

    var summary =
      box.querySelector(".dnx-visitor-summary");

    if(summary){
      summary.textContent =
        settings.enabled ? "AN" : "AUS";

      summary.style.color =
        settings.enabled ? "#8fffb2" : "#ff8a8a";
    }

    box.classList.toggle(
      "dnx-notify-disabled",
      !settings.enabled
    );
  }

  function safeName(name){
    name = String(name || "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim();

    if(!name) return "";
    return name.substring(0, 32);
  }

  /* DNX_VISITOR_SCREEN_OVERLAY */

  var overlayTimer = null;

  function buildScreenOverlay(){
    var overlay =
      document.getElementById("dnx-visitor-screen-overlay");

    if(overlay) return overlay;

    if(!document.getElementById(
      "dnx-visitor-screen-overlay-style"
    )){
      var style = document.createElement("style");
      style.id = "dnx-visitor-screen-overlay-style";

      style.textContent = `
        #dnx-visitor-screen-overlay{
          position:fixed !important;
          left:50% !important;
          top:50% !important;
          transform:
            translate(-50%,-50%)
            scale(.88) !important;
          z-index:2147483646 !important;
          display:none;
          width:min(86vw,680px);
          min-height:180px;
          padding:24px 30px;
          box-sizing:border-box;
          border:3px solid #35ff83;
          border-radius:20px;
          background:
            linear-gradient(
              180deg,
              rgba(5,76,42,.97),
              rgba(3,35,22,.97)
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.22),
            0 0 18px rgba(0,0,0,.85),
            0 0 34px rgba(53,255,131,.72);
          color:#fff;
          text-align:center;
          font-family:Arial,sans-serif;
          cursor:pointer;
          opacity:0;
          pointer-events:none;
          transition:
            opacity .20s ease,
            transform .20s ease;
        }

        #dnx-visitor-screen-overlay.dnx-visible{
          display:flex !important;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          opacity:var(--dnx-overlay-opacity,.88);
          pointer-events:auto;
          transform:
            translate(-50%,-50%)
            scale(1) !important;
        }

        #dnx-visitor-screen-overlay.dnx-join{
          border-color:#35ff83;
          background:
            linear-gradient(
              180deg,
              rgba(5,110,54,.97),
              rgba(3,42,25,.97)
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.22),
            0 0 18px rgba(0,0,0,.85),
            0 0 38px rgba(53,255,131,.80);
        }

        #dnx-visitor-screen-overlay.dnx-leave{
          border-color:#ff5d5d;
          background:
            linear-gradient(
              180deg,
              rgba(130,28,28,.97),
              rgba(55,12,12,.97)
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.20),
            0 0 18px rgba(0,0,0,.85),
            0 0 38px rgba(255,70,70,.75);
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-symbol{
          margin-bottom:6px;
          font-size:42px;
          line-height:44px;
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-headline{
          width:100%;
          overflow:hidden;
          text-overflow:ellipsis;
          color:#fff;
          font-size:34px;
          line-height:40px;
          font-weight:900;
          letter-spacing:1px;
          text-shadow:
            0 2px 4px rgba(0,0,0,.9);
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-name{
          width:100%;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          margin-top:8px;
          color:#fff36a;
          font-size:30px;
          line-height:36px;
          font-weight:900;
          text-shadow:
            0 2px 4px rgba(0,0,0,.95);
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-count{
          margin-top:12px;
          color:#c8f5ff;
          font-size:18px;
          line-height:23px;
          font-weight:800;
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-close{
          margin-top:10px;
          color:rgba(255,255,255,.65);
          font-size:11px;
          font-weight:600;
        }

        @media (max-width:700px){
          #dnx-visitor-screen-overlay{
            width:92vw;
            min-height:150px;
            padding:20px 16px;
          }

          #dnx-visitor-screen-overlay
          .dnx-screen-symbol{
            font-size:32px;
            line-height:34px;
          }

          #dnx-visitor-screen-overlay
          .dnx-screen-headline{
            font-size:25px;
            line-height:30px;
          }

          #dnx-visitor-screen-overlay
          .dnx-screen-name{
            font-size:23px;
            line-height:28px;
          }

          #dnx-visitor-screen-overlay
          .dnx-screen-count{
            font-size:15px;
          }
        }
      `;

      document.head.appendChild(style);
    }

    overlay = document.createElement("div");
    overlay.id = "dnx-visitor-screen-overlay";

    overlay.innerHTML = [
      '<div class="dnx-screen-symbol"></div>',
      '<div class="dnx-screen-headline"></div>',
      '<div class="dnx-screen-name"></div>',
      '<div class="dnx-screen-count"></div>',
      '<div class="dnx-screen-close">',
      '  Zum Schließen anklicken',
      '</div>'
    ].join("");

    overlay.addEventListener("click", function(){
      hideScreenOverlay();
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function hideScreenOverlay(){
    var overlay =
      document.getElementById("dnx-visitor-screen-overlay");

    if(!overlay) return;

    overlay.classList.remove(
      "dnx-visible",
      "dnx-join",
      "dnx-leave"
    );

    if(overlayTimer){
      window.clearTimeout(overlayTimer);
      overlayTimer = null;
    }

    window.setTimeout(function(){
      if(!overlay.classList.contains("dnx-visible")){
        overlay.style.display = "none";
      }
    }, 220);
  }

    /* dnx-compact-overlay v2: Groessen inline, gewinnt gegen jede CSS-Regel */
  function dnxCompact(sym, head, nameEl, countEl, root, hs, ns, cs, w){
    var set = function(el, k, v){
      if(el && el.style){ el.style.setProperty(k, v, "important"); }
    };
    set(sym, "font-size", "10px");
    set(sym, "line-height", "1");
    set(head, "font-size", hs);
    set(head, "line-height", "1.12");
    set(head, "letter-spacing", ".02em");
    set(head, "margin", "0");
    set(nameEl, "font-size", ns);
    set(countEl, "font-size", cs);
    var stopp = root ? root.parentElement : null;
    var el = head, i = 0;
    while(el && el !== document.body && el !== stopp && i < 4){
      set(el, "max-width", w);
      set(el, "box-sizing", "border-box");
      i++; el = el.parentElement;
    }
    set(root, "max-width", w);
    set(root, "box-sizing", "border-box");
    set(root, "padding", "10px 12px");
    var scope = root || (head && head.parentElement);
    if(scope && scope.querySelectorAll){
      var cells = scope.querySelectorAll("table th, table td");
      for(var c = 0; c < cells.length; c++){
        cells[c].style.setProperty("font-size", "11px", "important");
        cells[c].style.setProperty("padding", "3px 6px", "important");
      }
    }
  }

function showScreenOverlay(
    typeText,
    name,
    count,
    type
  ){
    if(!settings.enabled) return;
    if(!settings.overlay) return;
    if(type !== "join" && type !== "leave") return;

    var overlay = buildScreenOverlay();
    if(!overlay) return;

    settings.overlayOpacity =
      Math.max(30, Math.min(100,
        parseInt(settings.overlayOpacity, 10) || 88
      ));

    overlay.style.setProperty(
      "--dnx-overlay-opacity",
      String(settings.overlayOpacity / 100)
    );

    var symbol =
      overlay.querySelector(".dnx-screen-symbol");

    var headline =
      overlay.querySelector(".dnx-screen-headline");

    var nameElement =
      overlay.querySelector(".dnx-screen-name");

    var countElement =
      overlay.querySelector(".dnx-screen-count");

    name = safeName(name);

    symbol.textContent =
      type === "join" ? "●" : "●";

    symbol.style.color =
      type === "join" ? "#35ff83" : "#ff5d5d";

    headline.textContent = typeText;
    dnxCompact(symbol, headline, nameElement, countElement, overlay, '13px', '11px', '10px', '780px');
    nameElement.textContent = name;

    nameElement.style.display =
      name ? "block" : "none";

    if(typeof count === "number"){
      countElement.textContent =
        "Jetzt " + count + " " +
        (count === 1 ? "Nutzer" : "Nutzer");
    } else {
      countElement.textContent = "";
    }

    overlay.style.display = "flex";

    overlay.classList.remove(
      "dnx-visible",
      "dnx-join",
      "dnx-leave"
    );

    /*
     * Browser zu einer neuen Animation zwingen.
     */
    void overlay.offsetWidth;

    overlay.classList.add(
      "dnx-visible",
      type === "join" ? "dnx-join" : "dnx-leave"
    );

    if(overlayTimer){
      window.clearTimeout(overlayTimer);
    }

    overlayTimer = window.setTimeout(
      hideScreenOverlay,
      4000
    );
  }

  function showStatus(typeText, name, count, type){
    var box = buildBox();
    if(!box || !settings.enabled) return;

    var display =
      box.querySelector(".dnx-visitor-display");

    var headline =
      box.querySelector(".dnx-visitor-headline");

    var nameElement =
      box.querySelector(".dnx-visitor-name");

    var countElement =
      box.querySelector(".dnx-visitor-count");

    display.classList.remove("join", "leave");

    if(type === "join" || type === "leave"){
      display.classList.add(type);
    }

    headline.textContent = typeText;
    dnxCompact(null, headline, nameElement, countElement, display, '12px', '11px', '10px', '340px');

    name = safeName(name);
    nameElement.textContent = name;
    nameElement.style.display = name ? "block" : "none";

    if(typeof count === "number"){
      countElement.textContent =
        "Jetzt " + count + " " +
        (count === 1 ? "Nutzer" : "Nutzer");
    } else {
      countElement.textContent = "Nutzerzahl wird ermittelt";
    }

    showScreenOverlay(
      typeText,
      name,
      count,
      type
    );
  }

  function rememberName(type, name){
    name = safeName(name);
    if(!name) return;

    pendingNames[type] = {
      name: name,
      time: Date.now()
    };

    /*
     * Falls das Client-Ereignis unmittelbar vorher kam,
     * wird die generische Anzeige nachträglich um den
     * Chatnamen ergänzt.
     */
    if(
      lastEvent.type === type &&
      Date.now() - lastEvent.time < 3500
    ){
      showStatus(
        type === "join" ? "NEUER USER" : "USER VERLASSEN",
        name,
        lastClientCount,
        type
      );
    }
  }

  function takePendingName(type){
    var entry = pendingNames[type];

    if(
      entry &&
      Date.now() - entry.time < 5000
    ){
      pendingNames[type] = null;
      return entry.name;
    }

    return "";
  }

  function handleClientCount(rawCount){
    var count = parseInt(rawCount, 10);
    if(!Number.isFinite(count)) return;

    /*
     * Beim ersten Ereignis nur Ausgangswert speichern.
     * Die eigene Verbindung soll nicht als fremder
     * neuer Nutzer gemeldet werden.
     */
    if(lastClientCount === null){
      lastClientCount = count;

      showStatus(
        "Besucheranzeige aktiv",
        "",
        count,
        ""
      );

      announceOwnPresence();
      return;
    }

    if(count === lastClientCount) return;

    var type = count > lastClientCount ? "join" : "leave";
    var difference = Math.abs(count - lastClientCount);
    var name = takePendingName(type);

    lastClientCount = count;
    lastEvent.type = type;
    lastEvent.time = Date.now();

    if(type === "join"){
      showStatus(
        difference > 1
          ? difference + " NEUE USER"
          : "NEUER USER",
        name,
        count,
        "join"
      );
    } else {
      showStatus(
        difference > 1
          ? difference + " USER VERLASSEN"
          : "USER VERLASSEN",
        name,
        count,
        "leave"
      );
    }

    playTone(type, false);
  }

  function hookClientEvent(){
    if(!window.jQuery) return false;

    if(document.documentElement.dataset.dnxVisitorClientHook === "1"){
      return true;
    }

    document.documentElement.dataset.dnxVisitorClientHook = "1";

    window.jQuery(document).on(
      "server:clients:after",
      function(event, count){
        handleClientCount(count);
      }
    );

    return true;
  }

  /* DNX_VISITOR_CHATNAME_UPDATE */

  function isAutomaticUserName(name){
    return /^User\d+$/i.test(
      String(name || "").trim()
    );
  }

  function updateVisibleChatName(name){
    name = safeName(name);

    /*
     * Automatisch erzeugte OpenWebRX-Namen wie User3
     * gelten nicht als vom Nutzer gewählter Chatname.
     */
    if(!name || isAutomaticUserName(name)){
      return;
    }

    var box =
      document.getElementById("dnx-visitor-notify");

    if(!box) return;

    var headline =
      box.querySelector(".dnx-visitor-headline");

    var nameElement =
      box.querySelector(".dnx-visitor-name");

    if(headline){
      headline.textContent = "USER IM CHAT";
    }

    if(nameElement){
      nameElement.textContent = name;
      nameElement.style.display = "block";
    }

    /*
     * Falls gerade die große Bildschirmmeldung sichtbar ist,
     * dort den automatischen Namen ebenfalls ersetzen.
     */
    var overlay =
      document.getElementById(
        "dnx-visitor-screen-overlay"
      );

    if(
      overlay &&
      overlay.classList.contains("dnx-visible")
    ){
      var screenName =
        overlay.querySelector(".dnx-screen-name");

      if(screenName){
        screenName.textContent = name;
        screenName.style.display = "block";
      }
    }
  }

  function hookChat(){
    if(
      typeof window.Chat === "undefined" ||
      typeof Chat.recvMessage !== "function"
    ){
      return false;
    }

    if(Chat.recvMessage.__dnxVisitorWrapped){
      return true;
    }

    var originalReceive = Chat.recvMessage;

    function wrappedReceive(nickname, text, color){
      var normalized = String(text || "").trim();

      if(normalized === "__DNX_VISITOR_JOIN__"){
        rememberName("join", nickname);
        return;
      }

      if(normalized === "__DNX_VISITOR_LEAVE__"){
        rememberName("leave", nickname);
        return;
      }

      /*
       * Bei einer normalen Chatnachricht ist nickname der
       * aktuell vom Nutzer gewählte Name. Damit wird User3
       * sofort durch beispielsweise DNX ersetzt.
       */
      updateVisibleChatName(nickname);

      return originalReceive.apply(
        this,
        arguments
      );
    }

    wrappedReceive.__dnxVisitorWrapped = true;
    wrappedReceive.__dnxVisitorOriginal = originalReceive;
    Chat.recvMessage = wrappedReceive;

    return true;
  }

  var ownPresenceSent = false;

  function getOwnName(){
    try {
      if(typeof Chat !== "undefined" && Chat.nickname){
        return safeName(Chat.nickname);
      }

      if(typeof LS !== "undefined" && LS.has("chatname")){
        return safeName(LS.loadStr("chatname"));
      }

      return safeName(
        localStorage.getItem("chatname") || ""
      );
    } catch(e) {
      return "";
    }
  }

  function announceOwnPresence(){
    if(ownPresenceSent) return;

    var name = getOwnName();
    if(!name) return;

    if(
      typeof Chat === "undefined" ||
      typeof Chat.sendMessage !== "function"
    ){
      return;
    }

    ownPresenceSent = true;

    window.setTimeout(function(){
      try {
        Chat.sendMessage(
          "__DNX_VISITOR_JOIN__",
          name
        );
      } catch(e) {}
    }, 250);
  }

  function announceOwnDeparture(){
    var name = getOwnName();
    if(!name) return;

    try {
      if(
        typeof Chat !== "undefined" &&
        typeof Chat.sendMessage === "function"
      ){
        Chat.sendMessage(
          "__DNX_VISITOR_LEAVE__",
          name
        );
      }
    } catch(e) {}
  }

  function hookNicknameChanges(){
    if(
      typeof window.Chat === "undefined" ||
      typeof Chat.setNickname !== "function"
    ){
      return false;
    }

    if(Chat.setNickname.__dnxVisitorWrapped){
      return true;
    }

    var originalSetNickname = Chat.setNickname;

    function wrappedSetNickname(nickname){
      var result = originalSetNickname.apply(
        this,
        arguments
      );

      ownPresenceSent = false;
      window.setTimeout(announceOwnPresence, 100);

      return result;
    }

    wrappedSetNickname.__dnxVisitorWrapped = true;
    Chat.setNickname = wrappedSetNickname;

    return true;
  }

  /* DNX_VISITOR_DOM_POLL_FIX */

  /*
   * Einige OpenWebRX+-Versionen senden das Clients-Ereignis,
   * bevor die Plugins vollständig geladen sind. Deshalb lesen
   * wir zusätzlich die sichtbare Nutzerzahl aus dem Statusfeld.
   */
  function readClientCountFromDom(){
    var selectors = [
      "#openwebrx-bar-clients .openwebrx-progressbar-text",
      "#openwebrx-bar-clients",
      '[data-type="clients"]',
      '[data-metric="clients"]'
    ];

    for(var i = 0; i < selectors.length; i++){
      var element = document.querySelector(selectors[i]);
      if(!element) continue;

      var text = String(element.textContent || "")
        .replace(/\s+/g, " ")
        .trim();

      /*
       * Bevorzugt Zahlen in eckigen Klammern:
       * Clients [2]
       */
      var match = text.match(/\[\s*(\d+)\s*\]/);

      /*
       * Alternativ Formate wie:
       * Clients: 2
       * USER: 2
       * Connections 2
       */
      if(!match){
        match = text.match(
          /(?:clients?|users?|connections?|nutzer)\D{0,12}(\d+)/i
        );
      }

      /*
       * Letzter Rückfall: Wenn das Element nur eine Zahl enthält.
       */
      if(!match && /^\s*\d+\s*$/.test(text)){
        match = text.match(/(\d+)/);
      }

      if(match){
        var count = parseInt(match[1], 10);

        if(Number.isFinite(count)){
          return count;
        }
      }
    }

    return null;
  }

  function pollClientCount(){
    var count = readClientCountFromDom();

    if(count !== null){
      handleClientCount(count);
    }
  }

  window.__dnxVisitorPollClientCount = pollClientCount;

  function boot(){
    var box = buildBox();

    hookClientEvent();
    hookChat();
    hookNicknameChanges();

    if(box) updateControls(box);

    pollClientCount();

    /*
     * OpenWebRX erzeugt Teile des Receiver-Panels dynamisch.
     * Deshalb Position, Nutzerzahl und Hooks regelmäßig
     * kontrollieren.
     */
    if(!window.__dnxVisitorMainTimer){
      window.__dnxVisitorMainTimer = window.setInterval(function(){
        buildBox();
        hookClientEvent();
        hookChat();
        hookNicknameChanges();
        pollClientCount();
      }, 700);
    }
  }

  window.addEventListener(
    "beforeunload",
    announceOwnDeparture
  );

  if(document.readyState === "loading"){
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {once:true}
    );
  } else {
    boot();
  }

  window.addEventListener("load", function(){
    window.setTimeout(boot, 300);
  });
})();
/* DNX_VISITOR_NOTIFY_END */

/* DNX_FXPIP_ARROW_REPAIR_START */
(function(){
  "use strict";

  if(window.__dnxFxPipArrowRepair) return;
  window.__dnxFxPipArrowRepair = true;

  var STORE = "dnx_fx_state_v2";

  function getBox(){
    return (
      document.getElementById("dnx-fx-box-inline") ||
      document.getElementById("dnx-fx-box")
    );
  }

  function getTitle(box){
    if(!box) return null;

    var titles = box.querySelectorAll(".dnx-fx-title");

    /*
     * Falls alter Code erneut zwei Titel erzeugt, nur den
     * letzten Titel verwenden und die übrigen entfernen.
     */
    if(titles.length > 1){
      for(var i = 0; i < titles.length - 1; i++){
        titles[i].remove();
      }
    }

    return box.querySelector(".dnx-fx-title");
  }

  function loadState(){
    try {
      return JSON.parse(
        localStorage.getItem(STORE) || "{}"
      );
    } catch(e) {
      return {};
    }
  }

  function saveCollapsed(collapsed){
    try {
      var state = loadState();
      state.collapsed = !!collapsed;

      localStorage.setItem(
        STORE,
        JSON.stringify(state)
      );
    } catch(e) {}
  }

  function applyState(box, collapsed){
    if(!box) return;

    box.setAttribute(
      "data-dnx-collapsed",
      collapsed ? "1" : "0"
    );

    var title = getTitle(box);

    if(title){
      title.textContent =
        (collapsed ? "▸ " : "▾ ") + "FX / Pip";

      title.setAttribute(
        "aria-expanded",
        collapsed ? "false" : "true"
      );

      title.setAttribute("role", "button");
      title.setAttribute("tabindex", "0");

      title.style.setProperty(
        "cursor",
        "pointer",
        "important"
      );

      title.style.setProperty(
        "user-select",
        "none",
        "important"
      );
    }

    var elements = box.querySelectorAll(
      ".dnx-fx-row," +
      ".dnx-fx-bottom," +
      ".dnx-fx-status"
    );

    elements.forEach(function(element){
      element.style.setProperty(
        "display",
        collapsed ? "none" : "",
        "important"
      );
    });

    saveCollapsed(collapsed);
  }

  function toggleBox(){
    var box = getBox();
    if(!box) return;

    var collapsed =
      box.getAttribute("data-dnx-collapsed") === "1";

    applyState(box, !collapsed);
  }

  function isFxTitle(target){
    if(!target || !target.closest) return false;

    var title = target.closest(
      "#dnx-fx-box-inline .dnx-fx-title," +
      "#dnx-fx-box .dnx-fx-title"
    );

    return !!title;
  }

  /*
   * Capture-Modus: Der reparierte Handler läuft vor alten,
   * möglicherweise defekten FX/Pip-Handlern.
   */
  document.addEventListener(
    "click",
    function(event){
      if(!isFxTitle(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      toggleBox();
    },
    true
  );

  document.addEventListener(
    "keydown",
    function(event){
      if(!isFxTitle(event.target)) return;

      if(event.key !== "Enter" && event.key !== " "){
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      toggleBox();
    },
    true
  );

  function initialize(){
    var box = getBox();
    if(!box) return;

    var state = loadState();
    var collapsed = !!state.collapsed;

    applyState(box, collapsed);
  }

  if(document.readyState === "loading"){
    document.addEventListener(
      "DOMContentLoaded",
      function(){
        window.setTimeout(initialize, 500);
      },
      {once:true}
    );
  } else {
    window.setTimeout(initialize, 500);
  }

  window.addEventListener("load", function(){
    window.setTimeout(initialize, 800);
  });

  /*
   * Falls OpenWebRX das Receiver-Fenster neu erzeugt,
   * Titel und Zustand erneut anwenden.
   */
  window.setInterval(function(){
    var box = getBox();
    if(!box) return;

    var title = getTitle(box);
    if(!title) return;

    if(title.dataset.dnxArrowReady !== "1"){
      title.dataset.dnxArrowReady = "1";

      var state = loadState();
      applyState(box, !!state.collapsed);
    }
  }, 700);
})();
/* DNX_FXPIP_ARROW_REPAIR_END */

/* DNX_SAFE_USER_TABLE_START */
(function(){
  "use strict";

  if(window.__dnxSafeUserTableInstalled) return;
  window.__dnxSafeUserTableInstalled = true;

  var STATUS_URL = "/visitor-status.json";
  var requestRunning = false;
  var latestData = null;
  var lastRenderSignature = "";

  /* DNX_CENTERED_TUNE_NOTIFY */
  var previousSessionState = null;
  var tuneOverlayTimer = null;

  function installStyle(){
    if(document.getElementById("dnx-safe-user-table-style")){
      return;
    }

    var style = document.createElement("style");
    style.id = "dnx-safe-user-table-style";

    style.textContent = `
      #dnx-safe-user-table-wrap{
        width:100%;
        margin-top:8px;
        padding:6px;
        box-sizing:border-box;
        border:1px solid rgba(255,255,255,.17);
        border-radius:8px;
        background:rgba(0,0,0,.24);
      }

      #dnx-safe-user-table-wrap
      .dnx-table-heading{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:6px;
        margin:0 0 6px;
        color:#bdefff;
        font-size:11px;
        font-weight:900;
      }

      #dnx-safe-user-table-wrap
      .dnx-table-heading-count{
        color:#8fffb2;
        white-space:nowrap;
      }

      #dnx-safe-user-table-scroll{
        width:100%;
        min-height:150px;
        max-height:min(620px, calc(100vh - 480px));
        overflow:auto;
        border-radius:5px;
      }

      /* DNX_SAFE_USER_FREQUENCY_COLUMNS */
      #dnx-safe-user-table{
        width:100%;
        min-width:590px;
        border-collapse:collapse;
        table-layout:fixed;
        color:#fff;
        font-size:10px;
      }

      #dnx-safe-user-table th{
        padding:4px 3px;
        border-bottom:1px solid rgba(255,255,255,.25);
        background:rgba(0,0,0,.30);
        color:#bdefff;
        text-align:left;
        font-weight:900;
      }

      #dnx-safe-user-table td{
        padding:5px 3px;
        border-bottom:1px solid rgba(255,255,255,.11);
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        vertical-align:middle;
      }

      #dnx-safe-user-table tr:last-child td{
        border-bottom:0;
      }

      #dnx-safe-user-table .dnx-col-number{
        width:30px;
        text-align:center;
      }

      #dnx-safe-user-table .dnx-col-name{
        width:85px;
      }

      #dnx-safe-user-table .dnx-col-profile{
        width:190px;
      }

      #dnx-safe-user-table .dnx-col-frequency{
        width:100px;
        color:#fff36a;
        font-weight:900;
      }

      #dnx-safe-user-table .dnx-col-mode{
        width:55px;
        color:#8feaff;
        font-weight:900;
        text-align:center;
      }

      #dnx-safe-user-table .dnx-col-connection{
        width:90px;
      }

      #dnx-safe-user-table
      .dnx-user-name-real{
        color:#8fffb2;
        font-weight:900;
      }

      #dnx-safe-user-table
      .dnx-user-name-unknown{
        color:#ffe788;
        font-weight:800;
      }

      #dnx-safe-user-table
      .dnx-duplicate{
        display:inline-block;
        padding:2px 4px;
        border:1px solid rgba(255,95,95,.70);
        border-radius:5px;
        background:rgba(125,25,25,.65);
        color:#fff;
        font-size:9px;
        font-weight:900;
      }

      #dnx-safe-user-table
      .dnx-single-connection{
        color:#aeeec5;
        font-size:9px;
        font-weight:700;
      }

      /*
       * Tabelle in der großen Vier-Sekunden-Meldung.
       */
      #dnx-visitor-screen-overlay
      .dnx-screen-user-table-wrap{
        width:100%;
        max-width:610px;
        margin-top:10px;
        padding:6px;
        box-sizing:border-box;
        border:1px solid rgba(255,255,255,.20);
        border-radius:8px;
        background:rgba(0,0,0,.24);
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table-scroll{
        max-height:145px;
        overflow:auto;
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table{
        width:100%;
        min-width:570px;
        border-collapse:collapse;
        table-layout:fixed;
        color:#fff;
        font-size:11px;
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table th,
      #dnx-visitor-screen-overlay
      .dnx-screen-user-table td{
        padding:5px 6px;
        border-bottom:1px solid rgba(255,255,255,.16);
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        text-align:left;
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table th{
        color:#bdefff;
        font-weight:900;
        background:rgba(0,0,0,.22);
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table
      .dnx-screen-col-number{
        width:34px;
        text-align:center;
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table
      .dnx-screen-col-name{
        width:100px;
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table
      .dnx-screen-col-frequency{
        width:105px;
        color:#fff36a;
        font-weight:900;
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table
      .dnx-screen-col-mode{
        width:55px;
        color:#8feaff;
        font-weight:900;
        text-align:center;
      }

      #dnx-visitor-screen-overlay
      .dnx-screen-user-table
      .dnx-screen-col-connection{
        width:100px;
      }

      #dnx-user-tune-overlay{
        position:fixed !important;
        left:50% !important;
        top:50% !important;
        transform:
          translate(-50%,-50%)
          scale(.90) !important;
        z-index:2147483647 !important;
        display:none;
        width:min(86vw,620px);
        min-height:210px;
        padding:25px 30px;
        box-sizing:border-box;
        border:3px solid #38dfff;
        border-radius:20px;
        background:
          linear-gradient(
            180deg,
            rgba(6,76,103,.97),
            rgba(3,30,48,.97)
          );
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.22),
          0 0 22px rgba(0,0,0,.90),
          0 0 40px rgba(40,220,255,.76);
        color:#fff;
        text-align:center;
        font-family:Arial,sans-serif;
        cursor:pointer;
        opacity:0;
        pointer-events:none;
        transition:
          opacity .20s ease,
          transform .20s ease;
      }

      #dnx-user-tune-overlay.dnx-visible{
        display:flex !important;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        opacity:.94;
        pointer-events:auto;
        transform:
          translate(-50%,-50%)
          scale(1) !important;
      }

      #dnx-user-tune-overlay.dnx-mode-change{
        border-color:#fff04a;
        background:
          linear-gradient(
            180deg,
            rgba(105,85,5,.97),
            rgba(43,34,2,.97)
          );
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.22),
          0 0 22px rgba(0,0,0,.90),
          0 0 40px rgba(255,230,45,.72);
      }

      #dnx-user-tune-overlay
      .dnx-tune-user{
        width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        color:#8fffb2;
        font-size:26px;
        line-height:31px;
        font-weight:900;
        text-shadow:0 2px 4px #000;
      }

      #dnx-user-tune-overlay
      .dnx-tune-action{
        margin-top:7px;
        color:#fff;
        font-size:29px;
        line-height:35px;
        font-weight:900;
        letter-spacing:1px;
        text-shadow:0 2px 4px #000;
      }

      #dnx-user-tune-overlay
      .dnx-tune-frequency{
        margin-top:10px;
        color:#fff36a;
        font-size:34px;
        line-height:40px;
        font-weight:900;
        text-shadow:0 2px 5px #000;
      }

      #dnx-user-tune-overlay
      .dnx-tune-mode{
        margin-top:7px;
        padding:4px 16px;
        border:1px solid rgba(255,255,255,.35);
        border-radius:999px;
        background:rgba(0,0,0,.25);
        color:#8feaff;
        font-size:22px;
        line-height:28px;
        font-weight:900;
      }

      #dnx-user-tune-overlay
      .dnx-tune-profile{
        width:100%;
        margin-top:9px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        color:#d8eef5;
        font-size:13px;
        font-weight:700;
      }

      #dnx-user-tune-overlay
      .dnx-tune-close{
        margin-top:11px;
        color:rgba(255,255,255,.62);
        font-size:10px;
        font-weight:600;
      }

      @media (max-width:700px){
        #dnx-user-tune-overlay{
          width:92vw;
          min-height:175px;
          padding:20px 14px;
        }

        #dnx-user-tune-overlay
        .dnx-tune-user{
          font-size:21px;
          line-height:26px;
        }

        #dnx-user-tune-overlay
        .dnx-tune-action{
          font-size:23px;
          line-height:28px;
        }

        #dnx-user-tune-overlay
        .dnx-tune-frequency{
          font-size:27px;
          line-height:33px;
        }

        #dnx-user-tune-overlay
        .dnx-tune-mode{
          font-size:18px;
          line-height:23px;
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-user-table{
          font-size:10px;
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-user-table th,
        #dnx-visitor-screen-overlay
        .dnx-screen-user-table td{
          padding:4px 3px;
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-user-table
        .dnx-screen-col-name{
          width:72px;
        }

        #dnx-visitor-screen-overlay
        .dnx-screen-user-table
        .dnx-screen-col-connection{
          width:80px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function isAutomaticName(name){
    return /^User\d+$/i.test(
      String(name || "").trim()
    );
  }

  function publicName(name){
    name = String(name || "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim()
      .substring(0,32);

    if(!name || isAutomaticName(name)){
      return {
        text:"Unbekannt",
        known:false
      };
    }

    return {
      text:name,
      known:true
    };
  }

  function compactProfile(profile){
    profile = String(profile || "")
      .replace(/\s+/g, " ")
      .trim();

    /*
     * Den Gerätepräfix entfernen, damit die schmale Tabelle
     * hauptsächlich das Profil beziehungsweise Frequenzband zeigt.
     */
    var slash = profile.indexOf("/");

    if(slash >= 0 && slash < profile.length - 1){
      profile = profile.substring(slash + 1).trim();
    }

    return profile || "Noch nicht bekannt";
  }

  function formatFrequency(value){
    var frequency = parseInt(value, 10);

    if(!Number.isFinite(frequency) || frequency <= 0){
      return "—";
    }

    /*
     * Deutsche Gruppierung, beispielsweise:
     * 50.125.000 Hz
     */
    try {
      return frequency.toLocaleString("de-DE") + " Hz";
    } catch(e) {
      return String(frequency) + " Hz";
    }
  }

  function normalizeMode(value){
    var mode = String(value || "")
      .trim()
      .toUpperCase()
      .substring(0,16);

    return mode || "—";
  }

  function normalizeData(data){
    if(!data || typeof data !== "object"){
      return null;
    }

    var sessions = Array.isArray(data.sessions)
      ? data.sessions
      : [];

    sessions = sessions.map(function(session, index){
      var duplicateCount =
        parseInt(session.duplicate_count, 10);

      if(
        !Number.isFinite(duplicateCount) ||
        duplicateCount < 1
      ){
        duplicateCount = 1;
      }

      var group = parseInt(session.group, 10);

      if(!Number.isFinite(group) || group < 1){
        group = null;
      }

      return {
        number:
          parseInt(session.number, 10) || index + 1,
        name:publicName(session.name),
        profile:compactProfile(session.profile),
        frequency:formatFrequency(session.frequency),
        mode:normalizeMode(session.mode),
        duplicate:!!session.duplicate,
        duplicateCount:duplicateCount,
        group:group
      };
    });

    return {
      count:parseInt(data.count, 10) || sessions.length,
      sessions:sessions
    };
  }

  function ensureReceiverTable(){
    var visitorBox =
      document.getElementById("dnx-visitor-notify");

    if(!visitorBox) return null;

    var body =
      visitorBox.querySelector(".dnx-visitor-body") ||
      visitorBox;

    var wrap =
      document.getElementById(
        "dnx-safe-user-table-wrap"
      );

    if(wrap && wrap.parentNode !== body){
      wrap.remove();
      wrap = null;
    }

    if(!wrap){
      wrap = document.createElement("div");
      wrap.id = "dnx-safe-user-table-wrap";

      var heading = document.createElement("div");
      heading.className = "dnx-table-heading";

      var title = document.createElement("span");
      title.textContent = "Aktive User";

      var count = document.createElement("span");
      count.className = "dnx-table-heading-count";
      count.textContent = "0";

      heading.appendChild(title);
      heading.appendChild(count);

      var scroll = document.createElement("div");
      scroll.id = "dnx-safe-user-table-scroll";

      var table = document.createElement("table");
      table.id = "dnx-safe-user-table";

      var thead = document.createElement("thead");
      var headerRow = document.createElement("tr");

      [
        ["Nr.","dnx-col-number"],
        ["Name","dnx-col-name"],
        ["Profil","dnx-col-profile"],
        ["Frequenz","dnx-col-frequency"],
        ["Modus","dnx-col-mode"],
        ["Status","dnx-col-connection"]
      ].forEach(function(column){
        var th = document.createElement("th");
        th.textContent = column[0];
        th.className = column[1];
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);

      var tbody = document.createElement("tbody");
      tbody.id = "dnx-safe-user-table-body";

      table.appendChild(thead);
      table.appendChild(tbody);
      scroll.appendChild(table);

      wrap.appendChild(heading);
      wrap.appendChild(scroll);

      body.appendChild(wrap);
    }

    return wrap;
  }

  function ensureScreenTable(){
    var overlay =
      document.getElementById(
        "dnx-visitor-screen-overlay"
      );

    if(!overlay) return null;

    var wrap =
      overlay.querySelector(
        ".dnx-screen-user-table-wrap"
      );

    if(!wrap){
      wrap = document.createElement("div");
      wrap.className =
        "dnx-screen-user-table-wrap";

      var scroll = document.createElement("div");
      scroll.className =
        "dnx-screen-user-table-scroll";

      var table = document.createElement("table");
      table.className = "dnx-screen-user-table";

      var thead = document.createElement("thead");
      var headerRow = document.createElement("tr");

      [
        ["Nr.","dnx-screen-col-number"],
        ["Name","dnx-screen-col-name"],
        ["Profil",""],
        ["Frequenz","dnx-screen-col-frequency"],
        ["Modus","dnx-screen-col-mode"],
        ["Status","dnx-screen-col-connection"]
      ].forEach(function(column){
        var th = document.createElement("th");
        th.textContent = column[0];
        th.className = column[1];
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);

      var tbody = document.createElement("tbody");
      tbody.className =
        "dnx-screen-user-table-body";

      table.appendChild(thead);
      table.appendChild(tbody);
      scroll.appendChild(table);
      wrap.appendChild(scroll);

      var close =
        overlay.querySelector(".dnx-screen-close");

      if(close){
        overlay.insertBefore(wrap, close);
      } else {
        overlay.appendChild(wrap);
      }
    }

    return wrap;
  }

  function appendCell(row, text, className, title){
    var cell = document.createElement("td");
    cell.textContent = text;

    if(className){
      cell.className = className;
    }

    if(title){
      cell.title = title;
    }

    row.appendChild(cell);
    return cell;
  }

  function connectionText(session){
    if(session.duplicate){
      return (
        "Gr." +
        (session.group || "?") +
        " · " +
        session.duplicateCount +
        "×"
      );
    }

    return "Einzeln";
  }

  function renderReceiver(data){
    var wrap = ensureReceiverTable();
    if(!wrap) return;

    var count =
      wrap.querySelector(".dnx-table-heading-count");

    var tbody =
      wrap.querySelector("#dnx-safe-user-table-body");

    if(count){
      count.textContent =
        data.count + " " +
        (data.count === 1 ? "User" : "User");
    }

    if(!tbody) return;
    tbody.textContent = "";

    data.sessions.forEach(function(session){
      var row = document.createElement("tr");

      appendCell(
        row,
        String(session.number),
        "dnx-col-number"
      );

      appendCell(
        row,
        session.name.text,
        "dnx-col-name " +
        (
          session.name.known
            ? "dnx-user-name-real"
            : "dnx-user-name-unknown"
        )
      );

      appendCell(
        row,
        session.profile,
        "dnx-col-profile",
        session.profile
      );

      appendCell(
        row,
        session.frequency,
        "dnx-col-frequency",
        session.frequency
      );

      appendCell(
        row,
        session.mode,
        "dnx-col-mode",
        session.mode
      );

      var statusCell = appendCell(
        row,
        "",
        "dnx-col-connection"
      );

      var badge = document.createElement("span");
      badge.textContent = connectionText(session);
      badge.className = session.duplicate
        ? "dnx-duplicate"
        : "dnx-single-connection";

      statusCell.appendChild(badge);
      tbody.appendChild(row);
    });

    if(data.sessions.length === 0){
      var emptyRow = document.createElement("tr");
      var empty = document.createElement("td");

      empty.colSpan = 6;
      empty.textContent = "Keine aktiven User";
      empty.style.textAlign = "center";
      empty.style.color = "#ffe788";
      empty.style.padding = "8px";

      emptyRow.appendChild(empty);
      tbody.appendChild(emptyRow);
    }
  }

  function renderScreen(data){
    var wrap = ensureScreenTable();
    if(!wrap) return;

    var tbody =
      wrap.querySelector(
        ".dnx-screen-user-table-body"
      );

    if(!tbody) return;
    tbody.textContent = "";

    data.sessions.forEach(function(session){
      var row = document.createElement("tr");

      appendCell(
        row,
        String(session.number),
        "dnx-screen-col-number"
      );

      appendCell(
        row,
        session.name.text,
        "dnx-screen-col-name"
      );

      appendCell(
        row,
        session.profile,
        "",
        session.profile
      );

      appendCell(
        row,
        session.frequency,
        "dnx-screen-col-frequency",
        session.frequency
      );

      appendCell(
        row,
        session.mode,
        "dnx-screen-col-mode",
        session.mode
      );

      appendCell(
        row,
        connectionText(session),
        "dnx-screen-col-connection"
      );

      tbody.appendChild(row);
    });
  }

  function buildTuneOverlay(){
    var overlay =
      document.getElementById(
        "dnx-user-tune-overlay"
      );

    if(overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "dnx-user-tune-overlay";

    overlay.innerHTML = [
      '<div class="dnx-tune-user"></div>',
      '<div class="dnx-tune-action"></div>',
      '<div class="dnx-tune-frequency"></div>',
      '<div class="dnx-tune-mode"></div>',
      '<div class="dnx-tune-profile"></div>',
      '<div class="dnx-tune-close">',
      '  Zum Schließen anklicken',
      '</div>'
    ].join("");

    overlay.addEventListener("click", function(){
      hideTuneOverlay();
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function hideTuneOverlay(){
    var overlay =
      document.getElementById(
        "dnx-user-tune-overlay"
      );

    if(!overlay) return;

    overlay.classList.remove(
      "dnx-visible",
      "dnx-mode-change"
    );

    if(tuneOverlayTimer){
      window.clearTimeout(tuneOverlayTimer);
      tuneOverlayTimer = null;
    }

    window.setTimeout(function(){
      if(!overlay.classList.contains("dnx-visible")){
        overlay.style.display = "none";
      }
    }, 220);
  }

  function showTuneOverlay(
    session,
    frequencyChanged,
    modeChanged
  ){
    /* v3.28: waehrend eines laufenden Scans nicht bei jedem Schritt aufpoppen */
    try{
      if(window.DNXScannerManager && window.DNXScannerManager.laeuft && window.DNXScannerManager.laeuft()){ return; }
    }catch(e){}
    var overlay = buildTuneOverlay();
    if(!overlay) return;

    var user =
      overlay.querySelector(".dnx-tune-user");

    var action =
      overlay.querySelector(".dnx-tune-action");

    var frequency =
      overlay.querySelector(".dnx-tune-frequency");

    var mode =
      overlay.querySelector(".dnx-tune-mode");

    var profile =
      overlay.querySelector(".dnx-tune-profile");

    user.textContent =
      session.name.text === "Unbekannt"
        ? "UNBEKANNTER USER"
        : session.name.text;

    if(frequencyChanged && modeChanged){
      action.textContent =
        "FREQUENZ UND MODUS GEÄNDERT";
    } else if(modeChanged){
      action.textContent = "MODUS GEÄNDERT";
    } else {
      action.textContent = "FREQUENZ GEÄNDERT";
    }

    frequency.textContent = session.frequency;
    mode.textContent = session.mode;
    profile.textContent = session.profile;

    overlay.style.display = "flex";

    overlay.classList.remove(
      "dnx-visible",
      "dnx-mode-change"
    );

    void overlay.offsetWidth;

    overlay.classList.add("dnx-visible");

    if(modeChanged){
      overlay.classList.add(
        "dnx-mode-change"
      );
    }

    if(tuneOverlayTimer){
      window.clearTimeout(tuneOverlayTimer);
    }

    tuneOverlayTimer = window.setTimeout(
      hideTuneOverlay,
      4000
    );
  }

  function checkSessionChanges(data){
    var current = {};

    data.sessions.forEach(function(session){
      current[String(session.number)] = {
        frequency:session.frequency,
        mode:session.mode,
        session:session
      };
    });

    /*
     * Beim ersten Abruf nur den Ausgangszustand speichern.
     * Dadurch erscheint beim Seitenstart keine Falschmeldung.
     */
    if(previousSessionState === null){
      previousSessionState = current;
      return;
    }

    var changedSessions = [];

    Object.keys(current).forEach(function(key){
      var previous = previousSessionState[key];
      var now = current[key];

      if(!previous) return;

      var frequencyChanged =
        previous.frequency !== now.frequency;

      var modeChanged =
        previous.mode !== now.mode;

      if(frequencyChanged || modeChanged){
        changedSessions.push({
          session:now.session,
          frequencyChanged:frequencyChanged,
          modeChanged:modeChanged
        });
      }
    });

    previousSessionState = current;

    /*
     * Bei mehreren gleichzeitigen Änderungen die erste
     * erkannte Sitzung anzeigen. Die Tabelle enthält danach
     * sofort alle aktualisierten Werte.
     */
    if(changedSessions.length > 0){
      var change = changedSessions[0];

      showTuneOverlay(
        change.session,
        change.frequencyChanged,
        change.modeChanged
      );
    }
  }

  function renderAll(data){
    checkSessionChanges(data);
    latestData = data;

    var signature = JSON.stringify({
      count:data.count,
      sessions:data.sessions.map(function(session){
        return {
          number:session.number,
          name:session.name.text,
          profile:session.profile,
          frequency:session.frequency,
          mode:session.mode,
          duplicate:session.duplicate,
          duplicateCount:session.duplicateCount,
          group:session.group,
          role:session.role || ""
        };
      })
    });

    var receiverMissing =
      !document.getElementById("dnx-safe-user-table");

    var screenOverlay =
      document.getElementById(
        "dnx-visitor-screen-overlay"
      );

    var screenMissing =
      screenOverlay &&
      !screenOverlay.querySelector(
        ".dnx-screen-user-table"
      );

    /*
     * Keine DOM-Änderung, wenn sich Daten und Tabellenzustand
     * nicht verändert haben.
     */
    if(
      signature === lastRenderSignature &&
      !receiverMissing &&
      !screenMissing
    ){
      return;
    }

    lastRenderSignature = signature;

    installStyle();
    renderReceiver(data);
    renderScreen(data);
  }

  async function fetchStatus(){
    if(requestRunning) return;
    requestRunning = true;

    try {
      var response = await fetch(
        STATUS_URL + "?t=" + Date.now(),
        {
          cache:"no-store",
          credentials:"same-origin",
          headers:{
            "Accept":"application/json"
          }
        }
      );

      if(!response.ok){
        throw new Error(
          "visitor-status HTTP " + response.status
        );
      }

      var raw = await response.json();
      var data = normalizeData(raw);

      if(data){
        renderAll(data);
      }
    } catch(error) {
      console.debug(
        "DNX user table:",
        error
      );
    } finally {
      requestRunning = false;
    }
  }

  function tick(){
    /*
     * Nur Daten abrufen. renderAll() entscheidet anhand einer
     * Signatur, ob eine DOM-Aktualisierung erforderlich ist.
     */
    fetchStatus();
  }

  function boot(){
    installStyle();
    tick();

    if(!window.__dnxSafeUserTableTimer){
      window.__dnxSafeUserTableTimer =
        window.setInterval(tick, 2000);
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {once:true}
    );
  } else {
    boot();
  }

  window.addEventListener("load", function(){
    window.setTimeout(boot, 400);
  });
})();
/* DNX_SAFE_USER_TABLE_END */





/* DNX_PROJECT_MANAGER_START */
(function(){if(window.__dnxProjectManagerButton)return;window.__dnxProjectManagerButton=true;function add(){var p=document.getElementById('openwebrx-panel-receiver');if(!p||document.getElementById('dnx-project-manager-button'))return;var b=document.createElement('button');b.id='dnx-project-manager-button';b.textContent='📦 Projekte / Downloads';b.style.cssText='width:100%;margin:5px 0 8px;padding:8px;border:1px solid #ffd84a;border-radius:8px;background:linear-gradient(90deg,#755000,#b77900);color:#fff;font-weight:900;cursor:pointer';b.onclick=function(){window.open('http://' + window.location.hostname + ':8094/','dnx-projects')};p.insertBefore(b,p.firstChild)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();window.addEventListener('load',function(){setTimeout(add,500)})})();
/* DNX_PROJECT_MANAGER_END */

/* DNX_WATERFALL_3D_LOADER_START */
(function () {
    if (window.__dnxWaterfall3dLoader) return;
    window.__dnxWaterfall3dLoader = true;

    var script = document.createElement("script");
    script.src =
        "/static/plugins/receiver/dnx_3dtool/plugin.js" +
        "?v=DNX_WATERFALL_PACKAGE_1_0_0";

    document.head.appendChild(script);

    function loadPlugin() {
        try {
            if (
                typeof Plugins !== "undefined" &&
                typeof Plugins.load === "function"
            ) {
                Plugins.load("dnx_3dtool");
            }
        } catch (error) {
            console.error(
                "DNX Waterfall 3D:",
                error
            );
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            loadPlugin,
            {once:true}
        );
    } else {
        loadPlugin();
    }
})();
/* DNX_WATERFALL_3D_LOADER_END */
/* DNX_WEATHER_2D3D_START */
(function(){if(window.__dnxWeatherLoader)return;window.__dnxWeatherLoader=true;var B='/static/plugins/receiver/dnx_weather/';window.CESIUM_BASE_URL=B+'vendor/cesium/';function css(u){var l=document.createElement('link');l.rel='stylesheet';l.href=u;document.head.appendChild(l)}function js(u,next){var s=document.createElement('script');s.src=u;s.onload=next;document.head.appendChild(s)}css(B+'vendor/leaflet/leaflet.css');css(B+'vendor/cesium/Widgets/widgets.css');css(B+'dnx_weather.css');js(B+'vendor/leaflet/leaflet.js',function(){js(B+'vendor/cesium/Cesium.js',function(){js(B+'dnx_weather.js')})})})();
/* DNX_WEATHER_2D3D_END */




/* DNX_GRAPHIC_EQ_START */
(function(){if(window.__dnxGraphicEqLoader)return;window.__dnxGraphicEqLoader=true;var B='/static/plugins/receiver/dnx_graphic_eq/';var c=document.createElement('link');c.rel='stylesheet';c.href=B+'dnx_eq.css';document.head.appendChild(c);var s=document.createElement('script');s.src=B+'dnx_eq.js';document.head.appendChild(s)})();
/* DNX_GRAPHIC_EQ_END */
/* DNX_ACCESS_CONTROL_STAGE2_START */
(function(){if(window.__dnxAccessLoader)return;window.__dnxAccessLoader=true;var B='/static/plugins/receiver/dnx_access_control/';var c=document.createElement('link');c.rel='stylesheet';c.href=B+'dnx_access.css';document.head.appendChild(c);var s=document.createElement('script');s.src=B+'dnx_access.js';document.head.appendChild(s)})();
/* DNX_ACCESS_CONTROL_STAGE2_END */

/* DNX_VISITOR_ROLES_START */
(function(){if(window.__dnxVisitorRolesLoader)return;window.__dnxVisitorRolesLoader=true;var s=document.createElement("script");s.src="/static/plugins/receiver/dnx_visitor_roles/dnx_visitor_roles.js";document.head.appendChild(s)})();
/* DNX_VISITOR_ROLES_END */
/* DNX_SCANNER_MANAGER_START */
(function(){"use strict";
if(window.__dnxScannerManager)return;window.__dnxScannerManager=true;
const KLOCAL="dnx.scanner.favorites.v1",KSESSION="dnx.scanner.temp.v1",KCAT="dnx.scanner.categories.v1";
const defaults=[
 {id:"ham",name:"Amateurfunk",icon:"📡",color:"#22c55e"},{id:"air",name:"Flugfunk",icon:"✈",color:"#38bdf8"},
 {id:"marine",name:"Marine",icon:"⚓",color:"#06b6d4"},{id:"bos",name:"BOS",icon:"🚨",color:"#ef4444"},
 {id:"broadcast",name:"Rundfunk",icon:"📻",color:"#a855f7"},{id:"digital",name:"Digital",icon:"🔢",color:"#facc15"},
 {id:"sat",name:"Satellit",icon:"🛰",color:"#f97316"},{id:"other",name:"Sonstige",icon:"★",color:"#94a3b8"}
];
let cats=load(KCAT,defaults),favorites=[...load(KLOCAL,[]),...load(KSESSION,[])],scan={running:false,paused:false,timer:null,index:-1,list:[],kind:"list",hits:{},runden:0,start:0,rausch:-120,jetzt:null,stufe:null,bereich:null,snr:0,slevel:-999,treffer:false,aktiv:{},versuche:{},skip:{},rauschZeit:0,delZeit:0,schritte:0,schrittZeit:0,geschw:0},detached=null;
function load(k,d){try{let v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:d}catch(e){return d}}
function loadSession(){try{return JSON.parse(sessionStorage.getItem(KSESSION)||"[]")}catch(e){return []}}
favorites=[...load(KLOCAL,[]),...loadSession()];
function save(){localStorage.setItem(KCAT,JSON.stringify(cats));localStorage.setItem(KLOCAL,JSON.stringify(favorites.filter(x=>x.store!=="temp")));sessionStorage.setItem(KSESSION,JSON.stringify(favorites.filter(x=>x.store==="temp")))}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function hz(v){v=Number(v);return Number.isFinite(v)?Math.round(v).toLocaleString("de-DE")+" Hz":"—"}
function parseFreq(v){v=String(v).trim().replace(/,/g,".");let m=v.match(/^([0-9.]+)\s*(hz|khz|mhz)?$/i);if(!m)return NaN;let n=parseFloat(m[1]),u=(m[2]||"hz").toLowerCase();return Math.round(n*(u==="mhz"?1e6:u==="khz"?1e3:1))}
function cat(id){return cats.find(x=>x.id===id)||cats[0]||defaults[0]}
function tone(){try{let A=window.AudioContext||window.webkitAudioContext,c=new A,o=c.createOscillator(),g=c.createGain();o.frequency.value=1050;g.gain.value=.06;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.18);o.stop(c.currentTime+.2)}catch(e){}}
function tune(f){if(typeof UI==="undefined"||!UI.setFrequency)return false;if(f.mode&&UI.setModulation)UI.setModulation(f.mode,f.underlying||undefined);UI.setFrequency(Number(f.frequency),false);if(UI.showBubble)UI.showBubble(`<b>${esc(f.icon||cat(f.category).icon)} ${esc(f.name)}</b><br>${hz(f.frequency)}`);return true}
function smeter(){let e=document.getElementById("openwebrx-smeter-db")||document.querySelector("#openwebrx-smeter"),m=String(e?.textContent||"").match(/-?\d+(?:[.,]\d+)?/);return m?parseFloat(m[0].replace(",",".")):-999}
function style(){if(document.getElementById("dnx-fm-style"))return;let s=document.createElement("style");s.id="dnx-fm-style";s.textContent=`
#dnx-fm-launch{width:100%;margin:5px 0 8px;padding:7px;border:1px solid #3de7ff;border-radius:8px;background:linear-gradient(90deg,#075985,#0891b2);color:#fff;font-weight:900;cursor:pointer}
#dnx-fm-window{position:fixed;left:1vw;top:3vh;width:min(calc(100vw - 396px),1400px);height:min(90vh,980px);z-index:2147483647;background:#101820f7;color:#fff;border:2px solid #32e6ff;border-radius:14px;box-shadow:0 0 35px #000;display:none;font:13px Arial;overflow:hidden;resize:both;min-width:680px;min-height:480px}
#dnx-fm-window.dnx-fm-vorn{z-index:2147483647 !important}
.dnx-fm-head{touch-action:none}
.dnx-fm-zieh{font:700 11px Arial;color:#9fe9ff;border:1px dashed #ffffff44;border-radius:6px;padding:3px 7px;user-select:none;pointer-events:none;white-space:nowrap}
.dnx-fm-live-row{display:flex;flex-wrap:wrap;gap:3px 6px;align-items:center;margin:0 0 4px;font:11px Arial;color:#cfe9f5}
.dnx-fm-live-row label{display:flex;gap:5px;align-items:center}
.dnx-fm-live-row select{background:#172229;color:#fff;border:1px solid #ffffff33;border-radius:5px;padding:2px 3px}
.dnx-fm-live-freq{font:900 12.5px Arial;color:#ffe07a}
.dnx-fm-live-scan{font:700 11px Arial;color:#9effc2}
.dnx-fm-live-punkt{display:inline-block;width:9px;height:9px;border-radius:50%;background:#2b8f57;box-shadow:0 0 8px #2b8f57;margin-left:8px;vertical-align:middle}
#fm-live-canvas{width:100%;height:68px;display:block;background:#04070b;border:1px solid #ffffff22;border-radius:8px;image-rendering:auto}
#fm-live-lineal{width:100%;height:20px;display:block;background:#0a141b;border:1px solid #ffffff22;border-radius:6px;margin-top:4px}
.dnx-fm-zb{border:1px solid #ffffff55;border-radius:6px;background:#17566b;color:#fff;font:800 11.5px Arial;padding:3px 7px;cursor:pointer}
.dnx-fm-zb:hover{background:#1f7893}
.dnx-fm-live-row button{white-space:nowrap}
#dnx-fm-live-hinweis{font:10.5px Arial;color:#9fb6c4;margin-top:3px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

#dnx-fm-window.max{left:1vw!important;top:1vh!important;width:98vw!important;height:98vh!important}.dnx-fm-head{height:42px;display:flex;align-items:center;gap:8px;padding:4px 10px;background:#0b3444;cursor:move}.dnx-fm-head b{font-size:17px;flex:1}.dnx-fm-head button,.dnx-fm-actions button{border:1px solid #ffffff55;border-radius:6px;background:#17566b;color:#fff;padding:6px 9px;font-weight:800;cursor:pointer}.dnx-fm-body{height:calc(100% - 42px);display:grid;grid-template-columns:var(--dnx-fm-left-width,310px) minmax(0,1fr);overflow:hidden;position:relative}.dnx-fm-col-griff{position:absolute;top:0;bottom:0;left:var(--dnx-fm-left-width,310px);transform:translateX(-50%);width:12px;z-index:40;cursor:col-resize;touch-action:none;user-select:none;background:transparent}.dnx-fm-col-griff::before{content:"";position:absolute;top:0;bottom:0;left:5px;width:2px;border-radius:2px;background:rgba(255,45,45,.94);box-shadow:0 0 6px rgba(255,0,0,.85);transition:left .1s,width .1s,box-shadow .1s}.dnx-fm-col-griff:hover::before,.dnx-fm-col-griff:focus-visible::before{left:4px;width:4px;box-shadow:0 0 9px rgba(255,0,0,1)}.dnx-fm-window.dnx-fm-resizing,.dnx-fm-window.dnx-fm-resizing *{cursor:col-resize !important;user-select:none !important}.dnx-fm-side{padding:10px;border-right:1px solid #ffffff22;overflow:auto}.dnx-fm-main{padding:10px;overflow:auto}.dnx-fm-section{background:#0004;border:1px solid #ffffff20;border-radius:9px;padding:7px;margin-bottom:7px}.dnx-fm-section h3{margin:0 0 5px;color:#7eeaff}.dnx-fm-grid{display:grid;grid-template-columns:100px 1fr;gap:6px;align-items:center}.dnx-fm-grid input,.dnx-fm-grid select,.dnx-fm-grid textarea{width:100%;background:#172229;color:#fff;border:1px solid #ffffff33;border-radius:5px;padding:5px}.dnx-fm-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.dnx-fm-actions .red{background:#8b1d2c}.dnx-fm-actions .green{background:#087a47}
/* ---- v3.48: Bedienknoepfe - im Betrieb kraeftig hell ---- */
.dnx-fm-actions button[data-a="start"],.dnx-fm-actions button[data-a="pause"],
.dnx-fm-actions button[data-a="next"],.dnx-fm-actions button[data-a="stop"]{
  flex:1 1 auto;min-width:88px;padding:10px 12px;font:900 13.5px Arial;letter-spacing:.4px;
  border-radius:9px;border:2px solid #2c3a44;background:#0e161d;color:#8ea3b1;
  box-shadow:inset 0 1px 0 #ffffff12;transition:all .14s ease}
.dnx-fm-actions button[data-a="start"]:hover,.dnx-fm-actions button[data-a="pause"]:hover,
.dnx-fm-actions button[data-a="next"]:hover,.dnx-fm-actions button[data-a="stop"]:hover{
  filter:brightness(1.25);transform:translateY(-1px)}
.dnx-fm-actions button[data-a="start"]:active,.dnx-fm-actions button[data-a="pause"]:active,
.dnx-fm-actions button[data-a="next"]:active,.dnx-fm-actions button[data-a="stop"]:active{transform:translateY(1px)}
.dnx-fm-actions button.dnx-aus{opacity:.55;filter:grayscale(.45)}
.dnx-fm-actions button.dnx-laeuft{background:linear-gradient(#6dffb0,#0fa257);border-color:#e9fff3;color:#02210f;
  text-shadow:0 1px 0 #ffffff66;box-shadow:0 0 22px #35ff83d0,0 0 0 3px #35ff8340;animation:dnxGlanz 1.5s infinite}
.dnx-fm-actions button.dnx-pause-an{background:linear-gradient(#ffdc93,#c98a00);border-color:#fff3d0;color:#2a1c00;
  text-shadow:0 1px 0 #ffffff55;box-shadow:0 0 24px #ffcf6bdd,0 0 0 3px #ffcf6b44;animation:dnxPuls 1.1s infinite}
.dnx-fm-actions button.dnx-weiter-an{background:linear-gradient(#b6f4ff,#0a86ad);border-color:#f2fdff;color:#02161f;
  text-shadow:0 1px 0 #ffffff77;box-shadow:0 0 24px #35d1ffdd,0 0 0 3px #35d1ff55}
.dnx-fm-actions button.dnx-stop-an{background:linear-gradient(#ff9d9d,#c11f1f);border-color:#ffe6e6;color:#2b0505;
  text-shadow:0 1px 0 #ffffff55;box-shadow:0 0 24px #ff5a5add,0 0 0 3px #ff5a5a44;animation:dnxPulsRot 1.6s infinite}
.dnx-fm-actions button.dnx-tipp{filter:brightness(1.75) saturate(1.25);transform:scale(1.05)}
@keyframes dnxGlanz{0%,100%{filter:brightness(1)}50%{filter:brightness(1.25)}}
@keyframes dnxPuls{0%,100%{box-shadow:0 0 14px #ffcf6b88,0 0 0 2px #ffcf6b33}50%{box-shadow:0 0 28px #ffcf6bee,0 0 0 4px #ffcf6b77}}
@keyframes dnxPulsRot{0%,100%{box-shadow:0 0 16px #ff5a5a99,0 0 0 2px #ff5a5a33}50%{box-shadow:0 0 32px #ff5a5aee,0 0 0 4px #ff5a5a88}}
#fm-scan-zustand{display:inline-flex;align-items:center;gap:6px;margin:0 0 7px 0;padding:4px 11px;border-radius:20px;
  font:900 12px Arial;letter-spacing:.3px;border:1px solid #ffffff3d;background:#0b1a12;color:#cfe9f5;width:100%;justify-content:center}
#fm-scan-zustand.laeuft{background:linear-gradient(#0f5c37,#0a3d24);border-color:#35ff83;color:#d6ffe6;box-shadow:0 0 14px #35ff8366}
#fm-scan-zustand.pause{background:linear-gradient(#5c4100,#3d2b00);border-color:#ffcf6b;color:#fff0cc;box-shadow:0 0 14px #ffcf6b66}
#fm-scan-zustand.stop{background:linear-gradient(#4a1414,#2f0d0d);border-color:#ff7b7b;color:#ffdcdc}
/* ---- v3.48: Analysator-Felder ---- */
#dnx-an-freq{display:flex;align-items:center;justify-content:center;gap:10px;padding:3px 10px;border:1px solid #ffffff36;border-radius:10px;
  background:linear-gradient(#0b1822,#04070b);box-shadow:inset 0 0 22px #00000088}
#dnx-an-fq{font:900 18px 'Consolas','DejaVu Sans Mono',monospace;color:#ffffff;text-shadow:0 0 14px #35ff8355;letter-spacing:.5px}
#dnx-an-md{font:900 13px Arial;color:#bfeeff;background:#0d3b4d;border:1px solid #35d1ff66;border-radius:6px;padding:2px 7px}
#dnx-an-snr{font:900 15px 'Consolas',monospace;color:#cfe9f5;background:#0b1218;border:1px solid #ffffff33;border-radius:7px;padding:4px 10px}
#dnx-an-snr.treffer{color:#04180c;background:linear-gradient(#6dffb0,#12a55c);border-color:#eafff2;box-shadow:0 0 16px #35ff83bb}
#dnx-an-felder{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-top:4px}
.dnx-an-feld{display:flex;align-items:baseline;justify-content:space-between;gap:6px;padding:1px 7px;
  border:1px solid #ffffff26;border-radius:8px;background:linear-gradient(#101c26,#070d13)}
.dnx-an-feld .dnx-an-l{font:800 9.5px Arial;color:#7fa0b2;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}
.dnx-an-feld .dnx-an-v{font:900 11.5px 'Consolas','DejaVu Sans Mono',monospace;color:#eaf6ff;white-space:nowrap}
.dnx-an-feld.dnx-an-wert{border-color:#35ff8355;box-shadow:inset 0 0 14px #35ff8318}
#dnx-an-spek{width:100%;height:150px;margin-top:5px;background:#04070b;border:1px solid #35d1ff55;border-radius:8px;box-shadow:inset 0 0 26px #000000aa}
#dnx-an-zeiger{width:58px;height:58px;background:#070c11;border:1px solid #ffffff26;border-radius:8px;flex:0 0 auto}
#dnx-an-info{font:10px Arial;color:#cfe9f5;line-height:1.2}
#fm-live-canvas{border:1px solid #35d1ff5c;box-shadow:inset 0 0 24px #00000099}.dnx-fm-status{padding:8px;border-radius:7px;background:#0007;color:#9effc2;font-weight:800}.dnx-fm-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}.dnx-fm-card{border:2px solid var(--c);border-radius:9px;padding:8px;background:#0005;box-shadow:0 0 9px color-mix(in srgb,var(--c) 40%,transparent);cursor:pointer}.dnx-fm-card.prio{animation:dnxPulse 1.5s infinite}.dnx-fm-card h4{margin:0 0 5px;color:var(--c);font-size:15px}.dnx-fm-card small{color:#cbd5e1}.dnx-fm-card .row{display:flex;justify-content:space-between;gap:6px}.dnx-fm-card button{font-size:11px;margin-top:5px}.dnx-fm-marker-layer{position:absolute;inset:0;pointer-events:none;z-index:90}.dnx-fm-marker{position:absolute;bottom:0;transform:translateX(-50%);display:inline-flex;align-items:center;gap:4px;padding:3px 6px;border:2px solid var(--c);border-radius:6px 6px 0 0;background:#101820ee;color:#fff;font:900 10px Arial;white-space:nowrap;box-shadow:0 0 9px var(--c);pointer-events:auto;cursor:pointer}.dnx-fm-marker:hover{filter:brightness(1.35);z-index:99}.dnx-fm-shape{display:inline-block;width:11px;height:11px;background:var(--c);flex:0 0 auto}.dnx-shape-circle{border-radius:50%}.dnx-shape-square{border-radius:1px}.dnx-shape-diamond{transform:rotate(45deg);width:9px;height:9px;margin:1px}.dnx-shape-star{clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 95%,50% 72%,21% 95%,32% 57%,2% 35%,39% 35%)}.dnx-shape-flag{clip-path:polygon(0 0,100% 0,75% 50%,100% 100%,0 100%)}.dnx-shape-triangle{clip-path:polygon(50% 0,100% 100%,0 100%)}
@keyframes dnxPulse{50%{filter:brightness(1.5);box-shadow:0 0 18px var(--c)}}@media(max-width:800px){#dnx-fm-window{left:1vw;top:1vh;width:98vw;height:98vh;min-width:0}.dnx-fm-body{grid-template-columns:1fr}.dnx-fm-side{max-height:45%;border-right:0;border-bottom:1px solid #ffffff22}.dnx-fm-col-griff{display:none}}
`;document.head.appendChild(s)}
function optionCats(sel){sel.innerHTML=cats.map(c=>`<option value="${esc(c.id)}">${esc(c.icon)} ${esc(c.name)}</option>`).join("")}
function build(){style();let panel=document.getElementById("openwebrx-panel-receiver");if(panel&&!document.getElementById("dnx-fm-launch")){let b=document.createElement("button");b.id="dnx-fm-launch";b.textContent="📻 Scanner / Frequenz-Manager";b.onclick=open;panel.insertBefore(b,panel.firstChild)}if(document.getElementById("dnx-fm-window"))return;let w=document.createElement("div");w.id="dnx-fm-window";w.innerHTML=`
<div class="dnx-fm-head"><b>📻 SDR Scanner & Frequenz-Manager · v3.99</b><span class="dnx-fm-zieh">⇔ mit linker Maustaste verschieben</span><button data-a="lupe" title="zum lebenden Wasserfall-Bild springen">📺 Live-Bild</button><button data-a="pop">Neuer Tab</button><button data-a="max">□</button><button data-a="close">✕</button></div><div class="dnx-fm-body"><aside class="dnx-fm-side">
<div class="dnx-fm-section"><h3>Favorit anlegen</h3><div class="dnx-fm-grid"><label>Name</label><input id="fm-name"><label>Frequenz</label><input id="fm-freq" placeholder="145.500 MHz"><label>Modus</label><select id="fm-mode"><option>nfm</option><option>am</option><option>sam</option><option>usb</option><option>lsb</option><option>cw</option><option>dmr</option><option>dstar</option><option>ysf</option><option>tetra</option><option>p25</option><option>nxdn</option><option>m17</option><option>freedv</option><option>dab</option><option>drm</option></select><label>Kategorie</label><select id="fm-cat"></select><label>Icon</label><input id="fm-icon" value="★"><label>Farbe</label><input id="fm-color" type="color" value="#22c55e"><label>Form</label><select id="fm-shape"><option>Kreis</option><option>Quadrat</option><option>Raute</option><option>Stern</option><option>Fahne</option></select><label>Speicher</label><select id="fm-store"><option value="local">Dauerhaft</option><option value="temp">Temporär</option></select><label>Scan</label><input id="fm-scan" type="checkbox" checked><label>Priorität</label><input id="fm-prio" type="checkbox"><label>Beschreibung</label><textarea id="fm-desc"></textarea></div><div class="dnx-fm-actions"><button class="green" data-a="save">Speichern</button><button data-a="current">Aktuelle Frequenz</button></div></div>
<div class="dnx-fm-section"><h3>Scan-Steuerung</h3><div class="dnx-fm-grid"><label>Verweilzeit</label><input id="fm-dwell" type="number" value="1200"><label>SNR-Schwelle dB</label><input id="fm-thr" type="number" value="6"><label>Haltezeit ms</label><input id="fm-hold" type="number" value="4000"><label>Erkennung</label><select id="fm-detect"><option value="snr">SNR über Rauschsockel</option><option value="smeter">S-Meter</option><option value="squelch">Squelch</option><option value="both">Kombiniert</option></select><label>Scan-Modi</label><div id="fm-modefilters" style="display:grid;grid-template-columns:repeat(3,minmax(72px,1fr));gap:4px"><label><input type="checkbox" value="dmr"> DMR</label><label><input type="checkbox" value="dstar"> D-Star</label><label><input type="checkbox" value="tetra"> TETRA</label><label><input type="checkbox" value="p25"> P25</label><label><input type="checkbox" value="nxdn"> NXDN</label><label><input type="checkbox" value="ysf"> YSF</label><label><input type="checkbox" value="m17"> M17</label><label><input type="checkbox" value="freedv"> FreeDV</label><label><input type="checkbox" value="dab"> DAB</label><label><input type="checkbox" value="drm"> DRM</label><div class="dnx-fm-actions" style="grid-column:1/-1"><button type="button" data-a="modesall">Alle digital</button><button type="button" data-a="modesnone">Kein Filter</button></div></div><label>Treffer speichern</label><input id="fm-autosave" type="checkbox"></div><div class="dnx-fm-grid" style="margin-top:8px"><label title="Kanal nach so vielen erfolglosen Besuchen ueberspringen (0 = aus)">Auto-Skip n</label><input id="fm-skip-n" type="number" value="0"><label title="wie lange der Kanal dann uebersprungen wird">Auto-Skip s</label><input id="fm-skip-s" type="number" value="30"><label title="Treffer so lange halten (0 = Haltezeit)">Auto-Lock s</label><input id="fm-lock" type="number" value="0"><label title="Rauschsockel alle x Minuten neu setzen (0 = aus)">Rauschboden min</label><input id="fm-nf-reset" type="number" value="0"><label title="Zeilen mit Aktivitaet unter x s loeschen (0 = aus)">Zeile löschen &lt; s</label><input id="fm-del-aktiv" type="number" value="0"><label title="wie oft geprueft wird">alle s</label><input id="fm-del-s" type="number" value="3"></div><div class="dnx-fm-actions"><button class="green" data-a="start">▶ Start</button><button data-a="pause">⏸ Pause</button><button data-a="next">⏭ Weiter</button><button class="red" data-a="stop">■ Stopp</button></div></div>
<div class="dnx-fm-section"><h3>Bereichsscan</h3><div class="dnx-fm-grid"><label>Start</label><input id="fm-rstart" placeholder="144 MHz"><label>Ende</label><input id="fm-rend" placeholder="146 MHz"><label>Schritt Hz</label><input id="fm-step" value="12500"><label>Modus</label><select id="fm-rmode"><optgroup label="Einzelmodus"><option value="nfm">NFM</option><option value="am">AM</option><option value="usb">USB</option><option value="lsb">LSB</option><option value="dmr">DMR</option><option value="dstar">D-Star</option><option value="tetra">TETRA</option><option value="p25">P25</option><option value="nxdn">NXDN</option><option value="ysf">YSF</option><option value="m17">M17</option><option value="freedv">FreeDV</option><option value="dab">DAB</option><option value="drm">DRM</option></optgroup><optgroup label="Kombinationen"><option value="dmr,dstar">DMR + D-Star</option><option value="dmr,p25">DMR + P25</option><option value="dstar,p25">D-Star + P25</option><option value="dmr,tetra">DMR + TETRA</option><option value="dstar,tetra">D-Star + TETRA</option><option value="p25,tetra">P25 + TETRA</option><option value="dmr,dstar,p25">DMR + D-Star + P25</option><option value="dmr,dstar,tetra">DMR + D-Star + TETRA</option><option value="dmr,dstar,p25,tetra">DMR + D-Star + P25 + TETRA</option><option value="dmr,dstar,tetra,p25,nxdn,ysf,m17,freedv,dab,drm">Alle Digitalmodi</option></optgroup></select></div><div class="dnx-fm-actions"><button data-a="range">Bereich erstellen</button></div></div></aside><div class="dnx-fm-col-griff" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Linke Scanner-Spalte verbreitern oder verkleinern" aria-valuemin="220" aria-valuemax="720" aria-valuenow="310" title="Rote Linie ziehen: nach rechts = linke Spalte vergrößern, nach links = verkleinern · Doppelklick = Standard"></div>
<main class="dnx-fm-main"><div class="dnx-fm-section" id="dnx-fm-live-sec"><h3>Live-Lupe · OpenWebRX<span class="dnx-fm-live-punkt" id="fm-live-punkt"></span></h3><div class="dnx-fm-live-row"><button type="button" data-fmzoom="-1" class="dnx-fm-zb" title="weiter herauszoomen">− Zoom</button><label>Lupe <select id="fm-live-zoom"><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option><option value="8">8×</option><option value="16">16×</option><option value="32">32×</option><option value="64">64×</option></select></label><button type="button" data-fmzoom="1" class="dnx-fm-zb" title="weiter hineinzoomen">+ Zoom</button><label><input type="checkbox" id="fm-live-an" checked> Live-Bild</label><label><input type="checkbox" id="fm-live-sp" checked> Spektrum</label><label><input type="checkbox" id="fm-live-lin" checked> Lineal</label><span class="dnx-fm-live-freq" id="fm-live-freq">—</span><span class="dnx-fm-live-scan" id="fm-live-scan">bereit</span><span id="fm-live-lebt" style="font:700 11px Arial;color:#9effc2;margin-left:6px">● läuft</span><button type="button" data-a="an" title="zum Kanal-Analysator springen" style="margin-left:8px;border:1px solid #35ff83;border-radius:6px;background:#0f3f2a;color:#bfffe0;font:800 11px Arial;padding:4px 8px;cursor:pointer">📊 Analysator</button></div><canvas id="fm-live-canvas" width="1000" height="96"></canvas><canvas id="fm-live-lineal" width="1000" height="24"></canvas><div id="dnx-fm-live-hinweis">Ausschnitt aus dem lebenden OpenWebRX-Wasserfall.</div></div></div></div><div class="dnx-fm-section" id="dnx-fm-analyser"><h3>Kanal-Analysator · einzeln</h3><div id="dnx-an-freq"><span id="dnx-an-fq">—</span><span id="dnx-an-md"></span><span id="dnx-an-snr">SNR —</span></div><div id="dnx-an-felder"><div class="dnx-an-feld" id="dnx-an-f1"></div><div class="dnx-an-feld" id="dnx-an-f2"></div><div class="dnx-an-feld" id="dnx-an-f3"></div><div class="dnx-an-feld" id="dnx-an-f4"></div><div class="dnx-an-feld" id="dnx-an-f5"></div><div class="dnx-an-feld" id="dnx-an-f6"></div><div class="dnx-an-feld" id="dnx-an-f7"></div><div class="dnx-an-feld" id="dnx-an-f8"></div></div><canvas id="dnx-an-spek" width="1000" height="150"></canvas><div style="display:flex;gap:8px;align-items:center;margin-top:4px"><canvas id="dnx-an-zeiger" width="86" height="86"></canvas><div id="dnx-an-info"></div></div></div><div class="dnx-fm-section"><div class="dnx-fm-actions"><button data-a="export">JSON Export</button><button data-a="csv">CSV Export</button><button data-a="import">Import</button><input id="fm-file" type="file" accept=".json,.csv" hidden><button data-a="cats">Kategorien</button><input id="fm-search" placeholder="Suchen..."></div></div><div id="fm-status" class="dnx-fm-status">Bereit</div><h3>Favoriten & Scanliste</h3><div id="fm-cards" class="dnx-fm-cards"></div></main></div>`;document.body.appendChild(w);optionCats(w.querySelector("#fm-cat"));bind(w);render()}
/* v3.17: Fenster so gross machen, dass der Empfaenger-Wasserfall unten frei bleibt */
function fmStreifenOben(){
  /* kleinster y-Wert des Empfaenger-Streifens (rote Linien, Frequenzleiste, Wasserfall) */
  var y = 1e9, ids = ["dnx-top-line", "dnx-fft-line"], i, e, q;
  for(i = 0; i < ids.length; i++){
    e = document.getElementById(ids[i]);
    if(e){ q = e.getBoundingClientRect(); if(q.height && q.top > 0){ y = Math.min(y, q.top); } }
  }
  e = document.getElementById("openwebrx-frequency-container");
  if(e){ q = e.getBoundingClientRect(); if(q.height){ y = Math.min(y, q.top); } }
  e = document.querySelector("#webrx-canvas-container canvas");
  if(e){ q = e.getBoundingClientRect(); if(q.height){ y = Math.min(y, q.top); } }
  return (y < 1e8) ? y : null;
}
function fmGroesse(w){
  try{
    var vw = window.innerWidth || 1200, vh = window.innerHeight || 800;
    if(!w.style.width){
      w.style.width = Math.round(Math.max(560, Math.min(vw - 396, 1400))) + "px";
    }
    if(!w.style.height){
      var oben = Math.round(vh * 0.04), grenze = fmStreifenOben();
      var h = (grenze ? (grenze - oben - 2) : (vh * 0.62));   /* v3.60: bis dicht an die Empfaenger-Leiste */
      w.style.height = Math.round(Math.max(360, Math.min(h, vh - 60))) + "px";
    }
    if(!w.style.top){ w.style.top = Math.round(vh * 0.04) + "px"; }
    if(!w.style.left){ w.style.left = Math.round(vw * 0.01) + "px"; }
  }catch(e){}
}
var FM_OFFEN = null;
function fmOffenMerken(an){
  FM_OFFEN = !!an;
  try{ localStorage.setItem("dnx.fm.offen", an ? "1" : "0"); }catch(e){}
}
function fmWillkommenWeg(){
  /* v3.37: das Willkommens-Fenster darf den Scanner nicht verdecken */
  try{
    var m = document.getElementById("dnx-welcome-modal");
    if(m){ var cs = getComputedStyle(m); if(cs.display !== "none"){ m.style.display = "none"; } }
    if(window.dnxWelcomeHide){ try{ window.dnxWelcomeHide(); }catch(e2){} }
  }catch(e){}
}
function open(){fmWillkommenWeg();build();var w=document.getElementById("dnx-fm-window");w.style.display="block";try{fmSpaltenGriff(w)}catch(e){}try{fmOffenMerken(true)}catch(e){}try{fmAnalyserEinordnen()}catch(e){}try{fmGroesse(w)}catch(e){}try{var b=w.querySelector(".dnx-fm-body"),g=w.querySelector(".dnx-fm-col-griff");if(b&&g&&g.__dnxFMSetWidth){g.__dnxFMSetWidth(parseFloat(b.style.getPropertyValue("--dnx-fm-left-width"))||310,false)}}catch(e){}try{fmOrt(w)}catch(e){}try{fmFlaechen(true)}catch(e){}try{fmHoch(w)}catch(e){}syncProfileRange(false)}
function vals(){let q=x=>document.querySelector(x),f=parseFreq(q("#fm-freq").value);return{id:crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random(),name:q("#fm-name").value.trim()||hz(f),frequency:f,mode:q("#fm-mode").value,category:q("#fm-cat").value,icon:q("#fm-icon").value||"★",color:q("#fm-color").value,shape:q("#fm-shape").value,store:q("#fm-store").value,scannable:q("#fm-scan").checked,priority:q("#fm-prio").checked,description:q("#fm-desc").value.trim()}}
function status(t){let e=document.getElementById("fm-status");if(e)e.textContent=t}
function render(){let e=document.getElementById("fm-cards");if(!e)return;let s=(document.getElementById("fm-search")?.value||"").toLowerCase();e.innerHTML=favorites.filter(f=>(f.name+f.description+f.frequency).toLowerCase().includes(s)).sort((a,b)=>(b.priority?1:0)-(a.priority?1:0)||a.frequency-b.frequency).map(f=>{let c=f.color||cat(f.category).color;return`<div class="dnx-fm-card ${f.priority?"prio":""}" style="--c:${esc(c)}" data-id="${esc(f.id)}"><h4>${esc(f.icon||cat(f.category).icon)} ${esc(f.name)}</h4><div class="row"><b>${hz(f.frequency)}</b><b>${esc((f.mode||"").toUpperCase())}</b></div><small>${esc(cat(f.category).name)} · ${f.store==="temp"?"temporär":"dauerhaft"} · Scan ${f.scannable?"AN":"AUS"}</small><div>${esc(f.description||"")}</div><button data-do="tune">Abstimmen</button> <button data-do="edit">Bearbeiten</button> <button data-do="del">Löschen</button></div>`}).join("");markers()}
function fmSpaltenGriff(w){
  var body=w.querySelector(".dnx-fm-body"), side=w.querySelector(".dnx-fm-side"), grip=w.querySelector(".dnx-fm-col-griff");
  if(!body||!side||!grip||grip.__dnxFMResizeBound){return;}
  grip.__dnxFMResizeBound=true;
  var key="dnx_fm_left_width", dragging=false, x0=0, w0=310, pointerId=null;
  function grenzen(){
    var bw=body.clientWidth||w.clientWidth||700;
    var rechtsMin=Math.min(300,Math.max(160,Math.round(bw*.34)));
    var min=220, max=Math.min(720,Math.max(min,bw-rechtsMin));
    return {min:min,max:max};
  }
  function setBreite(px,speichern){
    var g=grenzen(), n=parseFloat(px);
    if(!isFinite(n)){n=310;}
    n=Math.round(Math.max(g.min,Math.min(g.max,n)));
    body.style.setProperty("--dnx-fm-left-width",n+"px");
    grip.setAttribute("aria-valuemin",String(g.min));
    grip.setAttribute("aria-valuemax",String(g.max));
    grip.setAttribute("aria-valuenow",String(n));
    grip.setAttribute("aria-valuetext",n+" Pixel");
    if(speichern){try{localStorage.setItem(key,String(n));}catch(e){}}
    return n;
  }
  var initial=310;
  try{var saved=parseFloat(localStorage.getItem(key));if(isFinite(saved)){initial=saved;}}catch(e){}
  body.style.setProperty("--dnx-fm-left-width",Math.round(initial)+"px");
  grip.__dnxFMSetWidth=setBreite;
  grip.addEventListener("pointerdown",function(e){
    if(typeof e.button==="number"&&e.button!==0&&e.pointerType!=="touch"){return;}
    e.preventDefault();e.stopPropagation();
    dragging=true;pointerId=e.pointerId;x0=e.clientX;
    w0=side.getBoundingClientRect().width||parseFloat(body.style.getPropertyValue("--dnx-fm-left-width"))||310;
    try{grip.setPointerCapture(pointerId);}catch(e2){}
    w.classList.add("dnx-fm-resizing");
  });
  grip.addEventListener("pointermove",function(e){
    if(!dragging||e.pointerId!==pointerId){return;}
    e.preventDefault();e.stopPropagation();
    setBreite(w0+(e.clientX-x0),false);
  });
  function ende(e){
    if(!dragging||(e&&e.pointerId!==pointerId)){return;}
    var n=parseFloat(body.style.getPropertyValue("--dnx-fm-left-width"))||w0;
    setBreite(n,true);dragging=false;w.classList.remove("dnx-fm-resizing");
    try{if(pointerId!==null&&grip.hasPointerCapture(pointerId)){grip.releasePointerCapture(pointerId);}}catch(e2){}
    pointerId=null;
  }
  grip.addEventListener("pointerup",ende);
  grip.addEventListener("pointercancel",ende);
  grip.addEventListener("dblclick",function(e){e.preventDefault();e.stopPropagation();setBreite(310,true);});
  grip.addEventListener("keydown",function(e){
    var n=parseFloat(body.style.getPropertyValue("--dnx-fm-left-width"))||310;
    if(e.key==="ArrowLeft"||e.key==="ArrowRight"){
      e.preventDefault();setBreite(n+(e.key==="ArrowRight"?24:-24),true);
    }else if(e.key==="Home"){
      e.preventDefault();setBreite(310,true);
    }
  });
}
function bind(w){w.addEventListener("click",e=>{let a=e.target.dataset.a;if(a==="close"){w.style.display="none";try{fmOffenMerken(false)}catch(e){}}if(a==="max"){w.classList.toggle("max");if(w.classList.contains("max")){w.style.left="1vw";w.style.top="1vh";}else{try{fmOrt(w)}catch(e){}}try{fmHoch(w)}catch(e){}}if(a==="lupe"){let s=document.getElementById("dnx-fm-live-sec");if(s){try{s.scrollIntoView({block:"start"});}catch(e2){}}let k=document.getElementById("fm-live-an");if(k&&!k.checked){k.checked=true;}status("Live-Lupe an");}if(a==="pop")detach(w);if(a==="an"){try{fmAnalyserZeigen()}catch(e0){};let s2=document.getElementById("dnx-fm-analyser");if(s2){try{s2.scrollIntoView({block:"end"});}catch(e2){}}status("Kanal-Analysator");}if(a==="current")w.querySelector("#fm-freq").value=typeof UI!=="undefined"?UI.getFrequency():"";if(a==="save"){let f=vals();if(!Number.isFinite(f.frequency))return status("Ungültige Frequenz");favorites.push(f);save();render();status("Favorit gespeichert")};if(a==="start"||a==="pause"||a==="next"||a==="stop"){fmKnoepfeMalen.tipp=a;fmKnoepfeMalen.tippZeit=Date.now()}
if(a==="start")startList();if(a==="pause"){scan.paused=!scan.paused;status(scan.paused?"Scan pausiert":"Scan läuft")};if(a==="next")stepScan(true);if(a==="stop")stopScan();if(a==="range")makeRange();if(a==="export")download("dnx-frequenzen.json",JSON.stringify({version:1,categories:cats,favorites},null,2),"application/json");if(a==="csv")download("dnx-frequenzen.csv",toCSV(),"text/csv");if(a==="import")w.querySelector("#fm-file").click();if(a==="cats")editCats();if(a==="modesall")document.querySelectorAll("#fm-modefilters input[type=checkbox]").forEach(x=>x.checked=true);if(a==="modesnone")document.querySelectorAll("#fm-modefilters input[type=checkbox]").forEach(x=>x.checked=false);let card=e.target.closest(".dnx-fm-card");if(card){let f=favorites.find(x=>x.id===card.dataset.id);if(e.target.dataset.do==="tune"||e.detail===2)tune(f);if(e.target.dataset.do==="del"){favorites=favorites.filter(x=>x.id!==f.id);save();render()}if(e.target.dataset.do==="edit")fill(f)}});w.querySelector("#fm-search").oninput=render;w.querySelector("#fm-file").onchange=importFile;fmSpaltenGriff(w);drag(w)}
function fill(f){let q=x=>document.querySelector(x);q("#fm-name").value=f.name;q("#fm-freq").value=f.frequency;q("#fm-mode").value=f.mode;q("#fm-cat").value=f.category;q("#fm-icon").value=f.icon;q("#fm-color").value=f.color;q("#fm-desc").value=f.description||"";favorites=favorites.filter(x=>x.id!==f.id);save();render()}
function selectedModes(){return Array.from(document.querySelectorAll("#fm-modefilters input[type=checkbox]:checked")).map(e=>String(e.value).toLowerCase())}
function startList(){let mf=selectedModes();scan.list=favorites.filter(f=>f.scannable&&(!mf.length||mf.includes(String(f.mode||"").toLowerCase()))).sort((a,b)=>(b.priority?1:0)-(a.priority?1:0));if(!scan.list.length){
    /* v3.62: laeuft der Empfaenger noch an, wird der Start gemerkt und automatisch nachgeholt */
    if(!currentProfileRange()){
      FM_ANA.startWunsch = Date.now();
      status("Empfaenger startet noch \u2013 Bereichsscan startet automatisch");
      try{ fmKnoepfeMalen() }catch(e){}
      return;
    }
    try{ makeRange(); fmKnoepfeMalen(); return status("Kein Scan-Favorit \u2013 Bereichsscan aus den Feldern links gestartet"); }catch(e){}
    return status(selectedModes().length?"Keine Scan-Favoriten für gewählte Modi":"Keine Scan-Favoriten");
  }fmScanNeu("list");scan.running=true;scan.paused=false;scan.index=-1;stepScan(true);try{fmAnalyserZeigen()}catch(e){}}
/* ================= v3.27: Scan mit SNR-Erkennung und sichtbarer Anzeige ================= */
function fmRauschsockel(level){
  try{                                   /* v3.29: Rauschboden regelmaessig neu setzen */
    var rm = +(document.getElementById("fm-nf-reset") || {}).value || 0;
    if(rm > 0 && scan.rauschZeit && Date.now() - scan.rauschZeit > rm * 60000){
      scan.rausch = -120; scan.rauschZeit = Date.now();
    }
  }catch(e){}
  if(!isFinite(level) || level < -200){ return scan.rausch; }
  if(scan.rausch <= -120){ scan.rausch = level; }
  else if(level < scan.rausch){ scan.rausch = level; }
  else { scan.rausch += 0.05; if(scan.rausch > level){ scan.rausch = level; } }
  return scan.rausch;
}
function fmScanNeu(art){
  scan.hits = {}; scan.aktiv = {}; scan.versuche = {}; scan.skip = {};
  scan.runden = 0; scan.start = Date.now(); scan.index = -1;
  scan.schritte = 0; scan.schrittZeit = Date.now(); scan.geschw = 0; scan.rauschZeit = Date.now();
  scan.rausch = -120; scan.jetzt = null; scan.stufe = null; scan.snr = 0; scan.slevel = -999; scan.treffer = false;
  if(art === "list"){ scan.bereich = null; }
  fmScanKopf(); fmScanTabelle();
}
function fmTreffer(f, level, snr, dauerMs){
  var k = String(Math.round(f.frequency));
  var h = scan.hits[k];
  if(!h){ h = scan.hits[k] = {freq: f.frequency, name: (f.name || "").replace(/^Bereich /, ""), mode: f.mode || "", zeit: 0, n: 0, snr: -999}; }
  h.zeit += Math.max(0, dauerMs) / 1000;
  h.n++;
  if(snr > h.snr){ h.snr = snr; }
  scan.treffer = true;
  if(h.n === 1){                       /* v3.28: nur der erste Treffer je Frequenz wird gespeichert */
    try{ if(document.getElementById("fm-autosave").checked){ logHit(f, level); } }catch(e){}
  }
  fmScanTabelle(); fmScanKopf(level, snr, true);
}
function fmScanKopf(level, snr, hit){
  try{
    var b = document.getElementById("fm-scan-kopf");
    var sec = document.getElementById("dnx-fm-live-sec");
    var cv = document.getElementById("fm-live-canvas");
    if(!b && sec && cv && cv.parentNode){
      b = document.createElement("div");
      b.id = "fm-scan-kopf";
      b.style.cssText = "display:flex;flex-wrap:nowrap;overflow:hidden;gap:10px;align-items:center;margin:0 0 5px;padding:2px 7px;" +
        "border:1px solid #ffffff33;border-radius:7px;background:#0a1a12;color:#cfe9f5;font:12px Arial;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
      cv.parentNode.insertBefore(b, cv);
    }
    if(!b){ return; }
    var lauf = scan.running ? (scan.paused ? "PAUSE" : "SCAN LÄUFT") : (scan.start ? "GESTOPPT" : "bereit");
    var f = scan.jetzt;
    var txt = "<b>" + (f ? hz(f.frequency) : "—") + "</b>";
    if(f && f.mode){ txt += " · " + String(f.mode).toUpperCase(); }
    /* v3.59: nur die wichtigsten Angaben - die Zeile bleibt einzeilig */
    if(isFinite(scan.snr) && scan.slevel > -900){ txt += " · SNR <b>" + scan.snr.toFixed(1).replace(".", ",") + " dB</b>"; }
    txt += " · Schwelle " + fmScanSchwelle().toFixed(1).replace(".", ",");
    if(scan.list.length){ txt += " · Satz " + (scan.index + 1) + "/" + scan.list.length; }
    var anz = 0; for(var k in scan.hits){ anz++; }
    txt += " · Treffer <b>" + anz + "</b>";
    txt += " · " + lauf;
    b.innerHTML = txt + '<span id="fm-warte" style="margin-left:auto;font:900 13px Arial;color:#ff6b6b"></span>' +
      '<span style="margin-left:14px;font-weight:900;color:' + (hit ? "#35ff83" : "#9fb6c4") + '">' +
      (hit ? "● TREFFER" : "○ kein Signal") + "</span>";
    b.style.borderColor = hit ? "#35ff83" : "#ffffff33";
    b.style.background = hit ? "#0d2f1c" : "#0a1a12";
    /* v3.29: Grossanzeige wie im SDR#-Scanner */
    var g = document.getElementById("fm-scan-banner");
    if(!g && cv && cv.parentNode){
      g = document.createElement("div");
      g.id = "fm-scan-banner";
      g.style.cssText = "display:flex;align-items:center;justify-content:center;gap:10px;margin:0 0 5px;padding:4px 10px;" +
        "border:1px solid #35d1ff44;border-radius:7px;background:linear-gradient(#0b1822,#04070b);color:#fff;" +
        "font:800 16px 'Consolas','DejaVu Sans Mono',monospace;letter-spacing:.2px;text-align:center;white-space:nowrap;overflow:hidden";
      cv.parentNode.insertBefore(g, cv);
    }
    if(g){
      var name = f ? String(f.name || "").replace(/\s+(NFM|AM|SAM|USB|LSB|CW|DMR|D-STAR|DSTAR|TETRA|P25|NXDN|YSF|M17|FREEDV|DAB|DRM)\s*$/i, "") : "—";
      var teil2 = (f ? hz(f.frequency) : "—");
      var zeigeName = !!(f && name && !/^Bereich\b/i.test(name) && String(name).replace(/\s+/g, "").replace(/Hz$/i, "") !== String(teil2).replace(/\s+/g, "").replace(/Hz$/i, ""));
      if(/^Bereich\b/i.test(String(name || ""))){ zeigeName = false; }   /* v3.59: Bereichsname nicht doppelt zeigen */
      var mtxt = (f && f.mode ? ": " + String(f.mode).toUpperCase() : "");
      var ntxt = zeigeName ? name : "";
      var snrTxt = (isFinite(scan.snr) && scan.slevel > -900) ? " [SNR: " + scan.snr.toFixed(1) + " dB]" : " [SNR: —]";
      g.innerHTML = '<span style="color:' + (hit ? "#ffb3b3" : "#ffffff") + '">' + teil2 + mtxt + "</span>" +
        '<span style="color:#cfe9f5;font-size:15px;margin-left:10px">' + ntxt + "</span>" +
        '<span style="color:' + (hit ? "#35ff83" : "#9fb6c4") + '">' + snrTxt + "</span>";
      g.style.borderColor = hit ? "#ff5a5a" : "#ffffff33";
    }
  }catch(e){}
}
function fmScanDauer(){
  var s0 = Math.max(0, Math.round((Date.now() - scan.start) / 1000));
  var m = Math.floor(s0 / 60), s1 = s0 % 60;
  return "läuft " + m + ":" + (s1 < 10 ? "0" : "") + s1;
}
function fmScanSchwelle(){
  var e = document.getElementById("fm-thr");
  var v = e ? Number(String(e.value).replace(",", ".")) : 6;
  if(!isFinite(v)){ v = 6; }
  return v;
}
function fmKanalBreite(mode){
  var m = String(mode || "").toLowerCase();
  if(m === "nfm" || m === "fm"){ return 12500; }
  if(m === "am" || m === "sam"){ return 9000; }
  if(m === "usb" || m === "lsb"){ return 2700; }
  if(m === "cw"){ return 500; }
  if(m === "dab"){ return 1536000; }
  if(m === "drm"){ return 10000; }
  return 12500;
}
function fmAktiv(f, dauerMs, snr, hit){
  var k = String(Math.round(f.frequency));
  var a = scan.aktiv[k];
  if(!a){ a = scan.aktiv[k] = {freq: f.frequency, name: (f.name || "").replace(/^Bereich /, ""), mode: f.mode || "", zeit: 0, n: 0, snr: -999, treffer: 0}; }
  a.zeit += Math.max(0, dauerMs) / 1000;
  a.n++;
  if(isFinite(snr) && snr > -900 && snr > a.snr){ a.snr = snr; }
  if(hit){ a.treffer++; }
  if(scan.hits[k]){ a.treffer = scan.hits[k].n; }
  return a;
}
function fmScanTabelle(){
  try{
    var feld = document.getElementById("fm-scan-tabelle");
    if(!feld){
      var dw = document.getElementById("fm-dwell");
      var sec = dw ? dw.closest(".dnx-fm-section") : null;
      if(!sec){ return; }
      feld = document.createElement("div");
      feld.id = "fm-scan-tabelle";
      feld.style.cssText = "margin-top:8px;border:1px solid #ffffff26;border-radius:7px;overflow:hidden";
      sec.appendChild(feld);
    }
    var keys = Object.keys(scan.aktiv);
    if(!keys.length){
      feld.innerHTML = '<div style="padding:6px;color:#9fb6c4;font:12px Arial">noch keine Kanaele gescannt</div>';
      return;
    }
    keys.sort(function(a, b){ return scan.aktiv[b].zeit - scan.aktiv[a].zeit; });
    var jetzt = scan.jetzt ? Math.round(scan.jetzt.frequency) : -1;
    var h = '<div style="display:flex;gap:6px;align-items:center;padding:4px 6px;background:#12303c">' +
      '<b style="color:#bfe9ff;font:700 12px Arial">Kanal-Aktivität (' + keys.length + ')</b>' +
      '<button type="button" data-scan="leer" style="margin-left:auto;font:700 11px Arial;background:#8b1d2c;color:#fff;border:0;border-radius:5px;padding:3px 7px;cursor:pointer">Alles löschen</button>' +
      '</div>' +
      '<div style="max-height:190px;overflow:auto"><table style="width:100%;border-collapse:collapse;font:12px Arial"><thead><tr>' +
      '<th style="text-align:left;padding:3px 6px;background:#12303c;color:#bfe9ff">Frequenz</th>' +
      '<th style="text-align:left;padding:3px 6px;background:#12303c;color:#bfe9ff">Name</th>' +
      '<th style="text-align:right;padding:3px 6px;background:#12303c;color:#bfe9ff">Aktivzeit s.</th>' +
      '<th style="text-align:right;padding:3px 6px;background:#12303c;color:#bfe9ff">SNR dB</th>' +
      '<th style="text-align:right;padding:3px 6px;background:#12303c;color:#bfe9ff">Treffer</th>' +
      '<th style="width:18px;background:#12303c"></th></tr></thead><tbody>';
    var zeilen = "", i, k, a, akt;
    for(i = 0; i < keys.length && i < 300; i++){
      k = keys[i]; a = scan.aktiv[k];
      akt = (jetzt === Number(k));
      zeilen += '<tr style="background:' + (akt ? "#1f7a3d" : (i % 2 ? "#00000033" : "transparent")) + '">' +
        '<td style="padding:2px 6px;color:#fff;white-space:nowrap">' + hz(a.freq) + '</td>' +
        '<td style="padding:2px 6px;color:#cfe9f5;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (a.name || "—") + '</td>' +
        '<td style="padding:2px 6px;text-align:right;color:#ffe07a">' + a.zeit.toFixed(2) + '</td>' +
        '<td style="padding:2px 6px;text-align:right;color:#9effc2">' + (a.snr > -900 ? a.snr.toFixed(1) : "—") + '</td>' +
        '<td style="padding:2px 6px;text-align:right;color:' + (a.treffer ? "#35ff83" : "#cfe9f5") + '">' + a.treffer + '</td>' +
        '<td style="text-align:center"><span data-scan="del" data-k="' + k + '" style="cursor:pointer;color:#ff9c9c" title="Zeile löschen">✖</span></td></tr>';
    }
    feld.innerHTML = h + zeilen + "</tbody></table></div>";
    feld.onclick = function(e){
      var z = e.target && e.target.getAttribute ? e.target.getAttribute("data-scan") : null;
      if(z === "leer"){ scan.aktiv = {}; scan.hits = {}; scan.versuche = {}; scan.skip = {}; fmScanTabelle(); return; }
      if(z === "del"){
        var kk = e.target.getAttribute("data-k");
        if(kk){ delete scan.aktiv[kk]; delete scan.hits[kk]; fmScanTabelle(); }
      }
    };
  }catch(e){}
}
function fmScanSatzMHz(){            /* Breite eines Satzes (Umlaufs) in MHz */
  var st = 0;
  try{ st = +document.getElementById("fm-step").value || 0; }catch(e){}
  if(!st && scan.bereich && scan.bereich.schritt){ st = scan.bereich.schritt; }
  if(!st && scan.list.length > 1){ st = scan.list[1].frequency - scan.list[0].frequency; }
  var lang = scan.list.length ? scan.list.length : (scan.bereich ? 1 : 0);
  return (st * Math.max(1, lang)) / 1e6;
}
function fmScanTempoMHz(){            /* Suchgeschwindigkeit in MHz/s */
  var st = 0;
  try{ st = +document.getElementById("fm-step").value || 0; }catch(e){}
  if(!st && scan.bereich && scan.bereich.schritt){ st = scan.bereich.schritt; }
  if(!st && scan.list.length > 1){ st = scan.list[1].frequency - scan.list[0].frequency; }
  if(!st){ st = fmKanalBreite(scan.jetzt ? scan.jetzt.mode : ""); }
  return (st / 1e6) * (scan.geschw || 0);
}
function fmScanWarte(){               /* Restzeit bis zum naechsten Schritt, in Sekunden */
  if(!scan.running || scan.paused || !scan.stepStart || !scan.stepDauer){ return -1; }
  return Math.max(0, scan.stepDauer - (Date.now() - scan.stepStart)) / 1000;
}
function fmScanWarteZeigen(){
  var e = document.getElementById("fm-warte");
  if(!e){ return; }
  var w = fmScanWarte();
  var txt = (w < 0) ? "" : ("Wait " + w.toFixed(1).replace(".", ",") + " s");
  if(e.textContent !== txt){ e.textContent = txt; }
}
function fmScanSpektrum(ctx, cw, spH, band, x0, teil){
  /* v3.36: SDR#-Bild - Kanalbalken im Spektrum, Schwellenlinien, Markenreihe, Pfeile */
  if(!band || !band.b || !(band.b > 0) || spH < 16 || !scan.list.length){ return; }
  var lo = band.lo + x0 * band.b, spanne = band.b * teil;
  if(!(spanne > 0)){ return; }
  function px(f){ return (f - lo) / spanne * cw; }
  function sicht(f){ return f >= lo - 1e6 && f <= lo + spanne + 1e6; }
  var i, f2, p, kk, aktK = scan.jetzt ? Math.round(scan.jetzt.frequency) : -1;
  var unten = spH - 12;
  /* Kanalbalken */
  for(i = 0; i < scan.list.length && i < 900; i++){
    f2 = scan.list[i].frequency;
    if(!sicht(f2)){ continue; }
    kk = String(Math.round(f2));
    var hit = !!scan.hits[kk], gesehen = !!scan.aktiv[kk];
    ctx.fillStyle = hit ? "rgba(53,255,131,.95)" : (gesehen ? "rgba(90,190,255,.85)" : "rgba(140,160,170,.45)");
    p = Math.round(px(f2));
    ctx.fillRect(p, 3, (Math.round(f2) === aktK) ? 3 : 2, Math.max(4, unten - 3));
  }
  /* Schwellenlinien */
  var sch = fmScanSchwelle();
  var ySch = unten - Math.min(unten - 8, Math.max(5, sch / 30 * (unten - 8)));
  /* v3.53: Beschriftungen stehen im Kanal-Analysator - im kleinen Bild nur die Linien */
  ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, Math.round(ySch) + .5); ctx.lineTo(cw, Math.round(ySch) + .5); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "rgba(255,120,120,.95)"; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, Math.round(ySch) - 13.5); ctx.lineTo(cw, Math.round(ySch) - 13.5); ctx.stroke(); ctx.restore();
  ctx.textAlign = "left";
  /* Richtungspfeile rechts */
  ctx.textAlign = "right"; ctx.font = "900 15px Arial";
  ctx.fillStyle = "#ffd400"; ctx.fillText("\u25b2", cw - 6, 17);
  ctx.fillStyle = "rgba(255,212,0,.35)"; ctx.fillText("\u25bc", cw - 6, unten - 4);
  /* blaue Markenreihe direkt ueber dem Wasserfall */
  for(i = 0; i < scan.list.length && i < 900; i++){
    f2 = scan.list[i].frequency;
    if(!sicht(f2)){ continue; }
    kk = String(Math.round(f2));
    var istAkt = (Math.round(f2) === aktK);
    ctx.fillStyle = istAkt ? "#ff4040" : (scan.hits[kk] ? "#35ff83" : "#4aa3ff");
    ctx.fillRect(Math.round(px(f2)), spH - 9, istAkt ? 3 : 2, 7);
  }
  ctx.textAlign = "left";
}
function fmScanBild(ctx, cw, chh, spH, band, z, x0, teil){
  if(!band || !band.b || !(band.b > 0) || !scan.list.length){ return; }
  var lo = band.lo + x0 * band.b, spanne = band.b * teil;
  if(!(spanne > 0)){ return; }
  function px(f){ return (f - lo) / spanne * cw; }
  function sicht(f){ return f >= lo - 1e6 && f <= lo + spanne + 1e6; }
  var i, p, f2, w2, a1, b1, q;
  /* --- Gruppenbalken oben (wie der blaue Balken im SDR#-Bild) --- */
  var gruppe = scan.bereich
    ? ("Bereichsscan " + fmKurzFreq(scan.bereich.von) + "-" + fmKurzFreq(scan.bereich.bis) + " MHz · " + String(scan.bereich.modus || "").toUpperCase())
    : "Scanliste (" + scan.list.length + " Kanäle)";
  /* v3.55: dunkler Streifen mit Kontur - vorher war er grell blau */
  var gB = ctx.createLinearGradient(0, spH, 0, spH + 15);
  gB.addColorStop(0, "#0b3d5f"); gB.addColorStop(1, "#072c3d");
  ctx.fillStyle = gB;
  ctx.fillRect(0, spH, cw, 15);
  ctx.fillStyle = "rgba(53,209,255,.45)"; ctx.fillRect(0, spH + 14, cw, 1);
  ctx.font = "900 11px Arial"; ctx.textAlign = "left";
  ctx.fillStyle = "#eaf7ff"; ctx.fillText(gruppe, 7, spH + 11);
  if(scan.jetzt){
    var t3 = hz(scan.jetzt.frequency);
    ctx.textAlign = "right"; ctx.fillStyle = "#ffffff";
    ctx.fillText(t3 + (scan.slevel > -900 ? "   SNR " + scan.snr.toFixed(1).replace(".", ",") + " dB" : ""), cw - 7, spH + 11);
  }
  ctx.textAlign = "left";
  /* --- Kanalbaender (jeder Kanal in seiner Bandbreite) --- */
  var aktK = scan.jetzt ? Math.round(scan.jetzt.frequency) : -1;
  for(i = 0; i < scan.list.length && i < 600; i++){
    f2 = scan.list[i].frequency;
    if(!sicht(f2)){ continue; }
    w2 = fmKanalBreite(scan.list[i].mode);
    a1 = px(f2 - w2 / 2); b1 = px(f2 + w2 / 2);
    if(b1 < -4 || a1 > cw + 4){ continue; }
    var istAkt = (Math.round(f2) === aktK);
    var istHit = !!scan.hits[String(Math.round(f2))];
    ctx.fillStyle = istHit ? "rgba(53,255,131,.16)" : (istAkt ? "rgba(255,85,85,.14)" : "rgba(255,255,255,.045)");
    ctx.fillRect(a1, spH + 15, Math.max(2, b1 - a1), chh - spH - 15);
    ctx.strokeStyle = istHit ? "rgba(53,255,131,.8)" : (istAkt ? "#ff5555" : "rgba(255,255,255,.16)");
    ctx.lineWidth = istAkt ? 2 : 1;
    ctx.strokeRect(a1 + .5, spH + 14.5, Math.max(2, b1 - a1) - 1, chh - spH - 15);
  }
  /* --- Kanalnamen direkt im Bild (nur wenn uebersichtlich) --- */
  ctx.font = "700 10px Arial"; ctx.textAlign = "center";
  var letzteRe = -1e9;
  for(jj = 0; jj < scan.list.length; jj++){
    f2 = scan.list[jj].frequency; if(!sicht(f2)){ continue; }
    var nmRo = String(scan.list[jj].name || "").replace(/\s+(NFM|AM|SAM|USB|LSB|CW|DMR|D-STAR|DSTAR|TETRA|P25|NXDN|YSF|M17|FREEDV|DAB|DRM)\s*$/i, "").replace(/^Bereich\s+/i, "");
    if(!nmRo || /^[0-9.,]+\s*Hz?$/i.test(nmRo) || /^[0-9.,]+\s*MHz?$/i.test(nmRo)){ continue; }
    var istHit2 = !!scan.hits[String(Math.round(f2))];
    var px2 = px(f2), w5 = ctx.measureText(nmRo).width + 6;
    if(px2 < w5 / 2 || px2 > cw - w5 / 2 || px2 - w5 / 2 - letzteRe < 4){ continue; }
    letzteRe = px2 + w5 / 2;
    ctx.fillStyle = istHit2 ? "rgba(6,26,16,.9)" : "rgba(4,12,18,.72)";
    ctx.fillRect(px2 - w5 / 2, chh - 49, w5, 12);
    ctx.fillStyle = istHit2 ? "#9effc2" : "#cfe9f5";
    ctx.fillText(nmRo, px2, chh - 40);
  }
  ctx.textAlign = "left";
  /* --- Ticks fuer alle Rasterschritte --- */
  ctx.fillStyle = "rgba(90,180,230,.45)";
  for(i = 0; i < scan.list.length && i < 600; i++){
    f2 = scan.list[i].frequency; if(!sicht(f2)){ continue; }
    ctx.fillRect(Math.round(px(f2)), chh - 4, 1, 4);
  }
  /* --- Trefferlinien mit Namen --- */
  var k = Object.keys(scan.hits).map(Number).sort(function(a, b){ return a - b; });
  var letzte = -1e9, anzahl = 0;
  for(i = 0; i < k.length; i++){
    p = px(k[i]);
    if(p < -20 || p > cw + 20){ continue; }
    ctx.strokeStyle = "rgba(53,255,131,.8)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(Math.round(p) + .5, spH + 14); ctx.lineTo(Math.round(p) + .5, chh); ctx.stroke();
    if(p > 40 && p < cw - 90 && p - letzte > 96 && anzahl < 12){
      letzte = p; anzahl++;
      var h = scan.hits[String(k[i])];
      var t4 = "◀ " + fmKanalText(h);
      ctx.font = "700 11px Arial"; var w4 = ctx.measureText(t4).width + 8;
      var bx = Math.min(Math.max(p + 4, 2), cw - w4 - 2), by = chh - 32;
      ctx.fillStyle = "rgba(6,26,16,.9)"; ctx.fillRect(bx, by, w4, 15);
      ctx.strokeStyle = "#35ff83"; ctx.lineWidth = 1; ctx.strokeRect(bx + .5, by + .5, w4 - 1, 14);
      ctx.fillStyle = "#9effc2"; ctx.textAlign = "left"; ctx.fillText(t4, bx + 4, by + 11);
    }
  }
  /* --- Kasten an der laufenden Frequenz --- */
  if(scan.jetzt){
    p = px(scan.jetzt.frequency);
    if(p >= 0 && p <= cw){
      ctx.strokeStyle = "rgba(0,10,16,.9)"; ctx.lineWidth = 4;
      ctx.strokeRect(Math.round(p) - 7.5, spH + 14.5, 15, chh - spH - 15);
      ctx.strokeStyle = "#ff5555"; ctx.lineWidth = 2.2;
      ctx.strokeRect(Math.round(p) - 7.5, spH + 14.5, 15, chh - spH - 15);
    }
  }
}
function fmKanalText(h){
  var n = String((h && h.name) || "").replace(/\s+$/, "");
  var f = fmKurzFreq(h ? h.freq : 0);
  if(!n || /^Bereich\s/i.test(n) || n.replace(/\s+/g, "") === String(h.freq)){ return f + " MHz"; }
  return n + " · " + f + " MHz";
}
function fmKurzFreq(f){
  return (Number(f) / 1e6).toFixed(3).replace(".", ",");
}
function fmScanLineal(ctx, cw, chh, lo, spanne){
  if(!(spanne > 0)){ return; }
  function px(f){ return (f - lo) / spanne * cw; }
  var i, p;
  if(scan.bereich){
    var a1 = px(scan.bereich.von), b1 = px(scan.bereich.bis);
    if(b1 > 0 && a1 < cw){
      var x1 = Math.max(0, a1), x2 = Math.min(cw, b1);
      ctx.fillStyle = "rgba(255,90,90,.28)"; ctx.fillRect(x1, chh - 5, Math.max(1, x2 - x1), 5);
      ctx.fillStyle = "rgba(255,212,121,.8)"; ctx.fillRect(x1, chh - 7, Math.max(1, x2 - x1), 2);
    }
  }
  if(scan.list.length){
    ctx.fillStyle = "rgba(90,180,230,.4)";
    for(i = 0; i < scan.list.length && i < 400; i++){
      p = px(scan.list[i].frequency); if(p < 0 || p > cw){ continue; }
      ctx.fillRect(Math.round(p), chh - 10, 1, 3);
    }
  }
  var k = Object.keys(scan.hits).map(Number).sort(function(a, b){ return a - b; });
  for(i = 0; i < k.length; i++){
    p = px(k[i]); if(p < -6 || p > cw + 6){ continue; }
    ctx.fillStyle = "#35ff83";
    ctx.beginPath(); ctx.moveTo(Math.round(p) - 3, chh - 10); ctx.lineTo(Math.round(p) + 3, chh - 10);
    ctx.lineTo(Math.round(p), chh - 4); ctx.closePath(); ctx.fill();
  }
}
function stepScan(force){
  if(!scan.running || (scan.paused && !force)){ return; }
  clearTimeout(scan.timer);
  if(!scan.list.length){ return; }
  /* v3.29: Auto-Skip - Kanaele ohne Signal eine Weile ueberspringen */
  var skipN = +(document.getElementById("fm-skip-n") || {}).value || 0;
  var skipS = +(document.getElementById("fm-skip-s") || {}).value || 30;
  var suche = 0;
  do{
    scan.index = (scan.index + 1) % scan.list.length;
    if(scan.index === 0){ scan.runden++; }
    suche++;
  } while(suche < scan.list.length && skipN > 0 && scan.skip[String(Math.round(scan.list[scan.index].frequency))] > Date.now());
  var f = scan.list[scan.index];
  scan.jetzt = f;
  if(!scan.start){ scan.start = Date.now(); }
  scan.schritte++;
  if(!scan.schrittZeit){ scan.schrittZeit = Date.now(); }
  else if(Date.now() - scan.schrittZeit >= 1000){
    scan.geschw = Math.round(scan.schritte * 1000 / (Date.now() - scan.schrittZeit));
    scan.schritte = 0; scan.schrittZeit = Date.now();
  }
  tune(f);
  status("Scan " + (scan.index + 1) + "/" + scan.list.length + ": " + f.name + " · " + hz(f.frequency));
  fmScanKopf(); fmScanTabelle();
  var dwell = +document.getElementById("fm-dwell").value || 1200;
  var hold  = +document.getElementById("fm-hold").value || 4000;
  var lock  = +(document.getElementById("fm-lock") || {}).value || 0;
  var sch   = fmScanSchwelle();
  scan.stepStart = Date.now(); scan.stepDauer = dwell;   /* v3.36: fuer "Wait x,x s" */
  scan.timer = setTimeout(function(){
    var level = smeter(), sock = fmRauschsockel(level), snr = level - sock;
    scan.slevel = level; scan.snr = snr;
    var modus = (document.getElementById("fm-detect") || {}).value || "snr";
    var hit = false;
    if(level > -900){
      if(modus === "smeter"){ hit = level >= sch; }
      else if(modus === "both"){ hit = (snr >= sch); }
      else { hit = snr >= sch; }
    }
    scan.treffer = hit;
    var kf = String(Math.round(f.frequency));
    /* v3.29: Aktivitaet fuer jeden Kanal mitschreiben */
    if(hit){ fmTreffer(f, level, snr, dwell + Math.max(hold, lock || 0)); }
    fmAktiv(f, dwell + (hit ? Math.max(hold, lock || 0) : 0), snr, hit);
    if(!hit){
      scan.versuche[kf] = (scan.versuche[kf] || 0) + 1;
      if(skipN > 0 && scan.versuche[kf] >= skipN){ scan.skip[kf] = Date.now() + skipS * 1000; scan.versuche[kf] = 0; }
    } else {
      scan.versuche[kf] = 0; delete scan.skip[kf];
      tone();
      status("TREFFER " + f.name + " · SNR " + snr.toFixed(1) + " dB (S " + level.toFixed(1) + " dB)");
    }
    /* v3.29: Zeilen mit Aktivitaet < x alle y Sekunden loeschen */
    try{
      var dmin = +(document.getElementById("fm-del-aktiv") || {}).value || 0;
      var dsek = +(document.getElementById("fm-del-s") || {}).value || 3;
      if(dmin > 0 && (!scan.delZeit || Date.now() - scan.delZeit >= dsek * 1000)){
        scan.delZeit = Date.now();
        for(var kk in scan.aktiv){
          if(scan.aktiv[kk].zeit < dmin && Number(kk) !== Number(kf)){ delete scan.aktiv[kk]; delete scan.hits[kk]; }
        }
      }
    }catch(e){}
    var halte = hit ? Math.max(hold, lock || 0) : 0;
    scan.stepStart = Date.now(); scan.stepDauer = hit ? halte : 0;   /* v3.36 */
    if(hit){ scan.timer = setTimeout(function(){ stepScan(false); }, halte); }
    else { stepScan(false); }
    fmScanKopf(level, snr, hit); fmScanTabelle();
  }, dwell);
}
function stopScan(){scan.running=false;scan.paused=false;clearTimeout(scan.timer);try{fmKnoepfeMalen()}catch(e){}status("Scanner gestoppt · " + (function(){var n=0;for(var k in scan.hits)n++;return n;})() + " Treffer");fmScanKopf();fmScanTabelle()}
function currentProfileRange(){try{if(typeof center_freq!=="undefined"&&typeof bandwidth!=="undefined"&&Number.isFinite(+center_freq)&&Number.isFinite(+bandwidth)&&+bandwidth>0)return{min:+center_freq-(+bandwidth/2),max:+center_freq+(+bandwidth/2)}}catch(e){}return null}
function syncProfileRange(force){let r=currentProfileRange(),a=document.getElementById("fm-rstart"),b=document.getElementById("fm-rend");if(!r||!a||!b)return;a.min=String(Math.round(r.min));a.max=String(Math.round(r.max));b.min=a.min;b.max=a.max;if(force||!a.value.trim())a.value=(r.min/1e6).toFixed(6)+" MHz";if(force||!b.value.trim())b.value=(r.max/1e6).toFixed(6)+" MHz";a.title=b.title="Aktuelles Profil: "+hz(r.min)+" bis "+hz(r.max)}
function makeRange(){let a=parseFreq(document.getElementById("fm-rstart").value),b=parseFreq(document.getElementById("fm-rend").value),st=+document.getElementById("fm-step").value,m=document.getElementById("fm-rmode").value;if(!Number.isFinite(a)||!Number.isFinite(b)||st<=0||b<a)return status("Ungültiger Bereich");let pr=currentProfileRange();if(!pr)return status("Profilbereich nicht verfügbar");if(a<Math.ceil(pr.min)||b>Math.floor(pr.max))return status("Nur aktuelles Profil erlaubt: "+hz(pr.min)+" bis "+hz(pr.max));let modes=selectedModes();if(!modes.length)modes=String(m||"nfm").split(",").map(x=>x.trim()).filter(Boolean);if(((b-a)/st+1)*modes.length>2000)return status("Maximal 2000 Frequenz-/Modusschritte");scan.list=[];for(let f=a;f<=b;f+=st)modes.forEach(md=>scan.list.push({id:"range-"+f+"-"+md,name:"Bereich "+hz(f)+" "+md.toUpperCase(),frequency:f,mode:md,category:"digital",icon:"🔍",color:"#38bdf8",store:"temp",scannable:true}));fmScanNeu("bereich");scan.bereich={von:a,bis:b,schritt:st,modus:modes.join(",")};scan.running=true;scan.paused=false;scan.index=-1;stepScan(true);try{fmAnalyserZeigen()}catch(e){}}
function logHit(f,l){let x={...f,id:Date.now()+"",name:"Treffer "+f.name,description:`Automatisch gefunden: ${l.toFixed(1)} dB`,store:"temp",scannable:false};favorites.push(x);save();render()}
function shapeClass(v){v=String(v||"Kreis").toLowerCase();return v.includes("quadrat")?"square":v.includes("raute")?"diamond":v.includes("stern")?"star":v.includes("fahne")?"flag":v.includes("dreieck")?"triangle":"circle"}
function markers(){let p=document.getElementById("openwebrx-frequency-container");if(!p||typeof center_freq==="undefined"||typeof bandwidth==="undefined")return;let l=p.querySelector(".dnx-fm-marker-layer");if(!l){l=document.createElement("div");l.className="dnx-fm-marker-layer";p.appendChild(l)}let visible=favorites.filter(f=>f.frequency>=center_freq-bandwidth/2&&f.frequency<=center_freq+bandwidth/2);l.innerHTML=visible.map(f=>`<span class="dnx-fm-marker" data-id="${esc(f.id)}" title="${esc(f.name)} · ${hz(f.frequency)} · ${(f.mode||"").toUpperCase()}" style="--c:${esc(f.color||cat(f.category).color)};left:${((f.frequency-(center_freq-bandwidth/2))/bandwidth*100).toFixed(3)}%"><i class="dnx-fm-shape dnx-shape-${shapeClass(f.shape)}"></i><b>${esc(f.icon||"★")} ${esc(f.name)}</b></span>`).join("");l.querySelectorAll(".dnx-fm-marker").forEach(m=>m.onclick=function(e){e.preventDefault();e.stopPropagation();let f=favorites.find(x=>x.id===m.dataset.id);if(f)tune(f)})}
function editCats(){let txt=prompt("Kategorien als Name|Icon|#Farbe, eine Zeile je Kategorie",cats.map(c=>`${c.name}|${c.icon}|${c.color}`).join("\n"));if(txt===null)return;cats=txt.split(/\n/).map((x,i)=>{let p=x.split("|");return{id:"custom"+i,name:p[0]||"Kategorie",icon:p[1]||"★",color:p[2]||"#94a3b8"}});save();optionCats(document.getElementById("fm-cat"));render()}
function toCSV(){return["Name;Frequenz;Modus;Kategorie;Icon;Farbe;Beschreibung",...favorites.map(f=>[f.name,f.frequency,f.mode,f.category,f.icon,f.color,f.description].map(x=>'"'+String(x||"").replace(/"/g,'""')+'"').join(";"))].join("\n")}
function download(n,d,t){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([d],{type:t}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importFile(e){let f=e.target.files[0];if(!f)return;let r=new FileReader;r.onload=()=>{try{let d=JSON.parse(r.result);if(Array.isArray(d.categories))cats=d.categories;if(Array.isArray(d.favorites))favorites=d.favorites;else if(Array.isArray(d))favorites=d;save();render();status("Import erfolgreich")}catch(x){status("Importfehler: JSON erwartet")}};r.readAsText(f)}
function detach(w){if(detached&&!detached.closed){detached.focus();return}detached=window.open("","DNXScannerManager","width=1200,height=800");if(!detached)return;detached.document.write(`<html><head><title>SDR Scanner</title></head><body style="margin:0;background:#101820"></body></html>`);detached.document.head.appendChild(document.getElementById("dnx-fm-style").cloneNode(true));detached.document.body.appendChild(w);w.style.cssText="display:block;position:fixed;left:0;top:0;width:100vw;height:100vh;resize:none";let iv=setInterval(()=>{if(detached.closed){clearInterval(iv);document.body.appendChild(w);w.style.cssText="display:block"}},500)}
/* ================= v3.13: Ziehen + Vordergrund-Regel + Live-Lupe ================= */
var FM_POS = "dnx.fm.pos.v4";
var FM_ZIEHT = false;          /* v3.20: waehrend des Ziehens nicht nach vorn holen */
var FM_VORN = "scanner";      /* v3.21: wer liegt vorn - "scanner" oder "empfaenger" */
function fmKlemmen(w){
  var b = w.getBoundingClientRect(), vw = window.innerWidth || 1200, vh = window.innerHeight || 800;
  var l = b.left, t = b.top;
  if(b.width <= vw){ l = Math.min(Math.max(l, 8 - b.width + 140), vw - 140); } else { l = 0; }
  if(b.height <= vh){ t = Math.min(Math.max(t, 0), vh - 48); } else { t = 0; }
  if(Math.round(l) !== Math.round(b.left)){ w.style.left = Math.round(l) + "px"; }
  if(Math.round(t) !== Math.round(b.top)){ w.style.top = Math.round(t) + "px"; }
}
function fmMerken(w){ try{ localStorage.setItem(FM_POS, JSON.stringify({l:w.offsetLeft,t:w.offsetTop})); }catch(e){} }
function fmOrt(w){
  try{
    var p = JSON.parse(localStorage.getItem(FM_POS) || "null");
    if(p && isFinite(p.l) && isFinite(p.t) && !w.classList.contains("max")){
      w.style.left = Math.round(p.l) + "px"; w.style.top = Math.round(p.t) + "px";
    }
  }catch(e){}
  fmKlemmen(w);
}
/* Scanner anklicken = nach vorn, aber unter den roten Linien und unter dem
   Empfaenger-Hinweis "Frequenz geaendert" (2147483300) bleiben. */
function fmHoch(w){
  /* Begruessungs-Fenster nicht ueberdecken: solange es offen ist, bleibt der Scanner darunter */
  try{
    var m = document.getElementById("dnx-welcome-modal");
    if(m){
      var ms = getComputedStyle(m), mr = m.getBoundingClientRect();
      if(ms.display !== "none" && ms.visibility !== "hidden" && mr.height > 200){
        w.classList.remove("dnx-fm-vorn"); w.style.zIndex = ""; return;
      }
    }
  }catch(e){}
  try{ FM_VORN = "scanner"; w.classList.add("dnx-fm-vorn"); w.style.zIndex = "2147483647"; }catch(e){}
  try{                       /* v3.27: nur umhaengen, wenn wirklich verdeckt */
    if(w.parentElement === document.body && document.body.lastElementChild !== w){
      var q0 = w.getBoundingClientRect();
      var p0 = document.elementFromPoint(Math.round(q0.left + q0.width / 2), Math.round(q0.top + 20));
      if(!(p0 && (p0 === w || w.contains(p0)))){
        /* Scrollpositionen merken - ein DOM-Umhaengen setzt sie sonst auf 0
           (das war der Sprung der linken Spalte beim Klick auf Start/Stopp) */
        var merker = [];
        try{
          var sc = w.querySelectorAll(".dnx-fm-side, .dnx-fm-main");
          for(var i = 0; i < sc.length; i++){ merker.push([sc[i], sc[i].scrollTop]); }
        }catch(e){}
        var seiteY = window.scrollY || window.pageYOffset || 0;
        document.body.appendChild(w);
        for(i = 0; i < merker.length; i++){ try{ merker[i][0].scrollTop = merker[i][1]; }catch(e){} }
        try{ if(seiteY){ window.scrollTo(0, seiteY); } }catch(e){}
      }
    }
  }catch(e){}
  try{ if(window.dnxLinienWache) window.dnxLinienWache(); }catch(e){}
  try{ if(window.dnxSyncJetzt) window.dnxSyncJetzt(); }catch(e){}
}
function drag(w){
  var an = false, x0 = 0, y0 = 0, l0 = 0, t0 = 0;
  function bedien(z){                       /* Bedienelemente nicht als Ziehflaeche */
    var e = z;
    for(var i = 0; i < 4 && e; i++){
      if(e.classList && e.classList.contains("dnx-fm-col-griff")){ return true; }
      if(e.tagName === "BUTTON" || e.tagName === "INPUT" || e.tagName === "SELECT" ||
         e.tagName === "TEXTAREA" || e.tagName === "A" || e.tagName === "OPTION"){ return true; }
      e = e.parentNode;
    }
    return false;
  }
  w.addEventListener("pointerdown", function(e){       /* ganzes Fenster ist Ziehflaeche */
    try{ fmHoch(w); }catch(err){}
    if(typeof e.button === "number" && e.button !== 0){ return; }   /* nur linke Maustaste */
    if(bedien(e.target)){ return; }
    an = true; FM_ZIEHT = true; x0 = e.clientX; y0 = e.clientY; l0 = w.offsetLeft; t0 = w.offsetTop;
  }, true);
  document.addEventListener("pointermove", function(e){
    if(!an){ return; }
    if(w.classList.contains("max")){ an = false; return; }
    var dx = e.clientX - x0, dy = e.clientY - y0;
    if(Math.abs(dx) + Math.abs(dy) < 2){ return; }
    w.style.left = Math.round(l0 + dx) + "px";
    w.style.top = Math.round(t0 + dy) + "px";
    fmKlemmen(w);
  }, true);
  function ende(){
    if(!an){ return; }
    FM_ZIEHT = false;
    an = false;
    if(!w.classList.contains("max")){ fmMerken(w); }
  }
  document.addEventListener("pointerup", ende, true);
  document.addEventListener("pointercancel", ende, true);
  window.addEventListener("blur", ende);
}

/* ------------------------------- Live-Lupe: lebendes Bild des Empfaengers ------------------------------- */
var LUPE = { wf:null, sp:null, takte:0, letzteFreq:0 };
function fmBand(){
  try{
    if(typeof center_freq !== "undefined" && typeof bandwidth !== "undefined"){
      var c = Number(center_freq), b = Number(bandwidth);
      if(isFinite(c) && isFinite(b) && b > 0){ return { lo:c - b/2, b:b }; }
    }
  }catch(e){}
  return null;
}
function fmAnzeigeFreq(){
  var ids = ["openwebrx-frequency", "webrx-frequency", "openwebrx-tune-frequency"];
  for(var i = 0; i < ids.length; i++){
    var e = document.getElementById(ids[i]);
    if(e){
      var m = String(e.textContent || "").match(/([0-9][0-9.,]*)\s*(MHz|kHz|Hz)/i);
      if(m){
        var v = parseFloat(m[1].replace(/\./g, "").replace(",", "."));
        var u = m[2].toLowerCase();
        if(isFinite(v)){ return Math.round(v * (u === "mhz" ? 1e6 : u === "khz" ? 1e3 : 1)); }
      }
    }
  }
  return 0;
}
function fmFreq(){
  try{
    if(typeof UI !== "undefined" && UI.getFrequency){
      var f = Number(UI.getFrequency());
      if(isFinite(f) && f > 1000){ LUPE.letzteFreq = f; return f; }
    }
  }catch(e){}
  var a = fmAnzeigeFreq();
  if(a){ LUPE.letzteFreq = a; return a; }
  return LUPE.letzteFreq;
}
function fmHell(cv){          /* Stichprobe aus der Bildmitte: leerer Puffer => ~0 */
  try{
    var t = document.createElement("canvas"); t.width = 80; t.height = 24;
    var x = t.getContext("2d");
    var sx = Math.max(0, Math.round(cv.width / 2) - 40), sy = Math.max(0, Math.round(cv.height * 0.55) - 12);
    x.drawImage(cv, sx, sy, 80, 24, 0, 0, 80, 24);
    var d = x.getImageData(0, 0, 80, 24).data, s = 0, mx = 0;
    for(var i = 0; i < d.length; i += 4){ var v = (d[i] + d[i+1] + d[i+2]) / 3; s += v; if(v > mx){ mx = v; } }
    return s / (d.length / 4) + mx / 10;
  }catch(e){ return -1; }
}
function fmFlaechen(neu){
  if(!neu && LUPE.wf && LUPE.wf.isConnected && LUPE.sp && LUPE.sp.isConnected){
    LUPE.takte++;
    if(LUPE.takte % 8 !== 0){ return true; }        /* v3.16: alle 2 s pruefen, ob die Quelle noch stimmt */
  }
  LUPE.wf = null; LUPE.sp = null; LUPE.takte = 0;
  var kand = [], alle = [];
  try{ alle = document.querySelectorAll("#webrx-canvas-container canvas"); }catch(e){}
  var i;
  for(i = 0; i < alle.length; i++){ kand.push(alle[i]); }
  if(!kand.length){                        /* Notfall: groesstes lebendes Canvas der Seite */
    try{ alle = document.querySelectorAll("canvas"); }catch(e){ alle = []; }
    var rest = [];
    for(i = 0; i < alle.length; i++){
      var cc = alle[i];
      if(cc.id && cc.id.indexOf("dnx") === 0){ continue; }
      if(cc.id && cc.id.indexOf("fm-") === 0){ continue; }
      if(cc.classList && cc.classList.contains("dnx-eq-mini")){ continue; }
      if(cc.width < 200 || cc.height < 30){ continue; }
      rest.push(cc);
    }
    rest.sort(function(a, b){ return (b.width * b.height) - (a.width * a.height); });
    kand = rest;
  }
  var vw = window.innerWidth || 1200, vh = window.innerHeight || 800;
  var gut = [], not = [];
  for(var j = 0; j < kand.length; j++){
    var q = kand[j].getBoundingClientRect();
    if(q.width < 100 || q.height < 20){ continue; }                            /* zu klein */
    if(q.bottom < 0 || q.top > vh || q.right < 0 || q.left > vw){ continue; }  /* ausserhalb des Bildes */
    not.push(kand[j]);
    if(fmHell(kand[j]) >= 1){ gut.push(kand[j]); }
  }
  /* v3.16: das NEUESTE Canvas im DOM ist das lebende; alte bleiben bei OpenWebRX stehen */
  /* v3.22: sichtbares Bild bevorzugen - unsichtbare Alt-Canvas nicht mehr nehmen */
  var gutS = [], gutQ;
  for(i = 0; i < gut.length; i++){
    gutQ = gut[i].getBoundingClientRect();
    if(gutQ.bottom > 0 && gutQ.top < vh && gutQ.right > 0 && gutQ.left < vw){ gutS.push(gut[i]); }
  }
  if(gutS.length){ LUPE.wf = gutS[gutS.length - 1]; }
  else if(gut.length){ LUPE.wf = gut[gut.length - 1]; }
  else if(not.length){ LUPE.wf = not[not.length - 1]; }
  else { LUPE.wf = null; }
  LUPE.sp = document.getElementById("openwebrx-spectrum-canvas");
  return !!LUPE.wf;
}
function fmFmt(f){ return (Number(f) / 1e6).toFixed(4).replace(".", ",") + " MHz"; }
/* ---------- v3.14: Frequenz-Lineal + Zoom rein/raus ---------- */
var FMZOOM = [1, 2, 4, 8, 16, 32, 64];
var FMLEITER = [10, 20, 25, 50, 100, 125, 200, 250, 500, 1000, 2000, 2500, 5000, 10000,
                12500, 20000, 25000, 50000, 100000, 200000, 250000, 500000, 1000000,
                2000000, 5000000, 10000000];
function fmZoomSchritt(richtung){
  var el = document.getElementById("fm-live-zoom");
  var z = el ? Number(el.value) : 4;
  if(!isFinite(z) || z < 1){ z = 1; }
  var i = FMZOOM.indexOf(z);
  if(i < 0){ i = 2; }
  i = Math.min(FMZOOM.length - 1, Math.max(0, i + richtung));
  if(el){ el.value = String(FMZOOM[i]); }
  return FMZOOM[i];
}
function fmLupeVerdrahten(){
  var sec = document.getElementById("dnx-fm-live-sec");
  if(!sec || sec.__verd){ return; }
  sec.__verd = true;
  sec.addEventListener("click", function(e){
    var b = (e.target && e.target.closest) ? e.target.closest("[data-fmzoom]") : null;
    if(!b){ return; }
    e.preventDefault(); e.stopPropagation();
    fmZoomSchritt(Number(b.getAttribute("data-fmzoom")) || 0);
  }, true);
  var c = document.getElementById("fm-live-canvas");
  if(c){
    c.addEventListener("wheel", function(e){
      e.preventDefault(); e.stopPropagation();
      fmZoomSchritt(e.deltaY < 0 ? 1 : -1);
    }, {passive:false});
  }
}
function fmSchritt(span, breite){          /* nette Schrittweite fuer das Lineal */
  var maxN = Math.max(3, Math.floor(breite / 62));
  for(var i = 0; i < FMLEITER.length; i++){ if(span / FMLEITER[i] <= maxN){ return FMLEITER[i]; } }
  return FMLEITER[FMLEITER.length - 1];
}
function fmZahl(f, step){
  var dez = step >= 10000 ? 3 : step >= 1000 ? 4 : step >= 100 ? 5 : 6;
  return (f / 1e6).toFixed(dez).replace(".", ",");
}
function fmLinal(band, freq, x0, teil, z, an){
  var c = document.getElementById("fm-live-lineal");
  if(!c){ return; }
  var ctx = c.getContext("2d"), cw = c.width, chh = c.height;
  ctx.clearRect(0, 0, cw, chh);
  ctx.fillStyle = "#08131a"; ctx.fillRect(0, 0, cw, chh);
  ctx.strokeStyle = "rgba(53,209,255,.32)"; ctx.lineWidth = 1; ctx.strokeRect(.5, .5, cw - 1, chh - 1);
  if(!an){
    ctx.fillStyle = "#6c7c88"; ctx.font = "11px Arial"; ctx.textAlign = "left";
    ctx.fillText("Lineal aus", 8, 18); ctx.textAlign = "start"; return;
  }
  if(!band){
    ctx.fillStyle = "#6c7c88"; ctx.font = "11px Arial"; ctx.textAlign = "left";
    ctx.fillText("Lineal: Empfaenger liefert noch keine Banddaten", 8, 18); ctx.textAlign = "start"; return;
  }
  var lo = band.lo + x0 * band.b, spanne = band.b * teil, hi = lo + spanne;
  if(!(spanne > 0)){ return; }
  var step = fmSchritt(spanne, cw), fein = step / 5, f;
  ctx.strokeStyle = "rgba(120,190,215,.40)";
  for(f = Math.ceil(lo / fein) * fein; f <= hi; f += fein){
    var q = (f - lo) / spanne * cw;
    ctx.beginPath(); ctx.moveTo(q, 0); ctx.lineTo(q, 5); ctx.stroke();
  }
  ctx.font = "11px Arial"; ctx.textAlign = "center";
  for(f = Math.ceil(lo / step) * step; f <= hi; f += step){
    var p = (f - lo) / spanne * cw;
    ctx.strokeStyle = "#7fd8f0"; ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 10); ctx.stroke();
    ctx.fillStyle = "#cfe9f5";
    ctx.fillText(fmZahl(f, step), Math.min(Math.max(p, 34), cw - 34), 23);
  }
  ctx.textAlign = "left"; ctx.font = "10px Arial"; ctx.fillStyle = "#8fb0c0";
  ctx.fillText("MHz", 6, 11);
  ctx.textAlign = "right";
  ctx.fillText("Spanne " + (spanne >= 1e6 ? (spanne / 1e6).toFixed(3).replace(".", ",") + " MHz"
                                             : Math.round(spanne / 1000) + " kHz"), cw - 6, 11);
  ctx.textAlign = "left";
  if(freq){
    var mx = (freq - lo) / spanne * cw;
    if(mx >= 0 && mx <= cw){
    ctx.fillStyle = "rgba(0,14,20,.85)"; ctx.fillRect(mx - 3, 0, 7, chh);
    ctx.fillStyle = "#2ee0ff"; ctx.fillRect(mx - 2, 0, 5, chh);
    ctx.fillStyle = "#eafcff"; ctx.fillRect(mx, 0, 1, chh);
  }
  }
  try{ fmScanLineal(ctx, cw, chh, lo, spanne); }catch(e){}
}
var LEBEN = { sig: "", gleich: 0 };
function fmLeben(art, c, y0){
  var el = document.getElementById("fm-live-lebt");
  if(!el){ return; }
  function mal(t, f){ if(el.textContent !== t){ el.textContent = t; } el.style.color = f; }
  if(art === "aus"){ LEBEN.sig = ""; LEBEN.gleich = 0; mal("\u25cf angehalten", "#ffcf6b"); return; }
  if(art === "leer"){ LEBEN.sig = ""; LEBEN.gleich = 0; mal("\u25cf kein Bild", "#ff8080"); return; }
  try{
    var t = document.createElement("canvas"); t.width = 24; t.height = 6;
    var x = t.getContext("2d");
    x.drawImage(c, 0, y0, c.width, Math.max(1, c.height - y0), 0, 0, 24, 6);
    var d = x.getImageData(0, 0, 24, 6).data, sg = "";
    for(var i = 0; i < d.length; i += 16){ sg += d[i] + "," + d[i + 1] + ";"; }
    if(sg === LEBEN.sig){ LEBEN.gleich++; } else { LEBEN.sig = sg; LEBEN.gleich = 0; }
    if(LEBEN.gleich >= 12){ mal("\u25cf steht", "#ff8080"); } else { mal("\u25cf l\u00e4uft", "#9effc2"); }
  }catch(e){ mal("\u25cf ?", "#ffcf6b"); }
}
function fmLupeTakt(){
  var w = document.getElementById("dnx-fm-window");
  if(!w){ return; }
  try{ if(getComputedStyle(w).display === "none"){ return; } }catch(e){}
  var c = document.getElementById("fm-live-canvas");
  if(!c){ return; }
  try{                                   /* v3.21: 1 Bildpunkt = 1 Zeile wie im Empfaenger */
    var bq = c.getBoundingClientRect();
    /* v3.47: Leinwand in echten Bildpunkten - bei 125 % Bildschirmskalierung wurde das Bild
       vorher vom Browser hochgerechnet und dabei zu einem schraegen Pixelmuster verzerrt. */
    var dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    var bw = Math.max(200, Math.round(bq.width * dpr)), bh = Math.max(80, Math.round(bq.height * dpr));
    if(Math.abs(c.width - bw) > 2 || Math.abs(c.height - bh) > 2){ c.width = bw; c.height = bh; }
  }catch(e){}
  var anEl = document.getElementById("fm-live-an"), spEl = document.getElementById("fm-live-sp"),
      zEl = document.getElementById("fm-live-zoom"), hin = document.getElementById("dnx-fm-live-hinweis"),
      frei = document.getElementById("fm-live-freq"), tk = document.getElementById("fm-live-scan");
  fmLupeVerdrahten();
  var linEl = document.getElementById("fm-live-lin");
  var linAn = linEl ? !!linEl.checked : true;
  var an = anEl ? !!anEl.checked : true, spAn = spEl ? !!spEl.checked : true;
  var z = zEl ? Number(zEl.value) : 4;
  if(!isFinite(z) || z < 1){ z = 1; }
  /* v3.48: in CSS-Pixeln zeichnen, der Massstab k macht daraus echte Bildpunkte -
     bei 125 % Bildschirmskalierung bleibt so alles scharf und die Schrift gleich gross */
  var kk = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  FM_LIN.dpr = kk;
  var ctx = c.getContext("2d"), cw = c.width / kk, chh = c.height / kk;
  try{ ctx.setTransform(kk, 0, 0, kk, 0, 0); }catch(e){}
  var freq0 = fmFreq(), band0 = fmBand();
  var teil0 = 1 / z, x00 = 0.5 - teil0 / 2, mark0 = -1;
  if(band0 && freq0){
    var fxA = (freq0 - band0.lo) / band0.b;
    if(isFinite(fxA)){ x00 = Math.min(Math.max(fxA - teil0 / 2, 0), 1 - teil0); mark0 = (fxA - x00) / teil0; }
  }
  if(frei){ frei.textContent = freq0 ? fmFmt(freq0) : "\u2014"; }
  if(tk){
    /* v3.59: kurze Fassung - die lange Meldung brach die Zeile um */
    var st = document.getElementById("fm-status");
    var tS = (st && st.textContent) ? String(st.textContent) : "bereit";
    var mS = /^Scan (\d+)\/(\d+):[^0-9]*([0-9][0-9.,]*\s*Hz)/.exec(tS);
    if(mS){ tS = "Scan " + mS[1] + "/" + mS[2] + " \u00b7 " + mS[3]; }
    else if(tS.length > 40){ tS = tS.slice(0, 38) + "\u2026"; }
    if(tk.textContent !== tS){ tk.textContent = tS; }
  }
  fmLinal(band0, freq0, x00, teil0, z, linAn);
  ctx.fillStyle = "#04070b"; ctx.fillRect(0, 0, cw, chh);
  function meldung(t){
    ctx.fillStyle = "#7c8b96"; ctx.font = "700 14px Arial"; ctx.textAlign = "center";
    ctx.fillText(t, cw / 2, chh / 2); ctx.textAlign = "start";
    if(hin){ hin.textContent = t; }
    fmLeben(t.indexOf("angehalten") >= 0 ? "aus" : "leer");
  }
  if(!an){ meldung("Live-Bild angehalten"); return; }
  if(!fmFlaechen(false)){ meldung("OpenWebRX-Wasserfall noch nicht bereit"); return; }
  var freq = freq0, band = band0, teil = teil0, x0 = x00, mark = mark0;
  var spH = spAn ? Math.round(chh * 0.29) : 0, wf = LUPE.wf, sp = LUPE.sp;
  if(spH > 0 && sp && sp.width){
    try{ ctx.drawImage(sp, Math.round(x0 * sp.width), 0, Math.max(2, Math.round(teil * sp.width)), sp.height,
                       0, 0, cw, spH); }catch(e){}
    ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.fillRect(0, spH - 1, cw, 1);
  }
  var regH = Math.max(20, chh - spH);
  FM_LIN.cw2 = cw; FM_LIN.regH = regH;          /* v3.24: Groesse fuer das Spiegelbild */
  try{ ctx.imageSmoothingEnabled = true; if(ctx.imageSmoothingQuality){ ctx.imageSmoothingQuality = "high"; } }catch(e){}
  if(wf && wf.width){
    try{
      /* v3.23: Der Wasserfall ist eine eigene Bildrolle (fmLinTakt), die in derselben
         Richtung laeuft wie der echte Wasserfall im Empfaenger: neueste Zeile oben,
         Inhalt wandert nach unten. Hier wird sie nur in die Anzeige gesetzt. */
      fmLinRolleAnfordern();      /* v3.26: Rolle wird von fmLinTakt gefuellt */
      var rolle = FM_LIN.rolle;
      if(rolle && rolle.width){
        /* v3.48: die Rolle liegt in echten Bildpunkten vor -> ohne Massstab einsetzen */
        ctx.save();
        try{ ctx.setTransform(1, 0, 0, 1, 0, 0); }catch(e){}
        ctx.drawImage(rolle, 0, Math.round(spH * kk));
        ctx.restore();
      }
    }catch(e){}
  }
  if(mark >= 0 && mark <= 1){
    var mx = Math.round(mark * cw);
    /* v3.55: Kontur, damit die Linie auf jedem Farbton zu sehen ist */
    ctx.fillStyle = "rgba(0,14,20,.85)"; ctx.fillRect(mx - 3, 0, 7, chh);
    ctx.fillStyle = "#2ee0ff"; ctx.fillRect(mx - 2, 0, 5, chh);
    ctx.fillStyle = "#eafcff"; ctx.fillRect(mx, 0, 1, chh);
    var lw = 92, lx = Math.min(Math.max(mx - lw / 2, 2), cw - lw - 2);
    ctx.fillStyle = "#07160e"; ctx.fillRect(lx, 4, lw, 16);
    ctx.strokeStyle = "#28ff72"; ctx.lineWidth = 1; ctx.strokeRect(lx + .5, 4.5, lw - 1, 15);
    ctx.fillStyle = "#9effc2"; ctx.font = "700 11px Arial"; ctx.textAlign = "center";
    ctx.fillText("Scan-Frequenz", lx + lw / 2, 16); ctx.textAlign = "start";
  }
  try{ fmScanSpektrum(ctx, cw, spH, band, x0, teil); }catch(e){}
  try{ fmScanBild(ctx, cw, chh, spH, band, z, x0, teil); }catch(e){}
  try{ fmScanWarteZeigen(); }catch(e){}
  ctx.strokeStyle = "rgba(50,230,255,.35)"; ctx.lineWidth = 1; ctx.strokeRect(x0 > 0 ? .5 : .5, spH + .5, cw - 1, chh - spH - 1);
  var db = -999;
  try{ db = smeter(); }catch(e){ db = -999; }
  var thr = Number((document.getElementById("fm-thr") || {}).value), treffer = false;
  if(isFinite(thr) && db > -900){ treffer = db >= thr; }
  var pkt = document.getElementById("fm-live-punkt");
  if(pkt){ pkt.style.background = treffer ? "#ff3b3b" : "#2b8f57"; pkt.style.boxShadow = "0 0 8px " + (treffer ? "#ff3b3b" : "#2b8f57"); }
  if(db > -900){
    var st2 = "S-Meter " + db.toFixed(1).replace(".", ",") + " dB" + (treffer ? "   \u25cf TREFFER" : "");
    ctx.font = "900 12px Arial"; ctx.textAlign = "left";
    var sw = ctx.measureText(st2).width + 18;
    ctx.fillStyle = treffer ? "rgba(74,12,12,.96)" : "rgba(5,14,20,.95)";
    ctx.strokeStyle = treffer ? "#ff7b7b" : "#35d1ff88"; ctx.lineWidth = 1.2;
    var sx = 8, sy = spH + 19, sh2 = 17, rr = 5;
    ctx.beginPath();
    ctx.moveTo(sx + rr, sy);
    ctx.lineTo(sx + sw - rr, sy); ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + rr);
    ctx.lineTo(sx + sw, sy + sh2 - rr); ctx.quadraticCurveTo(sx + sw, sy + sh2, sx + sw - rr, sy + sh2);
    ctx.lineTo(sx + rr, sy + sh2); ctx.quadraticCurveTo(sx, sy + sh2, sx, sy + sh2 - rr);
    ctx.lineTo(sx, sy + rr); ctx.quadraticCurveTo(sx, sy, sx + rr, sy);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = treffer ? "#ffd6d6" : "#c9ffe0";
    ctx.fillText(st2, sx + 9, sy + 12.5);
  }
  if(hin){
    var breite = band ? (band.b / z) : 0;
    hin.textContent = (breite ? Math.round(breite / 1000) + " kHz Ausschnitt" : "Ausschnitt") +
      " \u00b7 Lupe " + z + "\u00d7 (Zoom: \u2212 / + oder Mausrad) \u00b7 Lineal in MHz \u00b7 gr\u00fcner Strich = gerade gescannte Frequenz \u00b7 Quelle: OpenWebRX-Wasserfall " +
      (wf ? wf.width + "\u00d7" + wf.height : "?") + " px \u00b7 neue Zeile oben, Inhalt l\u00e4uft nach unten" + (FM_WACHE.wechsel ? " \u00b7 " + FM_WACHE.wechsel : "");
  }
  if(FM_LUPE_VOLL){
    try{ fmLinStatus(); }catch(e){}      /* v3.23: Zeilen-Takt fuehrt die Quelle */
    fmLeben("bild", c, spH);
    try{                                       /* v3.22: Notbremse bei stehendem Bild */
      var sg = fmSig(c), jz = Date.now();
      if(sg !== FM_LUPE_SIG){ FM_LUPE_SIG = sg; FM_LUPE_STILLT = jz; }
      else if(FM_LUPE_STILLT && jz - FM_LUPE_STILLT > 3000){
        FM_LUPE_STILLT = jz;
        fmFlaechen(true);
        FM_WACHE.wechsel = "Quelle neu gesucht";
      }
    }catch(e){}
    FM_LUPE_VOLL = false;
  }
}
/* ================= v3.20: Scanner bleibt vorn + Lupe folgt dem laufenden Bild ================= */
function fmVornHalten(){
  try{
    var w = document.getElementById("dnx-fm-window");
    if(!w || FM_ZIEHT || FM_VORN !== "scanner"){ return; }   /* v3.21: Empfaenger wurde angeklickt */
    if(getComputedStyle(w).display === "none"){ return; }
    if(document.body.lastElementChild === w){ return; }              /* liegt schon vorn */
    var q = w.getBoundingClientRect();
    if(q.width < 100 || q.height < 60){ return; }
    if(q.bottom < 0 || q.top > (window.innerHeight || 800)){ return; }
    var p = document.elementFromPoint(Math.round(q.left + q.width / 2), Math.round(q.top + 20));
    if(p && (p === w || w.contains(p))){ return; }                   /* Kopfzeile ist vorn */
    document.body.appendChild(w);                                    /* sonst nach vorn holen */
  }catch(e){}
}
setInterval(fmVornHalten, 1000);

function fmTuneVorn(){
  try{
    var o = document.getElementById("dnx-user-tune-overlay");
    if(!o){ return; }
    var st = getComputedStyle(o);
    if(st.display === "none" || st.visibility === "hidden"){ return; }
    if(o.parentElement === document.body && document.body.lastElementChild !== o){
      document.body.appendChild(o);
    }
  }catch(e){}
}
(function(){
  function start(){
    var o = document.getElementById("dnx-user-tune-overlay");
    if(!o){ return; }
    try{ new MutationObserver(fmTuneVorn).observe(o, {attributes: true, attributeFilter: ["class", "style"]}); }catch(e){}
    setInterval(fmTuneVorn, 1500);
  }
  if(document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", start); } else { start(); }
})();

/* ================= v3.21: Klick entscheidet, wer vorn liegt ================= */
var FM_EMP_SEL = "#dnx-receiver-overlay, #openwebrx-panel-receiver, #openwebrx-frequency-container, " +
                 "#openwebrx-canvas-container, #webrx-canvas-container, #openwebrx-spectrum-container, " +
                 "#openwebrx-scale-container, #dnx-top-line, #dnx-fft-line, #dnx3d-modebar, canvas";
function fmEmpfaengerHoch(){          /* Empfaenger-Fenster nach vorn */
  FM_VORN = "empfaenger";
  try{
    var w = document.getElementById("dnx-fm-window");
    if(w){ w.classList.remove("dnx-fm-vorn"); w.style.zIndex = "2147483640"; }
  }catch(e){}
  try{
    var p = document.getElementById("dnx-receiver-overlay");
    if(p){ p.style.zIndex = "2147483647"; }
  }catch(e){}
}
function fmScannerHoch(){             /* Scanner wieder nach vorn */
  FM_VORN = "scanner";
  try{
    var p = document.getElementById("dnx-receiver-overlay");
    if(p){ p.style.zIndex = "2147483600"; }
  }catch(e){}
  try{
    var w = document.getElementById("dnx-fm-window");
    if(w){ fmHoch(w); }
  }catch(e){}
}
document.addEventListener("pointerdown", function(e){
  try{
    var w = document.getElementById("dnx-fm-window");
    if(!w){ return; }
    var st = getComputedStyle(w);
    if(st.display === "none" || st.visibility === "hidden"){ return; }
    var t = e.target;
    if(t && (t === w || w.contains(t))){                 /* Klick in den Scanner */
      if(FM_VORN !== "scanner"){ fmScannerHoch(); }
      return;
    }
    var r = (t && t.closest) ? t.closest(FM_EMP_SEL) : null;
    if(r && FM_VORN !== "empfaenger"){ fmEmpfaengerHoch(); }   /* Klick in den Empfaenger */
  }catch(e){}
}, true);
var FM_WACHE = { liste: [], p1: {}, takt: 0, wechsel: "" };
function fmKandidaten(){
  var out = [], alle = [], i, c, q;
  try{ alle = document.querySelectorAll("#webrx-canvas-container canvas"); }catch(e){}
  for(i = 0; i < alle.length; i++){ out.push(alle[i]); }
  if(!out.length){                                   /* Wasserfall liegt woanders (Empfaenger-Fenster) */
    try{ alle = document.querySelectorAll("canvas"); }catch(e){ alle = []; }
    for(i = 0; i < alle.length; i++){
      c = alle[i];
      if(c.id && (c.id.indexOf("dnx") === 0 || c.id.indexOf("fm-") === 0)){ continue; }
      if(c.width < 1000 || c.height < 60){ continue; }
      q = c.getBoundingClientRect();
      if(q.width < 100 || q.height < 20){ continue; }
      out.push(c);
    }
  }
  return out;
}
function fmSig(cv){
  try{
    var t = document.createElement("canvas"); t.width = 24; t.height = 8;
    var x = t.getContext("2d");
    x.drawImage(cv, 0, Math.round(cv.height * 0.4), cv.width, Math.max(1, Math.round(cv.height * 0.6)), 0, 0, 24, 8);
    var d = x.getImageData(0, 0, 24, 8).data, s = "";
    for(var i = 0; i < d.length; i += 12){ s += d[i + 1] + ","; }
    return s;
  }catch(e){ return "?"; }
}
function fmWache(){
  try{
    FM_WACHE.takt++;
    var jetzt = Date.now(), i, c, sig, liste = FM_WACHE.liste;
    if(!FM_WACHE.zeit){ FM_WACHE.zeit = {}; }
    if(!liste || !liste.length || FM_WACHE.takt % 2 === 1){       /* Probe, alle 500 ms */
      liste = fmKandidaten(); FM_WACHE.liste = liste; FM_WACHE.p1 = {}; FM_WACHE.zeit = {};
      for(i = 0; i < liste.length; i++){ FM_WACHE.p1[i] = fmSig(liste[i]); FM_WACHE.zeit[i] = jetzt; }
      return;
    }
    for(i = 0; i < liste.length; i++){                            /* wer hat sich bewegt? */
      sig = fmSig(liste[i]);
      if(sig !== FM_WACHE.p1[i]){ FM_WACHE.p1[i] = sig; FM_WACHE.zeit[i] = jetzt; }
    }
    var idQ = -1;
    for(i = 0; i < liste.length; i++){ if(liste[i] === LUPE.wf){ idQ = i; break; } }
    if(idQ < 0 || !FM_WACHE.zeit[idQ]){ return; }
    if(jetzt - FM_WACHE.zeit[idQ] < 2000){ FM_WACHE.wechsel = ""; return; }   /* Quelle laeuft -> nicht eingreifen */
    var ziel = null;                                              /* Quelle steht seit > 2 s */
    for(i = 0; i < liste.length; i++){
      if(i === idQ || !FM_WACHE.zeit[i] || jetzt - FM_WACHE.zeit[i] > 2000){ continue; }
      var qq = liste[i].getBoundingClientRect();
      if(qq.bottom <= 0 || qq.top >= (window.innerHeight || 800) || qq.right <= 0 || qq.left >= (window.innerWidth || 1200)){ continue; }
      ziel = liste[i];
    }
    if(ziel){
      LUPE.wf = ziel;
      FM_WACHE.wechsel = "Quelle gewechselt auf " + ziel.width + "\u00d7" + ziel.height + " px";
    }else{
      FM_WACHE.wechsel = "";
    }
  }catch(e){}
}
/* ================= v3.13 Ende Ziehen/Live-Lupe ================= */
setInterval(fmLupeTakt,250);
/* ================= v3.21: weiches Lupenbild =================
   fmLupePuls() zeichnet das Bild bis zu 25x/s neu (wie der Wasserfall im
   Empfaenger); fmWache()/fmLeben() laufen weiter nur alle 250 ms. */
var FM_LUPE_VOLL = false, FM_LUPE_ZULETZT = 0, FM_LUPE_TICK = 0;
var FM_LUPE_SIG = "", FM_LUPE_STILLT = 0;      /* v3.22: steht das Bild? */
function fmLupePuls(){
  try{
    var w = document.getElementById("dnx-fm-window");
    if(!w || getComputedStyle(w).display === "none"){ return; }
    var an = document.getElementById("fm-live-an");
    if(an && !an.checked){ return; }
    var jetzt = Date.now();
    if(jetzt - FM_LUPE_ZULETZT < 40){ return; }
    FM_LUPE_ZULETZT = jetzt;
    if(jetzt - FM_LUPE_TICK >= 240){ FM_LUPE_TICK = jetzt; FM_LUPE_VOLL = true; }
    fmLupeTakt();
  }catch(e){}
}
(function(){
  function s(){ try{ fmLupePuls(); }catch(e){} if(window.requestAnimationFrame){ window.requestAnimationFrame(s); } }
  if(window.requestAnimationFrame){ window.requestAnimationFrame(s); }
})();
/* ================= v3.23: eigene Bildrolle - laeuft wie der echte Wasserfall ================= */
var FM_LIN = {
  cv: null,            /* Leinwand, die gerade neue Zeilen liefert */
  pr: null,            /* Zeilenprofil der Quelle (Stichprobe) */
  rolle: null,         /* eigene Bildrolle (Anzeigebereich unter dem Spektrum) */
  rctx: null,
  w: 0, h: 0,          /* Groesse der Rolle */
  x0: -1, teil: -1,    /* Ausschnitt, fuer den die Rolle gefuellt ist */
  zeilen: 0, takt: 0,  /* gezaehlte Zeilen / Zeit fuer die Anzeige */
  rate: 0, letzteRate: 0,
  hinweis: ""
};
function fmLinAusschnitt(){                 /* gleicher Ausschnitt wie die Anzeige */
  var z = Number((document.getElementById("fm-live-zoom") || {}).value) || 1;
  if(!isFinite(z) || z < 1){ z = 1; }
  var teil = 1 / z, x0 = 0.5 - teil / 2;
  try{
    var f = fmFreq(), b = fmBand();
    if(b && b.b && f){
      var fx = (f - b.lo) / b.b;
      if(isFinite(fx)){ x0 = Math.min(Math.max(fx - teil / 2, 0), 1 - teil); }
    }
  }catch(e){}
  return {x0: x0, teil: teil};
}
function fmLinRolleAnfordern(){              /* Groesse der Anzeigeflaeche kommt aus fmLupeTakt */
  if(!FM_LIN.regH || !FM_LIN.cw2){ return; }
  var kq = Math.min(2, Math.max(1, FM_LIN.dpr || 1));
  var wq = Math.round(FM_LIN.cw2 * kq), hq = Math.round(FM_LIN.regH * kq);
  if(!FM_LIN.rolle || FM_LIN.w !== wq || FM_LIN.h !== hq){
    FM_LIN.rolle = document.createElement("canvas");
    FM_LIN.rolle.width = wq; FM_LIN.rolle.height = hq;
    FM_LIN.rctx = FM_LIN.rolle.getContext("2d");
    FM_LIN.w = wq; FM_LIN.h = hq; FM_LIN.x0 = -1;
  }
}
function fmLinStatus(){
  FM_WACHE.wechsel = FM_LIN.hinweis || "";
}
function fmQueVerschiebung(cv){          /* CSS-Verschiebung der Quell-Leinwand auslesen */
  try{
    var st = cv.style ? (cv.style.transform || "") : "";
    var m = /translate\(\s*[-0-9.]+px\s*,\s*(-?[0-9.]+)px\s*\)/.exec(st);
    if(m){ return parseFloat(m[1]); }
    var cs = getComputedStyle(cv).transform;
    var n = /matrix\(1,\s*0,\s*0,\s*1,\s*[-0-9.]+,\s*(-?[0-9.]+)\)/.exec(cs || "");
    if(n){ return parseFloat(n[1]); }
  }catch(e){}
  return 0;
}
function fmQueVerschiebung(cv){          /* CSS-Verschiebung einer Leinwand (nur zur Anzeige) */
  try{
    var st = cv.style ? (cv.style.transform || "") : "";
    var m = /translate\(\s*[-0-9.]+px\s*,\s*(-?[0-9.]+)px\s*\)/.exec(st);
    if(m){ return parseFloat(m[1]); }
  }catch(e){}
  return 0;
}
function fmStreifenLeinwaende(){
  var cont = document.getElementById("webrx-canvas-container") || document.getElementById("openwebrx-canvas-container");
  if(!cont){ return null; }
  var out = [], alle = [], i, c;
  try{ alle = cont.querySelectorAll("canvas"); }catch(e){ alle = []; }
  for(i = 0; i < alle.length; i++){
    c = alle[i];
    if(!c || c.width < 200 || c.height < 20){ continue; }
    if(c.id && (c.id.indexOf("dnx") === 0 || c.id.indexOf("fm-") === 0)){ continue; }
    out.push(c);
  }
  return {cont: cont, liste: out};
}
function fmLinTakt(){
  try{
    var w = document.getElementById("dnx-fm-window");
    if(!w || getComputedStyle(w).display === "none"){ return; }
    var anEl = document.getElementById("fm-live-an");
    if(anEl && !anEl.checked){ return; }
    var st = fmStreifenLeinwaende();
    if(!st || !st.liste.length){ return; }
    if(!FM_LIN.regH || !FM_LIN.cw2){ return; }              /* Anzeigegroesse noch unbekannt */
    fmLinRolleAnfordern();
    if(!FM_LIN.rolle){ return; }
    var cq = st.cont.getBoundingClientRect();
    var i, c, r, top, bot, ver, von, bis;
    /* v3.47: NUR EIN Umrechnungsschritt - direkt in der Anzeigegroesse und weich gerechnet.
       Vorher lief das Bild in zwei Stufen (Containerbreite -> Anzeige) mit harter Pixelwahl;
       bei 125 % Bildschirmskalierung entstanden daraus die schraegen Streifen. */
    var rl = FM_LIN.rolle, rz = FM_LIN.rctx, zw = rl.width, zh = rl.height;
    rz.imageSmoothingEnabled = true; if(rz.imageSmoothingQuality){ rz.imageSmoothingQuality = "high"; }
    rz.clearRect(0, 0, zw, zh);
    var sk = zh / Math.max(1, cq.height);
    var a = fmLinAusschnitt();
    FM_LIN.x0 = a.x0; FM_LIN.teil = a.teil;
    /* v3.32: Frische der Leinwaende messen und die SCHREIBENDE ZULETZT zeichnen.
       Sonst deckt die stehende Puffer-Leinwand das laufende Bild zu und die
       Anzeige steht still - genau das war beim Scannen zu sehen. */
    if(!FM_LIN.frisch){ FM_LIN.frisch = []; }
    if(!FM_LIN.mess){ FM_LIN.mess = document.createElement("canvas"); }
    var ms = FM_LIN.mess;
    if(ms.width !== 32 || ms.height !== 4){ ms.width = 32; ms.height = 4; }
    var mg = ms.getContext("2d"), reihe = [], sig, altSig, dd, hh2, kk;
    for(i = 0; i < st.liste.length; i++){
      c = st.liste[i];
      sig = "x";
      try{
        mg.clearRect(0, 0, 32, 4);
        mg.drawImage(c, 0, 0, Math.min(32, c.width), 4, 0, 0, 32, 4);
        dd = mg.getImageData(0, 0, 32, 4).data; hh2 = 0;
        for(kk = 0; kk < dd.length; kk += 5){ hh2 = (hh2 * 19 + dd[kk]) % 2147483647; }
        sig = String(hh2);
      }catch(e){ sig = "x"; }
      altSig = FM_LIN.frisch[i];
      reihe.push({c: c, neu: (altSig !== undefined && altSig !== sig), alt: sig === altSig});
      FM_LIN.frisch[i] = sig;
    }
    var laufend = [], stehend = [];
    for(i = 0; i < reihe.length; i++){ (reihe[i].neu ? laufend : stehend).push(reihe[i].c); }
    var folge = stehend.concat(laufend);          /* stehende zuerst, schreibende oben */
    for(i = 0; i < folge.length; i++){
      c = folge[i];
      r = c.getBoundingClientRect();
      top = Math.max(r.top, cq.top); bot = Math.min(r.bottom, cq.bottom);
      if(bot - top < 2){ continue; }
      ver = c.height / Math.max(1, r.height);
      von = Math.max(0, (top - r.top) * ver);
      bis = Math.min(c.height, von + (bot - top) * ver);
      if(bis - von < 1){ continue; }
      try{
        rz.drawImage(c, Math.round(a.x0 * c.width), Math.round(von), Math.max(2, Math.round(a.teil * c.width)), Math.round(bis - von),
                     0, Math.round((top - cq.top) * sk), zw, Math.max(1, Math.round((bot - top) * sk)));
      }catch(e){}
    }
    if(!FM_LIN.cv || !FM_LIN.cv.isConnected){ FM_LIN.cv = st.liste[st.liste.length - 1]; }
    LUPE.wf = FM_LIN.cv;
    /* v3.47: die Rolle hat schon Anzeigegroesse - nichts mehr umrechnen */
    /* Bewegung messen: Mittellinie der sichtbaren Leinwand vor/nach 0,9 s vergleichen */
    var jetzt = Date.now();
    var probe = "";
    for(i = 0; i < st.liste.length; i++){
      var rr = st.liste[i].getBoundingClientRect();
      if(rr.bottom > cq.top + 4 && rr.top < cq.bottom - 4){
        probe += Math.round(rr.top) + "/" + Math.round(fmQueVerschiebung(st.liste[i])) + ";";
      }
    }
    FM_LIN.takt++;
    if(!FM_LIN.probeZeit || FM_LIN.probeZeit === 0){ FM_LIN.probeZeit = jetzt; FM_LIN.probe = probe; }
    else if(jetzt - FM_LIN.probeZeit >= 900){
      var dt = (jetzt - FM_LIN.probeZeit) / 1000, dpx = 0, p1 = FM_LIN.probe.split(";"), p2 = probe.split(";");
      for(i = 0; i < Math.min(p1.length, p2.length); i++){
        var a1 = p1[i].split("/"), a2 = p2[i].split("/");
        if(a1.length === 2 && a2.length === 2 && Math.abs(Number(a1[1]) - Number(a2[1])) < 400){
          dpx += Number(a2[1]) - Number(a1[1]);
        }
      }
      FM_LIN.rate = Math.round(Math.abs(dpx) / Math.max(0.2, dt));
      FM_LIN.probe = probe; FM_LIN.probeZeit = jetzt;
      var lein = st.liste[st.liste.length - 1];
      FM_LIN.hinweis = "Bild l\u00e4uft nach unten \u00b7 " + FM_LIN.rate + " px/s \u00b7 1:1 wie im Empf\u00e4nger";
      FM_WACHE.wechsel = "Quelle: OpenWebRX-Streifen " + (lein ? (lein.width + "\u00d7" + lein.height + " px") : "") + " \u00b7 " + FM_LIN.hinweis;
    }else if(!FM_WACHE.wechsel){
      FM_WACHE.wechsel = "Quelle: OpenWebRX-Streifen";
    }
  }catch(e){}
}
setInterval(fmLinTakt, 40);
function fmAnalyserFeld(id, beschriftung, wert, farbe){
  /* v3.48: Beschriftung klein und grau, Wert gross und hell */
  var e = document.getElementById(id);
  if(!e){ return; }
  var html = '<span class="dnx-an-l">' + beschriftung + '</span><span class="dnx-an-v"' +
             (farbe ? (' style="color:' + farbe + '"') : '') + '>' + wert + '</span>';
  if(e.innerHTML !== html){ e.innerHTML = html; }
}
function fmAnalyserFarben(ok, warn){
  return ok ? "#35ff83" : (warn ? "#ffd400" : "#cfe9f5");
}
function fmAnalyserEinordnen(){
  /* v3.41: der Analysator muss IM Hauptbereich stehen (direkt unter dem Live-Bild).
     Ohne diesen Schritt landet er in der zweiten Rasterzeile von .dnx-fm-body und
     wird abgeschnitten - dann "ist nichts da". */
  try{
    var an = document.getElementById("dnx-fm-analyser");
    var w = document.getElementById("dnx-fm-window");
    if(!an || !w){ return; }
    var main = w.querySelector(".dnx-fm-main");
    var live = w.querySelector("#dnx-fm-live-sec");
    if(!main){ return; }
    if(an.parentNode !== main){
      if(live && live.parentNode === main){ main.insertBefore(an, live.nextSibling); }
      else { main.insertBefore(an, main.firstChild); }
    }
    /* danach die Hoehen neu berechnen, damit das Bild die Groesse behaelt */
  }catch(e){}
}
function fmAnalyserZeigen(){
  /* v3.43: den Analysator ins Bild holen (Hauptbereich mitrollen) */
  try{
    var an = document.getElementById("dnx-fm-analyser");
    if(!an){ return; }
    var w = document.getElementById("dnx-fm-window");
    if(!w || getComputedStyle(w).display === "none"){ return; }
    var main = w.querySelector(".dnx-fm-main");
    if(main){
      /* v3.44: Hauptbereich selbst rollen (scrollIntoView wirkt hier nicht immer) */
      var r = an.getBoundingClientRect(), m = main.getBoundingClientRect();
      var delta = (r.bottom - m.bottom) + 10;
      if(delta > 0){ main.scrollTop += delta; }
      if(main.scrollTop === 0 && delta > 0){ main.scrollTop = delta; }
    }
    try{ an.scrollIntoView({block: "nearest"}); }catch(e2){}
  }catch(e){}
}
function fmAnalyserTakt(){
  try{
    if(!fmAnalyserTakt.ein){ fmAnalyserTakt.ein = 1; fmAnalyserEinordnen(); }
    else { var an0 = document.getElementById("dnx-fm-analyser");
           var m0 = document.querySelector("#dnx-fm-window .dnx-fm-main");
           if(an0 && m0 && an0.parentNode !== m0){ fmAnalyserEinordnen(); } }
    /* v3.45: waehrend des Scans waechst die Kopfzeile - den Bereich unten nachfuehren,
       damit er immer ganz sichtbar ist */
    if(!fmAnalyserTakt.rollZeit || Date.now() - fmAnalyserTakt.rollZeit > 800){
      fmAnalyserTakt.rollZeit = Date.now();
      var w2 = document.getElementById("dnx-fm-window");
      var an2 = document.getElementById("dnx-fm-analyser");
      var m2 = w2 ? w2.querySelector(".dnx-fm-main") : null;
      if(an2 && m2){
        var rr = an2.getBoundingClientRect(), mm = m2.getBoundingClientRect();
        var d2 = Math.round(rr.bottom - mm.bottom) + 8;
        if(d2 > 4){
          var max = Math.max(0, m2.scrollHeight - m2.clientHeight);
          m2.scrollTop = Math.min(m2.scrollTop + d2, max);
        }
      }
    }
    /* v3.64: waehrend des Scans unwichtige Teile ausblenden - Platz fuer den Streifen */
    try{
      var laeuftJetzt = !!scan.running;
      var lEl = document.getElementById("fm-live-lebt");
      var aEl = document.querySelector('#dnx-fm-window [data-a="an"]');
      var hl = document.getElementById("dnx-fm-live-hinweis");
      if(lEl && lEl.style.display !== (laeuftJetzt ? "none" : "")){ lEl.style.display = laeuftJetzt ? "none" : ""; }
      if(aEl && aEl.style.display !== (laeuftJetzt ? "none" : "")){ aEl.style.display = laeuftJetzt ? "none" : ""; }
      if(hl && hl.style.display !== (laeuftJetzt ? "none" : "")){ hl.style.display = laeuftJetzt ? "none" : ""; }
    }catch(e0){}
    var sec = document.getElementById("dnx-fm-analyser");
    if(!sec){ return; }
    var w = document.getElementById("dnx-fm-window");
    if(w && getComputedStyle(w).display === "none"){ return; }
    var st = document.getElementById("fm-status");
    var level = -999, sock = scan.rausch, snr = -999;
    try{ level = smeter(); }catch(e){}
    /* v3.62: gemerkten Start nachholen, sobald der Empfaenger bereit ist */
    if(FM_ANA.startWunsch && !scan.running && Date.now() - FM_ANA.startWunsch < 60000){
      if(currentProfileRange()){
        FM_ANA.startWunsch = 0;
        try{ makeRange(); }catch(e){}
        try{ fmKnoepfeMalen(); }catch(e){}
      }
    } else if(FM_ANA.startWunsch && Date.now() - FM_ANA.startWunsch >= 60000){
      FM_ANA.startWunsch = 0;
      status("Empfaenger nicht bereit \u2013 Start abgebrochen");
    }
    /* v3.59: Streifenhoehe dem freien Platz anpassen (96..150 px) - gross, aber immer sichtbar */
    if(!fmAnalyserTakt.hoeheZeit || Date.now() - fmAnalyserTakt.hoeheZeit > 700){
      fmAnalyserTakt.hoeheZeit = Date.now();
      try{
        var mS = w2 || document.getElementById("dnx-fm-window");
        mS = mS ? mS.querySelector(".dnx-fm-main") : null;
        var spS = document.getElementById("dnx-an-spek");
        var anS = document.getElementById("dnx-fm-analyser");
        if(mS && spS && anS){
          var jetztH = Math.round(spS.getBoundingClientRect().height);
          var ohneStreifen = (anS.offsetTop + anS.offsetHeight) - jetztH;
          var frei = mS.clientHeight - ohneStreifen - 8;
          var zielH = Math.round(Math.max(100, Math.min(168, frei)));
          if(Math.abs(jetztH - zielH) > 3){ spS.style.height = zielH + "px"; }
        }
      }catch(e){}
    }
    /* v3.47: den Rauschsockel auch ohne Scan messen, damit SNR und Zeiger leben */
    if(!scan.running && level > -900 && (!fmAnalyserTakt.sockZeit || Date.now() - fmAnalyserTakt.sockZeit > 900)){
      fmAnalyserTakt.sockZeit = Date.now();
      try{ fmRauschsockel(level); }catch(e){}
      sock = scan.rausch;
    }
    if(level > -900){ snr = level - sock; }
    var sch = fmScanSchwelle();
    var warte = fmScanWarte();
    /* v3.42: der Rauschsockel ist erst gueltig, wenn er wirklich gemessen wurde
       (Startwert -120 dB hatte SNR 120 dB angezeigt) */
    var sockOk = isFinite(sock) && sock > -100;
    if(!sockOk){ snr = -999; }
    if(snr > 60){ snr = 60; }
    var hit = (level > -900) && sockOk && isFinite(snr) && (snr >= sch);
    /* Feld: Frequenz + SNR */
    var f = scan.jetzt;
    var fq = document.getElementById("dnx-an-fq"), md = document.getElementById("dnx-an-md"), sn = document.getElementById("dnx-an-snr");
    if(fq){ fq.textContent = f ? hz(f.frequency) : "\u2014"; }
    if(md){
      var mdT = f && f.mode ? String(f.mode).toUpperCase() : "";
      if(md.textContent !== mdT){ md.textContent = mdT; }
      md.style.display = mdT ? "inline-block" : "none";
    }
    if(sn){
      sn.textContent = (level > -900 && snr > -900) ? ("SNR " + (snr).toFixed(1).replace(".", ",") + " dB") : "SNR \u2014";
      if(sn.className !== (hit ? "treffer" : "")){ sn.className = hit ? "treffer" : ""; }
    }
    var box = document.getElementById("dnx-an-freq");
    if(box){ box.style.borderColor = hit ? "#ff6b6b" : "#ffffff36"; box.style.boxShadow = hit ? "inset 0 0 26px #ff3b3b33, 0 0 12px #ff3b3b44" : "inset 0 0 22px #00000088"; }
    var anz = 0; for(var k in scan.hits){ anz++; }
    fmAnalyserFeld("dnx-an-f1", "Schwelle", sch.toFixed(1).replace(".", ",") + " dB");
    fmAnalyserFeld("dnx-an-f2", "Halten", ((+((document.getElementById("fm-hold")||{}).value)||0)) + " ms");
    fmAnalyserFeld("dnx-an-f3", "Rauschsockel", (sockOk ? sock.toFixed(1).replace(".", ",") : "\u2014") + " dB", sockOk ? "#bff4ff" : "#8fa4b2");
    fmAnalyserFeld("dnx-an-f4", "S-Wert", ((level > -900) ? level.toFixed(1).replace(".", ",") : "\u2014") + " dB", hit ? "#7dffb4" : "#eaf6ff");
    fmAnalyserFeld("dnx-an-f5", "Wartezeit", (warte < 0) ? "\u2014" : (warte.toFixed(1).replace(".", ",") + " s"));
    fmAnalyserFeld("dnx-an-f6", "Tempo", fmScanTempoMHz().toFixed(2).replace(".", ",") + " MHz/s");
    fmAnalyserFeld("dnx-an-f7", "Satz", scan.list.length ? (scan.list.length + " Kanaele \u00b7 " + fmScanSatzMHz().toFixed(2).replace(".", ",") + " MHz") : "\u2014");
    fmAnalyserFeld("dnx-an-f8", "Treffer", String(anz) + (scan.start ? (" \u00b7 " + fmScanDauer()) : ""), anz > 0 ? "#7dffb4" : "#eaf6ff");
    var info = document.getElementById("dnx-an-info");
    if(info){
      /* v3.63: nur zwei Zeilen - der Streifen bekommt den Platz */
      var t = (scan.running ? (scan.paused ? "PAUSE" : "SCAN L\u00c4UFT") : "bereit");
      if(scan.list.length){ t += " \u00b7 Schritt " + (scan.index + 1) + "/" + scan.list.length + " \u00b7 Umlauf " + Math.max(1, scan.runden); }
      t += "\n" + (f ? hz(f.frequency) : "keine Frequenz") + " \u00b7 " +
           (hit ? "SIGNAL \u00fcber der Schwelle" : (sockOk ? "kein Signal \u00fcber der Schwelle" : "Rauschsockel wird gemessen"));
      if(info.textContent !== t){ info.textContent = t; }
      info.style.whiteSpace = "pre-line";
    }
    /* Spektrumstreifen */
    fmAnalyserSpektrum(hit, snr, sch);
    /* Zeiger */
    fmAnalyserZeiger(isFinite(snr) ? snr : -99, hit);
    /* v3.47: Knoepfe und Zustandspille nachfuehren */
    fmKnoepfeMalen();
  }catch(e){}
}
function fmKnoepfeMalen(){
  /* v3.47: Start/Pause/Weiter/Stopp zeigen im Betrieb ihre Farbe */
  try{
    var w = document.getElementById("dnx-fm-window");
    if(!w){ return; }
    var bS = w.querySelector('[data-a="start"]'), bP = w.querySelector('[data-a="pause"]'),
        bW = w.querySelector('[data-a="next"]'), bT = w.querySelector('[data-a="stop"]');
    function setz(b, cls){
      if(!b){ return; }
      var c2 = String(b.className || "").replace(/dnx-(laeuft|pause-an|weiter-an|stop-an|aus)/g, " ").replace(/\s+/g, " ").trim();
      b.className = cls ? (c2 + " " + cls).trim() : c2;
    }
    var laeuft = !!scan.running && !scan.paused, pausiert = !!scan.running && !!scan.paused, aktiv = !!scan.running;
    /* v3.48: der gerade benutzte Knopf blitzt kurz auf */
    var tipp = (fmKnoepfeMalen.tipp && (Date.now() - (fmKnoepfeMalen.tippZeit || 0) < 400)) ? fmKnoepfeMalen.tipp : "";
    setz(bS, laeuft ? "dnx-laeuft" : (tipp === "start" ? "dnx-tipp" : ""));
    setz(bP, pausiert ? "dnx-pause-an" : (tipp === "pause" ? "dnx-tipp" : ""));
    setz(bW, tipp === "next" ? "dnx-tipp" : (aktiv ? "dnx-weiter-an" : ""));
    setz(bT, aktiv ? ("dnx-stop-an" + (tipp === "stop" ? " dnx-tipp" : "")) : "dnx-aus");
    function lbl(b, s2){ if(b && b.textContent !== s2){ b.textContent = s2; } }
    lbl(bS, laeuft ? "▶ Läuft" : "▶ Start");
    lbl(bP, pausiert ? "⏵ Fortsetzen" : "⏸ Pause");
    lbl(bW, "⏭ Weiter");
    lbl(bT, "■ Stopp");
    if(bS && bS.parentNode){
      var box = bS.parentNode, p = document.getElementById("fm-scan-zustand");
      if(!p){
        p = document.createElement("span");
        p.id = "fm-scan-zustand";
        box.insertBefore(p, box.firstChild);
      }
      var txt = laeuft ? "\u25cf Scan l\u00e4uft" : (pausiert ? "\u23f8 Pause" : (scan.start ? "\u25a0 gestoppt" : "\u25cb bereit"));
      if(p.textContent !== txt){ p.textContent = txt; }
      var cls3 = laeuft ? "laeuft" : (pausiert ? "pause" : (scan.start ? "stop" : ""));
      if(p.className !== cls3){ p.className = cls3; }
      p.title = aktiv ? ("Kanal " + (scan.index + 1) + " von " + scan.list.length) : "Start / Pause / Weiter / Stopp";
    }
  }catch(e){}
}
function fmAnaQuelle(){
  /* v3.47: oberste sichtbare Zeile des lebenden Wasserfalls (die neueste Zeile) */
  var st = fmStreifenLeinwaende();
  if(!st || !st.liste.length){ return null; }
  var cq = st.cont.getBoundingClientRect(), i, c, r, top, ver, y;
  for(i = st.liste.length - 1; i >= 0; i--){
    c = st.liste[i];
    if(!c || !c.isConnected){ continue; }
    r = c.getBoundingClientRect();
    top = Math.max(r.top, cq.top);
    if(Math.min(r.bottom, cq.bottom) - top < 2){ continue; }
    ver = c.height / Math.max(1, r.height);
    y = Math.round(Math.max(0, (top - r.top) * ver));
    if(y > c.height - 3){ y = Math.max(0, c.height - 3); }
    return {c: c, y: y};
  }
  return null;
}
var FM_ANA = { off: null };
function fmAnaLive(ctx, links, oben, unten, cw){
  /* lebende Kurve aus der neuesten Wasserfall-Zeile */
  var q = fmAnaQuelle();
  if(!q){ return false; }
  var breit0 = cw - links - 2;
  var N = Math.max(320, Math.min(900, Math.round(breit0 * 1.25))), off = FM_ANA.off;
  if(!off){ off = FM_ANA.off = document.createElement("canvas"); }
  off.width = N; off.height = 2;
  var oc = off.getContext("2d");
  oc.imageSmoothingEnabled = true;
  oc.clearRect(0, 0, N, 2);
  var a2 = fmLinAusschnitt();
  try{
    oc.drawImage(q.c, Math.round(a2.x0 * q.c.width), q.y, Math.max(2, Math.round(a2.teil * q.c.width)), 2, 0, 0, N, 2);
  }catch(e){ return false; }
  var dd;
  try{ dd = oc.getImageData(0, 0, N, 2).data; }catch(e){ return false; }
  var werte = new Array(N), x, i2, s2, lo = 1e9, hi = -1e9, p2;
  for(x = 0; x < N; x++){
    s2 = 0;
    for(i2 = 0; i2 < 2; i2++){ p2 = (i2 * N + x) * 4; s2 += (dd[p2] + dd[p2 + 1] + dd[p2 + 2]) / 3; }
    s2 = s2 / 2;
    werte[x] = s2;
    if(s2 < lo){ lo = s2; }
    if(s2 > hi){ hi = s2; }
  }
  /* v3.57: feiner - Detailbalken, Flaeche, leuchtende Kurve, Spitzenmarke */
  var breit = cw - links - 2, y0 = oben + 4, y1 = unten - 2, span = Math.max(1, hi - lo);
  function py(v){ return y1 - (v - lo) / span * (y1 - y0); }
  var x2, qx, qy, vx;
  ctx.fillStyle = "rgba(90,200,240,.20)";
  for(x = 0; x < N; x++){
    qx = links + x / (N - 1) * breit; vx = py(werte[x]);
    ctx.fillRect(qx, vx, 1, Math.max(1, y1 - vx));
  }
  ctx.beginPath();
  ctx.moveTo(links, y1);
  for(x = 0; x < N; x++){ ctx.lineTo(links + x / (N - 1) * breit, py(werte[x])); }
  ctx.lineTo(links + breit, y1); ctx.closePath();
  ctx.fillStyle = "rgba(60,200,255,.16)"; ctx.fill();
  ctx.save();
  try{ ctx.shadowColor = "rgba(120,230,255,.55)"; ctx.shadowBlur = 4; }catch(e){}
  ctx.beginPath();
  for(x = 0; x < N; x++){
    qx = links + x / (N - 1) * breit; qy = py(werte[x]);
    if(x === 0){ ctx.moveTo(qx, qy); } else { ctx.lineTo(qx, qy); }
  }
  ctx.strokeStyle = "rgba(176,246,255,.98)"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
  var xm = 0;
  for(x = 1; x < N; x++){ if(werte[x] > werte[xm]){ xm = x; } }
  var pxm = links + xm / (N - 1) * breit, pym = py(werte[xm]);
  ctx.fillStyle = "#ffe07a";
  ctx.beginPath(); ctx.arc(pxm, pym, 2.2, 0, 6.283); ctx.fill();
  ctx.fillStyle = "rgba(255,224,122,.55)"; ctx.font = "800 9px Arial"; ctx.textAlign = "center";
  ctx.fillText("Pegel", pxm, Math.max(oben + 8, pym - 5));
  ctx.textAlign = "left";
  return true;
}
function fmAnaRaster(ctx, links, oben, unten, cw){
  /* feine Striche im Schritt-Raster des Bereichsscans - auch wenn noch kein Scan laeuft */
  var band = fmBand();
  var an = 0, f, px2;
  if(band && band.b > 0){
    var a3 = parseFreq((document.getElementById("fm-rstart") || {}).value);
    var b3 = parseFreq((document.getElementById("fm-rend") || {}).value);
    var st3 = +((document.getElementById("fm-step") || {}).value) || 12500;
    if(isFinite(a3) && isFinite(b3) && b3 > a3 && st3 > 0){
      var ges = Math.floor((b3 - a3) / st3) + 1;
      var sprung = Math.max(1, Math.ceil(ges / 600));
      ctx.strokeStyle = "rgba(150,175,190,.45)"; ctx.lineWidth = 1;
      for(f = a3; f <= b3 && an < 600; f += st3 * sprung){
        if(f < band.lo || f > band.lo + band.b){ continue; }
        px2 = Math.round(links + (f - band.lo) / band.b * (cw - links - 2)) + .5;
        ctx.beginPath(); ctx.moveTo(px2, oben + 2); ctx.lineTo(px2, unten); ctx.stroke();
        an++;
      }
    }
    var fr = 0; try{ fr = fmFreq(); }catch(e){}
    if(fr && fr > band.lo && fr < band.lo + band.b){
      px2 = Math.round(links + (fr - band.lo) / band.b * (cw - links - 2)) + .5;
      ctx.strokeStyle = "rgba(53,255,131,.9)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px2, oben + 2); ctx.lineTo(px2, unten); ctx.stroke();
    }
  }
  return an;
}
function fmAnalyserSpektrum(hit, snr, sch){
  /* v3.57: 150 px hoch, Kurvenfeld 84 px, dB-Raster alle 5 dB, Schritt-Raster,
     Kanalmarken und eine eigene grosse Anzeigezeile unten. */
  var c = document.getElementById("dnx-an-spek");
  if(!c){ return; }
  var bq = c.getBoundingClientRect();
  var k = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  var cssW = Math.max(300, Math.round(bq.width)), cssH = Math.max(100, Math.round(bq.height));
  var bw = Math.round(cssW * k), bh = Math.round(cssH * k);
  if(c.width !== bw || c.height !== bh){ c.width = bw; c.height = bh; }
  var ctx = c.getContext("2d");
  try{ ctx.setTransform(k, 0, 0, k, 0, 0); }catch(e){}
  var cw = cssW, chh = cssH;
  var links = 44, oben = 20, dispY = cssH - 34, markY = dispY - 9, unten = markY - 3;
  var i, y, stufe, f2, p;
  if(unten - oben < 30){ unten = oben + 30; }
  /* Hintergrund */
  var g0 = ctx.createLinearGradient(0, 0, 0, chh);
  g0.addColorStop(0, "#0a1620"); g0.addColorStop(.6, "#050b11"); g0.addColorStop(1, "#03060a");
  ctx.fillStyle = g0; ctx.fillRect(0, 0, cw, chh);
  var g1 = ctx.createLinearGradient(0, oben, 0, unten);
  g1.addColorStop(0, "rgba(90,180,230,.10)"); g1.addColorStop(1, "rgba(90,180,230,.02)");
  ctx.fillStyle = g1; ctx.fillRect(links, oben, cw - links, unten - oben);
  /* dB-Skala: Raster alle 5 dB, beschriftet alle 10 dB */
  ctx.fillStyle = "#081219"; ctx.fillRect(0, 0, links, chh);
  ctx.textAlign = "left";
  for(i = 0; i <= 40; i += 5){
    y = Math.round(unten - (i / 40) * (unten - oben)) + .5;
    var gross = (i % 10 === 0);
    ctx.strokeStyle = gross ? "rgba(88,160,200,.55)" : "rgba(70,120,150,.22)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(links, y); ctx.lineTo(cw, y); ctx.stroke();
    if(gross){
      ctx.font = "800 10px Arial";
      ctx.fillStyle = (i % 20 === 0) ? "#9fd6f0" : "#6d93a8";
      ctx.fillText(String(i), 8, y + 3.5);
    }
  }
  ctx.strokeStyle = "rgba(88,160,200,.6)";
  ctx.beginPath(); ctx.moveTo(links + .5, oben - 2); ctx.lineTo(links + .5, unten + 1); ctx.stroke();
  /* Schritt-Raster (feine senkrechte Linien der Scan-Schritte) */
  var bandG = fmBand();
  if(bandG && bandG.b > 0){
    var aG = parseFreq((document.getElementById("fm-rstart") || {}).value);
    var bG = parseFreq((document.getElementById("fm-rend") || {}).value);
    var stG = +((document.getElementById("fm-step") || {}).value) || 12500;
    if(isFinite(aG) && isFinite(bG) && bG > aG && stG > 0){
      var ges = Math.floor((bG - aG) / stG) + 1;
      var sprung = Math.max(1, Math.ceil(ges / 260));
      ctx.fillStyle = "rgba(90,150,190,.13)";
      for(var fG = aG; fG <= bG; fG += stG * sprung){
        if(fG < bandG.lo || fG > bandG.lo + bandG.b){ continue; }
        var pG = links + (fG - bandG.lo) / bandG.b * (cw - links - 3);
        if(pG < links || pG > cw){ continue; }
        ctx.fillRect(Math.round(pG), oben, 1, unten - oben);
      }
    }
  }
  /* Kopfzeile */
  var anz = 0; for(var kk in scan.hits){ anz++; }
  ctx.font = "900 11px Arial"; ctx.textAlign = "left"; ctx.fillStyle = "#cfe9f5";
  ctx.fillText("Satz", 6, 12);
  ctx.fillStyle = "#ffe07a"; ctx.fillText(fmScanSatzMHz().toFixed(2).replace(".", ",") + " MHz", 34, 12);
  ctx.fillStyle = "#cfe9f5"; ctx.fillText("Tempo", 108, 12);
  ctx.fillStyle = "#7ff0ff"; ctx.fillText(fmScanTempoMHz().toFixed(2).replace(".", ",") + " MHz/s", 146, 12);
  ctx.fillStyle = "#cfe9f5"; ctx.fillText("Treffer", 246, 12);
  ctx.fillStyle = anz > 0 ? "#7dffb4" : "#cfe9f5"; ctx.fillText(String(anz), 288, 12);
  if(scan.start){ ctx.fillStyle = "#9fb6c4"; ctx.fillText(fmScanDauer(), 308, 12); }
  /* lebende Striche */
  try{
    var rast = 0;
    if(!scan.list.length){ rast = fmAnaRaster(ctx, links, oben, unten, cw); }
    var leb = fmAnaLive(ctx, links, oben, unten, cw);
    if(!leb && !rast && !scan.list.length){
      ctx.fillStyle = "#6d93a8"; ctx.font = "700 12px Arial"; ctx.textAlign = "center";
      ctx.fillText("kein Bild vom Empfaenger - Live-Bild einschalten", links + (cw - links) / 2, Math.round((oben + unten) / 2));
      ctx.textAlign = "left";
    }
  }catch(e){}
  /* Kanalbalken */
  var band = fmBand();
  if(band && band.b > 0 && scan.list.length){
    var lo = band.lo, spanne = band.b;
    var px = function(f3){ return links + (f3 - lo) / spanne * (cw - links - 3); };
    var aktK = scan.jetzt ? Math.round(scan.jetzt.frequency) : -1;
    for(i = 0; i < scan.list.length && i < 900; i++){
      f2 = scan.list[i].frequency;
      if(f2 < lo - 1e5 || f2 > lo + spanne + 1e5){ continue; }
      var kF = String(Math.round(f2));
      var hit2 = !!scan.hits[kF], gs2 = !!scan.aktiv[kF], istAkt = (Math.round(f2) === aktK);
      ctx.fillStyle = hit2 ? "rgba(53,255,131,.26)" : (gs2 ? "rgba(53,209,255,.2)" : "rgba(120,160,190,.08)");
      ctx.fillRect(Math.round(px(f2)), oben + 2, istAkt ? 4 : 2, unten - oben - 2);
      if(hit2 || istAkt){
        ctx.fillStyle = hit2 ? "#35ff83" : "#ff5555";
        ctx.fillRect(Math.round(px(f2)), oben + 2, istAkt ? 4 : 2, unten - oben - 2);
      }
    }
    /* Schwelle und Halten */
    var yS = unten - Math.min(unten - oben, Math.max(4, (sch / 40) * (unten - oben)));
    ctx.save(); ctx.setLineDash([7, 5]); ctx.lineWidth = 1.8; ctx.strokeStyle = "#ffd479";
    ctx.beginPath(); ctx.moveTo(links, Math.round(yS) + .5); ctx.lineTo(cw, Math.round(yS) + .5); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.setLineDash([2, 4]); ctx.lineWidth = 1.6; ctx.strokeStyle = "rgba(255,120,120,.9)";
    ctx.beginPath(); ctx.moveTo(links, Math.round(yS) - 14.5); ctx.lineTo(cw, Math.round(yS) - 14.5); ctx.stroke(); ctx.restore();
    ctx.font = "900 10px Arial"; ctx.textAlign = "right";
    ctx.fillStyle = "#ffd479"; ctx.fillText("Schwelle " + sch.toFixed(1).replace(".", ",") + " dB", cw - 8, Math.round(yS) - 4);
    ctx.fillStyle = "rgba(255,150,150,.95)"; ctx.fillText("Halten", cw - 8, Math.round(yS) - 17);
    if(scan.jetzt){
      var px2 = px(scan.jetzt.frequency);
      if(px2 >= links && px2 <= cw){
        ctx.strokeStyle = "rgba(0,10,16,.9)"; ctx.lineWidth = 4;
        ctx.strokeRect(Math.round(px2) - 8, oben - 1, 16, unten - oben + 2);
        ctx.strokeStyle = "#ff5555"; ctx.lineWidth = 2.2;
        ctx.strokeRect(Math.round(px2) - 8, oben - 1, 16, unten - oben + 2);
      }
    }
    ctx.textAlign = "left";
  }
  /* Richtungspfeile */
  ctx.textAlign = "right"; ctx.font = "900 16px Arial";
  ctx.fillStyle = "#ffd400"; ctx.fillText("\u25b2", cw - 10, 17);
  ctx.fillStyle = "rgba(255,212,0,.45)"; ctx.fillText("\u25bc", cw - 10, unten - 2);
  /* Wait-Plakette */
  var wa = fmScanWarte();
  if(wa >= 0){
    var wt = "Wait " + wa.toFixed(1).replace(".", ",") + " s";
    ctx.font = "900 11px Arial";
    var ww = ctx.measureText(wt).width + 16;
    var wx = cw - ww - 8;
    ctx.fillStyle = "rgba(74,12,12,.95)"; ctx.strokeStyle = "#ff8a8a"; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(wx + 6, 3); ctx.lineTo(wx + ww - 6, 3); ctx.quadraticCurveTo(wx + ww, 3, wx + ww, 9);
    ctx.lineTo(wx + ww, 18); ctx.lineTo(wx, 18); ctx.lineTo(wx, 9); ctx.quadraticCurveTo(wx, 3, wx + 6, 3);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffdada"; ctx.fillText(wt, cw - 16, 15);
  }
  /* Kanalmarken */
  if(bandG && bandG.b > 0 && scan.list.length){
    var lo3 = bandG.lo, sp3 = bandG.b;
    var aktK3 = scan.jetzt ? Math.round(scan.jetzt.frequency) : -1;
    ctx.fillStyle = "rgba(6,14,20,.9)"; ctx.fillRect(links, markY - 1, cw - links, 8);
    for(i = 0; i < scan.list.length && i < 900; i++){
      f2 = scan.list[i].frequency;
      if(f2 < lo3 || f2 > lo3 + sp3){ continue; }
      var k3 = String(Math.round(f2)), istAkt3 = (Math.round(f2) === aktK3);
      var pxm = Math.round(links + (f2 - lo3) / sp3 * (cw - links - 3));
      ctx.fillStyle = istAkt3 ? "#ff5555" : (scan.hits[k3] ? "#35ff83" : "rgba(74,163,255,.65)");
      ctx.fillRect(pxm, markY, istAkt3 ? 4 : 2, 6);
    }
  }
  /* Anzeigezeile unten */
  var gD = ctx.createLinearGradient(0, dispY, 0, chh);
  gD.addColorStop(0, "#071620"); gD.addColorStop(1, "#040b11");
  ctx.fillStyle = gD; ctx.fillRect(0, dispY, cw, chh - dispY);
  ctx.strokeStyle = "rgba(53,209,255,.30)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, dispY + .5); ctx.lineTo(cw, dispY + .5); ctx.stroke();
  if(scan.jetzt){
    ctx.font = "900 20px 'Consolas','DejaVu Sans Mono',monospace"; ctx.textAlign = "left";
    var t2 = hz(scan.jetzt.frequency);
    ctx.fillStyle = hit ? "#ffd6d6" : "#ffffff";
    ctx.fillText(t2, 12, dispY + 24);
    var tw2 = ctx.measureText(t2).width;
    var mx2 = 12 + tw2 + 12;
    if(scan.jetzt.mode){
      var mt = String(scan.jetzt.mode).toUpperCase();
      ctx.font = "900 13px Arial";
      var mw = ctx.measureText(mt).width + 14;
      ctx.fillStyle = "rgba(13,59,77,.95)"; ctx.strokeStyle = "#35d1ff66"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mx2 + 4, dispY + 6); ctx.lineTo(mx2 + mw - 4, dispY + 6); ctx.quadraticCurveTo(mx2 + mw, dispY + 6, mx2 + mw, dispY + 11);
      ctx.lineTo(mx2 + mw, dispY + 25); ctx.lineTo(mx2, dispY + 25); ctx.lineTo(mx2, dispY + 11); ctx.quadraticCurveTo(mx2, dispY + 6, mx2 + 4, dispY + 6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#bfeeff"; ctx.fillText(mt, mx2 + 7, dispY + 21);
      mx2 += mw + 12;
    }
    var snrT = "SNR " + ((snr > -90) ? snr.toFixed(1).replace(".", ",") + " dB" : "\u2014");
    ctx.font = "900 14px 'Consolas',monospace";
    var sw2 = ctx.measureText(snrT).width + 18;
    ctx.fillStyle = hit ? "rgba(56,10,10,.96)" : "rgba(8,32,42,.95)";
    ctx.strokeStyle = hit ? "#ff6b6b" : "#35d1ff88"; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(mx2 + 5, dispY + 5); ctx.lineTo(mx2 + sw2 - 5, dispY + 5); ctx.quadraticCurveTo(mx2 + sw2, dispY + 5, mx2 + sw2, dispY + 10);
    ctx.lineTo(mx2 + sw2, dispY + 26); ctx.lineTo(mx2, dispY + 26); ctx.lineTo(mx2, dispY + 10); ctx.quadraticCurveTo(mx2, dispY + 5, mx2 + 5, dispY + 5);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = hit ? "#ffd6d6" : "#9effc2";
    ctx.fillText(snrT, mx2 + 9, dispY + 22);
  } else {
    ctx.font = "900 12px Arial"; ctx.textAlign = "left"; ctx.fillStyle = "#6d93a8";
    ctx.fillText("bereit - Start druecken fuer den Bereichsscan", 12, dispY + 22);
  }
  ctx.textAlign = "left";
}
function fmAnalyserZeiger(snr, hit){
  var c = document.getElementById("dnx-an-zeiger");
  if(!c){ return; }
  var k = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  var cq = c.getBoundingClientRect();
  var cssW = Math.max(60, Math.round(cq.width)), cssH = Math.max(60, Math.round(cq.height));
  var bw = Math.round(cssW * k), bh = Math.round(cssH * k);
  if(c.width !== bw || c.height !== bh){ c.width = bw; c.height = bh; }
  var ctx = c.getContext("2d");
  try{ ctx.setTransform(k, 0, 0, k, 0, 0); }catch(e){}
  var cw = cssW, chh = cssH, mx = cw / 2, my = chh * 0.56, r = Math.min(cw, chh) * 0.34;
  var gg = ctx.createRadialGradient(mx, my, 5, mx, my, r + 16);
  gg.addColorStop(0, "#12222c"); gg.addColorStop(1, "#05090d");
  ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(mx, my, r + 15, 0, 2 * Math.PI); ctx.fill();
  var a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, i, a, schw;
  ctx.lineWidth = 5; ctx.strokeStyle = "#1d3341";
  ctx.beginPath(); ctx.arc(mx, my, r, a0, a1); ctx.stroke();
  schw = Math.max(0, Math.min(30, fmScanSchwelle()));
  ctx.lineWidth = 5; ctx.strokeStyle = "rgba(53,255,131,.75)";
  ctx.beginPath(); ctx.arc(mx, my, r, a0 + (a1 - a0) * (schw / 30), a1); ctx.stroke();
  for(i = 0; i <= 6; i++){
    a = a0 + (a1 - a0) * i / 6;
    ctx.strokeStyle = (i >= 3) ? "#a9e4ff" : "#4a6a7a";
    ctx.lineWidth = (i === 6) ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(mx + Math.cos(a) * (r - 5), my + Math.sin(a) * (r - 5));
    ctx.lineTo(mx + Math.cos(a) * (r + 2), my + Math.sin(a) * (r + 2));
    ctx.stroke();
  }
  ctx.fillStyle = "#8fb3c4"; ctx.font = "800 8px Arial"; ctx.textAlign = "center";
  for(i = 0; i <= 3; i++){
    a = a0 + (a1 - a0) * (i * 2) / 6;
    ctx.fillText(String(i * 10), mx + Math.cos(a) * (r + 8.5), my + Math.sin(a) * (r + 8.5) + 3);
  }
  var v2 = Math.max(0, Math.min(30, snr));
  var na = a0 + (a1 - a0) * (v2 / 30);
  ctx.strokeStyle = hit ? "rgba(255,90,90,.55)" : "rgba(255,212,0,.45)";
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(na) * (r - 11), my + Math.sin(na) * (r - 11)); ctx.stroke();
  ctx.strokeStyle = hit ? "#ff5555" : "#ffd400";
  ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(na) * (r - 9), my + Math.sin(na) * (r - 9)); ctx.stroke();
  ctx.fillStyle = "#1d3341"; ctx.beginPath(); ctx.arc(mx, my, 5, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = "#8fb3c4"; ctx.font = "900 10px Arial";
  ctx.fillText("SNR", mx, my - 22);
  var wt = (snr > -90) ? (snr.toFixed(1).replace(".", ",") + " dB") : "\u2014";
  ctx.font = "900 12px 'Consolas',monospace";
  var tw2 = ctx.measureText(wt).width + 14;
  ctx.fillStyle = hit ? "rgba(56,10,10,.95)" : "rgba(6,12,17,.95)";
  ctx.strokeStyle = hit ? "#ff6b6b" : "#5fd8ff77"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mx - tw2 / 2 + 4, my + 12); ctx.lineTo(mx + tw2 / 2 - 4, my + 12);
  ctx.quadraticCurveTo(mx + tw2 / 2, my + 12, mx + tw2 / 2, my + 16);
  ctx.lineTo(mx + tw2 / 2, my + 26); ctx.lineTo(mx - tw2 / 2, my + 26); ctx.lineTo(mx - tw2 / 2, my + 16);
  ctx.quadraticCurveTo(mx - tw2 / 2, my + 12, mx - tw2 / 2 + 4, my + 12);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = hit ? "#ffd6d6" : "#dff1fb";
  ctx.fillText(wt, mx, my + 23);
  ctx.textAlign = "left";
}
setInterval(fmAnalyserTakt, 150);
/* v3.37: Waechter - das Scanner-Fenster darf nicht "von selbst" verschwinden.
   Merkt sich der Nutzer es offen, wird es wieder hergestellt (auch nach einem
   Seitenwechsel oder wenn etwas anderes es ausblendet). */
setInterval(function(){
  try{
    if(FM_OFFEN === null){
      var gemerkt = "0";
      try{ gemerkt = localStorage.getItem("dnx.fm.offen") || "0"; }catch(e){}
      FM_OFFEN = (gemerkt === "1");
    }
    if(!FM_OFFEN){ return; }
    var w = document.getElementById("dnx-fm-window");
    if(!w){ open(); return; }
    var cs = getComputedStyle(w);
    if(cs.display === "none" || cs.visibility === "hidden"){ w.style.display = "block"; return; }
    var r = w.getBoundingClientRect();
    var vw = window.innerWidth || 1200, vh = window.innerHeight || 800;
    var fastDraussen = (r.right < 120 || r.bottom < 120 || r.left > vw - 120 || r.top > vh - 120);
    var zuKlein = (r.width < 100 || r.height < 60);
    if(fastDraussen || zuKlein){
      /* v3.38: erst an die gemerkte Stelle, sonst an den Standardplatz - und ganz ins Bild */
      var gesetzt = false;
      try{
        var p = JSON.parse(localStorage.getItem(FM_POS) || "null");
        if(zuKlein){ try{ fmGroesse(w); }catch(e){} }
        if(p && isFinite(p.l) && isFinite(p.t) &&
           p.l > 10 && p.t > 10 && p.l < vw - 200 && p.t < vh - 120){
          w.style.left = Math.round(p.l) + "px"; w.style.top = Math.round(p.t) + "px"; gesetzt = true;
        }
      }catch(e){}
      if(!gesetzt){
        w.style.left = Math.round(vw * 0.01) + "px";
        w.style.top = Math.round(vh * 0.04) + "px";
      }
      var r2 = w.getBoundingClientRect();
      if(r2.right > vw || r2.bottom > vh){
        w.style.left = Math.max(8, Math.round(vw - Math.min(r2.width, vw - 16))) + "px";
        w.style.top = Math.max(8, Math.round(vh - Math.min(r2.height, vh - 16))) + "px";
      }
    }
  }catch(e){}
}, 1000);
/* v3.33: Not-Takt - falls requestAnimationFrame nicht laeuft (gedrosseltes Fenster,
   Hintergrund-Tab), wird die Anzeige trotzdem weitergezeichnet. Laeuft der rAF-Takt
   normal, tut diese Schleife nichts (Sperre unten). */
setInterval(function(){
  try{
    if(Date.now() - FM_LUPE_ZULETZT < 90){ return; }
    fmLupePuls();
  }catch(e){}
}, 100);
window.DNXScannerManager={open, quelle:()=>LUPE.wf, ordnung:()=>FM_VORN,
  rolle:()=>FM_LIN.rolle, rate:()=>FM_LIN.rate, fenster:()=>[FM_LIN.cw2, FM_LIN.regH],
  laeuft:()=>!!(scan && scan.running && !scan.paused),
  quelleInfo:()=>{ try{ var c=FM_LIN.cv; return c? [c.width, c.height, Math.round(fmQueVerschiebung(c))] : null; }catch(e){ return null; } },tune,stop:stopScan,getFavorites:()=>favorites.slice(),lupe:fmLupeTakt,fmHoch:()=>{var w=document.getElementById("dnx-fm-window");if(w)fmHoch(w);}};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{build();setInterval(markers,1200)},{once:true});else{build();setInterval(markers,1200)}})();
/* DNX_SCANNER_MANAGER_END */


/* DNX_RECEIVER_SCROLLBAR_START */
(function(){
  "use strict";

  if(window.__dnxReceiverScrollbar) return;
  window.__dnxReceiverScrollbar = true;

  var STYLE_ID="dnx-receiver-scrollbar-style";

  function installStyle(){
    if(document.getElementById(STYLE_ID)) return;

    var style=document.createElement("style");
    style.id=STYLE_ID;

    style.textContent=`
      #openwebrx-panel-receiver{
        max-height:calc(100vh - 18px) !important;
        overflow-y:scroll !important;
        overflow-x:hidden !important;
        overscroll-behavior:contain !important;
        scrollbar-gutter:stable !important;
        scrollbar-width:auto !important;
        scrollbar-color:#28ff72 #18231d !important;
        padding-right:5px !important;
        box-sizing:border-box !important;
      }

      #openwebrx-panel-receiver::-webkit-scrollbar{
        width:13px !important;
        display:block !important;
      }

      #openwebrx-panel-receiver::-webkit-scrollbar-track{
        background:#18231d !important;
        border-left:1px solid rgba(40,255,114,.30) !important;
        border-radius:8px !important;
      }

      #openwebrx-panel-receiver::-webkit-scrollbar-thumb{
        min-height:44px !important;
        background:
          linear-gradient(
            90deg,
            #0f8f45 0%,
            #28ff72 48%,
            #0f8f45 100%
          ) !important;
        border:2px solid #18231d !important;
        border-radius:9px !important;
        box-shadow:
          inset 0 0 4px rgba(255,255,255,.28),
          0 0 6px rgba(40,255,114,.55) !important;
      }

      #openwebrx-panel-receiver::-webkit-scrollbar-thumb:hover{
        background:
          linear-gradient(
            90deg,
            #19bb59 0%,
            #70ff9d 48%,
            #19bb59 100%
          ) !important;
        box-shadow:
          0 0 9px rgba(40,255,114,.85) !important;
      }

      #openwebrx-panel-receiver::-webkit-scrollbar-button{
        height:12px !important;
        background:#124d2c !important;
      }

      @media (max-width:800px){
        #openwebrx-panel-receiver{
          max-height:calc(100vh - 8px) !important;
          scrollbar-width:thin !important;
          padding-right:3px !important;
        }

        #openwebrx-panel-receiver::-webkit-scrollbar{
          width:9px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function enforce(){
    installStyle();

    var panel=document.getElementById(
      "openwebrx-panel-receiver"
    );

    if(!panel) return;

    panel.style.setProperty(
      "max-height",
      "calc(100vh - 18px)",
      "important"
    );

    panel.style.setProperty(
      "overflow-y",
      "scroll",
      "important"
    );

    panel.style.setProperty(
      "overflow-x",
      "hidden",
      "important"
    );

    panel.style.setProperty(
      "overscroll-behavior",
      "contain",
      "important"
    );
  }

  function boot(){
    enforce();

    window.setTimeout(enforce,300);
    window.setTimeout(enforce,1000);
    window.setTimeout(enforce,2500);

    window.setInterval(enforce,1500);
  }

  if(document.readyState==="loading"){
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {once:true}
    );
  }else{
    boot();
  }

  window.addEventListener("load",boot);
  window.addEventListener("resize",enforce);
})();
/* DNX_RECEIVER_SCROLLBAR_END */


/* DNX_STATUS_TOGGLE_START */
(function(){
  "use strict";

  if(window.__dnxStatusToggle) return;
  window.__dnxStatusToggle=true;

  var STORE="dnx.status.visible";
  var BUTTON_ID="dnx-btn-status-toggle";

  function isVisible(){
    var mobileDefault = !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
    try{
      var value=localStorage.getItem(STORE);
      if(value===null) return !mobileDefault;
      return value==="1";
    }catch(error){
      return !mobileDefault;
    }
  }

  function save(value){
    try{
      localStorage.setItem(
        STORE,
        value ? "1" : "0"
      );
    }catch(error){}
  }

  function apply(){
    var visible=isVisible();

    var status=document.getElementById(
      "dnx-live-status"
    );

    if(status){
      status.style.setProperty(
        "display",
        visible ? "block" : "none",
        "important"
      );

      status.style.setProperty(
        "visibility",
        visible ? "visible" : "hidden",
        "important"
      );

      status.style.setProperty(
        "opacity",
        visible ? "1" : "0",
        "important"
      );
    }

    var button=document.getElementById(
      BUTTON_ID
    );

    if(button){
      button.textContent=
        "DNX Status: " +
        (visible ? "On" : "Off");

      button.style.setProperty(
        "background",
        visible ? "#168cff" : "#666666",
        "important"
      );

      button.style.setProperty(
        "color",
        "#ffffff",
        "important"
      );

      button.style.setProperty(
        "border",
        "1px solid #ffffff",
        "important"
      );

      button.style.setProperty(
        "box-shadow",
        visible
          ? "0 0 10px rgba(22,140,255,.55)"
          : "none",
        "important"
      );
    }
  }

  function ensureButton(){
    var host=document.getElementById(
      "dnx-line-toggle-box"
    );

    if(!host) return false;

    var button=document.getElementById(
      BUTTON_ID
    );

    if(!button){
      button=document.createElement("button");
      button.id=BUTTON_ID;
      button.type="button";

      button.style.cssText=
        "height:26px;" +
        "padding:0 10px;" +
        "border-radius:999px;" +
        "border:1px solid #ffffff;" +
        "background:#168cff;" +
        "color:#ffffff;" +
        "font:700 12px/1 Segoe UI,sans-serif;" +
        "cursor:pointer;";

      button.addEventListener(
        "click",
        function(){
          save(!isVisible());
          apply();
        }
      );

      host.appendChild(button);
    }

    apply();
    return true;
  }

  function boot(){
    ensureButton();
    apply();

    setInterval(function(){
      ensureButton();
      apply();
    },500);
  }

  if(document.readyState==="loading"){
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {once:true}
    );
  }else{
    boot();
  }

  window.addEventListener("load",boot);
})();
/* DNX_STATUS_TOGGLE_END */

/* DNX_3D_TOOL_TOGGLE_START */
(function(){if(window.__dnx3dToggleLoader)return;window.__dnx3dToggleLoader=true;var s=document.createElement("script");s.src="/static/plugins/receiver/dnx_3d_toggle/dnx_3d_toggle.js";document.head.appendChild(s)})();
/* DNX_3D_TOOL_TOGGLE_END */

/* DNX_PHOTO_ROW_START */
(function(){if(window.__dnxPhotoRowLoader)return;window.__dnxPhotoRowLoader=true;var s=document.createElement("script");s.src="/static/plugins/receiver/dnx_photo_row/dnx_photo_row.js";document.head.appendChild(s)})();
/* DNX_PHOTO_ROW_END */

/* DNX_REMOTE_VIEW_ROW_START */
(function(){if(window.__dnxRemoteViewRowLoader)return;window.__dnxRemoteViewRowLoader=true;var s=document.createElement("script");s.src="/static/plugins/receiver/dnx_remote_view_row/dnx_remote_view_row.js";document.head.appendChild(s)})();
/* DNX_REMOTE_VIEW_ROW_END */

/* DNX_TOOL_BUTTON_COLORS_START */
(function(){if(window.__dnxToolColorsLoader)return;window.__dnxToolColorsLoader=true;var s=document.createElement("script");s.src="/static/plugins/receiver/dnx_tool_button_colors/dnx_tool_button_colors.js";document.head.appendChild(s)})();
/* DNX_TOOL_BUTTON_COLORS_END */














/* DNX_MASTER_TOOL_ROW_START */
(function(){
  "use strict";

  if(window.__dnxMasterToolRow) return;
  window.__dnxMasterToolRow=true;

  var ROW_ID="dnx-master-tool-row";

  var TOOLS=[
    {
      id:"dnx-master-yellow",
      label:"Gelb Hover",
      color:"#ffd400",
      textColor:"#000",
      original:"dnx-btn-yellow-line",
      state:function(){
        return !!window.__dnxYellowEnabled;
      }
    },
    {
      id:"dnx-master-green",
      label:"Gruen Tuning",
      color:"#22d94b",
      textColor:"#000",
      original:"dnx-btn-green-line",
      state:function(){
        return !!window.__dnxGreenEnabled;
      }
    },
    {
      id:"dnx-master-status",
      label:"DNX Status",
      color:"#168cff",
      textColor:"#fff",
      original:"dnx-btn-status-toggle",
      state:function(){
        var element=document.getElementById(
          "dnx-live-status"
        );

        return visible(element);
      }
    },
    {
      id:"dnx-master-3d",
      label:"3D Tool",
      color:"#7257ff",
      textColor:"#fff",
      original:"dnx-btn-3d-tool-toggle",
      state:function(){
        return visible(
          document.getElementById("dnx-3d-win") ||
          document.getElementById(
            "dnx-3dtool-window"
          )
        );
      }
    },
    {
      id:"dnx-master-photo",
      label:"noVNC / Foto",
      color:"#1414b8",
      textColor:"#fff",
      original:"dnx-photo-desc-toggle-btn",
      state:function(){
        var element=document.querySelector(
          ".openwebrx-description-container"
        );

        return !!(
          visible(element) &&
          element.classList.contains("expanded")
        );
      }
    },
    {
      id:"dnx-master-remote",
      label:"Remote VIEW",
      color:"#008ca8",
      textColor:"#fff",
      original:"dnx-remote-view-btn",
      state:function(){
        return visible(
          document.getElementById(
            "dnx-source-panel"
          )
        );
      }
    }
  ];

  function visible(element){
    if(!element) return false;

    var style=getComputedStyle(element);

    return (
      style.display!=="none" &&
      style.visibility!=="hidden" &&
      style.opacity!=="0"
    );
  }

  function installStyle(){
    if(
      document.getElementById(
        "dnx-master-tool-row-style"
      )
    ) return;

    var style=document.createElement("style");
    style.id="dnx-master-tool-row-style";

    style.textContent=`
      /*
       * Technische Originalzeile vollständig aus dem Layout
       * entfernen. Originalschalter bleiben per JavaScript
       * anklickbar.
       */
      #dnx-line-toggle-box{
        position:absolute !important;
        left:-100000px !important;
        top:-100000px !important;
        display:block !important;
        width:1px !important;
        height:1px !important;
        min-width:0 !important;
        min-height:0 !important;
        max-width:1px !important;
        max-height:1px !important;
        padding:0 !important;
        margin:0 !important;
        overflow:hidden !important;
        opacity:0 !important;
        visibility:hidden !important;
        pointer-events:none !important;
      }

      #dnx-master-tool-row{
        display:grid !important;
        grid-template-columns:
          repeat(
            auto-fit,
            minmax(108px,1fr)
          ) !important;
        gap:6px !important;
        width:100% !important;
        min-width:0 !important;
        padding:0 !important;
        margin:6px 0 8px !important;
        box-sizing:border-box !important;
        contain:layout !important;
      }

      #dnx-master-tool-row > button{
        position:relative !important;
        inset:auto !important;
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        width:100% !important;
        min-width:0 !important;
        max-width:none !important;
        height:28px !important;
        padding:0 5px !important;
        margin:0 !important;
        border:1px solid #fff !important;
        border-radius:999px !important;
        color:#fff !important;
        font:700 11px/1 Segoe UI,sans-serif !important;
        white-space:nowrap !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
        cursor:pointer !important;
        opacity:1 !important;
        filter:none !important;
        transform:none !important;
        transition:none !important;
        animation:none !important;
        box-shadow:none !important;
      }

      #dnx-master-remote{
        grid-column:span 2 !important;
        min-width:150px !important;
      }

      #dnx-master-tool-row > button::before,
      #dnx-master-tool-row > button::after{
        display:none !important;
        content:none !important;
        animation:none !important;
      }

      @media(max-width:430px){
        #dnx-master-tool-row{
          grid-template-columns:
            repeat(2,minmax(0,1fr))
            !important;
        }
      }

      @media(max-width:260px){
        #dnx-master-tool-row{
          grid-template-columns:
            1fr !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function getReceiver(){
    return document.getElementById(
      "openwebrx-panel-receiver"
    );
  }

  function createRow(){
    var receiver=getReceiver();

    if(!receiver) return null;

    var row=document.getElementById(ROW_ID);

    if(row) return row;

    row=document.createElement("div");
    row.id=ROW_ID;

    /*
     * Direkt vor Gelb/Grün beziehungsweise vor der
     * Frequenzanzeige einsetzen.
     */
    var frequency=
      receiver.querySelector(
        ".webrx-actual-freq-holder"
      ) ||
      receiver.querySelector(
        ".webrx-actual-freq"
      );

    var anchor=frequency;

    while(
      anchor &&
      anchor.parentNode &&
      anchor.parentNode!==receiver
    ){
      anchor=anchor.parentNode;
    }

    if(anchor && anchor.parentNode===receiver){
      receiver.insertBefore(row,anchor);
    }else{
      receiver.insertBefore(
        row,
        receiver.firstChild
      );
    }

    TOOLS.forEach(function(tool){
      var button=document.createElement("button");
      button.id=tool.id;
      button.type="button";

      button.addEventListener(
        "click",
        function(event){
          event.preventDefault();
          event.stopPropagation();

          var original=document.getElementById(
            tool.original
          );

          if(original){
            original.click();
          }

          window.setTimeout(paint,80);
          window.setTimeout(paint,300);
        }
      );

      row.appendChild(button);
    });

    return row;
  }

  function paint(){
    installStyle();

    var row=createRow();

    if(!row) return;

    TOOLS.forEach(function(tool){
      var button=document.getElementById(
        tool.id
      );

      if(!button) return;

      var active=false;

      try{
        active=!!tool.state();
      }catch(error){}

      button.textContent=
        tool.label +
        ": " +
        (active ? "On" : "Off");

      button.style.setProperty(
        "background",
        active ? tool.color : "#666666",
        "important"
      );

      button.style.setProperty(
        "color",
        active ? tool.textColor : "#ffffff",
        "important"
      );

      button.style.setProperty(
        "animation",
        "none",
        "important"
      );

      button.style.setProperty(
        "transition",
        "none",
        "important"
      );

      button.style.setProperty(
        "transform",
        "none",
        "important"
      );

      button.style.setProperty(
        "filter",
        "none",
        "important"
      );

      try{
        button.getAnimations().forEach(
          function(animation){
            animation.cancel();
          }
        );
      }catch(error){}
    });
  }

  function boot(){
    installStyle();
    paint();

    /*
     * Nur Farben/Text aktualisieren.
     * Keine Elemente verschieben oder neu erzeugen.
     */
    setInterval(paint,500);
  }

  if(document.readyState==="loading"){
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {once:true}
    );
  }else{
    boot();
  }

  window.addEventListener("load",paint);
})();
/* DNX_MASTER_TOOL_ROW_END */


  /* DNX_TOP_TICKER_OFF_START: obere Laufzeile per Styler-CSS ausblenden */
  (function(){
    var ID = "dnx-top-ticker-off-style";
    function install(){
      try{
        if(document.getElementById(ID) || !document.head){ return; }
        var st = document.createElement("style");
        st.id = ID;
        st.textContent = "#dnx-ticker-stack{display:none !important;}";
        document.head.appendChild(st);
      }catch(e){}
    }
    install();
    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", install, {once:true});
    }
  })();
  /* DNX_TOP_TICKER_OFF_END */

/* dnx-welcome v4: Begruessung in DE/EN/RU/NL gleichzeitig, keine Spracherkennung */
(function(){
  var SHOW_EVERY_TIME = false;
  var KEY_SEEN = "dnx_welcome_seen_v394";
  var TEXT = [
    {
      code: "de",
      title: "Deutsch – Willkommen auf dem DNX Receiver",
      p1: "Die Registrierung ist freiwillig und kostenlos. Sie schützt den Receiver vor Überlastung und Störungen. Wie und warum sicher: Dein Passwort wird nur lokal auf diesem Server gespeichert und nie an Dritte weitergegeben. Der Login nutzt ein Sitzungs-Cookie mit begrenzter Laufzeit; du kannst dich jederzeit abmelden. Kein Tracking, keine Werbung.",
      p2: "Als registrierter Nutzer darfst du: Profile wechseln und speichern, auch geschützte Betriebsarten; eine eigene Sitzungsdauer wählen; mit deinem Namen in der Besucheranzeige erscheinen; den Scanner bedienen.",
      p3: "Ohne Registrierung darfst du weiterhin: zuhören, Frequenzen und erlaubte Profile umschalten, Aufnahmen downloaden, Scanner und Besucheranzeige ansehen. Die Scanner-Bedienung bleibt Registrierten vorbehalten.",
      p4: "Alle hier eingesetzten Plugins und Werkzeuge sind ausschließlich DNX-Eigenentwicklungen. Sie sind keine öffentlichen OpenWebRX-Plugins oder -Werkzeuge und gehören nicht zum OpenWebRX-Projekt; der Betreiber distanziert sich ausdrücklich von OpenWebRX. Alles ist nur ein gemeinsames Hobby – frei nach dem Motto: Viel Spaß beim gemeinsamen Hobby. Herunterladen und Weitergeben ist erlaubt, aber auf eigene Gefahr – ohne Support, ohne Gewähr und ohne Garantie."
    },
    {
      code: "en",
      title: "English – Welcome to the DNX Receiver",
      p1: "Registration is voluntary and free. It protects the receiver from overload and interference. How and why it is safe: your password is stored only on this local server and never shared with third parties. Login uses a session cookie with limited lifetime; you can log out at any time. No tracking, no advertising.",
      p2: "As a registered user you may: switch and save profiles, including protected modes; choose your own session duration; appear with your name in the visitor list; operate the scanner.",
      p3: "Without registration you can still: listen, switch frequencies and permitted profiles, download recordings, and view the scanner and visitor list. Scanner control is reserved for registered users.",
      p4: "All plugins and tools used here are exclusively DNX in-house developments. They are not public OpenWebRX plugins or tools and are not part of the OpenWebRX project; the operator expressly distances itself from OpenWebRX. Everything is just a shared hobby, based on the motto: Have fun with a shared hobby. Downloading and sharing is permitted, but at your own risk - without support, without guarantee and without guarantee."
    },
    {
      code: "ru",
      title: "Русский – Добро пожаловать на DNX Receiver",
      p1: "Регистрация добровольная и бесплатная. Она защищает приёмник от перегрузки и помех. Как и почему это безопасно: ваш пароль хранится только на этом локальном сервере и не передаётся третьим лицам. Вход выполняется через cookie сессии с ограниченным сроком действия; выйти можно в любой момент. Без отслеживания и рекламы.",
      p2: "Зарегистрированные пользователи могут: переключать и сохранять профили, включая защищённые режимы; выбирать длительность сессии; отображаться под своим именем в списке посетителей; управлять сканером.",
      p3: "Без регистрации вы по-прежнему можете: слушать эфир, переключать частоты и разрешённые профили, скачивать записи, просматривать сканер и список посетителей. Управление сканером доступно только зарегистрированным.",
      p4: "Все используемые здесь плагины и инструменты являются исключительно собственными разработками DNX. Они не являются общедоступными плагинами или инструментами OpenWebRX и не являются частью проекта OpenWebRX; оператор явно дистанцируется от OpenWebRX. Все это просто общее хобби, основанное на девизе: «Получайте удовольствие от общего хобби». Скачивание и распространение разрешено, но на свой страх и риск - без поддержки, без гарантии и без гарантии."
    },
    {
      code: "nl",
      title: "Nederlands – Welkom bij de DNX Receiver",
      p1: "Registratie is vrijwillig en gratis. Zij beschermt de receiver tegen overbelasting en storingen. Hoe en waarom veilig: je wachtwoord wordt alleen lokaal op deze server opgeslagen en nooit aan derden doorgegeven. De login gebruikt een sessie-cookie met beperkte looptijd; je kunt je altijd afmelden. Geen tracking, geen reclame.",
      p2: "Als geregistreerde gebruiker mag je: profielen wisselen en opslaan, ook beschermde bedrijfsmodi; een eigen sessieduur kiezen; met je naam in de bezoekersweergave verschijnen; de scanner bedienen.",
      p3: "Zonder registratie mag je blijven: luisteren, frequenties en toegestane profielen omschakelen, opnames downloaden, scanner en bezoekersweergave bekijken. De bediening van de scanner blijft geregistreerde gebruikers voorbehouden.",
      p4: "Alle hier gebruikte plug-ins en tools zijn uitsluitend interne ontwikkelingen van DNX. Het zijn geen openbare OpenWebRX-plug-ins of tools en maken geen deel uit van het OpenWebRX-project; de exploitant distantieert zich uitdrukkelijk van OpenWebRX. Alles is gewoon een gedeelde hobby, gebaseerd op het motto: Veel plezier met een gedeelde hobby. Downloaden en delen is toegestaan, maar op eigen risico - zonder ondersteuning, zonder garantie en zonder garantie."
    }
  ];
  var DNX_TOOLS_INFO = {
    de: {
      title: "DNX Tools",
      paragraphs: [
        "Willkommen bei DNX Tools – der freien Werkzeugsammlung für OpenWebRX! Dazu gehören das mehrsprachige Willkommenstool, der DNX Styler, Wasserfall- und Spektrumansichten in 2D und 3D, Wetterkarten in 2D/3D mit Radar sowie Status- und Schnellschalter.",
        "Der SDR-Scanner mit Frequenzmanager bietet Favoriten und Kategorien, Bereichs- und automatischen Scan, Filter für digitale Modi, Prioritäten, SNR-Erkennung, Live-Lupe und Kanalanalysator. Mit Remote View kannst du über VNC 1 und 2 entfernte Bildschirme live ansehen und – sofern freigegeben – bedienen. Unterstützte Webcam- und Videostreams bringen zusätzliche Live-Bilder in den Receiver. Eine Nutzerübersicht im KiwiSDR-Stil zeigt, wer verbunden ist und – soweit verfügbar – aus welchem Land oder Standort. Deine Styler-Anpassungen bleiben von denen anderer Nutzer getrennt.",
        "Im Bereich „DNX Projekte – Downloads“ auf dem DNX-OpenWebRX stehen die Tools für alle frei zum Herunterladen bereit – dafür ist keine Admin-Freigabe nötig. Zu jedem Tool gibt es eine leicht verständliche Beschreibung, die erklärt, was es kann. Die Installation und Entfernung erfolgen direkt im Receiver; dafür gelten die vom Admin festgelegten Rechte. Registrierte Nutzer können – sofern freigeschaltet – eigene Tools hochladen und austauschen.",
        "Admins können außerdem festlegen, wer zwischen Profilen wechseln darf. Profile mit sensiblen oder nicht öffentlich freigegebenen Frequenzbereichen lassen sich so für unberechtigte Nutzerrollen sperren. Auch Registrierung, Freischaltung, Rollen und Sicherheitsregeln können sie steuern. DNX Tools sind Hobbyprojekte und kein Bestandteil des offiziellen OpenWebRX-Projekts."
      ]
    },
    en: {
      title: "DNX Tools",
      paragraphs: [
        "Welcome to DNX Tools — a collection of tools for OpenWebRX! It includes a multilingual Welcome Tool, the DNX Styler, 2D and 3D waterfall and spectrum views, 2D and 3D weather maps with radar, plus status and quick-access controls.",
        "The SDR Scanner and Frequency Manager offers favorites and categories, band and automatic scanning, digital-mode filters, priorities, SNR detection, a live magnifier and a channel analyzer. With Remote View, you can watch remote screens live via VNC 1 and 2 and control them if you have permission. Supported webcam and video streams add more live views to the receiver. A KiwiSDR-style user overview shows who is connected and, where available, their country or location. Your DNX Styler customizations remain separate from those of other users.",
        "In „DNX Projekte – Downloads“ on DNX OpenWebRX, the tools are freely available for anyone to download—no admin approval is required. Each tool has an easy-to-understand description explaining what it does. Tools can be installed and removed directly in the receiver, subject to the permissions set by the admin. Registered users may upload and share their own tools if authorized.",
        "Admins can also control who may switch between profiles. Profiles containing sensitive frequencies or ranges that should not be publicly accessible can be restricted to authorized user roles. Admins can manage registration, account activation, roles and security settings as well. DNX Tools are hobby projects and are not part of the official OpenWebRX project."
      ]
    },
    ru: {
      title: "DNX Tools",
      paragraphs: [
        "Добро пожаловать в DNX Tools — коллекцию инструментов для OpenWebRX! В неё входят многоязычный инструмент приветствия, DNX Styler, отображение водопада и спектра в 2D и 3D, погодные карты в 2D и 3D с радаром, а также кнопки статуса и быстрого доступа.",
        "SDR-сканер и менеджер частот предлагают избранные частоты и категории, сканирование диапазона и автоматическое сканирование, фильтры цифровых режимов, приоритеты, обнаружение сигнала по SNR, увеличительное окно в реальном времени и анализатор каналов. С помощью Remote View можно в реальном времени просматривать удалённые экраны через VNC 1 и 2 и управлять ими, если у вас есть соответствующие права. Поддерживаемые веб-камеры и видеопотоки добавляют в приёмник другие трансляции в реальном времени. Список пользователей, как в KiwiSDR, показывает, кто подключён и, если эти данные доступны, из какой он страны или местности. Ваши настройки DNX Styler сохраняются отдельно и не влияют на других пользователей.",
        "В разделе „DNX Projekte – Downloads“ на DNX OpenWebRX инструменты доступны для скачивания всем желающим — разрешение администратора для скачивания не требуется. Для каждого инструмента есть простое и понятное описание его возможностей. Инструменты можно устанавливать и удалять прямо в приёмнике — в соответствии с правами, установленными администратором. Зарегистрированные пользователи могут загружать и обмениваться собственными инструментами, если им это разрешено.",
        "Администраторы также могут управлять тем, кому разрешено переключаться между профилями. Профили с чувствительными частотами или диапазонами, которые не должны быть доступны всем, можно ограничить для определённых ролей пользователей. Кроме того, администраторы управляют регистрацией, активацией учётных записей, ролями и настройками безопасности. DNX Tools — это любительские проекты, не входящие в официальный проект OpenWebRX."
      ]
    },
    nl: {
      title: "DNX Tools",
      paragraphs: [
        "Welkom bij DNX Tools — een verzameling tools voor OpenWebRX! De collectie bevat de meertalige Welcome Tool, de DNX Styler, waterval- en spectrumweergaven in 2D en 3D, weerkaarten in 2D en 3D met radar, plus status- en snelbedieningsknoppen.",
        "De SDR-scanner en frequentiebeheerder bieden favorieten en categorieën, band- en automatische scans, filters voor digitale modi, prioriteiten, SNR-detectie, een live-vergrootglas en een kanaalanalysator. Met Remote View kun je via VNC 1 en 2 externe schermen live bekijken en ze bedienen als je daarvoor toestemming hebt. Ondersteunde webcam- en videostreams voegen extra livebeelden toe aan de receiver. Een gebruikersoverzicht in KiwiSDR-stijl laat zien wie verbonden is en, indien beschikbaar, uit welk land of welke plaats. Jouw DNX Styler-aanpassingen blijven gescheiden van die van andere gebruikers.",
        "In „DNX Projekte – Downloads“ op DNX OpenWebRX kan iedereen de tools vrij downloaden; daarvoor is geen goedkeuring van een beheerder nodig. Bij elke tool staat een duidelijke, eenvoudig te begrijpen beschrijving van de mogelijkheden. Tools kunnen rechtstreeks in de receiver worden geïnstalleerd en verwijderd, volgens de rechten die de beheerder heeft ingesteld. Geregistreerde gebruikers mogen hun eigen tools uploaden en uitwisselen als dat is toegestaan.",
        "Beheerders kunnen ook bepalen wie tussen profielen mag wisselen. Profielen met gevoelige frequenties of bereiken die niet openbaar toegankelijk mogen zijn, kunnen worden beperkt tot bevoegde gebruikersrollen. Beheerders kunnen ook registratie, accountactivering, rollen en beveiligingsinstellingen beheren. DNX Tools zijn hobbyprojecten en maken geen deel uit van het officiële OpenWebRX-project."
      ]
    }
  };
  var EXTRA_KEY = "dnx_welcome_extra";
  var EXTRA = [
    { code: "uk", flag: "UA", label: "Українська",
      title: "Українська – Вітаємо на DNX Receiver",
      p1: "Реєстрація добровільна та безкоштовна. Вона захищає приймач від перевантаження та перешкод. Як і чому це безпечно: ваш пароль зберігається лише на цьому локальному сервері й не передається третім особам. Вхід виконується через cookie сесії з обмеженим строком дії; вийти можна будь-коли. Без відстеження та реклами.",
      p2: "Зареєстровані користувачі можуть: перемикати та зберігати профілі, включно із захищеними режимами; обирати тривалість сесії; відображатися під своїм ім'ям у списку відвідувачів; керувати сканером.",
      p3: "Без реєстрації ви й надалі можете: слухати ефір, перемикати частоти й дозволені профілі, завантажувати записи, переглядати сканер і список відвідувачів. Керування сканером доступне лише зареєстрованим.",
      p4: "Усі плагіни та інструменти, які тут використовуються, є виключно власними розробками DNX. Вони не є публічними плагінами чи інструментами OpenWebRX і не є частиною проекту OpenWebRX; оператор чітко дистанціюється від OpenWebRX. Все це лише спільне хобі, засноване на девізі: Розважайся разом зі спільним хобі. Завантажувати та ділитися дозволено, але на власний ризик - без підтримки, без гарантії та без гарантії." },
    { code: "es", flag: "ES", label: "Español",
      title: "Español – Bienvenido al DNX Receiver",
      p1: "El registro es voluntario y gratuito. Protege el receptor frente a sobrecargas e interferencias. Cómo y por qué es seguro: tu contraseña se guarda solo en este servidor local y nunca se comparte con terceros. El inicio de sesión usa una cookie de sesión con duración limitada; puedes cerrar sesión en cualquier momento. Sin rastreo, sin publicidad.",
      p2: "Como usuario registrado puedes: cambiar y guardar perfiles, incluidos los modos protegidos; elegir la duración de tu sesión; aparecer con tu nombre en la lista de visitantes; manejar el escáner.",
      p3: "Sin registro puedes seguir: escuchando, cambiando frecuencias y perfiles permitidos, descargando grabaciones y viendo el escáner y la lista de visitantes. El manejo del escáner queda reservado a usuarios registrados.",
      p4: "Todos los complementos y herramientas utilizados aquí son desarrollos internos exclusivamente de DNX. No son complementos ni herramientas públicas de OpenWebRX y no forman parte del proyecto OpenWebRX; el operador se distancia expresamente de OpenWebRX. Todo es sólo un hobby compartido, basado en el lema: Diviértete con un hobby compartido. Se permite descargar y compartir, pero bajo su propio riesgo, sin soporte, sin garantía y sin garantía." },
    { code: "zh", flag: "ZH", label: "中文",
      title: "中文 – 欢迎来到 DNX 接收机",
      p1: "注册自愿且免费。它可以保护接收机免受过载和干扰。为何安全以及如何安全:您的密码仅保存在本服务器,绝不会提供给第三方。登录使用有期限的会话 Cookie;您可随时退出。无跟踪、无广告。",
      p2: "注册用户可以:切换并保存配置文件(包括受保护模式);自选会话时长;以您的名字显示在访客列表中;操作扫描仪。",
      p3: "未注册仍可:收听、切换频率和允许的配置、下载录音、查看扫描仪和访客列表。扫描仪操作仅限注册用户。",
      p4: "这里使用的所有插件和工具都是 DNX 内部开发的。它们不是公共 OpenWebRX 插件或工具，也不属于 OpenWebRX 项目；该运营商明确与 OpenWebRX 保持距离。一切都只是一个共同的爱好，基于这样的座右铭：享受共同的爱好带来的乐趣。允许下载和共享，但风险由您自行承担 - 没有支持、没有保证、没有保证。" },
    { code: "ja", flag: "JA", label: "日本語",
      title: "日本語 – DNX Receiver へようこそ",
      p1: "登録は任意・無料です。受信機を過負荷や混信から守ります。安全な理由と仕組み:パスワードはこのローカルサーバーにのみ保存され、第三者へ提供されません。ログインは有効期限付きのセッションCookieを使用し、いつでもログアウトできます。トラッキングや広告はありません。",
      p2: "登録ユーザーは:保護モードを含むプロファイルの切替と保存、セッション時間の選択、訪問者リストへの名前表示、スキャナーの操作ができます。",
      p3: "未登録でも:聴取、周波数と許可プロファイルの切替、録音のダウンロード、スキャナーと訪問者リストの閲覧が可能です。スキャナーの操作は登録ユーザーに限られます。",
      p4: "ここで使用されるすべてのプラグインとツールは、もっぱら DNX 社内で開発されたものです。これらはパブリックな OpenWebRX プラグインまたはツールではなく、OpenWebRX プロジェクトの一部でもありません。オペレーターは OpenWebRX から明示的に距離を置きます。 「共通の趣味で楽しむ」をモットーに、すべてはただの共通の趣味です。ダウンロードと共有は許可されていますが、サポートなし、保証なし、保証なしで自己責任で行ってください。" },
    { code: "ko", flag: "KO", label: "한국어",
      title: "한국어 – DNX Receiver에 오신 것을 환영합니다",
      p1: "가입은 자율이며 무료입니다. 수신기를 과부하와 간섭으로부터 보호합니다. 안전한 이유와 방법: 비밀번호는 이 로컬 서버에만 저장되며 제3자에게 제공되지 않습니다. 로그인은 유효 기간이 있는 세션 쿠키를 사용하며 언제든지 로그아웃할 수 있습니다. 추적과 광고가 없습니다.",
      p2: "등록 사용자는: 보호 모드를 포함한 프로필 전환 및 저장, 세션 시간 선택, 방문자 목록에 이름 표시, 스캐너 조작이 가능합니다.",
      p3: "미등록 상태에서도: 청취, 주파수 및 허용된 프로필 전환, 녹음 다운로드, 스캐너와 방문자 목록 열람이 가능합니다. 스캐너 조작은 등록 사용자만 할 수 있습니다.",
      p4: "여기에 사용된 모든 플러그인과 도구는 DNX 자체 개발 제품입니다. 이는 공개 OpenWebRX 플러그인이나 도구가 아니며 OpenWebRX 프로젝트의 일부도 아닙니다. 운영자는 OpenWebRX와 명시적으로 거리를 둡니다. 모든 것은 공유된 취미일 뿐이며, '함께하는 취미로 즐거운 시간을 보내세요'라는 모토를 바탕으로 합니다. 다운로드 및 공유는 허용되지만 지원이나 보증, 보증 없이 위험을 감수하는 것은 귀하의 책임입니다." },
    { code: "vi", flag: "VI", label: "Tiếng Việt",
      title: "Tiếng Việt – Chào mừng đến DNX Receiver",
      p1: "Đăng ký là tự nguyện và miễn phí. Nó bảo vệ máy thu khỏi quá tải và nhiễu. Vì sao và cách thức an toàn: mật khẩu của bạn chỉ lưu trên máy chủ cục bộ này, không chia sẻ cho bên thứ ba. Đăng nhập dùng cookie phiên có thời hạn; bạn có thể đăng xuất bất cứ lúc nào. Không theo dõi, không quảng cáo.",
      p2: "Người dùng đã đăng ký có thể: chuyển và lưu hồ sơ, gồm cả chế độ được bảo vệ; chọn thời lượng phiên; hiển thị tên trong danh sách khách; điều khiển máy quét.",
      p3: "Không đăng ký bạn vẫn có thể: nghe, chuyển tần số và hồ sơ được phép, tải bản ghi, xem máy quét và danh sách khách. Điều khiển máy quét chỉ dành cho người đã đăng ký.",
      p4: "Tất cả các plugin và công cụ được sử dụng ở đây đều là sự phát triển nội bộ độc quyền của DNX. Chúng không phải là các plugin hoặc công cụ OpenWebRX công khai và không phải là một phần của dự án OpenWebRX; toán tử tách biệt rõ ràng với OpenWebRX. Mọi thứ chỉ là sở thích chung, dựa trên phương châm: Hãy vui vẻ với sở thích chung. Việc tải xuống và chia sẻ được cho phép nhưng bạn phải tự chịu rủi ro - không có hỗ trợ, không có bảo đảm và không có bảo đảm." },
    { code: "th", flag: "TH", label: "ไทย",
      title: "ไทย – ยินดีต้อนรับสู่ DNX Receiver",
      p1: "การสมัครเป็นไปตามสมัครใจและฟรี ช่วยปกป้องเครื่องรับจากภาระเกินและการรบกวน ปลอดภัยอย่างไรและเพราะอะไร: รหัสผ่านของคุณเก็บเฉพาะบนเซิร์ฟเวอร์ท้องถิ่นนี้ ไม่ส่งต่อให้บุคคลที่สาม การเข้าสู่ระบบใช้คุกกี้เซสชันที่มีอายุจำกัด ออกได้ทุกเมื่อ ไม่มีการติดตามหรือโฆษณา",
      p2: "ผู้ใช้ที่ลงทะเบียนสามารถ: สลับและบันทึกโปรไฟล์รวมถึงโหมดที่ป้องกัน, เลือกระยะเวลาเซสชัน, แสดงชื่อในรายชื่อผู้ชม, ควบคุมสแกนเนอร์",
      p3: "โดยไม่ต้องลงทะเบียนคุณยังสามารถ: ฟัง, สลับความถี่และโปรไฟล์ที่อนุญาต, ดาวน์โหลดบันทึก, ดูสแกนเนอร์และรายชื่อผู้ชม การควบคุมสแกนเนอร์สงวนไว้สำหรับผู้ใช้ที่ลงทะเบียน",
      p4: "ปลั๊กอินและเครื่องมือทั้งหมดที่ใช้ในที่นี้เป็นการพัฒนาภายในของ DNX โดยเฉพาะ ไม่ใช่ปลั๊กอินหรือเครื่องมือ OpenWebRX สาธารณะ และไม่ได้เป็นส่วนหนึ่งของโครงการ OpenWebRX ผู้ปฏิบัติงานแยกตัวจาก OpenWebRX อย่างชัดเจน ทุกอย่างเป็นเพียงงานอดิเรกที่มีร่วมกัน ตามคติประจำใจ: ขอให้สนุกกับงานอดิเรกที่มีร่วมกัน อนุญาตให้ดาวน์โหลดและแชร์ได้ แต่คุณต้องยอมรับความเสี่ยงเอง - โดยไม่ต้องรองรับ ไม่มีการรับประกัน และไม่มีการรับประกัน" }
  ];
  var FLAGS = {
    de: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#000'/><rect y='5.33' width='24' height='5.34' fill='#dd0000'/><rect y='10.67' width='24' height='5.33' fill='#ffce00'/></svg>",
    en: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#012169'/><path d='M0,0 24,16 M24,0 0,16' stroke='#fff' stroke-width='3.2'/><path d='M0,0 24,16 M24,0 0,16' stroke='#C8102E' stroke-width='1.6'/><path d='M12,0 V16 M0,8 H24' stroke='#fff' stroke-width='5.3'/><path d='M12,0 V16 M0,8 H24' stroke='#C8102E' stroke-width='3.2'/></svg>",
    ru: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect y='5.33' width='24' height='5.34' fill='#0039a6'/><rect y='10.67' width='24' height='5.33' fill='#d52b1e'/></svg>",
    nl: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#ae1c28'/><rect y='5.33' width='24' height='5.34' fill='#fff'/><rect y='10.67' width='24' height='5.33' fill='#21468b'/></svg>",
    uk: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='8' fill='#005bbb'/><rect y='8' width='24' height='8' fill='#ffd500'/></svg>",
    es: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#aa151b'/><rect y='4' width='24' height='8' fill='#f1bf00'/></svg>",
    zh: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#de2910'/><path fill='#ffde00' d='M4,1.5 L4.8,3.9 L7.3,3.9 L5.3,5.4 L6,7.8 L4,6.3 L2,7.8 L2.7,5.4 L0.7,3.9 L3.2,3.9 Z'/></svg>",
    ja: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><circle cx='12' cy='8' r='4.5' fill='#bc002d'/></svg>",
    ko: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><circle cx='12' cy='8' r='4.5' fill='#cd2e3a'/><path d='M7.5,8 A4.5,4.5 0 0,0 16.5,8 Z' fill='#0047a0'/></svg>",
    vi: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#da251d'/><path fill='#ffff00' transform='translate(8,3.2)' d='M4,1.5 L4.8,3.9 L7.3,3.9 L5.3,5.4 L6,7.8 L4,6.3 L2,7.8 L2.7,5.4 L0.7,3.9 L3.2,3.9 Z'/></svg>",
    th: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#a51931'/><rect y='2.67' width='24' height='10.66' fill='#f4f5f8'/><rect y='5.33' width='24' height='5.34' fill='#2d2a4a'/></svg>"
  };
  function flagImg(code){
    var i = document.createElement("img");
    i.src = "data:image/svg+xml;utf8," + encodeURIComponent(FLAGS[code] || "");
    i.alt = code;
    i.style.cssText = "width:20px;height:14px;margin-right:6px;vertical-align:-2px;border:1px solid rgba(255,255,255,.25);border-radius:2px;";
    return i;
  }
  var LABELS = {
    register: "Registrieren · Register · Регистрация · Registreren",
    login: "Anmelden · Log in · Вход · Inloggen",
    close: "Schließen · Close · Закрыть · Sluiten"
  };
  var base = location.protocol + "//" + location.hostname + ":8096";
  var wrap = null, refs = {};
  function el(t, c, x){
    var e = document.createElement(t);
    if(c) e.className = c;
    if(x != null) e.textContent = x;
    return e;
  }
  function build(){
    wrap = el("div");
    wrap.id = "dnx-welcome-modal";
    var s = wrap.style;
    s.position = "fixed"; s.left = "0"; s.top = "0"; s.right = "0"; s.bottom = "0";
    s.zIndex = "2147483000"; s.display = "none";
    s.alignItems = "center"; s.justifyContent = "center";
    s.padding = "16px"; s.background = "rgba(0,0,0,.55)"; s.boxSizing = "border-box";
    var card = el("div");
    var c = card.style;
    c.maxWidth = "620px"; c.width = "100%"; c.maxHeight = "86vh"; c.overflowY = "auto";
    c.background = "#0f1713"; c.color = "#e8f5ec";
    c.border = "2px solid rgba(50,255,120,.75)"; c.borderRadius = "12px";
    c.padding = "14px 18px 12px"; c.boxSizing = "border-box";
    c.fontFamily = "'Segoe UI',Arial,sans-serif"; c.fontSize = "12px"; c.lineHeight = "1.45";
    function section(t, first){
      var sec = el("div");
      sec.style.margin = "0 0 10px";
      if(!first){
        sec.style.borderTop = "1px solid rgba(255,255,255,.14)";
        sec.style.paddingTop = "8px";
      }
      var h = el("h3");
      h.style.cssText = "margin:0 0 6px;font-size:14px;color:#35ff83;";
      if(t.code && FLAGS[t.code]){ h.appendChild(flagImg(t.code)); }
      h.appendChild(el("span", null, t.title));
      var p1 = el("p", null, t.p1);
      var p2 = el("p", null, t.p2);
      var p3 = el("p", null, t.p3);
      [p1, p2, p3].forEach(function(p){ p.style.margin = "0 0 6px"; });
      p2.style.color = "#d7ffd9";
      p3.style.color = "#ffe9a8";
      sec.appendChild(h); sec.appendChild(p1); sec.appendChild(p2); sec.appendChild(p3);
      /* v3.71: DNX-Hinweis (eigene Entwicklung, keine OpenWebRX-Plugins, Hobby,
         Nutzung auf eigene Gefahr, kein Support) */
      if(t.p4){
        var p4 = el("p", null, t.p4);
        p4.style.cssText = "margin:8px 0 0;padding:7px 9px;border-left:3px solid #ffd479;" +
                           "background:rgba(255,212,121,.10);color:#ffe9b0;border-radius:0 6px 6px 0;";
        sec.appendChild(p4);
      }
      var info = DNX_TOOLS_INFO[t.code];
      if(info){
        var toolsBox = el("div");
        toolsBox.style.cssText = "margin:9px 0 0;padding:8px 10px;border-left:3px solid #35ff83;" +
                                 "background:rgba(53,255,131,.08);border-radius:0 6px 6px 0;";
        var toolsHead = el("h4", null, info.title);
        toolsHead.style.cssText = "margin:0 0 6px;font-size:13px;color:#35ff83;";
        toolsBox.appendChild(toolsHead);
        info.paragraphs.forEach(function(text){
          var pTools = el("p", null, text);
          pTools.style.cssText = "margin:0 0 7px;";
          toolsBox.appendChild(pTools);
        });
        sec.appendChild(toolsBox);
      }
      return sec;
    }
    TEXT.forEach(function(t, i){
      card.appendChild(section(t, i === 0));
    });
    var savedExtra = [];
    try { savedExtra = (localStorage.getItem(EXTRA_KEY) || "").split(","); } catch(e){}
    var xdiv = el("div");
    xdiv.style.cssText = "border-top:1px solid rgba(255,255,255,.14);padding-top:8px;margin:0 0 8px;";
    var xlbl = el("div", null, "Weitere Sprachen · More languages · Інші мови · Más idiomas · 更多语言 · その他の言語 · 다른 언어 · Ngôn ngữ khác · ภาษาอื่นๆ");
    xlbl.style.cssText = "font-size:11px;color:#9fb8a8;margin:0 0 6px;";
    xdiv.appendChild(xlbl);
    var xrow = el("div");
    xrow.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;";
    xdiv.appendChild(xrow);
    card.appendChild(xdiv);
    var xholder = el("div");
    EXTRA.forEach(function(x){
      var sec = section(x, false);
      sec.style.display = "none";
      var b = el("button");
      if(FLAGS[x.code]){ b.appendChild(flagImg(x.code)); }
      b.appendChild(el("span", null, x.label));
      b.style.cssText = "padding:4px 8px;border-radius:999px;border:1px solid #35ff83;background:transparent;color:#b9efff;font:700 11px/1.4 'Segoe UI',Arial,sans-serif;cursor:pointer;";
      function setOn(on){
        sec.style.display = on ? "block" : "none";
        b.style.background = on ? "#1f7a3d" : "transparent";
        b.style.color = on ? "#fff" : "#b9efff";
        var codes = [];
        EXTRA.forEach(function(y){
          if(y.__sec && y.__sec.style.display === "block") codes.push(y.code);
        });
        try { localStorage.setItem(EXTRA_KEY, codes.join(",")); } catch(e){}
        if(on){ try { sec.scrollIntoView({ block: "nearest" }); } catch(e){} }
      }
      x.__sec = sec;
      b.onclick = function(){ setOn(sec.style.display !== "block"); };
      xrow.appendChild(b);
      xholder.appendChild(sec);
      if(savedExtra.indexOf(x.code) !== -1){ setOn(true); }
    });
    card.appendChild(xholder);
    var brow = el("div");
    brow.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;";
    var aReg = el("a", null, LABELS.register);
    aReg.target = "_blank"; aReg.rel = "noopener";
    aReg.style.cssText = "padding:6px 12px;border-radius:6px;background:#1f7a3d;color:#fff;text-decoration:none;font-weight:700;";
    var aLog = el("a", null, LABELS.login);
    aLog.target = "_blank"; aLog.rel = "noopener";
    aLog.style.cssText = "padding:6px 12px;border-radius:6px;background:#274069;color:#fff;text-decoration:none;font-weight:700;";
    var bClose = el("button", null, LABELS.close);
    bClose.style.cssText = "padding:6px 12px;border-radius:6px;border:1px solid #666;background:transparent;color:#ccc;cursor:pointer;";
    bClose.onclick = hideSeen;
    aReg.href = base + "/register";
    aLog.href = base + "/login";
    refs.aReg = aReg; refs.aLog = aLog; refs.bClose = bClose;
    brow.appendChild(aReg); brow.appendChild(aLog); brow.appendChild(bClose);
    card.appendChild(brow);
    wrap.appendChild(card);
    document.body.appendChild(wrap);
  }
  function show(){
    if(!wrap) build();
    wrap.style.display = "flex";
  }
  function hideSeen(){
    try { localStorage.setItem(KEY_SEEN, "1"); } catch(e){}
    if(wrap) wrap.style.display = "none";
  }
  window.dnxWelcomeShow = show;
  function start(){
    var seen = null;
    try { seen = localStorage.getItem(KEY_SEEN); } catch(e){}
    if(SHOW_EVERY_TIME || seen !== "1"){ setTimeout(show, 1200); }
  }
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();


/* dnx-scangate v1: Scanner sichtbar fuer alle, Bedienung nur eingeloggt */
(function(){
  function logged(){
    return /(?:^|; )dnxac_pub=/.test(document.cookie);
  }
  var HINT = "Bedienung nur für registrierte Nutzer · Registered users only · Только для зарегистрированных · Alleen voor geregistreerde";
  var base = location.protocol + "//" + location.hostname + ":8096";
  var banner = null;
  function showHint(host){
    if(banner && banner.parentNode) return;
    host = host || document.body;
    banner = document.createElement("div");
    banner.style.cssText = "background:#7a4d1f;color:#fff;font:700 12px/1.4 'Segoe UI',Arial,sans-serif;padding:6px 10px;border-radius:6px;margin:4px;";
    banner.textContent = HINT;
    var a = document.createElement("a");
    a.href = base + "/register";
    a.target = "_blank";
    a.rel = "noopener";
    a.style.cssText = "color:#ffe9a8;margin-left:8px;text-decoration:underline;";
    a.textContent = "Registrieren · Register · Регистрация · Registreren";
    banner.appendChild(a);
    host.insertBefore(banner, host.firstChild);
    window.setTimeout(function(){
      if(banner && banner.parentNode){ banner.parentNode.removeChild(banner); }
      banner = null;
    }, 6000);
  }
  function gateClicks(){
    var w = document.getElementById("dnx-fm-window");
    if(!w || w.__dnxGate) return;
    w.__dnxGate = 1;
    w.addEventListener("click", function(ev){
      if(logged()) return;
      var t = ev.target && ev.target.closest ? ev.target.closest("button,[data-a],input,select,a") : null;
      if(!t) return;
      if(t.closest("[data-a='close'],[data-a='max'],[data-a='pop']")) return;
      if(t.tagName === "A" && t.target === "_blank") return;
      ev.preventDefault();
      ev.stopPropagation();
      showHint(w);
    }, true);
  }
  function wrapApi(){
    var M = window.DNXScannerManager;
    if(!M || M.__dnxGate) return;
    M.__dnxGate = 1;
    var tune = M.tune;
    M.tune = function(){
      if(!logged()){
        showHint(document.getElementById("dnx-fm-window"));
        return;
      }
      return tune.apply(this, arguments);
    };
  }
  function tickGate(){ gateClicks(); wrapApi(); }
  tickGate();
  window.setInterval(tickGate, 1500);
})();

/* dnx-styler v36: DNX Styler - Themes wie Winamp-Skins/XP-Themes, reines CSS-Overlay */
(function(){
  try{ if(localStorage.getItem("dnx_styler_off") === "1") return; }catch(e){}
  var KEY = "dnx_styler_theme";
  var PRESETS = {
    dnx:      { name: "DNX aktuell",      bg: "#06130b", panel: "#0f1713", accent: "#35ff83", btn: "#14261b", text: "#e8f5ec", btntext: "#06130b", radius: 6,  glow: 4,  fx: 60, mt: 1, mt_seite: 1, mt_abstand: 10, mt_ticks: 1, mt_schrift: 12, mt_min: 30, mt_scroller: 1, mt_bg: 78, mt_fg: 100 },
    dnxnight: { name: "DNX Nacht",        bg: "#020806", panel: "#08120c", accent: "#2bd97a", btn: "#0c1a12", text: "#c8e8d4", btntext: "#020806", radius: 6,  glow: 2,  fx: 20 },
    dnxgold:  { name: "DNX Gold",         bg: "#100c04", panel: "#1a1408", accent: "#ffd75e", btn: "#241c0c", text: "#f4e8c8", btntext: "#100c04", radius: 6,  glow: 6,  fx: 50 },
    winamp:   { name: "Winamp Classic",   bg: "#000000", panel: "#101410", accent: "#00ff41", btn: "#0a0f0a", text: "#00ff41", btntext: "#000000", radius: 0,  glow: 7,  fx: 80 },
    luna:     { name: "XP Luna",          bg: "#3a6ea5", panel: "#d6e4f5", accent: "#2f6fd0", btn: "#e8f0fb", text: "#0a2a5a", btntext: "#ffffff", radius: 8,  glow: 2,  fx: 0 },
    amber:    { name: "Amber Terminal",   bg: "#140d02", panel: "#1f1405", accent: "#ffb000", btn: "#241605", text: "#ffb000", btntext: "#140d02", radius: 2,  glow: 9,  fx: 70 },
    contra:   { name: "High Contrast",    bg: "#000000", panel: "#000000", accent: "#ffff00", btn: "#000000", text: "#ffffff", btntext: "#000000", radius: 0,  glow: 0,  fx: 0 },
    win95:    { name: "Windows 95",       bg: "#008080", panel: "#c0c0c0", accent: "#000080", btn: "#c0c0c0", text: "#000000", btntext: "#ffffff", radius: 0,  glow: 0,  fx: 0 },
    win2k:    { name: "Windows 2000",     bg: "#3a6ea5", panel: "#d4d0c8", accent: "#0a246a", btn: "#d4d0c8", text: "#000000", btntext: "#ffffff", radius: 2,  glow: 0,  fx: 0 },
    royale:   { name: "XP Royale",        bg: "#1b3f7a", panel: "#24487c", accent: "#7da7e8", btn: "#2f5a99", text: "#e8f0fb", btntext: "#0a1a30", radius: 6,  glow: 3,  fx: 20 },
    zune:     { name: "XP Zune",          bg: "#241a12", panel: "#33241a", accent: "#f0a050", btn: "#3d2b1f", text: "#f5e8d8", btntext: "#241a12", radius: 6,  glow: 3,  fx: 20 },
    aqua:     { name: "Mac Aqua",         bg: "#5a7ba8", panel: "#dfe7f0", accent: "#2e7ce8", btn: "#f2f6fa", text: "#16324f", btntext: "#ffffff", radius: 10, glow: 4,  fx: 30 },
    c64:      { name: "Commodore 64",     bg: "#40318d", panel: "#4c3fa0", accent: "#a5a0f0", btn: "#4c3fa0", text: "#b8b4f0", btntext: "#201860", radius: 0,  glow: 2,  fx: 0 },
    amiga:    { name: "Amiga Workbench",  bg: "#0055a4", panel: "#a8a8a8", accent: "#ff8800", btn: "#c0c0c0", text: "#000000", btntext: "#000000", radius: 0,  glow: 0,  fx: 0 },
    atari:    { name: "Atari ST",         bg: "#b8b8b8", panel: "#d0d0d0", accent: "#2040a0", btn: "#c8c8c8", text: "#000000", btntext: "#ffffff", radius: 0,  glow: 0,  fx: 0 },
    gameboy:  { name: "Game Boy",         bg: "#9bbc0f", panel: "#8bac0f", accent: "#306230", btn: "#8bac0f", text: "#0f380f", btntext: "#9bbc0f", radius: 2,  glow: 0,  fx: 0 },
    matrix:   { name: "Matrix",           bg: "#000000", panel: "#020a02", accent: "#39ff14", btn: "#041204", text: "#39ff14", btntext: "#000000", radius: 0,  glow: 14, fx: 100 },
    phosphor: { name: "Phosphor Gruen",   bg: "#0a0f0a", panel: "#101810", accent: "#33ff66", btn: "#162416", text: "#b8ffb8", btntext: "#0a0f0a", radius: 4,  glow: 6,  fx: 40 },
    crt:      { name: "CRT Papierweiss",  bg: "#d8d0c0", panel: "#e8e0d0", accent: "#404040", btn: "#f0ead8", text: "#202020", btntext: "#f0ead8", radius: 3,  glow: 0,  fx: 0 },
    eink:     { name: "E-Ink",            bg: "#f5f5f0", panel: "#ffffff", accent: "#111111", btn: "#eeeeee", text: "#111111", btntext: "#eeeeee", radius: 2,  glow: 0,  fx: 0 },
    sepia:    { name: "Sepia Papier",     bg: "#e8d8b8", panel: "#f0e4c8", accent: "#704020", btn: "#f5ecd4", text: "#402810", btntext: "#f5ecd4", radius: 4,  glow: 0,  fx: 0 },
    blueprint:{ name: "Blueprint",        bg: "#0a2a5a", panel: "#10386e", accent: "#9fc3ff", btn: "#16407e", text: "#dce8ff", btntext: "#0a2a5a", radius: 2,  glow: 3,  fx: 20 },
    nord:     { name: "Nord",             bg: "#2e3440", panel: "#3b4252", accent: "#88c0d0", btn: "#434c5e", text: "#d8dee9", btntext: "#2e3440", radius: 6,  glow: 2,  fx: 0 },
    dracula:  { name: "Dracula",          bg: "#282a36", panel: "#343746", accent: "#ff79c6", btn: "#44475a", text: "#f8f8f2", btntext: "#282a36", radius: 8,  glow: 5,  fx: 40 },
    monokai:  { name: "Monokai",          bg: "#272822", panel: "#3e3d32", accent: "#a6e22e", btn: "#49483e", text: "#f8f8f2", btntext: "#272822", radius: 6,  glow: 3,  fx: 30 },
    solar:    { name: "Solarized",        bg: "#002b36", panel: "#073642", accent: "#b58900", btn: "#094050", text: "#93a1a1", btntext: "#002b36", radius: 4,  glow: 2,  fx: 0 },
    gruvbox:  { name: "Gruvbox",          bg: "#282828", panel: "#3c3836", accent: "#fabd2f", btn: "#504945", text: "#ebdbb2", btntext: "#282828", radius: 6,  glow: 3,  fx: 20 },
    synth:    { name: "Synthwave",        bg: "#1a1030", panel: "#251743", accent: "#ff2bd6", btn: "#2e1d52", text: "#e8f8ff", btntext: "#1a1030", radius: 10, glow: 10, fx: 90 },
    vapor:    { name: "Vaporwave",        bg: "#2b1b4a", panel: "#3a2a63", accent: "#00e8e8", btn: "#46367a", text: "#ffd8f0", btntext: "#2b1b4a", radius: 12, glow: 8,  fx: 70 },
    ocean:    { name: "Tiefsee",          bg: "#041828", panel: "#0a2438", accent: "#28c8e8", btn: "#103448", text: "#d0f0f8", btntext: "#041828", radius: 8,  glow: 5,  fx: 40 },
    forest:   { name: "Wald",             bg: "#0c1a10", panel: "#14261a", accent: "#6abf59", btn: "#1c3424", text: "#e0f0d8", btntext: "#0c1a10", radius: 8,  glow: 3,  fx: 20 },
    cherry:   { name: "Kirschbluete",     bg: "#20080c", panel: "#30101a", accent: "#ff4d6d", btn: "#3c1622", text: "#ffe0e8", btntext: "#20080c", radius: 10, glow: 6,  fx: 50 },
    gold:     { name: "Gold Edition",     bg: "#141008", panel: "#201808", accent: "#ffd700", btn: "#2c2210", text: "#ffe8a0", btntext: "#141008", radius: 6,  glow: 8,  fx: 60 },
    copper:   { name: "Kupfer",           bg: "#180e08", panel: "#241610", accent: "#e8863c", btn: "#301c12", text: "#ffd8b8", btntext: "#180e08", radius: 6,  glow: 6,  fx: 40 },
    ice:      { name: "Eis / Frost",      bg: "#dce8f4", panel: "#eef4fb", accent: "#4a90d9", btn: "#f8fbff", text: "#1a3a5c", btntext: "#ffffff", radius: 10, glow: 4,  fx: 30 },
    rose:     { name: "Rose Pastell",     bg: "#f4e4ec", panel: "#fbeef4", accent: "#d16ba5", btn: "#fdf6fa", text: "#5c2a44", btntext: "#ffffff", radius: 12, glow: 3,  fx: 20 },
    slate:    { name: "Graphit",          bg: "#1c1e22", panel: "#26292e", accent: "#8a93a2", btn: "#2e3238", text: "#d8dce2", btntext: "#1c1e22", radius: 4,  glow: 1,  fx: 0 },
    hazmat:   { name: "Warnorange",       bg: "#101010", panel: "#1a1a1a", accent: "#ff8c00", btn: "#242424", text: "#ffd8a8", btntext: "#101010", radius: 2,  glow: 6,  fx: 50 },
    hallow:   { name: "Halloween",        bg: "#0d0714", panel: "#1a0f24", accent: "#ff7518", btn: "#241430", text: "#e8d8f8", btntext: "#0d0714", radius: 8,  glow: 7,  fx: 60 },
    xmas:     { name: "Weihnachten",      bg: "#081408", panel: "#102010", accent: "#d42424", btn: "#183018", text: "#f0e8d8", btntext: "#ffffff", radius: 8,  glow: 5,  fx: 40 },
    valentin: { name: "Valentin",         bg: "#200a10", panel: "#301018", accent: "#ff6699", btn: "#3c1620", text: "#ffe0ea", btntext: "#200a10", radius: 12, glow: 6,  fx: 50 },
    patrik:   { name: "Kleeblatt",        bg: "#041408", panel: "#0a2010", accent: "#2eb82e", btn: "#103018", text: "#d8f0d8", btntext: "#041408", radius: 6,  glow: 4,  fx: 30 },
    ubuntu:   { name: "Ubuntu",           bg: "#2c001e", panel: "#3d0f2b", accent: "#e95420", btn: "#4a1533", text: "#f4e4e4", btntext: "#2c001e", radius: 8,  glow: 4,  fx: 30 },
    mint:     { name: "Mint",             bg: "#16201a", panel: "#1f2c24", accent: "#8fd55c", btn: "#26382c", text: "#e4f0e4", btntext: "#16201a", radius: 8,  glow: 3,  fx: 20 },
    fedora:   { name: "Fedora",           bg: "#0b57a4", panel: "#1a67b4", accent: "#3cb8e8", btn: "#2470c0", text: "#eaf9ff", btntext: "#0b3760", radius: 10, glow: 4,  fx: 30 },
    kali:     { name: "Kali",             bg: "#0e0e12", panel: "#16161c", accent: "#2e7cf0", btn: "#1c1c24", text: "#d8e8ff", btntext: "#0e0e12", radius: 4,  glow: 4,  fx: 30 },
    camo:     { name: "Tarn",             bg: "#1a1c12", panel: "#242818", accent: "#7a8957", btn: "#2c3020", text: "#d8dcc8", btntext: "#1a1c12", radius: 4,  glow: 2,  fx: 10 },
    neoncyan: { name: "Neon Cyan",        bg: "#020a10", panel: "#04141c", accent: "#00f0ff", btn: "#062028", text: "#c8f8ff", btntext: "#020a10", radius: 6,  glow: 12, fx: 80 },
    neonpink: { name: "Neon Pink",        bg: "#10020a", panel: "#1c0412", accent: "#ff20a0", btn: "#280618", text: "#ffd8ec", btntext: "#10020a", radius: 6,  glow: 12, fx: 80 }
  };
  /* Paletten-Vorlagen: Verlauf dunkel -> hell, links nach rechts (Linie + Pills) */
  var PALETTES = [
    ["pspek", "Palette: Spektrum (dunkel->hell)", "#05070d", "#0b1016", "#101823", "#00c8ff", "#e6f2ff", "#04121e",
     "linear-gradient(90deg,#000208 0%,#001a5e 18%,#0049d8 34%,#00b7ff 48%,#00e08a 60%,#54ff2e 72%,#ffe14d 84%,#ff7a1a 92%,#ffffff 100%)"],
    ["psdrangel", "Palette: SDRangel-Stil", "#00060f", "#04101c", "#081826", "#2f9bff", "#dcefff", "#001426",
     "linear-gradient(90deg,#00040c 0%,#00284f 24%,#005fa8 46%,#12a0e6 68%,#7fd6ff 86%,#ffffff 100%)"],
    ["psdruno", "Palette: SDRuno-Stil", "#120a03", "#1c1207", "#26180a", "#ff9a2e", "#ffe9cf", "#1c1004",
     "linear-gradient(90deg,#0d0700 0%,#4a2600 26%,#a85c00 50%,#ff9a1f 72%,#ffd27a 88%,#fff6e0 100%)"],
    ["pwinrad", "Palette: Winrad-Stil", "#000000", "#070310", "#0e0a1c", "#ff4646", "#ffe8e8", "#140004",
     "linear-gradient(90deg,#000000 0%,#00007a 24%,#00b7c8 48%,#c8ff00 68%,#ff8a00 86%,#ff2020 100%)"],
    ["plinrad", "Palette: Linrad-Stil", "#000000", "#041006", "#08180c", "#2fe05a", "#d8ffd8", "#00120a",
     "linear-gradient(90deg,#000000 0%,#00310f 22%,#007a25 46%,#22d34a 66%,#9bff9b 84%,#ffffff 100%)"],
    ["pturbo", "Palette: Turbo", "#05070c", "#0a0f18", "#0f1622", "#3ba7ff", "#e8f1ff", "#04101c",
     "linear-gradient(90deg,#23171b 0%,#3f2a8c 20%,#2f6ee0 36%,#22b7e0 50%,#35dba0 64%,#8ce83c 78%,#e8d43a 88%,#ff5a1f 100%)"],
    ["pinferno", "Palette: Inferno", "#0a0407", "#150812", "#1f0c18", "#ff7a2f", "#ffe6d2", "#1a0500",
     "linear-gradient(90deg,#000004 0%,#1b0c41 20%,#4a0c6b 38%,#8a1d63 52%,#c74a3c 66%,#f0920c 80%,#f7d03c 92%,#fcffa4 100%)"],
    ["pviridis", "Palette: Viridis", "#06080d", "#0b0f14", "#111820", "#35c46a", "#e6f7e0", "#04140a",
     "linear-gradient(90deg,#440154 0%,#3b528b 24%,#21918c 48%,#5ec962 72%,#fde725 100%)"],
    ["peis", "Palette: Eis (dunkel->weiss)", "#01050c", "#041020", "#08182c", "#6fd8ff", "#e6f6ff", "#001a2e",
     "linear-gradient(90deg,#00060f 0%,#00264d 24%,#005f9e 48%,#12a7d8 68%,#8fe4f5 86%,#ffffff 100%)"],
    ["pamber", "Palette: Amber (dunkel->gold)", "#0a0700", "#150e03", "#201406", "#ffb845", "#fff0d0", "#1a1000",
     "linear-gradient(90deg,#0a0700 0%,#3d2600 24%,#8a5200 48%,#d98a00 70%,#ffc23d 86%,#fff0c9 100%)"],
  ];
  PALETTES.forEach(function(p){
    PRESETS[p[0]] = { name: p[1], bg: p[2], panel: p[3], btn: p[4], accent: p[5], text: p[6], btntext: p[7], radius: 6, glow: 6, fx: 40, pal: p[8] };
  });
  /* ---- Paletten-Creator: eigene Farbverlaeufe (dunkel -> hell) ---- */
  var PAL_KEY = "dnx_styler_palettes";
  function dnxPalLoad(){
    try{
      var a = JSON.parse(localStorage.getItem(PAL_KEY) || "[]");
      if(a && a.length){ for(var i = 0; i < a.length; i++){ PRESETS[a[i][0]] = a[i][1]; } }
    }catch(e){}
  }
  function dnxPalSave(){
    var a = [];
    for(var k in PRESETS){ if(PRESETS[k].mine){ a.push([k, PRESETS[k]]); } }
    try{ localStorage.setItem(PAL_KEY, JSON.stringify(a)); }catch(e){}
  }
  function dnxPalNeu(c0, c1, c2, nm){
    var key = "me" + Date.now();
    var grad = "linear-gradient(90deg," + c0 + " 0%," + c1 + " 50%," + c2 + " 100%)";
    PRESETS[key] = { name: "Eigene: " + (nm || "Palette"), bg: c0, panel: c1, btn: c0, accent: c2, text: "#ffffff", btntext: c0, radius: 6, glow: 6, fx: 40, pal: grad, mine: 1 };
    dnxPalSave();
    return key;
  }

  /* ---- Effekte fuer die Mode-Pillen FM/WFM/AM/DAB/DIG (Dropdown) ---- */
  var PFX_KEY = "dnx_styler_pillen_fx";
  var PFX = [
    ["keiner", "Pillen: keiner (Standard-Hover)", "", "button"],
    ["puls", "Pillen: Puls (Helligkeit)", "dnxPfPulse 1.6s ease-in-out infinite", "button"],
    ["atmen", "Pillen: Atmen (Deckkraft)", "dnxPfBreathe 3.2s ease-in-out infinite", "button"],
    ["blink", "Pillen: Blinken", "dnxPfBlink .8s steps(2) infinite", "button"],
    ["strobe", "Pillen: Strobe (schnell)", "dnxPfBlink .22s steps(2) infinite", "button"],
    ["flacker", "Pillen: Flackern", "dnxPfFlicker 1.8s steps(6) infinite", "button"],
    ["regenbogen", "Pillen: Regenbogen", "dnxPfHue 6s linear infinite", "button"],
    ["farbe", "Pillen: Farbwechsel schnell", "dnxPfHue 1.5s linear infinite", "button"],
    ["neon", "Pillen: Neon-Glut", "dnxPfGlow 2s ease-in-out infinite", "button"],
    ["laufband", "Pillen: Laufband", "dnxPillShine 1.2s linear infinite", "before"],
    ["ledlauf", "Pillen: LED-Lauf (Schritte)", "dnxPfLed .9s linear infinite", "before"],
    ["zittern", "Pillen: Zittern", "dnxPfShake .18s steps(2) infinite", "button"],
    ["pumpen", "Pillen: Pumpen (Groesse)", "dnxPfPop 1.1s ease-in-out infinite", "button"],
    ["herz", "Pillen: Herzschlag", "dnxPfBeat 1.4s ease-in-out infinite", "button"],
    ["blitz", "Pillen: Blitzlicht", "dnxPfFlash 1.1s linear infinite", "button"]
  ];
  function pfxId(){
    var s = "keiner";
    try{ s = localStorage.getItem(PFX_KEY) || "keiner"; }catch(e){}
    for(var i = 0; i < PFX.length; i++){ if(PFX[i][0] === s) return s; }
    return "keiner";
  }
  function pillFxSync(){
    var de = document.documentElement;
    var id = pfxId(), anim = "none", ziel = "button";
    for(var i = 0; i < PFX.length; i++){ if(PFX[i][0] === id){ anim = PFX[i][2] || "none"; ziel = PFX[i][3] || "button"; } }
    de.style.setProperty("--dnx-pfx", anim);
    de.classList.toggle("dnx-pf", ziel === "button" && anim !== "none");
    de.classList.toggle("dnx-pf-band", id === "laufband");
    de.classList.toggle("dnx-pf-leds", id === "ledlauf");
    dnxPfxSheet();
    dnxPfxHook();
    return id;
  }

  /* ---- v34: Pillen-Effekt wirkt sofort beim Ueberfahren (kein Klick noetig) ---- */
  var PFX_BG_BAND = "linear-gradient(100deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.85) 50%,rgba(255,255,255,0) 100%);background-size:250% 100%;background-position:180% 0;";
  var PFX_BG_LEDS = "repeating-linear-gradient(90deg,rgba(255,255,255,.9) 0 4px,rgba(255,255,255,0) 4px 10px);background-size:40px 100%;";
  function dnxPillSel(){ return "#openwebrx-panel-receiver .openwebrx-demodulator-button"; }
  function dnxPfxAnim(){
    var id = pfxId();
    for(var i = 0; i < PFX.length; i++){ if(PFX[i][0] === id){ return PFX[i][2] || "none"; } }
    return "none";
  }
  function dnxPfxZiel(){
    var id = pfxId();
    for(var i = 0; i < PFX.length; i++){ if(PFX[i][0] === id){ return PFX[i][3] || "button"; } }
    return "button";
  }
  function dnxPfxSheet(){
    var anim = dnxPfxAnim(), sel = dnxPillSel();
    var st = document.getElementById("dnx-pfx-sheet");
    if(!st){
      st = document.createElement("style");
      st.id = "dnx-pfx-sheet";
      (document.head || document.documentElement).appendChild(st);
    }
    var css = "";
    if(anim !== "none"){
      if(dnxPfxZiel() === "button"){
        css = "html.dnx-styled " + sel + ":hover,html.dnx-styled " + sel + ":focus-visible{animation:" + anim + " !important;}";
      } else {
        css = "html.dnx-styled " + sel + ":hover::before,html.dnx-styled " + sel + ":focus-visible::before{content:'';position:absolute;inset:0;pointer-events:none;background:" + ((pfxId() === "ledlauf") ? PFX_BG_LEDS : PFX_BG_BAND) + "animation:" + anim + " !important;}";
      }
    }
    if(st.textContent !== css){ st.textContent = css; }
    return css;
  }
  function dnxPfxHover(e){
    var t = e && e.target;
    var el = (t && t.closest) ? t.closest(dnxPillSel()) : null;
    if(!el) return;
    var anim = dnxPfxAnim();
    if(anim === "none" || dnxPfxZiel() !== "button") return;
    if(el.__dnxPfx === anim) return;
    el.__dnxPfx = anim;
    try{
      el.style.setProperty("animation", "none", "important");
      el.offsetWidth;
      el.style.setProperty("animation", anim, "important");
    }catch(e0){}
  }
  function dnxPfxWeg(e){
    var t = e && e.target;
    var el = (t && t.closest) ? t.closest(dnxPillSel()) : null;
    if(!el) return;
    el.__dnxPfx = "";
    try{ el.style.removeProperty("animation"); }catch(e1){}
  }
  function dnxPfxHook(){
    if(dnxPfxHook.on){ return; }
    dnxPfxHook.on = 1;
    document.addEventListener("pointerover", dnxPfxHover, true);
    document.addEventListener("pointerout", dnxPfxWeg, true);
  }

  /* ---- v34: eigene Einstellung bauen, speichern, fuer alle Besucher sichtbar ---- */
  var SHARE_URL_KEY = "dnx_styler_share_url";
  var SHARE_INTRO_KEY = "dnx_styler_intro_ok";
  var SHARE_AUTH_KEY = "dnx_styler_author";
  var SHARE_PORT = ":8098";
  var shareInfo = { count: 0, users: 0, list: [], st: "" };
  var shareEls = { name: null, author: null, url: null, list: null, state: null, count: null };
  var shareMsg = "";
  var shareT = 0;
  var uiHooks = { sync: null, flash: null };
  var introEls = { box: null, more: null };
  function shareClean(s, n){
    s = String(s === undefined || s === null ? "" : s).replace(/[^A-Za-z0-9 _.,:#()\-]/g, " ").replace(/\s+/g, " ").trim();
    return s.slice(0, n);
  }
  function shareUrlClean(s){
    s = String(s === undefined || s === null ? "" : s).replace(/[^A-Za-z0-9_.:\-\/]/g, "").trim();
    return s.slice(0, 80);
  }
  function shareBase(){
    var s = "";
    try{ s = localStorage.getItem(SHARE_URL_KEY) || ""; }catch(e){}
    if(!s){ s = location.protocol + "//" + location.hostname + SHARE_PORT; }
    s = String(s).replace(/\/+$/, "");
    if(!/^https?:\/\/[A-Za-z0-9_.:\-]+$/.test(s)){ s = location.protocol + "//" + location.hostname + SHARE_PORT; }
    return s;
  }
  function shareAuth(){
    var a = "";
    try{ a = localStorage.getItem(SHARE_AUTH_KEY) || ""; }catch(e){}
    return shareClean(a, 24);
  }
  function shareKeep(t){
    var k = ["name", "preset", "bg", "panel", "accent", "btn", "text", "btntext", "radius", "glow", "fx", "sound", "hover", "pitch", "rh", "pal", "stan", "stf", "staus", "stx", "sty", "mt", "mt_seite", "mt_abstand", "mt_ticks", "mt_schrift", "mt_min", "mt_scroller", "mt_bg", "mt_fg"];
    var o = {}, i, v, n;
    if(!t || typeof t !== "object"){ return o; }
    for(i = 0; i < k.length; i++){
      if(!(k[i] in t)){ continue; }
      v = t[k[i]];
      if(typeof v === "number" && isFinite(v)){
        n = Math.round(v);
        if(k[i] === "radius"){ o[k[i]] = Math.max(0, Math.min(40, n)); }
        else if(k[i] === "glow"){ o[k[i]] = Math.max(0, Math.min(20, n)); }
        else if(k[i] === "pitch"){ o[k[i]] = Math.max(200, Math.min(4000, n)); }
        else if(k[i] === "stx"){ o[k[i]] = Math.max(-4000, Math.min(4000, n)); }
        else if(k[i] === "sty"){ o[k[i]] = Math.max(-3000, Math.min(3000, n)); }
        else if(k[i] === "stan" || k[i] === "stf" || k[i] === "staus"){ o[k[i]] = (n === 1) ? 1 : 0; }
        else if(k[i] === "mt_seite"){ o[k[i]] = (n === 1) ? 1 : 0; }
        else if(k[i] === "mt_abstand"){ o[k[i]] = Math.max(1, Math.min(60, n)); }
        else if(k[i] === "mt_schrift"){ o[k[i]] = Math.max(10, Math.min(18, n)); }
        else if(k[i] === "mt_min"){ o[k[i]] = Math.max(0, Math.min(720, n)); }
        else if(k[i] === "mt" || k[i] === "mt_ticks" || k[i] === "mt_scroller"){ o[k[i]] = (n === 1) ? 1 : 0; }
        else { o[k[i]] = Math.max(0, Math.min(100, n)); }
        continue;
      }
      v = String(v);
      if(k[i] === "name" || k[i] === "preset"){ o[k[i]] = shareClean(v, 28); continue; }
      if(/^#[0-9a-fA-F]{3,8}$/.test(v)){ o[k[i]] = v.toLowerCase(); continue; }
      if(k[i] === "pal" && /^linear-gradient\([0-9a-zA-Z .,%#()\-]{5,400}\)$/.test(v)){ o[k[i]] = v; }
    }
    return o;
  }
  function shareFetch(pfad, opt){
    return fetch(shareBase() + pfad, opt).then(function(r){ return r.json(); });
  }
  function dnxShareText(){
    if(shareInfo.st === "ok"){ return dnxLangTf("cnt", shareInfo.count, shareInfo.users); }
    if(shareInfo.st === "aus"){ return dnxLangT("off"); }
    if(shareInfo.st === "leer"){ return dnxLangT("leer"); }
    return dnxLangT("lade");
  }
  function dnxShareCount(){ if(shareEls.count){ shareEls.count.textContent = dnxShareText(); } }
  function dnxShareStatus(t){ shareMsg = t; if(shareEls.state){ shareEls.state.textContent = "Teilen: " + t; } }
  function dnxShareFill(){
    var s2 = shareEls.list;
    if(!s2){ return; }
    var keep = s2.value;
    while(s2.firstChild){ s2.removeChild(s2.firstChild); }
    var o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = shareInfo.list.length ? ("- " + shareInfo.list.length + " geteilte Einstellung(en): auswaehlen -") : "- noch keine geteilte Einstellung -";
    s2.appendChild(o0);
    for(var i = 0; i < shareInfo.list.length; i++){
      var it = shareInfo.list[i] || {};
      var o = document.createElement("option");
      o.value = String(it.id === undefined ? "" : it.id);
      o.textContent = shareClean(it.name || "Einstellung", 28) + " | " + shareClean(it.author || "unbekannt", 24) + (it.ts ? (" | " + shareClean(it.ts, 16)) : "");
      s2.appendChild(o);
    }
    s2.value = keep ? keep : "";
  }
  function dnxShareApply(id){
    if(!id){ return; }
    var it = null;
    for(var i = 0; i < shareInfo.list.length; i++){ if(String(shareInfo.list[i].id) === String(id)){ it = shareInfo.list[i]; } }
    dnxShareStatus("lade " + shareClean(it ? it.name : "", 20) + " ...");
    shareFetch("/dnx/styler/get?id=" + encodeURIComponent(id), { cache: "no-store" }).then(function(j){
      if(!j || !j.ok || !j.skin){ dnxShareStatus("Einstellung nicht ladbar"); return; }
      var d = shareKeep(j.skin);
      if(!d.accent){ d.accent = PRESETS.dnx.accent; }
      if(!d.bg){ d.bg = PRESETS.dnx.bg; }
      if(!d.panel){ d.panel = PRESETS.dnx.panel; }
      if(!d.btn){ d.btn = PRESETS.dnx.btn; }
      if(!d.text){ d.text = PRESETS.dnx.text; }
      current = ensureDefaults(d);
      save(current);
      apply(current);
      if(uiHooks.sync){ try{ uiHooks.sync(); }catch(e2){} }
      dnxShareStatus("uebernommen: " + shareClean(j.name || "", 28));
      if(uiHooks.flash){ uiHooks.flash("uebernommen: " + shareClean(j.name || "", 28)); }
    }).catch(function(){ dnxShareStatus("Server nicht erreichbar"); });
  }
  function dnxShareSave(){
    var name = shareClean(shareEls.name ? shareEls.name.value : "", 28) || "Mein DNX";
    var autor = shareClean(shareEls.author ? shareEls.author.value : "", 24);
    var base = shareUrlClean(shareEls.url ? shareEls.url.value : "") || shareBase();
    try{
      localStorage.setItem(SHARE_URL_KEY, base);
      localStorage.setItem(SHARE_AUTH_KEY, autor);
    }catch(e){}
    if(shareEls.url){ shareEls.url.value = shareBase(); }
    var d = shareKeep(current);
    d.name = name;
    var opt = { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ name: name, author: autor, skin: d }) };
    dnxShareStatus("speichere auf " + shareBase() + " ...");
    shareFetch("/dnx/styler/save", opt).then(function(j){
      if(j && j.ok){
        shareInfo.count = j.count | 0;
        shareInfo.users = j.users | 0;
        shareInfo.st = "ok";
        if(j.list && j.list.length){ shareInfo.list = j.list; }
        dnxShareCount();
        dnxShareFill();
        dnxShareStatus("gespeichert: " + name);
        if(uiHooks.flash){ uiHooks.flash("auf Server gespeichert: " + name); }
      } else {
        dnxShareStatus("Server hat abgelehnt: " + shareClean((j && j.error) || "unbekannt", 28));
      }
    }).catch(function(){
      dnxShareStatus("Server nicht erreichbar (" + shareBase() + ") - Bauen geht weiter");
    });
  }
  function dnxShareRefresh(cb){
    shareT = Date.now();
    shareFetch("/dnx/styler/state", { cache: "no-store" }).then(function(j){
      if(j && j.ok){
        shareInfo.count = j.count | 0;
        shareInfo.users = j.users | 0;
        shareInfo.list = (j.list || []);
        shareInfo.st = "ok";
        dnxShareCount();
        if(!shareMsg){ dnxShareStatus("bereit"); }
      } else {
        shareInfo.st = "leer";
        shareInfo.list = [];
        dnxShareCount();
        dnxShareStatus("keine Daten vom Server");
      }
      if(cb){ cb(); }
    }).catch(function(){
      shareInfo.st = "aus";
      dnxShareCount();
      dnxShareStatus("Server nicht erreichbar - lokal speichern geht weiter");
      if(cb){ cb(); }
    });
  }
  function dnxShareTick(){
    if(document.hidden || !shareEls.list){ return; }
    var now = Date.now();
    if(now - shareT < 30000){ return; }
    dnxShareRefresh(function(){ dnxShareFill(); });
  }
  /* ---- v35: Intro in allen Sprachen gleichzeitig, Flagge je Sprache ---- */
  var DNX_FLAGS = {
    de: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#000'/><rect y='5.33' width='24' height='5.34' fill='#dd0000'/><rect y='10.67' width='24' height='5.33' fill='#ffce00'/></svg>",
    en: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#012169'/><path d='M0,0 24,16 M24,0 0,16' stroke='#fff' stroke-width='3.2'/><path d='M0,0 24,16 M24,0 0,16' stroke='#C8102E' stroke-width='1.6'/><path d='M12,0 V16 M0,8 H24' stroke='#fff' stroke-width='5.3'/><path d='M12,0 V16 M0,8 H24' stroke='#C8102E' stroke-width='3.2'/></svg>",
    nl: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#ae1c28'/><rect y='5.33' width='24' height='5.34' fill='#fff'/><rect y='10.67' width='24' height='5.33' fill='#21468b'/></svg>",
    ru: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect y='5.33' width='24' height='5.34' fill='#0039a6'/><rect y='10.67' width='24' height='5.33' fill='#d52b1e'/></svg>",
    uk: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='8' fill='#005bbb'/><rect y='8' width='24' height='8' fill='#ffd500'/></svg>",
    es: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#aa151b'/><rect y='4' width='24' height='8' fill='#f1bf00'/></svg>",
    zh: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#de2910'/><path fill='#ffde00' d='M4,1.5 L4.8,3.9 L7.3,3.9 L5.3,5.4 L6,7.8 L4,6.3 L2,7.8 L2.7,5.4 L0.7,3.9 L3.2,3.9 Z'/></svg>",
    ja: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><circle cx='12' cy='8' r='4.5' fill='#bc002d'/></svg>",
    ko: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><circle cx='12' cy='8' r='4.5' fill='#cd2e3a'/><path d='M7.5,8 A4.5,4.5 0 0,0 16.5,8 Z' fill='#0047a0'/></svg>",
    vi: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#da251d'/><path fill='#ffff00' transform='translate(8,3.2)' d='M4,1.5 L4.8,3.9 L7.3,3.9 L5.3,5.4 L6,7.8 L4,6.3 L2,7.8 L2.7,5.4 L0.7,3.9 L3.2,3.9 Z'/></svg>",
    th: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'><rect width='24' height='16' fill='#a51931'/><rect y='2.67' width='24' height='10.66' fill='#f4f5f8'/><rect y='5.33' width='24' height='5.34' fill='#2d2a4a'/></svg>"
  };
  var DNX_I18N = {
    de: { t: "Deutsch – Willkommen beim DNX Styler",
      a: "Jeder Besucher kann hier seine eigene Einstellung bauen und speichern. Bauen: Vorlage waehlen, Farben, Linien-Vorlage und Pillen-Effekt einstellen, dazu die Wasserfall- und Spektrum-Palette und beide einzeln an- oder ausschalten - du siehst alles sofort.",
      b: "Speichern: unten einen Namen eintragen und \"Auf Server speichern\" druecken. Danach sehen alle Besucher dieses OpenWebRX deine Einstellung in der Liste und koennen sie mit einem Klick uebernehmen. Mit Standard fuer alle wird deine Einstellung der Start fuer jeden neuen Besucher.",
      cnt: "Gespeicherte Einstellungen: {n} (von {m} Besuchern)", off: "Gespeicherte Einstellungen: Teilen-Server nicht erreichbar", leer: "Gespeicherte Einstellungen: keine Antwort vom Server", lade: "Gespeicherte Einstellungen: wird geladen ...",
      b1: "Verstanden", b2: "Eigene Einstellung speichern", mehr: "Hinweis: eigene Einstellung bauen und speichern" },
    en: { t: "English – Welcome to the DNX Styler",
      a: "Every visitor can build and save their own setting here. Building: choose a template and adjust colours, line template and pill effect, plus the waterfall and spectrum palette, and switch both on or off separately - you see everything instantly.",
      b: "Saving: enter a name below and press \"Save on server\". All visitors of this OpenWebRX will then see your setting in the list and can apply it with one click. With standard for everyone your setting becomes the start for every new visitor.",
      cnt: "Saved settings: {n} (from {m} visitors)", off: "Saved settings: share server not reachable", leer: "Saved settings: no answer from the server", lade: "Saved settings: loading ...",
      b1: "Understood", b2: "Save my own setting", mehr: "Note: build and save your own setting" },
    nl: { t: "Nederlands – Welkom bij de DNX Styler",
      a: "Elke bezoeker kan hier zijn eigen instelling bouwen en opslaan. Bouwen: kies een sjabloon en stel kleuren, lijnsjabloon en pil-effect in, plus het waterfal- en spectrumpalet, en zet beide apart aan of uit - je ziet alles direct.",
      b: "Opslaan: vul hieronder een naam in en druk op \"Op server opslaan\". Daarna zien alle bezoekers van deze OpenWebRX jouw instelling in de lijst en kunnen die met een klik overnemen. Met standaard voor iedereen wordt jouw instelling het startpunt voor elke nieuwe bezoeker.",
      cnt: "Opgeslagen instellingen: {n} (van {m} bezoekers)", off: "Opgeslagen instellingen: deelserver niet bereikbaar", leer: "Opgeslagen instellingen: geen antwoord van de server", lade: "Opgeslagen instellingen: wordt geladen ...",
      b1: "Begrepen", b2: "Eigen instelling opslaan", mehr: "Let op: bouw en bewaar je eigen instelling" },
    ru: { t: "Русский – Добро пожаловать в DNX Styler",
      a: "Каждый посетитель может собрать здесь свою настройку и сохранить её. Сборка: выберите шаблон, настройте цвета, шаблон линии и эффект кнопок, а также палитру водопада и спектра, и включайте оба отдельно - всё видно сразу.",
      b: "Сохранение: введите ниже имя и нажмите \"Сохранить на сервере\". После этого все посетители этого OpenWebRX увидят вашу настройку в списке и смогут применить её одним щелчком. Кнопка Стандарт для всех делает вашу настройку начальной для каждого нового посетителя.",
      cnt: "Сохранённые настройки: {n} (от {m} посетителей)", off: "Сохранённые настройки: сервер обмена недоступен", leer: "Сохранённые настройки: нет ответа от сервера", lade: "Сохранённые настройки: загружается ...",
      b1: "Понятно", b2: "Сохранить свою настройку", mehr: "Подсказка: собрать и сохранить свою настройку" },
    uk: { t: "Українська – Ласкаво просимо до DNX Styler",
      a: "Кожен відвідувач може створити тут власне налаштування та зберегти його. Створення: виберіть шаблон, налаштуйте кольори, шаблон лінії та ефект кнопок, а також палітру водоспаду й спектра, та вмикайте обидва окремо - усе видно одразу.",
      b: "Збереження: введіть нижче ім'я та натисніть \"Зберегти на сервері\". Після цього всі відвідувачі цього OpenWebRX побачать ваше налаштування у списку й зможуть застосувати його одним кліком. Кнопка Стандарт для всіх робить ваше налаштування стартовим для кожного нового відвідувача.",
      cnt: "Збережені налаштування: {n} (від {m} відвідувачів)", off: "Збережені налаштування: сервер обміну недоступний", leer: "Збережені налаштування: немає відповіді від сервера", lade: "Збережені налаштування: завантажується ...",
      b1: "Зрозуміло", b2: "Зберегти власне налаштування", mehr: "Підказка: створити й зберегти власне налаштування" },
    es: { t: "Español – Bienvenido al DNX Styler",
      a: "Cada visitante puede crear y guardar aquí su propia configuración. Crear: elige una plantilla y ajusta colores, plantilla de línea y efecto de las píldoras, además de la paleta del waterfall y del espectro, y activa o desactiva ambos por separado - lo ves todo al instante.",
      b: "Guardar: escribe un nombre abajo y pulsa \"Guardar en el servidor\". Después, todos los visitantes de este OpenWebRX verán tu ajuste en la lista y podrán aplicarlo con un clic. Con Estándar para todos tu ajuste será el inicio para cada visitante nuevo.",
      cnt: "Ajustes guardados: {n} (de {m} visitantes)", off: "Ajustes guardados: servidor para compartir no accesible", leer: "Ajustes guardados: sin respuesta del servidor", lade: "Ajustes guardados: cargando ...",
      b1: "Entendido", b2: "Guardar mi propio ajuste", mehr: "Aviso: crea y guarda tu propio ajuste" },
    zh: { t: "中文 – 欢迎使用 DNX Styler",
      a: "每位访客都可以在这里创建并保存自己的设置。创建：选择模板，调整颜色、线条模板和按钮效果，还可选择瀑布图与频谱的调色板，并可单独开关两者 - 所有变化立即可见。",
      b: "保存：在下方输入名称，然后点击\"保存到服务器\"。之后本 OpenWebRX 的所有访客都会在列表中看到你的设置，并可以一键应用。点击设为所有人的标准，你的设置就会成为每位新访客的起始画面。",
      cnt: "已保存的设置：{n}（来自 {m} 位访客）", off: "已保存的设置：共享服务器无法访问", leer: "已保存的设置：服务器无响应", lade: "已保存的设置：加载中 ...",
      b1: "明白了", b2: "保存我的设置", mehr: "提示：创建并保存自己的设置" },
    ja: { t: "日本語 – DNX Styler へようこそ",
      a: "ここでは訪問者ご自身が設定を作成して保存できます。作成: テンプレートを選び、色・ラインのテンプレート・ボタン効果に加えて、ウォーターフォールとスペクトラムのパレットを選び、それぞれ個別にオン・オフできます。すぐに反映されます。",
      b: "保存: 下の欄に名前を入力し「サーバーに保存」を押します。その後、この OpenWebRX のすべての訪問者がリストであなたの設定を見て、ワンクリックで適用できます。「全員の標準」であなたの設定が新しい訪問者の開始状態になります。",
      cnt: "保存された設定: {n}（訪問者 {m} 人）", off: "保存された設定: 共有サーバーに接続できません", leer: "保存された設定: サーバーから応答がありません", lade: "保存された設定: 読み込み中 ...",
      b1: "了解しました", b2: "自分の設定を保存", mehr: "ヒント: 自分の設定を作成して保存" },
    ko: { t: "한국어 – DNX Styler에 오신 것을 환영합니다",
      a: "모든 방문자가 여기에서 자신의 설정을 만들고 저장할 수 있습니다. 만들기: 템플릿을 선택하고 색상, 선 템플릿, 버튼 효과와 함께 워터폴과 스펙트럼 팔레트를 고르고, 둘을 각각 켜거나 끌 수 있습니다. 즉시 반영됩니다.",
      b: "저장: 아래에 이름을 입력하고 \"서버에 저장\"을 누르세요. 그러면 이 OpenWebRX의 모든 방문자가 목록에서 당신의 설정을 보고 한 번의 클릭으로 적용할 수 있습니다. 모두의 표준을 누르면 당신의 설정이 모든 새 방문자의 시작 상태가 됩니다.",
      cnt: "저장된 설정: {n} (방문자 {m}명)", off: "저장된 설정: 공유 서버에 연결할 수 없음", leer: "저장된 설정: 서버 응답 없음", lade: "저장된 설정: 불러오는 중 ...",
      b1: "확인", b2: "내 설정 저장", mehr: "안내: 내 설정을 만들어 저장" },
    vi: { t: "Tiếng Việt – Chào mừng đến DNX Styler",
      a: "Mỗi khách truy cập có thể tạo và lưu thiết lập của riêng mình tại đây. Tạo: chọn mẫu, chỉnh màu, mẫu đường kẻ và hiệu ứng nút, cùng bảng màu cho waterfall và phổ, và bật hoặc tắt riêng từng cái - bạn thấy ngay mọi thay đổi.",
      b: "Lưu: nhập tên ở dưới và nhấn \"Lưu lên máy chủ\". Sau đó mọi khách truy cập OpenWebRX này sẽ thấy thiết lập của bạn trong danh sách và có thể áp dụng bằng một cú nhấp. Nhấn Chuẩn cho mọi người để thiết lập của bạn là khởi đầu cho mỗi khách mới.",
      cnt: "Thiết lập đã lưu: {n} (từ {m} khách)", off: "Thiết lập đã lưu: không kết nối được máy chủ chia sẻ", leer: "Thiết lập đã lưu: máy chủ không phản hồi", lade: "Thiết lập đã lưu: đang tải ...",
      b1: "Đã hiểu", b2: "Lưu thiết lập của tôi", mehr: "Lưu ý: tạo và lưu thiết lập riêng" },
    th: { t: "ไทย – ยินดีต้อนรับสู่ DNX Styler",
      a: "ผู้เยี่ยมชมทุกคนสามารถสร้างและบันทึกการตั้งค่าของตนเองได้ที่นี่ การสร้าง: เลือกเทมเพลต ปรับสี เทมเพลตเส้น และเอฟเฟกต์ปุ่ม พร้อมชุดสีของวอเตอร์ฟอลและสเปกตรัม และเปิดหรือปิดแยกกันได้ จะเห็นผลทันที",
      b: "การบันทึก: กรอกชื่อด้านล่างแล้วกด \"บันทึกไปยังเซิร์ฟเวอร์\" จากนั้นผู้เยี่ยมชมทั้งหมดของ OpenWebRX นี้จะเห็นการตั้งค่าของคุณในรายการ และนำไปใช้ได้ในคลิกเดียว กดมาตรฐานสำหรับทุกคน เพื่อให้การตั้งค่าของคุณเป็นค่าเริ่มต้นของผู้เยี่ยมชมใหม่ทุกคน",
      cnt: "การตั้งค่าที่บันทึกไว้: {n} (จากผู้เยี่ยมชม {m} คน)", off: "การตั้งค่าที่บันทึกไว้: เชื่อมต่อเซิร์ฟเวอร์แชร์ไม่ได้", leer: "การตั้งค่าที่บันทึกไว้: ไม่มีการตอบกลับจากเซิร์ฟเวอร์", lade: "การตั้งค่าที่บันทึกไว้: กำลังโหลด ...",
      b1: "เข้าใจแล้ว", b2: "บันทึกการตั้งค่าของฉัน", mehr: "คำแนะนำ: สร้างและบันทึกการตั้งค่าของคุณ" },
  };
  var DNX_LANG_LIST = ["de", "en", "nl", "ru", "uk", "es", "zh", "ja", "ko", "vi", "th"];
  var DNX_LANG_KEY = "dnx_styler_lang";
  var langEls = { row: null, b1: null, b2: null, mehr: null, blocks: {} };
  function dnxLang(){
    var s = "de";
    try{ s = localStorage.getItem(DNX_LANG_KEY) || "de"; }catch(e){}
    return DNX_I18N[s] ? s : "de";
  }
  function dnxLangT(k){
    var x = DNX_I18N[dnxLang()] || DNX_I18N.de;
    var v = x[k];
    if(v === undefined || v === null || v === ""){ v = DNX_I18N.de[k]; }
    return String(v === undefined ? "" : v);
  }
  function dnxLangTf(k, n, m){
    return dnxLangT(k).replace("{n}", String(n)).replace("{m}", String(m));
  }
  function dnxFlagImg(code){
    var i = document.createElement("img");
    i.src = "data:image/svg+xml;utf8," + encodeURIComponent(DNX_FLAGS[code] || "");
    i.alt = code;
    i.title = code.toUpperCase();
    i.style.cssText = "width:20px;height:14px;vertical-align:-2px;border:1px solid rgba(255,255,255,.25);border-radius:2px;";
    return i;
  }
  function dnxLangPaint(){
    var cur = dnxLang(), i, c, b;
    if(langEls.row && langEls.row.__b){
      for(i = 0; i < DNX_LANG_LIST.length; i++){
        c = DNX_LANG_LIST[i];
        b = langEls.row.__b[c];
        if(b){
          b.style.opacity = (c === cur) ? "1" : ".5";
          b.style.boxShadow = (c === cur) ? "0 0 0 1px var(--dnx-accent)" : "none";
        }
      }
    }
    if(langEls.b1){ langEls.b1.textContent = dnxLangT("b1"); }
    if(langEls.b2){ langEls.b2.textContent = dnxLangT("b2"); }
    if(langEls.mehr){ langEls.mehr.textContent = dnxLangT("mehr"); }
    dnxShareCount();
  }
  function dnxLangSet(c){
    if(!DNX_I18N[c]){ return; }
    try{ localStorage.setItem(DNX_LANG_KEY, c); }catch(e){}
    dnxLangPaint();
    var blk = langEls.blocks[c];
    var sc = document.getElementById("dnx-intro-text");
    if(blk && sc){ try{ sc.scrollTop = blk.offsetTop - sc.offsetTop; }catch(e2){} }
  }

  function dnxIntroGesehen(){
    try{ return localStorage.getItem(SHARE_INTRO_KEY) === "1"; }catch(e){ return false; }
  }
  function dnxIntroSet(offen){
    if(!introEls.box){ return; }
    introEls.box.style.display = offen ? "block" : "none";
    introEls.more.style.display = offen ? "none" : "block";
  }
  function dnxIntro(ui){
    var more = document.createElement("button");
    more.id = "dnx-styler-intro-more";
    more.textContent = dnxLangT("mehr");
    more.style.cssText = "display:none;width:100%;text-align:left;margin:0 0 6px;";
    more.onclick = function(){ dnxIntroSet(true); };
    var box = document.createElement("div");
    box.id = "dnx-styler-intro";
    box.style.cssText = "margin:4px 0 8px;padding:8px;border:1px solid var(--dnx-accent-dim);border-radius:var(--dnx-radius);background:rgba(0,0,0,.8);font-size:11px;line-height:15px;";
    var row = document.createElement("div");
    row.id = "dnx-intro-flags";
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:3px;margin:0 0 6px;";
    row.__b = {};
    var i, c, blk;
    for(i = 0; i < DNX_LANG_LIST.length; i++){
      c = DNX_LANG_LIST[i];
      (function(cc){
        var b = document.createElement("button");
        b.id = "dnx-intro-flag-" + cc;
        b.style.cssText = "padding:1px 2px;line-height:0;min-width:0;";
        b.appendChild(dnxFlagImg(cc));
        b.onclick = function(){ dnxLangSet(cc); };
        row.appendChild(b);
        row.__b[cc] = b;
      })(c);
    }
    var sc = document.createElement("div");
    sc.id = "dnx-intro-text";
    sc.style.cssText = "max-height:200px;min-height:96px;overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:3px;padding:5px 6px;";
    for(i = 0; i < DNX_LANG_LIST.length; i++){
      c = DNX_LANG_LIST[i];
      var x = DNX_I18N[c];
      blk = document.createElement("div");
      blk.id = "dnx-intro-" + c;
      blk.style.cssText = "margin:0 0 8px;";
      var h = document.createElement("div");
      h.style.cssText = "font-weight:bold;margin-bottom:2px;";
      h.appendChild(dnxFlagImg(c));
      var hs = document.createElement("span");
      hs.textContent = x.t;
      h.appendChild(hs);
      var p1 = document.createElement("div");
      p1.textContent = x.a;
      var p2 = document.createElement("div");
      p2.textContent = x.b;
      p2.style.color = "#ffe9a8";
      blk.appendChild(h);
      blk.appendChild(p1);
      blk.appendChild(p2);
      sc.appendChild(blk);
      langEls.blocks[c] = blk;
    }
    var c2 = document.createElement("div");
    c2.id = "dnx-intro-count";
    c2.style.cssText = "margin-top:4px;font-weight:bold;";
    c2.textContent = dnxLangT("lade");
    var row2 = document.createElement("div");
    row2.style.cssText = "margin-top:6px;";
    var b1 = document.createElement("button");
    b1.id = "dnx-intro-ok";
    b1.style.marginRight = "4px";
    b1.onclick = function(){ try{ localStorage.setItem(SHARE_INTRO_KEY, "1"); }catch(e){} dnxIntroSet(false); };
    var b2 = document.createElement("button");
    b2.id = "dnx-intro-gosave";
    b2.onclick = function(){ dnxIntroSet(false); if(shareEls.name){ try{ shareEls.name.focus(); }catch(e){} } };
    row2.appendChild(b1);
    row2.appendChild(b2);
    box.appendChild(row);
    box.appendChild(sc);
    box.appendChild(c2);
    box.appendChild(row2);
    ui.appendChild(more);
    ui.appendChild(box);
    introEls.box = box;
    introEls.more = more;
    shareEls.count = c2;
    langEls.row = row;
    langEls.b1 = b1;
    langEls.b2 = b2;
    langEls.mehr = more;
    dnxLangPaint();
    dnxIntroSet(!dnxIntroGesehen());
  }

  var CSS = [
    "html.dnx-styled body{background:var(--dnx-bg) !important;}",
    "html.dnx-styled [id^=\"openwebrx-panel\"],html.dnx-styled .openwebrx-panel{background:var(--dnx-panel) !important;color:var(--dnx-text) !important;}",
    "html.dnx-styled [id^=\"openwebrx-panel\"] h1,html.dnx-styled [id^=\"openwebrx-panel\"] h2,html.dnx-styled [id^=\"openwebrx-panel\"] h3,html.dnx-styled [id^=\"openwebrx-panel\"] label{color:var(--dnx-text) !important;}",
    "html.dnx-styled [id^=\"openwebrx-panel\"] button,html.dnx-styled .openwebrx-panel button{background:var(--dnx-btn) !important;color:var(--dnx-text) !important;border:1px solid var(--dnx-accent-dim) !important;border-radius:var(--dnx-radius) !important;box-shadow:0 0 calc(var(--dnx-glow) * 1px) var(--dnx-accent-soft) !important;}",
    "html.dnx-styled [id^=\"openwebrx-panel\"] input,html.dnx-styled [id^=\"openwebrx-panel\"] select,html.dnx-styled [id^=\"openwebrx-panel\"] textarea{background:var(--dnx-btn) !important;color:var(--dnx-text) !important;border:1px solid var(--dnx-accent-dim) !important;border-radius:var(--dnx-radius) !important;}",
    "html.dnx-styled #openwebrx-panel-receiver .openwebrx-demodulator-button{position:relative;overflow:hidden;background:linear-gradient(180deg,var(--dnx-btn),rgba(0,0,0,.55)) !important;color:var(--dnx-text) !important;border:1px solid var(--dnx-accent-dim) !important;border-radius:999px !important;transition:transform .12s ease,box-shadow .12s ease,filter .12s ease,color .12s ease;}",
    "html.dnx-styled #openwebrx-panel-receiver .openwebrx-demodulator-button::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;background:linear-gradient(100deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.65) 50%,rgba(255,255,255,0) 100%);background-size:250% 100%;background-position:180% 0;}",
    "html.dnx-styled #openwebrx-panel-receiver .openwebrx-demodulator-button:hover{transform:translateY(-2px) scale(1.07);filter:brightness(1.35) saturate(1.15);color:#ffffff !important;box-shadow:0 0 calc(var(--dnx-glow) * 2.4px) var(--dnx-accent),0 2px 6px rgba(0,0,0,.45),inset 0 -2px 4px rgba(0,0,0,.45) !important;}",
    "html.dnx-styled #openwebrx-panel-receiver .openwebrx-demodulator-button:hover::after{opacity:1;animation:dnxPillShine .6s linear infinite;}",
    "html.dnx-styled #openwebrx-panel-receiver .openwebrx-demodulator-button:active{transform:translateY(0) scale(.93);filter:brightness(1.9);box-shadow:0 0 calc(var(--dnx-glow) * 3.2px) var(--dnx-accent) !important;}",
    "html.dnx-styled #openwebrx-panel-receiver .openwebrx-demodulator-button.highlighted{background:linear-gradient(180deg,var(--dnx-accent-hi),var(--dnx-accent)) !important;color:var(--dnx-btntext) !important;border-color:var(--dnx-accent) !important;box-shadow:0 0 calc(var(--dnx-glow) * 1.8px) var(--dnx-accent-soft) !important;}",
    "@keyframes dnxPillShine{0%{background-position:180% 0;}100%{background-position:-80% 0;}}",
    /* v34: der Pillen-Effekt kommt aus dem eigenen Stylesheet dnx-pfx-sheet (sofort beim Ueberfahren) */
    "@keyframes dnxPfPulse{0%,100%{filter:brightness(1);}50%{filter:brightness(1.75);}}",
    "@keyframes dnxPfBreathe{0%,100%{opacity:1;}50%{opacity:.5;}}",
    "@keyframes dnxPfBlink{0%,49%{opacity:1;}50%,100%{opacity:.2;}}",
    "@keyframes dnxPfFlicker{0%{filter:brightness(1);}18%{filter:brightness(1.7);}21%{filter:brightness(.7);}38%{filter:brightness(1.45);}57%{filter:brightness(.85);}72%{filter:brightness(1.75);}100%{filter:brightness(1);}}",
    "@keyframes dnxPfHue{0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(360deg);}}",
    "@keyframes dnxPfGlow{0%,100%{filter:brightness(1.15) drop-shadow(0 0 1px rgba(255,255,255,.35));}50%{filter:brightness(1.5) drop-shadow(0 0 7px rgba(255,255,255,.95));}}",
    "@keyframes dnxPfLed{0%{background-position:0 0;}100%{background-position:40px 0;}}",
    "@keyframes dnxPfShake{0%,100%{transform:translate(0,-2px) scale(1.07);}25%{transform:translate(-1.5px,-2px) scale(1.07);}75%{transform:translate(1.5px,-2px) scale(1.07);}}",
    "@keyframes dnxPfPop{0%,100%{transform:translateY(-2px) scale(1.07);}50%{transform:translateY(-3px) scale(1.16);}}",
    "@keyframes dnxPfBeat{0%,100%{filter:brightness(1.1);}12%{filter:brightness(1.9);}24%{filter:brightness(1.1);}36%{filter:brightness(1.6);}52%{filter:brightness(1.1);}}",
    "@keyframes dnxPfFlash{0%,88%{filter:brightness(1.15);}93%{filter:brightness(2.6);}100%{filter:brightness(1.15);}}",
    "@keyframes dnxStylerPulse{0%,100%{box-shadow:0 0 calc(var(--dnx-glow) * 1px) var(--dnx-accent-soft);}50%{box-shadow:0 0 calc(var(--dnx-glow) * 2.2px) var(--dnx-accent);}}",
    "html.dnx-styled.dnx-smeter #openwebrx-smeter,html.dnx-styled.dnx-smeter .openwebrx-smeter,html.dnx-styled.dnx-smeter #openwebrx-smeter-outer,html.dnx-styled.dnx-smeter #smeter-bar-container{position:relative;background:rgba(0,0,0,.8) !important;border:1px solid var(--dnx-accent-dim) !important;border-radius:calc(var(--dnx-radius) / 2) !important;overflow:hidden;box-shadow:0 0 calc(var(--dnx-glow) * 1px) var(--dnx-accent-soft);}",
    "html.dnx-styled.dnx-smeter #smeter-panel{background:transparent !important;border:0 !important;box-shadow:none !important;border-radius:0 !important;}",
    "html.dnx-styled.dnx-smeter[data-fx=\"1\"] #openwebrx-smeter-outer,html.dnx-styled.dnx-smeter[data-fx=\"1\"] #smeter-bar-container{animation:dnxSmeterGlow calc(3.7s - var(--dnx-fx) * 2.5s) infinite ease-in-out;}",
    "@keyframes dnxSmeterGlow{0%,100%{box-shadow:0 0 calc(var(--dnx-glow) * 0.6px) var(--dnx-accent-soft);}50%{box-shadow:0 0 calc(var(--dnx-glow) * 2.4px) var(--dnx-accent);}}",
    "@keyframes dnxSmeterFlow{0%{background-position:0% 50%;}100%{background-position:-200% 50%;}}",
    "@keyframes dnxSmeterLed{0%{background-position:0 0,0 0;}100%{background-position:8px 0,0 0;}}",
    "@keyframes dnxSmeterNeonPulse{0%,100%{filter:brightness(1) saturate(1);}50%{filter:brightness(1.55) saturate(1.3);}}",
    "@keyframes dnxSmeterHue{0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(360deg);}}",
    "@keyframes dnxSmeterDashes{0%{background-position:0 0;}100%{background-position:-15px 0;}}",
    "@keyframes dnxSmeterLedHue{0%{filter:hue-rotate(0deg) brightness(1);}25%{filter:hue-rotate(90deg) brightness(1.35);}50%{filter:hue-rotate(180deg) brightness(1.15);}75%{filter:hue-rotate(270deg) brightness(1.45);}100%{filter:hue-rotate(360deg) brightness(1);}}",
    "@keyframes dnxSmeterLedBlink{0%,49%{opacity:1;}50%,100%{opacity:.55;}}",
    "@keyframes dnxSmeterNeonBreathe{0%,100%{filter:hue-rotate(0deg) brightness(1.05) saturate(1.15);}50%{filter:hue-rotate(180deg) brightness(1.6) saturate(1.4);}}",
    "@keyframes dnxSmeterWave{0%,100%{filter:brightness(1);}50%{filter:brightness(1.45);}}",
    "@keyframes dnxSmeterBlink{0%,49%{opacity:1;}50%,100%{opacity:.22;}}",
    "@keyframes dnxSmeterPulsW{0%,100%{filter:brightness(1) drop-shadow(0 0 2px rgba(255,255,255,.35));}50%{filter:brightness(1.35) drop-shadow(0 0 9px rgba(255,255,255,.9));}}",
    "@keyframes dnxLineSweep{0%{left:-50%;}100%{left:150%;}}",
    "html.dnx-styled.dnx-smeter #openwebrx-smeter::after,html.dnx-styled.dnx-smeter .openwebrx-smeter::after,html.dnx-styled.dnx-smeter #openwebrx-smeter-outer::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 14px,rgba(0,0,0,.30) 14px 15px);pointer-events:none;}",
    "html.dnx-styled.dnx-smeter #openwebrx-smeter-bar,html.dnx-styled.dnx-smeter #smeter-bar-white,html.dnx-styled.dnx-smeter #smeter-bar-red{position:relative;background-image:linear-gradient(90deg,var(--dnx-accent) 0%,var(--dnx-accent-hi) 45%,#ffd75e 75%,#ff5d5d 100%) !important;background-size:220% 100% !important;box-shadow:0 0 calc(var(--dnx-glow) * 1px) var(--dnx-accent-soft), inset 0 -2px 3px rgba(0,0,0,.35) !important;}",
    "html.dnx-styled.dnx-smeter[data-fx=\"1\"] #openwebrx-smeter-bar,html.dnx-styled.dnx-smeter[data-fx=\"1\"] #smeter-bar-white{animation:dnxSmeterFlow calc(3.1s - var(--dnx-fx) * 2.1s) linear infinite;}",
    ".dnx-smeter-demo-track{position:relative;background:var(--dnx-btn,#101511) !important;border:1px solid var(--dnx-accent-dim,rgba(53,255,131,.45)) !important;border-radius:calc(var(--dnx-radius,8px) / 2) !important;overflow:hidden;box-shadow:0 0 calc(var(--dnx-glow,6) * 1px) var(--dnx-accent-soft,rgba(53,255,131,.35));}",
    ".dnx-smeter-demo-track::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 14px,rgba(0,0,0,.30) 14px 15px);pointer-events:none;}",
    ".dnx-smeter-demo-bar{height:100%;width:30%;border-radius:inherit;background-image:linear-gradient(90deg,var(--dnx-accent,#35ff83) 0%,var(--dnx-accent-hi,#b9ffd6) 45%,#ffd75e 75%,#ff5d5d 100%);background-size:220% 100%;box-shadow:0 0 calc(var(--dnx-glow,6) * 1px) var(--dnx-accent-soft,rgba(53,255,131,.35)), inset 0 -2px 3px rgba(0,0,0,.35);transition:width .35s linear;}",
    "html.dnx-styled[data-fx=\"1\"] .dnx-smeter-demo-bar{animation:dnxSmeterFlow calc(3.1s - var(--dnx-fx) * 2.1s) linear infinite;}",
    "html.dnx-styled[data-fx=\"1\"] .dnx-smeter-demo-track{animation:dnxSmeterGlow calc(3.7s - var(--dnx-fx) * 2.5s) infinite ease-in-out;}",
    "#dnx-styler-ui{position:fixed;right:12px;bottom:12px;z-index:2147482000;width:280px;max-height:80vh;overflow-y:auto;overflow-x:hidden;background:#0f1713;color:#e8f5ec;border:2px solid rgba(50,255,120,.75);border-radius:12px;padding:12px;font:12px/1.4 'Segoe UI',Arial,sans-serif;box-sizing:border-box;}",
    "#dnx-styler-bar{position:sticky !important;top:-12px !important;z-index:9 !important;height:8px;margin:-12px -12px 10px -12px;background:rgba(255,0,0,.92);border-radius:10px 10px 0 0;cursor:move;box-shadow:0 2px 6px rgba(0,0,0,.55);}",
    "#dnx-styler-ui .rh{position:absolute;}",
    "#dnx-styler-ui .rh-e{top:28px;bottom:28px;right:0;width:12px;cursor:ew-resize;background:transparent;}",
    "#dnx-styler-ui .rh-s{left:28px;right:28px;bottom:0;height:12px;cursor:ns-resize;background:transparent;}",
    "#dnx-styler-ui .rh-se{right:2px;bottom:2px;width:22px;height:22px;cursor:nwse-resize;background:transparent;border:0;}",
    "#dnx-styler-ui .rh-nw{left:2px;top:2px;width:22px;height:22px;cursor:nwse-resize;background:transparent;border:0;}",
    "#dnx-styler-ui .rh-ne{right:2px;top:2px;width:22px;height:22px;cursor:nesw-resize;background:transparent;border:0;}",
    "#dnx-styler-ui .rh-sw{left:2px;bottom:2px;width:22px;height:22px;cursor:nesw-resize;background:transparent;border:0;}",
    "html.dnx-rh-hide #dnx-receiver-overlay .dnx-resize-handle,html.dnx-rh-hide #dnx-receiver-overlay .dnx-resize-handle,html.dnx-rh-hide #dnx-receiver-overlay .dnx-rh-w,html.dnx-rh-hide #dnx-receiver-overlay .dnx-rh-e,html.dnx-rh-hide #dnx-receiver-overlay .dnx-rh-nw,html.dnx-rh-hide #dnx-receiver-overlay .dnx-rh-ne,html.dnx-rh-hide #dnx-receiver-overlay .dnx-rh-sw,html.dnx-rh-hide #dnx-receiver-overlay .dnx-rh-se{display:none !important;}",
    "html.dnx-rh-show #dnx-receiver-overlay .dnx-rh-nw{border:0;border-radius:0;}",
    "html.dnx-rh-show #dnx-receiver-overlay .dnx-rh-ne{border:0;border-radius:0;}",
    "html.dnx-rh-show #dnx-receiver-overlay .dnx-rh-sw{border:0;border-radius:0;}",
    "html.dnx-rh-show #dnx-receiver-overlay .dnx-rh-se{border:0;border-radius:0;}",
    "html.dnx-rh-show #dnx-receiver-overlay .dnx-rh-w,html.dnx-rh-show #dnx-receiver-overlay .dnx-rh-e{background:none;}",
    ".dnx-my-corner{position:absolute;width:22px;height:22px;pointer-events:none;z-index:2147483000;}",
    ".dnx-my-corner-nw{left:0;top:0;border:0;background:transparent;}",
    ".dnx-my-corner-ne{right:0;top:0;border:0;background:transparent;}",
    ".dnx-my-corner-sw{left:0;bottom:0;border:0;background:transparent;}",
    ".dnx-my-corner-se{right:0;bottom:0;border:0;background:transparent;}",
    ".dnx-my-corner.dnx-grab:hover{background:rgba(255,255,255,.08);}",
    ".dnx-my-corner-nw.dnx-grab,.dnx-my-corner-se.dnx-grab{cursor:nwse-resize;pointer-events:auto;}",
    ".dnx-my-corner-ne.dnx-grab,.dnx-my-corner-sw.dnx-grab{cursor:nesw-resize;pointer-events:auto;}",
    ".dnx-corner-frame{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483647;display:none;}",
    ".dnx-corner-frame .dnx-my-corner{display:block;}",
    "#dnx-styler-ui h4{margin:0 0 8px;font-size:13px;color:#35ff83;}",
    "#dnx-styler-ui label{display:block;margin:6px 0 2px;color:#9fb8a8;font-size:11px;}",
    "#dnx-styler-ui select,#dnx-styler-ui input[type=color]{width:100%;height:26px;border-radius:4px;border:1px solid #356;background:#12201a;color:#e8f5ec;padding:2px;box-sizing:border-box;}",
    "#dnx-styler-ui input[type=range]{width:100%;}",
    "#dnx-styler-ui .row{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}",
    "#dnx-styler-ui .dnx-grp{margin:14px 0 4px;padding:5px 9px;border-radius:7px;background:rgba(53,255,131,.14);border-left:4px solid var(--dnx-accent,#35ff83);font-size:13px;font-weight:700;color:#fff;letter-spacing:.2px;}",
    "#dnx-styler-ui .dnx-feld{margin:7px 0 0;padding:6px 9px 4px;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:rgba(0,0,0,.24);}",
    "#dnx-styler-ui .dnx-feld-kopf{display:flex;align-items:center;justify-content:space-between;gap:10px;}",
    "#dnx-styler-ui .dnx-feld-name{font-size:13.5px;font-weight:700;color:#fff;}",
    "#dnx-styler-ui .dnx-feld-hilfe{font-size:11.5px;line-height:1.35;color:#a9c4b5;margin:1px 0 5px;}",
    "#dnx-styler-ui .dnx-feld input[type=range]{width:100%;margin:0;}",
    "#dnx-styler-ui .row button{flex:1;padding:5px 6px;border-radius:6px;border:1px solid #35ff83;background:#14261b;color:#e8f5ec;cursor:pointer;font-weight:700;}",
    "#dnx-styler-ui .val{float:right;color:#b9efff;}",
    "#dnx-styler-ui .head{display:flex;align-items:center;gap:6px;}",
    "#dnx-styler-ui .head h4{flex:1 1 auto;margin:0;}",
    "#dnx-styler-close{flex:none;width:26px;height:22px;padding:0;border-radius:6px;border:1px solid #35ff83;background:#14261b;color:#e8f5ec;font:700 12px/1 'Segoe UI',Arial,sans-serif;cursor:pointer;}",
    "#dnx-styler-close:hover{background:#1d3a29;color:#ffffff;}",
    "#dnx-styler-launch{width:100%;min-height:32px;padding:6px 10px;font:700 13px/1.2 'Segoe UI',Arial,sans-serif;box-sizing:border-box;}",
    /* ---- v45: Scrollbalken wie im Besucher-Fenster ---- */
    "html.dnx-styled,html.dnx-styled body,html.dnx-styled *{scrollbar-color:var(--dnx-accent) var(--dnx-bg,#0b0f12);}",
    "html.dnx-styled *::-webkit-scrollbar{width:14px;height:14px;}",
    "html.dnx-styled *::-webkit-scrollbar-track{background:var(--dnx-bg,#0b0f12);border-radius:8px;}",
    "html.dnx-styled *::-webkit-scrollbar-thumb{background:var(--dnx-accent);border:3px solid var(--dnx-bg,#0b0f12);border-radius:8px;}",
    "html.dnx-styled *::-webkit-scrollbar-thumb:hover{background:var(--dnx-accent-hi);}",
    "html.dnx-styled *::-webkit-scrollbar-corner{background:var(--dnx-bg,#0b0f12);}",
    "/* ---- v47: rote Ziehlinie direkt unter dem Spektrum ---- */",
    "body.dnx-fft-an:not(.dnx-wf-aus) .openwebrx-spectrum-container{position:relative !important;}",
    "body.dnx-fft-an.dnx-fft-h:not(.dnx-wf-aus) .openwebrx-spectrum-container{transition:none !important;}",
    "body.dnx-fft-an.dnx-fft-h:not(.dnx-wf-aus) .openwebrx-spectrum-container.expanded{height:var(--dnx-fft-h,50px) !important;max-height:var(--dnx-fft-h,50px) !important;min-height:24px !important;overflow:hidden !important;}",
    "/* ---- v48/v49: eine Linie, 3 px, an der Stelle der bekannten Linie ---- */",
    "body.dnx-fft-la #openwebrx-frequency-container{border-bottom-color:transparent !important;box-shadow:none !important;}",
    "body.dnx-fft-la #openwebrx-frequency-container:hover{border-bottom-color:transparent !important;box-shadow:none !important;}",
    "body.dnx-fft-la .openwebrx-spectrum-container.expanded{border-bottom-color:transparent !important;}",
    "body.dnx-fft-la #openwebrx-scale-container{flex:0 0 auto !important;height:47px !important;min-height:47px !important;max-height:47px !important;}",
    "body.dnx-fft-la #openwebrx-frequency-container{background-size:auto 100% !important;min-height:min-content !important;height:auto !important;}",,
    "/* ---- v50: zweite Linie - oberer Abschnitt verschieben ---- */",
    "#dnx-top-line{position:absolute;left:0;right:0;top:-3px;height:3px;cursor:ns-resize;touch-action:none;z-index:1005;background:#ff2020;box-shadow:0 0 5px rgba(255,0,0,.85),0 0 10px rgba(255,0,0,.35);}",
    "#dnx-top-line::after{content:'';position:absolute;left:0;right:0;top:-7px;bottom:-6px;}",
    "#dnx-top-line:hover{background:#ff5a5a;box-shadow:0 0 7px rgba(255,0,0,1),0 0 14px rgba(255,0,0,.65);}",
    "body.dnx-top-h .webrx-top-container{height:var(--dnx-top-h) !important;min-height:0 !important;max-height:none !important;overflow:hidden !important;}",
    "body.dnx-top-h .openwebrx-waterfall-container{transition:none !important;min-height:0 !important;}",
    "/* ---- v51: Status-Leiste unten links (Pillen) ---- */",
    "html.dnx-styled.dnx-st-an #openwebrx-panel-status{position:relative !important;left:var(--dnx-st-x,0px) !important;bottom:var(--dnx-st-y,0px) !important;z-index:2100 !important;}",
    "html.dnx-styled.dnx-st-an .openwebrx-progressbar{background-color:var(--dnx-st-pill,#003850) !important;color:var(--dnx-st-text,#e8f5ec) !important;}",
    "html.dnx-styled.dnx-st-an .openwebrx-progressbar-bar{background-color:var(--dnx-st-bar,#00aba6) !important;}",
    "html.dnx-styled.dnx-st-an .openwebrx-progressbar--over .openwebrx-progressbar-bar{background-color:var(--dnx-st-over,#ff6262) !important;}",
    "html.dnx-styled.dnx-st-an.dnx-st-farb .openwebrx-progressbar{text-shadow:none !important;}",
    "html.dnx-styled.dnx-st-an.dnx-st-aus #openwebrx-panel-status{display:none !important;}",
    "/* ---- v52: Schrift groesser + strahlend weiss ---- */",
    "#dnx-styler-ui{width:330px;font:15px/1.5 'Segoe UI',Arial,sans-serif;color:#ffffff;text-shadow:0 0 7px rgba(255,255,255,.55),0 0 16px rgba(255,255,255,.22);}",
    "#dnx-styler-ui h4,#dnx-styler-ui .head h4{font-size:17px;color:#ffffff;text-shadow:0 0 8px rgba(255,255,255,.7),0 0 18px rgba(255,255,255,.3);}",
    "#dnx-styler-ui label{font-size:14px;color:#ffffff;}",
    "#dnx-styler-ui .val{font-size:15px;font-weight:700;color:#ffffff;text-shadow:0 0 8px rgba(255,255,255,.85),0 0 18px rgba(255,255,255,.35);}",
    "#dnx-styler-ui select,#dnx-styler-ui input[type=color]{height:30px;font-size:14px;color:#ffffff;}",
    "#dnx-styler-ui .row button{font-size:14px;color:#ffffff;}",
    "#dnx-styler-ui .dnx-an-row{font-size:14px;color:#ffffff;}",
    "#dnx-styler-ui .dnx-an-txt{font-size:13px;color:#ffffff;}",
    "#dnx-fft-line{position:absolute;left:0;right:0;bottom:-3px;height:3px;cursor:ns-resize;touch-action:none;z-index:70;background:#ff2020;box-shadow:0 0 5px rgba(255,0,0,.85),0 0 10px rgba(255,0,0,.35);}",
    "#dnx-fft-line::after{content:'';position:absolute;left:0;right:0;top:-6px;bottom:-5px;}",
    "#dnx-fft-line:hover{background:#ff5a5a;box-shadow:0 0 7px rgba(255,0,0,1),0 0 14px rgba(255,0,0,.65);}"
  ].join("\n");

  function hexToRgb(h){
    h = String(h || "").replace("#", "");
    if(h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if(!Number.isFinite(n)) return [53, 255, 131];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(c, t, p){
    return [0, 1, 2].map(function(i){ return Math.round(c[i] + (t[i] - c[i]) * p); });
  }
  function rgb(c){ return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; }
  function rgba(c, a){ return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  function vars(t){
    var a = hexToRgb(t.accent);
    return {
      "--dnx-bg": t.bg,
      "--dnx-panel": t.panel,
      "--dnx-accent": t.accent,
      "--dnx-accent-hi": rgb(mix(a, [255, 255, 255], 0.35)),
      "--dnx-accent-dim": rgba(a, 0.55),
      "--dnx-accent-soft": rgba(a, 0.35),
      "--dnx-btn": t.btn,
      "--dnx-btntext": t.btntext || t.bg,
      "--dnx-text": t.text,
      "--dnx-radius": (t.radius | 0) + "px",
      "--dnx-glow": String(t.glow | 0),
      "--dnx-fx": String((t.fx | 0) / 100),
      "--dnx-hover": String((t.hover === undefined ? 60 : (t.hover | 0)) / 100),
      "--dnx-st-x": ((t.stx === undefined ? 0 : (t.stx | 0))) + "px",
      "--dnx-st-y": ((t.sty === undefined ? 0 : (t.sty | 0))) + "px",
      "--dnx-st-pill": (t.stf ? (t.panel || "#003850") : "#003850"),
      "--dnx-st-text": (t.stf ? (t.text || "#e8f5ec") : "#e8f5ec"),
      "--dnx-st-bar": (t.stf ? (t.accent || "#00aba6") : "#00aba6"),
      "--dnx-st-over": (t.stf ? "#ff6262" : "#ff6262"),
      "--dnx-pal": t.pal || "linear-gradient(90deg,#000208 0%,#001a5e 18%,#0049d8 34%,#00b7ff 48%,#00e08a 60%,#54ff2e 72%,#ffe14d 84%,#ff7a1a 92%,#ffffff 100%)"
    };
  }

  function apply(t){
    var root = document.documentElement;
    var v = vars(t);
    for(var k in v){ root.style.setProperty(k, v[k]); }
    root.classList.add("dnx-styled");
    if((t.fx | 0) > 0){ root.setAttribute("data-fx", "1"); } else { root.removeAttribute("data-fx"); }
    var hv = (t.hover === undefined ? 60 : (t.hover | 0));
    if(hv > 0){ root.setAttribute("data-hover", "1"); } else { root.removeAttribute("data-hover"); }
    if((t.rh === undefined ? 1 : (t.rh | 0)) === 0){ root.classList.add("dnx-rh-hide"); root.classList.remove("dnx-rh-show"); } else { root.classList.remove("dnx-rh-hide"); root.classList.add("dnx-rh-show"); }
    /* v51: Status-Leiste unten links */
    var stAn = (t.stan === undefined ? 0 : (t.stan | 0)) === 1;
    if(stAn){ root.classList.add("dnx-st-an"); } else { root.classList.remove("dnx-st-an"); }
    if(stAn && (t.stf === undefined ? 0 : (t.stf | 0)) === 1){ root.classList.add("dnx-st-farb"); } else { root.classList.remove("dnx-st-farb"); }
    if(stAn && (t.staus === undefined ? 0 : (t.staus | 0)) === 1){ root.classList.add("dnx-st-aus"); } else { root.classList.remove("dnx-st-aus"); }
    ensureReceiverCorners();
    attachSmeterObserver();
    smeterVCache = null;
    smeterTheme();
    try{ dnxZeitAnwenden(t); }catch(e){}
  }
  function reset(){
    var root = document.documentElement;
    var v = vars(PRESETS.dnx);
    for(var k in v){ root.style.removeProperty(k); }
    root.classList.remove("dnx-styled");
    root.removeAttribute("data-fx");
    root.removeAttribute("data-hover");
    root.classList.remove("dnx-rh-hide");
    root.classList.remove("dnx-rh-show");
    root.classList.remove("dnx-st-an");
    root.classList.remove("dnx-st-farb");
    root.classList.remove("dnx-st-aus");
    smeterVCache = null;
    smeterTheme();
    ensureReceiverCorners();
    try { localStorage.removeItem(KEY); } catch(e){}
    dnxFftHReset();
    dnxTopHReset();
    try{ dnxZeitAus(); }catch(e){}
  }
  function save(t){
    try { localStorage.setItem(KEY, JSON.stringify(t)); } catch(e){}
  }
  function load(){
    try {
      var raw = localStorage.getItem(KEY);
      if(raw){ return JSON.parse(raw); }
    } catch(e){}
    return null;
  }

  /* Klick-Toene (WebAudio, Lautstaerke ueber Regler "Sound") */
  var AC = null;
  function actx(){
    if(!AC){
      try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ AC = null; }
    }
    if(AC && AC.state === "suspended"){ AC.resume(); }
    return AC;
  }
  function beep(f, d, v){
    var c = actx();
    if(!c || v <= 0) return;
    try {
      var o = c.createOscillator(), g = c.createGain();
      o.type = "square"; o.frequency.value = f;
      g.gain.setValueAtTime(v, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + d);
    } catch(e){}
  }
  function clickSound(ev){
    var t = ev.target && ev.target.closest ? ev.target.closest("button") : null;
    if(!t) return;
    if(!t.closest("#openwebrx-panel-receiver") && !t.closest("#dnx-styler-ui")) return;
    var v = (current.sound | 0) / 100 * 0.12;
    if(v <= 0) return;
    beep(t.classList.contains("openwebrx-demodulator-button") ? Math.round((current.pitch | 0) * 1.6) : (current.pitch | 0), 0.06, v);
  }

  function ensureDefaults(t){
    if(t.sound === undefined) t.sound = 60;
    if(t.hover === undefined) t.hover = 60;
    if(t.pitch === undefined) t.pitch = 1200;
    if(t.rh === undefined) t.rh = 1;
    if(t.stan === undefined) t.stan = 0;
    if(t.stf === undefined) t.stf = 0;
    if(t.staus === undefined) t.staus = 0;
    if(t.stx === undefined) t.stx = 0;
    if(t.sty === undefined) t.sty = 0;
    if(t.mt === undefined) t.mt = 0;
    if(t.mt_seite === undefined) t.mt_seite = 1;
    if(t.mt_abstand === undefined) t.mt_abstand = 10;
    if(t.mt_ticks === undefined) t.mt_ticks = 1;
    if(t.mt_schrift === undefined) t.mt_schrift = 12;
    if(t.mt_min === undefined) t.mt_min = 30;
    if(t.mt_scroller === undefined) t.mt_scroller = 1;
    if(t.mt_bg === undefined) t.mt_bg = 78;
    if(t.mt_fg === undefined) t.mt_fg = 100;
    return t;
  }
  dnxPalLoad();
  var current = ensureDefaults(load() || PRESETS.dnx);
  var ui = null;

  function ensureStyle(){
    if(document.getElementById("dnx-styler-style")) return;
    var st = document.createElement("style");
    st.id = "dnx-styler-style";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function field(lbl, wrap, input){
    var l = document.createElement("label");
    l.textContent = lbl;
    wrap.appendChild(l);
    wrap.appendChild(input);
    return input;
  }

  /* Fenster-Chrome: rote Griff-Leiste (verschieben) + Resize-Griffe wie im Receiver */
  function makeDraggable(u){
    var bar = document.createElement("div");
    bar.id = "dnx-styler-bar";
    u.insertBefore(bar, u.firstChild);
    function startMove(ev){
      ev.preventDefault();
      var r = u.getBoundingClientRect();
      var dx = ev.clientX - r.left, dy = ev.clientY - r.top;
      u.style.left = r.left + "px"; u.style.top = r.top + "px";
      u.style.right = "auto"; u.style.bottom = "auto";
      function mv(e){
        u.style.left = Math.max(0, e.clientX - dx) + "px";
        u.style.top = Math.max(0, e.clientY - dy) + "px";
        dnxFrameSync();
      }
      function up(){ document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); }
      document.addEventListener("mousemove", mv);
      document.addEventListener("mouseup", up);
    }
    bar.addEventListener("mousedown", startMove);
    function resizeFn(dir){
      return function(r0, e){
        var dx = e.clientX - r0.left, dy = e.clientY - r0.top;
        var out = {};
        if(dir.indexOf("e") !== -1){ out.w = Math.max(240, r0.width + dx); }
        if(dir.indexOf("s") !== -1){ out.h = Math.max(220, r0.height + dy); }
        if(dir.indexOf("w") !== -1){
          var w = Math.max(240, r0.width - dx);
          out.w = w; out.l = r0.left + (r0.width - w);
        }
        if(dir.indexOf("n") !== -1){
          var h2 = Math.max(220, r0.height - dy);
          out.h = h2; out.t = r0.top + (r0.height - h2);
        }
        return out;
      };
    }
    ["e", "s", "se", "ne", "nw", "sw"].forEach(function(dir){
      var h = document.createElement("div");
      h.className = "rh rh-" + dir;
      var fn = resizeFn(dir);
      h.addEventListener("mousedown", function(ev){
        ev.preventDefault();
        var r0 = u.getBoundingClientRect();
        u.style.right = "auto"; u.style.bottom = "auto";
        u.style.maxHeight = "none";
        function mv(e){
          var d = fn(r0, e);
          if(d.l !== undefined) u.style.left = d.l + "px";
          if(d.t !== undefined) u.style.top = d.t + "px";
          if(d.w !== undefined) u.style.width = d.w + "px";
          if(d.h !== undefined) u.style.height = d.h + "px";
          dnxFrameSync();
        }
        function up(){ document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); }
        document.addEventListener("mousemove", mv);
        document.addEventListener("mouseup", up);
      });
      u.appendChild(h);
    });
  }

  /* ---- v38: Wasserfall-Palette und Spektrum-Farbe (nur im Browser, keine Core-Aenderung) ----
     Der Wasserfall wird im Browser gefaerbt (Waterfall.setTheme + chroma), die Palette
     haengt an UI.setWfTheme(Id) und liegt in localStorage -> pro Besucher.
     Das Spektrum malt auf #openwebrx-spectrum-canvas; wir faerben nur die Original-
     Fuellung (255,255,255,0.4) um, andere Farben bleiben unangetastet. */
  var WF_KEY = "dnx_styler_wf";
  var FFT_KEY = "dnx_styler_fft";
  var DNX_WF = {
    dnxklassik: [0x000000, 0x00a010, 0x7fe000, 0xd8ee00, 0xffab00, 0xff2200, 0xffffff],
    dnxgruen:   [0x000000, 0x04140a, 0x0a3d18, 0x1a7a2c, 0x35ff83, 0xd7ffe9, 0xffffff],
    dnxblau:    [0x000000, 0x001b3d, 0x0057a3, 0x00a0e0, 0x7fe3ff, 0xffffff],
    dnxfeuer:   [0x000000, 0x2b0000, 0x7a0a00, 0xd32f00, 0xffb000, 0xffff9e, 0xffffff],
    dnxsmaragd: [0x000000, 0x002b2b, 0x007f7f, 0x00d6a3, 0xa8ffcf, 0xffffff],
    dnxneon:    [0x000000, 0x120033, 0x5a00b3, 0xd000ff, 0xff7be8, 0xffffff],
    dnxmono:    [0x000000, 0x222222, 0x555555, 0x999999, 0xffffff],
    dnxwarm:    [0x000000, 0x1a1410, 0x4a3524, 0x8a6a3a, 0xd8b06a, 0xfff0c8, 0xffffff]
  };
  var DNX_WF_ORIG = [
    ["default", "Standard (Server-Einstellung)"],
    ["turbo", "Turbo (Original)"],
    ["ha7ilm", "Legacy HA7ILM (Original)"],
    ["teejeez", "TeeJeez (Original)"],
    ["ocean", "Blue Ocean (Original)"],
    ["eclipse", "Eclipse (Original)"],
    ["wave", "Evening Wave (Original)"]
  ];
  var DNX_WF_DNX = [
    ["dnxklassik", "DNX Klassik (LED gruen bis rot)"],
    ["dnxgruen", "DNX Gruen"],
    ["dnxblau", "DNX Blau"],
    ["dnxfeuer", "DNX Feuer"],
    ["dnxsmaragd", "DNX Smaragd"],
    ["dnxneon", "DNX Neon"],
    ["dnxmono", "DNX Mono hell"],
    ["dnxwarm", "DNX Warm"]
  ];
  var DNX_FFT = [
    ["original", "Original (weiss, Server)"],
    ["weiss", "rgba(255,255,255,.62)"],
    ["gruen", "rgba(70,255,120,.55)"],
    ["gelb", "rgba(255,228,60,.62)"],
    ["cyan", "rgba(70,220,255,.55)"],
    ["orange", "rgba(255,168,60,.62)"],
    ["magenta", "rgba(255,90,220,.55)"],
    ["rot", "rgba(255,70,70,.62)"]
  ];
  var DNX_FFT_ALT = "rgba(255, 255, 255, 0.4)";
  /* v3.65: Spektrum-Fuellfarbe je Palette (sonst wird die Farbe bei 80% genommen).
     "2511": Nutzer-Bilder zeigen unter der weissen Kurve ein ruhiges Blauviolett
     (~#3f4375) - hier so gesetzt, dass es auf dunklem Grund genau so wirkt. */
  var DNX_FFT_PAL = { "2511": "rgba(92, 94, 169, 0.62)", "sdrangel": "rgba(194, 194, 0, 0.55)" };
  /* v3.69: Grund hinter dem Spektrum. Das Spektrum wird transparent gezeichnet,
     sichtbar ist der graue Behaelter (#444444). Bei einer Palette legen wir den
     Grund passend dunkel - 2511 genau wie in der SDRuno-Vorlage (#11252f). */
  var DNX_FFT_BG = { "2511": "#11252f", "sdrangel": "#0b1d1c" };
  var DNX_BG_ID = "dnx-freq-grund";
  function dnxBgSetzen(){
    try{
      var id = String(dnxFftId());
      var farbe = (id.indexOf("pal:") === 0) ? DNX_FFT_BG[id.slice(4)] : "";
      var e = document.getElementById(DNX_BG_ID);
      if(!farbe){ if(e){ e.textContent = ""; } return; }
      if(!e){
        e = document.createElement("style");
        e.id = DNX_BG_ID;
        (document.head || document.documentElement).appendChild(e);
      }
      var css = "#openwebrx-frequency-container{background:" + farbe + " !important;" +
                "background-image:none !important}";
      if(e.textContent !== css){ e.textContent = css; }
    }catch(x){}
  }
  /* v3.67: eingebauter Startwert - Palette "2511" fuer Wasserfall und Spektrum.
     Wirkt bei neuen Besuchern sofort, auch ohne Teilen-Dienst. Eigene Wahl und
     der geteilte Standard ("Standard fuer alle") haben weiter Vorrang. */
  var DNX_WF_STD = "m188_2511";
  var DNX_FFT_STD = "pal:2511";
  var wfEls = { sel: null, fft: null, state: null };
  var fftCtx = null;
  /* ---- v39: Paletten aus dem MultiSDR-Projekt ----
     Quelle: /opt/dnx-multisdr/apps/web/dnx-render-core.js, Objekt PAL (Stuetzpunkte)
     plus PALNAMES (Namen). Die Tabelle steht hier als Stuetzpunkt-Liste; die
     256 Farben werden beim Anmelden daraus gemischt (wie Waterfall.setTheme es
     mit chroma.scale(colors) macht). Keine Core-Datei wird angefasst. */
  var DNX_MSDR_TAB = [
    /* v3.65: "2511" - echte Palette aus /opt/dnx-multisdr/apps/web/dnx-render-core.js (188), Zeile 213 */
    "2511|2511|0:0,0,0;60:0,0,18;180:0,0,55;300:0,0,180;400:0,65,255;540:210,0,210;660:255,0,35;760:255,80,0;840:255,225,0;900:255,255,255;1000:255,255,255",
    /* v3.68: "1147 SDRangel" - ECHTER SDRangel-Farbcode (GitHub f4exb/sdrangel,
       sdrbase/util/colormap.cpp, Tabelle "Angel", 256 Werte). Vorher standen hier die
       beiden Fehleintraege "1147" und "1147 (sdruno)" mit einer erfundenen Rampe. */
    "sdrangel|1147 SDRangel|0:0,0,15;4:0,1,16;8:0,1,17;12:0,1,18;16:0,2,19;20:0,2,20;24:0,2,21;27:0,3,22;31:0,3,23;35:0,4,24;39:0,5,25;43:0,5,26;47:0,6,27;51:0,7,28;55:0,7,29;59:0,8,30;63:0,9,31;67:0,10,32;71:0,10,33;75:0,11,34;78:0,12,35;82:0,13,36;86:0,14,37;90:0,15,38;94:0,16,39;98:0,17,40;102:0,18,41;106:0,20,42;110:0,21,43;114:0,22,44;118:0,23,45;122:0,25,46;125:0,26,47;129:0,27,48;133:0,29,49;137:0,30,50;141:0,31,51;145:0,33,52;149:0,34,53;153:0,36,54;157:0,38,55;161:0,39,56;165:0,41,57;169:0,43,58;173:0,44,59;176:0,46,60;180:0,48,61;184:0,50,62;188:0,51,63;192:0,53,64;196:0,55,65;200:0,57,66;204:0,59,67;208:0,61,68;212:0,63,69;216:0,65,70;220:0,67,71;224:0,70,72;227:0,72,73;231:0,74,74;235:0,75,74;239:0,76,73;243:0,77,73;247:0,78,73;251:0,79,72;255:0,80,72;259:0,81,72;263:0,82,71;267:0,83,71;271:0,84,70;275:0,85,69;278:0,86,69;282:0,87,68;286:0,88,67;290:0,89,67;294:0,90,66;298:0,91,65;302:0,92,64;306:0,93,64;310:0,94,63;314:0,95,62;318:0,96,61;322:0,97,60;325:0,98,59;329:0,99,58;333:0,100,57;337:0,101,56;341:0,102,54;345:0,103,53;349:0,104,52;353:0,105,51;357:0,106,49;361:0,107,48;365:0,108,47;369:0,109,45;373:0,110,44;376:0,111,43;380:0,112,41;384:0,113,40;388:0,114,38;392:0,115,36;396:0,116,35;400:0,117,33;404:0,118,31;408:0,119,30;412:0,120,28;416:0,121,26;420:0,122,24;424:0,123,23;427:0,124,21;431:0,125,19;435:0,126,17;439:0,127,15;443:0,128,13;447:0,129,11;451:0,130,9;455:0,131,7;459:0,132,4;463:0,133,2;467:0,134,0;471:2,135,0;475:5,136,0;478:7,137,0;482:9,138,0;486:12,139,0;490:14,140,0;494:16,141,0;498:19,142,0;502:21,143,0;506:24,144,0;510:27,145,0;514:29,146,0;518:32,147,0;522:35,148,0;525:37,149,0;529:40,150,0;533:43,151,0;537:46,152,0;541:48,153,0;545:51,154,0;549:54,155,0;553:57,156,0;557:60,157,0;561:63,158,0;565:66,159,0;569:69,160,0;573:72,161,0;576:76,162,0;580:79,163,0;584:82,164,0;588:85,165,0;592:89,166,0;596:92,167,0;600:95,168,0;604:99,169,0;608:102,170,0;612:105,171,0;616:109,172,0;620:112,173,0;624:116,174,0;627:120,175,0;631:123,176,0;635:127,177,0;639:131,178,0;643:134,179,0;647:138,180,0;651:142,181,0;655:146,182,0;659:149,183,0;663:153,184,0;667:157,185,0;671:161,186,0;675:165,187,0;678:169,188,0;682:173,189,0;686:177,190,0;690:181,191,0;694:186,192,0;698:190,193,0;702:194,194,0;706:195,192,0;710:196,189,0;714:197,187,0;718:198,185,0;722:199,182,0;725:200,180,0;729:201,178,0;733:202,175,0;737:203,173,0;741:204,170,0;745:205,167,0;749:206,165,0;753:207,162,0;757:208,159,0;761:209,157,0;765:210,154,0;769:211,151,0;773:212,148,0;776:213,146,0;780:214,143,0;784:215,140,0;788:216,137,0;792:217,134,0;796:218,131,0;800:219,128,0;804:220,125,0;808:221,122,0;812:222,118,0;816:223,115,0;820:224,112,0;824:225,109,0;827:226,105,0;831:227,102,0;835:228,99,0;839:229,95,0;843:230,92,0;847:231,89,0;851:232,85,0;855:233,82,0;859:234,78,0;863:235,74,0;867:236,71,0;871:237,67,0;875:238,63,0;878:239,60,0;882:240,56,0;886:241,52,0;890:242,48,0;894:243,45,0;898:244,41,0;902:245,37,0;906:246,33,0;910:247,29,0;914:248,25,0;918:249,21,0;922:250,17,0;925:251,13,0;929:252,8,0;933:253,4,0;937:254,0,0;941:255,255,255;945:255,255,255;949:255,255,255;953:255,255,255;957:255,255,255;961:255,255,255;965:255,255,255;969:255,255,255;973:255,255,255;976:255,255,255;980:255,255,255;984:255,255,255;988:255,255,255;992:255,255,255;996:255,255,255;1000:255,255,255",
    "asche|Asche|0:2,2,6;260:83,21,121;510:180,57,123;760:249,139,99;1000:249,250,188",
    "aurora|Aurora|0:0,0,0;50:0,0,51;150:0,0,102;400:0,0,255;600:0,255,255;660:255,0,255;1000:255,255,255",
    "bernstein|Bernstein|0:12,6,2;410:117,52,2;760:237,147,22;1000:252,232,177",
    "bernsteinBlau|Bernstein Blau|0:2,34,78;310:54,81,112;610:121,121,117;860:187,172,98;1000:251,229,58",
    "daemmerung|Daemmerung|0:28,17,56;260:84,47,86;510:126,90,112;760:152,153,128;1000:251,251,213",
    "dnx|DNX|0:2,2,17;260:2,2,162;460:2,167,162;660:2,217,2;830:252,217,2;1000:252,252,252",
    "eis|Eis|0:2,2,12;310:2,42,117;560:2,137,207;790:127,217,242;1000:252,252,252",
    "farn|Farn|0:70,4,86;260:61,84,136;510:36,142,137;760:96,198,101;1000:250,228,40",
    "finsternis|Finsternis|0:2,2,2;310:62,22,88;530:147,42,82;730:227,117,42;890:252,207,112;1000:252,252,252",
    "frost|Frost|0:2,2,22;310:2,62,127;590:2,147,207;810:137,217,242;1000:252,252,252",
    "fuchsia|Fuchsia|0:175,29,175;310:173,88,147;610:183,127,122;860:200,173,94;1000:252,252,105",
    "funkwerk|Funkwerk|0:2,2,2;210:2,2,137;410:2,122,177;610:2,197,117;810:252,217,2;1000:252,252,252",
    "fusion|Fusion|0:16,10,132;260:123,6,165;510:201,74,117;760:245,151,66;1000:237,246,36",
    "gletscher|Gletscher|0:46,46,46;310:46,82,143;610:119,142,211;860:193,198,233;1000:254,254,254",
    "glut|Glut|0:2,0,0;340:227,4,0;690:252,217,4;1000:255,254,250",
    "graustufen|Graustufen|0:2,2,2;260:72,72,72;510:126,126,126;760:187,187,187;1000:252,252,252",
    "gruenschirm|Gruenschirm|0:2,10,2;410:2,88,22;760:62,217,62;1000:217,252,197",
    "helix|Helix|0:2,2,2;260:32,72,88;510:107,112,62;760:197,142,147;1000:252,252,252",
    "helixGamma|Helix Gamma|0:2,2,2;260:24,60,78;510:94,104,54;760:193,134,141;1000:252,252,252",
    "helixWeit|Helix Weit|0:2,2,2;230:62,42,107;460:42,127,112;710:167,147,52;890:227,157,187;1000:252,252,252",
    "hochland|Hochland|0:2,2,2;210:2,2,117;410:2,117,197;610:2,197,117;810:227,227,2;1000:252,62,2",
    "kaleidoskop|Kaleidoskop|0:252,2,2;180:252,147,2;340:237,237,2;510:2,197,2;680:2,117,252;840:112,2,217;1000:252,2,2",
    "klassik|Klassik|0:2,2,22;230:2,2,137;430:2,157,187;610:2,207,62;790:237,222,2;910:252,112,2;1000:252,252,252",
    "koralle|Koralle|0:18,2,22;310:107,32,62;590:197,82,72;810:242,157,112;1000:252,237,217",
    "kryo|Kryo|0:4,252,252;500:130,126,252;1000:252,4,252",
    "kupfer|Kupfer|0:2,2,2;510:147,88,57;1000:252,197,147",
    "lagune|Lagune|0:55,44,132;260:18,122,201;510:32,175,161;760:186,190,76;1000:246,248,26",
    "lava|Lava|0:2,2,6;260:89,18,107;510:185,57,86;760:246,144,12;1000:249,252,161",
    "minze|Minze|0:2,22,18;310:2,88,72;590:42,167,127;810:147,217,187;1000:237,252,247",
    "mono|Mono|0:2,2,2;1000:252,252,252",
    "moos|Moos|0:29,54,119;310:54,94,111;610:101,148,82;860:183,198,58;1000:252,252,105",
    "nachtsicht|Nachtsicht|0:2,6,2;360:2,72,12;710:42,187,42;1000:187,252,187",
    "nordsee|Nordsee|0:29,28,117;290:47,86,147;560:94,133,152;790:173,168,124;1000:246,226,212",
    "olive|Olive|0:2,66,74;360:47,84,46;660:107,112,22;890:191,157,29;1000:251,227,113",
    "phosphor|Phosphor|0:2,2,2;260:2,34,94;510:2,157,126;730:189,221,34;910:252,157,2;1000:252,252,252",
    "prisma|Prisma|0:2,2,128;130:0,63,167;380:8,252,252;630:252,252,4;880:246,4,2;1000:125,2,2",
    "purpur|Purpur|0:2,2,2;190:42,2,78;390:127,2,137;590:227,62,88;790:252,167,42;1000:252,252,197",
    "regenbogen|Regenbogen|0:112,2,217;210:2,82,252;410:2,217,197;610:82,227,2;810:252,207,2;1000:252,42,2",
    "sandstein|Sandstein|0:28,28,2;260:84,56,38;510:173,104,68;760:225,163,98;1000:252,251,201",
    "schwarzglut|Schwarzglut|0:252,252,252;510:126,126,126;1000:2,2,2",
    "signalweg|Signalweg|0:2,2,2;310:2,2,252;560:2,252,252;760:252,252,2;1000:252,2,2",
    "sonnenuntergang|Sonnenuntergang|0:12,2,27;260:72,2,88;460:167,22,88;660:237,82,42;860:252,187,62;1000:252,252,217",
    "studio|Studio|0:2,2,34;230:2,66,126;460:2,157,157;660:66,205,66;860:245,229,42;1000:252,98,2",
    "studioBlau|Studio Blau|0:2,2,26;310:2,50,117;610:34,117,197;860:137,197,237;1000:252,252,252",
    "studioFeuer|Studio Feuer|0:10,2,2;290:94,10,2;560:197,58,2;790:247,157,2;1000:252,245,197",
    "studioGrau|Studio Grau|0:10,10,10;510:117,117,117;1000:245,245,245",
    "studioSpektral|Studio Spektral|0:26,2,50;210:2,34,157;430:2,165,165;630:58,197,58;830:237,221,34;1000:252,66,2",
    "tempo|Tempo|0:50,21,61;150:68,110,224;300:44,179,244;440:41,226,160;580:149,252,68;720:246,205,52;870:247,114,28;1000:119,6,6",
    "terra|Terra|0:4,28,86;260:30,84,96;510:94,126,72;760:198,142,82;1000:247,201,246",
    "tiefblau|Tiefblau|0:2,6,22;290:2,52,107;530:2,117,177;730:62,197,217;890:187,237,247;1000:252,252,252",
    "traditionell|Traditionell|0:2,2,52;260:2,2,197;510:2,197,197;710:2,217,2;860:252,252,2;1000:252,2,2",
    "tropic|Tropic|0:137,4,104;260:130,74,137;510:88,121,111;760:124,167,66;1000:246,221,119",
    "violetta|Violetta|0:48,36,74;260:96,86,124;510:155,122,158;760:196,142,173;1000:227,227,227"
  ];
  function dnxMsdrParse(){
    if(dnxMsdrParse.c){ return dnxMsdrParse.c; }
    var c = {}, i, teile, rohSt, stops, j, s2, rgb, n;
    for(i = 0; i < DNX_MSDR_TAB.length; i++){
      teile = String(DNX_MSDR_TAB[i]).split("|");
      if(teile.length < 3){ continue; }
      stops = [];
      rohSt = teile[2].split(";");
      for(j = 0; j < rohSt.length; j++){
        s2 = rohSt[j].split(":");
        if(s2.length !== 2){ continue; }
        rgb = s2[1].split(",");
        n = parseInt(s2[0], 10);
        if(isNaN(n) || rgb.length !== 3){ continue; }
        stops.push([n / 1000, [parseInt(rgb[0], 10) || 0, parseInt(rgb[1], 10) || 0, parseInt(rgb[2], 10) || 0]]);
      }
      if(stops.length >= 2){ c[teile[0]] = { label: teile[1], stops: stops }; }
    }
    dnxMsdrParse.c = c;
    return c;
  }
  function dnxMsdrRgb(stops, n){
    var i, a, b, t;
    if(n < 0){ n = 0; }
    if(n > 1){ n = 1; }
    for(i = 1; i < stops.length; i++){
      if(n <= stops[i][0]){
        a = stops[i - 1];
        b = stops[i];
        t = (n - a[0]) / Math.max(1e-6, b[0] - a[0]);
        return [Math.round(a[1][0] + (b[1][0] - a[1][0]) * t),
                Math.round(a[1][1] + (b[1][1] - a[1][1]) * t),
                Math.round(a[1][2] + (b[1][2] - a[1][2]) * t)];
      }
    }
    return stops[stops.length - 1][1];
  }
  function dnxMsdrCss(rgb){
    function h2(v){ v = Math.max(0, Math.min(255, v | 0)).toString(16); return v.length < 2 ? ("0" + v) : v; }
    return "#" + h2(rgb[0]) + h2(rgb[1]) + h2(rgb[2]);
  }
  function dnxMsdrArr(stops, anzahl){
    var out = [], i, n, c;
    anzahl = Math.max(8, anzahl | 0);
    for(i = 0; i < anzahl; i++){
      n = i / (anzahl - 1);
      c = dnxMsdrRgb(stops, n);
      out.push((c[0] << 16) | (c[1] << 8) | c[2]);
    }
    return out;
  }
  function dnxMsdrList(){
    if(dnxMsdrList.c){ return dnxMsdrList.c; }
    var c = dnxMsdrParse(), out = [], k;
    for(k in c){ if(c.hasOwnProperty(k)){ out.push(["m188_" + k, c[k].label]); } }
    out.sort(function(a, b){
      return a[1].localeCompare(b[1], "de", { numeric: true, sensitivity: "base" });
    });
    dnxMsdrList.c = out;
    return out;
  }
  function dnxMsdrReg(){
    try{
      if(!window.UI || !UI.wfThemes){ return 0; }
      var c = dnxMsdrParse(), k, n = 0;
      for(k in c){
        if(c.hasOwnProperty(k)){
          /* v3.69: 2511 und SDRangel feiner (256 Stufen) - weniger Streifen, naeher an der Vorlage */
          var stufen = (k === "2511" || k === "sdrangel") ? 256 : 64;
          UI.wfThemes["m188_" + k] = dnxMsdrArr(c[k].stops, stufen); n++;
        }
      }
      return n;
    }catch(e){ return 0; }
  }
  function dnxMsdrName(id){
    if(String(id).indexOf("m188_") !== 0){ return ""; }
    var e = dnxMsdrParse()[String(id).slice(5)];
    return e ? ("MultiSDR " + e.label) : "";
  }
  function dnxWfOk(id){
    var i;
    for(i = 0; i < DNX_WF_ORIG.length; i++){ if(DNX_WF_ORIG[i][0] === id){ return true; } }
    for(i = 0; i < DNX_WF_DNX.length; i++){ if(DNX_WF_DNX[i][0] === id){ return true; } }
    if(String(id).indexOf("m188_") === 0){ return !!dnxMsdrParse()[String(id).slice(5)]; }
    return false;
  }
  function dnxWfId(){
    var s = "";
    try{ s = localStorage.getItem(WF_KEY) || ""; }catch(e){}
    if(!s){ return dnxWfOk(DNX_WF_STD) ? DNX_WF_STD : "default"; }
    /* v3.68: geloeschte Palette (z.B. altes "1147") -> eingebauter Startwert statt Grau */
    return dnxWfOk(s) ? s : (dnxWfOk(DNX_WF_STD) ? DNX_WF_STD : "default");
  }
  function dnxWfGespeichert(){
    var s = "";
    try{ s = localStorage.getItem(WF_KEY) || ""; }catch(e){}
    return !!s && dnxWfOk(s);
  }
  function dnxWfName(id){
    var i;
    for(i = 0; i < DNX_WF_ORIG.length; i++){ if(DNX_WF_ORIG[i][0] === id){ return DNX_WF_ORIG[i][1]; } }
    for(i = 0; i < DNX_WF_DNX.length; i++){ if(DNX_WF_DNX[i][0] === id){ return DNX_WF_DNX[i][1]; } }
    var _m = dnxMsdrName(id);
    if(_m){ return _m; }
    return id;
  }
  function dnxWfReg(){
    try{
      if(!window.UI || !UI.wfThemes){ return false; }
      var k;
      for(k in DNX_WF){ if(DNX_WF.hasOwnProperty(k)){ UI.wfThemes[k] = DNX_WF[k]; } }
      dnxMsdrReg();
      var lb = document.getElementById("openwebrx-wf-themes-listbox");
      if(lb && !lb.__dnxOpts){
        lb.__dnxOpts = 1;
        var i, o, liste;
        for(i = 0; i < DNX_WF_DNX.length; i++){
          o = document.createElement("option");
          o.value = DNX_WF_DNX[i][0];
          o.textContent = DNX_WF_DNX[i][1];
          lb.appendChild(o);
        }
        liste = dnxMsdrList();
        for(i = 0; i < liste.length; i++){
          o = document.createElement("option");
          o.value = liste[i][0];
          o.textContent = liste[i][1];
          lb.appendChild(o);
        }
        lb.addEventListener("change", function(){
          try{ localStorage.setItem(WF_KEY, lb.value); }catch(e){}
          if(wfEls.sel){ wfEls.sel.value = dnxWfOk(lb.value) ? lb.value : "default"; }
          dnxWfState();
        });
      }
      return true;
    }catch(e1){ return false; }
  }
  function dnxWfApply(id){
    if(!dnxWfOk(id)){ id = "default"; }
    if(!dnxWfReg()){ dnxWfState(); return false; }
    try{
      UI.setWfTheme(id);
      var lb = document.getElementById("openwebrx-wf-themes-listbox");
      if(lb){ lb.value = id; }
      dnxWfState();
      return true;
    }catch(e2){ dnxWfState(); return false; }
  }
  function dnxFftId(){
    var s = "";
    try{ s = localStorage.getItem(FFT_KEY) || ""; }catch(e){}
    var i;
    if(!s){
      return dnxMsdrParse()[String(DNX_FFT_STD).slice(4)] ? DNX_FFT_STD : "original";
    }
    for(i = 0; i < DNX_FFT.length; i++){ if(DNX_FFT[i][0] === s){ return s; } }
    if(String(s).indexOf("pal:") === 0 && dnxMsdrParse()[String(s).slice(4)]){ return s; }
    /* v3.68: geloeschte Palette -> eingebauter Startwert statt Original-Weiss */
    return dnxMsdrParse()[String(DNX_FFT_STD).slice(4)] ? DNX_FFT_STD : "original";
  }
  function dnxFftName(id){
    var i;
    for(i = 0; i < DNX_FFT.length; i++){ if(DNX_FFT[i][0] === id){ return DNX_FFT[i][1]; } }
    var e = dnxMsdrParse()[String(id).slice(4)];
    if(String(id).indexOf("pal:") === 0 && e){ return "Palette " + e.label; }
    return id;
  }
  function dnxFftFarbe(){
    var id = dnxFftId(), i;
    for(i = 0; i < DNX_FFT.length; i++){ if(DNX_FFT[i][0] === id){ return (id === "original") ? DNX_FFT_ALT : DNX_FFT[i][1]; } }
    var e = dnxMsdrParse()[String(id).slice(4)];
    if(String(id).indexOf("pal:") === 0 && e){
      var sp = DNX_FFT_PAL[String(id).slice(4)];
      if(sp){ return sp; }
      return dnxMsdrCss(dnxMsdrRgb(e.stops, 0.8));
    }
    return DNX_FFT_ALT;
  }
  function dnxFftGrad(c){
    var id = dnxFftId();
    if(String(id).indexOf("pal:") !== 0){ return null; }
    var e = dnxMsdrParse()[String(id).slice(4)];
    if(!e || !c || typeof c.createLinearGradient !== "function"){ return null; }
    var h = (c.canvas && c.canvas.height) ? c.canvas.height : 100;
    if(!h){ h = 100; }
    var gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, dnxMsdrCss(dnxMsdrRgb(e.stops, 1)));
    gr.addColorStop(0.5, dnxMsdrCss(dnxMsdrRgb(e.stops, 0.55)));
    gr.addColorStop(1, dnxMsdrCss(dnxMsdrRgb(e.stops, 0.05)));
    return gr;
  }
  function dnxFftZiel(c){
    /* v3.66: NUR fuer Paletten mit eigener Spektrum-Farbe (2511) hat diese Vorrang
       vor dem Verlauf - alle anderen Paletten bleiben unveraendert. */
    var _f = dnxFftFarbe(), _id = String(dnxFftId()).slice(4);
    if(DNX_FFT_PAL[_id] && _f){ return _f; }
    var g = dnxFftGrad(c);
    if(g){ return g; }
    return _f || DNX_FFT_ALT;
  }
  function dnxFftInstall(){
    var c = null;
    try{ c = (window.spectrum && spectrum.ctx) ? spectrum.ctx : null; }catch(e){}
    if(!c){ return false; }
    if(fftCtx === c && c.__dnxFillHook){ return true; }
    var d = null;
    try{ d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(c), "fillStyle"); }catch(e2){}
    if(!d || !d.set){ return false; }
    try{
      Object.defineProperty(c, "fillStyle", {
        configurable: true,
        get: function(){ return c.__dnxFillRoh; },
        set: function(v){
          c.__dnxFillRoh = v;
          var roh = String(v).replace(/[ \t]/g, "");
          var ziel = v;
          if(dnxFftId() !== "original" && roh === "rgba(255,255,255,0.4)"){
            ziel = dnxFftZiel(c);
          }
          try{ d.set.call(c, ziel); }catch(e3){}
        }
      });
      c.__dnxFillHook = 1;
      fftCtx = c;
    }catch(e4){ return false; }
    return true;
  }
  function dnxFftSetze(){
    if(!fftCtx || !fftCtx.__dnxFillHook){ return false; }
    try{ fftCtx.fillStyle = fftCtx.__dnxFillRoh || DNX_FFT_ALT; }catch(e){ return false; }
    return true;
  }
  function dnxFftApply(){
    dnxBgSetzen();
    if(!dnxFftInstall()){ dnxWfState(); return false; }
    dnxFftSetze();
    dnxWfState();
    return true;
  }
  function dnxWfState(){
    if(!wfEls.state){ return; }
    var txt;
    if(!window.UI || !UI.wfThemes){
      txt = "Wasserfall/Spektrum: hier nicht verfuegbar - Original bleibt";
    } else {
      var fftId = dnxFftId();
      txt = "Wasserfall: " + dnxWfName(dnxWfId()) + " | Spektrum: " + dnxFftName(fftId);
    }
    if(wfEls.state.textContent !== txt){ wfEls.state.textContent = txt; }
  }
  /* v3.70: Wache - zieht Spektrumfarbe und dunklen Grund nach, bis beides sitzt.
     Grund: das Spektrum setzt seine Fuellfarbe nur beim Groessenwechsel; kommt unser
     Haken danach, blieb die Fuellung weiss (genau das war beim Nutzer zu sehen). */
  function dnxFftWache(){
    try{
      if(!dnxFftInstall.on){
        dnxFftInstall.on = 1;
        var schnell = 0;
        setInterval(function(){
          schnell++;
          try{
            dnxBgSetzen();
            if(!fftCtx || !fftCtx.__dnxFillHook){ dnxFftInstall(); }
            if(fftCtx && fftCtx.__dnxFillHook && !fftCtx.__dnxSitzt){
              dnxFftSetze();
              fftCtx.__dnxSitzt = 1;
            }
          }catch(e){}
          if(schnell === 57 && !(fftCtx && fftCtx.__dnxFillHook)){ dnxFftSetze(); }
        }, (schnell < 60) ? 700 : 5000);
      }
    }catch(e){}
  }

  function dnxWfReset(){
    try{
      localStorage.setItem(WF_KEY, "default");
      localStorage.setItem(FFT_KEY, "original");
      localStorage.setItem(WF_ON_KEY, "an");
    }catch(e){}
    dnxAnKlasse();
    dnxFftAnSetze(false);
    if(wfEls.sel){ wfEls.sel.value = "default"; }
    if(wfEls.fft){ wfEls.fft.value = "original"; }
    dnxWfApply("default");
    dnxFftApply();
  }
  function dnxWfTick(){
    dnxWfReg();
    dnxAnTick();
    if(window.spectrum && spectrum.ctx && dnxFftId() !== "original"){ dnxFftInstall(); }
    dnxWfState();
  }
  function dnxWfBoot(){
    dnxWfReg();
    dnxAnBoot();
    if(dnxWfGespeichert()){ dnxWfApply(dnxWfId()); }
    if(dnxFftId() !== "original"){ dnxFftApply(); }
    dnxWfState();
  }
  /* ---- v40: Schalter fuer Wasserfall und Spektrum (nur im Browser) ----
     Wasserfall aus  -> Body-Klasse dnx-wf-aus; das eigene Stylesheet dnx-an-sheet
     blendet nur die Wasserfall-Zeichenflaechen aus (Frequenzleiste, Buchungen und
     Bedienfelder bleiben, wo sie sind). Spektrum an/aus -> ruft das Original
     UI.toggleSpectrum(on); der Zustand liegt wie beim Original-Knopf in
     ui_spectrum, damit unser Schalter und der Original-Knopf synchron bleiben.
     Keine Core-Datei wird angefasst. */
  var WF_ON_KEY = "dnx_styler_wf_an";
  var AN_CSS = [
    "body.dnx-wf-aus #webrx-canvas-container{opacity:0 !important;}",
    "body.dnx-wf-aus #webrx-canvas-background{background-image:none !important;background-color:var(--dnx-bg,#0b0f12) !important;}",
    "#dnx-styler-ui .dnx-an-row{display:flex;align-items:center;gap:6px;margin:3px 0;font-size:12px;}",
    "#dnx-styler-ui input.dnx-an{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;}",
    "#dnx-styler-ui .dnx-an-sw{display:inline-block;width:34px;height:16px;border-radius:9px;background:#39414a;border:1px solid rgba(255,255,255,.28);position:relative;transition:background .15s;flex:0 0 auto;}",
    "#dnx-styler-ui .dnx-an-sw i{position:absolute;top:1px;left:1px;width:12px;height:12px;border-radius:50%;background:#dfe7ea;transition:left .15s;}",
    "#dnx-styler-ui input.dnx-an:checked + .dnx-an-sw{background:#2fbf6b;border-color:#5fe89f;}",
    "#dnx-styler-ui input.dnx-an:checked + .dnx-an-sw i{left:19px;}",
    "#dnx-styler-ui .dnx-an-txt{font-size:10px;color:#9fb8a8;min-width:22px;}",
    "#dnx-tool-kopf{display:flex;align-items:center;gap:6px;margin:5px 0;padding:6px 9px;border-radius:9px;background:linear-gradient(180deg,#13241c,#0c1712);border:1px solid rgba(78,224,138,.38);color:#c8ecd7;font:700 11.5px Arial,sans-serif;cursor:pointer;user-select:none;box-shadow:0 1px 0 rgba(255,255,255,.05) inset;}",
    "#dnx-tool-kopf:hover{border-color:#4ee08a;color:#eafff2;background:linear-gradient(180deg,#163024,#0d1c15);}",
    "#dnx-tool-kopf .dnx-tool-pfeil{display:inline-block;width:0;height:0;margin-right:1px;border-left:6px solid #4ee08a;border-top:4.5px solid transparent;border-bottom:4.5px solid transparent;transform:rotate(90deg);transition:transform .18s ease;flex:0 0 auto;}",
    "body.dnx-tools-zu #dnx-tool-kopf .dnx-tool-pfeil{transform:rotate(0deg);}",
    "#dnx-tool-kopf .dnx-tool-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.2px;}",
    "#dnx-tool-kopf .dnx-tool-zahl{font:700 10px Arial;color:#8fd6a8;background:rgba(78,224,138,.13);border:1px solid rgba(78,224,138,.32);border-radius:999px;padding:1px 7px;flex:0 0 auto;}",
    "/* v3.74: je ID eigene Regel - schlaegt #dnx-master-tool-row{display:grid !important} */",
    "body.dnx-tools-zu #dnx-weather-launch,body.dnx-tools-zu #dnx-styler-launch,body.dnx-tools-zu #dnx-an-panel,body.dnx-tools-zu #dnx-fm-launch,body.dnx-tools-zu #dnx-project-manager-button,body.dnx-tools-zu #dnx-master-tool-row,body.dnx-tools-zu .dnx-tool-teil{display:none !important;}",
    ".dnx-tool-teil{box-sizing:border-box;}",
    "#dnx-an-panel{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:3px 0 5px;padding:5px;border-radius:9px;background:rgba(0,0,0,.20);border:1px solid rgba(255,255,255,.06);}",
    ".dnx-an-chip{display:flex;align-items:center;gap:6px;height:28px;padding:0 9px;border-radius:999px;border:1px solid rgba(140,160,170,.45);background:linear-gradient(180deg,#141d19,#0d1411);color:#a9bcb2;font:700 10.5px/1 Arial,sans-serif;cursor:pointer;box-sizing:border-box;transition:border-color .15s,color .15s,box-shadow .15s,background .15s;min-width:0;}",
    ".dnx-an-chip:hover{border-color:#7fd6a4;color:#dcf7e7;}",
    ".dnx-an-chip i.dnx-an-punkt{width:7px;height:7px;border-radius:50%;background:#556069;flex:0 0 auto;transition:background .15s,box-shadow .15s;}",
    ".dnx-an-chip .dnx-an-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
    ".dnx-an-chip .dnx-an-txt{font:700 9.5px Arial;opacity:.8;flex:0 0 auto;}",
    ".dnx-an-chip.an{border-color:#4ee08a;background:linear-gradient(180deg,#153a27,#0c2618);color:#dcffea;box-shadow:0 0 10px rgba(78,224,138,.26),0 0 0 1px rgba(78,224,138,.18) inset;}",
    ".dnx-an-chip.an i.dnx-an-punkt{background:#4ee08a;box-shadow:0 0 7px #4ee08a;}",
    "input.dnx-an{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;}",
    "#dnx-styler-ui .dnx-an-row.dnx-an-chip{width:100%;margin:4px 0;font-size:11.5px;height:30px;}",
    "#dnx-styler-ui .dnx-an-row.dnx-an-chip .dnx-an-txt{font-size:10px;}",
    "body.dnx-wf-aus.dnx-fft-an #webrx-canvas-background{position:absolute !important;top:0;left:0;right:0;height:100% !important;visibility:hidden !important;}",
    "body.dnx-wf-aus.dnx-fft-an #openwebrx-frequency-container{display:flex !important;flex-direction:column !important;flex:1 1 0 !important;min-height:0 !important;background-position:0 100% !important;}",
    "body.dnx-wf-aus.dnx-fft-an .openwebrx-waterfall-container{min-height:0 !important;}",
    "body.dnx-wf-aus.dnx-fft-an #openwebrx-panels-container,body.dnx-wf-aus.dnx-fft-an #openwebrx-panels-container-left,body.dnx-wf-aus.dnx-fft-an #openwebrx-panels-container-right{z-index:2000 !important;}",
    "body.dnx-wf-aus.dnx-fft-an #openwebrx-bandplan-container,body.dnx-wf-aus.dnx-fft-an #openwebrx-bookmarks-container,body.dnx-wf-aus.dnx-fft-an #openwebrx-scale-container{flex:0 0 auto !important;}",
    "body.dnx-wf-aus.dnx-fft-an .openwebrx-spectrum-container{order:10 !important;transition:none !important;}",
    "body.dnx-wf-aus.dnx-fft-an .openwebrx-spectrum-container.expanded{flex:1 1 0 !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:hidden !important;background:var(--dnx-bg,#0b0f12);}"
,
    /* ---- v3.78: Status-Pillen unten links (fuer alle Besucher) ---- */
    "#openwebrx-panel-status{background:transparent !important;border:0 !important;box-shadow:none !important;margin-left:auto !important;margin-right:auto !important;width:max-content !important;max-width:615px !important;transform:translateY(-26px) !important;}",
    "#openwebrx-panel-status .openwebrx-progressbar{border-radius:7px !important;border:1px solid rgba(0,0,0,.45) !important;box-shadow:0 0 0 1px rgba(255,255,255,.16) inset,0 2px 6px rgba(0,0,0,.55) !important;}",
    "#openwebrx-bar-audio-buffer,#openwebrx-bar-audio-output,#openwebrx-bar-audio-speed{background:#1266d6 !important;}",
    "#openwebrx-bar-network-speed{background:#1266d6 !important;}",
    "#openwebrx-bar-server-cpu{background:#d32f2f !important;}",
    "#openwebrx-bar-clients{background:#2e7d32 !important;}",
    "#openwebrx-panel-status .openwebrx-progressbar-text{color:#fff !important;font-weight:700 !important;text-shadow:0 1px 2px rgba(0,0,0,.55) !important;}",
    "#openwebrx-panel-status .openwebrx-progressbar-bar{background:rgba(255,255,255,.22) !important;border-radius:6px !important;}",
  ].join("");
  function dnxAnSheet(){
    try{
      var st = document.getElementById("dnx-an-sheet");
      if(!st){
        st = document.createElement("style");
        st.id = "dnx-an-sheet";
        var kopf = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        kopf.appendChild(st);
      }
      if(st.textContent !== AN_CSS){ st.textContent = AN_CSS; }
      return true;
    }catch(e){ return false; }
  }
  function dnxAnWf(){
    var s = "";
    try{ s = localStorage.getItem(WF_ON_KEY) || ""; }catch(e){}
    return s !== "aus";
  }
  function dnxFftAn(){
    try{ if(window.UI && typeof UI.spectrum === "boolean"){ return UI.spectrum; } }catch(e){}
    try{ return (localStorage.getItem("ui_spectrum") === "true"); }catch(e2){ return false; }
  }
  function dnxAnWfSetze(an){
    an = !!an;
    try{ localStorage.setItem(WF_ON_KEY, an ? "an" : "aus"); }catch(e){}
    dnxAnSheet();
    dnxAnKlasse();
    dnxAnSync();
    return dnxAnWf() === an;
  }
  function dnxFftAnSetze(an){
    an = !!an;
    var ok = false;
    try{
      if(window.UI && typeof UI.toggleSpectrum === "function"){ UI.toggleSpectrum(an); ok = true; }
    }catch(e){ ok = false; }
    if(!ok){
      try{
        var c = document.querySelector ? document.querySelector(".openwebrx-spectrum-container") : null;
        if(c && c.classList){ c.classList.toggle("expanded", an); }
        if(window.spectrum && typeof spectrum.toggle === "function"){ spectrum.toggle(an); }
        ok = true;
      }catch(e2){ ok = false; }
    }
    if(an && dnxFftId() !== "original"){
      var i;
      for(i = 0; i < 4; i++){
        setTimeout(function(){ if(dnxFftAn()){ dnxFftApply(); } }, 250 + i * 600);
      }
    }
    dnxAnKlasse();
    dnxAnSync();
    dnxWfState();
    return ok;
  }
  function dnxAnSync(){
    var a = dnxAnWf(), b = dnxFftAn();
    var w = [wfEls.anWf, wfEls.anWfP], f = [wfEls.anFft, wfEls.anFftP];
    var i, e;
    for(i = 0; i < 2; i++){
      e = w[i];
      if(e){
        if(e.checked !== a){ e.checked = a; }
        if(e.__txt){ e.__txt.textContent = a ? "an" : "aus"; }
        if(e.__chip && e.__chip.classList){ e.__chip.classList.toggle("an", a); }
      }
      e = f[i];
      if(e){
        if(e.checked !== b){ e.checked = b; }
        if(e.__txt){ e.__txt.textContent = b ? "an" : "aus"; }
        if(e.__chip && e.__chip.classList){ e.__chip.classList.toggle("an", b); }
      }
    }
    dnxAnPanel();
  }
  function dnxAnZeile(id, lbl, an, fn, host){
    dnxAnSheet();
    /* v3.72: breiter Chip (Punkt + Name + an/aus) statt winzigem Schiebeschalter */
    var l = document.createElement("label");
    l.className = "dnx-an-row dnx-an-chip" + (an ? " an" : "");
    var punkt = document.createElement("i");
    punkt.className = "dnx-an-punkt";
    var t = document.createElement("span");
    t.className = "dnx-an-name";
    t.textContent = lbl;
    var box = document.createElement("input");
    box.type = "checkbox";
    box.className = "dnx-an";
    box.id = id;
    box.checked = !!an;
    var tx = document.createElement("span");
    tx.className = "dnx-an-txt";
    tx.textContent = an ? "an" : "aus";
    box.__txt = tx;
    box.__chip = l;
    box.onchange = function(){
      l.classList.toggle("an", !!box.checked);
      tx.textContent = box.checked ? "an" : "aus";
      fn(!!box.checked);
    };
    l.appendChild(box); l.appendChild(punkt); l.appendChild(t); l.appendChild(tx);
    host.appendChild(l);
    return box;
  }
  /* ---- v41: Flaeche teilen statt nur ausblenden ----
     Wasserfall aus + Spektrum an -> der Wasserfall gibt seine Flaeche ab: er
     bleibt im Hintergrund aktiv (nichts wird abgeschaltet), wird aber nicht
     mehr gezeichnet; das Spektrum dehnt sich auf die ganze Flaeche (flex).
     Der Original-Schalter UI.toggleSpectrum wird angezapft, damit die Flaeche
     sofort umschaltet - egal ob unser Schalter, der Sinus-Knopf oder eine
     Tastenkombination das Spektrum schaltet. */
  function dnxAnKlasse(){
    try{
      if(!document.body || !document.body.classList){ return false; }
      document.body.classList.toggle("dnx-wf-aus", !dnxAnWf());
      document.body.classList.toggle("dnx-fft-an", dnxFftAn());
      return true;
    }catch(e){ return false; }
  }
  function dnxFftHook(){
    try{
      if(!window.UI || typeof UI.toggleSpectrum !== "function" || UI.toggleSpectrum.__dnx){ return false; }
      var orig = UI.toggleSpectrum;
      UI.toggleSpectrum = function(on){
        var r = orig.apply(this, arguments);
        try{ dnxAnTick(); }catch(e){}
        return r;
      };
      UI.toggleSpectrum.__dnx = 1;
      return true;
    }catch(e2){ return false; }
  }
  function dnxAnTick(){
    dnxStatusWache();
    dnxToolKopf();
    dnxFftHook();
    dnxFftWache();
    dnxAnKlasse();
    dnxAnSync();
    dnxFftLinie();
    dnxTopLinie();
  }
  /* ---- v47: rote Ziehlinie direkt unter dem Spektrum ----
     Ziehen nach unten: das Spektrum wird hoeher, Skala und Wasserfall rutschen
     nach unten, der Wasserfall wird kleiner. Doppelklick = zurueck auf 50 px.
     Optik wie die rote Linie unter der Frequenzskala. Nur im Browser. */
  var FFT_H_KEY = "dnx_styler_fft_h";
  var fftHoehe = 0;
  var fftTippZeit = 0;
  var fftTippBewegt = 0;
  function dnxFftHGemerkt(){
    try{ return parseInt(localStorage.getItem(FFT_H_KEY) || "0", 10) || 0; }catch(e){ return 0; }
  }
  function dnxFftHZiel(){
    try{ return document.getElementById("openwebrx-frequency-container"); }catch(e){ return null; }
  }
  function dnxFftFeld(){
    try{ return document.querySelector(".openwebrx-spectrum-container"); }catch(e){ return null; }
  }
  function dnxFftHAnwenden(h){
    try{
      var root = document.documentElement, b = document.body;
      if(h > 0){
        root.style.setProperty("--dnx-fft-h", Math.round(h) + "px");
        b.classList.add("dnx-fft-h");
      } else {
        root.style.removeProperty("--dnx-fft-h");
        b.classList.remove("dnx-fft-h");
      }
    }catch(e){}
  }
  function dnxFftHMax(){
    var rest = 0;
    try{
      var w = document.getElementById("webrx-canvas-background");
      rest = w ? w.getBoundingClientRect().height : 0;
    }catch(e){ rest = 0; }
    if(!(rest > 0)){ return 800; }
    return Math.max(60, Math.round(fftHoehe + (rest - 140)));
  }
  function dnxFftHSetzen(h){
    h = Math.round(h);
    if(!isFinite(h) || h < 24){ h = 24; }
    var m = dnxFftHMax();
    if(h > m){ h = m; }
    fftHoehe = h;
    dnxFftHAnwenden(h);
    try{ localStorage.setItem(FFT_H_KEY, String(h)); }catch(e){}
    return h;
  }
  function dnxFftHReset(){
    fftHoehe = 0;
    dnxFftHAnwenden(0);
    try{ localStorage.removeItem(FFT_H_KEY); }catch(e){}
    return true;
  }
  function dnxFftZiehen(ev){
    if(ev.button !== undefined && ev.button !== 0){ return; }
    var jetzt = (new Date()).getTime();
    if(jetzt - fftTippZeit < 420 && !fftTippBewegt){ fftTippZeit = 0; fftTippBewegt = 0; dnxFftHReset(); dnxFftLinie(); return; }
    fftTippZeit = jetzt;
    fftTippBewegt = 0;
    if(!ev.currentTarget){ return; }
    var c = ev.currentTarget.parentNode;
    if(!c){ return; }
    ev.preventDefault();
    var y0 = ev.clientY, h0 = 50;
    try{ var f = dnxFftFeld(); if(f && f.getBoundingClientRect().height > 0){ h0 = f.getBoundingClientRect().height; } }catch(e){}
    dnxFftHSetzen(h0);
    try{ ev.currentTarget.setPointerCapture(ev.pointerId); }catch(e){}
    try{ document.body.style.cursor = "ns-resize"; }catch(e){}
    function mv(e2){
      if(e2.preventDefault){ e2.preventDefault(); }
      fftTippBewegt = 1;
      dnxFftHSetzen(h0 + (e2.clientY - y0));
    }
    function up(e2){
      document.removeEventListener("pointermove", mv, true);
      if(fftTippBewegt){ fftTippZeit = 0; }
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", up, true);
      try{ if(ev.currentTarget.releasePointerCapture){ ev.currentTarget.releasePointerCapture(e2.pointerId); } }catch(e){}
      try{ document.body.style.cursor = ""; }catch(e){}
      try{ window.dispatchEvent(new Event("resize")); }catch(e){}
      dnxFftLinie();
    }
    document.addEventListener("pointermove", mv, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
  }
  function dnxFftLinie(host){
  function dnxFftLaKlasse(an){
    try{ document.body.classList.toggle("dnx-fft-la", !!an); }catch(e){}
  }
    var c = host || dnxFftHZiel();
    var el = null, auf = false, wfan = true;
    try{ el = document.getElementById("dnx-fft-line"); }catch(e){ el = null; }
    try{
      var f = dnxFftFeld();
      if(f && f.classList){ auf = !!f.classList.contains("expanded"); }
      else { auf = !!(typeof dnxFftAn === "function" && dnxFftAn()); }
    }catch(e){ auf = false; }
    try{ wfan = (typeof dnxAnWf === "function") ? !!dnxAnWf() : true; }catch(e3){ wfan = true; }
    if(!c || !auf || !wfan){
      if(el && el.parentNode && el.parentNode.removeChild){ el.parentNode.removeChild(el); }
      else if(el){ el.__dnxWeg = 1; }
      dnxFftLaKlasse(false);
      return false;
    }
    if(!el){
      el = document.createElement("div");
      el.id = "dnx-fft-line";
      el.title = "Ziehen: Spektrum hoeher, Wasserfall kleiner (Doppelklick = zurueck auf 50 px)";
      el.addEventListener("pointerdown", dnxFftZiehen, true);
      el.addEventListener("dblclick", function(){ dnxFftHReset(); dnxFftLinie(); });
    }
    if(el.parentNode !== c){ c.appendChild(el); }
    dnxFftLaKlasse(true);
    var h = fftHoehe > 0 ? fftHoehe : dnxFftHGemerkt();
    fftHoehe = h;
    dnxFftHAnwenden(h);
    return true;
  }
  /* ---- v50: zweite rote Ziehlinie - oberer Abschnitt ----
     Sitzt am unteren Rand des oberen Bereichs (.webrx-top-container), direkt
     ueber dem Frequenzstreifen. Ziehen verschiebt die Grenze: nach unten =
     oberer Abschnitt groesser (Wasserfall kleiner), nach oben = kleiner
     (Wasserfall groesser). Doppelklick = zurueck. Nur im DNX-Thema. */
  var TOP_H_KEY = "dnx_styler_top_h";
  var topHoehe = 0;
  var topTippZeit = 0;
  var topTippBewegt = 0;
  var topGrenze = 0;
  function dnxTopHGemerkt(){
    try{ return parseInt(localStorage.getItem(TOP_H_KEY) || "0", 10) || 0; }catch(e){ return 0; }
  }
  function dnxTopBox(){
    try{ return document.querySelector(".webrx-top-container"); }catch(e){ return null; }
  }
  function dnxTopHost(){
    /* Wirt ist der Frequenz-Streifen: sein overflow ist sichtbar, eine Linie an
       seinem oberen Rand liegt genau in der letzten Zeile des oberen Bereichs.
       Der obere Bereich selbst hat overflow:hidden und wuerde sie abschneiden. */
    try{ return document.getElementById("openwebrx-frequency-container"); }catch(e){ return null; }
  }
  function dnxTopAnwenden(h){
    try{
      var root = document.documentElement, b = document.body;
      if(h > 0){
        root.style.setProperty("--dnx-top-h", Math.round(h) + "px");
        b.classList.add("dnx-top-h");
      } else {
        root.style.removeProperty("--dnx-top-h");
        b.classList.remove("dnx-top-h");
      }
    }catch(e){}
  }
  /* Grenze: der obere Abschnitt darf so hoch werden, wie sein Inhalt ist
     (dann ist er ganz sichtbar: Buttons, Laufschrift und beide VNC-Boxen).
     Hoeher waere nur leerer Platz, darum stoppt die Linie dort. */
  function dnxTopMaxErmitteln(){
    try{
      var box = dnxTopBox();
      if(!box){ return 0; }
      var natur = box.scrollHeight || 0;
      if(natur > 0){ return Math.round(natur); }
    }catch(e){}
    return 0;
  }
  function dnxTopMax(){
    if(topGrenze > 0){ return topGrenze; }
    var m = dnxTopMaxErmitteln();
    return m > 0 ? m : 4000;
  }
  function dnxTopHSetzen(h){
    h = Math.round(h);
    if(!isFinite(h) || h < 0){ h = 0; }
    if(h > 0 && h < 96){ h = 96; }
    var m = dnxTopMax();
    if(h > m){ h = m; }
    topHoehe = h;
    dnxTopAnwenden(h);
    try{ localStorage.setItem(TOP_H_KEY, String(h)); }catch(e){}
    return h;
  }
  function dnxTopHReset(){
    topHoehe = 0;
    dnxTopAnwenden(0);
    try{ localStorage.removeItem(TOP_H_KEY); }catch(e){}
    return true;
  }
  function dnxTopZiehen(ev){
    if(ev.button !== undefined && ev.button !== 0){ return; }
    if(!ev.currentTarget){ return; }
    var box = dnxTopBox();
    if(!box){ return; }
    ev.preventDefault();
    var y0 = ev.clientY, h0 = 0;
    try{ h0 = box.getBoundingClientRect().height || 0; }catch(e){ h0 = 0; }
    topGrenze = dnxTopMaxErmitteln();
    var jetzt = (new Date()).getTime();
    if(jetzt - topTippZeit < 420 && !topTippBewegt){ topTippZeit = 0; topTippBewegt = 0; dnxTopHReset(); dnxTopLinie(); return; }
    topTippZeit = jetzt;
    topTippBewegt = 0;
    /* Beim blossen Antippen wird noch nichts gesetzt: erst der erste echte
       Zug aendert die Hoehe. So bleibt die Linie fuer den Doppelklick liegen. */
    try{ ev.currentTarget.setPointerCapture(ev.pointerId); }catch(e){}
    try{ document.body.style.cursor = "ns-resize"; }catch(e){}
    function mv(e2){
      if(e2.preventDefault){ e2.preventDefault(); }
      topTippBewegt = 1;
      dnxTopHSetzen(h0 + (e2.clientY - y0));
    }
    function up(e2){
      document.removeEventListener("pointermove", mv, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", up, true);
      if(topTippBewegt){ topTippZeit = 0; }
      topGrenze = 0;
      try{ if(ev.currentTarget.releasePointerCapture){ ev.currentTarget.releasePointerCapture(e2.pointerId); } }catch(e){}
      try{ document.body.style.cursor = ""; }catch(e){}
      try{ window.dispatchEvent(new Event("resize")); }catch(e){}
      dnxTopLinie();
    }
    document.addEventListener("pointermove", mv, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
  }
  function dnxTopLinie(){
    var host = dnxTopHost(), box = dnxTopBox();
    var el = null, an = false;
    try{ el = document.getElementById("dnx-top-line"); }catch(e){ el = null; }
    try{ an = document.documentElement.classList.contains("dnx-styled"); }catch(e){ an = false; }
    if(!host || !box || !an){
      if(el && el.parentNode && el.parentNode.removeChild){ el.parentNode.removeChild(el); }
      else if(el){ el.__dnxWeg = 1; }
      dnxTopAnwenden(0);
      return false;
    }
    if(!el){
      el = document.createElement("div");
      el.id = "dnx-top-line";
      el.title = "Ziehen: oberen Abschnitt verschieben (Doppelklick = zurueck auf Original)";
      el.addEventListener("pointerdown", dnxTopZiehen, true);
      el.addEventListener("dblclick", function(){ dnxTopHReset(); dnxTopLinie(); });
    }
    if(el.parentNode !== host){ host.appendChild(el); }
    var h = topHoehe > 0 ? topHoehe : dnxTopHGemerkt();
    topHoehe = h;
    dnxTopAnwenden(h);
    return true;
  }
  function dnxAnBoot(){
    dnxAnSheet();
    dnxAnTick();
    dnxStdLaden();
  }
  /* ---- v42: Schalter auch am Empfaenger + Standard fuer alle Besucher ----
     A) dnxAnPanel(): Kopie der beiden Schalter im Empfaenger-Feld
        (#openwebrx-panel-receiver), damit Wasserfall und Spektrum auch ohne
        das Styler-Fenster einzeln an- und ausgeschaltet werden koennen.
     B) dnxStd*: der eigene Zustand (Wasserfall an/aus, Spektrum an/aus, beide
        Paletten und das Aussehen) wird als Start-Standard auf den Teilen-Dienst
        gelegt (Knopf "Standard fuer alle" im Styler, Adresse wie beim Teilen).
        Jeder Besucher bekommt diesen Stand beim Laden zuerst; sobald jemand im
        Styler sein eigenes Theme speichert, gilt seine eigene Wahl. */
  var STD_KEY = "dnx_styler_std_token";
  var STD_TS_KEY = "dnx_styler_std_ts";   /* v3.69: Zeitmarke des zuletzt angewandten Standards */
  function dnxAnPanel(){
    try{
      if(document.getElementById("dnx-an-panel")){ return true; }
      var panel = document.getElementById("openwebrx-panel-receiver");
      if(!panel || !panel.insertBefore){ return false; }
      var box = document.createElement("div");
      box.id = "dnx-an-panel";
      box.title = "Wasserfall und Spektrum ein- oder ausblenden (DNX Styler)";
      var l = document.getElementById("dnx-styler-launch");
      if(l && l.parentNode === panel && l.nextSibling){ panel.insertBefore(box, l.nextSibling); }
      else if(l && l.parentNode === panel){ panel.appendChild(box); }
      else { panel.insertBefore(box, panel.firstChild); }
      wfEls.anWfP = dnxAnZeile("dnx-an-panel-wf", "Wasserfall", dnxAnWf(), function(an){
        dnxAnWfSetze(an);
        dnxWfState();
        if(typeof uiHooks !== "undefined" && uiHooks && uiHooks.flash){ uiHooks.flash("Wasserfall " + (an ? "an" : "aus")); }
      }, box);
      setTimeout(function(){ dnxToolKopf(); }, 60);
      wfEls.anFftP = dnxAnZeile("dnx-an-panel-fft", "Spektrum", dnxFftAn(), function(an){
        dnxFftAnSetze(an);
        dnxWfState();
        if(typeof uiHooks !== "undefined" && uiHooks && uiHooks.flash){ uiHooks.flash("Spektrum " + (an ? "an" : "aus")); }
      }, box);
      return true;
    }catch(e){ return false; }
  }
  /* ---- v3.72: Werkzeug-Kopf mit Pfeil - klappt den ganzen Werkzeug-Abschnitt zu ---- */
  var TOOLS_ZU_KEY = "dnx_tools_zu";
  /* v3.76: Status-Pillen beim Start sichtbar machen (einmal, ohne Dauerzwang) */
  function dnxStatusWache(){
    try{
      if(dnxStatusWache.getan){ return; }
      dnxStatusWache.getan = 1;
      var n = 0;
      var t = setInterval(function(){
        n++;
        try{
          var p = document.getElementById("openwebrx-panel-status");
          if(p){
            var st = window.getComputedStyle ? getComputedStyle(p) : null;
            if(st && (st.display === "none" || st.visibility === "hidden" || parseFloat(st.opacity) < 0.05)){
              p.style.display = "block";
              p.style.visibility = "visible";
              p.style.opacity = "1";
            }
          }
        }catch(e){}
        if(n >= 6){ clearInterval(t); }
      }, 800);
    }catch(e){}
  }

  function dnxToolsZu(){
    try{
      var raw = localStorage.getItem(TOOLS_ZU_KEY);
      if(raw !== null) return raw === "zu";
      return !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout());
    }catch(e){ return !!(window.__dnxIsMobileLayout && window.__dnxIsMobileLayout()); }
  }
  function dnxToolsZustand(zeichnen){
    var zu = dnxToolsZu();
    try{ document.body.classList.toggle("dnx-tools-zu", zu); }catch(e){}
    if(zeichnen){
      var z = document.getElementById("dnx-tool-zahl");
      if(z){
        var n = 0;
        try{
          var r = document.getElementById("dnx-master-tool-row");
          if(r){ n += r.querySelectorAll("button").length; }
          n += document.querySelectorAll("#dnx-an-panel input.dnx-an").length;
          if(document.getElementById("dnx-weather-launch")){ n++; }
          if(document.getElementById("dnx-styler-launch")){ n++; }
          if(document.getElementById("dnx-fm-launch")){ n++; }
          if(document.getElementById("dnx-project-manager-button")){ n++; }
        }catch(e2){}
        z.textContent = zu ? "zu" : (n + " Tools");
      }
    }
    return zu;
  }
  function dnxToolsUmschalten(){
    var neu = !dnxToolsZu();
    try{ localStorage.setItem(TOOLS_ZU_KEY, neu ? "zu" : "auf"); }catch(e){}
    dnxToolsZustand(true);
    if(typeof uiHooks !== "undefined" && uiHooks && uiHooks.flash){
      uiHooks.flash("Werkzeuge " + (neu ? "zugeklappt" : "aufgeklappt"));
    }
  }
  /* v3.73: alles, was unter "DNX Werkzeuge" haengt */
  var TEIL_IDS = ["dnx-weather-launch", "dnx-styler-launch", "dnx-an-panel",
                  "dnx-fm-launch", "dnx-project-manager-button", "dnx-master-tool-row"];
  function dnxToolTeile(){
    var i, e, n = 0;
    for(i = 0; i < TEIL_IDS.length; i++){
      e = document.getElementById(TEIL_IDS[i]);
      if(e){
        if(!e.classList.contains("dnx-tool-teil")){ e.classList.add("dnx-tool-teil"); }
        n++;
      }
    }
    return n;
  }
  function dnxToolKopf(){
    try{
      var panel = document.getElementById("openwebrx-panel-receiver");
      if(!panel){ return false; }
      dnxToolTeile();
      var alt = document.getElementById("dnx-tool-kopf");
      if(alt){
        /* Kopf muss IMMER ganz oben stehen - vor dem Wetter-Knopf */
        var oben = document.getElementById("dnx-weather-launch") ||
                   document.getElementById("dnx-styler-launch") ||
                   document.getElementById("dnx-an-panel");
        if(oben && oben.parentNode === panel && alt.nextElementSibling !== oben){
          panel.insertBefore(alt, oben);
        }
        dnxToolsZustand(true);
        return true;
      }
      var k = document.createElement("div");
      k.id = "dnx-tool-kopf";
      k.title = "Alle DNX-Werkzeuge auf- oder zuklappen";
      k.setAttribute("role", "button");
      k.setAttribute("tabindex", "0");
      var pfeil = document.createElement("span");
      pfeil.className = "dnx-tool-pfeil";
      var name = document.createElement("span");
      name.className = "dnx-tool-name";
      name.textContent = "DNX Werkzeuge";
      var zahl = document.createElement("span");
      zahl.className = "dnx-tool-zahl";
      zahl.id = "dnx-tool-zahl";
      zahl.textContent = "...";
      k.appendChild(pfeil); k.appendChild(name); k.appendChild(zahl);
      k.onclick = dnxToolsUmschalten;
      k.onkeydown = function(e){ if(e && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); dnxToolsUmschalten(); } };
      var anker = document.getElementById("dnx-weather-launch") ||
                  document.getElementById("dnx-styler-launch") ||
                  document.getElementById("dnx-an-panel");
      if(anker && anker.parentNode === panel){ panel.insertBefore(k, anker); }
      else { panel.appendChild(k); }
      dnxToolsZustand(true);
      return true;
    }catch(e){ return false; }
  }

  function dnxStdEigen(){
    try{
      if(localStorage.getItem(KEY)){ return true; }
    }catch(e){}
    return false;
  }
  function dnxStdAnwenden(st){
    if(!st || typeof st !== "object"){ return false; }
    var gesetzt = [];
    try{
      if(st.wf){ localStorage.setItem(WF_KEY, String(st.wf)); }
      if(st.fft){ localStorage.setItem(FFT_KEY, String(st.fft)); }
    }catch(e){}
    if(st.wf_an === 0 || st.wf_an === 1){ dnxAnWfSetze(st.wf_an === 1); gesetzt.push("Wasserfall " + (st.wf_an ? "an" : "aus")); }
    if(st.fft_an === 0 || st.fft_an === 1){ dnxFftAnSetze(st.fft_an === 1); gesetzt.push("Spektrum " + (st.fft_an ? "an" : "aus")); }
    if(st.skin && st.skin.accent && !dnxStdEigen()){
      try{
        var d = shareKeep(st.skin);
        if(!d.bg){ d.bg = PRESETS.dnx.bg; }
        if(!d.panel){ d.panel = PRESETS.dnx.panel; }
        if(!d.btn){ d.btn = PRESETS.dnx.btn; }
        if(!d.text){ d.text = PRESETS.dnx.text; }
        if(!d.accent){ d.accent = PRESETS.dnx.accent; }
        current = ensureDefaults(d);
        apply(current);
        if(uiHooks.sync){ try{ uiHooks.sync(); }catch(e3){} }
        gesetzt.push("Aussehen");
      }catch(e2){}
    }
    try{
      if(wfEls.sel){ wfEls.sel.value = dnxWfId(); }
      if(wfEls.fft){ wfEls.fft.value = dnxFftId(); }
    }catch(e4){}
    dnxWfReg();
    dnxWfApply(dnxWfId());
    dnxFftApply();
    dnxAnTick();
    if(gesetzt.length && uiHooks.flash){ uiHooks.flash("Standard: " + gesetzt.join(", ")); }
    return true;
  }
  function dnxStdLaden(){
    if(dnxStdLaden.g){ return false; }
    dnxStdLaden.g = 1;
    if(!window.fetch){ return false; }
    shareFetch("/dnx/styler/std", { cache: "no-store" }).then(function(j){
      if(!j || !j.ok || !j.std){ return; }
      /* v3.69: ein NEUER Standard wird auch bei eigenen Einstellungen einmal
         durchgesetzt (Zeitmarke vergleichen); danach bleibt eigene Wahl gueltig. */
      var ts = String(j.ts || "");
      var gesehen = "";
      try{ gesehen = localStorage.getItem(STD_TS_KEY) || ""; }catch(e){}
      if(dnxStdEigen() && ts && ts === gesehen){ return; }
      dnxStdAnwenden(j.std);
      try{ if(ts){ localStorage.setItem(STD_TS_KEY, ts); } }catch(e){}
    }).catch(function(){});
    return true;
  }
  function dnxStdSenden(){
    var tok = "";
    try{ tok = localStorage.getItem(STD_KEY) || ""; }catch(e){}
    var view = {
      wf: dnxWfId(),
      wf_an: dnxAnWf() ? 1 : 0,
      fft: dnxFftId(),
      fft_an: dnxFftAn() ? 1 : 0,
      skin: shareKeep(current)
    };
    dnxShareStatus("setze Standard ...");
    shareFetch("/dnx/styler/std", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: shareAuth(), token: tok, view: view })
    }).then(function(j){
      if(j && j.ok){
        try{ if(j.token){ localStorage.setItem(STD_KEY, String(j.token)); } }catch(e2){}
        dnxShareStatus("Standard fuer alle gespeichert");
        if(uiHooks.flash){ uiHooks.flash("Standard fuer alle gespeichert"); }
      } else {
        var m = shareClean(((j && j.error) || "abgelehnt"), 34);
        dnxShareStatus("Standard: " + m);
        if(uiHooks.flash){ uiHooks.flash("Standard nicht gespeichert: " + m); }
      }
    }).catch(function(){
      dnxShareStatus("Server nicht erreichbar");
      if(uiHooks.flash){ uiHooks.flash("Standard: Server nicht erreichbar"); }
    });
  }
  function dnxWfUi(ui){
    function opts(sel, liste, wert){
      var i, o;
      for(i = 0; i < liste.length; i++){
        o = document.createElement("option");
        o.value = liste[i][0];
        o.textContent = liste[i][1];
        sel.appendChild(o);
      }
      sel.value = wert;
    }
    var wfSel = document.createElement("select");
    wfSel.id = "dnx-styler-wf";
    var g1 = document.createElement("optgroup");
    g1.label = "Original-Themes (OpenWebRX)";
    wfSel.appendChild(g1);
    var g2 = document.createElement("optgroup");
    g2.label = "DNX-Paletten";
    wfSel.appendChild(g2);
    var g3 = document.createElement("optgroup");
    g3.label = "MultiSDR (188) - " + dnxMsdrList().length;
    wfSel.appendChild(g3);
    var i, o;
    for(i = 0; i < DNX_WF_ORIG.length; i++){
      o = document.createElement("option");
      o.value = DNX_WF_ORIG[i][0];
      o.textContent = DNX_WF_ORIG[i][1];
      g1.appendChild(o);
    }
    for(i = 0; i < DNX_WF_DNX.length; i++){
      o = document.createElement("option");
      o.value = DNX_WF_DNX[i][0];
      o.textContent = DNX_WF_DNX[i][1];
      g2.appendChild(o);
    }
    var liste3 = dnxMsdrList();
    for(i = 0; i < liste3.length; i++){
      o = document.createElement("option");
      o.value = liste3[i][0];
      o.textContent = liste3[i][1];
      g3.appendChild(o);
    }
    wfSel.value = dnxWfId();
    wfSel.onchange = function(){
      try{ localStorage.setItem(WF_KEY, wfSel.value); }catch(e){}
      dnxWfApply(wfSel.value);
      if(typeof uiHooks !== "undefined" && uiHooks && uiHooks.flash){ uiHooks.flash("Wasserfall: " + dnxWfName(wfSel.value)); }
    };
    wfEls.anWf = dnxAnZeile("dnx-styler-wf-an", "Wasserfall an/aus", dnxAnWf(), function(an){
      dnxAnWfSetze(an);
      dnxWfState();
      if(typeof uiHooks !== "undefined" && uiHooks && uiHooks.flash){ uiHooks.flash("Wasserfall " + (an ? "an" : "aus")); }
    }, ui);
    field("Wasserfall-Palette", ui, wfSel);
    wfEls.sel = wfSel;
    var fftSel = document.createElement("select");
    fftSel.id = "dnx-styler-fft";
    var o4, k4;
    for(k4 = 0; k4 < DNX_FFT.length; k4++){
      o4 = document.createElement("option");
      o4.value = DNX_FFT[k4][0];
      o4.textContent = DNX_FFT[k4][1];
      fftSel.appendChild(o4);
    }
    var g4 = document.createElement("optgroup");
    g4.label = "Palette MultiSDR (188)";
    fftSel.appendChild(g4);
    var liste4 = dnxMsdrList();
    for(k4 = 0; k4 < liste4.length; k4++){
      o4 = document.createElement("option");
      o4.value = "pal:" + String(liste4[k4][0]).slice(5);
      o4.textContent = liste4[k4][1];
      g4.appendChild(o4);
    }
    fftSel.value = dnxFftId();
    if(!fftSel.value){ fftSel.value = "original"; }
    fftSel.onchange = function(){
      try{ localStorage.setItem(FFT_KEY, fftSel.value); }catch(e){}
      dnxFftApply();
      if(typeof uiHooks !== "undefined" && uiHooks && uiHooks.flash){ uiHooks.flash("Spektrum: " + dnxFftName(fftSel.value)); }
    };
    wfEls.anFft = dnxAnZeile("dnx-styler-fft-an", "Spektrum an/aus", dnxFftAn(), function(an){
      dnxFftAnSetze(an);
      dnxWfState();
      if(typeof uiHooks !== "undefined" && uiHooks && uiHooks.flash){ uiHooks.flash("Spektrum " + (an ? "an" : "aus")); }
    }, ui);
    field("Spektrum-Farbe", ui, fftSel);
    wfEls.fft = fftSel;
    var st = document.createElement("div");
    st.id = "dnx-wf-state";
    st.style.cssText = "margin-top:2px;font-size:10px;color:#9fb8a8;height:14px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
    st.textContent = "Wasserfall/Spektrum: wird geprueft";
    ui.appendChild(st);
    wfEls.state = st;
    dnxWfState();
  }
  function buildUi(){
    if(ui) return ui;
    ui = document.createElement("div");
    ui.id = "dnx-styler-ui";
    ui.style.display = "none";
    makeDraggable(ui);
    var head = document.createElement("div");
    head.className = "head";
    var h = document.createElement("h4");
    h.textContent = "DNX Styler v3.46";
    var hx = document.createElement("button");
    hx.id = "dnx-styler-close";
    hx.type = "button";
    hx.textContent = "X";
    hx.title = "Schliessen / Close (Esc)";
    hx.setAttribute("aria-label", "Schliessen / Close");
    hx.onclick = function(){ dnxUiClose(); };
    head.appendChild(h);
    head.appendChild(hx);
    ui.appendChild(head);

    dnxIntro(ui);
    var sel = document.createElement("select");
    var selLbl = document.createElement("label");
    function fillPresets(){
      var keep = sel.value;
      while(sel.firstChild){ sel.removeChild(sel.firstChild); }
      Object.keys(PRESETS).forEach(function(k){
        var o = document.createElement("option");
        o.value = k; o.textContent = PRESETS[k].name;
        sel.appendChild(o);
      });
      selLbl.textContent = "Vorlage (" + Object.keys(PRESETS).length + ")";
      if(keep){ sel.value = keep; }
    }
    fillPresets();
    sel.value = current.preset || "dnx";
    sel.onchange = function(){
      var p = PRESETS[sel.value];
      if(!p) return;
      current = ensureDefaults(JSON.parse(JSON.stringify(p)));
      current.preset = sel.value;
      syncInputs(); apply(current);
    };
    ui.appendChild(selLbl);
    ui.appendChild(sel);

    var colors = {};
    [["accent", "Akzentfarbe"], ["bg", "Hintergrund"], ["panel", "Panel"], ["text", "Text"]].forEach(function(c){
      var i = document.createElement("input");
      i.type = "color"; i.value = current[c[0]] || "#000000";
      i.oninput = function(){ current[c[0]] = i.value; current.preset = "custom"; apply(current); };
      colors[c[0]] = i;
      field(c[1], ui, i);
    });

    var sliders = {};
    /* v3.89: Regler mit Gruppe, Name, Wert und kurzer Erklaerung -
       dadurch ist jede Zeile fuer sich klar. Die zwei Regler
       "Status: rechts/hoch px" sind entfallen (dafuer gibt es jetzt die
       Knoepfe Links/Rechts/Oben/Unten/Mitte). */
    var SL_DEF = [
      ["radius", "Rundung", 0, 16, "Form",
       "Wie stark Ecken und Kanten von Feldern und Knoepfen gerundet sind (0 = eckig, 16 = stark rund)."],
      ["glow", "Leuchtrand", 0, 20, "Form",
       "Staerke des farbigen Scheins um Rahmen, Knoepfe und Felder (0 = kein Schein)."],
      ["fx", "Puls-Effekt", 0, 100, "Effekte",
       "Wie stark Knoepfe und Felder im Ruhezustand pulsieren (0 = ruhig, 100 = deutlich)."],
      ["hover", "Hover-Effekt", 0, 100, "Effekte",
       "Wie stark ein Feld oder Knopf aufleuchtet, wenn der Mauszeiger darauf steht."],
      ["sound", "Klick-Ton", 0, 100, "Effekte",
       "Lautstaerke des kurzen Tones beim Bedienen (0 = stumm)."],
      ["pitch", "Tonhoehe Hz", 300, 2400, "Effekte",
       "Frequenz des Klick-Tones in Hertz - hoeher klingt heller, tiefer dunkler."],
      ["mt_abstand", "Zeitabstand s", 1, 60, "Zeitachse",
       "Nach wie vielen Sekunden am Wasserfall eine neue Uhrzeit geschrieben wird (1 = jede Sekunde)."],
      ["mt_schrift", "Schriftgroesse px", 10, 18, "Zeitachse",
       "Grundgroesse der Uhrzeiten an der Zeitachse (beim Breiterziehen waechst sie mit)."],
      ["mt_bg", "Hintergrund-Deckkraft %", 0, 100, "Zeitachse",
       "Deckkraft der Zeitachsenflaeche und der Hinterlegung von Zeitstempeln (0 = transparent, 100 = deckend)."],
      ["mt_fg", "Text/Marken-Deckkraft %", 0, 100, "Zeitachse",
       "Deckkraft von Uhrzeiten, Sekundenmarken, Teilstrichen und Achsenrand (0 = unsichtbar, 100 = voll sichtbar)."],
      ["mt_min", "Rueckschau max. Minuten", 0, 720, "Zeitachse",
       "Wie weit sich im Rueckblick hoechstens zurueckscrollen laesst (0 = kein Aufnehmen)."]
    ];
    var SL_GRUPPE = "";
    SL_DEF.forEach(function(s){
      if(s[4] !== SL_GRUPPE){
        SL_GRUPPE = s[4];
        var g = document.createElement("div");
        g.className = "dnx-grp";
        g.textContent = SL_GRUPPE;
        ui.appendChild(g);
      }
      var feld = document.createElement("div");
      feld.className = "dnx-feld";
      feld.title = s[5] || "";
      var kopf = document.createElement("div");
      kopf.className = "dnx-feld-kopf";
      var nm = document.createElement("span");
      nm.className = "dnx-feld-name";
      nm.textContent = s[1];
      var val = document.createElement("span");
      val.className = "val";
      kopf.appendChild(nm);
      kopf.appendChild(val);
      feld.appendChild(kopf);
      var hilfe = document.createElement("div");
      hilfe.className = "dnx-feld-hilfe";
      hilfe.textContent = s[5] || "";
      feld.appendChild(hilfe);
      ui.appendChild(feld);
      var i = document.createElement("input");
      i.type = "range"; i.min = s[2]; i.max = s[3]; i.value = current[s[0]] | 0;
      i.title = (s[1] || "") + ": " + (s[5] || "");
      val.textContent = i.value;
      i.oninput = function(){
        current[s[0]] = parseInt(i.value, 10);
        current.preset = "custom";
        val.textContent = i.value;
        apply(current);
      };
      /* v56: Rueckschau-Spanne bedienfreundlich - Wert in Minuten und Stunden,
         geschaetzter Speicherbedarf und Schnellwahl-Knoepfe */
      if(s[0] === "mt_min"){
        i.step = 5;
        var dauerText = function(m){
          m = parseInt(m, 10) | 0;
          if(m <= 0){ return "aus (kein Aufnehmen)"; }
          var h = Math.round(m / 6) / 10;
          var r = 22, m0 = Math.min(3, m), m1 = Math.max(0, Math.min(15, m) - m0);
          var m2 = Math.max(0, Math.min(60, m) - m0 - m1), m3 = Math.max(0, m - 60);
          var z = Math.ceil(m0 * 60 * r) + 60 + Math.ceil(m1 * 60 * r / 2) + 60 +
                  Math.ceil(m2 * 60 * r / 4) + 60 + Math.ceil(m3 * 60 * r / 16) + 60;
          var mb = Math.round(z * 512 / 1048576);
          return m + " min" + (m >= 60 ? " = " + h + " h" : "") + "   ca. " + mb + " MB";
        };
        var uebernehmen = function(m){
          i.value = m;
          current.mt_min = m;
          current.preset = "custom";
          val.textContent = dauerText(m);
          apply(current);
        };
        i.oninput = function(){ uebernehmen(parseInt(i.value, 10)); };
        val.textContent = dauerText(parseInt(i.value, 10));
        var reihe = document.createElement("div");
        reihe.className = "dnx-mt-schnell";
        reihe.title = "Schnellwahl: so weit laesst sich im Rueckblick hoechstens zurueckscrollen";
        [[0, "aus"], [5, "5 min"], [15, "15 min"], [30, "30 min"], [60, "1 h"],
         [120, "2 h"], [240, "4 h"], [480, "8 h"], [720, "12 h"]].forEach(function(kv){
          var b = document.createElement("button");
          b.type = "button";
          b.textContent = kv[1];
          b.style.cssText = "margin:3px 4px 0 0;padding:3px 8px;border-radius:5px;cursor:pointer;font-size:11px;" +
                            "background:var(--dnx-btn,#14261b);color:var(--dnx-text,#e8f5ec);border:1px solid var(--dnx-accent,#35ff83);";
          b.onclick = function(){ uebernehmen(kv[0]); };
          reihe.appendChild(b);
        });
        sliders[s[0]] = { input: i, val: val };
        feld.appendChild(i);
        feld.appendChild(reihe);
        return;
      }
      sliders[s[0]] = { input: i, val: val };
      feld.appendChild(i);
    });

    function syncInputs(){
      sel.value = current.preset || "custom";
      if(!sel.value){
        var oc = null, ocs = sel.options;
        for(var oi2 = 0; oi2 < ocs.length; oi2++){ if(ocs[oi2].value === "custom"){ oc = ocs[oi2]; break; } }
        if(!oc){ oc = document.createElement("option"); oc.value = "custom"; oc.textContent = "custom"; sel.appendChild(oc); }
        sel.value = "custom";
      }
      Object.keys(colors).forEach(function(k){ if(current[k]) colors[k].value = current[k]; });
      Object.keys(sliders).forEach(function(k){
        sliders[k].input.value = current[k] | 0;
        sliders[k].val.textContent = String(current[k] | 0);
      });
      rhBox.checked = (current.rh | 0) === 1;
      stBox.checked = (current.stan | 0) === 1;
      stfBox.checked = (current.stf | 0) === 1;
      stAusBox.checked = (current.staus | 0) === 1;
      ztBox.checked = (current.mt | 0) === 1;
      ztSel.value = String((current.mt_seite | 0) === 0 ? 0 : 1);
      ztTick.checked = (current.mt_ticks | 0) === 1;
      ztScr.checked = (current.mt_scroller | 0) === 1;
    }
    ui.__sync = syncInputs;

    var rhBox = document.createElement("input");
    rhBox.type = "checkbox";
    rhBox.checked = (current.rh | 0) === 1;
    rhBox.onchange = function(){ current.rh = rhBox.checked ? 1 : 0; apply(current); };
    var rhLbl = document.createElement("label");
    rhLbl.textContent = "Ecken sichtbar ";
    rhLbl.appendChild(rhBox);
    ui.appendChild(rhLbl);

    /* ---- v51: Status-Leiste unten links (Pillen) im Styler-Fenster ---- */
    var stTitel = document.createElement("label");
    stTitel.textContent = "Status-Leiste unten links (Pillen)";
    stTitel.className = "head2";
    ui.appendChild(stTitel);
    var stBox = document.createElement("input");
    stBox.type = "checkbox";
    stBox.checked = (current.stan | 0) === 1;
    stBox.onchange = function(){ current.stan = stBox.checked ? 1 : 0; current.preset = "custom"; apply(current); };
    var stLbl = document.createElement("label");
    stLbl.textContent = "Status-Leiste anpassen ";
    stLbl.appendChild(stBox);
    ui.appendChild(stLbl);
    var stfBox = document.createElement("input");
    stfBox.type = "checkbox";
    stfBox.checked = (current.stf | 0) === 1;
    stfBox.onchange = function(){ current.stf = stfBox.checked ? 1 : 0; current.preset = "custom"; apply(current); };
    var stfLbl = document.createElement("label");
    stfLbl.textContent = "Pillen in meinen Farben ";
    stfLbl.appendChild(stfBox);
    ui.appendChild(stfLbl);
    var stAusBox = document.createElement("input");
    stAusBox.type = "checkbox";
    stAusBox.checked = (current.staus | 0) === 1;
    stAusBox.onchange = function(){ current.staus = stAusBox.checked ? 1 : 0; current.preset = "custom"; apply(current); };
    var stAusLbl = document.createElement("label");
    stAusLbl.textContent = "Status-Leiste ausblenden ";
    stAusLbl.appendChild(stAusBox);
    ui.appendChild(stAusLbl);

    /* ---- v3.86: Status-Leiste hoch/runter/links/rechts setzen ---- */
    var stPosLbl = document.createElement("label");
    stPosLbl.textContent = "Status-Leiste verschieben";
    ui.appendChild(stPosLbl);
    var stPosWert = document.createElement("span");
    stPosWert.className = "val";
    stPosWert.textContent = ((current.stx | 0) || 0) + " / " + ((current.sty | 0) || 0);
    stPosLbl.appendChild(stPosWert);
    var stPosRow = document.createElement("div");
    stPosRow.className = "row";
    function stPosZeichnen(){
      stPosWert.textContent = ((current.stx | 0) || 0) + " / " + ((current.sty | 0) || 0);
    }
    function stPosSchieben(dx, dy){
      current.stx = Math.max(-700, Math.min(700, ((current.stx | 0) || 0) + dx));
      current.sty = Math.max(-500, Math.min(500, ((current.sty | 0) || 0) + dy));
      current.stan = 1;
      stBox.checked = true;
      current.preset = "custom";
      apply(current);
      save(current);
      stPosZeichnen();
      flash("Status-Leiste " + ((current.stx | 0) || 0) + " / " + ((current.sty | 0) || 0));
    }
    function stPosKnopf(txt, tip, dx, dy){
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = txt;
      b.title = tip;
      b.onclick = function(){ stPosSchieben(dx, dy); };
      stPosRow.appendChild(b);
      return b;
    }
    stPosKnopf("◀", "nach links (20 px)", -20, 0);
    stPosKnopf("▲", "nach oben (20 px)", 0, 20);
    var stMitte = document.createElement("button");
    stMitte.type = "button";
    stMitte.textContent = "Mitte";
    stMitte.title = "zurueck in die Mitte";
    stMitte.onclick = function(){
      current.stx = 0; current.sty = 0; current.stan = 1;
      stBox.checked = true; current.preset = "custom"; apply(current); save(current); stPosZeichnen();
      flash("Status-Leiste mittig");
    };
    stPosRow.appendChild(stMitte);
    stPosKnopf("▼", "nach unten (20 px)", 0, -20);
    stPosKnopf("▶", "nach rechts (20 px)", 20, 0);
    ui.appendChild(stPosRow);

    /* ---- v53: Zeit am Wasserfall (Zeitachse + Rueckblick) ---- */
    var ztTitel = document.createElement("label");
    ztTitel.textContent = "Zeit am Wasserfall (Zeitachse + Rueckblick)";
    ztTitel.className = "head2";
    ui.appendChild(ztTitel);
    var ztBox = document.createElement("input");
    ztBox.type = "checkbox";
    ztBox.checked = (current.mt | 0) === 1;
    ztBox.onchange = function(){ current.mt = ztBox.checked ? 1 : 0; current.preset = "custom"; apply(current); };
    var ztLbl = document.createElement("label");
    ztLbl.textContent = "Zeitachse anzeigen ";
    ztLbl.appendChild(ztBox);
    ui.appendChild(ztLbl);
    var ztSel = document.createElement("select");
    [["1", "rechts"], ["0", "links"]].forEach(function(o){
      var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; ztSel.appendChild(op);
    });
    ztSel.value = String((current.mt_seite | 0) === 0 ? 0 : 1);
    ztSel.onchange = function(){ current.mt_seite = parseInt(ztSel.value, 10); current.preset = "custom"; apply(current); };
    field("Seite", ui, ztSel);
    var ztTick = document.createElement("input");
    ztTick.type = "checkbox";
    ztTick.checked = (current.mt_ticks | 0) === 1;
    ztTick.onchange = function(){ current.mt_ticks = ztTick.checked ? 1 : 0; current.preset = "custom"; apply(current); };
    var ztTickLbl = document.createElement("label");
    ztTickLbl.textContent = "feine Sekundenstriche ";
    ztTickLbl.appendChild(ztTick);
    ui.appendChild(ztTickLbl);
    var ztScr = document.createElement("input");
    ztScr.type = "checkbox";
    ztScr.checked = (current.mt_scroller | 0) === 1;
    ztScr.onchange = function(){ current.mt_scroller = ztScr.checked ? 1 : 0; current.preset = "custom"; apply(current); };
    var ztScrLbl = document.createElement("label");
    ztScrLbl.textContent = "Rueckblick-Leiste anzeigen ";
    ztScrLbl.appendChild(ztScr);
    ui.appendChild(ztScrLbl);
    var ztHin = document.createElement("div");
    ztHin.textContent = "Ziehen an der Leiste = alte Minuten zurueck, Doppelklick = wieder live.";
    ztHin.style.cssText = "font-size:12px;opacity:.85;margin:2px 0 4px;";
    ui.appendChild(ztHin);

    /* Paletten-Creator: drei Farben + Name -> neue Vorlage */
    var pcLbl = document.createElement("label");
    pcLbl.textContent = "Eigene Palette (dunkel -> hell)";
    ui.appendChild(pcLbl);
    var pcA = document.createElement("input"); pcA.type = "color"; pcA.value = "#000000";
    var pcB = document.createElement("input"); pcB.type = "color"; pcB.value = "#7f7f7f";
    var pcC = document.createElement("input"); pcC.type = "color"; pcC.value = "#ffffff";
    var pcN = document.createElement("input"); pcN.type = "text"; pcN.placeholder = "Name";
    pcN.style.cssText = "width:78px;";
    var pcRow = document.createElement("div");
    pcRow.className = "row";
    pcRow.appendChild(pcA); pcRow.appendChild(pcB); pcRow.appendChild(pcC); pcRow.appendChild(pcN);
    ui.appendChild(pcRow);
    var pcBtns = document.createElement("div");
    pcBtns.className = "row";
    var pcSave = document.createElement("button");
    pcSave.textContent = "Palette speichern";
    pcSave.onclick = function(){
      var key = dnxPalNeu(pcA.value, pcB.value, pcC.value, String(pcN.value || "").trim());
      fillPresets();
      sel.value = key;
      sel.onchange();
      flash("Palette gespeichert: " + PRESETS[key].name);
    };
    pcBtns.appendChild(pcSave);
    var pcDel = document.createElement("button");
    pcDel.textContent = "Eigene entfernen";
    pcDel.onclick = function(){
      var n = 0, k;
      for(k in PRESETS){ if(PRESETS[k].mine){ delete PRESETS[k]; n++; } }
      dnxPalSave();
      fillPresets();
      flash(n > 0 ? (n + " eigene Palette(n) entfernt") : "keine eigenen Paletten vorhanden");
    };
    pcBtns.appendChild(pcDel);
    ui.appendChild(pcBtns);
    var row = document.createElement("div");
    row.className = "row";
    function btn(txt, fn){
      var b = document.createElement("button");
      b.textContent = txt; b.onclick = fn;
      row.appendChild(b);
      return b;
    }
    btn("Speichern", function(){ save(current); flash("gespeichert"); });
    btn("Export", function(){
      var blob = new Blob([JSON.stringify(current, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "dnx-skin-" + (current.preset || "custom") + ".json";
      document.body.appendChild(a); a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    btn("Import", function(){ fileInput.click(); });
    btn("Reset", function(){ reset(); current = ensureDefaults(JSON.parse(JSON.stringify(PRESETS.dnx))); current.preset = "dnx"; dnxWfReset(); syncInputs(); flash("Original wiederhergestellt"); });
    btn("Schliessen", function(){ dnxUiClose(); });
    ui.appendChild(row);
    var smSel = document.createElement("select");
    [["leds", "LED-Standard: gruen-gelb-orange-rot (dB)"],
     ["leddb", "Linie: LED in dB mit Abstaenden (Palette)"],
     ["lauf", "Linie: Lauflicht links nach rechts"],
     ["farbstat", "Linie: Palette dunkel nach hell (statisch)"],
     ["standard", "Standard (Original, ohne Overlay)"]].forEach(function(o){
      var so = document.createElement("option");
      so.value = o[0]; so.textContent = o[1];
      smSel.appendChild(so);
    });
    smSel.value = smeterStyleId();
    smSel.onchange = function(){
      try{ localStorage.setItem("dnx_styler_smeter_style", smSel.value); }catch(e){}
      smeterVCache = null;
      smeterTheme();
      for(var pi = 0; pi < 5; pi++){ setTimeout(function(){ smeterBarsSnap = 0; smeterTheme(); }, 300 + pi * 500); }
      flash("S-Meter-Stil: " + ((smSel.options[smSel.selectedIndex] || {}).textContent || smSel.value));
    };
    field("S-Meter", ui, smSel);
    dnxWfUi(ui);
    var pfxSel = document.createElement("select");
    PFX.forEach(function(o){
      var po = document.createElement("option");
      po.value = o[0]; po.textContent = o[1];
      pfxSel.appendChild(po);
    });
    pfxSel.value = pfxId();
    pfxSel.onchange = function(){
      try{ localStorage.setItem(PFX_KEY, pfxSel.value); }catch(e){}
      pillFxSync();
      flash("Pillen-Effekt: " + ((pfxSel.options[pfxSel.selectedIndex] || {}).textContent || pfxSel.value));
    };
    field("Pillen-Effekt (" + PFX.length + ")", ui, pfxSel);
    var shName = document.createElement("input");
    shName.type = "text"; shName.id = "dnx-share-name"; shName.maxLength = 28;
    shName.value = shareClean((PRESETS[current.preset] || {}).name || current.name || "Mein DNX", 28);
    field("Eigene Einstellung: Name", ui, shName);
    shareEls.name = shName;
    var shAuth = document.createElement("input");
    shAuth.type = "text"; shAuth.id = "dnx-share-author"; shAuth.maxLength = 24;
    shAuth.value = shareAuth();
    field("In der Liste: dein Name", ui, shAuth);
    shareEls.author = shAuth;
    var shUrl = document.createElement("input");
    shUrl.type = "text"; shUrl.id = "dnx-share-url"; shUrl.maxLength = 80;
    shUrl.value = shareBase();
    field("Teilen-Server", ui, shUrl);
    shareEls.url = shUrl;
    var shRow = document.createElement("div");
    shRow.style.cssText = "margin:4px 0 2px;";
    var shB1 = document.createElement("button");
    shB1.id = "dnx-share-save";
    shB1.textContent = "Auf Server speichern";
    shB1.style.marginRight = "4px";
    shB1.onclick = function(){ dnxShareSave(); };
    var shB2 = document.createElement("button");
    shB2.id = "dnx-share-reload";
    shB2.textContent = "Liste laden";
    shB2.onclick = function(){ dnxShareRefresh(function(){ dnxShareFill(); }); };
    var shB3 = document.createElement("button");
    shB3.id = "dnx-share-std";
    shB3.textContent = "Standard fuer alle";
    shB3.title = "Diesen Zustand (Wasserfall/Spektrum an-aus, Paletten, Aussehen) als Start fuer alle Besucher setzen";
    shB3.style.marginLeft = "4px";
    shB3.onclick = function(){ dnxStdSenden(); };
    shRow.appendChild(shB1);
    shRow.appendChild(shB2);
    shRow.appendChild(shB3);
    ui.appendChild(shRow);
    var shList = document.createElement("select");
    shList.id = "dnx-share-list";
    shList.onchange = function(){ dnxShareApply(shList.value); };
    field("Gemeinsame Einstellungen: auswaehlen", ui, shList);
    shareEls.list = shList;
    var shState = document.createElement("div");
    shState.id = "dnx-share-state";
    shState.style.cssText = "margin-top:2px;font-size:10px;color:#9fb8a8;height:14px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
    shState.textContent = "Teilen: wird geprueft";
    ui.appendChild(shState);
    shareEls.state = shState;
    dnxShareFill();
    dnxShareCount();
    dnxShareTick();
    var smState = document.createElement("div");
    smState.id = "dnx-smeter-state";
    smState.style.cssText = "margin-top:2px;font-size:10px;color:#9fb8a8;height:14px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
    smState.textContent = "S-Meter: wird geprueft";
    ui.appendChild(smState);

    var note = document.createElement("div");
    note.style.cssText = "margin-top:8px;color:#9fb8a8;font-size:10px;";
    note.textContent = "Nur CSS-Overlay + WebAudio: OpenWebRX-Dateien werden nie veraendert. Rote Leiste = verschieben. Ecken-Schalter = Ecken an Receiver, Styler und weiteren Fenstern. Reset = Original.";
    ui.appendChild(note);

    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";
    fileInput.style.display = "none";
    fileInput.onchange = function(){
      var f = fileInput.files && fileInput.files[0];
      if(!f) return;
      var r = new FileReader();
      r.onload = function(){
        try {
          var t = JSON.parse(String(r.result));
          if(t && t.accent){ current = ensureDefaults(t); save(current); apply(current); syncInputs(); flash("Skin geladen"); }
        } catch(e){ flash("ungueltige Skin-Datei"); }
      };
      r.readAsText(f);
    };
    ui.appendChild(fileInput);

    var flashEl = document.createElement("div");
    flashEl.style.cssText = "margin-top:6px;color:#ffe9a8;font-size:11px;height:15px;line-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
    ui.appendChild(flashEl);
    function flash(msg){
      flashEl.textContent = msg;
      setTimeout(function(){ flashEl.textContent = ""; }, 2500);
    }
    ui.__flash = flash;
    uiHooks.sync = syncInputs;
    uiHooks.flash = flash;

    document.body.appendChild(ui);
    ui.addEventListener("pointerdown", dnxRaiseUi, true);
    dnxUiEscHook();
    syncInputs();
    return ui;
  }

  /* ---- v36: Fenster schliessen (X oben rechts, Knopf unten, Escape) ---- */
  function dnxUiClose(){
    var u = document.getElementById("dnx-styler-ui");
    if(u){ u.style.display = "none"; }
    return false;
  }
  function dnxUiEsc(e){
    if(!e || e.key !== "Escape" && e.keyCode !== 27){ return; }
    var u = document.getElementById("dnx-styler-ui");
    if(u && u.style.display && u.style.display !== "none"){ dnxUiClose(); }
  }
  function dnxUiEscHook(){
    if(dnxUiEscHook.on){ return; }
    dnxUiEscHook.on = 1;
    document.addEventListener("keydown", dnxUiEsc, true);
  }
  /* v3.89: Styler oeffnet genau rechts neben dem Empfaenger:
     5 px Abstand, gleiche Oberkante, gleiche Breite und Hoehe. */
  function dnxUiAusrichten(){
    var u = document.getElementById("dnx-styler-ui");
    if(!u){ return; }
    var rcv = document.getElementById("dnx-receiver-overlay");
    var b = rcv ? rcv.getBoundingClientRect() : null;
    var vw = window.innerWidth || document.documentElement.clientWidth || 1536;
    var vh = window.innerHeight || document.documentElement.clientHeight || 864;
    var links = b ? Math.round(b.left + b.width + 5) : 24;
    var oben = b ? Math.round(b.top) : 20;
    var breit = b ? Math.round(b.width) : 330;
    var hoch = b ? Math.round(b.height) : (vh - 40);
    if(links + breit > vw - 4){ links = Math.max(4, vw - breit - 4); }
    if(oben < 2){ oben = 2; }
    if(oben + hoch > vh){ hoch = Math.max(240, vh - oben); }
    /* v3.91: exakt dieselbe Unterkante wie der Empfaenger */
    if(b){ hoch = Math.max(240, Math.round(b.bottom) - oben); }
    u.style.setProperty("left", links + "px", "important");
    u.style.setProperty("top", oben + "px", "important");
    u.style.setProperty("right", "auto", "important");
    u.style.setProperty("bottom", "auto", "important");
    u.style.setProperty("width", breit + "px", "important");
    u.style.setProperty("max-width", breit + "px", "important");
    u.style.setProperty("height", hoch + "px", "important");
    u.style.setProperty("max-height", "none", "important");
    u.style.setProperty("overflow-y", "auto", "important");
    return { links: links, oben: oben, breit: breit, hoch: hoch };
  }
  try{ window.dnxStylerAusrichten = dnxUiAusrichten; }catch(e){}
  function toggleUi(){
    var u = buildUi();
    u.style.display = "block";
    dnxUiAusrichten();
    dnxRaiseUi();
  }

  function addLauncher(){
    if(document.getElementById("dnx-styler-launch")) return true;
    var panel = document.getElementById("openwebrx-panel-receiver");
    if(!panel) return false;
    var b = document.createElement("button");
    b.id = "dnx-styler-launch";
    b.textContent = "DNX Styler";
    b.onclick = toggleUi;
    /* Groesse/Klasse vom Wetter-Button kopieren, falls vorhanden */
    var ref = null;
    panel.querySelectorAll("button").forEach(function(x){
      if(!ref && /wetter|weather/i.test(x.textContent || "")) ref = x;
    });
    if(ref){
      b.className = ref.className;
      if(ref.style && ref.style.cssText) b.style.cssText = ref.style.cssText;
      if(ref.offsetWidth) b.style.minWidth = ref.offsetWidth + "px";
      if(ref.offsetHeight) b.style.height = ref.offsetHeight + "px";
    }
    panel.insertBefore(b, panel.firstChild);
    dnxAnPanel();
    return true;
  }

  function dnxSel(el){
    if(el.id) return "#" + el.id;
    var cls = (typeof el.className === "string" ? el.className : "").trim();
    if(cls){
      var first = cls.split(" ")[0];
      if(first && first.indexOf("dnx-my-corner") !== 0) return el.tagName.toLowerCase() + "." + first;
    }
    return el.tagName.toLowerCase();
  }
  var dnxPickActive = false;
  function dnxWinsInfo(){
    var n = dnxSelList().length;
    return "Fenster: " + n + " gewaehlt (+ Styler, Receiver)";
  }
  function dnxWinTarget(t){
    var node = t, depth = 0, weak = null;
    while(node && node !== document.body && depth < 6){
      depth++;
      var r = null;
      try{ r = node.getBoundingClientRect(); }catch(e){ r = null; }
      if(r && r.width >= 140 && r.height >= 100){
        var cs = null;
        try{ cs = node.__dnxCs || (node.__dnxCs = getComputedStyle(node)); }catch(e2){ cs = null; }
        if(cs && (cs.position === "fixed" || cs.position === "absolute")){
          var bg = cs.backgroundColor || "";
          if((bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") || (parseFloat(cs.borderTopWidth) || 0) >= 1 || (cs.boxShadow && cs.boxShadow !== "none")) return node;
          if(!weak) weak = node;
        }
      }
      node = node.parentElement;
    }
    return weak;
  }
  function dnxWinPickStart(){
    var uiEl = document.getElementById("dnx-styler-ui");
    if(dnxPickActive) return;
    dnxPickActive = true;
    if(ui && ui.__flash) ui.__flash("Fenster anklicken: Ecken an/aus. Rechtsklick/Esc = Abbruch");
    var hoverEl = null, oldOl = "", oldOo = "";
    function hoverOff(){
      if(hoverEl){ hoverEl.style.outline = oldOl; hoverEl.style.outlineOffset = oldOo; hoverEl = null; }
    }
    function move(ev){
      var t = ev.target;
      if(!t || t === document.documentElement || t === document.body || (uiEl && uiEl.contains(t))){ hoverOff(); return; }
      if(t === hoverEl) return;
      hoverOff();
      hoverEl = t;
      oldOl = t.style.outline; oldOo = t.style.outlineOffset;
      t.style.outline = "2px dashed #35ff83";
      t.style.outlineOffset = "1px";
    }
    function esc(ev){
      if(ev.key !== "Escape") return;
      done();
      if(ui && ui.__flash) ui.__flash("Fenster-Auswahl abgebrochen");
    }
    function ctx(ev){
      ev.preventDefault();
      done();
      if(ui && ui.__flash) ui.__flash("Fenster-Auswahl abgebrochen");
    }
    function done(){
      dnxPickActive = false;
      hoverOff();
      document.removeEventListener("click", finish, true);
      document.removeEventListener("mousemove", move, true);
      document.removeEventListener("keydown", esc, true);
      document.removeEventListener("contextmenu", ctx, true);
    }
    function finish(ev){
      var t = ev.target;
      if(!t || (uiEl && uiEl.contains(t))){ done(); return; }
      ev.preventDefault(); ev.stopPropagation();
      var pick = dnxWinTarget(t);
      done();
      if(!pick){ if(ui && ui.__flash) ui.__flash("Kein Fenster erkannt - bitte mitten auf das Fenster klicken"); return; }
      var rcv = dnxRcvHost();
      if(pick === rcv || pick === uiEl){ if(ui && ui.__flash) ui.__flash("Styler und Receiver haben immer Ecken"); return; }
      var sel = dnxPath(pick);
      if(!sel){ if(ui && ui.__flash) ui.__flash("Fenster nicht speicherbar"); return; }
      var list = dnxSelList();
      var at = list.indexOf(sel);
      if(at >= 0){
        list.splice(at, 1); dnxSelListSave(list);
        if(ui && ui.__flash) ui.__flash("Fenster entfernt: " + sel);
      } else if(list.length >= 10){
        if(ui && ui.__flash) ui.__flash("Maximal 10 Fenster");
      } else {
        list.push(sel); dnxSelListSave(list);
        if(ui && ui.__flash) ui.__flash("Fenster hinzugefuegt: " + sel);
      }
      ensureReceiverCorners();
      var wEl = document.getElementById("dnx-wins-info");
      if(wEl) wEl.textContent = dnxWinsInfo();
      console.log("%cDNX-Styler", "background:#35ff83;color:#000;font-weight:700", "Ecken-Fenster: " + JSON.stringify(dnxSelList()));
    }
    document.addEventListener("click", finish, true);
    document.addEventListener("mousemove", move, true);
    document.addEventListener("keydown", esc, true);
    document.addEventListener("contextmenu", ctx, true);
  }
  var smeterBarsCache = [], smeterBarsSnap = 0;
  function smeterBars(){
    var now = Date.now();
    if(smeterBarsCache.length && (now - smeterBarsSnap) < 1200){
      var alive = true;
      for(var a = 0; a < smeterBarsCache.length; a++){
        if(!smeterBarsCache[a].isConnected){ alive = false; break; }
      }
      if(alive) return smeterBarsCache;
    }
    smeterBarsSnap = now;
    var out = [];
    function add(el){
      if(!el || out.indexOf(el) >= 0) return;
      if(el.tagName === "BUTTON" || el.getAttribute("role") === "button") return;
      if(el.id && el.id.indexOf("dnx-") === 0) return;
      if(typeof el.className === "string" && el.className.indexOf("dnx-") >= 0) return;
      out.push(el);
    }
    var i, list, found, rr;
    var roots = [];
    var rp = document.getElementById("openwebrx-panel-receiver");
    if(rp) roots.push(rp);
    var sp = document.getElementById("smeter-panel");
    if(sp && sp.parentNode && roots.indexOf(sp.parentNode) < 0) roots.push(sp.parentNode);
    for(rr = 0; rr < roots.length; rr++){
      try{ found = roots[rr].querySelectorAll('[id*="smeter" i],[class*="smeter" i]'); }
      catch(e0){ found = roots[rr].querySelectorAll('[id*="smeter"],[class*="smeter"]'); }
      for(i = 0; i < found.length; i++){ add(found[i]); }
      if(roots[rr].id && /smeter/i.test(roots[rr].id)) add(roots[rr]);
    }
    if(rp){
      var thinEls = rp.querySelectorAll("div,span,canvas,td,i,b,u,hr"), ti;
      for(ti = 0; ti < thinEls.length; ti++){
        var te = thinEls[ti], tr = null, tcs = null;
        try{ tr = te.getBoundingClientRect(); }catch(ta){ tr = null; }
        if(!tr) continue;
        if(tr.width < 40 || tr.height < 2 || tr.height > 16) continue;
        try{ tcs = getComputedStyle(te); }catch(tb){ tcs = null; }
        if(!tcs) continue;
        if(tcs.backgroundImage === "none" && (tcs.backgroundColor === "rgba(0, 0, 0, 0)" || tcs.backgroundColor === "transparent")) continue;
        if(smeterAct(te) !== "x") continue;
        te.dataset.dnxThin = "1";
        add(te);
      }
    }
    list = document.querySelectorAll("#openwebrx-smeter,#openwebrx-smeter-outer,.openwebrx-smeter,#smeter-bar-container,#smeter-panel,#openwebrx-smeter-bar,.openwebrx-smeter-bar,#smeter-bar-white,#smeter-bar-red,#openwebrx-smeter-db,#smeter-text,#smeter-dbm-text,.smeter-tick-label,.smeter-tick-mark");
    for(i = 0; i < list.length; i++){ add(list[i]); }
    var all;
    try{ all = document.querySelectorAll('[id*="smeter" i],[class*="smeter" i],[id*="s-meter" i],[class*="s-meter" i]'); }
    catch(e1){ all = document.querySelectorAll('[id*="smeter"],[class*="smeter"]'); }
    for(var j = 0; j < all.length; j++){
      var cand = all[j], r;
      if(cand.tagName === "BUTTON") continue;
      if(cand.id && cand.id.indexOf("dnx-") === 0) continue;
      if(typeof cand.className === "string" && cand.className.indexOf("dnx-") >= 0) continue;
      var inRcv = !!(rp && rp.contains(cand));
      try{ r = cand.getBoundingClientRect(); }catch(e2){ continue; }
      if(inRcv){ add(cand); continue; }
      if(r.width >= 30 && r.height >= 2 && r.height <= 90) add(cand);
    }
    smeterBarsCache = out;
    return out;
  }
  function smeterVars(){
    var cs = getComputedStyle(document.documentElement);
    function gv(n){ return cs.getPropertyValue(n).trim(); }
    var glow = parseInt(gv("--dnx-glow"), 10) || 0;
    var acc = gv("--dnx-accent") || "#35ff83";
    var hi = gv("--dnx-accent-hi") || "#b9ffd6";
    var soft = gv("--dnx-accent-soft") || "rgba(53,255,131,.35)";
    var rad = gv("--dnx-radius") || "8px";
    var btn = gv("--dnx-btn") || "#12201a";
    var txt = gv("--dnx-text") || "#e8f5ec";
    var fx = parseFloat(gv("--dnx-fx")) || 0;
    return {
      grad: "linear-gradient(90deg," + acc + " 0%," + hi + " 45%,#ffd75e 75%,#ff5d5d 100%)",
      bsize: "200% 100%",
      shadow: "0 0 " + glow + "px " + soft + ", inset 0 -2px 3px rgba(0,0,0,.35)",
      conBg: "linear-gradient(90deg," + soft + " 0%," + hi + " 50%," + soft + " 100%)," + btn,
      conSh: "0 0 " + Math.max(2, glow) + "px " + soft,
      radius: "calc(" + rad + " / 2)",
      flow: "dnxSmeterFlow " + (4.6 - fx * 0.02).toFixed(2) + "s linear infinite",
      hueAnim: "dnxSmeterHue " + (6 - fx * 0.03).toFixed(2) + "s linear infinite",
      glowAnim: "dnxSmeterGlow " + (4.2 - fx * 0.015).toFixed(2) + "s ease-in-out infinite",
      textCol: txt,
      textSh: "0 0 " + glow + "px " + soft,
      trackBg: "rgba(0,0,0,.8)",
      lineAnim: "dnxSmeterHue 6s linear infinite, dnxSmeterGlow 4.2s ease-in-out infinite",
      dashAnim: "dnxSmeterDashes 1.4s linear infinite",
      vgMode: "", vgGrad: "", vgGap: "", vgAnim: ""
    };
  }
  function smeterStyleId(){
    var ok = { standard: 1, lauf: 1, farbstat: 1, leddb: 1, leds: 1 };
    var s = "leds";
    try{ s = localStorage.getItem("dnx_styler_smeter_style") || "leds"; }catch(e){}
    return ok[s] ? s : "leds";
  }
  function dnxSmeterGate(){
    var r = document.documentElement;
    var use = r.classList.contains("dnx-styled") && smeterStyleId() !== "standard";
    try{ if(localStorage.getItem("dnx_styler_smeter") === "0") use = false; }catch(e){}
    if(use){ r.classList.add("dnx-smeter"); } else { r.classList.remove("dnx-smeter"); }
  }
  function smeterStyleVars(sid){
    var b = smeterVars();
    var cs = getComputedStyle(document.documentElement);
    var G = parseInt(cs.getPropertyValue("--dnx-glow"), 10) || 0;
    var fx = parseFloat(cs.getPropertyValue("--dnx-fx")) || 0;
    if(sid === "regenbogen"){
      b.grad = "linear-gradient(90deg,#ff0044 0%,#ff8a00 18%,#ffe600 36%,#37e800 54%,#00cfff 72%,#5a5aff 86%,#c400ff 100%)";
      b.bsize = "200% 100%";
      b.flow = "dnxSmeterFlow 2.6s linear infinite";
      b.hueAnim = "dnxSmeterHue 3s linear infinite";
      b.lineAnim = "dnxSmeterHue 2.4s linear infinite";
      b.dashAnim = "dnxSmeterDashes .6s linear infinite";
      b.shadow = "0 0 " + G + "px rgba(255,0,170,.45), 0 0 " + Math.round(G * 1.6) + "px rgba(0,200,255,.25), inset 0 -2px 3px rgba(0,0,0,.35)";
      b.conBg = "linear-gradient(90deg,rgba(255,0,170,.16),rgba(0,200,255,.16)),#0a0d10";
      b.conSh = "0 0 " + Math.max(3, G) + "px rgba(255,120,220,.40)";
      b.textCol = "#ffffff";
      b.textSh = "0 0 " + G + "px rgba(255,255,255,.40)";
    } else if(sid === "led"){
      b.grad = "repeating-linear-gradient(90deg,rgba(0,0,0,.62) 0 2px,transparent 2px 8px),linear-gradient(90deg,#25d94a 0 55%,#ffe14d 55% 80%,#ff4141 80% 100%)";
      b.bsize = "8px 100%,100% 100%";
      b.shadow = "0 0 " + G + "px rgba(70,255,130,.35), inset 0 -2px 3px rgba(0,0,0,.45)";
      b.conBg = "#060a07";
      b.conSh = "0 0 " + Math.max(3, G) + "px rgba(70,255,130,.30)";
      b.textCol = "#8dffa6";
      b.textSh = "0 0 " + G + "px rgba(70,255,130,.45)";
      b.radius = "3px";
      b.flow = "dnxSmeterLed .95s linear infinite";
      b.hueAnim = "dnxSmeterHue 1.6s steps(6) infinite";
      b.lineAnim = "dnxSmeterLedHue 1.6s steps(6) infinite, dnxSmeterLedBlink .95s steps(2) infinite";
      b.dashAnim = "dnxSmeterDashes .45s steps(6) infinite";
    } else if(sid === "neon"){
      b.grad = "linear-gradient(90deg,#00e5ff 0%,#00ffa3 40%,#c400ff 100%)";
      b.bsize = "240% 100%";
      b.shadow = "0 0 " + G + "px rgba(0,229,255,.55), 0 0 " + Math.round(G * 1.6) + "px rgba(196,0,255,.35), inset 0 -2px 3px rgba(0,0,0,.35)";
      b.conBg = "#05070c";
      b.conSh = "0 0 " + Math.max(3, G) + "px rgba(0,229,255,.35), 0 0 " + Math.round(G * 1.4) + "px rgba(196,0,255,.25)";
      b.textCol = "#aef7ff";
      b.textSh = "0 0 " + G + "px rgba(0,229,255,.5)";
      b.flow = "dnxSmeterFlow 3.2s linear infinite, dnxSmeterNeonPulse 2.6s ease-in-out infinite";
      b.hueAnim = "dnxSmeterHue 2.2s ease-in-out infinite";
      b.lineAnim = "dnxSmeterNeonBreathe 2.6s ease-in-out infinite";
      b.dashAnim = "dnxSmeterDashes 1.9s linear infinite";
    } else if(sid === "welle"){
      b.lineAnim = "dnxSmeterWave 3.4s ease-in-out infinite";
      b.dashAnim = "dnxSmeterDashes 2.4s linear infinite";
      b.flow = "dnxSmeterFlow 4s linear infinite";
    } else if(sid === "lauflicht"){
      b.lineAnim = "none";
      b.dashAnim = "dnxSmeterDashes .5s linear infinite";
      b.flow = "dnxSmeterFlow 1.2s linear infinite";
    } else if(sid === "puls"){
      b.lineAnim = "dnxSmeterPulsW 1.6s ease-in-out infinite";
      b.dashAnim = "none";
      b.flow = "none";
    } else if(sid === "blink"){
      b.lineAnim = "dnxSmeterBlink .7s steps(2) infinite";
      b.dashAnim = "dnxSmeterDashes .9s steps(2) infinite";
      b.flow = "none";
    } else if(sid === "lauf"){
      b.lineAnim = "none";
      b.dashAnim = "none";
      b.flow = "none";
      b.vgMode = "sweep";
      b.vgGrad = "linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.85) 50%,rgba(255,255,255,0) 100%)";
      b.vgGap = "";
      b.vgAnim = "dnxLineSweep 2.6s linear infinite";
    } else if(sid === "farbstat"){
      b.lineAnim = "none";
      b.dashAnim = "none";
      b.flow = "none";
      b.vgMode = "full";
      b.vgGrad = dnxPalGrad();
      b.vgGap = "";
      b.vgAnim = "none";
    } else if(sid === "leddb"){
      b.lineAnim = "none";
      b.dashAnim = "none";
      b.flow = "none";
      b.vgMode = "level";
      b.vgGrad = dnxPalGrad();
      b.vgGap = "repeating-linear-gradient(90deg,rgba(0,0,0,.92) 0 2px,transparent 2px 10px)";
      b.vgAnim = "none";
    } else if(sid === "leds"){
      /* v34: klassische LED-Kette, links nach rechts, Laenge = Pegel in dB */
      b.grad = "linear-gradient(90deg,rgba(6,6,6,.96),rgba(6,6,6,.96))";
      b.bsize = "100% 100%";
      b.shadow = "inset 0 0 4px rgba(0,0,0,.92)";
      b.lineAnim = "none";
      b.dashAnim = "none";
      b.flow = "none";
      b.vgMode = "level";
      b.vgGrad = "linear-gradient(90deg,#00a010 0%,#12d000 24%,#7fe000 40%,#d8ee00 54%,#ffe100 64%,#ffab00 78%,#ff6a00 88%,#ff2200 100%)";
      b.vgGap = "repeating-linear-gradient(90deg,transparent 0 7px,rgba(0,0,0,.92) 7px 10px)";
      b.vgAnim = "none";
    }
    return b;
  }
  var smeterSheetObs = null;
  function dnxSmeterSheet(v){
    var st = document.getElementById("dnx-smeter-sheet");
    if(!st){
      st = document.createElement("style");
      st.id = "dnx-smeter-sheet";
      (document.head || document.documentElement).appendChild(st);
      if(!smeterSheetObs){
        smeterSheetObs = new MutationObserver(function(){
          var cur = document.getElementById("dnx-smeter-sheet");
          if(cur && cur.__dnxCss && cur.textContent !== cur.__dnxCss) cur.textContent = cur.__dnxCss;
        });
        smeterSheetObs.observe(document.head || document.documentElement, { childList: true });
      }
    }
    function pfx(s){ return "html.dnx-styled.dnx-smeter " + s.split(",").join(",html.dnx-styled.dnx-smeter "); }
    var css = pfx("#smeter-panel,#smeter-panel *,#openwebrx-smeter,#openwebrx-smeter *,#smeter-bar-container,#smeter-bar-container *") +
      "{background-image:none !important;background-color:transparent !important;border:0 !important;box-shadow:none !important;}" +
      pfx("#openwebrx-smeter,#openwebrx-smeter-outer,.openwebrx-smeter,#smeter-bar-container") +
      "{background:rgba(0,0,0,.8) !important;border-radius:" + v.radius + " !important;box-shadow:" + v.conSh + " !important;}" +
      pfx("#smeter-panel") +
      "{background:transparent !important;border:0 !important;box-shadow:none !important;border-radius:0 !important;}" +
      pfx("#openwebrx-smeter-bar,.openwebrx-smeter-bar,#smeter-bar-white,#smeter-bar-red") +
      "{background-image:" + v.grad + " !important;background-size:" + v.bsize + " !important;box-shadow:" + v.shadow + " !important;border-radius:" + v.radius + " !important;}" +
      pfx(".smeter-tick-label") +
      "{color:" + v.textCol + " !important;text-shadow:" + v.textSh + " !important;}" +
      pfx("#smeter-panel .smeter-tick-mark,.smeter-tick-mark") + "{background-color:" + v.textCol + " !important;}" +
      pfx("#openwebrx-smeter::after,.openwebrx-smeter::after,#openwebrx-smeter-outer::after") + "{animation:" + v.dashAnim + " !important;background-repeat:repeat !important;}";
    if(st.__dnxCss !== css){ st.__dnxCss = css; st.textContent = css; }
  }
  function dnxSmeterSheetOff(){
    var st = document.getElementById("dnx-smeter-sheet");
    if(st && st.__dnxCss){ st.__dnxCss = ""; st.textContent = ""; }
  }
  function smeterAct(el){
    var idc = ((el.id || "") + " " + (typeof el.className === "string" ? el.className : "")).toLowerCase().trim();
    if(/dbm|[-_]db([-_]|$)/.test(idc)) return "d";
    if(/text|label|tick|mark/.test(idc)) return "t";
    if(/outer|-container|panel/.test(idc)) return "c";
    var id2 = (el.id || "").toLowerCase();
    if(id2 === "openwebrx-smeter") return "c";
    if(typeof el.className === "string" && /(^|\s)openwebrx-smeter(\s|$)/.test(el.className)) return "c";
    if(/(^|[-_\s])d\s?b([-_\s]|$)/.test(idc)) return "d";
    if(/bar/.test(idc)) return "b";
    if(/s[-_]?meter/.test(idc)) return "b";
    if(el.dataset && el.dataset.dnxThin === "1") return "h";
    return "x";
  }
  function smeterRestore(b){
    if(b.dataset.dnxSm !== "1") return;
    var rp = ["background", "box-shadow", "border-radius", "background-image", "background-size", "animation", "color", "text-shadow", "border"];
    for(var q = 0; q < rp.length; q++){
      var val = b.dataset["dnxO" + q];
      if(val !== undefined && b.style.getPropertyValue(rp[q]) !== val) b.style.setProperty(rp[q], val, "important");
    }
    if(smeterObs && smeterObs.takeRecords) smeterObs.takeRecords();
    b.dataset.dnxSm = "0";
  }
  var dnxLineOvList = [], dnxLineOvCfg = null, dnxLineRAF = 0, dnxLineTxtT = 0;
  function dnxLineOv(b, v){
    var need = !!(v && v.vgMode);
    var ov = b.__dnxOv;
    if(!need){
      if(ov && ov.parentNode) ov.parentNode.removeChild(ov);
      b.__dnxOv = null;
      return null;
    }
    if(!ov || !ov.parentNode){
      ov = document.createElement("div");
      ov.className = "dnx-line-ov";
      b.style.setProperty("position", "relative", "important");
      b.style.setProperty("overflow", "hidden", "important");
      b.appendChild(ov);
      b.__dnxOv = ov;
      ov.__dnxBox = b;
      dnxLineOvList.push(ov);
    }
    dnxLineOvCfg = v;
    if(!dnxLineRAF) dnxLineRAF = requestAnimationFrame(dnxLineLoop);
    return ov;
  }
  function dnxLineLevel(b){
    var bar = document.getElementById("openwebrx-smeter-bar") || (b ? b.querySelector(".openwebrx-smeter-bar") : null);
    if(!bar) return -1;
    var t = "";
    try{ t = (bar.style && bar.style.transform) || ""; }catch(e0){}
    var m = /translate\(\s*(-?[\d.]+)%/.exec(t);
    if(m){ var x = parseFloat(m[1]); if(isFinite(x)) return Math.min(1, Math.max(0, 1 + x / 100)); }
    var cs = null;
    try{ cs = getComputedStyle(bar).transform; }catch(e1){}
    if(cs && cs.indexOf("matrix") === 0){
      var p = cs.replace(/matrix\(|\)/g, "").split(",");
      var ex = parseFloat(p[4]);
      if(isFinite(ex)){
        var bw = bar.offsetWidth || (b ? b.clientWidth : 0) || 0;
        if(bw) return Math.min(1, Math.max(0, 1 + ex / bw));
      }
    }
    try{
      var bw2 = (b ? (b.clientWidth || b.getBoundingClientRect().width) : 0) || 0;
      var w2 = bar.getBoundingClientRect().width || 0;
      if(bw2) return Math.min(1, Math.max(0, w2 / bw2));
    }catch(e2){}
    return -1;
  }
  function dnxLineLoop(){
    dnxLineRAF = 0;
    try{ dnxLineStep(); }catch(e){}
    if(dnxLineOvCfg) dnxLineRAF = requestAnimationFrame(dnxLineLoop);
  }
  function dnxLineStep(){
    var v = dnxLineOvCfg;
    if(!v || document.hidden) return;
    var mode = v.vgMode, grad = v.vgGrad, gap = v.vgGap, anim = v.vgAnim || "none";
    var lvl2 = -1;
    for(var i = dnxLineOvList.length - 1; i >= 0; i--){
      var ov = dnxLineOvList[i];
      if(!ov || !ov.parentNode){ dnxLineOvList.splice(i, 1); continue; }
      var bx = ov.__dnxBox;
      var w;
      if(mode === "sweep"){ w = 45; } else if(mode === "full"){ w = 100; }
      else {
        var lvl = bx ? dnxLineLevel(bx) : -1;
        if(lvl < 0) lvl = (ov.__dnxLvl >= 0 ? ov.__dnxLvl : 0);
        ov.__dnxLvl = lvl;
        lvl2 = lvl;
        w = Math.max(0.6, lvl * 100);
      }
      if(ov.__dnxMode !== mode || ov.__dnxAnim !== anim){
        ov.__dnxMode = mode; ov.__dnxAnim = anim;
        ov.style.setProperty("position", "absolute", "important");
        ov.style.setProperty("top", "0", "important");
        ov.style.setProperty("height", "100%", "important");
        ov.style.setProperty("pointer-events", "none", "important");
        ov.style.setProperty("z-index", "5", "important");
        ov.style.setProperty("background-repeat", "no-repeat", "important");
        ov.style.setProperty("background-image", (gap ? gap + "," + grad : grad), "important");
        ov.style.setProperty("animation", anim, "important");
        ov.style.left = "0";
        ov.__dnxW = -1;
      }
      if(!ov.__dnxW || Math.abs(ov.__dnxW - w) > 0.3){
        ov.__dnxW = w;
        ov.style.setProperty("width", w.toFixed(1) + "%", "important");
        if(mode === "sweep"){
          ov.style.setProperty("background-size", "100% 100%", "important");
        } else {
          ov.style.setProperty("background-size", (gap ? "auto," : "") + String((10000 / w).toFixed(1)) + "% 100%", "important");
        }
      }
    }
    if(mode === "sweep" || mode === "full" || lvl2 >= 0){
      var now = Date.now();
      if(now - dnxLineTxtT > 400){
        dnxLineTxtT = now;
        var el = document.getElementById("dnx-smeter-state");
        if(el){
          var db = document.getElementById("openwebrx-smeter-db");
          var dbt = db ? String(db.textContent).replace(/\s+/g, " ").trim() : "-";
          var ltxt = (mode === "sweep") ? "Linie Lauflicht" : (mode === "full" ? "Palette statisch" : ("Linie " + Math.round(lvl2 * 100) + "%"));
          el.textContent = "S-Meter " + smeterFound + "/" + smeterDone + " | " + ltxt + " | " + dbt;
        }
      }
    }
  }
  function dnxLineClear(){
    dnxLineOvCfg = null;
    for(var i = 0; i < dnxLineOvList.length; i++){
      var ov = dnxLineOvList[i];
      if(ov && ov.parentNode) ov.parentNode.removeChild(ov);
      if(ov && ov.__dnxBox) ov.__dnxBox.__dnxOv = null;
    }
    dnxLineOvList = [];
    if(dnxLineRAF){ try{ cancelAnimationFrame(dnxLineRAF); }catch(e){} dnxLineRAF = 0; }
  }
  function dnxPalGrad(){
    try{
      var cs = getComputedStyle(document.documentElement);
      var g = cs.getPropertyValue("--dnx-pal");
      if(g && String(g).indexOf("gradient") >= 0) return String(g).trim();
    }catch(e){}
    return "linear-gradient(90deg,#000208 0%,#001a5e 18%,#0049d8 34%,#00b7ff 48%,#00e08a 60%,#54ff2e 72%,#ffe14d 84%,#ff7a1a 92%,#ffffff 100%)";
  }
  function smeterTheme(){
    var on = document.documentElement.classList.contains("dnx-styled");
    dnxSmeterGate();
    var bars = smeterBars();
    if(!bars.length) return;
    if(document.hidden) return;
    var sid = smeterStyleId();
    var off = (sid === "standard");
    try{ if(localStorage.getItem("dnx_styler_smeter") === "0") off = true; }catch(e){}
    var v = (sid === "vorlage") ? (smeterVCache || (smeterVCache = smeterVars())) : smeterStyleVars(sid);
    if(off){ dnxSmeterSheetOff(); } else { dnxSmeterSheet(v); }
    if(off || !on || !v.vgMode){ dnxLineClear(); }
    for(var i = 0; i < bars.length; i++){
      var b = bars[i];
      if(!on || off){ smeterRestore(b); continue; }
      var act = smeterAct(b);
      if(b.dataset.dnxSm !== "1"){
        var dp = ["background", "box-shadow", "border-radius", "background-image", "background-size", "animation", "color", "text-shadow", "border"];
        for(var q2 = 0; q2 < dp.length; q2++){ b.dataset["dnxO" + q2] = b.style.getPropertyValue(dp[q2]) || ""; }
        b.dataset.dnxSm = "1";
      }
      if(act === "x" || act === "d"){
        /* nicht anfassen: unklare Elemente und die dB-Anzeige bleiben original */
        smeterRestore(b);
      } else if(act === "c"){
        var pid = (b.id || "").toLowerCase();
        if(pid.indexOf("panel") >= 0){
          if(b.style.getPropertyValue("background") !== "transparent") b.style.setProperty("background", "transparent", "important");
          if(b.style.getPropertyValue("background-image") !== "none") b.style.setProperty("background-image", "none", "important");
          if(b.style.getPropertyValue("border") !== "0") b.style.setProperty("border", "0", "important");
          if(b.style.getPropertyValue("box-shadow") !== "none") b.style.setProperty("box-shadow", "none", "important");
        } else {
          if(b.style.getPropertyValue("border-radius") !== v.radius) b.style.setProperty("border-radius", v.radius, "important");
          if(b.style.getPropertyValue("box-shadow") !== v.conSh) b.style.setProperty("box-shadow", v.conSh, "important");
          if(b.style.getPropertyValue("animation") !== v.lineAnim) b.style.setProperty("animation", v.lineAnim, "important");
          dnxLineOv(b, v);
        }
      } else if(act === "t"){
        if(b.style.getPropertyValue("background") !== "transparent") b.style.setProperty("background", "transparent", "important");
        if(b.style.getPropertyValue("background-image") !== "none") b.style.setProperty("background-image", "none", "important");
        if(b.style.getPropertyValue("border") !== "0") b.style.setProperty("border", "0", "important");
        if(b.style.getPropertyValue("box-shadow") !== "none") b.style.setProperty("box-shadow", "none", "important");
        if(b.style.getPropertyValue("border-radius") !== "0") b.style.setProperty("border-radius", "0", "important");
        if(b.style.getPropertyValue("animation") !== "none") b.style.setProperty("animation", "none", "important");
        if(b.style.getPropertyValue("color") !== v.textCol) b.style.setProperty("color", v.textCol, "important");
        if(b.style.getPropertyValue("text-shadow") !== v.textSh) b.style.setProperty("text-shadow", v.textSh, "important");
      } else if(act === "h"){
        if(b.style.getPropertyValue("border-radius") !== v.radius) b.style.setProperty("border-radius", v.radius, "important");
        if(b.style.getPropertyValue("animation") !== v.hueAnim) b.style.setProperty("animation", v.hueAnim, "important");
        if(b.style.getPropertyValue("box-shadow") !== v.conSh) b.style.setProperty("box-shadow", v.conSh, "important");
      } else {
        if(b.style.getPropertyValue("background-image") !== v.grad) b.style.setProperty("background-image", v.grad, "important");
        if(b.style.getPropertyValue("background-size") !== v.bsize) b.style.setProperty("background-size", v.bsize, "important");
        if(b.style.getPropertyValue("box-shadow") !== v.shadow) b.style.setProperty("box-shadow", v.shadow, "important");
        if(b.style.getPropertyValue("border-radius") !== v.radius) b.style.setProperty("border-radius", v.radius, "important");
        if(b.style.getPropertyValue("animation") !== v.flow) b.style.setProperty("animation", v.flow, "important");
      }
      if(smeterObs && smeterObs.takeRecords) smeterObs.takeRecords();
    }
    var dFound = bars.length, dDone = 0;
    for(var d = 0; d < bars.length; d++){ if(smeterAct(bars[d]) !== "x" && smeterAct(bars[d]) !== "d") dDone++; }
    smeterFound = dFound; smeterDone = dDone;
    smeterState();
  }
  var smeterFound = 0, smeterDone = 0;
  function smeterState(){
    var el = document.getElementById("dnx-smeter-state");
    if(!el) return;
    if(dnxLineOvCfg && dnxLineOvCfg.vgMode) return;
    var names = [], bl = smeterBarsCache || [];
    for(var i2 = 0; i2 < bl.length && i2 < 3; i2++){ names.push(bl[i2].id || bl[i2].tagName); }
    el.textContent = "S-Meter: " + smeterFound + " gefunden, " + smeterDone + " gefaerbt" + (names.length ? " [" + names.join(", ") + "]" : "");
  }
  var smeterObs = null, smeterApplying = false, smeterEl = null, smeterPassT = 0, smeterPasses = 0, smeterVCache = null;
  var smeterEls = [];
  function attachSmeterObserver(){
    var bars = smeterBars();
    if(!bars.length) return;
    var same = (bars.length === smeterEls.length);
    if(same){
      for(var i = 0; i < bars.length; i++){ if(bars[i] !== smeterEls[i]){ same = false; break; } }
    }
    if(same) return;
    smeterEls = bars.slice(0);
    if(smeterObs){ smeterObs.disconnect(); }
    smeterObs = new MutationObserver(function(){
      if(document.hidden) return;
      var now = Date.now();
      if(now - smeterPassT > 1000){ smeterPassT = now; smeterPasses = 0; }
      if(++smeterPasses > 150) return;
      smeterTheme();
    });
    for(var k = 0; k < smeterEls.length; k++){
      smeterObs.observe(smeterEls[k], { attributes: true, attributeFilter: ["style"] });
    }
    smeterTheme();
  }
  function dnxRcvHost(){
    var overlay = document.getElementById("dnx-receiver-overlay");
    if(!overlay) return null;
    var probe = overlay.querySelector(".dnx-rh-nw,.dnx-rh-ne,.dnx-rh-sw,.dnx-rh-se,.dnx-rh-w,.dnx-rh-e,.dnx-resize-handle");
    return (probe && probe.parentElement && probe.parentElement !== document.body) ? probe.parentElement : overlay;
  }
  function dnxPath(el){
    if(!el || el.nodeType !== 1) return null;
    if(el.id) return "#" + el.id;
    var parts = [], node = el, guard = 0;
    while(node && node !== document.body && guard < 6){
      guard++;
      var p = node.tagName ? node.tagName.toLowerCase() : "div";
      var cls = (typeof node.className === "string") ? node.className.trim() : "";
      if(cls){
        var c = cls.split(/\s+/)[0];
        if(c && c.indexOf("dnx-my-corner") !== 0 && c.indexOf("dnx-corner-frame") !== 0) p += "." + c;
      }
      var idx = 1, sib = node;
      while((sib = sib.previousElementSibling)){ if(sib.tagName === node.tagName) idx++; }
      parts.unshift(p + ":nth-of-type(" + idx + ")");
      var sel = parts.join(" > ");
      try{ if(document.querySelectorAll(sel).length === 1) return sel; }catch(e){}
      node = node.parentElement;
    }
    return parts.length ? parts.join(" > ") : null;
  }
  function dnxSelList(){
    var out = [];
    try{
      var raw = localStorage.getItem("dnx_styler_wins");
      if(raw){
        var arr = JSON.parse(raw);
        for(var i = 0; i < arr.length; i++){ if(typeof arr[i] === "string") out.push(arr[i]); }
      }
    }catch(e){}
    return out;
  }
  function dnxSelListSave(arr){
    try{ localStorage.setItem("dnx_styler_wins", JSON.stringify(arr || [])); }catch(e){}
  }
  function dnxWindows(force){
    var out = [];
    function push(el){
      if(!el || out.indexOf(el) >= 0) return;
      var r;
      try{ r = el.getBoundingClientRect(); }catch(e){ return; }
      if(r.width < 60 || r.height < 40) return;
      out.push(el);
    }
    push(dnxRcvHost());
    push(document.getElementById("dnx-styler-ui"));
    var more = null;
    try{ more = document.querySelectorAll('#dnx-fm-window,[id^="dnx-"][id$="-window"],.dnx-popup,.dnx-compact'); }catch(e2){ more = []; }
    for(var i = 0; i < more.length; i++){ push(more[i]); }
    var scan = null;
    try{ scan = document.querySelectorAll('[id*="fenster" i],[class*="fenster" i],[id*="window" i],[class*="window" i],[id*="popup" i],[class*="popup" i]'); }catch(e4){ scan = []; }
    var rcvH = dnxRcvHost();
    for(var s = 0; s < scan.length && out.length < 14; s++){
      var cEl = scan[s];
      if(!cEl || cEl === document.body || cEl === document.documentElement) continue;
      if(cEl.id === "dnx-styler-ui" || cEl.id === "dnx-styler-launch") continue;
      if(/dnx-corner-frame|dnx-my-corner/.test(String(cEl.className || ""))) continue;
      if(rcvH && (rcvH === cEl || rcvH.contains(cEl) || cEl.contains(rcvH))) continue;
      var cr = null;
      try{ cr = cEl.getBoundingClientRect(); }catch(e5){ cr = null; }
      if(!cr || cr.width < 200 || cr.height < 130) continue;
      var ccs = null;
      try{ ccs = getComputedStyle(cEl); }catch(e6){ ccs = null; }
      if(!ccs || ccs.display === "none" || ccs.visibility === "hidden") continue;
      if(ccs.position !== "fixed" && ccs.position !== "absolute") continue;
      var cbg = ccs.backgroundColor || "";
      if(!((cbg && cbg !== "transparent" && cbg !== "rgba(0, 0, 0, 0)") || (parseFloat(ccs.borderTopWidth) || 0) >= 1 || (ccs.boxShadow && ccs.boxShadow !== "none"))) continue;
      push(cEl);
    }
    var sel = dnxSelList();
    for(var j = 0; j < sel.length; j++){
      var el2 = null;
      try{ el2 = document.querySelector(sel[j]); }catch(e3){ el2 = null; }
      if(el2) push(el2);
    }
    return out;
  }
  var dnxFrames = [];
  function dnxCornerCoveredByScanner(corner, host, scanner, sr){
    if(!scanner || !host || host === scanner || !sr) return false;
    try{ if(scanner.contains(host)) return false; }catch(e){}
    var cr = null;
    try{ cr = corner.getBoundingClientRect(); }catch(e2){ cr = null; }
    if(!cr) return false;
    var left = Math.max(cr.left, sr.left), right = Math.min(cr.right, sr.right);
    var top = Math.max(cr.top, sr.top), bottom = Math.min(cr.bottom, sr.bottom);
    if(right <= left || bottom <= top) return false;
    var x = (left + right) / 2, y = (top + bottom) / 2, stack = [];
    try{ stack = document.elementsFromPoint(x, y) || []; }
    catch(e3){ try{ var one = document.elementFromPoint(x, y); if(one) stack = [one]; }catch(e4){} }
    for(var i = 0; i < stack.length; i++){
      var hit = stack[i];
      if(!hit) continue;
      try{ if(hit.closest && hit.closest(".dnx-corner-frame")) continue; }catch(e5){}
      try{ return hit === scanner || scanner.contains(hit); }catch(e6){ return hit === scanner; }
    }
    return false;
  }
  function dnxFrameSync(){
    var scanner = null, scannerRect = null;
    try{
      scanner = document.getElementById("dnx-fm-window");
      if(scanner){
        var scs = getComputedStyle(scanner);
        if(scs.display !== "none" && scs.visibility !== "hidden" && parseFloat(scs.opacity || "1") > 0){
          scannerRect = scanner.getBoundingClientRect();
          if(scannerRect.width < 2 || scannerRect.height < 2) scannerRect = null;
        }
      }
    }catch(e){}
    for(var i = dnxFrames.length - 1; i >= 0; i--){
      var f = dnxFrames[i], h = f.__dnxHost;
      if(!h || !h.isConnected){ f.remove(); dnxFrames.splice(i, 1); continue; }
      var r = null;
      try{ r = h.getBoundingClientRect(); }catch(e2){ r = null; }
      if(!r || r.width < 2 || r.height < 2){ f.style.display = "none"; continue; }
      f.style.display = "block";
      f.style.width = Math.round(r.width) + "px";
      f.style.height = Math.round(r.height) + "px";
      f.style.transform = "translate(" + Math.round(r.left) + "px," + Math.round(r.top) + "px)";
      for(var ci = 0; ci < f.children.length; ci++){
        var corner = f.children[ci];
        if(corner.classList && corner.classList.contains("dnx-my-corner")){
          corner.style.visibility = dnxCornerCoveredByScanner(corner, h, scanner, scannerRect) ? "hidden" : "";
        }
      }
    }
  }
  try{ window.dnxEckenSync = dnxFrameSync; }catch(e){}
  function dnxFrameFor(host, soft){
    for(var i = 0; i < dnxFrames.length; i++){ if(dnxFrames[i].__dnxHost === host) return dnxFrames[i]; }
    var f = document.createElement("div");
    f.className = "dnx-corner-frame";
    f.__dnxHost = host;
    ["nw", "ne", "sw", "se"].forEach(function(k){
      var c = document.createElement("div");
      c.className = "dnx-my-corner dnx-my-corner-" + k;
      if(!soft){ c.classList.add("dnx-grab"); c.addEventListener("mousedown", dnxWinGrab(host, k), true); }
      f.appendChild(c);
    });
    document.body.appendChild(f);
    dnxFrames.push(f);
    return f;
  }
  function dnxRaiseUi(){
    var u = document.getElementById("dnx-styler-ui");
    if(!u) return;
    var z = 0;
    try{ z = parseInt(getComputedStyle(u).zIndex, 10) || 0; }catch(e){ z = 0; }
    if(z < 2147483646) u.style.zIndex = "2147483646";
    if(u.nextElementSibling && !u.__dnxRaising){
      u.__dnxRaising = true;
      document.addEventListener("pointerup", function pu(ev){
        document.removeEventListener("pointerup", pu, true);
        u.__dnxRaising = false;
        /* Klick innerhalb des Stylers: NICHT neu anhaengen, sonst schliesst die Auswahlliste */
        if(ev && ev.target && u.contains(ev.target)){ return; }
        try{ if(u.parentNode) u.parentNode.appendChild(u); }catch(e2){}
        dnxFrameSync();
      }, true);
    }
  }
  function dnxWinGrab(host, dir){
    var west = (dir === "nw" || dir === "sw"), north = (dir === "nw" || dir === "ne");
    return function(ev){
      if(ev.button !== 0) return;
      ev.preventDefault(); ev.stopPropagation();
      var r = host.getBoundingClientRect();
      var x0 = r.left, y0 = r.top, w0 = r.width, h0 = r.height;
      var minW = (host.id === "dnx-styler-ui") ? 240 : 160;
      var minH = (host.id === "dnx-styler-ui") ? 220 : 120;
      var sx = ev.clientX, sy = ev.clientY;
      function mv(e2){
        var dx = e2.clientX - sx, dy = e2.clientY - sy;
        var w = Math.max(minW, west ? w0 - dx : w0 + dx);
        var h = Math.max(minH, north ? h0 - dy : h0 + dy);
        host.style.width = w + "px";
        host.style.height = h + "px";
        if(west){ host.style.left = (x0 + (w0 - w)) + "px"; host.style.right = "auto"; }
        if(north){ host.style.top = (y0 + (h0 - h)) + "px"; host.style.bottom = "auto"; }
        dnxFrameSync();
      }
      function up(){
        document.removeEventListener("mousemove", mv, true);
        document.removeEventListener("mouseup", up, true);
        dnxFrameSync();
      }
      document.addEventListener("mousemove", mv, true);
      document.addEventListener("mouseup", up, true);
    };
  }
  function dnxFrontWindow(hosts){
    var best = null, bestZ = -Infinity, bestOrder = -1, bestFront = false;
    for(var i = 0; i < hosts.length; i++){
      var host = hosts[i];
      if(!host || !host.isConnected) continue;
      var r = null, cs = null;
      try{ r = host.getBoundingClientRect(); cs = getComputedStyle(host); }catch(e){ continue; }
      if(!r || r.width < 60 || r.height < 40 || !cs || cs.display === "none" || cs.visibility === "hidden") continue;
      var hit = null;
      try{ hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); }catch(e2){}
      var frontAtCenter = !!(hit && (host === hit || host.contains(hit)));
      var z = parseInt(cs.zIndex, 10);
      if(!isFinite(z)) z = 0;
      if((frontAtCenter && !bestFront) ||
         (frontAtCenter === bestFront && (z > bestZ || (z === bestZ && i > bestOrder)))){
        best = host; bestZ = z; bestOrder = i; bestFront = frontAtCenter;
      }
    }
    return best;
  }
  function ensureReceiverCorners(){
    var on = document.documentElement.classList.contains("dnx-rh-show");
    try{ if(localStorage.getItem("dnx_styler_corners") === "0") on = false; }catch(e){}
    var strays = document.querySelectorAll(".dnx-my-corner");
    for(var si = 0; si < strays.length; si++){
      var p = strays[si].parentNode;
      if(!p || !(p.classList && p.classList.contains("dnx-corner-frame"))){ strays[si].remove(); }
    }
    if(!on){
      for(var d = dnxFrames.length - 1; d >= 0; d--){ dnxFrames[d].remove(); }
      dnxFrames = [];
      return false;
    }
    var hosts = dnxWindows();
    var rcv = dnxRcvHost();
    var active = dnxFrontWindow(hosts);
    for(var fp = dnxFrames.length - 1; fp >= 0; fp--){
      if(hosts.indexOf(dnxFrames[fp].__dnxHost) < 0 || dnxFrames[fp].__dnxHost !== active){
        dnxFrames[fp].remove(); dnxFrames.splice(fp, 1);
      }
    }
    if(active){
      var cs = null;
      try{ cs = getComputedStyle(active); }catch(e2){ cs = null; }
      if(cs && cs.position === "static"){ active.style.position = "relative"; }
      dnxFrameFor(active, active === rcv);
    }
    dnxFrameSync();
    for(var oi = 0; oi < dnxFrames.length; oi++){
      var nx = dnxFrames[oi].nextElementSibling;
      if(nx && !(nx.classList && nx.classList.contains("dnx-corner-frame"))){ document.body.appendChild(dnxFrames[oi]); }
    }
    return true;
  }
  pillFxSync();
  ensureStyle();
  apply(current);
  dnxWfBoot();
  setInterval(function(){
    if(document.hidden) return;
    smeterTheme();
    attachSmeterObserver();
    ensureReceiverCorners();
    dnxPfxSheet();
    dnxShareTick();
    dnxWfTick();
  }, 2000);
  setInterval(function(){
    if(document.hidden || !dnxFrames.length) return;
    dnxFrameSync();
  }, 500);
  document.addEventListener("click", clickSound, true);
  function boot(){
    dnxAnBoot();
    if(!addLauncher()){ setInterval(addLauncher, 1500); }
  }
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
  function dnxDiag(){
    try{
      smeterBarsSnap = 0;
      var overlay = document.getElementById("dnx-receiver-overlay");
      var probe = document.querySelector(".dnx-rh-nw,.dnx-rh-ne,.dnx-rh-sw,.dnx-rh-se,.dnx-rh-w,.dnx-rh-e,.dnx-resize-handle");
      var host = (probe && probe.parentElement) ? probe.parentElement : null;
      var s = "v3.5 | overlay=" + (overlay ? "ja" : "NEIN") + " | griff=" + (probe ? "ja" : "NEIN") + " | host=" + (host ? (host.id || host.className || host.tagName) : "-");
      var wins = dnxWindows(true);
      s += " | fenster=" + wins.length;
      for(var w = 0; w < wins.length && w < 6; w++){ s += " [" + (wins[w].id || wins[w].className || wins[w].tagName) + "]"; }
      s += " | frames=" + dnxFrames.length + " | ecken=" + document.querySelectorAll(".dnx-my-corner").length + " | wins=" + dnxSelList().length;
      var bars = smeterBars();
      s += " | smeter=" + bars.length;
      for(var i = 0; i < bars.length && i < 5; i++){
        var r = bars[i].getBoundingClientRect();
        var cs2 = null;
        try{ cs2 = getComputedStyle(bars[i]); }catch(e9){ cs2 = null; }
        s += " [" + (bars[i].id || "-") + "/" + (typeof bars[i].className === "string" ? bars[i].className : "-") + " " + Math.round(r.width) + "x" + Math.round(r.height) + (cs2 ? " bg=" + cs2.backgroundColor + " img=" + String(cs2.backgroundImage).slice(0, 22) : "") + "]";
      }
      try{ s += " | keys s=" + (localStorage.getItem("dnx_styler_smeter") || "-") + " st=" + (localStorage.getItem("dnx_styler_smeter_style") || "-") + " e=" + (localStorage.getItem("dnx_styler_corners") || "-") + " off=" + (localStorage.getItem("dnx_styler_off") || "-") + " pfx=" + (localStorage.getItem(PFX_KEY) || "-") + " teilen=" + shareInfo.st + "/" + shareInfo.count + " lang=" + dnxLang() + " wf=" + dnxWfId() + "/" + dnxFftId(); }catch(e3){}
      console.log("%cDNX-Styler", "background:#35ff83;color:#000;font-weight:700", s);
    }catch(e){}
  }
  /* =====================================================================
     v53: Zeitachse am Wasserfall + Rueckblick-Scrolleiste
     - links oder rechts ein Zeitband, das mit dem Wasserfall scrollt
     - feine Sekunden-Striche, Beschriftung im gewaehlten Abstand
     - Rueckblick: senkrechte Leiste, Ziehen holt die letzten Minuten zurueck
       (Doppelklick = wieder live). Aufgenommen wird nur, was ohnehin
       angezeigt wurde; Kern-Dateien werden nicht angefasst.
     ===================================================================== */
  var ZT = {
    an: 0, seite: 1, abstand: 10, ticks: 1, schrift: 12, rueckMin: 30, scroller: 1,
    links: 78, farbe: "rgba(255,255,255,1)", bg: "rgba(6,19,11,.78)", rand: "rgba(255,32,32,1)",
    tickMain: "rgba(255,255,255,.80)", tickMinor: "rgba(255,255,255,.50)",
    labelBg: "rgba(0,0,0,.75)", secondBg: "rgba(0,0,0,.62)", secondFg: "rgba(255,255,255,.88)",
    bgDeck: 78, fgDeck: 100, akzent: "#35ff83",
    rate: 22, band: [0, 0, 0, 0], bandT: 0, rateT: 0, rateN: 0,
    achse: null, actx: null, rueck: null, rctx: null, schiene: null, griff: null, schild: null,
    rueckAn: 0, rueckZeit: 0, ziehen: 0, griffsY: 0, speicher: null, zeilen: 0, lut: null, lutQuelle: null,
    timer: null, altAdd: null, altClear: null, letzteDaten: null, fehler: "", minGemerkt: -1
  };
  var ZT_W = 512;

  function ztJetzt(){ return Date.now(); }
  function ztZahl(v, a, b, std){ v = parseInt(v, 10); if(isNaN(v)) return std; return Math.max(a, Math.min(b, v)); }
  function ztZwei(n){ return (n < 10 ? "0" : "") + n; }
  function ztText(t, sek){
    var d = new Date(t), s = ztZwei(d.getHours()) + ":" + ztZwei(d.getMinutes());
    return sek ? (s + ":" + ztZwei(d.getSeconds())) : s;
  }

  /* ------- sichtbare Wasserfallflaeche ------- */
  function ztBandMessen(){
    var c = document.getElementById("webrx-canvas-container");
    if(!c){ return null; }
    var box = c.getBoundingClientRect();
    var l = c.querySelectorAll("canvas");
    if(!l.length){ return null; }
    var o = 1e9, u = -1e9, links = 1e9, rechts = -1e9;
    for(var i = 0; i < l.length; i++){
      var r = l[i].getBoundingClientRect();
      if(r.width <= 0 || r.height <= 0){ continue; }
      if(r.top < o){ o = r.top; }
      if(r.bottom > u){ u = r.bottom; }
      if(r.left < links){ links = r.left; }
      if(r.right > rechts){ rechts = r.right; }
    }
    if(u <= o){ return null; }
    /* waagerecht auf das Sichtfeld klemmen: beim Zoom wird die Leinwand breiter als das Fenster */
    var gw = window.innerWidth || 1920;
    if(links < 0){ links = 0; }
    if(rechts > gw){ rechts = gw; }
    if(rechts - links < 60){ links = 0; rechts = gw; }
    var tb = 0;
    var t = document.querySelector(".webrx-top-container");
    if(t){ tb = t.getBoundingClientRect().bottom; }
    o = Math.max(o, tb + 1, 0);
    if(box.height > 8){
      /* Spektrum offen: der Wasserfall liegt im Container */
      o = Math.max(o, box.top);
      u = Math.min(u, box.bottom);
    } else {
      /* Standard-Layout: der Wasserfall liegt ueber der Frequenz-Skala */
      var sc = document.getElementById("openwebrx-scale-container");
      if(sc){ u = Math.min(u, sc.getBoundingClientRect().top); }
    }
    u = Math.min(u, window.innerHeight);
    if(u - o < 8){ ZT.fehler = "band zu klein: " + Math.round(u - o); return null; }
    return [Math.round(links), Math.round(o), Math.round(rechts - links), Math.round(u - o)];
  }
  function ztBand(){
    var j = ztJetzt();
    if(ZT.ziehen && ZT.band[3]){ return ZT.band; }      // waehrend des Ziehens nicht nachmessen
    if(!ZT.band[3] || j - ZT.bandT > 500){
      var neu = ztBandMessen();
      if(neu){ ZT.band = neu; ZT.bandGut = j; }
      else if(j - (ZT.bandGut || 0) > 2500){ ZT.band = [0,0,0,0]; }   // erst nach 2,5 s ohne Messung leeren
      ZT.bandT = j;
    }
    return ZT.band;
  }
  function ztBandSofort(){ ZT.bandT = 0; ZT.bandGut = 0; }
  function ztRateMelden(){
    var j = ztJetzt();
    if(!ZT.rateT){ ZT.rateT = j; ZT.rateN = 0; return; }
    ZT.rateN++;
    if(j - ZT.rateT >= 4000){
      var r = ZT.rateN * 1000 / (j - ZT.rateT);
      if(r > 0.5){ ZT.rate = r; }
      ZT.rateT = j; ZT.rateN = 0;
    }
  }

  /* ------- Zeitband (eigene Leinwand, 1:1 Bildschirm) ------- */
  function ztAchseBauen(){
    if(ZT.achse){ return; }
    var a = document.createElement("canvas");
    a.id = "dnx-zt-achse";
    a.style.cssText = "position:fixed;pointer-events:none;z-index:2147482500;display:block;";
    document.body.appendChild(a);
    ZT.achse = a; ZT.actx = a.getContext("2d");
    ztBreiteGriffBauen();
  }
  /* ---- v3.79: Zeitachse ziehen (breiter/schmaler, Skala waechst mit) ---- */
  var ZT_BR_MIN = 30, ZT_BR_MAX = 420, ZT_BR_STD = 78, ZT_SCHR_STD = 12;
  function ztSchriftFuer(px){
    var f = Math.round(10 + (px - ZT_BR_MIN) * 16 / (ZT_BR_MAX - ZT_BR_MIN));
    return Math.max(10, Math.min(26, f));
  }
  function dnxZtBreiteLaden(){
    try{
      var b = parseInt(localStorage.getItem("dnx_zt_breite"), 10);
      var f = parseInt(localStorage.getItem("dnx_zt_schrift"), 10);
      if(b > 0){ ZT.links = Math.max(ZT_BR_MIN, Math.min(ZT_BR_MAX, b)); }
      if(f > 0){ ZT.schrift = Math.max(10, Math.min(26, f)); }
      else if(b > 0){ ZT.schrift = ztSchriftFuer(ZT.links); }
    }catch(e){}
  }
  function dnxZtBreiteSpeichern(){
    try{
      localStorage.setItem("dnx_zt_breite", String(ZT.links));
      localStorage.setItem("dnx_zt_schrift", String(ZT.schrift));
    }catch(e){}
  }
  function ztBreiteSchildZeigen(txt){
    var s = ZT.breiteSchild; if(!s){ return; }
    s.textContent = txt;
    s.style.display = "block";
    var g = ZT.breiteGriff;
    if(g){
      var gx = parseFloat(g.style.left || "0") || 0, gy = parseFloat(g.style.top || "0") || 0;
      s.style.left = Math.max(2, gx - 46) + "px";
      s.style.top = Math.max(2, gy + 6) + "px";
    }
    clearTimeout(ZT.breiteT);
    ZT.breiteT = setTimeout(function(){ if(s){ s.style.display = "none"; } }, 1200);
  }
  function ztBreiteZiehen(e){
    if(!ZT.breiteZug){ return; }
    e.preventDefault(); e.stopPropagation();
    var links = ZT.seite === 0;
    var dx = e.clientX - ZT.ziehX;
    var neu = links ? (ZT.ziehB + dx) : (ZT.ziehB - dx);
    neu = Math.max(ZT_BR_MIN, Math.min(ZT_BR_MAX, Math.round(neu)));
    if(neu !== ZT.links){
      ZT.links = neu;
      ZT.schrift = ztSchriftFuer(neu);
      try{ ztAchseMalen(); }catch(err){}
      if(ZT.rueckAn){ try{ ztRueckMalen(); }catch(err2){} }
    }
    ztBreiteSchildZeigen(neu + " px / Schrift " + ZT.schrift);
  }
  function ztBreiteLos(e){
    if(!ZT.breiteZug){ return; }
    ZT.breiteZug = 0;
    document.removeEventListener("mousemove", ztBreiteZiehen, true);
    document.removeEventListener("mouseup", ztBreiteLos, true);
    dnxZtBreiteSpeichern();
    ztBreiteSchildZeigen(ZT.links + " px / Schrift " + ZT.schrift);
  }
  function ztBreiteRunter(e){
    if(e.button !== 0){ return; }
    e.preventDefault(); e.stopPropagation();
    ZT.breiteZug = 1; ZT.ziehX = e.clientX; ZT.ziehB = ZT.links;
    ZT.schrift = ztSchriftFuer(ZT.links);
    document.addEventListener("mousemove", ztBreiteZiehen, true);
    document.addEventListener("mouseup", ztBreiteLos, true);
    ztBreiteSchildZeigen(ZT.links + " px / Schrift " + ZT.schrift);
  }
  function ztBreiteGriffBauen(){
    if(ZT.breiteGriff){ return; }
    var g = document.createElement("div");
    g.id = "dnx-zt-breite-griff";
    g.title = "Ziehen: zur Mitte = breiter, nach aussen = schmaler. Doppelklick = Standard.";
    g.style.cssText = "position:fixed;display:none;width:13px;z-index:2147481900;cursor:ew-resize;" +
      "background:rgba(255,32,32,.14);border-radius:3px;";
    g.addEventListener("mouseenter", function(){ g.style.background = "rgba(255,32,32,.34)"; });
    g.addEventListener("mouseleave", function(){ if(!ZT.breiteZug){ g.style.background = "rgba(255,32,32,.14)"; } });
    g.addEventListener("mousedown", ztBreiteRunter, true);
    g.addEventListener("dblclick", function(e){
      e.preventDefault(); e.stopPropagation();
      ZT.links = ZT_BR_STD; ZT.schrift = ZT_SCHR_STD;
      dnxZtBreiteSpeichern();
      try{ ztAchseMalen(); }catch(err){}
      if(ZT.rueckAn){ try{ ztRueckMalen(); }catch(err2){} }
      ztBreiteSchildZeigen("Standard " + ZT_BR_STD + " px / Schrift " + ZT_SCHR_STD);
    }, true);
    document.body.appendChild(g);
    ZT.breiteGriff = g;
    var sc = document.createElement("div");
    sc.id = "dnx-zt-breite-schild";
    sc.style.cssText = "position:fixed;display:none;z-index:2147482521;pointer-events:none;" +
      "font:700 13px monospace;color:#fff;background:rgba(0,0,0,.84);border:1px solid #ff2020;" +
      "border-radius:4px;padding:2px 7px;";
    document.body.appendChild(sc);
    ZT.breiteSchild = sc;
  }
  function ztAchseWeg(){
    if(ZT.achse && ZT.achse.parentNode){ ZT.achse.parentNode.removeChild(ZT.achse); }
    ZT.achse = null; ZT.actx = null;
    if(ZT.breiteGriff && ZT.breiteGriff.parentNode){ ZT.breiteGriff.parentNode.removeChild(ZT.breiteGriff); }
    ZT.breiteGriff = null;
    if(ZT.breiteSchild && ZT.breiteSchild.parentNode){ ZT.breiteSchild.parentNode.removeChild(ZT.breiteSchild); }
    ZT.breiteSchild = null;
    ZT.breiteZug = 0;
  }
  function ztAchseMalen(){
    if(!ZT.an || !ZT.achse){ return; }
    var b = ztBand();
    if(!b[3]){
      ZT.achse.style.display = "none";
      if(ZT.breiteGriff){ ZT.breiteGriff.style.display = "none"; }
      return;
    }
    ZT.achse.style.display = "block";
    var H = b[3], W = ZT.links, links = ZT.seite === 0;
    if(ZT.achse.width !== W || ZT.achse.height !== H){ ZT.achse.width = W; ZT.achse.height = H; }
    var xx = ztX();
    ZT.achse.style.left = xx.band + "px";
    ZT.achse.style.top = b[1] + "px";
    if(ZT.breiteGriff){
      ZT.breiteGriff.style.display = "block";
      ZT.breiteGriff.style.left = Math.round(xx.band + (links ? (W - 2) : 0) - 5) + "px";
      ZT.breiteGriff.style.top = b[1] + "px";
      ZT.breiteGriff.style.height = H + "px";
    }
    var c = ZT.actx, j = ztJetzt();
    c.clearRect(0, 0, W, H);
    c.fillStyle = ZT.bg;
    c.fillRect(0, 0, W, H);
    c.fillStyle = ZT.rand;
    c.fillRect(links ? (W - 2) : 0, 0, 2, H);
    if(ZT.ticks){
      /* v3.80: Striche wachsen mit der Achsenbreite, werden dicker und
         zwischen den Zeitangaben feiner unterteilt (2 ab 120 px, 4 ab 230 px). */
      var px = ZT.rate, versatz = (j % 1000) / 1000 * px;
      var teil = (W >= 120 ? 2 : 1);
      var schritt = px / teil;
      var lang = Math.max(12, Math.min(48, Math.round(W * 0.28)));
      var dick = Math.max(1, Math.min(4, Math.round(schritt / 4)));   /* v3.84: dicker, aber ohne Zusammenlaufen */
      var k, y2, voll, l2;
      for(k = 0; k < 900; k++){
        y2 = k * schritt - versatz;
        if(y2 < -2){ continue; }
        if(y2 > H){ break; }
        voll = (k % teil) === 0;
        l2 = voll ? lang : Math.round(lang * 0.62);
        c.fillStyle = voll ? ZT.tickMain : ZT.tickMinor;
        c.fillRect(links ? 0 : (W - l2), Math.round(y2), l2, dick);
      }
    }
    var ms = ZT.abstand * 1000, rest = j % ms;
    c.font = ZT.schrift + "px monospace";
    c.textBaseline = "top";
    for(var k = 0; k < 40; k++){
      var t = j - rest - k * ms, y2 = (j - t) / 1000 * ZT.rate - 1;
      if(y2 < 0){ continue; }
      if(y2 > H - 2){ break; }
      c.fillStyle = ZT.labelBg;
      c.fillRect(links ? 0 : (W - ZT.links), Math.round(y2), ZT.links, ZT.schrift + 3);
      c.fillStyle = ZT.farbe;
      c.fillText(ztText(t, ZT.abstand < 60), links ? 2 : 4, Math.round(y2) + 1);
      c.fillRect(links ? 0 : (W - 3), Math.round(y2), 3, 1);
    }
    /* v3.81: die Sekunden zwischen den Zeitangaben als Zahlen (":41") -
       nur wenn die Achse breit genug ist, Schrift waechst mit. */
    if(W >= 150 && ZT.abstand > 1){
      var sekF = Math.max(11, Math.min(20, Math.round(ZT.schrift * 0.72)));
      var msS = 1000, restS = j % msS;
      c.font = sekF + "px monospace";
      c.textBaseline = "top";
      for(var n = 0; n < 900; n++){
        var ts = j - restS - n * msS;
        var ys = (j - ts) / 1000 * ZT.rate - 1;
        if(ys < 0){ continue; }
        if(ys > H - 2){ break; }
        var sekN = new Date(ts).getSeconds();
        if(sekN % ZT.abstand === 0){ continue; }
        var txt = ":" + ztZwei(sekN);
        var tw = c.measureText(txt).width;
        /* v3.83: Zahl sitzt am Strichlineal (aussen), direkt neben dem Strich */
        var langS = Math.max(12, Math.min(48, Math.round(W * 0.28)));
        var tx = links ? (langS + 5) : (W - langS - 5 - tw);
        c.fillStyle = ZT.secondBg;
        c.fillRect(tx - 2, Math.round(ys), tw + 6, sekF + 2);
        c.fillStyle = ZT.secondFg;
        c.fillText(txt, tx, Math.round(ys) + 1);
      }
      c.font = ZT.schrift + "px monospace";
      c.textBaseline = "top";
    }
  }

  /* ------- Speicher (Ringe mit Abstufung) ------- */
  function ztStufe(cap){ return { pix: new Uint8Array(cap * ZT_W), t: new Float64Array(cap), pos: -1, n: 0, cap: cap }; }
  function ztSpeicherInit(minuten){
    minuten = ztZahl(minuten, 1, 720, 30);   /* v56: bis 12 Stunden Rueckschau */
    if(ZT.speicher && ZT.minGemerkt === minuten){ return; }
    var r = ZT.rate > 0.5 ? ZT.rate : 22;
    var m0 = Math.min(3, minuten), m1 = Math.max(0, Math.min(15, minuten) - m0);
    var m2 = Math.max(0, Math.min(60, minuten) - m0 - m1), m3 = Math.max(0, minuten - 60);
    var s0 = Math.ceil(m0 * 60 * r) + 60, s1 = Math.ceil(m1 * 60 * r / 2) + 60;
    var s2 = Math.ceil(m2 * 60 * r / 4) + 60, s3 = Math.ceil(m3 * 60 * r / 16) + 60;
    ZT.speicher = { t0: ztStufe(s0), t1: ztStufe(s1), t2: ztStufe(s2), t3: ztStufe(s3), z: 0,
                    bytes: (s0 + s1 + s2 + s3) * ZT_W };
    ZT.zeilen = 0; ZT.minGemerkt = minuten;
  }
  function ztRing(s, pix, t){
    s.pos = (s.pos + 1) % s.cap;
    s.pix.set(pix, s.pos * ZT_W);
    s.t[s.pos] = t;
    if(s.n < s.cap){ s.n++; }
  }
  function ztZeileBauen(daten){
    var lv = Waterfall.levels || { min: -150, max: 0 };
    var spanne = (lv.max - lv.min) || 1, q = daten.length, block = Math.max(1, Math.floor(q / ZT_W));
    var zi = new Uint8Array(ZT_W);
    for(var x = 0; x < ZT_W; x++){
      var s = x * block, e = Math.min(q, s + block), m = -1e9;
      for(var k = s; k < e; k++){ var v = daten[k]; if(v > m){ m = v; } }
      var v2 = (m - lv.min) / spanne;
      zi[x] = ((v2 < 0 ? 0 : (v2 > 1 ? 1 : v2)) * 255) | 0;
    }
    return zi;
  }
  function ztSpeichern(daten){
    if(!ZT.speicher || !daten || !daten.length){ return; }
    var t = ztJetzt(), zi;
    try{ zi = ztZeileBauen(daten); }catch(e){ ZT.fehler = "zeile: " + e; return; }
    var s = ZT.speicher;
    ztRing(s.t0, zi, t);
    s.z++;
    if(s.z % 2 === 0){ ztRing(s.t1, zi, t); }
    if(s.z % 4 === 0){ ztRing(s.t2, zi, t); }
    if(s.z % 16 === 0){ ztRing(s.t3, zi, t); }
    ZT.zeilen = s.z;
  }
  function ztStufeFuerAlter(sek){
    var s = ZT.speicher;
    if(!s){ return null; }
    return sek < 180 ? s.t0 : (sek < 900 ? s.t1 : (sek < 3600 ? s.t2 : s.t3));
  }
  function ztReihe(tMitte, anzahl){
    var s = ZT.speicher;
    if(!s){ return null; }
    var st = ztStufeFuerAlter((ztJetzt() - tMitte) / 1000);
    if(!st || !st.n){ return null; }
    var i = st.pos, gefunden = -1, gesehen = 0;
    while(gesehen < st.n){
      if(st.t[i] <= tMitte){ gefunden = i; break; }
      i = (i - 1 + st.cap) % st.cap; gesehen++;
    }
    if(gefunden < 0){ return null; }
    var idx = gefunden, n = 0;
    while(n < anzahl && n < st.n){
      idx = (idx - 1 + st.cap) % st.cap; n++;
      if(!st.t[idx] && n < st.n){ break; }
    }
    var reihe = [], k = gefunden;
    for(var m = 0; m < Math.min(anzahl, st.n); m++){
      reihe.push(k);
      k = (k - 1 + st.cap) % st.cap;
    }
    var out = new Uint8Array(reihe.length * ZT_W);
    for(var r = 0; r < reihe.length; r++){ out.set(st.pix.subarray(reihe[r] * ZT_W, reihe[r] * ZT_W + ZT_W), r * ZT_W); }
    return { pix: out, n: reihe.length,
             stufe: (st === s.t0 ? 1 : (st === s.t1 ? 2 : (st === s.t2 ? 4 : 16))),
             tOben: st.t[gefunden], tUnten: st.t[reihe[reihe.length - 1]] };
  }
  /* Positionen: Rueckblick-Leiste immer AUSSEN (rechts aussen / links aussen),
     das Zeitband direkt daneben. */
  function ztX(){
    var b = ztBand(), w = 13, links = ZT.seite === 0;
    var rand = b[0] + b[2];
    var schiene = links ? b[0] : (rand - w);
    var band = ZT.scroller
      ? (links ? (b[0] + w + 4) : (rand - w - 4 - ZT.links))
      : (links ? b[0] : (rand - ZT.links));
    return { b: b, w: w, links: links, schiene: schiene, band: band };
  }
  function ztAeltester(st){
    if(!st || !st.n){ return 0; }
    return st.t[(st.pos - st.n + 1 + st.cap * 2) % st.cap];
  }
  function ztLaufzeit(){
    var s = ZT.speicher;
    if(!s || !s.t0.n){ return [ztJetzt(), ztJetzt()]; }
    var st = s.t3.n > 8 ? s.t3 : (s.t2.n > 8 ? s.t2 : (s.t1.n > 8 ? s.t1 : s.t0));
    return [ztAeltester(st), ztJetzt()];
  }

  /* ------- Rueckblick: Leinwand + Leiste ------- */
  function ztRueckBauen(){
    if(ZT.rueck){ return; }
    var cv = document.createElement("canvas");
    cv.id = "dnx-zt-rueck";
    cv.style.cssText = "position:fixed;pointer-events:none;z-index:2147482400;display:none;";
    document.body.appendChild(cv);
    ZT.rueck = cv; ZT.rctx = cv.getContext("2d");
    var sc = document.createElement("div");
    sc.id = "dnx-zt-scroll";
    sc.style.cssText = "position:fixed;z-index:2147482510;display:none;cursor:pointer;" +
      "background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.25);border-radius:6px;box-sizing:border-box;";
    var gr = document.createElement("div");
    gr.id = "dnx-zt-griff";
    gr.style.cssText = "position:absolute;left:1px;right:1px;top:0;height:40px;border-radius:5px;cursor:ns-resize;" +
      "background:" + ZT.akzent + ";box-shadow:0 0 6px rgba(0,0,0,.6);";
    sc.appendChild(gr);
    var sch = document.createElement("div");
    sch.id = "dnx-zt-schild";
    sch.style.cssText = "position:fixed;z-index:2147482512;display:none;font:12px monospace;color:#fff;" +
      "background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.25);border-radius:4px;padding:3px 7px;pointer-events:none;";
    /* Play-Knopf: zurueck zu live */
    var pb = document.createElement("div");
    pb.id = "dnx-zt-play";
    pb.title = "live weiter (Play)";
    pb.textContent = "▶ live";
    pb.style.cssText = "position:fixed;z-index:2147482515;display:none;width:54px;height:22px;box-sizing:border-box;" +
      "text-align:center;font:12px/20px 'Segoe UI',Arial,sans-serif;font-weight:700;color:#cfe8d8;cursor:pointer;" +
      "background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.35);border-radius:5px;user-select:none;";
    pb.addEventListener("pointerdown", function(e){ e.preventDefault(); e.stopPropagation(); }, true);
    pb.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); ztLive(); }, true);
    pb.addEventListener("mouseenter", function(){ pb.style.borderColor = "#ffffff"; }, false);
    pb.addEventListener("mouseleave", function(){ ztLeisteMalen(); }, false);
    document.body.appendChild(sc);
    document.body.appendChild(sch);
    document.body.appendChild(pb);
    ZT.schiene = sc; ZT.griff = gr; ZT.schild = sch; ZT.play = pb;
    gr.addEventListener("pointerdown", function(e){
      e.preventDefault(); e.stopPropagation();
      ZT.ziehen = 1;
      ZT.treffer = (ZT.treffer || 0) + 1;
      ZT.griffsY = e.clientY - ZT.griff.getBoundingClientRect().top;
      try{ ZT.griff.setPointerCapture(e.pointerId); }catch(x){}
    }, true);
    sc.addEventListener("pointerdown", function(e){
      if(!ZT.an || !ZT.rueckAn){ return; }
      e.preventDefault(); e.stopPropagation();
      var r = ZT.schiene.getBoundingClientRect();
      ztGriffSetzen(e.clientY - r.top - ZT.griff.offsetHeight / 2);
    }, true);
    function ztLiveKlick(e){ e.preventDefault(); e.stopPropagation(); ztLive(); }
    sc.addEventListener("dblclick", ztLiveKlick, true);
    gr.addEventListener("dblclick", ztLiveKlick, true);
    window.addEventListener("pointermove", function(e){
      if(!ZT.ziehen || !ZT.schiene){ return; }
      ZT.zug = (ZT.zug || 0) + 1;
      var r = ZT.schiene.getBoundingClientRect();
      ztGriffSetzen(e.clientY - r.top - ZT.griffsY);
    }, true);
    window.addEventListener("pointerup", function(){ ZT.ziehen = 0; }, true);
  }
  function ztGriffSetzen(y){
    if(!ZT.schiene || !ZT.schiene.offsetHeight){ return; }
    var H = ZT.schiene.clientHeight, gh = ZT.griff.offsetHeight;
    y = Math.max(0, Math.min(H - gh, y));
    ZT.griff.style.top = y + "px";
    var lz = ztLaufzeit();
    var anteil = (H - gh) > 0 ? y / (H - gh) : 0;
    ZT.rueckZeit = lz[0] + (lz[1] - lz[0]) * anteil;
    if(anteil > 0.995){ ztLive(); return; }
    ZT.rueckAn = 1;
    ztRueckMalen();
    if(ZT.achse){ ZT.achse.style.display = "none"; }
  }
  function ztLive(){
    ZT.rueckAn = 0; ZT.rueckZeit = 0;
    if(ZT.play){ ZT.play.style.background = "rgba(0,0,0,.55)"; ZT.play.style.color = "#cfe8d8";
                 ZT.play.style.borderColor = "rgba(255,255,255,.35)"; ZT.play.style.boxShadow = "none"; }
    if(ZT.rueck){ ZT.rueck.style.display = "none"; }
    if(ZT.schild){ ZT.schild.style.display = "none"; }
    ztLeisteMalen();
  }
  function ztRueckMalen(){
    if(!ZT.rueckAn || !ZT.rueck){ return; }
    var b = ztBand();
    if(!b[3]){ return; }
    var W = b[2], H = b[3];
    if(ZT.rueck.width !== W || ZT.rueck.height !== H){ ZT.rueck.width = W; ZT.rueck.height = H; }
    ZT.rueck.style.display = "block";
    ZT.rueck.style.left = b[0] + "px"; ZT.rueck.style.top = b[1] + "px";
    ZT.rueck.style.width = W + "px"; ZT.rueck.style.height = H + "px";
    var reihe = ztReihe(ZT.rueckZeit || ztJetzt(), H);
    var c = ZT.rctx, links = ZT.seite === 0, BW = ZT.links;
    c.fillStyle = "#04120b"; c.fillRect(0, 0, W, H);
    if(reihe && reihe.n){
      var klein = document.createElement("canvas");
      klein.width = ZT_W; klein.height = reihe.n;
      var kk = klein.getContext("2d");
      var bild = kk.createImageData(ZT_W, reihe.n);
      var farben = (typeof Waterfall !== "undefined" && Waterfall.colors) || [];
      if(!ZT.lut || ZT.lutQuelle !== farben){
        ZT.lut = new Uint8Array(768);
        for(var i = 0; i < 256; i++){
          var f = farben[i] || [0,0,0];
          ZT.lut[i*3] = f[0] || 0; ZT.lut[i*3+1] = f[1] || 0; ZT.lut[i*3+2] = f[2] || 0;
        }
        ZT.lutQuelle = farben;
      }
      var lut = ZT.lut, d = bild.data, p = reihe.pix;
      for(var q = 0; q < ZT_W * reihe.n; q++){
        var o = p[q] * 3, z = q * 4;
        d[z] = lut[o]; d[z+1] = lut[o+1]; d[z+2] = lut[o+2]; d[z+3] = 255;
      }
      kk.putImageData(bild, 0, 0);
      c.imageSmoothingEnabled = true;
      c.drawImage(klein, 0, 0, ZT_W, reihe.n, 0, 0, W, H);
      var X2 = ztX(), bx = Math.max(0, Math.min(W - BW, X2.band - b[0]));
      c.fillStyle = ZT.bg; c.fillRect(bx, 0, BW, H);
      c.fillStyle = ZT.rand; c.fillRect(links ? (bx + BW - 2) : bx, 0, 2, H);
      var proZeile = (reihe.tUnten - reihe.tOben) / Math.max(1, reihe.n - 1), ms = ZT.abstand * 1000;
      var erst = Math.ceil(reihe.tUnten / ms) * ms;
      c.font = ZT.schrift + "px monospace"; c.textBaseline = "top";
      var also = 0;
      for(var t2 = erst; t2 <= reihe.tOben + proZeile && also < 60; t2 += ms){
        var y2 = (reihe.tOben - t2) / (proZeile || 1);
        if(y2 < 0 || y2 > H - 2){ continue; }
        c.fillStyle = ZT.labelBg;
        c.fillRect(bx, Math.round(y2), BW, ZT.schrift + 3);
        c.fillStyle = ZT.farbe;
        c.fillText(ztText(t2, ZT.abstand < 60), bx + (links ? 2 : 4), Math.round(y2) + 1);
        also++;
      }
    }
    if(ZT.schild){
      var lz = ztLaufzeit();
      ZT.schild.style.display = "block";
      ZT.schild.textContent = "Rueckblick " + ztText(ZT.rueckZeit || ztJetzt(), true)
        + (reihe ? ("  (Stufe " + reihe.stufe + ")") : "") + "  -  "
        + (Math.round((lz[1] - lz[0]) / 6000) / 10) + " min verfuegbar  -  ▶ live = wieder live";
      ZT.schild.style.left = (b[0] + 12) + "px";
      ZT.schild.style.top = (b[1] + 8) + "px";
    }
  }
  function ztLeisteMalen(){
    if(!ZT.an || !ZT.schiene){ if(ZT.schiene){ ZT.schiene.style.display = "none"; } return; }
    var b = ztBand();
    if(!b[3]){
      ZT.schiene.style.display = "none";
      if(ZT.play){ ZT.play.style.display = "none"; }
      return;
    }
    var X = ztX(), H = b[3], w = X.w;
    ZT.schiene.style.display = ZT.scroller ? "block" : "none";
    ZT.schiene.style.width = w + "px";
    ZT.schiene.style.height = H + "px";
    ZT.schiene.style.left = X.schiene + "px";
    ZT.schiene.style.top = b[1] + "px";
    var lz = ztLaufzeit(), gesamt = Math.max(1000, lz[1] - lz[0]);
    var sichtbar = Math.max(1000, (H / (ZT.rate || 22)) * 1000);
    var gh = Math.max(28, Math.min(H - 4, H * (sichtbar / gesamt)));
    ZT.griff.style.height = Math.round(gh) + "px";
    if(!ZT.rueckAn){ ZT.griff.style.top = Math.round(H - gh - 1) + "px"; }
    /* Play-Knopf ueber der Leiste (immer erreichbar, ohne die Bedienleiste unten zu treffen) */
    var pb = ZT.play;
    if(pb){
      if(!ZT.scroller){ pb.style.display = "none"; }
      else {
        var gw = window.innerWidth || 1920;
        var x = Math.round(X.schiene + (w - 54) / 2);
        x = Math.max(0, Math.min(gw - 56, x));
        var oben = b[1] - 24;
        pb.style.display = "block";
        pb.style.left = x + "px";
        pb.style.top = ((oben >= 0) ? oben : (b[1] + 2)) + "px";
        if(ZT.rueckAn){
          pb.style.background = ZT.akzent; pb.style.color = "#04120b";
          pb.style.borderColor = "#ffffff"; pb.style.boxShadow = "0 0 10px rgba(0,0,0,.7)";
          pb.textContent = "▶ live";
        } else {
          pb.style.background = "rgba(0,0,0,.55)"; pb.style.color = "#cfe8d8";
          pb.style.borderColor = "rgba(255,255,255,.35)"; pb.style.boxShadow = "none";
          pb.textContent = "▶ live";
        }
      }
    }
  }

  /* ------- an/aus ------- */
  function dnxZeitAnwenden(t){
    if(!t){ return false; }
    ZT.an = (t.mt | 0) === 1 ? 1 : 0;
    ZT.seite = (t.mt_seite | 0) === 0 ? 0 : 1;
    ZT.abstand = ztZahl(t.mt_abstand, 1, 60, 10);
    ZT.ticks = (t.mt_ticks | 0) === 1 ? 1 : 0;
    ZT.schrift = ztZahl(t.mt_schrift, 10, 18, 12);
    ZT.bgDeck = ztZahl(t.mt_bg, 0, 100, 78);
    ZT.fgDeck = ztZahl(t.mt_fg, 0, 100, 100);
    var bgAlpha = ZT.bgDeck / 100, fgAlpha = ZT.fgDeck / 100;
    ZT.bg = "rgba(6,19,11," + bgAlpha.toFixed(2) + ")";
    ZT.labelBg = "rgba(0,0,0," + (bgAlpha * (0.75 / 0.78)).toFixed(3) + ")";
    ZT.secondBg = "rgba(0,0,0," + (bgAlpha * (0.62 / 0.78)).toFixed(3) + ")";
    ZT.farbe = "rgba(255,255,255," + fgAlpha.toFixed(2) + ")";
    ZT.rand = "rgba(255,32,32," + fgAlpha.toFixed(2) + ")";
    ZT.tickMain = "rgba(255,255,255," + (0.80 * fgAlpha).toFixed(3) + ")";
    ZT.tickMinor = "rgba(255,255,255," + (0.50 * fgAlpha).toFixed(3) + ")";
    ZT.secondFg = "rgba(255,255,255," + (0.88 * fgAlpha).toFixed(3) + ")";
    dnxZtBreiteLaden();
    ZT.rueckMin = ztZahl(t.mt_min, 0, 720, 30);   /* v56: bis 12 Stunden Rueckschau */
    ZT.scroller = (t.mt_scroller | 0) === 1 ? 1 : 0;
    if(!ZT.an){ dnxZeitAus(); return false; }
    if(typeof document === "undefined" || !document.body){ return false; }
    ztAchseBauen(); ztRueckBauen();
    if(!ZT.altAdd && typeof waterfall_add === "function"){
      ZT.altAdd = waterfall_add;
      window.waterfall_add = function(){
        var r = ZT.altAdd.apply(this, arguments);
        try{
          ztRateMelden();
          if(ZT.rueckMin > 0){ ztSpeichern(arguments[0]); }
          else { ZT.letzteDaten = arguments[0]; }
        }catch(e){ ZT.fehler = "add: " + e; }
        return r;
      };
    }
    if(!ZT.altClear && typeof waterfall_clear === "function"){
      ZT.altClear = waterfall_clear;
      window.waterfall_clear = function(){
        var r = ZT.altClear.apply(this, arguments);
        ZT.speicher = null; ZT.minGemerkt = -1; ZT.zeilen = 0; ztLive();
        return r;
      };
    }
    if(ZT.rueckMin > 0){ ztSpeicherInit(ZT.rueckMin); }
    if(!ZT.timer){
      ZT.timer = setInterval(function(){
        if(!ZT.an){ return; }
        try{
          if(!ZT.altAdd && typeof waterfall_add === "function"){ dnxZeitAnwenden({ mt: 1, mt_seite: ZT.seite, mt_abstand: ZT.abstand, mt_ticks: ZT.ticks, mt_schrift: ZT.schrift, mt_min: ZT.rueckMin, mt_scroller: ZT.scroller, mt_bg: ZT.bgDeck, mt_fg: ZT.fgDeck }); }
          else if(ZT.rueckMin > 0 && !ZT.speicher){ ztSpeicherInit(ZT.rueckMin); }
        }catch(e){ ZT.fehler = "tick: " + e; }
        ztAchseMalen();
        ztLeisteMalen();
        if(ZT.rueckAn){ ztRueckMalen(); }
      }, 200);
    }
    return true;
  }
  function dnxZeitAus(){
    ZT.an = 0;
    if(ZT.timer){ clearInterval(ZT.timer); ZT.timer = null; }
    ztAchseWeg();
    if(ZT.rueck && ZT.rueck.parentNode){ ZT.rueck.parentNode.removeChild(ZT.rueck); ZT.rueck = null; ZT.rctx = null; }
    if(ZT.schiene && ZT.schiene.parentNode){ ZT.schiene.parentNode.removeChild(ZT.schiene); ZT.schiene = null; ZT.griff = null; }
    if(ZT.schild && ZT.schild.parentNode){ ZT.schild.parentNode.removeChild(ZT.schild); ZT.schild = null; }
    if(ZT.play && ZT.play.parentNode){ ZT.play.parentNode.removeChild(ZT.play); ZT.play = null; }
    if(ZT.altAdd && typeof waterfall_add === "function"){
      window.waterfall_add = ZT.altAdd;
      if(ZT.altClear){ window.waterfall_clear = ZT.altClear; }
      ZT.altAdd = null; ZT.altClear = null;
    }
    ZT.rueckAn = 0; ZT.speicher = null; ZT.minGemerkt = -1; ZT.zeilen = 0;
  }
  function dnxZeitStatus(){
    var lz = ztLaufzeit();
    return { an: ZT.an, rate: Math.round(ZT.rate * 100) / 100, band: ztBand(), zeilen: ZT.zeilen,
             rueckAn: ZT.rueckAn, rueckZeit: ZT.rueckZeit, treffer: ZT.treffer || 0, zug: ZT.zug || 0,
             speicherMB: ZT.speicher ? Math.round(ZT.speicher.bytes / 104857.6) / 10 : 0,
             aeltester: lz[0], fehler: ZT.fehler };
  }
  /* v55: sofortiges Nachziehen von Band, Achse, Leiste und Rueckblickbild
     (wird vom Sofort-Sync bei Scrollen, Rad, Ziehen und Layoutwechsel gerufen) */
  function ztZeitSofort(){
    if(!ZT.an){ return; }
    ztBandSofort();
    try{ ztAchseMalen(); }catch(e){}
    try{ ztLeisteMalen(); }catch(e){}
    if(ZT.rueckAn){ try{ ztRueckMalen(); }catch(e){} }
  }
  window.dnxZeit = { anwenden: dnxZeitAnwenden, aus: dnxZeitAus, status: dnxZeitStatus,
                     sofort: ztZeitSofort,
                     live: ztLive, rueckZeit: function(t){ ZT.rueckZeit = t; ZT.rueckAn = 1; ztRueckMalen(); },
                     einst: ZT };

  setTimeout(dnxDiag, 3000);
  window.dnxStyler = { apply: apply, reset: reset, fftHoehe: dnxFftHSetzen, fftLinie: dnxFftLinie, topHoehe: dnxTopHSetzen, topLinie: dnxTopLinie, presets: PRESETS, open: toggleUi, beep: beep, diag: dnxDiag, paletteNeu: dnxPalNeu, pillenEffekte: PFX, pillenEffektId: pfxId, teilen: shareInfo, pfxStylesheet: dnxPfxSheet, zeit: window.dnxZeit };
})();

/* DNX_SOFORT_SYNC_START */
/* v55: Ecken, rote Ziehlinien und Zeitachse werden NICHT mehr im Takt nachgezogen,
   sondern in jedem Bild (requestAnimationFrame), sobald sich etwas bewegt:
   Ziehen am Empfaenger-Kopf, an den Fensterecken, an den roten Linien, Rad,
   Scrollen, Zoomen, Groessenaenderung, Tastatur. Sobald Ruhe ist, hoert der
   Puls von selbst auf (kein Dauerlauf, keine Last im Ruhezustand). */
(function(){
  if(window.__dnxSofortSync) return;
  window.__dnxSofortSync = true;

  var laeuft = false, bis = 0, vollBis = 0, ruhig = 0;

  function jetztMs(){
    try{ return (window.performance && performance.now) ? performance.now() : Date.now(); }
    catch(e){ return Date.now(); }
  }

  function syncEcken(){
    try{ if(typeof window.dnxEckenSync === "function"){ window.dnxEckenSync(); } }catch(e){}
  }
  function syncVoll(){
    try{
      if(window.dnxStyler){
        if(typeof window.dnxStyler.fftLinie === "function"){ window.dnxStyler.fftLinie(); }
        if(typeof window.dnxStyler.topLinie === "function"){ window.dnxStyler.topLinie(); }
      }
    }catch(e){}
    try{ if(window.dnxZeit && typeof window.dnxZeit.sofort === "function"){ window.dnxZeit.sofort(); } }catch(e){}
    linienWache();
  }

  function bild(){
    var t = jetztMs();
    syncEcken();
    if(t <= vollBis){ syncVoll(); }
    if(t < bis){ requestAnimationFrame(bild); }
    else {
      laeuft = false;
      /* einmal nachlaufen, damit nichts halb gesetzt stehen bleibt */
      syncEcken();
      if(t - ruhig > 800){ try{ if(window.dnxZeit && window.dnxZeit.sofort){ window.dnxZeit.sofort(); } }catch(e){} }
    }
  }

  function puls(ms, voll){
    var t = jetztMs();
    bis = Math.max(bis, t + (ms || 400));
    if(voll){ vollBis = Math.max(vollBis, t + (ms || 400)); }
    if(!laeuft){
      laeuft = true;
      try{ requestAnimationFrame(bild); }catch(e){ laeuft = false; syncVoll(); syncEcken(); }
    }
  }
  window.dnxSyncPuls = puls;
  window.dnxSyncJetzt = function(){ syncEcken(); syncVoll(); };

  /* ---- v3.93: rote Ziehlinien folgen der normalen Ebenenreihenfolge ----
     Keine festen Vordergrund-Kopien: Receiver-, Styler- und andere Fenster
     ueberdecken die Ziehlinien ganz normal, wo sie darueberliegen. */
  function linienWache(){
    try{
      var c = document.documentElement && document.documentElement.classList;
      if(c){ c.remove("dnx-linie-hoch"); }
      ["dnx-top-line-vorn", "dnx-fft-line-vorn"].forEach(function(id){
        var e = document.getElementById(id);
        if(e && e.parentNode){ e.parentNode.removeChild(e); }
      });
    }catch(e){}
  }
  window.dnxLinienWache = linienWache;

  /* ---- Ausloeser ---- */
  function nahe(el, liste){
    var p = el;
    for(var i = 0; i < 6 && p; i++){
      if(p.id && liste.indexOf("#" + p.id) >= 0){ return true; }
      if(p.className && typeof p.className === "string"){
        var teile = p.className.split(/\s+/);
        for(var j = 0; j < teile.length; j++){
          if(liste.indexOf("." + teile[j]) >= 0){ return true; }
        }
      }
      p = p.parentNode;
    }
    return false;
  }
  var GRIFFE = ["#dnx-receiver-overlay-bar", "#dnx-fft-line", "#dnx-top-line",
                "#dnx-zt-griff", "#dnx-zt-scroll", "#dnx-zt-play", ".dnx-my-corner",
                ".dnx-corner-frame", ".dnx-styler-ui", ".dnx-drag", ".dnx-rh-grip"];

  var zieht = false;
  document.addEventListener("pointerdown", function(e){
    try{ zieht = nahe(e.target, GRIFFE); }catch(err){ zieht = false; }
    if(zieht){ puls(4000, true); }
  }, true);
  document.addEventListener("mousedown", function(e){
    try{ if(nahe(e.target, GRIFFE)){ zieht = true; puls(4000, true); } }catch(err){}
  }, true);
  document.addEventListener("touchstart", function(e){
    try{ if(nahe(e.target, GRIFFE)){ zieht = true; puls(4000, true); } }catch(err){}
  }, { capture: true, passive: true });

  function loslassen(){ if(zieht){ zieht = false; puls(900, true); ruhig = jetztMs(); } }
  document.addEventListener("pointerup", loslassen, true);
  document.addEventListener("mouseup", loslassen, true);
  document.addEventListener("touchend", loslassen, { capture: true, passive: true });

  function beiBewegung(){
    if(zieht){ puls(700, true); }
    else { puls(220, false); }
  }
  document.addEventListener("pointermove", beiBewegung, { capture: true, passive: true });
  document.addEventListener("mousemove", beiBewegung, { capture: true, passive: true });
  document.addEventListener("touchmove", beiBewegung, { capture: true, passive: true });

  function beiRad(){ ruhig = jetztMs(); puls(1200, true); }
  function beiScroll(){ ruhig = jetztMs(); puls(800, true); }
  function beiGroesse(){ ruhig = jetztMs(); puls(1500, true); }

  window.addEventListener("wheel", beiRad, { capture: true, passive: true });
  window.addEventListener("mousewheel", beiRad, { capture: true, passive: true });
  window.addEventListener("scroll", beiScroll, { capture: true, passive: true });
  document.addEventListener("scroll", beiScroll, { capture: true, passive: true });
  window.addEventListener("resize", beiGroesse);
  window.addEventListener("orientationchange", beiGroesse);
  document.addEventListener("keydown", function(){ puls(600, true); }, true);
  document.addEventListener("keyup", function(){ puls(400, true); }, true);

  /* ---- Netz: falls sich etwas ohne Eingabe bewegt (Layout, Zoom, Theme) ---- */
  var sigAlt = "";
  function sig(){
    var t = [];
    try{
      var w = document.getElementById("dnx-receiver-overlay");
      if(w){ var q = w.getBoundingClientRect(); t.push(Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)); }
      var c = document.getElementById("webrx-canvas-container");
      if(c){ var q2 = c.getBoundingClientRect(); t.push(Math.round(q2.left), Math.round(q2.top), Math.round(q2.width), Math.round(q2.height)); }
      var f = document.querySelector(".dnx-corner-frame");
      if(f){ var q3 = f.getBoundingClientRect(); t.push(Math.round(q3.left), Math.round(q3.top)); }
    }catch(e){}
    return t.join(",");
  }
  setInterval(function(){
    if(document.hidden){ return; }
    linienWache();
    var n = sig();
    if(n !== sigAlt){
      var erst = sigAlt === "";
      sigAlt = n;
      if(!erst){ puls(700, true); }
    }
  }, 200);

  /* Start: einmal alles setzen, sobald der Empfaenger steht */
  setTimeout(function(){ puls(1200, true); }, 800);
  setTimeout(function(){ puls(1200, true); }, 2500);
})();
/* DNX_SOFORT_SYNC_END */

/* DNX_VERS_WACHE_START (v3.19) ----------------------------------------------------------------
   Der Browser haelt init.js bis zu einer Stunde im Zwischenspeicher - nach einer Aenderung
   am Server sieht man deshalb leicht die ALTE Fassung ("laeuft nicht"). Diese Wache liest
   die Stand-Datei dnx_stand.txt ohne Zwischenspeicher, holt bei Abweichung init.js frisch
   vom Server (cache:"reload") und laedt EINMAL neu. Klappt das nicht, erscheint eine
   anklickbare Hinweis-Pille. Testhaken: window.__dnxVersStand / window.__dnxVersPruefen() */
(function(){
  "use strict";
  if(window.__dnxVersWache){ return; }
  window.__dnxVersWache = true;
  var FASSUNG = "v4.17";
  var STAND = "/static/plugins/receiver/dnx_stand.txt";
  var INIT = "/static/plugins/receiver/init.js";
  var GROESSE = "0000614560";          /* Bytegroesse dieser Datei, vom Bau eingesetzt */
  var SCHLUESSEL = "dnx.styler.laedt.";
  var MAX = 3;

  function pille(neu){
    if(document.getElementById("dnx-vers-pille")){ return; }
    var p = document.createElement("div");
    p.id = "dnx-vers-pille";
    p.style.cssText = "position:fixed;right:16px;top:70px;z-index:2147483600;background:#3a2a06;" +
      "border:1px solid #ffcf6b;color:#ffe9b8;font:700 12px Arial;padding:8px 11px;border-radius:9px;" +
      "cursor:pointer;box-shadow:0 0 14px #000;max-width:360px";
    p.textContent = "\ud83d\udd04 Neue Fassung " + (neu || "") + " auf dem Server - hier klicken " +
      "(oder Strg+F5). Hier geladen: " + FASSUNG;
    p.onclick = function(){ try{ location.reload(); }catch(e){} };
    try{ document.body.appendChild(p); }catch(e){}
  }
  function laden(neu){
    var k = SCHLUESSEL + neu, n = 0;
    try{ n = parseInt(sessionStorage.getItem(k) || "0", 10) || 0; }catch(e){}
    if(n >= MAX){ pille(neu); return; }
    try{ sessionStorage.setItem(k, String(n + 1)); }catch(e){}
    var weiter = function(){ try{ location.reload(); }catch(e){} };
    try{
      fetch(INIT + "?ts=" + Date.now(), {cache: "reload"}).then(weiter, weiter);
    }catch(e){ weiter(); }
  }
  function pruefen(){
    try{
      fetch(STAND + "?ts=" + Date.now(), {cache: "no-store"})
        .then(function(r){ return r.ok ? r.text() : ""; })
        .then(function(t){
          var m = String(t || "").match(/v[0-9]+\.[0-9]+/);
          if(m){
            if(m[0] !== FASSUNG){ laden(m[0]); }
            return;
          }
          return fetch(INIT + "?ts=" + Date.now(), {cache: "no-store"})
            .then(function(r){ return r.arrayBuffer(); })
            .then(function(b){
              var g = parseInt(GROESSE, 10) || 0;
              if(b && b.byteLength && g && b.byteLength !== g){ laden("(neu)"); }
            });
        })
        .catch(function(){});
    }catch(e){}
  }
  window.__dnxVersStand = FASSUNG;
  window.__dnxVersPruefen = pruefen;
  setTimeout(pruefen, 9000);
  setInterval(pruefen, 600000);
})();
/* DNX_VERS_WACHE_END */



/* DNX_AIRMARINE_3D_V409_START
 * Lokales AIS/ADS-B-Modul mit robuster IMO-/Name-/MMSI-Fotosuche.
 */
(function(){
  "use strict";
  if(window.__dnxAirMarine3dLoaderV409) return;
  window.__dnxAirMarine3dLoaderV409 = true;
  function load(){
    if(document.getElementById("dnx-airmarine-3d-loader")) return;
    var s=document.createElement("script");
    s.id="dnx-airmarine-3d-loader";
    s.async=true;
    s.src="/static/plugins/receiver/dnx_airmarine_3d/dnx_airmarine_3d.js?v=4.17";
    s.onerror=function(){try{console.warn("[DNX] Lokales AIS/ADS-B-3D-Modul konnte nicht geladen werden");}catch(e){}};
    (document.head||document.documentElement).appendChild(s);
  }
  if(document.head) load();
  else if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",load,{once:true});
  else load();
})();
/* DNX_AIRMARINE_3D_V409_END */
