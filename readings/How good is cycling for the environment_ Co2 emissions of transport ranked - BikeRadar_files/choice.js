'use strict';(function(){(function(){var cmpScriptElement=document.createElement('script');var firstScript=document.getElementsByTagName('script')[0];cmpScriptElement.async=true;cmpScriptElement.type='text/javascript';var cmpVersion='https://quantcast.mgr.consensu.org/tcfv2/cmp2.js';cmpScriptElement.src=cmpVersion;firstScript.parentNode.insertBefore(cmpScriptElement,firstScript);})();(function(){var css=""
+" .qc-cmp-button { "
+"   background-color: #00d7ff !important; "
+"   border-color: #00d7ff !important; "
+" } "
+" .qc-cmp-button:hover { "
+"   border-color: #00d7ff !important; "
+" } "
+" .qc-cmp-alt-action, "
+" .qc-cmp-link { "
+"   color: #00d7ff !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button:hover { "
+"   background-color: #00d7ff !important; "
+"   border-color: #00d7ff !important; "
+" } "
+" .qc-cmp-button { "
+"   color: #000 !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button:hover { "
+"   color: #000 !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button { "
+"   color: #000 !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button { "
+"   background-color: #eee !important; "
+"   border-color: transparent !important; "
+" } "
+" .qc-cmp-ui a, "
+" .qc-cmp-ui .qc-cmp-alt-action { "
+"   color: #00d7ff !important; "
+" } "
+" .qc-cmp-small-toggle.qc-cmp-toggle-on, "
+" .qc-cmp-toggle.qc-cmp-toggle-on { "
+"   background-color: #00d7ff!important; "
+"   border-color: #00d7ff!important; "
+" } "
+"#qc-cmp2-ui .qc-cmp2-footer button[mode=\"primary\"],#qc-cmp2-ui .qc-cmp2-footer button[mode=\"secondary\"] { box-shadow: none; border-width: 2px; text-transform: none; letter-spacing: normal; font-weight: 600; border-radius: 5px; font-family: open-sans,Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif; border-color: #00d7ff; \/* $color--clickable--regular *\/}#qc-cmp2-ui .qc-cmp2-footer button[mode=\"primary\"]:hover { background: #1eebff; \/* $color--clickable--light *\/}"
+""
+"";var stylesElement=document.createElement('style');var re=new RegExp('&quote;','g');css=css.replace(re,'"');stylesElement.type='text/css';if(stylesElement.styleSheet){stylesElement.styleSheet.cssText=css;}else{stylesElement.appendChild(document.createTextNode(css));}
var head=document.head||document.getElementsByTagName('head')[0];head.appendChild(stylesElement);})();var autoDetectedLanguage='en';function splitLang(lang){return lang.length>2?lang.split('-')[0]:lang;};function isSupported(lang){var langs=['en','fr','de','it','es','da','nl','el','hu','pt','ro','fi','pl','sk','sv','no','ru','bg','ca','cs','et','hr','lt','lv','mt','sl','tr','zh'];return langs.indexOf(lang)===-1?false:true;};if(isSupported(splitLang(document.documentElement.lang))){autoDetectedLanguage=splitLang(document.documentElement.lang);}else if(isSupported(splitLang(navigator.language))){autoDetectedLanguage=splitLang(navigator.language);};var choiceMilliSeconds=(new Date).getTime();window.__tcfapi('init',2,function(){},{'premiumProperties':{'nonIabVendorListUrl':'https://quantcast.mgr.consensu.org/choice/-0C6KuZYa9BXe/www.bikeradar.com/.well-known/noniab-vendorlist.json','vendorBlacklist':[27,519],},'premiumUiLabels':{},'coreUiLabels':{},'theme':{'uxPrimaryButtonColor':'#00d7ff','uxPrimaryButtonTextColor':'#000','uxSecondaryButtonTextColor':'#000','uxToogleActiveColor':'#00d7ff','uxLinkColor':'#00d7ff',},'coreConfig':{'quantcastAccountId':'-0C6KuZYa9BXe','privacyMode':["GDPR"],'hashCode':'hHNDZfR8nZ/EgFChD4fPjA','publisherCountryCode':'GB','publisherName':'BikeRadar','vendorPurposeIds':[2,3,4,5,6,7,8,9,10,1],'vendorFeaturesIds':[1,3,2],'vendorPurposeLegitimateInterestIds':[2,3,4,5,6,7,8,9,10],'vendorSpecialFeaturesIds':[1,2],'vendorSpecialPurposesIds':[1,2],'googleEnabled':true,'consentScope':'service','thirdPartyStorageType':'iframe','consentIdentityEnabled':false,'initScreenBodyTextOption':1,'consentOnSafari':false,'lang_':'en','displayUi':'always','defaultToggleValue':'off','initScreenRejectButtonShowing':false,'publisherConsentRestrictionIds':[],'publisherLIRestrictionIds':[],'softOptInEnabled':false,'showSummaryView':true,'persistentConsentLinkLocation':3,'displayPersistentConsentLink':false,'uiLayout':'popup','publisherLogo':'https://images.immediate.co.uk/production/volatile/sites/21/2017/08/Bike-Radar-logo-competitions-8e10a7c.png','publisherPurposeIds':[1,2,3,4,5,6,7,8,9,10],'publisherPurposeLegitimateInterestIds':[],'publisherSpecialPurposesIds':[],'publisherFeaturesIds':[],'publisherSpecialFeaturesIds':[],'stacks':[1,42],'vendorListUpdateFreq':30,},'nonIabVendorsInfo':{"nonIabVendorList":[{"vendorId":1,"pCode":"-0C6KuZYa9BXe","name":"Facebook","description":"Social","privacyPolicyUrl":"http://facebook.com","nonIabPurposeConsentIds":[],"nonIabPurposeLegitimateInterestIds":[]}],"updateAt":"2020-11-17T14:35:43.009476Z","nonIabVendorsHash":"BC439FC860CA54E5E6486D8EFA2511E7"}});})();