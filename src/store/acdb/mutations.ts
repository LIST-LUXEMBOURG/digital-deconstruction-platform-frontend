/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { MutationTree } from 'vuex';
import {state as ACDBState} from "./";
import { AcdbState } from './types';
import { SET_SINGLE_ACDB, REINITIALIZE_ACDB_MODULE, SET_FILTERED_RESOURCES_NAME } from './constants';

export const mutations: MutationTree<AcdbState> = {
    [REINITIALIZE_ACDB_MODULE](state, _: void) {
        Object.assign(state, ACDBState);
    },
    [SET_SINGLE_ACDB](state, {accessType, resourceName, hasAccess, filteringAttributes = []}: {accessType: string, resourceName: string, hasAccess: string, filteringAttributes: string[]}) {
        const right = {
            hasAccess,
            filteringAttributes
        };

        state.acdb[accessType][resourceName] = right;
        Object.assign(state.acdb, state.acdb);
    },
    [SET_FILTERED_RESOURCES_NAME](state, resourcesName) {
        state.resources = resourcesName;
    }
}