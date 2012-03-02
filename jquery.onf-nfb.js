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

	
	/** Private VARIABLES **/
	var stats_loggers = [],
		LG = $('html').attr('lang'),
		ONF_NFB_plugin_root = '/',
		ONF_NFB_url = (LG == 'fr' ? 'http://www.onf.ca' : 'http://www.nbf.ca'),
		ONF_NFB_icon = ONF_NFB_plugin_root + 'img/nfb_logo_onf.gif';
		ONF_NFB_search_url = '',
		top_defaults = {
			target: '#onf-top',
			opacity: 0.8,
			opacityHover: 1,
			links: [
			     {title: {fr:'Explorer', en:'Explore'}, 
			      url: {fr:'http://www.onf.ca/explorer-tous-les-films/', en:'http://www.nfb.ca/explore-all-films/'},
			      callback: null, preventDefault:false, target: null, cssClass: null, tagName: null
			     },
			     {title: {fr:'Sélections', en:'Playlists'},	
			      url: {fr:'http://onf.ca/selections/', en: 'http://www.nfb.ca/playlists/'},
			      callback: null, preventDefault:false, target: null, cssClass: null, tagName: null
			     },
			     {title: {fr:'Chaînes', en: 'Channels'},
			      url: {fr:'http://www.onf.ca/chaines/', en: 'http://www.nfb.ca/channels/'},					
			     callback: null, preventDefault:false, target: null, cssClass: null, tagName: null
			     },
			     {title: {fr:'Blogue',  en:'Blog'},
			      url: {fr:'http://blogue.onf.ca/', en: 'http://blog.nfb.ca/'},
			      callback: null, preventDefault:false, target: null, cssClass: null, tagName: null
			     },
			     {title: {fr:'Interactif', en: 'Interactive'},
			      url: {fr:'http://www.onf.ca/interactif/', en: 'http://www.nfb.ca/interactive/'},
			      callback: null, preventDefault:false, target: null, cssClass: null, tagName: null
			     }
			],
			search: {
				fr: 'Recherche',
				en: 'Search'
			},
			help: {title: {fr:'Aide', en:'Help'}, 
				  url: '', callback: null, preventDefault:false, target: '_blank', cssClass: null, tagName: null
			},
			translate: [
		       {title: {fr:'English', en:'Français'},
		    	url: '', callback: null, preventDefault:false, target: null, cssClass: null, tagName: null
		    	}
			]
		},
		bot_defaults = {
			target: '#onf-bot',
			opacity: 0.8,
			opacityHover: 1,
			links: [
			     {title: {fr:'Accueil',en:'Home'},		url: null, 
			      callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tagName: null
			     },
			     {title: {fr:'À propos',en:'About'},	url: null,
			      callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tagName: null
			     },
			     {title: {fr:'Films reliés',en:'Related movies'},url: null,
			      callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont onf-bot-border', tagName: null
			     },
			     {title: {fr:'Équipe',en:'Credits'},	url: null, 
			      callback: null, preventDefault:true, target: null, cssClass: 'onf-bot-cont', tagName: null
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
			linkObj = t.data('link');
		
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
	
	
	/** Public functions **/
	
	/* Stats */
	function statsLog(cat, action, label, value, delay) {
		if (!delay || isNaN(delay) || delay < 100) {
			delay = _getValue(this.minDelay);
		}
		function log() {
			for (i in stats_loggers) {
				try {
					stats_loggers[i].log(cat, action, label, value);
				} catch (ex) {
					console.error('[stats] ' + logger.name + ': ' + ex.message);
				}
			}
		};
		// do not wait for the execution of the log
		setTimeout(log, delay);
	};
	function statsPushLogger(logger) {
		stats_loggers.push(logger);
	};
	function statsInit() {
		var nbf_logger = {
				name: 'ONF-NBF logger',
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
		
		return preventDefault(e);
	};
	function searchToggle(e, show) {
		var pnl = $('#onf-top-search-pnl'),
			lbl = $('#onf-top-search-lbl')
			
		// improve logic here !!
		pnl.fadeTo(400, show ? 1 : 0);
		lbl.fadeTo(400, show ? 0 : 1);
		
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
			search_lbl = $('<a href="#" id="onf-top-search-lbl"></span>'),
			search_pnl = $('<div id="onf-top-search-pnl"></div>'),
			search_txt = $('<input id="onf-top-search-txt" type="text" />'),
			search_btn = $('<input id="onf-top-search-btn" type="button" value="" />'),
			right_wrap = $('<div id="onf-top-right"></span>'),
			wrap = $('<div id="onf-top-wrap"></div>');
		
		// create logo
		logo.attr('href', ONF_NFB_url);
		
		wrap.append(logo);
		
		// create menu items
		for (var i in opts.links) {
			wrap.append(_createLink(opts.links[i]));
		}
		
		// create search function
		search_lbl.text(_getObjectValue(opts.search));
		search_lbl.click(searchIn);
		
		search_txt.attr('placeholder', _getObjectValue(opts.search));
		search_txt.keydown(searchKeyDown);
		search_btn.click(search);
		
		search_pnl.append(search_txt).append(search_btn);
		
		search_wrap.append(search_lbl).append(search_pnl);
		
		wrap.append(search_wrap);
		
		// create right menus items
		right_wrap.append(_createLink(opts.help));
		for (var i in opts.translate) {
			right_wrap.append(_createLink(opts.translate[i]));
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
		}
	};
	
	
	/* Menu bottom */
	function shareToggle(e, isIn) {
		var ow = 165,
			w = 65,
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
			vol_btn = $('<a href="#" id="onf-volume"></a>');
		
		// create menu item
		for (var i in opts.links) {
			wrap.append(_createLink(opts.links[i]));
		}
		
		// create share menu items
		share_wrap.append($('<span>' + _getObjectValue(opts.share) + '</span>'));
		for (var i in opts.share.links) {
			var l = opts.share.links[i], 
				a = $('<a></a>');
			
			a.attr('href', _getValue(l) );
			a.attr('data-name', i);
			a.attr('id', 'onf-' + i);
			a.attr('class', 'onf-social');
			a.attr('target', '_blank');
			a.click($.noop);
			
			share_opts.append(a);
		}
		share_wrap.mouseenter(share_in);
		target.mouseleave(share_out);
		share_wrap.append(share_opts);
		right_wrap.append(share_wrap);
		
		// create volume menu item
		vol_btn.text(_getObjectValue(opts.volume));
		vol_btn.click(function () {});
		right_wrap.append(vol_btn);
		
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