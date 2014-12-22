!function n(e,t,o){function i(l,a){if(!t[l]){if(!e[l]){var u="function"==typeof require&&require;if(!a&&u)return u(l,!0);if(r)return r(l,!0);var s=new Error("Cannot find module '"+l+"'");throw s.code="MODULE_NOT_FOUND",s}var c=t[l]={exports:{}};e[l][0].call(c.exports,function(n){var t=e[l][1][n];return i(t?t:n)},c,c.exports,n,e,t,o)}return t[l].exports}for(var r="function"==typeof require&&require,l=0;l<o.length;l++)i(o[l]);return i}({1:[function(n){function e(){console.log("window resize"),l.width=window.innerWidth,l.height=window.innerHeight}function t(){var n=(Date.now()-c)/1e3;if(c=Date.now(),s.moveCooldown>0)s.moveCooldown-=n;else{var e=0;m[d.w]&&s.getCell().up&&(s.position.y--,e=1),m[d.s]&&s.getCell().down&&(s.position.y++,e=1),m[d.a]&&s.getCell().left&&(s.position.x--,e=1),m[d.d]&&s.getCell().right&&(s.position.x++,e=1),e&&(s.moveCooldown=.1)}o(),u=requestAnimationFrame(t)}function o(){a.clearRect(0,0,l.width,l.height),a.save(),a.translate(window.innerWidth/2-(s.position.x+.5)*g,window.innerHeight/2-(s.position.y+.5)*g),a.save(),a.beginPath(),a.arc((s.position.x+.5)*g,(s.position.y+.5)*g,5,0,2*Math.PI,!1),a.fill(),a.stroke(),a.restore(),a.beginPath();for(var n=f.cells(),e=0;e<n.length;e++){var t=n[e],o=t.x*g,i=(t.x+1)*g,r=t.y*g,u=(t.y+1)*g;t.up||(a.moveTo(o,r),a.lineTo(i,r)),t.down||(a.moveTo(o,u),a.lineTo(i,u)),t.left||(a.moveTo(o,r),a.lineTo(o,u)),t.right||(a.moveTo(i,r),a.lineTo(i,u))}a.stroke(),a.restore()}function i(){game.player=s={},s.moveCooldown=1,s.position={x:0,y:0},s.getCell=function(){return f.getCellAt(s.position.x,s.position.y)},window.addEventListener("keydown",function(n){m[n.which]=!0}),window.addEventListener("keyup",function(n){m[n.which]=!1})}function r(){l=document.getElementById("game-canvas"),window.addEventListener("resize",e,!1),i(),e(),a=l.getContext("2d"),f.clear(),f.makeChunk(0,0),f.makeChunk(-1,0),f.makeChunk(0,-1),f.makeChunk(-1,-1),h.run(),c=Date.now(),t()}var l,a,u,s,c,f=n("./grid"),h=n("./generator"),d=n("./keycode");window.game={},window.game.stop=function(){cancelAnimationFrame(u)},window.game.grid=f,window.game.generator=h;var g=30,m={};"interactive"===document.readyState?r():document.addEventListener("DOMContentLoaded",r)},{"./generator":2,"./grid":3,"./keycode":4}],2:[function(n,e,t){var o=n("./grid");t.hunt=function(){var n=_(o.cells()).filter(function(n){return 0===n.connections().length&&_.any(n.neighbors(),function(n){return n.connections().length>0})}),e=n.sample();if(!e||_.isArray(e)&&0===e.length)return void console.log("No cells found");var t=_.filter(e.neighbors(),function(n){return n.connections().length>0}),i=_.first(t);return!i||_.isArray(i)&&0===i.length||e.makeConnection(i),e},t.walk=function(n){var e=n.neighbors(),t=_.sample(_.filter(e,function(n){return 0===n.connections().length}));return void 0!==t&&n.makeConnection(t),t},t.run=function(n){for(void 0===n&&(n=o.pickRandCell());n;)n=t.step(n)},t.step=function(n){return n=t.walk(n),n||(n=t.hunt(n)),n}},{"./grid":3}],3:[function(n,e,t){var o,i=16;t.clear=function(){t.regions=o=[],o[0]=[],o[1]=[],o[2]=[],o[3]=[]},t.makeChunk=function(n,e){for(var r=[],l=0;i>l;l++){r[l]=[];for(var a=0;i>a;a++)r[l][a]=t.makeCell(16*n+a,16*e+l)}var u=0;0>n&&u++,0>e&&(u+=2);var s=0>n?Math.abs(n+1):n,c=0>e?Math.abs(e+1):e;o[u][c]||(o[u][c]=[]),o[u][c][s]=r},t.getCellAt=function(n,e){var t=0>n?i-Math.abs((n+1)%i)-1:n%i,r=0>e?i-Math.abs((e+1)%i)-1:e%i,l=Math.floor(n/i),a=Math.floor(e/i),u=0;0>n&&u++,0>e&&(u+=2);var s=0>l?Math.abs(l+1):l,c=0>a?Math.abs(a+1):a;if(!o[u][c]||!o[u][c][s])return null;var f=o[u][c][s][r][t];return f},t.cells=function(){var n,e,t,i,r,l=[];for(e=0;e<o.length;e++)for(t=0;t<o[e].length;t++)for(i=0;i<o[e][t].length;i++)for(n=o[e][t][i],r=0;r<n.length;r++)l=l.concat(n[r]);return l},t.makeCell=function(n,e){var o=[[n-1,e],[n+1,e],[n,e-1],[n,e+1]];return{x:n,y:e,up:!1,down:!1,right:!1,left:!1,neighbors:function(){return o.map(function(n){return t.getCellAt.apply(t,n)}).filter(function(n){return null!==n})},connections:function(){var o=[];return this.up&&o.push(t.getCellAt(n,e-1)),this.down&&o.push(t.getCellAt(n,e+1)),this.left&&o.push(t.getCellAt(n-1,e)),this.right&&o.push(t.getCellAt(n+1,e)),o.filter(function(n){return null!==n})},makeConnection:function(t){e-1===t.y?this.up=t.down=!0:e+1===t.y?this.down=t.up=!0:n-1===t.x?this.left=t.right=!0:n+1===t.x?this.right=t.left=!0:(console.warn("Attempted invalid connection"),console.log(this,t),console.trace())}}},t.pickRandCell=function(){return _.sample(t.cells())}},{}],4:[function(n,e){e.exports={backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,pause:19,capslock:20,escape:27,space:32,pageup:33,pagedown:24,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,"delete":46,zero:48,one:49,two:50,three:51,four:52,five:53,six:54,seven:55,eight:56,nine:57,a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:70,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,leftwindow:91,rightwindow:92,select:93,num0:96,num1:97,num2:98,num3:99,num4:100,num5:101,num6:102,num7:103,num8:104,num9:105,nummultiply:106,numplus:107,numminus:109,numdot:110,numdivide:111,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123,numlock:144,scrolllock:145,semicolon:186,equals:187,comma:188,dash:189,dot:190,slash:191,grave:192,openparen:219,backslash:220,closeparen:221,singleqoute:222}},{}]},{},[1]);