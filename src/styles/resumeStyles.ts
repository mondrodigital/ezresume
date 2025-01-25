export const spacing = {
  page: 30,
  section: 15,
  header: 20,
};

export const fontSize = {
  name: 24,
  sectionTitle: 16,
  normal: 10,
  companyName: 14,
  position: 12,
};

export const colors = {
  primary: '#000000',
  secondary: '#666666',
  border: '#cccccc',
  background: '#f0f0f0',
};

export const shared = {
  name: {
    fontSize: fontSize.name,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: fontSize.normal,
    color: colors.secondary,
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: spacing.header,
  },
  sectionTitle: {
    fontSize: fontSize.sectionTitle,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 5,
  },
  section: {
    marginBottom: spacing.section,
  },
}; 