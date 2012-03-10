/*****************************

gleitfach © Ben Kietzman, 2011

(Creative Commons Attribution-NonCommercial-ShareAlike —
 http://creativecommons.org/licenses/by-nc-sa/3.0
 I'm not opposed to commercial projects using my software
 but I'd like to be told of them first)


 * gleitfach is a barebones HTML editing system.
 * (German for 'sliding box' - rhymes with kite-Bach)
 *****************************/
gleitfach = {};



gleitfach.init = function(startingParent){
if($(startingParent).addClass('gleitfach_EditorParent').length){
	
/*****************************
 * jQuery selectors etc, declared
 * for expedient event binding
 *****************************/
 
  gleitfach.parent	= '.gleitfach_EditorParent';
  gleitfach.child	= '.gleitfach_EditorParent	>*';
  gleitfach.image	= '.gleitfach_EditorParent	>div>img';
  gleitfach.text	= '.gleitfach_EditorParent	>div[contenteditable=true]';
  gleitfach.demis	= $('<div/>').load('images/demiQuadrants.svg');
  gleitfach.menu	= $('<div/>').css('position','absolute')
								 .load('images/popAroundMenu.svg');
  gleitfach.current = $(gleitfach.parent)[0];

}
else return;



/*****************************
 * REPOSITION an element by
 * holding down no metakeys 
 * during a drag
 * 	The element will track with the mouse
 *****************************/
$(gleitfach.child)
  .drag({	  
      viv:[
		function(e){return !e.shiftKey},
		function(e){return !e.ctrlKey},
		function(e){return !e.altKey}
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
//drag



/*****************************
 * CROP the an element by
 * holding down only ctrl
 * during a drag
 * 		The lower right corner will track with the mouse
 *****************************/
$(gleitfach.child)
  .drag({
      viv:[
		function(e){return !e.shiftKey},
		function(e){return  e.ctrlKey},
		function(e){return !e.altKey}
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
//C-drag
  
  
  
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
 * Now implement the IMAGE functionality
 * (so that the image position remains
 *  absolute even when TL is being cropped) 
 ***************************/
 $(gleitfach.child+'.gleitfach_img')
 .drag({
      viv:[
		function(e){return !e.shiftKey},
		function(e){return  e.ctrlKey},
		function(e){return !e.altKey}
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

  });//C-drag
//C-drag



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
				 ';base64,'));
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
//		console.log(e,e.originalEvent.dataTransfer.files,e.originalEvent.dataTransfer.items,e.originalEvent.dataTransfer.items.item());
		return true;
	 }
 });
//drop



/***************************
 * open a TEXT editable <div/> 
 * by holding shift and clicking 
 * where you want to start typing
 ***************************/
 $(document).on('mouseover',gleitfach.text,function(e){this.focus();});
 $(document).on('click',gleitfach.parent,function(e){
	 if(e.shiftKey && !e.ctrlKey && !e.altKey); else return;
	
	 
	 $('<div/>')
		.appendTo(gleitfach.parent)
		.attr('contenteditable','true')
		.offset({left:e.pageX,top:e.pageY})
		.height(100).width(200)
		.focus();
 });
//S-click



/***************************
 * DELETE an element by holding
 * ctrl and double clicking
 ***************************/
 $(document).on('dblclick',gleitfach.child,function(e){
	 if(!e.shiftKey && e.ctrlKey && !e.altKey); else return;

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



/***************************
 * Open pop-around MENU
 * @ the mouse with middleclick
 ***************************/
 $(document).on('click',function(e){
	 if(e.button==1 && !e.shiftKey && !e.ctrlKey && !e.altKey); else return;

	 e.preventDefault();
	 e.stopPropagation();

	 gleitfach.menu
		.appendTo('body')
		.show()
		.offset({
				left:	e.pageX-100,
				top:	e.pageY-100
				});
				
				
				//////////////////////
				// PUT THE MENUS ELSEWHERE!
				
				
	/***************************
	 * Select a NEW PARENT element
	 * with double middleclick
	 ***************************/
	 gleitfach.menu
		.find('g>circle')
		.click(e,function(e){
			 if(e.button==1 && !e.shiftKey && !e.ctrlKey && !e.altKey); else return;

			 e.preventDefault();
			 e.stopPropagation();

			 var preMenuTarget = e.data.target;
			 gleitfach.menu.hide();
			 			 
			 $(gleitfach.parent).removeClass(	gleitfach.parent.slice(1)	);
			 $(preMenuTarget).addClass(			gleitfach.parent.slice(1)	);
			});
		
	 gleitfach.menu
		.find('g:eq(0)')
		.click(function(e){console.log('TL',e)});
	
 });
//click(1)



/***************************
 * helper functions:
 ***************************/
gleitfach.src = function(src,srcDimensions){
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
};//gleitfach.src()



gleitfach.txt = function(txt,txtDimensions){
// auto-create a gleitfach with a text editability in it

if(txtDimensions == undefined) {
	var l = Math.floor(Math.sqrt(txt.length)*10);
	var txtDimensions = {height:Math.max(100,l),width:Math.max(100,l)};
}





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
  
  
};



gleitfach.demiQuadrantOverlay = function(element){
	
	gleitfach.demis
		.appendTo('body')
		.offset(  $(element).offset()  )
		.width(   $(element).width()   )
		.height(  $(element).height()  )
		.find('svg')
		.offset(  $(element).offset()  )
		.find('use#actual')
		.attr({	opacity:	0.4,
				transform:'scale('+	$(element).width()/4
							  +','+	$(element).height()/4	+')'
			});

	// this should be put in a stylesheet somewhere...
	gleitfach.demis.find('#composite>use:odd [xlink:href="#demiQuadrant"][transform]').attr('fill','white');
	gleitfach.demis.find('#composite>use:even[xlink:href="#demiQuadrant"][transform]').attr('fill','blue');
	
};	 



};//gleitfach.init





