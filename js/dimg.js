dimg = function(src){


/*****************************
 * BEGIN CALLBACKS
 * 
 * First set event bindings for
 * the dimg in one long chain. 
 * Then (much later) set its
 * markup properties. 
 * 
 * The dimg has several features
 * ...
 * 


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

 ****************************/
var d=$("<div />")





/*****************************
 * double clicking will reset the dimg
 *****************************/
  .dblclick(function(e){
	  $(this).css({
			top:	0,
			left:	0,
			height:	d.attr('height_0'),
			width:	d.attr('width_0'),
			'background-position':'0 0'
			})
  })//dblclick




/*****************************
 * re-position the dimg by
 * holding down only shift 
 * during a drag
 * 	The image will track with the mouse
 *****************************/
  .drag({
      start:[
		function(e){return  e.shiftKey},
		function(e){return !e.ctrlKey},
		function(e){return !e.altKey}
		],//start

	  pre:function(e){
		this._ = {
		    mouse:	{x:e.pageX,	y:e.pageY,},
			corner:	$(e.target).offset(),
			};
		},//pre

      intra:function(e){
		// c(orner) = upper right corner of the image
		// m(ouse)  = mouse position
		// c_i - m_i == c_f - m_f
		// c_f = c_i + m_f - m_i
		
		$(e.target).offset({
			top: (this._.corner.top  + e.pageY-this._.mouse.y),
			left:(this._.corner.left + e.pageX-this._.mouse.x)
			});//offset
		},//intra

  })//.drag




/*****************************
 * crop the dimg by
 * holding down only ctrl
 * during a drag
 * 		The lower right corner will track with the mouse
 *****************************/
  .drag({
      start:[
		function(e){return !e.shiftKey},
		function(e){return  e.ctrlKey},
		function(e){return !e.altKey}
		],//start

	  pre:function(e){
		var t = $(e.target);
		this._ = {
		    quadrant:{
		    	h:	t.offset().left + t.width()/2 < e.pageX,
				v:	t.offset().top + t.height()/2 < e.pageY,
					},//quadrant
		    target:		t,
		    width_0:	t.width(),
		    height_0:	t.height(),
		    left_0:		t.offset().left,
		    top_0:		t.offset().top,
			};//this._
		},//pre

      intra:function(e){
		var t = this._.target;

		if(this._.quadrant.h)
			// the drag started right
			// of the dimg's center
			t.css({
				width:	e.pageX - t.offset().left,
//				'background-position':' 0 ',
				});
		else
			t.css({
				left:	e.pageX,
				width:	this._.width_0 - e.pageX + this._.left_0,
//				'background-position':(- e.pageX + this._.left_0)+' ',
				});
		
		if(this._.quadrant.v)
			// the drag started below
			// the dimg's center
			t.css({
				height:	e.pageY - t.offset().top,
//				'background-position':t.css('background-position')+' 0 ',
				});
		else
			t.css({
				top:	e.pageY,
				height:	this._.height_0 - e.pageY + this._.top_0,
//				'background-position':t.css('background-position')+(- e.pageY + this._.top_0)
				});
			
		},//intra

  })//.drag
  





  .appendTo('body');
/************************
 * END CALLBACKS
 * BEGIN MARKUP PROPERTIES
 ************************/


// find the dimensions of the image @ src
var i = $('<img src="'+src+'" />').appendTo('body');
var srcDimensions = {height:i.height(),width:i.width()};
i.remove();

d .addClass("dimg")
  .attr({
      height_0	: srcDimensions.height,
      width_0	: srcDimensions.width,
    })//attr
  .css({
	  left		: 0,
	  top		: 0,
      height	: srcDimensions.height,
      width		: srcDimensions.width,
	  position	: 'absolute',

	'background-image'		:'url(images/airgear.jpg)',
	'background-position'	:'0 0',
    'background-size'		: srcDimensions.width+' '+srcDimensions.height
	});//css

// This method is chainable-
// it returns a jQuery to the
// fresh dimg:
return d;
}







