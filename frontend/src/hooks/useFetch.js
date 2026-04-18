import { useState, useEffect } from "react";
import API from "../services/api";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reload, setReload] = useState(0);

    const refetch = () => setReload((prev) => prev + 1);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await API.get(url, { signal: controller.signal });
                setData(res.data);
                setError(null);
            } catch (err) {
                if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        return () => controller.abort();
    }, [url, reload]);

    return { data, loading, error, refetch };
};

export default useFetch;
