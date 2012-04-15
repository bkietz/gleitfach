/*****************************

gleitfach © Ben Kietzman, 2011

(Creative Commons Attribution-NonCommercial-ShareAlike —
 http://creativecommons.org/licenses/by-nc-sa/3.0
 I'm not opposed to commercial projects using my software
 but I'd like to be told of them first)


 * gleitfach is a barebones HTML editing system.
 * (German for 'sliding box' - rhymes with kite-Bach)
 *****************************/
gleitfach = {

//$('<style/>').appendTo('head').text('img { border:5px solid black }')


init: function(startingParent){
if(startingParent);
else startingParent = 'body';
$(startingParent).addClass('gleitfach_EditorParent');
	
/*****************************
 * jQuery selectors etc, declared
 * for expedient event binding
 *****************************/
 
  gleitfach.parent      = '.gleitfach_EditorParent';
  gleitfach.child       = '.gleitfach_EditorParent	>*';
  gleitfach.child_image = '.gleitfach_EditorParent	>div>img.gleitfach_image';
  gleitfach.text        = '.gleitfach_EditorParent	>div[contenteditable]';
  gleitfach.overlayEl   = gleitfach.overlayInit();
  gleitfach.menu        = gleitfach.menuInit();
  



/***************************
 * OVERLAY an element by holding
 * shift and moving the mouse over it
 ***************************/
$(document).on('mousemove',gleitfach.child,function(e){
	if( e.shiftKey && !e.ctrlKey && !e.altKey)	gleitfach.overlay(this);
	if(!e.shiftKey && !e.ctrlKey && !e.altKey)	gleitfach.overlayEl.hide();
});
//S-mousemove



/***************************
 * Open pop-around MENU
 * @ the mouse with middleclick
 ***************************/
$(document).on('mousedown',function(e){
	 if(e.button==1 && !e.shiftKey && !e.ctrlKey && !e.altKey); else return;
	 
	 e.preventDefault();
	 e.stopPropagation();
	 
	 gleitfach.overlaid = e.target;
	 $(gleitfach.menu)
		.detach().appendTo('body').show()
		.offset({left:e.pageX-100,top:e.pageY-100});
});
//click(1)



/*****************************
 * REPOSITION an element 
 * 	The element will track with the mouse
 *****************************/
$(gleitfach.child)
  .drag({	  
      viv:[
   		function(e){return (e.gleitfachDragMode=='re-position')},
		],//viv

	  pre:function(e,c){
		c._ = {
		    mouse:	{x:e.pageX,	y:e.pageY,},
			corner:	$(this).offset(),
			};//c._
		},//pre

      inter:function(e,c){
		$(this).offset({
			top: (c._.corner.top  + e.pageY-c._.mouse.y),
			left:(c._.corner.left + e.pageX-c._.mouse.x)
			});//offset
		},//inter

  });
//drag-reposition



/*****************************
 * CROP the an element
 *  The nearest corner will track with the mouse
 *****************************/
$(gleitfach.child)
  .drag({
      viv:[
        function(e){return (e.gleitfachDragMode=='re-size')},
		],//viv

	  pre:function(e,c){
		c._.quadrant =	(e.pageY < $(this).corners('center').y? 'T':'B')+
						(e.pageX < $(this).corners('center').x? 'L':'R');
		c._.corner = $(this).corners(c._.quadrant);
		},//pre

	  inter:function(e,c){
		$(this).corners(c._.quadrant,{x:e.pageX,y:e.pageY});
		},//inter

  });
//drag-resize
  


/***************************
 * Now implement the IMAGE functionality
 * (so that the image position remains
 *  absolute even when TL is being cropped) 
 ***************************/
$(gleitfach.child_image)
 .drag({
      viv:[
        function(e){return (e.gleitfachDragMode=='re-size')},
		],//viv

	  pre:function(e,c){
		console.log(this);
		c._.quadrant =	(e.pageY < $(this).corners('center').y? 'T':'B')+
						(e.pageX < $(this).corners('center').x? 'L':'R');
		c._.crop= {	x:parseInt($(this).chldren().offset().left),
					y:parseInt($(this).chldren().offset().top)	};
		c._.corner = $(this).corners(c._.quadrant);
		},//pre

	  inter:function(e,c){
		
		console.log('yo');
			$(this).children().offset({
				 top:	(c._.quadrant[0]=='T')?
							c._.crop.y - e.pageY + c._.corner.y:c._.crop.y,
				 left:	(c._.quadrant[1]=='L')?
							c._.crop.x - e.pageX + c._.corner.x:c._.crop.x,
				});
	
		},//inter

  });
//drag-resize
/*
$(gleitfach.child_image)
 .drag({
      viv:[
        function(e){return (e.gleitfachDragMode=='re-size')},
		],//viv

	  pre:function(e,c){
		c._.quadrant =	(e.pageY < $(this).corners('center').y? 'T':'B')+
						(e.pageX < $(this).corners('center').x? 'L':'R');
		c._.crop= {	x:parseInt($(this).css('background-position-x')),
					y:parseInt($(this).css('background-position-y'))	};
		c._.corner = $(this).corners(c._.quadrant);
		},//pre


	  inter:function(e,c){
		if(c._.quadrant[0] == 'T')
			$(this).css('background-position-y',
				c._.corner.y - e.pageY + c._.crop.y);
		
		if(c._.quadrant[1] == 'L')
			$(this).css('background-position-x',
				c._.corner.x - e.pageX + c._.crop.x);
		},//inter

  });
//drag-resize
*/



/*****************************
 * Raise/lower the gleitfach by
 * holding down only shift 
 * during mousewheeling
 *****************************/
$(document)
  .on('mousewheel',gleitfach.child,
	function(e){
		if( e.shiftKey && !e.ctrlKey && !e.altKey);
		else return;

		e.stopPropagation();
		e.preventDefault();

		if(e.originalEvent.wheelDelta>0 && $(this).next().length)
			$(this).next().after($(this).detach());

		if(e.originalEvent.wheelDelta<0 && $(this).prev().length)
			$(this).prev().before($(this).detach());
		
  });//S-mousewheel
//S-mousewheel
  
  

/***************************
 * instantiate a gleitfach_img 
 * by dropping an IMAGE into
 * the editor area 
 ***************************/
 var reader = new FileReader();
 reader.onload = function(e){
	gleitfach.src(
		e.target.result
		 .replace('data:base64,',
				  'data:'
					+ e.target.fileType + 
				  ';base64,'),
		{width:600,height:600});
 };

 $('.gleitfach_EditorParent')
 .drop({
	postDrop:	function(e){
		var dropped_files = e.originalEvent.dataTransfer.files;
	
		for(var i=0,f; f=e.originalEvent.dataTransfer.files[i]; ++i){
			reader.fileName = f.name;
			reader.fileType = f.type;
			reader.readAsDataURL(f.webkitSlice());
		};//for
	 }, 
	preDrop:	function(e){
		console.log(e,e.originalEvent.dataTransfer.files,e.originalEvent.dataTransfer.items,e.originalEvent.dataTransfer.items.item());
		return true;
	 }
 });
//drop



/***************************
 * open a TEXT editable <div/> 
 * by holding shift and clicking 
 * where you want to start typing
 ***************************/
 $(document).on('dblclick',gleitfach.parent,function(e){
	 if(e.button==0 && e.shiftKey && !e.ctrlKey && !e.altKey); else return;
	
	 
	 $('<div/>')
		.appendTo(gleitfach.parent)
		.attr('contenteditable','true')
		.css('position','absolute')
		.offset({left:e.pageX,top:e.pageY})
		.height(100).width(200)
		.focus();
 });
 //S-dblclick
 $(document).on({
	 mouseenter:function(){
					$(this).attr('contenteditable','true');
					  this.focus();
					  },
	 mouseleave:function(){
					$(this).attr('contenteditable','false');
					  this.blur();
					  },
	},gleitfach.text);
 //hover



/***************************
 * DELETE an element by holding
 * ctrl and double clicking
 ***************************/
 $(document).on('dblclick',gleitfach.child,function(e){
	 if(e.button==0 && e.shiftKey && e.ctrlKey && !e.altKey); else return;

	 e.preventDefault();
	 e.stopPropagation();

	 $(this).remove();
 });
//C-dblclick



/***************************
 * TOGGLE gleitfach activity
 * with Ctrl-E
 ***************************/
 $(document).on('keypress',function(e){
	 if(e.charCode==5 && !e.shiftKey && e.ctrlKey && !e.altKey); else return;

	 e.preventDefault();
	 e.stopPropagation();

	 $(	'.gleitfach_EditorParent , .gleitfach_EditorParent_inactive').toggleClass
		('gleitfach_EditorParent', 'gleitfach_EditorParent_inactive');
 });
//C-e

},


/***************************
 * helper functions:
 ***************************/
src: function(src,srcDimensions){
// auto-create a gleitfach with an image in it

var generateDiv = function(size){	
	return $("<div />")
	.appendTo(gleitfach.parent)
	.addClass('gleitfach_img')
	.css({

		'z-index'	: 0,

	'background-size'		: size.width+' '+size.height,
	'background-image'		:'url('+src+')',
	'background-position'	:'0 0',

		left		: 0,
		top			: 0,
		position	: 'absolute',
		height		: size.height,
		width		: size.width,
		
		})//css
	.attr({
		height_0	: size.height,
		width_0		: size.width,
		
		});//attr
};//generateDiv

if(srcDimensions == undefined) {
	// find the dimensions of the image @ src
	var ret;//how do I *not* use ret?
	$('<img src="'+src+'" />')
			.appendTo('body')
			.load(function(){
				ret = generateDiv({
						height:	$(this).height(),
						width:	$(this).width()
						});
				$(this).remove();
				});//load
	 return ret;	}//if
else return generateDiv(srcDimensions);
},//gleitfach.src()



txt: function(txt,txtDimensions){
// auto-create a gleitfach with a text editability in it

if(txtDimensions == undefined) {
	var l = Math.floor(Math.sqrt(txt.length)*10);
	var txtDimensions = {height:Math.max(100,l),width:Math.max(100,l)};	}
	
/*****************************
 *  This method is chainable-
 *  it returns a jQuery to the
 *  fresh gleitfach:
 *****************************/
return $("<div />")
  .appendTo(gleitfach.parent)
  .addClass('gleitfach_txt')
  .attr({
      contenteditable : 'true',
      height_0	: txtDimensions.height,
      width_0	: txtDimensions.width,
    })//attr
  .css({

	  'z-index'	: 0,
	  
	  left		: 0,
	  top		: 0,
      height	: txtDimensions.height,
      width		: txtDimensions.width,
	  position	: 'absolute',

	  'overflow-y': 'auto',
	  'overflow-x': 'hidden'
	})//css
  .html(txt);
  
},//gleitfach.txt()




menuInit: function(){
	return $('<div/>')
				.css('position','absolute')
				.load('images/popAroundMenu.svg')
				.attr('id','gleitfach_EditorMenu')
				.prependTo('body')
				.mouseleave(function(e){$(this).hide()})
				.mousedown( function(e){
					$(gleitfach.menu).hide();
					e.preventDefault();
					e.stopPropagation();
					
					/***************************
					 * Select a NEW PARENT element
					 * with double middleclick
					 ***************************/

					$(gleitfach.parent  ).removeClass(	gleitfach.parent.slice(1)	);
					$(gleitfach.overlaid).addClass(		gleitfach.parent.slice(1)	);
					})
				.hide();
					
					
			},//menuInit
overlay: function(element){
	gleitfach.overlayEl
		.show().detach().appendTo(element)
		.css('position','absolute')
		.offset(  $(element).offset()   )
		.width(   $(element).width()    )
		.height(  $(element).height()   );
	gleitfach.overlaid = $(element).blur()[0];
},
overlayInit: function(){
	return $('<div/>')	.prependTo('body')
						.attr('id','gleitfach_overlay_root')
						.append('<div/><div/><div/><div/><div/><div/><div/><div/>')//8
						.hide()
						.on('mouseleave',function(){$(this).hide()})//.detach().prependTo('body')})
						.on('mousedown',function(e){
				
							if( e.target.id == 'gleitfach_overlay_root' )
								// center
								e.gleitfachDragMode = 're-position';

							else switch($(e.target).prevAll().length){
								// corners
								case 0:
								case 4:
								case 2:
								case 6:
									e.gleitfachDragMode = 're-size';
									break;
									
								// sides
								case 5:
								case 3:
								case 7:
								case 1:
								e.gleitfachDragMode = 're-size';
									break;
							};

							$(gleitfach.overlaid).trigger(e);
							$(gleitfach.overlayEl).trigger('mouseleave');
							e.preventDefault();
							e.stopPropagation();
							return;	
						});//mousedown
},

};//gleitfach




