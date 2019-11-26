(function(window,angular,undefined){'use strict';var $sanitize=function(html){var buf=[];htmlParser(html,htmlSanitizeWriter(buf));return buf.join('');};var START_TAG_REGEXP=/^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,END_TAG_REGEXP=/^<\s*\/\s*([\w:-]+)[^>]*>/,ATTR_REGEXP=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,BEGIN_TAG_REGEXP=/^</,BEGING_END_TAGE_REGEXP=/^<\s*\//,COMMENT_REGEXP=/<!--(.*?)-->/g,CDATA_REGEXP=/<!\[CDATA\[(.*?)]]>/g,URI_REGEXP=/^((ftp|https?):\/\/|mailto:|tel:|#)/,NON_ALPHANUMERIC_REGEXP=/([^\#-~| |!])/g;var voidElements=makeMap("area,br,col,hr,img,wbr");var optionalEndTagBlockElements=makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),optionalEndTagInlineElements=makeMap("rp,rt"),optionalEndTagElements=angular.extend({},optionalEndTagInlineElements,optionalEndTagBlockElements);var blockElements=angular.extend({},optionalEndTagBlockElements,makeMap("address,article,aside,"+"blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,"+"header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));var inlineElements=angular.extend({},optionalEndTagInlineElements,makeMap("a,abbr,acronym,b,bdi,bdo,"+"big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,"+"span,strike,strong,sub,sup,time,tt,u,var"));var specialElements=makeMap("script,style");var validElements=angular.extend({},voidElements,blockElements,inlineElements,optionalEndTagElements);var uriAttrs=makeMap("background,cite,href,longdesc,src,usemap");var validAttrs=angular.extend({},uriAttrs,makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+'scope,scrolling,shape,span,start,summary,target,title,type,'+'valign,value,vspace,width'));function makeMap(str){var obj={},items=str.split(','),i;for(i=0;i<items.length;i++)obj[items[i]]=true;return obj;}
function htmlParser(html,handler){var index,chars,match,stack=[],last=html;stack.last=function(){return stack[stack.length-1];};while(html){chars=true;if(!stack.last()||!specialElements[stack.last()]){if(html.indexOf("<!--")===0){index=html.indexOf("-->");if(index>=0){if(handler.comment)handler.comment(html.substring(4,index));html=html.substring(index+3);chars=false;}}else if(BEGING_END_TAGE_REGEXP.test(html)){match=html.match(END_TAG_REGEXP);if(match){html=html.substring(match[0].length);match[0].replace(END_TAG_REGEXP,parseEndTag);chars=false;}}else if(BEGIN_TAG_REGEXP.test(html)){match=html.match(START_TAG_REGEXP);if(match){html=html.substring(match[0].length);match[0].replace(START_TAG_REGEXP,parseStartTag);chars=false;}}
if(chars){index=html.indexOf("<");var text=index<0?html:html.substring(0,index);html=index<0?"":html.substring(index);if(handler.chars)handler.chars(decodeEntities(text));}}else{html=html.replace(new RegExp("(.*)<\\s*\\/\\s*"+stack.last()+"[^>]*>",'i'),function(all,text){text=text.replace(COMMENT_REGEXP,"$1").replace(CDATA_REGEXP,"$1");if(handler.chars)handler.chars(decodeEntities(text));return"";});parseEndTag("",stack.last());}
if(html==last){throw"Parse Error: "+html;}
last=html;}
parseEndTag();function parseStartTag(tag,tagName,rest,unary){tagName=angular.lowercase(tagName);if(blockElements[tagName]){while(stack.last()&&inlineElements[stack.last()]){parseEndTag("",stack.last());}}
if(optionalEndTagElements[tagName]&&stack.last()==tagName){parseEndTag("",tagName);}
unary=voidElements[tagName]||!!unary;if(!unary)
stack.push(tagName);var attrs={};rest.replace(ATTR_REGEXP,function(match,name,doubleQuotedValue,singleQoutedValue,unqoutedValue){var value=doubleQuotedValue||singleQoutedValue||unqoutedValue||'';attrs[name]=decodeEntities(value);});if(handler.start)handler.start(tagName,attrs,unary);}
function parseEndTag(tag,tagName){var pos=0,i;tagName=angular.lowercase(tagName);if(tagName)
for(pos=stack.length-1;pos>=0;pos--)
if(stack[pos]==tagName)
break;if(pos>=0){for(i=stack.length-1;i>=pos;i--)
if(handler.end)handler.end(stack[i]);stack.length=pos;}}}
var hiddenPre=document.createElement("pre");function decodeEntities(value){hiddenPre.innerHTML=value.replace(/</g,"&lt;");return hiddenPre.innerText||hiddenPre.textContent||'';}
function encodeEntities(value){return value.replace(/&/g,'&amp;').replace(NON_ALPHANUMERIC_REGEXP,function(value){return'&#'+value.charCodeAt(0)+';';}).replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function htmlSanitizeWriter(buf){var ignore=false;var out=angular.bind(buf,buf.push);return{start:function(tag,attrs,unary){tag=angular.lowercase(tag);if(!ignore&&specialElements[tag]){ignore=tag;}
if(!ignore&&validElements[tag]==true){out('<');out(tag);angular.forEach(attrs,function(value,key){var lkey=angular.lowercase(key);if(validAttrs[lkey]==true&&(uriAttrs[lkey]!==true||value.match(URI_REGEXP))){out(' ');out(key);out('="');out(encodeEntities(value));out('"');}});out(unary?'/>':'>');}},end:function(tag){tag=angular.lowercase(tag);if(!ignore&&validElements[tag]==true){out('</');out(tag);out('>');}
if(tag==ignore){ignore=false;}},chars:function(chars){if(!ignore){out(encodeEntities(chars));}}};}
angular.module('ngSanitize',[]).value('$sanitize',$sanitize);angular.module('ngSanitize').directive('ngBindHtml',['$sanitize',function($sanitize){return function(scope,element,attr){element.addClass('ng-binding').data('$binding',attr.ngBindHtml);scope.$watch(attr.ngBindHtml,function ngBindHtmlWatchAction(value){value=$sanitize(value);element.html(value||'');});};}]);angular.module('ngSanitize').filter('linky',function(){var LINKY_URL_REGEXP=/((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s\.\;\,\(\)\{\}\<\>]/,MAILTO_REGEXP=/^mailto:/;return function(text,target){if(!text)return text;var match;var raw=text;var html=[];var writer=htmlSanitizeWriter(html);var url;var i;var properties={};if(angular.isDefined(target)){properties.target=target;}
while((match=raw.match(LINKY_URL_REGEXP))){url=match[0];if(match[2]==match[3])url='mailto:'+url;i=match.index;writer.chars(raw.substr(0,i));properties.href=url;writer.start('a',properties);writer.chars(match[0].replace(MAILTO_REGEXP,''));writer.end('a');raw=raw.substring(i+match[0].length);}
writer.chars(raw);return html.join('');};});})(window,window.angular);