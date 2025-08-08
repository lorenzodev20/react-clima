import { useState, type ChangeEvent, type FormEvent } from "react";
import { countries } from "../../data/countries";
import styles from "./Form.module.css";
import type { SearchType } from "../../types";
import Alert from "../Alert/Alert";
import useWeather from "../../hooks/useWeather";

type FormProps = {
    fetchWeather: (search: SearchType) => Promise<void>
}

export default function Form({ fetchWeather }: Readonly<FormProps>) {

    const [search, setSearch] = useState<SearchType>({
        city: '',
        country: ''
    });

    const [alert, setAlert] = useState('');

    const { resetState } = useWeather();

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        resetState();
        
        if (Object.values(search).includes('')) {
            console.log('Hay campos vacíos ...')
            setAlert('Los campos son obligatorios')
            setTimeout(() => {
                setAlert('')
            }, 5000);
        }

        fetchWeather(search);
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            {alert && <Alert>{alert}</Alert>}
            <div className={styles.field}>
                <label htmlFor="city">Ciudad: </label>
                <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Ciudad"
                    onChange={handleChange}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="country">Ciudad: </label>
                <select
                    id="country"
                    name="country"
                    onChange={handleChange}
                >
                    <option value=""> --Seleccione un País -- </option>
                    {countries.map(country => (
                        <option
                            key={country.code}
                            value={country.code}
                        >{country.name}</option>
                    ))}
                </select>
            </div>
            <input className={styles.submit} type="submit" value="Consultar clima" />
        </form>
    )
}
