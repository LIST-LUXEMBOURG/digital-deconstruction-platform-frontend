<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->
 
<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-img src="@/assets/banner-green.jpg" max-height="300px" id="banner">
        <div class="text-h4" id="banner-title">
          About the Digital Deconstruction project
        </div>
      </v-img>
    </v-row>
    <v-row>
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-row class="justify-center">
              <v-img
                max-height="200"
                contain
                alt="Intereg North-West Europe Digital Deconstruction"
                src="@/assets/interreg.png"
              />
            </v-row>
          </v-col>
          <v-col cols="10">
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="9" lg="10">
            <h3>Introduction and Scope</h3>
            <p>
              Digital Deconstruction (DDC) is an innovative Interreg North West
              Europe project in which smart services are developed to facilitate 
              a circular economy in the construction sector.
            </p>
            <p>
              The project was aimed to develop a novel digital decision support
              platform that integrates several new technologies, such as 3D scanning, Building
              Information Modelling, existing buildings materials databases, or blockchain.
              The support of such as system was estimated to contribute to more sustainable 
              deconstruction and reuse strategies for buildings, due to higher quality and
              integration of information. Creating an information cycle between design, construction
              and demolition was also considered using material passports
            </p>
            <h3>Project outline</h3>
            <p>
              Digital Deconstruction partners from The Netherlands, Belgium,
              Luxembourg and France monitored several pilot sites for deconstruction, where
              the technologies mentioned above were tested and improved.
              The integration of these tools within one platform was set out to deliver:
            </p>
            <ol>
              <li>
                An integrated platform at TRL7, to be made accessible​ to
                companies in IT, engineering, construction & real estate sector​
                as an open-source software package for further development and​
                integration to market-ready products and services.
              </li>
              <li>
                A transnational network of Regional Innovation Hubs (RIH) that​
                support the optimization, validation and roll-out of DDC
                solutions. ​
              </li>
              <li>
                An interactive DDC Navigator supporting the use​
                and further adaptation of DDC tools.
              </li>
            </ol>
            <h3>Platform development</h3>
            <p>
              The DDC platform was designed as a two-tier software (backend, frontend),
              with additional services provided by external module providers. The platform
              code is open-source available.
            </p>
            <p>
              Further information is available on the links below.
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-card elevation="2">
              <v-card-title>DDC Website</v-card-title>
              <v-card-text>
                See the Digital Deconstruction official web page here. 
                <v-divider></v-divider>
              </v-card-text>
              <v-card-subtitle>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-chip href="https://vb.nweurope.eu/projects/project-search/digital-deconstruction/" target="_blank" color="primary" text>Learn more<v-icon> {{ mdiOpenInNew }} </v-icon></v-chip>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="3" >
            <v-card elevation="2">
              <v-card-title>DDC Navigator</v-card-title>
              <v-card-text>
                Learn about pilots, tested technologies and the platform here.
                <v-divider></v-divider>
              </v-card-text>
              <v-card-subtitle>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-chip href="https://knowledgeplatform.gtb-lab.com/" target="_blank" color="primary" text>Learn more<v-icon> {{ mdiOpenInNew }} </v-icon></v-chip>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card elevation="2">
              <v-card-title>DDC Github</v-card-title>
              <v-card-text>
                Find the DDC platform software code here.
                <v-divider></v-divider>
              </v-card-text>
              <v-card-subtitle>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-chip href="https://github.com/LIST-LUXEMBOURG" target="_blank" color="primary" text>Learn more<v-icon> {{ mdiOpenInNew }} </v-icon></v-chip>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue';
import { mdiOpenInNew } from '@mdi/js';
export default Vue.extend({
  name: 'About',
  data() {
    return {
      mdiOpenInNew
    }
  }
});

</script>
