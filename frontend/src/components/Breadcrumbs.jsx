import { Link, useLocation } from 'react-router-dom';
import { useBreadcrumb } from '../Context/BreadcrumbContext';

function Breadcrumbs() {
    const { breadcrumbs } = useBreadcrumb();
    
    const location = useLocation(); // Récupérer l'URL actuelle
    console.log(location)

    return (
        <nav style={{
            borderBottom: '1px solid var(--blue-nav)',
            margin: '3% 0%',
            width: '100%',
            fontWeight: 'bold'
        }}>
            {breadcrumbs.map((breadcrumb, index) => {
                const isActive = breadcrumb.path === location.pathname; // Vérifie si c'est la page actuelle

                return (
                    <span key={index}>
                        {index > 0 && ' / '}
                        <Link 
                            to={breadcrumb.path} 
                            style={{ fontWeight: isActive ? '500' : 'normal',
                                color:isActive ? 'var(--font-gray)' :'var(--subfont-gray)'
                             }} // Met en gras si actif
                        >
                            {breadcrumb.label}
                        </Link>
                    </span>
                );
            })}
        </nav>
    );
}

export default Breadcrumbs;
