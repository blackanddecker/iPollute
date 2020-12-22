
           (function () {
    var pvs = window.top.location == window.self.location ? 1 : 2;
    if (window.DotMetricsInitScript == undefined) {
        window.DotMetricsInitScript = true;

        checkTCF(start);

        function NewDotMetricsLoad(DotMetricsContentLoadedFunction) {
            if (document.readyState != undefined && document.readyState != 'loading') {
                setTimeout(function () {
                    DotMetricsContentLoadedFunction();
                }, 100);
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', DotMetricsContentLoadedFunction, false);
            } else if (document.attachEvent) {
                document.attachEvent('onreadystatechange', DotMetricsContentLoadedFunction);
            } else if (window.addEventListener) {
                window.addEventListener('load', DotMetricsContentLoadedFunction, false);
            } else if (window.attachEvent) {
                window.attachEvent('onload', DotMetricsContentLoadedFunction);
            }
            if (window.location.href.indexOf('dotmetrics_debug=true') >= 0){
                DotMetricsContentLoadedFunction();
            }
        }

        function checkTCF(callback){
            //if cmp uses TCF __tcfapi function must exist
            if(typeof __tcfapi == 'function'){
                var lr=false;
                __tcfapi('addEventListener', 2, function(tcData, success){
                    if(success){
                        //if tcloaded event or user interaction with tcf is complete (useractioncomplete) check for consent
                        if(tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete'){
                            //make sure that event is handled only once regardless of removeEventListener
                            if(lr==true){return;}
                            lr=true;

                            //stop listening for TCF events
                            __tcfapi('removeEventListener', 2,function(success){},tcData.listenerId);

                            //check for vendor consent, Dotmetrics vendor id 896
                            if(tcData.vendor.consents[896]==true){
                                //we have user consent
                                callback(true);
                            }else{
                                //we dont have user consent
                                callback(false);
                            }
                        }
                    }
                });
            }else{
                //cmp does not use TCF
                callback(true);
            }
        }

        function start(hasConsent){
            var rand=new Date().getTime();
            var pvid = (Date.now().toString(36) + Math.random().toString(36).substr(2, 24));
            var domain = window.location.hostname;
            var pageUrl = encodeURIComponent(window.location);
            var imgUrl = 'https://uk-script.dotmetrics.net/hit.gif?id=5295&url=' + pageUrl + '&dom=' + domain + '&r=' + rand + '&pvs=' + pvs + '&pvid=' + pvid + '&c=' + hasConsent;

            var im=new Image;
            im.src = imgUrl;
            im.onload = function (){im.onload=null};
            if(pvs==2){return;}
            if(hasConsent==false){return;}

            NewDotMetricsLoad(function () {
                if (document.createElement) {
                    if (typeof window.DotMetricsSettings == 'undefined') {
                        window.DotMetricsSettings =
                                    {
                                        CurrentPage: window.location,
                                        Debug: false,
                                        DataUrl: 'https://uk-script.dotmetrics.net/SiteEvent.dotmetrics',
                                        PostUrl: 'https://uk-script.dotmetrics.net/DeviceInfo.dotmetrics',
                                        ScriptUrl:  'https://uk-script.dotmetrics.net/Scripts/script.js?v=175',
                                        ScriptDebugUrl:  'https://script.dotmetrics.rocks/Scripts/script.js?v=d54ceb58-a9fb-461e-8727-891dd6e4b203',
                                        PingUrl: 'https://uk-script.dotmetrics.net/Ping.dotmetrics',
                                        AjaxEventUrl: 'https://uk-script.dotmetrics.net/AjaxEvent.dotmetrics',
                                        SiteSectionId: 5295,
                                        SiteId: 973,
                                        FlashUrl: 'https://uk-script.dotmetrics.net/DotMetricsFlash.swf',
                                        TimeOnPage: 'DotMetricsTimeOnPage',
                                        AjaxEventTimeout: 2000,
                                        AdexEnabled: false,
                                        AdexConfigUrl: 'https://script.api/DotMetrics.Script.Adex/adexConfig.js?v=175&id=5295',
                                        BeaconUrl: 'https://uk-script.dotmetrics.net/BeaconEvent.dotmetrics',
                                        PVID:pvid
                                    };

                        var scriptUrl = window.DotMetricsSettings.ScriptUrl;
                        if (window.location.href.indexOf('dotmetrics_debug=true') >= 0){
                            scriptUrl = window.DotMetricsSettings.ScriptDebugUrl;
                        }

                        var fileref = document.createElement('script');
                            fileref.setAttribute('type', 'text/javascript');
                            fileref.setAttribute('src', scriptUrl);
                            fileref.setAttribute('async', 'async');
                            if (typeof fileref != 'undefined') {
                                document.getElementsByTagName('head')[0].appendChild(fileref);
                            }

                        window.postMessage({ type: 'DotmetricsDoorEvent', siteId: DotMetricsSettings.SiteId, sectionId: DotMetricsSettings.SiteSectionId},'*');

                        

                        if(window.DotMetricsSettings.AdexEnabled){
	                        fileref = document.createElement('script');
	                        fileref.setAttribute('type', 'text/javascript');
	                        fileref.setAttribute('src', window.DotMetricsSettings.AdexConfigUrl);
	                        fileref.setAttribute('async', 'async');
	                        if (typeof fileref != 'undefined') {
	                             document.getElementsByTagName('head')[0].appendChild(fileref);
                            }
                        }
                    }
                }
            });
        }
    }
})(window);