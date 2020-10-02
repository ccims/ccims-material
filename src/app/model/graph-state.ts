import { Component, IssuesState, Issue, IssueType, IssueRelationType, GraphComponent } from './state';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import * as Uuid from 'uuid/v5';
import {ISSUE_UUID_NAMESPACE, COMPONENT_INTERFACE_UUID_NAMESPACE, COMPONENT_UUID_NAMESPACE } from './namespace-constants';

const issueTemplate: Issue = {
  id: 'TODO',
  title: '',
  type: IssueType.BUG,
  textBody: '',
  htmlBody: '',
  isOpen: true,
  relatedIssues: [],
  labels: [],
  comments: [],
};


const issueA: Issue = {
  ...issueTemplate,
  id: Uuid('order-service bug', ISSUE_UUID_NAMESPACE),
  title: 'order-service bug',
  textBody: 'problem in accessing shipping service API',
};

const issueB: Issue = {
  ...issueTemplate,
  id: Uuid('order-service feature request', ISSUE_UUID_NAMESPACE),
  title: 'order-service feature request',
  textBody: 'updating to fr of shipping service API',
  type: IssueType.FEATURE_REQUEST,
};

const issueC: Issue = {
  ...issueTemplate,
  id: Uuid('shipping-service-interface bug', ISSUE_UUID_NAMESPACE),
  title: 'shipping-service-interface bug',
  textBody: 'problem in API',
  type: IssueType.FEATURE_REQUEST,
};

const issueD: Issue = {
  ...issueTemplate,
  id: Uuid('shipping-service bug', ISSUE_UUID_NAMESPACE),
  title: 'shipping-service bug',
  textBody: 'some problem within the component',
};

const issueE: Issue = {
  ...issueTemplate,
  id: Uuid('second shipping-service bug', ISSUE_UUID_NAMESPACE),
  title: 'second shipping-service bug',
  textBody: 'some problem within the component',
};

const issueF: Issue = {
  ...issueTemplate,
  id: Uuid('cross-component feature request', ISSUE_UUID_NAMESPACE),
  title: 'cross-component feature request',
  textBody: 'applying to update in another API',
  type: IssueType.BUG,
};

const issueG: Issue = {
  ...issueTemplate,
  id: Uuid('payment-service-interface feature request', ISSUE_UUID_NAMESPACE),
  title: 'payment-service-interface feature request',
  textBody: 'A new feature in this API',
  type: IssueType.FEATURE_REQUEST,
};
const issueH: Issue = {
  ...issueTemplate,
  id: Uuid('payment-service-interface feature', ISSUE_UUID_NAMESPACE),
  title: 'payment-service-interface feature request',
  textBody: 'A new feature in this API',
  type: IssueType.FEATURE_REQUEST,
};

issueA.relatedIssues = [
  {
      relatedIssueId: issueD.id,
      relationType: IssueRelationType.DEPENDS,
  }
];

issueD.relatedIssues = [
  {
      relatedIssueId: issueE.id,
      relationType: IssueRelationType.DEPENDS,
  }
];

issueB.relatedIssues = [
  {
      relatedIssueId: issueG.id,
      relationType: IssueRelationType.DEPENDS,
  }
];
issueH.relatedIssues = [
  {
      relatedIssueId: issueG.id,
      relationType: IssueRelationType.DEPENDS,
  }
];


const compInterfaceUUIDShipping: string = Uuid('shipping-service-interface', COMPONENT_INTERFACE_UUID_NAMESPACE);
const compInterfaceUUIDPayment: string = Uuid('payment-service-interface', COMPONENT_INTERFACE_UUID_NAMESPACE);
const zeroPosition: Point = {x: 0, y: 0};
export const exampleGraph: GraphComponent[] = [
  {
    id: Uuid('order-service', COMPONENT_UUID_NAMESPACE),
    "name": "order-service",
    "description": "",
    "imsId": null,
    "imsRepository": null,
    "owner": null,
    "interfaces": {},
    "issueCounts": {
      "UNCLASSIFIED": 0,
      "BUG": 1,
      "FEATURE_REQUEST": 2
    },
    issues: [issueA.id, issueB.id, issueC.id ],

    "position": zeroPosition,
    "componentRelations": [
      {
        targetId: compInterfaceUUIDShipping,
        "targetType": "interface"
      },
      {
        targetId: compInterfaceUUIDPayment,
        "targetType": "interface"
      }
    ]
  },
  {
    id: Uuid('shipping-service', COMPONENT_UUID_NAMESPACE),
    name: 'shipping-service',
    issues: [issueE.id, issueH.id, issueF.id],
    "description": "",
    "issueCounts": {
      "UNCLASSIFIED": 0,
      "BUG": 3,
      "FEATURE_REQUEST": 1
    },
    "imsId": null,
    "imsRepository": null,
    "owner": null,
    position: zeroPosition,
    interfaces: {
      [compInterfaceUUIDShipping]: {
        id: compInterfaceUUIDShipping,
        interfaceName: "shipping-service-interface",
        position: zeroPosition,
        "issueCounts": {
          "UNCLASSIFIED": 0,
          "BUG": 1,
          "FEATURE_REQUEST": 0
        },
        issues: [issueD.id]
      }
    },
    "componentRelations": [
      {
        targetId: compInterfaceUUIDPayment,
        "targetType": "interface"
      }
    ]
  },
  {
    "id": "7c82f221-4775-50c9-af69-38bfe561c153",
    "name": "payment-service",
    "description": "",
    "imsId": null,
    "imsRepository": null,
    "owner": null,
    issues: [],
    position: zeroPosition,
    "issueCounts": {
      "UNCLASSIFIED": 0,
      "BUG": 0,
      "FEATURE_REQUEST": 1
    },
    "interfaces": {
      [compInterfaceUUIDPayment]: {
        "position": zeroPosition,
        "id": "80fbb377-f87e-5435-86f9-9416e36ae949",
        "interfaceName": "payment-service-interface",
          "issueCounts": {
          "UNCLASSIFIED": 0,
          "BUG": 0,
          "FEATURE_REQUEST": 1
        },
        issues: [issueG.id],
      }
    },
    "componentRelations": []
  }
];

export const issues: IssuesState = {
  [issueA.id]: issueA,
  [issueB.id]: issueB,
  [issueC.id]: issueC,
  [issueD.id]: issueD,
  [issueE.id]: issueE,
  [issueF.id]: issueF,
  [issueG.id]: issueG,
  [issueH.id]: issueH,
};
