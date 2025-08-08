import { useMemo, useState } from "react";
import axios from "axios";
import type { SearchType } from "../types";
import z from 'zod';

const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
    })
});

export type Weather = z.infer<typeof Weather>;

const initialState: Weather = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0,
    }
};

export default function useWeather() {
    const [weather, setWeather] = useState<Weather>(initialState);

    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const fetchWeather = async (search: SearchType) => {

        const appId = import.meta.env.VITE_API_KEY;

        setLoading(true);

        try {

            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

            const { data } = await axios(geoUrl);

            if (!data[0]) {
                setNotFound(true);
                throw new Error("Clima no encontrado");
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

            const { data: weatherResult } = await axios(weatherUrl);

            const result = Weather.safeParse(weatherResult);

            if (!result.success) {
                throw new Error(result.error.message);
            }

            setWeather(result.data);

        } catch (error) {
            console.error("Error occurred", error);
        } finally {
            setLoading(false);
            setTimeout(() => setNotFound(false), 5000);
        }
    }
    
    const resetState = () => setWeather(initialState);

    const hasWeatherData = useMemo(() => weather.name, [weather]);


    return {
        fetchWeather,
        hasWeatherData,
        loading,
        notFound,
        resetState,
        weather,
        Weather,
    }
}