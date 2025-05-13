import React, { useEffect, useState } from 'react'
import AddCategorieForm from '../../components/Forms/AddCategorieForm'
import DynamicAddForm from '../../components/Forms/DynamicAddForm'
import api from '../../Api';
import AddSourceForm from '../../components/Forms/AddSourceForm';

function Parametrage() {

  return (
    <div className='flex flex-col'>

      <AddCategorieForm
        title="Gérer les Catégories"
        label="Catégorie"
        label1="Code"
        placeholder="Nom du catégorie"
        options={[
          { label: "Major Process", value: "1" },
          { label: "Sub Process", value: "2" },
        ]}
        onAdd={(newItem) => console.log("Nouvelle catégorie ajoutée:", newItem)} />
        <AddSourceForm
        title="Gérer les Status"
        label="Status"
        label1="entité"
        placeholder="Nom du catégorie"
        options={[
        ]}
        onAdd={(newItem) => console.log("Nouvelle catégorie ajoutée:", newItem)} />

      <DynamicAddForm
        title="Gérer les Couches"
        label="Couches"
        placeholder="Nom de la couche"
        fetchEndpoint="/getlayers" // Endpoint pour récupérer les couches
        createEndpoint="/createlayer" // Endpoint pour ajouter une couche
        deleteEndpoint="/deletelayer"
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
        deleteEndpoint="/deletesource"
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
        deleteEndpoint="/deletetype"
        labelKey='typeName'
        itemKey='type'
        onAdd={(newItem) => console.log("Nouveau type ajoutée:", newItem)}
      />

    </div>
  )
}

export default Parametrage