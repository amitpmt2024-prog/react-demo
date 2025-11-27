import { useEffect, useState } from "react";

const useFetch = (url: string) => {
    const [data,setData] = useState<[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
      useEffect(() => {
            const timeoutId = setTimeout(() => {
                fetch(url).then(res => {
                    if (!res.ok) {
                        throw new Error('Could not fetch response');
                    }
                    return res.json()
                }).then(data => {
                    setData(data);
                    setLoading(false);
                    setError(null);
                }).catch(error => { 
                    setLoading(false);
                    setError(error instanceof Error ? error.message : 'An unknown error occurred')
                     })
            }, 1000);
    
            return () => clearTimeout(timeoutId);
        }, [url]);
    return ({ data, loading, error} );
}
 
export default useFetch;