import React, { useEffect, useState } from 'react'
import AddCategorieForm from '../../components/Forms/AddCategorieForm'
import DynamicAddForm from '../../components/Forms/DynamicAddForm'
import api from '../../Api';

function Parametrage() {

  return (
    <div className='flex flex-col'>
     
        <AddCategorieForm
         title="Gérer les Catégories" 
         label="Catégorie" 
         placeholder="Nom du catégorie" 
         options={[
           { label: "Major Process", value: "1" },
           { label: "Sub Process", value: "2" },
         ]} 
         onAdd={(newItem) => console.log("Nouvelle catégorie ajoutée:", newItem)}  />
          <DynamicAddForm
        title="Gérer les Couches"
        label="Couches"
        placeholder="Nom de la couche"
        fetchEndpoint="/getlayers" // Endpoint pour récupérer les couches
        createEndpoint="/createlayer" // Endpoint pour ajouter une couche
        labelKey='layerName'
        itemKey='layer'
        onAdd={(newItem) => console.log("Nouvelle couche ajoutée:", newItem)}
      />

<DynamicAddForm 
  title="Gérer les Source" 
  label="Source" 
  placeholder="Nom de la Source" 
  fetchEndpoint="/getsources"
  createEndpoint="/createsource"
  labelKey='sourceName'
  itemKey='source'
  onAdd={(newItem) => console.log("Nouvelle source ajoutée:", newItem)} 
/>
<DynamicAddForm 
  title="Gérer les Types du controle" 
  label="Type" 
  placeholder="Nom du Type" 
  fetchEndpoint="/getctrltypes"
  createEndpoint="/createctrltype"
  labelKey='typeName'
  itemKey='type'
  onAdd={(newItem) => console.log("Nouveau type ajoutée:", newItem)} 
/>

        </div>
  )
}

export default Parametrage