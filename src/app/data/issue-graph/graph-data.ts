import { Scalars, Component, GetIssueGraphDataQuery, IssueCategory, ComponentInterface, Issue, IssuePage} from 'src/generated/graphql';
import { DefaultDictionary } from 'typescript-collections';

type LocationId = Scalars['ID'];

export interface GraphData {
  components: Map<LocationId, GraphComponent>;
  interfaces: Map<LocationId, GraphInterface>;
  // graphLocations contains both components and interfaces
  graphLocations: Map<string, GraphLocation>;
  relatedFolders: DefaultDictionary<GraphFolder, GraphFolder[]>;
  linkIssues: GraphIssue[];
}

export class GraphDataFactory {
  /**
   * Removes the counts for issue categories which are filtered. This is a workaround
   * needed because the backend doesn't allow us to only ask for the counts we are interested in.
   * @param graphData the data with the unnecessary counts
   * @param activeCategories the categories corresponding to the activated toggles of the graph component
   */
  static removeFilteredData(graphData: GraphData, activeCategories: IssueCategory[]) {
    for (const location of graphData.graphLocations.values()) {
      location.issues = new Map([...location.issues].filter(([category, count]) => activeCategories.includes(category)));
    }
    return graphData;
  }

  static graphDataFromGQL(data: GetIssueGraphDataQuery): GraphData {
    const components = GraphComponent.mapFromGQL(data.node.components.nodes);
    const interfaces = GraphInterface.mapFromGQL(data.node.interfaces.nodes);
    const graphLocations: Map<string, GraphLocation> = new Map([...components, ...interfaces]);
    const linkIssues = data.node.linkingIssues.nodes.map(gqlIssue => GraphIssue.fromGQL(gqlIssue));
    const relatedFolders = computeRelatedFolders(linkIssues, interfaces);
    return {
      components, interfaces, graphLocations, relatedFolders, linkIssues
    };
  }
}


type GraphFolder = [LocationId, IssueCategory];
type GraphLocation = GraphInterface | GraphComponent;

function computeRelatedFolders(linkIssues: GraphIssue[], interfaces: Map<LocationId, GraphInterface>):
  DefaultDictionary<GraphFolder, GraphFolder[]> {
  let targetFolders: GraphFolder[];
  const relatedFolders: DefaultDictionary<GraphFolder, GraphFolder[]> = new DefaultDictionary<GraphFolder, GraphFolder[]>(() => []);
  for (const issue of linkIssues) {
    const sourceLocationIds = removeOfferingComponents(issue.locations, interfaces);
    const sourceFolders: GraphFolder[] = sourceLocationIds.map(locationId => [locationId, issue.category]);
    targetFolders = [];
    for (const linkedIssue of issue.linksIssues) {
      const targetLocationIds = removeOfferingComponents(linkedIssue.locations, interfaces);
      // @ts-ignore
      targetFolders = targetFolders.concat(targetLocationIds.map(locationId => [locationId, linkedIssue.category]));
    }
    sourceFolders.forEach(folder =>
      relatedFolders.setValue(folder,
        (relatedFolders.getValue(folder).concat(targetFolders))));
  }
  return relatedFolders;
}

/**
 * Remove from locationIds ids of components that offer an interface whoose id is also in locationIds
 */
function removeOfferingComponents(locationIds: string[], interfaces: Map<LocationId, GraphInterface>) {
  const interfaceOfferingComponents: Set<string> = new Set(locationIds.filter(locationId => interfaces.has(locationId)).
    map(interfaceId =>
      interfaces.get(interfaceId).offeredBy
    ));
  return locationIds.filter(id => !interfaceOfferingComponents.has(id));
}


function issueCounts(bugCount: number, featureRequestCount: number, unclassifiedCount: number): Map<IssueCategory, number> {
  return new Map([
    [IssueCategory.Bug, bugCount],
    [IssueCategory.FeatureRequest, featureRequestCount],
    [IssueCategory.Unclassified, unclassifiedCount]
  ]);
}

type GQLInterface = Pick<ComponentInterface, 'id' | 'name'> & {
  bugs?: Pick<IssuePage, 'totalCount'>;
  featureRequests?: Pick<IssuePage, 'totalCount'>;
  unclassified?: Pick<IssuePage, 'totalCount'>;
  consumedBy?: { nodes?: Pick<Component, 'id'>[]; };
  component: Pick<Component, 'id'>;
};

export class GraphInterface {
  id: Scalars['ID'];
  name: string;
  offeredBy: Scalars['ID'];
  consumedBy: Scalars['ID'][];
  issues: Map<IssueCategory, number>;

  static fromGQL(gqlInterface: GQLInterface): GraphInterface {
    const issues = issueCounts(gqlInterface.bugs.totalCount,
      gqlInterface.featureRequests.totalCount,
      gqlInterface.unclassified.totalCount);
    return {
      id: gqlInterface.id,
      name: gqlInterface.name,
      offeredBy: gqlInterface.component.id,
      consumedBy: gqlInterface.consumedBy.nodes.map(component => component.id),
      issues
    };
  }
  static mapFromGQL(gqlInterfaces: GQLInterface[]): Map<LocationId, GraphInterface> {
    return new Map(gqlInterfaces.map(gqlInterface => [gqlInterface.id, GraphInterface.fromGQL(gqlInterface)]));
  }
}


type GQLGraphComponent = Pick<Component, 'name' | 'id'> & {
  bugs?: Pick<IssuePage, 'totalCount'>;
  featureRequests?: Pick<IssuePage, 'totalCount'>;
  unclassified?: Pick<IssuePage, 'totalCount'>;
};


export class GraphComponent {
  name: string;
  id: Scalars['ID'];
  issues: Map<IssueCategory, number>;

  static fromGQL(gqlGraphComponent: GQLGraphComponent): GraphComponent {
    const issues = issueCounts(gqlGraphComponent.bugs.totalCount,
      gqlGraphComponent.featureRequests.totalCount,
      gqlGraphComponent.unclassified.totalCount);
    return {
      id: gqlGraphComponent.id,
      name: gqlGraphComponent.name,
      issues
    };
  }

  static mapFromGQL(gqlGraphComponents: GQLGraphComponent[]): Map<LocationId, GraphComponent> {
    return new Map(gqlGraphComponents.map(gqlComponent => [gqlComponent.id, GraphComponent.fromGQL(gqlComponent)]));
  }
}

type GQLIssue = Pick<Issue, 'id' | 'category'> & {
  locations?: {
    nodes?: (Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>)[];
  };
  linksToIssues?: {
    nodes?: (Pick<Issue, 'id' | 'category'> & { locations?: { nodes?: (Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>)[]; }; })[];
  };
};

class GraphIssue {
  id: Scalars['ID'];
  category: IssueCategory;
  locations: LocationId[];
  linksIssues?: GraphIssue[];

  static fromGQLNoLinks(gqlPartialIssue: Pick<GQLIssue, 'id' | 'category' | 'locations'>) {
    return {
      id: gqlPartialIssue.id,
      category: gqlPartialIssue.category,
      locations: gqlPartialIssue.locations.nodes.map(location => location.id)
    };
  }

  static fromGQL(gqlIssue: GQLIssue): GraphIssue {
    const issue: GraphIssue = this.fromGQLNoLinks(gqlIssue);
    issue.linksIssues = gqlIssue.linksToIssues.nodes.map(gqlPartialIssue => this.fromGQLNoLinks(gqlPartialIssue));
    return issue;
  }

}

