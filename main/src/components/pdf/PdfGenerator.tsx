// components/PdfGenerator.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Material, User } from "../user-management";

// Register fonts (you might need to handle this differently in your setup)
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1E40AF",
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    color: "#1E40AF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
    fontWeight: 400,
  },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
    color: "#1E40AF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: -10,
  },
  gridItem: {
    width: "50%",
    marginBottom: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: 500,
    color: "#6B7280",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 10,
    fontWeight: 400,
    color: "#111827",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    minHeight: 25,
  },
  tableHeader: {
    backgroundColor: "#1E40AF",
    color: "#FFFFFF",
    fontWeight: 700,
  },
  tableCol: {
    width: "25%",
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableColHeader: {
    width: "25%",
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#1E40AF",
    fontSize: 10,
    fontWeight: 700,
  },
  tableColWide: {
    width: "50%",
    padding: 6,
  },
  tableColHeaderWide: {
    width: "50%",
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#1E40AF",
    fontSize: 10,
    fontWeight: 700,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 9,
    color: "#6B7280",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  materialSpecs: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  specItem: {
    flexDirection: "row",
    marginRight: 10,
    marginBottom: 3,
  },
  specLabel: {
    fontSize: 8,
    color: "#6B7280",
    marginRight: 3,
  },
  specValue: {
    fontSize: 8,
    color: "#374151",
    fontWeight: 500,
  },
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PdfGenerator = ({
  user,
  materials,
}: {
  user: User;
  materials: Material[];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Equipment Inventory Report</Text>
        <Text style={styles.subtitle}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* User Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>User Details</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{user.fullname}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Service/Department</Text>
            <Text style={styles.value}>{user.service}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Bloc</Text>
            <Text style={styles.value}>{user.bloc}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Contact Email</Text>
            <Text style={styles.value}>{user.email || "Not provided"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{user.tel || "Not provided"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>User Since</Text>
            <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Materials Table */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Assigned Equipment ({materials.length} items)
        </Text>

        {materials.length > 0 ? (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableColHeader}>Codebar</Text>
              <Text style={styles.tableColHeader}>Brand/Model</Text>
              <Text style={styles.tableColHeader}>Specifications</Text>
              <Text style={styles.tableColHeader}>Accessories & Notes</Text>
            </View>

            {/* Table Rows */}
            {materials.map((mat) => (
              <View style={styles.tableRow} key={mat.id}>
                <Text style={styles.tableCol}>{mat.codebar || "N/A"}</Text>
                <Text style={styles.tableCol}>{mat.marque || "N/A"}</Text>
                <View style={styles.tableCol}>
                  <View style={styles.materialSpecs}>
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>CPU:</Text>
                      <Text style={styles.specValue}>
                        {mat.cpu} ({mat.Ncpu || "N/A"})
                      </Text>
                    </View>
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>RAM:</Text>
                      <Text style={styles.specValue}>
                        {mat.ram} ({mat.Nram || "N/A"}GB)
                      </Text>
                    </View>
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>Disk:</Text>
                      <Text style={styles.specValue}>
                        {mat.disk} ({mat.Ndisk || "N/A"}GB)
                      </Text>
                    </View>
                    {mat.ecran && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Screen:</Text>
                        <Text style={styles.specValue}>
                          {mat.ecran || "N/A"}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.tableCol}>
                  <View style={styles.materialSpecs}>
                    {(mat.adf ?? 0) > 0 && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>ADF:</Text>
                        <Text style={styles.specValue}>{mat.adf ?? "N/A"}</Text>
                      </View>
                    )}

                    {(mat.clavier ?? 0) > 0 && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Keyboard:</Text>
                        <Text style={styles.specValue}>
                          {mat.clavier ?? "N/A"}
                        </Text>
                      </View>
                    )}

                    {mat.souris && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Mouse:</Text>
                        <Text style={styles.specValue}>
                          {mat.souris || "N/A"}
                        </Text>
                      </View>
                    )}

                    {mat.accessoire && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Accessories:</Text>
                        <Text style={styles.specValue}>
                          {mat.accessoire || "N/A"}
                        </Text>
                      </View>
                    )}
                    {mat.notes && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Notes:</Text>
                        <Text style={styles.specValue}>
                          {mat.notes || "N/A"}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text
            style={{ fontStyle: "italic", color: "#6B7280", marginTop: 10 }}
          >
            No equipment assigned to this user.
          </Text>
        )}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Inventory Report for {user.fullname} • Generated on{" "}
        {new Date().toLocaleDateString()} • Page 1 of 1
      </Text>
    </Page>
  </Document>
);

export default PdfGenerator;
