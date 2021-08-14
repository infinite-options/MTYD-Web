import styles from "./editMeal.module.css";

function ToggleSwitch({ ...props }) {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={props.active}
        onChange={props.handleChange}
      ></input>
      <span className={styles.slider}></span>
    </label>
  );
}
export default ToggleSwitch;
