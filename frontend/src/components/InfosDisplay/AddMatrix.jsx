import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Matrix from '../workPlan/Matrix';

function AddMatrix({ userRole,missionId }) {
  
  const data1 = {
    applications: [
      {
        id: "app1",
        description: "USSD",
        layers: [
          {
            id: "l1",
            name: "OS",
            risks: [
              {
                id: "1",
                nom: "SDLC requirements are not exist or are not conducted.",
                description:
                  "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                owner: "sisi",
                controls: [
                  {
                    id: "4",
                    description:
                      "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                    majorProcess: "Technical",
                    subProcess: "Access control",
                    type:"detectif",
                    testScript:
                      "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                    owner: "titi",
                  },
                ],
              },
            ],
          },
          {
            id: "l1",
            name: "DB",
            risks: [
              {
                id: "2",
                nom: "SDLC1 requirements are not exist or are not conducted.",
                description:
                  "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                owner: "TEST",
                controls: [
                  {
                    id: "4",
                    description:
                      "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                    majorProcess: "Technical",
                    subProcess: "Access control",
                    type:"detectif",
                    testScript:
                      "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                    owner: "mimi",
                  },
                ],
              },
            ],
          },

        ],
        owner: "",
      },

      {
        id: "app2",
        description: "New SNOC",
        layers: [
          {
            id: "l1",
            name: "app",
            risks: [
              {
                id: "5",
                nom: "SDLCppppppp requirements are not exist or are not conducted.",
                description:
                  "ttttttttttttttttt ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                owner: "sisi 3",
                controls: [
                  {
                    id: "1",
                    description:
                      "Duties 212and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                    majorProcess: "Technical",
                    subProcess: "Access control",
                    type:"detectif",
                    testScript:
                      "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                    owner: "titi",
                  },
                ],
              },
            ],
          },
          {
            id: "l4",
            name: "DB",
            risks: [
              {
                id: "2",
                nom: "SDLC1 requirements are not exist or are not conducted.",
                description:
                  "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                owner: "TEST",
                controls: [
                  {
                    id: "8",
                    description:
                      "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                    majorProcess: "Technical",
                    subProcess: "Access control",
                    type:"correctif",
                    testScript:
                      "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                    owner: "mimi",
                  },
                ],
              },
            ],
          },
          {
            id: "3",
            name: "OS",
            risks: [
              {
                id: "6",
                nom: " requirements are not exist or are not conducted.",
                description:
                  "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                owner: "sisi 3",
                controls: [
                  {
                    id: "9",
                    description:
                      "Duties  of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                    majorProcess: "Technical",
                    subProcess: "Access control",
                    type:"detectif",
                    testScript:
                      "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                    owner: "AAA",
                  },
                ],
              },
            ],
          },

        ],
        owner: "",
      },
    ]

  };

  const navigate = useNavigate()
  const handleAddMatrix = () => {
    navigate(`/missions/${missionId}/Workplan`);
  }

  const [controleListe, setControleListe] = useState(data1);
  const handleRowClick = (rowData) => {
    console.log('Détails du contrôle sélectionné:', rowData);
  };

  return (
    <div className="p-4 mb-1">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-[var(--blue-menu)] w-5 h-5" />
        <h2 className="text-l font-semibold text-[var(--blue-menu)]">Scope Controle</h2>
        <hr className="flex-grow border-t border-[var(--blue-menu)]" />
      </div>



      <div className="pl-6">
        {controleListe && controleListe.applications && controleListe.applications.length > 0 ?

          <>
            {(userRole === 'manager' || userRole === 'admin') &&
              <div className='flex justify-end pr-5'>
                <button
                  onClick={handleAddMatrix}
                  className="px-4 py-2 border-none bg-[var(--blue-menu)] text-white text-sm font-medium rounded"
                >
                  Modifier
                </button>
              </div>}
            <Matrix data={controleListe} userRole={userRole} onRowClick={handleRowClick} />
          </>
          :
          <div className='flex flex-row items-center gap-4 pl-6'>
            <p className="text-[var(--status-gray)] text-s">
              Aucune matrice ajoutée pour le moment</p>
            {(userRole === 'manager' || userRole === 'admin') &&
              <button
                onClick={handleAddMatrix}
                className="px-4 py-2 border-none bg-[var(--blue-menu)] text-white text-sm font-medium rounded"
              >
                Ajouter
              </button>
            }
          </div>


        }
      </div>
    </div>
  )
}

export default AddMatrix