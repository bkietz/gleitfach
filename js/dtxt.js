dtxt = function(src){

var d=$("<div />")
/*****************************
 * BEGIN CALLBACKS
 * 
 * First set event bindings for
 * the dtxt in one long chain. 
 * Then (much later) set its
 * markup properties. 
 * 
 * The dtxt has several features
 * ...
 * 
 ****************************/



/****************************
 * focus to the dtxt, pointing
 * tinyMCE at it
 ****************************/
 .mouseover()
 
/****************************
 * unfocus unpoint tinyMCE
 ****************************/
 .mouseoff()



/*****************************
 * re-position the dtxt by
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

/*****************************
 *  This method is chainable-
 *  it returns a jQuery to the
 *  fresh dimg:
 *****************************/
return d;
}







