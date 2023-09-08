/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

import {
  PropertyType,
  ClassificationEntryQuery
} from '@/store/project';
import { HttpClientOptions } from '../@ListSOA/vue-http';
  import {
    GenericResponse,
    getToken,
    Query,
    searchParamsBuilder,
  } from './index';
  
  const core: HttpClientOptions = {
    name: 'core',
    domain: `/core`,
    options: { token: getToken(sessionStorage, 'vuex', 'authModule.auth') },
  
    // get all ClassificationSystems
    getClassificationSystems() {
      let url = `${this.domain}/classification-systems`;
  
      return fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.options.token,
        },
      }).then(GenericResponse);
    },

    // get Classification entries from a System
    getClassificationEntries(classificationEntryQuery: ClassificationEntryQuery) {
      let url = `${this.domain}/classification-entries`;
      if (!!classificationEntryQuery) url = searchParamsBuilder(url, classificationEntryQuery);
  
      return fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.options.token,
        },
      }).then(GenericResponse);
    },

    // get all properties
    getPropertyTypes() {
      let url = `${this.domain}/property-types`;
  
      return fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.options.token,
        },
      }).then(GenericResponse);
    },

    postPropertyTypes(propertyType: PropertyType) {
      const { ...body } = propertyType;
      let url = `${this.domain}/property-types`;

      return fetch(url, {
        method: 'POST',
        headers: {
          Authorization: this.options.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(GenericResponse);
    },

  };
  
  export default core;
  