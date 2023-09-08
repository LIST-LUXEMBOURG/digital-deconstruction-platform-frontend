/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

export interface ProjectsState {
  // project
  currentProject: Project | null;
  currentProjectParticipants: Participant[];
  currentProjectLocations: Location[];
  currentProjectFiles: ProjectFile[];
  currentProject3dScanConfig: Project3dScanConfig;
  allProjects: Project[];
  projectsPicture: ProjectsPicture;
  tabIndex: number;
  // elements
  elements: Element[]; // full list of elements (used for RBIM colors)
  elementsFilter: FilterQuery;
  elementsFilterResponse: ElementsFilterResponse;
  elementsSelection: Element[];
  elementSelected: Element;
  elementsMaterialsReuseSummary: ElementsMaterialsReuseQuantity[];
  // element types
  elementTypes: ElementType[];
  elementTypesFilter: FilterQuery;
  elementTypesFilterResponse: ElementTypesFilterResponse;
  elementTypeSelected: ElementType;
  elementTypesAnalysis: ElementTypesAnalysis;
  // materials
  materialTypes: MaterialType[];
  materialTypesAnalysis: MaterialTypesAnalysis;
  materialTypeSelected: MaterialType;
  // circularites
  circularitySelected: Circularity;
  circularitySelectedDocuments: ProjectFile[];
  aggregatedCircularities: Circularity[];
  analysisCircularityElements: CircularityAnalysis;
  // other
  pointsOfInterest: PointOfInterest[];
  autodeskAccessToken: AutodeskAccessToken;
  classificationSystems: ClassificationSystem[];
  classificationEntries: ClassificationEntry[];
  propertyTypes: PropertyType[];
  inventoryFilterActive: boolean;
}

// --- PROJECTS ---

export interface Project {
  id?: number | null;
  shortName: string | null;
  fullName: string | null;
  description: string | null;
  projectType: string | null;
  footprint?: number | null;
  deconstructionStart?: Date;
  contactInfo?: string | null;
  createdBy?: number | null;
  createdAt?: number | string | null;
  fullAddress?: {
    id?: number | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    stateOrProvince?: string | null;
    zipOrPostalCode?: string | null;
    country?: string | null;
  };
  owner?: {
    id?: number | null;
  }
  picture?: any;
}

export interface ProjectFile {
  uid: string;
  title: string;
  projectId?: number;
  fileUid: string;
  description?: string;
  locationId?: number;
  documentAuthor?: string;
  documentDate?: string;
  uploadedBy: number;
  uploadedAt: string;
  updatedAt: string;
  size: number;
  filePath?: string;
  fileType?: string;
  name?: string;
  originalName?: string;
  streamedImage?: any;
  id: number;
}

export interface ProjectsPicture {
  [projectId: number]: string;
}

// --- PARTICIPANTS ---

export interface Participant {
  userId: number | null;
  projectId?: number | null;
  role: string | null;
}

// --- LOCATIONS ---

export interface Location {
  id?: number | null;
  projectId?: number;
  name: string;
  type: string;
  parentLocationId?: number;
  address?: string;
  coordinate?: string;
  subdivisions?: Location[];
  createdBy?: number;
  createdAt?: Date;
  pointOfInterest?: string;
}

// --- ELEMENT TYPES ---

export interface ElementType {
  uid: string;
  ifcId: string | null;
  ifcType: string | null;
  name: string;
  description: string | null;
  category: string;
  historicalValue: string | null;
  trademark: string | null;
  designer: string | null;
  projectId: number;
  classificationEntries: ClassificationEntry[];
  files?: ProjectFile[];
  circularity: Circularity;
}

export type ElementTypeCreate = Required<
  Pick<ElementType, 'projectId'> & 
  Omit<ElementType, 'uid' | 'files' | 'circularity'>
>;
export type ElementTypeUpdate = Required<
  Pick<ElementType, 'projectId' | 'uid'> & 
  Omit<ElementType, 'files' | 'circularity'>
>;
export type ElementTypeDelete = Required<
  Pick<ElementType, 'uid' | 'projectId'>
>;

export interface ElementTypeFileUpload {
  projectId: number;
  elementTypeUid: string;
  file: File;
  title: string;
  description?: string;
  documentAuthor?: string;
  documentDate?: Date;
}

export interface ElementTypeFileDownloadDelete {
  projectId: number;
  elementTypeUid: string;
  document: ProjectFile;
}

export interface ElementTypesAnalysis {
  types: ElementTypeAnalysis[];
  count: number;
  decisionBackfillingCount: number;
  decisionRecyclingCount: number;
  decisionReuseCount: number;
  decisionUndefinedCount: number;
  potentialBackfillingCount: number;
  potentialRecyclingCount: number;
  potentialReuseCount: number;
  potentialUndefinedCount: number;
}

export type ElementTypeAnalysis = ElementType & { 
  count: number,
  averageReusePotential: number, 
  minReusePotential: number, 
  maxReusePotential: number  
};

export type ElementTypesFilterResponse = {
  data: ElementType[];
  count: number;
  totalCount: number;
}

// --- CLASSIFICATIONS ---

export interface ClassificationEntry {
  id: number | null;
  code: string | null;
  label: string | null;
}

export interface ClassificationEntriesResponse {
  data: ClassificationEntry[];
  count: number;
  totalCount: number;
}

export interface ClassificationSystem {
  id: number | null;
  name: string | null;
  description: string | null;
  children: ClassificationSystem[];
}

export interface ClassificationEntryQuery {
  size: number;
  systemId: number;
  label: string;
  property: string;
  direction: string;
}

// --- MATERIAL TYPES ---

export interface MaterialType {
  uid: string;
  name: string;
  description: string | null;
  category: string;
  isHazard: boolean;
  projectId: number;
  circularity?: Circularity;
}

export type MaterialTypeCreate = Required<
  Pick<MaterialType, 'projectId'> &
  Omit<MaterialType, 'uid' | 'circularity'>
>;

export type MaterialTypeUpdate = Required<
  Pick<MaterialType, 'projectId' | 'uid'> &
  Omit<MaterialType, 'circularity'>
>;

export type MaterialTypeDelete = Required<
  Pick<ElementType, 'uid' | 'projectId'>
>;

export interface MaterialTypesAnalysis {
  materials: MaterialTypeAnalysis[],
  count: number;
  overallVolume: number;
  overallMass: number;
}

export type MaterialTypeAnalysis = MaterialType & {
  count: number;
  totalVolume: number;
  totalMass: number;
};

export interface Material {
  uid: string;
  materialType: MaterialType;
  mass: number;
  volume: number;
}

// --- ELEMENTS ---

export type Element = {
  uid: string;
  projectId: number;
  ifcId: string;
  revitId: string;
  name: string;
  description: string;
  surfaceDamage: string;
  reusePotential: string;
  reuseDecision: string;
  hazardAssessment: string;
  hazardAssessmentStatus: string;
  elementType: ElementType;
  materials: Material[];
  properties: PhysicalProperty[];
  circularities: Circularity[];
}

export type ElementCreate = Required<
  Pick<Element, 'name' | 'projectId'> &
  Omit<Element, 'uid'>
>;

export type ElementUpdate = Required<
  Pick<Element, 'projectId' | 'uid'> & 
  Omit<Element, 'files' | 'circularity'>
>;

export type ElementDelete = Required<
  Pick<Element, 'uid' | 'projectId'>
>;

export type ElementsFilterResponse = {
  data: Element[];
  count: number;
  totalCount: number;
}

export type ElementsMaterialsReuseQuantity = {
  projectId: number;
  reuseDecision: string;
  count: number;
  totalVolume: number;
  totalMass: number;
}

// INVENTORY FILTERS

export type FilterQuery = {
  size: number,
  offset: number,
  selects: FilterQuerySelect[],
  conditions: FilterQueryCondition[],
}

export type FilterQuerySelect = {
  isActive: boolean,
  field: string,
  order: 'ASC' | 'DESC' | ''
}

export type FilterQueryCondition = {
  isActive: boolean,
  field: string,
  expression: FilterQueryConditionExpression
}

export type FilterQueryConditionExpression = {
  value: string | number,
  operator: 'LOWER_OR_EQUAL' 
  | 'GREATER_OR_EQUAL' 
  | 'EQUAL'
  | 'LIKE'
  | 'NOT_LIKE'
  | ''
}

// --- PROPERTTIES ---

export type PhysicalProperty = {
  uid: string;
  propertyType: PropertyType;
  propertyUnit: PropertyUnit;
  value: string;
}

export type PropertyType = {
  id: number;
  isNumeric: boolean;
  name: string;
  propertyUnits: PropertyUnit[];
}

export type PropertyUnit = {
  id: number;
  name: string;
  symbol: string;
  multiplier: number;
}

// --- CIRCULARITIES ---

export type Circularity = {
  uid: string;
  projectId: string;
  marketValue: number;
  savingsCO2: number;
  socialBalance: number;
  documents: ProjectFile[];
  hasDocuments?: boolean;
  origin?: string;
}

export type CircularityCreate = {
  isAttachMaterialType: boolean;
  isAttachElementType: boolean;
  isAttachElement: boolean;
  attachId: string;
  circularity: Circularity;
}

export type CircularityUpdate = Required<
  Omit<Circularity, 'projectId' | 'documents' | 'hasDocuments' | 'origin'>
>;

export type CircularityDelete = Required<
  Pick<Circularity, 'uid'>
>;

export type CircularityFileUploadUpdate = {
  circularityUid: string;
  file: File;
  title: string;
  documentDate?: Date;
}

export interface CircularityAnalysis {
  results: CircularityResultElement[]
}

export interface CircularityResultElement {
  marketValue: number;
  savingsCO2: number;
  socialBalance: number;
  elementUid: number;
  elementName: string;
}

// --- OTHER ---

export interface PointOfInterest {
  uid: string | null;
  projectId: string | null;
  elementUid: string;
  locationId: number;
  name: string;
  description: string;
  weblink: string;
}

export interface Project3dScanConfig {
  id: number | null;
  scanUrl: string | null;
  projectId: number | null;
}

export interface AutodeskAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  valid_until?: string | number;
  zone?: string;
}


// --- ENUMS ---

export enum ReuseDecision {
  BACKFILLING = 'backfilling',
  RECYCLING = 'recycling',
  REUSE = 'reuse',
  UNDEFINED = 'undefined',
}

export enum SurfaceDamage {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum HazardAssessment {
  NO_HAZARD = 'no_hazard',
  CONNECTION_ONLY = 'connection_only',
  SURFACE_ONLY = 'surface_only',
  OVERALL = 'overall',
}

export enum HazardAssessmentStatus {
  REQUESTED = 'requested',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export enum ProjectTab {
  Detail = 0,
  Participants = 1,
  Locations = 2,
  Documentation = 3,
  Scan = 4,
  Model = 5,
  Inventory = 6,
  Analysis = 7
}