// Covers both CSS Module imports (import styles from '*.module.scss')
// and global side-effect imports (import '*.scss') required by TypeScript 6+.
declare module '*.scss' {
  const styles: { [className: string]: string }
  export default styles
}
