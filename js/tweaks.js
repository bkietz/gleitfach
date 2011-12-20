$.extend($.prototype,{


drag: function(cbs){
	// bind a drag event with callbacks for
	// the start of the drag,
	// during the drag,
	// after the drag is released,
	// and a prebinding check for
	// Ctrl-Shift presses and such

	// NB:	javascript has drag events,
	// 	but this should not properly 
	//	be considered one of them 
	//	because no data (image, text, files...)
	//	is being dragged. 

	// cbs is an object containing
	// from 0 to all of the callbacks
	// available.
	// Set the undefined to null functions.
	if(cbs.start  == undefined) cbs.start =function(){};
	if(cbs.during == undefined) cbs.during=function(){};
	if(cbs. end   == undefined) cbs. end  =function(){};

	// pre is an additional constraint for the
	// drag, to be called before event propagation is stopped,
	// like having the shift key held down or something.
	// It defaults to true:
	if(cbs.pre == undefined) cbs.pre=function(){return true;};

	// remember is a function which determines
	// what data from the original event will be 
	// available to the callbacks later, as cbs._
	if(cbs.remember == undefined) cbs.remember=function(){};
	
	this.mousedown(function(e){
		if(!cbs.pre(e)) return;
		e.preventDefault();
		e.stopPropagation();

		cbs._ = cbs.remember(e);
		cbs.start(e);

		cbs.during(e);		
	});//mousedown

	this.mousemove(function(e){
		if(!cbs.pre(e)) return;
		// also make sure the left mouse key is depressed
		if(e.which != 1) return;

		cbs.during(e);
	});//mousemove

	this.mouseup(function(e){
		if(!cbs.pre(e)) return;
		// pre is not checked-
		// any mouseup at all
		// will cause the end
		// of the drag
		e.preventDefault();
		e.stopPropagation();

		cbs.end(e);
		delete cbs._;
	});//mouseup

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

