$.extend($.prototype,{

resizeByCorners: function(newCorners){
    this.offset({
         left :newCorners.UL.x,
         top  :newCorners.UL.y,
         })
         .width (newCorners.BR.x - newCorners.UL.x)
         .height(newCorners.BR.y - newCorners.UL.y);
},//resizeByCorners


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
	if(cbs.intra  == undefined) cbs.intra =function(){};
	if(cbs.post   == undefined) cbs.post  =function(){};

	// start is a set of additional constraints for the
	// drag. All must be met to start the drag.
	// mousedown, on the right element, shift key pressed...(AND)
	if(cbs.start == undefined) cbs.start = [];
	
	// term is a set of additional conditions for ending
	// the drag. If any of the conditions are met, the drag will end.
	// mouseup, off the element, shift key released...(OR)
	if(cbs.term   == undefined) cbs.term = [];



	this.mousedown(function(e){
		// mousedown triggers a check
		// for dragging:
		// is the left mouse button clicked?
		// are _all_ the other start conditions met?
		if(e.which != 1) return;
		for(var i in cbs.start)
			if(!cbs.start[i](e)) return;

		//////////////
		// INTRA-DRAG
		//////////////
			// Stop default event effects
			e.preventDefault();
			e.stopPropagation();

			// initialize cbs._
			// (storage member)
			cbs._ = {};
		
			// pre-drag callback
			cbs.pre(e);
		
		//////////////
		// POST-DRAG
		//////////////
		$(document).bind('mouseup.kietzDragTweak',function(e){
			// Stop default event effects
			e.preventDefault();
			e.stopPropagation();
			
			// post-drag callback
			cbs.post(e);
				
			// at drag end, unbind 
			// intra from mousemove
			// and delete cbs._ 
			delete cbs._;
			$(document).unbind('.kietzDragTweak');
			});//mouseup

		//////////////
		// INTRA-DRAG
		//////////////
		$(document).bind('mousemove.kietzDragTweak',function(e){
			// Stop default event effects
			e.preventDefault();
			e.stopPropagation();
			
			// intra-drag callback
			cbs.intra(e);
			
			// check for drag ending:
			// releasing the left mouse button would 
			// have triggered a mouseup, so we don't
			// need to worry about it.
			// is _any_ of the other end conditions met?
			for(var i in cbs.term)
				if(!cbs.term[i](e))
					$(document).trigger('mouseup');
			});//mousemove
			
			
			
		});//mousedown
	return this;
},//drag


dragAndDrop: function(dropCallback){
	// bind a drag-and-drop event
	// with a callback for the drop

	// NB:	this *is* a proper drag event-
	//	it will not trigger unless some
	//	data is being dragged
	//	(Ex: files from a file browser)
	this.bind('dragover',function(e) {
		e.stopPropagation();
		e.preventDefault();
		});//bind('dragover'

	this.bind('drop',function(e) {
		e.stopPropagation();
		e.preventDefault();

		dropCallback(e);
		});//bind('drop'
	return this;
},//dragAndDrop


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
	// Flatten an arbitrary object for $.post 
	// PHP's $_POST variable will have the same structure:
	/*	
	JavaScript:
	///////////
	var a = paramsPOST({	"w1":"hello",
				"w2":["world","!"]   });
		$.post("whatev.php",a);

	PHP $_POST:
	////////////
	array(	"w1"=>"hello",
		"w2"=>array("world","punc")  );
	*/

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










// I would really like it if there
// were a more elegant way to jQuery
// SVG.
generatePopAroundMenu = function(e,entries){
	var s = '', d = '', r = 20, R = 200, angle_i = 0, angle_f = 0, angle_margin = Math.PI/180*-3;
	s += '<svg version = "1.1">';
	s += '<g id="popAroundMenuG">';
	
	// hack:
	// add a <path> for each entry
	// (we'll edit them later with jQuery)
	for(var i in entries) 
		s += '<path />';
		
	// clean-up circles
	s += '<circle cx='+e.pageX+' cy='+e.pageY+' r='+(r+5)+' fill="white" />';
	s += '<circle cx='+e.pageX+' cy='+e.pageY+' r='+(R)+' fill="none" stroke="white" stroke-width="5" />';
	s += '</g></svg>';
	$('body').append(s);
	var path = $('g#popAroundMenuG').children();


	// generate a wedge for each entry:
	for(var i in entries){
		angle_f += Math.PI/180*entries[i].angle;
		var ci = Math.cos(angle_i),
			si = Math.sin(angle_i),
			cf = Math.cos(angle_f),
			sf = Math.sin(angle_f);
		
		d = '';
		d += ' M '+e.pageX+' '+e.pageY+' ';
		
		d += ' m '+parseInt(R*ci)+
			 '   '+parseInt(R*si);
		d += ' a '+R+' '+R+' 0 0 1 '+
			 ' '+parseInt(R*(cf-ci))+
			 ' '+parseInt(R*(sf-si));
		
		d += ' l '+parseInt((r-R)*cf)+
			 '   '+parseInt((r-R)*sf);;
		d += ' a '+r+' '+r+' 0 0 0 '+
			 ' '+parseInt(r*(ci-cf))+
			 ' '+parseInt(r*(si-sf));

		d += ' Z ';
		
		$(path[i]).attr({
			d				:d,
			fill			:'blue',
			stroke			:'white',
			'stroke-width'	:'1',
		});
		angle_i = angle_f + angle_margin;
	};//for

/*	var angle = 0;
	$('<div id="popAroundMenuRoot" />').appendTo('body').offset({top:100,left:100});
	for(var i in entries) {
		entries[i].label
			.appendTo('div#popAroundMenuRoot')
			.css({
				'position'                 :'absolute',
				'-webkit-transform'        :'rotate('+angle+'deg)',
				'-webkit-transform-origin' :'0 0',
			})//css
			.click(entries[i].callback)
			.click(function(e){$('div#popAroundMenuRoot').remove();});

		angle += entries[i].angle;
		};//for
*/
}//generatePopAroundMenu
