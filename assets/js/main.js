/*  Type.js
 by Nathan Ford
 @nathan_ford

 FEATURES
 - kerning pairs
 - rag adjust
 - min/max font size
 - widow tamer

 -----------------------------*/

var stylefill = {

  options: {
    externalCSS: false
  },
  properties: {},
  allRules: {},
  sheets: [],
  sheetTexts: {},

  arraySliceShim: function () { // fixes Array.prototype.slice support for IE lt 9
    'use strict';
    var _slice = Array.prototype.slice;

    try {
      _slice.call(document.documentElement);
    } catch (e) { // Fails in IE < 9
      Array.prototype.slice = function (begin, end) {

        var i,
          arrayLength = this.length,
          a = [];

        if (this.charAt) {
          for (i = 0; i < arrayLength; i++) {
            a.push(this.charAt(i));
          }
        } else {
          for (i = 0; i < this.length; i++) {
            a.push(this[i]);
          }
        }

        return _slice.call(a, begin, end || a.length);
      };
    }
  },

  setOptions: function (params) {
    this.options = params;
  },

  init: function (params) {
    this.properties = params;
    this.arraySliceShim();
    this.getStyleSheets();
  },

  loadStyles: function (count) {
    var sheet = this.sheets[count];

    if (sheet) {
      if (sheet.innerHTML) {
        this.loadCSSinner(sheet, count);
      } else if (!stylefill.sheets[sheet.href] && stylefill.options.externalCSS) {
        stylefill.loadFile(sheet.href, count);
      } else {
        stylefill.loadStyles(count + 1);
      }
    } else {
      stylefill.runSheets();
    }
  },

  loadCSSinner: function (sheet, count) {
    this.sheetTexts['onpage' + count] = sheet.innerHTML;
    this.loadStyles(count + 1);
  },

  loadFile: function (url, count) {
    var req;

    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    } else {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }
  },

  options: function (params) {

    this.options = params;

  },

  init: function (params) {

    this.properties = params;

    this.arraySliceShim();

    this.getStyleSheets();

  },

  loadStyles: function (count) {

    var sheet = this.sheets[count];

    if (sheet) {

      if (sheet.innerHTML) this.loadCSSinner(sheet, count);
      else if (!stylefill.sheets[sheet.href] && stylefill.options.externalCSS) stylefill.loadFile(sheet.href, count);
      else stylefill.loadStyles(count + 1);

    } else stylefill.runSheets();

  },

  loadCSSinner: function (sheet, count) {

    this.sheetTexts['onpage' + count] = sheet.innerHTML;

    this.loadStyles(count + 1);

  },

  loadFile: function (url, count) {

    var req;

    if (window.XMLHttpRequest) req = new XMLHttpRequest();
    else req = new ActiveXObject("Microsoft.XMLHTTP");

    req.open("GET", url, true);

    req.onreadystatechange = function () {

      if (this.readyState === 4 && this.status === 200) {
        stylefill.sheetTexts[url] = this.responseText;
        stylefill.loadStyles(count + 1);
      } else if (this.readyState === 4 && this.status === 000) {
        stylefill.loadStyles(count + 1);
      }
    };

    req.send(null);

  },

  getStyleSheets: function (property, func) {

    var sheetstext = new Array(),
      stylesheets = Array.prototype.slice.call(document.querySelectorAll('link[href*=".css"]')), // grab stylesheet links - not used yet

      styleEles = document.getElementsByTagName('style');

    if (styleEles.length > 0) {

      for (i in styleEles) {

        if (styleEles[i].innerHTML) stylesheets.push(Array.prototype.slice.call(styleEles)[i]); // add on page CSS

      }

    }

    this.sheets = stylesheets;

    this.loadStyles(0);

  },

  runSheets: function () {

    for (sheet in this.sheetTexts) {
      for (property in this.properties) {

        var sheetext = this.sheetTexts[sheet],
          func = this.properties[property];

        this.findRules(property, sheetext, func);

      }
    }

  },

  checkRule: function (property) {

    var propertyCamel = property.replace(/(^|-)([a-z])/g, function (m1, m2, m3) {
      return m3.toUpperCase();
    });

    if (('Webkit' + propertyCamel) in document.body.style ||
      ('Moz' + propertyCamel) in document.body.style ||
      ('O' + propertyCamel) in document.body.style ||
      property in document.body.style) return true;

  },

  findRules: function (property, sheettext, func) {

    var rules = {
      support: false
    };

    if (sheettext) {

      if (!this.checkRule(property)) { // check if rule is valid now

        var selreg = new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi'),
          selmatch, i = 0;

        while (selmatch = selreg.exec(sheettext)) {

          var sel = selmatch[1].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
            val = selmatch[3];

          rules['rule' + i] = {

            selector: sel,
            property: property,
            value: val

          };

          if (!stylefill.allRules[sel]) stylefill.allRules[sel] = new Object();
          stylefill.allRules[sel][property] = val;

          i++;

        }

      } else rules.support = true;

      func(rules);

    }

  },

  getStyleSheets: function (property, func) {

    var sheetstext = [],
      stylesheets = Array.prototype.slice.call(document.querySelectorAll('link[href*=".css"]')), // grab stylesheet links - not used yet
      styleEles = document.getElementsByTagName('style');

    if (styleEles.length > 0) {
      for (var i in styleEles) {
        if (styleEles[i].innerHTML) {
          // add on page CSS
          stylesheets.push(Array.prototype.slice.call(styleEles)[i]);
        }
      }
    }

    this.sheets = stylesheets;
    this.loadStyles(0);
  },

  runSheets: function () {

    for (var sheet in this.sheetTexts) {
      for (var property in this.properties) {

        if (this.sheetTexts.hasOwnProperty(sheet) && this.properties.hasOwnProperty(property)) {
          var sheetText = this.sheetTexts[sheet],
            func = this.properties[property];

          this.findRules(property, sheetText, func);
        }
      }
    }
  },

  checkRule: function (property) {

    var propertyCamel = property.replace(/(^|-)([a-z])/g, function (m1, m2, m3) {
      return m3.toUpperCase();
    });

    if (
      ('Webkit' + propertyCamel) in document.body.style ||
      ('Moz' + propertyCamel) in document.body.style ||
      ('O' + propertyCamel) in document.body.style ||
      property in document.body.style
    ) {
      return true;
    }
  },

  findRules: function (property, sheetText, func) {

    var rules = {
      support: false
    };

    if (sheetText) {
      if (!this.checkRule(property)) { // check if rule is valid now

        var selreg = new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi'),
          selmatch,
          i = 0;

        while (selmatch = selreg.exec(sheetText)) {

          var sel = selmatch[1].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
            val = selmatch[3];

          rules['rule' + i] = {
            selector: sel,
            property: property,
            value: val
          };

          if (!stylefill.allRules[sel]) stylefill.allRules[sel] = {};
          stylefill.allRules[sel][property] = val;

          i++;
        }
      } else {
        rules.support = true;
      }

      func(rules);
    }
  }
};

var type = {

  kerningPairs: function (rules) {

    var traverseNodes = function (node, pairs) {
      var next;

      if (node.nodeType === 1) {
        if (node = node.firstChild) {
          do {
            next = node.nextSibling;
            traverseNodes(node, pairs);
          } while (node = next);
        }
      } else if (node.nodeType === 3) {
        kernText(node, pairs);
      }
    };

    var kernText = function (node, pairs) {

      var nodetext = node.textContent,
        nodechars = nodetext.split(''),
        parent = node.parentNode,
        pcount = pairs.length;

      while (pcount-- > 0) {

        var pair = pairs[pcount].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
          chars = pair.match(/^(.)(.)\s/i),
          amount = pair.match(/\s(\-*[0-9.]+[a-z]+)$/i)[1],
          ccount = nodechars.length;

        while (ccount-- > 0) {

          var char = nodechars[ccount],
            nextchar = nodechars[ccount + 1],
            charpair = char + nextchar,
            nextcharreg = new RegExp('^(<span[^>]+>)*' + chars[2] + '(<\/\s*span\s*>)*$', 'i');

          if (char === chars[1] && nextchar && nextchar.match(nextcharreg)) {
            nodechars[ccount] = '<span style="letter-spacing:' + amount + '">' + char + '</span>';
          }
        }
      }

      var temp = document.createElement('div');

      temp.innerHTML = nodechars.join('');

      while (temp.firstChild) {
        parent.insertBefore(temp.firstChild, node);
      }

      parent.removeChild(node);
    };

    var kernAll = function () {

      for (var i in rules) {

        if (rules[i] && rules[i] !== 'none') {

          var rule = rules[i],
            eles = document.querySelectorAll(rule.selector),
            elescount = eles.length,
            val = rule.value,
            pairs = val.split(',');

          while (elescount-- > 0) {
            var ele = eles[elescount];
            traverseNodes(ele, pairs);
          }
        }
      }
    };

    window.addEventListener('load', kernAll, false);
  },

  ragAdjust: function (rules) {

    for (var i in rules) {

      var rule = rules[i],
        eles = document.querySelectorAll(rule.selector),
        elescount = eles.length,
        preps = /(\s|^|>)((aboard|about|above|across|after|against|along|amid|among|anti|around|before|behind|below|beneath|beside|besides|between|beyond|concerning|considering|despite|down|during|except|excepting|excluding|following|from|inside|into|like|minus|near|onto|opposite|outside|over|past|plus|regarding|round|save|since|than|that|this|through|toward|towards|under|underneath|unlike|until|upon|versus|with|within|without)\s)+/gi,
        smallwords = /(\s|^)(([a-zA-Z-_(]{1,2}('|’)*[a-zA-Z-_,;]{0,1}?\s)+)/gi, // words with 3 or less characters
        dashes = /([-–—])\s/gi,
        emphasis = /(<(strong|em|b|i|a)[^>]+>)(([^\s]+\s*){2,3})?(<\/(strong|em|b|i|a)>)/gi;

      while (elescount-- > 0) {

        var ele = eles[elescount],
          elehtml = ele.innerHTML;

        if (rule.value === 'prepositions' || rule.value === 'all') {
          // replace prepositions (greater than 3 characters)
          elehtml = elehtml.replace(preps, function (contents, p1, p2) {
            return p1 + p2.replace(/\s/gi, '&#160;');
          });
        }

        if (rule.value === 'small-words' || rule.value === 'all') {
          // replace small words
          elehtml = elehtml.replace(smallwords, function (contents, p1, p2) {
            return p1 + p2.replace(/\s/g, '&#160;');
          });
        }

        if (rule.value === 'dashes' || rule.value === 'all') {
          // replace small words
          elehtml = elehtml.replace(dashes, function (contents) {
            return contents.replace(/\s/g, '&#160;');
          });
        }

        if (rule.value === 'emphasis' || rule.value === 'all') {
          // emphasized text
          elehtml = elehtml.replace(emphasis, function (contents, p1, p2, p3, p4, p5) {
            return p1 + p3.replace(/\s/gi, '&#160;') + p5;
          });
        }

        ele.innerHTML = elehtml;
      }
    }
  },

  maxFontSize: function (rules) {

    for (var i in rules) {

      var rule = rules[i];

      if (rule.value != 'none') {
        type.minMaxFontSize(rule.selector);
      }
    }
  },

  minFontSize: function (rules) {

    for (var i in rules) {
      var rule = rules[i];

      if (rule.value != 'none') {
        type.minMaxFontSize(rule.selector);
      }
    }
  },

  minMaxFontSize: function (selector) {

    var changeSize = function () {

      var eles = document.querySelectorAll(selector),
        elescount = eles.length;

      while (elescount-- > 0) {

        var ele = eles[elescount],
          selRules = stylefill.allRules[selector],
          max = selRules['max-font-size'],
          min = selRules['min-font-size'];

        ele.style.fontSize = '';

        var eleFontSize = parseFloat(window.getComputedStyle(ele, null).getPropertyValue('font-size'));

        if (eleFontSize <= parseFloat(min)) {
          ele.style.fontSize = min;
        } else if (eleFontSize >= parseFloat(max)) {
          ele.style.fontSize = max;
        }
      }
    };

    if (selector) {
      changeSize();
      window.addEventListener('resize', changeSize, false);
    }
  },

  widowAdjust: function (rules) {

    var fixMethod = function (method) {
      return method.replace(/-([a-zA-Z])/g, function (m) {
        return m.replace('-', '').toUpperCase();
      });
    };

    var getText = function (ele) {
      return ele.innerText || ele.textContent;
    };

    var setText = function (ele, text) {
      ele.innerHTML = text;
    };

    var runTamer = function (ele, method) {

      // check if more than one line
      if (ele.offsetHeight > type.getStyle(ele, 'line-height', true)) {

        // find a textnode longer than chars
        var nodes = ele.childNodes,
          j = nodes.length - 1,
          c = false,
          countText = getText(ele),
          height = ele.offsetHeight;

        if (countText) {

          // Reset line-heights and font-size for precise measurement
          for (j in nodes) {
            if (nodes[j].innerHTML) {
              nodes[j].style['line-height'] = '1 !important';
            }
          }

          tamer(countText, ele, height, 0, method);
        }
      }
    };

    var tamer = function (text, ele, height, i, method) {

      var origHTML = ele.innerHTML;

      setText(ele, text.slice(0, -14));

      if (ele.offsetHeight < height) {

        if (method === 'nonBreakingSpace') {
          setText(ele, origHTML.replace(/\s([^\s]+)$/, '&#160;$1'));
        } else {

          var inc = (method.match('padding')) ? 1 : 5,
            amount = (method.match('padding')) ? (i / 100) : (i / 1000);

          if (method.match('Spacing')) {
            inc = inc * -1;
          }

          if (method.match('padding')) {
            ele.style['boxSizing'] = 'border-box';
          }

          ele.style[method] = amount + 'em';
          setText(ele, origHTML);

          if (i < 500) {
            tamer(text, ele, height, i + inc, method);
          }
        }
      } else {
        setText(ele, origHTML);
      }
    };

    var adjustWidows = function () {

      for (var i in rules) {

        var rule = rules[i];

        if (rule) {
          var eles = document.querySelectorAll(rule.selector),
            elescount = eles.length,
            method = fixMethod(rule.value);

          switch (method) {

            case 'paddingRight':
            case 'nonBreakingSpace':
            case 'paddingLeft':
            case 'wordSpacing':
            case 'letterSpacing':
            case undefined:

              while (elescount-- > 0) {
                runTamer(eles[elescount], method);
              }
              break;

            default:
              console.log('Invalid method. Please use either padding-right, padding-left, word-spacing, or letter-spacing.');
          }
        }
      }
    };

    window.addEventListener('load', adjustWidows, false);
  },

  getStyle: function (ele, style, unit) {

    var ret;

    if (ele.currentStyle) {
      ret = ele.currentStyle[style.replace(/-([A-z])/gi, function (a, b) {
        return b.toUpperCase();
      })];
    } else if (window.getComputedStyle) {
      ret = document.defaultView.getComputedStyle(ele, null).getPropertyValue(style);
    }

    if (unit) {
      return parseFloat(ret);
    } else {
      return ret;
    }
  }
};

stylefill.setOptions({
  externalCSS: false
});

stylefill.init({

  'max-font-size': type.maxFontSize,
  'min-font-size': type.minFontSize,
  'kerning-pairs': type.kerningPairs,
  'rag-adjust': type.ragAdjust,
  'widow-adjust': type.widowAdjust

});







/* Fixed Footer - Slides up - Only on Posts
-----------------------------------------------*/


! function (a) {
  a.fn.footerReveal = function (b) {
    var c = a(this),
      d = c.prev(),
      e = a(window),
      f = a.extend({
        shadow: !0,
        shadowOpacity: .8,
        zIndex: -100
      }, b);
    a.extend(!0, {}, f, b);
    return c.outerHeight() <= e.outerHeight() && c.offset().top >= e.outerHeight() && (c.css({
      "z-index": f.zIndex,
      position: "fixed",
      bottom: 0
    }), f.shadow && d.css({
      "-moz-box-shadow": "0 20px 30px -20px rgba(0,0,0," + f.shadowOpacity + ")",
      "-webkit-box-shadow": "0 20px 30px -20px rgba(0,0,0," + f.shadowOpacity + ")",
      "box-shadow": "0 20px 30px -20px rgba(0,0,0," + f.shadowOpacity + ")"
    }), e.on("load resize footerRevealResize", function () {
      c.css({
        width: d.outerWidth()
      }), d.css({
        "margin-bottom": c.outerHeight()
      })
    })), this
  }
}(jQuery);


var fontObservers = [];
var fontFamilies = {
  'Open Sans': [{
    weight: 300
  }, {
    weight: 400
  }],
  'Novecentowide-Bold': [{
    weight: 400
  }],
  'Novecentowide-Light': [{
    weight: 400
  }]
};
Object.keys(fontFamilies).forEach(function (family) {
  fontObservers.push(fontFamilies[family].map(function (config) {
    return new FontFaceObserver(family, config).load();
  }));
});
Promise.all(fontObservers).then(function () {
  document.documentElement.classList.add('webfont-loaded');
}, function () {
  console.info('Web fonts could not be loaded in time. Falling back to system fonts.');
});



/* Scroll for Main Menu & Dot Menu
------------------------------------------*/
jQuery.noConflict();
jQuery(document).ready(function ($) {
  var contentSections = $('.slide'),
    navigationItems = $('.nav a');
  dotNavigationItems = $('.dot-nav a');

  updateNavigation();
  updateSecondNavigatioin();
  $(window).on('scroll', function () {
    updateNavigation();
    updateSecondNavigatioin();
  });

  //smooth scroll to the section
  navigationItems.on('click', function (event) {
    event.preventDefault();
    smoothScroll($(this.hash));
  });
  //smooth scroll to second section
  $('.scroll-down-button' + ',' + '.scrollToTop').on('click', function (event) {
    event.preventDefault();
    smoothScroll($(this.hash));
  });


  function updateNavigation() {
    contentSections.each(function () {
      $this = $(this);
      var activeSection = $('.nav a[href="#' + $this.attr('id') + '"]').data('number') - 1;
      if (($this.offset().top - $(window).height() / 2 < $(window).scrollTop()) && ($this.offset().top + $this.height() - $(window).height() / 2 > $(window).scrollTop())) {
        // $(".dot-nav").removeClass("is-light is-dark").addClass($(this).hasClass("is-dark") ? "is-light" : "is-dark"); //for the dot nav colors
        navigationItems.eq(activeSection).addClass('active'); // for the main menu
      } else {
        navigationItems.eq(activeSection).removeClass('active');
      }
    });
  }


  function updateSecondNavigatioin() {
    contentSections.each(function () {
      $this = $(this);
      var activeSection = $('.dot-nav a[href="#' + $this.attr('id') + '"]').data('number') - 1;
      if (($this.offset().top - $(window).height() / 2 < $(window).scrollTop()) && ($this.offset().top + $this.height() - $(window).height() / 2 > $(window).scrollTop())) {
        $(".dot-nav").removeClass("is-light is-dark").addClass($(this).hasClass("is-dark") ? "is-light" : "is-dark"); //for the dot nav colors
        dotNavigationItems.eq(activeSection).parent().addClass('selected'); // for the main menu
      } else {
        dotNavigationItems.eq(activeSection).parent().removeClass('selected');
      }
    });
  }



  // sets scroll for mobi height
  function smoothScroll(target, time) {
    var margin = ($('.primary-nav').outerHeight(true));
    if (!time) {
      time = '1500';
    }

    //sets scroll for desktop height
    if ($(window).width() > 785) {
      $('html,body').animate({
        'scrollTop': target.offset().top
      }, time);
    } else {
      $('html,body').animate({
        scrollTop: target.offset().top - margin
      }, time);
    }
  }

}); //end jQuery


jQuery.noConflict();
jQuery(document).ready(function ($) {

  // Init ScrollMagic
  var controller = new ScrollMagic.Controller();

  // get all slides
  var slides = ['#slide01', '#slide02', '#slide03', '#slide04', '#slide05'];

  // get all headers in slides that trigger animation
  var headers = ['#slide01 header', '#slide02 header', '#slide03 header', '#slide04 header', '#slide05 header'];


  // Enable ScrollMagic only for desktop, disable on touch and mobile devices
  if (!Modernizr.touch) {


    /*Create scenes for each of the headers
    ----------------------------------*/
    headers.forEach(function (header, index) {

      // number for highlighting scenes
      var num = index + 1;

      // make scene
      var headerScene = new ScrollMagic.Scene({
          triggerElement: header, // trigger CSS animation when header is in the middle of the viewport
          offset: -195 // offset triggers the animation 95 earlier then middle of the viewport, adjust to your liking
        })
        .setClassToggle('#slide0' + num, 'is-active') // set class to active slide
        .addTo(controller);
    });

    var BREAKPOINT = 1024;
    if (jQuery(window).width() > BREAKPOINT) {

      // Main Block Heading Reveal Left
      var mainHeadingRevLeft = new ScrollMagic.Scene({
        triggerElement: '#intro',
        offset: 0,
        duration: 0
      }).on("enter", function () {
        TweenMax.to(['.block-one'], 1.5, {
          left: '5%',
          scaleX: 10,
          autoAlpha: 1,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-one'], 1.5, {
          left: '100%',
          delay: 0.2,
          scaleX: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);


      // Main Heading Reveal Left
      var mainHeading = new ScrollMagic.Scene({
        triggerElement: '#intro',
        offset: 0,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.main-heading'], .5, {
          delay: 0.2,
          autoAlpha: 0,
          x: 400
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);

      // Block Sub Heading Reveal Right
      var subHeadingRevRight = new ScrollMagic.Scene({
        triggerElement: '#intro',
        offset: 0,
        duration: 0
      }).on("enter", function () {
        TweenMax.to(['.block-two'], 1, {
          right: '5%',
          scaleX: 4,
          autoAlpha: 1,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-two'], 1, {
          right: '100%',
          delay: 0.2,
          scaleX: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);

      // Sub Heading Reveal Right
      var subHeadingRev = new ScrollMagic.Scene({
        triggerElement: '#intro',
        offset: 0,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.big-strapline'], .5, {
          delay: 0.4,
          autoAlpha: 0,
          x: -500
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);

      // Line Animation Just after the main header
      var lineVertOne = new ScrollMagic.Scene({
        triggerElement: '.intro-part2',
        offset: 0,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.lineVert1'], 0.5, {
          scaleY: 1
        }, {
          y: 0,
          scaleY: 3,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.lineVert1'], 0.5, {
          scaleY: 3
        }, {
          y: 0,
          scaleY: 1,
          ease: Power1.easeOut
        })
      }).addTo(controller);

      // Scroll Down Button
      var scrollDownBtn = new ScrollMagic.Scene({
        triggerElement: '.intro-part2',
        offset: -600,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.scroll-down-button'], 0.5, {
          autoAlpha: 0
        }, {
          autoAlpha: 1,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.scroll-down-button'], 0.5, {
          autoAlpha: 1
        }, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);

      // intro text
      var textHozOne = new ScrollMagic.Scene({
        triggerElement: '.intro-part2',
        offset: 0,
        duration: 0
      }).on("enter", function () {
        TweenMax.to(['.anime-text'], 2.5, {
          x: -10,
          autoAlpha: 1,
          ease: Elastic.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['.anime-text'], 0.5, {
          x: -500,
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);




      //PORTFOLIO SECTION

      // Portfolio Block Heading Reveal Left
      var portHeadingRevLeft = new ScrollMagic.Scene({
        triggerElement: '#slide01',
        offset: 70,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.block-three'], 2, {
          left: '-5%',
          scaleX: 100,
          autoAlpha: 1
        }, {
          left: '91.8%',
          scaleX: 1,
          autoAlpha: 1,
          ease: Power4.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.block-three'], 2, {
          left: '100%',
          scaleX: 100,
          autoAlpha: 1
        }, {
          left: '-5%',
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);



      // The Portfolio it's self
      var portRevRight = new ScrollMagic.Scene({
        triggerElement: '#slide01',
        offset: 90,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['#slide01 .sm-h2'], 1.5, {
          delay: 0.2,
          autoAlpha: 0,
          xPercent: 300
        }, {
          autoAlpha: 1,
          xPercent: 0,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['#slide01 .sm-h2'], 0.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })

      }).on("enter", function () {
        TweenMax.staggerFromTo(".project-item", 1, {
          yPercent: 50,
          autoAlpha: 0,
          scale: .6
        }, {
          yPercent: 0,
          autoAlpha: 1,
          scale: 1,
          ease: Cubic.easeOut
        }, 0.4)
      }).on("leave", function () {
        TweenMax.staggerFromTo(".project-item", 1, {
          yPercent: 0,
          autoAlpha: 1,
          scale: 1
        }, {
          yPercent: 50,
          autoAlpha: 0,
          scale: .6,
          ease: Cubic.easeOut
        }, 0.4)

      }).on("enter", function () {
        TweenMax.staggerFromTo(['.project-title, .project-subtitle, .project-tech'], 3.5, {
          autoAlpha: 0,
        }, {
          autoAlpha: 1,
          delay: 2.6,
          ease: Power3.easeOut
        }, 0.4)
      }).on("leave", function () {
        TweenMax.to(['.project-title, .project-subtitle, .project-tech'], 0.5, {
          autoAlpha: 0,
          ease: Power3.easeOut
        })

      }).addTo(controller);



      // ABOUT SECTION

      // About Block Heading Reveal Left
      var aboutBlockRevLeft = new ScrollMagic.Scene({
        triggerElement: '#slide02',
        offset: 60,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.block-four'], 2, {
          left: '-5%',
          scaleX: 0,
          autoAlpha: 1
        }, {
          left: '100%',
          scaleX: 3,
          autoAlpha: 1,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-four'], 1, {
          delay: 0.4,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.block-four'], 2, {
          left: '100%',
          scaleX: 5,
          autoAlpha: 1
        }, {
          left: '-5%',
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-four'], 1, {
          delay: 0.4,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);


      // About Block Heading Reveal Right
      var aboutBlockRevRight = new ScrollMagic.Scene({
        triggerElement: '#slide02',
        offset: 100,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.block-five'], 2, {
          right: '-5%',
          scaleX: 0,
          autoAlpha: 1
        }, {
          right: '100%',
          scaleX: 3,
          autoAlpha: 1,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-five'], 1, {
          delay: 0.4,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.block-five'], 2, {
          right: '100%',
          scaleX: 5,
          autoAlpha: 1
        }, {
          right: '-5%',
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-five'], 1, {
          delay: 0.4,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);


      // About H1 Heading Reveal Left
      var subAboutHeading = new ScrollMagic.Scene({
        triggerElement: '#slide02',
        offset: 100,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['#slide02 h2'], 1.5, {
          delay: 0.2,
          autoAlpha: 0,
          x: 300
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        });
        TweenMax.fromTo(['#slide02 h3'], 1.5, {
          delay: 0.3,
          autoAlpha: 0,
          x: -400
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['#slide02 h2', '#slide02 h3'], 0.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);


      // About Sub Heading Reveal Right
      var aboutLineTwo = new ScrollMagic.Scene({
        triggerElement: '#slide02',
        offset: -93,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.about-lineTwo'], 1.5, {
          scaleY: 1,
          autoAlpha: 1
        }, {
          autoAlpha: 1,
          y: 100,
          scaleY: 3,
          ease: Bounce.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['.about-lineTwo'], 1.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);


      // About Content Fade In
      var subAboutFadeIn = new ScrollMagic.Scene({
        triggerElement: '#slide02',
        offset: 60,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['#slide02 .fade-in'], 1.5, {
          y: 300,
          autoAlpha: 0
        }, {
          autoAlpha: 1,
          y: 0,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['#slide02 .fade-in'], 0.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);




      // SERVICES

      // Services Block Heading Reveal Left
      var servHeadingRevLeft = new ScrollMagic.Scene({
        triggerElement: '#slide03',
        offset: -90,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.block-six'], 1, {
          left: '-5%',
          scaleX: 100,
          autoAlpha: 1
        }, {
          left: '91.8%',
          scaleX: 1,
          autoAlpha: 1,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.block-six'], 1.5, {
          left: '100%',
          scaleX: 100,
          autoAlpha: 1
        }, {
          left: '-5%',
          scaleX: 0,
          autoAlpha: 0,
          ease: Power3.easeOut
        })
      }).addTo(controller);


      // Services H2 Heading Reveal Left
      var servtHeading = new ScrollMagic.Scene({
        triggerElement: '#slide03',
        offset: -90,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['#slide03 h2'], 1.5, {
          delay: 0.2,
          autoAlpha: 0,
          x: -300
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        });
        TweenMax.fromTo(['#slide03 h3'], 1.5, {
          delay: 0.3,
          autoAlpha: 0,
          x: 400
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['#slide03 h2', '#slide03 h3'], 0.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);


      // Services Content Fade In
      var subAboutFadeIn = new ScrollMagic.Scene({
          triggerElement: '#slide03',
          offset: 60,
          duration: 0
        })
        .on("enter", function () {
          TweenMax.fromTo(['#slide03 .fade-in'], 1.5, {
            y: 300,
            autoAlpha: 0
          }, {
            autoAlpha: 1,
            y: 0,
            ease: Power1.easeOut
          })
        })
        .on("leave", function () {
          TweenMax.to(['#slide03 .fade-in'], 0.5, {
            autoAlpha: 0,
            ease: Power1.easeOut
          })
        })
        .addTo(controller);







      // NEWS SECTION

      // Blog Block Heading Reveal Left
      var blogBlockRevLeft = new ScrollMagic.Scene({
        triggerElement: '#slide04',
        offset: 120,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.block-seven'], 2, {
          left: '-5%',
          scaleX: 0,
          autoAlpha: 1
        }, {
          left: '100%',
          scaleX: 3,
          autoAlpha: 1,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-seven'], 1, {
          delay: 0.4,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.block-seven'], 2, {
          left: '100%',
          scaleX: 5,
          autoAlpha: 1
        }, {
          left: '-5%',
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-seven'], 1, {
          delay: 0.4,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);


      // Blog H2 Heading Reveal Left
      var blogHeading = new ScrollMagic.Scene({
        triggerElement: '#slide04',
        offset: 120,
        duration: 0
      }).on("enter", function () {
        TweenMax.to(['#slide04 h2'], 1.5, {
          delay: 0.2,
          autoAlpha: 1,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['#slide04 h2'], 0.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);


      // Blog Block Slider Reveal Right
      var blogBlockRevRight = new ScrollMagic.Scene({
        triggerElement: '#slide04',
        offset: 128,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.block-eight'], 2, {
          right: '-5%',
          scaleX: 0,
          autoAlpha: 1
        }, {
          right: '100%',
          scaleX: 3,
          autoAlpha: 1,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-eight'], 1, {
          delay: 0.2,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.block-eight'], 2, {
          right: '100%',
          scaleX: 5,
          autoAlpha: 1
        }, {
          right: '-5%',
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        });
        TweenMax.to(['.block-eight'], 1, {
          delay: 0.2,
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);


      // Blog Reveal Left
      var blogSliderHeading = new ScrollMagic.Scene({
        triggerElement: '#slide04',
        offset: 128,
        duration: 0
      }).on("enter", function () {
        TweenMax.to(['#slide04 .blog-slider'], 1.5, {
          delay: 0.2,
          autoAlpha: 1,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['#slide04 .blog-slider'], 0.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);




      //CONTACT SECTION

      // Contact Block Heading Reveal Left
      var contactHeadingRevLeft = new ScrollMagic.Scene({
        triggerElement: '#slide05',
        offset: -94,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['.block-nine'], 2, {
          left: '-5%',
          scaleX: 100,
          autoAlpha: 1
        }, {
          left: '91.8%',
          scaleX: 1,
          autoAlpha: 1,
          ease: Power4.easeOut
        })
      }).on("leave", function () {
        TweenMax.fromTo(['.block-nine'], 2, {
          left: '100%',
          scaleX: 100,
          autoAlpha: 1
        }, {
          left: '-5%',
          scaleX: 0,
          autoAlpha: 0,
          ease: Power4.easeOut
        })
      }).addTo(controller);


      // Contact H2 Heading Reveal Left
      var contactHeading = new ScrollMagic.Scene({
        triggerElement: '#slide05',
        offset: -94,
        duration: 0
      }).on("enter", function () {
        TweenMax.fromTo(['#slide05 h2'], 1.5, {
          delay: 0.2,
          autoAlpha: 0,
          x: -300
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        });
        TweenMax.fromTo(['#slide05 h3'], 1.5, {
          delay: 0.3,
          autoAlpha: 0,
          x: 400
        }, {
          autoAlpha: 1,
          x: 0,
          ease: Power1.easeOut
        })
      }).on("leave", function () {
        TweenMax.to(['#slide05 h2', '#slide05 h3'], 0.5, {
          autoAlpha: 0,
          ease: Power1.easeOut
        })
      }).addTo(controller);





      // Contact Fadein Content
      var subAboutFadeIn = new ScrollMagic.Scene({
          triggerElement: '#slide05',
          offset: 60,
          duration: 0
        })
        // contact-details
        .on("enter", function () {
          TweenMax.fromTo(['.contact-details'], 1.5, {
            y: -300,
            autoAlpha: 0
          }, {
            autoAlpha: 1,
            y: 0,
            ease: Power1.easeOut
          })
        })
        .on("leave", function () {
          TweenMax.to(['.contact-details'], 0.5, {
            autoAlpha: 0,
            ease: Power1.easeOut
          })
        })
        // contactform
        .on("enter", function () {
          TweenMax.fromTo(['.contactform'], 1.5, {
            y: 300,
            autoAlpha: 0
          }, {
            autoAlpha: 1,
            y: 0,
            ease: Power1.easeOut
          })
        })
        .on("leave", function () {
          TweenMax.to(['.contactform'], 0.5, {
            autoAlpha: 0,
            ease: Power1.easeOut
          })
        })
        .addTo(controller)





      /* Servcices - icon fills
      ----------------------------------*/
      var subAboutFadeIn = new ScrollMagic.Scene({
          triggerElement: '#slide03',
          offset: 60,
          duration: 0
        })
        .on("enter", function () {

          TweenMax.staggerFromTo(".animate-in", 1.5, {
            drawSVG: "0%"
          }, {
            cycle: {
              drawSVG: ["100%", "100%"] //alternate these values
            },
            ease: Power2.easeIn
          }, 0.4)

        })
        .addTo(controller);







      var controller = new ScrollMagic.Controller();

      $(".row").each(function () {
        var tween = new TimelineMax();
        var imgF = $(this).find(".media-component__imageFade");
        var imgR = $(this).find(".media-component__imageRight");
        var imgL = $(this).find(".media-component__imageLeft");
        var colL = $(this).find(".media-component__colorLeft");
        var colR = $(this).find(".media-component__colorRight");
        var colT = $(this).find(".media-component__colorTop");
        var comL = $(this).find(".media-component__left");
        var comR = $(this).find(".media-component__right");
        var comT = $(this).find(".media-component__top");
        var shad = $(this).find(".media-component__shadow");

        tween
          .fromTo(imgR, 1.5, {
            xPercent: 100,
            force3D: true
          }, {
            autoAlpha: 1,
            xPercent: 0,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(imgL, 1.5, {
            xPercent: -117,
            force3D: true
          }, {
            autoAlpha: 1,
            xPercent: 0,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(imgF, 1.5, {
            autoAlpha: 0,
            force3D: true
          }, {
            autoAlpha: 1,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(colR, 1.5, {
            autoAlpha: 1,
            xPercent: 100,
            force3D: true
          }, {
            autoAlpha: 0,
            xPercent: 16.7,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(colL, 1.5, {
            autoAlpha: 1,
            xPercent: -117,
            force3D: true
          }, {
            autoAlpha: 0,
            xPercent: -16.7,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(colT, 1.5, {
            autoAlpha: 1,
            scaleY: 0,
            yPercent: 100,
            force3D: true
          }, {
            scaleY: 1,
            autoAlpha: 0,
            yPercent: 0,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(comL, 1.5, {
            xPercent: -117,
            force3D: true
          }, {
            xPercent: 0,
            autoAlpha: 1,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(comR, 1.5, {
            xPercent: 100,
            force3D: true
          }, {
            xPercent: 0,
            autoAlpha: 1,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(comT, 1.5, {
            yPercent: 100,
            force3D: true
          }, {
            yPercent: 0,
            autoAlpha: 1,
            z: 0.1,
            rotationZ: 0.01,
            ease: Power3.easeOut,
            force3D: true
          }, "Harry")
          .fromTo(shad, 1.5, {
            boxShadow: "0px 0px 78px -17px rgba(0,0,0,0.95)",
            force3D: true
          }, {
            delay: 0.5,
            autoAlpha: 1,
            boxShadow: "0px 0px 78px -17px rgba(0,0,0,0.95)",
            ease: Power3.easeOut,
            force3D: true
          }, "Harry");
        var scene = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.7
          })
          .setTween(tween)
          .reverse(false)
          // .addIndicators()
          .addTo(controller);
      });




    } // end BREAKPOINT = 1024

  } // end Modernizr






  /*Main Menu Navigation
  ----------------------------------*/
  var BREAKPOINT = 1170;

  if (jQuery(window).width() > BREAKPOINT) {
    var headerHeight = jQuery('.header').height();
    jQuery(window).on('scroll', {
      previousTop: 0
    }, function () {
      var currentTop = jQuery(window).scrollTop();
      if (currentTop < this.previousTop) {
        if (currentTop > 0 && jQuery('.header').hasClass('is-fixed')) {
          jQuery('.header').addClass('is-visible')
        } else {
          jQuery('.header').removeClass('is-visible is-fixed')
        }
      } else {
        jQuery('.header').removeClass('is-visible');
        if (currentTop > headerHeight && !jQuery('.header').hasClass('is-fixed')) jQuery('.header').addClass('is-fixed')
      }
      this.previousTop = currentTop
    })
  } // end BREAKPOINT = 1170



  jQuery('.primary-nav-trigger').on('click', function () {
    jQuery('.menu-icon').toggleClass('is-clicked');
    jQuery('.header').toggleClass('menu-is-open');
    if (jQuery('.primary-nav').hasClass('is-visible')) {
      jQuery('.primary-nav').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        jQuery('body').removeClass('overflow-hidden')
      })
    } else {
      jQuery('.primary-nav').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        jQuery('body').addClass('overflow-hidden')
      })
    }
    // remove menu link on click
    jQuery('.primary-nav li a').click(function () {
      jQuery('.primary-nav-trigger').click()
    })
  });





  jQuery('.portfolio-slider').flickity({
    cellAlign: 'center',
    freeScroll: !0,
    wrapAround: !0,
    contain: !0
  });
  jQuery('.blog-slider').flickity({
    cellAlign: 'left',
    contain: !0,
    freeScroll: !0,
    wrapAround: !0,
  });



  /* Scroll Top
  --------------------------------------------- */
  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() > 5000) {
      jQuery('.scrollToTop').fadeIn()
    } else {
      jQuery('.scrollToTop').fadeOut()
    }
  });




  // Get this to only load on pages and posts!
  // Get in Touch PopUp - on Posts - on Pages
  if ($('body').is('.page')) {
    $(function () {
      $('.site-footer').footerReveal()
    })
  }
});

