(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{DFYV:function(e,t,i){"use strict";i("zKZe");var n,o,r,a=i("Tp9X"),d=i.n(a);t.a=(o={css:{selectors:{top_ad:"js-dfp-ad-top",bottom_ad:"js-dfp-ad-bottom",sidebar_item:"js-sidebar-item",sticky_widgets:"sticky-advert-widget"}}},r=function(e,t){e.childNodes[0]?e.insertBefore(t,e.childNodes[0]):e.appendChild(t)},{init:function(e){if(n=Object.assign(o,e),d()(),window.innerWidth>=768){var t=document.getElementsByClassName(n.css.selectors.top_ad)[0],i=document.getElementsByClassName(n.css.selectors.bottom_ad)[0],a=document.getElementsByClassName(n.css.selectors.sidebar_item),s=document.getElementsByClassName(n.css.selectors.sticky_widgets);if(!t||0===a.length)return!1;var c=a.length-1;r(a[0],t),function(e,t){for(var i=0;i<t.length;i+=1)e.appendChild(t[i])}(a[0],s),i&&r(a[c],i),document.getElementsByTagName("body")[0].classList.add("moved-to-sidebar")}return!0}})},JRop:function(e,t,i){"use strict";i.r(t);var n=i("dC6U"),o=i("eIXK"),r=i("DFYV"),a=i("z5oE");t.default={init:function(){("querySelector"in document||"localStorage"in window||"addEventListener"in window)&&(n.a.addEventListener("slotRenderEnded",(function(e){o.a.update(e)})),r.a.init(),a.a.init())}}},Tp9X:function(e,t){var i=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object"],n=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}";function o(e,t){return"string"==typeof e&&(t=e,e=document),Array.prototype.slice.call(e.querySelectorAll(t))}function r(e){return"string"==typeof e?e.split(",").map(d).filter(a):function(e){return"[object Array]"===Object.prototype.toString.call(e)}(e)?function(e){return[].concat.apply([],e)}(e.map(r).filter(a)):e||[]}function a(e){return e.length>0}function d(e){return e.replace(/^\s+|\s+$/g,"")}e.exports=function(e,t){var d;t=t||{},d=e=e||"body","[object Object]"===Object.prototype.toString.call(d)&&(t=e,e="body"),t.ignore=t.ignore||"",t.players=t.players||"";var s=o(e);if(a(s)){var c;if(!document.getElementById("fit-vids-style"))(document.head||document.getElementsByTagName("head")[0]).appendChild(((c=document.createElement("div")).innerHTML='<p>x</p><style id="fit-vids-style">'+n+"</style>",c.childNodes[1]));var l=r(t.players),u=r(t.ignore),p=u.length>0?u.join():null,m=i.concat(l).join();a(m)&&s.forEach((function(e){o(e,m).forEach((function(e){p&&e.matches(p)||function(e){if(/fluid-width-video-wrapper/.test(e.parentNode.className))return;var t=parseInt(e.getAttribute("width"),10),i=parseInt(e.getAttribute("height"),10),n=isNaN(t)?e.clientWidth:t,o=(isNaN(i)?e.clientHeight:i)/n;e.removeAttribute("width"),e.removeAttribute("height");var r=document.createElement("div");e.parentNode.insertBefore(r,e),r.className="fluid-width-video-wrapper",r.style.paddingTop=100*o+"%",r.appendChild(e)}(e)}))}))}}},"X/zX":function(e,t,i){"use strict";var n;t.a={checkElementHeight:function(e,t){var i=0;t(n(e));var o=setInterval((function(){t(n(e)),20===i&&clearInterval(o),i+=1}),500)},getTallestChildHeight:n=function(e){for(var t=0,i=0,n=e.children.length;i<n;i+=1){var o=e.children[i].clientHeight;o>t&&(t=o)}return t}}},eIXK:function(e,t,i){"use strict";var n=i("kRpH"),o=i.n(n),r=i("nbsm"),a=i("z5oE"),d=i("X/zX");t.a={update:function(e){var t=document.getElementById(e.slot.getSlotElementId()),i=t.parentNode,n=t.getAttribute("data-position"),s=window.getComputedStyle(t),c=parseInt(s["padding-top"],10)+parseInt(s["padding-bottom"],10);d.a.checkElementHeight(t,(function(e){var d=e+c,s=document.querySelector("body").classList.contains("ad-skin-active");"header"===n?d===i.clientHeight||s||o.a.publish(r.b.AD_BANNER_UI_BANNER_AD_HEIGHT_CHANGE,{finalHeight:d}):"sidebarTop"===n?d!==i.clientHeight&&o.a.publish(a.b.SIDEBAR_UI_TOP_AD_HEIGHT_CHANGE,{adElement:t}):"sidebarBottom"===n?d!==i.clientHeight&&o.a.publish(a.b.SIDEBAR_UI_BOTTOM_AD_HEIGHT_CHANGE,{adElement:t}):"outOfPage"===n&&s&&(d=document.getElementById(r.a.getBannerAdId()).clientHeight,o.a.publish(r.b.AD_BANNER_UI_BANNER_AD_HEIGHT_CHANGE,{finalHeight:d}))}))}}},z5oE:function(e,t,i){"use strict";i.d(t,"b",(function(){return n}));var n={SIDEBAR_UI_TOP_AD_HEIGHT_CHANGE:"SIDEBAR_UI:TOP_AD_HEIGHT_CHANGE",SIDEBAR_UI_BOTTOM_AD_HEIGHT_CHANGE:"SIDEBAR_UI:BOTTOM_AD_HEIGHT_CHANGE"};t.a={init:function(){}}}}]);
//# sourceMappingURL=22-2bcf43b5a6f3f0c1acbf.js.map