fingerframe = {};
/*****************************
 * fingerframe defines a class of DOM element
 * with event bindings for basic
 * mouse interaction with a div:
 * 
 * 		S-drag = move the div
 * 		C-drag = crop the div
 * 
 * The fingerframe has subclasses
 * for allowing an img within 
 * to be cropped/scaled/rotated/etc.
 * for allowing tinyMCE instantiation
 * for a canvas painter or flash video...
 * 
 * This should possibly, in the future, 
 * be an iframe or something with more
 * gravitas than a div.
 ******************************/

fingerframe.init = function(){

//load tinyMCE first
tinyMCE.init({ 
	theme : "advanced",

	theme_advanced_buttons3_add : "nonbreaking",
	nonbreaking_force_tab : true,
	plugins : "nonbreaking",

	mode    : "none"
  });


/*****************************
 * double clicking will reset the fingerframe
 *****************************/
$(document).on('dblclick','div.fingerframe',
function(e){
	  $(this).css({
			top:	0,
			left:	0,
			height:	$(this).attr('height_0'),
			width:	$(this).attr('width_0'),
			'background-position':'0 0'
			});
  })//dblclick



$('div.fingerframe')
/*****************************
 * RE-POSITION the fingerframe by
 * holding down only shift 
 * during a drag
 * 	The div will track with the mouse
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

  })//S-drag




/*****************************
 * CROP the fingerframe by
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
		c._.quadrant =	(e.pageY < this.corners('center').y? 'T':'B')+
						(e.pageX < this.corners('center').x? 'L':'R');
		c._.corner = this.corners(c._.quadrant);
		},//pre


	  inter:function(e,c){
		this.corners(c._.quadrant,{x:e.pageX,y:e.pageY});
		},//inter

  });//C-drag
  
  
  
  
/***************************
 * Now implement the IMAGE functionality
 * (so that the image position remains
 *  absolute even when TL is being cropped) 
 ***************************/
 $('div.fingerframe.fingerframe_img')
 .drag({
      viv:[
		function(e){return !e.shiftKey},
		function(e){return  e.ctrlKey},
		function(e){return !e.altKey}
		],//viv

	  pre:function(e,c){
		c._.quadrant =	(e.pageY < this.corners('center').y? 'T':'B')+
						(e.pageX < this.corners('center').x? 'L':'R');
		c._.crop= {	x:parseInt(this.css('background-position-x')),
					y:parseInt(this.css('background-position-y'))	};
		c._.corner = this.corners(c._.quadrant);
		},//pre


	  inter:function(e,c){
		if(c._.quadrant[0] == 'T')
			this.css('background-position-y',
				c._.corner.y - e.pageY + c._.crop.y);
		
		if(c._.quadrant[1] == 'L')
			this.css('background-position-x',
				c._.corner.x - e.pageX + c._.crop.x);
		},//inter

  });//C-drag
  
  
  
  
  
  
/***************************
 * Now implement the TEXT functionality
 * (so that tinyMCE can be instantiated) 
 ***************************/
$(document).on('click','div.fingerframe.fingerframe_txt',function(e){

	/*
instantiate tinyMCE:
    1. get the div's content
	2. place a textarea exactly on top of the div  (or polymorph the div...)
	3. instantiate tinyMCE for that textarea only
	4. set the editor's content
unstantiate:
    1. get the editor's content
    2. delete the editor
         (the editor has id=text_area_id + "_container" and class "mceEditor")
    3. set the div's content


   // need to make the styles jive

		//is there a better way that just instantiates the
		//editor from the div?
 
 tinyMCE.get('myTinyMCEinstanceNameID').getContent();		// gets the html content inside tinyMCE
 tinyMCE.get('myTinyMCEinstanceNameID').setContent('<p> yo </p>'); 

*/

 //var id_orig = $(this).attr('id');
 var id_temp = 'tinyMCE_editor_temporary_instantiating_identifier';

 $(this).attr('id',id_temp);
 // tinyMCE does not instantiate where it should...
 tinyMCE.execCommand('mceAddControl',false,id_temp);
 //id_orig == undefined ? 
 //$(this).removeAttr('id');
 //: $(this).attr('id',id_temp);

});//click


};//fingerframe.init







fingerframe.src = function(src,srcDimensions){
// auto-create a fingerframe with an image in it


// find the dimensions of the image @ src
var i = $('<img src="'+src+'" />').appendTo('body');
if(srcDimensions == undefined) 
	var srcDimensions = {height:i.height(),width:i.width()};
i.remove();



/*****************************
 *  This method is chainable-
 *  it returns a jQuery to the
 *  fresh fingerframe:
 *****************************/
return $("<div />")
  .appendTo('body')
  .addClass('fingerframe')
  .addClass('fingerframe_img')
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


};//fingerframe.src()






fingerframe.txt = function(txt,txtDimensions){
// auto-create a fingerframe with a text editability in it

if(txtDimensions == undefined) {
	var l = Math.floor(Math.sqrt(txt.length)*10);
	var txtDimensions = {height:Math.max(100,l),width:Math.max(100,l)};
}

/*****************************
 *  This method is chainable-
 *  it returns a jQuery to the
 *  fresh fingerframe:
 *****************************/
return $("<div />")
  .appendTo('body')
  .addClass('fingerframe')
  .addClass('fingerframe_txt')
  .attr({
      height_0	: txtDimensions.height,
      width_0	: txtDimensions.width,
    })//attr
  .css({
	  left		: 0,
	  top		: 0,
      height	: txtDimensions.height,
      width		: txtDimensions.width,
	  position	: 'absolute',

	  'overflow-y': 'auto',
	})//css
  .html(txt);
	
};




