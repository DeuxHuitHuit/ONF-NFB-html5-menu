/**
 * ONF-NFB Menu Behavior jQuery script
 * 
 * @author: DeuxHuitHuit
 * 
**/

;(function ($, undefined) {
	
	/** GLOBAL VARIABLES **/
	/*$.unsupported = !$.browser || ($.browser.msie && parseInt($.browser.version, 10) < 9);
	
	$.mobile = !!navigator.userAgent && (
					(navigator.userAgent.match(/iPhone/i)) || 
					(navigator.userAgent.match(/iPod/i)) || 
					(navigator.userAgent.match(/iPad/i)) || 
					(navigator.userAgent.match(/Android/i)) ||
					(navigator.userAgent.match(/mobile/i)) ||
					(navigator.userAgent.match(/phone/i))
					);*/
	
	// console support
	if (!window.console) {
		console.log = console.warn = console.error = console.info = $.noop;
	}
	
	/** Private VARIABLES **/
	var stats_loggers = [],
		LG = $('html').attr('lang'),
		ONF_NBF_url = (LG == 'fr' ? 'http://www.onf.ca' : 'http://www.nbf.ca'),
		top_defaults = {
			target: '#onf-top',
			opacity: 0.8,
			opacityHover: 1,
			links: {
				fr: [
				     {title: 'Explorer', 	url: 'http://www.onf.ca/explorer-tous-les-films/', 	callback: null, preventDefault:false},
				     {title: 'Sélections',	url: 'http://onf.ca/selections/', 					callback: null, preventDefault:false},
				     {title: 'Chaînes', 	url: 'http://www.onf.ca/chaines/', 					callback: null, preventDefault:false},
				     {title: 'Blogue',		url: 'http://blogue.onf.ca/', 						callback: null, preventDefault:false},
				     {title: 'Interactif', 	url: 'http://www.onf.ca/interactif/', 				callback: null, preventDefault:false}
				],
				en : [
				     {title: 'Explore', 	url: 'http://www.nfb.ca/explore-all-films/',	 	callback: null, preventDefault:false},
				     {title: 'Playlists',	url: 'http://www.nfb.ca/playlists/',				callback: null, preventDefault:false},
				     {title: 'Channels', 	url: 'http://www.nfb.ca/channels/',					callback: null, preventDefault:false},
				     {title: 'Blog',		url: 'http://blog.nfb.ca/', 						callback: null, preventDefault:false},
				     {title: 'Interactive',	url: 'http://www.nfb.ca/interactive/', 				callback: null, preventDefault:false}
				]
			},
			search: {
				fr: 'Recherche',
				en: 'Search'
			},
			help: {
				fr: {title: 'Aide', 		url: '', callback: null, preventDefault:false},
				en: {title: 'Help', 		url: '', callback: null, preventDefault:false}
			},
			translate: {
				fr: [{title: 'English', 	url: '', callback: null, preventDefault:false}],
				en: [{title: 'Français',	url: '', callback: null, preventDefault:false}]
			}
		},
		bot_defaults = {
			target: '#onf-bot',
			opacity: 0.8,
			opacityHover: 1,
			links: {
				fr: [
				     {title: '', url: '', callback: $.noop, preventDefault:false}
				],
				en : [
				     {title: '', url: '', callback: $.noop, preventDefault:false}
				]
			},
			share: {
				fr: 'Partagez',
				en: 'Share',
				facebook: 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.location),
				twitter: 'http://www.twitter.com/intent/tweet?text=%23ONFi ' + encodeURIComponent(document.title) + ' ' + encodeURIComponent(document.location),
				stumpleupon: 'http://www.stumbleupon.com/submit?url='+ encodeURIComponent(document.location) + '&title=' + encodeURIComponent(document.title),
				digg: 'http://digg.com/submit?phase=2&url='+ encodeURIComponent(document.location) +'&bodytext=' + encodeURIComponent(document.title),
				delicious: 'http://www.delicious.com/post?v=2&url='+ encodeURIComponent(document.location) +'&title=' + encodeURIComponent(document.title)
			},
			volume: {
				fr: 'Volume',
				en: 'Volume'
			}
		};
	
	/** Private functions **/
	function _getValue(o) {
		if ($.isFunction(o)) {
			return o.call();
		}
		return o;
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
			if ($.isFunction(linkObj.callback)) {
				linkObj.callback.call(t, e);
			}
			if (!!linkObj.preventDefault) {
				return preventDefault(e);
			}
		}
		
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