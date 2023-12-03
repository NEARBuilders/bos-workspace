import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useHashRouterLegacy() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if the URL contains a hash
        if (location.hash) {
            // Extract the path and query string after the hash
            const pathAndQuery = location.hash.substring(1); // remove the '#' character

            // Redirect to the new path
            navigate(pathAndQuery, { replace: true });
        }
    }, [navigate, location]);
}

