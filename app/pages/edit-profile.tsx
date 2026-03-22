import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';

import { colors } from '../../constants/colors';
import { useProfileMock } from '../../context/ProfileMockContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type OptionItem = {
  id: string;
  fr: string;
  wo: string;
};

type HealthCondition = {
  id: string;
  fr: string;
  wo: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

const HEALTH_CONDITIONS: HealthCondition[] = [
  { id: 'endometriosis', fr: 'Endometriose', wo: 'Endometriose', icon: 'pulse', color: '#A65D40' },
  { id: 'sopk', fr: 'SOPK', wo: 'SOPK', icon: 'pulse', color: '#B5622A' },
  {
    id: 'fibromes',
    fr: 'Fibromes uterins',
    wo: 'Fibromes uterins',
    icon: 'stethoscope',
    color: '#4A2F27',
  },
  { id: 'diabetes', fr: 'Diabete', wo: 'Diabete', icon: 'stethoscope', color: '#D4AF37' },
  { id: 'hypertension', fr: 'Hypertension', wo: 'Hypertension', icon: 'heart-outline', color: '#C0392B' },
  {
    id: 'drepanocytose',
    fr: 'Drepanocytose',
    wo: 'Drepanocytose',
    icon: 'stethoscope',
    color: '#7A8C5A',
  },
  {
    id: 'thyroid',
    fr: 'Troubles thyroidiens',
    wo: 'Jafe thyroide',
    icon: 'pulse',
    color: '#1A3C34',
  },
  { id: 'anemia', fr: 'Anemie', wo: 'Anemie', icon: 'heart-outline', color: '#A65D40' },
];

const CONTRACEPTION_METHODS: OptionItem[] = [
  { id: 'pilule', fr: 'Pilule', wo: 'Pilule' },
  { id: 'implant', fr: 'Implant', wo: 'Implant' },
  { id: 'diu-cuivre', fr: 'DIU cuivre (sterilet)', wo: 'DIU cuivre (sterilet)' },
  { id: 'diu-hormonal', fr: 'DIU hormonal', wo: 'DIU hormonal' },
  { id: 'injection', fr: 'Injection', wo: 'Injection' },
  { id: 'preservatif', fr: 'Preservatif', wo: 'Preservatif' },
  { id: 'naturelle', fr: 'Methode naturelle', wo: 'Methode naturelle' },
  { id: 'autre', fr: 'Autre', wo: 'Yeneen' },
];

const MARITAL_OPTIONS: OptionItem[] = [
  { id: '', fr: 'Non precise', wo: 'Binduwul' },
  { id: 'single', fr: 'Celibataire', wo: 'Jiggeen rekk' },
  { id: 'married', fr: 'Mariee', wo: 'Sey na' },
  { id: 'divorced', fr: 'Divorcee', wo: 'Facce na' },
  { id: 'widow', fr: 'Veuve', wo: 'Neew jekker' },
  { id: 'couple', fr: 'En couple', wo: 'Am na jekker' },
  { id: 'prefer-not-say', fr: 'Je prefere ne pas dire', wo: 'Begguma wax' },
];

const DESIRE_OPTIONS: OptionItem[] = [
  { id: '', fr: 'Non precise', wo: 'Binduwul' },
  { id: 'yes', fr: 'Oui, j aimerais', wo: 'Waaw, begg naa' },
  { id: 'yes-soon', fr: 'Oui, bientot', wo: 'Waaw, ci kanam' },
  { id: 'no', fr: 'Non', wo: 'Deet' },
  { id: 'maybe', fr: 'Peut-etre un jour', wo: 'Xam-xamu, benn bes' },
  { id: 'prefer-not-say', fr: 'Je prefere ne pas dire', wo: 'Begguma wax' },
];

const FAITH_OPTIONS: OptionItem[] = [
  { id: '', fr: 'Non precise', wo: 'Binduwul' },
  { id: 'muslim', fr: 'Musulmane', wo: 'Muslim' },
  { id: 'christian', fr: 'Chretienne', wo: 'Chretien' },
  { id: 'traditional', fr: 'Religion traditionnelle', wo: 'Degg-degg bu mbokk' },
  { id: 'spiritual', fr: 'Spirituelle (non religieuse)', wo: 'Spirituel' },
  { id: 'none', fr: 'Aucune', wo: 'Amul' },
  { id: 'prefer-not-say', fr: 'Je prefere ne pas dire', wo: 'Begguma wax' },
];

const PREGNANCY_STATUS_OPTIONS: OptionItem[] = [
  { id: '', fr: 'Non precise', wo: 'Binduwul' },
  { id: 'pregnant', fr: 'Je suis enceinte', wo: 'Dama gatt' },
  { id: 'not-pregnant', fr: 'Je ne suis pas enceinte', wo: 'Gattuma' },
  { id: 'trying', fr: 'J essaie de tomber enceinte', wo: 'Dama seet doom' },
  { id: 'postpartum', fr: 'Je suis en post-partum', wo: 'Maangi ci ginnaaw wasin' },
  { id: 'prefer-not-say', fr: 'Je prefere ne pas dire', wo: 'Begguma wax' },
];

function SectionTitle({
  icon,
  label,
  color,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionTitleIconWrap, { backgroundColor: color + '1F' }]}>
        <MaterialCommunityIcons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.sectionTitleText}>{label}</Text>
    </View>
  );
}

function SelectField({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(false);
  };

  return (
    <View>
      <Pressable style={styles.selectTrigger} onPress={toggleOpen}>
        <Text style={[styles.selectValue, !selected && styles.selectPlaceholder]}>
          {selected?.label ?? placeholder ?? ''}
        </Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={'rgba(74, 47, 39, 0.55)'}
        />
      </Pressable>

      {open ? (
        <View style={styles.selectMenu}>
          {options.map((option) => {
            const isSelected = option.id === value;
            return (
              <Pressable
                key={option.id + option.label}
                style={[styles.selectOption, isSelected && styles.selectOptionActive]}
                onPress={() => handleSelect(option.id)}
              >
                <Text style={[styles.selectOptionText, isSelected && styles.selectOptionTextActive]}>
                  {option.label}
                </Text>
                {isSelected ? (
                  <MaterialCommunityIcons name="check" size={14} color={colors.deepGreen} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function EditProfileContent() {
  const router = useRouter();
  const { userProfile, updateUserProfile, language, discreteMode } = useProfileMock();
  const wo = language === 'wo';

  const [name, setName] = useState(userProfile.name);
  const [birthdate, setBirthdate] = useState(userProfile.birthdate);
  const [location, setLocation] = useState(userProfile.location);
  const [photoUrl, setPhotoUrl] = useState(userProfile.photoUrl);
  const [personality, setPersonality] = useState(userProfile.personality);
  const [maritalStatus, setMaritalStatus] = useState(userProfile.maritalStatus);
  const [childrenCount, setChildrenCount] = useState(userProfile.childrenCount);
  const [desireChildren, setDesireChildren] = useState(userProfile.desireChildren);
  const [contraceptionActive, setContraceptionActive] = useState(userProfile.contraceptionActive);
  const [contraceptionMethod, setContraceptionMethod] = useState(userProfile.contraceptionMethod);
  const [healthConditions, setHealthConditions] = useState<string[]>(userProfile.healthConditions || []);
  const [religiousFaith, setReligiousFaith] = useState(userProfile.religiousFaith || '');
  const [educationLevel, setEducationLevel] = useState(userProfile.educationLevel || '');
  const [hobbies, setHobbies] = useState(userProfile.hobbies || []);
  const [aboutMe, setAboutMe] = useState(userProfile.aboutMe || '');
  const [pregnancyStatus, setPregnancyStatus] = useState(userProfile.pregnancyStatus || '');
  const [pregnancyWeeks, setPregnancyWeeks] = useState(userProfile.pregnancyWeeks || '');
  const [pregnancyDueDate, setPregnancyDueDate] = useState(userProfile.pregnancyDueDate || '');
  const [hobbyInput, setHobbyInput] = useState('');
  const [saved, setSaved] = useState(false);

  const infoMarital = useMemo(
    () => MARITAL_OPTIONS.map((item) => ({ id: item.id, label: wo ? item.wo : item.fr })),
    [wo]
  );

  const infoDesire = useMemo(
    () => DESIRE_OPTIONS.map((item) => ({ id: item.id, label: wo ? item.wo : item.fr })),
    [wo]
  );

  const infoFaith = useMemo(
    () => FAITH_OPTIONS.map((item) => ({ id: item.id, label: wo ? item.wo : item.fr })),
    [wo]
  );

  const infoPregnancyStatus = useMemo(
    () => PREGNANCY_STATUS_OPTIONS.map((item) => ({ id: item.id, label: wo ? item.wo : item.fr })),
    [wo]
  );

  const toggleCondition = (id: string) => {
    setHealthConditions((prev) =>
      prev.includes(id) ? prev.filter((conditionId) => conditionId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    updateUserProfile({
      name,
      birthdate,
      location,
      photoUrl,
      personality,
      maritalStatus,
      childrenCount,
      desireChildren,
      contraceptionActive,
      contraceptionMethod,
      healthConditions,
      religiousFaith,
      educationLevel,
      hobbies,
      aboutMe,
      pregnancyStatus,
      pregnancyWeeks,
      pregnancyDueDate,
    });
    setSaved(true);
    setTimeout(() => {
      router.back();
    }, 600);
  };
  const handlePhotoUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Pressable style={styles.headerBackBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={22} color={colors.deepGreen} />
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>{wo ? 'Soppi sa profil' : 'Modifier Mon Profil'}</Text>
            <Text style={styles.headerSubtitle}>
              {wo ? 'Sa xibaarkat' : 'Tes informations personnelles'}
            </Text>
          </View>

          <Pressable
            style={[styles.headerSaveBtn, saved && styles.headerSaveBtnSaved]}
            onPress={handleSave}
          >
            <MaterialCommunityIcons
              name={saved ? 'check' : 'content-save-outline'}
              size={20}
              color={colors.white}
            />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, discreteMode && styles.discreteBlur]}
        >
          <View style={styles.photoSection}>
            <View style={styles.photoFrameWrap}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.photoFrame} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialCommunityIcons name="account-outline" size={44} color={colors.white} />
                </View>
              )}

              <Pressable style={styles.photoEditBtn} onPress={handlePhotoUpload}>
                <MaterialCommunityIcons name="camera-outline" size={18} color={colors.white} />
              </Pressable>
            </View>

            <Text style={styles.photoHint}>{wo ? 'Bes sa nataal (optionnel)' : 'Photo (optionnel)'}</Text>
          </View>

          <SectionTitle icon="account-outline" label={wo ? 'Sa bopp' : 'Identite'} color={colors.deepGreen} />

          <View style={styles.fieldsBlock}>
            <View>
              <Text style={styles.labelText}>{wo ? 'Sa tur' : 'Ton nom'}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={wo ? 'Bind sa tur' : 'Entre ton nom'}
                placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.labelText}>{wo ? 'Sa bess bi' : 'Date de naissance'}</Text>
              <TextInput
                value={birthdate}
                onChangeText={setBirthdate}
                placeholder={'YYYY-MM-DD'}
                placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.labelText}>{wo ? 'Sa wer' : 'Ville / Localisation'}</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder={wo ? 'Bind sa wer' : 'Ville ou quartier'}
                placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.labelText}>{wo ? 'Sa jikko' : 'Personnalite'}</Text>
              <TextInput
                value={personality}
                onChangeText={setPersonality}
                placeholder={wo ? 'Ex: neex, xam-xam, dal...' : 'Ex: douce, curieuse, calme...'}
                placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                style={styles.input}
              />
            </View>
          </View>

          <SectionTitle
            icon="heart-outline"
            label={wo ? 'Sa waa ker' : 'Situation familiale'}
            color={colors.terracotta}
          />

          <View style={styles.fieldsBlock}>
            <View>
              <Text style={styles.labelText}>{wo ? 'Sa mbook' : 'Situation maritale'}</Text>
              <SelectField value={maritalStatus} options={infoMarital} onChange={setMaritalStatus} />
            </View>

            <View>
              <Text style={styles.labelText}>{wo ? 'Naata doom' : 'Nombre d enfants'}</Text>
              <View style={styles.counterRow}>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                >
                  <Text style={styles.counterSymbol}>-</Text>
                </Pressable>

                <View style={styles.counterValueWrap}>
                  <Text style={styles.counterValue}>{childrenCount}</Text>
                </View>

                <Pressable style={styles.counterBtn} onPress={() => setChildrenCount((prev) => prev + 1)}>
                  <Text style={[styles.counterSymbol, styles.counterSymbolPlus]}>+</Text>
                </Pressable>
              </View>
            </View>

            <View>
              <Text style={styles.labelText}>{wo ? 'Begg am doom' : 'Desir d avoir des enfants'}</Text>
              <SelectField value={desireChildren} options={infoDesire} onChange={setDesireChildren} />
            </View>
          </View>

          <SectionTitle
            icon="baby-face-outline"
            label={wo ? 'Suivi grossesse' : 'Grossesse'}
            color={colors.terracotta}
          />

          <View style={styles.fieldsBlock}>
            <View>
              <Text style={styles.labelText}>{wo ? 'Sa statut grossesse' : 'Statut de grossesse'}</Text>
              <SelectField
                value={pregnancyStatus}
                options={infoPregnancyStatus}
                onChange={setPregnancyStatus}
              />
            </View>

            {(pregnancyStatus === 'pregnant' || pregnancyStatus === 'postpartum') ? (
              <View>
                <Text style={styles.labelText}>
                  {wo ? 'Nyaata semaine / fan ?' : 'Depuis combien de semaines ?'}
                </Text>
                <TextInput
                  value={pregnancyWeeks}
                  onChangeText={setPregnancyWeeks}
                  placeholder={wo ? 'Ex: 18 semaines' : 'Ex: 18 semaines'}
                  placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                  style={styles.input}
                />
              </View>
            ) : null}

            {pregnancyStatus === 'pregnant' ? (
              <View>
                <Text style={styles.labelText}>{wo ? 'Bess bu muñ' : 'Date prévue du terme'}</Text>
                <TextInput
                  value={pregnancyDueDate}
                  onChangeText={setPregnancyDueDate}
                  placeholder={'YYYY-MM-DD'}
                  placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                  style={styles.input}
                />
              </View>
            ) : null}
          </View>

          <SectionTitle icon="flower-outline" label={wo ? 'Sa degg-degg' : 'Confession religieuse'} color={'#7A8C5A'} />

          <View style={styles.cardGreenSoft}>
            <Text style={styles.cardTitle}>
              {wo ? 'Sa degg-degg bu xel ak boppam' : 'Ta confession ou spiritualite'}
            </Text>
            <Text style={styles.cardDesc}>
              {wo
                ? 'Xibaarkat bii jox na la dimbali ci resource yi ak sa degg-degg. Xamunu kenn.'
                : 'Cette information nous aide a personnaliser les ressources et contenus sensibles selon tes valeurs. Totalement confidentiel.'}
            </Text>

            <Text style={styles.labelText}>{wo ? 'Tannal sa degg-degg' : 'Ta confession'}</Text>
            <SelectField value={religiousFaith} options={infoFaith} onChange={setReligiousFaith} />

            <Text style={styles.cardFootNote}>
              {wo
                ? 'Ngir jox la resources yi am solo. Xamunu kenn - doxal na rekk ci sa telephone.'
                : 'Pour te proposer des ressources respectueuses de tes valeurs. Jamais partage - stocke uniquement sur ton appareil.'}
            </Text>
          </View>

          <SectionTitle icon="shield-outline" label={wo ? 'Contraception' : 'Contraception'} color={colors.copper} />

          <View style={styles.cardCopperSoft}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>
                  {wo ? 'Jeefandiku nga contraception ?' : 'Utilises-tu une contraception ?'}
                </Text>
                <Text style={styles.toggleSubtitle}>
                  {wo ? 'Xibaarkat bi nebb na, kenn xamul' : 'Information confidentielle'}
                </Text>
              </View>

              <Pressable
                style={[styles.switchTrack, contraceptionActive && styles.switchTrackActive]}
                onPress={() => setContraceptionActive((prev) => !prev)}
              >
                <View style={[styles.switchThumb, contraceptionActive && styles.switchThumbActive]} />
              </Pressable>
            </View>

            {contraceptionActive ? (
              <View>
                <Text style={styles.chipsTitle}>{wo ? 'Sa methode' : 'Ta methode'}</Text>
                <View style={styles.chipsWrap}>
                  {CONTRACEPTION_METHODS.map((item) => {
                    const selected = contraceptionMethod === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        style={[styles.methodChip, selected && styles.methodChipSelected]}
                        onPress={() => setContraceptionMethod(selected ? '' : item.id)}
                      >
                        <Text style={[styles.methodChipText, selected && styles.methodChipTextSelected]}>
                          {wo ? item.wo : item.fr}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>

          <SectionTitle icon="stethoscope" label={wo ? 'Sa wer' : 'Ma sante'} color={colors.gold} />

          <View style={styles.cardGoldSoft}>
            <Text style={styles.cardTitle}>{wo ? 'Jafe yi ci sa wer' : 'Conditions de santé'}</Text>
            <Text style={styles.cardDesc}>
              {wo
                ? 'Tannal yi la jem ngir nu jox la jangale ak digalante bu am solo.'
                : 'Sélectionne ce qui te concerne pour recevoir des conseils et des articles adaptés.'}
            </Text>

            <View style={styles.conditionList}>
              {HEALTH_CONDITIONS.map((condition) => {
                const selected = healthConditions.includes(condition.id);

                return (
                  <Pressable
                    key={condition.id}
                    style={[
                      styles.conditionRow,
                      {
                        borderColor: selected ? condition.color + '55' : 'rgba(74, 47, 39, 0.08)',
                        backgroundColor: selected ? condition.color + '1A' : 'transparent',
                      },
                    ]}
                    onPress={() => toggleCondition(condition.id)}
                  >
                    <View
                      style={[
                        styles.conditionIconWrap,
                        {
                          backgroundColor: selected
                            ? condition.color + '2E'
                            : 'rgba(74, 47, 39, 0.06)',
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={condition.icon}
                        size={15}
                        color={selected ? condition.color : 'rgba(74, 47, 39, 0.45)'}
                      />
                    </View>

                    <Text
                      style={[
                        styles.conditionText,
                        {
                          color: selected ? colors.deepGreen : 'rgba(74, 47, 39, 0.8)',
                          fontWeight: selected ? '600' : '500',
                        },
                      ]}
                    >
                      {wo ? condition.wo : condition.fr}
                    </Text>

                    {selected ? (
                      <View style={[styles.conditionCheck, { backgroundColor: condition.color }]}>
                        <MaterialCommunityIcons name="check" size={14} color={colors.white} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.cardFootNote}>
              {wo
                ? 'Am walla amul, lepp nebb na. Men nga soppi ko bes bu nekk.'
                : 'Aucune pression : tu peux modifier ces informations à tout moment. Elles ne sont jamais partagées.'}
            </Text>
          </View>

          <SectionTitle icon="school-outline" label={wo ? 'Niveau d’études' : 'Niveau d’études'} color={colors.deepGreen} />
          <View style={styles.fieldsBlock}>
            <View>
              <Text style={styles.labelText}>{wo ? 'Niveau d’études' : 'Niveau d’études'}</Text>
              <TextInput
                value={educationLevel}
                onChangeText={setEducationLevel}
                placeholder={wo ? 'Ex: Licence, Bac, etc.' : 'Ex: Licence, Bac, etc.'}
                placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                style={styles.input}
              />
            </View>
          </View>

          <SectionTitle icon="star-outline" label={wo ? 'Hobbies' : 'Hobbies'} color={colors.terracotta} />
          <View style={styles.fieldsBlock}>
            <View>
              <Text style={styles.labelText}>{wo ? 'Ajoute un hobby' : 'Ajoute un hobby'}</Text>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <TextInput
                  value={hobbyInput}
                  onChangeText={setHobbyInput}
                  placeholder={wo ? 'Ex: lecture, sport...' : 'Ex: lecture, sport...'}
                  placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                  style={[styles.input, { flex: 1 }]}
                />
                <Pressable
                  style={{ padding: 8, backgroundColor: colors.deepGreen, borderRadius: 8 }}
                  onPress={() => {
                    if (hobbyInput.trim() && !hobbies.includes(hobbyInput.trim())) {
                      setHobbies((prev) => [...prev, hobbyInput.trim()]);
                      setHobbyInput('');
                    }
                  }}
                >
                  <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {hobbies.map((hobby) => (
                  <View key={hobby} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F3ED', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ color: colors.deepGreen, fontSize: 13 }}>{hobby}</Text>
                    <Pressable onPress={() => setHobbies((prev) => prev.filter((h) => h !== hobby))}>
                      <MaterialCommunityIcons name="close" size={14} color={colors.terracotta} style={{ marginLeft: 4 }} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <SectionTitle icon="account-details-outline" label={wo ? 'À propos de moi' : 'À propos de moi'} color={colors.copper} />
          <View style={styles.fieldsBlock}>
            <View>
              <Text style={styles.labelText}>{wo ? 'Parle de toi' : 'Parle de toi'}</Text>
              <TextInput
                value={aboutMe}
                onChangeText={setAboutMe}
                placeholder={wo ? 'Ex: Je suis passionnée de...' : 'Ex: Je suis passionnée de...'}
                placeholderTextColor={'rgba(74, 47, 39, 0.45)'}
                style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                multiline
              />
            </View>
          </View>

          <View style={styles.privacyNote}>
            <View style={styles.privacyRow}>
              <MaterialCommunityIcons name="lock-outline" size={14} color={colors.cocoaDark} />
              <Text style={styles.privacyText}>
                {wo
                  ? 'Sa xibaarkat yooyu doxal na ci sa telephone bi rekk. Xamunu kenn.'
                  : 'Ces informations sont stockées uniquement sur ton appareil. Elles restent totalement privées et ne sont jamais partagées.'}
              </Text>
            </View>
          </View>

          <Pressable style={[styles.bottomSaveBtn, saved && styles.bottomSaveBtnSaved]} onPress={handleSave}>
            <MaterialCommunityIcons
              name={saved ? 'check' : 'content-save-outline'}
              size={20}
              color={colors.white}
            />
            <Text style={styles.bottomSaveText}>
              {saved ? (wo ? 'Doxal na!' : 'Enregistre !') : wo ? 'Doxal' : 'Enregistrer'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function EditProfileScreen() {
  return <EditProfileContent />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  root: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.12)',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    color: colors.deepGreen,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    marginTop: 2,
    color: colors.terracotta,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  headerSaveBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepGreen,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  headerSaveBtnSaved: {
    backgroundColor: colors.terracotta,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  discreteBlur: {
    opacity: 0.35,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  photoFrameWrap: {
    position: 'relative',
  },
  photoFrame: {
    width: 110,
    height: 110,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.deepGreen,
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEditBtn: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoHint: {
    marginTop: 10,
    fontSize: 11,
    color: 'rgba(74, 47, 39, 0.8)',
    fontStyle: 'italic',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitleIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.deepGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  fieldsBlock: {
    gap: 16,
    marginBottom: 24,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cocoaDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 7,
  },
  input: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(181, 98, 42, 0.22)',
    backgroundColor: colors.white,
    color: colors.cocoaDark,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  selectTrigger: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(181, 98, 42, 0.22)',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  selectValue: {
    flex: 1,
    fontSize: 14,
    color: colors.cocoaDark,
  },
  selectPlaceholder: {
    color: 'rgba(74, 47, 39, 0.6)',
  },
  selectMenu: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.2)',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectOptionActive: {
    backgroundColor: 'rgba(181, 98, 42, 0.08)',
  },
  selectOptionText: {
    color: colors.cocoaDark,
    fontSize: 13,
  },
  selectOptionTextActive: {
    color: colors.deepGreen,
    fontWeight: '600',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(181, 98, 42, 0.2)',
    backgroundColor: colors.white,
  },
  counterSymbol: {
    color: colors.cocoaDark,
    fontSize: 20,
    fontWeight: '500',
  },
  counterSymbolPlus: {
    color: colors.deepGreen,
  },
  counterValueWrap: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(181, 98, 42, 0.2)',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  counterValue: {
    color: colors.deepGreen,
    fontSize: 18,
    fontWeight: '700',
  },
  cardGreenSoft: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 140, 90, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  cardCopperSoft: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(181, 98, 42, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  cardGoldSoft: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    color: colors.deepGreen,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 10,
    color: 'rgba(74, 47, 39, 0.65)',
    lineHeight: 15,
    marginBottom: 12,
  },
  cardFootNote: {
    marginTop: 12,
    fontSize: 9,
    color: 'rgba(74, 47, 39, 0.55)',
    fontStyle: 'italic',
    lineHeight: 13,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  toggleTextWrap: {
    flex: 1,
  },
  toggleTitle: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: '600',
  },
  toggleSubtitle: {
    color: 'rgba(74, 47, 39, 0.62)',
    fontSize: 10,
    marginTop: 2,
  },
  switchTrack: {
    width: 48,
    height: 26,
    borderRadius: 99,
    backgroundColor: 'rgba(74, 47, 39, 0.15)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  switchTrackActive: {
    backgroundColor: colors.copper,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  chipsTitle: {
    fontSize: 10,
    color: colors.cocoaDark,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  methodChip: {
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(74, 47, 39, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(74, 47, 39, 0.12)',
  },
  methodChipSelected: {
    backgroundColor: colors.copper,
    borderColor: colors.copper,
  },
  methodChipText: {
    color: colors.cocoaDark,
    fontSize: 11,
    fontWeight: '500',
  },
  methodChipTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  conditionList: {
    gap: 6,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  conditionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 13,
  },
  conditionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyNote: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    padding: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  privacyText: {
    flex: 1,
    color: colors.cocoaDark,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  bottomSaveBtn: {
    marginTop: 18,
    width: '100%',
    borderRadius: 24,
    backgroundColor: colors.deepGreen,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 3,
  },
  bottomSaveBtnSaved: {
    backgroundColor: colors.terracotta,
  },
  bottomSaveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
