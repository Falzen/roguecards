

var heroes = [
	{
		name: 'Seeryn',
		hpmax: 20,
		hp: 18,
		def: 0,
		currentXp: 0,
		level: 1
	},
	{
		name: 'Pi',
		hpmax: 20,
		hp: 18,
		def: 0,
		currentXp: 0,
		level: 1
	},
	{
		name: 'Margo',
		hpmax: 30,
		hp: 27,
		def: 0,
		currentXp: 0,
		level: 1
	}
];
var heroesMapByName = new Map();
for (var i = 0; i < heroes.length; i++) {
	heroesMapByName.set(heroes[i].name, heroes[i]);
}


function createSettingsByHeroName(hname) {
	var s = {
		hero: heroesMapByName.get(hname),
		cardsIdCpt: 0,
		floor_level: 1
	};
	switch(hname) {
		case 'Seeryn':
			s.nb_CardsInHand_start = 3;
			s.nb_CardsInHand_max = 6;
			s.nb_rooms_per_floor = 12;
			s.xp_steps = [0, 10, 20, 30, 40, 50];
		break;

		case 'Pi':
			s.nb_CardsInHand_start = 4;
			s.nb_CardsInHand_max = 7;
			s.nb_rooms_per_floor = 12;
			s.xp_steps = [0, 10, 20, 30, 40, 50];
		break;

		case 'Margo':
			s.nb_CardsInHand_start = 2;
			s.nb_CardsInHand_max = 5;
			s.nb_rooms_per_floor = 12;
			s.xp_steps = [0, 10, 20, 30, 40, 50];
		break;

		default:
		break;
	}
	return s;
} 



$(document).ready(function() {
	$('.char').click(function(ev) {
		settings = createSettingsByHeroName(ev.currentTarget.id);
		// TODO adjust settings by hero (nb_CardsInHand_max ?)
		localStorage.settings = JSON.stringify(settings);
		window.location.href = 'page.html';

	});
	$('#destroyLocal').click(function(ev) {
		localStorage.settings = null;
	});
});
