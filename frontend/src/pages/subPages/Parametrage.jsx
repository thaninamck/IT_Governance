import React from 'react'
import AddCategorieForm from '../../components/Forms/AddCategorieForm'
import DynamicAddForm from '../../components/Forms/DynamicAddForm'

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
  options={[
    { label: "OS", value: "1" },
    { label: "APP", value: "2" },
    { label: "DB", value: "3" }
  ]} 
  onAdd={(newItem) => console.log("Nouvelle couche ajoutée:", newItem)} 
/>

<DynamicAddForm 
  title="Gérer les Source" 
  label="Source" 
  placeholder="Nom de la Source" 
  options={[
    { label: "ISO 27001", value: "1" },
    { label: "ITGC", value: "2" },
    { label: "Mazars", value: "3" }
  ]} 
  onAdd={(newItem) => console.log("Nouvelle source ajoutée:", newItem)} 
/>
<DynamicAddForm 
  title="Gérer les Types du controle" 
  label="Type" 
  placeholder="Nom du Type" 
  options={[
    { label: "Préventif", value: "1" },
    { label: "Détectif", value: "2" },
  ]} 
  onAdd={(newItem) => console.log("Nouveau type ajoutée:", newItem)} 
/>

        </div>
  )
}

export default Parametrage