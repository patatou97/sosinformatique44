/* ===== RGPD CONSENT MANAGER ===== */
var SOS44_CONSENT=(function(){
  var KEY='sos44_consent';
  var consent=localStorage.getItem(KEY);
  function showBanner(){var b=document.getElementById('rgpdBanner');if(b)b.style.display='block'}
  function hideBanner(){var b=document.getElementById('rgpdBanner');if(b)b.style.display='none'}
  if(!consent){
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',showBanner)}else{showBanner()}
  }
  return{
    hasConsented:function(){return consent==='accepted'},
    isDecided:function(){return consent==='accepted'||consent==='refused'},
    accept:function(){
      consent='accepted';localStorage.setItem(KEY,'accepted');hideBanner();
      if(typeof SOS44_loadGA4==='function')SOS44_loadGA4();
      if(typeof SOS44_loadClarity==='function')SOS44_loadClarity();
    },
    refuse:function(){
      consent='refused';localStorage.setItem(KEY,'refused');hideBanner();
    }
  };
})();
function acceptRGPD(){SOS44_CONSENT.accept()}
function refuseRGPD(){SOS44_CONSENT.refuse()}
