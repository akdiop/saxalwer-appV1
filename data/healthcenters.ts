/**
 * Health centers database with coordinates for geolocation matching.
 * Covers key reproductive health facilities across West Africa,
 * including hospitals, public centers, rural health posts, and NGOs.
 */
export interface HealthCenter {
	id: number;
	name: string;
	nameWo?: string;
	type: 'public' | 'prive' | 'ong' | 'hopital' | 'poste';
	typeLabel: string;
	typeLabelWo: string;
	city: string;
	cityWo?: string;
	country: string;
	address: string;
	lat: number;
	lng: number;
	phone?: string;
	tags: string[];
	tagsWo: string[];
}

export const HEALTH_CENTERS: HealthCenter[] = [
	// ════════════════════════════════════════════
	// SÉNÉGAL — DAKAR & BANLIEUE
	// ════════════════════════════════════════════
	{
		id: 1,
		name: 'Centre de Santé Roi Baudouin',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Guédiawaye, Dakar',
		cityWo: 'Gediawaye, Ndakaaru',
		country: 'Sénégal',
		address: 'Route de Camberène, Guédiawaye',
		lat: 14.7747,
		lng: -17.3937,
		phone: '33 837 00 00',
		tags: ['Planning familial', 'Maternité', 'Urgences', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Urgences', 'Dépistage'],
	},
	{
		id: 2,
		name: 'Hôpital Aristide Le Dantec',
		type: 'hopital',
		typeLabel: 'Hôpital national',
		typeLabelWo: 'Hôpital bu mag',
		city: 'Dakar-Plateau',
		cityWo: 'Ndakaaru-Plateau',
		country: 'Sénégal',
		address: 'Avenue Pasteur, Dakar-Plateau',
		lat: 14.6653,
		lng: -17.4381,
		phone: '33 889 38 00',
		tags: ['Oncologie', 'Gynécologie', 'Cancer col', 'Cancer sein', 'Chirurgie'],
		tagsWo: ['Oncologie', 'Gynécologie', 'Cancer col', 'Cancer sein', 'Chirurgie'],
	},
	{
		id: 3,
		name: 'Hôpital Dalal Jamm',
		type: 'hopital',
		typeLabel: 'Hôpital national',
		typeLabelWo: 'Hôpital bu mag',
		city: 'Guédiawaye, Dakar',
		cityWo: 'Gediawaye, Ndakaaru',
		country: 'Sénégal',
		address: 'Guédiawaye, Dakar',
		lat: 14.7734,
		lng: -17.3825,
		phone: '33 859 72 72',
		tags: ['Oncologie', 'Cancer sein', 'Radiothérapie', 'Chimiothérapie', 'Maternité'],
		tagsWo: ['Oncologie', 'Cancer sein', 'Radiothérapie', 'Chimiothérapie', 'Yaayam'],
	},
	{
		id: 4,
		name: 'Marie Stopes Sénégal',
		type: 'ong',
		typeLabel: 'ONG',
		typeLabelWo: 'ONG',
		city: 'Dakar-Plateau',
		cityWo: 'Ndakaaru-Plateau',
		country: 'Sénégal',
		address: 'Rue de Thiong, Dakar-Plateau',
		lat: 14.6633,
		lng: -17.4416,
		phone: '800 00 84 84',
		tags: ['Contraception', 'Planning familial', 'Conseils', 'IST', 'Dépistage'],
		tagsWo: ['Contraception', 'Planning familial', 'Conseils', 'IST', 'Dépistage'],
	},
	{
		id: 5,
		name: 'Centre de Santé Philippe Maguilène Senghor',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Yoff, Dakar',
		cityWo: 'Yoff, Ndakaaru',
		country: 'Sénégal',
		address: 'Route de l\'Aéroport, Yoff',
		lat: 14.738,
		lng: -17.466,
		phone: '33 820 27 27',
		tags: ['Planning familial', 'Maternité', 'Consultation gynéco', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultation gynéco', 'Dépistage'],
	},
	{
		id: 6,
		name: 'Institut Joliot-Curie (Institut du Cancer)',
		type: 'hopital',
		typeLabel: 'Centre spécialisé',
		typeLabelWo: 'Centre spécialisé',
		city: 'Dakar',
		cityWo: 'Ndakaaru',
		country: 'Sénégal',
		address: 'Hôpital Le Dantec, Dakar',
		lat: 14.6648,
		lng: -17.4388,
		phone: '33 822 24 20',
		tags: ['Cancer sein', 'Cancer col', 'Cancer ovaire', 'Radiothérapie', 'Chimiothérapie', 'Oncologie'],
		tagsWo: ['Cancer sein', 'Cancer col', 'Cancer ovaire', 'Radiothérapie', 'Chimiothérapie', 'Oncologie'],
	},
	{
		id: 7,
		name: 'Clinique de la Madeleine',
		type: 'prive',
		typeLabel: 'Privé',
		typeLabelWo: 'Privé',
		city: 'Dakar',
		cityWo: 'Ndakaaru',
		country: 'Sénégal',
		address: 'Rue El Hadji Mbaye Gueye, Dakar',
		lat: 14.669,
		lng: -17.44,
		phone: '33 823 20 98',
		tags: ['Gynécologie', 'Maternité', 'Échographie', 'Mammographie'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Échographie', 'Mammographie'],
	},
	{
		id: 8,
		name: 'Centre de Santé Nabil Choucair',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Grand-Yoff, Dakar',
		cityWo: 'Grand-Yoff, Ndakaaru',
		country: 'Sénégal',
		address: 'Grand-Yoff, Dakar',
		lat: 14.732,
		lng: -17.457,
		phone: '33 827 60 60',
		tags: ['Planning familial', 'Maternité', 'Consultation gynéco', 'Dépistage', 'IST'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultation gynéco', 'Dépistage', 'IST'],
	},
	{
		id: 9,
		name: 'Hôpital Abass Ndao',
		type: 'hopital',
		typeLabel: 'Hôpital',
		typeLabelWo: 'Hôpital',
		city: 'Médina, Dakar',
		cityWo: 'Medina, Ndakaaru',
		country: 'Sénégal',
		address: 'Avenue Cheikh Anta Diop, Médina',
		lat: 14.691,
		lng: -17.4475,
		phone: '33 849 78 00',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie', 'Urgences'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie', 'Urgences'],
	},
	{
		id: 10,
		name: 'Centre de Santé Gaspard Kamara',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Médina, Dakar',
		cityWo: 'Medina, Ndakaaru',
		country: 'Sénégal',
		address: 'Rue 21, Médina, Dakar',
		lat: 14.6875,
		lng: -17.442,
		phone: '33 822 36 42',
		tags: ['Planning familial', 'Maternité', 'Dépistage', 'IST', 'Consultation gynéco'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage', 'IST', 'Consultation gynéco'],
	},
	{
		id: 11,
		name: 'Hôpital Principal de Dakar',
		type: 'hopital',
		typeLabel: 'Hôpital',
		typeLabelWo: 'Hôpital',
		city: 'Dakar-Plateau',
		cityWo: 'Ndakaaru-Plateau',
		country: 'Sénégal',
		address: '1, Avenue Nelson Mandela, Dakar',
		lat: 14.669,
		lng: -17.432,
		phone: '33 839 50 50',
		tags: ['Gynécologie', 'Oncologie', 'Chirurgie', 'Maternité', 'Mammographie'],
		tagsWo: ['Gynécologie', 'Oncologie', 'Chirurgie', 'Yaayam', 'Mammographie'],
	},
	{
		id: 12,
		name: 'Centre de Santé de Pikine',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Pikine, Dakar',
		cityWo: 'Pikine, Ndakaaru',
		country: 'Sénégal',
		address: 'Pikine Centre',
		lat: 14.7545,
		lng: -17.3945,
		phone: '33 834 14 14',
		tags: ['Planning familial', 'Maternité', 'Dépistage', 'Consultation gynéco'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage', 'Consultation gynéco'],
	},
	{
		id: 13,
		name: 'Poste de Santé de Diamaguène',
		nameWo: 'Poste de Santé Diamaguène',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Diamaguène, Dakar',
		cityWo: 'Diamaguène, Ndakaaru',
		country: 'Sénégal',
		address: 'Diamaguène, Pikine',
		lat: 14.7615,
		lng: -17.388,
		tags: ['Planning familial', 'Consultations', 'Maternité'],
		tagsWo: ['Planning familial', 'Consultations', 'Yaayam'],
	},
	{
		id: 14,
		name: 'ACDEV (Action et Développement)',
		type: 'ong',
		typeLabel: 'ONG',
		typeLabelWo: 'ONG',
		city: 'Rufisque, Dakar',
		cityWo: 'Rufisque, Ndakaaru',
		country: 'Sénégal',
		address: 'Rufisque Centre',
		lat: 14.7167,
		lng: -17.2736,
		phone: '33 836 72 72',
		tags: ['Planning familial', 'Contraception', 'Conseils', 'IST', 'Dépistage'],
		tagsWo: ['Planning familial', 'Contraception', 'Conseils', 'IST', 'Dépistage'],
	},
	{
		id: 15,
		name: 'Centre de Santé de Keur Massar',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Keur Massar, Dakar',
		cityWo: 'Keur Massar, Ndakaaru',
		country: 'Sénégal',
		address: 'Keur Massar Centre',
		lat: 14.785,
		lng: -17.317,
		tags: ['Planning familial', 'Maternité', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage'],
	},

	// ════════════════════════════════════════════
	// SÉNÉGAL — THIÈS
	// ════════════════════════════════════════════
	{
		id: 16,
		name: 'Hôpital Régional de Thiès',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Thiès',
		cityWo: 'Cees',
		country: 'Sénégal',
		address: 'Avenue Léopold Sédar Senghor, Thiès',
		lat: 14.7886,
		lng: -16.926,
		phone: '33 951 10 66',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie', 'Dépistage cancer'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie', 'Dépistage cancer'],
	},
	{
		id: 17,
		name: 'Centre de Santé de Mbour',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Mbour',
		cityWo: 'Mbur',
		country: 'Sénégal',
		address: 'Mbour Centre',
		lat: 14.42,
		lng: -16.97,
		phone: '33 957 10 57',
		tags: ['Planning familial', 'Maternité', 'Consultation gynéco', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultation gynéco', 'Dépistage'],
	},
	{
		id: 18,
		name: 'Poste de Santé de Joal-Fadiouth',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Joal-Fadiouth',
		country: 'Sénégal',
		address: 'Joal-Fadiouth Centre',
		lat: 14.1667,
		lng: -16.8333,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},
	{
		id: 19,
		name: 'Poste de Santé de Tivaouane',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Tivaouane',
		cityWo: 'Tiwaawaan',
		country: 'Sénégal',
		address: 'Tivaouane Centre',
		lat: 14.95,
		lng: -16.8167,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},

	// ════════════════════════════════════════════
	// SÉNÉGAL — SAINT-LOUIS
	// ════════════════════════════════════════════
	{
		id: 20,
		name: 'Hôpital Régional de Saint-Louis',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Saint-Louis',
		cityWo: 'Ndar',
		country: 'Sénégal',
		address: 'Île de Saint-Louis',
		lat: 16.02,
		lng: -16.49,
		phone: '33 961 10 60',
		tags: ['Gynécologie', 'Maternité', 'Planning familial', 'Dépistage'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Planning familial', 'Dépistage'],
	},
	{
		id: 21,
		name: 'Centre de Santé de Richard-Toll',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Richard-Toll',
		country: 'Sénégal',
		address: 'Richard-Toll Centre',
		lat: 16.46,
		lng: -15.7,
		tags: ['Planning familial', 'Maternité', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage'],
	},
	{
		id: 22,
		name: 'Poste de Santé de Podor',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Podor',
		country: 'Sénégal',
		address: 'Podor Centre',
		lat: 16.65,
		lng: -14.96,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},

	// ════════════════════════════════════════════
	// SÉNÉGAL — KAOLACK / FATICK / KAFFRINE
	// ════════════════════════════════════════════
	{
		id: 23,
		name: 'Hôpital El Hadji Ibrahima Niass',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Kaolack',
		cityWo: 'Kawlax',
		country: 'Sénégal',
		address: 'Kaolack Centre',
		lat: 14.1401,
		lng: -16.0754,
		phone: '33 941 10 39',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie'],
	},
	{
		id: 24,
		name: 'Centre de Santé de Fatick',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Fatick',
		country: 'Sénégal',
		address: 'Fatick Centre',
		lat: 14.3333,
		lng: -16.4,
		phone: '33 949 11 46',
		tags: ['Planning familial', 'Maternité', 'Dépistage', 'Consultation gynéco'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage', 'Consultation gynéco'],
	},
	{
		id: 25,
		name: 'Poste de Santé de Foundiougne',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Foundiougne',
		country: 'Sénégal',
		address: 'Foundiougne, Fatick',
		lat: 14.13,
		lng: -16.47,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},
	{
		id: 26,
		name: 'Centre de Santé de Kaffrine',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Kaffrine',
		country: 'Sénégal',
		address: 'Kaffrine Centre',
		lat: 14.1058,
		lng: -15.5506,
		tags: ['Planning familial', 'Maternité', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage'],
	},

	// ════════════════════════════════════════════
	// SÉNÉGAL — ZIGUINCHOR / KOLDA / SÉDHIOU
	// ════════════════════════════════════════════
	{
		id: 27,
		name: 'Hôpital de la Paix de Ziguinchor',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Ziguinchor',
		cityWo: 'Sigicoor',
		country: 'Sénégal',
		address: 'Quartier Boucotte, Ziguinchor',
		lat: 12.5633,
		lng: -16.258,
		phone: '33 991 12 07',
		tags: ['Gynécologie', 'Maternité', 'Planning familial', 'Dépistage'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Planning familial', 'Dépistage'],
	},
	{
		id: 28,
		name: 'Centre de Santé de Kolda',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Kolda',
		country: 'Sénégal',
		address: 'Kolda Centre',
		lat: 12.8833,
		lng: -14.95,
		phone: '33 996 11 14',
		tags: ['Planning familial', 'Maternité', 'Dépistage', 'Consultation gynéco'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage', 'Consultation gynéco'],
	},
	{
		id: 29,
		name: 'Centre de Santé de Sédhiou',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Sédhiou',
		country: 'Sénégal',
		address: 'Sédhiou Centre',
		lat: 12.7086,
		lng: -15.5569,
		tags: ['Planning familial', 'Maternité', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage'],
	},
	{
		id: 30,
		name: 'Poste de Santé de Oussouye',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Oussouye',
		country: 'Sénégal',
		address: 'Oussouye, Ziguinchor',
		lat: 12.4833,
		lng: -16.5333,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},

	// ════════════════════════════════════════════
	// SÉNÉGAL — TAMBACOUNDA / KÉDOUGOU / MATAM
	// ════════════════════════════════════════════
	{
		id: 31,
		name: 'Hôpital Régional de Tambacounda',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Tambacounda',
		country: 'Sénégal',
		address: 'Tambacounda Centre',
		lat: 13.7707,
		lng: -13.6673,
		phone: '33 981 10 80',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie', 'Dépistage'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie', 'Dépistage'],
	},
	{
		id: 32,
		name: 'Centre de Santé de Kédougou',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Kédougou',
		country: 'Sénégal',
		address: 'Kédougou Centre',
		lat: 12.5575,
		lng: -12.1747,
		tags: ['Planning familial', 'Maternité', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage'],
	},
	{
		id: 33,
		name: 'Centre de Santé de Matam',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Matam',
		country: 'Sénégal',
		address: 'Matam Centre',
		lat: 15.6556,
		lng: -13.25,
		phone: '33 966 61 35',
		tags: ['Planning familial', 'Maternité', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage'],
	},
	{
		id: 34,
		name: 'Poste de Santé de Salemata',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Salemata',
		country: 'Sénégal',
		address: 'Salemata, Kédougou',
		lat: 12.63,
		lng: -12.57,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},

	// ════════════════════════════════════════════
	// SÉNÉGAL — LOUGA / DIOURBEL
	// ════════════════════════════════════════════
	{
		id: 35,
		name: 'Hôpital Régional de Louga',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Louga',
		cityWo: 'Luga',
		country: 'Sénégal',
		address: 'Louga Centre',
		lat: 15.6167,
		lng: -16.2333,
		phone: '33 967 11 22',
		tags: ['Gynécologie', 'Maternité', 'Dépistage'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Dépistage'],
	},
	{
		id: 36,
		name: 'Hôpital Heinrich Lübke de Diourbel',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Diourbel',
		cityWo: 'Jurbel',
		country: 'Sénégal',
		address: 'Diourbel Centre',
		lat: 14.655,
		lng: -16.231,
		phone: '33 971 10 64',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie'],
	},
	{
		id: 37,
		name: 'Poste de Santé de Touba Mosquée',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Touba',
		cityWo: 'Tuubaa',
		country: 'Sénégal',
		address: 'Touba, Diourbel',
		lat: 14.8667,
		lng: -15.8833,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},
	{
		id: 38,
		name: 'Poste de Santé de Mbacké',
		type: 'poste',
		typeLabel: 'Poste de santé',
		typeLabelWo: 'Poste santé',
		city: 'Mbacké',
		cityWo: 'Mbaxe',
		country: 'Sénégal',
		address: 'Mbacké, Diourbel',
		lat: 14.7933,
		lng: -15.9083,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},

	// ════════════════════════════════════════════
	// CÔTE D'IVOIRE
	// ════════════════════════════════════════════
	{
		id: 39,
		name: 'CHU de Treichville',
		type: 'hopital',
		typeLabel: 'Hôpital universitaire',
		typeLabelWo: 'Hôpital universitaire',
		city: 'Abidjan',
		country: 'Côte d\'Ivoire',
		address: 'Boulevard de Marseille, Treichville, Abidjan',
		lat: 5.3003,
		lng: -3.987,
		phone: '+225 21 24 91 00',
		tags: ['Oncologie', 'Gynécologie', 'Cancer sein', 'Cancer col', 'Chimiothérapie'],
		tagsWo: ['Oncologie', 'Gynécologie', 'Cancer sein', 'Cancer col', 'Chimiothérapie'],
	},
	{
		id: 40,
		name: 'CHU de Cocody',
		type: 'hopital',
		typeLabel: 'Hôpital universitaire',
		typeLabelWo: 'Hôpital universitaire',
		city: 'Abidjan',
		country: 'Côte d\'Ivoire',
		address: 'Rue des Jardins, Cocody, Abidjan',
		lat: 5.345,
		lng: -3.98,
		phone: '+225 22 44 90 00',
		tags: ['Gynécologie', 'Maternité', 'Oncologie', 'Chirurgie'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Oncologie', 'Chirurgie'],
	},
	{
		id: 41,
		name: 'Centre de PMI de Yopougon',
		type: 'public',
		typeLabel: 'Centre PMI',
		typeLabelWo: 'Centre PMI',
		city: 'Yopougon, Abidjan',
		country: 'Côte d\'Ivoire',
		address: 'Yopougon Selmer, Abidjan',
		lat: 5.321,
		lng: -4.087,
		tags: ['Planning familial', 'Maternité', 'Dépistage', 'Consultation gynéco'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage', 'Consultation gynéco'],
	},
	{
		id: 42,
		name: 'Centre de Santé de Bouaké',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Bouaké',
		country: 'Côte d\'Ivoire',
		address: 'Bouaké Centre',
		lat: 7.6936,
		lng: -5.03,
		tags: ['Gynécologie', 'Maternité', 'Dépistage'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Dépistage'],
	},

	// ════════════════════════════════════════════
	// BURKINA FASO
	// ════════════════════════════════════════════
	{
		id: 43,
		name: 'CHU Yalgado Ouédraogo',
		type: 'hopital',
		typeLabel: 'Hôpital universitaire',
		typeLabelWo: 'Hôpital universitaire',
		city: 'Ouagadougou',
		country: 'Burkina Faso',
		address: 'Avenue d\'Oubritenga, Ouagadougou',
		lat: 12.3636,
		lng: -1.5139,
		phone: '+226 25 30 66 41',
		tags: ['Oncologie', 'Gynécologie', 'Cancer col', 'Radiothérapie'],
		tagsWo: ['Oncologie', 'Gynécologie', 'Cancer col', 'Radiothérapie'],
	},
	{
		id: 44,
		name: 'CSPS du Secteur 30',
		type: 'poste',
		typeLabel: 'CSPS',
		typeLabelWo: 'CSPS',
		city: 'Ouagadougou',
		country: 'Burkina Faso',
		address: 'Secteur 30, Ouagadougou',
		lat: 12.342,
		lng: -1.526,
		tags: ['Planning familial', 'Maternité', 'Consultations', 'Dépistage'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations', 'Dépistage'],
	},
	{
		id: 45,
		name: 'CHR de Bobo-Dioulasso',
		type: 'hopital',
		typeLabel: 'Hôpital régional',
		typeLabelWo: 'Hôpital régional',
		city: 'Bobo-Dioulasso',
		country: 'Burkina Faso',
		address: 'Bobo-Dioulasso Centre',
		lat: 11.1771,
		lng: -4.2979,
		phone: '+226 20 97 00 44',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie', 'Dépistage cancer'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie', 'Dépistage cancer'],
	},

	// ════════════════════════════════════════════
	// MALI
	// ════════════════════════════════════════════
	{
		id: 46,
		name: 'Hôpital du Point G',
		type: 'hopital',
		typeLabel: 'Hôpital national',
		typeLabelWo: 'Hôpital bu mag',
		city: 'Bamako',
		country: 'Mali',
		address: 'Colline du Point G, Bamako',
		lat: 12.6588,
		lng: -8.0033,
		phone: '+223 20 22 27 12',
		tags: ['Gynécologie', 'Oncologie', 'Maternité', 'Chirurgie'],
		tagsWo: ['Gynécologie', 'Oncologie', 'Yaayam', 'Chirurgie'],
	},
	{
		id: 47,
		name: 'CHU Gabriel Touré',
		type: 'hopital',
		typeLabel: 'Hôpital universitaire',
		typeLabelWo: 'Hôpital universitaire',
		city: 'Bamako',
		country: 'Mali',
		address: 'Avenue Van Vollenhoven, Bamako',
		lat: 12.649,
		lng: -8.0023,
		phone: '+223 20 22 27 12',
		tags: ['Gynécologie', 'Maternité', 'Urgences', 'Dépistage'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Urgences', 'Dépistage'],
	},
	{
		id: 48,
		name: 'CSCOM de Kalabancoro',
		type: 'poste',
		typeLabel: 'CSCOM',
		typeLabelWo: 'CSCOM',
		city: 'Kalabancoro, Bamako',
		country: 'Mali',
		address: 'Kalabancoro, Bamako',
		lat: 12.576,
		lng: -8.048,
		tags: ['Planning familial', 'Maternité', 'Consultations'],
		tagsWo: ['Planning familial', 'Yaayam', 'Consultations'],
	},

	// ════════════════════════════════════════════
	// GUINÉE
	// ════════════════════════════════════════════
	{
		id: 49,
		name: 'CHU Donka',
		type: 'hopital',
		typeLabel: 'Hôpital universitaire',
		typeLabelWo: 'Hôpital universitaire',
		city: 'Conakry',
		country: 'Guinée',
		address: 'Donka, Conakry',
		lat: 9.5357,
		lng: -13.6803,
		phone: '+224 622 35 00 00',
		tags: ['Gynécologie', 'Oncologie', 'Maternité', 'Chirurgie'],
		tagsWo: ['Gynécologie', 'Oncologie', 'Yaayam', 'Chirurgie'],
	},
	{
		id: 50,
		name: 'Centre de Santé de Matam (Conakry)',
		type: 'public',
		typeLabel: 'Centre de santé',
		typeLabelWo: 'Dëkk santé',
		city: 'Matam, Conakry',
		country: 'Guinée',
		address: 'Matam, Conakry',
		lat: 9.556,
		lng: -13.665,
		tags: ['Planning familial', 'Maternité', 'Dépistage', 'Consultation gynéco'],
		tagsWo: ['Planning familial', 'Yaayam', 'Dépistage', 'Consultation gynéco'],
	},

	// ════════════════════════════════════════════
	// NIGER
	// ════════════════════════════════════════════
	{
		id: 51,
		name: 'Hôpital National de Niamey',
		type: 'hopital',
		typeLabel: 'Hôpital national',
		typeLabelWo: 'Hôpital bu mag',
		city: 'Niamey',
		country: 'Niger',
		address: 'Boulevard de la Liberté, Niamey',
		lat: 13.5137,
		lng: 2.1098,
		phone: '+227 20 72 25 53',
		tags: ['Gynécologie', 'Maternité', 'Dépistage cancer'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Dépistage cancer'],
	},
	{
		id: 52,
		name: 'Maternité Issaka Gazoby',
		type: 'hopital',
		typeLabel: 'Maternité de référence',
		typeLabelWo: 'Yaayam référence',
		city: 'Niamey',
		country: 'Niger',
		address: 'Quartier Plateau, Niamey',
		lat: 13.512,
		lng: 2.108,
		phone: '+227 20 73 33 79',
		tags: ['Maternité', 'Gynécologie', 'Planning familial', 'Dépistage'],
		tagsWo: ['Yaayam', 'Gynécologie', 'Planning familial', 'Dépistage'],
	},

	// ════════════════════════════════════════════
	// GAMBIE
	// ════════════════════════════════════════════
	{
		id: 53,
		name: 'Edward Francis Small Teaching Hospital',
		type: 'hopital',
		typeLabel: 'Hôpital national',
		typeLabelWo: 'Hôpital bu mag',
		city: 'Banjul',
		country: 'Gambie',
		address: 'Independence Drive, Banjul',
		lat: 13.4531,
		lng: -16.578,
		phone: '+220 422 82 24',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie', 'Dépistage'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie', 'Dépistage'],
	},

	// ════════════════════════════════════════════
	// MAURITANIE
	// ════════════════════════════════════════════
	{
		id: 54,
		name: 'Centre Hospitalier National',
		type: 'hopital',
		typeLabel: 'Hôpital national',
		typeLabelWo: 'Hôpital bu mag',
		city: 'Nouakchott',
		country: 'Mauritanie',
		address: 'Avenue Gamal Abdel Nasser, Nouakchott',
		lat: 18.0863,
		lng: -15.9785,
		phone: '+222 45 25 21 35',
		tags: ['Gynécologie', 'Maternité', 'Chirurgie', 'Oncologie'],
		tagsWo: ['Gynécologie', 'Yaayam', 'Chirurgie', 'Oncologie'],
	},
];

/**
 * Calculate distance between two lat/lng points in km (Haversine formula)
 */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

/**
 * Build a navigation URL that works across platforms:
 * - iOS/Android: opens native Maps app via geo: or maps: intent
 * - Desktop: opens Google Maps in browser
 */
export function buildNavigationUrl(lat: number, lng: number, name: string): string {
	const encodedName = encodeURIComponent(name);
	// Google Maps directions URL — works everywhere and opens native app on mobile
	return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_name=${encodedName}&travelmode=walking`;
}

/**
 * Build a Google Maps "view" URL (shows the pin)
 */
export function buildMapViewUrl(lat: number, lng: number, name: string): string {
	const q = encodeURIComponent(name);
	return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}%20(${q})`;
}

/**
 * Find the N nearest centers from a given position
 */
export function findNearestCenters(
	lat: number,
	lng: number,
	count: number = 3,
	filterTags?: string[],
): (HealthCenter & { distanceKm: number })[] {
	// Currently limited to Senegal
	let centers = HEALTH_CENTERS.filter(c => c.country === 'Sénégal').map(c => ({
		...c,
		distanceKm: distanceKm(lat, lng, c.lat, c.lng),
	}));

	if (filterTags && filterTags.length > 0) {
		const lowerTags = filterTags.map(t => t.toLowerCase());
		const filtered = centers.filter(c =>
			c.tags.some(tag => lowerTags.some(ft => tag.toLowerCase().includes(ft))),
		);
		// If we have enough filtered results, use them; otherwise fall back to all
		if (filtered.length >= 1) {
			centers = filtered;
		}
	}

	centers.sort((a, b) => a.distanceKm - b.distanceKm);
	return centers.slice(0, count);
}
