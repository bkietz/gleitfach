
var dimg = {c:0};
dimg = function(src){

  $("<img />")
  .attr({
//      id   :	"dimg_img_"+(dimg.c++),
      src  :	src,
//      height_0	: this.height(),
//      width_0	: this.width(),
    })
  .addClass("dimg")
  .wrap("<div />")
  .parent()
  .addClass("dimg")
  .css({overflow:'hidden'})

	//reset the dimg with a dblclick
  .dblclick(function(e){
		$(this) .height('100%')
				.width( '100%');
	})//.dblclick

	//re-position the dimg by
	//holding down only shift 
	//during a drag
	//	The image will track with the mouse
  .drag({
      pre:function(e){
		  return e.shiftKey && !e.ctrlKey && !e.altKey
      				&& $(e.srcElement).hasClass('dimg');
      	},//pre

      during:function(e){
		// c(orner) = upper right corner of the image
		// m(ouse)  = mouse position
		// c_i - m_i == c_f - m_f
		// c_f = c_i + m_f - m_i
		$(e.currentTarget)
		.offset({top:(this._.corner.top +e.pageY-this._.mouse.y),
				left:(this._.corner.left+e.pageX-this._.mouse.x)});
		},//during
		
      remember:function(e){
		return {
			mouse:	{x:e.pageX,	y:e.pageY,}		,
			corner:	$(e.currentTarget).offset()	,
		};},//remember

  })//.drag
  
  
	//scale the dimg by
	//holding down shift
	//whilst mousewheeling
  .bind('mousewheel',function(e){
		if(!(e.shiftKey && !e.ctrlKey && !e.altKey)) return;
		e.preventDefault();
		e.stopPropagation();
		scale_factor = 1 - e.originalEvent.wheelDelta/3000;
		var div = $(e.currentTarget);
		var img = div.children();

		// This will probably break on a cropped dimg
		div .width(  scale_factor * div.width())
			.height( scale_factor * div.height());
		img .width(  scale_factor * img.width())
			.height( scale_factor * img.height());
   })//.bind
/*
	//scale the dimg by
	//holding down ctrl
	//during a drag
	//	The right edge will track with the mouse
  .drag({
      pre:function(e){return !e.shiftKey && e.ctrlKey && !e.altKey;},

      during:function(e){
		new_width = e.pageX - this._.corner.left;
		$(e.currentTarget).children()
		.width(  new_width )
		.height( new_width/this._.aspect_ratio );
		},//during

      remember:function(e){
		return {
			aspect_ratio:$(e.currentTarget).children().width()/
						 $(e.currentTarget).children().height(),
			corner:	$(e.currentTarget).offset()	,
		};},//remember

  })//.drag
*/


	//crop the dimg by
	//holding down ctrl
	//and clicking
	//	The lower right corner will track with the mouse
	// (for now- later I should determine how to select any corner)
  .drag({
      pre:function(e){
		return !e.shiftKey && e.ctrlKey && !e.altKey
				&& $(e.srcElement).hasClass('dimg');
	    },//pre

      during:function(e){
		console.log(		this._.new_width(e));

		this._.target.parent()
			.width (this._.new_width (e)	);
		this._.target.parent()
			.height(this._.new_height(e)	);

		this._.target.parent().parent()
			.width (this._.new_width (e) + 50);
		this._.target.parent().parent()
			.height(this._.new_height(e) + 50);
		},//during

      remember:function(e){
		return {
			new_width :function(e){
						console.log(this);
						return	Math.min
							(e.pageX, this.target.width()	)
							-this.target.parent().offset().left;
							},//new_width
			new_height:function(e){
						return Math.min
							(e.pageY, this.target.height()	)
							-this.target.parent().offset().top;
							},//new_height
			target:$(e.srcElement),
		};},//remember

	  start:function(e){
		this._.target.wrap('<div style="overflow:hidden"/>');
	  },//start
	  end:function(e){
		this._.target.parent().parent()
			.width (this._.new_width (e));
		this._.target.parent().parent()
			.height(this._.new_height(e));

		this._.target.unwrap();
	  },//end

  })//.drag



// and finally, put it onto the page
  .appendTo('body');
}

