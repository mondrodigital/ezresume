import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { ResumeData } from '../types';
import { spacing, fontSize, colors } from '../styles/resumeStyles';

// Register the fonts
Font.register({
  family: 'Arial',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-latin-400-normal.woff' },
    { 
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-latin-700-normal.woff',
      fontWeight: 'bold'
    }
  ]
});

interface Props {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman',
    width: '612pt', // 8.5 inches
    height: '792pt', // 11 inches
  },
  header: {
    marginBottom: spacing.header,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactText: {
    fontSize: 8,
    color: '#666666',
  },
  contactDot: {
    fontSize: 8,
    color: '#666666',
  },
  section: {
    marginBottom: spacing.section,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 4,
  },
  experienceItem: {
    marginBottom: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  position: {
    fontSize: 10,
    color: '#666666',
  },
  dates: {
    fontSize: 8,
    color: '#666666',
  },
  description: {
    fontSize: 8,
    marginLeft: 16,
    marginTop: 4,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    fontSize: 8,
    backgroundColor: '#f0f0f0',
    padding: '3 8',
    borderRadius: 10,
  },
});

const MultiLineText = ({ children, style }: { children: string, style?: any }) => {
  return (
    <>
      {children.split('\n').map((text, index) => (
        <Text key={index} style={style}>
          {text}
        </Text>
      ))}
    </>
  );
};

export default function ResumePDF({ data }: Props) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Text>
          <View style={styles.contactInfo}>
            {data.personalInfo.email && <Text style={styles.contactText}>{data.personalInfo.email}</Text>}
            {data.personalInfo.phone && (
              <>
                <Text style={styles.contactDot}>•</Text>
                <Text style={styles.contactText}>{data.personalInfo.phone}</Text>
              </>
            )}
            {data.personalInfo.website && (
              <>
                <Text style={styles.contactDot}>•</Text>
                <Text style={styles.contactText}>{data.personalInfo.website}</Text>
              </>
            )}
            {data.personalInfo.linkedin && (
              <>
                <Text style={styles.contactDot}>•</Text>
                <Text style={styles.contactText}>{data.personalInfo.linkedin}</Text>
              </>
            )}
          </View>
        </View>

        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <MultiLineText style={styles.description}>
              {data.personalInfo.summary}
            </MultiLineText>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.companyName}>{exp.company}</Text>
                <View style={styles.positionRow}>
                  <Text style={styles.position}>{exp.position}</Text>
                  <Text style={styles.dates}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                </View>
                <MultiLineText style={styles.description}>
                  {exp.description}
                </MultiLineText>
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.companyName}>{edu.school}</Text>
                <View style={styles.positionRow}>
                  <Text style={styles.position}>{edu.degree}</Text>
                  <Text style={styles.dates}>{edu.graduationDate}</Text>
                </View>
                <MultiLineText style={styles.description}>
                  {edu.description}
                </MultiLineText>
              </View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}