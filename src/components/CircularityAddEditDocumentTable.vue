<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->


<template>
<div>
  <v-card>
    <v-data-table
      dense  
      :headers='documentsTableHeaders'
      :items='documents'
      hide-default-footer
      item-key="uid"
      v-click-outside="resetDeleteAction"
    >
      <template v-slot:[`item.title`]="{ item }">
        <v-text-field v-model="item.title" hide-details dense single-line autofocus v-if="editDocument.uid === item.uid"></v-text-field>
        <span v-else>{{item.title}}</span>
      </template>
      <template v-slot:[`item.documentDate`]="{ item }">
        {{ formatDate(item.documentDate) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div v-if="editMode">
          <div v-if="editDocument.uid === item.uid">
            <v-icon color="red" class="mr-2" @click="resetEntry()">
              {{mdiWindowClose}}
            </v-icon>
            <v-icon color="green"  @click="saveEntry(item)">
              {{mdiContentSave}}
            </v-icon>
          </div>
          <div v-else>
            <v-icon color="green" class="mr-2" @click="editEntry(item)">
              {{mdiPencil}}
            </v-icon>
            <v-icon :color='confirmDeleteUid == item.uid ? "red" : "primary"' class="mr-2" @click="deleteEntry(item)">
              {{mdiDelete}}
            </v-icon>
            <v-icon color="secondary" @click="download(item)">
              {{mdiDownload}}
            </v-icon>
          </div>
        </div>
        <div v-else>
          <v-icon color="secondary" @click="download(item)">
            {{mdiDownload}}
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </v-card>
  <br>
  <v-row v-if="editMode">
   <v-col cols="9">
    <v-file-input
        label="add document"
        @change="onChangeDocument"
        outlined
        dense
        show-size>
    </v-file-input>
   </v-col>
   <v-col cols="3">
    <v-btn
        block
        color="primary"
        @click="uploadDocument"
        >upload
    </v-btn>
   </v-col>
  </v-row>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapGetters } from 'vuex';

import { mdiWindowClose, mdiContentSave, mdiPencil, mdiDelete, mdiPlus, mdiCheck, mdiUpload, mdiDownload } from '@mdi/js';
import {
  UPLOAD_CIRCULARITY_DOCUMENT,
  UPDATE_CIRCULARITY_DOCUMENT,
  DELETE_CIRCULARITY_DOCUMENT,
  DOWNLOAD_CIRCULARITY_DOCUMENT,
  GET_CURRENT_PROJECT
} from '@/store/project';
import {
  CircularityFileUploadUpdate,
    ProjectFile,
} from '@/store/project/types';

export default Vue.extend({
  name: 'CircularityAddEditDocumentTable',
  data: () => ({
    // icons
    mdiWindowClose,
    mdiContentSave,
    mdiPencil,
    mdiDelete,
    mdiPlus,
    mdiCheck,
    mdiUpload,
    mdiDownload,
    // eddited data
    documentToUpload: null as File | null,
    selectedDocument: {} as ProjectFile,
    confirmDeleteUid: "",
    newDocument:  {
        uid: "-1",
        title: "",
        documentDate:"",
        fileType: ""
    } as ProjectFile,
    editDocument:  {
        uid: "-1",
        title: "",
        documentDate:"",
        fileType: ""
    } as ProjectFile,
    emptyDocument:  {
        uid: "0",
        title: "",
        documentDate:"",
        fileType: ""
    } as ProjectFile,
    documentsTableHeaders: [
      {
        text: 'Title',
        value: 'title',
        sortable: false,
        width: "60%"
      },
      {
        text: 'Date',
        value: 'documentDate',
        sortable: false,
        width: "20%"
      },
      {
        text:'Actions',
        value:'actions',
        sortable: false,
        width: "20%"
      }
    ]
  }),
  methods: {
    addDocument() {
      const newDoc : ProjectFile = Object.assign({}, this.newDocument);
      newDoc.uid += this.documents.length++;
      this.documents.pop();
      this.documents.push(newDoc);
      this.editDocument = Object.assign({}, newDoc);
    },
    editEntry (item: ProjectFile) {
        this.editDocument = Object.assign({}, item);
    },
    resetEntry () {
      this.editDocument = Object.assign({}, this.emptyDocument);
    },
    saveEntry(item: ProjectFile) {
      let hasChanged = false;
      if (item.title != this.editDocument.title) hasChanged=true;
      if (hasChanged) this.updateDocument(item)// dipatch document info patch
      this.resetEntry();
    },
    deleteEntry(item: ProjectFile) {
      if (this.confirmDeleteUid == item.uid) this.deleteDocument(item);
      this.confirmDeleteUid = item.uid;
    },
    onChangeDocument(file: File) {
      if (!!file) {
        this.documentToUpload = file;
      }
    },
    formatDate(date: Date) {
      if (date) return new Date(date).toLocaleDateString();
    },
    resetDeleteAction()
    {
      this.confirmDeleteUid = "";
    },
    async download(item: ProjectFile) {
      const response = await this.$store.dispatch(DOWNLOAD_CIRCULARITY_DOCUMENT, {
        projectId: this.currentProject.id,
        circularityUid: this.parentUid,
        fileUid: item.uid,
        fileName: item.title
      });
    },
    async uploadDocument() {
      const newDocument = await this.$store.dispatch(UPLOAD_CIRCULARITY_DOCUMENT, {
          circularityUid: this.parentUid,
          file: this.documentToUpload,
          title: this.documentToUpload?.name,
          documentDate: new Date()
        } as CircularityFileUploadUpdate,
      );
      if (newDocument) this.documents.push(newDocument);
    },
    async updateDocument(documentToUpdate: ProjectFile) {
      const response = await this.$store.dispatch(UPDATE_CIRCULARITY_DOCUMENT, {
        projectId: this.currentProject.id,
        circularityUid: this.parentUid,
        file: documentToUpdate,
      });
    },
    async deleteDocument(documentToDelete: ProjectFile) {
      const response = await this.$store.dispatch(DELETE_CIRCULARITY_DOCUMENT, {
        projectId: this.currentProject.id,
        circularityUid: this.parentUid,
        fileUid: documentToDelete.uid,
      });
      if(response) {
        const index = this.documents.indexOf(documentToDelete, 0);
        if (index > -1) this.documents.splice(index,1);
      }
    },
  },
  computed: {
    ...mapGetters({
        currentProject: GET_CURRENT_PROJECT
    }),
  },
  props: {
    documents: {
      required:true,
      type: Array as () => ProjectFile[],
      default(){ return []}
    },
    editMode: {
      required:true,
      default:false
    },
    parentUid: {
        required: false,
    }
  }
});
</script>
          