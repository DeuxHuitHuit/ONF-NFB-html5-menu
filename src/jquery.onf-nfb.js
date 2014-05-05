/*global ntptEventTag:false,ntptLinkTag:false,_gaq:false,COMSCORE:false*/
/**
 * ONF-NFB Menu Behavior jQuery script
 * 
 * @author: DeuxHuitHuit
 * 
**/

;(function ($, undefined) {

	"use strict";
	
	/** GLOBAL VARIABLES **/
	
	// console support
	if (!window.console) {
		window.console = {};
		window.console.log = window.console.warn = window.console.error = window.console.info = $.noop;
	}
	
	// forEach support
	// @see http://www.tutorialspoint.com/javascript/array_foreach.htm
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun) {
			var len = this.length, i = 0,
			thisp = arguments[1];
			if (typeof fun != "function") {
				throw new TypeError('First parameter must be a function');
			}
			for (i = 0; i < len; i++) {
				if (i in this) {
					fun.call(thisp, this[i], i, this);
				}
			}
		};
	}
	
	
	/** Private VARIABLES **/
	var // constants
	ONF_NFB_share_width = 55,
	ONF_NFB_event_namespace = 'onf-nfb',
	ONF_NFB_event_topclick = 'topclick.onf-nfb', // function (e,orgEvent,target,opts,tag)
	ONF_NFB_event_helpclick = 'help.onf-nfb',	 // function (e,orgEvent,target,opts,tag)
	ONF_NFB_event_langclick = 'lang.onf-nfb',	 // function (e,orgEvent,target,opts,tag)
	ONF_NFB_event_search = 'search.onf-nfb',	 // function (e,orgEvent,target,query)
	ONF_NFB_event_botclick = 'botclick.onf-nfb', // function (e,orgEvent,target,opts,tag)
	ONF_NFB_event_shareclick = 'share.onf-nfb',  // function (e,orgEvent,target,tag)
	ONF_NFB_event_volclick = 'volume.onf-nfb',   // function (e,orgEvent,target,muted)
	ONF_NFB_event_fsclick = 'fullscreen.onf-nfb',// function (e,orgEvent,target,fullscreen)
	// variables
	stats_loggers = [],
	top_defaults = {
		target: '#onf-top',
		opacity: 0.8,
		opacityHover: 1,
		recursive: false,
		ready: null, // function (opts)
		links: [
			 {title: {fr:'Explorer', en:'Explore'}, 
			  url: {fr:'http://www.onf.ca/explorer-tous-les-films/', en:'http://www.nfb.ca/explore-all-films/'},
			  callback: null, preventDefault:false, target: null, cssClass: null, tag: 'explore'
			 },
			 {title: {fr:'Sélections', en:'Playlists'},	
			  url: {fr:'http://onf.ca/selections/', en: 'http://www.nfb.ca/playlists/'},
			  callback: null, preventDefault:false, target: null, cssClass: null, tag: 'playlist'
			 },
			 {title: {fr:'Chaînes', en: 'Channels'},
			  url: {fr:'http://www.onf.ca/chaines/', en: 'http://www.nfb.ca/channels/'},					
			 callback: null, preventDefault:false, target: null, cssClass: null, tag: 'channels'
			 },
			 {title: {fr:'Blogue',  en:'Blog'},
			  url: {fr:'http://blogue.onf.ca/', en: 'http://blog.nfb.ca/'},
			  callback: null, preventDefault:false, target: null, cssClass: null, tag: 'blog'
			 },
			 {title: {fr:'Interactif', en: 'Interactive'},
			  url: {fr:'http://www.onf.ca/interactif/', en: 'http://www.nfb.ca/interactive/'},
			  callback: null, preventDefault:false, target: null, cssClass: 'active', tag: 'interative'
			 }
		],
		search: {
			title: {fr: 'Recherche', en: 'Search'},
			callback: null
		},
		help: {title: {fr:'Aide', en:'Help'}, 
			url: {fr:'http://www.onf.ca/a-propos/faq/', en:'http://www.nfb.ca/about/faq/'}, 
			callback: null, preventDefault:false, target: '_blank', cssClass: null, tag: 'help'
		},
		translate: [
		   {
			title: 'Français',
			url: 'http://interactif.onf.ca/', callback: null, preventDefault:false, target: null, cssClass: null, tag: 'lang-fr'
		   },
		   {
			title: 'English',
			url: 'http://interactive.nfb.ca/', callback: null, preventDefault:false, target: null, cssClass: null, tag: 'lang-en'
		   }
		]
	},
	bot_defaults = {
		target: '#onf-bot',
		opacity: 0.8,
		opacityHover: 1,
		recursive: false,
		ready: null, // function (opts)
		links: [
			 {title: {fr:'Accueil',en:'Home'},		url: '/index/', 
			  callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tag: 'home'
			 },
			 {title: {fr:'À propos',en:'About'},	url: {fr:'/a-propos/', en: '/about/'},
			  callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tag: 'about'
			 },
			 {title: {fr:'Films reliés',en:'Related movies'},url: {fr:'/relies/', en:'/related/'},
			  callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tag: 'related'
			 },
			 {title: {fr:'Équipe',en:'Credits'},	url: {fr:'/equipe/', en: '/credits/'}, 
			  callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont', tag: 'credits'
			 }
		],
		share: {
			title: {fr: 'Partagez', en: 'Share'},
			links: {
				facebook: 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.location),
				twitter: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + '&url=' + encodeURIComponent(document.location),
				stumpleupon: 'http://www.stumbleupon.com/submit?url='+ encodeURIComponent(document.location) + '&title=' + encodeURIComponent(document.title),
				digg: 'http://digg.com/submit?phase=2&url='+ encodeURIComponent(document.location) +'&bodytext=' + encodeURIComponent(document.title),
				delicious: 'http://www.delicious.com/post?v=2&url='+ encodeURIComponent(document.location) +'&title=' + encodeURIComponent(document.title)
			},
			callback: null
		},
		volume: {
			title: {fr: 'Volume', en: 'Volume' },
			callback: null
		},
		fullscreen: {
			title: {fr: 'Plein écran', en: 'Fullscreen'},
			callback: null
		}
	},
	// UA Detection
	ua = !!window.navigator && !!navigator.userAgent ? navigator.userAgent : false,
	uas = (function () {
		var uas = {
			unsupported: !$.browser || !!($.browser.msie && parseInt($.browser.version, 10) < 9),
			ipad: !!ua && !!ua.match(/iPad/i),
			iphone: !!ua && (!!ua.match(/iPhone/i)) || (!!ua.match(/iPod/i)),
			android: !!ua && (!!ua.match(/Android/i))
		};
		// set up UA shortcuts
		uas.ios = uas.ipad || uas.iphone;
		uas.mobile = uas.ios || uas.android || (!!ua && (ua.match(/mobile/i) || ua.match(/phone/i))) || 
			!!document.location.toString().match(/\.+(\?|#)mobile$/i);
		
		return uas;
	})(),
	
	
	
	/** Private common functions **/
	_getValue = function (o) {
		return $.isFunction(o) ? o.call(this, LG) : o;
	},
	_getObjectValue = function (o) {
		return $.isPlainObject(o) ? o[LG] : _getValue(o);
	},
	_getDefaultValue = function (o, d) {
		return !!o ? o : d;
	},
	LG = _getDefaultValue($('html').attr('lang'), 'en'), // defaults to english
	EV = (LG === 'fr' ? 'interactif' : 'interactive'),
	ONF_NFB_url = (LG == 'fr' ? 'http://www.onf.ca' : 'http://www.nfb.ca'),
	ONF_NFB_search_url = 'http://search.nfb.ca/search?entqr=0&output=xml_no_dtd&sort=date%3AD%3AL%3Ad1&client=beta_onfb&ud=1&oe=UTF-8&ie=UTF-8&proxystylesheet=beta_onfb&proxyreload=1&hl='+LG+'&lr=lang_'+LG+'&site=beta_onfb&q=',
	
	_concatParams = function (cat, action, label, value) {
		var c = cat + ' > ' + action;
		if (!!label) {
			c += ' > ' + label;
		}
		if (!isNaN(value)) {
			c += ' > ' + value;
		}
		return c;
	},
	
	preventDefault = function (e) {
		if (!!e && $.isFunction(e.preventDefault)) {
			e.preventDefault();
		}
		return false;
	},
	_linkCallback = function (e) {
		var t = $(this),
			linkObj = t.data('link'),
			event = t.data('event'),
			target = t.data('target'),
			tag = linkObj.tag || t.attr('data-tag'),
			opts = target.data('opts'),
			ret = true;
		
		//console.log ('[click] ' + tag);
		
		if (!!linkObj) {
			// call callback
			if ($.isFunction(linkObj.callback)) {
				linkObj.callback.call(t, e, t, opts, tag);
			}
			// prevent default behavior
			if (!!linkObj.preventDefault) {
				ret = preventDefault(e);
			}
		}
		
		// raise event
		target.triggerHandler(event, [e,t,opts,tag]);
		
		// log event
		if (!!linkObj.url) {
			$.onf_nfb.stats.trackPageview(_getObjectValue(linkObj.url));
		} else {
			$.onf_nfb.stats.trackEvent('menu','click', tag, t.index());
		}
		
		return ret;
	},
	_hover = function (e, _isIn) {
		var t = $(this),
			opts = t.data('opts'),
			value = _getValue(opts.opacity);
		
		if (_isIn) {
			value = _getValue(opts.opacityHover);
		}
		
		t.stop(true, false).animate({opacity:value}, 250);
	},
	_hoverIn = function (e) {
		_hover.call(this, e, true);
	},
	_hoverOut = function (e) {
		_hover.call(this, e, false);
	},
	_createLink = function (l, target, event) {
		var a = $('<a></a>');
		a.text(_getObjectValue(l.title));
		if (!!l.url) {
			a.attr('href', _getObjectValue(l.url));
		} else {
			a.attr('href', "#");
		}
		a.data('link', l);
		a.data('target', target);
		a.data('event', event);
		if (!!l.target) {
			a.attr('target', _getValue(l.target));
		}
		if (!!l.cssClass) {
			a.attr('class', _getObjectValue(l.cssClass));
		}
		a.click(_linkCallback);
		return a;
	},
	isFullScreen = function () {
		return document.fullScreen ||
				document.mozFullScreen ||
				document.webkitIsFullScreen || // actual implementation
				document.webkitFullScreen ||
				document.msFullScreen;
	},
	toggleFullScreen = function (e) {
		if (isFullScreen()) {
			return exitFullScreen(e);
		}
		return goFullScreen(e);
	},
	getFullScreen = function () {
		var el = document.documentElement,
			rfs = // for newer Webkit and Firefox
				el.requestFullScreen ||
				el.webkitRequestFullScreen ||
				el.webkitEnterFullScreen ||
				el.mozRequestFullScreen ||
				el.msRequestFullScreen;
		return rfs;
	},

	goFullScreen = function (e) {
		// @see: http://stackoverflow.com/questions/1125084/how-to-make-in-javascript-full-screen-windows-stretching-all-over-the-screen
		// @see: http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
		var rfs = getFullScreen(),
			success = false;
		
		if(rfs !== undefined && $.isFunction(rfs)) {
		  rfs.call(document.documentElement);
		  success = true;
		}
		
		if (success) {
			// raise event
			$.event.trigger(ONF_NFB_event_fsclick, [e,this,true]);
			
			// log event
			$.onf_nfb.stats.trackEvent('menu','fullscreen', true);
		}
		
		return preventDefault(e);
	},
	exitFullScreen = function (e) {
		var success = false,
			el = document,
			efs = // for newer Webkit and Firefox
				el.exitFullScreen ||
				el.cancelFullScreen ||
				el.webkitExitFullScreen ||
				el.webkitCancelFullScreen ||
				el.mozExitFullScreen ||
				el.mozCancelFullScreen ||
				el.msExitFullScreen ||
				el.msExitCancelScreen;
		
		if (efs !== undefined && $.isFunction(efs)) {
			efs.call(el);
			success = true;
		}
		
		if (success) {
			// raise event
			$.event.trigger(ONF_NFB_event_fsclick, [e,this,false]);
			
			// log event
			$.onf_nfb.stats.trackEvent('menu','fullscreen', false);
		}
		
		return preventDefault(e);
	},
	supportsFullScreen = function () {
		return !!getFullScreen();
	},
	mute = function (e) {
		var vol = $('#onf-volume'),
			isMuted = false;
		
		vol.toggleClass('muted');
		
		isMuted = vol.hasClass('muted');
		
		// save value (add a cookie for muted, delete it for volume)
		if (!!$.cookie) {
			$.cookie('muted', isMuted ? 1 : null, { expires: 7, path: '/' });
		}
		
		// raise event
		$.event.trigger(ONF_NFB_event_volclick, [e,vol,isMuted]);
		
		// log event
		$.onf_nfb.stats.trackEvent('menu','mute', isMuted);
		
		return preventDefault(e);
	},
	registerCallback = function (event, callback, target) {
		if ($.isFunction(callback)) {
			if (!!target && $.isFunction(target.on)) {
				target.on(event, callback);
			} else {
				$(document).on(event, callback);
			}
		}
	},
	
	
	
	/** Public functions **/
	
	/* Stats */
	
	/* @deprecated */
	statsLog = function (cat, action, label, value, delay) {
		console.warn('"stats.log" is deprecated and will be removed in 1.2. Please use "stats.trackEvent" instead.');
		$.onf_nfb.stats.trackEvent(cat, action, label, value, delay);
	},
	
	trackEvent = function (cat, action, label, value, delay) {
		var 
		minDelay = _getValue(this.minDelay),
		log = function () {
			stats_loggers.forEach(function (obj, key) {
				try {
					obj.trackEvent(cat, action, label, value);
				} catch (ex) {
					console.error('[stats.trackEvent] ' + obj.name + ': ' + ex.message);
				}
			});
		};
			
		if (!delay || isNaN(delay) || delay < minDelay) {
			delay = minDelay;
		}
		
		// do not wait for the execution
		setTimeout(log, delay);
	},
	
	trackPageview = function (url, delay) {
		var 
		minDelay = _getValue(this.minDelay),
		log = function () {
			stats_loggers.forEach(function (obj, key) {
				try {
					obj.trackPageview(url);
				} catch (ex) {
					console.error('[stats.trackPageview] ' + obj.name + ': ' + ex.message);
				}
			});
		};
			
		if (!delay || isNaN(delay) || delay < minDelay) {
			delay = minDelay;
		}
		
		// do not wait for the execution
		setTimeout(log, delay);
	},
	
	trackSocial = function (network, socialAction, opt_target, opt_pagePath, delay) {
		var 
		minDelay = _getValue(this.minDelay),
		action = socialAction || $.onf_nfb.defaults.stats.actions[network] || $.onf_nfb.defaults.stats.actions['default'],
		log = function () {
			stats_loggers.forEach(function (obj, key) {
				try {
					obj.trackSocial(network, action, opt_target, opt_pagePath);
				} catch (ex) {
					console.error('[stats.trackSocial] ' + obj.name + ': ' + ex.message);
				}
			});
		};
			
		if (!delay || isNaN(delay) || delay < minDelay) {
			delay = minDelay;
		}
		
		// do not wait for the execution
		setTimeout(log, delay);
	},
	
	statsPushLogger = function (logger, params) {
		logger.init(params);		
		stats_loggers.push(logger);
		
	},
	statsInit = function (params) {
		// push our loggers
		$.each($.onf_nfb.defaults.stats.loggers, function () {
			statsPushLogger(this, params);
			this.trackPageview(window.location.pathname);
		});
	},
	
	
	
	/* Menu top */
	search = function (e) {
		var query = $('#onf-top-search-txt').val();
		
		if (!!query && query.length > 0) {
			
			// raise event
			$.event.trigger(ONF_NFB_event_search, [e,this,query]);
			
			// log event
			$.onf_nfb.stats.trackEvent('menu','search', query);
			
			// redirect
			setTimeout(function () {
				document.location = ONF_NFB_search_url + encodeURIComponent(query);
			}, $.onf_nfb.stats.minDelay);
		}
		
		return preventDefault(e);
	},
	searchToggle = function (e, show) {
		var pnl = $('#onf-top-search-pnl'),
			lbl = $('#onf-top-search-lbl'),
			txt = pnl.find('input[type=text]').eq(0);
			
		pnl[show ? 'fadeIn' : 'fadeOut'].call(pnl, 400);
		lbl[show ? 'fadeOut': 'fadeIn' ].call(lbl, 400);
		txt[show ? 'focus' : 'blur'].call(txt);
		
		return preventDefault(e);
	},
	searchIn = function (e) {
		return searchToggle.call(this, e, true);
	},
	searchOut = function (e) {
		return searchToggle.call(this, e, false);
	},
	searchKeyDown = function (e) {
		switch (e.which) {
			case 27 : // escape
				searchOut.call(this);
				break;
			case 13: // enter
				search();
				break;
		}
		return true;
	},
	
	menuTop = function (top_options) {
		var opts = $.extend((!!top_options && !!top_options.recursive ? true : {}), opts, top_defaults, top_options),
			target = $(opts.target),
			opacityEnabled = Math.abs(_getValue(opts.opacity) - _getValue(opts.opacityHover)) > 0,
			logo = $('<a id="onf-top-logo"></a>'),
			search_wrap = $('<span id="onf-top-search"></span>'),
			search_lbl = $('<a href="#" id="onf-top-search-lbl"></a>'),
			search_pnl = $('<div id="onf-top-search-pnl"></div>'),
			search_txt = $('<input id="onf-top-search-txt" type="text" />'),
			search_btn = $('<input id="onf-top-search-btn" type="button" value="" />'),
			right_wrap = $('<div id="onf-top-right"></span>'),
			wrap = $('<div id="onf-top-wrap"></div>');
			
		// target check
		if (!target || !target.length) {
			console.error ('[top] the target ' + opts.target + ' could not be found.');
			return;
		}
		
		// create logo
		logo.attr('href', ONF_NFB_url);
		logo.click(function (e) {
			// raise event
			$.event.trigger(ONF_NFB_event_topclick, [e,this,opts,'logo']);
			
			// log event
			$.onf_nfb.stats.trackEvent('menu','click', 'logo');
			return true;
		});
		wrap.append(logo);
		
		// create menu items
		if (!!opts.links && !!opts.links.length) {
			opts.links.forEach(function (obj,key) {
				wrap.append(_createLink(obj,target,ONF_NFB_event_topclick));
			});
		}
		
		// create search function
		if (!!opts.search) {
			search_lbl.text(_getObjectValue(opts.search.title));
			search_lbl.click(searchIn);
			
			search_txt.attr('placeholder', _getObjectValue(opts.search.title));
			search_txt.keydown(searchKeyDown);
			search_btn.click(search);
			
			search_pnl.append(search_txt).append(search_btn);
			
			search_wrap.append(search_lbl).append(search_pnl);
			
			wrap.append(search_wrap);
			$(document.documentElement).mousedown(function (e) { // mouse down won't trap events
				if (e.target.nodeName != 'INPUT') { searchOut(e); }
				return true;
			});
			
			registerCallback(ONF_NFB_event_search, opts.search.callback);
		}
		
		// create right menus items
		if (!!opts.help) {
			right_wrap.append(_createLink(opts.help, target, ONF_NFB_event_helpclick));
		}
		if (!!opts.translate && !!opts.translate.length) {
			opts.translate.forEach(function (obj, key) {
				if (obj.tag != 'lang-' + LG) { // do not show current lang
					right_wrap.append(_createLink(obj, target, ONF_NFB_event_langclick));
				}
			});
		}
		
		wrap.append(right_wrap);
		
		// finally add the wrap to our container
		target.empty().append(wrap);
		
		// save options
		target.data('opts', opts);
		
		// handle hover
		if (opacityEnabled) {
			target.hover(_hoverIn, _hoverOut);
			_hoverOut.call(target);
		} else {
			target.off('mouseenter', _hoverIn).off('mouseleave', _hoverOut);
		}
		
		// ready callback
		if ($.isFunction(opts.ready)) {
			opts.ready.call(target, opts);
		}
	},
	
	
	/* Menu bottom */
	shareToggle = function (e, isIn) {
		var share = $('#onf-bot-share'),
			w = ONF_NFB_share_width,
			i = share.find('.onf-social').length,
			ow = w + (20*i);
		
		if (isIn) {
			w = ow;
		}
		
		share.stop(false, false)
			 .animate({width:w}, ow * 2);
		
		return preventDefault(e);
	},
	share_in = function (e) {
		return shareToggle.call(this, e, true);
	},
	share_out = function (e) {
		return shareToggle.call(this, e, false);
	},
	
	menuBot = function (bot_options) {
		var opts = $.extend((!!bot_options && !!bot_options.recursive ? true : {}), opts, bot_defaults, bot_options),
			target = $(opts.target),
			opacityEnabled = Math.abs(_getValue(opts.opacity) - _getValue(opts.opacityHover)) > 0,
			wrap = $('<div id="onf-bot-wrap"></div>'),
			right_wrap = $('<span id="onf-bot-right"></span>'),
			share_wrap = $('<span id="onf-bot-share"></span>'),
			share_opts = $('<span id="onf-share-opts"></span>'),
			vol_btn = $('<a href="#" id="onf-volume"></a>'),
			fs_btn = $('<a href="#" id="onf-fullscreen"></a>');
			
		// target check
		if (!target || !target.length) {
			console.error ('[bot] the target ' + opts.target + ' could not be found.');
			return;
		}
		
		// create menu item
		if (!!opts.links && !!opts.links.length) {
			opts.links.forEach(function (obj, key) {
				wrap.append(_createLink(obj, target, ONF_NFB_event_botclick));
			});
		}
		
		// create share menu items
		if (!!opts.share) {
			share_wrap.append($('<span>' + _getObjectValue(opts.share.title) + '</span>'));
			
			var
			_share_click = function (e) {
				var
				t = $(this),
				i = t.data().index;
				
				// raise event
				$.event.trigger(ONF_NFB_event_shareclick, [e,this,i]);
				
				// log event
				$.onf_nfb.stats.trackSocial(i);
				
				// allow continuation
				return true;
			};
			
			$.each(opts.share.links, function _forEachLink (i, l) {
				var a = $('<a></a>')
				.attr('href', _getValue(l) )
				.attr('data-tag', i)
				.attr('id', 'onf-' + i)
				.attr('class', 'onf-social')
				.attr('target', '_blank')
				.data('index', i)
				.click(_share_click);
				
				share_opts.append(a);
			});
			share_wrap.mouseenter(share_in);
			target.mouseleave(share_out);
			share_wrap.append(share_opts);
			right_wrap.append(share_wrap);
			
			registerCallback(ONF_NFB_event_shareclick, opts.share.callback, share_opts);
		}
		
		// create volume menu item
		if (!!opts.volume && !uas.mobile) {
			vol_btn.text(_getObjectValue(opts.volume.title));
			vol_btn.click(mute);
			if (!!$.cookie && !!$.cookie('muted')) {
				vol_btn.addClass('muted');
			}
			right_wrap.append(vol_btn);
			
			registerCallback(ONF_NFB_event_volclick, opts.volume.callback, vol_btn);
		}
		
		// create the fullscreen menu item
		if (!!opts.fullscreen && supportsFullScreen()) {
			fs_btn.text(_getObjectValue(opts.fullscreen.title));
			fs_btn.click(toggleFullScreen);
			right_wrap.append(fs_btn);
			
			registerCallback(ONF_NFB_event_fsclick, opts.fullscreen.callback, fs_btn);
		}
		
		// add the righ_wrap to the wrap
		wrap.append(right_wrap);
		
		// finally add the wrap to our container
		target.empty().append(wrap);
		
		// save options
		target.data('opts', opts);
		
		// handle hover
		if (opacityEnabled) {
			target.hover(_hoverIn, _hoverOut);
			_hoverOut.call(target);
		} else {
			target.off('mouseenter', _hoverIn).off('mouseleave', _hoverOut);
		}
		
		// ready callback
		if ($.isFunction(opts.ready)) {
			opts.ready.call(target, opts);
		}
	};
	
	/** GLOBAL OBJECT **/
	$.onf_nfb = $.extend(true, $.onf_nfb, {
		stats: {
			minDelay: 80,
			init: statsInit,
			log: statsLog, // deprecated
			add: statsPushLogger,
			trackPageview: trackPageview,
			trackEvent: trackEvent,
			trackSocial: trackSocial
		},
		menu: {
			top: menuTop,
			bot: menuBot
		},
		defaults: {
			top:top_defaults,
			bot:bot_defaults,
			stats: {
				loggers: {
					ntpt: {
						name: 'Unica NetInsight',
						params: null,
						init: $.noop,
						trackEvent: function (cat, action, label, value) {
							if (!!window.ntptEventTag && $.isFunction(ntptEventTag)) {
								var c = _concatParams(cat, action, label, value);
								ntptEventTag('ln=' + LG + '&ev='+ EV +'&ntpgi_interactive_page=' + c);
								return true;
							}
							return false;
						},
						trackPageview: function (url) {
							// see: http://fr.scribd.com/doc/87955703/26/ntptEventTag-ntptEventTag
							//if (!!window.ntptLinkTag && $.isFunction(ntptLinkTag)) {
								//ntptLinkTag(EV + '/' + url);
							//} else {
								this.trackEvent('_link', url);
							//}
						},
						trackSocial: function (network, socialAction, opt_target, opt_pagePath) {
							// revert to event
							this.trackEvent(opt_target, network, socialAction);
						}
					},
					ga: {
						name: 'Google Analytics',
						params: null,
						_addCustomVars: function (params) {
							if (!!window._gaq && $.isFunction(_gaq.push)) {
								// see https://developers.google.com/analytics/devguides/collection/gajs/?hl=pl#MultipleCommands
								
								// force values
								_gaq.push(['t2._setAccount', 'UA-32257069-1']);
								_gaq.push(['_gat._anonymizeIp']);
								//_gaq.push(['t2._setDomainName', '.onf.ca']);
								//_gaq.push(['t2._setDomainName', '.nfb.ca']);
								_gaq.push(['t2._setAllowLinker', true]);
								
								// custom vars
								_gaq.push(['_setCustomVar', 2, 'ln', LG, 2]); 
								_gaq.push(['t2._setCustomVar', 2, 'ln', LG, 2]); 
								
								_gaq.push(['_setCustomVar', 5, 'ev', EV, 3]);
								_gaq.push(['t2._setCustomVar', 5, 'ev', EV, 3]);
								
								_gaq.push(['_setCustomVar', 3, 'Interactif', params.name, 3]);
								_gaq.push(['t2._setCustomVar', 3, 'Interactif', params.name, 3]);
							}
						},
						init: function (params) {
							this.params = params;
							this._addCustomVars(this.params);
						},
						trackEvent: function (cat, action, label, value) {
							if (!!window._gaq && $.isFunction(_gaq.push)) {
								label = !!label ? label.toString() : undefined;
								value = !!value ? parseInt(value, 10) : undefined;
								_gaq.push(['_trackEvent', cat, action, label, value]);
								_gaq.push(['t2._trackEvent', cat, action, label, value]);
								return true;
							}
							return false;
						},
						trackPageview: function (url) {
							// see: https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
							if (!!window._gaq && $.isFunction(_gaq.push)) {
								_gaq.push(['_trackPageview', '/' + EV + '/' + this.params.name + '/' +  url]);
								_gaq.push(['t2._trackPageview', '/' + EV + '/' + this.params.name + '/' +  url]);
								return true;
							}
							return false;
						},
						trackSocial: function (network, socialAction, opt_target, opt_pagePath) {
							// see: https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiSocialTracking
							if (!!window._gaq && $.isFunction(_gaq.push)) {
								_gaq.push(['_trackSocial', network, socialAction, opt_target, opt_pagePath]);
								_gaq.push(['t2._trackSocial', network, socialAction, opt_target, opt_pagePath]);
								return true;
							}
							return false;
						}
					},
					comscore: {
						name: 'Comscore',
						params: null,
						init: $.noop,
						trackEvent: function (cat, action, label, value) {
							if (!!window.COMSCORE && $.isFunction(COMSCORE.beacon)) {
								var c = _concatParams(cat, action, label, value);
								COMSCORE.beacon({ 
									c1: "2",  // tag type
									c2: "6035506", // comScore Client ID
									
									c4: EV + '/' + c // url
								});
							}
						},
						trackPageview: function (url) {
							if (!!window.COMSCORE && $.isFunction(COMSCORE.beacon)) {
								COMSCORE.beacon({ 
									c1: "2",  // tag type
									c2: "6035506", // comScore Client ID
									
									c4: EV + '/' + url // url
								});
							}
						},
						trackSocial: function (network, socialAction, opt_target, opt_pagePath) {
							// revert to event
							this.trackEvent(opt_target, network, socialAction);
						}
					}
				},
				actions: {
					'default':'share',
					facebook: 'like',
					twitter: 'tweet'
				}
			}
		},
		events: {
			namespace:	ONF_NFB_event_namespace,
			topclick:	ONF_NFB_event_topclick,
			help:		ONF_NFB_event_helpclick,
			lang:		ONF_NFB_event_langclick,
			search:		ONF_NFB_event_search,
			botclick:	ONF_NFB_event_botclick,
			share:		ONF_NFB_event_shareclick,
			volume:		ONF_NFB_event_volclick,
			fullscreen:	ONF_NFB_event_fsclick
		}
	});
	
})(jQuery);