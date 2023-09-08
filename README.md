# Digital DeConstruction Frontend 

<img src="./src/assets/banner.jpg" width="50%">

## 1. Introduction
The **Digital DeConstruction Frontend** is a web application designed for end-users  
which need to manage their built asset deconstruction projects.  
In includes several convenient features which help integrate modern technologies such as  
3D point scans, BIM models, tables of component inventories (elements or materials),  
document management, as well as simple graphs. 

The tool was designed to work with REST API data from the backend server application,  
the **Digital DeConstruction Backend**. 

The tool was tested as part of the Digital Deconstruction Interreg project, and designed  
to work with several external applications, which would feed relevant data to the backend  
 application. For more details see the following:
  - [DDC project website](https://vb.nweurope.eu/projects/project-search/digital-deconstruction/)
  - [DDC knowledge website](https://knowledgeplatform.gtb-lab.com/)

## 2. Installation instructions

The environment installation is available [here](./documentation/instructions.md)

## 3. Included frameworks and packages

The project was initially built on the [VUE.js](https://vuejs.org/) framework using   
the [VueCLI](https://cli.vuejs.org/).

The following major libraries and dependencies are included:
 - [vuex](https://vuex.vuejs.org/) - for state management
 - [veutify](https://vuetifyjs.com/en/) - for components design 
 - [forge-vuer](https://github.com/alvpickmans/forge-vuer) - for the Autodesk viewer v7
 - [apex-charts](https://apexcharts.com/) - for basic chart visualisation of data
 - others, described [here](./documentation/instructions.md) 

## 4. Known issues & limitations

As the world of frontend development moves at the speed of light, the initial Vue.js framework  
version, as well as the major components are slowly getting replaced by newer ones. Future  
developers would need to envisage framework upgrades or migrations if they want to stay on top of  
the latest developments. 

The existing project deployed the initial infrastructure multiple language support,   
however only a few pages are available in EN, FR and DE.   
Future developers can use existing methods to quickly translate all the components.

The BIM model viewer from Autodesk was implemented using the Autodesk services API,   
which needs to be setup by each user individually, outside of this application, and relies on data being served from the back-end service.

## 5. Disclaimers

LIST is not held responsible by using this code, please see license.
