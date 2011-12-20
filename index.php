<html>

<?php
// I intend to implement a neat ~blogging system,
// with a few specific goals:

// drag-and-drop image/movie insertion
// drag, crop, resize, etc.

// the main p0st dynamic is to drag an image
// then comment on it, with possibly more images

// the main page renders (at least a header of) ~25 p0sts
// Which 25 is determined by search terms,
// or if none are entered, p0st youth.

// p0sts can be edited afterward.

// records a lot of metadata.

?>

<head>
<script src="js/jquery-1.7.1.js"></script>
<script src="js/tweaks.js"	></script>
<script src="js/dimg.js"	></script>
<!--	I need a few javascript libraries.

	jquery.js
		the most awesome js library

	tweaks.js
		all my jQuery and other tweaks
		including my homebrew
		drag-and-drop event binder

	dimg.js
		defines a javascript object
		to be assigned to each image
		It will allow basic mouse
		interaction with the image:
			S-drag = move  the image
			A-drag = scale the image
			C-drag = crop  the image
			???    = attach a label
				 to the image
			???    = rotate the image
			...
		To accomplish these degrees of
		freedom, each image will be
		stored as $("div>img.dimg#dimg12")
		or similar.

	logger-home.js
		loads the event context of the main page:
			dimg mouse events disabled.
			'c'	  = initiates a p0st
			d&d image = initiates a p0st
				    with that image
				    inserted
			'p'	  = open the category
				    icon palette
			d&d icon  = initiate a p0st
				    under that category
			's'	  = open the search interface

	logger-editor.js
		loads the event context of the p0st editor:
			dimg mouse events enabled.
			typing	  = insert the typed text
				    (in a BG <pre> ?)
			d&d image = insert that image
				    (as a dimg)
			d&d icon  = add that category to
				    the current p0st
			S-Enter   = save the p0st and
				    restore the main page

	logger-search.js
		loads the event context of the search interface:
			dimg mouse events disabled.
			a date slider sets the range of
				p0sts to filter out
			typing	  = add the typed text to
				    the search terms
			d&d icon  = filter p0sts from
				    that category
			filter state is automatically
				POSTED to render.php
				onchange or with a timeout
			S-Enter   = finish search
-->
</head>
<body onload="dimg('images/airgear.jpg')">
<!-- 	put a few static elements here
	(hot key reminder, date-time...)
	let the rest be generated by
	another php script, render.php

	search queries are AJAX POSTed
	to render.php and the results
	dumped wholesale below
-->

</body>
</html>