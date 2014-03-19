var spanishNumberParser = function(){
	var my = {};

	var numbers = {'hasSingle': true, 'conjunction': 'y', '':'un', 'negative':'menos', 'shortOne': 'un',
		0:'cero', 1:'uno', 2:'dos', 3:'tres', 4:'cuatro', 5:'cinco',
		6:'seis', 7:'siete', 8:'ocho', 9:'nueve', 10:'diez',
		11:'once', 12:'doce', 13:'trece', 14:'catorce', 15: 'quince',
		20:'veinte',
		30:'treinta', 40:'cuarenta', 50:'cincuenta', 60:'sesenta', 70:'setenta', 80:'ochenta', 90:'noventa', 100:'cien',
		1000: 'mil', 1000000:'millón', 1000000000:'millardo', 1000000000000:'billón'};

	function getPlace(n, which, scale){
		return numbers[parseInt(n.toString()[which])*scale];
	}

	function parse10s(n, ignore0){
		var out = '';
		if (n == 0 && ignore0){
			out = '';
		}
		else if (n <= 15){
			out = numbers[n];
		}
		else if (n > 15 && n < 20){
			out = numbers[10] + numbers.conjunction + getPlace(n,1,1);
		}
		else{
			if (n % 10 == 0){
				out = getPlace(n,0,10);
			}
			else{
				out = getPlace(n,0,10) + ' ' + numbers.conjunction + ' '+ getPlace(n,1,1);
			}
		}
		return out;
	}

	function parse100s(n){
		var out = '';
		//console.log(n);
		if (n == 100){
			out = numbers[100];
		}
		else if (n % 100 == 0 && Math.floor(n/100) > 1){
			out = getPlace(n, 0, 1) + ' ' + numbers[100] + 'to';
		}
		else if (Math.floor(n/100) > 1){
			out = getPlace(n, 0, 1) + ' ' + numbers[100] + 'to ' + parse10s(parseInt(n.toString().substr(1,2)), true);
		}
		else {
			out = numbers[100] + 'to ' + parse10s(parseInt(n.toString().substr(1,2)), true);
		}

		return out;
	}

	function parseGreaterThanOrEqualTo1000(n){
		var out = '';
		var nStr = n.toString();
		var ctr = 0;
		while (nStr.length > 3){
			var piece = parseInt(nStr.substr(nStr.length-3, nStr.length-1));

			if (piece == 0){
				nStr = nStr.substr(0,nStr.length-3)
				ctr += 3;
				continue;
			}
			else if (piece < 100 && numbers.hasSingle){
				piece = andSingle(piece);
			}
			else{
				piece = my.parseNumber(parseInt(piece));
			}

			out = piece + ' ' + (ctr >= 3 ? numbers[Math.pow(10,ctr)]:'') + ' ' + out;

			nStr = nStr.substr(0,nStr.length-3);
			ctr += 3;
		}
		out = my.parseNumber(nStr.substr(0,3)) + ' ' + numbers[Math.pow(10, ctr)] + ' ' + out;
		return out;
	}

	function andSingle(n){
		return numbers.conjunction+ ' ' + my.parseNumber(n);
	}

	my.parseNumber = function(n){
		var out = '';
		var negative = n < 0;

		if (negative){
			n *= -1;
		}

		if (n < 100){
			out = parse10s(n, false);
		}
		else if (n < 1000){
			out = parse100s(n);
		}
		else if (n >= 1000){
			out = parseGreaterThanOrEqualTo1000(n);
		}
		else{
			out = 'unbound';
		}

		if (negative){
			out = numbers.negative + ' ' + out;
		}

		return out.trim();
	}

	return my;
}

module.exports = new spanishNumberParser;