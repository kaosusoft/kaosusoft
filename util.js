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