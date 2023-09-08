<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card :height='height'>
        <v-carousel :continuous="true" hide-delimiter-background >
          <div v-if="elementImages && elementImages.length > 0">
             <v-carousel-item v-for="(image) in elementImages" :key="image.uid">              
                <v-img v-if="image.streamedImage" :min-height='height' :src="image.streamedImage.src">
                    <v-chip dark> {{ image.title }} </v-chip>
                    <v-chip dark> {{ image.description ? image.description : "no description" }} </v-chip>
                    <v-chip dark> {{ image.documentDate ? image.documentDate : "no date" }} </v-chip>
                </v-img>
            </v-carousel-item>
          </div>
          <div v-if="typeImages && typeImages.length > 0">
             <v-carousel-item v-for="(image) in typeImages" :key="image.uid">              
                <v-img v-if="image.streamedImage" :min-height='height' :src="image.streamedImage.src">
                    <v-chip dark> {{ image.title }} </v-chip>
                    <v-chip dark> {{ image.description ? image.description : "no description" }} </v-chip>
                    <v-chip dark> {{ image.documentDate ? image.documentDate : "no date" }} </v-chip>
                </v-img>
            </v-carousel-item>
          </div>
          <div v-else>
            <v-carousel-item v-for="(imageUrl, i) in placeHolderImages" :key="i">
                <v-img  :min-height='height' :src="getSampleImage(i)">
                    <v-chip dark> Element </v-chip>
                </v-img>
            </v-carousel-item>
          </div>
        </v-carousel>
    </v-card>
</template>

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'ElementViewImageCarousel',
  data: () => ({
  }),
  methods: {
    getSampleImage(index: number) {
      return this.placeHolderImages[index];
    }
  },
  props: {
    elementImages: {
      required:false,
      default: []
    },
    typeImages: {
      required:false,
      default: []
    },
    placeHolderImages: {
      required:false,
      default: []
    },
    height: {
        required: false,
        default: 500
    }
  }
});
</script>
          