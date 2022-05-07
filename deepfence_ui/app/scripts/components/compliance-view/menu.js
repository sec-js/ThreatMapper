/* eslint-disable */
import CISSummary from './summary-cis';
import NISTKubeMasterSummary from './summary-nist-kube-master';
import NISTKubeSlaveSummary from './summary-nist-kube-slave';
import PCISummary from './summary-pci';
import HIPAASummary from './summary-hipaa';
import StdSecSummary from './summary-standard';
import MissionCriticalClassifiedSummary from './summary-mission-critical';

export const complianceViewMenu = [
  {
    id: 'standard',
    displayName: 'Standard System Security Profile',
    component: StdSecSummary,
    link: '/compliance/standard',
  },
  {
    id: 'cis',
    displayName: 'CIS',
    component: CISSummary,
    link: '/compliance/cis',
  },
  {
    id: 'nist_master',
    displayName: 'NIST Kube Master',
    component: NISTKubeMasterSummary,
    link: '/compliance/nist_master',
  },
  {
    id: 'nist_slave',
    displayName: 'NIST Kube Slave',
    component: NISTKubeSlaveSummary,
    link: '/compliance/nist_slave',
  },
  {
    id: 'pcidss',
    displayName: 'PCI-DSS',
    component: PCISummary,
    link: '/compliance/pcidss',
  },
  {
    id: 'hipaa',
    displayName: 'HIPAA',
    component: HIPAASummary,
    link: '/compliance/hipaa',
  },
  {
    id: 'mission_critical_classified',
    displayName: 'NIST Mission Critical',
    component: MissionCriticalClassifiedSummary,
    link: '/compliance/mission_critical_classified'
  },
];

export const complianceViewMenuIndex = complianceViewMenu.reduce((acc, el) => {
  acc[el.id] = el;
  return acc;
}, {});
