(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{"L+Ao":function(e,t,n){"use strict";n.r(t);n("QWBl"),n("FZtP");var s=n("72pY"),i=n("ZgmC");t.default={init:function(){Object(s.b)()&&document.querySelectorAll(".widget-newsletter-sign-up").forEach((function(e){new i.a({options:{},elem:e}).init()}))}}},ZgmC:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));n("ma9I"),n("TeQF"),n("pjDv"),n("yXV3"),n("oVuX"),n("E9XD"),n("sMBO"),n("zKZe"),n("07d7"),n("5s+n"),n("rB9j"),n("PKPk"),n("EnZy");var s=n("B2Tm"),i=n("72pY");function r(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var a=function(e){return!!document.cookie.split(";").filter((function(t){return t.indexOf(e)>=0})).length},o=function(){return a("IMOLOGIN=1")||a("ev_ss")},u=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.container=t.elem,this.defaults={uimap:Object(i.a)({description:".js-newsletter-sign-up-description",terms:".js-newsletter-sign-up-terms",successMessage:".js-newsletter-sign-up-success-message",successLogged:".js-newsletter-sign-up-success-logged",successAnon:".js-newsletter-sign-up-success-anon",title:".js-newsletter-sign-up-title",form:".js-newsletter-sign-up-form",emailInputWrapper:".js-newsletter-email-input-wrapper"},this.container)},this.settings=Object.assign(this.defaults,t.options)}var t,n,a;return t=e,a=[{key:"getFormData",value:function(e){return Array.from(e.querySelectorAll("input")).reduce((function(e,t){return!t.disabled&&e.push("".concat(encodeURIComponent(t.name),"=").concat(encodeURIComponent(t.value))),e}),[]).join("&")}}],(n=[{key:"init",value:function(){var t=this.settings.uimap.$form,n=this.settings.uimap.$description,i=this.settings.uimap.$terms,r=this.settings.uimap.$title,a=this.settings.uimap.$successMessage,u=this.settings.uimap.$successLogged,c=this.settings.uimap.$successAnon,l=new s.a({form:t,inputs:{email:{checks:{pattern:"^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$",required:!o()},messages:{patternMismatch:"Please enter a valid email address",valueMissing:"Please enter your email address"}}},onSubmit:function(){var s=new Promise((function(n,s){var i=new XMLHttpRequest,r=t.getAttribute("action");i.open("POST",r,!0),i.onload=function(){200===i.status?n(i.response):s(Error(i.statusText))},i.onerror=function(){s(Error("Sorry - something went wrong. Please try again."))},i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send(e.getFormData(t))}));s.then((function(e){var s=JSON.parse(e);Object.prototype.hasOwnProperty.call(s,"data")&&(t.setAttribute("hidden",""),n.setAttribute("hidden",""),i.setAttribute("hidden",""),r.setAttribute("hidden",""),a.removeAttribute("hidden"),s.logged_in?u.removeAttribute("hidden"):c.removeAttribute("hidden"),window.dataLayer&&window.dataLayer.push({event:"quick_newsletter_sign_up",newsletter:{category:"User",action:"Quick NL sign up submission",label:"".concat(window.location)}}))})),s.catch((function(e){l.addServerErrors({email:e.message}),l.setSubmitting(!1)}))}});this.renderEmailInput()}},{key:"renderEmailInput",value:function(){var e=this.settings.uimap.$emailInputWrapper,t=o();e.toggleAttribute("disabled",t),e.classList.toggle("hidden",t)}}])&&r(t.prototype,n),a&&r(t,a),e}()}}]);
//# sourceMappingURL=31-cea6c65c3296ac3e3ee3.js.map