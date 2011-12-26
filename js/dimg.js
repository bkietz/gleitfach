dimg = function(src){



// First set the event bindings for the
// new dimg, then (much later) give it 
// markup properties. 
var i = $("<img />")
			.wrap("<div />")
			.parent()


	//double clicking will reset the dimg
  .dblclick(function(e){
	  var i = $(this).children();
	  i .css({
			top		:0,
			left	:0,
			height	:i.attr('height_0'),
			width	:i.attr('width_0'),
			})
		.parent()
		.css({
			top		:0,
			left	:0,
			height	:i.attr('height_0'),
			width	:i.attr('width_0'),
			});

		
  })//dblclick





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
		console.log(e.currentTarget);
		
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
  




	//does not work!
  
	//scale the dimg by
	//holding down shift
	//whilst mousewheeling
  .bind('mousewheel',function(e){
		if(	e.shiftKey && !e.ctrlKey && !e.altKey
			&& 	$(e.srcElement).hasClass('dimg')	);
		else return;
		e.preventDefault();
		e.stopPropagation();
		var inc = '*='+(1+e.originalEvent.wheelDelta/1000);

		console.log(e);

		$(e.currentTarget)	.width(inc).height(inc)
			.children()		.width(inc).height(inc);
   })//.bind







//no matter what I do the damn new div is never on top!
// it can't ever window the rest of the img!


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
//		console.log(		this._.new_width(e));

		this._.view
			.width (this._.new_width (e)	)
			.height(this._.new_height(e)	);

//		this._.target.parent()
//			.width (this._.new_width (e) + 50)
//			.height(this._.new_height(e) + 50);
		},//during

      remember:function(e){
		return {
			new_width :function(e){
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
		var i = this._.target;
		i.parent()
			.height( i.attr('height_0'))
			.width(  i.attr('width_0'))
			.css('border','5px solid black');
			
		this._.view = $('<div/>')
							.css({
								overflow:'hidden',
								border:'5px solid blue',
								})
							.appendTo('body');
	  },//start
	  end:function(e){
		this._.target.parent().parent()
			.width (this._.new_width (e))
			.height(this._.new_height(e));
			
		this._.view.remove();
	  },//end

  })//.drag
  
  
  
  
  
  .appendTo('body')
  .children();//finish pointing at the <img>








// Markup properties:
i .attr({src:src})
  .attr({
      height_0	: i.height(),
      width_0	: i.width(),
    })
  .addClass("dimg")
  .css({
	  left		: 0,
	  top		: 0,
	  position	: 'absolute',
	  })
  
  .parent()
  .addClass("dimg")
  .css({
	  top		: 0,
	  left		: 0,
	  height	: i.height(),
	  width		: i.width(),
	  position	: 'absolute',
	  overflow	: 'hidden',
	  });


return i;
}




// a little fn to get an
// image file's dimensions
imgSRCdimensions = function(s){
var i = $('<img src="'+s+'" />').appendTo('body');
var ret = {height:i.height(),width:i.width()};
i.remove();
return ret;
};//imgSRCdimensions
/*
// Possible alternate route:
$('body').append('<svg version = "1.1">'+
'<g clip-path="url(#viewPort)" id="popAroundMenuG">'+
'<image width='+dim.width+
     ' height='+dim.height+
     ' xlink:href="'+'images/airgear.jpg'+
'"></g>'+
'<clipPath id="viewPort">'+
'<rect x="130" y="75" width="90" height="40"></rect>'+
'</clipPath>'+
'</svg>');
*/



