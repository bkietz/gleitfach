/*********************

tweaks.js © Ben Kietzman, 2011

(Creative Commons Attribution-NonCommercial-ShareAlike —
 http://creativecommons.org/licenses/by-nc-sa/3.0
 I'm not opposed to commercial projects using my software
 but I'd like to be told of them first)
 



tweaks.js is a library of miscellaneous
jQuery tweaks and other functions.


$('').corners()		// gets/sets the positions of the
					// queried element's corners/center
					
$('').drag()	// adds bindings for events in 
				// a drag (start, end, etc.)
				
$('').serializeRequest()	// generate an Object from
							// a <form>'s values:
							// {field1:	value1,
							//  filed2:	value2
							//  ...}
							
$('').drop()		// adds bindings for drag&drop

$.paramsPOST()	// flattens an Object so that its
				// structure is preserved under POST
				
"hello".hexEncode()		// encode each ASCII to two
						// hexadecimal characters
						
 * 
 ***********************/
 
 
 
 

$.extend($.prototype,{

corners: function(){
/*********************
 * $('').corners() gets/sets the positions
 *  of the queried element's corners/center.
 *  
 * corners are indicated with two characters,
 * the first denoting vertical and the second
 * horizontal position: 'TL' = top left, etc.
 * 
 * Possible arguments:
 *********************
 * 
 * 'TL'
 * 	If only one string is input, return
 * 	the position of the specified corner
 * 	of this element.
 *  
 * 'BR',{x:100,y:120}
 * 	Move the specified corner of this 
 * 	element to the input position, without 
 * 	moving any other corners.
 * 
 * {x:100,y:120},{x:50,y:200} 
 * 	Move/resize the element so that two of 
 * 	its corners lie on the input positions.
 * 
 * {top:100,right:230,left:200}
 * 	Move/resize the element to satisfy the 
 * 	input conditions.
 * 
 * 100,200,300,400
 * 	Alias for 
 * 	{left:100,top:200,width:300,height:400}
 *
 * If no arguments are provided, all corners'
 * positions are returned in a single object.
 * 
 ***********************/

	

switch(typeof arguments[0]){

case 'undefined':
   return {	TL:this.corners('TL'),
		TR:this.corners('TR'),
		BL:this.corners('BL'),
		BR:this.corners('BR')	  };

case 'string':
	if(arguments.length == 1)
	// if only one argument is given, 
	// return the specified corner's position
	return {
		y:this.offset().top +
		  parseInt((arguments[0][0]=='T')?0:this.height()),
		x:this.offset().left +
		  parseInt((arguments[0][1]=='L')?0:this.width())
		};

	// if a position and a corner are specified,
	// conform the corner to that position. 
	var 	h = $(this).height(),		w = $(this).width(),
		x = arguments[1].x,		y = arguments[1].y,
		t = $(this).offset().top,	l = $(this).offset().left;

	if(arguments[0][0] == 'T')
		$(this).css({height:t+h - y,
				top:y	});
	else
		$(this).height(y-t);

	
	if(arguments[0][1] == 'L')
		$(this).css({  width:l+w - x,
				left:x	});
	else
		$(this).width(x-l);

      
	return this;

case 'object':
   if(arguments.length == 2)
   return this.corners(
		Math.min(arguments[0].x,arguments[1].x),
		Math.min(arguments[0].y,arguments[1].y),
		Math.abs(arguments[0].x-arguments[1].x),
		Math.abs(arguments[0].y-arguments[1].y));
   else return this.css(arguments[0]);

case 'number':
   return this.css({
		left:	arguments[0],
		top: 	arguments[1],
		width:	arguments[2],
		height:	arguments[3]	});

}//switch

},//corners







drag: function(cbs){
/*******************************
 * bind a drag event with callbacks for
 * the start of the drag,
 * during the drag,
 * after the drag is released,
 * and user defined checks for the
 * beginning and end of the drag
 * (Ctrl-Shift presses and such)
 * 
 * NB:	javascript has drag events,
 * but this should not properly 
 * be considered one of them 
 * because no data (image, text, files...)
 * is being dragged. 
 *******************************/
	// cbs is an object containing callbacks
	
	// should these be undefined,
	// set them to null functions
	if(cbs.pre    == undefined) cbs.pre   =function(){};
	if(cbs.inter  == undefined) cbs.inter =function(){};
	if(cbs.post   == undefined) cbs.post  =function(){};

	// storage member and the
	// input jQuery selector
	cbs._ = {};
	cbs.$ = this.selector;

	// viv() is a set of additional constraints for the
	// drag. All must be met to start the drag.
	// mousedown, on the right element, shift key pressed...(AND)
	if(cbs.viv  == undefined) cbs.viv  = [];
	
	// mort() is a set of additional conditions for ending
	// the drag. If any of the conditions are met, the drag will end.
	// mouseup, off the element, shift key released...(OR)
	if(cbs.mort == undefined) cbs.mort = [];
	
	
	if(cbs.radix == undefined) cbs.radix = {};
	cbs.radix.fn = function(e){
		// radix.fn() is to be called at
		// each mousedown- it triggers 
		// a check for dragging.
		
		// is the left mouse button clicked?
		// are _all_ the other start conditions met?
		if(e.which != 1) return;
		for(var i in cbs.viv)
			if(  !cbs.viv[i].call(this,e,cbs)  )	return;

		/*************
		 * PRE-DRAG
		 *************/
			// Stop default event effects
			e.preventDefault();
			e.stopPropagation();
		
			// pre-drag callback
			cbs.pre.call(this,e,cbs);
			
			$(document).one('mouseup',	{this:this},	cbs.mouseup);
			$(document).on('mousemove',	{this:this},	cbs.mousemove);
			};//cbs.radix.fn

		/*************
		 * POST-DRAG
		 *************/
		cbs.mouseup = function(e){
			// Stop default event effects
			e.preventDefault();
			e.stopPropagation();
						
			// post-drag callback
			cbs.post.call(e.data.this,e,cbs);
			
			// at drag end, unbind 
			// mousemove and mouseup
			$(document).off('mousemove',	cbs.mousemove);

			// empty cbs._
			cbs._ = {};

			};//mouseup

		/*************
		 * INTER-DRAG
		 *************/
		cbs.mousemove = function(e){
			// Stop default event effects
			e.preventDefault();
			e.stopPropagation();
			
			// inter-drag callback
			cbs.inter.call(e.data.this,e,cbs);
			
			// check for drag ending:
			/**	(we don't need to check for
				mouseup here- that's already 
				bound above)	**/
			// is _any_ of the other end conditions met?
			for(var i in cbs.mort)
				if(  cbs.mort[i].call($(cbs.$),e,cbs)  )
					$(document).trigger('mouseup');
					
			};//mousemove



	/**	radix.fn() is the only static binding, 
		so to fully unbind the drag:
		$(document).off('mousedown',externalRadixHandle.fn)	**/
	$(document).on('mousedown',this.selector,cbs.radix.fn);//mousedown
	return this;
},//drag




drop: function(callbacks){
	/*****************************
	 * bind a drag-and-drop event
	 * with a callback for the drop
	 * 
	 * NB:	this *is* a proper drag event-
	 * 		it will not trigger unless some
	 * 		data is being dragged
	 * 		(Ex: files from a file browser)
	 *****************************/
	return $(document).on({
		
		dragover:
		function(e) {
			e.stopPropagation();
			e.preventDefault();
		},//dragover

		drop:
		function(e) {
			if(	 callbacks.preDrop && 
				!callbacks.preDrop(e)  ) return;
			
			e.stopPropagation();
			e.preventDefault();

			callbacks.postDrop(e);
		},//drop
		
	},	this.selector);//on
},//drop




serializeRequest: function(){
	// serialize a <form> to the format 
	// of $.post()'s "data" argument
	var params = this.serializeArray();
	var ret = new Object();
	for(var i in params)	ret[params[i].name]=params[i].value;
	return ret;
},//serializeRequest

})//$.extend



$.paramsPOST = function(O,accumulator,path){
	/***************************
	 * Flatten an arbitrary object for $.post
	 * PHP's $_POST variable will have 
	 * the same structure:
	 
	//JavaScript:
	/////////////
	var a = paramsPOST({	"w1":"hello",
				"w2":["world","!"]   });
		$.post("whatev.php",a);

	//PHP $_POST:
	/////////////
	array(	"w1"=>"hello",
		"w2"=>array("world","punc")  );
	****************************/

	// if necessary, initialize the accumulator
	if(accumulator==null) var accumulator = new Object();


	for(var Name in O){
	   // loop through O's children
	   var child = O[Name];

	   // if a path is provided, it is
	   // prepended to Name in order to
	   // reproduce the object's structure
	   // on the far side of POST
	   if(path!=null)	var pathName = path + "['"+Name+"']";
	   else			var pathName = Name;

	   switch(typeof child){
		case "string":
		case "number":
		   // trivial
		   accumulator[pathName] = child;
		   break;
		case "object":
		   // Here we need to flatten child. Fortunately:
		   $.paramsPOST(child,accumulator,pathName);	// Does it nicely.
		   break;
	   };//switch	
	};//for

return accumulator;
};//$.paramsPOST




$.extend(String.prototype,{
hexEncode: function(){
	return this.split("")
		.map(function(c){return c.charCodeAt();})
		.map(function(n){return (n>=16)?  n.toString(16)
					  : '0' + n.toString(16);})
		.join("");
	},//hexEncode
	});//$.extend(String







