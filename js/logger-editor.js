/**********************
 * 	logger-editor.js
 * 
 * 		loads the event context of the p0st editor:
 * 			d&d image = insert that image
 *				    (as a dimg)
 * 			d&d icon  = add that category to
 * 				    the current p0st
 * 			S-Enter   = save the p0st and
 * 				    restore the main page
 * 
 * 
 * dimg events active
 *
 * click on a text box points tinyMCE at
 * 		that text box.
 *
 * click on the background inserts a new			*
 * 		text box and points tinyMCE at that. 		*	the first 
 *													*	Enter press
 * keydown inserts a text box whereever the			*	sets the box's
 * 		mouse happens to be.						*	width
 *													*
 **********************/
 
addform = function(){
	
	
$('<form method="post">')
	.appendTo('body')
	.append('<textarea>').children()
	.attr({
		name:"content",
		cols:"50",
		rows:"15",
		})
	.text("This is some content that will be editable with TinyMCE.")
	.ready(function(){
		tinyMCE.init({
			mode : "textareas"
			});
		});//.ready
		
		
};//addform
