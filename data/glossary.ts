export interface GlossaryEntry {
	fr: string;
	wo: string;
	category:
		| 'anatomie'
		| 'contraception'
		| 'grossesse'
		| 'ist'
		| 'depistage'
		| 'general'
		| 'menstruation'
		| 'fertilite'
		| 'pathologie';
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
	// === ANATOMIE & CORPS ===
	"col de l'utérus": {
		fr: "Partie basse de l'utérus qui s'ouvre sur le vagin. Le frottis permet de vérifier qu'il est en bonne santé.",
		wo: 'Breel bu suuf ci utérus bi bu ubbi ci vagin bi. Frottis bi dafa xool ndax wéer na.',
		category: 'anatomie',
	},
	utérus: {
		fr: "Organe musculaire creux dans le bas-ventre où le bébé se développe pendant la grossesse. Sa taille est normalement celle d'une poire.",
		wo: 'Organe bu am ci biir bu suuf ci jigéen, mooy fii xale bi dox ci yàgg gàtt bi. Am na taille bu mel ni poire.',
		category: 'anatomie',
	},
	vagin: {
		fr: "Canal reliant l'utérus à l'extérieur du corps. Il laisse passer les règles, permet les rapports intimes et sert de voie de naissance lors d'un accouchement vaginal.",
		wo: 'Yoon bu lëkk utérus bi ak biti yaram bi. Mooy génne weer gi, jëf rapports intimes te itam mooy yoonu juddu bu naturel.',
		category: 'anatomie',
	},
	vulve: {
		fr: "Partie externe visible des organes génitaux féminins. Elle comprend notamment les lèvres, le clitoris et l'entrée du vagin.",
		wo: 'Partie bu nekk ci biti ci organes génitaux jigéen. Mu bokk ak lèvres yi, clitoris bi ak bunt vagin bi.',
		category: 'anatomie',
	},
	clitoris: {
		fr: 'Petit organe très sensible situé à la jonction des petites lèvres. Il joue un rôle important dans le plaisir sexuel.',
		wo: 'Organe bu ndaw te yëgël bu baax bu nekk ci kaw petites lèvres yi. Am na solo bu mag ci neexu jëf ju íntime.',
		category: 'anatomie',
	},
	endomètre: {
		fr: "Muqueuse qui tapisse l'intérieur de l'utérus. Elle s'épaissit au cours du cycle et se détache pendant les règles s'il n'y a pas de grossesse.",
		wo: 'Muqueuse bu nekk ci biir utérus bi. Dafay mag ci weer gi te génne ci weer gu nekk su amul gàtt.',
		category: 'anatomie',
	},
	sein: {
		fr: "Organe de la poitrine qui produit le lait après l'accouchement. Le sein doit aussi être surveillé pour repérer précocement certaines anomalies.",
		wo: 'Organe bu nekk ci poitrine bi bu jox meew ginnaaw fànnaan. War nañu itam xool ko ngir gis lu dul normal.',
		category: 'anatomie',
	},
	'glaire cervicale': {
		fr: "Sécrétion naturelle produite par le col de l'utérus. Son aspect change au cours du cycle et peut aider à repérer la période fertile.",
		wo: 'Sécrétion naturelle bu col utérus bi jox. Dafa soppi ci weer gi te man na dimbali ci xam waxtu fertile bi.',
		category: 'anatomie',
	},
	ovaires: {
		fr: "Deux petites glandes situées de chaque côté de l'utérus. Ils produisent les ovules et les hormones féminines (estrogène, progestérone).",
		wo: 'Ñaari glandes bu ndaw bu nekk ci bépp wàll utérus bi. Dañu jox ovules ak hormones jigéen (estrogène, progestérone).',
		category: 'anatomie',
	},
	périnée: {
		fr: "Ensemble de muscles situés entre le vagin et l'anus. Ils soutiennent les organes internes. Importants à rééduquer après l'accouchement.",
		wo: 'Yaram bu nekk ci diggante vagin bi ak anus bi. Dañu aar organes yi ci biir. War nañu ko rééduquer ginnaaw fànnaan.',
		category: 'anatomie',
	},
	'trompes de Fallope': {
		fr: "Deux tubes fins reliant les ovaires à l'utérus. L'ovule y rencontre le spermatozoïde lors de la fécondation.",
		wo: 'Ñaari tube bu ndaw bu lëkk ovaires yi ak utérus bi. Ovule bi mooy ci nekk ak spermatozoïde ci fécondation bi.',
		category: 'anatomie',
	},
	placenta: {
		fr: "Organe temporaire qui se forme pendant la grossesse. Il nourrit le bébé, fournit l'oxygène et filtre les déchets via le cordon ombilical.",
		wo: 'Organe bu nekk ci yàgg gàtt bi. Mooy lekkal xale bi, jox ko oxygène te filtre déchets yi ci cordon ombilical bi.',
		category: 'anatomie',
	},

	// === MENSTRUATION ===
	règles: {
		fr: "Écoulement de sang mensuel par le vagin. C'est naturel et signe que le corps fonctionne bien. Dure en moyenne 3 à 7 jours.",
		wo: 'Deret bu nekk ci weer gu awal ci vagin bi. Normal la te mooy signe ne yaram bi dox na bu baax. Dëkk ci 3 ba 7 bés.',
		category: 'menstruation',
	},
	'cycle menstruel': {
		fr: 'Période régulière (environ 28 jours) entre le premier jour des règles et le début des suivantes. Chaque femme a un cycle unique.',
		wo: 'Diggante bu am ci weer gi (ci 28 bés) diggante weer gu awal ak gu ci topp. Bépp jigéen am na sa boppam.',
		category: 'menstruation',
	},
	ovulation: {
		fr: "Moment du cycle où l'ovaire libère un ovule. C'est la période la plus fertile (généralement au milieu du cycle).",
		wo: 'Yàgg ci weer gi ci ovaire bi dafa jox ovule. Mooy diggante bu gën a fertile (ci biir weer gi).',
		category: 'menstruation',
	},
	ménopause: {
		fr: 'Arrêt naturel et définitif des règles, généralement entre 45 et 55 ans. C\'est une étape normale de la vie.',
		wo: 'Weer gi mu taxaw ci awal bu mat, ci 45 ba 55 at. Étape bu normal la ci dund.',
		category: 'menstruation',
	},
	aménorrhée: {
		fr: "Absence de règles en dehors d'une grossesse. Peut être causée par le stress, un trouble hormonal, une perte de poids importante ou certains contraceptifs.",
		wo: 'Weer gi du ñëw te ëmb gàtt. Man na am ndax stress, trouble hormonal, wàññi bu bëri walla yenn contraceptifs.',
		category: 'menstruation',
	},
	dysménorrhée: {
		fr: 'Douleurs intenses pendant les règles (crampes, douleurs dans le bas-ventre). Si elles sont très fortes ou inhabituelles, consultez un professionnel de santé.',
		wo: 'Metti bu bëri ci weer gi (crampes, metti ci biir bu suuf). Su nekk bu bëri lool, jëm ci professionnel santé.',
		category: 'menstruation',
	},
	'syndrome prémenstruel': {
		fr: 'Ensemble de symptômes (fatigue, irritabilité, gonflement, douleurs) apparaissant quelques jours avant les règles. Très fréquent et généralement bénin.',
		wo: 'Signes yi (fatigue, irritabilité, ëmb, metti) bu ñëw ci jenn bés kanam weer gi. Bëri ci jigéen te du lu metti.',
		category: 'menstruation',
	},
	'cycle irrégulier': {
		fr: "Cycle menstruel dont la durée change souvent d'un mois à l'autre. Cela peut être lié à l'âge, au stress, à une contraception ou à un trouble hormonal.",
		wo: 'Weer bu durée bi di soppi ci bépp weer. Man na jóge ci at, stress, contraception walla trouble hormonal.',
		category: 'menstruation',
	},
	spotting: {
		fr: 'Petit saignement léger entre les règles. Il peut survenir avec certaines contraceptions, autour de l’ovulation ou dans certaines situations médicales.',
		wo: 'Deret bu ndaw te dul bari ci diggante ay weer. Man na am ak yenn contraceptions, ci ovulation walla ci yenn xaalis wergu-yaram.',
		category: 'menstruation',
	},
	'retard de règles': {
		fr: "Absence ou retard des règles par rapport à la date attendue. Cela peut avoir plusieurs causes, dont une grossesse, le stress ou un dérèglement hormonal.",
		wo: 'Weer bu yagg walla bu ñakk ci bés bu ñu yaakaar. Lu ko mana tax mooy gàtt, stress walla dérèglement hormonal.',
		category: 'menstruation',
	},
	métrorragie: {
		fr: 'Saignement vaginal en dehors des règles. Si cela arrive fréquemment, consultez un professionnel de santé pour en identifier la cause.',
		wo: 'Deret ci vagin bi ci biti weer gi. Su nekk lu bëri, jëm ci professionnel santé ngir xam lu ko tax.',
		category: 'menstruation',
	},

	// === CONTRACEPTION ===
	contraception: {
		fr: "Ensemble des méthodes permettant d'éviter une grossesse. Inclut la pilule, l'implant, le préservatif, le stérilet, etc.",
		wo: 'Méthodes yi ngir tëdd gàtt. Am na pilule, implant, préservatif, stérilet, etc.',
		category: 'contraception',
	},
	DIU: {
		fr: "Dispositif Intra-Utérin (aussi appelé stérilet). Petit dispositif en forme de T placé dans l'utérus par un professionnel pour empêcher la grossesse.",
		wo: 'Dispositif Intra-Utérin (stérilet itam). Aparèy bu ndaw bu nekk ci utérus bi, professionnel moo ko indi ngir tëdd gàtt.',
		category: 'contraception',
	},
	stérilet: {
		fr: "Petit dispositif en forme de T placé dans l'utérus pour empêcher la grossesse. Dure 5 à 10 ans selon le type.",
		wo: 'Aparèy bu ndaw bu nekk ci utérus bi ngir tëdd gàtt. Dëkk 5 ba 10 at.',
		category: 'contraception',
	},
	implant: {
		fr: "Petit bâtonnet souple inséré sous la peau du bras. Il libère des hormones pour empêcher la grossesse pendant 3 à 5 ans.",
		wo: 'Bâtonnet bu ndaw bu indi ci suf loxo bi. Dafa jox hormones ngir tëdd gàtt ci 3 ba 5 at.',
		category: 'contraception',
	},
	injection: {
		fr: 'Méthode contraceptive hormonale administrée à intervalle régulier par injection. Elle protège pendant plusieurs semaines selon le produit utilisé.',
		wo: 'Méthode contraception bu hormone yi jox ci injection ci yàgg yu ñu xam. Dafay aar ay semaine yu bari selon li ñuy jëfandikoo.',
		category: 'contraception',
	},
	pilule: {
		fr: 'Comprimé hormonal à prendre chaque jour à heure fixe pour empêcher la grossesse. Efficace à 99% si bien utilisée.',
		wo: 'Comprimé hormonal bu jël bésnéew ci same heure ngir tëdd gàtt. Efficace 99% su jëfandikool bu baax.',
		category: 'contraception',
	},
	'pilule du lendemain': {
		fr: "Pilule de contraception d'urgence prise après un rapport non protégé pour réduire le risque de grossesse. Elle est plus efficace si elle est prise rapidement.",
		wo: "Pilule contraception d'urgence bu jël ginnaaw rapport bu dul protéger ngir wàññi risku gàtt. Gëna baax su ñu ko jël gaaw.",
		category: 'contraception',
	},
	préservatif: {
		fr: 'Gaine en latex placée sur le pénis (masculin) ou dans le vagin (féminin) pendant le rapport sexuel. Protège contre la grossesse ET les IST.',
		wo: 'Latex bu indi ci pénis (góor) walla ci vagin (jigéen) ci rapport sexuel bi. Jafe ak gàtt AK IST.',
		category: 'contraception',
	},
	'préservatif féminin': {
		fr: "Préservatif placé à l'intérieur du vagin avant le rapport. Il protège contre la grossesse et contre de nombreuses IST.",
		wo: 'Préservatif bu ñuy def ci biir vagin bi bala rapport bi. Dafa aar ci gàtt ak ci yenn IST yu bari.',
		category: 'contraception',
	},
	'abstinence périodique': {
		fr: "Méthode consistant à éviter les rapports sexuels pendant la période fertile. Elle demande une bonne connaissance du cycle et reste moins fiable que d'autres méthodes.",
		wo: 'Méthode bu ñuy moytu rapports intimes ci waxtu fertile bi. Dafa soxla xam-xam bu baax ci weer gi te gëna am risque lu dul yeneen méthodes.',
		category: 'contraception',
	},
	'planning familial': {
		fr: "Service de santé qui aide les couples à choisir quand et combien d'enfants avoir. Offre conseils et méthodes de contraception.",
		wo: 'Service santé bu dimbali ñaari-nit ci tànnal kañ ak ñaata doom am. Jox digalante ak méthodes contraception.',
		category: 'contraception',
	},
	"contraception d'urgence": {
		fr: "Méthode de contraception utilisée après un rapport sexuel non protégé. À prendre dans les 72 heures (pilule du lendemain). Ne remplace pas une contraception régulière.",
		wo: 'Méthode contraception bu jëfandikoo ginnaaw rapport sexuel bu dul protéger. Jël ko ci 72 heures. Du remplacer contraception bu am.',
		category: 'contraception',
	},
	progestérone: {
		fr: 'Hormone naturelle produite par les ovaires. Elle joue un rôle clé dans le cycle menstruel, la grossesse et certaines méthodes contraceptives.',
		wo: 'Hormone bu naturel bu ovaires yi jox. Am na solo ci weer gi, gàtt bi ak yenn méthodes contraception.',
		category: 'contraception',
	},

	// === GROSSESSE & ACCOUCHEMENT ===
	prénatal: {
		fr: 'Qui concerne la période avant la naissance. Le suivi prénatal inclut les consultations et examens pendant la grossesse.',
		wo: 'Lu nekk ci diggante bi kanam fànnaan bi. Suivi prénatal mooy consultations ak examens ci yàgg gàtt bi.',
		category: 'grossesse',
	},
	'post-partum': {
		fr: "Période qui suit l'accouchement (environ 6 semaines). Le corps et l'esprit de la mère se remettent progressivement.",
		wo: 'Diggante bi topp ci fànnaan bi (ci 6 ayu-bis). Yaram gi ak xel mi dañu ngi dellu ci wàllu gi ndànk-ndànk.',
		category: 'grossesse',
	},
	postpartum: {
		fr: "Période qui suit l'accouchement (environ 6 semaines). Le corps et l'esprit de la mère se remettent progressivement.",
		wo: 'Diggante bi topp ci fànnaan bi (ci 6 ayu-bis). Yaram gi ak xel mi dañu ngi dellu ci wàllu gi ndànk-ndànk.',
		category: 'grossesse',
	},
	échographie: {
		fr: "Examen indolore utilisant des ultrasons pour voir le bébé dans l'utérus pendant la grossesse.",
		wo: 'Examen bu du metti bu jëfandikoo ultrasons ngir gis xale bi ci utérus bi ci yàgg gàtt bi.',
		category: 'grossesse',
	},
	embryon: {
		fr: 'Stade très précoce du développement du futur bébé, dans les premières semaines après la fécondation.',
		wo: 'Waxtu bu njëkk lool ci xale bi di mag ci ay semaine yu njëkk ginnaaw fécondation.',
		category: 'grossesse',
	},
	fœtus: {
		fr: "Stade du développement du bébé après l'embryon, pendant la grossesse jusqu'à la naissance.",
		wo: 'Waxtu bu xale bi di mag ginnaaw embryon bi, ci yàgg gàtt ba ci juddu bi.',
		category: 'grossesse',
	},
	'fausse couche': {
		fr: "Interruption spontanée d'une grossesse avant que le bébé puisse vivre hors de l'utérus. Elle nécessite un accompagnement médical et émotionnel.",
		wo: 'Gàtt bu taxaw ci boppam bala xale bi man a dund ci biti utérus bi. Dafa soxla ndimbal médical ak ndimbal xol.',
		category: 'grossesse',
	},
	césarienne: {
		fr: "Intervention chirurgicale pour faire naître le bébé par une incision dans le ventre. Pratiquée quand l'accouchement par voie naturelle présente des risques.",
		wo: 'Opération ngir jur xale bi ci biir. Defal ko su fekkee fànnaan bu naturel am na risques.',
		category: 'grossesse',
	},
	épisiotomie: {
		fr: "Petite incision faite lors de l'accouchement pour faciliter le passage du bébé. Elle est recousue après la naissance.",
		wo: 'Coupure bu ndaw bu def ci fànnaan bi ngir yomb xale bi mu génne. Dañu ko tàggu ginnaaw jur.',
		category: 'grossesse',
	},
	allaitement: {
		fr: "Alimentation du bébé au sein maternel. L'OMS recommande l'allaitement exclusif pendant les 6 premiers mois.",
		wo: 'Naan xale bi ci bëyëm yaay bi. OMS dina digal allaitement exclusif ci 6 weer yi awal.',
		category: 'grossesse',
	},
	contractions: {
		fr: "Resserrements réguliers de l'utérus. Elles peuvent annoncer le travail d'accouchement ou survenir à d'autres moments de la grossesse.",
		wo: 'Yaram bu utérus bi di gën a tëj. Man nañu wax ne waxtu fànnaan bi jot na walla am ci beneen waxtu ci gàtt bi.',
		category: 'grossesse',
	},
	dilatation: {
		fr: "Ouverture progressive du col de l'utérus pendant le travail d'accouchement pour laisser passer le bébé.",
		wo: 'Ubbiku col utérus bi ndànk-ndànk ci waxtu fànnaan bi ngir xale bi man a génne.',
		category: 'grossesse',
	},
	prééclampsie: {
		fr: "Complication de la grossesse avec tension artérielle élevée. Nécessite un suivi médical urgent. Signes : maux de tête, gonflement, vision trouble.",
		wo: 'Complication gàtt bu am tension bu kawe. War na suivi médical bu gaaw. Signes : bët bu fee, yaram bu ëmb, gis bu yàq.',
		category: 'grossesse',
	},
	hémorragie: {
		fr: "Perte de sang importante et anormale. En cas d'hémorragie pendant la grossesse ou après l'accouchement, c'est une urgence : appelez les secours immédiatement.",
		wo: 'Deret bu bëri te bu normal. Su fekkee hémorragie ci yàgg gàtt walla ginnaaw fànnaan, urgence la : woo secours bu gaaw.',
		category: 'grossesse',
	},
	'sage-femme': {
		fr: "Professionnelle de santé spécialisée dans la grossesse, l'accouchement et la santé des femmes. Interlocutrice de confiance en Afrique de l'Ouest.",
		wo: "Professionnelle santé bu spécialisé ci gàtt, fànnaan ak wéeru jigéen. Ki nga man a deglu ci Afrique de l'Ouest.",
		category: 'grossesse',
	},
	'grossesse extra-utérine': {
		fr: "Grossesse où l'oeuf se développe en dehors de l'utérus (souvent dans une trompe). C'est une urgence médicale avec douleurs intenses et saignements.",
		wo: 'Gàtt bu xale bi dox ci biti utérus bi (bëri ci trompe bi). Urgence médicale la bu am metti ak deret.',
		category: 'grossesse',
	},
	'accouchement prématuré': {
		fr: "Naissance du bébé avant 37 semaines de grossesse. Le bébé peut nécessiter des soins spéciaux. Des signes d'alerte existent.",
		wo: "Xale bi jur kanam 37 ayu-bis gàtt. Xale bi man na soxla soins spéciaux. Am na signes d'alerte.",
		category: 'grossesse',
	},
	'diabète gestationnel': {
		fr: "Diabète qui apparaît pendant la grossesse. Il nécessite un suivi particulier et disparaît généralement après l'accouchement.",
		wo: 'Diabète bu ñëw ci yàgg gàtt bi. War na suivi particulier te bëri mu dem ginnaaw fànnaan.',
		category: 'grossesse',
	},
	'cordon ombilical': {
		fr: "Tube souple qui relie le bébé au placenta dans l'utérus. Il transporte la nourriture et l'oxygène au bébé.",
		wo: 'Tube bu yomb bu lëkk xale bi ak placenta bi ci utérus bi. Mooy yóbbu lekk ak oxygène ci xale bi.',
		category: 'grossesse',
	},
	colostrum: {
		fr: "Premier lait maternel, jaune et épais, produit dans les jours qui suivent l'accouchement. Très riche en anticorps, il protège le nouveau-né.",
		wo: 'Meew mu njëkk bu mboq te du, bu ñëw ci bés yi topp fànnaan bi. Am na bëri anticorps, mooy aar xale bu bees bi.',
		category: 'grossesse',
	},

	// === FERTILITÉ ===
	fertilité: {
		fr: "Capacité naturelle de concevoir un enfant. Elle varie selon l'âge, la santé et d'autres facteurs.",
		wo: 'Kàttan bu yaram bi am ngir jur doom. Dafa soppi ak at yi, wéeru yaram ak yeneen facteurs.',
		category: 'fertilite',
	},
	ovule: {
		fr: "Cellule reproductrice féminine libérée par l'ovaire pendant l'ovulation. Elle peut être fécondée par un spermatozoïde.",
		wo: 'Cellule reproduction bu jigéen bu ovaire bi di génne ci ovulation. Man na féconder ak spermatozoïde.',
		category: 'fertilite',
	},
	spermatozoïde: {
		fr: "Cellule reproductrice masculine qui peut féconder l'ovule. Elle est présente dans le sperme.",
		wo: 'Cellule reproduction bu góor bu man a féconder ovule bi. Moom moo nekk ci sperme bi.',
		category: 'fertilite',
	},
	sperme: {
		fr: "Liquide libéré lors de l'éjaculation contenant les spermatozoïdes. Il joue un rôle dans la reproduction.",
		wo: 'Liquide bu génne ci éjaculation bi bu am spermatozoïdes. Am na solo ci reproduction.',
		category: 'fertilite',
	},
	infertilité: {
		fr: "Difficulté à concevoir un enfant après 12 mois d'essais réguliers. Elle peut toucher aussi bien les femmes que les hommes.",
		wo: 'Jafe-jafe ngir am doom ginnaaw 12 weer ci jëm-jëm. Man na aar jigéen ak góor.',
		category: 'fertilite',
	},
	fécondation: {
		fr: 'Rencontre entre un spermatozoïde et un ovule qui donne naissance à un embryon. Moment de la conception.',
		wo: 'Diggante spermatozoïde bi ak ovule bi bu jox embryon. Mooy diggante bu conception.',
		category: 'fertilite',
	},
	PMA: {
		fr: 'Procréation Médicalement Assistée. Ensemble de techniques médicales aidant les couples ayant des difficultés à concevoir (FIV, insémination, etc.).',
		wo: 'Procréation Médicalement Assistée. Techniques médicales yi dimbali ñaari-nit ci jafe-jafe am doom (FIV, insémination, etc.).',
		category: 'fertilite',
	},
	FIV: {
		fr: "Fécondation In Vitro. Technique de PMA où l'ovule est fécondé en laboratoire puis réimplanté dans l'utérus.",
		wo: 'Fécondation In Vitro. Technique PMA bu ovule bi féconder ci laboratoire te indi ko ci utérus bi.',
		category: 'fertilite',
	},

	// === IST & INFECTIONS ===
	IST: {
		fr: 'Infection Sexuellement Transmissible. Infection qui se transmet lors de rapports sexuels non protégés (chlamydia, gonorrhée, VIH, etc.).',
		wo: 'Infection Sexuellement Transmissible. Feebar bu jële ci rapport sexuel bu dul protéger (chlamydia, gonorrhée, VIH, etc.).',
		category: 'ist',
	},
	VIH: {
		fr: "Virus de l'Immunodéficience Humaine. Virus qui affaiblit les défenses du corps. Sans traitement, il peut évoluer en SIDA.",
		wo: 'Virus bu yàq kàttan yaram bi ngir aar ci feebar. Su dul safaraat, man na nekk SIDA.',
		category: 'ist',
	},
	SIDA: {
		fr: "Syndrome d'Immunodéficience Acquise. Stade avancé de l'infection par le VIH où le corps ne peut plus se défendre contre les maladies.",
		wo: 'Stade bu mujj ci VIH ci yaram bi du man a aar boppam ci feebar.',
		category: 'ist',
	},
	HPV: {
		fr: "Papillomavirus humain. Virus très courant transmis par contact sexuel. Certains types peuvent causer le cancer du col de l'utérus. Un vaccin existe.",
		wo: 'Papillomavirus humain. Virus bu bëri bu jële ci rapport sexuel. Yenn man nañu def cancer col utérus. Am na vaccin.',
		category: 'ist',
	},
	'herpès génital': {
		fr: "IST virale provoquant des boutons ou des douleurs au niveau des organes génitaux. Les poussées peuvent revenir par périodes.",
		wo: 'IST bu virus bu mana def boutons walla metti ci organes génitaux yi. Poussées yi man nañu dellusi ci ay waxtu.',
		category: 'ist',
	},
	trichomonase: {
		fr: 'Infection parasitaire sexuellement transmissible pouvant provoquer pertes, démangeaisons et inconfort.',
		wo: 'Infection parasitaire bu jële ci rapports intimes bu mana def pertes, démangeaisons ak jafe-jafe.',
		category: 'ist',
	},
	'hépatite B': {
		fr: "Infection virale qui touche le foie et peut aussi se transmettre par voie sexuelle ou par le sang. Un vaccin existe.",
		wo: 'Infection bu virus bu jàpp foie bi te man na itam jële ci rapports intimes walla ci deret. Am na vaccin.',
		category: 'ist',
	},
	chlamydia: {
		fr: "IST bactérienne très fréquente, souvent sans symptômes. Non traitée, elle peut causer l'infertilité. Se soigne facilement avec des antibiotiques.",
		wo: 'IST bactérienne bu bëri, bëri du am symptômes. Su dul safaraat, man na yàq fertilité. Soigner ko ak antibiotiques.',
		category: 'ist',
	},
	gonorrhée: {
		fr: 'IST bactérienne (aussi appelée « chaude-pisse ») causant des brûlures urinaires et des écoulements. Se traite par antibiotiques.',
		wo: 'IST bactérienne bu def brûlures urinaires ak écoulements. Safaraat ko ak antibiotiques.',
		category: 'ist',
	},
	syphilis: {
		fr: 'IST bactérienne qui évolue en plusieurs stades. Peut être grave si non traitée. Un simple test sanguin permet le dépistage.',
		wo: 'IST bactérienne bu dox ci yenn stades. Man na nekk lu metti su dul safaraat. Test deret bu ndaw mooy dépistage.',
		category: 'ist',
	},
	'mycose vaginale': {
		fr: 'Infection causée par un champignon (Candida). Provoque démangeaisons et pertes blanches. Très fréquente et se soigne bien.',
		wo: 'Infection bu champignon (Candida) def. Dafa def démangeaisons ak pertes blanches. Bëri te safaraat bu baax.',
		category: 'ist',
	},

	// === DÉPISTAGE & EXAMENS ===
	dépistage: {
		fr: "Examen médical pour détecter une maladie avant l'apparition des symptômes. Le dépistage précoce sauve des vies.",
		wo: 'Examen médical ngir gis feebar kanam lu ko symptômes nekk. Dépistage bu gaaw aar na dundël.',
		category: 'depistage',
	},
	frottis: {
		fr: "Examen rapide et indolore qui consiste à prélever des cellules du col de l'utérus pour détecter précocement un cancer.",
		wo: 'Examen bu gaaw te du metti bu jël cellules ci col utérus bi ngir gis cancer bu bonk.',
		category: 'depistage',
	},
	mammographie: {
		fr: "Radiographie des seins pour détecter un éventuel cancer du sein. Recommandée à partir de 40-50 ans ou en cas d'antécédents.",
		wo: 'Radiographie ween yi ngir gis cancer ween. Digal nañu ko ci 40-50 at walla su am antécédents.',
		category: 'depistage',
	},
	'autopalpation mammaire': {
		fr: "Geste consistant à examiner soi-même ses seins pour repérer une boule, une douleur ou un changement inhabituel. Elle ne remplace pas les examens médicaux.",
		wo: 'Jëf bu nit di xool sa bopp sa ween yi ngir gis boule, metti walla soppi bu dul normal. Du remplacer examens médicaux yi.',
		category: 'depistage',
	},
	'test de grossesse': {
		fr: "Test urinaire ou sanguin permettant de savoir si une grossesse a commencé en détectant l'hormone hCG.",
		wo: 'Test ci urine walla deret bu xam ndax gàtt tàmbali na ci detecksi hormone hCG.',
		category: 'depistage',
	},
	'échographie pelvienne': {
		fr: "Examen d'imagerie de l'utérus, des ovaires et d'autres organes du bassin. Il aide à repérer certaines anomalies.",
		wo: 'Examen imagerie bu xool utérus bi, ovaires yi ak yeneen organes yu bassin bi. Dafa dimbali ci gis ay anomalies.',
		category: 'depistage',
	},
	biopsie: {
		fr: "Prélèvement d'un petit morceau de tissu pour l'analyser au microscope. Permet de confirmer ou exclure un cancer ou une autre maladie.",
		wo: 'Jël bu ndaw ci tissu ngir xool ko ci microscope. Mooy confirmer walla tëral cancer walla beneen feebar.',
		category: 'depistage',
	},
	colposcopie: {
		fr: "Examen du col de l'utérus à l'aide d'un appareil grossissant. Réalisé après un frottis anormal pour voir de plus près.",
		wo: 'Examen col utérus bi ak aparèy bu grandissant. Defal ko ginnaaw frottis bu anormal ngir gis lu gëna jege.',
		category: 'depistage',
	},

	// === PATHOLOGIES ===
	endométriose: {
		fr: "Maladie où le tissu de l'utérus se développe en dehors, causant des douleurs intenses pendant les règles. Peut affecter la fertilité.",
		wo: 'Feebar bu tissu utérus bi dox ci biti, bu def metti bu bëri ci weer gi. Man na yàq fertilité.',
		category: 'pathologie',
	},
	SOPK: {
		fr: "Syndrome des ovaires polykystiques. Trouble hormonal pouvant causer cycles irréguliers, acné, prise de poids ou difficultés à ovuler.",
		wo: 'Syndrome des ovaires polykystiques. Trouble hormonal bu mana def weer buy soppi, acné, yokkute tolluwaay walla jafe-jafe ci ovulation.',
		category: 'pathologie',
	},
	adénomyose: {
		fr: "Maladie où un tissu proche de l'endomètre se développe dans la paroi de l'utérus. Elle peut provoquer douleurs et règles abondantes.",
		wo: 'Feebar bu tissu bu jege endomètre bi di mag ci miir utérus bi. Man na def metti ak weer gu bari.',
		category: 'pathologie',
	},
	fibromes: {
		fr: "Tumeurs bénignes (non cancéreuses) qui se développent dans l'utérus. Très fréquents chez les femmes d'Afrique. Peuvent causer des règles abondantes.",
		wo: 'Tumeurs bu baax (du cancer) bu dox ci utérus bi. Bëri ci jigéen yi Afrique. Man nañu def weer gu am bëri.',
		category: 'pathologie',
	},
	'cancer du col de l’utérus': {
		fr: "Cancer touchant le col de l'utérus, souvent lié à une infection persistante par certains HPV. Le dépistage et la vaccination permettent souvent de le prévenir.",
		wo: 'Cancer bu jàpp col utérus bi, lu bari yoreek infection HPV buy yàgg. Dépistage ak vaccination man nañu ko gën a jiitu.',
		category: 'pathologie',
	},
	'cancer du sein': {
		fr: 'Cancer touchant les tissus du sein. Un repérage précoce améliore beaucoup les chances de traitement.',
		wo: 'Cancer bu jàpp tissus yu ween yi. Su ñu ko gis gaaw, traitement bi gën a man a baax.',
		category: 'pathologie',
	},
	'cancer de l’ovaire': {
		fr: "Cancer touchant l'ovaire. Ses signes peuvent être discrets au début, d'où l'importance d'un avis médical en cas de symptômes persistants.",
		wo: 'Cancer bu jàpp ovaire bi. Signes yi man nañu sutura ci njëkk, moo tax avis médical di am solo su symptômes yi yàgg.',
		category: 'pathologie',
	},
	'kyste ovarien': {
		fr: 'Poche remplie de liquide sur un ovaire. La plupart sont bénins et disparaissent seuls. Certains nécessitent un suivi ou un traitement.',
		wo: 'Poche bu fees ci liquide ci ovaire bi. Bëri ci yépp baax nañu te dem ci seen bopp. Yenn war nañu suivi.',
		category: 'pathologie',
	},
	anémie: {
		fr: 'Manque de fer dans le sang qui provoque fatigue et faiblesse. Fréquent chez les femmes enceintes et pendant les règles abondantes.',
		wo: 'Àmm ci deret bi bu yàq kàttan te jox fatigue. Bëri ci jigéen ju ëmb ak ci weer gu am bëri.',
		category: 'pathologie',
	},
	'fistule obstétricale': {
		fr: "Complication grave de l'accouchement prolongé créant une communication entre le vagin et la vessie ou le rectum. Nécessite une chirurgie réparatrice.",
		wo: 'Complication bu metti ci fànnaan bu gudd bu def communication ci diggante vagin bi ak vessie walla rectum bi. War na chirurgie.',
		category: 'pathologie',
	},
	prolapsus: {
		fr: "Descente d'un organe pelvien (utérus, vessie) vers le vagin. Peut survenir après des accouchements multiples. Des traitements existent.",
		wo: 'Organe pelvien (utérus, vessie) bu suuf jëm ci vagin bi. Man na am ginnaaw fànnaan bu bëri. Am na traitement.',
		category: 'pathologie',
	},
	'vaginose bactérienne': {
		fr: "Déséquilibre de la flore vaginale causant des pertes malodorantes. Ce n'est pas une IST. Se traite facilement avec un traitement approprié.",
		wo: 'Déséquilibre ci flore vaginale bu def pertes bu sàmm. Du IST. Safaraat ko ak traitement bu baax.',
		category: 'pathologie',
	},

	// === GÉNÉRAL ===
	hormones: {
		fr: 'Substances chimiques produites par le corps qui régulent de nombreuses fonctions : cycle menstruel, grossesse, humeur, métabolisme, etc.',
		wo: 'Substances chimiques bu yaram bi jox bu am solo ci bëri fonctions : weer gi, gàtt, humeur, métabolisme, etc.',
		category: 'general',
	},
	SSR: {
		fr: 'Santé Sexuelle et Reproductive. Elle couvre le bien-être physique, mental et social lié au corps, à la sexualité, à la fertilité, à la grossesse et aux droits.',
		wo: 'Santé Sexuelle et Reproductive. Moom dafay boole wergu-yaram, xel ak dund gu jëm ci yaram, sexualité, fertilité, gàtt ak droits.',
		category: 'general',
	},
	sexualité: {
		fr: "Dimension de la vie liée au corps, au désir, aux relations intimes, au plaisir et aux droits. Elle doit toujours se vivre dans le respect et le consentement.",
		wo: 'Wàllu dund gu jëm ci yaram, bëgg, relations intimes, neex ak droits. War nañu ko dund ci respect ak consentement.',
		category: 'general',
	},
	libido: {
		fr: "Désir sexuel. Il peut varier selon l'âge, les hormones, le stress, la fatigue, la santé ou la qualité des relations.",
		wo: 'Bëggu jëf ju íntime. Man na soppi selon at, hormones, stress, fatigue, wergu-yaram walla ni relation bi doxee.',
		category: 'general',
	},
	consentement: {
		fr: "Accord libre, éclairé et enthousiaste donné par chaque personne pour tout acte sexuel. Il peut être retiré à tout moment. C'est un droit fondamental.",
		wo: 'Bëgg bu libre, bu xam te bu sëlmëx bu bépp nit jox ci bépp acte sexuel. Man ngaa ko jël ci bépp yàgg. Droit bu njëkk la.',
		category: 'general',
	},
	'violence sexuelle': {
		fr: "Toute situation où un acte sexuel, une pression ou un contact intime est imposé sans consentement. C'est interdit et cela nécessite protection et soutien.",
		wo: 'Bépp xaalis bu nit di jëf acte sexuel, pression walla contact intime ci ku dul maye consentement. Lu ñu tere la te dafay soxla protection ak ndimbal.',
		category: 'general',
	},
	'mutilations génitales': {
		fr: "Pratiques traditionnelles d'ablation partielle ou totale des organes génitaux féminins. Interdites par la loi dans de nombreux pays car dangereuses pour la santé.",
		wo: 'Pratiques traditionnelles bu sànni partie walla bépp organes génitaux jigéen. Loi bi tëral ko ci bëri reew ndax lu metti la ci wéeru yaram.',
		category: 'general',
	},
	'violences obstétricales': {
		fr: "Actes irrespectueux, abusifs ou négligents envers une femme pendant la grossesse, l'accouchement ou le post-partum par le personnel soignant.",
		wo: 'Actes bu ñàkk respect, bu abusif walla négligent ci jigéen ci yàgg gàtt, fànnaan walla post-partum ci personnel soignant.',
		category: 'general',
	},
	excision: {
		fr: 'Forme de mutilation génitale féminine consistant à couper une partie du clitoris. Pratique dangereuse et interdite par la loi.',
		wo: 'Forme mutilation génitale jigéen bu sànni breel ci clitoris bi. Pratique bu metti te loi bi tëral ko.',
		category: 'general',
	},
	'éducation sexuelle': {
		fr: 'Apprentissage des connaissances sur le corps, la sexualité, la contraception et les relations saines. Un droit pour chaque jeune fille.',
		wo: 'Jàng bu xam ci yaram bi, sexualité, contraception ak relations bu wér. Droit la ci bépp jigéen bu ndaw.',
		category: 'general',
	},
};

// Catégories avec libellés bilingues
export const GLOSSARY_CATEGORIES: Record<string, { fr: string; wo: string }> = {
	anatomie: { fr: 'Anatomie & Corps', wo: 'Yaram gi' },
	menstruation: { fr: 'Menstruation & Cycles', wo: 'Weer gi' },
	contraception: { fr: 'Contraception', wo: 'Contraception' },
	grossesse: { fr: 'Grossesse & Accouchement', wo: 'Gàtt ak Fànnaan' },
	fertilite: { fr: 'Fertilité', wo: 'Fertilité' },
	ist: { fr: 'IST & Infections', wo: 'IST ak Feebar' },
	depistage: { fr: 'Dépistage & Examens', wo: 'Dépistage ak Examens' },
	pathologie: { fr: 'Pathologies', wo: 'Feebar yi' },
	general: { fr: 'Droits & Éducation', wo: 'Droits ak Jàng' },
};

// Termes triés par longueur décroissante pour matcher les plus longs d'abord
export const SORTED_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
