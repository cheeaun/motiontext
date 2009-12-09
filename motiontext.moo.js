(function(){

var padStyles = function(str){
	return str + '-moz-' + str + '-webkit-' + str;
};
var flipStyles = [
	padStyles('transform: matrix(1, 0, 0, -1, 0, 0);'),
	padStyles('transform: matrix(-1, 0, 0, -, 0, 0);')
];

this.MotionText = new Class({

	Implements: [Events, Options],
	
	options:{
		/*
		onStart: $empty,
		onComplete: $empty,
		*/
		duration: 2000,
		randomChars: '`1234567890-=~!@#$%^&*()_+',
		randomLength: 3,
		allowSameText: false
	},
	
	initialize: function(el, options){
		this.setOptions(options);
		this.randomChars = this.options.randomChars.split('');
		this.el = $(el);
		this.originalHTML = this.el.get('html');
		this.el.store('motiontext:originalHTML', this.originalHTML);
	},
	
	toElement: function(){
		return this.el;
	},
	
	start: function(newText){
		newText = newText.trim();
		if (!newText) return;
		var elText = this.el.get('text').trim();
		if (!this.options.allowSameText && newText == elText) return;
		text = elText.split('');
		var nText = newText.split('');
		
		var len = Math.max(text.length, nText.length);
		var jlen = Math.min(this.options.randomLength, Math.min(text.length, nText.length))-1;
		var randomChars = this.randomChars;
		
		var texts = [];
		for (var i=0; i<len; i++){
			for (var j=0; j<=jlen; j++){
				for (var k=0; k<=jlen; k++){
					var c = randomChars.getRandom();
					var styledC = '<span style="' + flipStyles.getRandom() + '">' + c + '</span>';
					text[i-k] = [c, styledC].getRandom();
				}
				if (j == jlen && text[i-jlen]) text[i-jlen] = nText[i-jlen] || '';
				texts.push(text.join(''));
			}
		}
		texts.push(newText);
		
		var self = this;
		var el = this.el;
		var k = 0;
		var textsLen = texts.length;
		var timer;
		var animate = function(){
			if (k == textsLen){
				$clear(timer);
				self.fireEvent('complete');
				return;
			}
			el.set('html', texts[k]);
			k++;
		};
		
		timer = animate.periodical(Math.max(this.options.duration/textsLen, 20));
		
		this.fireEvent('start');
		return this;
	}
	
});

})();