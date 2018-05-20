'use strict';

/**
* REGEX: /^((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+|)(?:[\\\/]|)(?:[\s\S]*?))(?:[\\\/]+?|)(?:(?:\.{1,2}|[^\\\/]+?|)(?:\.[^.\/\\]*|))(?:[\\\/]*)$/
*	Capture a Windows path dirname. Modified from Node.js [source]{@link https://github.com/nodejs/node/blob/1a3b295d0f46b2189bd853800b1e63ab4d106b66/lib/path.js#L65}.
*
*	^
*		-	match any string which begins with
*	()
*		-	capture (includes the device, slash, and dirname)
*	(?:)
*		-	capture but do not remember (device)
*	[a-zA-Z]:
*		-	match any upper or lowercase letter and a : literal
*	|
*		-	OR
*	[\\\/]
*		-	match a \ or / literal character
*	{2}
*		-	exactly 2 times
*	[^\\\/]+
*		-	match anything but a \ or / literal one or more times
*	[\\\/]+
*		-	match a \ or / literal one or more times
*	[^\\\/]+
*		-	match anything but a \ or / literal one or more times
*	|)
*		-	OR capture nothing
*	(?:)
*		-	capture but do not remember (slash)
*	[\\\/]
*		-	match a \ or / literal
*	|)
*		-	OR capture nothing
*	(?:)
*		-	capture but do not remember (dirname)
*	[\s\S]
*		-	match any space or non-space character
*	*?
*		-	zero or more times but do so non-greedily
*	(?:)
*		-	capture but do not remember (slash before basename)
*	[\\\/]+?
*		-	match a \ or / literal one or more times, but do so non-greedily
*	|)
*		-	OR capture nothing
*	(?:)
*		-	capture but do not remember (basename)
*	(?:)
*		-	capture but do not remember
*	\.{1,2}
*		-	match a . literal one or two times
*	|
*		-	OR
*	[^\\\/]+?
*		-	match anything but a \ or / literal one or more times, but do so non-greedily
*	|)
*		-	OR capture nothing
*	(?:)
*		-	capture but do not remember (extname)
*	\.
*		-	match a . literal
*	[^.\/\\]*
*		-	match anything but a ., /, or \ literal zero or more times
*	|)
*		-	OR capture nothing
*	(?:)
*		-	capture but do not remember (trailing slash)
*	[\\\/]*
*		-	match a \ or / literal zero or more times
*	$
*		-	end of string
*/
var re = /^((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+|)(?:[\\\/]|)(?:[\s\S]*?))(?:[\\\/]+?|)(?:(?:\.{1,2}|[^\\\/]+?|)(?:\.[^.\/\\]*|))(?:[\\\/]*)$/;


// EXPORTS //

module.exports = re;
