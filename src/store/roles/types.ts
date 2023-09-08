/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

export interface RolesState {
  roles: Role[];
}

export interface Role {
  id: number;
  longName: string;
  description: string;
}

export interface UpdateUserRoles {
  roles: string[];
  user: {
    roles: Role[];
    id: number;
  };
}
