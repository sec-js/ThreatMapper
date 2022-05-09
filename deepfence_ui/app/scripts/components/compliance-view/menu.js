/* eslint-disable */
import CISSummary from './summary-cis';
import NISTSummary from './summary-nist';
// import NISTKubeSlaveSummary from './summary-nist-kube-slave';
import PCISummary from './summary-pci';
import HIPAASummary from './summary-hipaa';
import GdprSummary from './summary-gdpr';
import Soc2Summary from './summary-soc2';

export const AWSComplianceViewMenu = [
  {
    id: 'cis',
    displayName: 'CIS',
    component: CISSummary,
    link: '/compliance/cis',
  },
  {
    id: 'gdpr',
    displayName: 'GDPR',
    component: GdprSummary,
    link: '/compliance/gdpr',
  },
  {
    id: 'hipaa',
    displayName: 'HIPAA',
    component: HIPAASummary,
    link: '/compliance/hipaa',
  },
  {
    id: 'pci',
    displayName: 'PCI-DSS',
    component: PCISummary,
    link: '/compliance/pci',
  },
  {
    id: 'soc2',
    displayName: 'SOC2',
    component: Soc2Summary,
    link: '/compliance/soc2'
  },
  {
    id: 'nist',
    displayName: 'NIST',
    component: NISTSummary,
    link: '/compliance/nist',
  },
  // {
  //   id: 'nist_slave',
  //   displayName: 'NIST Kube Slave',
  //   component: NISTKubeSlaveSummary,
  //   link: '/compliance/nist_slave',
  // },
  // {
  //   id: 'mission_critical_classified',
  //   displayName: 'NIST Mission Critical',
  //   component: MissionCriticalClassifiedSummary,
  //   link: '/compliance/mission_critical_classified'
  // },
];

export const GCPComplianceViewMenu = [
  {
    id: 'cis',
    displayName: 'CIS',
    component: CISSummary,
    link: '/compliance/cis',
  },
];

export const AzureComplianceViewMenu = [
  {
    id: 'cis',
    displayName: 'CIS',
    component: CISSummary,
    link: '/compliance/cis',
  },
  {
    id: 'hipaa',
    displayName: 'HIPAA',
    component: HIPAASummary,
    link: '/compliance/hipaa',
  },
  {
    id: 'nist',
    displayName: 'NIST',
    component: NISTSummary,
    link: '/compliance/nist',
  },
];

export const complianceViewMenuIndex = AWSComplianceViewMenu.reduce((acc, el) => {
  acc[el.id] = el;
  return acc;
}, {});
