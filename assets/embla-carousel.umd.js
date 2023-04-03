/*embla-carousel@6.2.0*/
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(n="undefined"!=typeof globalThis?globalThis:n||self).EmblaCarousel=e()}(this,(function(){"use strict";function n(n,e){var t={start:function(){return 0},center:function(n){return r(n)/2},end:r};function r(n){return e-n}return{measure:function(r){return"number"==typeof n?e*Number(n):t[n](r)}}}function e(n){return Math.abs(n)}function t(n){return n?n/e(n):0}function r(n,t){return e(n-t)}function o(n,e){for(var t=[],r=0;r<n.length;r+=e)t.push(n.slice(r,r+e));return t}function i(n){return Object.keys(n).map(Number)}function u(n){return n[c(n)]}function c(n){return Math.max(0,n.length-1)}function a(n,t){var r=e(n-t);function o(e){return e<n}function i(n){return n>t}function u(n){return o(n)||i(n)}return{length:r,max:t,min:n,constrain:function(e){return u(e)?o(e)?n:t:e},reachedAny:u,reachedMax:i,reachedMin:o,removeOffset:function(n){return r?n-r*Math.ceil((n-t)/r):n}}}function s(n,t,r){var o=a(0,n),i=o.min,u=o.constrain,c=n+1,d=f(t);function f(n){return r?e((c+n)%c):u(n)}function l(){return d}function p(n){return d=f(n),m}var m={add:function(n){return p(l()+n)},clone:function(){return s(n,l(),r)},get:l,set:p,min:i,max:n};return m}function d(){var n=[];var e={add:function(t,r,o,i){return void 0===i&&(i=!1),t.addEventListener(r,o,i),n.push((function(){return t.removeEventListener(r,o,i)})),e},removeAll:function(){return n=n.filter((function(n){return n()})),e}};return e}function f(n){var e=n;function t(n){return e/=n,o}function r(n){return"number"==typeof n?n:n.get()}var o={add:function(n){return e+=r(n),o},divide:t,get:function(){return e},multiply:function(n){return e*=n,o},normalize:function(){return 0!==e&&t(e),o},set:function(n){return e=r(n),o},subtract:function(n){return e-=r(n),o}};return o}function l(n,o,i,u,c,a,s,l,p,m,v,g,x,h,y){var S=n.cross,b=["INPUT","SELECT","TEXTAREA"],w=f(0),E=d(),A=d(),T={mouse:300,touch:400},M={mouse:500,touch:600},P=c?5:16,O=0,B=0,I=!1,z=!1,D=!1,L=!1;function k(n){if(!(L="mousedown"===n.type)||0===n.button){var e,t,o=r(u.get(),s.get())>=2,c=L||!o,d=(e=n.target,t=e.nodeName||"",!(b.indexOf(t)>-1)),f=o||L&&d;I=!0,a.pointerDown(n),w.set(u),u.set(s),m.useBaseMass().useSpeed(80),function(){var n=L?document:i;A.add(n,"touchmove",N).add(n,"touchend",C).add(n,"mousemove",N).add(n,"mouseup",C)}(),O=a.readPoint(n),B=a.readPoint(n,S),x.emit("pointerDown"),c&&(D=!1),f&&n.preventDefault()}}function N(n){if(!z&&!L){if(!n.cancelable)return C(n);var e=a.readPoint(n),t=a.readPoint(n,S),i=r(e,O),c=r(t,B);if(!(z=i>c)&&!D)return C(n)}var s=a.pointerMove(n);!D&&s&&(D=!0),l.start(),u.add(o.apply(s)),n.preventDefault()}function C(n){var i=v.byDistance(0,!1).index!==g.get(),s=a.pointerUp(n)*(c?M:T)[L?"mouse":"touch"],d=function(n,r){var o=g.clone().add(-1*t(n)),i=o.get()===g.min||o.get()===g.max,u=v.byDistance(n,!c).distance;return c||e(n)<20?u:!h&&i?.4*u:y&&r?.5*u:v.byIndex(o.get(),0).distance}(o.apply(s),i),f=function(n,t){if(0===n||0===t)return 0;if(e(n)<=e(t))return 0;var o=r(e(n),e(t));return e(o/n)}(s,d),l=r(u.get(),w.get())>=.5,S=i&&f>.75,b=e(s)<20,E=S?10:P,O=S?1+2.5*f:1;l&&!L&&(D=!0),z=!1,I=!1,A.removeAll(),m.useSpeed(b?9:E).useMass(O),p.distance(d,!c),L=!1,x.emit("pointerUp")}function j(n){D&&n.preventDefault()}return{addActivationEvents:function(){var n=i;E.add(n,"touchmove",(function(){})).add(n,"touchend",(function(){})).add(n,"touchstart",k).add(n,"mousedown",k).add(n,"touchcancel",C).add(n,"contextmenu",C).add(n,"click",j)},clickAllowed:function(){return!D},pointerDown:function(){return I},removeAllEvents:function(){E.removeAll(),A.removeAll()}}}function p(n,e,r){var o,i,u=(o=2,i=Math.pow(10,o),function(n){return Math.round(n*i)/i}),c=f(0),a=f(0),s=f(0),d=0,l=e,p=r;function m(n){return l=n,g}function v(n){return p=n,g}var g={direction:function(){return d},seek:function(e){s.set(e).subtract(n);var r,o,i,u,f=(r=s.get(),(i=0)+(r-(o=0))/(100-o)*(l-i));return d=t(s.get()),s.normalize().multiply(f).subtract(c),(u=s).divide(p),a.add(u),g},settle:function(e){var t=e.get()-n.get(),r=!u(t);return r&&n.set(e),r},update:function(){c.add(a),n.add(c),a.multiply(0)},useBaseMass:function(){return v(r)},useBaseSpeed:function(){return m(e)},useMass:v,useSpeed:m};return g}function m(n,t,r,o){var i=!1;return{constrain:function(u){if(!i&&n.reachedAny(r.get())&&n.reachedAny(t.get())){var c=n.reachedMin(t.get())?"min":"max",a=e(n[c]-t.get()),s=r.get()-t.get(),d=Math.min(a/50,.85);r.subtract(s*d),!u&&e(s)<10&&(r.set(n.constrain(r.get())),o.useSpeed(10).useMass(3))}},toggleActive:function(n){i=!n}}}function v(n,e,t,r,o){var i=a(-e+n,t[0]),c=r.map(i.constrain);return{snapsContained:function(){if(e<=n)return[i.max];if("keepSnaps"===o)return c;var t=function(){var n=c[0],e=u(c),t=c.lastIndexOf(n),r=c.indexOf(e)+1;return a(t,r)}(),r=t.min,s=t.max;return c.slice(r,s)}()}}function g(n,e,t,r,o){var i=a(t.min+e.measure(.1),t.max+e.measure(.1)),u=i.reachedMin,c=i.reachedMax;return{loop:function(e){if(function(n){return 1===n?c(r.get()):-1===n&&u(r.get())}(e)){var t=n*(-1*e);o.forEach((function(n){return n.add(t)}))}}}}function x(n){var e=n.max,t=n.length;return{get:function(n){return(n-e)/-t}}}function h(n,t,r,i,c,a){var s,d,f=n.startEdge,l=n.endEdge,p=c.map((function(n){return i[f]-n[f]})).map(r.measure).map((function(n){return-e(n)})),m=(s=o(p,a).map((function(n){return n[0]})),d=o(c,a).map((function(n){return u(n)[l]-n[0][f]})).map(r.measure).map(e).map(t.measure),s.map((function(n,e){return n+d[e]})));return{snaps:p,snapsAligned:m}}function y(n,t,r,o,i){var u=o.reachedAny,c=o.removeOffset,a=o.constrain;function s(n,t){return e(n)<e(t)?n:t}function d(t,o){var i=t,u=t+r,c=t-r;return n?o?e(s(i,1===o?u:c))*o:s(s(i,u),c):i}return{byDistance:function(r,o){var s=i.get()+r,f=function(r){var o=n?c(r):a(r);return{index:t.map((function(n){return n-o})).map((function(n){return d(n,0)})).map((function(n,e){return{diff:n,index:e}})).sort((function(n,t){return e(n.diff)-e(t.diff)}))[0].index,distance:o}}(s),l=f.index,p=f.distance,m=!n&&u(s);return!o||m?{index:l,distance:r}:{index:l,distance:r+d(t[l]-p,0)}},byIndex:function(n,e){return{index:n,distance:d(t[n]-i.get(),e)}},shortcut:d}}function S(n,e,t,r,o,u,c,a){var s,d=i(r),f=i(r).reverse(),l=(s=o[0]-1,v(m(f,s),"end")).concat(function(){var n=e-o[0]-1;return v(m(d,n),"start")}());function p(n,e){return n.reduce((function(n,e){return n-r[e]}),e)}function m(n,e){return n.reduce((function(n,t){return p(n,e)>0?n.concat([t]):n}),[])}function v(n,e){var r="start"===e,o=r?-t:t,i=u.findSlideBounds([o]);return n.map((function(n){var e=r?0:-t,o=r?t:0,u=i.filter((function(e){return e.index===n}))[0][r?"end":"start"];return{point:u,getTarget:function(){return c.get()>u?e:o},index:n,location:-1}}))}return{canLoop:function(){return l.every((function(n){var t=n.index;return p(d.filter((function(n){return n!==t})),e)<=0}))},clear:function(){l.forEach((function(e){var t=e.index;a[t].style[n.startEdge]=""}))},loop:function(){l.forEach((function(e){var t=e.getTarget,r=e.location,o=e.index,i=t();i!==r&&(a[o].style[n.startEdge]=i+"%",e.location=i)}))},loopPoints:l}}function b(n,e,t){var r="x"===n.scroll?function(n){return"translate3d("+n+"%,0px,0px)"}:function(n){return"translate3d(0px,"+n+"%,0px)"},o=t.style,i=!1;return{clear:function(){o.transform=""},to:function(n){i||(o.transform=r(e.apply(n.get())))},toggleActive:function(n){i=!n}}}function w(t,r,o,w,E){var A,T=w.align,M=w.axis,P=w.direction,O=w.startIndex,B=w.inViewThreshold,I=w.loop,z=w.speed,D=w.dragFree,L=w.slidesToScroll,k=w.skipSnaps,N=w.containScroll,C=r.getBoundingClientRect(),j=o.map((function(n){return n.getBoundingClientRect()})),R=function(n){var e="rtl"===n?-1:1;return{apply:function(n){return n*e}}}(P),V=function(n,e){var t="y"===n?"y":"x";return{scroll:t,cross:"y"===n?"x":"y",startEdge:"y"===t?"top":"rtl"===e?"right":"left",endEdge:"y"===t?"bottom":"rtl"===e?"left":"right",measureSize:function(n){var e=n.width,r=n.height;return"x"===t?e:r}}}(M,P),H=(A=V.measureSize(C),{measure:function(n){return 0===A?0:n/A*100},totalPercent:100}),F=H.totalPercent,U=n(T,F),G=function(n,t,r,o,i){var a=n.measureSize,s=n.startEdge,d=n.endEdge,f=o.map(a);return{slideSizes:f.map(t.measure),slideSizesWithGaps:o.map((function(n,e,t){var o=e===c(t),a=window.getComputedStyle(u(r)),l=parseFloat(a.getPropertyValue("margin-"+d));return o?f[e]+(i?l:0):t[e+1][s]-n[s]})).map(t.measure).map(e)}}(V,H,o,j,I),W=G.slideSizes,X=G.slideSizesWithGaps,q=h(V,U,H,C,j,L),J=q.snaps,Y=q.snapsAligned,K=-u(J)+u(X),Q=v(F,K,J,Y,N).snapsContained,Z=!I&&""!==N?Q:Y,$=function(n,e,t){var r,o;return{limit:(r=e[0],o=u(e),a(t?r-n:o,r))}}(K,Z,I).limit,_=s(c(Z),O,I),nn=_.clone(),en=i(o),tn=function(n){var e=0;function t(n,t){return function(){n===!!e&&t()}}function r(){e=window.requestAnimationFrame(n)}return{proceed:t(!0,r),start:t(!1,r),stop:t(!0,(function(){window.cancelAnimationFrame(e),e=0}))}}((function(){I||fn.scrollBounds.constrain(fn.dragHandler.pointerDown()),fn.scrollBody.seek(un).update();var n=fn.scrollBody.settle(un);n&&!fn.dragHandler.pointerDown()&&(fn.animation.stop(),E.emit("settle")),n||E.emit("scroll"),I&&(fn.scrollLooper.loop(fn.scrollBody.direction()),fn.slideLooper.loop()),fn.translate.to(on),fn.animation.proceed()})),rn=Z[_.get()],on=f(rn),un=f(rn),cn=p(on,z,1),an=y(I,Z,K,$,un),sn=function(n,e,t,r,o,i){function u(r){var u=r.distance,c=r.index!==e.get();u&&(n.start(),o.add(u)),c&&(t.set(e.get()),e.set(r.index),i.emit("select"))}return{distance:function(n,e){u(r.byDistance(n,e))},index:function(n,t){var o=e.clone().set(n);u(r.byIndex(o.get(),t))}}}(tn,_,nn,an,un,E),dn=function(n,e,t,r,o,i,u){var c=o.removeOffset,a=o.constrain,s=Math.min(Math.max(u,.01),.99),d=i?[0,e,-e]:[0],f=l(d,s);function l(e,o){var i=e||d,u=o||0,c=t.map((function(n){return n*u}));return i.reduce((function(e,o){var i=r.map((function(e,r){return{start:e-t[r]+c[r]+o,end:e+n-c[r]+o,index:r}}));return e.concat(i)}),[])}return{check:function(n,e){var t=i?c(n):a(n);return(e||f).reduce((function(n,e){var r=e.index,o=e.start,i=e.end;return-1===n.indexOf(r)&&o<t&&i>t?n.concat([r]):n}),[])},findSlideBounds:l}}(F,K,W,J,$,I,B),fn={containerRect:C,slideRects:j,animation:tn,axis:V,direction:R,dragHandler:l(V,R,t,un,D,function(n,t){var r,o;function i(n){return"undefined"!=typeof TouchEvent&&n instanceof TouchEvent}function u(n){return n.timeStamp}function c(e,t){var r="client"+("x"===(t||n.scroll)?"X":"Y");return(i(e)?e.touches[0]:e)[r]}return{isTouchEvent:i,pointerDown:function(n){return r=n,o=n,t.measure(c(n))},pointerMove:function(n){var e=c(n)-c(o),i=u(n)-u(r)>170;return o=n,i&&(r=n),t.measure(e)},pointerUp:function(n){if(!r||!o)return 0;var i=c(o)-c(r),a=u(n)-u(r),s=u(n)-u(o)>170,d=i/a;return a&&!s&&e(d)>.1?t.measure(d):0},readPoint:c}}(V,H),on,tn,sn,cn,an,_,E,I,k),eventStore:d(),pxToPercent:H,index:_,indexPrevious:nn,limit:$,location:on,options:w,scrollBody:cn,scrollBounds:m($,on,un,cn),scrollLooper:g(K,H,$,on,[on,un]),scrollProgress:x($),scrollSnaps:Z,scrollTarget:an,scrollTo:sn,slideLooper:S(V,F,K,X,Z,dn,on,o),slidesInView:dn,slideIndexes:en,target:un,translate:b(V,R,r)};return fn}var E={align:"center",axis:"x",containScroll:"",direction:"ltr",dragFree:!1,draggable:!0,inViewThreshold:0,loop:!1,skipSnaps:!1,slidesToScroll:1,speed:10,startIndex:0};function A(n,e,t){var r,o,i,u,c,a,s,d,f,l=function(){var n={};function e(e){return n[e]||[]}var t={emit:function(n){return e(n).forEach((function(e){return e(n)})),t},off:function(r,o){return n[r]=e(r).filter((function(n){return n!==o})),t},on:function(r,o){return n[r]=e(r).concat([o]),t}};return t}(),p=(r=function(){if(x){var n=u.axis.measureSize(s.getBoundingClientRect());S!==n&&M(),l.emit("resize")}},o=500,i=0,function(){window.clearTimeout(i),i=window.setTimeout(r,o)||0}),m=M,v=l.on,g=l.off,x=!1,h=Object.assign({},E,A.globalOptions),y=Object.assign({},h),S=0;function b(){var e,t="container"in n&&n.container,r="slides"in n&&n.slides;s="root"in n?n.root:n,d=t||s.children[0],f=r||[].slice.call(d.children),e=getComputedStyle(s,":before").content,c={get:function(){try{return JSON.parse(e.slice(1,-1).replace(/\\/g,""))}catch(n){}return{}}}}function T(n,e){if(b(),h=Object.assign({},h,n),y=Object.assign({},h,c.get()),a=Object.assign([],e),(u=w(s,d,f,y,l)).eventStore.add(window,"resize",p),u.translate.to(u.location),S=u.axis.measureSize(s.getBoundingClientRect()),a.forEach((function(n){return n.init(z)})),y.loop){if(!u.slideLooper.canLoop())return P(),T({loop:!1},e);u.slideLooper.loop()}y.draggable&&d.offsetParent&&f.length&&u.dragHandler.addActivationEvents(),x||(setTimeout((function(){return l.emit("init")}),0),x=!0)}function M(n,e){if(x){var t=I(),r=Object.assign({startIndex:t},n);P(),T(r,e||a),l.emit("reInit")}}function P(){u.dragHandler.removeAllEvents(),u.animation.stop(),u.eventStore.removeAll(),u.translate.clear(),u.slideLooper.clear(),a.forEach((function(n){return n.destroy()}))}function O(n){var e=u[n?"target":"location"].get(),t=y.loop?"removeOffset":"constrain";return u.slidesInView.check(u.limit[t](e))}function B(n,e,t){u.scrollBody.useBaseMass().useSpeed(e?100:y.speed),x&&u.scrollTo.index(n,t||0)}function I(){return u.index.get()}var z={canScrollNext:function(){return u.index.clone().add(1).get()!==I()},canScrollPrev:function(){return u.index.clone().add(-1).get()!==I()},clickAllowed:function(){return u.dragHandler.clickAllowed()},containerNode:function(){return d},internalEngine:function(){return u},destroy:function(){x&&(P(),x=!1,l.emit("destroy"))},off:g,on:v,previousScrollSnap:function(){return u.indexPrevious.get()},reInit:m,rootNode:function(){return s},scrollNext:function(n){B(u.index.clone().add(1).get(),!0===n,-1)},scrollPrev:function(n){B(u.index.clone().add(-1).get(),!0===n,1)},scrollProgress:function(){return u.scrollProgress.get(u.location.get())},scrollSnapList:function(){return u.scrollSnaps.map(u.scrollProgress.get)},scrollTo:B,selectedScrollSnap:I,slideNodes:function(){return f},slidesInView:O,slidesNotInView:function(n){var e=O(n);return u.slideIndexes.filter((function(n){return-1===e.indexOf(n)}))}};return T(e,t),z}return A.globalOptions=void 0,A}));
/*embla-carousel-auto-height@6.2.0*/
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e="undefined"!=typeof globalThis?globalThis:e||self).EmblaCarouselAutoHeight=n()}(this,(function(){"use strict";var e={destroyHeight:"auto"};function n(t){var i,o=Object.assign({},e,n.globalOptions,t),r=o.destroyHeight,s=["select","pointerUp"],u=[],f=[];function a(e){var n,t,o,s="destroy"===e?r:(n=i.internalEngine(),t=n.slidesInView,o=n.target,t.check(o.get(),u).map((function(e){return f[e]})).reduce((function(e,n){return Math.max(e,n)}),0)+"px");i.containerNode().style.height=s}return{name:"AutoHeight",options:o,init:function(e){var n=(i=e).internalEngine(),t=n.options,o=n.slidesInView,r=n.slideRects;"y"!==t.axis&&(u=o.findSlideBounds(void 0,.5),f=r.map((function(e){return e.height})),s.forEach((function(e){return i.on(e,a)})),a())},destroy:function(){s.forEach((function(e){return i.off(e,a)})),a("destroy")}}}return n.globalOptions=void 0,n}));
/*embla-carousel-autoplay@6.2.0*/
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(n="undefined"!=typeof globalThis?globalThis:n||self).EmblaCarouselAutoplay=e()}(this,(function(){"use strict";var n={delay:4e3,playOnInit:!0,stopOnInteraction:!0,stopOnMouseEnter:!1,stopOnLastSnap:!1};function e(t,o){var i,a=Object.assign({},n,e.globalOptions,t),r=a.playOnInit,s=a.stopOnInteraction,d=a.stopOnMouseEnter,l=a.stopOnLastSnap,u=a.delay,p=s?c:m,f=0;function c(){i.off("pointerDown",p),s||i.off("pointerUp",O),m(),f=0}function y(){m(),f=window.setTimeout(g,u)}function m(){f&&window.clearTimeout(f)}function O(){f&&(m(),y())}function g(){var n=i.internalEngine().index;if(l&&n.get()===n.max)return c();i.canScrollNext()?i.scrollNext():i.scrollTo(0),y()}return{name:"Autoplay",options:a,init:function(n){var e=(i=n).internalEngine().eventStore,t=i.rootNode(),a=o&&o(t)||t;i.on("pointerDown",p),s||i.on("pointerUp",O),d&&(e.add(a,"mouseenter",p),s||e.add(a,"mouseleave",O)),e.add(document,"visibilitychange",(function(){if("hidden"===document.visibilityState)return m();O()})),e.add(window,"pagehide",(function(n){n.persisted&&m()})),r&&y()},destroy:c,play:y,stop:m,reset:O}}return e.globalOptions=void 0,e}));
/*embla-carousel-wheel-gestures@2.1.1*/
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).EmblaCarouselWheelGestures=t()}(this,(function(){"use strict";function e(){return(e=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}).apply(this,arguments)}function t(){return(t=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}).apply(this,arguments)}function n(e,t){if(e.length!==t.length)throw new Error("vectors must be same length");return e.map((function(e,n){return e+t[n]}))}function i(e){return Math.max.apply(Math,e.map(Math.abs))}function o(e){return Object.freeze(e),Object.values(e).forEach((function(e){null===e||"object"!=typeof e||Object.isFrozen(e)||o(e)})),e}var r=[1,18,"undefined"!=typeof window&&window.innerHeight||800],a=[-1,-1,-1],s=o({preventWheelAction:!0,reverseSign:[!0,!0,!1]}),u={wheelDraggingClass:"is-wheel-dragging",forceWheelAxis:void 0};function c(l){var m=e({},u,c.globalOptions,l),f=function(){};return{name:"wheel-gestures",init:function(e){var u,c,l=e.internalEngine(),d=e.containerNode().parentNode,v=null!=(u=m.forceWheelAxis)?u:l.options.axis,h=function(e){void 0===e&&(e={});var u,c,l,m=function(){var e={};function t(t,n){e[t]=(e[t]||[]).filter((function(e){return e!==n}))}return o({on:function(n,i){return e[n]=(e[n]||[]).concat(i),function(){return t(n,i)}},off:t,dispatch:function(t,n){t in e&&e[t].forEach((function(e){return e(n)}))}})}(),f=m.on,d=m.off,v=m.dispatch,h=s,p={isStarted:!1,isStartPublished:!1,isMomentum:!1,startTime:0,lastAbsDelta:Infinity,axisMovement:[0,0,0],axisVelocity:[0,0,0],accelerationFactors:[],scrollPoints:[],scrollPointsToMerge:[],willEndTimeout:400},g=!1,M=function(e){Array.isArray(e)?e.forEach((function(e){return E(e)})):E(e)},x=function(e){return void 0===e&&(e={}),Object.values(e).some((function(e){return null==e}))?h:h=o(t({},s,h,e))},b=function(e){var i=t({event:u,isStart:!1,isEnding:!1,isMomentumCancel:!1,isMomentum:p.isMomentum,axisDelta:[0,0,0],axisVelocity:p.axisVelocity,axisMovement:p.axisMovement,get axisMovementProjection(){return n(i.axisMovement,i.axisVelocity.map((function(e){return void 0===t&&(t=.996),e*t/(1-t);var t})))}},e);v("wheel",t({},i,{previous:c})),c=i},E=function(e){var o,s=function(e){return t({},e,{axisDelta:e.axisDelta.map((function(e){return Math.min(Math.max(-700,e),700)}))})}(function(e,n){if(!n)return e;var i=!0===n?a:n.map((function(e){return e?-1:1}));return t({},e,{axisDelta:e.axisDelta.map((function(e,t){return e*i[t]}))})}({timeStamp:(o=e).timeStamp,axisDelta:[o.deltaX*r[o.deltaMode],o.deltaY*r[o.deltaMode],(o.deltaZ||0)*r[o.deltaMode]]},h.reverseSign)),c=s.axisDelta,l=s.timeStamp,m=i(c);e.preventDefault&&function(e,t){var n=h.preventWheelAction,i=t[0],o=t[1],r=t[2];if("boolean"==typeof n)return n;switch(n){case"x":return Math.abs(i)>=e;case"y":return Math.abs(o)>=e;case"z":return Math.abs(r)>=e;default:return!1}}(m,c)&&e.preventDefault(),p.isStarted?p.isMomentum&&m>Math.max(2,2*p.lastAbsDelta)&&(L(!0),j()):j(),0===m&&Object.is&&Object.is(e.deltaX,-0)?g=!0:(u=e,p.axisMovement=n(p.axisMovement,c),p.lastAbsDelta=m,p.scrollPointsToMerge.push({axisDelta:c,timeStamp:l}),w(),b({axisDelta:c,isStart:!p.isStartPublished}),p.isStartPublished=!0,A())},w=function(){var e;2===p.scrollPointsToMerge.length?(p.scrollPoints.unshift({axisDeltaSum:p.scrollPointsToMerge.map((function(e){return e.axisDelta})).reduce(n),timeStamp:(e=p.scrollPointsToMerge.map((function(e){return e.timeStamp})),e.reduce((function(e,t){return e+t}))/e.length)}),D(),p.scrollPointsToMerge.length=0,p.scrollPoints.length=1,p.isMomentum||T()):p.isStartPublished||y()},y=function(){var e;p.axisVelocity=(e=p.scrollPointsToMerge,e[e.length-1]).axisDelta.map((function(e){return e/p.willEndTimeout}))},D=function(){var e=p.scrollPoints,t=e[0],n=e[1];if(n&&t){var i=t.timeStamp-n.timeStamp;if(!(i<=0)){var o=t.axisDeltaSum.map((function(e){return e/i})),r=o.map((function(e,t){return e/(p.axisVelocity[t]||1)}));p.axisVelocity=o,p.accelerationFactors.push(r),S(i)}}},S=function(e){var t=10*Math.ceil(e/10)*1.2;p.isMomentum||(t=Math.max(100,2*t)),p.willEndTimeout=Math.min(1e3,Math.round(t))},P=function(e){return 0===e||e<=.96&&e>=.6},T=function(){if(p.accelerationFactors.length>=5){if(g&&(g=!1,i(p.axisVelocity)>=.2))return void O();var e=p.accelerationFactors.slice(-5);e.every((function(e){var t=!!e.reduce((function(e,t){return e&&e<1&&e===t?1:0})),n=e.filter(P).length===e.length;return t||n}))&&O(),p.accelerationFactors=e}},O=function(){p.isMomentum=!0},j=function(){(p={isStarted:!1,isStartPublished:!1,isMomentum:!1,startTime:0,lastAbsDelta:Infinity,axisMovement:[0,0,0],axisVelocity:[0,0,0],accelerationFactors:[],scrollPoints:[],scrollPointsToMerge:[],willEndTimeout:400}).isStarted=!0,p.startTime=Date.now(),c=void 0,g=!1},A=function(){clearTimeout(l),l=setTimeout(L,p.willEndTimeout)},L=function(e){void 0===e&&(e=!1),p.isStarted&&(b(p.isMomentum&&e?{isEnding:!0,isMomentumCancel:!0}:{isEnding:!0}),p.isMomentum=!1,p.isStarted=!1)},V=function(e){var t=[],n=function(n){n.removeEventListener("wheel",e),t=t.filter((function(e){return e!==n}))};return o({observe:function(i){return i.addEventListener("wheel",e,{passive:!1}),t.push(i),function(){return n(i)}},unobserve:n,disconnect:function(){t.forEach(n)}})}(M),C=V.observe,F=V.unobserve,W=V.disconnect;return x(e),o({on:f,off:d,observe:C,unobserve:F,disconnect:W,feedWheel:M,updateOptions:x})}({preventWheelAction:v,reverseSign:[!0,!0,!1]}),p=h.observe(d),g=h.on("wheel",(function(e){var t=e.axisDelta,n=t[0],i=t[1],o="x"===v?i:n,r=e.isEnding&&!e.isMomentum||e.isMomentum&&e.previous&&!e.previous.isMomentum;Math.abs("x"===v?n:i)>Math.abs(o)&&!M&&!e.isMomentum&&function(e){try{w(c=new MouseEvent("mousedown",e.event))}catch(e){return f()}M=!0,document.documentElement.addEventListener("mousemove",b,!0),document.documentElement.addEventListener("mouseup",b,!0),document.documentElement.addEventListener("mousedown",b,!0),m.wheelDraggingClass&&d.classList.add(m.wheelDraggingClass)}(e),M&&(r?function(e){M=!1,w(E("mouseup",e)),x(),m.wheelDraggingClass&&d.classList.remove(m.wheelDraggingClass)}(e):w(E("mousemove",e)))})),M=!1;function x(){document.documentElement.removeEventListener("mousemove",b,!0),document.documentElement.removeEventListener("mouseup",b,!0),document.documentElement.removeEventListener("mousedown",b,!0)}function b(e){M&&e.isTrusted&&e.stopImmediatePropagation()}function E(e,t){var n,i;if(v===l.options.axis){var o=t.axisMovement;n=o[0],i=o[1]}else{var r=t.axisMovement;i=r[0],n=r[1]}return new MouseEvent(e,{clientX:c.clientX+n,clientY:c.clientY+i,screenX:c.screenX+n,screenY:c.screenY+i,movementX:n,movementY:i,button:0,bubbles:!0,cancelable:!0,composed:!0})}function w(t){e.containerNode().dispatchEvent(t)}f=function(){p(),g(),x()}},destroy:function(){return f()},options:m}}return c.globalOptions=void 0,c}));
/*embla-carousel-class-names@6.2.0*/
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(n="undefined"!=typeof globalThis?globalThis:n||self).EmblaCarouselClassNames=e()}(this,(function(){"use strict";var n={selected:"is-selected",draggable:"is-draggable",dragging:"is-dragging"};function e(n,e){var o=n.classList;e&&o.contains(e)&&o.remove(e)}function o(n,e){var o=n.classList;e&&!o.contains(e)&&o.add(e)}function t(i){var r,s,a,f=Object.assign({},n,t.globalOptions,i),c=f.selected,u=f.draggable,d=f.dragging,l=["select","pointerUp"],g=["pointerDown","pointerUp"];function p(n){"pointerDown"===n?o(s,d):e(s,d)}function b(){var n=r.slidesInView(!0);r.slidesNotInView(!0).forEach((function(n){return e(a[n],c)})),n.forEach((function(n){return o(a[n],c)}))}return{name:"ClassNames",options:f,init:function(n){s=(r=n).rootNode(),a=r.slideNodes(),r.internalEngine().options.draggable&&o(s,u),d&&g.forEach((function(n){return r.on(n,p)})),c&&(l.forEach((function(n){return r.on(n,b)})),b())},destroy:function(){e(s,u),g.forEach((function(n){return r.off(n,p)})),l.forEach((function(n){return r.off(n,b)})),a.forEach((function(n){return e(n,c)}))}}}return t.globalOptions=void 0,t}));