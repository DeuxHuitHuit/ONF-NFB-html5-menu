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
			      callback: null, preventDefault:true, target: null, cssClass: null, tagName: null
			     },
			     {title: {fr:'À propos',en:'About'},	url: null,
			      callback: null, preventDefault:true, target: null, cssClass: null, tagName: null
			     },
			     {title: {fr:'Films reliés',en:'Related movies'},url: null,
			      callback: null, preventDefault:true, target: null, cssClass: null, tagName: null
			     },
			     {title: {fr:'Équipe',en:'Credits'},	url: null, 
			      callback: null, preventDefault:true, target: null, cssClass: null, tagName: null
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
		if ($.isFunction(o)) {
			return o.call();
		}
		return o;
	};
	function _getObjectValue(o) {
		if ($.isPlainObject(o)) {
			return o[LG];
		}
		return _getValue(o);
	};
	function _getDefaultValue(o, d) {
		if (!!o) {
			return o;
		}
		return d;
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
		
		t.stop(false, false).animate({opacity:value}, 250);
	};
	function _hoverIn(e) {
		_hover.call(this, e);
	};
	function _hoverOut(e) {
		_hover.call(this, e);
	};
	function _createLink(l) {
		var a = $('<a></a>');
		a.text(_getObjectValue(l.title));
		a.attr('href', _getObjectValue(l.url));
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
	function menuTop(top_options) {
		var opts = $.extend(true, opts, top_options),
			target = $(opts.target),
			opacityEnabled = _getValue(opts.opacity) - _getValue(opts.opacityHover) > 0,
			wrap = $('<div id="onf-top-wrap"></div>');
		
			
		// handle hover
		if (opacityEnabled) {
			target.hover(_hoverIn, _hoverOut);
		}
			
		// finally add the wrap to our container
		target.empty().add(wrap);
	};
	
	
	/* Menu bottom */
	
	function shareToggle(e, isIn) {
		var ow = 165,
			w = 65;
		
		if (isIn) {
			w = ow;
		}
		
		share.css({display:'inline-block'});
		share.stop(false, false).animate({width:w}, ow * 2, function () {
			if (!isIn) {
				//share_opts.hide(0);
			}
		});
		
		return preventDefault(e);
	};
	function share_in(e) {
		return shareToggle.call(this, e, true);
	};
	function share_out(e) {
		return shareToggle.call(this, e, false);
	};
	
	
	function menuBot(bot_options) {
		var opts = $.extend(true, opts, bot_options),
			target = $(opts.target),
			opacityEnabled = _getValue(opts.opacity) - _getValue(opts.opacityHover) > 0,
			wrap = $('<div id="onf-bot-wrap"></div>');
			
			
		// handle hover
		if (opacityEnabled) {
			target.hover(_hoverIn, _hoverOut);
		}
		
		// finally add the wrap to our container
		target.empty().add(wrap);
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