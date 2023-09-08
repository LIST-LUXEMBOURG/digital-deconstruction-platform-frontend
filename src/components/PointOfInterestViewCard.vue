<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card :height='height'>
        <v-card-title justify-space-between>Position
            <v-col align="right" cols="5" offset="-1">
                <v-btn class="ml-auto" fab dark small :href="poi.weblink" target="_blank">
                    <v-icon>{{ mdiRemote }}</v-icon>
                </v-btn>
                Scan
            </v-col>
            <v-col align="right" cols="5" offset="-1">
                <v-btn class="ml-auto" fab dark small>
                    <v-icon>{{ mdiRotate3d }}</v-icon>
                </v-btn>
                BIM
            </v-col>
        </v-card-title>
        <v-img v-if=poi.image :src=poi.image height="275px">
            <v-chip dark> {{ poi.name }} </v-chip>
        </v-img>
        <v-img v-else :src=ddcBanner height="275px">
            <v-chip dark> {{ poi.name }} </v-chip>
        </v-img>
        <v-card-title>
            <v-col cols="6">
                <b>Description</b> <br> {{ poi.description }}<br>
            </v-col>
            <v-col cols="6">
                <b>Location</b> <br> {{ poi.locationId }}<br>
            </v-col>
        </v-card-title>
    </v-card>
</template>
<script lang="ts">

import Vue from 'vue';
import { mdiQrcode, mdiRemote, mdiRotate3d} from '@mdi/js';
import { PointOfInterest } from '@/store/project/types';
import ddcBanner from "@/assets/banner.jpg";

export default Vue.extend({
  name: 'PointOfInterestViewCard',
  props:{
    poi: {
      required:true,
      type: Object as () => PointOfInterest,
      default(){ return {} as PointOfInterest }
    },
    height: {
        required: false,
        default: 500
    }
  },
  data: () => ({
    // icons
    mdiQrcode,
    mdiRemote,
    mdiRotate3d,
    ddcBanner
  })
});
</script>