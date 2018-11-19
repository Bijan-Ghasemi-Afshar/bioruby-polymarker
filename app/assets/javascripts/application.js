// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require rails-ujs
//= require turbolinks
//= require_tree .
//= require snp_file.js



// Hide the messages when it's clicked on
	function hideMessage(){
		$(".alert").on("click", function(event) {
			$(this).hide();
		});
	}

// Caldulate the margin between logos (Needs 300 milisecond delay for images to load first)
	function calculateLogoMargin(){		
		var totalWidth = 0;
		$(".footer img").each(function(){
			totalWidth =  totalWidth + $(this).width();    
		});  
		$(".logo").css("margin-left", ((window.innerWidth - totalWidth)/8)-10 );
		$(".logo").css("margin-right", ((window.innerWidth - totalWidth)/8)-10 );		
	}

// Resizing the logos dynamically when window resized
	function spaceLogosDynamically(){
		var resizeLogoTimer;
		$(window).on('resize', function(e){      
			clearTimeout(resizeLogoTimer);  // Making sure that the reload doesn't happen if the window is resized within 1.5 seconds (1200 = 1500 - 300)
			resizeLogoTimer = setTimeout(function(){
				calculateLogoMargin();
			}, 1200);
		});
	}	

// Assigining ID to reference description
	function idToRefDes(){

		$( "#refDesBlock" ).children('p').each(function(index, el) {

			refName = $( "#snp_file_reference" ).children(`option:nth-child(${index+1})`).val();
			refName = refName.replace(/[^a-zA-Z ]|[1-9]|\s/g,'');
			$( this ).attr('id', refName);
			$( this ).attr('class', "refDes");

		});

	}

// Hightlight description
	function highlightDescription(){

		var selectValue = $( "#snp_file_reference" ).val();
		if(typeof selectValue != 'undefined'){

			$( ".refDes" ).css('display', 'none');

			$( "#snp_file_reference" ).attr('onchange', 'highlightDescription()');

			var refrence = $( "#snp_file_reference" ).val().replace(/[^a-zA-Z ]|[1-9]|\s/g,'');	
			$( "#" + refrence ).css('display', 'block');

		}

	}

// Populate example
	function populateExample(){		
		$("#populateExample").on( "click", function(){

			example = '';

			ref = $( "#snp_file_reference" ).val();

			$.ajax({
				url: '/example',
				beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));},
				type: 'POST',
				dataType: 'json',
				data: {ref: ref},
			})
			.done(function(data) {				
				example = data.value.split(" ").join("\n");
				$("#manualInput").val(example);
				$( "#fileInput" ).prop('disabled', true);
			})
			.fail(function(response) {
				console.error("error");
				console.error(response);
			});
			
		});
	}

// Run on page change
	function runOnPageChange(){
		setTimeout(function(){			
			ready();			
		}, 300);
	}

// Clear input
	function clearInput(){
		$( "#clearInput" ).on( "click", function(){
			$( "#manualInput" ).val('');
			$( "#manualInput" ).prop('disabled', false);
			$( "#populateExample" ).prop('disabled', false);

			$( "#fileInput" ).val('');
			$( "#fileInput" ).prop('disabled', false);
		});
	}

// Check input elements
	function checkInputElements(){

		$( "#manualInput" ).blur(function(){

			if($( "#manualInput" ).val() !== ""){				
				$( "#fileInput" ).prop('disabled', true);
			} else {				
				$( "#fileInput" ).prop('disabled', false);
			}

		});	

		$( "#fileInput" ).blur(function(){

			if($( "#fileInput" ).val() !== ""){				
				$( "#manualInput" ).prop('disabled', true);
				$( "#populateExample" ).prop('disabled', true);
			} else {				
				$( "#manualInput" ).prop('disabled', false);
				$( "#populateExample" ).prop('disabled', false);
			}

		});	

	}

// Execute functions when the content of the window are loaded
var ready;
ready = (function() {	

	idToRefDes();

	highlightDescription();

	calculateLogoMargin();

	spaceLogosDynamically()

	hideMessage();	

	populateExample();	

	checkInputElements();

	clearInput();	

});

$( window ).on( "load", ready);