/**
 * ONF-NFB Menu Behavior jQuery script
 * 
 * @author: DeuxHuitHuit
 * 
**/

;(function ($, undefined) {
	
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
	    if (typeof fun != "function") throw new TypeError('First parameter must be a function');
	    for (i = 0; i < len; i++) {
	      if (i in this) fun.call(thisp, this[i], i, this);
	    }
	  };
	}
	
	
	/** Private VARIABLES **/
	var // constants
		LG = _getDefaultValue($('html').attr('lang'), 'en'), // defaults to english
		ONF_NFB_url = (LG == 'fr' ? 'http://www.onf.ca' : 'http://www.nbf.ca'),
		ONF_NFB_search_url = 'http://search.nfb.ca/search?entqr=0&output=xml_no_dtd&sort=date%3AD%3AL%3Ad1&client=beta_onfb&ud=1&oe=UTF-8&ie=UTF-8&proxystylesheet=beta_onfb&proxyreload=1&hl='+LG+'&lr=lang_'+LG+'&site=beta_onfb&q=',
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
			     {title: {fr:'Accueil',en:'Home'},		url: null, 
			      callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tag: 'home'
			     },
			     {title: {fr:'À propos',en:'About'},	url: null,
			      callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tag: 'about'
			     },
			     {title: {fr:'Films reliés',en:'Related movies'},url: null,
			      callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tag: 'related'
			     },
			     {title: {fr:'Équipe',en:'Credits'},	url: null, 
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
		uas = {
			unsupported: !$.browser || !!($.browser.msie && parseInt($.browser.version, 10) < 9),
			ipad: !!ua && !!ua.match(/iPad/i),
			iphone: !!ua && (!!ua.match(/iPhone/i)) || (!!ua.match(/iPod/i)),
			android: !!ua && (!!ua.match(/Android/i))	
		};
	
	// set up UA shortcuts
	uas.ios = uas.ipad || uas.iphone;
	uas.mobile = uas.ios || uas.android || (!!ua && (ua.match(/mobile/i) || ua.match(/phone/i))) || 
			!!document.location.toString().match(/.+(\?|#)mobile$/i);
	
	/** Private common functions **/
	function _getValue(o) {
		return $.isFunction(o) ? o.call(this, LG) : o;
	};
	function _getObjectValue(o) {
		return $.isPlainObject(o) ? o[LG] : _getValue(o);
	};
	function _getDefaultValue(o, d) {
		return !!o ? o : d;
	};
	function preventDefault(e) {
		if (!!e && $.isFunction(e.preventDefault)) {
			e.preventDefault();
		}
		return false;
	};
	function _linkCallback(e) {
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
		$.onf_nfb.stats.log('menu','click', tag, t.index());
		
		return ret;
	};
	function _hover(e, _isIn) {
		var t = $(this),
			opts = t.data('opts'),
			value = _getValue(opts.opacity);
		
		if (_isIn) {
			value = _getValue(opts.opacityHover);
		}
		
		t.stop(true, false).animate({opacity:value}, 250);
	};
	function _hoverIn(e) {
		_hover.call(this, e, true);
	};
	function _hoverOut(e) {
		_hover.call(this, e, false);
	};
	function _createLink(l, target, event) {
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
	};
	function isFullScreen() {
		return document.fullScreen
			|| document.mozFullScreen
			|| document.webkitIsFullScreen // actual implementation
			|| document.webkitFullScreen
			|| document.msFullScreen;
	}
	function toggleFullScreen(e) {
		if (isFullScreen()) {
			return exitFullScreen(e);
		}
		return goFullScreen(e);
	};
	function getFullScreen() {
		var el = document.documentElement,
	    	rfs = // for newer Webkit and Firefox
	           el.requestFullScreen
	        || el.webkitRequestFullScreen
	        || el.webkitEnterFullScreen
	        || el.mozRequestFullScreen
	        || el.msRequestFullScreen;
		return rfs;
	};

	function goFullScreen(e) {
		// @see: http://stackoverflow.com/questions/1125084/how-to-make-in-javascript-full-screen-windows-stretching-all-over-the-screen
		// @see: http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
		var rfs = getFullScreen(),
			success = false;
		
		if(rfs!=undefined && $.isFunction(rfs)) {
		  rfs.call(document.documentElement);
		  success = true;
		}
		
		if (success) {
			// raise event
			$.event.trigger(ONF_NFB_event_fsclick, [e,this,true]);
			
			// log event
			$.onf_nfb.stats.log('menu','fullscreen', true);
		}
		
		return preventDefault(e);
	};
	function exitFullScreen(e) {
		var success = false,
			el = document,
			efs = // for newer Webkit and Firefox
	           el.exitFullScreen
	        || el.cancelFullScreen
	        || el.webkitExitFullScreen
	        || el.webkitCancelFullScreen
	        || el.mozExitFullScreen
	        || el.mozCancelFullScreen
	        || el.msExitFullScreen
	        || el.msExitCancelScreen;
		
		if(efs!=undefined && $.isFunction(efs)) {
		  efs.call(el);
		  success = true;
		}
		
		if (success) {
			// raise event
			$.event.trigger(ONF_NFB_event_fsclick, [e,this,false]);
			
			// log event
			$.onf_nfb.stats.log('menu','fullscreen', false);
		}
		
		return preventDefault(e);
	};
	function supportsFullScreen() {
		return !!getFullScreen();
	};
	function mute(e) {
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
		$.onf_nfb.stats.log('menu','mute', isMuted);
		
		return preventDefault(e);
	};
	function registerCallback(event, callback, target) {
		if ($.isFunction(callback)) {
			if (!!target && $.isFunction(target.on)) {
				target.on(event, callback);
			} else {
				$(document).on(event, callback);
			}
		}
	};
	
	
	
	/** Public functions **/
	
	/* Stats */
	function statsLog(cat, action, label, value, delay) {
		var minDelay = _getValue(this.minDelay);
		if (!delay || isNaN(delay) || delay < minDelay) {
			delay = minDelay;
		}
		function log() {
			stats_loggers.forEach(function (obj, key) {
				try {
					obj.log(cat, action, label, value);
				} catch (ex) {
					console.error('[stats] ' + obj.name + ': ' + ex.message);
				}
			});
		};
		// do not wait for the execution of the log
		setTimeout(log, delay);
	};
	function statsPushLogger(logger) {
		stats_loggers.push(logger);
	};
	function statsInit() {
		var nbf_logger = {
				name: 'ONF-NFB logger',
				log: function (cat, action, label, value) {
					if (!!window.ntptEventTag && $.isFunction(ntptEventTag)) {
						var c = cat + ' > ' + action;
						if (!!label) {
							c += ' > ' + label;
						}
						if (!isNaN(value)) {
							c += ' > ' + value;
						}
						ntptEventTag('ev=interactif&ntpgi_interactive_page=' + c);
						return true;
					}
					return false;
				}
			},
			ga_logger = {
				name: 'GA stats logger',
				log: function (cat, action, label, value) {
					if (!!window._gaq && $.isFunction(_gaq.push)) {
						_gaq.push(['_trackEvent', cat, action, label, value]);
						return true;
					}
					return false;
				}
			};

		// push our loggers
		statsPushLogger(nbf_logger);
		statsPushLogger(ga_logger);
	};
	statsInit();
	
	
	/* Menu top */
	function search(e) {
		var query = $('#onf-top-search-txt').val();
		
		if (!!query && query.length > 0) {
			
			// raise event
			$.event.trigger(ONF_NFB_event_search, [e,this,query]);
			
			// log event
			$.onf_nfb.stats.log('menu','search', query);
			
			// redirect
			setTimeout(function () {
				document.location = ONF_NFB_search_url + encodeURIComponent(query);
			}, $.onf_nfb.stats.minDelay);
		}
		
		return preventDefault(e);
	};
	function searchToggle(e, show) {
		var pnl = $('#onf-top-search-pnl'),
			lbl = $('#onf-top-search-lbl'),
			txt = pnl.find('input[type=text]').eq(0);
			
		pnl[show ? 'fadeIn' : 'fadeOut'].call(pnl, 400);
		lbl[show ? 'fadeOut': 'fadeIn' ].call(lbl, 400);
		txt[show ? 'focus' : 'blur'].call(txt);
		
		return preventDefault(e);
	};
	function searchIn(e) {
		return searchToggle.call(this, e, true);
	};
	function searchOut(e) {
		return searchToggle.call(this, e, false);
	};
	function searchKeyDown(e) {
		switch (e.which) {
			case 27 : // escape
				searchOut.call(this);
				break;
			case 13: // enter
				search();
				break;
		}
		return true;
	};
	
	function menuTop(top_options) {
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
			$.onf_nfb.stats.log('menu','click', 'logo');
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
	};
	
	
	/* Menu bottom */
	function shareToggle(e, isIn) {
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
	};
	function share_in(e) {
		return shareToggle.call(this, e, true);
	};
	function share_out(e) {
		return shareToggle.call(this, e, false);
	};
	
	function menuBot(bot_options) {
		var opts = $.extend((!!bot_options && !!bot_options.recursive ? true : {}), opts, bot_defaults, bot_options),
			target = $(opts.target),
			opacityEnabled = Math.abs(_getValue(opts.opacity) - _getValue(opts.opacityHover)) > 0,
			wrap = $('<div id="onf-bot-wrap"></div>'),
			right_wrap = $('<span id="onf-bot-right"></span>'),
			share_wrap = $('<span id="onf-bot-share"></span>'),
			share_opts = $('<span id="onf-share-opts"></span>'),
			vol_btn = $('<a href="#" id="onf-volume"></a>'),
			fs_btn = $('<a href="#" id="onf-fullscreen"></a>'),
			i = null;
			
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
			for (i in opts.share.links) {
				if (opts.share.links.hasOwnProperty(i)) {
					var l = opts.share.links[i], 
						a = $('<a></a>');
					
					a.attr('href', _getValue(l) );
					a.attr('data-tag', i);
					a.attr('id', 'onf-' + i);
					a.attr('class', 'onf-social');
					a.attr('target', '_blank');
					a.click(function (e) {
						// raise event
						$.event.trigger(ONF_NFB_event_shareclick, [e,this,i]);
						
						// log event
						$.onf_nfb.stats.log('menu','share', i);
						
						// allow continuation
						return true;
					});
					
					share_opts.append(a);
				}
			}
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
			log: statsLog,
			add: statsPushLogger
		},
		menu: {
			top: menuTop,
			bot: menuBot
		},
		defaults: {
			top:top_defaults,
			bot:bot_defaults
		},
		events: {
			namespace:	ONF_NFB_event_namespace,
			topclick: 	ONF_NFB_event_topclick,
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