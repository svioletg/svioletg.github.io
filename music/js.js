$('a.notelink').click(function(){
	$('.note').removeClass('highlight');
	$($(this).attr('href')).toggleClass('highlight');
	setTimeout(function(){$('.note').removeClass('highlight')}, 1000);
})