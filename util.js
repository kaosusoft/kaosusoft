exports.checkID = function(str){
	var filter = /^[a-zA-Z0-9]{5,10}$/;
	console.log(str);
	if(filter.test(str)){
		console.log('트루');
		return true;
	}else{
		console.log('팔스');
		return false;
	}
};

exports.checkNick = function(str){
	var filter = /^[a-zA-Z0-9가-힣]{1,12}$/;
	if(filter.test(str)){
		return true;
	}else{
		return false;
	}
};

exports.utf16to8 = function(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
	c = str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
	    out += str.charAt(i);
	} else if (c > 0x07FF) {
	    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	} else {
	    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	}
    }
    return out;
}