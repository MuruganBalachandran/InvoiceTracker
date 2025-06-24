import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Invoice } from '../redux/types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#666',
  },
  clientInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#374151',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },
  tableCellRight: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
    color: '#374151',
  },
  total: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
});

export const InvoicePDF = ({ invoice, clientName }: { invoice: Invoice; clientName: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
        </View>
        <View>
          <Text style={styles.text}>Issue Date: {invoice.issueDate}</Text>
          <Text style={styles.text}>Due Date: {invoice.dueDate}</Text>
        </View>
      </View>

      <View style={styles.clientInfo}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text style={styles.text}>{clientName}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { flex: 3 }]}>Description</Text>
          <Text style={styles.tableCell}>Qty</Text>
          <Text style={styles.tableCellRight}>Rate</Text>
          <Text style={styles.tableCellRight}>Amount</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCellRight}>${item.rate.toFixed(2)}</Text>
            <Text style={styles.tableCellRight}>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <Text style={styles.text}>Subtotal: ${invoice.subtotal.toFixed(2)}</Text>
        <Text style={styles.text}>Tax: ${invoice.tax.toFixed(2)}</Text>
        <Text style={styles.totalText}>Total: ${invoice.total.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export const generateInvoicePDF = (invoice: Invoice, clientName: string) => {
  return <InvoicePDF invoice={invoice} clientName={clientName} />;
};