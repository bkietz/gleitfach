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
*/

var dimg = {c:0};

dimg = function(){}

//what is given to seed the image?
// src?
// $(..)?
// id?
dimg.create = function(src){

  var d = new dimg();
  d.imgID = "dimg_img_"+(dimg.c);
  d.divID = "dimg_div_"+(dimg.c);
  dimg.c++;

  $("<img src="+src
	+" id="+d.imgID
	+" class=dimg_img />")
  .wrap("<div id="+d.divID
	+" class=dimg_div />")
  .parent()
  .css('overflow','hidden')
  .appendTo('body');


  f = function(e,start){
	console.log(e);  
	$(e.currentTarget)
		.offset(
			// Do some paper work to figure
			// out what this should be.
			// It currently resets the image
			// to 0,0 before dragging.
			{top:(e.pageY-start.y),
			left:(e.pageX-start.x)}
			);}

  d.div().drag(null,f,null,function(e){return e.shiftKey;});//drag

  return d;	
}

dimg.prototype = {

img: function(){return $('#'+this.imgID);},
div: function(){return $('#'+this.divID);},




}

var d = dimg.create('images/airgear.jpg');
