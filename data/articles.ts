import type { LifeSituation } from '../context/appcontext';

export interface ArticleSection {
	type: 'heading' | 'text' | 'list' | 'quote' | 'warning' | 'tip';
	content?: string;
	items?: string[];
	fr?: string;
	wo?: string;
	itemsFr?: string[];
	itemsWo?: string[];
}

export interface Article {
	id: number;
	category: string;
	categoryWo: string;
	lifeStage: string;
	lifeStageWo: string;
	lifeSituations: LifeSituation[];
	ageRange: string;
	title: string;
	titleWo: string;
	description: string;
	descriptionWo: string;
	stage: 'young' | 'pregnant' | 'mature';
	audio: boolean;
	readTime: string;
	author: string;
	authorWo: string;
	rating: number;
	readers: number;
	featured: boolean;
	tags: string[];
	tagsWo: string[];
	content: ArticleSection[];
}

const BASE_ARTICLES: Article[] = [
	{
		id: 1,
		category: 'Contraception',
		categoryWo: 'Contraception',
		lifeStage: 'Protection',
		lifeStageWo: 'Jafe',
		lifeSituations: ['contraception', 'curious', 'cycles', 'general'],
		ageRange: 'all',
		title: 'Choisir sa méthode contraceptive',
		titleWo: 'Tànnal sa méthode contraception',
		description:
			"Guide complet des méthodes disponibles en Afrique de l'Ouest : pilule, implant, DIU, préservatif et méthodes naturelles.",
		descriptionWo:
			"Guide bu mat ci méthodes yi am ci Afrique de l'Ouest : pilule, implant, DIU, préservatif ak méthodes naturelles.",
		stage: 'young',
		audio: true,
		readTime: '10 min',
		author: 'Dr. Fatou Diallo, Gynécologue',
		authorWo: 'Dr. Fatou Diallo, Gynécologue',
		rating: 4.9,
		readers: 3421,
		featured: true,
		tags: ['Contraception', 'Planning Familial', 'Prévention', 'Santé Sexuelle'],
		tagsWo: ['Contraception', 'Planning Familial', 'Prévention', 'Santé Sexuelle'],
		content: [
			{
				type: 'heading',
				fr: 'Pourquoi la contraception ?',
				wo: 'Lu tax contraception ?',
			},
			{
				type: 'text',
				fr: "La contraception permet de choisir le moment d'avoir des enfants, de protéger sa santé et de vivre sa sexualité sereinement. C'est un droit fondamental pour toute femme.",
				wo: 'Contraception bi dafa jox la ci tànnal temps ci am doom, saxal sa yaram te vivre sa sexualité ci jàmm. Droit bu njëkk la ci yëpp jigéen.',
			},
		],
	},
	{
		id: 2,
		category: 'Grossesse',
		categoryWo: 'Gàtt',
		lifeStage: 'Maternité',
		lifeStageWo: 'Yaayam',
		lifeSituations: ['pregnant', 'trying'],
		ageRange: 'all',
		title: "Vivre une grossesse saine en Afrique de l'Ouest",
		titleWo: "Am gàtt bu saf ci Afrique de l'Ouest",
		description:
			"Alimentation, suivi médical, signes d'alerte et préparation à l'accouchement. Tout pour une grossesse sereine.",
		descriptionWo:
			"Lekk, suivi médical, signes d'alerte ak préparation fànnaan. Lépp ngir am gàtt bu jàmm.",
		stage: 'pregnant',
		audio: true,
		readTime: '12 min',
		author: 'Sage-femme Aminata Ndiaye',
		authorWo: 'Sage-femme Aminata Ndiaye',
		rating: 4.9,
		readers: 2845,
		featured: true,
		tags: ['Grossesse', 'Maternité', 'Nutrition', 'Suivi prénatal'],
		tagsWo: ['Gàtt', 'Yaayam', 'Lekk', 'Suivi prénatal'],
		content: [
			{
				type: 'heading',
				fr: 'Les 9 mois : un voyage sacré',
				wo: '9 mois yi : voyage bu njëkk',
			},
			{
				type: 'text',
				fr: "La grossesse est une période de transformation profonde. Ton corps travaille chaque jour pour créer la vie. Voici comment l'accompagner avec douceur.",
				wo: 'Gàtt bi dafa am transformation bu rafet. Sa yaram dafa liggéey bésnéew ngir jaar vie. Men la nu ko ëpp ak douceur.',
			},
		],
	},
	{
		id: 3,
		category: 'Fertilité',
		categoryWo: 'Fertilité',
		lifeStage: 'Conception',
		lifeStageWo: 'Conception',
		lifeSituations: ['trying', 'cycles', 'general'],
		ageRange: '18-44',
		title: 'Comprendre sa fertilité et optimiser ses chances',
		titleWo: 'Xam sa fertilité te optimiser sa chances',
		description:
			"Le cycle menstruel, la fenêtre de fertilité, les signes d'ovulation et conseils pour augmenter ses chances de conception.",
		descriptionWo:
			'Cycle menstruel bi, temps bi nga mën gàtt, signes ovulation ak conseils ngir yàgg sa chances ci conception.',
		stage: 'young',
		audio: true,
		readTime: '9 min',
		author: 'Dr. Mariama Sow, Spécialiste fertilité',
		authorWo: 'Dr. Mariama Sow, Spécialiste fertilité',
		rating: 4.7,
		readers: 1892,
		featured: false,
		tags: ['Fertilité', 'Ovulation', 'Conception', 'Cycle menstruel'],
		tagsWo: ['Fertilité', 'Ovulation', 'Conception', 'Cycle menstruel'],
		content: [
			{
				type: 'heading',
				fr: 'Le cycle menstruel : la carte de ta fertilité',
				wo: 'Cycle menstruel bi : carte sa fertilité',
			},
			{
				type: 'text',
				fr: "Un cycle dure en moyenne 28 jours, mais il peut varier de 21 à 35 jours. Connaître ton cycle t'aide à mieux repérer ta fenêtre de fertilité et à comprendre les signes que ton corps t'envoie.",
				wo: 'Cycle bi dafa mën a tollu 28 jours ci moyenne, waaye mën na soppeeku diggante 21 ak 35 jours. Xam sa cycle dafa la dimbali nga gën a xam sa fenêtre de fertilité ak signes yi sa yaram di la jox.',
			},
			{
				type: 'heading',
				fr: 'La fenêtre de fertilité',
				wo: 'Fenêtre de fertilité bi',
			},
			{
				type: 'text',
				fr: "Tu es fertile environ 5 jours avant l'ovulation et le jour de l'ovulation. L'ovulation survient généralement 14 jours avant les prochaines règles, mais cela peut varier d'une femme à l'autre.",
				wo: 'Danga mën a am doom lu mat 5 jours bala ovulation ak bésu ovulation bi. Ovulation bi dafa faral di am lu mat 14 jours bala règles yu bees yi, waaye mën na soppeeku ci jigéen bu nekk.',
			},
			{
				type: 'heading',
				fr: "Signes d'ovulation",
				wo: 'Signes ovulation',
			},
			{
				type: 'list',
				itemsFr: [
					'Glaire cervicale claire et élastique',
					'Légère hausse de température corporelle',
					'Augmentation de la libido',
					"Douleur légère d'un côté du bas-ventre",
					'Léger spotting, plus rare',
				],
				itemsWo: [
					'Glaire cervicale bu leer te mën a yoor',
					'Thermomètre buy wone yaram bi gën a tàng tuuti',
					'Libido bi yokku',
					'Mettit bu ndaw ci benn wetu biir bi',
					'Spotting bu ndaw, lu weesu',
				],
			},
			{
				type: 'tip',
				fr: "Conseil pratique : note chaque jour la qualité de ta glaire cervicale. C'est souvent l'un des signes les plus utiles pour repérer l'ovulation, même sans technologie.",
				wo: 'Pexe bu am solo: bindal bés bu nekk ni glaire cervicale bi mel. Loolu mooy benn ci signes yi gën a jariñ ngir xam ovulation, doonte amul technologie.',
			},
			{
				type: 'warning',
				fr: "Si tes cycles sont très irréguliers, très douloureux ou si tu essaies de concevoir depuis plusieurs mois sans résultat, un avis médical peut t'aider à y voir plus clair.",
				wo: 'Bu sa cycle yi baree soppeeku, walla metti lool, walla ngay jéema am doom te dara amul ay weer yu bari, avis medical mën na la dimbali nga gën a leeral xaalis bi.',
			},
		],
	},
	{
		id: 4,
		category: 'IST & Prévention',
		categoryWo: 'IST & Prévention',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'curious', 'contraception', 'cycles'],
		ageRange: 'all',
		title: 'Infections Sexuellement Transmissibles : prévenir et traiter',
		titleWo: 'Infections Sexuellement Transmissibles : jiit te wër',
		description:
			'VIH/SIDA, hépatites, chlamydia, gonorrhée, syphilis, HPV : symptômes, dépistage et traitement.',
		descriptionWo:
			'VIH/SIDA, hépatites, chlamydia, gonorrhée, syphilis, HPV : symptômes, dépistage te wër.',
		stage: 'young',
		audio: true,
		readTime: '11 min',
		author: 'Dr. Cheikh Diop, Infectiologue',
		authorWo: 'Dr. Cheikh Diop, Infectiologue',
		rating: 4.8,
		readers: 4123,
		featured: true,
		tags: ['IST', 'Prévention', 'Dépistage', 'Santé Sexuelle', 'VIH'],
		tagsWo: ['IST', 'Prévention', 'Dépistage', 'Santé Sexuelle', 'VIH'],
		content: [
			{
				type: 'heading',
				fr: "Qu'est-ce qu'une IST ?",
				wo: 'Lu IST ?',
			},
			{
				type: 'text',
				fr: "Une IST est une infection transmise lors de rapports intimes non protégés, mais aussi parfois par le sang ou de la mère à l'enfant. Beaucoup d'IST sont silencieuses au début.",
				wo: "IST mooy infection buy jële ci rapports intimes bu dul aar, waaye yenn mën nañu jële itam ci deret walla ci yaay jëm ci doom. Bëri IST duñu won seen bopp ci njàlbéen.",
			},
			{
				type: 'heading',
				fr: 'Signes possibles',
				wo: 'Signes yi mën a am',
			},
			{
				type: 'list',
				itemsFr: [
					'Brûlures en urinant',
					'Pertes inhabituelles ou malodorantes',
					'Démangeaisons ou plaies au niveau intime',
					'Douleurs pendant les rapports',
					'Fièvre ou ganglions dans certains cas',
				],
				itemsWo: [
					'Brûlures bu ngay suuxat',
					'Pertes yu bees walla yu sàmm',
					'Démangeaisons walla ay gaañu ci wàllu intime',
					'Mettit ci rapports intimes',
					'Fievre walla ganglions ci yenn xaalis',
				],
			},
			{
				type: 'heading',
				fr: 'Comment se protéger ?',
				wo: 'Naka ngay aar sa bopp ?',
			},
			{
				type: 'list',
				itemsFr: [
					'Utiliser correctement un préservatif à chaque rapport',
					'Faire un dépistage régulier si tu as un nouveau partenaire',
					'Consulter rapidement si un symptôme apparaît',
					'Éviter de prendre des médicaments sans avis médical',
				],
				itemsWo: [
					'Jëfandikoo préservatif bu baax ci bépp rapport',
					'Def dépistage bu siiw su fekkee am nga partenaire bu bees',
					'Dem tabax bu gaaw su signe feeñee',
					'Bul faj sa bopp rekk su amul avis médical',
				],
			},
			{
				type: 'tip',
				fr: "Le dépistage est souvent simple et rapide. Se faire tester tôt permet de traiter plus vite et de protéger son ou sa partenaire.",
				wo: 'Dépistage bi lu bari yomb na te gaaw na. Def test bu gaaw dafay may mujjal faj bu gaaw te aar sa partenaire.',
			},
			{
				type: 'warning',
				fr: "En cas de douleurs importantes, de fièvre, de saignement inhabituel ou si tu es enceinte, consulte sans attendre.",
				wo: 'Su amee mettit bu tar, fievre, deret bu dul normal walla nga am gàtt, dem tabax bu gaaw.',
			},
		],
	},
	{
		id: 5,
		category: 'Maladies chroniques',
		categoryWo: 'Maladies chroniques',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['cycles', 'general', 'trying'],
		ageRange: '18-49',
		title: 'Endométriose : comprendre et gérer la douleur',
		titleWo: 'Endométriose : xam te gérer douleur bi',
		description: 'Maladie chronique touchant 1 femme sur 10. Symptômes, diagnostic et traitements disponibles.',
		descriptionWo: 'Maladie chronique bu am ci 1 jigéen ci 10. Symptômes, diagnostic ak traitements yi am.',
		stage: 'young',
		audio: true,
		readTime: '10 min',
		author: 'Dr. Aïssatou Ba, Gynécologue',
		authorWo: 'Dr. Aïssatou Ba, Gynécologue',
		rating: 4.6,
		readers: 982,
		featured: false,
		tags: ['Endométriose', 'Douleurs menstruelles', 'Maladies chroniques', 'Fertilité'],
		tagsWo: ['Endométriose', 'Douleurs règles', 'Maladies chroniques', 'Fertilité'],
		content: [
			{ type: 'heading', fr: "Qu'est-ce que l'endométriose ?", wo: 'Lu endométriose ?' },
			{
				type: 'text',
				fr: "L'endométriose survient lorsque du tissu proche de l'endomètre se développe en dehors de l'utérus. Cela peut provoquer une inflammation chronique et des douleurs importantes.",
				wo: 'Endométriose dafay am su tissu bu jege endomètre bi di mag ci biti utérus bi. Loolu mën na jur inflammation buy yàgg ak mettit bu tar.',
			},
			{ type: 'heading', fr: 'Symptômes fréquents', wo: 'Symptômes yi ñu baree gis' },
			{
				type: 'list',
				itemsFr: [
					'Règles très douloureuses',
					'Douleurs pelviennes en dehors des règles',
					'Douleurs pendant les rapports',
					'Fatigue importante',
					'Difficultés à concevoir chez certaines femmes',
				],
				itemsWo: [
					'Règles yu metti lool',
					'Mettit pelvienne ci biti règles yi',
					'Mettit ci rapports intimes',
					'Fatigue bu bare',
					'Jafe-jafe ngir am doom ci yenn jigéen',
				],
			},
			{ type: 'heading', fr: 'Prise en charge', wo: 'Ni ñuy ko topptoo' },
			{
				type: 'text',
				fr: "Le diagnostic peut demander du temps. La prise en charge repose sur l'écoute, le soulagement de la douleur, parfois des traitements hormonaux, et un suivi adapté au projet de vie de la femme.",
				wo: 'Diagnostic bi mën na yàgg. Topptoo bi mi ngi aju ci déglu, dindi mettit bi, yenn saa yi ci traitements hormonaux, ak suivi bu méngook dund ak bëgg-bëggu jigéen ji.',
			},
			{
				type: 'tip',
				fr: "Noter les jours de douleur, leur intensité et leur lien avec le cycle peut aider la consultation.",
				wo: 'Bind bés yi mettit di am, ni mu tar ak ni mu jappandikoo ak cycle bi mën na dimbali ci consultation.',
			},
			{
				type: 'warning',
				fr: "Si la douleur t'empêche d'aller à l'école, au travail ou de dormir, il ne faut pas la banaliser.",
				wo: 'Bu mettit bi la tere nga dem ekool, liggéey walla nelaw, warul nga ko jàppe lu yomb rekk.',
			},
		],
	},
	{
		id: 6,
		category: 'Maladies chroniques',
		categoryWo: 'Maladies chroniques',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['cycles', 'trying', 'general'],
		ageRange: '18-44',
		title: 'SOPK : Syndrome des Ovaires Polykystiques',
		titleWo: 'SOPK : Syndrome Ovaires Polykystiques',
		description: 'Troubles hormonaux, cycles irréguliers, fertilité : comprendre et vivre avec le SOPK.',
		descriptionWo: 'Troubles hormonaux, cycles irréguliers, fertilité : xam te vivre ak SOPK.',
		stage: 'young',
		audio: true,
		readTime: '9 min',
		author: 'Dr. Mariama Sow, Endocrinologue',
		authorWo: 'Dr. Mariama Sow, Endocrinologue',
		rating: 4.7,
		readers: 1234,
		featured: false,
		tags: ['SOPK', 'Hormones', 'Fertilité', 'Cycle irrégulier'],
		tagsWo: ['SOPK', 'Hormones', 'Fertilité', 'Cycle irrégulier'],
		content: [
			{ type: 'heading', fr: "Qu'est-ce que le SOPK ?", wo: 'Lu SOPK ?' },
			{
				type: 'text',
				fr: "Le SOPK est un trouble hormonal fréquent. Il peut affecter l'ovulation, le cycle menstruel, la peau, le poids et parfois la fertilité.",
				wo: 'SOPK mooy trouble hormonal bu bari. Mën na jàpp ovulation, cycle menstruel, der, tolluwaay ak yenn saa yi fertilité.',
			},
			{ type: 'heading', fr: 'Ce que tu peux remarquer', wo: 'Li nga mën a gis' },
			{
				type: 'list',
				itemsFr: [
					'Cycles très espacés ou irréguliers',
					'Acné ou peau plus grasse',
					'Pilosité plus marquée chez certaines femmes',
					'Prise de poids ou difficulté à en perdre',
					'Signes d’ovulation moins clairs',
				],
				itemsWo: [
					'Cycles yu sori lool walla yu soppeeku',
					'Acné walla der buy taw',
					'Kaw kawar buy gën a feeñ ci yenn jigéen',
					'Tolluwaay buy yokku walla jafe-jafe ngir wàññi ko',
					'Signes ovulation yu dul leer',
				],
			},
			{ type: 'heading', fr: 'Vivre avec le SOPK', wo: 'Dund ak SOPK' },
			{
				type: 'text',
				fr: "Un suivi médical aide à comprendre ce qui se passe et à choisir les options adaptées : hygiène de vie, traitement hormonal, suivi de l'ovulation ou accompagnement si un projet de grossesse existe.",
				wo: 'Suivi médical dafay dimbali nga xam li ngay dund ak tànnal options yi la méngool : dund gu sell, traitement hormonal, topptoo ovulation walla ndimbal su fekkee am nga projet gàtt.',
			},
			{
				type: 'tip',
				fr: "Le SOPK ne veut pas dire stérilité. Beaucoup de femmes avec un SOPK peuvent concevoir avec un bon accompagnement.",
				wo: 'SOPK du tekki ne doo mën a am doom. Jigéen yu bari am nañu doom ak SOPK bu ñu amee ndimbal bu baax.',
			},
		],
	},
	{
		id: 7,
		category: 'Post-partum',
		categoryWo: 'Après doom',
		lifeStage: 'Maternité',
		lifeStageWo: 'Yaayam',
		lifeSituations: ['postpartum'],
		ageRange: 'all',
		title: "Le post-partum : prendre soin de soi après l'accouchement",
		titleWo: 'Après doom bi : saxal sa boppam après fànnaan',
		description:
			'Récupération physique, allaitement, baby blues, sexualité : tout sur les 40 jours et au-delà.',
		descriptionWo: 'Récupération physique, allaitement, baby blues, sexualité : lépp ci 40 jours yi te ngir ba ci kanam.',
		stage: 'pregnant',
		audio: true,
		readTime: '13 min',
		author: 'Sage-femme Aminata Ndiaye',
		authorWo: 'Sage-femme Aminata Ndiaye',
		rating: 4.9,
		readers: 2156,
		featured: false,
		tags: ['Post-partum', 'Allaitement', 'Récupération', 'Baby blues'],
		tagsWo: ['Après doom', 'Allaitement', 'Récupération', 'Baby blues'],
		content: [
			{ type: 'heading', fr: 'Les 40 jours : un temps sacré', wo: '40 jours yi : temps bu njëkk' },
			{
				type: 'text',
				fr: "Le post-partum est une période de récupération physique, émotionnelle et sociale. Le corps a besoin de repos, de soins et de soutien.",
				wo: 'Post-partum mooy waxtu bu yaram, xel ak dund di dellu ci seen ndànk-ndànk. Yaram bi soxla noppalu, soins ak ndimbal.',
			},
			{ type: 'heading', fr: 'Ce qui est fréquent', wo: 'Li ñu baree gis' },
			{
				type: 'list',
				itemsFr: [
					'Fatigue importante les premières semaines',
					'Saignements progressifs puis diminution',
					'Montée de lait et adaptation à l’allaitement',
					'Vulnérabilité émotionnelle ou baby blues',
				],
				itemsWo: [
					'Fatigue bu bare ci ay semaine yu njëkk',
					'Deret buy ndànk-ndànk wàññiku',
					'Meew buy tàmbali ak njàngum allaitement',
					'Xol buy gën a yëngu walla baby blues',
				],
			},
			{ type: 'heading', fr: 'Prendre soin de soi', wo: 'Naka ngay saxal sa bopp' },
			{
				type: 'list',
				itemsFr: [
					'Boire, manger et dormir dès que possible',
					'Demander de l’aide autour de soi',
					'Consulter si la douleur ou le saignement inquiète',
					'Parler de son humeur sans honte',
				],
				itemsWo: [
					'Naan, lekk ak nelaw saa su mënée am',
					'Laaj ndimbal ci nit ñi nga wër',
					'Dem tabax su mettit walla deret bi la jàq',
					'Wax ci sa humeur te amul rus',
				],
			},
			{
				type: 'warning',
				fr: "Consulte rapidement en cas de fièvre, de saignement abondant, de douleur intense, ou si la tristesse devient envahissante.",
				wo: 'Dem tabax bu gaaw su amee fievre, deret bu bari, mettit bu tar, walla nakharlu bu la gëna di jàpp.',
			},
		],
	},
	{
		id: 8,
		category: 'Ménopause',
		categoryWo: 'Ménopause',
		lifeStage: 'Plénitude',
		lifeStageWo: 'Plénitude',
		lifeSituations: ['menopause', 'general'],
		ageRange: '45+',
		title: 'Ménopause : une nouvelle étape de vie',
		titleWo: 'Ménopause : yoon bu bees ci vie',
		description: 'Symptômes, traitements naturels et hormonaux, bien-être et sagesse de cette transition.',
		descriptionWo: 'Symptômes, traitements naturels ak hormonaux, jàmm ak xam-xam ci transition bi.',
		stage: 'mature',
		audio: true,
		readTime: '11 min',
		author: 'Dr. Mariama Sow, Gynécologue',
		authorWo: 'Dr. Mariama Sow, Gynécologue',
		rating: 4.8,
		readers: 1567,
		featured: false,
		tags: ['Ménopause', 'Hormones', 'Bouffées de chaleur', 'Bien-être'],
		tagsWo: ['Ménopause', 'Hormones', 'Bouffées chaleur', 'Jàmm'],
		content: [
			{ type: 'heading', fr: "Qu'est-ce que la ménopause ?", wo: 'Lu ménopause ?' },
			{
				type: 'text',
				fr: "La ménopause correspond à l'arrêt définitif des règles. C'est une transition normale, mais les symptômes et le vécu varient beaucoup d'une femme à l'autre.",
				wo: 'Ménopause mooy jeexital gu mat gu règles yi. Transition bu normal la, waaye symptômes ak ni jigéen ji koy dunde mën na soppeeku.',
			},
			{ type: 'heading', fr: 'Symptômes possibles', wo: 'Symptômes yi mën a am' },
			{
				type: 'list',
				itemsFr: [
					'Bouffées de chaleur',
					'Troubles du sommeil',
					'Variations d’humeur',
					'Sécheresse vaginale',
					'Cycles irréguliers en préménopause',
				],
				itemsWo: [
					'Bouffées de chaleur',
					'Jafe-jafe ci nelaw',
					'Humeur buy soppeeku',
					'Secheresse vaginale',
					'Cycles yu soppeeku ci préménopause',
				],
			},
			{
				type: 'text',
				fr: "Le confort passe par une bonne information, l'activité physique, l'alimentation, et parfois un accompagnement médical ou psychologique.",
				wo: 'Jàmm ji dafay jaar ci xam-xam bu baax, movement, lekk wu sell, ak yenn saa yi ndimbal médical walla psychologique.',
			},
			{
				type: 'tip',
				fr: "Parler de la ménopause avec une professionnelle de santé peut aider à trouver des solutions adaptées à tes symptômes.",
				wo: 'Wax ci ménopause ak professionnelle santé mën na dimbali nga gis solutions yu méngook sa symptômes.',
			},
		],
	},
	{
		id: 9,
		category: 'Infertilité',
		categoryWo: 'Infertilité',
		lifeStage: 'Conception',
		lifeStageWo: 'Conception',
		lifeSituations: ['trying', 'general'],
		ageRange: '18-49',
		title: 'Infertilité : causes, examens et solutions',
		titleWo: 'Infertilité : causes, examens ak solutions',
		description: 'Quand consulter, bilans de fertilité, PMA et adoption. Briser le tabou avec empathie.',
		descriptionWo: 'Kañ consultez, bilans fertilité, PMA ak adoption. Fessal tabou bi ak empathie.',
		stage: 'young',
		audio: true,
		readTime: '12 min',
		author: 'Dr. Aïssatou Ba, Spécialiste fertilité',
		authorWo: 'Dr. Aïssatou Ba, Spécialiste fertilité',
		rating: 4.7,
		readers: 1423,
		featured: false,
		tags: ['Infertilité', 'PMA', 'Fertilité', 'Conception'],
		tagsWo: ['Infertilité', 'PMA', 'Fertilité', 'Conception'],
		content: [
			{ type: 'heading', fr: "Qu'est-ce que l'infertilité ?", wo: 'Lu infertilité ?' },
			{
				type: 'text',
				fr: "On parle d'infertilité lorsqu'une grossesse ne survient pas après plusieurs mois de rapports réguliers sans contraception. Cela concerne les femmes comme les hommes.",
				wo: 'Ñuy wax infertilité su gàtt amul ginnaaw ay weer yu bari ci rapports yu siiw te amul contraception. Loolu jàpp jigéen ak góor.',
			},
			{ type: 'heading', fr: 'Causes possibles', wo: 'Causes yi mën a am' },
			{
				type: 'list',
				itemsFr: [
					'Troubles de l’ovulation',
					'Problèmes de trompes ou d’utérus',
					'IST anciennes non traitées',
					'Facteurs masculins liés au sperme',
					'Âge et certaines maladies chroniques',
				],
				itemsWo: [
					'Jafe-jafe ci ovulation',
					'Jafe-jafe ci trompes walla utérus',
					'IST yu mag yu ñu dul faj',
					'Facteurs yu jëm ci góor ak sperme',
					'At ak yenn maladies chroniques',
				],
			},
			{ type: 'heading', fr: 'Premiers examens', wo: 'Examens yu njëkk' },
			{
				type: 'text',
				fr: "Le bilan peut inclure des questions sur le cycle, des tests hormonaux, une échographie, une évaluation du sperme, ou d'autres examens selon la situation.",
				wo: 'Bilan bi mën na boole laaj ci cycle, tests hormonaux, échographie, xool ni sperme bi mel, walla yeneen examens selon xaalis bi.',
			},
			{
				type: 'tip',
				fr: "Chercher de l'aide tôt permet d'identifier plus vite les solutions. L'infertilité n'est pas une faute ni une honte.",
				wo: 'Seet ndimbal bu gaaw dafay may nga gën a gaaw gis solutions yi. Infertilité du bàkkaar te du rus.',
			},
		],
	},
	{
		id: 10,
		category: 'Maladies chroniques',
		categoryWo: 'Maladies chroniques',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'cycles'],
		ageRange: 'all',
		title: 'Maladies chroniques et santé reproductive',
		titleWo: 'Maladies chroniques ak santé reproductive',
		description: 'Diabète, hypertension, drépanocytose : impact sur le cycle, la grossesse et la fertilité.',
		descriptionWo: 'Diabète, hypertension, drépanocytose : impact ci cycle, gàtt ak fertilité.',
		stage: 'young',
		audio: true,
		readTime: '10 min',
		author: 'Dr. Cheikh Diop, Médecin généraliste',
		authorWo: 'Dr. Cheikh Diop, Médecin généraliste',
		rating: 4.6,
		readers: 892,
		featured: false,
		tags: ['Maladies chroniques', 'Diabète', 'Hypertension', 'Drépanocytose'],
		tagsWo: ['Maladies chroniques', 'Diabète', 'Hypertension', 'Drépanocytose'],
		content: [
			{ type: 'heading', fr: 'Vivre avec une maladie chronique', wo: 'Vivre ak maladie chronique' },
			{
				type: 'text',
				fr: "Le diabète, l'hypertension ou la drépanocytose peuvent influencer le cycle, la fertilité, la grossesse ou le choix d'une contraception. Un suivi régulier change beaucoup les choses.",
				wo: 'Diabète, hypertension walla drépanocytose mën nañu jàpp cycle, fertilité, gàtt walla ni ñuy tànne contraception. Suivi bu siiw dafay soppi lu bari.',
			},
			{ type: 'heading', fr: 'Points de vigilance', wo: 'Li war a tax nga moytu' },
			{
				type: 'list',
				itemsFr: [
					'Vérifier si les traitements sont compatibles avec un projet de grossesse',
					'Signaler toute maladie chronique pendant une consultation SSR',
					'Surveiller la tension, la glycémie ou la fatigue selon le cas',
					'Ne pas arrêter un traitement sans avis médical',
				],
				itemsWo: [
					'Xool ndax traitements yi méngoo nañu ak projet gàtt',
					'Waxal sa maladie chronique bu nekk ci consultation SSR',
					'Topptoo tension, sucre walla fatigue selon xaalis bi',
					'Bul taxawal traitement bu amul avis médical',
				],
			},
			{
				type: 'tip',
				fr: "Préparer sa grossesse avec son médecin améliore souvent la sécurité de la mère et du bébé.",
				wo: 'Waajal sa gàtt ak sa médecin dafay gën a aar yaay bi ak doom bi.',
			},
		],
	},
	{
		id: 11,
		category: 'Cancers & SSR',
		categoryWo: 'Cancers & Wér wi',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'cycles', 'menopause', 'curious'],
		ageRange: 'all',
		title: "Cancer du col de l'utérus : prévenir, dépister, agir",
		titleWo: 'Cancer col utérus : jiitu, dépister, jëf',
		description:
			'Premier cancer gynécologique en Afrique de l\'Ouest. HPV, vaccination, dépistage par frottis et IVA, et traitements disponibles.',
		descriptionWo:
			'Cancer gynécologique bu njëkk ci Afrique de l\'Ouest. HPV, vaccination, dépistage frottis ak IVA, ak traitements yi am.',
		stage: 'young',
		audio: true,
		readTime: '14 min',
		author: 'Dr. Awa Cissé, Oncologue gynécologue',
		authorWo: 'Dr. Awa Cissé, Oncologue gynécologue',
		rating: 4.9,
		readers: 3245,
		featured: true,
		tags: ['Cancer', 'Col utérus', 'HPV', 'Vaccination', 'Dépistage', 'Prévention'],
		tagsWo: ['Cancer', 'Col utérus', 'HPV', 'Vaccination', 'Dépistage', 'Jiitu'],
		content: [
			{ type: 'heading', fr: 'Un cancer évitable : comprendre le cancer du col', wo: 'Cancer bu mën jiitu : xam cancer col bi' },
			{
				type: 'text',
				fr: "Le cancer du col de l'utérus est souvent lié à une infection persistante par certains types de HPV. Dépisté tôt, il peut être évité ou traité plus efficacement.",
				wo: 'Cancer col utérus bi lu bari dafay aju ci infection HPV buy yàgg. Su ñu ko dépistee gaaw, mën nañu ko jiitu walla faj ko gën a baax.',
			},
			{ type: 'heading', fr: 'Prévenir', wo: 'Jiitul ko' },
			{
				type: 'list',
				itemsFr: [
					'Vaccination contre le HPV quand elle est disponible',
					'Dépistage régulier par frottis, IVA ou autre méthode locale',
					'Consultation si saignement après rapport ou pertes inhabituelles',
				],
				itemsWo: [
					'Vaccination HPV su amee',
					'Dépistage bu siiw ak frottis, IVA walla beneen méthode bu nekk ci bërab bi',
					'Consultation su deret feeñee gannaaw rapport walla am pertes yu bees',
				],
			},
			{
				type: 'warning',
				fr: "Des saignements après les rapports, des douleurs persistantes ou des pertes anormales doivent faire consulter.",
				wo: 'Deret gannaaw rapports, mettit buy yàgg walla pertes bu dul normal war nañu tax nga dem consultation.',
			},
		],
	},
	{
		id: 12,
		category: 'Cancers & SSR',
		categoryWo: 'Cancers & Wér wi',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'menopause', 'cycles', 'postpartum'],
		ageRange: 'all',
		title: 'Cancer du sein : autopalpation, dépistage et traitements',
		titleWo: 'Cancer sein bi : autopalpation, dépistage ak traitements',
		description:
			"Apprendre l'autopalpation, connaître les facteurs de risque, le dépistage précoce et les options de traitement en Afrique de l'Ouest.",
		descriptionWo:
			"Jàng autopalpation, xam facteurs risque, dépistage bu gàw ak options traitement ci Afrique de l'Ouest.",
		stage: 'mature',
		audio: true,
		readTime: '15 min',
		author: 'Dr. Ndèye Fatou Kane, Oncologue sénologue',
		authorWo: 'Dr. Ndèye Fatou Kane, Oncologue sénologue',
		rating: 4.9,
		readers: 4567,
		featured: true,
		tags: ['Cancer du sein', 'Autopalpation', 'Dépistage', 'Mammographie', 'Prévention'],
		tagsWo: ['Cancer sein', 'Autopalpation', 'Dépistage', 'Mammographie', 'Jiitu'],
		content: [
			{ type: 'heading', fr: "Le cancer du sein en Afrique de l'Ouest", wo: "Cancer sein bi ci Afrique de l'Ouest" },
			{
				type: 'text',
				fr: "Le cancer du sein peut toucher des femmes de différents âges. Un repérage précoce améliore les chances de traitement et d'accompagnement.",
				wo: 'Cancer sein bi mën na jàpp jigéen yu at yu bare. Su ñu ko gis gaaw, chancesu traitement ak topptoo yi dinañu gën a baax.',
			},
			{ type: 'heading', fr: 'Surveiller ses seins', wo: 'Topptoo sa ween yi' },
			{
				type: 'list',
				itemsFr: [
					'Boule inhabituelle',
					'Changement de taille ou de forme',
					'Écoulement au mamelon',
					'Peau qui se rétracte ou devient épaisse',
					'Douleur persistante localisée',
				],
				itemsWo: [
					'Boule bu dul normal',
					'Soppi ci tollu walla melokaanu ween wi',
					'Liquide buy génne ci mamelon bi',
					'Der buy tàq walla gën a dëgër',
					'Mettit buy yàgg ci benn bërab',
				],
			},
			{
				type: 'tip',
				fr: "L'autopalpation aide à mieux connaître ses seins, mais elle ne remplace pas la mammographie ou l'avis médical.",
				wo: 'Autopalpation dafay dimbali nga xam sa ween yi, waaye du remplacer mammographie walla avis médical.',
			},
		],
	},
	{
		id: 13,
		category: 'Cancers & SSR',
		categoryWo: 'Cancers & Wér wi',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'menopause', 'cycles'],
		ageRange: 'all',
		title: 'Cancers gynécologiques : ovaires, endomètre et vulve',
		titleWo: 'Cancers gynécologiques : ovaires, endomètre ak vulve',
		description:
			"Symptômes souvent silencieux, facteurs de risque et prise en charge des cancers de l'ovaire, de l'endomètre et de la vulve.",
		descriptionWo:
			'Symptômes yu gën a nëbb, facteurs risque ak prise en charge cancers ovaire, endomètre ak vulve.',
		stage: 'mature',
		audio: true,
		readTime: '16 min',
		author: 'Dr. Awa Cissé, Oncologue gynécologue',
		authorWo: 'Dr. Awa Cissé, Oncologue gynécologue',
		rating: 4.8,
		readers: 1876,
		featured: false,
		tags: ['Cancer ovaire', 'Cancer endomètre', 'Cancer vulve', 'Gynécologie', 'Dépistage'],
		tagsWo: ['Cancer ovaire', 'Cancer endomètre', 'Cancer vulve', 'Gynécologie', 'Dépistage'],
		content: [
			{ type: 'heading', fr: 'Les cancers gynécologiques : des ennemis silencieux', wo: 'Cancers gynécologiques : mbokk ennemi bu nëbb' },
			{
				type: 'text',
				fr: "Les cancers de l'ovaire, de l'endomètre ou de la vulve peuvent donner des signes discrets. Une écoute attentive du corps est importante, surtout si un symptôme persiste.",
				wo: 'Cancers ovaire, endomètre walla vulve mën nañu jox signes yu sutura. Déglu sa yaram am na solo, rawatina bu signe benn buy yàgg.',
			},
			{ type: 'heading', fr: 'Signes à ne pas négliger', wo: 'Signes yu warul nga rawati' },
			{
				type: 'list',
				itemsFr: [
					'Ballonnements persistants',
					'Saignements après la ménopause',
					'Douleurs pelviennes qui reviennent',
					'Lésion ou démangeaison vulvaire persistante',
				],
				itemsWo: [
					'Boppu biir buy yàgg',
					'Deret gannaaw ménopause',
					'Mettit pelvienne buy dellusi',
					'Gaañu walla démangeaison ci vulve buy yàgg',
				],
			},
			{
				type: 'warning',
				fr: "Quand un symptôme dure plusieurs semaines, mieux vaut demander un avis professionnel que d'attendre.",
				wo: 'Bu signe benn yàggee ay semaine, gën na nga laaj avis professionnel lu dul nga muñ rekk.',
			},
		],
	},
	{
		id: 14,
		category: 'Foi & Santé',
		categoryWo: 'Dëgg-dëgg ak Wér',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'curious', 'contraception', 'pregnant'],
		ageRange: 'all',
		title: 'Islam et santé reproductive',
		titleWo: 'Islam ak wér wi',
		description: 'Contraception, planification familiale et soins de santé selon les enseignements islamiques.',
		descriptionWo: 'Contraception, planification familiale ak soins wér yi selon enseignements islamiques.',
		stage: 'young',
		audio: true,
		readTime: '12 min',
		author: 'Aïcha Ndiaye, Conseillère',
		authorWo: 'Aïcha Ndiaye, Conseillère',
		rating: 4.8,
		readers: 2156,
		featured: false,
		tags: ['Islam', 'Foi', 'Contraception', 'Religion', 'SSR'],
		tagsWo: ['Islam', 'Dëgg-dëgg', 'Contraception', 'Dëgg-dëgg', 'SSR'],
		content: [
			{
				type: 'heading',
				fr: 'Foi, santé et responsabilité',
				wo: 'Ngëm, wér ak responsabilité',
			},
			{
				type: 'text',
				fr: "L'islam reconnaît le droit des femmes à prendre soin de leur santé reproductive.",
				wo: 'Islam bi dafa xam droit jigéen yi ci saxal seen wér wi.',
			},
			{
				type: 'text',
				fr: "Dans de nombreuses familles musulmanes, la planification familiale est discutée sous l'angle de la responsabilité, du bien-être du couple et de la protection de la mère.",
				wo: 'Ci ëpp familles musulmanes, planification familiale bi dañuy wax ci niñu wara yëgle responsabilité, jàmmu jëkkër ak jabar, ak aaru yaay bi.',
			},
			{
				type: 'tip',
				fr: "Une conversation respectueuse avec un soignant de confiance ou une personne ressource de la communauté peut aider à concilier foi et santé.",
				wo: 'Waxtaan bu ànd ak respect ak soignant bu la wóor walla nit ku am xam-xam ci communauté bi mën na dimbali nga méngale ngëm ak wér.',
			},
		],
	},
	{
		id: 15,
		category: 'Foi & Santé',
		categoryWo: 'Dëgg-dëgg ak Wér',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'curious', 'contraception', 'pregnant'],
		ageRange: 'all',
		title: 'Christianisme et santé reproductive',
		titleWo: 'Christianisme ak wér wi',
		description: 'Perspectives chrétiennes sur la planification familiale et le respect du corps.',
		descriptionWo: 'Perspectives chrétiennes ci planification familiale ak respect yaram bi.',
		stage: 'young',
		audio: true,
		readTime: '11 min',
		author: 'Marie-Claire Sène',
		authorWo: 'Marie-Claire Sène',
		rating: 4.7,
		readers: 1843,
		featured: false,
		tags: ['Christianisme', 'Foi', 'Contraception', 'Religion', 'SSR'],
		tagsWo: ['Christianisme', 'Dëgg-dëgg', 'Contraception', 'Dëgg-dëgg', 'SSR'],
		content: [
			{
				type: 'heading',
				fr: 'Le corps, la dignité et le discernement',
				wo: 'Yaram bi, dignité ak xalaat bu sell',
			},
			{
				type: 'text',
				fr: 'Le christianisme valorise la vie, la famille et le respect du corps.',
				wo: 'Christianisme bi dafa valorise vie bi, waa kër ak respect yaram bi.',
			},
			{
				type: 'text',
				fr: "Dans de nombreuses communautés chrétiennes, la santé reproductive peut être abordée avec prudence, bienveillance et sens des responsabilités envers soi-même et sa famille.",
				wo: 'Ci ëpp communautés chrétiennes, santé reproductive mën nañu ko wax ak moytul, yërmandé ak responsabilité ci bopp ak ci njaboot.',
			},
			{
				type: 'tip',
				fr: "Quand un sujet semble sensible, s'appuyer sur un professionnel de santé de confiance peut faciliter le dialogue.",
				wo: 'Bu sujet benn yëngoo, wéeru ci professionnel santé bu la wóor mën na yombal waxtaan bi.',
			},
		],
	},
	{
		id: 16,
		category: 'SSR',
		categoryWo: 'Wér Sexuelle',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'curious', 'contraception', 'cycles'],
		ageRange: 'all',
		title: 'Comprendre la Santé Sexuelle et Reproductive',
		titleWo: 'Fàtte Wér Sexuelle ak Reproductive',
		description: "Tout ce qu'il faut savoir sur tes droits, ton corps et ta santé reproductive.",
		descriptionWo: 'Lépp bu nga war a xam ci sa droits, sa yaram ak sa wér reproductive.',
		stage: 'young',
		audio: true,
		readTime: '14 min',
		author: 'Dr. Aminata Ba',
		authorWo: 'Dr. Aminata Ba',
		rating: 4.9,
		readers: 4521,
		featured: false,
		tags: ['SSR', 'Droits', 'Santé Sexuelle', 'Éducation'],
		tagsWo: ['SSR', 'Droits', 'Wér Sexuelle', 'Jàngale'],
		content: [
			{
				type: 'heading',
				fr: 'La SSR au quotidien',
				wo: 'SSR ci dund gu bés bu nekk',
			},
			{
				type: 'text',
				fr: 'La Santé Sexuelle et Reproductive concerne tous les aspects de ta santé liés à ton système reproductif.',
				wo: 'Wér Sexuelle ak Reproductive daf concerné yépp aspects sa wér yi liés ci sa système reproductif.',
			},
			{
				type: 'list',
				itemsFr: [
					'Comprendre son corps et son cycle',
					'Prévenir les grossesses non souhaitées',
					'Se protéger contre les IST',
					'Accéder au suivi de grossesse et à l’accouchement sécurisé',
					'Faire respecter ses droits et son consentement',
				],
				itemsWo: [
					'Xam sa yaram ak sa cycle',
					'Jiit gàtt gu ñu bëggul',
					'Aar sa bopp ci IST',
					'Am suivi gàtt ak fànnaan bu aar',
					'Saxal sa droits ak sa consentement',
				],
			},
			{
				type: 'tip',
				fr: "La SSR ne concerne pas seulement la maladie. Elle parle aussi de bien-être, d'information, de choix et de dignité.",
				wo: 'SSR du ci feebar rekk. Dafay itam wax ci jàmm, xam-xam, tànn ak dignité.',
			},
		],
	},
	{
		id: 17,
		category: 'Contraception',
		categoryWo: 'Contraception',
		lifeStage: 'Protection',
		lifeStageWo: 'Jafe',
		lifeSituations: ['contraception', 'general', 'curious'],
		ageRange: 'all',
		title: "Contraception d'urgence : quand et comment l'utiliser",
		titleWo: "Contraception d'urgence : kañ ak naka ñuy ko jëfandikoo",
		description:
			"Pilule d'urgence, délai d'utilisation, efficacité et idées reçues à connaître après un rapport non protégé.",
		descriptionWo:
			"Pilule d'urgence, waxtu jëfandikoo, efficacité ak xalaat yu wrong yu war a xam ginnaaw rapport bu amul aar.",
		stage: 'young',
		audio: true,
		readTime: '8 min',
		author: 'Dr. Fatou Diallo, Gynécologue',
		authorWo: 'Dr. Fatou Diallo, Gynécologue',
		rating: 4.8,
		readers: 1986,
		featured: false,
		tags: ['Contraception', 'Urgence', 'Pilule du lendemain', 'Prévention'],
		tagsWo: ['Contraception', 'Urgence', 'Pilule du lendemain', 'Prévention'],
		content: [
			{ type: 'heading', fr: "A quoi sert la contraception d'urgence ?", wo: "Lu tax ñuy jëfandikoo contraception d'urgence ?" },
			{
				type: 'text',
				fr: "La contraception d'urgence peut réduire le risque de grossesse après un rapport non protégé ou en cas d'oubli de méthode. Elle doit être utilisée le plus tôt possible.",
				wo: "Contraception d'urgence mën na wàññi risque gàtt ginnaaw rapport bu amul aar walla bu amee oubli ci méthode bi. War naa ñu ko jëfandikoo bu gaaw."
			},
			{
				type: 'list',
				itemsFr: [
					'Elle ne remplace pas une méthode régulière.',
					'Elle ne protège pas contre les IST.',
					'Plus elle est prise tôt, plus elle a de chances d’être utile.',
					'En cas de vomissement rapide après la prise, demande conseil sans tarder.',
				],
				itemsWo: [
					'Du wuutu méthode bu siiw.',
					'Du aar ci IST.',
					'Bu ñu ko jëlee bu gaaw, moo gën a mën a dimbali.',
					'Su vomissement amee bu gaaw ginnaaw prise bi, laajal digalante bu gaaw.',
				],
			},
		],
	},
	{
		id: 18,
		category: 'Grossesse',
		categoryWo: 'Gàtt',
		lifeStage: 'Maternité',
		lifeStageWo: 'Yaayam',
		lifeSituations: ['pregnant', 'trying', 'general'],
		ageRange: 'all',
		title: "Premiers signes de grossesse : ce qu'ils veulent dire",
		titleWo: "Signes yu njëkk ci gàtt : lan lañuy tekki",
		description:
			"Retard de règles, nausées, fatigue, seins sensibles : comment reconnaître les premiers changements et quand faire un test.",
		descriptionWo:
			"Retard règles, nausées, fatigue, ween yuy metti : naka ngay xame soppi yu njëkk ak kañ nga wara def test.",
		stage: 'pregnant',
		audio: true,
		readTime: '8 min',
		author: 'Sage-femme Aminata Ndiaye',
		authorWo: 'Sage-femme Aminata Ndiaye',
		rating: 4.8,
		readers: 1764,
		featured: false,
		tags: ['Grossesse', 'Test de grossesse', 'Retard de règles', 'Symptômes'],
		tagsWo: ['Gàtt', 'Test gàtt', 'Retard règles', 'Symptômes'],
		content: [
			{ type: 'heading', fr: 'Reconnaître les premiers signes', wo: 'Xam signs yu njëkk yi' },
			{
				type: 'list',
				itemsFr: [
					'Retard de règles',
					'Fatigue inhabituelle',
					'Nausées ou dégoûts alimentaires',
					'Seins plus sensibles',
					'Envie fréquente d’uriner chez certaines femmes',
				],
				itemsWo: [
					'Retard règles',
					'Fatigue bu bees',
					'Nausées walla bëggul yenn lekk',
					'Ween yi gën a metti',
					'Suuxat buy bari ci yenn jigéen',
				],
			},
			{
				type: 'text',
				fr: "Ces signes ne suffisent pas toujours à confirmer une grossesse. Un test de grossesse ou une consultation permet d'y voir plus clair.",
				wo: "Signes yii duñu doy ngir firndeel gàtt ci yeneen xaalis. Test gàtt walla consultation mën na leeral xaalis bi."
			},
		],
	},
	{
		id: 19,
		category: 'Maladies chroniques',
		categoryWo: 'Maladies chroniques',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['cycles', 'general', 'menopause'],
		ageRange: '25+',
		title: 'Fibromes utérins : saignements, douleurs et options',
		titleWo: 'Fibromes utérins : deret, mettit ak options',
		description:
			"Comprendre les fibromes, leurs signes fréquents et les solutions possibles selon les symptômes et le projet de vie.",
		descriptionWo:
			"Xam fibromes yi, seen signes yu bari ak solutions yi mën a am selon symptômes ak projet de vie.",
		stage: 'mature',
		audio: true,
		readTime: '10 min',
		author: 'Dr. Aïssatou Ba, Gynécologue',
		authorWo: 'Dr. Aïssatou Ba, Gynécologue',
		rating: 4.7,
		readers: 1322,
		featured: false,
		tags: ['Fibrome', 'Saignements', 'Douleurs pelviennes', 'Utérus'],
		tagsWo: ['Fibrome', 'Deret', 'Mettit pelvienne', 'Utérus'],
		content: [
			{ type: 'heading', fr: 'Que sont les fibromes ?', wo: 'Lan la fibromes yi ?' },
			{
				type: 'text',
				fr: "Les fibromes sont des masses bénignes de l'utérus. Certaines femmes n'ont aucun symptôme, d'autres ont des règles abondantes, une sensation de pesanteur ou des douleurs.",
				wo: "Fibromes yi ay masses yu baax lañu ci utérus bi. Yenn jigéen amuñu benn symptôme, yeneen am règles yu bari, biir buy diis walla mettit."
			},
			{
				type: 'warning',
				fr: "Des saignements très abondants, une anémie, un ventre qui grossit ou des douleurs persistantes méritent une consultation.",
				wo: "Deret bu bari lool, anémie, biir buy rëy walla mettit buy yàgg war naa tax consultation."
			},
		],
	},
	{
		id: 20,
		category: 'IST & Prévention',
		categoryWo: 'IST & Prévention',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'contraception', 'curious'],
		ageRange: 'all',
		title: 'Pertes vaginales : normales ou signe d’alerte ?',
		titleWo: 'Pertes vaginales : normal walla signe d’alerte ?',
		description:
			"Couleur, odeur, démangeaisons, douleur : apprendre à distinguer ce qui est habituel de ce qui doit faire consulter.",
		descriptionWo:
			"Melo, xet, démangeaisons, mettit : jàng ni nga man a xam li normal ak li wara tax consultation.",
		stage: 'young',
		audio: true,
		readTime: '9 min',
		author: 'Dr. Cheikh Diop, Infectiologue',
		authorWo: 'Dr. Cheikh Diop, Infectiologue',
		rating: 4.7,
		readers: 2107,
		featured: false,
		tags: ['Pertes vaginales', 'Infection', 'Prévention', 'Consultation'],
		tagsWo: ['Pertes vaginales', 'Infection', 'Prévention', 'Consultation'],
		content: [
			{ type: 'heading', fr: 'Ce qui peut être habituel', wo: 'Li mën a nekk lu siiw' },
			{
				type: 'text',
				fr: "Les pertes vaginales peuvent varier selon le cycle. Elles peuvent devenir plus transparentes ou plus abondantes autour de l'ovulation sans être anormales.",
				wo: "Pertes vaginales yi mën nañu soppeeku selon cycle bi. Mën nañu gën a leer walla bari ci waxtu ovulation te du lu dul normal."
			},
			{
				type: 'list',
				itemsFr: [
					'Odeur forte inhabituelle',
					'Démangeaisons',
					'Brûlure ou douleur',
					'Couleur verdâtre, grisâtre ou présence de sang hors règles',
				],
				itemsWo: [
					'Xet bu tar bu dul siiw',
					'Démangeaisons',
					'Brûlure walla mettit',
					'Melo bu vert, gris walla deret ci biti règles',
				],
			},
		],
	},
	{
		id: 21,
		category: 'Ménopause',
		categoryWo: 'Ménopause',
		lifeStage: 'Plénitude',
		lifeStageWo: 'Plénitude',
		lifeSituations: ['menopause', 'general'],
		ageRange: '45+',
		title: 'Sommeil, humeur et ménopause',
		titleWo: 'Nelaw, humeur ak ménopause',
		description:
			"Pourquoi le sommeil et l’humeur changent pendant la transition hormonale, et quels repères peuvent aider au quotidien.",
		descriptionWo:
			"Lu tax nelaw ak humeur di soppeeku ci waxtu transition hormonale, ak repères yi mën a dimbali ci dund gu bés bu nekk.",
		stage: 'mature',
		audio: true,
		readTime: '9 min',
		author: 'Dr. Mariama Sow, Gynécologue',
		authorWo: 'Dr. Mariama Sow, Gynécologue',
		rating: 4.8,
		readers: 1189,
		featured: false,
		tags: ['Ménopause', 'Sommeil', 'Humeur', 'Bien-être'],
		tagsWo: ['Ménopause', 'Nelaw', 'Humeur', 'Jàmm'],
		content: [
			{ type: 'heading', fr: 'Des changements fréquents', wo: 'Soppi yu bari' },
			{
				type: 'text',
				fr: "Pendant la ménopause, certaines femmes dorment moins bien, se réveillent la nuit ou se sentent plus irritables. Ces changements sont réels et méritent d'être pris au sérieux.",
				wo: "Ci ménopause, yenn jigéen dafa leen jafe ci nelaw, ñu di yeewu guddi walla ñu gën a mer. Soppi yii dëgg lañu te war naa ñu leen jàppe ci solo."
			},
			{
				type: 'tip',
				fr: "Parler du sommeil, de l'anxiété ou de l'humeur en consultation peut ouvrir la porte à des solutions simples et utiles.",
				wo: "Wax ci nelaw, anxiété walla humeur ci consultation mën na ubbi bunt bi ci solutions yu yomb te jariñ."
			},
		],
	},
	{
		id: 22,
		category: 'SSR',
		categoryWo: 'Wér Sexuelle',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'curious', 'contraception'],
		ageRange: 'all',
		title: 'Consentement, respect et vie intime',
		titleWo: 'Consentement, respect ak dund gu intime',
		description:
			"Comprendre le consentement, les limites, le respect dans le couple et les signes de violence ou de pression.",
		descriptionWo:
			"Xam consentement, limites, respect ci couple bi ak signes violence walla pression.",
		stage: 'young',
		audio: true,
		readTime: '9 min',
		author: 'Aïcha Ndiaye, Conseillère',
		authorWo: 'Aïcha Ndiaye, Conseillère',
		rating: 4.9,
		readers: 1675,
		featured: false,
		tags: ['Consentement', 'Violence', 'Droits', 'SSR'],
		tagsWo: ['Consentement', 'Violence', 'Droits', 'SSR'],
		content: [
			{ type: 'heading', fr: 'Le consentement doit être clair', wo: 'Consentement bi war naa leer' },
			{
				type: 'text',
				fr: "Le consentement veut dire un accord libre, éclairé et réversible. Le silence, la peur ou la pression ne sont pas un oui.",
				wo: "Consentement mooy ndigël bu libre, bu leer te mën a soppeeku. Noppalu, tiit walla pression du waaw."
			},
			{
				type: 'warning',
				fr: "Si tu te sens forcée, menacée ou empêchée de décider pour ton corps, cela mérite du soutien et une aide adaptée.",
				wo: "Su fekkee dangay yëg ne ñu la force, la threats walla la tere nga tànn ci sa yaram, loolu war naa ndimbal ak jàppale bu méngoo."
			},
		],
	},
	{
		id: 23,
		category: 'Post-partum',
		categoryWo: 'Après doom',
		lifeStage: 'Maternité',
		lifeStageWo: 'Yaayam',
		lifeSituations: ['postpartum', 'pregnant'],
		ageRange: 'all',
		title: 'Allaitement : bien démarrer et gérer les difficultés',
		titleWo: 'Allaitement : tàmbali ko bu baax ak gérer jafe-jafe yi',
		description:
			"Position, fréquence, douleurs, crevasses et signes qui justifient de demander de l’aide pendant l’allaitement.",
		descriptionWo:
			"Position, fréquence, mettit, crevasses ak signes yi wara tax nga laaj ndimbal ci allaitement.",
		stage: 'pregnant',
		audio: true,
		readTime: '10 min',
		author: 'Sage-femme Aminata Ndiaye',
		authorWo: 'Sage-femme Aminata Ndiaye',
		rating: 4.8,
		readers: 1438,
		featured: false,
		tags: ['Allaitement', 'Post-partum', 'Maternité', 'Douleurs'],
		tagsWo: ['Allaitement', 'Après doom', 'Maternité', 'Mettit'],
		content: [
			{ type: 'heading', fr: 'Les premiers jours comptent', wo: 'Fan yu njëkk yi am nañu solo' },
			{
				type: 'text',
				fr: "L'allaitement peut demander de l'apprentissage. Une bonne position et une prise correcte du sein peuvent réduire la douleur et aider le bébé à bien téter.",
				wo: "Allaitement bi mën naa soxla njàng. Position bu baax ak ni doom bi di jàpp ween wi mën naa wàññi mettit te dimbali doom bi mu naan bu baax."
			},
			{
				type: 'list',
				itemsFr: [
					'Douleur persistante au mamelon',
					'Fièvre',
					'Sein rouge et très douloureux',
					'Bébé qui ne prend pas bien le sein ou qui urine très peu',
				],
				itemsWo: [
					'Mettit buy yàgg ci mamelon',
					'Fievre',
					'Ween wu xonq te metti lool',
					'Doom buy jàpp ween wi lu bon walla buy suuxat lu néew lool',
				],
			},
		],
	},
	{
		id: 24,
		category: 'Fertilité',
		categoryWo: 'Fertilité',
		lifeStage: 'Conception',
		lifeStageWo: 'Conception',
		lifeSituations: ['trying', 'general', 'cycles'],
		ageRange: '18-44',
		title: 'Fausse couche : comprendre, se soigner, se relever',
		titleWo: 'Fausse couche : xam, faj boppam, jógat',
		description:
			"Repères sur la fausse couche, signes fréquents, récupération physique et émotionnelle, et moments où consulter rapidement.",
		descriptionWo:
			"Repères ci fausse couche, signes yu bari, récupération physique ak émotionnelle, ak waxtu yi wara tax consultation bu gaaw.",
		stage: 'young',
		audio: true,
		readTime: '10 min',
		author: 'Dr. Aïssatou Ba, Gynécologue',
		authorWo: 'Dr. Aïssatou Ba, Gynécologue',
		rating: 4.8,
		readers: 1094,
		featured: false,
		tags: ['Fausse couche', 'Grossesse', 'Douleur', 'Soutien émotionnel'],
		tagsWo: ['Fausse couche', 'Gàtt', 'Mettit', 'Ndimbal xol'],
		content: [
			{ type: 'heading', fr: 'Une épreuve qui demande du soutien', wo: 'Nattu bu soxla ndimbal' },
			{
				type: 'text',
				fr: "Une fausse couche est une expérience physique et émotionnelle difficile. Elle n'est pas causée par une faute de la femme dans la grande majorité des cas.",
				wo: "Faussse couche mooy expérience bu metti ci yaram ak ci xol. Lu bari du aju ci bàkkaaru jigéen ji."
			},
			{
				type: 'warning',
				fr: "En cas de saignement très abondant, de fièvre, de malaise ou de douleur intense, une consultation rapide est nécessaire.",
				wo: "Su amee deret bu bari lool, fievre, malaise walla mettit bu tar, consultation bu gaaw war na am."
			},
		],
	},
	{
		id: 25,
		category: 'Cycle & règles',
		categoryWo: 'Cycle ak règles',
		lifeStage: 'Découverte',
		lifeStageWo: 'Xam-xam',
		lifeSituations: ['cycles', 'general', 'curious'],
		ageRange: 'all',
		title: 'Cycle & règles : comprendre son rythme',
		titleWo: 'Cycle ak règles : xam sa rythme',
		description:
			'Un repère simple pour comprendre les phases du cycle, ce qui est fréquent pendant les règles et les signes qui demandent une consultation.',
		descriptionWo:
			'Repère bu yomb ngir xam phases yu cycle bi, li mën a nekk lu siiw ci règles ak signes yi wara tax consultation.',
		stage: 'young',
		audio: true,
		readTime: '8 min',
		author: 'Sage-femme Aminata Ndiaye',
		authorWo: 'Sage-femme Aminata Ndiaye',
		rating: 4.8,
		readers: 1786,
		featured: false,
		tags: ['Cycle menstruel', 'Règles', 'Douleurs', 'Ovulation', 'Suivi du cycle'],
		tagsWo: ['Cycle menstruel', 'Règles', 'Mettit', 'Ovulation', 'Topptoo cycle'],
		content: [
			{
				type: 'heading',
				fr: 'Le cycle menstruel, c’est quoi ?',
				wo: 'Lan mooy cycle menstruel bi ?',
			},
			{
				type: 'text',
				fr: "Le cycle menstruel correspond à l'ensemble des changements hormonaux et physiques qui préparent le corps à une éventuelle grossesse. Il commence au premier jour des règles et se termine la veille des règles suivantes. Beaucoup de cycles durent autour de 28 jours, mais un rythme entre 21 et 35 jours peut aussi être normal.",
				wo: "Cycle menstruel bi mooy lépp li hormones ak yaram di def ngir waajal yaram bi su fekkee am na gàtt. Dafay tambalee bés bu njëkk bu règles yi te jeex balaa règles yiy ñëw. Lu bari cycles yi dafa tollu ci 28 fan, waaye 21 ba 35 fan itam mën na nekk lu normal.",
			},
			{
				type: 'heading',
				fr: 'Les grandes phases du cycle',
				wo: 'Phases yu mag yi ci cycle bi',
			},
			{
				type: 'list',
				itemsFr: [
					'Les règles : la muqueuse de l’utérus s’élimine, ce qui provoque le saignement.',
					'La phase folliculaire : après les règles, le corps prépare un ovule et certaines personnes se sentent plus stables ou plus énergiques.',
					'L’ovulation : l’ovule est libéré, souvent au milieu du cycle, mais pas toujours au même jour pour tout le monde.',
					'La phase lutéale : le corps se prépare à une grossesse et certaines personnes remarquent plus de sensibilité, de fatigue ou de variations d’humeur.',
				],
				itemsWo: [
					'Règles yi : muqueuse bu utérus bi di génn, loolu moo tax deret bi di ñëw.',
					'Phase folliculaire bi : ginnaaw règles yi, yaram bi di waajal ovule te yenn nit ñi di yëg seen bopp gën a dal walla gën a am doole.',
					'Ovulation bi : ovule bi génn na, lu bari ci diggante cycle bi, waaye du bés bu benn ci nit ñépp.',
					'Phase lutéale bi : yaram bi di waajal gàtt te yenn nit ñi di gis sensibilité, fatigue walla soppeeku ci humeur.',
				],
			},
			{
				type: 'heading',
				fr: 'Pendant les règles, qu’est-ce qui peut être fréquent ?',
				wo: 'Bu règles yi agsee, lan moo mën a nekk lu siiw ?',
			},
			{
				type: 'list',
				itemsFr: [
					'Des crampes modérées dans le bas-ventre ou le bas du dos.',
					'Un flux plus abondant les premiers jours puis plus léger ensuite.',
					'Une sensation de fatigue, un appétit différent ou une plus grande sensibilité émotionnelle.',
					'Des pertes qui changent d’aspect au cours du cycle, surtout autour de l’ovulation.',
				],
				itemsWo: [
					'Mettit bu moy ci suufu biir walla ci ginnaaw.',
					'Deret bu gën a bari ci fan yu njëkk yi, ginnaaw loolu mu wàññi.',
					'Fatigue, lekk buy soppeeku walla xol buy gën a yëngu.',
					'Pertes yiy soppeeku ci diggante cycle bi, rawatina ci waxtu ovulation.',
				],
			},
			{
				type: 'tip',
				fr: "Chaque corps a son rythme. Noter la date de début des règles, la durée, l'intensité du flux et les douleurs peut t'aider à mieux te connaître et à expliquer clairement ce que tu vis en consultation.",
				wo: "Yaram bu nekk am na sa rythme. Bind bésu règles yi tambalee, ni ñuy yàgge, ni deret bi bari ak mettit bi mën na la dimbali nga gën a xam sa bopp te wax li ngay dund ci consultation.",
			},
			{
				type: 'heading',
				fr: 'Quand est-ce utile de consulter ?',
				wo: 'Kañ la consultation di am solo ?',
			},
			{
				type: 'list',
				itemsFr: [
					'Si la douleur t’empêche d’aller à l’école, de travailler, de marcher normalement ou de dormir.',
					'Si les règles sont très abondantes, avec caillots répétés, vertiges ou grande fatigue.',
					'Si tes cycles deviennent très irréguliers, s’arrêtent plusieurs mois hors grossesse, post-partum ou contraception, ou changent brutalement.',
					'Si tu saignes entre les règles, après un rapport, ou si tu as de la fièvre, une mauvaise odeur ou un malaise.',
				],
				itemsWo: [
					'Su mettit bi la tere dem ekool, liggéey, dox bu baax walla nelaw.',
					'Su règles yi bari lool, am caillots yu bari, yëngu-yëngu walla fatigue bu tar.',
					'Su sa cycles yi tàmbalee soppeeku lool, taxaw ay weer ci biti gàtt, post-partum walla contraception, walla soppeeku ci gaaw.',
					'Su nga di deret ci diggante règles yi, ginnaaw rapport, walla am fievre, xet bu bon walla malaise.',
				],
			},
			{
				type: 'warning',
				fr: "Une douleur très intense, un saignement qui trempe rapidement plusieurs protections, un malaise ou un retard de règles avec douleur importante méritent une consultation sans tarder.",
				wo: "Mettit bu tar lool, deret buy noy protections yu bari ci gaaw, malaise walla retard règles ak mettit bu tar war na tax consultation bu gaaw.",
			},
		],
	},
	{
		id: 26,
		category: 'SSR',
		categoryWo: 'Wér Sexuelle',
		lifeStage: 'Toutes',
		lifeStageWo: 'Yépp',
		lifeSituations: ['general', 'curious', 'cycles', 'contraception', 'trying', 'pregnant', 'menopause'],
		ageRange: 'all',
		title: 'Préparer sa consultation : quoi dire et quoi demander',
		titleWo: 'Waajal sa consultation : lu ngay wax ak lu ngay laaj',
		description:
			'Un guide simple pour arriver en consultation avec des repères clairs, des mots utiles et des questions importantes.',
		descriptionWo:
			'Pexe bu yomb ngir ñëw ci consultation ak repères yu leer, wax yu jariñ ak laaj yu am solo.',
		stage: 'young',
		audio: true,
		readTime: '9 min',
		author: 'Sage-femme Aminata Ndiaye',
		authorWo: 'Sage-femme Aminata Ndiaye',
		rating: 4.9,
		readers: 1528,
		featured: false,
		tags: ['Consultation', 'Symptômes', 'Questions', 'Diagnostic', 'Ordonnance'],
		tagsWo: ['Consultation', 'Symptômes', 'Laaj', 'Diagnostic', 'Ordonnance'],
		content: [
			{
				type: 'heading',
				fr: 'Avant le rendez-vous',
				wo: 'Bala rendez-vous bi',
			},
			{
				type: 'text',
				fr: "Préparer une consultation ne veut pas dire tout savoir à l'avance. Le plus utile est d'arriver avec quelques repères simples pour expliquer tes symptômes, ton vécu et ce qui t'inquiète le plus, même avec des mots très ordinaires.",
				wo: 'Waajal consultation du tekki ne dangaa wara xam lépp bala ko. Li gëna jariñ mooy nga ñëw ak ay repères yu yomb ngir wax sa symptômes, li nga dund ak li la gëna sonal, doonte ak ay wax yu yomb.',
			},
			{
				type: 'list',
				itemsFr: [
					'Note depuis quand le problème a commencé et ce qui a changé.',
					'Repère les symptômes qui te gênent le plus : douleur, saignement, retard de règles, pertes, fatigue, fièvre ou autre.',
					'Si tu peux, note la date de tes dernières règles, les traitements déjà essayés et la contraception utilisée.',
					'Pense à signaler tes antécédents importants : maladies chroniques, opérations, allergies, grossesses passées ou traitements en cours.',
				],
				itemsWo: [
					'Bindal kañ la jafe-jafe bi tàmbali ak li soppeeku.',
					'Xam symptômes yi la gëna jafe-jafe : mettit, deret, retard règles, pertes, fatigue, fievre walla leneen.',
					'Su mënée, bind bésu sa règles yu mujj, traitements yi nga mas a jëfandikoo ak contraception bi nga jëfandikoo.',
					'Fàttalikul wax sa antécédents yu am solo : maladies chroniques, opérations, allergies, gàtt yu weesu walla traitements yi ngay jëfandikoo.',
				],
			},
			{
				type: 'heading',
				fr: 'Comment parler simplement',
				wo: 'Naka ngay wax ko ci lu yomb',
			},
			{
				type: 'list',
				itemsFr: [
					'“Ce qui me gêne le plus, c’est…”',
					'“Mes symptômes ont commencé il y a…”',
					'“La douleur arrive surtout quand…”',
					'“J’ai essayé tel traitement, mais…”',
					'“J’aimerais comprendre ce que vous pensez et quel diagnostic vous évoquez.”',
				],
				itemsWo: [
					'“Li ma gëna sonal mooy…”',
					'“Sama symptômes tàmbali nañu am…”',
					'“Mettit bi di ñëw rawatina su…”',
					'“Jéem naa jëfandikoo lii, waaye…”',
					'“Bëgg naa xam li ngeen xalaat ak ban diagnostic ngeen di xool.”',
				],
			},
			{
				type: 'heading',
				fr: 'Questions utiles à poser',
				wo: 'Laaj yu am solo',
			},
			{
				type: 'list',
				itemsFr: [
					'Qu’est-ce qui peut expliquer ce que je ressens ?',
					'Quels signes doivent me faire revenir rapidement ou consulter en urgence ?',
					'Est-ce qu’un examen, une échographie ou un autre test est utile dans ma situation ?',
					'Quel traitement proposez-vous, pendant combien de temps, et quels effets dois-je surveiller ?',
					'Pouvez-vous m’écrire les consignes importantes sur une ordonnance ou un papier simple ?',
				],
				itemsWo: [
					'Lu mën a tax li may yëg ?',
					'Ban signes war nañu tax ma dellu bu gaaw walla dem urgence ?',
					'Ndax examen, échographie walla beneen test am na solo ci sama xaalis ?',
					'Ban traitement ngeen di digal, ngir ñaata fan walla weer, te ban effets laa wara xool ?',
					'Mën nga bind ma consignes yu am solo ci ordonnance walla ci këyit bu yomb ?',
				],
			},
			{
				type: 'tip',
				fr: "Tu as le droit de demander qu'on répète, qu'on reformule ou qu'on explique un mot difficile. Une bonne consultation, c'est aussi une consultation que tu comprends.",
				wo: 'Am nga sañ-sañu laaj ñu waxaat, ñu wax ko ci beneen niro wala ñu leeral baat bu metti. Consultation bu baax mooy itam consultation bu nga dégg.',
			},
			{
				type: 'warning',
				fr: "Si tu te sens jugée, brusquée ou si tu ne comprends pas les consignes données, cherche à demander des explications ou un autre avis si c'est possible.",
				wo: 'Su fekkee dangay yëg ne ñu lay àtte, lay gaawloo walla nga déggul consignes yi ñu la wax, jéemal laaj leeral walla beneen avis su mënée am.',
			},
		],
	},
];

function heading(fr: string, wo: string): ArticleSection {
	return { type: 'heading', fr, wo };
}

function text(fr: string, wo: string): ArticleSection {
	return { type: 'text', fr, wo };
}

function list(itemsFr: string[], itemsWo: string[]): ArticleSection {
	return { type: 'list', itemsFr, itemsWo };
}

function tip(fr: string, wo: string): ArticleSection {
	return { type: 'tip', fr, wo };
}

function warning(fr: string, wo: string): ArticleSection {
	return { type: 'warning', fr, wo };
}

function buildCenterSections(article: Article): ArticleSection[] {
	return [
		heading('Trouver un centre ou une professionnelle', 'Gis centre walla professionnelle'),
		text(
			`Si tu veux un conseil personnalisé, un examen, un dépistage ou un suivi, tu peux chercher un centre adapté à ce sujet directement depuis SaxalWér.`,
			'Su fekkee bëgg nga am digalante bu méngoo ak yow, examen, dépistage walla suivi, mën nga seet centre bu méngoo ak sujet bii ci biir SaxalWér.'
		),
		tip(
			`Avant d'y aller, prépare si possible la date de tes dernières règles, tes symptômes, les traitements déjà essayés et les questions que tu veux poser.`,
			'Bala ngay dem, waajal su mënée bésu sa règles yu mujj, sa symptômes, traitements yi nga mas a jëfandikoo ak laaj yi nga bëgg a laaj.'
		),
	];
}

function buildArticleExtras(article: Article): ArticleSection[] {
	switch (article.id) {
		case 1:
			return [
				heading('Les méthodes disponibles', 'Méthodes yi am'),
				list(
					[
						'Préservatif masculin : gaine fine portée sur le pénis à chaque rapport. Il protège à la fois contre la grossesse et contre les IST.',
						'Préservatif féminin : gaine souple placée dans le vagin avant le rapport. Il protège aussi contre la grossesse et les IST.',
						'Pilule : comprimé pris régulièrement, souvent chaque jour à heure fixe. Elle empêche surtout l’ovulation selon le type de pilule.',
						'Injectable : contraception administrée par injection toutes les quelques semaines ou tous les trois mois selon le produit.',
						'Implant : petit bâtonnet placé sous la peau du bras par un soignant. Il protège pendant plusieurs années.',
						'DIU au cuivre : petit dispositif placé dans l’utérus. Il agit sans hormones et protège plusieurs années.',
						'DIU hormonal : petit dispositif placé dans l’utérus qui libère une hormone locale. Il protège longtemps et peut réduire les règles abondantes chez certaines femmes.',
						'Méthodes naturelles : observation du cycle, abstinence périodique ou retrait. Elles demandent beaucoup de rigueur et sont moins fiables si elles sont mal utilisées.',
						'Contraception d’urgence : pilule à prendre rapidement après un rapport non protégé. Elle ne remplace pas une méthode régulière.',
					],
					[
						'Préservatif bu góor : gaine bu ñu sol ci pénis bi ci bépp rapport. Moo gën a aar ci gàtt ak IST.',
						'Préservatif bu jigéen : gaine bu nooy bu ñuy teg ci biir vagin bala rapport. Mu ngi itam aar ci gàtt ak IST.',
						'Pilule : comprimé bu ñuy naan bu siiw, lu bari bés bu nekk ci waxtu wu féete. Moom dafay tax ovulation bi bañ a am ci yenn pilules.',
						'Injectable : contraception bu ñuy joxe ak injection ay semaine walla weer yu bari selon produit bi.',
						'Implant : bant bu tuuti bu ñuy teg ci suufu deru loxo bi ci ndimbal soignant. Dafay aar ay at.',
						'DIU cuivre : jumtukaay bu tuuti bu ñuy teg ci utérus bi. Hormones amul te dafay aar ay at.',
						'DIU hormonal : jumtukaay bu tuuti bu ñuy teg ci utérus bi te mu di génne hormone bu ndaw ci bërab bi. Dafay aar lu yàgg te mën na wàññi règles yu bari ci yenn jigéen.',
						'Méthodes naturelles : xool cycle bi, moytu rapports ci yenn fan walla retrait. Soxla na yëngu-yëngu bu baax te wóor gu mat amul su ñu ko jëfandikoo lu bon.',
						'Contraception d’urgence : pilule bu ñuy naan bu gaaw ginnaaw rapport bu amul aar. Du wuutu méthode bu siiw.',
					]
				),
				heading('Comment choisir ?', 'Naka ngay tànne ?'),
				list(
					[
						'Demande-toi si tu veux une méthode courte durée ou longue durée.',
						'Réfléchis à ce que tu peux utiliser facilement sans oublier.',
						'Vérifie si tu veux aussi une protection contre les IST : dans ce cas, le préservatif reste essentiel.',
						'Parle de tes antécédents de santé : hypertension, migraines, tabac, allaitement, diabète ou saignements abondants peuvent orienter le choix.',
						'Choisis une méthode que tu comprends bien et que tu te sens capable d’utiliser correctement.',
					],
					[
						'Laajal sa bopp ndax bëgg nga méthode bu gàtt walla bu yàgg.',
						'Xalaatal li nga mën a jëfandikoo bu yomb te doo fàtte ko.',
						'Xoolal ndax soxla nga itam aar ci IST : su ko defee, préservatif bi war naa am solo.',
						'Waxal sa antécédents de santé : hypertension, migraines, taba, allaitement, diabète walla saignements yu bari mën nañu jëme tànn bi.',
						'Tànnal méthode bu nga dégg bu baax te nga mën a jëfandikoo ni mu ware.',
					]
				),
				warning(
					'Une méthode qui convient à une autre femme ne sera pas toujours la meilleure pour toi. En cas de doute, demande un avis professionnel avant de commencer ou de changer.',
					'Méthode bu baax ci beneen jigéen du war a tekki ne mooy gën ci yaw. Su amee duda, laajal avis professionnel bala ngay tàmbali walla soppi.'
				),
				...buildCenterSections(article),
			];
		case 2:
			return [
				heading('Les bases d’une grossesse suivie', 'Li war a nekk ci gàtt bu ñu topp'),
				list(
					[
						'Commencer tôt les consultations prénatales permet de surveiller la tension, le poids, la croissance du bébé et les analyses importantes.',
						'Manger varié, boire assez et prendre les compléments prescrits aide le corps à mieux soutenir la grossesse.',
						'Le repos compte aussi : fatigue, vertiges et essoufflement doivent être signalés s’ils deviennent importants.',
					],
					[
						'Tàmbali consultations prénatales bu gaaw dafay may ñu topp tension, tolluwaay, ni doom bi di mag ak analyses yu am solo.',
						'Lekk lu bari te wu mel ni mu ware, naan ndox te naan compléments yi ñu bindal la dimbal na yaram bi topp gàtt bi.',
						'Noppalu itam am na solo : fatigue, vertiges ak jafe-jafe ci noflaay war nañu ko wax su ñu bari.',
					]
				),
				heading("Quand consulter sans attendre", 'Kañ nga wara dem bu gaaw'),
				list(
					[
						'Saignement vaginal',
						'Forte douleur abdominale',
						'Fièvre',
						'Maux de tête intenses, gonflement soudain ou vision trouble',
						'Diminution des mouvements du bébé quand ils étaient déjà bien ressentis',
					],
					[
						'Deret ci vagin',
						'Mettit bu tar ci biir',
						'Fievre',
						'Bopp buy metti lool, yaram buy rëy gaaw walla gis-gis bu leerul',
						'Yëngu-yëngu doom bi buy wàññi ginnaaw nga doon ko xam bu baax',
					]
				),
				...buildCenterSections(article),
			];
		case 3:
			return [
				heading('Ce qui peut améliorer tes chances', 'Li mën a yokk sa chances'),
				list(
					[
						'Avoir des rapports réguliers dans la période fertile sans se mettre une pression excessive.',
						'Noter les cycles pendant plusieurs mois aide à mieux repérer le rythme du corps.',
						'Éviter le tabac, l’alcool excessif et certains produits non prescrits peut protéger la fertilité.',
						'Un bilan concerne souvent les deux partenaires, pas seulement la femme.',
					],
					[
						'Am rapports yu siiw ci waxtu fertilité bi te bul tooñ sa bopp ak pression.',
						'Bind cycle yi ay weer yu bari dafay dimbali nga gën a xam rythme yaram bi.',
						'Moytu taba, alcool bu bari ak yenn garab yu ñu la bindul mën na aar fertilité bi.',
						'Bilan bi lu bari dafay jàpp ñaar ñépp, du jigéen ji rekk.',
					]
				),
				...buildCenterSections(article),
			];
		case 4:
			return [
				heading('Dépistage et traitement', 'Dépistage ak faj'),
				list(
					[
						'Certaines IST se traitent avec des médicaments adaptés, d’autres se contrôlent dans la durée.',
						'Le ou la partenaire peut aussi avoir besoin d’un traitement pour éviter les réinfections.',
						'Ne partage pas un antibiotique ou un traitement conseillé à quelqu’un d’autre.',
					],
					[
						'Yenn IST mën nañu ko faj ak ay garab yu méngoo, yeneen dafay soxla topptoo buy yàgg.',
						'Partenaire bi itam mën na soxla traitement ngir infection bi bañ a dellu.',
						'Bul sédd antibiotique walla traitement bu ñu waxal woon kenn ku bees.',
					]
				),
				...buildCenterSections(article),
			];
		case 5:
			return [
				heading('Ce qui aide au quotidien', 'Li dimbali ci dund gu bés bu nekk'),
				list(
					[
						'Suivre la douleur dans un carnet peut aider à repérer les périodes les plus difficiles.',
						'La chaleur locale, le repos, l’activité douce ou des traitements prescrits peuvent soulager selon les cas.',
						'La douleur chronique n’est pas “dans ta tête” et mérite une vraie écoute.',
					],
					[
						'Topptoo mettit bi ci carnet mën na dimbali nga xam fan yi gën a metti.',
						'Tàngoor bu nekk ci bërab bi, noppalu, mouvement bu ndaw walla traitements yu ñu la bind mën nañu wàññi mettit bi selon xaalis bi.',
						'Mettit buy yàgg du lu nekk ci sa xel rekk te war naa am déglu bu baax.',
					]
				),
				...buildCenterSections(article),
			];
		case 6:
			return [
				heading('Les objectifs du suivi', 'Jubluwaayu suivi bi'),
				list(
					[
						'Rendre les cycles plus compréhensibles.',
						'Diminuer les symptômes qui gênent la vie quotidienne.',
						'Préparer un projet de grossesse si tu en as un.',
						'Prévenir les effets à long terme sur le métabolisme.',
					],
					[
						'Def ba cycle yi gën a leer.',
						'Wàññi symptômes yi di jafe-jafe ci dund gu bés bu nekk.',
						'Waajal projet gàtt su amee.',
						'Jiit effets yu yàgg ci métabolisme bi.',
					]
				),
				...buildCenterSections(article),
			];
		case 7:
			return [
				heading('Demander de l’aide est normal', 'Laaj ndimbal lu normal la'),
				list(
					[
						'Le post-partum peut être intense même si le bébé va bien.',
						'Le soutien du partenaire, de la famille ou d’une sage-femme peut alléger la charge.',
						'Une tristesse qui dure, l’angoisse ou le sentiment de rejet du bébé doivent être pris au sérieux.',
					],
					[
						'Post-partum bi mën na tar doonte doom bi dafay dem bu baax.',
						'Ndimbal jëkkër, njaboot walla sage-femme mën na wàññi yombal.',
						'Nakharlu buy yàgg, tiit walla xel mu bëggul doom bi war naa ñu jàppe ko ci solo.',
					]
				),
				...buildCenterSections(article),
			];
		case 8:
			return [
				heading('Pré, péri et post-ménopause', 'Pré, péri ak post-ménopause'),
				list(
					[
						'Préménopause : les cycles sont encore présents mais peuvent commencer à changer.',
						'Périménopause : période de transition avec règles irrégulières et symptômes variables.',
						'Post-ménopause : phase après 12 mois sans règles.',
					],
					[
						'Préménopause : règles yi angi am waaye mën nañu tàmbali soppeeku.',
						'Périménopause : waxtu jall bi ak règles yu soppeeku ak symptômes yu bari.',
						'Post-ménopause : xàll wi ginnaaw 12 weer yu amul règles.',
					]
				),
				heading('Solutions possibles', 'Solutions yi mën a am'),
				list(
					[
						'Adapter les vêtements, l’aération et l’hydratation peut aider pour les bouffées de chaleur.',
						'Le sommeil, l’activité physique et la santé intime méritent d’être discutés en consultation.',
						'Certaines femmes bénéficient de traitements hormonaux ou non hormonaux, selon leur histoire médicale.',
					],
					[
						'Soppi col, air bi ak naan ndox mën na dimbali ci bouffées de chaleur.',
						'Nelaw, activité physique ak santé intime war nañu ñu wax ci consultation.',
						'Yenn jigéen mën nañu gën a jariñ ci traitements hormonaux walla yu dul hormonaux, selon seen histoire médicale.',
					]
				),
				...buildCenterSections(article),
			];
		case 9:
			return [
				heading('Quand demander un bilan', 'Kañ nga wara laaj bilan'),
				list(
					[
						'Après plusieurs mois d’essais sans grossesse, selon l’âge et le contexte.',
						'Plus tôt si les cycles sont très irréguliers, s’il y a une douleur importante, une chirurgie passée ou une infection connue.',
						'Le bilan se fait idéalement en couple quand cela est possible.',
					],
					[
						'Ginnaaw ay weer yu bari te gàtt amul, selon at ak xaalis bi.',
						'Lu gën a gaaw su cycles yi bari soppeeku, su mettit bi tar, su amoon opération walla infection bu ñu xam.',
						'Bilan bi gën na def ko ci couple bi su mënée am.',
					]
				),
				...buildCenterSections(article),
			];
		case 10:
			return [
				heading('Contraception, grossesse et maladie chronique', 'Contraception, gàtt ak maladie chronique'),
				list(
					[
						'Le choix contraceptif dépend parfois du traitement en cours et du risque cardiovasculaire.',
						'Un projet de grossesse se prépare idéalement avant la conception pour ajuster les médicaments si besoin.',
						'Les rendez-vous réguliers réduisent souvent les complications évitables.',
					],
					[
						'Tànnu contraception bi mën naa aju ci traitement bi ngay jëfandikoo ak risque cardiovasculaire.',
						'Projet gàtt bi gën naa waajal ko bala conception ngir soppi yenn garab su am soxla.',
						'Rendez-vous yu siiw lu bari dañuy wàññi complications yu mën a ñëw te ñu mën a jiitu.',
					]
				),
				...buildCenterSections(article),
			];
		case 11:
			return [
				heading('Qui peut bénéficier du dépistage ?', 'Kan mën a jariñ ci dépistage bi ?'),
				text(
					'La réponse dépend de l’âge, des recommandations locales et des antécédents. Un centre ou une sage-femme peut te dire quand commencer et à quelle fréquence.',
					'Li nga wara def mi ngi aju ci at, recommandations bërab bi ak antécédents yi. Centre walla sage-femme mën na la wax kañ nga wara tàmbali ak ni ñu koy faral.'
				),
				...buildCenterSections(article),
			];
		case 12:
			return [
				heading('Quand faire contrôler un changement', 'Kañ nga wara xoolal soppi bi'),
				list(
					[
						'Si une boule persiste après les règles.',
						'Si un changement apparaît d’un seul côté.',
						'Si la peau, le mamelon ou la forme du sein changent clairement.',
					],
					[
						'Su boule bi yàggee ginnaaw règles yi.',
						'Su soppi bi feeñee ci benn wetu rekk.',
						'Su der, mamelon walla melokaanu ween wi soppeekoo bu leer.',
					]
				),
				...buildCenterSections(article),
			];
		case 13:
			return [
				heading('Pourquoi consulter tôt', 'Lu tax consultation bu gaaw am solo'),
				text(
					'Les symptômes de ces cancers peuvent sembler banals. Un avis précoce peut aider à écarter un problème grave ou à commencer une prise en charge plus vite.',
					'Symptômes yi mën nañu mel ni lu yomb. Avis bu gaaw mën na dimbali ñu dindi xel ci lu tar walla tàmbali topptoo bu gaaw.'
				),
				...buildCenterSections(article),
			];
		case 14:
			return [
				heading('Questions utiles à poser', 'Laaj yu am solo'),
				list(
					[
						'Quelle méthode ou quel soin est compatible avec ma situation de santé ?',
						'Comment parler de ce sujet dans mon couple ou ma famille ?',
						'Vers qui me tourner si je veux un avis médical et un cadre respectueux de ma foi ?',
					],
					[
						'Ban méthode walla ban soin moo méngoo ak sama xaalis wér ?',
						'Naka laa man a wax mbir mii ci sama couple walla sama njaboot ?',
						'Kan laa wara jëm ci moom su bëggée avis médical ak bërab bu respect sama ngëm ?',
					]
				),
				...buildCenterSections(article),
			];
		case 15:
			return [
				heading('Avancer avec discernement', 'Dem ak xalaat bu sell'),
				text(
					'Quand les avis de l’entourage sont différents, il peut être utile de s’appuyer sur une information médicale claire et sur un dialogue apaisé.',
					'Bu avis yu nekk ci sa wet differ, mën na jariñ nga wéeru ci xibaarkat médical bu leer ak waxtaan bu dal.'
				),
				...buildCenterSections(article),
			];
		case 16:
			return [
				heading('Tes droits en pratique', 'Sa droits ci jëf'),
				list(
					[
						'Poser des questions et demander des explications simples.',
						'Recevoir des soins sans violence ni humiliation.',
						'Choisir librement une méthode ou accepter ou refuser un examen après explication.',
						'Demander la confidentialité sur les informations partagées.',
					],
					[
						'Laaj ak laaj ay leeral yu yomb.',
						'Am soins yu amul fitna walla toroxte.',
						'Tànnal librement méthode walla nangoo walla bañ examen bu ñu ko la leeral.',
						'Laaj sutura ci xibaarkat yi nga sédd.',
					]
				),
				...buildCenterSections(article),
			];
		default:
			return buildCenterSections(article);
	}
}

function enrichArticle(article: Article): Article {
	const extraSections = buildArticleExtras(article);
	const extraReadTime = Math.max(2, Math.ceil(extraSections.length / 2));

	return {
		...article,
		readTime: `${parseInt(article.readTime, 10) + extraReadTime} min`,
		content: [...article.content, ...extraSections],
	};
}

export const ARTICLES: Article[] = BASE_ARTICLES.map(enrichArticle);
