import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

const C = {
  deepGreen: "#0F3D2E",
  green2: "#1A3C34",
  beige: "#F5F1E6",
  beige2: "#EDE5D0",
  sand: "#E8DCC8",
  terracotta: "#C26A3D",
  copper: "#B5622A",
  cocoa: "#4A2F27",
  card: "#FAF7F1",
};

interface MonEspaceProps {
  onBack: () => void;
}

export default function MonEspace({ onBack }: MonEspaceProps) {
  const router = useRouter();
  const [modeDiscret, setModeDiscret] = React.useState(false);
  const [audioEdu, setAudioEdu] = React.useState(false);
  const [audioCalm, setAudioCalm] = React.useState(false);
  const [testimony, setTestimony] = React.useState(0);
  const [biometric, setBiometric] = React.useState(true);
  const [autoDelete, setAutoDelete] = React.useState(false);

  const testimonies = [
    "J'ai enfin compris mon cycle, et je me sens plus sereine.",
    "Le mode discret m'a permis d'utiliser l'app en toute confiance.",
    "Les audios d'apaisement m'aident à mieux dormir.",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={onBack} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
              <Feather name="chevron-left" size={18} color={C.deepGreen} />
            </Pressable>
            <View>
              <Text style={styles.title}>{modeDiscret ? "Agenda Santé" : "Mon Espace"}</Text>
              <Text style={styles.subtitle}>
                {modeDiscret ? "Mode discret actif" : "Ton espace intime et sécurisé"}
              </Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <Feather name="user" size={18} color={C.deepGreen} />
          </View>
        </View>

        <Pressable onPress={() => setModeDiscret((v) => !v)} style={styles.discreteCard}>
          <View style={styles.discreteLeft}>
            <View style={[styles.discreteIcon, modeDiscret && styles.discreteIconOn]}>
              <Feather name={modeDiscret ? "eye-off" : "eye"} size={15} color={modeDiscret ? C.beige : C.deepGreen} />
            </View>
            <View>
              <Text style={[styles.discreteTitle, modeDiscret && styles.discreteTitleOn]}>Mode discret</Text>
              <Text style={[styles.discreteSub, modeDiscret && styles.discreteSubOn]}>
                {modeDiscret ? "Actif - contenu masqué" : "Masque les informations sensibles"}
              </Text>
            </View>
          </View>
          <Switch value={modeDiscret} onValueChange={setModeDiscret} thumbColor="#FFFFFF" trackColor={{ false: "rgba(74,47,39,0.2)", true: C.deepGreen }} />
        </Pressable>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Section title="Journal personnel" icon="edit-3" color={C.terracotta}>
            <Text style={styles.bodyText}>{modeDiscret ? "██████ ██████████ ████..." : "Aujourd&apos;hui, je me sens plus à l&apos;écoute de mon corps."}</Text>
            <Pressable onPress={() => router.push('/journal')} style={styles.primaryAction}>
              <Feather name="edit-3" size={14} color={C.beige} />
              <Text style={styles.primaryActionText}>Écrire aujourd&apos;hui</Text>
            </Pressable>
          </Section>

          <Section title="Audio éducatif" icon="headphones" color={C.copper}>
            <Text style={styles.bodyText}>Comprendre mon cycle - 12:30</Text>
            <View style={styles.audioRow}>
              <Pressable onPress={() => setAudioEdu((v) => !v)} style={styles.audioButton}>
                <Feather name={audioEdu ? "pause" : "play"} size={16} color={C.beige} />
              </Pressable>
              <Text style={styles.audioHint}>{audioEdu ? "Lecture en cours" : "Appuie pour écouter"}</Text>
            </View>
          </Section>

          <Section title="Audio apaisement" icon="wind" color={C.green2}>
            <Text style={styles.bodyText}>Pluie sur la savane - 15:00</Text>
            <View style={styles.audioRow}>
              <Pressable onPress={() => setAudioCalm((v) => !v)} style={[styles.audioButton, { backgroundColor: C.green2 }]}>
                <Feather name={audioCalm ? "pause" : "play"} size={16} color={C.beige} />
              </Pressable>
              <Text style={styles.audioHint}>{audioCalm ? "Apaisement actif" : "Démarrer l'ambiance"}</Text>
            </View>
          </Section>

          <Section title="Témoignages anonymisés" icon="users" color={C.green2}>
            <Text style={styles.bodyText}>{modeDiscret ? "\"████████████████████\"" : `\"${testimonies[testimony]}\"`}</Text>
            <View style={styles.dotsRow}>
              {testimonies.map((_, i) => (
                <Pressable key={i} onPress={() => setTestimony(i)} style={[styles.dot, i === testimony && styles.dotOn]} />
              ))}
            </View>
          </Section>

          <Section title="Confidentialité" icon="shield" color={C.deepGreen}>
            <ToggleRow
              label="Déverrouillage biométrique"
              sub="Empreinte ou visage"
              value={biometric}
              onChange={setBiometric}
            />
            <ToggleRow
              label="Suppression auto (30j)"
              sub="Journaux et historique"
              value={autoDelete}
              onChange={setAutoDelete}
            />
          </Section>

          <Section title="Explorer" icon="compass" color={C.copper}>
            <LinkRow label="Mon orientation santé" sub="Évaluation adaptée" onPress={() => router.push('/orientation')} />
            <LinkRow label="À propos de SaxalWér" sub="Méthodologie et partenaires" onPress={() => router.push('/about')} />
          </Section>

          <View style={styles.footerNote}>
            <Feather name="lock" size={10} color={`${C.cocoa}66`} />
            <Text style={styles.footerText}>Tes données ne quittent jamais cet appareil.</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconWrap, { backgroundColor: `${color}1A` }]}>
          <Feather name={icon} size={16} color={color} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ToggleRow({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} thumbColor="#FFFFFF" trackColor={{ false: "rgba(74,47,39,0.25)", true: C.deepGreen }} />
    </View>
  );
}

function LinkRow({ label, sub, onPress }: { label: string; sub: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.linkLabel}>{label}</Text>
        <Text style={styles.linkSub}>{sub}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={`${C.cocoa}66`} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.beige,
  },
  container: {
    flex: 1,
    backgroundColor: C.beige,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(15,61,46,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,61,46,0.14)",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,61,46,0.12)",
  },
  title: {
    fontSize: 31,
    lineHeight: 34,
    color: C.deepGreen,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: `${C.cocoa}80`,
    fontStyle: "italic",
  },
  discreteCard: {
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15,61,46,0.08)",
    borderWidth: 1,
    borderColor: "rgba(15,61,46,0.14)",
  },
  discreteLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  discreteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,61,46,0.14)",
  },
  discreteIconOn: {
    backgroundColor: "rgba(15,61,46,0.7)",
  },
  discreteTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: C.deepGreen,
  },
  discreteTitleOn: {
    color: C.deepGreen,
  },
  discreteSub: {
    fontSize: 11,
    color: `${C.cocoa}99`,
  },
  discreteSubOn: {
    color: `${C.cocoa}CC`,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 12,
  },
  sectionCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: `${C.sand}B0`,
    shadowColor: C.cocoa,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
    color: C.deepGreen,
    fontWeight: "600",
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: `${C.cocoa}D9`,
  },
  primaryAction: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: C.terracotta,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  primaryActionText: {
    color: C.beige,
    fontSize: 13,
    fontWeight: "600",
  },
  audioRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  audioButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.copper,
  },
  audioHint: {
    fontSize: 12,
    color: `${C.cocoa}99`,
  },
  dotsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(15,61,46,0.25)",
  },
  dotOn: {
    width: 20,
    borderRadius: 99,
    backgroundColor: C.deepGreen,
  },
  toggleRow: {
    borderRadius: 14,
    backgroundColor: "rgba(232,220,200,0.45)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 13,
    color: C.deepGreen,
    fontWeight: "500",
  },
  toggleSub: {
    marginTop: 1,
    fontSize: 11,
    color: `${C.cocoa}80`,
  },
  linkRow: {
    borderRadius: 14,
    backgroundColor: "rgba(232,220,200,0.45)",
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  linkLabel: {
    fontSize: 13,
    color: C.deepGreen,
    fontWeight: "500",
  },
  linkSub: {
    marginTop: 1,
    fontSize: 11,
    color: `${C.cocoa}80`,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
  },
  footerText: {
    fontSize: 10,
    color: `${C.cocoa}66`,
    fontStyle: "italic",
  },
  pressed: {
    opacity: 0.9,
  },
});
