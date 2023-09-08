/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

export interface AcdbState {
  acdb: AccessControlDataBase;
  resources: any[] | null;
}

export interface AccessControlDataBase {
  [id: string]: any;
  create: any;
  read: any;
  update: any;
  delete: any;
}

export interface AccessControlRule {
  accessType: string;
  resourceName: string;
}

export interface AccessControlResult {
  hasAccess: boolean;
  filteringAttributes: string[];
}

export interface GetAccessControl {
  (accessType: string, resourceName: string): AccessControlResult;
}
