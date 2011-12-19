/*	dimg.js
                defines a javascript object
                to be assigned to each image
                It will allow basic mouse
                interaction with the image:
                        S-drag = move  the image
                        A-drag = scale the image
                        C-drag = crop  the image
                        ???    = attach an anchor
                                 to the image
                        ...
                To accomplish these degrees of
                freedom, each image will be
                stored as $("div>img.dimg#dimg12")
                or similar.


I don't actually need the javascript
shepherding object-
	The elements only need their attrs
	set appropriately (class, id, src, 
	event bindings...) so if I want to
	access them thereafter, I can just
	use jQuery. 
		Make dimg a function, not a class.
	
*/

var dimg = {c:0};
dimg = function(src){

  $("<img />")
  .attr({
      id   :	"dimg_img_"+(dimg.c++),
      src  :	src
    })
  .addClass("dimg_img")
  .wrap("<div />")
  .parent()
  .addClass("dimg_div")
  .css('overflow','hidden')
  .drag({
	  //Hold no buttons and drag
      pre:function(e){return !e.shiftKey;},

      remember:function(e){
		return {
			mouse:
			{x:e.pageX,
			 y:e.pageY,},
			corner:
			 $(e.currentTarget).offset(),};
		},//remember

      during:function(e){
		//console.log(this);
		// drag an image:
		// corner_i-mouse_i == corner_f-mouse_f
		// corner_f = corner_i+mouse_f-mouse_i
		$(e.currentTarget)
		.offset({top:(this.start_data.corner.top +e.pageY-this.start_data.mouse.y),
				left:(this.start_data.corner.left+e.pageX-this.start_data.mouse.x)});
		},//during

  })//.drag
  .drag({
	  //Hold shift only and drag
      pre:function(e){return e.shiftKey;},

      remember:function(e){
		return {
			mouse:
			{x:e.pageX,
			 y:e.pageY,},
			corner:
			 $(e.currentTarget).offset(),};
		},//remember

      during:function(e){
		//console.log(this);
		// drag an image:
		// corner_i-mouse_i == corner_f-mouse_f
		// corner_f = corner_i+mouse_f-mouse_i
		$(e.currentTarget)
		.offset({top:(this.start_data.corner.top +e.pageY-this.start_data.mouse.y),
				left:(this.start_data.corner.left+e.pageX-this.start_data.mouse.x)});
		},//during

  })//.drag
  .appendTo('body');


}

