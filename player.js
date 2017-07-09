/*	
 *	Graphene Audio Player
 *	Original By Savoron and Trewbot
 *	Rewritten by Trewbot
 *	Jun 20, 2015
 *
 *	Options:				Type:				Description:
 *		color					string				defines the accent color
 *		
 *	Control:				Action:
 *		Left Arrow				Rewind 4s
 *		Right Arrow				Forward 4s
 *		Up Arrow				Volume up 10%
 *		Down Arrow				Volume down 10%
 *		Home					Rewind to beginning
 *		End						Forward to end
 *		Enter					Same as play/pause button
 *		Space					Same as play/pause button
 *
 *	Version:				Date:				Description:
 *		a0.0.0.0001				Sep 30, 2014		Created new JS based audio player.
 *		a0.0.0.0002				Sep 30, 2014		Added styling.
 *		a0.0.0.0003				Sep 30, 2014		Set up core JavaScript.
 *		a0.0.0.0004				Sep 30, 2014		Added play, pause, and replay.
 *		a0.0.0.0005				Sep 30, 2014		Added close function to fix multipage playing.
 *		a0.0.0.0006				Oct 01, 2014		-
 *		a0.0.0.0007				Oct 02, 2014		-
 *		a0.0.0.0007.5			Oct 03, 2014		Added dragging time bar
 *													Added pause while dragging
 *													Added keyboard controls to time
 *													Added volume control
 *													Added keyboard controls to volume
 *		a0.0.0.0008				Oct 05, 2014		-
 *		a0.0.0.0008.5			Feb 05, 2015		Refactored
 
 *		v0.1.0.0009				Jun 20, 2015		Wrote Number.format() and Number.toTime()
 *		v0.1.0.0010				Jun 20, 2015		Wrote Element.set()
 *		v0.1.0.0011				Jun 20, 2015		Added Graphene object
 *		v0.1.0.0012				Jun 20, 2015		Added _g.player
 *		v0.1.0.0013				Jun 20, 2015		Started element return for _g.pl.audio()
 *		v0.1.0.0014				Jun 20, 2015		Added audio player functions
 */

	Number.prototype.format = function(l){
		var n = this,
			c = l - (""+n).length;
		for(var i = 0; i < c; i++) n = "0" + n;
		return n;
	}
	Number.prototype.toTime = function(){
		var n = ~~(this/60),
			m = ~~(this%60);
		return n.format(2)+":"+m.format(2);
	}
	function _i(i){return document.getElementById(i);}
	function _c(c){return document.getElementsByClassName(c);}
	Element.prototype._c = function(c){return this.getElementsByClassName(c);}
	Element.prototype.set = function(a) {
		for(i in a)
			if(~['styles','style'].indexOf(i) && typeof a[i] === 'object')
				for(var p in a[i])
					this.style[p] = a[i][p];
			else i === 'html'
				? this.innerHTML = a[i]
				: this.setAttribute(i, a[i]);
		return this;
	};
	
	if(typeof Graphene !== 'object') {
		var Graphene = new(function () {
			this.url = 'http://gra.phene.co';
		})(),
			_g = Graphene;
	}
	
	_g.pl = (_g.player = {
		ids		: 0,
		img		: {
			play	: '<svg viewBox="0 0 16 16"><polygon fill="#FFFFFF" points="0,0 16,8 0,16 "/></svg>',
			pause	: '<svg viewBox="0 0 16 16"><rect x="0" y="0" fill="#FFFFFF" width="6.8" height="16"/><rect x="9.2" fill="#FFFFFF" width="6.8" height="16"/></svg>',
			replay	: '<svg viewBox="0 0 16 16"><path fill="#FFFFFF" d="M12.5,8.9c0,2.5-2,4.5-4.5,4.5s-4.5-2-4.5-4.5s2-4.5,4.5-4.5v1.8l5.4-3.1L8,0v1.7c-3.9,0-7.1,3.2-7.1,7.1 S4.1,16,8,16s7.1-3.2,7.1-7.1H12.5z"/></svg>',
		},
		video	: function(src, o){
		},
		audio	: function(src, o){
			
			//	Variables
			
				if(typeof src == void 0) return !1;
				
				var e	= document.createElement('player'),
					o	= o || {};
				
				e.int	= ++_g.pl.ids;
				e.timer	=  0;	//	Render Timer
				e.dTime	= !1;	//	Dragging Time Bar
				e.dVolm	= !1;	//	Dragging Volume
				e.dPaus	= !1;	//	Dragging when Paused
				e.tVolm	= !1;	//	Something...
				e.tVol2	=  0;	//	Something else...
			
			//	Functions
			
				e.render	= function(){
					var e = this;
					e._c('time')[0].innerHTML = e.sound.currentTime.toTime();
					e._c('slider')[0].style.left = (e.sound.currentTime/e.sound.duration) * 100 + "%";
					e._c('volume slider')[0].style.left = e.sound.volume * 100 + "%";
					if(e.sound.ended) e._c('play')[0].innerHTML = _g.pl.img.replay, clearInterval(e.timer);
				}
				e.play		= function(){
					var e = this;
					e._c('duration')[0].innerHTML = e.sound.duration.toTime();
					e.sound[e.sound.paused?'play':'pause']();
					e._c('play')[0].innerHTML = e.sound.paused
						? _g.pl.img.play
						: _g.pl.img.pause;
					e.sound.paused
						? clearInterval(e.timer)
						: setInterval(e.render,200);
				}
				e.close		= function(){
					var e = this;
					e.sound.src = '';
					clearInterval(e.timer);
				}
				e.seek		= function(v){
					var e = this;
					e.dTime = !0;
					var _r = e._c('bar')[0].getBoundingClientRect(),
						_x = Math.min(Math.max((v.pageX-_r.left)/(_r.width),0),1);
					e._c('slider')[0].style.left = _x * 100 + '%';
					e.sound.currentTime = _x * e.sound.duration;
					document.documentElement.style.cursor = "pointer";
				}
				e.volume	= function(v){
					var e = this;
					e.dVolm = true;
					var _r = e._c('volume bar')[0].getBoundingClientRect(),
						_x = Math.min(Math.max((v.pageX-_r.left)/(_r.width),0),1);
					this._c('volume slider')[0].style.left = _x*100+'%';
					this.sound.volume = _x;
					document.documentElement.style.cursor = "pointer";
					this.volm_icon();
				}
				e.drag		= function(v){
					var e = this,
						_r,
						_x;
					e.dTime
						? (e._c('slider')[0].style.left = (_x = Math.min(Math.max((v.pageX-(_r = e._c('bar')[0].getBoundingClientRect()).left)/(_r.width),0),1))*100+'%',
						  e.sound.currentTime = _x * e.sound.duration)
						: e.dVolm
							? (e._c('volume slider')[0].style.left = (_x = Math.min(Math.max((v.pageX-(_r = e._c('volume bar')[0].getBoundingClientRect()).left)/(_r.width),0),1))*100+'%',
							  e.sound.volume = _x)
							: 0;
				}
				e.release	= function(){
					var e = this;
					document.documentElement.style.cursor = "";
					e.dTime = !1;
					e.dVolm = !1;
					e.dPaus = !1;
					e.clearVolume();
				}
			
			//	Finish
			
				return e;
		}
	})