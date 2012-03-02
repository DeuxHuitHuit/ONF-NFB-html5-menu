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
		console.log = console.warn = console.error = console.info = $.noop;
	}
	
	// forEach support
	// @see http://www.tutorialspoint.com/javascript/array_foreach.htm
	if (!Array.prototype.forEach) {
	  Array.prototype.forEach = function(fun) {
	    var len = this.length,
	    thisp = arguments[1];
	    if (typeof fun != "function") throw new TypeError('First parameter must be a function');
	    for (var i = 0; i < len; i++) {
	      if (i in this) fun.call(thisp, this[i], i, this);
	    }
	  };
	}

	
	/** Private VARIABLES **/
	var stats_loggers = [],
		LG = $('html').attr('lang'),
		ONF_NFB_plugin_root = '/',
		ONF_NFB_url = (LG == 'fr' ? 'http://www.onf.ca' : 'http://www.nbf.ca'),
		ONF_NFB_icon = ONF_NFB_plugin_root + 'img/nfb_logo_onf.gif';
		ONF_NFB_search_url = 'http://search.nfb.ca/search?entqr=0&output=xml_no_dtd&sort=date%3AD%3AL%3Ad1&client=beta_onfb&ud=1&oe=UTF-8&ie=UTF-8&proxystylesheet=beta_onfb&proxyreload=1&hl=' + LG + '&lr=lang_'+LG+'&site=beta_onfb&q=',
		isFullscreen = false,
		top_defaults = {
			target: '#onf-top',
			opacity: 0.8,
			opacityHover: 1,
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
				fr: 'Recherche',
				en: 'Search'
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
				fr: 'Partagez',
				en: 'Share',
				links: {
					facebook: 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.location),
					twitter: 'http://www.twitter.com/intent/tweet?text=%23ONFi ' + encodeURIComponent(document.title) + ' ' + encodeURIComponent(document.location),
					stumpleupon: 'http://www.stumbleupon.com/submit?url='+ encodeURIComponent(document.location) + '&title=' + encodeURIComponent(document.title),
					digg: 'http://digg.com/submit?phase=2&url='+ encodeURIComponent(document.location) +'&bodytext=' + encodeURIComponent(document.title),
					delicious: 'http://www.delicious.com/post?v=2&url='+ encodeURIComponent(document.location) +'&title=' + encodeURIComponent(document.title)
				}
			},
			volume: {
				fr: 'Volume',
				en: 'Volume'
			},
			fullscreen: {
				fr: 'Plein écran',
				en: 'Fullscreen'
			}
		};
	
	/** Private common functions **/
	function _getValue(o) {
		return $.isFunction(o) ? o.call(this) : o;
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
			tag = linkObj.tag || t.attr('data-tag');
		
		console.log ('[click] ' + tag);
		
		if (!!linkObj) {
			// call callback
			if ($.isFunction(linkObj.callback)) {
				linkObj.callback.call(t, e);
			}
			// prevent default behavior
			if (!!linkObj.preventDefault) {
				return preventDefault(e);
			}
		}
		
		// log the click
		// @todo: log
		
		// raise event
		
		return true;
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
	function _createLink(l) {
		var a = $('<a></a>');
		a.text(_getObjectValue(l.title));
		if (!!l.url) {
			a.attr('href', _getObjectValue(l.url));
		} else {
			a.attr('href', "#");
		}
		a.data('link', l);
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
		return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || isFullscreen;
	}
	function toggleFullScreen(e) {
		if (isFullScreen()) {
			return exitFullScreen(e);
		}
		return goFullScreen(e);
	};
	function getFullScreen() {
		var el = document.documentElement
	    , rfs = // for newer Webkit and Firefox
	           el.requestFullScreen
	        || el.webkitRequestFullScreen
	        || el.webkitEnterFullScreen
	        || el.mozRequestFullScreen
	        || el.msRequestFullScreen;
		return rfs;
	};
	function sendF11() {
		// for Internet Explorer
		try {
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript!=null) {
		     wscript.SendKeys("{F11}");
			}
		} catch (ex) {
			console.log('[wscript] ' + ex.message);
		}
	};
	function goFullScreen(e) {
		// @see: http://stackoverflow.com/questions/1125084/how-to-make-in-javascript-full-screen-windows-stretching-all-over-the-screen
		// @see: http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
		var rfs = getFullScreen();
		
		if(rfs!=undefined && $.isFunction(rfs)) {
		  rfs.call(document.documentElement);
		} else if(window.ActiveXObject!=undefined){
		  // for Internet Explorer
		  sendF11();
		}
		
		isFullscreen = true;
		
		//@todo: log it
		
		return preventDefault(e);
	};
	function exitFullScreen(e) {
		var el = document
	    , efs = // for newer Webkit and Firefox
	           el.exitFullScreen
	        || el.cancelFullScreen
	        || el.webkitExitFullScreen
	        || el.webkitCancelFullScreen
	        || el.mozExitFullScreen
	        || el.mozCancelFullScreen
	        || el.msExitFullScreen;
		
		if(efs!=undefined && $.isFunction(efs)) {
		  efs.call(el);
		} else if(window.ActiveXObject!=undefined){
		  sendF11();
		}
		
		isFullscreen = false;
		
		return preventDefault(e);
	};
	function supportsFullScreen() {
		return !!getFullScreen() || window.ActiveXObject!=undefined;
	};
	function mute(e) {
		var vol = $('#onf-volume'),
			isMuted = false;
		
		vol.toggleClass('muted');
		
		// @todo: log
		
		isMuted = vol.hasClass('muted');
		
		if (!!$.cookie) {
			$.cookie('muted', isMuted ? 1 : null, { expires: 7, path: '/' });
		}
		
		// @todo event
		
		return preventDefault(e);
	};
	
	
	/** Public functions **/
	
	/* Stats */
	function statsLog(cat, action, label, value, delay) {
		if (!delay || isNaN(delay) || delay < 100) {
			delay = _getValue(this.minDelay);
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
			document.location = ONF_NFB_search_url + encodeURIComponent(query);
		}
		
		return preventDefault(e);
	};
	function searchToggle(e, show) {
		var pnl = $('#onf-top-search-pnl'),
			lbl = $('#onf-top-search-lbl');
			
		pnl[show ? 'fadeIn' : 'fadeOut'].call(pnl, 400);
		lbl[show ? 'fadeOut': 'fadeIn' ].call(lbl, 400);
		
		if (show) {
			pnl.find('input[type=text]').eq(0).focus();
		}
		
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
		var opts = $.extend(true, opts, top_defaults),
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
		
		// create logo
		logo.attr('href', ONF_NFB_url);
		
		wrap.append(logo);
		
		// create menu items
		opts.links.forEach(function (obj,key) {
			wrap.append(_createLink(obj));
		});
		
		// create search function
		search_lbl.text(_getObjectValue(opts.search));
		search_lbl.click(searchIn);
		
		search_txt.attr('placeholder', _getObjectValue(opts.search));
		search_txt.keydown(searchKeyDown);
		search_btn.click(search);
		
		search_pnl.append(search_txt).append(search_btn);
		
		search_wrap.append(search_lbl).append(search_pnl);
		
		wrap.append(search_wrap);
		$(document.documentElement).mousedown(function (e) { // mouse down won't trap events
			if (e.target.nodeName != 'INPUT') { searchOut(e); }
			return true;
		});
		
		// create right menus items
		right_wrap.append(_createLink(opts.help));
		opts.translate.forEach(function (obj, key) {
			if (obj.tag != 'lang-' + LG) { // do not show current lang
				right_wrap.append(_createLink(obj));
			}
		});
		wrap.append(right_wrap);
		
		// finally add the wrap to our container
		target.empty().append(wrap);
		
		// save options
		target.data('opts', opts);
		
		// handle hover
		if (opacityEnabled) {
			target.hover(_hoverIn, _hoverOut);
			_hoverOut.call(target);
		}
	};
	
	
	/* Menu bottom */
	function shareToggle(e, isIn) {
		var ow = 155,
			w = 55,
			share = $('#onf-bot-share');
		
		if (isIn) {
			w = ow;
		}
		
		share.stop(false, false)
			 .css({display:'inline-block'})
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
		var opts = $.extend(true, opts, bot_defaults),
			target = $(opts.target),
			opacityEnabled = Math.abs(_getValue(opts.opacity) - _getValue(opts.opacityHover)) > 0,
			wrap = $('<div id="onf-bot-wrap"></div>'),
			right_wrap = $('<span id="onf-bot-right"></span>'),
			share_wrap = $('<span id="onf-bot-share"></span>'),
			share_opts = $('<span id="onf-share-opts"></span>'),
			vol_btn = $('<a href="#" id="onf-volume"></a>'),
			fs_btn = $('<a href="#" id="onf-fullscreen"></a>');
		
		// create menu item
		opts.links.forEach(function (obj, key) {
			wrap.append(_createLink(obj));
		});
		
		// create share menu items
		share_wrap.append($('<span>' + _getObjectValue(opts.share) + '</span>'));
		for (var i in opts.share.links) {
			if (opts.share.links.hasOwnProperty(i)) {
				var l = opts.share.links[i], 
					a = $('<a></a>');
				
				a.attr('href', _getValue(l) );
				a.attr('data-tag', i);
				a.attr('id', 'onf-' + i);
				a.attr('class', 'onf-social');
				a.attr('target', '_blank');
				a.click($.noop);
				
				share_opts.append(a);
			}
		}
		share_wrap.mouseenter(share_in);
		target.mouseleave(share_out);
		share_wrap.append(share_opts);
		right_wrap.append(share_wrap);
		
		// create volume menu item
		vol_btn.text(_getObjectValue(opts.volume));
		vol_btn.click(mute);
		if (!!$.cookie && !!$.cookie('muted')) {
			vol_btn.addClass('muted');
		}
		right_wrap.append(vol_btn);
		
		// create the fullscreen menu item
		if (supportsFullScreen()) {
			fs_btn.text(_getObjectValue(opts.fullscreen));
			fs_btn.click(toggleFullScreen);
			right_wrap.append(fs_btn);
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
		}
	});
	
})(jQuery);