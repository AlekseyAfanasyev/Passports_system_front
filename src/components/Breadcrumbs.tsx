import { Link, useLocation } from "react-router-dom";

function Breadcrumbs() {
    const location = useLocation();

    let currentLink = '';

    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map(crumb => {
            currentLink += `/${crumb}`;
            const decodedCrumb = decodeURIComponent(crumb);

            return (
                <div className="crumb" key={crumb}>
                    <Link to={currentLink}>{decodedCrumb}</Link>
                </div>
            );
        });

    return (
        <div className="breadcrumbs">
            {crumbs}
        </div>
    );
}

export default Breadcrumbs;
