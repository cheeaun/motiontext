;(function($){
	
	var padStyles = function(str){
		return str + '-moz-' + str + '-webkit-' + str;
	};
	var flipStyles = [
		padStyles('transform: matrix(1, 0, 0, -1, 0, 0);'),
		padStyles('transform: matrix(-1, 0, 0, -, 0, 0);'),
		padStyles('transform: rotate(180deg);')
	];
	
	var random = function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	
	var getRandom = function(arr){
		return (arr.length) ? arr[random(0, arr.length - 1)] : null;
	};
	
	$.fn.motionText = function(newText, options){
		
		var defaults = {
			start: function(){},
			complete: function(){},
			duration: 2000,
			perCharDuration: null,
			randomChars: '`1234567890-=~!@#$%^&amp;*()_+',
			randomLength: 3,
			allowSameText: false
		};
		
		var options = $.extend(defaults, options);
		
		var randomChars = options.randomChars.split('');
		
		return this.each(function(){
			var el = $(this);
			
			var originalHTML = el.html();
			if (!el.data('motiontext:originalHTML')) el.data('motiontext:originalHTML', originalHTML);
			
			newText = newText.trim();
			var elText = $.trim(el.text());
			if (!options.allowSameText && newText == elText) return;
			text = elText.split('');
			var nText = newText.split('');
			
			var len = Math.max(text.length, nText.length);
			var jlen = Math.max(Math.min(options.randomLength, Math.min(text.length, nText.length))-1, 0);
			
			var texts = [];
			for (var i=0; i<len; i++){
				for (var j=0; j<=jlen; j++){
					for (var k=0; k<=jlen; k++){
						var c = getRandom(randomChars);
						var styledC = '<span style="' + getRandom(flipStyles) + '">' + c + '</span>';
						text[i-k] = getRandom([c, styledC]);
					}
					if (j == jlen && text[i-jlen]) text[i-jlen] = nText[i-jlen] || '';
					texts.push(text.join(''));
				}
			}
			texts.push(newText);
			
			var k = 0;
			var textsLen = texts.length;
			var timer;
			var animate = function(){
				if (k == textsLen){
					clearInterval(timer);
					options.complete.call(this);
					return;
				}
				el.html(texts[k]);
				k++;
			};
			
			timer = setInterval(animate, options.perCharDuration || Math.max(options.duration/textsLen, 20));
			
			options.start.call(this);
		});
		
	};
	
})(jQuery);
