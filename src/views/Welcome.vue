<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-img src="@/assets/banner-green.jpg" max-height="300px" id="banner">
          <v-col cols="10" class="align-left mb-12">
            <v-img src="@/assets/logo.png" max-width="150px" id="banner"></v-img>
            <h1>Digital DeConstruction Platform</h1>
          </v-col>
        </v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-row class="justify-center mb-4">
              <v-img
                max-height="200"
                contain
                alt="Intereg North-West Europe Digital Deconstruction"
                src="@/assets/interreg.png"
              />
            </v-row>
          </v-col>
          <v-col cols="10">
            <h1>Welcome to the Digital DeConstruction Platform</h1>
            <h2>Innovative ways supporting a circular economy for the construction industry</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="9" lg="10">
            <p>
              The first European open-source platform designed for building deconstruction.
            </p>
            <p>
              Integrate and manage the latest technologies for deconstruction use cases into a singular platform.
            </p>
            <p>
              Explore the aready integrated modules for 3D scanning, reversible BIM and materials database. 
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-card elevation="2" class="ml-4 mr-4">
              <v-img cover src="@/assets/banner.jpg" >
              </v-img>
              <v-card-title>3D scannning</v-card-title>
              <v-card-text>
                Integrate your externally hosted site point clouds directly into the dashboard. Construct inventories using data from the virtual site.
                <v-divider></v-divider>
              </v-card-text>
              <v-card-subtitle>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-chip  text>Tested by BIM-Y</v-chip>
                  <v-spacer></v-spacer>
                  <v-chip href="https://www.bim-y.com/" target="_blank" color="primary" text>Learn more<v-icon> {{ mdiOpenInNew }} </v-icon></v-chip>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="4" >
            <v-card elevation="2" class="ml-4 mr-4">
              <v-img cover src="@/assets/banner-yellow.jpg" >
              </v-img>
              <v-card-title>Reversible BIM</v-card-title>
              <v-card-text>
                Integrate your design BIM models into the platform, connect it with the inventory and enrich it with reuse properties.
                <v-divider></v-divider>
              </v-card-text>
              <v-card-subtitle>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-chip  text>Tested by GTB-LAB</v-chip>
                  <v-spacer></v-spacer>
                  <v-chip href="https://www.gtb-lab.com/" target="_blank" color="primary" text>Learn more<v-icon> {{ mdiOpenInNew }} </v-icon></v-chip>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card elevation="2" class="ml-4 mr-4">
              <v-img cover src="@/assets/banner-gray.jpg" >
              </v-img>
              <v-card-title>Materials database</v-card-title>
              <v-card-text>
                Integrate with existing market tools which host inventories, to import circularity data and material passports.
                <v-divider></v-divider>
              </v-card-text>
              <v-card-subtitle>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-chip  text>Tested by BLOCK MATERIALS</v-chip>
                  <v-spacer></v-spacer>
                  <v-chip href="https://www.blockmaterials.com/" target="_blank" color="primary" text>Learn more<v-icon> {{ mdiOpenInNew }} </v-icon></v-chip>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-img
            contain
            alt="partnersImg"
            src="@/assets/logobalk-ddc-groot-nieuw.jpg"
          />
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiOpenInNew } from '@mdi/js';
export default Vue.extend({
  name: 'Welcome',
  data() {
    return {
      mdiOpenInNew
    }
  }

});
</script>

<style lang="scss">
#banner {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    display: flex;
    justify-content: center;
  }
}
#banner-title {
  width: 80%;
}
</style>