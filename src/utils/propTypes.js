
/*
 * https://github.com/facebook/react/issues/3163#issuecomment-470307646
 */
export const nullable = (subRequirement) => {
  const check = (required, props, key, ...rest) => {
    if (props[key] === null) {
      return null
    }
    const sub = required ? subRequirement.isRequired : subRequirement
    return sub(props, key, ...rest)
  }
  const fn = check.bind(null, false)
  fn.isRequired = check.bind(null, true)
  return fn
}
