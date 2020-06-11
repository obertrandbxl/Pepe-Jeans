/*!
* GEClient v1.0.2
* www.global-e.com
*
* Copyright (c) Global-E 
*
* GEClient is the base class for the Global-E widgets library
* It define all the needed configuration, per client, it also exposes several utilities that are used by 
* Global-E Server SDK (PHP/.Net) 
*
* Authors        Eden Zaharoni
*/


//Device Detector
(function () {

    var e, t, n, r, i, s, o, u, a, f; e = window.device;
    window.device = {}; n = window.document.documentElement; f = window.navigator.userAgent.toLowerCase();
    device.ios = function ()
    { return device.iphone() || device.ipod() || device.ipad() }; device.iphone = function () { return r("iphone") }; device.ipod = function () { return r("ipod") }; device.ipad = function () { return r("ipad") }; device.android = function () { return r("android") }; device.androidPhone = function () { return device.android() && r("mobile") }; device.androidTablet = function () { return device.android() && !r("mobile") }; device.blackberry = function () { return r("blackberry") || r("bb10") || r("rim") }; device.blackberryPhone = function () { return device.blackberry() && !r("tablet") }; device.blackberryTablet = function () { return device.blackberry() && r("tablet") }; device.windows = function () { return r("windows") }; device.windowsPhone = function () { return device.windows() && r("phone") }; device.windowsTablet = function () { return device.windows() && r("touch") && !device.windowsPhone() }; device.fxos = function () { return (r("(mobile;") || r("(tablet;")) && r("; rv:") }; device.fxosPhone = function () { return device.fxos() && r("mobile") }; device.fxosTablet = function () { return device.fxos() && r("tablet") }; device.meego = function () { return r("meego") }; device.cordova = function () { return window.cordova && location.protocol === "file:" }; device.nodeWebkit = function () { return typeof window.process === "object" }; device.mobile = function () { return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego() }; device.tablet = function () { return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet() }; device.desktop = function () { return !device.tablet() && !device.mobile() }; device.portrait = function () { return window.innerHeight / window.innerWidth > 1 }; device.landscape = function () { return window.innerHeight / window.innerWidth < 1 }; device.noConflict = function () { window.device = e; return this }; r = function (e) { return f.indexOf(e) !== -1 }; s = function (e) { var t; t = new RegExp(e, "i"); return n.className.match(t) }; t = function (e) { if (!s(e)) { return n.className += " " + e } }; u = function (e) { if (s(e)) { return n.className = n.className.replace(e, "") } }
}).call(this);
//Main Class
function GEClient() {
    
    //This property is merchant specific!
    this.MerchantID = this.GetGlobalSetting("MerchantID",null);
    this.IsMobile = device.mobile();
    this.IsTablet = device.tablet();
    this.MobileScriptLoaded = false;
    this.InMobileInitiation = false;
    this.PopupReposition = null;//func to repos popups
    this.PopupRepositionContext = null;
    this.NECDisabled = this.GetGlobalSetting("NECDisabled", false);
    this.InTracking = false;
    this.MobileDetectionEnabled = true;
    this.ForceMobileDetection = false;
    this.GEPopupsEnabled = true;
    this.Country = null;
    this.PopupOpacity = null;
    this.LoadShippingSwitcherCalled = false;
    this.CookieDomain = document.domain;
    this.Currency = null;
    this.CartToken = null;
    this.Exception = null;
    this.AnalyticsInfo = null;
    this.MerchantClientId = null;
    this.CallBackLogCheckCount = 0;
    this.ScriptsVersion = null;
    this.Culture = null;
    this.LogErrors = true;
    this.waitOn = false;
    this.Loader = null;
    this.LoaderIsOn = false;    
    this.SkinEnvironmentCode = "live";
    this.FadeFX = true;
    this.GEBaseURL = "https://web.global-e.com/"; //GE base url
    this.GE_DATA_COOKIE = "GlobalE_Data"; //Data cookie name [showWelcome|cultureCode|currencyCode|countryISO]
    this.GE_ESSENTIALS_ONLY = "GE_ESSENTIALS_ONLY";
    this.GE_USB_COOKIE = "GlobalE_USB_Data"; //Cookie for unsupported browsers    
    this.GE_CT_COOKIE = "GlobalE_CT_Data"; //if allowed by merchant will store the current user guid
    this.GE_CT_TRACKED = "GlobalE_CT_Tracked"; //if not full tracking is allowed, this cookie will be created to prevent further tracking while it exists
    this.GE_DATA_WELCOME_COOKIE = "GlobalE_Welcome_Data";
    this.GE_DATA_COOKIE_EXP = 3;//(DAYS) Data cookie expiration
    this.GE_USB_COOKIE_EXP = 1;
    this.GE_CT_COOKIE_EXP = 365 * 10; //client guid cookie
    this.WelcomeManager = { Base: this, IsShown: false, Initiated: false };
    this.UnSupportaedPlatform = { Base: this };
    this.CheckoutManager = { Base: this };
    this.MobileManager = { Base: this };
    this.AlwaysShowWelcome = false;
    this.ShowWelcome = true;//default
    this.CultureChanged = false; //in current context
    this.PassFullQS = true;
    this.OnBeforeWelcomeCallback = [];
    this.OnBeforeSwitcherCallback = [];
    this.SwitcherInitiatedCallback = [];
    this.OnShippingCountryChangedCallback = [];
    this.OnWelcomeShownCallback = [];
    this.OnChangeShippingCountryClickedCallback = [];
    this.OnCheckoutStepLoadedCallback = [];
    this.OnClientEventCallback = [];
    this.InternalTrackEnabled = true;
    this.QuerySessionValidityCallback = null;
    this.MPH = null;
    this.OnBeforePopupOpenCallback = null;
    this.OnLoadCallBack = null;
    this.DynContent = [];
    this.ShowPopupOverlay = true;
    this.ProxyInitiated = false;
    this.Context = "CLIENT";
    this.CID = null;//only relevant if merchant allows tracking
    this.SESID = null //only relevant if merchant allows tracking
    this.DBG = false;
    this.Prefetcher = new GEPrefetcher(this);
    this.WelcomeUrl = null;
    this.SwitcherUrl = null;
    this.SwitcherScriptsArr = [];
    this.OnSessionInitiation = false;
    this.SSQ = [];
    this.CacheBuster = null;
    this.SwitcherRawData = null;
    this.TrackCallBackFired = false;
    this.OnShippingSwitcherClosedCallback = [];
    this.OnWelcomePopupClosedCallback = [];
    this.WindowLoaded = false;
    this.QueuePriorities = {
        "SetMerchantParameters": 1,
        "ScriptsURL": 2
    };
    var self = this;

    this.DOMReady(function () {
        self.Prefetcher.Prefetch();
    });

    this.PopupData = {
        welcome: { callback: this.OnBeforeWelcomeCallback, invoked: 0 },
        switcher: { callback: this.OnBeforeSwitcherCallback, invoked: 0 }
    };

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            return this.substr(position || 0, searchString.length) === searchString;
        };
    }
    if (!String.prototype.endsWith)
        String.prototype.endsWith = function (searchStr, Position) {
            // This works much better than >= because
            // it compensates for NaN:
            if (!(Position < this.length))
                Position = this.length;
            else
                Position |= 0; // round position
            return this.substr(Position - searchStr.length,
                searchStr.length) === searchStr;
        };
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fun /*, thisp*/) {
            var len = this.length >>> 0;
            if (typeof fun !== "function") {
                throw new TypeError();
            }

            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in this) {
                    fun.call(thisp, this[i], i, this);
                }
            }
        };
    }
    String.prototype.bool = function () {
        return (/^true$/i).test(this);
    };


    if (this.GetQueryParam("geskinmode") !== null) {
        this.SkinEnvironment(this.GetQueryParam("geskinmode"));
    }
    if (this.GetQueryParam("geismobile") !== null && this.GetQueryParam("geismobile") === "true") {
        this.IsMobile = true;
        this.ForceMobileDetection = true;
    }
    if (this.GetQueryParam("geistablet") != null && this.GetQueryParam("geistablet") === "true") {
        this.IsTablet = true;
        this.ForceMobileDetection = true;
    }
    if (this.GetQueryParam("gesw") != null && this.GetQueryParam("gesw") == "false") {
        this.ShowWelcome = false;
    }

    this.ForceCleanCookies();
}

function GEPrefetcher(client) {
    this.Base = client;
}

//Load prefetching URL to speed checkout load times
GEPrefetcher.prototype.Prefetch = function () {
    var self = this;
    if (this.Base.MerchantID == null) {
        //wait for merchant id to be available
        setTimeout(function () {
            self.Prefetch();
        }, 200);
    }
    else {
        try {
            //var cacheBuster = GlobalE.MPH.Get(MPH.K.CacheBuster, MPH.T.String);

            //get merchant and country
            var mId = this.Base.MerchantID;
            //Get current country
            var cookieData = this.Base.GetCookie(GlobalE.GE_DATA_COOKIE, true) ||
                { countryISO: 'IL' };

            var country = cookieData.countryISO;
            var bypassPrefetch = false;
            if (typeof country == undefined ||
                country == null ||
                country == "") {
                bypassPrefetch = true;
            }

            if (!bypassPrefetch) {
                var url = this.Base.GetCDNUrl();
                url += "shared/prefetcher/" + mId + "/" + country;
                if (GlobalE.CacheBuster != null) {
                    url += "?cb=" + GlobalE.CacheBuster;
                }
                //create iframe
                var iframe = document.createElement("iframe");
                iframe.setAttribute("src", url);
                iframe.setAttribute("title", "ge_speedup_checkout");
                iframe.setAttribute("width", "1px");
                iframe.setAttribute("height", "1px");
                iframe.style.display = "none";

                document.getElementsByTagName("body")[0].appendChild(iframe);
            }
        }
        catch (err) {
            console.log("prefetch error!");
        }
    }

}
GEClient.prototype.GetGlobalSetting = function (key, defaultValue) {
    if (typeof GLOBALE_ENGINE_CONFIG == "undefined")
        return defaultValue;
    else if (!GLOBALE_ENGINE_CONFIG.hasOwnProperty(key)) {
        return defaultValue;
    }
    else {
        return GLOBALE_ENGINE_CONFIG[key];
    }
}
//disable none essential cookie
GEClient.prototype.DisableNEC = function (expirationDays) {
    //    enabled = this.IsUndefined(enabled) ? true : enabled;
    this.SetCookie(this.GE_ESSENTIALS_ONLY, true, expirationDays, true);
    //delete all none essentials cookie
    this.EraseCookie(this.GE_CT_TRACKED);
    this.EraseCookie(this.GE_CT_COOKIE);
    this.EraseCookie(gleTags.TAGS_COOKIE);
}

GEClient.prototype.ForceCleanCookies = function () {
    if (this.NECDisabled) {
        var sesCookie = this.GetCookie(this.GE_CT_COOKIE, true);
        if (sesCookie != null) {
            //cookie exists from older sessions, clear
            this.DisableNEC(365);
        }
    }
}

GEClient.prototype.IsNECAllowed = function () {
    if (this.NECDisabled) return false;
    var necValueStr = this.GetCookie(this.GE_ESSENTIALS_ONLY, false);
    if (necValueStr != null) {
        try {
            var necOnly = necValueStr.bool();
            return !necOnly;
        }
        catch (err){
            return true;
        }
    }
    return true;
    

}
//For backward compatibility only
GEClient.prototype.AppendAB = function (url) {
    return url;
}
GEClient.prototype.GetPopupCallbackData = function (popup) {
    for (var item in this.PopupData) {
        if (item == popup) {
            return this.PopupData[item];
        }
    }
}
GEClient.prototype.IsPlatformSupported = function () {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1);
        if (ieversion <= 7) {
            return false;
        }
    }

    return true;
}
GEClient.prototype.ShowLoader = function (isShow) {
    try {
        var self = this;
        if (isShow) {
            this.LoaderIsOn = true;
            this.Loader.style.display = "block";
        }
        else {
            if (!this.LoaderIsOn) return;
            this.LoaderIsOn = false;
            this.Loader.style.display = "none";
        }
    }
    catch (err) {
        console.log("show loader error " + err.message);
    }
} 
GEClient.prototype.InitLoader = function (onloadCallback, css, template) {
    if (this.Loader != null) {
        //initiated
        if (!this.IsUndefined(onloadCallback)) {
            onloadCallback();
        }
    }
    else {
        if (this.IsUndefined(css) || this.IsUndefined(template)) {
            //load loader info
            var url = this.GetCDNUrl();
            url = url + "merchant/script/initLoader/" + this.MerchantID;
            this.AddScript(url, onloadCallback);
        }
        else {
            //add css
            this.AddStyleString("gleCheckoutLoaderCSS", css);
            //create fixed div
            var container = document.createElement("div");
            container.className = "gle_custom_loader_overlay";
        
            //insert templated data
            container.innerHTML = template;

            document.body.appendChild(container);

            this.Loader = container;

            if (!this.IsUndefined(onloadCallback)) {
                onloadCallback();
            }
        }
    }
}

GEClient.prototype.Wait = function () {
    this.waitOn = true;
}
GEClient.prototype.Release = function () {
    this.waitOn = false;
}
GEClient.prototype.HandleQAction = function (data) {

    var action = data[0];
    var arr = Array.prototype.slice.apply(data)
    arr = arr.slice(1);

    switch (action) {
        case "ShippingSwitcher":
            this.SSQ.push(arr);
            break;
        default:
            if (!this.IsUndefined(GlobalE[action]))
            {
                GlobalE[action].apply(GlobalE, arr);
            }            
            break;
    }
}
GEClient.prototype.SetContext = function (context) {
    this.Context = context;
}
GEClient.prototype.OnBeforePopupOpen = function (callback) {
    this.OnBeforePopupOpenCallback = callback;
}
GEClient.prototype.QuerySessionValidity = function (callback) {
    this.QuerySessionValidityCallback = callback;
}
GEClient.prototype.OnCheckoutStepLoaded = function (callback) {
    this.OnCheckoutStepLoadedCallback.push(callback);
}
GEClient.prototype.OnClientEvent = function (callback) {
    this.OnClientEventCallback.push(callback);
}
GEClient.prototype.OnBeforeWelcome = function (callback) {
    this.OnBeforeWelcomeCallback.push(callback);
}
GEClient.prototype.OnShippingCountryChanged = function (callback) {
    this.OnShippingCountryChangedCallback.push(callback);
}
GEClient.prototype.OnWelcomeShown = function (callback) {
    this.OnWelcomeShownCallback.push(callback);
}
GEClient.prototype.OnChangeShippingCountryClicked = function (callback) {
    this.OnChangeShippingCountryClickedCallback.push(callback)
}
GEClient.prototype.OnBeforeSwitcher = function (callback) {
    this.OnBeforeSwitcherCallback.push(callback);
}


GEClient.prototype.DynamicContent = function (popup, key, value) {
    popup = popup.toLowerCase();
    if (this.DynContent[popup] == null) {
        this.DynContent[popup] = [];
    }
    this.DynContent[popup].push({ "key": key, "value": value });
}
GEClient.prototype.OnShippingSwitcherClosed = function (callback) {
    this.OnShippingSwitcherClosedCallback.push(callback);

}

GEClient.prototype.OnWelcomePopupClosed = function (callback) {
    this.OnWelcomePopupClosedCallback.push(callback);
}

GEClient.prototype.SwitcherInitiated = function (callback) {
    this.SwitcherInitiatedCallback.push(callback);
}
GEClient.prototype.ActionExec = function () {
    GlobalE.HandleQAction(arguments);
}
//Check is an object is undefined
GEClient.prototype.IsUndefined = function (obj) {
    if (typeof obj == "undefined" || obj == null)
        return true;
    else
        return false;
}
GEClient.prototype.IsUndefinedOrEmpty = function (obj) {
    if (this.IsUndefined(obj)) return true;
    if (typeof obj == "string" && obj == "") return true;
    return false;
}
//Gets a client cookie, if isJson is true, the cookie content is return after json deserialization
GEClient.prototype.GetCookie = function (c_name, isJson) {
    try {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }

        if (!this.IsUndefined(isJson) && isJson) {
            return JSON.parse(c_value);
        }

        return c_value;
    }
    catch (ex) {
        this.HandleError(ex, "GetCookie");
    }
}
GEClient.prototype.SetParam = function (paramName, paramValue) {
    this[paramName] = paramValue;
}

GEClient.prototype.EraseCookie = function (name) {
    if (this.CookieDomain == null) {
        this.CookieDomain = document.domain;
    }
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=" + this.CookieDomain + ";path=/";
}

//Sets a cookie, if isJson is true, the value is serialized to json
GEClient.prototype.SetCookie = function (c_name, value, expire, isJson, isMinutes) {
    try {
        //GlobalE.CookieDomain = ".merchantdemo.com"; //DEBUG DEBUG DEBUG
        if (this.CookieDomain == null) {
            this.CookieDomain = document.domain;
        }
        if (!this.IsUndefined(isJson) && isJson) {
            value = JSON.stringify(value);
        }
        var exdate = new Date();
        if (!isMinutes)
            exdate.setDate(exdate.getDate() + expire);
        else
            exdate.setTime(exdate.getTime() + expire * 60 * 1000)

        var c_value = escape(value) + ((expire == null) ? "" : "; expires=" + exdate.toUTCString()) + ";domain=" + this.CookieDomain + ";path=/";
        var enforceSamesite = GlobalE.MPH.Get(MPH.K.EnforceSameSiteCookie, MPH.T.Bool);
        if (enforceSamesite) {
            c_value += ";SameSite=Lax";
        }
        document.cookie = c_name + "=" + c_value;
    }
    catch (ex) {
        this.HandleError(ex, "SetCookie");
    }
}

GEClient.prototype.AddMeta = function (name, content) {
    //check for existing
    var prevMeta = document.querySelector("meta[name=" + name + "]");
    if (prevMeta != null) {
        //remove existing viewport
        prevMeta.parentElement.removeChild(prevMeta);
    }
    var meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.getElementsByTagName("head")[0].appendChild(meta);
}

GEClient.prototype.AddIMG = function (url) {
    var i = document.createElement("img");
    i.width = 1;
    i.height = 1;
    i.src = url;

}
//Adds a <script> tag to the head
GEClient.prototype.AddScript = function (url, onLoad, isAsync, onError) {
    try {
        var self = this;
        isAsync = this.IsUndefined(isAsync) ? false : isAsync;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = url;
        s.async = (isAsync) ? true : false;
        s.addEventListener('error', function (e) {
            if (!self.IsUndefined(onError)) {
                onError();
            }
        }, true);
        if (!this.IsUndefined(onLoad)) {
            this.RegisterScriptLoad(s, onLoad);
        }
        document.getElementsByTagName("head")[0].appendChild(s);
    }
    catch (ex) {
        this.HandleError(ex, "AddScript");
    }
}

GEClient.prototype.HandleError = function (ex, f) {
    if (this.LogErrors) {
        console.log("Exception in GEClient." + f + " : " + ex.message);
    }
}

GEClient.prototype.IsStylesheetAdded = function (href) {
    try {
        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
            if (links[i].getAttribute("rel") == "stylesheet") {
                if (links[i].getAttribute("href") == href) {
                    return true;
                }
            }
        }

        return false;
    }
    catch (ex) {
        this.HandleError(ex, "IsStylesheetAdded");
    }
}
GEClient.prototype.AddStyleString = function (id, cssString) {

    var styleObj = document.getElementById(id);
    if (!styleObj) {
        styleObj = document.createElement("style");
        styleObj.id = id;
        styleObj.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(styleObj);
    }
    if (styleObj.styleSheet) {
        styleObj.styleSheet.cssText = cssString;
    } else {
        if (styleObj.childNodes.length > 0) {
            //Removed on 30/6 - adding styles will not remove previous styles
            //styleObj.removeChild(styleObj.childNodes[0]);
        }
        styleObj.appendChild(document.createTextNode(cssString));
    }
}

//Adds a <link with a css file to the head 
GEClient.prototype.AddStyle = function (url, onLoad) {
    try {
        if (this.IsStylesheetAdded(url)) {
            if (!this.IsUndefined(onLoad)) {
                onLoad();
            }
            return;
        }
        var s = document.createElement("link");
        s.rel = "stylesheet";
        s.type = "text/css";
        s.href = url;

        if (!this.IsUndefined(onLoad)) {
            this.RegisterScriptLoad(s, onLoad);
        }

        document.getElementsByTagName("head")[0].appendChild(s);
    }
    catch (ex) {
        this.HandleError(ex, "AddStyle");
    }
}

GEClient.prototype.GetReloadURL = function () {

    var finalURL = "";
    if (this.IsHashExist()) {
        //hash exists
        finalURL = this.AddParameter(window.location.href, "geRpwh", new Date().getTime(), false);
    }
    else {
        finalURL = window.location.href;
    }

    return finalURL.replace(/((glCountry|glCurrency)=.*?(&|$))+/i, "");

}
GEClient.prototype.AddParameter = function (url, parameterName, parameterValue, atStart/*Add param before others*/) {
    replaceDuplicates = true;
    if (url.indexOf('#') > 0) {
        var cl = url.indexOf('#');
        urlhash = url.substring(url.indexOf('#'), url.length);
    } else {
        urlhash = '';
        cl = url.length;
    }
    sourceUrl = url.substring(0, cl);

    var urlParts = sourceUrl.split("?");
    var newQueryString = "";

    if (urlParts.length > 1) {
        var parameters = urlParts[1].split("&");
        for (var i = 0; (i < parameters.length); i++) {
            var parameterParts = parameters[i].split("=");
            if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                if (newQueryString == "")
                    newQueryString = "?";
                else
                    newQueryString += "&";
                newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
            }
        }
    }
    if (newQueryString == "")
        newQueryString = "?";

    if (atStart) {
        newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
    } else {
        if (newQueryString !== "" && newQueryString != '?')
            newQueryString += "&";
        newQueryString += parameterName + "=" + (parameterValue ? parameterValue : '');
    }
    return urlParts[0] + newQueryString + urlhash;
};
GEClient.prototype.ReloadPage = function (optUrl) {
    if (this.waitOn) {
        var self = this;
        //wait was activated
        setTimeout(function () {
            self.ReloadPage(optUrl);
        }, 300);
    }
    else {
        if (this.IsUndefined(optUrl)) {
            window.location = this.GetReloadURL();// href;
        }
        else {
            window.location = optUrl;
        }
    }
}
GEClient.prototype.IsHashExist = function () {
    if ((this.GetHashState() & 2) || (this.GetHashState() & 4)) {
        return true;
    }

    return false;
}
GEClient.prototype.GetHashState = function (href) {
    var frag = (href || window.location.href).split('#');
    return frag.length == 1 ? 1 : !frag[1].length ? 2 : 4;
}
//When needed to change shippment country or payment currency, this method can be called
GEClient.prototype.UpdateCustomerInfo = function (countryISO, currencyCode, doReload, optUrl) {
    try {
        var data = this.GetCookie(this.GE_DATA_COOKIE, true);

        if (this.IsUndefined(data)) {
            data = {};
        }
        if (!this.IsUndefined(countryISO) && countryISO.length == 2) {
            //update country iso
            data.countryISO = countryISO;
        }
        if (!this.IsUndefined(currencyCode) && currencyCode.length == 3) {
            //update currency iso
            data.currencyCode = currencyCode;
        }

        this.SetCookie(this.GE_DATA_COOKIE, data, this.GE_DATA_COOKIE_EXP, true);


        if (!this.IsUndefined(doReload) && doReload) {
            this.ReloadPage(optUrl);
        }
    }
    catch (ex) {
        this.HandleError(ex, "UpdateCustomerInfo");
    }
}



GEClient.prototype.AttachEvent = function (evnt, elem, func) {

    try {
        if (elem.addEventListener)  // W3C DOM
        {
            elem.addEventListener(evnt, func, false);
        }
        else if (elem.attachEvent) { // IE DOM                   
            elem.attachEvent("on" + evnt, func);
        }
        else { // No much to do
            elem[evnt] = func;
        }
    }
    catch (ex) {
        this.HandleError(ex, "AttachEvent");
    }
}

//Cross Browser event triggering 
GEClient.prototype.FireEvent = function (element, eventName, optArgs) {
    try {
        var e = null;
        if (document.createEvent) {
            //others
            e = document.createEvent('HTMLEvents');
            e.data = optArgs;
            e.initEvent(eventName, true, true);
            element.dispatchEvent(e);
        }
        else if (document.createEventObject) {
            //ie
            e = document.createEventObject();
            e.data = optArgs;
            element.fireEvent('on' + eventName, e);
        }

    }
    catch (ex) {
        this.HandleError(ex, "FireEvent");
    }
}


GEClient.prototype.IsStylesheetExist = function (url) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        var ss = document.styleSheets[i];
        if (ss.href == url) {
            return true;
        }
    }

    return false;
}

//Helper Method - registers onload on script/link elements
GEClient.prototype.RegisterScriptLoad = function (scriptElement, callback) {

    try {
        var self = this;
        var fired = [];
        var linkCount = document.styleSheets.length;
        //for nonIE browsers
        scriptElement.onload = function () {
            if (fired.length == 0) {
                fired.push(true);
                callback();
            }
        }
        if (self.DetectIE()) {
            this.IELoad(scriptElement, callback, fired);
        }

    }
    catch (ex) {
        this.HandleError(ex, "RegisterScriptLoad");
    }
}
GEClient.prototype.IELoad = function (script, callback, fired) {
    var self = this;
    if (script.readyState == 'loaded' || script.readyState == 'completed') {
        if (fired.length == 0) {
            fired.push(true);
            callback();
        }
    } else {
        //console.log("settimeout");
        if (fired.length == 0) {
            setTimeout(function () { self.IELoad(script, callback, fired); }, 100);
        }
    }
}
GEClient.prototype.DetectIE = function () {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result �

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // IE 12 / Spartan
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge (IE 12+)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
//LOADER HELPERS

GEClient.prototype.SetOpacity = function (elementId, opacity) {

    try {
        var element = document.getElementById(elementId);
        if (element) {
            element.style.opacity = opacity / 100;
            element.style.filter = 'alpha(opacity=' + opacity + ')';
        }
    }
    catch (err) {

    }
}
GEClient.prototype.FadeProc = function (eID, i, timer, speed, stopOpacity, optCallback) {
    setTimeout(function () {
        GlobalE.SetOpacity(eID, i);
    }, timer * speed);

    if (i == stopOpacity) {
        setTimeout(function () {
            //done
            if (optCallback) {
                optCallback();
            };
        }, timer * speed);
    }
}
GEClient.prototype.Fade = function (eID, startOpacity, stopOpacity, duration, optCallback) {
    if (!document.getElementById(eID)) return;
    var speed = Math.round(duration / 100);
    var timer = 0;
    var self = this;
    if (startOpacity < stopOpacity) { // fade in
        for (var i = startOpacity; i <= stopOpacity; i++) {
            this.FadeProc(eID, i, timer, speed, stopOpacity, optCallback);
            timer++;
        } return;
    }
    for (var i = startOpacity; i >= stopOpacity; i--) { // fade out
        this.FadeProc(eID, i, timer, speed, stopOpacity, optCallback);
        timer++;
    }
}

GEClient.prototype.PopupsEnabled = function (enabled) {
    this.GEPopupsEnabled = enabled;
}
GEClient.prototype.SetCookieDomain = function (domain) {
    this.CookieDomain = domain;
}


GEClient.prototype.CloseUnsupportedPlatformPopup = function (e) {
    var overlay = document.getElementById("uspOverlay");
    var content = document.getElementById("uspContent");

    document.getElementsByTagName("body")[0].removeChild(overlay);
    document.getElementsByTagName("body")[0].removeChild(content);
}

GEClient.prototype.SkinEnvironment = function (code) {
    if (code != "test" && code != "live") return;
    this.SkinEnvironmentCode = code;
}
GEClient.prototype.SetDebug = function () {
    //this.AlwaysShowWelcome = true;
    this.DBG = true;
}

GEClient.prototype.GetOrCreateUID = function () {
    //first check if cuid exists in cookie
    var clientIdObj = GlobalE.GetIDCookie();
    if (GlobalE.IsUndefined(clientIdObj) || clientIdObj.CUID == null) {
        var generator = function (min, max) { // min and max included
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        var maxGen = 999999999;
        var minGen = 100000000;
        var leftPart = generator(minGen, maxGen);
        var rightPart = generator(minGen, maxGen);
        var cuid = leftPart + "." + rightPart;

        if (GlobalE.MerchantID != null) {
            cuid += "." + GlobalE.MerchantID;
        }
        //update cookie
        var chkcuid = GlobalE.IsUndefined(clientIdObj) ? null : clientIdObj.CHKCUID;
        GlobalE.SetIDCookie(cuid, chkcuid);
        return cuid;
    }
    else {
        return clientIdObj.CUID;
    }
}

GEClient.prototype.ScriptsURL = function (url) {
    if (!/\/$/.test(url)) {
        url += "/";
    }
    this.GEBaseURL = url;
}
GEClient.prototype.OnLoad = function (callback) {
    this.OnLoadCallBack = callback;
}

var popupStackCallbacks = [];

GEClient.prototype.RegisterOnBeforePopup = function (popup, country, culture, currency, complete) {
    var data = this.GetPopupCallbackData(popup);

    if (data.callback.length == 0) {
        if (!this.IsUndefined(complete)) {
            complete();
        }
        return;
    }

    data.invoked = 0;
    var self = this;
    var args = {
        country: country.toUpperCase(),
        culture: culture.toUpperCase(),
        currency: currency.toUpperCase(),
        onComplete: function (arrData) {
            if (!self.IsUndefined(arrData)) {

                //arrData = [{key : "", value : ""},{key : "", value : ""}]
                for (var i = 0; i < arrData.length; i++) {
                    self.DynamicContent(popup, arrData[i].key, arrData[i].value);
                }
            }
            var popupData = self.GetPopupCallbackData(popup);
            popupData.invoked++;
            if (!self.IsUndefined(complete)) {
                if (popupData.invoked == popupData.callback.length) {
                    complete();
                }
            }
        }
    };



    this.FireStack(data.callback, args);

    //if (popup == "welcome") {
    //    this.FireStack(this.OnBeforeWelcomeCallback,args);
    //}
    //else if (popup == "switcher") {
    //    this.FireStack(this.OnBeforeSwitcherCallback,args);
    //}

}
//Helper
GEClient.prototype.IsOnCheckoutStepLoaded = function (args) {
    if (args != null &&
        args.length > 1 &&
        typeof args[1] === "object" &&
        args[1].hasOwnProperty("isOnCheckoutStepLoad") && 
        args[1].isOnCheckoutStepLoad == true) {
        return true;
    }
    else {
        return false;
    }
}
GEClient.prototype.FireStack = function (stackArr) {
    var retData = [];
    var args = Array.prototype.slice.call(arguments, 1);
    var isChekoutStepLoaded = this.IsOnCheckoutStepLoaded(args);
    var self = this;
    stackArr.forEach(function (v, i, arr) { 
        var isSuccess = true;
        var error = null;
        var response = null;
        try {
            response = v.apply(GlobalE, args);
            retData.push(response);
            isSuccess = true;
        }
        catch (err) {
            isSuccess = false;
            error = err.message;
        }
        finally
        {        
            var doLog = true;
            //check for surprase log
            if (!self.IsUndefined(response)) {
                if (response.suppressLog) {
                    doLog = !response.suppressLog;
                }
            }
            if (isChekoutStepLoaded && doLog) {
                var orderId = null;
                if (args[0].hasOwnProperty("OrderId")) {
                    orderId = args[0].OrderId;
                }
                //fire log event to GE
                self.CheckoutLog({
                    "stepId": args[0].StepId,
                    "isSuccess": isSuccess,
                    "error": error,
                    "orderId": orderId,
                    "isCallbackFound": true
                });
            }
        }
    });

    return retData;
}

//GEClient.prototype.RegisterOnBeforeWelcome = function (country, culture, currency,complete) {
//    var self = this;
//    this.FireStack(this.OnBeforeWelcomeCallback,{
//        country: country.toUpperCase(),
//        culture: culture.toUpperCase(),
//        currency: currency.toUpperCase(),
//        onComplete: function (arrData) {
//            if (!self.IsUndefined(arrData)) {
//                //arrData = [{key : "", value : ""},{key : "", value : ""}]
//                for (var i = 0; i < arrData.length; i++) {
//                    self.DynamicContent("welcome", arrData[i].key, arrData[i].value);
//                }
//            }

//            if (!self.IsUndefined(complete)) {
//                complete();
//            }
//        }
//    });
//}
GEClient.prototype.IsClient = function () { return this.Context == "CLIENT"; }
GEClient.prototype.IsServer = function () { return this.Context != "CLIENT"; }
GEClient.prototype.LoadUnsupportedPlatformProc = function () {
    var self = this;

    //first we check if we need to abort
    if (this.IsClient() && !this.DBG) {

        var pdata = this.GetCookie(this.GE_USB_COOKIE, false);

        if (!this.IsUndefined(pdata)) {
            //abort                    
            return;
        }
        else {
            //unsupported popup was not shown in the last X days, we need to create a cookie to prevent showing it again for X days
            this.SetCookie(this.GE_USB_COOKIE, "true", this.GE_USB_COOKIE_EXP, false);
        }
    }

    var data = this.GetCookie(this.GE_DATA_COOKIE, true);
    var cultureCode = null;
    if (!this.IsUndefined(data)) {
        cultureCode = data.cultureCode;
    }

    baseurl = this.GEBaseURL + "merchant/unsupportedPlatform?merchantId=" + this.MerchantID + "&ctx=" + this.Context + "&v=" + this.ScriptsVersion;
    if (cultureCode != null) {
        baseurl += "&culture=" + cultureCode;
    }
    this.AddScript(baseurl, function () {

    }, true);
}

//updates the merchant parameters from global-e servers
GEClient.prototype.SetMerchantParameters = function (objParameters) {
    this.MPH.P = objParameters;
    var data = this.GetCookie(this.GE_DATA_COOKIE, true);
    if (data != null) {
        //if info cookie is present , extract the data in order to send it as part of the tracking call
        this.Country = data.countryISO;
        this.Currency = data.currencyCode;
        this.Culture = data.cultureCode;
    }


}

//Check for mobile mode
GEClient.prototype.IsMobileMode = function () {

    return this.IsMobile && (this.MobileDetectionEnabled || this.ForceMobileDetection);
}
//Check for tablet mode
GEClient.prototype.IsTabletMode = function () {
    var tabletAsMobile = GlobalE.MPH.Get(MPH.K.TabletAsMobile, MPH.T.Bool);
    return this.IsTablet && tabletAsMobile && (this.MobileDetectionEnabled || this.ForceMobileDetection);
}
//return the identification cookie that holds the current client id
GEClient.prototype.GetIDCookie = function () {
    var sesCookie = this.GetCookie(this.GE_CT_COOKIE, true);
    if (this.IsUndefined(sesCookie)) {
        //try from storage
        sesCookie = ge_ls.Get(this.GE_CT_COOKIE);
        if (sesCookie == null) {
            var cachePin = new Date().valueOf();
            sesCookie = { CUID: null, CHKCUID: null };
        }
        else {
            //set json
            try {
                sesCookie = JSON.parse(sesCookie);
            }
            catch (err) {}
        }
    }        
    return sesCookie;
}
GEClient.prototype.SetCHKIDCookie = function (chkCuid) {
    if (this.IsNECAllowed()) {
        var data = this.GetIDCookie();
        data.CHKCUID = chkCuid;
        this.SetCookie(this.GE_CT_COOKIE, data, 365 * 2, true);
        try {
            ge_ls.Set(this.GE_CT_COOKIE, JSON.stringify(data));
        }
        catch (err) {}
    }
}
GEClient.prototype.SetIDCookie = function (token, checkoutIdToken) {
    var data = { CUID: token, CHKCUID: checkoutIdToken };
    this.SetCookie(this.GE_CT_COOKIE, data, 365 * 2, true);
    //save in storage
    try {
        ge_ls.Set(this.GE_CT_COOKIE, JSON.stringify(data));
    }
    catch (err) {}
}

GEClient.prototype.SessionInitiatorCallBack = function () {

}

GEClient.prototype.InvokePopupReposition = function (popup) {
    this.PopupReposition.call(this.PopupRepositionContext, popup);
}

GEClient.prototype.SetRepositioner = function (defaultFunc, context) {
    //check for mobile
    this.PopupRepositionContext = context;
    if (this.IsMobileMode() || this.IsTabletMode()) {
        //repositioner is from client lib
        this.PopupReposition = this.MobileManager.MobileRePosition;
    }
    else {
        //default repositioner
        this.PopupReposition = defaultFunc;
    }
}


GEClient.prototype.InitMobileDevices = function (oncomplete) {
    var self = this;

    if (!this.InMobileInitiation) {
        this.InMobileInitiation = true;

        if (!(this.IsMobileMode() || this.IsTabletMode()) || this.MobileScriptLoaded) {
            self.InMobileInitiation = false;
            oncomplete();
            return;
        }
        var url = this.GEBaseURL + "scripts/merchants/globale.merchant.client.mobileJS.js?v=" + this.ScriptsVersion;
        this.AddScript(url, function () {
            self.InMobileInitiation = false;
            oncomplete();
        }, true);
    }
    else {
        setTimeout(function () {
            self.InitMobileDevices(oncomplete);
        }, 200);
    }
}

//Used to get current cache buster and to update session info
GEClient.prototype.SessionInitiator = function () {
    var self = this;
    if (this.OnSessionInitiation) { //currently doing a track
        setTimeout(function () {
            self.SessionInitiator();
        }, 100);
        return;
    }
    this.OnSessionInitiation = true;
    var sessionId = null;
    var country = null;
    //try get session ID
    var trackedCookie = this.GetCookie(this.GE_CT_TRACKED, true);
    if (trackedCookie != null) {
        if (!this.IsUndefined(trackedCookie.SESID)) {
            sessionId = trackedCookie.SESID;
        }
    }

    var data = this.GetCookie(this.GE_DATA_COOKIE, true);
    if (data != null) {
        //if info cookie is present , extract the data in order to send it as part of the tracking call
        country = data.countryISO;
    }

    if (sessionId != null && country != null) {
        var url = this.GEBaseURL;
        url = url + "gesc";
        url += "?si=" + sessionId;
        url += "&country=" + country;
        url += "&mid=" + this.MerchantID;

        this.AddScript(url, null, true, function () {
            console.log("error loading session initiator service");
        });
    }
}
GEClient.prototype.IsDataCookieExist = function () {
    var cookieData = this.GetCookie(GlobalE.GE_DATA_COOKIE, true);
    return cookieData != null;
}

//When client tracking is enabled, this function makes the actual tracking through global-e servers
GEClient.prototype.Track = function (optUrl, igGeObject) {
    //GlobalE.MPH.P.PixelAddress = { "Value": "https://utils.bglobale.com:3001" };//DEBUG DEBUG DEBUG
    var self = this;
    //below condition will be met when GEM was loaded for the first time, this means we'll need
    //to wait for the init session cookie creation 
    if ((GlobalE.MerchantID == null || !GlobalE.IsDataCookieExist()) &&
        typeof GEPROXY != "undefined" &&
        !this.ProxyInitiated) {
        //PROXY MODE
        GEPROXY.OnInitSessionComplete = function () {      
            self.ProxyInitiated = true;
            gleTags.TrackV2(optUrl);
        }
    }
    else {
        //normal mode
        //Always send current location if optional URL was not supplied 
        gleTags.TrackV2(optUrl);
    }



}

GEClient.prototype.RegisterEventHandlers = function () {

    var gleBoxes = document.querySelectorAll(".gleContainer")
    for (var i = 0; i < gleBoxes.length; i++) {
        var el = gleBoxes[i];
        this.AttachEvent("click", el, function (e) {
            if (e.target.className.indexOf("gleShowSwitcher") != -1) {
                e.preventDefault();
                gle("ShippingSwitcher", "show");
            }
        });
    }

}


GEClient.prototype.LoadUnsupportedPlatform = function () {

    //get culture
    var self = this;
    //first load JSON parser to support IE7
    var jsonObjUrl = this.GEBaseURL + "/scripts/json2.js";
    if (typeof JSON !== 'object') {
        self.AddScript(jsonObjUrl, function () {
            self.LoadUnsupportedPlatformProc();
        }, true);
    }
    else {
        this.LoadUnsupportedPlatformProc();
    }
}

//Provides functionality to easly load the welcome & shipping and currency switcher when needed
GEClient.prototype.LoadWelcome = function (country, culture, currency, callback) {
    var self = this;
    var root = this.GetCDNUrl();

    self.InitMobileDevices(function () {
        if (!self.IsPlatformSupported()) return;
        self.RegisterOnBeforePopup("welcome", country, culture, currency, function () {

            //check if switcher data needs to be added
            var loadSwitcherData = self.MPH.Get(MPH.K.AddShippingSwitcherDataToClientSDK, MPH.T.Bool);


            baseurl = root + "merchant/script/welcome?merchantid=" + self.MerchantID + "&country=" + country + "&culture=" + culture + "&currency=" + currency + "&v=" + self.GetSkinVersion() + "&environment=" + self.SkinEnvironmentCode + "&ismobile=" + self.IsMobile + "&loadSwitcherData=" + loadSwitcherData;
            //var cacheBuster = GlobalE.MPH.Get(MPH.K.CacheBuster, MPH.T.String);
            //var cacheBuster = self.GetCacheBuster();
            //if (cacheBuster != null) {
            //    baseurl += "&cb=" + cacheBuster;
            //}

            self.WelcomeUrl = baseurl;
            self.AddScript(baseurl, callback, true);
        });

    });
}

GEClient.prototype.GetQueryParam = function (q, optUrl) {
    var url = this.IsUndefined(optUrl) ? window.location.search : optUrl;
    var match = RegExp('[?&]' + q + '=([^&]*)').exec(url);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

GEClient.prototype.PushSwitcherLoaded = function (country, culture, currency) {
    this.SwitcherScriptsArr.push({ country: country, culture: culture, currency: currency });
}

GEClient.prototype.IsSwitcherLoaded = function (country, culture, currency) {
    for (var i = 0; i < this.SwitcherScriptsArr.length; i++) {

        for (var prop in this.SwitcherScriptsArr[i]) {
            //alert(keys[i][prop]);
            var allMatch = true;

            switch (prop) {
                case "country":
                    allMatch = allMatch && this.SwitcherScriptsArr[i][prop] == country; break;
                case "culture":
                    allMatch = allMatch && this.SwitcherScriptsArr[i][prop] == culture; break;
                case "currency":
                    allMatch = allMatch && this.SwitcherScriptsArr[i][prop] == currency; break;
            }


        }
        if (allMatch) {
            return true;//key was already added
        }

    }

    return false;//key was not found!
}


GEClient.prototype.LoadShippingSwitcherEx = function (autoShow, callback, isModal) {
    //get info from cookie
    var cookieData = this.GetCookie(GlobalE.GE_DATA_COOKIE, true);
    isModal = this.IsUndefined(isModal) ? false : isModal;
    this.LoadShippingSwitcher(cookieData.countryISO, cookieData.cultureCode, cookieData.currencyCode, autoShow, callback, null, isModal);
}

GEClient.prototype.LoadShippingSwitcher = function (country, culture, currency, as, callback, callOnBeforeCallback, isModal) {
    var self = this;

    if (!this.IsPlatformSupported()) return;
    if (this.LoadShippingSwitcherCalled) {
        if (!this.IsUndefined(callback)) {
            callback();
        }
        return;
    }

    var root = this.GetCDNUrl();
    this.LoadShippingSwitcherCalled = true;

    this.InitMobileDevices(function () {
        as = self.IsUndefined(as) ? false : as;
        callOnBeforeCallback = self.IsUndefined(callOnBeforeCallback) ? true : callOnBeforeCallback;

        self.RegisterOnBeforePopup("switcher", country, culture, currency, function () {

            //GlobalE.SwitcherRawData
            //check if switcher data needs to be added
            var loadSwitcherData = self.MPH.Get(MPH.K.AddShippingSwitcherDataToClientSDK, MPH.T.Bool) && GlobalE.SwitcherRawData == null;

            baseurl = root + "merchant/changeshippingandcurrency?autoshow=" + as + "&merchantid=" + self.MerchantID + "&country=" + country + "&culture=" + culture + "&currency=" + currency + "&v=" + self.ScriptsVersion + "&environment=" + self.SkinEnvironmentCode + "&loadSwitcherData=" + loadSwitcherData;
            //var cacheBuster = GlobalE.MPH.Get(MPH.K.CacheBuster, MPH.T.String);
            //var cacheBuster = self.GetCacheBuster();
            //if (cacheBuster != null) {
            //    baseurl += "&cb=" + cacheBuster;
            //}

            self.SwitcherUrl = baseurl;
            var overloadCallback = function () {
                if (!self.IsUndefined(callback)) {
                    callback();
                }

                if (!self.IsUndefined(isModal) && isModal) {
                    //force modal behaviour
                    GlobalE.ShippingSwitcher.ForceModal();
                }
            }
            self.AddScript(baseurl, overloadCallback, true);
        });
    });
}
GEClient.prototype.GetActionData = function (objAction) {
    var actionName = objAction[0];
    var order = 1000;
    for (var item in this.QueuePriorities) {
        if (item == actionName) {
            //action has priority
            order = this.QueuePriorities[item];
        }
    }

    return {
        isOrdered: order != 0,
        order: order
    };
}

GEClient.prototype.DOMReady = function r(f) { /in/.test(document.readyState) ? setTimeout(r, 9, f) : f() }

GEClient.prototype.GetCDNUrl = function () {
    var cdnEnabled = GlobalE.MPH.Get(MPH.K.CDNEnabled, MPH.T.Bool);

    var url = GlobalE.MPH.Get(MPH.K.CDNUrl, MPH.T.String);
    if (url == null || !cdnEnabled) {
        url = this.GEBaseURL;
    }

    var valid = url.indexOf("/", url.length - 1) !== -1;
    if (!valid) url += "/";

    return url;
}

GEClient.prototype.GetSkinVersion = function () {
    return (GlobalE.MPH.Get(MPH.K.SkinVersion, MPH.T.String));
}

GEClient.prototype.GetAnalyticsData = function (data) {
    this.AnalyticsInfo = data;
}

GEClient.prototype.SetTrackingClientID = function (sessionsId) {
    this.MerchantClientId = sessionsId;
}


GEClient.prototype.Checkout = function (token, container, optCulture, optComplete) {

    //CORE - 15557
    this.HideFreeShippingBanner();

    //try and extect unique client id for checkout 
    var checkoutCuid = null;
    try {
        var idCookie = this.GetIDCookie();
        if (this.IsUndefined(idCookie.CHKCUID)) {
            checkoutCuid = "";
        }
        else {
            checkoutCuid = idCookie.CHKCUID;
        }
    }
    catch(err) {}


    var self = this;
    var root = this.GetCDNUrl();
    var isv2 = GlobalE.MPH.Get(MPH.K.IsV2Checkout, MPH.T.Bool);
    var url = "Merchant/Script/Checkout";
    url += isv2 ? "V2" : "";
    baseurl = root + url + "?token=" + token + "&environment=" + this.SkinEnvironmentCode;
    if (optCulture) baseurl += "&culture=" + culture;
    baseurl += "&chkuid=" + checkoutCuid;
    //var cacheBuster = GlobalE.MPH.Get(MPH.K.CacheBuster, MPH.T.String);
    //var cacheBuster = self.GetCacheBuster();
    //if (cacheBuster != null) {
    //    baseurl += "&cb=" + cacheBuster;
    //}
    baseurl += "&v=" + this.ScriptsVersion;
    baseurl += "&jq=";
    //detect jQuery
    if (typeof jQuery == 'undefined') {
        // jQuery is not loaded  
        baseurl += "false";
    } else {
        // jQuery is loaded
        baseurl += "true";
    }
    baseurl += "&history=";
    //detect jQuery
    if (window.history && window.history.pushState) {
        // jQuery is not loaded  
        baseurl += "true";
    } else {
        // jQuery is loaded
        baseurl += "false";
    }


    self.AddScript(baseurl, function () {

        if (optComplete) {
            optComplete();
        }
        GlobalE.CheckoutManager.Checkout(container);
    }, true);

}
//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

// Start the Checkout with PayPal Express
GEClient.prototype.CheckoutWithPayPalExpress = function (cartToken, failureCallback) {
    try {
        this.InitPayPalExpressProcessFailureCallback = failureCallback;

        // Attaching script
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = this.GEBaseURL + "Payments/InitPayPalExpressProcess?cartToken=" + cartToken;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    catch (err) {
    }
}

GEClient.prototype.CheckoutLog = function (data) {
    try
    {
       
        //try get tracking client ID
        var sessionId = null;
        var foundTrackers = null;
        var trackerId = "";
        var trackerCid = "";
        //if client used the 
        if (this.MerchantClientId != null) {
            //implemented by the merchant
            trackerCid = this.MerchantClientId;
        }

        try {
            if (this.AnalyticsInfo != null && this.AnalyticsInfo.length > 0) {
                if (this.AnalyticsInfo[0].hasOwnProperty("trackerId")) {
                    trackerId = this.AnalyticsInfo[0].trackerId;
                }
            }
            if (typeof AnalyticsManager.GetGASessionId == "function") {
                if (trackerCid == null && trackerId != null) {
                    var gadata = AnalyticsManager.GetGASessionId(trackerId);
                    trackerCid = gadata.trackerCid;
                    foundTrackers = JSON.stringify(gadata.foundTrackers);
                }
                else {
                    //try get all trackers from page
                    var gadata = AnalyticsManager.GetGASessionId(trackerId);
                    foundTrackers = JSON.stringify(gadata.foundTrackers);
                }
            }
        }
        catch (err) {
            //do not fail the process in case tracking info extraction failed
        }
        var url = GlobalE.GetCDNUrl(); //TODO: CHANGE TO CDN
        url += "merchant/CheckoutLog?mid=" + GlobalE.MerchantID;
        url += "&stepId=" + data.stepId;
        url += "&orderId=" + data.orderId;
        url += "&isSuccess=" + data.isSuccess;
        if (!GlobalE.IsUndefined(data.error)) {
            url += "&error=" + encodeURIComponent(data.error);
        }
        url += "&trackerId=" + trackerId;
        url += "&sessionId=" + trackerCid;
        url += "&foundTrackers=" + foundTrackers;
        url += "&isCallbackFound=" + data.isCallbackFound;
        url += "&documentUrl=" + encodeURIComponent(window.location.href);
        url += "&isFixer=" + (this.IsUndefined(window.FIXER_ON_CHECKOUT_LOAD) ? "false" : "true");
        GlobalE.AddScript(url, null, true, function () {
            console.log("error loading checkout log action");
        });
    }
    catch (err) {
        console.log("error loading checkout log action");
    }
}
GEClient.prototype.PaymentCallBackLogHandlerInterval = function () {
    if (!GlobalE.MPH.Get(MPH.K.LogPaymentCallBack, MPH.T.Bool)) {
        return;
    }
    //look for Checkout iframe and then - 
    //look for On Checkout step loaded handler
    var callbackExists = GlobalE.OnCheckoutStepLoadedCallback.length > 0;
    if (document.getElementById("Intrnl_CO_Container")) {
        //Global-e iframe found 
        //check for on checkout step loaded callback


        var url = GlobalE.GetCDNUrl(); //TODO: CHANGE TO CDN
        url += "merchant/HandleLog?mid=" + GlobalE.MerchantID;
        url += "&token=" + GlobalE.CartToken;
        url += "&checkout=true";
        url += "&callback=" + callbackExists;
        GlobalE.AddScript(url, null, true, function () {
            console.log("error loading handle log action");
        });
    }
    else {
        if (GlobalE.CallBackLogCheckCount > 6) {
            //checkout not found after 3 seconds
            var url = GlobalE.GetCDNUrl(); //TODO: CHANGE TO CDN
            url += "merchant/HandleLog?mid=" + GlobalE.MerchantID;
            url += "&token=" + GlobalE.CartToken;
            url += "&checkout=false";
            url += "&callback=" + callbackExists;

            GlobalE.AddScript(url, null, true, function () {
                console.log("error loading handle log action");
            });
        }
        else {
            GlobalE.CallBackLogCheckCount++;
            setTimeout(GlobalE.PaymentCallBackLogHandlerInterval, 500);
        }
    }

}
GEClient.prototype.PaymentCallBackLogHandler = function () {
    try {
        if (GlobalE.GetQueryParam("cb") != null &&
            GlobalE.GetQueryParam("ts") != null &&
            GlobalE.GetQueryParam("ts") == "Authorized"
        ) {
            this.CartToken = GlobalE.GetQueryParam("token");
            setTimeout(this.PaymentCallBackLogHandlerInterval, 0);
        }
        else {
            //check referer "document.referrer"
            if (document.referrer != "") {
                if (GlobalE.GetQueryParam("cb", document.referrer) != null &&
                    GlobalE.GetQueryParam("ts", document.referrer)) {
                    //this is a mercahnt site page without cb=true parameter but the referer contains the payment
                    //callback parameters, log this hit
                    var url = GlobalE.GetCDNUrl(); //TODO: CHANGE TO CDN
                    url += "merchant/HandleLog?mid=" + GlobalE.MerchantID;
                    url += "&token=" + GlobalE.GetQueryParam("token", document.referrer);
                    url += "&doubleRedirect=true";

                    GlobalE.AddScript(url, null, true, function () {
                        console.log("error loading handle log action");
                    });
                }
            }
        }
    }
    catch (err) {

    }
}
// jsonp callback function for checkout load with PayPal Express.
GEClient.prototype.InitPayPalExpressProcessCallback = function (result) {
    try {

        if (!this.IsUndefined(result)) {

            if (!this.IsUndefinedOrEmpty(result.PayPalRedirectUrl)) {
                window.location.href = result.PayPalRedirectUrl;
            }
            else if (!this.IsUndefined(this.InitPayPalExpressProcessFailureCallback)
                && !this.IsUndefined(result.Error)) {
                this.InitPayPalExpressProcessFailureCallback(result.Error);
            }

        }
    }
    catch (err) {
    }
}


GEClient.prototype.HideFreeShippingBanner = function () {
    try {
        var freeShippingBanner = document.getElementById("FreeShippingBanner");
        if (freeShippingBanner) {
            freeShippingBanner.style.display = "none";
        }
    } catch (e) {
        console.log(e);
    }
}


//Wrap console log if not exists
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };


function GLETags() {
    this.REFERER_COOKIE = "GlobalE_Ref";
    this.HitInfoKey = "GE_C_HCOUNT";
    this.tags = [];
    this.isOperated = false;
    this.GASessionID = null;
    this.trackv2fired = false;
    this.trackPollHndl = null;
    this.TRACK_POLL_INTERVAL = 500;
}


GLETags.prototype.TrackV2 = function (optionalUrl) {
    try {
        var necAllowed = GlobalE.IsNECAllowed();
        //break process if tracking is disabled or no data cookie is present
        if (!necAllowed || !GlobalE.IsDataCookieExist()) return;
     
        //get country from cookie
        var cookieData = GlobalE.GetCookie(GlobalE.GE_DATA_COOKIE, true);
        if (GlobalE.IsUndefined(cookieData.countryISO) || cookieData.countryISO == "") {
            return;//abort, not country info in cookie
        }
        //try get session ID


        var cuid = GlobalE.GetOrCreateUID();// GlobalE.GetIDCookie();
 
        var hits = this.GetHitCount().toString();
        var hitsToReport = hits;
        //var cachePin = optionalTagsCookie.cachePin;
        //check for optional URL
        if (GlobalE.IsUndefined(optionalUrl) || optionalUrl == "") {
            optionalUrl = location.href;
        }
        else {
            //optional URL defined - set hits to 0 in order to always fire this pixel
            hits = 0;
            hitsToReport = 0;
        }

        var isImgTrack = GlobalE.MPH.Get(MPH.K.TrkViaImage, MPH.T.Bool);
         
        var cdnUrl = GlobalE.GetCDNUrl();
        var environment = cdnUrl.toLowerCase().indexOf("dev.") > -1 ? "live" : "local";
        var baseUrl = GlobalE.MPH.Get(MPH.K.PixelAddress, MPH.T.String);
        if (isImgTrack) baseUrl += "/set";
        var doLog = GlobalE.GetQueryParam("gatracklog") != null ? GlobalE.GetQueryParam("gatracklog") : "false";

        //hitsToReport = 0;
        //build query
        var url = GlobalE.AddParameter(baseUrl, "t", "pv");
        url = GlobalE.AddParameter(url, "sid", cuid);
        url = GlobalE.AddParameter(url, "p", encodeURIComponent(optionalUrl));
        url = GlobalE.AddParameter(url, "ti", document.title);
        url = GlobalE.AddParameter(url, "co", cookieData.countryISO);
        url = GlobalE.AddParameter(url, "e", environment);
        url = GlobalE.AddParameter(url, "hc", hitsToReport.toString());
        url = GlobalE.AddParameter(url, "log", doLog);
        url = GlobalE.AddParameter(url, "m", GlobalE.MerchantID);
        url = GlobalE.AddParameter(url, "cdu", GlobalE.GetCDNUrl());
        url = GlobalE.AddParameter(url, "f", "gleTags.handlePixelResponse");

        //check if ref cookie exists or no cookie but with external referer to cover cookie creation issues
        var referrer = this.GetReferrerToReport();
        if (referrer != null) {
            url = GlobalE.AddParameter(url, "dr", encodeURIComponent(referrer));
        }

        this.SaveReferrer();

        if (isImgTrack) {
            GlobalE.AddIMG(url);
            this.UpdateHitCount(++hits)
        }
        else {
            GlobalE.AddScript(url, null, true, function () {
                console.log("error loading tags service");
            });
        }            
        //console.log(url);
    }
    catch (err) {
        console.log("GE TrackV2 error : " + err.message);
    }
}
GLETags.prototype.SaveReferrer = function () {
    var referrer = this.GetReferrer();
    if (referrer != null) {
        GlobalE.SetCookie(this.REFERER_COOKIE, referrer, 30, false, true);
    }
}
GLETags.prototype.GetReferrerToReport = function () {
    if (this.GetReferrer()== null) {
        return null; //no referrer, direct hit
    }
    else {
        //document.referrer exists - check if referrer host was not already reported in this session
        var currentReferrerHost = this.GetHostName(document.referrer);


        //check if a referrer was previously recorded in referrer cookie which indicates a referrer was reported
        //in this session
        var refCookie = GlobalE.GetCookie(this.REFERER_COOKIE, false);
        if (refCookie != null) {
            var previousReferrerHostName = this.GetHostName(refCookie);
            if (previousReferrerHostName == currentReferrerHost) {
                //previously recorded referrer has the same host as current referrer, do not report
                return null;
            }
            else {
                return document.referrer;
            }
        }
        else {
            //no previous referrer in cookie - first time a referrer was queried in this session
            return document.referrer;
        }

    }
}
//extract UTM tags
GLETags.prototype.GetReferrer = function () {
    //handle referer
    if (document.referrer != "") {
        //referrer exists - check that its different from current domain
        if (this.GetDomain(document.location.href) != this.GetDomain(document.referrer)) {
            //referer exists and not a local referer - REPORT
            //url = GlobalE.AddParameter(url, "dr", document.referrer);            
            return document.referrer;
        }
    }

    return null;
}
GLETags.prototype.GetHostName = function (url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    }
    else {
        return null;
    }
}
GLETags.prototype.GetDomain = function (url) {

    var hostName = this.GetHostName(url);
    var domain = hostName;

    if (hostName != null) {
        var parts = hostName.split('.').reverse();

        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];

            if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
                domain = parts[2] + '.' + domain;
            }
        }
    }

    return domain;
}
GLETags.prototype.GetHitCount = function () {
    if (sessionStorage) {
        var count = sessionStorage.getItem(this.HitInfoKey);
        if (!GlobalE.IsUndefined(count)) {
            try {
                return parseInt(count);
            }
            catch (err) {
                return 0;
            }
        }
        return 0;
    }
    else {
        return 0;
    }
}
GLETags.prototype.UpdateHitCount = function (count) {
    if (sessionStorage) {
        sessionStorage.setItem(this.HitInfoKey, count);
    }
}

GLETags.prototype.handlePixelResponse = function (data) {
    var necAllowed = GlobalE.IsNECAllowed();
    if (!necAllowed) return;
    //data = { succes (message), token}
    if (data.success) {
        //save token
        var curHitCount = this.GetHitCount();
        var clientIdObj = GlobalE.GetIDCookie();
        curHitCount++;
        this.UpdateHitCount(curHitCount);
        
        //save token on ID cookie if needed
        if (clientIdObj.CUID == null) {
            GlobalE.SetIDCookie(data.token, clientIdObj.CHKCUID);
        }
    }
    else {
        console.log("GA Pixel error: " + data.message);
    }
    //console.log(data);
}


GLETags.prototype.AddScript = function (script) {
    this.tags.push(script);
}

GLETags.prototype.GetGASession = function () {
    var uid = GlobalE.GetOrCreateUID();
    return uid;
}

 
GLETags.prototype.freeShippingBannerShowed = function (mid, countryid, currencyid) {
    var url = "freeShippingBannerShowed?merchantid={0}&countryid={1}&currencyid={2}";
    url = url.format(mid, countryid, currencyid);
    gleTags.TrackV2(url);    
} 

//merchant parameters handler
function MPH(objParameters) {
    this.P = objParameters;

    MPH.T = {
        Bool: 1,
        String: 2,
        Object: 3
    }

    MPH.K = {
        AllowClientTracking: "AllowClientTracking",
        FullClientTracking: "FullClientTracking",
        TabletAsMobile: "TabletAsMobile",
        SkinVersion: "SkinVersion",
        CDNUrl: "CDNUrl",
        AnalyticsUrl: "AnalyticsUrl",
        CDNEnabled: "CDNEnabled",
        IsV2Checkout: "IsV2Checkout",
        SetGEInCheckoutContainer: "SetGEInCheckoutContainer",
        CheckoutContainerSuffix: "CheckoutContainerSuffix",
        SwitcherRedirectInfo: "SwitcherRedirectInfo",
        IsMerchantSetCheckoutAuth: "IsMerchantSetCheckoutAuth",
        CheckoutCDNURL: "CheckoutCDNURL",
        AddShippingSwitcherDataToClientSDK: "AddShippingSwitcherDataToClientSDK",
        InternalTrackingEnabled: "InternalTrackingEnabled",
        SaveCurrencyForNoneOperatedCountry: "SaveCurrencyForNoneOperatedCountry",
        LogPaymentCallBack: "LogPaymentCallBack",
        ShowFreeShippingBanner: "ShowFreeShippingBanner",
        TrackingV2: "TrackingV2",
        PixelAddress: "PixelAddress",
        EnforceSameSiteCookie: "EnforceSameSiteCookie",
        TrkViaImage: "TrkViaImage"
    };

    this.Def = [];
    this.Def[MPH.K.AllowClientTracking] = true;
    this.Def[MPH.K.FullClientTracking] = true;
    this.Def[MPH.K.TabletAsMobile] = true;
    this.Def[MPH.K.SkinVersion] = "1.0";
    this.Def[MPH.K.CDNUrl] = null;
    this.Def[MPH.K.AnalyticsUrl] = null;
    this.Def[MPH.K.CDNEnabled] = false;
    this.Def[MPH.K.IsV2Checkout] = false;
    this.Def[MPH.K.SetGEInCheckoutContainer] = false;
    this.Def[MPH.K.CheckoutContainerSuffix] = "";
    this.Def[MPH.K.SwitcherRedirectInfo] = null;
    this.Def[MPH.K.IsMerchantSetCheckoutAuth] = false;
    this.Def[MPH.K.CheckoutCDNURL] = null;
    this.Def[MPH.K.AddShippingSwitcherDataToClientSDK] = false;
    this.Def[MPH.K.InternalTrackingEnabled] = false;
    this.Def[MPH.K.SaveCurrencyForNoneOperatedCountry] = false;
    this.Def[MPH.K.LogPaymentCallBack] = true;
    this.Def[MPH.K.TrackingV2] = true;
    this.Def[MPH.K.EnforceSameSiteCookie] = true;
    this.Def[MPH.K.PixelAddress] = "https://utils.global-e.com";
    this.Def[MPH.K.TrkViaImage] = true;

    this.Def[MPH.K.ShowFreeShippingBanner] = false;
}

MPH.prototype.JSONFixer = function (json) {
    return json

        // Replace ":" with "@colon@" if it's between double-quotes
        .replace(/:\s*"([^"]*)"/g, function (match, p1) {
            return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })

        // Replace ":" with "@colon@" if it's between single-quotes
        .replace(/:\s*'([^']*)'/g, function (match, p1) {
            return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })

        // Add double-quotes around any tokens before the remaining ":"
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')

        // Turn "@colon@" back into ":"
        .replace(/@colon@/g, ':');
}

MPH.prototype.Parse = function (val, type) {
    switch (type) {
        case MPH.T.Bool:
            return JSON.parse(val);
        case MPH.T.Object:
            if (GlobalE.IsUndefined(val) || val.trim() == "") return null;
            return JSON.parse(this.JSONFixer(val));
        default:
            return val;
    }
}

MPH.prototype.Get = function (property, type) {

    if (this.P != null && this.P.hasOwnProperty(property)) {
        var val = this.P[property].Value;

        if (GlobalE.IsUndefined(type)) {
            return val;
        }
        else {
            return this.Parse(val, type);
        }
    }

    //if not found in legacy app settings,  try getting from Global configuration
    //in later stage, the legacy settings will be depracted.
    var globalValue = GlobalE.GetGlobalSetting(property, null);
    if (globalValue != null) {
        return this.Parse(globalValue, type);
    }

    //try default
    if (this.Def.hasOwnProperty(property)) {
        return this.Def[property];
    }
}


function GE_LS() { }

GE_LS.prototype.IsAvailable = function () {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('feature_test', 'yes');
            if (localStorage.getItem('feature_test') === 'yes') {
                localStorage.removeItem('feature_test');
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}
GE_LS.prototype.Get = function (key) {
    if (this.IsAvailable()) {
        return localStorage.getItem(key);
    }
}
GE_LS.prototype.Set = function (key, value) {
    if (this.IsAvailable()) {
        return localStorage.setItem(key, value);
    }
}
GE_LS.prototype.Remove = function (key) {
    if (this.IsAvailable()) {
        return localStorage.removeItem(key);
    }
}

//Initialize GEClient instance
var gleTags = new GLETags();
var ge_ls = new GE_LS();
var GlobalE = new GEClient();


//setTimeout(function () { gleTags.PollTrack.apply(gleTags); }, gleTags.TRACK_POLL_INTERVAL * 2);

GlobalE.MPH = new MPH(null);
if (!GlobalE.IsUndefined(window[window.globaleObject])) {
    var globaleObj = window[window.globaleObject];



    //set api version
    GlobalE.ScriptsVersion = globaleObj.v;
    GlobalE.MerchantID = globaleObj.m;





    //exec Q        
    if (globaleObj.q) {
        var orderedQ = [];
        for (var i = 0; i < globaleObj.q.length; i++) {
            var actionInfo = GlobalE.GetActionData(globaleObj.q[i]);
            orderedQ.push({ order: actionInfo.order, action: globaleObj.q[i] })
        }

        //sort Q
        orderedQ.sort(function (a, b) {
            if (a.order < b.order) {
                return -1;
            }
            else if (a.order > b.order) {
                return 1;
            }
            else {
                return 0;
            }
        });




        for (var i = 0; i < orderedQ.length; i++) {
            GlobalE.HandleQAction(orderedQ[i].action);
        }
    }

    if (GlobalE.IsClient()) {
        GlobalE.Track();            
    }


    //bypass q manager
    window[window.globaleObject] = GlobalE.ActionExec;
    if (GlobalE.GEPopupsEnabled) {
        GlobalE.InitMobileDevices(function () { });
    }
}



if (GlobalE.IsUndefined(window["glegem"])) {
    //GEM queue was not created yet, set it to function
    window["glegem"] = GlobalE.ActionExec;
    //window["glegem"] = function (event, args) {

    //}
}
else {
    if (glegem.q) {
        var orderedQ = [];
        for (var i = 0; i < glegem.q.length; i++) {
            var actionInfo = GlobalE.GetActionData(glegem.q[i]);
            orderedQ.push({ order: actionInfo.order, action: glegem.q[i] })
        }

        //sort Q
        orderedQ.sort(function (a, b) {
            if (a.order < b.order) {
                return -1;
            }
            else if (a.order > b.order) {
                return 1;
            }
            else {
                return 0;
            }
        });




        for (var i = 0; i < orderedQ.length; i++) {
            GlobalE.HandleQAction(orderedQ[i].action);
        }
    }
}

GlobalE.AttachEvent("load", window, function () {
    GlobalE.PaymentCallBackLogHandler();
    GlobalE.WindowLoaded = true;

    var hideBanner = document.getElementById("Intrnl_CO_Container") || document.getElementById("confirmPage");
    if (GlobalE.MPH.Get(MPH.K.ShowFreeShippingBanner, MPH.T.Bool) && !hideBanner) {
        GlobalE.GetFreeShippingBanner();
    }

    if (!GlobalE.IsPlatformSupported()) {
        //load platform not supported popup
        GlobalE.LoadUnsupportedPlatform();
    }
    GlobalE.RegisterEventHandlers();
    if (GlobalE.OnLoadCallBack != null) {
        GlobalE.OnLoadCallBack();
    }
});


GEClient.prototype.GetFreeShippingBanner = function () {

    try {

        var merchantId = this.MerchantID;

        var globalE_Data = GlobalE.GetCookie("GlobalE_Data", true);
        var countryISO = globalE_Data.countryISO;
        var currency = globalE_Data.currencyCode;
        var culture = globalE_Data.cultureCode;

        var url = this.GetCDNUrl();
        url += 'merchant/freeShippingBanner?merchantId=' + merchantId + "&country=" + countryISO + "&currency=" + currency + "&culture=" + culture;

        //trigger analytics page
        //gleTags.GAPageView(encodeURIComponent(url));

        this.AddScript(url, function (data) {
            //console.log("after free shipping banner");

        }, true)

    } catch (e) {
        console.log(e);
    }
}


