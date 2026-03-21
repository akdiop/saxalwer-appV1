import type {
    Language,
    PersonalizationContext,
    UserProfile,
} from '../context/appcontext';

/**
 * Mappe les donnees de personnalisation contextuelle vers le profil utilisateur.
 * Preremplit intelligemment les champs du profil bases sur les reponses de personnalisation.
 */
export function mapPersonalizationToProfile(
	personalization: PersonalizationContext,
	currentProfile: UserProfile
): Partial<UserProfile> {
	const updates: Partial<UserProfile> = {};

	// 1. AGE RANGE -> BIRTHDATE (estimation)
	if (personalization.ageRange && !currentProfile.birthdate) {
		const currentYear = new Date().getFullYear();
		let estimatedBirthYear = currentYear;

		switch (personalization.ageRange) {
			case '15-17':
				estimatedBirthYear = currentYear - 16; // Milieu de la tranche
				break;
			case '18-24':
				estimatedBirthYear = currentYear - 21;
				break;
			case '25-34':
				estimatedBirthYear = currentYear - 29;
				break;
			case '35-49':
				estimatedBirthYear = currentYear - 40;
				break;
			case '50+':
				estimatedBirthYear = currentYear - 50;
				break;
		}

		// Format: YYYY-MM-DD (1er janvier de l'annee estimee)
		updates.birthdate = `${estimatedBirthYear}-01-01`;
	}

	// 2. LIVING CONTEXT -> MARITAL STATUS
	if (personalization.livingContext && !currentProfile.maritalStatus) {
		switch (personalization.livingContext) {
			case 'partner':
				updates.maritalStatus = 'En couple';
				break;
			case 'alone':
				updates.maritalStatus = 'Célibataire';
				break;
			case 'parents':
				// Probabilite elevee d'etre celibataire si vit avec les parents
				updates.maritalStatus = 'Célibataire';
				break;
			case 'family':
				updates.maritalStatus = 'En famille';
				break;
			case 'roommates':
				updates.maritalStatus = 'Célibataire';
				break;
		}
	}

	// 3. SOCIAL NORMS -> RELIGIOUS FAITH (suggestion)
	if (personalization.socialNorms && !currentProfile.religiousFaith) {
		switch (personalization.socialNorms) {
			case 'conservative':
				// Environnement conservateur suggere souvent une pratique religieuse
				updates.religiousFaith = 'Pratiquante';
				break;
			case 'moderate':
				updates.religiousFaith = 'Modérée';
				break;
			case 'open':
				updates.religiousFaith = 'Ouverte';
				break;
		}
	}

	// 4. EDUCATION LEVEL -> PERSONALITY (suggestion ton)
	if (personalization.educationLevel && !currentProfile.personality) {
		switch (personalization.educationLevel) {
			case 'basic':
				updates.personality = 'Curieuse et attentive';
				break;
			case 'intermediate':
				updates.personality = 'Engagée et réfléchie';
				break;
			case 'advanced':
				updates.personality = 'Analytique et informée';
				break;
		}
	}

	// 5. PREFERRED TONE -> PERSONALITY (enrichissement)
	if (personalization.preferredTone && !currentProfile.personality) {
		switch (personalization.preferredTone) {
			case 'sisterly':
				updates.personality = 'Complice et chaleureuse';
				break;
			case 'friendly':
				updates.personality = 'Ouverte et bienveillante';
				break;
			case 'formal':
				updates.personality = 'Professionnelle et sérieuse';
				break;
		}
	}

	// 6. AGE RANGE + LIVING CONTEXT -> CHILDREN COUNT (estimation)
	if (personalization.ageRange && personalization.livingContext) {
		// Ne pas ecraser si deja renseigne
		if (currentProfile.childrenCount === 0) {
			const isYoung =
				personalization.ageRange === '15-17' || personalization.ageRange === '18-24';
			const livesWithParents = personalization.livingContext === 'parents';

			if (isYoung || livesWithParents) {
				updates.childrenCount = 0; // Probabilite elevee de ne pas avoir d'enfants
			}
		}
	}

	// 7. LIVING CONTEXT + AGE -> DESIRE CHILDREN
	if (
		personalization.livingContext &&
		personalization.ageRange &&
		!currentProfile.desireChildren
	) {
		const isYoung =
			personalization.ageRange === '15-17' || personalization.ageRange === '18-24';

		if (isYoung) {
			updates.desireChildren = 'Pas encore décidé';
		} else if (personalization.ageRange === '50+') {
			updates.desireChildren = 'Non applicable';
		} else {
			updates.desireChildren = 'Oui, dans le futur';
		}
	}

	return updates;
}

/**
 * Genere un nom par defaut base sur le contexte de personnalisation.
 */
export function generateDefaultName(
	personalization: PersonalizationContext,
	language: Language
): string {
	// Selection basee sur le ton prefere
	if (personalization.preferredTone === 'sisterly') {
		return language === 'wo' ? 'Rakk' : 'Ma Sœur';
	} else if (personalization.preferredTone === 'friendly') {
		return language === 'wo' ? 'Jigéen' : 'Belle Âme';
	} else {
		return language === 'wo' ? 'Jigéen' : 'Utilisatrice';
	}
}

/**
 * Retourne un message personnalise de bienvenue base sur le profil et la personnalisation.
 */
export function getPersonalizedWelcomeMessage(
	personalization: PersonalizationContext,
	profile: UserProfile,
	language: Language
): string {
	const name = profile.name || generateDefaultName(personalization, language);

	if (language === 'wo') {
		if (personalization.preferredTone === 'sisterly') {
			return `Dalal ak jamm, ${name} ! Bëgg nañu la wone ci SaxalWér.`;
		} else if (personalization.preferredTone === 'friendly') {
			return `Dalal ${name}, jàmm ak jamm !`;
		} else {
			return `Dalal, ${name}. Dalal ci SaxalWér.`;
		}
	} else {
		if (personalization.preferredTone === 'sisterly') {
			return `Bienvenue ma belle ${name} ! On est ravies de t'avoir parmi nous 💚`;
		} else if (personalization.preferredTone === 'friendly') {
			return `Salut ${name}, bienvenue dans ton espace SaxalWér !`;
		} else {
			return `Bienvenue, ${name}. Nous sommes honorés de vous accompagner.`;
		}
	}
}

/**
 * Suggere une localisation basee sur les normes sociales et le contexte.
 */
export function suggestLocation(
	personalization: PersonalizationContext,
	language: Language
): string {
	void personalization;
	// Pour l'instant, retourner une suggestion par defaut.
	return language === 'wo' ? 'Dakar, Sénégal' : 'Afrique de l\'Ouest';
}

/**
 * Retourne un resume textuel de la personnalisation pour affichage dans le profil.
 */
export function getPersonalizationSummary(
	personalization: PersonalizationContext,
	language: Language
): string {
	const parts: string[] = [];

	if (personalization.ageRange) {
		const ageLabel = language === 'wo' ? 'At' : 'Âge';
		parts.push(`${ageLabel}: ${personalization.ageRange} ans`);
	}

	if (personalization.livingContext) {
		const contextLabels: Record<string, Record<Language, string>> = {
			alone: {
				fr: 'Je vis seule',
				wo: 'Dama nékk rekk',
			},
			parents: {
				fr: 'Avec mes parents',
				wo: 'Ak sama nit ñoom',
			},
			partner: {
				fr: 'Avec mon partenaire',
				wo: 'Ak sama jekeur',
			},
			roommates: {
				fr: 'En colocation',
				wo: 'Ak colocataires',
			},
			family: {
				fr: 'En famille',
				wo: 'Ak mbokk',
			},
		};
		const contextLabel =
			contextLabels[personalization.livingContext]?.[language] || '';
		if (contextLabel) parts.push(contextLabel);
	}

	if (personalization.preferredTone) {
		const toneLabels: Record<string, Record<Language, string>> = {
			formal: {
				fr: 'Ton formel',
				wo: 'Ton respectueux',
			},
			friendly: {
				fr: 'Ton amical',
				wo: 'Ton amical',
			},
			sisterly: {
				fr: 'Ton complice',
				wo: 'Kon rakk',
			},
		};
		const toneLabel = toneLabels[personalization.preferredTone]?.[language] || '';
		if (toneLabel) parts.push(toneLabel);
	}

	return parts.join(' • ');
}
