import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  // New Modern Header Design
  header: {
    marginBottom: 15,
  },
  headerMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1181c5",
    marginBottom: 3,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 11,
    color: "#4b5563",
    fontWeight: "medium",
  },
  documentInfo: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  dsiBadge: {
    backgroundColor: "#1181c5",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    marginTop: 8,
  },

  // Content Cards
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  // Grid Layout
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    width: "48%",
    marginBottom: 6,
  },

  // Detail Rows
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
    minHeight: 16,
    alignItems: "center",
  },
  detailLabel: {
    width: "45%",
    fontSize: 9.5,
    fontWeight: "600",
    color: "#4b5563",
  },
  detailValue: {
    width: "55%",
    fontSize: 9.5,
    color: "#111827",
  },
  highlightValue: {
    fontWeight: "bold",
    color: "#1181c5",
  },

  // Conditions
  conditionsCard: {
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  conditionsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 6,
  },
  conditionItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  conditionNumber: {
    width: 14,
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#3b82f6",
    marginRight: 6,
  },
  conditionText: {
    flex: 1,
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.25,
  },

  // Signatures
  signatureSection: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 14,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "46%",
  },
  signatureField: {
    height: 40,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 4,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  signatureLabel: {
    fontSize: 9,
    color: "#64748b",
    fontStyle: "italic",
  },
  signatureInfo: {
    fontSize: 8.5,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 2,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  logoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#1181c5",
  },
  logoContainer: {
    width: "25%",
    height: 40,
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: "contain",
  },
  companyInfo: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1181c5",
    textAlign: "center",
  },
  companySubtitle: {
    fontSize: 7.5,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 1,
  },
  docInfoBox: {
    width: "25%",
    alignItems: "flex-end",
  },
  docInfoContainer: {
    backgroundColor: "#f8fafc",
    borderLeftWidth: 2,
    borderLeftColor: "#1181c5",
    paddingLeft: 6,
    paddingRight: 8,
    paddingTop: 3,
    paddingBottom: 3,
  },
  docNumber: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#1e293b",
  },
  docDate: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 1,
  },
});

type Detail = {
  label: string;
  value: any;
};

type User = {
  fullname?: string;
  post?: string;
  service?: string;
  bloc?: string;
  email?: string;
  tel?: string;
};

type Props = {
  details: Detail[];
  user?: User;
  signature?: string | null;
  documentNumber?: string;
  date?: string;
  logoUrl?: string;
  companyName?: string;
};

export function DechargePDF({
  details,
  user,
  signature,
  documentNumber = "DSI-2026",
  date = new Date().toLocaleDateString("fr-FR"),
  logoUrl,
  companyName = "MONO ELECTRIC",
}: Props) {
  // Filter out "Created At" and "Updated At" fields
  const filteredDetails = details.filter(
    (detail) =>
      !detail.label.toLowerCase().includes("created") &&
      !detail.label.toLowerCase().includes("updated") &&
      !detail.label.toLowerCase().includes("mouse") &&
      !detail.label.toLowerCase().includes("keyboard") &&
      !detail.label.toLowerCase().includes("screen"),
  );

  // Format value safely
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "object") {
      if (value && "nom" in value) return value.nom;
      return JSON.stringify(value);
    }
    return String(value);
  };

  // User details array
  const userDetails = [
    {
      label: "Nom & Prénom",
      value: user?.fullname || "Non renseigné",
      highlight: true,
    },
    { label: "Service", value: user?.service || "-" },
    { label: "Position / Fonction", value: user?.post || "-" },
  ];

  // Prepare equipment details - limit to essential ones for space
  const essentialDetails = filteredDetails.slice(0, 10);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo and Company Header */}
        <View style={styles.logoSection}>
          {/* Left: Logo */}
          <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/logo.png" />
          </View>

          {/* Right: Document Info */}
          <View style={styles.docInfoBox}>
            <View style={styles.docInfoContainer}>
              <Text style={styles.docNumber}>N° {documentNumber}</Text>
              <Text style={styles.docDate}>{date}</Text>
            </View>
          </View>
        </View>

        {/* Main Document Title */}
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>
                DÉCHARGE DE MATÉRIEL INFORMATIQUE
              </Text>
              <Text style={styles.subtitle}>
                Formulaire officiel de prise en charge et responsabilité
              </Text>
              <Text style={styles.dsiBadge}>
                DIRECTION DES SYSTÈMES D'INFORMATION
              </Text>
            </View>
          </View>
        </View>

        {/* User Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>INFORMATIONS UTILISATEUR</Text>
          <View>
            {userDetails.map((item, index) => (
              <View style={styles.detailRow} key={index}>
                <Text style={styles.detailLabel}>{item.label} :</Text>
                <Text
                  style={[
                    styles.detailValue,
                    item.highlight && styles.highlightValue,
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Equipment Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MATÉRIEL ATTRIBUÉ</Text>
          <View style={styles.gridContainer}>
            {essentialDetails.map((item, index) => (
              <View style={styles.gridItem} key={index}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{item.label} :</Text>
                  <Text style={styles.detailValue}>
                    {formatValue(item.value)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Conditions Card */}
        <View style={styles.conditionsCard}>
          <Text style={styles.conditionsTitle}>
            ENGAGEMENTS DE L'UTILISATEUR
          </Text>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionNumber}>1.</Text>
            <Text style={styles.conditionText}>
              Reconnaissance de réception du matériel en bon état de
              fonctionnement.
            </Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionNumber}>2.</Text>
            <Text style={styles.conditionText}>
              Engagement d'utilisation exclusive à des fins professionnelles.
            </Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionNumber}>3.</Text>
            <Text style={styles.conditionText}>
              Responsabilité de la sécurité et intégrité du matériel confié.
            </Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionNumber}>4.</Text>
            <Text style={styles.conditionText}>
              Signalement immédiat à la DSI de toute anomalie, perte ou vol.
            </Text>
          </View>
        </View>

        {/* Signatures Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureTitle}>APPROBATIONS ET SIGNATURES</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureField}>
                {signature ? (
                  <Image
                    src={signature}
                    style={{
                      width: 120,
                      height: 40,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Text style={styles.signatureLabel}>
                    Signature de l'utilisateur
                  </Text>
                )}
              </View>

              <Text style={styles.signatureInfo}>Nom : M.{user?.fullname}</Text>
              <Text style={styles.signatureInfo}>Date : {date}</Text>
            </View>

            <View style={styles.signatureBox}>
              <View style={styles.signatureField}>
                <Text style={styles.signatureLabel}>Signature DSI</Text>
              </View>
              <Text style={styles.signatureInfo}>
                Direction des Systèmes d'Information
              </Text>
              <Text style={styles.signatureInfo}>Date : {date}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Document officiel de la Direction des Systèmes d'Information • Toute
          anomalie à signaler immédiatement • Page 1/1
        </Text>
      </Page>
    </Document>
  );
}
