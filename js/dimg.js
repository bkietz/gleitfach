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
      viv:[
		function(e){return  e.shiftKey},
		function(e){return !e.ctrlKey},
		function(e){return !e.altKey}
		],//viv

	  pre:function(e,c){
		// c(orner) = upper right corner of the image
		// m(ouse)  = mouse position
		c._ = {
		    mouse:	{x:e.pageX,	y:e.pageY,},
			corner:	this.offset(),
			};//c._
		},//pre

      inter:function(e,c){
		this.offset({
			top: (c._.corner.top  + e.pageY-c._.mouse.y),
			left:(c._.corner.left + e.pageX-c._.mouse.x)
			});//offset
		},//inter

  })//.drag




/*****************************
 * crop the dimg by
 * holding down only ctrl
 * during a drag
 * 		The lower right corner will track with the mouse
 *****************************/
  .drag({
      viv:[
		function(e){return !e.shiftKey},
		function(e){return  e.ctrlKey},
		function(e){return !e.altKey}
		],//viv

	  pre:function(e,c){
		c._ = {
		    quadrant:	(e.pageY < this.corners('center').y? 'T':'B')+
						(e.pageX < this.corners('center').x? 'L':'R'),
			crop: {	x:parseInt(this.css('background-position-x')),
					y:parseInt(this.css('background-position-y'))	},
			};//c._
		c._.corner = this.corners(c._.quadrant);
		},//pre


	  inter:function(e,c){
		this.corners(c._.quadrant,{x:e.pageX,y:e.pageY});

		if(c._.quadrant[0] == 'T')
			this.css('background-position-y',
				c._.corner.y - e.pageY + c._.crop.y);
		
		if(c._.quadrant[1] == 'L')
			this.css('background-position-x',
				c._.corner.x - e.pageX + c._.crop.x);
		},//inter

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
    'background-size'		: srcDimensions.width+' '+srcDimensions.height,
	});//css

// This method is chainable-
// it returns a jQuery to the
// fresh dimg:
return d;
}







