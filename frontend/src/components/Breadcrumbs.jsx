// import { Link, useLocation } from 'react-router-dom';
// import { useBreadcrumb } from '../Context/BreadcrumbContext';

// function Breadcrumbs() {
//     const { breadcrumbs } = useBreadcrumb();
    
//     const location = useLocation(); // Récupérer l'URL actuelle
//     console.log('location',location)

//     return (
//         <nav style={{
//             borderBottom: '1px solid var(--blue-nav)',
//             margin: '3% 0%',
//             width: '100%',
//             fontWeight: 'bold'
//         }}>
//             {breadcrumbs.map((breadcrumb, index) => {
//                 const isActive = breadcrumb.path === location.pathname; // Vérifie si c'est la page actuelle

//                 return (
//                     // <span key={index}>
//                     //     {index > 0 && ' / '}
//                     //     <Link 
//                     //         to={breadcrumb.path} 
//                     //         state={breadcrumb.state}
//                     //         style={{ fontWeight: isActive ? '500' : 'normal',
//                     //             color:isActive ? 'var(--font-gray)' :'var(--subfont-gray)'
//                     //          }} // Met en gras si actif
//                     //     >
//                     //         {breadcrumb.label}
//                     //     </Link>
//                     // </span>
//                     <span key={index}>
//                     {index > 0 && ' / '}
//                     <span
//                       style={{
//                         fontWeight: isActive ? '500' : 'normal',
//                         color: isActive ? 'var(--font-gray)' : 'var(--subfont-gray)',
//                       }}
//                     >
//                       {breadcrumb.label}
//                     </span>
//                   </span>
//                 );
//             })}
//         </nav>
//     );
// }

// export default Breadcrumbs;

import React from "react";

function Breadcrumbs({ items = [] }) {
  return (
    <nav
      style={{
        borderBottom: "1px solid var(--blue-nav)",
        margin: "3% 0%",
        width: "100%",
        fontWeight: "bold",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          <span
            style={{
              color: "var(--font-gray)",
              fontWeight: index === items.length - 1 ? "600" : "normal",

            }}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
