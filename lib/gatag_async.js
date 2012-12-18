//	This javascript tags file downloads and external links in Google Analytics.
//	You need to be using the Google Analytics New Tracking Code (ga.js) 
//	for this script to work.
//	To use, place this file on all pages just above the Google Analytics tracking code.
//	All outbound links and links to non-html files should now be automatically tracked.
//
//	This script has been provided by Goodwebpractices.com
//	Thanks to ShoreTel, MerryMan and Colm McBarron
//
//	www.goodwebpractices.com
//	VKI has made changes as indicated below.	
//  Fix to ignore JavaScript in hrefs by Adviso

if (document.getElementsByTagName) {
	// Initialize external link handlers
	var hrefs = document.getElementsByTagName("a");
	for (var l = 0; l < hrefs.length; l++) {
		// try {} catch{} block added by erikvold VKI
		try{
			//protocol, host, hostname, port, pathname, search, hash
			if (hrefs[l].protocol == "mailto:") {
					startListening(hrefs[l],"click",trackMailto);
			} else if (hrefs[l].hostname == location.host) {
					var path = hrefs[l].pathname + hrefs[l].search;
					var isDoc = path.match(/\.(?:doc|eps|jpg|png|gif|jpeg|svg|xls|ppt|pdf|xls|zip|txt|vsd|vxd|js|css|rar|exe|wma|mov|avi|wmv|mp3|rss)($|\&|\?)/);
					if (isDoc) {
						startListening(hrefs[l],"click",trackOutFileLinks);
					}
			// Fix to ignore JavaScript in hrefs and ignore links without href
			} else if (!hrefs[l].href.match(/^javascript:/) && hrefs[l].href) {
					startListening(hrefs[l],"click",trackOutFileLinks);
			}
		}
		catch(e){
			continue;
		}
	}
}

function startListening (obj,evnt,func) {
	if (obj.addEventListener) {
			 obj.addEventListener(evnt,func,false);
	} else if (obj.attachEvent) {
			 obj.attachEvent("on" + evnt,func);
	}
}

function trackMailto (evnt) {  
	var href = (evnt.srcElement) ? evnt.srcElement.href : this.href;
  var category = 'Mailto';
  var action = href.substring(7);
  var label = document.location.pathname;

  if (typeof(_gaq) == "object") _gaq.push(['_trackEvent', category, action, label]);
	
}

function trackOutFileLinks (evnt) {
	var e = (evnt.srcElement) ? evnt.srcElement : this;
	while (e.tagName != "A") {
    e = e.parentNode;
	}
	var lnk = (e.pathname.charAt(0) == "/") ? e.pathname : "/" + e.pathname;
	if (e.search && e.pathname.indexOf(e.search) == -1) lnk += e.search;
	
  var category = '';
  var action = '';
  var label = document.location.pathname;
  if(e.hostname != location.host) {
    category = "Outbound";
    action = e.hostname + lnk;
  } else if(lnk.match(/\.(doc|xls|ppt|pdf|xls|zip|txt|vsd|vxd|js|css|rar|exe|wma|mov|avi|wmv|mp3|rss)($|\&|\?)/)) {
    var matches = lnk.match(/([^\/]*\.(doc|xls|ppt|pdf|xls|zip|txt|vsd|vxd|js|css|rar|exe|wma|mov|avi|wmv|mp3|rss))(?:$|\&|\?)/);
    category = "File";
    action = matches[1];  
  } else if(lnk.match(/\.(eps|jpg|png|svg|gif|jpeg)($|\&|\?)/)) {
    var matches = lnk.match(/([^\/]*\.(eps|jpg|png|svg|gif|jpeg))(?:$|\&|\?)/);
    category = "Image";
    action = matches[1];  
  }
  
  if (typeof(_gaq) == "object") _gaq.push(['_trackEvent', category, action, label]);
}




