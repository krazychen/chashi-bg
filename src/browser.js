// Opera 8.0+
export const isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0

// Firefox 1.0+
export const isFirefox = typeof InstallTrigger !== 'undefined'

// Internet Explorer 6-11
export const isIE = /* @cc_on!@*/false || !!document.documentMode

// Edge 20+
export const isEdge = (!isIE && !!window.StyleMedia) || window.navigator.userAgent.match(/Edg/i)

// Chrome 1 - 79
export const isChrome = !isEdge && !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)

// Safari 3.0+ "[object HTMLElementConstructor]"
const userAgent = window.navigator.userAgent
const isMobileSafari = userAgent.match(/iPad|iPhone|AppleWebKit|Safari/i)
export const isSafari = !isEdge && (isMobileSafari || /constructor/i.test(window.HTMLElement) || (function(p) { return p.toString() === '[object SafariRemoteNotification]' })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)))

// Edge (based on chromium) detection
export const isEdgeChromium = isChrome && (navigator.userAgent.indexOf('Edg') !== -1)

// Blink engine detection
export const isBlink = (isChrome || isOpera) && !!window.CSS
