import styles from './CountryItem.module.css';

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <img
          alt={country.country}
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.emoji}.svg`}
          className="img"
        />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
