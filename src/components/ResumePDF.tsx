import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { ResumeData } from '../types';
import { spacing } from '../styles/resumeStyles';
import { HTMLPreview } from './HTMLPreview';

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

/*
  Updated parseFormattedText:

  • When running in the browser, we use document.createElement to parse HTML.
  • Otherwise we use a minimal regex-based fallback (which supports basic <p>, <strong>/<b>, and <em>/<i> tags).
*/
const parseFormattedText = (html: string) => {
  if (typeof document !== 'undefined' && document.createElement) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const result: { text: string; bold: boolean; italic: boolean }[] = [];

    function processNode(node: ChildNode, inherited: { bold: boolean; italic: boolean } = { bold: false, italic: false }) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (text.trim()) {
          result.push({ text, bold: inherited.bold, italic: inherited.italic });
        }
        return;
      }
      const nodeName = node.nodeName.toLowerCase();
      let styles = { bold: inherited.bold, italic: inherited.italic };
      if (nodeName === 'strong' || nodeName === 'b') {
        styles.bold = true;
      }
      if (nodeName === 'em' || nodeName === 'i') {
        styles.italic = true;
      }
      if (nodeName === 'ul' || nodeName === 'ol') {
        Array.from(node.childNodes).forEach((child) => processNode(child, styles));
        result.push({ text: '\n', bold: false, italic: false });
      } else if (nodeName === 'li') {
        result.push({ text: '• ', bold: false, italic: false });
        Array.from(node.childNodes).forEach((child) => processNode(child, styles));
        result.push({ text: '\n', bold: false, italic: false });
      } else {
        Array.from(node.childNodes).forEach((child) => processNode(child, styles));
      }
    }

    Array.from(temp.childNodes).forEach((node) => processNode(node));
    return result;
  } else {
    // Fallback parser (only supports basic tags)
    const result: { text: string; bold: boolean; italic: boolean }[] = [];
    html = html.replace(/<br\s*[\/]?>/gi, '\n');
    const paragraphs = html.split(/<\/?p>/i).filter(p => p.trim() !== '');
    paragraphs.forEach((paragraph, idx) => {
      let remaining = paragraph;
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/<(strong|b)>(.*?)<\/(strong|b)>/i);
        const emMatch = remaining.match(/<(em|i)>(.*?)<\/(em|i)>/i);
        let nextIndex = Infinity;
        let nextTag: 'bold' | 'italic' | null = null;
        let match;
        if (boldMatch?.index != null && boldMatch.index < nextIndex) {
          nextIndex = boldMatch.index;
          nextTag = 'bold';
          match = boldMatch;
        }
        if (emMatch?.index != null && emMatch.index < nextIndex) {
          nextIndex = emMatch.index;
          nextTag = 'italic';
          match = emMatch;
        }
        if (nextIndex > 0) {
          result.push({ text: remaining.substring(0, nextIndex), bold: false, italic: false });
          remaining = remaining.substring(nextIndex);
          continue;
        }
        if (match && match.index === 0) {
          result.push({ text: match[2], bold: nextTag === 'bold', italic: nextTag === 'italic' });
          remaining = remaining.substring(match[0].length);
          continue;
        }
        result.push({ text: remaining, bold: false, italic: false });
        break;
      }
      if (idx < paragraphs.length - 1) {
        result.push({ text: '\n', bold: false, italic: false });
      }
    });
    return result;
  }
};

const FormattedText = ({ content }: { content: string }) => {
  const segments = parseFormattedText(content);
  return (
    <Text style={styles.description}>
      {segments.map((segment, i) => (
        <Text
          key={i}
          style={{
            fontWeight: segment.bold ? "bold" : undefined,
            fontStyle: segment.italic ? "italic" : undefined,
          }}
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
};

export default function ResumePDF({ data }: Props) {
  // Update the hasContent function to be more strict
  const hasContent = (text: string) => {
    // Remove HTML tags and whitespace
    const cleanText = text
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with space
      .trim();
    
    // Return true only if there's actual content
    return cleanText !== '' && 
           cleanText !== 'This is a professional summary.' && 
           cleanText !== 'Professional Summary';
  };

  // Add a helper function to check if a job has any content
  const hasJobContent = (job: typeof data.experience[0]) => {
    return job.company.trim() !== '' || 
           job.position.trim() !== '' || 
           job.startDate.trim() !== '' || 
           job.endDate.trim() !== '' || 
           job.description.trim() !== '';
  };

  // Filter out empty jobs
  const nonEmptyExperience = data.experience.filter(hasJobContent);

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

        {/* Only show Professional Summary if it has meaningful content */}
        {data.personalInfo.summary && hasContent(data.personalInfo.summary) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <FormattedText content={data.personalInfo.summary} />
          </View>
        )}

        {/* Only show Experience section if there are non-empty jobs */}
        {nonEmptyExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {nonEmptyExperience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.companyName}>{exp.company}</Text>
                <View style={styles.positionRow}>
                  <Text style={styles.position}>{exp.position}</Text>
                  <Text style={styles.dates}>{exp.startDate} - {exp.endDate}</Text>
                </View>
                <FormattedText content={exp.description} />
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
                <FormattedText content={edu.description} />
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