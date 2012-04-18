/*****************************
 * gleitfach © Ben Kietzman, 2011
 * 
 * gleitfach is a barebones HTML editing system.



{d}='DOM Navigation'
   [click]         Select the clicked element
   [wheel-down]    Select the wheeled element
   [wheel-up]      Select the parent of the currently selected element
   [hover]         Display a border around elements which would be
                         selected on click, wheel-up, wheel-down

{t}='Translation'
   [drag]          An element can be dragged to a new position

{s}='Scaling'
   [drag]          An element can be dragged, scaling it
   [S-drag]        An element can be dragged, cropping it
   
{a}='Anchor'
   [click]         Generate an empty anchor at click

{n}='New Text'-----Switches to text editing after one action            
   [click]         Generate a text <div/> at the click
   [drag]          Generate a text <div/> with corners
                        at the start and end of the drag

{e}='Edit Text'----Keypresses do not switch modes until [S-Enter]
   [hover]         Allow the target's content to be edited. 
   [S-enter]       End text editing mode, revert to 'New Text'
   [drag&drop]     Drop the selected text into an anchor

{c}='Edit CSS'
   [hover]         Display style in an editable popup
   [S-hover]       Stickier popups for easier editing
   [click]         Menu for other options, pertaining to clicked element
   [S-click]       Menu for global CSS options

{o}='Alter DOM Order'-----Display numerals indicating the position
                          of all children in the selected element 
   [drag]          Interchange the elements at drag start and end
   [wheel]         Raise/Lower DOM order of the wheeled element
   [click]         Type in a new DOM position for the clicked element
   [S-click]       Menu for other options

 *****************************/
gleitfach = {

//$('<style/>').appendTo('head').text('img { border:5px solid black }')


init: function(startingParent){
if( 	$(startingParent).addClass('gleitfach_selected').length);
else 	        $('body').addClass('gleitfach_selected');

	
/*****************************
 * jQuery selectors etc, declared
 * for expedient event binding
 *****************************/
 
  gleitfach.child_image = '.gleitfach_selected	>div>img.gleitfach_image';
  gleitfach.text        = '.gleitfach_selected	>div[contenteditable]';
  gleitfach.overlayEl   = gleitfach.overlayInit();
  gleitfach.menu        = gleitfach.menuInit();
  gleitfach.current_mode = 'gleitfach_mode_inactive';


/***************************
 * mode switching:
 * 
 * A keypress event determines
 * the editor mode, which in 
 * turn determines which events
 * are bound to children of 
 * gleitfach_selected
 * 
 ***************************/
$(document).on('keypress',function(e){

  switch( e.charCode ){

    case 105: //'i' -> inactive
	var new_mode = 'gleitfach_mode_inactive';
	break;
	
    case 116: //'t' -> translate
	var new_mode = 'gleitfach_mode_translate';
	break;
		
    case 115: //'s' -> scale
	var new_mode = 'gleitfach_mode_scale';
	break;

    case 111: //'o' -> scale
	var new_mode = 'gleitfach_mode_reorder';
	break;

    case 110: //'n' -> new text
	var new_mode = 'gleitfach_mode_new_text';
	break;

    case 101: //'e' -> edit text
	var new_mode = 'gleitfach_mode_edit_text';
	break;
	
    case 99:  //'c' -> edit CSS
	var new_mode = 'gleitfach_mode_edit_css';
	break;
	
    case 114:  //'r' -> delete
	var new_mode = 'gleitfach_mode_delete';
	break;
	
    case 100: //'d' -> navigate
	var new_mode = 'gleitfach_mode_navigate';
	break;

    default:
        return;
  };//switch

//switch to the new mode
$('.gleitfach_selected')
	.removeClass(gleitfach.current_mode)
	.addClass(new_mode);
gleitfach.current_mode = new_mode;

});
//keypress-modeswitch



/*****************************
 * TRANSLATE mode:
 * 
 * The element will track 
 * with the mouse during drag.
 * 
 *****************************/
$(document).on( 'mouseenter',
		'.gleitfach_mode_translate > :not(.gleitfach_actual_translate)',
		function(e){
			gleitfach.overlay(this);
		});
//hover-translate

$('.gleitfach_actual_translate')
  .drag({	  

	pre:  function(e,c){
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

	post: function(){
		$(this).removeClass('gleitfach_actual_translate');
		},//post

  });
//drag-translate



/***************************
 * SCALE mode:
 * 
 * Where the drag starts within 
 * the element determines which
 * corner will track with the mouse.
 * 
 ***************************/
$(document).on( 'mouseenter',
		'.gleitfach_mode_scale > :not(.gleitfach_actual_scale)',
		function(e){
			gleitfach.overlay(this);
		});
//hover-scale

$('.gleitfach_actual_scale')
  .drag({

	pre:  function(e,c){
		c._.quadrant = $(this).data('gleitfach_overlay_corner');
		c._.wrapper  = $(this).wrapInner('<div/>').children()[0];
		c._.offset   = $(c._.wrapper).offset();
		},//pre

	inter:function(e,c){
		$(this).corners(c._.quadrant,{x:e.pageX,y:e.pageY});
		
		// for cropping, I need to either store all the 
		// children's offsets or wrapInner them in a 
		// temporary <div/> to hold the offset
		
		console.log('left',$(this).offset().left,'top',$(this).offset().top);
		
		if(e.shiftKey) return;
		$(c._.wrapper).offset(c._.offset);
		},//inter

	post: function(e,c){
		var w = $(c._.wrapper).offset();
		var t = $(this).offset();
		$(c._.wrapper).contents().unwrap();

		$(this)	.removeClass('gleitfach_actual_scale')
			.removeData( 'gleitfach_overlay_corner');
			
		if(e.shiftKey) return;
		$(this) .contents()
			.offset(function(i,v){return {
				top: v.top  + w.top  - t.top,
				left:v.left + w.left - t.left
				}});
				
		},//post

  });
//drag-scale
  




/***************************
 * CSS editing mode:
 * 
 * Open pop-around MENU
 * @ the mouse with a click
 * 
 ***************************/
$(document).on('mousedown','.gleitfach_mode_edit_css > *',function(e){
 
	 e.preventDefault();
	 e.stopPropagation();
	 
	 gleitfach.overlaid = e.target;
	 $(gleitfach.menu)
		.detach().appendTo('body').show()
		.offset({left:e.pageX-100,top:e.pageY-100});
	
});
//click





/*****************************
 * RE-ORDER mode:
 * 
 * Raise/lower the gleitfach in
 * DOM order with the mousewheel
 * 
 *****************************/
$(document)
.on('mousewheel','.gleitfach_mode_reorder > *',
    function(e){

	e.stopPropagation();
	e.preventDefault();

	if(e.originalEvent.wheelDelta>0 && $(this).next().length)
		$(this).next().after($(this).detach());

	if(e.originalEvent.wheelDelta<0 && $(this).prev().length)
		$(this).prev().before($(this).detach());
	
	});
//mousewheel





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

 $('.gleitfach_selected')
 .drop({
	postDrop:	function(e){
		console.log('postDrop',e,e.originalEvent.dataTransfer.files,e.originalEvent.dataTransfer.items,e.originalEvent.dataTransfer.items.item());

		var dropped_files = e.originalEvent.dataTransfer.files;
	
		for(var i=0,f; f=e.originalEvent.dataTransfer.files[i]; ++i){
			reader.fileName = f.name;
			reader.fileType = f.type;
			reader.readAsDataURL(f.webkitSlice());
		};//for
	 }, 
	preDrop:	function(e){
		console.log('preDrop',e,e.originalEvent.dataTransfer.files,e.originalEvent.dataTransfer.items,e.originalEvent.dataTransfer.items.item());
		return true;
	 }
 });
//drop





/***************************
 * NEW TEXT mode:
 * 
 * open a TEXT editable <div/> 
 * by clicking where you want 
 * to start typing
 * 
 ***************************/
 $(document).on('click','.gleitfach_mode_new_text',function(e){
	 
	$('<div/>')
		.appendTo('.gleitfach_selected')
		.attr('contenteditable','true')
		.css('position','absolute')
		.offset({left:e.pageX,top:e.pageY})
		.height(100).width(200)
		.focus();
 });
 /*
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
*/





/***************************
 * DELETE mode:
 * 
 * dblclick deletes,
 * hover displays a border
 ***************************/
 $(document).on('dblclick','.gleitfach_mode_delete > *',function(e){

	 e.preventDefault();
	 e.stopPropagation();

	 $(this).remove();

 });
//dblclick


},





/***************************
 * helper functions:
 ***************************/
src: function(src,srcDimensions){
// auto-create a gleitfach with an image in it

var generateDiv = function(size){	
	return $("<div />")
	.appendTo('.gleitfach_selected')
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
  .appendTo('.gleitfach_selected')
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

		$('.gleitfach_selected')	.removeClass(	'gleitfach_selected'	);
		$(gleitfach.overlaid)   	.addClass(   	'gleitfach_selected'	);
		})
	.hide();
				
},//menuInit

overlay: function(element){
	gleitfach.overlaid = $(element).blur()[0];
	gleitfach.overlayEl
		.show().detach().appendTo(element)
		.css('position','absolute')
		.offset(  $(element).offset()   )
		.width(   $(element).width()    )
		.height(  $(element).height()   )
		.focus();
},//overlay

overlayInit: function(){

return $('<div/>')
	.prependTo('body')
	.attr('id','gleitfach_overlay_root')
	.append('<div/><div/><div/><div/><div/><div/><div/><div/>')//8
	.hide()
	.on('mouseleave',function(){$(this).hide()})
	.on('mousedown',function(e){

		if( e.target.id == 'gleitfach_overlay_root' )
			// center -> translate
			$(gleitfach.overlaid).addClass('gleitfach_actual_translate');

		else	// side or corner -> scale
			$(gleitfach.overlaid)
				.addClass('gleitfach_actual_scale')
				.data('gleitfach_overlay_corner',
					['TL','B ','BL',' L','TR','T ','BR',' R']
						[$(e.target).prevAll().length]	);

		$(gleitfach.overlaid).trigger(e);
		$(gleitfach.overlayEl).trigger('mouseleave');
		e.preventDefault();
		e.stopPropagation();
		return;	
	});//mousedown
},

};//gleitfach




