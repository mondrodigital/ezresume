import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { ResumeData } from '../types';
import { spacing, fontSize, colors } from '../styles/resumeStyles';
import { DOMParser } from '@xmldom/xmldom';

interface Props {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
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
    lineHeight: 1.4,
  },
  boldText: {
    fontWeight: 900,
  },
  italic: {
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
  },
  descriptionLink: {
    fontSize: 8,
    color: 'blue',
    textDecoration: 'underline',
  },
  bulletPoint: {
    width: 10,
    marginRight: 5,
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

// Define numeric constants for node types
const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

// -------------------------------------------------------------------
// New rich text renderer for PDF export
// -------------------------------------------------------------------
// This function recursively traverses the HTML DOM (parsed from a rich text field)
// and returns React-PDF <Text> elements with correct formatting.
// It specifically handles bullet lists (<ul>) and ordered lists (<ol>) using only <Text> elements.
function renderRichText(
  node: ChildNode,
  inherited: { bold: boolean; italic: boolean } = { bold: false, italic: false }
): React.ReactNode {
  // If it's a text node, render it.
  if (node.nodeType === TEXT_NODE) {
    const text = node.textContent;
    if (!text || !text.trim()) return null;
    return (
      <Text
        style={{
          fontWeight: inherited.bold ? "bold" : undefined,
          fontStyle: inherited.italic ? "italic" : undefined,
        }}
      >
        {text}
      </Text>
    );
  }

  // If it's an element node, adjust formatting and process children.
  if (node.nodeType === ELEMENT_NODE) {
    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    let newInherited = { ...inherited };
    if (tag === "strong" || tag === "b") newInherited.bold = true;
    if (tag === "em" || tag === "i") newInherited.italic = true;

    if (tag === "ul") {
      // Render an unordered list using only <Text> components.
      return (
        <Text style={{ marginBottom: 4 }}>
          {Array.from(element.children).map((child, idx) => {
            if (child.tagName.toLowerCase() === "li") {
              return (
                <Text key={idx} style={{ marginBottom: 2 }}>
                  {"\u2022 "} 
                  {Array.from(child.childNodes).map((childNode, i) => (
                    <React.Fragment key={i}>
                      {renderRichText(childNode, newInherited)}
                    </React.Fragment>
                  ))}
                  {"\n"}
                </Text>
              );
            }
            return null;
          })}
        </Text>
      );
    }

    if (tag === "ol") {
      // Render an ordered list using only <Text> components.
      return (
        <Text style={{ marginBottom: 4 }}>
          {Array.from(element.children).map((child, idx) => {
            if (child.tagName.toLowerCase() === "li") {
              return (
                <Text key={idx} style={{ marginBottom: 2 }}>
                  {`${idx + 1}. `}
                  {Array.from(child.childNodes).map((childNode, i) => (
                    <React.Fragment key={i}>
                      {renderRichText(childNode, newInherited)}
                    </React.Fragment>
                  ))}
                  {"\n"}
                </Text>
              );
            }
            return null;
          })}
        </Text>
      );
    }

    if (tag === "p") {
      // Render a paragraph with spacing.
      return (
        <Text style={{ marginBottom: 4 }} key={Math.random()}>
          {Array.from(element.childNodes).map((child, i) => (
            <React.Fragment key={i}>
              {renderRichText(child, newInherited)}
            </React.Fragment>
          ))}
          {"\n"}
        </Text>
      );
    }

    // Default: render children inline.
    return (
      <Text
        style={{
          fontWeight: newInherited.bold ? "bold" : undefined,
          fontStyle: newInherited.italic ? "italic" : undefined,
        }}
        key={Math.random()}
      >
        {Array.from(element.childNodes).map((child, i) => (
          <React.Fragment key={i}>
            {renderRichText(child, newInherited)}
          </React.Fragment>
        ))}
      </Text>
    );
  }

  return null;
}

// PDFRichText component uses a DOMParser (from @xmldom/xmldom) to convert HTML into React-PDF elements.
const PDFRichText = ({ content }: { content: string }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const body = doc.getElementsByTagName("body")[0] || doc.documentElement;
  return (
    <View style={styles.description}>
      {Array.from(body.childNodes).map((node, i) => (
        <React.Fragment key={i}>{renderRichText(node)}</React.Fragment>
      ))}
    </View>
  );
};

// -------------------------------------------------------------------
// ResumePDF Component
// -------------------------------------------------------------------
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
            <PDFRichText content={data.personalInfo.summary} />
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
                <PDFRichText content={exp.description} />
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
                <PDFRichText content={edu.description} />
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