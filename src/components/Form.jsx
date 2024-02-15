// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import { useUrlPosition } from '../hooks/useUrlPosition';
import DatePicker from 'react-datepicker';

import Button from './Button';
import BackButton from './BackButton';
import Message from './Message';
import Spinner from './Spinner';

import styles from './Form.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useCities } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [isLoadingGeocoding, setisLoadingGeocoding] = useState(false);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = useUrlPosition();
  const [emoji, setEmoji] = useState('');
  const [geoCodingError, setGeoCodingError] = useState('');

  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setisLoadingGeocoding(true);
        setGeoCodingError('');
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(
            "That doesn't seems to be a country. Please click at a valid country 🧐",
          );
        console.log(data);
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(data.countryCode);
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setisLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName && date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate('/app/cities');
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng)
    return <Message message="Start by clicking the location on the map 👉" />;

  if (geoCodingError) return <Message message={geoCodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={`${cityName}`}
        />
        <span className={styles.flag}>
          <img
            alt={country}
            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${emoji}.svg`}
            className="img"
          />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">{`When did you go to ${cityName}?`}</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MMM/yyyy"
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">{`Notes about your trip to ${cityName}`}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
