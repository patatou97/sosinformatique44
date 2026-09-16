window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
function SOS44_loadClarity(){
  if(window.SOS44_CLARITY_LOADED)return;window.SOS44_CLARITY_LOADED=true;
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","walmpshp6d");
}
function SOS44_loadGA4(){
  if(window.SOS44_GA4_LOADED)return;window.SOS44_GA4_LOADED=true;
  gtag('js',new Date());gtag('config','G-C39YPQWZ0T',{anonymize_ip:true});
  var s=document.createElement('script');s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id=G-C39YPQWZ0T';
  document.head.appendChild(s);
}
(function(){
  try{
    if(localStorage.getItem('sos44_consent')==='accepted'){
      if(document.readyState==='complete')setTimeout(function(){SOS44_loadGA4();SOS44_loadClarity()},3000);
      else window.addEventListener('load',function(){setTimeout(function(){SOS44_loadGA4();SOS44_loadClarity()},3000)});
    }
  }catch(e){}
})();
