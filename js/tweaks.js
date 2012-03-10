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

corners: function(targetCorner, setValue, oppositeSetValue){
/*********************
 * $('').corners() gets/sets the positions
 *  of the queried element's corners/center.
 * 
 * corners are indicated with two characters,
 * the first denoting vertical and the second
 * horizontal position: 'TL' = top left, etc.
 * 
 * If a corner alone is specified, corners()
 * returns the position of that corner 
 * formatted: {x:304,y:345}
 * 
 * If a corner is specified with two positions,
 * the element is positioned and resized such
 * that the specified corner is placed at the 
 * first position, and the corner opposite it
 * at the second.
 * 
 * If no arguments are provided, all corners'
 * positions are returned in a single object.
 * 
 * If only one position is given, the opposite
 * corner is held constant.
 * 
 ***********************/

	// no arguments:
	if(targetCorner == undefined)
			return {TL:this.corners('TL'),
					TR:this.corners('TR'),
					BL:this.corners('BL'),
					BR:this.corners('BR'),
				center:this.corners('center')};


	// targetCorner only:
	if(setValue == null) {
	var ret = {};
	
	if(targetCorner[0] == 'T')
		ret.y = this.offset().top;
	else
		ret.y = this.offset().top + this.height();
		
	if(targetCorner[1] == 'L')
		ret.x = this.offset().left;
	else 
		ret.x = this.offset().left + this.width();
		
	if(targetCorner == 'center')
		ret = {	x:this.offset().left + parseInt(this.width() /2) ,
				y:this.offset().top  + parseInt(this.height()/2) };
				
	return ret;
	}//	if(setValue == null)




	var newCSS = {};
	
	if(targetCorner[0] == 'T'){
		newCSS.height = this.offset().top - setValue.y + this.height();
		newCSS.top 	  = setValue.y;
	} else {
		newCSS.height = setValue.y - this.offset().top;
	}//vertical

	if(targetCorner[1] == 'L'){
		newCSS.width = this.offset().left - setValue.x + this.width();
		newCSS.left  = setValue.x;
	} else {
		newCSS.width = setValue.x - this.offset().left;
	}//horizontal

	this.css(newCSS);
	
	if(oppositeSetValue != undefined)
		this.corners(
			(targetCorner[0] == 'T'?'B':'T')+
			(targetCorner[1] == 'L'?'R':'L'),
		
			oppositeSetValue);
	
	return this;
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







