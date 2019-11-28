var settings = {
	hero: {},
	cardsIdCpt: 0,
	nbCardsInHand: 3
};

var heroes = [
	{
		name: 'Seeryn',
		hpmax: 20,
		hp: 10,
		def: 0
	},
	{
		name: 'Pi',
		hpmax: 20,
		hp: 15,
		def: 0
	},
	{
		name: 'Margo',
		hpmax: 20,
		hp: 18,
		def: 0
	}
];
var heroesMapByName = new Map();
for (var i = 0; i < heroes.length; i++) {
	heroesMapByName.set(heroes[i].name, heroes[i]);
}

$(document).ready(function() {
	$('.char').click(function(ev) {
		settings.hero = heroesMapByName.get(ev.currentTarget.id);
		localStorage.settings = JSON.stringify(settings);
		window.location.href = 'page.html';

	});
});
