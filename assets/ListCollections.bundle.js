(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{67:function(t,e,n){var r,i,o;
/**!
 * trunk8 v1.3.3
 * https://github.com/rviscomi/trunk8
 * 
 * Copyright 2012 Rick Viscomi
 * Released under the MIT License.
 * 
 * Date: September 26, 2012
 */i=[n(0)],void 0===(o="function"==typeof(r=function(t){var e,n,r="center",i="left",o="right",a="auto";function c(e){this.$element=t(e),this.original_text=t.trim(this.$element.html()),this.settings=t.extend({},t.fn.trunk8.defaults)}function u(t){var e=document.createElement("DIV");return e.innerHTML=t,void 0!==e.textContent?e.textContent:e.innerText}function s(e,n,r){e=e.replace(r,"");var i=function(n,o){var a,c,u,s,l="";for(s=0;s<n.length;s++)a=n[s],u=t.trim(e).split(" ").length,t.trim(e).length&&("string"==typeof a?(/<br\s*\/?>/i.test(a)||(1===u&&t.trim(e).length<=a.length?(a=e,"p"!==o&&"div"!==o||(a+=r),e=""):e=e.replace(a,"")),l+=t.trim(a)+(s===n.length-1||u<=1?"":" ")):(c=i(a.content,a.tag),a.after&&(e=e.replace(a.after,"")),c&&(a.after||(a.after=" "),l+="<"+a.tag+a.attribs+">"+c+"</"+a.tag+">"+a.after)));return l},o=i(n);return o.slice(o.length-r.length)===r&&(o+=r),o}function l(){var e,r,i,o,c,l,f=this.data("trunk8"),h=f.settings,p=h.width,g=h.side,d=h.fill,y=h.parseHTML,v=n.getLineHeight(this)*h.lines,b=f.original_text,m=b.length,w="";if(this.html(b),c=this.text(),y&&u(b)!==b&&(l=function t(e){if(u(e)===e)return e.split(/\s/g);for(var n,r,i=[],o=/<([a-z]+)([^<]*)(?:>(.*?(?!<\1>))<\/\1>|\s+\/>)(['.?!,]*)|((?:[^<>\s])+['.?!,]*\w?|<br\s?\/?>)/gi,a=o.exec(e);a&&n!==o.lastIndex;)n=o.lastIndex,a[5]?i.push(a[5]):a[1]&&i.push({tag:a[1],attribs:a[2],content:a[3],after:a[4]}),a=o.exec(e);for(r=0;r<i.length;r++)"string"!=typeof i[r]&&i[r].content&&(i[r].content=t(i[r].content));return i}(b),m=(b=u(b)).length),p===a){if(this.height()<=v)return;for(e=0,r=m-1;e<=r;)i=e+(r-e>>1),o=n.eatStr(b,g,m-i,d),y&&l&&(o=s(o,l,d)),this.html(o),this.height()>v?r=i-1:(e=i+1,w=w.length>o.length?w:o);this.html(""),this.html(w),h.tooltip&&this.attr("title",c)}else{if(isNaN(p))return void t.error('Invalid width "'+p+'".');i=m-p,o=n.eatStr(b,g,i,d),this.html(o),h.tooltip&&this.attr("title",b)}h.onTruncate()}c.prototype.updateSettings=function(e){this.settings=t.extend(this.settings,e)},e={init:function(e){return this.each((function(){var n=t(this),r=n.data("trunk8");r||n.data("trunk8",r=new c(this)),r.updateSettings(e),l.call(n)}))},update:function(e){return this.each((function(){var n=t(this);e&&(n.data("trunk8").original_text=e),l.call(n)}))},revert:function(){return this.each((function(){var e=t(this).data("trunk8").original_text;t(this).html(e)}))},getSettings:function(){return t(this.get(0)).data("trunk8").settings}},(n={eatStr:function(e,a,c,u){var s,l,f=e.length,h=n.eatStr.generateKey.apply(null,arguments);if(n.eatStr.cache[h])return n.eatStr.cache[h];if("string"==typeof e&&0!==f||t.error('Invalid source string "'+e+'".'),c<0||c>f)t.error('Invalid bite size "'+c+'".');else if(0===c)return e;switch(a){case o:return n.eatStr.cache[h]=t.trim(e.substr(0,f-c))+u;case i:return n.eatStr.cache[h]=u+t.trim(e.substr(c));case r:return s=f>>1,l=c>>1,n.eatStr.cache[h]=t.trim(n.eatStr(e.substr(0,f-s),o,c-l,""))+u+t.trim(n.eatStr(e.substr(f-s),i,l,""));default:t.error('Invalid side "'+a+'".')}},getLineHeight:function(e){var n=t(e).css("float");"none"!==n&&t(e).css("float","none");var r=t(e).css("position");"absolute"===r&&t(e).css("position","static");var i,o=t(e).html();return t(e).html("i").wrap('<div id="line-height-test" />'),i=t("#line-height-test").innerHeight(),t(e).html(o).css({float:n,position:r}).unwrap(),i}}).eatStr.cache={},n.eatStr.generateKey=function(){return Array.prototype.join.call(arguments,"")},t.fn.trunk8=function(n){return e[n]?e[n].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof n&&n?void t.error("Method "+n+" does not exist on jQuery.trunk8"):e.init.apply(this,arguments)},t.fn.trunk8.defaults={fill:"&hellip;",lines:1,side:o,tooltip:!0,width:a,parseHTML:!1,onTruncate:function(){}}})?r.apply(e,i):r)||(t.exports=o)},94:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return p}));var r=n(0),i=n.n(r),o=(n(67),n(3)),a=n(4);function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function u(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=h(t);if(e){var i=h(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return f(this,n)}}function f(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var p=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(c,t);var e,n,r,o=l(c);function c(t){var e;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,c),e=o.call(this,t);var n=i()(".js-collection-grid");return e.$window.on("load",(function(){e.truncateBlockText(n)})).on("resize",a.a.throttle((function(){e.truncateBlockText(n)}),50)),e.$document.on("ajaxify:updated",(function(){e.truncateBlockText(n)})),e}return e=c,(n=[{key:"truncateBlockText",value:function(t){t.find(".collectionBlock-info h4").trunk8({lines:3}),t.find(".collectionBlock-info h2").trunk8({lines:2}),t.find(".collectionBlock").removeClass("is-loading")}}])&&u(e.prototype,n),r&&u(e,r),c}(o.a)}}]);