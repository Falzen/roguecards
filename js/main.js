var settings = {
	hero: {}
};


$(document).ready(function() {
	$('.char').click(function(ev) {
		settings.hero.name = ev.currentTarget.id;
		localStorage.settings = JSON.stringify(settings);
		window.location.href = 'page.html';

	});
});