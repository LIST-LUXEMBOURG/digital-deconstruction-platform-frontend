/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

type ReusePotential = string | number;

export const colorRange = 10;

export interface RbimElement {
  dbIds: number[];
  ifcId: string;
  reusePotential: ReusePotential; // a value between 0 and 1
  reuseGroup: number;
}

export enum BimGroup {
  ReusePotential = 'reuseGroup',
}

export interface GroupedBimElements {
  [key: number]: RbimElement[];
  groupBy: BimGroup;
}

export interface ViewerState {
  ifcIds: [];
  isViewerInitialised: boolean;
  viewerDbids: [];
  selectedDbids: [];
  rbimAllElements: GroupedBimElements;
  rbimSelectedElements: GroupedBimElements;
}

interface IfcReusePotential {
  ifcId: string;
  reusePotential: ReusePotential;
}
export interface ThemingColorPayload {
  viewer3d: Autodesk.Viewing.Viewer3D;
  elements: IfcReusePotential[];
}